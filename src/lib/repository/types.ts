import type { Resource } from "@/types/resource";
import type { ResourceFacets, ResourceQuery, ResourceQueryResult } from "@/types/search";

/**
 * The storage contract.
 *
 * Every read the application performs goes through this interface. The seed
 * adapter implements it in memory; a Postgres or Supabase adapter would implement
 * the same methods with SQL. Nothing above this layer knows which is in use.
 *
 * Two design choices matter here:
 *
 * 1. `query()` takes the whole `ResourceQuery` rather than returning everything
 *    for the caller to filter. That allows a future SQL adapter to push filtering,
 *    sorting and pagination into the database instead of loading the table into
 *    memory. An adapter that cannot push down is free to filter locally.
 *
 * 2. Every method is async even though the seed adapter is synchronous. Making
 *    that explicit now means moving to a real database is not a breaking change
 *    for every call site.
 */
export interface ResourceDataSource {
  /** Identifies the adapter in diagnostics. */
  readonly name: string;

  /** Filtered, ranked, paginated results. */
  query(query: ResourceQuery): Promise<ResourceQueryResult>;

  /**
   * Facet counts for the query, used to build filter UI with live counts.
   * Separate from `query()` because counts span the whole matching set, not the
   * current page.
   */
  facets(query: ResourceQuery): Promise<ResourceFacets>;

  getBySlug(slug: string): Promise<Resource | null>;

  /** Batch read, so related-resource lists are one call rather than N. */
  getManyBySlugs(slugs: readonly string[]): Promise<Resource[]>;

  /** Total listable resources. */
  count(): Promise<number>;

  /** Every listable slug with its last-modified date, for the sitemap. */
  listIndexEntries(): Promise<{ slug: string; updatedAt: string }[]>;

  /** Distinct paid products that free resources are listed as alternatives to. */
  listAlternativeTargets(): Promise<{ name: string; slug: string; count: number }[]>;

  /** Distinct tags with counts, for tag navigation. */
  listTags(): Promise<{ tag: string; count: number }[]>;

  /**
   * The entire listable library, handed to the browser so `/resources` can filter
   * and rank client-side and therefore be a static file rather than a
   * server-rendered response.
   *
   * This is the one method that does not scale, and that is deliberate and
   * bounded: it is viable precisely while the library is small enough to ship to a
   * client, which is the same condition under which a database is unnecessary.
   * When this becomes too large to send — see the migration trigger in
   * `docs/architecture.md` — a database adapter should stop implementing it and
   * `/resources` should move back to server-rendered search.
   */
  listAllForClient(): Promise<readonly Resource[]>;
}
