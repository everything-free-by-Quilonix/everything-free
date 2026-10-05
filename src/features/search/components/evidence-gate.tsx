import type { CSSProperties } from "react";
import { evidenceGateCopy } from "../evidence-gate-copy";

/**
 * Evidence Gate: what a confirmed-only filter showed and what it held back.
 *
 * When to use: in the results toolbar, while at least one confirmed-only filter is
 * active, so a sharp drop in results reads as "most listings are not checked yet"
 * rather than "the library is thin".
 * When not to use: anywhere a filter is not evidence-gated.
 *
 * Keyboard: one text link, "What this means", to the evidence-filter notice; it
 * follows the text-link states.
 *
 * Evidence: the shown segment is a filter result, not a confirmation statement,
 * so neither segment carries success green or gold. The bar is drawn only when
 * both numbers share a base (no residual text query), and it is `aria-hidden`:
 * the accessible sentence carries the meaning. This sits outside the toolbar's
 * live count paragraph so a filter change is announced once.
 */
export function EvidenceGate({ total, heldBack, q }: { total: number; heldBack: number; q?: string }) {
  const copy = evidenceGateCopy({ total, heldBack, q });
  const sum = total + heldBack;
  const shown = sum > 0 ? (total / sum) * 100 : 0;

  return (
    <div className="hidden min-w-0 items-center gap-3 text-xs text-fg-muted tabular-nums sm:flex">
      <span aria-hidden="true">{copy.text}</span>
      <span className="sr-only">{copy.accessibleText}</span>
      {copy.showBar ? (
        // The track is the held-back colour; the one segment is what is shown.
        <span aria-hidden="true" data-size="xs" className="survey-bar w-24 shrink-0">
          <span
            data-segment="shown"
            data-empty={total === 0 ? "" : undefined}
            style={{ "--w": `${shown.toFixed(2)}%` } as CSSProperties}
          />
        </span>
      ) : null}
      <a href="#evidence-filter-notice" className="link-inline shrink-0 rounded-xs">
        What this means
      </a>
    </div>
  );
}
