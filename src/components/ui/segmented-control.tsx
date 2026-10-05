"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Segmented control: a choice between two or three views of the same content.
 *
 * When to use: only where switching re-renders what is already on screen (today
 * the compare table's "All rows / Only differences"). When not to use: for
 * navigation, for filters that change the URL's result set, or for more than
 * three options.
 *
 * Keyboard: a native radio group. Tab enters the group at the checked segment,
 * arrows move and select, and the focused segment's label carries the outline.
 *
 * Evidence: none; it changes what is shown, never what a value says.
 *
 * The selected segment is ink text over one 2px gold rule (the selected
 * indicator, gold role 4), positioned by `--i` so it moves rather than redraws.
 * Disabled renders `disabledReason` as visible text after the control.
 */
export function SegmentedControl<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
  disabled = false,
  disabledReason,
}: {
  name: string;
  legend: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <fieldset disabled={disabled} className={cn("min-w-0", disabled && "opacity-50")}>
        <legend className="sr-only">{legend}</legend>
        <div
          className="relative grid auto-cols-fr grid-flow-col rounded-sm border border-border-strong bg-bg"
          style={{ "--i": index, "--n": options.length } as CSSProperties}
        >
          {options.map((option) => {
            const checked = option.value === value;
            return (
              <label
                key={option.value}
                className={cn(
                  "relative flex h-9 cursor-pointer items-center justify-center rounded-sm px-3 text-sm font-medium transition-colors pointer-coarse:h-11",
                  "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--focus)",
                  checked ? "text-fg" : "text-fg-muted hover:bg-surface-hover hover:text-fg",
                  disabled && "cursor-not-allowed",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={checked}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
          <span aria-hidden="true" className="segment-indicator motion-segment" />
        </div>
      </fieldset>
      {disabled && disabledReason ? <p className="text-sm text-fg-muted">{disabledReason}</p> : null}
    </div>
  );
}
