"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { formatBytes } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Browser-local image converter.
 *
 * Uses `createImageBitmap` to decode, a canvas to resize, and `canvas.toBlob` to
 * re-encode. All three are browser APIs operating on local memory, so the file
 * genuinely never leaves the device — the claim on the tool page is a description
 * of this implementation, not marketing.
 *
 * Object URLs are revoked on replacement and on unmount. Skipping that leaks the
 * decoded image for the lifetime of the document, which is easy to miss and
 * expensive with large files.
 */

const FORMATS = [
  { value: "image/webp", label: "WebP", extension: "webp", lossy: true },
  { value: "image/jpeg", label: "JPEG", extension: "jpg", lossy: true },
  { value: "image/png", label: "PNG", extension: "png", lossy: false },
] as const;

type FormatValue = (typeof FORMATS)[number]["value"];

interface Result {
  url: string;
  blob: Blob;
  filename: string;
  width: number;
  height: number;
}

interface SourceInfo {
  file: File;
  width: number;
  height: number;
}

/**
 * Size beyond which the browser is likely to struggle.
 *
 * Not a hard limit — the work happens on the user's device and their device may well
 * cope, so blocking would be presumptuous. But decoding a very large image can
 * exhaust the tab's memory, and warning beforehand is better than an opaque failure
 * after a long wait.
 */
const LARGE_FILE_BYTES = 25 * 1024 * 1024;

/** Canvas dimension ceiling is browser-dependent; this is a conservative warning point. */
const LARGE_PIXEL_COUNT = 40_000_000;

