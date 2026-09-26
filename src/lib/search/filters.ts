import { freeStatusDefinitions } from "@/config/free-status";
import type { Resource } from "@/types/resource";
import type { ResourceFacets, ResourceQuery } from "@/types/search";
import { normalizeText } from "./tokenize";

/**
 * Filter predicates.
 *
 * Each filter is an independent predicate combined with AND, and every array
 * filter is OR within itself — the behaviour people expect from faceted search:
 * "Windows or macOS" *and* "open source".
 *
 * Important semantics: the tri-state `Availability` fields are treated strictly.
 * `noAccountOnly` matches only `requiresAccount === 'no'`, never `'unknown'`.
 * Including unknowns would mean telling someone a resource needs no account when
 * nobody has checked, which is the kind of quiet inaccuracy this project exists
 * to avoid. The cost is that unverified entries are excluded from strict filters,
 * and that is the right trade.
 */

function matchesAny<T>(selected: T[] | undefined, values: readonly T[]): boolean {
  if (!selected || selected.length === 0) return true;
  return selected.some((value) => values.includes(value));
}

export function matchesFilters(resource: Resource, query: ResourceQuery): boolean {
  if (!freeStatusDefinitions[resource.freeStatus].listable) return false;

  if (!matchesAny(query.freeStatuses, [resource.freeStatus])) return false;
  if (!matchesAny(query.resourceTypes, [resource.resourceType])) return false;
  if (!matchesAny(query.platforms, resource.platforms)) return false;
  if (!matchesAny(query.verificationStatuses, [resource.verificationStatus])) return false;
  if (!matchesAny(query.categories, [resource.category, ...resource.subcategories])) return false;
  if (!matchesAny(query.tags, resource.tags)) return false;

  if (query.openSourceOnly && !resource.openSource) return false;
  if (query.noAccountOnly && resource.requiresAccount !== "no") return false;
  if (query.noCreditCardOnly && resource.requiresCreditCard !== "no") return false;
  if (query.commercialUseOnly && resource.commercialUse !== "yes") return false;
  if (query.personalUseOnly && resource.personalUse !== "yes") return false;

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

    if (matchesFilters(resource, without("openSourceOnly")) && resource.openSource) facets.openSource += 1;
    if (matchesFilters(resource, without("noAccountOnly")) && resource.requiresAccount === "no") {
      facets.noAccount += 1;
    }
    if (matchesFilters(resource, without("noCreditCardOnly")) && resource.requiresCreditCard === "no") {
      facets.noCreditCard += 1;
    }
    if (matchesFilters(resource, without("commercialUseOnly")) && resource.commercialUse === "yes") {
      facets.commercialUse += 1;
    }
  }

  return facets;
}
