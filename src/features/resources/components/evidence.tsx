import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/icons";
import { ExternalLink, displayHost } from "@/components/ui/external-link";
import {
  cardEvidenceSummary,
  evidenceExplanation,
  evidenceLabels,
  factEvidence,
  hasRecordedValue,
  type EvidenceReason,
  type Fact,
  type FactEvidence,
} from "@/lib/resources/evidence";
import { cn } from "@/lib/utils/cn";
import { formatFullDate, formatMonthYear } from "@/lib/utils/date";
import type { Resource } from "@/types/resource";

/**
 * The visual language for fact-level evidence.
 *
 * Every state has its own icon *and* its own word, so nothing depends on colour:
 *
 *   check-circle  Confirmed          — an official source confirms it       (success)
 *   help-circle   Not confirmed      — looked for, not settled               (warning)
 *   clock         Needs re-checking  — was confirmed, the check has expired  (warning)
 *   minus-circle  Not verified       — recorded, never checked               (neutral)
 *   help-circle   Unknown            — not established either way            (neutral)
 *
 * These four glyphs are reserved: they are rendered only through `EvidenceMark`
 * below, so the Legend is the single key for every evidence symbol on a page.
 *
 * Only `Confirmed` uses the success colour. A value that exists but has not been
 * checked is shown in the same muted style as an unknown one, so a reader cannot
 * mistake "someone typed no" for "the provider says no".
 */

const STYLE: Record<EvidenceReason, { icon: IconName; className: string }> = {
  confirmed: { icon: "check-circle", className: "text-success-fg" },
  unresolved: { icon: "help-circle", className: "text-warning-fg" },
  stale: { icon: "clock", className: "text-warning-fg" },
  "not-checked": { icon: "minus-circle", className: "text-fg-subtle" },
  "not-established": { icon: "help-circle", className: "text-fg-subtle" },
};

/**
 * The glyph for one evidence reason, in its colour. The only way any surface
 * draws an evidence symbol; it is never restyled by its caller, and it is always
 * paired with the reason's word by that caller.
 */
export function EvidenceMark({
  reason,
  size = 12,
  className,
}: {
  reason: EvidenceReason;
  size?: number;
  className?: string;
}) {
  const style = STYLE[reason];
  return <Icon name={style.icon} size={size} className={cn("shrink-0", style.className, className)} />;
}

/** "✓ Confirmed", "– Not verified": the evidence state of one fact, as a small inline label. */
export function EvidenceTag({
  evidence,
  className,
}: {
  /** Only the state and reason are read, so a build-time index cell can be passed as is. */
  evidence: Pick<FactEvidence, "state" | "reason">;
  className?: string;
}) {
  const style = STYLE[evidence.reason];
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs font-medium", style.className, className)}
      data-evidence={evidence.state}
      data-evidence-reason={evidence.reason}
    >
      <EvidenceMark reason={evidence.reason} />
      {evidenceLabels[evidence.reason]}
    </span>
  );
}

/**
 * The card's evidence summary: at most one short line per state.
 *
 *   ✓ Confirmed: no credit card needed, commercial use allowed
 *   ? Not confirmed: credit card
 *   – Not verified: free status, account
 *
 * Confirmed facts say their value; everything else is named without one, because a
 * card has no room to explain an unconfirmed value and must not appear to make the
 * claim. The detail page carries the values and the reasons.
 */
export function CardEvidence({ resource }: { resource: Resource }) {
  const groups = cardEvidenceSummary(resource);
  if (groups.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-col gap-1" aria-label="What has been checked">
      {groups.map((group) => {
        return (
          <li
            key={group.reason}
            className="flex items-start gap-1.5 text-xs leading-snug"
            data-evidence-group={group.reason}
          >
            <EvidenceMark reason={group.reason} size={13} className="mt-px" />
            <span className={group.reason === "confirmed" ? "text-fg-muted" : "text-fg-subtle"}>
              <span className={cn("font-medium", group.reason === "confirmed" ? "text-fg" : "text-fg-muted")}>
                {group.label}:
              </span>{" "}
              {group.items.map((item, index) => (
                <span key={item.fact} data-fact={item.fact} data-evidence-reason={group.reason}>
                  {item.text}
                  {index < group.items.length - 1 ? ", " : null}
                </span>
              ))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A fact on a detail page: its value, its evidence state, and — on request — how
 * we know. The disclosure is a native `<details>`, so it works without JavaScript
 * and with any assistive technology.
 */
export function FactValue({
  resource,
  fact,
  value,
  unconfirmedValue,
}: {
  resource: Resource;
  fact: Fact;
  /** The value as a person should read it when confirmed, e.g. "No credit card needed". */
  value: ReactNode;
  /**
   * How to phrase a recorded-but-unchecked value, e.g. "Recorded as no". Defaults
   * to "Recorded as …", so an unchecked value is never shown bare.
   */
  unconfirmedValue?: ReactNode;
}) {
  const evidence = factEvidence(resource, fact);
  const recorded = hasRecordedValue(resource, fact);
  const shown =
    evidence.state === "confirmed" ? (
      <span className="text-fg">{value}</span>
    ) : recorded ? (
      // Includes "looked for, not settled" when something is still recorded — the
      // Stirling PDF free status, for example — so the reader sees what is claimed
      // and, beside it, that it is not confirmed.
      <span className="text-fg-muted">{unconfirmedValue ?? <>Recorded as {value}</>}</span>
    ) : (
      <span className="text-fg-muted">Unknown</span>
    );

  return (
    <div className="flex flex-col gap-1">
      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {shown}
        <EvidenceTag evidence={evidence} />
      </span>
      <EvidenceDetails evidence={evidence} />
    </div>
  );
}

/** "How we know" — the source, the date it was read, who read it, what it says. */
export function EvidenceDetails({ evidence }: { evidence: FactEvidence }) {
  const { record, source } = evidence;
  return (
    // Opens instantly (no motion-details): its text is read the moment it
    // opens, by people scanning a row and by the detail-page smoke audit.
    <details className="group text-xs">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-xs text-fg-subtle underline-offset-2 hover:text-fg hover:underline pointer-coarse:py-2 [&::-webkit-details-marker]:hidden">
        How we know
        <Icon
          name="chevron-down"
          size={12}
          className="motion-chevron group-open:rotate-180"
        />
      </summary>
      <div className="mt-1.5 flex flex-col gap-1 rounded-xs border border-border bg-bg-subtle px-2.5 py-2 leading-relaxed text-fg-muted">
        <p>{evidenceExplanation(evidence)}</p>
        {record ? <p>{record.evidence}</p> : null}
        {source ? (
          <p className="text-fg-subtle">
            Source:{" "}
            <ExternalLink
              href={source.url}
              announceExternal={false}
              className="link-inline"
              translate="no"
            >
              {displayHost(source.url)}
            </ExternalLink>{" "}
            · read <time dateTime={source.retrievedAt}>{formatFullDate(source.retrievedAt)}</time>
          </p>
        ) : null}
        {evidence.checkedBy ? (
          <p className="text-fg-subtle">
            Checked by {evidence.checkedBy}
            {evidence.checkedAt ? (
              <>
                {" "}
                · <time dateTime={evidence.checkedAt}>{formatMonthYear(evidence.checkedAt)}</time>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </details>
  );
}
