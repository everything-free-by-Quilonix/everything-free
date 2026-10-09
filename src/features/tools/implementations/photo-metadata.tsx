"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { formatBytes } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { cleanImage, isClean, MetadataError, type CleanResult, type FieldGroup } from "../logic/photo-metadata";

/**
 * Photo metadata viewer and remover.
 *
 * Reads the file into memory with `File.arrayBuffer()`, shows what its metadata
 * says, and offers a copy with the metadata segments left out. The image data is
 * copied byte for byte, so nothing is re-compressed. The cleaned file is then
 * read again, and the page only says it is clean when that second read agrees.
 */

const GROUP_LABELS: Record<FieldGroup, string> = {
  location: "Location",
  time: "Dates and times",
  people: "People",
  camera: "Camera and device",
  software: "Software",
  text: "Text and descriptions",
  other: "Other",
};

const GROUP_ORDER: FieldGroup[] = ["location", "time", "people", "camera", "software", "text", "other"];

const LARGE_FILE_BYTES = 100 * 1024 * 1024;

interface Loaded {
  file: File;
  bytes: Uint8Array;
}

export function PhotoMetadata() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [keepOrientation, setKeepOrientation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const fileInputId = useId();
  const orientationId = useId();

  const outcome = useMemo((): { result: CleanResult; verified: boolean } | { error: string } | null => {
    if (!loaded) return null;
    try {
      const result = cleanImage(loaded.bytes, { keepOrientation });
      return { result, verified: isClean(result.cleaned, { keepOrientation }) };
    } catch (problem) {
      return {
        error:
          problem instanceof MetadataError
            ? problem.message
            : "The file could not be read. It may be damaged, or too large for the memory available to this tab.",
      };
    }
  }, [loaded, keepOrientation]);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    setLoaded(null);
    setAnnouncement("");
    if (!file) return;
    try {
      setLoaded({ file, bytes: new Uint8Array(await file.arrayBuffer()) });
    } catch {
      setError("The file could not be read. It may be too large for the memory available to this tab.");
    }
  };

  const shownError = error ?? (outcome && "error" in outcome ? outcome.error : null);
  const result = outcome && "result" in outcome ? outcome.result : null;
  const verified = outcome && "verified" in outcome ? outcome.verified : false;

  const baseName = loaded?.file.name.replace(/\.[^.]+$/, "") || "photo";
  const filename = result ? `${baseName}-clean.${result.report.format === "jpeg" ? "jpg" : "png"}` : "";
  const sensitiveCount = result?.report.fields.filter((f) => f.sensitive).length ?? 0;
  const removedBlocks = result?.report.blocks.filter((b) => b.action === "removed") ?? [];
  const keptBlocks = result?.report.blocks.filter((b) => b.action === "kept") ?? [];

  /*
   * Built at the moment of the click and revoked once the download has started,
   * so no object URL outlives the action that needed it.
   */
  const download = () => {
    if (!result || !verified) return;
    const type = result.report.format === "jpeg" ? "image/jpeg" : "image/png";
    const url = URL.createObjectURL(new Blob([result.cleaned as BlobPart], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement(`${filename} downloaded without its metadata.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fileInputId} className="text-sm font-medium text-fg">
          Choose a photo (JPEG or PNG)
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          onChange={(event) => void handleFile(event.target.files?.[0])}
          className="w-full cursor-pointer rounded-lg border border-border-strong bg-bg p-2.5 text-sm text-fg-muted transition-colors file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-surface-raised file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-fg hover:border-fg-subtle"
        />
        <p className="text-xs text-fg-muted">Read on your device. The photo is never uploaded.</p>
      </div>

      {loaded && loaded.file.size > LARGE_FILE_BYTES ? (
        <Callout tone="warning" title="This is a large file">
          It is read into this tab&rsquo;s memory, so a file this size may be slow or fail on a phone.
        </Callout>
      ) : null}

      {shownError ? (
        <Callout tone="danger" assertive>
          {shownError}
        </Callout>
      ) : null}

      <div role="status" aria-live="polite" className="flex flex-col gap-6">
        {result ? (
          result.report.fields.length === 0 && removedBlocks.length === 0 ? (
            <Callout tone="neutral" icon="shield-check" title="No metadata found">
              This file carries no camera, date, location or text metadata that this tool knows how to remove. There
              is nothing to clean.
            </Callout>
          ) : (
            <>
              <div>
                <p className="font-display text-lg font-semibold">
                  {result.report.fields.length === 0
                    ? "Metadata found"
                    : `${result.report.fields.length} detail${result.report.fields.length === 1 ? "" : "s"} found`}
                </p>
                <p className="mt-1 text-sm text-fg-muted">
                  {sensitiveCount > 0
                    ? `${sensitiveCount} could identify you, the place the photo was taken, or your device.`
                    : "None of the readable details obviously identify a person or place."}{" "}
                  {formatBytes(result.removedBytes)} of metadata will be removed.
                </p>
              </div>

              {result.report.fields.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {GROUP_ORDER.map((group) => {
                    const fields = result.report.fields.filter((f) => f.group === group);
                    if (fields.length === 0) return null;
                    return (
                      <section key={group} aria-label={GROUP_LABELS[group]}>
                        <h3 className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
                          {GROUP_LABELS[group]}
                        </h3>
                        <dl className="mt-2 divide-y divide-border rounded-lg border border-border bg-bg-subtle">
                          {fields.map((field, index) => (
                            <div
                              key={`${field.label}-${index}`}
                              className="grid gap-1 px-3 py-2.5 text-sm sm:grid-cols-[12rem_1fr]"
                            >
                              <dt className="flex items-center gap-1.5 text-fg-muted">
                                {field.sensitive ? (
                                  <Icon name="alert-triangle" size={14} className="shrink-0 text-warning-fg" />
                                ) : null}
                                {field.label}
                                {field.sensitive ? <span className="sr-only"> (identifying)</span> : null}
                              </dt>
                              <dd className="min-w-0 font-mono text-xs break-words text-fg sm:text-sm">{field.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    );
                  })}
                </div>
              ) : null}

              {result.report.orientation !== null && result.report.orientation !== 1 ? (
                <label
                  htmlFor={orientationId}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <input
                    id={orientationId}
                    type="checkbox"
                    checked={keepOrientation}
                    onChange={(event) => setKeepOrientation(event.target.checked)}
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span>
                    <span className="font-medium text-fg">Keep the rotation setting</span>
                    <span className="mt-0.5 block text-fg-muted">
                      This photo is stored sideways or upside down and relies on a rotation tag to display correctly.
                      Keeping it writes back only that one tag, which identifies nothing.
                    </span>
                  </span>
                </label>
              ) : null}

              <details className="rounded-lg border border-border">
                <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium text-fg">
                  What is removed and what is kept
                </summary>
                <ul className="flex flex-col gap-2 border-t border-border px-3 py-3 text-sm">
                  {[...removedBlocks, ...keptBlocks].map((block, index) => (
                    <li key={`${block.label}-${index}`} className="flex flex-wrap items-baseline gap-x-2">
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase",
                          block.action === "removed" ? "text-danger-fg" : "text-fg-muted",
                        )}
                      >
                        {block.action === "removed" ? "Removed" : "Kept"}
                      </span>
                      <span className="font-medium text-fg">{block.label}</span>
                      <span className="text-xs text-fg-subtle tabular-nums">{formatBytes(block.bytes)}</span>
                      <span className="basis-full text-xs text-fg-muted">{block.reason}</span>
                    </li>
                  ))}
                  <li className="text-xs text-fg-muted">
                    The compressed picture itself is copied unchanged, so there is no loss of quality.
                  </li>
                </ul>
              </details>

              {verified ? (
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
                  <p className="text-sm text-fg-muted">
                    The cleaned copy was read back and contains none of the details above.{" "}
                    <span className="tabular-nums">
                      {formatBytes(loaded!.file.size)} → {formatBytes(result.cleaned.length)}
                    </span>
                  </p>
                  <div>
                    <Button onClick={download} size="md">
                      <Icon name="download" size={16} />
                      Download {filename}
                    </Button>
                  </div>
                  <p className="sr-only">{announcement}</p>
                </div>
              ) : (
                <Callout tone="danger" assertive>
                  The cleaned copy still contained metadata when it was checked, so no download is offered. The file
                  may use a layout this tool does not understand; a desktop editor such as GIMP can export a copy
                  without metadata.
                </Callout>
              )}
            </>
          )
        ) : null}
      </div>
    </div>
  );
}
