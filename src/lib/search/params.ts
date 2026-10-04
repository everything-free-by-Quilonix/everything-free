import { isCategoryOrGroupId } from "@/config/categories";
import { isFreeStatus } from "@/config/free-status";
import { isPlatform } from "@/config/platforms";
import { isResourceType } from "@/config/resource-types";
import { isVerificationStatus } from "@/config/verification";
import { SORT_OPTIONS, type ResourceQuery, type SortOption } from "@/types/search";

/**
 * URL <-> ResourceQuery serialisation.
 *
 * Filter state lives in the URL rather than in client component state. That
 * choice means any filtered view is shareable and bookmarkable, the back button
 * works, and the same URL produces the same `ResourceQuery` whether it is parsed
 * in the browser (via `searchParamsToInput`) or on a server.
 *
 * Unknown or malformed values are dropped silently rather than throwing, because
 * these strings come from user-editable URLs and a typo should degrade to a
 * broader result set, not an error page.
 */

/** Query-string keys. Short, stable, and safe to bookmark. */
export const PARAM = {
  q: "q",
  category: "category",
  status: "status",
  type: "type",
  platform: "platform",
  tag: "tag",
  verification: "verification",
  alternativeTo: "alternativeTo",
  openSource: "openSource",
  noAccount: "noAccount",
  noCreditCard: "noCreditCard",
  commercialUse: "commercialUse",
  personalUse: "personalUse",
  sort: "sort",
  page: "page",
} as const;

export const DEFAULT_PER_PAGE = 24;

/** Next.js `searchParams` shape. */
export type SearchParamsInput = Record<string, string | string[] | undefined>;

/**
 * Adapts a live `URLSearchParams` to the same shape the server parser takes.
 *
 * Lets the browser reuse `parseSearchParams` verbatim, so a URL produces an
 * identical `ResourceQuery` whether it was read from a server request or from
 * `useSearchParams()`. Repeated keys collapse to arrays, matching how Next.js
 * presents them server-side.
 */
export function searchParamsToInput(params: URLSearchParams): SearchParamsInput {
  const input: SearchParamsInput = {};

  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    input[key] = values.length > 1 ? values : values[0];
  }

  return input;
}

function readAll(params: SearchParamsInput, key: string): string[] {
  const value = params[key];
  if (value === undefined) return [];
  const list = Array.isArray(value) ? value : [value];
  // Accept both repeated keys (?platform=a&platform=b) and comma lists
  // (?platform=a,b) so hand-written and generated URLs both work.
  return list
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function readOne(params: SearchParamsInput, key: string): string | undefined {
  const value = params[key];
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function readFlag(params: SearchParamsInput, key: string): boolean | undefined {
  const value = readOne(params, key);
  if (value === undefined) return undefined;
  return value === "1" || value === "true" || value === "yes";
}

function readPage(params: SearchParamsInput): number {
  const raw = readOne(params, PARAM.page);
  const parsed = raw ? Number.parseInt(raw, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function readSort(params: SearchParamsInput, hasQuery: boolean): SortOption {
  const raw = readOne(params, PARAM.sort);
  if (raw && (SORT_OPTIONS as readonly string[]).includes(raw)) return raw as SortOption;
  // Relevance is meaningless without a query, so browsing defaults to the most
  // recently verified entries — the most useful default for a trust-led library.
  return hasQuery ? "relevance" : "recently-verified";
}

export function parseSearchParams(params: SearchParamsInput): ResourceQuery {
  const q = readOne(params, PARAM.q);

  return {
    q,
    categories: readAll(params, PARAM.category).filter(isCategoryOrGroupId),
    freeStatuses: readAll(params, PARAM.status).filter(isFreeStatus),
    resourceTypes: readAll(params, PARAM.type).filter(isResourceType),
    platforms: readAll(params, PARAM.platform).filter(isPlatform),
    tags: readAll(params, PARAM.tag),
    verificationStatuses: readAll(params, PARAM.verification).filter(isVerificationStatus),
    alternativeTo: readOne(params, PARAM.alternativeTo),
    openSourceOnly: readFlag(params, PARAM.openSource),
    noAccountOnly: readFlag(params, PARAM.noAccount),
    noCreditCardOnly: readFlag(params, PARAM.noCreditCard),
    commercialUseOnly: readFlag(params, PARAM.commercialUse),
    personalUseOnly: readFlag(params, PARAM.personalUse),
    sort: readSort(params, Boolean(q)),
    page: readPage(params),
    perPage: DEFAULT_PER_PAGE,
  };
}

/**
 * Serialises a query back to a search string.
 *
 * Defaults are omitted so that canonical URLs stay clean and two equivalent
 * filter states produce the same URL — important for avoiding duplicate indexed
 * pages.
 */
export function buildSearchParams(query: ResourceQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.q) params.set(PARAM.q, query.q);
  for (const value of query.categories ?? []) params.append(PARAM.category, value);
  for (const value of query.freeStatuses ?? []) params.append(PARAM.status, value);
  for (const value of query.resourceTypes ?? []) params.append(PARAM.type, value);
  for (const value of query.platforms ?? []) params.append(PARAM.platform, value);
  for (const value of query.tags ?? []) params.append(PARAM.tag, value);
  for (const value of query.verificationStatuses ?? []) params.append(PARAM.verification, value);
  if (query.alternativeTo) params.set(PARAM.alternativeTo, query.alternativeTo);

  if (query.openSourceOnly) params.set(PARAM.openSource, "1");
  if (query.noAccountOnly) params.set(PARAM.noAccount, "1");
  if (query.noCreditCardOnly) params.set(PARAM.noCreditCard, "1");
  if (query.commercialUseOnly) params.set(PARAM.commercialUse, "1");
  if (query.personalUseOnly) params.set(PARAM.personalUse, "1");

  const defaultSort = query.q ? "relevance" : "recently-verified";
  if (query.sort && query.sort !== defaultSort) params.set(PARAM.sort, query.sort);
  if (query.page && query.page > 1) params.set(PARAM.page, String(query.page));

  return params;
}

/** Full href for a query, for use in links. */
export function buildResourcesHref(query: ResourceQuery, basePath = "/resources"): string {
  const params = buildSearchParams(query);
  const search = params.toString();
  return search.length > 0 ? `${basePath}?${search}` : basePath;
}

/** Returns a copy of `query` with one value toggled in an array filter. */
export function toggleArrayValue<K extends "categories" | "freeStatuses" | "resourceTypes" | "platforms" | "tags">(
  query: ResourceQuery,
  key: K,
  value: NonNullable<ResourceQuery[K]>[number],
): ResourceQuery {
  const current = (query[key] ?? []) as NonNullable<ResourceQuery[K]>;
  const exists = (current as readonly unknown[]).includes(value);
  const next = exists
    ? (current as readonly unknown[]).filter((entry) => entry !== value)
    : [...(current as readonly unknown[]), value];

  // Page must reset whenever the result set changes, or the user lands on an
  // out-of-range page and sees an empty list.
  return { ...query, [key]: next, page: 1 } as ResourceQuery;
}

/** Returns a copy of `query` with a boolean filter toggled. */
export function toggleFlag(
  query: ResourceQuery,
  key: "openSourceOnly" | "noAccountOnly" | "noCreditCardOnly" | "commercialUseOnly" | "personalUseOnly",
): ResourceQuery {
  return { ...query, [key]: query[key] ? undefined : true, page: 1 };
}

/** Clears every filter but keeps the free-text query. */
export function clearFilters(query: ResourceQuery): ResourceQuery {
  return { q: query.q, sort: query.sort, page: 1, perPage: query.perPage };
}
