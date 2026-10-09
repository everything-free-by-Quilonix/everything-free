"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";
import { splitThinking, type ChatTurn } from "@/features/ai/logic/chat";
import type { ChatModel } from "@/features/ai/models";
import { ChatMarkdown } from "./private-ai-markdown";

/**
 * The full-screen chat, in the style people know from ChatGPT and Claude: a
 * centred conversation, replies rendered as formatted text, and a composer pinned
 * to the bottom that grows as you type.
 *
 * A native modal `<dialog>`: the browser traps focus inside it, makes the page
 * behind inert, and closes it on Escape, which returns to the model settings.
 * Nothing here talks to the model directly; the parent owns the engine.
 */

const GENERAL_STARTERS = [
  "Explain how compound interest works, simply",
  "Write a polite email asking to reschedule a meeting",
  "Give me five ideas for a healthy weekday dinner",
  "Summarise the pros and cons of working from home",
];

const CODE_STARTERS = [
  "Write a JavaScript function that removes duplicates from an array",
  "Explain what this regex does: ^\\d{3}-\\d{4}$",
  "Convert a Python list comprehension to a for loop, with an example",
  "What is the difference between let, const and var?",
];

export function ChatScreen({
  open,
  model,
  turns,
  draft,
  dropped,
  thinking,
  announcement,
  onThinkingChange,
  onSend,
  onStop,
  onRegenerate,
  onNewChat,
  onClose,
}: {
  open: boolean;
  model: ChatModel;
  turns: readonly ChatTurn[];
  /** The reply being written, or null when the model is idle. */
  draft: string | null;
  dropped: number;
  thinking: boolean;
  announcement: string;
  onThinkingChange: (value: boolean) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  onRegenerate: () => void;
  onNewChat: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const followRef = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const inputId = useId();
  const thinkingId = useId();
  const titleId = useId();

  const generating = draft !== null;

  // The dialog is a browser-managed external element: open and close it to match.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Follow the reply as it streams, unless the reader has scrolled up to re-read.
  useEffect(() => {
    if (followRef.current) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, draft]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    followRef.current = bottom;
    if (bottom !== atBottom) setAtBottom(bottom);
  };

  const jumpToLatest = () => {
    followRef.current = true;
    setAtBottom(true);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const submit = (text = input) => {
    const value = text.trim();
    if (!value || generating) return;
    onSend(value);
    setInput("");
    followRef.current = true;
    setAtBottom(true);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const copy = async (index: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 2000);
    } catch {
      // The reply is visible and selectable.
    }
  };

  const starters = model.id.includes("Coder") ? CODE_STARTERS : GENERAL_STARTERS;
  const lastAssistant = turns.findLastIndex((turn) => turn.role === "assistant");

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-fg backdrop:bg-bg"
    >
      <div className="flex h-full flex-col">
        {/* ------------------------------------------------------- top bar */}
        <header className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-hover hover:text-fg"
            aria-label="Back to model settings"
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="truncate text-sm font-semibold">
              {model.name}
            </h2>
            <p className="flex items-center gap-1.5 truncate text-xs text-fg-muted">
              <Icon name="lock" size={11} />
              Private · running on this device
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onNewChat();
              inputRef.current?.focus();
            }}
            disabled={generating || turns.length === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm text-fg-muted hover:bg-surface-hover hover:text-fg disabled:opacity-40"
          >
            <Icon name="plus" size={16} />
            <span className="hidden sm:inline">New chat</span>
            <span className="sr-only sm:hidden">New chat</span>
          </button>
        </header>

        {/* ------------------------------------------------------- messages */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="h-full overflow-y-auto overscroll-contain"
            role="log"
            aria-label="Conversation"
            aria-live="off"
          >
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
              {turns.length === 0 && draft === null ? (
                <div className="flex flex-col items-center gap-6 pt-[12vh] text-center">
                  <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-raised">
                    <Icon name="cpu" size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-semibold sm:text-2xl">How can I help?</p>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      {model.name} runs on your device. Nothing you type is sent anywhere.
                    </p>
                  </div>
                  <ul className="grid w-full list-none gap-2 sm:grid-cols-2">
                    {starters.map((starter) => (
                      <li key={starter}>
                        <button
                          type="button"
                          onClick={() => submit(starter)}
                          className="h-full w-full rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-fg"
                        >
                          {starter}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {dropped > 0 ? (
                <p className="rounded-lg border border-border bg-surface px-3 py-2 text-center text-xs text-fg-muted">
                  The model no longer sees the first {dropped} message{dropped === 1 ? "" : "s"}: small models only
                  hold a short conversation in mind. Start a new chat for a fresh topic.
                </p>
              ) : null}

              {turns.map((turn, index) =>
                turn.role === "user" ? (
                  <UserMessage key={index} text={turn.content} />
                ) : (
                  <AssistantMessage
                    key={index}
                    text={turn.content}
                    actions={
                      <>
                        <ActionButton
                          label={copiedIndex === index ? "Copied" : "Copy"}
                          icon={copiedIndex === index ? "check" : "copy"}
                          onClick={() => void copy(index, splitThinking(turn.content).answer)}
                        />
                        {index === lastAssistant && !generating ? (
                          <ActionButton label="Regenerate" icon="refresh-cw" onClick={onRegenerate} />
                        ) : null}
                      </>
                    }
                  />
                ),
              )}

              {draft !== null ? <AssistantMessage text={draft} streaming /> : null}
            </div>
          </div>

          {!atBottom ? (
            <button
              type="button"
              onClick={jumpToLatest}
              className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-border-strong bg-surface-raised px-3 py-1.5 text-xs text-fg shadow-xs hover:bg-surface-hover"
            >
              <Icon name="chevron-down" size={14} />
              Latest
            </button>
          ) : null}
        </div>

        {/* ------------------------------------------------------- composer */}
        <div className="shrink-0 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:px-6">
          <form
            className="mx-auto w-full max-w-3xl"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <div className="flex flex-col rounded-2xl border border-border-strong bg-surface shadow-xs focus-within:border-fg-subtle">
              <label htmlFor={inputId} className="sr-only">
                Message {model.name}
              </label>
              <textarea
                id={inputId}
                ref={inputRef}
                value={input}
                rows={1}
                onChange={(event) => {
                  setInput(event.target.value);
                  resize(event.target);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    submit();
                  }
                }}
                placeholder={`Message ${model.name}`}
                className="max-h-[200px] w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[0.9375rem] leading-relaxed text-fg placeholder:text-fg-subtle focus:outline-none"
              />
              <div className="flex items-center gap-2 px-2.5 pb-2.5">
                {model.canThink ? (
                  <label
                    htmlFor={thinkingId}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary",
                      thinking ? "border-fg-subtle bg-surface-raised text-fg" : "border-border text-fg-muted hover:text-fg",
                    )}
                  >
                    <input
                      id={thinkingId}
                      type="checkbox"
                      checked={thinking}
                      onChange={(event) => onThinkingChange(event.target.checked)}
                      className="sr-only"
                    />
                    <Icon name="bolt" size={12} />
                    Think step by step
                  </label>
                ) : null}
                <span className="flex-1" />
                {generating ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-fg text-bg hover:opacity-90"
                    aria-label="Stop replying"
                  >
                    <span className="size-3 rounded-[2px] bg-bg" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={input.trim().length === 0}
                    className="inline-flex size-9 items-center justify-center rounded-full bg-fg text-bg hover:opacity-90 disabled:opacity-30"
                    aria-label="Send message"
                  >
                    <Icon name="send" size={16} />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-center text-[0.6875rem] text-fg-subtle">
              Runs on your device and is not saved. Small models make mistakes, so check anything important.
            </p>
          </form>
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </dialog>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="sr-only">You said:</p>
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-surface-raised px-4 py-2.5 text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap text-fg">
        {text}
      </div>
    </div>
  );
}

function AssistantMessage({
  text,
  streaming = false,
  actions,
}: {
  text: string;
  streaming?: boolean;
  actions?: React.ReactNode;
}) {
  const { thinking, answer, stillThinking } = splitThinking(text);
  return (
    <div className="flex gap-3">
      <div
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-fg-muted"
        aria-hidden="true"
      >
        <Icon name="cpu" size={14} />
      </div>
      <div className="min-w-0 flex-1 text-[0.9375rem] leading-relaxed text-fg">
        <p className="sr-only">AI replied:</p>
        {thinking ? (
          <details className="mb-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg-muted" open={stillThinking}>
            <summary className="cursor-pointer select-none">{stillThinking ? "Thinking…" : "Show reasoning"}</summary>
            <p className="mt-2 whitespace-pre-wrap">{thinking}</p>
          </details>
        ) : null}
        {answer ? (
          <ChatMarkdown text={answer} />
        ) : streaming && !stillThinking ? (
          <p className="text-fg-muted">Writing…</p>
        ) : null}
        {streaming && answer ? (
          <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-fg-muted" />
        ) : null}
        {actions ? <div className="mt-2 flex gap-1">{actions}</div> : null}
      </div>
    </div>
  );
}

function ActionButton({ label, icon, onClick }: { label: string; icon: "copy" | "check" | "refresh-cw"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted hover:bg-surface-hover hover:text-fg pointer-coarse:min-h-9"
    >
      <Icon name={icon} size={13} />
      {label}
    </button>
  );
}
