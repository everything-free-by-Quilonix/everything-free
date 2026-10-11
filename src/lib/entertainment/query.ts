import { getShelf, isMediaAccessType, isMediaFormat } from "@/config/media";
import { rankResources } from "@/lib/search/engine";
import type { MediaAccessType, MediaFormat } from "@/types/media";
import type { Platform, Resource } from "@/types/resource";
import { PLATFORMS } from "@/types/resource";

import { factEvidence } from "@/lib/resources/evidence";

/**
 * Entertainment explorer state: what the visitor filtered by, as URL parameters.
 *
 * Pure functions, shared by the static render and the browser, so the HTML a
 * search engine sees and what a visitor's filters show are the same computation.
 * The filters only match recorded facts — "Available in India" matches listings
 * whose India availability a source states, "Reuse allowed" only listings whose
 * content licence a source states permits it.
 */

export const MEDIA_SORTS = ["relevance", "recently-added", "recently-verified", "name"] as const;
export type MediaSort = (typeof MEDIA_SORTS)[number];

export interface MediaQuery {
  q?: string;
  formats: MediaFormat[];
  access: MediaAccessType[];
  languages: string[];
  platforms: Platform[];
  genres: string[];
  india?: boolean;
  browserPlay?: boolean;
  download?: boolean;
  openSource?: boolean;
  noAccount?: boolean;
  creatorUse?: boolean;
  /** Only listings whose sources say they carry no advertising. */
  noAds?: boolean;
  /** Hide discovery-only guides. */
  contentOnly?: boolean;
  sort: MediaSort;
}

const LIST_KEYS = {
  format: "formats",
  access: "access",
  lang: "languages",
  platform: "platforms",
  genre: "genres",
} as const;

const FLAG_KEYS = {
  india: "india",
  browser: "browserPlay",
  download: "download",
  oss: "openSource",
  noAccount: "noAccount",
  reuse: "creatorUse",
  noads: "noAds",
  content: "contentOnly",
} as const;

export function emptyMediaQuery(): MediaQuery {
  return { formats: [], access: [], languages: [], platforms: [], genres: [], sort: "relevance" };
}

export function parseMediaQuery(params: URLSearchParams): MediaQuery {
  const query = emptyMediaQuery();
  const q = params.get("q")?.trim();
  if (q) query.q = q.slice(0, 120);
  const list = (key: string) =>
    params
      .getAll(key)
      .flatMap((v) => v.split(","))
      .map((v) => v.trim())
      .filter(Boolean);
  query.formats = list("format").filter(isMediaFormat);
  query.access = list("access").filter(isMediaAccessType);
  query.languages = list("lang").filter((v) => /^[a-z]{2,5}$/.test(v));
  query.platforms = list("platform").filter((v): v is Platform => (PLATFORMS as readonly string[]).includes(v));
  query.genres = list("genre").filter((v) => /^[a-z0-9 -]{1,40}$/.test(v));
  for (const [param, key] of Object.entries(FLAG_KEYS)) if (params.get(param) === "1") query[key] = true;
  const sort = params.get("sort");
  if (sort && (MEDIA_SORTS as readonly string[]).includes(sort)) query.sort = sort as MediaSort;
  return query;
}

export function serializeMediaQuery(query: MediaQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  for (const [param, key] of Object.entries(LIST_KEYS)) {
    const values = query[key] as string[];
    if (values.length > 0) params.set(param, values.join(","));
  }
  for (const [param, key] of Object.entries(FLAG_KEYS)) if (query[key]) params.set(param, "1");
  if (query.sort !== "relevance") params.set("sort", query.sort);
  const text = params.toString();
  return text ? `?${text}` : "";
}

export function countMediaFilters(query: MediaQuery): number {
  return (
    query.formats.length +
    query.access.length +
    query.languages.length +
    query.platforms.length +
    query.genres.length +
    Object.values(FLAG_KEYS).filter((key) => query[key]).length
  );
}

/** Listings on a shelf (or all entertainment listings when no shelf is given). */
export function shelfResources(resources: readonly Resource[], shelfSlug?: string): Resource[] {
  const withMedia = resources.filter((r) => r.media);
  if (!shelfSlug) return withMedia;
  const shelf = getShelf(shelfSlug);
  if (!shelf) return [];
  return withMedia.filter((r) => r.media!.formats.some((f) => shelf.formats.includes(f)));
}

