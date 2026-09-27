import { freeStatusDefinitions } from "@/config/free-status";
import { confirmedAvailability, isFactConfirmed, type Fact } from "@/lib/resources/evidence";
import type { Resource } from "@/types/resource";
import type { EvidenceFilterKey, ResourceFacets, ResourceQuery } from "@/types/search";
import { normalizeText } from "./tokenize";

/**
 * Filter predicates.
 *
 * Each filter is an independent predicate combined with AND, and every array
 * filter is OR within itself — the behaviour people expect from faceted search:
 * "Windows or macOS" *and* "open source".
 *
 * Two kinds of filter, deliberately treated differently:
 *
 * - **Classification** filters — free status, type, platform, category, tag —
 *   narrow by what a listing is filed under. Every listing has one, and each result
 *   card shows how far that classification has been checked.
 * - **Evidence** filters — open source, no account, no credit card, commercial use,
 *   personal use — are promises about a fact. They match only when an official
 *   source *confirms* the fact (`lib/resources/evidence.ts`). A stored "no" that
 *   nobody has checked does not match "No credit card", and an unknown never does.
 *   Unchecked listings are excluded, and the UI says how many and why rather than
 *   quietly mixing them in.
 */

function matchesAny<T>(selected: T[] | undefined, values: readonly T[]): boolean {
  if (!selected || selected.length === 0) return true;
  return selected.some((value) => values.includes(value));
}

/**
 * What each evidence filter requires. `recorded` is the stored value alone and is
 * used only to count, never to match: it is how the UI can say "12 more listings
 * record this, but it is not verified".
 */
const EVIDENCE_FILTERS: Record<
  EvidenceFilterKey,
  { fact: Fact; confirmed: (resource: Resource) => boolean; recorded: (resource: Resource) => boolean }
> = {
  openSourceOnly: {
    fact: "openSource",
    confirmed: (r) => r.openSource && isFactConfirmed(r, "openSource"),
    recorded: (r) => r.openSource,
  },
  noAccountOnly: {
    fact: "requiresAccount",
    confirmed: (r) => confirmedAvailability(r, "requiresAccount") === "no",
    recorded: (r) => r.requiresAccount === "no",
  },
  noCreditCardOnly: {
    fact: "requiresCreditCard",
    confirmed: (r) => confirmedAvailability(r, "requiresCreditCard") === "no",
    recorded: (r) => r.requiresCreditCard === "no",
  },
  commercialUseOnly: {
    fact: "commercialUse",
    confirmed: (r) => confirmedAvailability(r, "commercialUse") === "yes",
    recorded: (r) => r.commercialUse === "yes",
  },
  personalUseOnly: {
    fact: "personalUse",
    confirmed: (r) => confirmedAvailability(r, "personalUse") === "yes",
    recorded: (r) => r.personalUse === "yes",
  },
};

export const EVIDENCE_FILTER_KEYS = Object.keys(EVIDENCE_FILTERS) as EvidenceFilterKey[];

/**
 * `evidence: "recorded"` exists only for counting what the strict filters left
 * out. Every caller that decides what to *show* uses the default.
 */
export function matchesFilters(
  resource: Resource,
  query: ResourceQuery,
  { evidence = "confirmed" }: { evidence?: "confirmed" | "recorded" } = {},
): boolean {
  if (!freeStatusDefinitions[resource.freeStatus].listable) return false;

  if (!matchesAny(query.freeStatuses, [resource.freeStatus])) return false;
  if (!matchesAny(query.resourceTypes, [resource.resourceType])) return false;
  if (!matchesAny(query.platforms, resource.platforms)) return false;
  if (!matchesAny(query.verificationStatuses, [resource.verificationStatus])) return false;
  if (!matchesAny(query.categories, [resource.category, ...resource.subcategories])) return false;
  if (!matchesAny(query.tags, resource.tags)) return false;

  for (const key of EVIDENCE_FILTER_KEYS) {
    if (!query[key]) continue;
    if (!EVIDENCE_FILTERS[key][evidence](resource)) return false;
  }

  if (query.alternativeTo) {
    const target = normalizeText(query.alternativeTo);
    const matches = resource.alternativeTo.some((name) => {
      const normalized = normalizeText(name);
      // Substring in both directions so "photoshop" matches "Adobe Photoshop"
      // and "adobe photoshop cc" matches "Adobe Photoshop".
      return normalized.includes(target) || target.includes(normalized);
    });
    if (!matches) return false;
  }

  return true;
}

