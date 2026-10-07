import { cache } from "react";

import { collections } from "@/data/collections";
import { computeFacets } from "@/lib/search/filters";
import { runSearch, type SearchOutcome } from "@/lib/search/run-search";
import { slugifyProductName } from "@/lib/utils/slug";
import type { Collection } from "@/types/collection";
import type { Resource } from "@/types/resource";
import type { ResourceFacets, ResourceQuery, ResourceQueryResult } from "@/types/search";

import { seedDataSource } from "./seed-adapter";
import type { ResourceDataSource } from "./types";

/**
 * The library's public data API.
 *
 * Components and pages import from here and nowhere else. Switching to Postgres
 * or Supabase means implementing `ResourceDataSource` and changing the one line
 * below — no call site changes.
 *
 * Reads are wrapped in React's `cache()` so that a page and its `generateMetadata`
 * resolve the same resource once per request instead of twice. That is a no-op
 * saving against in-memory seed data and a real one against a database, which is
 * the point of putting it in now.
 */
const source: ResourceDataSource = seedDataSource;

/* -------------------------------------------------------------------------- */
/* Core reads                                                                 */
/* -------------------------------------------------------------------------- */

/** Paginated, filtered listing. Ranked by relevance when `query.q` is set. */
export const getResources = cache(async (query: ResourceQuery = {}): Promise<ResourceQueryResult> => {
  return source.query(query);
});

export const getResourceBySlug = cache(async (slug: string): Promise<Resource | null> => {
  return source.getBySlug(slug);
});

export const getResourcesBySlugs = cache(async (slugs: readonly string[]): Promise<Resource[]> => {
  if (slugs.length === 0) return [];
  return source.getManyBySlugs(slugs);
});

export const getResourceCount = cache(async (): Promise<number> => source.count());

/** Resources with confirmed verification checks or verified status. */
export const getVerifiedResourceCount = cache(async (): Promise<number> => {
  const all = await source.listAllForClient();
  return all.filter(
    (resource) =>
      resource.verificationStatus === "VERIFIED" ||
      resource.verificationStatus === "PARTIALLY_VERIFIED" ||
      (resource.verificationChecks && resource.verificationChecks.length > 0) ||
      Boolean(resource.lastVerifiedAt),
  ).length;
});

export const getFacets = cache(async (query: ResourceQuery = {}): Promise<ResourceFacets> => source.facets(query));

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

export type { SearchOutcome };

/**
 * Runs a search, extracting stated constraints from the query text first.
 *
 * Delegates to the shared executor in `lib/search/run-search.ts`, which is the
 * same code the browser runs on `/resources`. Keeping one implementation is what
 * guarantees a client-side filter and a server-side render agree.
 */
export const searchResources = cache(async (query: ResourceQuery): Promise<SearchOutcome> => {
  const resources = await source.listAllForClient();
  return runSearch(resources, query);
});

/**
 * The whole listable library, for handing to the browser.
 *
 * Used by `/resources` to render a static page whose filtering runs client-side.
 */
export const getAllResourcesForClient = cache(async (): Promise<readonly Resource[]> => {
  return source.listAllForClient();
});

/* -------------------------------------------------------------------------- */
/* Category, status and tag views                                             */
/* -------------------------------------------------------------------------- */

export const getResourcesByCategory = cache(
  async (categoryId: string, query: ResourceQuery = {}): Promise<ResourceQueryResult> => {
    return source.query({ ...query, categories: [categoryId] });
  },
);

export const getResourcesByStatus = cache(
  async (status: NonNullable<ResourceQuery["freeStatuses"]>[number], query: ResourceQuery = {}) => {
    return source.query({ ...query, freeStatuses: [status] });
  },
);

export const getResourcesByTag = cache(async (tag: string, query: ResourceQuery = {}) => {
  return source.query({ ...query, tags: [tag] });
});

export const listTags = cache(async () => source.listTags());

/* -------------------------------------------------------------------------- */
/* Relationships                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Resources worth looking at next.
 *
 * Starts from the curated `relatedResources` list, then tops up from the same
 * category so a detail page is never left with an empty section. Curated entries
 * keep their order; the fallback is stable rather than random so the page does
 * not reshuffle between requests.
 */
