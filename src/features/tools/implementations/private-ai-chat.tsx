"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { cn } from "@/lib/utils/cn";
import { fitHistory, HISTORY_TOKENS, REPLY_TOKENS, SYSTEM_PROMPT, type ChatTurn } from "@/features/ai/logic/chat";
import {
  exportModel,
  FILE_EXTENSION,
  importModel,
  ModelFileError,
  modelFileName,
} from "@/features/ai/logic/model-file";
import { chatModels, defaultChatModel, formatMegabytes, getChatModel, type ChatModel } from "@/features/ai/models";
import { ChatScreen } from "./private-ai-chat-screen";

/**
 * Private AI chat, running on the visitor's own device.
 *
 * Two screens. This one sets the model up: pick one, download it (or load a model
 * file saved earlier), and manage what is stored. Once a model is running, the chat
 * opens full screen (`ChatScreen`), like the big assistants' apps.
 *
 * WebLLM runs the model on the graphics chip through WebGPU, inside a dedicated
 * worker. The page downloads nothing until the visitor asks, and the size is shown
 * first. The browser keeps the model in this site's storage; the visitor can also
 * save it as one file on their device (on a phone, the Downloads folder) and load it
 * back without the internet. Imported files are checked part by part against the
 * official fingerprints (`features/ai/logic/model-file.ts`).
 *
 * Messages exist only in memory. They are never stored and never leave the page
 * except to the worker running the model.
 */

type Support = { state: "checking" } | { state: "unsupported"; reason: string } | { state: "ready" };

type Engine =
  | { state: "idle" }
  | { state: "loading"; modelId: string; progress: number; text: string }
  | { state: "ready"; modelId: string }
  | { state: "error"; message: string };

type FileTask =
  | { state: "idle" }
  | { state: "saving"; modelId: string }
  | { state: "importing"; progress: number; name: string }
  | { state: "done"; message: string }
  | { state: "error"; message: string };

type Offline = "unknown" | "unavailable" | "preparing" | "ready" | "failed";

/** The offline service worker sits next to this page and controls only it. */
function offlineScope(): { scope: string; script: string } {
  const scope = location.pathname.replace(/index\.html$/, "").replace(/\/?$/, "/");
  return { scope, script: `${scope}sw.js` };
}

interface StorageInfo {
  persisted: boolean | null;
  usageMB: number | null;
}

interface GpuNavigator {
  gpu?: { requestAdapter(): Promise<object | null> };
}

const WEBLLM_CACHE_PREFIX = "webllm";

function explainError(error: unknown): string {
  const text = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  if (/quota/i.test(text)) {
    return "Your browser ran out of storage space for this site. Free up space on the device, or delete another saved model below, and try again.";
  }
  if (/fetch|network|load failed/i.test(text)) {
    return "The download was interrupted. Check your connection and press Download again: parts that finished are kept, so it carries on where it stopped.";
  }
  if (/device.*lost|out of memory|OOM|allocation/i.test(text)) {
    return "Your graphics chip ran out of memory. Close other tabs or apps, or choose a smaller model.";
  }
  if (/shader-f16|feature/i.test(text)) {
    return "Your graphics chip does not support a feature this model needs. Try SmolLM2 360M, which needs the least.";
  }
  return "The model could not be started on this device. A smaller model may work; otherwise the free AI finder lists options that run elsewhere.";
}

