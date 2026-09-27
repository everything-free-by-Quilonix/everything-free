import Link from "next/link";
import { Icon } from "@/components/icons";
import { Card, stretchedLink } from "@/components/ui/card";
import { categoryName } from "@/config/categories";
import { headlineLimitation, platformLabels } from "@/lib/resources/derive";
import { isFactConfirmed } from "@/lib/resources/evidence";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";
import { CardEvidence } from "./evidence";
import { ResourceLogo } from "./resource-logo";
import { FreeStatusBadge, LastVerified, VerificationBadge } from "./status-badges";

/**
 * The resource card.
 *
 * Information hierarchy, in the order a user needs it to decide whether to click:
 * what it is, what it costs them, where it runs, what the catch is, and how much
 * to trust the entry. Anything beyond that belongs on the detail page — a card
 * that shows everything helps nobody compare.
 *
 * Interaction: the card is one large target via a stretched link to the detail
 * page, but there is still exactly one anchor for the card body, so keyboard
 * users get a single tab stop with a sensible accessible name. `matchReasons`
 * appear only on search results, where explaining the match is the point.
 */
export function ResourceCard({
  resource,
  matchReasons = [],
  className,
}: {
  resource: Resource;
  matchReasons?: string[];
  className?: string;
}) {
  const platforms = platformLabels(resource);
  const limitation = headlineLimitation(resource);
  const openSourceConfirmed = isFactConfirmed(resource, "openSource");

  return (
    <Card as="article" interactive className={cn("flex h-full flex-col p-5", className)}>
      <div className="flex items-start gap-3">
        <ResourceLogo logo={resource.logo} size={40} />

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base leading-tight font-semibold">
            <Link href={`/resources/${resource.slug}`} className={cn("rounded", stretchedLink)}>
              {resource.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-fg-subtle">{categoryName(resource.category)}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{resource.shortDescription}</p>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <FreeStatusBadge resource={resource} />
        {resource.openSource && resource.freeStatus !== "OPEN_SOURCE" ? (
          // A secondary claim, so it states its own evidence rather than leaning on
          // the listing's badge.
          <span
            className="inline-flex items-center gap-1 rounded-md bg-surface-raised px-2 py-0.5 text-xs text-fg-muted"
            data-fact="openSource"
            data-evidence={openSourceConfirmed ? "confirmed" : "unconfirmed"}
          >
            <Icon name="repo" size={12} />
            Open source
            {openSourceConfirmed ? null : <span className="text-fg-subtle">· not verified</span>}
          </span>
        ) : null}
      </div>

      {platforms.length > 0 ? (
        <p className="mt-3 text-xs text-fg-muted">
          <span className="sr-only">Available on: </span>
          {platforms.join(" · ")}
        </p>
      ) : null}

      <CardEvidence resource={resource} />

      {limitation ? (
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-fg-subtle">
          <Icon name="alert-triangle" size={13} className="mt-0.5 shrink-0 text-warning-fg" />
          <span>
            <span className="sr-only">Key limitation: </span>
            {limitation}
          </span>
        </p>
      ) : null}

      {matchReasons.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {matchReasons.map((reason) => (
            <li
              key={reason}
              className="rounded-md border border-border bg-bg-subtle px-1.5 py-0.5 text-[11px] text-fg-subtle"
            >
              {reason}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Trust row is pinned to the bottom so it lines up across a grid of cards
          with differing body lengths. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <LastVerified resource={resource} className="text-xs text-fg-subtle" />
        <VerificationBadge resource={resource} />
      </div>
    </Card>
  );
}

/**
 * A grid of cards.
 *
 * Rendered as a list so assistive technology announces how many results there
 * are before the user starts moving through them.
 */
export function ResourceGrid({
  resources,
  reasonsBySlug,
  columns = 3,
  label,
}: {
  resources: Resource[];
  reasonsBySlug?: Record<string, string[]>;
  columns?: 2 | 3;
  label?: string;
}) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "grid list-none gap-4",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {resources.map((resource) => (
        <li key={resource.slug} className="flex">
          <ResourceCard
            resource={resource}
            matchReasons={reasonsBySlug?.[resource.slug]}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
}
