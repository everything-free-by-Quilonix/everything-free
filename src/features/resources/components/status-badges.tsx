import { Badge } from "@/components/ui/badge";
import { getFreeStatus } from "@/config/free-status";
import { effectiveVerification } from "@/lib/resources/derive";
import { factEvidence } from "@/lib/resources/evidence";
import { formatMonthYear } from "@/lib/utils/date";
import type { Resource } from "@/types/resource";

/**
 * The free-status badge.
 *
 * Text comes from `config/free-status.ts`, so a status can be renamed once and
 * every surface follows. The badge is word-only: the config's icons reuse the
 * reserved evidence glyphs, so they are not rendered. The label is never abbreviated: "Trial only" must not
 * be shortened to "Trial" anywhere, because the extra word is what stops it reading
 * as an endorsement.
 *
 * Colour follows the evidence, not the value. A "Free" that an official source
 * confirms gets its status colour; a "Free" that is only recorded is shown in the
 * neutral style, with "not verified" in its accessible name, so an unchecked
 * classification never looks like a confirmed one. The card beside it lists
 * "free status" under *Not verified* in words.
 */
export function FreeStatusBadge({
  resource,
  size = "sm",
  variant = "badge",
}: {
  resource: Resource;
  size?: "sm" | "md";
  /** "token": the same wrapper and words, as a transparent ledger token inside a record. */
  variant?: "badge" | "token";
}) {
  const definition = getFreeStatus(resource.freeStatus);
  const evidence = factEvidence(resource, "freeStatus");
  const confirmed = evidence.state === "confirmed";
  return (
    <span className="inline-flex" data-fact="freeStatus" data-evidence={evidence.state}>
      <Badge
        tone={confirmed ? definition.tone : "neutral"}
        size={size}
        appearance={variant === "token" ? "ledger" : "badge"}
      >
        {definition.label}
        {confirmed ? null : <span className="sr-only"> (free status not verified)</span>}
      </Badge>
    </span>
  );
}

/**
 * The verification badge.
 *
 * Uses `effectiveVerification`, which downgrades a stale verification to "needs
 * re-checking" based on its age. A badge that says "Verified" against a date two
 * years old is worse than no badge.
 */
export function VerificationBadge({ resource, size = "sm" }: { resource: Resource; size?: "sm" | "md" }) {
  const definition = effectiveVerification(resource);
  return (
    <Badge tone={definition.tone} size={size}>
      {definition.label}
    </Badge>
  );
}

/**
 * "Last checked September 2026", or an explicit statement that it never has been.
 *
 * "Checked", not "verified": a date means some checks were recorded then, which is
 * not the same as the listing being Verified — the badge next to it says which. The
 * absent case is spelled out rather than omitted, because a missing date is
 * information the user needs, not an empty field to hide.
 */
export function LastVerified({ resource, className }: { resource: Resource; className?: string }) {
  const formatted = formatMonthYear(resource.lastVerifiedAt);

  return (
    <span className={className}>
      {formatted ? (
        <>
          Last checked{" "}
          <time dateTime={resource.lastVerifiedAt} className="text-fg-muted tabular-nums">
            {formatted}
          </time>
        </>
      ) : (
        "Never checked"
      )}
    </span>
  );
}

/**
 * Open source, as a classification: always neutral, never a tone.
 *
 * `variant="token"` is the record's secondary claim. It states its own evidence
 * rather than leaning on the free-status token: `data-evidence` is the fact's
 * state from `factEvidence` (so `unknown` and `unconfirmed` are both carried),
 * and an unconfirmed value says "not verified" in visible words.
 */
export function OpenSourceBadge(
  props: { variant?: "badge"; license?: string } | { variant: "token"; resource: Resource },
) {
  if (props.variant !== "token") {
    return (
      <Badge tone="neutral" icon="repo">
        {props.license ?? "Open source"}
      </Badge>
    );
  }

  const evidence = factEvidence(props.resource, "openSource");
  const confirmed = evidence.state === "confirmed";
  return (
    <span className="inline-flex" data-fact="openSource" data-evidence={evidence.state}>
      <Badge tone="neutral" appearance="ledger">
        Open source
        {confirmed ? null : <span className="text-fg-subtle">· not verified</span>}
      </Badge>
    </span>
  );
}
