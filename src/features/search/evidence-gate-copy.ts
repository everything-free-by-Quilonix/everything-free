/**
 * The Evidence Gate's words: what a confirmed-only filter showed and held back.
 *
 * Pure, so the copy rules are unit-tested without rendering. The two numbers come
 * from `runSearch` unchanged: `total` is the text-matched result count, and
 * `heldBack` is `excludedByEvidence`, which `runSearch` computes with the text
 * query removed. With a residual text query the two numbers therefore have
 * different bases, so no proportional bar is drawn and the sentence says the held
 * back figure is library-wide. Pass `q` as `effectiveQuery.q`, the residual terms
 * that were actually matched after intent extraction, not the typed sentence.
 */

import { countNoun, plural } from "@/components/ui/count";
import { formatCount } from "@/lib/utils/format";

/** Longest residual query quoted back, in characters, before "…". */
export const GATE_QUERY_MAX = 40;

export interface EvidenceGateCopy {
  /** Draw the shown-versus-held-back bar: only when both numbers share a base. */
  showBar: boolean;
  /** The visible line. */
  text: string;
  /** The same meaning as one sentence for assistive technology. */
  accessibleText: string;
}

function quote(q: string): string {
  return q.length > GATE_QUERY_MAX ? `${q.slice(0, GATE_QUERY_MAX)}…` : q;
}

export function evidenceGateCopy({
  total,
  heldBack,
  q,
}: {
  total: number;
  heldBack: number;
  q?: string;
}): EvidenceGateCopy {
  const residual = q?.trim() ?? "";

  if (!residual) {
    if (heldBack === 0) {
      return {
        showBar: false,
        text: "Nothing held back",
        accessibleText: `${formatCount(total)} shown. Nothing held back: no other listing records this fact without confirmation.`,
      };
    }
    return {
      showBar: true,
      text: `Shown ${formatCount(total)} · Held back ${formatCount(heldBack)}`,
      accessibleText: `${formatCount(total)} shown, ${formatCount(heldBack)} held back because the fact is not yet checked.`,
    };
  }

  const shown = `Shown ${formatCount(total)} matching “${quote(residual)}”`;
  const sentence =
    heldBack === 0
      ? `${shown} · nothing held back`
      : `${shown} · ${countNoun(heldBack, "listing", "listings")} in the library ${plural(heldBack, "records", "record")} this fact but ${plural(heldBack, "is", "are")} not yet checked`;
  return { showBar: false, text: sentence, accessibleText: sentence };
}
