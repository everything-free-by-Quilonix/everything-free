import { evidenceLabels, type EvidenceReason } from "@/lib/resources/evidence";
import { EvidenceMark } from "./evidence";

/**
 * The Legend: the single key to every evidence mark on a page.
 *
 * When to use: wherever evidence marks appear in quantity, in full on the
 * homepage introduction and `/verification`. When not to use: as decoration, or
 * with its own wording; the labels come from `evidenceLabels`, the same words
 * every `EvidenceTag` prints.
 *
 * Keyboard: static content, nothing to operate.
 *
 * Evidence: marks are drawn only through `EvidenceMark`, so a glyph can never
 * mean something different here from what it means on a record.
 */

const ORDER: readonly EvidenceReason[] = ["confirmed", "unresolved", "stale", "not-checked", "not-established"];

const EXPLANATIONS: Record<EvidenceReason, string> = {
  confirmed: "An official source confirms it",
  unresolved: "Looked for, not settled",
  stale: "Was confirmed, the check expired",
  "not-checked": "Recorded, never checked",
  "not-established": "Not established either way",
};

export function Legend({ variant }: { variant: "full" }) {
  return (
    <div data-legend={variant}>
      <p className="kicker">How to read a listing</p>
      <dl className="mt-3 divide-y divide-rule border-y border-rule">
        {ORDER.map((reason) => (
          <div key={reason} className="grid grid-cols-[10.5rem_1fr] items-start gap-3 py-2 text-sm">
            <dt className="flex items-center gap-2 font-medium text-fg">
              <EvidenceMark reason={reason} size={16} />
              {evidenceLabels[reason]}
            </dt>
            <dd className="text-fg-muted">{EXPLANATIONS[reason]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
