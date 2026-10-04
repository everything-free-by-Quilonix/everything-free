"use client";

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

import { compareHref, MAX_COMPARE } from "./compare-params";

/**
 * Compare tray: the current comparison selection on `/resources`, with the way
 * to open it.
 *
 * When to use: rendered by `ResourceExplorer` while one or more listings are
 * selected; it unmounts when the selection empties. When not to use: on any
 * other page, or as a persistent bar; nothing is stored, so it never outlives
 * the explorer.
 *
 * Keyboard: a labelled `nav` landmark ("Comparison") with two controls. Clear
 * moves focus to the first record's compare toggle, or `#main` if none is in
 * the page, before the tray unmounts, so focus never lands on a removed node.
 *
 * Evidence: none; it names the selection, and the compare page states evidence.
 *
 * ELEVATED and opaque (no blur), fixed to the bottom edge with safe-area
 * padding; `materials.css` pads the page while it is present so it never
 * covers the last record, the pagination or a focused element.
 */
export function CompareTray({
  selected,
  onClear,
}: {
  selected: readonly { slug: string; name: string }[];
  onClear: () => void;
}) {
  const n = selected.length;
  const names = selected.map((item) => item.name).join(", ");

  return (
    <nav
      aria-label="Comparison"
      data-compare-tray=""
      className="material-elevated fixed inset-x-0 bottom-0 z-(--z-sticky) border-x-0 border-b-0 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-(--container-content) flex-wrap items-center gap-x-4 gap-y-2 sm:px-2 lg:px-4">
        <p aria-live="polite" className="line-clamp-2 min-w-0 flex-1 text-sm text-fg-muted tabular-nums">
          <span className="font-medium text-fg">
            {n} of {MAX_COMPARE} selected:
          </span>{" "}
          <span translate="no">{names}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {n >= 2 ? (
            <Link href={compareHref(selected.map((item) => item.slug))} className={buttonClasses({ variant: "primary" })}>
              Compare {n} listings
            </Link>
          ) : (
            <button type="button" disabled className={buttonClasses({ variant: "primary" })}>
              Pick at least 2
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const next = document.querySelector<HTMLElement>("[data-compare-toggle]") ?? document.getElementById("main");
              next?.focus();
              onClear();
            }}
            className={buttonClasses({ variant: "ghost" })}
          >
            Clear
          </button>
        </div>
      </div>
    </nav>
  );
}