const any = <T>(wanted: readonly T[], have: readonly T[]) => wanted.length === 0 || wanted.some((w) => have.includes(w));

export function matchesMediaQuery(resource: Resource, query: MediaQuery): boolean {
  const media = resource.media;
  if (!media) return false;
  if (!any(query.formats, media.formats)) return false;
  if (!any(query.access, media.access)) return false;
  if (!any(query.languages, media.contentLanguages)) return false;
  if (!any(query.platforms, resource.platforms)) return false;
  if (!any(query.genres, media.genres)) return false;
  if (query.india && !(media.region.india === "available" || media.region.india === "partial")) return false;
  if (query.browserPlay && !media.playInBrowser) return false;
  if (query.download && !media.access.includes("free_download")) return false;
  if (query.openSource) {
    const confirmed =
      factEvidence(resource, "openSource").state === "confirmed" || factEvidence(resource, "license").state === "confirmed";
    if (!resource.openSource || !confirmed) return false;
  }
  if (query.noAccount && factEvidence(resource, "requiresAccount").state !== "confirmed") return false;
  if (query.noAccount && resource.requiresAccount !== "no") return false;
  if (query.creatorUse) {
    const license = media.contentLicense;
    if (!license?.sourceUrl) return false;
    if (license.creatorUse !== "allowed" && license.creatorUse !== "allowed-with-attribution") return false;
  }
  if (query.contentOnly && media.offering === "discovery") return false;
  if (query.noAds && media.containsAds !== "no") return false;
  return true;
}

/**
 * Ad-free first: 0 = recorded as no ads, 1 = not known, 2 = carries ads.
 * Used by the default order so the cleanest experiences come first.
 */
export function adRank(resource: Resource): number {
  const ads = resource.media?.containsAds;
  return ads === "no" ? 0 : ads === "yes" ? 2 : 1;
}

export interface MediaFacetCounts {
  formats: Record<string, number>;
  access: Record<string, number>;
  languages: Record<string, number>;
  platforms: Record<string, number>;
  genres: Record<string, number>;
}

/** Counts over a set of listings, for the filter controls. */
export function mediaFacets(resources: readonly Resource[]): MediaFacetCounts {
  const facets: MediaFacetCounts = { formats: {}, access: {}, languages: {}, platforms: {}, genres: {} };
  const bump = (bucket: Record<string, number>, key: string) => (bucket[key] = (bucket[key] ?? 0) + 1);
  for (const resource of resources) {
    const media = resource.media!;
    for (const v of new Set(media.formats)) bump(facets.formats, v);
    for (const v of new Set(media.access)) bump(facets.access, v);
    for (const v of new Set(media.contentLanguages)) bump(facets.languages, v);
    for (const v of new Set(resource.platforms)) bump(facets.platforms, v);
    for (const v of new Set(media.genres)) bump(facets.genres, v);
  }
  return facets;
}

export interface MediaSearchResult {
  items: Resource[];
  reasonsBySlug: Record<string, string[]>;
  total: number;
}

export function runMediaQuery(resources: readonly Resource[], query: MediaQuery): MediaSearchResult {
  const filtered = resources.filter((r) => matchesMediaQuery(r, query));
  const reasonsBySlug: Record<string, string[]> = {};
  let items: Resource[];

  if (query.q) {
    const { matches } = rankResources(filtered, query.q);
    for (const match of matches) if (match.matchReasons.length) reasonsBySlug[match.resource.slug] = match.matchReasons;
    items = matches.map((m) => m.resource);
  } else {
    items = [...filtered];
  }

  const byName = (a: Resource, b: Resource) => a.name.localeCompare(b.name);
  if (query.sort === "name") items.sort(byName);
  else if (query.sort === "recently-added") items.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt) || byName(a, b));
  else if (query.sort === "recently-verified") {
    items.sort((a, b) => (b.lastVerifiedAt ?? "").localeCompare(a.lastVerifiedAt ?? "") || byName(a, b));
  } else if (!query.q) {
    // Default browse order: the content itself before guides to it, ad-free
    // before ad-supported, then name.
    const rank = (r: Resource) => (r.media!.offering === "discovery" ? 1 : 0);
    items.sort((a, b) => rank(a) - rank(b) || adRank(a) - adRank(b) || byName(a, b));
  }

  return { items, reasonsBySlug, total: items.length };
}
