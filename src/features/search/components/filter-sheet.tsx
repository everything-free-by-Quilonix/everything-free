"use client";

import { useId, type ReactNode } from "react";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { plural } from "@/components/ui/count";
import { Dialog } from "@/components/ui/dialog";
import { formatCount } from "@/lib/utils/format";

/**
 * Filter sheet: the filter panel as a bottom sheet below `lg`.
 *
 * When to use: only from the results toolbar's "Filters" button, below `lg`.
 * When not to use: at `lg` and above, where the sidebar holds the one filter
 * form; the explorer closes the sheet when the viewport reaches `lg`.
 *
 * Keyboard: the shared `Dialog` holds focus, Escape closes, and focus returns to
 * the "Filters" button. "Show {total} results" closes the sheet; every change
 * has already updated the URL and the results behind it.
 *
 * Evidence: none of its own; the panel inside keeps its two regions.
 */
export function FilterSheet({
  open,
  onClose,
  total,
  onClearAll,
  children,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  /** Omitted when no filter is active. */
  onClearAll?: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <Dialog open={open} onRequestClose={onClose} variant="sheet-bottom" labelledBy={titleId}>
      <div className="flex shrink-0 items-center justify-between border-b border-rule px-4 py-1">
        <h2 id={titleId} className="font-display text-base font-semibold">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg active:bg-(--fill-pressed)"
          aria-label="Close filters"
        >
          <Icon name="close" size={20} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-rule px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {onClearAll ? (
          <Button variant="ghost" size="md" onClick={onClearAll}>
            Clear all
          </Button>
        ) : (
          <span />
        )}
        <Button variant="primary" size="md" onClick={onClose}>
          Show {formatCount(total)} {plural(total, "result", "results")}
        </Button>
      </div>
    </Dialog>
  );
}
