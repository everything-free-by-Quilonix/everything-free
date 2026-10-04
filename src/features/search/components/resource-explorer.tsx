"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Icon } from "@/components/icons";
import { Button, buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterGrid, type FilterDefinition } from "@/components/ui/filter-grid";
import {
  categoryGroups,
  getCategoryOrGroupInfo,
  type CategoryGroupId,
} from "@/config/categories";
import { ResourceCard } from "@/features/resources/components/resource-card";
import { countActiveFilters, EVIDENCE_FILTER_KEYS, matchesFilters } from "@/lib/search/filters";
import { rankResources } from "@/lib/search/engine";
import { PARAM, parseSearchParams, searchParamsToInput } from "@/lib/search/params";
import { runSearch } from "@/lib/search/run-search";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";
import type { ResourceQuery } from "@/types/search";

import { ActiveFilters } from "./active-filters";
import { FilterPanel } from "./filter-panel";
import { Pagination } from "./pagination";
import { SearchBox } from "./search-box";
import { SortSelect } from "./sort-select";
import { SubcategoryPills } from "./subcategory-pills";

/**
 * Editorial Resource Catalogue & Animated Filter Grid Explorer.
 *
 * Transformed from a dense, sidebar-heavy dashboard into a refined,
 * animation-led editorial resource library:
 * - Editorial header with eyebrow, title, and concise copy
 * - Prominent horizontal Beam Search Bar
 * - Animated segmented category chips powered by Motion with live counts
 * - Quiet secondary sorting and filter controls
 * - Reflowing catalogue card grid with tactile subtle hover
 * - Full URL parameter sync, pagination, and accessibility
 */
