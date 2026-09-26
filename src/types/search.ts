import type {
  Availability,
  FreeStatus,
  Platform,
  ResourceMatch,
  ResourceType,
  VerificationStatus,
} from "./resource";

/**
 * The single shape every library read goes through.
 *
 * Both the URL serialiser (`lib/search/params.ts`) and the data source speak
 * this type, so a filter can be added in one place and work in the UI, in
 * shareable links, and against a future SQL adapter without a translation layer.
 */
export interface ResourceQuery {
  /** Free-text search. Empty or undefined means "browse, do not rank". */
  q?: string;

  categories?: string[];
  freeStatuses?: FreeStatus[];
  resourceTypes?: ResourceType[];
  platforms?: Platform[];
  tags?: string[];
  /** Matches against `alternativeTo`, for "free alternative to X" pages. */
  alternativeTo?: string;

  /** Restrict to open-source projects. */
  openSourceOnly?: boolean;
  /** Restrict to resources usable without creating an account. */
  noAccountOnly?: boolean;
  /** Restrict to resources that never ask for a card. */
  noCreditCardOnly?: boolean;
  /** Restrict to resources whose free use permits commercial work. */
  commercialUseOnly?: boolean;
  /** Restrict to resources explicitly free for personal use. */
  personalUseOnly?: boolean;

  verificationStatuses?: VerificationStatus[];

  sort?: SortOption;
  page?: number;
  perPage?: number;
}

export const SORT_OPTIONS = ["relevance", "recently-verified", "recently-updated", "name"] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * A page of ranked results.
 *
 * Extends `Paginated` with the one piece of state that is specific to ranking:
 * whether strict all-terms matching produced too few results and partial matches
 * were admitted. The UI needs this to explain why a loosely-related entry appears,
 * so it is typed rather than inferred.
 */
export interface ResourceQueryResult extends Paginated<ResourceMatch> {
  relaxedMatching: boolean;
}

/** Counts per facet value for the current result set, used to build filter UI. */
export interface ResourceFacets {
  freeStatuses: Record<string, number>;
  resourceTypes: Record<string, number>;
  platforms: Record<string, number>;
  categories: Record<string, number>;
  openSource: number;
  noAccount: number;
  noCreditCard: number;
  commercialUse: number;
}

/** Field-level tri-state helper used by filter predicates. */
export type AvailabilityFilter = Extract<Availability, "yes" | "no">;
