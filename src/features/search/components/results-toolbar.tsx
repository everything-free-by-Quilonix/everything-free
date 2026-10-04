"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { plural } from "@/components/ui/count";
import { formatCount } from "@/lib/utils/format";

/**
 * Results toolbar: the count, the Evidence Gate and the sort, kept in view while
 * the results scroll.
 *
 * When to use: once, at the top of the `/resources` results column. When not to
 * use: on static lists (category, collection and audience pages), which do not
 * change under the reader.
 *
 * Keyboard: the bar itself is not interactive; its controls follow their own
 * specs, in reading order.
 *
 * Behaviour: FUNCTIONAL material, sticky under the header. The count paragraph's
 * first number is always the total, and it is the one polite live region, so a
 * filter change is announced once. When the row wraps (long totals, large text)
 * one `ResizeObserver` sets `data-wrapped`, and `materials.css` grows
 * `--toolbar-h` so anchors still scroll clear of it.
 *
 * Evidence: none of its own. The Evidence Gate passed in states its own rule.
 */
export function ResultsToolbar({
  total,
  page,
  totalPages,
  filtered,
  gate,
  children,
}: {
  total: number;
  page: number;
  totalPages: number;
  /** Whether any query or filter is active: "{n} listings match" rather than "{n} listings". */
  filtered: boolean;
  gate?: ReactNode;
  /** The sort select and, below `lg`, the filters button. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = ref.current;
    if (!toolbar || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      toolbar.toggleAttribute("data-wrapped", height > 56);
    });
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-results-toolbar=""
      className="material-functional sticky top-(--header-h) z-(--z-sticky) -mx-4 flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-1.5"
    >
      <p className="mr-auto text-sm text-fg-muted tabular-nums" aria-live="polite">
        <span className="text-fg">{formatCount(total)}</span> {plural(total, "listing", "listings")}
        {filtered ? <span className="hidden sm:inline"> {plural(total, "matches", "match")}</span> : null}
        {totalPages > 1 ? (
          <span className="hidden text-fg-subtle sm:inline">
            {" "}
            · page {page} of {totalPages}
          </span>
        ) : null}
      </p>
      {gate}
      {children}
    </div>
  );
}
