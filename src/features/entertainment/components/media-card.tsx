import Link from "next/link";

import { ExternalLink } from "@/components/ui/external-link";
import { buttonClasses } from "@/components/ui/button";
import { stretchedLink } from "@/components/ui/card";
import { accessTypeDefinitions, languageName } from "@/config/media";
import { FreeStatusBadge, LastVerified } from "@/features/resources/components/status-badges";
import { primaryMediaAction, primaryVerb, secondaryMediaAction } from "@/lib/entertainment/actions";
import type { DiscoveryLabel } from "@/lib/entertainment/labels";
import { headlineLimitation, platformLabels } from "@/lib/resources/derive";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

import { MediaCover } from "./media-cover";

/**
 * An entertainment record.
 *
 * Same anatomy and evidence rules as `ResourceCard` — the name links to the
 * listing's page, which holds every fact and its source — plus what matters
 * before clicking through to someone else's site: what is free (the access
 * types), what the content is, where it can be reached, the headline catch, and
 * an action whose wording the evidence decides.
 *
 * Two tab stops: the listing page (stretched over the card) and the official
 * destination. The destination opens in a new tab and says so.
 */
export function MediaCard({
  resource,
  labels = [],
  matchReasons = [],
  className,
  headingLevel = "h3",
}: {
  resource: Resource;
  labels?: DiscoveryLabel[];
  matchReasons?: string[];
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const media = resource.media;
  if (!media) return null;

  const Heading = headingLevel;
  const action = primaryMediaAction(resource);
  const secondary = secondaryMediaAction(resource);
  const verb = primaryVerb(media.formats);
  const limitation = headlineLimitation(resource);
  const platforms = platformLabels(resource).slice(0, 3);
  const languages = media.contentLanguages.slice(0, 3).map(languageName);
  const access = media.access.filter((a) => a !== "unknown").slice(0, 3);
  const isDiscovery = media.offering === "discovery";

  return (
    <article
      data-record=""
      data-offering={media.offering}
      className={cn(
        "group relative flex h-full flex-col rounded-md border border-border bg-surface p-4",
        "transition-[border-color,background-color] hover:border-border-strong hover:bg-surface-hover",
        className,
      )}
    >
      <MediaCover name={resource.name} verb={verb} formats={media.formats} artwork={media.artwork} className="h-20" />

      <div className="mt-3 min-w-0 flex-1">
        <Heading className="font-display text-base font-semibold leading-snug tracking-tight text-fg">
          <Link href={`/resources/${resource.slug}`} className={cn("rounded-xs", stretchedLink)}>
            {resource.name}
          </Link>
        </Heading>
        <p className="mt-0.5 truncate text-2xs text-fg-subtle">{media.provider}</p>

        <p className="mt-2 text-sm leading-relaxed text-fg-muted line-clamp-2">{resource.shortDescription}</p>

        <ul aria-label="What is free" className="mt-2.5 flex flex-wrap gap-1">
          {isDiscovery ? (
            <li className="rounded-xs border border-border-strong px-1.5 py-0.5 text-2xs font-medium text-fg">
              Discovery only — links elsewhere
            </li>
          ) : null}
          {access
            .filter((a) => a !== "free_discovery")
            .map((a) => (
              <li key={a} className="rounded-xs border border-border bg-bg-subtle px-1.5 py-0.5 text-2xs text-fg-muted">
                {accessTypeDefinitions[a].label}
              </li>
            ))}
        </ul>

        {platforms.length > 0 || languages.length > 0 ? (
          <p className="mt-2 truncate text-2xs text-fg-subtle">
            {[platforms.join(" · "), languages.join(", ")].filter(Boolean).join("  —  ")}
          </p>
        ) : null}

        {limitation ? (
          <p className="mt-1.5 text-xs leading-relaxed text-fg-subtle line-clamp-2">
            <span className="mr-1 font-medium text-fg-muted">Catch:</span>
            {limitation}
          </p>
        ) : null}

        {labels.length > 0 ? (
          <ul aria-label="Discovery labels" className="mt-2 flex flex-wrap gap-1">
            {labels.map((label) => (
              <li
                key={label.id}
                title={label.detail}
                className="rounded-xs bg-surface-raised px-1.5 py-0.5 text-2xs font-medium text-fg-muted"
              >
                {label.label}
                {label.detail && label.id === "community-favourite" ? (
                  <span className="sr-only">: {label.detail}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {matchReasons.length > 0 ? (
          <p className="mt-2 text-2xs text-fg-subtle">Matched: {matchReasons.join("; ")}</p>
        ) : null}
      </div>

      <div className="mt-3 border-t border-rule/60 pt-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-subtle">
          <FreeStatusBadge resource={resource} />
          <LastVerified resource={resource} />
        </div>
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
          <ExternalLink
            href={action.href}
            data-action={action.kind}
            className={buttonClasses({ variant: isDiscovery ? "secondary" : "primary", size: "sm" })}
          >
            {action.label}
          </ExternalLink>
          {secondary ? (
            <ExternalLink href={secondary.href} className={buttonClasses({ variant: "ghost", size: "sm" })}>
              {secondary.label}
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function MediaGrid({
  resources,
  labelsBySlug = {},
  reasonsBySlug = {},
  label,
}: {
  resources: readonly Resource[];
  labelsBySlug?: Record<string, DiscoveryLabel[]>;
  reasonsBySlug?: Record<string, string[]>;
  label: string;
}) {
  return (
    <ul aria-label={label} className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {resources.map((resource) => (
        <li key={resource.slug} className="flex">
          <MediaCard
            resource={resource}
            labels={labelsBySlug[resource.slug]}
            matchReasons={reasonsBySlug[resource.slug]}
            className="w-full"
          />
        </li>
      ))}
    </ul>
  );
}