/** True when the query would narrow the library at all. */
export function hasActiveFilters(query: ResourceQuery): boolean {
  return Boolean(
    query.categories?.length ||
      query.freeStatuses?.length ||
      query.resourceTypes?.length ||
      query.platforms?.length ||
      query.tags?.length ||
      query.verificationStatuses?.length ||
      query.alternativeTo ||
      query.openSourceOnly ||
      query.noAccountOnly ||
      query.noCreditCardOnly ||
      query.commercialUseOnly ||
      query.personalUseOnly,
  );
}

export function countActiveFilters(query: ResourceQuery): number {
  return (
    (query.categories?.length ?? 0) +
    (query.freeStatuses?.length ?? 0) +
    (query.resourceTypes?.length ?? 0) +
    (query.platforms?.length ?? 0) +
    (query.tags?.length ?? 0) +
    (query.verificationStatuses?.length ?? 0) +
    (query.alternativeTo ? 1 : 0) +
    (query.openSourceOnly ? 1 : 0) +
    (query.noAccountOnly ? 1 : 0) +
    (query.noCreditCardOnly ? 1 : 0) +
    (query.commercialUseOnly ? 1 : 0) +
    (query.personalUseOnly ? 1 : 0)
  );
}

/**
 * Counts facet values across a result set.
 *
 * Counts are computed from resources that pass every *other* filter but not the
 * facet being counted, so ticking a second platform does not show "0" next to
 * every remaining option. This is the standard behaviour of good faceted search
 * and the reason facets are computed here rather than from the final page.
 */
export function computeFacets(resources: readonly Resource[], query: ResourceQuery): ResourceFacets {
  const facets: ResourceFacets = {
    freeStatuses: {},
    resourceTypes: {},
    platforms: {},
    categories: {},
    openSource: 0,
    noAccount: 0,
    noCreditCard: 0,
    commercialUse: 0,
    unconfirmed: { openSource: 0, noAccount: 0, noCreditCard: 0, commercialUse: 0 },
  };

  const without = <K extends keyof ResourceQuery>(key: K): ResourceQuery => {
    const clone: ResourceQuery = { ...query };
    delete clone[key];
    return clone;
  };

  const countInto = (bucket: Record<string, number>, values: readonly string[]) => {
    for (const value of new Set(values)) {
      bucket[value] = (bucket[value] ?? 0) + 1;
    }
  };

  const statusScope = without("freeStatuses");
  const typeScope = without("resourceTypes");
  const platformScope = without("platforms");
  const categoryScope = without("categories");

  for (const resource of resources) {
    if (matchesFilters(resource, statusScope)) countInto(facets.freeStatuses, [resource.freeStatus]);
    if (matchesFilters(resource, typeScope)) countInto(facets.resourceTypes, [resource.resourceType]);
    if (matchesFilters(resource, platformScope)) countInto(facets.platforms, resource.platforms);
    if (matchesFilters(resource, categoryScope)) {
      countInto(facets.categories, [resource.category, ...resource.subcategories]);
    }

    // Evidence facets count confirmed matches, and separately how many listings
    // record the value without confirmation — shown as "N more not verified".
    const evidenceFacets: [EvidenceFilterKey, "openSource" | "noAccount" | "noCreditCard" | "commercialUse"][] = [
      ["openSourceOnly", "openSource"],
      ["noAccountOnly", "noAccount"],
      ["noCreditCardOnly", "noCreditCard"],
      ["commercialUseOnly", "commercialUse"],
    ];
    for (const [key, facet] of evidenceFacets) {
      if (!matchesFilters(resource, without(key))) continue;
      const filter = EVIDENCE_FILTERS[key];
      if (filter.confirmed(resource)) facets[facet] += 1;
      else if (filter.recorded(resource)) facets.unconfirmed[facet] += 1;
    }
  }

  return facets;
}

/**
 * How many listings an evidence filter left out because their value is recorded
 * but not confirmed. The results page states this number instead of silently
 * mixing unchecked listings in, or silently dropping them.
 */
export function countExcludedByEvidence(resources: readonly Resource[], query: ResourceQuery): number {
  if (!EVIDENCE_FILTER_KEYS.some((key) => query[key])) return 0;
  return resources.filter(
    (resource) => matchesFilters(resource, query, { evidence: "recorded" }) && !matchesFilters(resource, query),
  ).length;
}
