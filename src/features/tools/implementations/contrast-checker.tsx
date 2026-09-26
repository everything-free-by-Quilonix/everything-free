"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/**
 * WCAG 2.1 colour contrast checker.
 *
 * The maths follows the W3C definitions directly: channel values are normalised
 * to 0–1, linearised with the sRGB transfer function, combined into relative
 * luminance with the ITU-R BT.709 coefficients, and turned into a ratio of
 * (lighter + 0.05) / (darker + 0.05).
 *
 * Runs entirely in the browser. There is nothing to send anywhere.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Accepts `#rgb`, `#rrggbb`, with or without the hash. Returns null if invalid. */
function parseHex(input: string): Rgb | null {
  const hex = input.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return {
      r: Number.parseInt(hex[0] + hex[0], 16),
      g: Number.parseInt(hex[1] + hex[1], 16),
      b: Number.parseInt(hex[2] + hex[2], 16),
    };
  }

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  return null;
}

function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

/** sRGB gamma expansion, per WCAG's relative luminance definition. */
function linearise(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const luminanceA = relativeLuminance(a);
  const luminanceB = relativeLuminance(b);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

interface Requirement {
  id: string;
  label: string;
  description: string;
  threshold: number;
}

const REQUIREMENTS: Requirement[] = [
  {
    id: "aa-normal",
    label: "AA · normal text",
    description: "Body text below 18.66px bold or 24px regular",
    threshold: 4.5,
  },
  { id: "aa-large", label: "AA · large text", description: "18.66px bold or 24px regular and above", threshold: 3 },
  { id: "aa-ui", label: "AA · UI components", description: "Borders, icons and focus indicators", threshold: 3 },
  { id: "aaa-normal", label: "AAA · normal text", description: "Enhanced contrast for body text", threshold: 7 },
  { id: "aaa-large", label: "AAA · large text", description: "Enhanced contrast for large text", threshold: 4.5 },
];

export function ContrastChecker() {
  const [foregroundInput, setForegroundInput] = useState("#f5f5f5");
  const [backgroundInput, setBackgroundInput] = useState("#0a0a0f");

  const foregroundId = useId();
  const backgroundId = useId();

  const foreground = parseHex(foregroundInput);
  const background = parseHex(backgroundInput);

  const ratio = useMemo(() => {
    if (!foreground || !background) return null;
    return contrastRatio(foreground, background);
  }, [foreground, background]);

  const swap = () => {
    setForegroundInput(backgroundInput);
    setBackgroundInput(foregroundInput);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <ColourInput
          id={foregroundId}
          label="Text colour"
          value={foregroundInput}
          parsed={foreground}
          onChange={setForegroundInput}
        />

        <div className="flex justify-center sm:pb-1">
          <Button variant="secondary" size="sm" onClick={swap} aria-label="Swap text and background colours">
            <Icon name="refresh-cw" size={15} />
            <span className="sm:sr-only">Swap</span>
          </Button>
        </div>

        <ColourInput
          id={backgroundId}
          label="Background colour"
          value={backgroundInput}
          parsed={background}
          onChange={setBackgroundInput}
        />
      </div>

      {/* Results are announced politely so a screen-reader user hears the outcome
          change as they adjust the colours, without interrupting typing. */}
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        {ratio === null ? (
          <p className="rounded-lg border border-dashed border-border bg-bg-subtle px-4 py-6 text-center text-sm text-fg-muted">
            Enter two valid hex colours to see the contrast ratio.
          </p>
        ) : (
          <>
            <div
              className="rounded-xl border border-border p-6"
              style={{ backgroundColor: toHex(background!), color: toHex(foreground!) }}
            >
              <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Large sample text
              </p>
              <p className="mt-2 text-sm">
                This paragraph is rendered at a normal body size so you can judge the result directly rather than only
                reading the number.
              </p>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <p className="font-display text-3xl font-semibold tabular-nums">{ratio.toFixed(2)}:1</p>
              <p className="text-sm text-fg-muted">contrast ratio</p>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              {REQUIREMENTS.map((requirement) => {
                const passes = ratio >= requirement.threshold;
                return (
                  <li
                    key={requirement.id}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
                      passes ? "border-success/30 bg-success-soft" : "border-danger/30 bg-danger-soft",
                    )}
                  >
                    <Icon
                      name={passes ? "check-circle" : "x-circle"}
                      size={16}
                      className={cn("mt-0.5 shrink-0", passes ? "text-success-fg" : "text-danger-fg")}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg">
                        {requirement.label}
                        {/* Text, not just colour and icon, states the outcome. */}
                        <span className={cn("ml-2 text-xs", passes ? "text-success-fg" : "text-danger-fg")}>
                          {passes ? "Pass" : "Fail"}
                        </span>
                      </p>
                      <p className="text-xs text-fg-muted">
                        {requirement.description} · needs {requirement.threshold}:1
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function ColourInput({
  id,
  label,
  value,
  parsed,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  parsed: Rgb | null;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  const invalid = parsed === null && value.trim().length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* The native colour picker is a convenience. The text field is the
            accessible source of truth and works with keyboard and paste. */}
        <input
          type="color"
          value={parsed ? toHex(parsed) : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-lg border border-border-strong bg-bg p-1"
          aria-label={`${label} picker`}
          tabIndex={-1}
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          autoComplete="off"
          inputMode="text"
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          placeholder="#000000"
          className={cn(
            "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 font-mono text-sm text-fg transition-colors focus:border-primary focus:outline-none",
            invalid && "border-danger",
          )}
        />
      </div>
      {invalid ? (
        <p id={errorId} className="text-xs text-danger-fg">
          Enter a hex colour such as #1a1a1a or #fff.
        </p>
      ) : null}
    </div>
  );
}
