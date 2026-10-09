import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { stretchedLink } from "@/components/ui/card";
import { categoryName } from "@/config/categories";
import { headlineLimitation, platformLabels } from "@/lib/resources/derive";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";
import { CardEvidence } from "./evidence";
import { ResourceLogo } from "./resource-logo";
import { ResourceSnapshot } from "./resource-snapshot";
import { LastVerified, VerificationBadge } from "./status-badges";

/**
 * Editorial Resource Card.
 *
 * Implements the Apple/Linear editorial hierarchy:
 * 1. Category eyebrow (CATEGORY)
 * 2. Resource identity (Logo + Name + Platforms)
 * 3. Concise editorial description (2-line clamp)
 * 4. Transparent limitation note (if recorded)
 * 5. Disciplined free-status & verification badges
 *
 * Interaction:
 * - Subtle 1-2px lift on hover
 * - Slightly stronger border & shadow
 * - Small directional arrow movement
 * - Zero 3D tilt, zero neon glow
 * - Single accessible tab stop via stretched link
 */
export function ResourceCard({
  resource,
  matchReasons = [],
  compareSlot,
  className,
}: {
  resource: Resource;
  matchReasons?: string[];
  compareSlot?: ReactNode;
  className?: string;
}) {
  const limitation = headlineLimitation(resource);
  const platforms = platformLabels(resource);

  return (
    <article
      data-record=""
      className={cn(
        "group relative flex h-full flex-col justify-between rounded-md border border-border bg-surface p-5 text-left",
        "transition-[border-color,background-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:shadow-xs",
        className,
      )}
    >
      <div data-zone="main">
        {/* Top: Category eyebrow + Subtle external arrow */}
        <div className="flex items-center justify-between gap-2">
          <span className="kicker truncate">{categoryName(resource.category)}</span>
          <div
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-xs text-fg-subtle opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-fg"
          >
            <Icon name="arrow-up-right" size={13} />
          </div>
        </div>

        {/* Title + Logo */}
        <div className="mt-3 flex items-start gap-3">
          <ResourceLogo
            logo={resource.logo}
            officialUrl={resource.officialUrl}
            name={resource.name}
            size={38}
            className="shrink-0 rounded-md border border-border bg-surface-raised p-0.5"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-fg">
              <Link
                href={`/resources/${resource.slug}`}
                className={cn("rounded-xs", stretchedLink)}
              >
                {resource.name}
              </Link>
            </h3>

            {platforms.length > 0 ? (
              <p className="mt-0.5 truncate text-2xs text-fg-subtle">
                {platforms.slice(0, 3).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-3 text-sm leading-relaxed text-fg-muted line-clamp-2">
          {resource.shortDescription}
        </p>

        {/* Catch / Limitation note */}
        {limitation ? (
          <p className="mt-2 text-xs leading-relaxed text-fg-subtle line-clamp-1">
            <span className="font-medium text-fg-muted mr-1.5">Limit:</span>
            {limitation}
          </p>
        ) : null}

        {/* Search match reasons */}
        {matchReasons.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {matchReasons.map((reason) => (
              <span
                key={reason}
                className="rounded-xs border border-border bg-bg-subtle px-1.5 py-0.5 text-2xs text-fg-subtle"
              >
                {reason}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Facts Zone: Free Status, Open Source, Evidence & Verification */}
      <div data-zone="facts" className="mt-4 border-t border-rule/60 pt-3">
        <ResourceSnapshot resource={resource} size="compact" />
        <CardEvidence resource={resource} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
          <div className="flex flex-wrap items-center gap-1.5">
            <LastVerified resource={resource} />
            <VerificationBadge resource={resource} size="sm" />
          </div>
          {compareSlot ? (
            <div className="relative z-10 shrink-0">{compareSlot}</div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * Responsive Grid of Resource Cards.
 */
export function ResourceGrid({
  resources,
  reasonsBySlug,
  columns = 3,
  label,
  renderCompare,
}: {
  resources: Resource[];
  reasonsBySlug?: Record<string, string[]>;
  columns?: 2 | 3;
  label?: string;
  renderCompare?: (resource: Resource) => ReactNode;
}) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "grid list-none gap-4 sm:gap-5",
        columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {resources.map((resource) => (
        <li key={resource.slug} className="flex">
          <ResourceCard
            resource={resource}
            matchReasons={reasonsBySlug?.[resource.slug]}
            compareSlot={renderCompare?.(resource)}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
}

