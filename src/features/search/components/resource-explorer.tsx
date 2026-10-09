"use client";

import { useCallback, useMemo, useReducer, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";


import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { compareSelection, MAX_COMPARE } from "@/features/compare/compare-params";
import { CompareToggle } from "@/features/compare/compare-toggle";
import { CompareTray } from "@/features/compare/compare-tray";
import { countActiveFilters, EVIDENCE_FILTER_KEYS } from "@/lib/search/filters";
import { buildResourcesHref, parseSearchParams, searchParamsToInput } from "@/lib/search/params";
import { runSearch } from "@/lib/search/run-search";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

import { ActiveFilters } from "./active-filters";
import { AnimatedResourceGrid } from "./animated-resource-grid";
import { CategoryFilterBar } from "./category-filter-bar";
import { EvidenceGate } from "./evidence-gate";
import { clearFiltersHref, FilterPanel } from "./filter-panel";
import { FilterSheet } from "./filter-sheet";
import { Pagination } from "./pagination";
import { ResultsToolbar } from "./results-toolbar";
import { SearchBox } from "./search-box";
import { SortSelect } from "./sort-select";

/**
 * Editorial Resource Catalogue.
 *
 * Implements the redesigned catalogue architecture:
 * 1. Clean, focused header with RESOURCES eyebrow and concise description
 * 2. Premium search field with beam feedback
 * 3. Dynamic category filter row with live counts and segmented styling
 * 4. Quiet results count and secondary sorting control
 * 5. Animated grid reflow reorganizing cards smoothly across category transitions
 * 6. Clean pagination and full URL state synchronization
 */
export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const navigate = useCallback(
    (href: string) => startTransition(() => router.push(href, { scroll: false })),
    [router],
  );

  const [sheetOpen, setSheetOpen] = useState(false);
  const [compare, dispatchCompare] = useReducer(compareSelection, []);
  const nameBySlug = useMemo(() => new Map(resources.map((r) => [r.slug, r.name])), [resources]);

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
  const activeCategoryId = effectiveQuery.categories?.[0] ?? "all";

  const handleSelectCategory = (categoryId: string) => {
    const nextCategories = categoryId === "all" ? [] : [categoryId];
    const nextQuery = { ...effectiveQuery, categories: nextCategories, page: 1 };
    navigate(buildResourcesHref(nextQuery));
  };

  return (
    <>
      {/* 01. Editorial Catalogue Header */}
      <div className="border-b border-border bg-bg-subtle/60 py-8 sm:py-10">
        <div className="mx-auto w-full max-w-(--container-content) px-4 sm:px-6 lg:px-8">
          <div className="text-2xs font-semibold uppercase tracking-widest text-fg-subtle">
            RESOURCES
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            {isSearch ? (
              <>
                Results for <span className="text-fg">“{query.q}”</span>
              </>
            ) : (
              "All free resources"
            )}
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-fg-muted leading-relaxed">
            Browse the curated library of genuinely free software, tools, platforms and learning resources.
          </p>

          {/* 02. Resources Search Bar */}
          <div className="mt-6 max-w-2xl">
            <SearchBox
              key={query.q ?? ""}
              defaultValue={query.q ?? ""}
              size="md"
              variant="beam"
              placeholder="Search free resources, tools, and platforms..."
              label="Search free resources"
            />
          </div>
        </div>
      </div>

      {/* 03. Catalogue Main Area */}
      <div className="mx-auto w-full max-w-(--container-content) px-4 pt-6 sm:px-6 lg:px-8">
        {/* Dynamic Category Filter Bar */}
        <div className="border-b border-border/80 pb-4">
          <CategoryFilterBar
            resources={resources}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
            disabled={isPending}
          />
        </div>

        {/* Results Toolbar: Result count + EvidenceGate + Quiet Sort + Filters Button */}
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

          <button
            type="button"
            onClick={(event) => {
              event.currentTarget.focus();
              setSheetOpen(true);
            }}
            aria-haspopup="dialog"
            className={buttonClasses({
              variant: "secondary",
              size: "sm",
              className: "inline-flex items-center gap-1.5",
            })}
          >
            <Icon name="sliders" size={14} className="text-fg-subtle" />
            <span>Filters</span>
            {activeCount > 0 ? (
              <span className="tabular-nums font-semibold"> · {activeCount}</span>
            ) : null}
          </button>
        </ResultsToolbar>

        {/* Filter Sheet for secondary filters (licence, platform, account, etc.) */}
        <FilterSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          total={results.total}
          onClearAll={activeCount > 0 ? () => navigate(clearFiltersHref(searchParams)) : undefined}
        >
          <FilterPanel
            facets={facets}
            resultCount={results.total}
            activeFilterCount={activeCount}
            isPending={isPending}
            onNavigate={navigate}
            presentation="sheet"
          />
        </FilterSheet>

        {/* 04. Catalogue Grid Area with Secondary Filter Sidebar on Desktop */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside
            aria-label="Filter resources"
            className="hidden lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:block lg:max-h-[calc(100dvh-var(--header-h)-32px)] lg:self-start lg:overflow-y-auto lg:overscroll-contain"
          >
            {sheetOpen ? null : (
              <FilterPanel
                facets={facets}
                resultCount={results.total}
                activeFilterCount={activeCount}
                isPending={isPending}
                onNavigate={navigate}
              />
            )}
          </aside>

          <div className="min-w-0">
            {/* Active Filters Display */}
            {activeCount > 0 ? (
              <div>
                <ActiveFilters query={effectiveQuery} inferredFilters={inferredFilters} />
              </div>
            ) : null}

            {/* Inferred query feedback */}
            {inferredFilters.length > 0 ? (
              <Callout tone="neutral" icon={null} className="mt-4">
                Your search set {inferredFilters.length === 1 ? "a filter" : "some filters"} automatically:{" "}
                {inferredFilters.map((filter) => filter.label).join(", ")}. Remove any that do not apply above.
              </Callout>
            ) : null}

            {/* Evidence gate notice */}
            {evidenceFilterActive ? (
              <Callout id="evidence-filter-notice" tone="neutral" icon={null} className="mt-4">
                <span data-testid="evidence-filter-notice">
                  Filters marked <span className="font-medium text-fg">confirmed</span> only include listings where an
                  official source confirms the fact.{" "}
                  {excludedByEvidence > 0
                    ? `${formatCount(excludedByEvidence)} more ${excludedByEvidence === 1 ? "listing records" : "listings record"} it but ${excludedByEvidence === 1 ? "has" : "have"} not been checked yet.`
                    : "No other listing records it without confirmation."}
                </span>
              </Callout>
            ) : null}

            {/* Relaxed search matching warning */}
            {results.relaxedMatching ? (
              <Callout tone="neutral" icon="info" className="mt-4">
                Few resources matched every word, so results matching part of your search are included below. Closest matches come first.
              </Callout>
            ) : null}

            {/* Animated Resource Grid */}
            <div
              className={isPending ? "motion-pending mt-6 opacity-60" : "motion-pending mt-6"}
              aria-busy={isPending || undefined}
            >
          {items.length > 0 ? (
            <>
              <AnimatedResourceGrid
                resources={items}
                reasonsBySlug={reasonsBySlug}
                label={isSearch ? `Search results for ${query.q}` : "All resources"}
                renderCompare={(resource) => (
                  <CompareToggle
                    name={resource.name}
                    selected={compare.includes(resource.slug)}
                    full={compare.length >= MAX_COMPARE && !compare.includes(resource.slug)}
                    onToggle={() => dispatchCompare({ type: "toggle", slug: resource.slug })}
                  />
                )}
              />

              {results.totalPages > 1 ? (
                <div className="mt-12">
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
                    The library is deliberately curated rather than scraped, so there are genuine gaps.
                    Try clearing a filter, or searching for a broader term.
                  </p>
                  <p className="text-fg-subtle">
                    If you know something genuinely free that belongs here, submit it in minutes.
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

      {compare.length > 0 ? (
        <CompareTray
          selected={compare.map((slug) => ({ slug, name: nameBySlug.get(slug) ?? slug }))}
          onClear={() => dispatchCompare({ type: "clear" })}
        />
      ) : null}
    </>
  );
}
