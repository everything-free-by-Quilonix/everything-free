"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { cn } from "@/lib/utils/cn";
import { extractPalette, paletteAsCss, paletteAsList, readableTextOn } from "../logic/palette";

/**
 * Colour palette extractor.
 *
 * The image is decoded by the browser, drawn onto a small canvas (the palette of
 * a 12-megapixel photo is the same as the palette of a 256-pixel copy, and the
 * small copy is quick to analyse), and the pixels are quantised by median cut.
 * Nothing leaves the page.
 */

const SAMPLE_SIDE = 256;
const COUNTS = [4, 6, 8, 10, 12] as const;

interface Source {
  name: string;
  previewUrl: string;
  pixels: Uint8ClampedArray;
}

export function PaletteExtractor() {
  const [source, setSource] = useState<Source | null>(null);
  const [count, setCount] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const previewRef = useRef<string | null>(null);
  const fileInputId = useId();
  const countId = useId();

  const releasePreview = useCallback(() => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
  }, []);

  useEffect(() => releasePreview, [releasePreview]);

  const palette = useMemo(() => (source ? extractPalette(source.pixels, count) : []), [source, count]);

  const handleFile = async (file: File | undefined) => {
    releasePreview();
    setSource(null);
    setError(null);
    setCopied(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("That file is not an image. Choose a PNG, JPEG, WebP, GIF or SVG file.");
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, SAMPLE_SIDE / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("no-2d-context");
      context.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const pixels = context.getImageData(0, 0, width, height).data;

      const previewUrl = URL.createObjectURL(file);
      previewRef.current = previewUrl;
      setSource({ name: file.name, previewUrl, pixels });
    } catch {
      setError(
        "Your browser could not decode that image. Camera raw files, HEIC and multi-page TIFF are not supported.",
      );
    }
  };

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied((current) => (current === what ? null : current)), 2000);
    } catch {
      // Clipboard access can be denied. Every value is visible and selectable,
      // so the user can still copy it by hand.
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
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
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={countId} className="text-sm font-medium text-fg">
            Colours
          </label>
          <select
            id={countId}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="h-11 rounded-lg border border-border-strong bg-bg px-3 text-sm text-fg focus:border-primary"
          >
            {COUNTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="-mt-4 text-xs text-fg-muted">Analysed on your device. Nothing is uploaded.</p>

      {error ? (
        <Callout tone="danger" assertive>
          {error}
        </Callout>
      ) : null}

      <div role="status" aria-live="polite" className="flex flex-col gap-5">
        {source && palette.length === 0 ? (
          <Callout tone="warning">This image is fully transparent, so it has no colours to extract.</Callout>
        ) : null}

        {source && palette.length > 0 ? (
          <>
            <p className="sr-only">
              {palette.length} colours extracted from {source.name}: {palette.map((c) => c.hex).join(", ")}.
            </p>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr]">
              <div className="overflow-hidden rounded-lg border border-border bg-bg-subtle">
                {/* A local object URL, which the image optimiser cannot process. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={source.previewUrl} alt="" className="mx-auto max-h-56 w-auto object-contain" />
              </div>

              {/* The strip shows proportions at a glance; the list below carries the values. */}
              <div className="flex flex-col gap-3">
                <div className="flex h-12 overflow-hidden rounded-lg border border-border" aria-hidden="true">
                  {palette.map((colour, index) => (
                    <div
                      key={`${colour.hex}-${index}`}
                      style={{ backgroundColor: colour.hex, flexGrow: Math.max(colour.share, 0.02) }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => void copy(paletteAsList(palette), "list")}>
                    <Icon name={copied === "list" ? "check" : "copy"} size={14} />
                    {copied === "list" ? "Copied" : "Copy hex list"}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => void copy(paletteAsCss(palette), "css")}>
                    <Icon name={copied === "css" ? "check" : "copy"} size={14} />
                    {copied === "css" ? "Copied" : "Copy as CSS variables"}
                  </Button>
                </div>
              </div>
            </div>

            <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {palette.map((colour, index) => {
                const text = readableTextOn(colour);
                return (
                  <li key={`${colour.hex}-${index}`} className="overflow-hidden rounded-lg border border-border">
                    <div
                      className="flex h-20 items-end p-3 font-mono text-sm font-semibold"
                      style={{ backgroundColor: colour.hex, color: text }}
                    >
                      {colour.hex}
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <p className="text-xs text-fg-muted tabular-nums">
                        rgb({colour.r}, {colour.g}, {colour.b}) · {Math.round(colour.share * 100)}%
                      </p>
                      <button
                        type="button"
                        onClick={() => void copy(colour.hex, colour.hex)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-fg-muted hover:bg-surface-hover hover:text-fg",
                          "pointer-coarse:min-h-11",
                        )}
                        aria-label={`Copy ${colour.hex}`}
                      >
                        <Icon name={copied === colour.hex ? "check" : "copy"} size={13} />
                        {copied === colour.hex ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="text-sm text-fg-muted">
              Using these for text? Check each pairing in the{" "}
              <Link href="/tools/contrast-checker" className="link-inline">
                colour contrast checker
              </Link>
              .
            </p>

            <p className="sr-only">{copied ? "Copied to clipboard" : ""}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
