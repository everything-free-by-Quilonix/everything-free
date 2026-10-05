import Link from "next/link";

import { plural } from "@/components/ui/count";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/utils/format";

/**
 * Atlas Index: every subject in the library with its live listing count, set
 * like the index at the back of an atlas (concept C4).
 *
 * When to use: the homepage "Browse by category" section and `/categories`.
 * When not to use: as navigation chrome or a tag cloud; counts are the point.
 *
 * Keyboard: plain links in reading order, group by group. Each link's name is
 * "{subject}, {n} listings"; the dotted leader is hidden. A subject with no
 * listings stays visible as muted text with "0" and is not a link, because
 * the index is honest about empty territory.
 *
 * Evidence: none. Counts are `computeFacets` over the library (category plus
 * subcategories), passed in by the page; a subject in two groups is listed in
 * both and links to its one canonical page.
 *
 * No hooks and no "use client": the server pages render it, and the
 * `/categories` filter island renders it with a narrowed set.
 */
export interface AtlasSubject {
  id: string;
  slug: string;
  name: string;
  count: number;
}

export interface AtlasGroup {
  id: string;
  name: string;
  subjects: AtlasSubject[];
}

export function AtlasIndex({
  groups,
  headingLevel = "h3",
  anchors = false,
}: {
  groups: readonly AtlasGroup[];
  headingLevel?: "h2" | "h3";
  /** Give each group its `id`, for the `/categories#{group}` links. One page only. */
  anchors?: boolean;
}) {
  const Heading = headingLevel;
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => (
        <section
          key={group.id}
          id={anchors ? group.id : undefined}
          aria-labelledby={`atlas-${group.id}`}
          className="min-w-0"
        >
          <Heading id={`atlas-${group.id}`} className="border-b border-rule pb-2 font-serif text-lg font-semibold">
            {group.name}
          </Heading>
          <ul className="mt-1">
            {group.subjects.map((subject) => {
              const row = "flex items-baseline gap-2 py-1.5 text-sm pointer-coarse:py-2.5";
              const count = (
                <span className="shrink-0 tabular-nums">{formatCount(subject.count)}</span>
              );
              const leader = <span aria-hidden="true" className="flex-1 border-b border-dotted border-rule" />;
              return (
                <li key={subject.id}>
                  {subject.count > 0 ? (
                    <Link
                      href={`/categories/${subject.slug}`}
                      aria-label={`${subject.name}, ${formatCount(subject.count)} ${plural(subject.count, "listing", "listings")}`}
                      className={cn(row, "group rounded-xs text-fg")}
                    >
                      <span className="min-w-0 underline-offset-[0.2em] group-hover:underline">
                        {subject.name}
                      </span>
                      {leader}
                      <span className="text-fg-muted">{count}</span>
                    </Link>
                  ) : (
                    <span className={cn(row, "text-fg-subtle")}>
                      <span className="min-w-0">{subject.name}</span>
                      {leader}
                      {count}
                      <span className="sr-only"> listings</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