export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Recomputed only when the URL changes
  const { query, outcome } = useMemo(() => {
    const parsed = parseSearchParams(
      searchParamsToInput(new URLSearchParams(searchParams.toString())),
    );
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
  const isSearch = Boolean(query.q && query.q.trim().length > 0);

  // Active category resolution
  const selectedCategorySlug = query.categories?.[0];
  const categoryInfo = selectedCategorySlug ? getCategoryOrGroupInfo(selectedCategorySlug) : undefined;

  const activeGroupId: CategoryGroupId | undefined = categoryInfo
    ? categoryInfo.isGroup
      ? (categoryInfo.id as CategoryGroupId)
      : categoryInfo.groupId
    : undefined;

  const activeFilterId = activeGroupId ?? (selectedCategorySlug ? "all" : "all");

  const currentCategoryName =
    categoryInfo && !categoryInfo.isGroup
      ? categoryInfo.name
      : isSearch
        ? `Search results`
        : "All free resources";

  const currentCategoryDescription =
    categoryInfo && !categoryInfo.isGroup
      ? categoryInfo.description
      : isSearch
        ? `Results matching your search terms across free tools, apps and platforms.`
        : `Browse the curated library of genuinely free software, tools, platforms and learning resources.`;

  // Category filter definitions for FilterGrid
  const filterDefinitions: FilterDefinition<Resource>[] = useMemo(
    () => [
      {
        id: "all",
        label: "All",
        match: () => true,
      },
      ...categoryGroups.map((group) => ({
        id: group.id,
        label: group.name,
        match: (r: Resource) => group.categoryIds.includes(r.category),
      })),
    ],
    [],
  );

  // Dynamic live per-filter counts reflecting active search query & secondary filters
  const filterCounts = useMemo(() => {
    const baseQuery: ResourceQuery = { ...effectiveQuery, categories: undefined };
    const baseMatches = resources.filter((r) => matchesFilters(r, baseQuery));

    let matchingPool = baseMatches;
    if (baseQuery.q && baseQuery.q.trim().length > 0) {
      const { matches } = rankResources(baseMatches, baseQuery.q);
      matchingPool = matches.map((m) => m.resource);
    }

    const counts: Record<string, number> = {
      all: matchingPool.length,
    };

    for (const group of categoryGroups) {
      counts[group.id] = matchingPool.filter((r) => group.categoryIds.includes(r.category)).length;
    }

    return counts;
  }, [resources, effectiveQuery]);

  const handleSelectCategory = useCallback(
    (categoryId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryId && categoryId !== "all") {
        params.set(PARAM.category, categoryId);
      } else {
        params.delete(PARAM.category);
      }
      params.delete(PARAM.page);
      startTransition(() => {
        const q = params.toString();
        router.push(q ? `/resources?${q}` : "/resources", { scroll: false });
      });
    },
    [router, searchParams],
  );

  const handleSelectSubcategory = useCallback(
    (subcategoryId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM.category, subcategoryId);
      params.delete(PARAM.page);
      startTransition(() => {
        const q = params.toString();
        router.push(q ? `/resources?${q}` : "/resources", { scroll: false });
      });
    },
    [router, searchParams],
  );

  const handleResetFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (query.q) params.set(PARAM.q, query.q);
    if (selectedCategorySlug) params.set(PARAM.category, selectedCategorySlug);
    if (query.sort) params.set(PARAM.sort, query.sort);
    startTransition(() => {
      const q = params.toString();
      router.push(q ? `/resources?${q}` : "/resources", { scroll: false });
    });
  }, [query.q, query.sort, router, selectedCategorySlug]);

  const handleClearAll = useCallback(() => {
    startTransition(() => {
      router.push("/resources", { scroll: false });
    });
  }, [router]);

  return (
    <div className="mx-auto w-full max-w-(--container-content) px-4 pt-6 pb-16 sm:px-6 lg:px-8">
      {/* 1. Editorial Page Header */}
      <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-fg-subtle">
          Resources
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {isSearch ? (
            <>
              Results for <span className="text-primary">“{query.q}”</span>
            </>
          ) : (
            currentCategoryName
          )}
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">
          {currentCategoryDescription}
        </p>

        {/* 2. Prominent Horizontal Search Bar */}
        <div className="mt-6 w-full max-w-2xl">
          <SearchBox
            key={query.q ?? ""}
            defaultValue={query.q ?? ""}
            size="md"
            label="Search free resources, tools, and platforms"
            placeholderText="Search free resources, tools, and platforms..."
          />
        </div>
      </header>

      {/* 3. Primary Filter Grid Navigation */}
      <div className="mt-8 flex flex-col items-center">
        <FilterGrid
          items={items}
          filters={filterDefinitions}
          value={activeFilterId}
          onValueChange={(id) => handleSelectCategory(id === "all" ? null : id)}
          getKey={(resource) => resource.slug}
          renderItem={(resource) => (
            <ResourceCard
              resource={resource}
              matchReasons={reasonsBySlug[resource.slug]}
              className="w-full"
            />
          )}
          counts={filterCounts}
          total={filterCounts.all}
          label="Resource categories"
          columns={3}
          emptyLabel={
            isSearch ? `No resources match “${query.q}” in this category` : "No resources match this filter"
          }
          className="mx-auto"
        />

        {/* Subcategory Drill-down Pills (when viewing a category group) */}
        {activeGroupId ? (
          <div className="mt-3 w-full max-w-4xl">
            <SubcategoryPills
              groupId={activeGroupId}
              activeCategoryId={selectedCategorySlug}
              onSelectSubcategory={handleSelectSubcategory}
              resources={resources}
            />
          </div>
        ) : null}
      </div>

      {/* 4. Controls Bar: Result Count, Secondary Filters, and Quiet Sorting */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-medium text-fg-muted">
            <strong className="font-semibold text-fg tabular-nums">{formatCount(results.total)}</strong>{" "}
            {results.total === 1 ? "resource" : "resources"}
          </span>

          {activeCount > 0 ? (
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded text-xs text-fg-subtle hover:text-fg underline underline-offset-2 transition-colors ml-1"
            >
              Reset filters
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Secondary Progressive Disclosure Filter Toggle */}
          <Button
            variant={filterPanelOpen ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilterPanelOpen((prev) => !prev)}
            aria-expanded={filterPanelOpen}
            aria-controls="filter-panel"
            className="gap-1.5 h-8 text-xs font-medium"
          >
            <Icon name="sliders" size={13} />
            <span>Filters</span>
            {activeCount > 0 ? (
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.2 text-[10.5px] font-semibold",
                  filterPanelOpen ? "bg-primary-fg text-primary" : "bg-primary text-primary-fg",
                )}
              >
                {activeCount}
              </span>
            ) : null}
          </Button>

          {/* Secondary Quiet Sorting Dropdown */}
          <SortSelect hasQuery={isSearch} />
        </div>
      </div>

      {/* Secondary Progressive Filter Tray */}
      <div className="mt-4">
        <FilterPanel
          facets={facets}
          resultCount={results.total}
          activeFilterCount={activeCount}
          isOpen={filterPanelOpen}
          onToggleOpen={() => setFilterPanelOpen((prev) => !prev)}
        />
      </div>

      {/* Active Filter Chips */}
      <div className="mt-3">
        <ActiveFilters query={effectiveQuery} inferredFilters={inferredFilters} />
      </div>

      {/* Notices & Callouts */}
      {inferredFilters.length > 0 ? (
        <Callout tone="info" icon="bolt" className="mt-4">
          Your query set {inferredFilters.length === 1 ? "a filter" : "some filters"} automatically:{" "}
          {inferredFilters.map((filter) => filter.label).join(", ")}. Remove any that do not apply using the chips
          above.
        </Callout>
      ) : null}

      {evidenceFilterActive ? (
        <Callout tone="neutral" icon="check-circle" className="mt-4">
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
          Few resources matched every word, so results matching only part of your search are included below. Closest
          matches come first, and each card shows why it matched.
        </Callout>
      ) : null}

      {/* 5. Empty State (when zero items match) */}
      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon="search"
            title={isSearch ? `Nothing matched “${query.q}”` : "No resources match these filters"}
            description={
              <div className="flex flex-col gap-3">
                <p>
                  The library is deliberately curated rather than scraped. Try adjusting your search query, or clear the
                  active filters to view all entries in this category.
                </p>
                <p className="text-fg-subtle">
                  If you know a free resource that belongs here, adding it takes a couple of minutes.
                </p>
              </div>
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                {activeCount > 0 || isSearch || selectedCategorySlug ? (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className={buttonClasses({ variant: "secondary" })}
                  >
                    Clear all filters
                  </button>
                ) : null}
                <Link href="/submit" className={buttonClasses({ variant: "primary" })}>
                  <Icon name="plus" size={16} />
                  Submit a resource
                </Link>
              </div>
            }
          />
        </div>
      ) : null}

      {/* 6. Pagination */}
      {results.totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-12 border-t border-border/40 pt-6">
          <Pagination query={effectiveQuery} page={results.page} totalPages={results.totalPages} />
        </nav>
      ) : null}
    </div>
  );
}
