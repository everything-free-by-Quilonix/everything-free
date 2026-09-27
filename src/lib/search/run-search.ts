import type { Resource, ResourceMatch } from "@/types/resource";
import type { Paginated, ResourceFacets, ResourceQuery, ResourceQueryResult, SortOption } from "@/types/search";

import { rankResources } from "./engine";
import { computeFacets, countExcludedByEvidence, matchesFilters } from "./filters";
import { inferIntent, type InferredFilter } from "./intent";
import { DEFAULT_PER_PAGE } from "./params";

/**
 * The search pipeline, as pure functions over an explicit resource list.
 *
 * Extracted from the seed data source for one specific reason: the same search has
 * to run in two places. On the server it powers static generation and any future
 * database adapter; in the browser it powers the live filtering on `/resources`,
 * which is what lets that page be a static file instead of a server-rendered
 * response.
 *
 * Because both callers execute *this* code, client-side and server-side results
 * cannot diverge. The alternative — a second, simplified client implementation —
 * would silently drift from the real ranking and produce different results
 * depending on how the page was reached.
 *
 * Nothing here imports data, Next.js, or anything environment-specific. The
 * ranking engine in `engine.ts` and the predicates in `filters.ts` are unchanged;
 * this module only composes them.
 */

function compare(sort: SortOption): (a: ResourceMatch, b: ResourceMatch) => number {
  switch (sort) {
    case "name":
      return (a, b) => a.resource.name.localeCompare(b.resource.name);
    case "recently-updated":
      return (a, b) =>
        b.resource.updatedAt.localeCompare(a.resource.updatedAt) || a.resource.name.localeCompare(b.resource.name);
    case "recently-verified":
      return (a, b) => {
        // Never-verified entries sort last rather than first: an absent date must
        // not read as "verified at the beginning of time".
        const aDate = a.resource.lastVerifiedAt ?? "";
        const bDate = b.resource.lastVerifiedAt ?? "";
        if (aDate !== bDate) return bDate.localeCompare(aDate);
        return a.resource.name.localeCompare(b.resource.name);
      };
    case "relevance":
    default:
      // Not reached in practice: `queryResources` skips sorting entirely for
      // relevance so the engine's term-count-aware order survives. Kept for
      // exhaustiveness.
      return (a, b) => b.score - a.score || a.resource.name.localeCompare(b.resource.name);
  }
}

function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
  };
}

function applyQuery(
  resources: readonly Resource[],
  query: ResourceQuery,
): { matches: ResourceMatch[]; relaxed: boolean } {
  const filtered = resources.filter((resource) => matchesFilters(resource, query));

  if (!query.q || query.q.trim().length === 0) {
    return {
      matches: filtered.map((resource) => ({ resource, score: 0, matchReasons: [] })),
      relaxed: false,
    };
  }

  return rankResources(filtered, query.q);
}

/**
 * Filters, ranks, sorts and paginates.
 *
 * Takes the query exactly as given — no intent inference. Callers that want
 * natural-language constraint extraction use `runSearch`.
 */
export function queryResources(resources: readonly Resource[], query: ResourceQuery): ResourceQueryResult {
  const { matches, relaxed } = applyQuery(resources, query);

  const hasQuery = Boolean(query.q && query.q.trim().length > 0);
  const requestedSort = query.sort ?? (hasQuery ? "relevance" : "recently-verified");

  /*
   * Relevance ordering is produced by the ranking engine, which orders by how many
   * query terms matched *before* falling back to score. Re-sorting here on score
   * alone would throw that away and let a single strong field match outrank a
   * resource that matched every word — so relevance deliberately leaves the
   * engine's order intact.
   *
   * Without a query there is nothing to be relevant to, so it degrades to the
   * browsing default rather than returning an arbitrary order.
   */
  const effectiveSort = requestedSort === "relevance" && !hasQuery ? "recently-verified" : requestedSort;
  const sorted = effectiveSort === "relevance" ? matches : [...matches].sort(compare(effectiveSort));

  return {
    ...paginate(sorted, query.page ?? 1, query.perPage ?? DEFAULT_PER_PAGE),
    relaxedMatching: relaxed,
  };
}

export function facetsFor(resources: readonly Resource[], query: ResourceQuery): ResourceFacets {
  return computeFacets(resources, query);
}

export interface SearchOutcome {
  results: ResourceQueryResult;
  facets: ResourceFacets;
  /** The query actually executed, after intent extraction. */
  effectiveQuery: ResourceQuery;
  /** Constraints recognised in natural language, for display. */
  inferredFilters: InferredFilter[];
  /**
   * Listings left out by an evidence filter ("No credit card", "Commercial use")
   * because the value is recorded but not confirmed. Reported, not hidden.
   */
  excludedByEvidence: number;
}

/**
 * Runs a search, extracting stated constraints from the query text first.
 *
 * "free AI voice generator without a credit card" becomes the terms
 * "ai voice generator" plus a no-credit-card filter, and the caller is told which
 * filter was inferred so the user can see and undo it.
 */
export function runSearch(resources: readonly Resource[], query: ResourceQuery): SearchOutcome {
  const intent = query.q
    ? inferIntent(query.q, query)
    : { residualQuery: "", filters: {}, applied: [] as InferredFilter[] };

  const effectiveQuery: ResourceQuery = {
    ...query,
    ...intent.filters,
    // Merge rather than replace: an inferred platform must not discard a platform
    // the user picked in the sidebar.
    platforms: [...new Set([...(query.platforms ?? []), ...(intent.filters.platforms ?? [])])],
    q: intent.residualQuery.length > 0 ? intent.residualQuery : undefined,
    perPage: query.perPage ?? DEFAULT_PER_PAGE,
  };

  return {
    results: queryResources(resources, effectiveQuery),
    facets: facetsFor(resources, effectiveQuery),
    effectiveQuery,
    inferredFilters: intent.applied,
    // Counted without the text query: it answers "how many listings does this
    // filter hold back", which should not depend on how well they rank.
    excludedByEvidence: countExcludedByEvidence(resources, { ...effectiveQuery, q: undefined }),
  };
}