export function ImageConverter() {
  const [source, setSource] = useState<SourceInfo | null>(null);
  const [format, setFormat] = useState<FormatValue>("image/webp");
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultUrlRef = useRef<string | null>(null);
  const fileInputId = useId();
  const qualityId = useId();
  const widthId = useId();

  const releaseResult = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, []);

  useEffect(() => releaseResult, [releaseResult]);

  const selectedFormat = FORMATS.find((entry) => entry.value === format)!;

  const handleFile = async (file: File | undefined) => {
    releaseResult();
    setResult(null);
    setError(null);

    if (!file) {
      setSource(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSource(null);
      setError("That file is not an image. Choose a PNG, JPEG, WebP, GIF or SVG file.");
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      setSource({ file, width: bitmap.width, height: bitmap.height });
      bitmap.close();
    } catch {
      setSource(null);
      setError(
        "Your browser could not decode that image. Camera raw files, HEIC and multi-page TIFF are not supported.",
      );
    }
  };

  const convert = async () => {
    if (!source) return;

    setBusy(true);
    setError(null);
    releaseResult();
    setResult(null);

    try {
      const bitmap = await createImageBitmap(source.file);

      const requestedWidth = Number.parseInt(maxWidth, 10);
      const limit = Number.isFinite(requestedWidth) && requestedWidth > 0 ? requestedWidth : bitmap.width;
      // Only ever scale down. Upscaling would inflate the file while losing
      // quality, which is the opposite of what this tool is for.
      const scale = Math.min(1, limit / bitmap.width);
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("no-2d-context");

      // JPEG has no alpha channel. Without an explicit fill, transparent pixels
      // encode as black, which looks like corruption to the user.
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          format,
          // The quality argument is ignored for PNG, which is lossless.
          selectedFormat.lossy ? quality / 100 : undefined,
        );
      });

      if (!blob) throw new Error("encode-failed");

      const baseName = source.file.name.replace(/\.[^.]+$/, "") || "image";
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;

      setResult({ url, blob, filename: `${baseName}.${selectedFormat.extension}`, width, height });
    } catch {
      setError(
        "Conversion failed. This usually means the image is too large for the memory available to this tab — try a smaller maximum width.",
      );
    } finally {
      setBusy(false);
    }
  };

  const savings =
    result && source ? Math.round(((source.file.size - result.blob.size) / source.file.size) * 100) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fileInputId} className="text-sm font-medium text-fg">
          Choose an image
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          onChange={(event) => void handleFile(event.target.files?.[0])}
          className="w-full cursor-pointer rounded-lg border border-border-strong bg-bg p-2.5 text-sm text-fg-muted transition-colors file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-surface-raised file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-fg hover:border-fg-subtle"
        />
        <p className="text-xs text-fg-muted">
          Stays on your device. Nothing is uploaded.
        </p>
      </div>

      {error ? (
        <Callout tone="danger" assertive>
          {error}
        </Callout>
      ) : null}

      {source && (source.file.size > LARGE_FILE_BYTES || source.width * source.height > LARGE_PIXEL_COUNT) ? (
        <Callout tone="warning" icon="alert-triangle" title="This is a large image">
          Conversion runs on your own device, so a file this size may take a while or run out of memory in this tab.
          Setting a maximum width below makes it much more likely to succeed.
        </Callout>
      ) : null}

      {source ? (
        <>
          <dl className="grid gap-3 rounded-lg border border-border bg-bg-subtle p-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-fg-muted">File</dt>
              <dd className="mt-0.5 truncate text-fg" title={source.file.name}>
                {source.file.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-fg-muted">Dimensions</dt>
              <dd className="mt-0.5 text-fg tabular-nums">
                {source.width} × {source.height}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-fg-muted">Size</dt>
              <dd className="mt-0.5 text-fg tabular-nums">{formatBytes(source.file.size)}</dd>
            </div>
          </dl>

          <fieldset>
            <legend className="text-sm font-medium text-fg">Convert to</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {FORMATS.map((entry) => (
                <label
                  key={entry.value}
                  className={cn(
                    "cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors",
                    // The radio itself is visually hidden, so the focus ring has to be
                    // projected onto the label or keyboard users cannot see where they are.
                    "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                    format === entry.value
                      ? "border-primary bg-primary-soft text-fg"
                      : "border-border-strong text-fg-muted hover:text-fg",
                  )}
                >
                  <input
                    type="radio"
                    name="output-format"
                    value={entry.value}
                    checked={format === entry.value}
                    onChange={() => setFormat(entry.value)}
                    className="sr-only"
                  />
                  {entry.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={qualityId} className="flex items-baseline justify-between text-sm font-medium text-fg">
                Quality
                <span className="text-xs font-normal text-fg-muted tabular-nums">
                  {selectedFormat.lossy ? `${quality}%` : "Lossless"}
                </span>
              </label>
              <input
                id={qualityId}
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                disabled={!selectedFormat.lossy}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="w-full accent-primary disabled:opacity-50"
              />
              <p className="text-xs text-fg-muted">
                {selectedFormat.lossy
                  ? "Lower quality means a smaller file."
                  : "PNG is lossless, so quality does not apply."}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={widthId} className="text-sm font-medium text-fg">
                Maximum width
              </label>
              <input
                id={widthId}
                type="number"
                min={1}
                inputMode="numeric"
                value={maxWidth}
                onChange={(event) => setMaxWidth(event.target.value)}
                placeholder={`${source.width} (unchanged)`}
                className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm text-fg transition-colors focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-fg-muted">In pixels. Images are only ever scaled down, never enlarged.</p>
            </div>
          </div>

          <div>
            <Button onClick={() => void convert()} disabled={busy} size="md">
              {busy ? "Converting…" : "Convert image"}
            </Button>
          </div>
        </>
      ) : null}

      <div role="status" aria-live="polite">
        {result && source ? (
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-display text-lg font-semibold">Done</p>
              <p className="text-sm text-fg-muted tabular-nums">
                {formatBytes(source.file.size)} → {formatBytes(result.blob.size)}
                {savings !== null ? (
                  <span className={cn("ml-2 font-medium", savings > 0 ? "text-success-fg" : "text-warning-fg")}>
                    {savings > 0 ? `${savings}% smaller` : `${Math.abs(savings)}% larger`}
                  </span>
                ) : null}
              </p>
            </div>

            {savings !== null && savings <= 0 ? (
              <Callout tone="warning">
                The converted file is larger than the original. That is normal when re-encoding an already-compressed
                image, or when converting a photo to PNG. Try WebP, or lower the quality.
              </Callout>
            ) : null}

            <div className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
              {/* A plain <img> is correct here: the source is a local object URL
                  created at runtime, which the image optimiser cannot process. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt={`Converted result, ${result.width} by ${result.height} pixels`}
                width={result.width}
                height={result.height}
                className="mx-auto max-h-80 w-auto object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={result.url}
                download={result.filename}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition-colors hover:bg-primary-hover"
              >
                <Icon name="download" size={16} />
                Download {result.filename}
              </a>
              <p className="text-xs text-fg-muted tabular-nums">
                {result.width} × {result.height}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