export function PrivateAiChat() {
  const [support, setSupport] = useState<Support>({ state: "checking" });
  const [selectedId, setSelectedId] = useState(defaultChatModel.id);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [engine, setEngine] = useState<Engine>({ state: "idle" });
  const [storage, setStorage] = useState<StorageInfo>({ persisted: null, usageMB: null });
  const [fileTask, setFileTask] = useState<FileTask>({ state: "idle" });
  const [offline, setOffline] = useState<Offline>("unknown");
  const [online, setOnline] = useState(true);

  const [chatOpen, setChatOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [dropped, setDropped] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const engineRef = useRef<WebWorkerMLCEngine | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const fileInputId = useId();

  const selected: ChatModel = getChatModel(selectedId) ?? defaultChatModel;
  const loadedModel = engine.state === "ready" ? getChatModel(engine.modelId) : undefined;
  const generating = draft !== null;
  const fileBusy = fileTask.state === "saving" || fileTask.state === "importing";

  /* ------------------------------------------------- what is already saved */
  const refreshStorage = useCallback(async (loadLibrary: boolean) => {
    try {
      const estimate = await navigator.storage?.estimate?.();
      const persisted = (await navigator.storage?.persisted?.()) ?? null;
      setStorage({ persisted, usageMB: estimate?.usage != null ? estimate.usage / 1e6 : null });
    } catch {
      // Storage estimates are informational; nothing depends on them.
    }

    if (!("caches" in window)) return;
    try {
      // Only load the WebLLM library if this browser has WebLLM files saved, so a
      // first visit downloads nothing extra.
      const keys = await caches.keys();
      if (!loadLibrary && !keys.some((key) => key.startsWith(WEBLLM_CACHE_PREFIX))) {
        setSaved({});
        return;
      }
      const webllm = await import("@mlc-ai/web-llm");
      const entries = await Promise.all(
        chatModels.map(async (model) => [model.id, await webllm.hasModelInCache(model.id)] as const),
      );
      setSaved(Object.fromEntries(entries));
      // Prefer a model that is already on the device, so the main button starts it
      // rather than offering a download (which matters most when offline).
      const firstSaved = entries.find(([, isSaved]) => isSaved)?.[0];
      if (firstSaved) {
        setSelectedId((current) => (entries.some(([id, isSaved]) => id === current && isSaved) ? current : firstSaved));
      }
    } catch {
      setSaved({});
    }
  }, []);

  /* ------------------------------------------------------------ offline */
  /**
   * Installs the page's offline copy (scripts/offline-chat.mjs). Only called once a
   * model is saved, so visitors who never use the chat never download it. Not
   * available under `next dev`, which serves no service worker.
   */
  const enableOffline = useCallback(async () => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      setOffline("unavailable");
      return;
    }
    try {
      setOffline((current) => (current === "ready" ? current : "preparing"));
      const { scope, script } = offlineScope();
      const registration = await navigator.serviceWorker.register(script, { scope });
      const worker = registration.installing ?? registration.waiting;
      if (worker) {
        await new Promise<void>((done) => {
          const check = () => {
            if (worker.state === "activated" || worker.state === "redundant") done();
          };
          worker.addEventListener("statechange", check);
          check();
        });
      }
      setOffline(registration.active ? "ready" : "failed");
    } catch {
      setOffline("failed");
    }
  }, []);

  const disableOffline = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration(offlineScope().scope);
      await registration?.unregister();
      for (const key of await caches.keys()) if (key.startsWith("ef-chat-offline-")) await caches.delete(key);
      setOffline("unknown");
    } catch {
      // Leaving the offline copy in place is harmless.
    }
  }, []);

  /* ------------------------------------------------------------ device check */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const gpu = (navigator as Navigator & GpuNavigator).gpu;
      if (!gpu) {
        if (!cancelled)
          setSupport({
            state: "unsupported",
            reason:
              "This browser does not offer WebGPU, which the chat needs to run a model on your graphics chip. Chrome and Edge on a computer support it, as do Chrome on recent Android phones (Android 12 or later) and Safari on iOS 26. Updating your browser may be enough.",
          });
        return;
      }
      try {
        const adapter = await gpu.requestAdapter();
        if (cancelled) return;
        if (!adapter) {
          setSupport({
            state: "unsupported",
            reason:
              "Your browser has WebGPU, but could not find a graphics chip it is allowed to use. Updating the browser or graphics drivers, or turning on hardware acceleration in the browser's settings, sometimes fixes this.",
          });
          return;
        }
        setSupport({ state: "ready" });
        // Storage is read only once the device can run a model.
        await refreshStorage(false);
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.getRegistration(offlineScope().scope).catch(() => undefined);
          // Already installed. Online, re-register so a new deploy refreshes the
          // offline copy; offline, that check would fail, so just report it.
          if (registration && !cancelled) {
            if (navigator.onLine) await enableOffline();
            else setOffline(registration.active ? "ready" : "failed");
          }
        }
      } catch {
        if (!cancelled) setSupport({ state: "unsupported", reason: "WebGPU is present but failed to start on this device." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshStorage, enableOffline]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    // Read once on mount, through the same handler, after the browser reports it.
    queueMicrotask(update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  /* ------------------------------------------------------------ lifecycle */
  const stopWorker = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    engineRef.current = null;
  }, []);

  useEffect(() => stopWorker, [stopWorker]);

  const load = async (model: ChatModel) => {
    setEngine({ state: "loading", modelId: model.id, progress: 0, text: "Starting…" });
    setAnnouncement(`Loading ${model.name}.`);
    try {
      const webllm = await import("@mlc-ai/web-llm");
      const report = (progress: { progress: number; text: string }) =>
        setEngine({ state: "loading", modelId: model.id, progress: progress.progress, text: progress.text });

      if (engineRef.current) {
        engineRef.current.setInitProgressCallback(report);
        await engineRef.current.reload(model.id);
      } else {
        const worker = new Worker(new URL("../../ai/webllm.worker.ts", import.meta.url), { type: "module" });
        workerRef.current = worker;
        engineRef.current = await webllm.CreateWebWorkerMLCEngine(worker, model.id, { initProgressCallback: report });
      }

      // Ask the browser not to clear the model under storage pressure. Browsers
      // decide for themselves; Firefox may ask the visitor.
      try {
        await navigator.storage?.persist?.();
      } catch {
        // Not granted is fine: the model is still saved, just less permanently.
      }
      setTurns([]);
      setDropped(0);
      setEngine({ state: "ready", modelId: model.id });
      setChatOpen(true);
      setAnnouncement(`${model.name} is ready.`);
      await refreshStorage(true);
      void enableOffline();
    } catch (error) {
      stopWorker();
      setEngine({ state: "error", message: explainError(error) });
      setAnnouncement("The model could not be loaded.");
      await refreshStorage(true);
    }
  };

  const cancelLoad = async () => {
    stopWorker();
    setEngine({ state: "idle" });
    setAnnouncement("Download stopped.");
    await refreshStorage(true);
  };

  const remove = async (model: ChatModel) => {
    try {
      if (engine.state === "ready" && engine.modelId === model.id) {
        stopWorker();
        setEngine({ state: "idle" });
      }
      const webllm = await import("@mlc-ai/web-llm");
      await webllm.deleteModelAllInfoInCache(model.id);
      setAnnouncement(`${model.name} deleted from this browser.`);
      const remaining = await Promise.all(chatModels.map((m) => webllm.hasModelInCache(m.id)));
      if (!remaining.some(Boolean)) await disableOffline();
    } catch {
      setAnnouncement(`${model.name} could not be deleted. Clearing this site's data in your browser settings removes it.`);
    }
    await refreshStorage(true);
  };

  /* ------------------------------------------------------ model files */
  const saveToDevice = async (model: ChatModel) => {
    setFileTask({ state: "saving", modelId: model.id });
    try {
      const blob = await exportModel(model.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = modelFileName(model.id);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      // Large files take a while to hand over to the download manager.
      window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
      setFileTask({
        state: "done",
        message: `${anchor.download} (${formatMegabytes(blob.size / 1e6)}) is being saved by your browser's downloads, usually to the Downloads folder. Keep it to set the model up again without the internet.`,
      });
    } catch (error) {
      setFileTask({
        state: "error",
        message:
          error instanceof ModelFileError
            ? error.message
            : "The model could not be saved to a file. Your device may be low on space.",
      });
    }
  };

  const loadFromFile = async (file: File | undefined) => {
    if (!file) return;
    setFileTask({ state: "importing", progress: 0, name: file.name });
    try {
      const modelId = await importModel(file, (progress) =>
        setFileTask({ state: "importing", progress, name: file.name }),
      );
      const model = getChatModel(modelId)!;
      setSelectedId(model.id);
      setFileTask({ state: "done", message: `${model.name} was checked and set up from ${file.name}.` });
      await refreshStorage(true);
      await load(model);
    } catch (error) {
      setFileTask({
        state: "error",
        message:
          error instanceof ModelFileError
            ? error.message
            : /quota/i.test(String(error))
              ? "There is not enough storage space for this model. Free up space on the device and try again."
              : "The file could not be read. It may be on storage the browser cannot reach; try copying it to the Downloads folder first.",
      });
    }
  };

  /* ------------------------------------------------------------ chatting */
  const generate = async (history: ChatTurn[]) => {
    const current = engineRef.current;
    if (!current) return;
    setTurns(history);
    setDraft("");
    setAnnouncement("The AI is replying.");

    const { kept, dropped: lost } = fitHistory(history, HISTORY_TOKENS);
    setDropped(lost);

    let reply = "";
    try {
      const stream = await current.chat.completions.create({
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...kept],
        stream: true,
        max_tokens: REPLY_TOKENS,
        temperature: 0.7,
        ...(loadedModel?.canThink ? { extra_body: { enable_thinking: thinking } } : {}),
      });
      for await (const chunk of stream) {
        reply += chunk.choices[0]?.delta?.content ?? "";
        setDraft(reply);
      }
      setAnnouncement("Reply finished.");
    } catch (error) {
      reply = reply || `(No reply: ${explainError(error)})`;
      setAnnouncement("The reply stopped because of an error.");
    }
    setTurns([...history, { role: "assistant", content: reply || "(Stopped before replying.)" }]);
    setDraft(null);
  };

  const send = (text: string) => {
    if (engine.state !== "ready" || generating) return;
    void generate([...turns, { role: "user", content: text }]);
  };

  const regenerate = () => {
    if (generating) return;
    const last = turns.findLastIndex((turn) => turn.role === "user");
    if (last === -1) return;
    void generate(turns.slice(0, last + 1));
  };

  const stop = () => {
    engineRef.current?.interruptGenerate();
    setAnnouncement("Stopped.");
  };

  const newChat = async () => {
    setTurns([]);
    setDropped(0);
    try {
      await engineRef.current?.resetChat();
    } catch {
      // Each request re-sends the history anyway.
    }
    setAnnouncement("New chat started.");
  };

  /* ------------------------------------------------------------ render */
  if (support.state === "checking") {
    return <p className="text-sm text-fg-muted">Checking whether this device can run a model…</p>;
  }

  if (support.state === "unsupported") {
    return (
      <div className="flex flex-col gap-4">
        <Callout tone="warning" title="This device or browser cannot run the chat">
          {support.reason}
        </Callout>
        <p className="text-sm text-fg-muted">
          Nothing was downloaded. The{" "}
          <Link href="/ai" className="link-inline">
            free AI finder
          </Link>{" "}
          lists free assistants that run on a server instead, and apps such as Jan or Ollama run models on a computer
          without a browser.
        </p>
      </div>
    );
  }

  const busy = engine.state === "loading";
  const selectedIsSaved = saved[selected.id] === true;
  const selectedIsRunning = engine.state === "ready" && engine.modelId === selected.id;

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------- running */}
      {loadedModel ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-fg">{loadedModel.name} is running on this device</p>
            <p className="text-xs text-fg-muted">
              {turns.length > 0
                ? `${turns.length} message${turns.length === 1 ? "" : "s"} in this chat`
                : "Ready for your first message"}
            </p>
          </div>
          <Button onClick={() => setChatOpen(true)} size="lg">
            Open chat
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      ) : null}

      {/* ------------------------------------------------------- offline */}
      {!online ? (
        <Callout tone="neutral" icon="info" title="You are offline">
          {Object.values(saved).some(Boolean)
            ? "Models saved on this device still work. Downloading a new one needs the internet."
            : "No model is saved on this device yet, so there is nothing to start. Connect once to download one, or load a model file you saved."}
        </Callout>
      ) : null}

      {offline === "ready" || offline === "preparing" || offline === "failed" ? (
        <div className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
          <Icon name={offline === "ready" ? "check" : offline === "failed" ? "alert-triangle" : "download"} size={16} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-fg">
              {offline === "ready"
                ? "Works offline"
                : offline === "preparing"
                  ? "Saving this page for offline use…"
                  : "Could not save this page for offline use"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">
              {offline === "ready"
                ? "This page and your saved models are kept on this device. Open this page with no internet and the chat still starts. Bookmark it, or use your browser's “Add to Home screen”, to find it easily."
                : offline === "preparing"
                  ? "About 9 MB of the site's code is being kept, once."
                  : "The chat works now, but needs the internet to open the page next time. Private browsing windows and some browser settings block this."}
            </p>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------- model picker */}
      <fieldset disabled={busy || generating || fileBusy}>
        <legend className="text-sm font-medium text-fg">Choose a model</legend>
        <p className="mt-1 text-xs text-fg-muted">
          Each is downloaded once and kept in this browser. Smaller is faster; larger answers better.
        </p>
        <ul className="mt-3 grid list-none gap-2">
          {chatModels.map((model) => {
            const isSaved = saved[model.id] === true;
            const isLoaded = engine.state === "ready" && engine.modelId === model.id;
            return (
              <li key={model.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors",
                    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                    selectedId === model.id ? "border-primary bg-primary-soft" : "border-border-strong hover:border-fg-subtle",
                  )}
                >
                  <input
                    type="radio"
                    name="chat-model"
                    value={model.id}
                    checked={selectedId === model.id}
                    onChange={() => setSelectedId(model.id)}
                    className="mt-1 size-4 accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium text-fg">{model.name}</span>
                      <span className="text-xs text-fg-muted tabular-nums">{formatMegabytes(model.downloadMB)}</span>
                      {isLoaded ? (
                        <span className="text-xs font-medium text-fg">· Running</span>
                      ) : isSaved ? (
                        <span className="text-xs font-medium text-fg">· Saved in this browser</span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-fg-muted">{model.bestFor}</span>
                    <span className="mt-0.5 block text-xs text-fg-subtle">
                      {model.maker} · {model.license} · needs about {formatMegabytes(model.gpuMemoryMB)} of graphics
                      memory
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* ------------------------------------------------------- load controls */}
      <div className="flex flex-col gap-3">
        {busy ? (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-bg-subtle p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-fg">
                {saved[engine.modelId] ? "Loading from this device" : "Downloading"} {getChatModel(engine.modelId)?.name}
              </span>
              <span className="text-fg-muted tabular-nums">{Math.round(engine.progress * 100)}%</span>
            </div>
            <progress value={engine.progress} max={1} className="h-2 w-full accent-primary" aria-label="Model loading progress" />
            <p className="truncate text-xs text-fg-subtle" title={engine.text}>
              {engine.text}
            </p>
            <div>
              <Button variant="ghost" size="sm" onClick={() => void cancelLoad()}>
                Stop
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {selectedIsRunning ? null : (
              <Button onClick={() => void load(selected)} disabled={generating || fileBusy} size="lg">
                <Icon name={selectedIsSaved ? "play-circle" : "download"} size={16} />
                {selectedIsSaved
                  ? `Start ${selected.name}`
                  : `Download ${selected.name} (${formatMegabytes(selected.downloadMB)})`}
              </Button>
            )}
            {selectedIsSaved ? (
              <Button variant="ghost" onClick={() => void remove(selected)} disabled={generating || fileBusy}>
                Delete from this browser
              </Button>
            ) : null}
          </div>
        )}

        {engine.state === "error" ? (
          <Callout tone="danger" assertive>
            {engine.message}
          </Callout>
        ) : null}

        {!selectedIsSaved && !busy ? (
          <p className="text-xs leading-relaxed text-fg-muted">
            The download comes from Hugging Face (the model) and GitHub (its graphics code). They see that the files
            were downloaded, like any download, but never see your messages.{" "}
            {storage.usageMB !== null
              ? `This site currently uses ${formatMegabytes(storage.usageMB)} of storage in this browser.`
              : null}
          </p>
        ) : null}

        {engine.state === "ready" && storage.persisted === false ? (
          <p className="text-xs leading-relaxed text-fg-muted">
            Your browser kept the model but did not mark it as permanent, so it may clear it if the device runs low on
            space. Save it to a file below to be able to set it up again without downloading.
          </p>
        ) : null}
      </div>

      {/* ------------------------------------------------------- model file */}
      <section aria-labelledby={`${fileInputId}-heading`} className="flex flex-col gap-3 rounded-xl border border-border p-4">
        <div>
          <h3 id={`${fileInputId}-heading`} className="text-sm font-semibold text-fg">
            Keep a copy on your device
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-fg-muted">
            Save a downloaded model as one {FILE_EXTENSION} file, which your browser puts in Downloads. Later, or in
            another browser or on another device, load that file to set the model up with no internet. Every part is
            checked against the official model before it is used, so a damaged or altered file is refused.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => void saveToDevice(selected)}
            disabled={!selectedIsSaved || fileBusy || busy}
          >
            <Icon name="download" size={16} />
            {fileTask.state === "saving" ? "Preparing file…" : `Save ${selected.name} to device`}
          </Button>
          <label
            htmlFor={fileInputId}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 text-sm font-medium text-fg hover:bg-surface-hover pointer-coarse:h-11",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
              (fileBusy || busy) && "pointer-events-none opacity-50",
            )}
          >
            <Icon name="upload" size={16} />
            Load from a file
            <input
              id={fileInputId}
              type="file"
              accept={`${FILE_EXTENSION},application/octet-stream`}
              disabled={fileBusy || busy}
              onChange={(event) => {
                void loadFromFile(event.target.files?.[0]);
                event.target.value = "";
              }}
              className="sr-only"
            />
          </label>
        </div>
        {!selectedIsSaved && fileTask.state === "idle" ? (
          <p className="text-xs text-fg-subtle">Download or start {selected.name} first to save it to a file.</p>
        ) : null}
        {fileTask.state === "importing" ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-fg-muted">
              <span className="truncate">Checking {fileTask.name}</span>
              <span className="tabular-nums">{Math.round(fileTask.progress * 100)}%</span>
            </div>
            <progress value={fileTask.progress} max={1} className="h-2 w-full accent-primary" aria-label="Model file check progress" />
          </div>
        ) : null}
        {fileTask.state === "done" ? <p className="text-xs text-fg-muted">{fileTask.message}</p> : null}
        {fileTask.state === "error" ? (
          <Callout tone="danger" assertive>
            {fileTask.message}
          </Callout>
        ) : null}
      </section>

      {loadedModel ? (
        <ChatScreen
          open={chatOpen}
          model={loadedModel}
          turns={turns}
          draft={draft}
          dropped={dropped}
          thinking={thinking}
          announcement={announcement}
          onThinkingChange={setThinking}
          onSend={send}
          onStop={stop}
          onRegenerate={regenerate}
          onNewChat={() => void newChat()}
          onClose={() => setChatOpen(false)}
        />
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {chatOpen ? "" : announcement}
      </p>
    </div>
  );
}
