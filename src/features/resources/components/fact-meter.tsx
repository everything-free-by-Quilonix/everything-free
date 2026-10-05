import type { CSSProperties } from "react";
import { plural } from "@/components/ui/count";
import { formatCount } from "@/lib/utils/format";

/**
 * Fact meter: a count gauge of how much of a listing has been checked.
 *
 * When to use: in a record's foot and in the record-page snapshot, beside the
 * words that name the facts. When not to use: as a score, a rating or a
 * percentage. It is never labelled any of those.
 *
 * Keyboard: static, not focusable.
 *
 * Evidence: draws exactly what `factMeterCounts` (or an index's `k`, `u`, `t`)
 * says: confirmed cells first, then checked-but-unsettled, then the rest.
 * Positions do not identify facts. Unlabelled it is `aria-hidden`, because the
 * evidence list beside it names the facts; labelled, its visible sentence is the
 * authority and the gauge is decoration of that sentence.
 */
export function FactMeter({
  confirmed,
  unsettled,
  total,
  labelled = false,
}: {
  confirmed: number;
  unsettled: number;
  total: number;
  labelled?: boolean;
}) {
  const gauge = (
    <span
      aria-hidden="true"
      className="fact-meter"
      style={{ "--c": confirmed, "--u": unsettled, "--n": total } as CSSProperties}
    />
  );
  if (!labelled) return gauge;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted tabular-nums">
      {gauge}
      <span>
        {formatCount(confirmed)} of {formatCount(total)} {plural(total, "fact", "facts")} confirmed
        {unsettled > 0 ? ` · ${formatCount(unsettled)} checked, not settled` : null}
      </span>
    </span>
  );
}
