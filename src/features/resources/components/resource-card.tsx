import Link from "next/link";
import { Icon } from "@/components/icons";
import { stretchedLink } from "@/components/ui/card";
import { categoryName } from "@/config/categories";
import { effectiveVerification, headlineLimitation, platformLabels } from "@/lib/resources/derive";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";
import { ResourceLogo } from "./resource-logo";
import { FreeStatusBadge } from "./status-badges";

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
  const verification = effectiveVerification(resource);

  const noCard = resource.requiresCreditCard === "no";
  const noAccount = resource.requiresAccount === "no";
  const commercialOk = resource.commercialUse === "yes";
  const isOpenSource = resource.openSource;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl",
        "border border-border/70 bg-surface/80 dark:bg-surface/50 p-4 sm:p-4.5",
        "backdrop-blur-xs transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:border-primary/50 hover:bg-surface-raised/95",
        "hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.04)]",
        "dark:hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]",
        className,
      )}
    >
      {/* Subtle top edge glow on card hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Header: Authentic Logo + Title + Category + Quick Arrow */}
        <div className="flex items-start gap-3">
          <ResourceLogo
            logo={resource.logo}
            officialUrl={resource.officialUrl}
            name={resource.name}
            size={42}
            className="shrink-0 rounded-xl border border-border/70 bg-surface-raised/80 p-1 shadow-2xs transition-transform duration-200 group-hover:scale-105"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="font-display text-[15.5px] font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-primary">
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

              <Icon
                name="arrow-up-right"
                size={13}
                className="shrink-0 text-fg-subtle/30 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>

            {/* Category & Platform line */}
            <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
              {categoryName(resource.category)}
              {platforms.length > 0 ? (
                <span className="normal-case tracking-normal text-fg-subtle/80">
                  {" "}· {platforms.slice(0, 2).join(", ")}
                  {platforms.length > 2 ? ` +${platforms.length - 2}` : ""}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        {/* Short Description (Clean 2-line clamp) */}
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-fg-muted line-clamp-2">
          {resource.shortDescription}
        </p>

        {/* Key Feature & Verification micro-pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <FreeStatusBadge resource={resource} size="sm" />

          {noCard ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
              <Icon name="check" size={10} className="shrink-0" />
              No card
            </span>
          ) : null}

          {noAccount ? (
            <span className="inline-flex items-center rounded-md border border-border/60 bg-surface-raised px-2 py-0.5 text-[10.5px] font-medium text-fg-muted">
              No sign-up
            </span>
          ) : null}

          {commercialOk ? (
            <span className="inline-flex items-center rounded-md border border-border/60 bg-surface-raised px-2 py-0.5 text-[10.5px] font-medium text-fg-muted">
              Commercial OK
            </span>
          ) : null}

          {isOpenSource && resource.freeStatus !== "OPEN_SOURCE" ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-surface-raised px-2 py-0.5 text-[10.5px] font-medium text-fg-muted">
              <Icon name="repo" size={10} className="shrink-0 text-fg-subtle" />
              Open source
            </span>
          ) : null}
        </div>

        {/* Single-line Limitation Warning (Compact) */}
        {limitation ? (
          <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-warning-border/40 bg-warning-surface/30 px-2 py-1 text-[11px] text-fg-subtle">
            <Icon name="alert-triangle" size={11} className="shrink-0 text-warning-fg" />
            <span className="truncate">{limitation}</span>
          </div>
        ) : null}

        {/* Search Match Reasons */}
        {matchReasons.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1">
            {matchReasons.map((reason) => (
              <li
                key={reason}
                className="rounded border border-border/60 bg-bg-subtle px-1.5 py-0.5 text-[10px] text-fg-subtle"
              >
                {reason}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Sleek Bottom Bar: Trust Dot & Verification + Last checked */}
      <div className="mt-3.5 flex items-center justify-between border-t border-border/40 pt-2.5 text-[11px] text-fg-subtle">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              verification.tone === "success"
                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                : verification.tone === "primary"
                  ? "bg-primary shadow-[0_0_6px_rgba(var(--primary-rgb),0.5)]"
                  : verification.tone === "warning"
                    ? "bg-amber-500"
                    : "bg-fg-subtle/40",
            )}
          />
          <span className="font-medium text-fg-muted">{verification.label}</span>
        </div>

        <span className="text-[10.5px] text-fg-subtle/70 group-hover:text-primary transition-colors flex items-center gap-0.5 font-medium">
          View details
          <Icon name="arrow-up-right" size={11} className="transition-transform group-hover:translate-x-0.5" />
        </span>
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
