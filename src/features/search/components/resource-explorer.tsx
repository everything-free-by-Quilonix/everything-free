"use client";

import { useCallback, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { RecordList } from "@/features/resources/components/resource-record";
import { countActiveFilters, EVIDENCE_FILTER_KEYS } from "@/lib/search/filters";
import { parseSearchParams, searchParamsToInput } from "@/lib/search/params";
import { runSearch } from "@/lib/search/run-search";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

import { ActiveFilters } from "./active-filters";
import { EvidenceGate } from "./evidence-gate";
import { FilterPanel } from "./filter-panel";
import { Pagination } from "./pagination";
import { ResultsToolbar } from "./results-toolbar";
import { SearchBox } from "./search-box";
import { SortSelect } from "./sort-select";

/**
 * The browse and search experience, executed in the browser.
 *
 * Why this is a client component rather than a server-rendered page:
 *
 * Reading `searchParams` on the server forces the route to be rendered per
 * request, which means the application needs a running server — and a running
 * server means a hosting bill, or dependence on a provider's free-tier limits.
 * Doing the filtering here instead makes `/resources` a static file that any free
 * static host can serve, and removes the possibility of runtime cost entirely.
 *
 * What this costs, stated plainly:
 *
 * - Filtering requires JavaScript. Without it, this page shows the unfiltered
 *   library rather than applying URL filters. The rest of the library — every
 *   resource, category, collection and alternatives page — is static HTML and
 *   works with JavaScript disabled.
 * - Search result titles are no longer per-query. Those pages were already
 *   `noIndex`, so nothing indexable was lost.
 * - The whole listable library is sent to the browser. That is the honest
 *   scaling limit of this approach, and it is the same threshold at which a
 *   database starts being worthwhile. See `docs/architecture.md`.
 *
 * What this does *not* cost: search behaviour. The ranking runs through the same
 * `runSearch` used by the repository, so results are identical to what a
 * server-rendered version would produce.
 */
export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // One transition for every filter and sort change, so the results region
  // carries one pending state whichever control started it.
  const [isPending, startTransition] = useTransition();
  const navigate = useCallback(
    (href: string) => startTransition(() => router.push(href, { scroll: false })),
    [router],
  );

  // Recomputed only when the URL changes. At this library size the full pipeline
  // is well under a frame, so there is no need for debouncing or a worker.
  const { query, outcome } = useMemo(() => {
    const parsed = parseSearchParams(searchParamsToInput(new URLSearchParams(searchParams.toString())));
    return { query: parsed, outcome: runSearch(resources, parsed) };
  }, [resources, searchParams]);

  const { results, facets, effectiveQuery, inferredFilters, excludedByEvidence } = outcome;
  const evidenceFilterActive = EVIDENCE_FILTER_KEYS.some((key) => effectiveQuery[key]);

  const items = results.items.map((match) => match.resource);
  const reasonsBySlug = Object.fromEntries(
    results.items
      .filter((match) => match.matchReasons.length > 0)
      .map((match) => [match.resource.slug, match.matchReasons]),
  );

  const activeCount = countActiveFilters(effectiveQuery);
  const isSearch = Boolean(query.q);

  return (
    <>
      <div className="border-b border-border bg-bg-subtle py-8">
        <div className="mx-auto w-full max-w-(--container-content) px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-semibold">
            {isSearch ? (
              <>
                Results for <span className="text-fg">“{query.q}”</span>
              </>
            ) : (
              "Browse free resources"
            )}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-fg-muted">
            Every entry states what “free” means for it, what the limits are, and which of its facts an official source
            confirms.
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBox key={query.q ?? ""} defaultValue={query.q ?? ""} size="md" label="Search free resources" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-(--container-content) px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside aria-label="Filter resources">
            <FilterPanel
              facets={facets}
              resultCount={results.total}
              activeFilterCount={activeCount}
              isPending={isPending}
              onNavigate={navigate}
            />
          </aside>

          <div className="min-w-0">
            <ResultsToolbar
              total={results.total}
              page={results.page}
              totalPages={results.totalPages}
              filtered={isSearch || activeCount > 0}
              gate={
                evidenceFilterActive ? (
                  <EvidenceGate total={results.total} heldBack={excludedByEvidence} q={effectiveQuery.q} />
                ) : null
              }
            >
              <SortSelect hasQuery={isSearch} isPending={isPending} onNavigate={navigate} />
            </ResultsToolbar>

            <div className="mt-4">
              <ActiveFilters query={effectiveQuery} inferredFilters={inferredFilters} />
            </div>

            {inferredFilters.length > 0 ? (
              <Callout tone="neutral" icon={null} className="mt-4">
                Your wording set {inferredFilters.length === 1 ? "a filter" : "some filters"} automatically:{" "}
                {inferredFilters.map((filter) => filter.label).join(", ")}. Remove any that do not apply using the filters
                above.
              </Callout>
            ) : null}

            {evidenceFilterActive ? (
              // A confirmed-only filter holds listings back. Saying how many — and
              // why — is the difference between an honest filter and a thin one.
              <Callout id="evidence-filter-notice" tone="neutral" icon={null} className="mt-4">
                <span data-testid="evidence-filter-notice">
                  Filters marked <span className="font-medium text-fg">confirmed</span> only include listings where an
                  official source confirms the fact.{" "}
                  {excludedByEvidence > 0
                    ? `${formatCount(excludedByEvidence)} more ${excludedByEvidence === 1 ? "listing records" : "listings record"} it but ${excludedByEvidence === 1 ? "has" : "have"} not been checked yet, so ${excludedByEvidence === 1 ? "it is" : "they are"} not shown. Remove the filter to see them, each with its evidence stated.`
                    : "No other listing records it without confirmation."}
                </span>
              </Callout>
            ) : null}

            {results.relaxedMatching ? (
              <Callout tone="neutral" icon="info" className="mt-4">
                Few resources matched every word, so results matching only part of your search are included below.
                Closest matches come first, and each listing shows why it matched.
              </Callout>
            ) : null}

            {/* The results region carries the pending state: busy for assistive
                technology, dimmed for sight, while the URL change is applied. */}
            <div className={isPending ? "mt-6 opacity-60" : "mt-6"} aria-busy={isPending || undefined}>
              {items.length > 0 ? (
                <>
                  <RecordList layout="list"
                    resources={items}
                    reasonsBySlug={reasonsBySlug}
                    label={isSearch ? `Search results for ${query.q}` : "All resources"}
                  />

                  {results.totalPages > 1 ? (
                    <div className="mt-10">
                      <Pagination query={effectiveQuery} page={results.page} totalPages={results.totalPages} />
                    </div>
                  ) : null}
                </>
              ) : (
                <EmptyState
                  title={isSearch ? `Nothing matched “${query.q}”` : "No resources match these filters"}
                  description={
                    <div className="flex flex-col gap-3">
                      <p>
                        The library is still small and deliberately curated rather than scraped, so there are genuine
                        gaps. Two things usually help: remove a filter, or use a broader term.
                      </p>
                      <p className="text-fg-subtle">
                        If you know something free that belongs here, adding it takes a couple of minutes.
                      </p>
                    </div>
                  }
                  action={
                    <div className="flex flex-wrap justify-center gap-3">
                      {activeCount > 0 ? (
                        <Link
                          href={query.q ? `/resources?q=${encodeURIComponent(query.q)}` : "/resources"}
                          className={buttonClasses({ variant: "secondary" })}
                        >
                          Clear filters
                        </Link>
                      ) : null}
                      <Link href="/submit" className={buttonClasses({ variant: "primary" })}>
                        <Icon name="plus" size={16} />
                        Submit a resource
                      </Link>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
