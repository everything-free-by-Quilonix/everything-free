import { Badge } from "@/components/ui/badge";
import { getFreeStatus } from "@/config/free-status";
import { effectiveVerification } from "@/lib/resources/derive";
import { formatMonthYear } from "@/lib/utils/date";
import type { FreeStatus, Resource } from "@/types/resource";

/**
 * The free-status badge.
 *
 * Text, tone and icon all come from `config/free-status.ts`, so a status can be
 * renamed or re-toned once and every surface follows. The label is never
 * abbreviated: "Trial only" must not be shortened to "Trial" anywhere, because
 * the extra word is what stops it reading as an endorsement.
 */
export function FreeStatusBadge({ status, size = "sm" }: { status: FreeStatus; size?: "sm" | "md" }) {
  const definition = getFreeStatus(status);
  return (
    <Badge tone={definition.tone} icon={definition.icon} size={size}>
      {definition.label}
    </Badge>
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
    <Badge tone={definition.tone} icon={definition.icon} size={size}>
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
          <time dateTime={resource.lastVerifiedAt} className="text-fg-muted">
            {formatted}
          </time>
        </>
      ) : (
        "Not yet verified"
      )}
    </span>
  );
}

export function OpenSourceBadge({ license }: { license?: string }) {
  return (
    <Badge tone="primary" icon="repo">
      {license ?? "Open source"}
    </Badge>
  );
}