export const getSimilarResources = cache(async (resource: Resource, limit = 4): Promise<Resource[]> => {
  const curated = await source.getManyBySlugs(resource.relatedResources);
  const chosen: Resource[] = [...curated];
  const seen = new Set<string>([resource.slug, ...chosen.map((entry) => entry.slug)]);

  if (chosen.length < limit) {
    const sameCategory = await source.query({
      categories: [resource.category],
      perPage: limit * 3,
      sort: "recently-verified",
    });

    for (const match of sameCategory.items) {
      if (chosen.length >= limit) break;
      if (seen.has(match.resource.slug)) continue;
      seen.add(match.resource.slug);
      chosen.push(match.resource);
    }
  }

  return chosen.slice(0, limit);
});

/** Paid products that at least one listed resource is presented as an alternative to. */
export const getAlternativeTargets = cache(async () => source.listAlternativeTargets());

/** Resolves an alternative-target slug back to its display name and resources. */
export const getAlternativesFor = cache(
  async (targetSlug: string): Promise<{ name: string; resources: Resource[] } | null> => {
    const targets = await source.listAlternativeTargets();
    const target = targets.find((entry) => entry.slug === targetSlug);
    if (!target) return null;

    const results = await source.query({ alternativeTo: target.name, perPage: 100, sort: "recently-verified" });
    return { name: target.name, resources: results.items.map((match) => match.resource) };
  },
);

/* -------------------------------------------------------------------------- */
/* Homepage surfaces                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Editorially selected resources for the homepage.
 *
 * Explicitly not "most popular". No usage data is collected, so none is implied:
 * the UI that renders this says it is a curated selection.
 */
export const getSpotlightResources = cache(async (limit = 6): Promise<Resource[]> => {
  const all = await source.query({ perPage: 200, sort: "name" });
  return all.items
    .map((match) => match.resource)
    .filter((resource) => resource.editorialSpotlight)
    .slice(0, limit);
});

export const getRecentlyVerified = cache(async (limit = 6): Promise<Resource[]> => {
  const results = await source.query({ sort: "recently-verified", perPage: limit });
  return results.items.map((match) => match.resource);
});

/**
 * Prominent, recognizable library resources for the hero marquee strip.
 *
 * Reads real, existing resources from the library with verified marks.
 */
export const getMarqueeResources = cache(async (limit = 14): Promise<Resource[]> => {
  const preferredSlugs = [
    "github",
    "blender",
    "gimp",
    "obsidian",
    "vlc",
    "vs-code",
    "supabase",
    "davinci-resolve",
    "obs-studio",
    "ollama",
    "firefox",
    "krita",
    "handbrake",
    "audacity",
  ];
  const items = await source.getManyBySlugs(preferredSlugs);
  if (items.length >= limit) return items.slice(0, limit);

  const spotlight = await getSpotlightResources(limit);
  const seen = new Set(items.map((r) => r.slug));
  for (const resource of spotlight) {
    if (items.length >= limit) break;
    if (!seen.has(resource.slug)) {
      seen.add(resource.slug);
      items.push(resource);
    }
  }
  return items.slice(0, limit);
});

/* -------------------------------------------------------------------------- */
/* Collections                                                                */
/* -------------------------------------------------------------------------- */

export const getCollections = cache(async (): Promise<Collection[]> => collections);

export const getCollectionBySlug = cache(async (slug: string): Promise<Collection | null> => {
  return collections.find((collection) => collection.slug === slug) ?? null;
});

export const getCollectionResources = cache(async (collection: Collection): Promise<Resource[]> => {
  return source.getManyBySlugs(collection.resourceSlugs);
});

/* -------------------------------------------------------------------------- */
/* Indexing support                                                           */
/* -------------------------------------------------------------------------- */

export const listResourceIndexEntries = cache(async () => source.listIndexEntries());

/** Re-exported so callers building alternative links do not import from utils. */
export { slugifyProductName };

/** Facet computation over an explicit set, for category and collection pages. */
export { computeFacets };
