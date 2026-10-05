import Link from "next/link";
import { Icon } from "@/components/icons";
import { stretchedLink } from "@/components/ui/card";
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
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between rounded-[14px] border border-border/80 bg-surface p-5 sm:p-5.5",
        "shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_-8px_rgba(0,0,0,0.05)]",
        "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_8px_20px_-8px_rgba(0,0,0,0.4)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-[2px] hover:border-border-strong hover:bg-surface-raised",
        "hover:shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_24px_-10px_rgba(0,0,0,0.08)]",
        "dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.4),0_14px_28px_-8px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="flex flex-col">
        {/* Editorial Eyebrow: Category & Platforms + subtle arrow indicator */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium tracking-wide uppercase text-fg-subtle">
          <span className="truncate">
            {categoryName(resource.category)}
            {platforms.length > 0 ? (
              <span className="text-fg-subtle/70">
                {" "}· {platforms.slice(0, 2).join(", ")}
                {platforms.length > 2 ? ` +${platforms.length - 2}` : ""}
              </span>
            ) : null}
          </span>
          <Icon
            name="arrow-up-right"
            size={13}
            className="shrink-0 text-fg-subtle/40 transition-all duration-200 group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        {/* Identity: Logo & Title */}
        <div className="mt-3 flex items-start gap-3">
          <ResourceLogo
            logo={resource.logo}
            officialUrl={resource.officialUrl}
            name={resource.name}
            size={38}
            className="shrink-0 rounded-[8px] border border-border/60 bg-surface-raised/40 p-0.5"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[16.5px] font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-primary">
              <Link
                href={`/resources/${resource.slug}`}
                className={cn(
                  "rounded outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  stretchedLink,
                )}
              >
                {resource.name}
              </Link>
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-2.5 text-[13px] leading-relaxed text-fg-muted line-clamp-2">
          {resource.shortDescription}
        </p>

        {/* Free Status & Open Source Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <FreeStatusBadge resource={resource} size="sm" />
          {resource.openSource && resource.freeStatus !== "OPEN_SOURCE" ? (
            <span
              className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-surface-raised px-2 py-0.5 text-xs text-fg-muted"
              data-fact="openSource"
              data-evidence={openSourceConfirmed ? "confirmed" : "unconfirmed"}
            >
              <Icon name="repo" size={11} />
              Open source
              {openSourceConfirmed ? null : <span className="text-fg-subtle">· unconfirmed</span>}
            </span>
          ) : null}
        </div>

        {/* Evidence Verification Summary */}
        <div className="mt-2.5">
          <CardEvidence resource={resource} />
        </div>

        {/* Key Limitation Callout */}
        {limitation ? (
          <p className="mt-2.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-fg-subtle line-clamp-1">
            <Icon name="alert-triangle" size={12} className="mt-0.5 shrink-0 text-warning-fg" />
            <span className="truncate">
              <span className="sr-only">Key limitation: </span>
              {limitation}
            </span>
          </p>
        ) : null}

        {/* Search Match Reasons */}
        {matchReasons.length > 0 ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {matchReasons.map((reason) => (
              <li
                key={reason}
                className="rounded border border-border/60 bg-bg-subtle px-1.5 py-0.5 text-[10.5px] text-fg-subtle"
              >
                {reason}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Pinned Trust Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3 text-[11.5px]">
        <LastVerified resource={resource} className="text-fg-subtle" />
        <VerificationBadge resource={resource} size="sm" />
      </div>
    </article>
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
        "grid list-none gap-5",
        columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
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
