import type { ReactNode } from "react";
import Link from "next/link";
import { stretchedLink } from "@/components/ui/card";
import { headlineLimitation } from "@/lib/resources/derive";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";
import { factMeterCounts } from "../fact-meter-counts";
import { CoordinatesLine } from "./coordinates-line";
import { CardEvidence } from "./evidence";
import { FactMeter } from "./fact-meter";
import { ResourceLogo } from "./resource-logo";
import { ResourceSnapshot } from "./resource-snapshot";
import { LastVerified, VerificationBadge } from "./status-badges";

/**
 * Resource record: a listing in a list, set as a catalogue record.
 *
 * When to use: every list of listings (the library, subject, collection,
 * audience and alternatives pages, the homepage, similar listings). When not to
 * use: inside tables (Quick Compare has its own cells), or for tools and
 * collections, which use their own index rows.
 *
 * Reading order is decision order: what it is, what free means for it, what has
 * been checked, what the catch is, where the record stands.
 *
 * Keyboard: one tab stop. The name is a stretched link over the whole record, so
 * its accessible name is the listing's name. A compare control passed through
 * `compareSlot` sits above the link in the foot.
 *
 * Evidence: two zones, always in this DOM order. Nothing in `data-zone="main"`
 * carries `data-fact`, and the compact snapshot opens `data-zone="facts"`, so the
 * free-status token is the first `[data-fact]` in the record (a smoke contract).
 * Tri-state facts are stated only by `CardEvidence`, unchanged. The fact meter is
 * `aria-hidden` here, because that list names the facts.
 *
 * No hooks and no "use client": server pages and the client explorer both render it.
 */
export function ResourceRecord({
  resource,
  matchReasons = [],
  compareSlot,
}: {
  resource: Resource;
  matchReasons?: string[];
  compareSlot?: ReactNode;
}) {
  const limitation = headlineLimitation(resource);
  const meter = factMeterCounts(resource);

  return (
    <article className="record relative grid p-4" data-record="">
      <div data-zone="main" className="min-w-0">
        <div className="flex items-start gap-3">
          <ResourceLogo logo={resource.logo} size={32} />
          <div className="min-w-0">
            <h3 className="text-xl font-semibold">
              <Link href={`/resources/${resource.slug}`} translate="no" className={cn("rounded-xs", stretchedLink)}>
                {resource.name}
              </Link>
            </h3>
            <CoordinatesLine resource={resource} />
          </div>
        </div>

        <p className="mt-2 text-sm text-fg-muted">{resource.shortDescription}</p>

        {/* No limitation recorded is not a reassurance, so nothing is said. */}
        {limitation ? (
          <p className="mt-2 text-sm text-fg-muted">
            <span className="kicker mr-2">Catch</span>
            {limitation}
          </p>
        ) : null}

        {matchReasons.length > 0 ? (
          <p className="mt-2 text-xs text-fg-subtle">
            <span className="kicker mr-2">Matched</span>
            {matchReasons.join(" · ")}
          </p>
        ) : null}
      </div>

      <div data-zone="facts" className="min-w-0">
        <ResourceSnapshot resource={resource} size="compact" />
        <CardEvidence resource={resource} />
        <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-fg-subtle tabular-nums">
          <span translate="no">Record · {resource.slug}</span>·
          <LastVerified resource={resource} />
          <VerificationBadge resource={resource} />
          <FactMeter confirmed={meter.confirmed} unsettled={meter.unsettled} total={meter.total} />
          {compareSlot}
        </p>
      </div>
    </article>
  );
}

/**
 * Records as a list, so assistive technology announces how many there are
 * before the reader moves through them. `list` is one column at every width;
 * `grid` is two-up from `sm`. Records are separated by hairlines, not boxes.
 */
export function RecordList({
  resources,
  layout,
  label,
  reasonsBySlug,
  renderCompare,
}: {
  resources: Resource[];
  layout: "list" | "grid";
  label?: string;
  reasonsBySlug?: Record<string, string[]>;
  /** Only ResourceExplorer passes this. */
  renderCompare?: (resource: Resource) => ReactNode;
}) {
  return (
    <ul aria-label={label} className="record-list" data-layout={layout}>
      {resources.map((resource) => (
        <li key={resource.slug}>
          <ResourceRecord
            resource={resource}
            matchReasons={reasonsBySlug?.[resource.slug]}
            compareSlot={renderCompare?.(resource)}
          />
        </li>
      ))}
    </ul>
  );
}
