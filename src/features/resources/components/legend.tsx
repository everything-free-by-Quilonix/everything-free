import type { CSSProperties } from "react";

import { evidenceLabels, type EvidenceReason } from "@/lib/resources/evidence";
import { EvidenceMark } from "./evidence";

/**
 * The Legend: the single key to every evidence mark on a page.
 *
 * When to use: `variant="full"` wherever evidence marks appear in quantity (the
 * homepage introduction and `/verification`); `variant="popover"` beside a
 * surface that shows marks in use (the confirmed filter region, the Facts
 * heading, the compare page). When not to use: as decoration, or with its own
 * wording; the labels come from `evidenceLabels`, the same words every
 * `EvidenceTag` prints.
 *
 * Keyboard: the full key is static. The popover trigger is a real
 * `type="button"` with `popoverTarget`, so it opens with Enter or Space and needs
 * no JavaScript; Escape and an outside click dismiss it natively.
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

function Key() {
  return (
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
  );
}

export function Legend(props: { variant: "full" } | { variant: "popover"; id: string }) {
  if (props.variant === "full") {
    return (
      <div data-legend="full">
        <p className="kicker">How to read a listing</p>
        <Key />
      </div>
    );
  }

  const { id } = props;
  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        style={{ anchorName: `--${id}` } as CSSProperties}
        className="self-start rounded-xs text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
      >
        What the evidence marks mean
      </button>
      <div
        id={id}
        popover="auto"
        data-legend="popover"
        style={{ positionAnchor: `--${id}` } as CSSProperties}
        className="material-elevated rounded-md text-fg"
      >
        <h4 className="kicker">How to read a listing</h4>
        <Key />
      </div>
    </>
  );
}
