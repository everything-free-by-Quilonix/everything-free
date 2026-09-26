import { seedResources } from "@/data/resources";
import { matchesFilters } from "@/lib/search/filters";
import { facetsFor, queryResources } from "@/lib/search/run-search";
import { slugifyProductName } from "@/lib/utils/slug";
import type { Resource } from "@/types/resource";
import type { ResourceDataSource } from "./types";

/**
 * In-memory data source over the structured, version-controlled seed data.
 *
 * This is the Git-based content source: resources live in `src/data/resources/` as
 * typed modules, validated at build time, reviewed as pull requests. At 43 entries
 * an O(n) scan is faster than any index would be, and it means the library has no
 * database, no connection string and no runtime cost.
 *
 * The search pipeline lives in `lib/search/run-search.ts` rather than here, so the
 * browser can execute exactly the same filtering and ranking. This adapter is now
 * only responsible for *supplying the data* and answering lookup questions.
 *
 * It implements the same `ResourceDataSource` contract a SQL adapter would, so
 * introducing a database later is a one-line change in `repository/index.ts`. See
 * `docs/architecture.md` for the migration trigger.
 */

const bySlug = new Map<string, Resource>(seedResources.map((resource) => [resource.slug, resource]));

/** Resources eligible for listing, i.e. excluding non-listable free statuses. */
const listable = seedResources.filter((resource) => matchesFilters(resource, {}));

export const seedDataSource: ResourceDataSource = {
  name: "seed",

  async query(query) {
    return queryResources(seedResources, query);
  },

  async facets(query) {
    return facetsFor(seedResources, query);
  },

  async getBySlug(slug) {
    return bySlug.get(slug) ?? null;
  },

  async getManyBySlugs(slugs) {
    // Preserves the order the caller asked for, which is meaningful for curated
    // lists such as collections.
    return slugs.flatMap((slug) => {
      const resource = bySlug.get(slug);
      return resource ? [resource] : [];
    });
  },

  async count() {
    return listable.length;
  },

  async listIndexEntries() {
    return listable.map((resource) => ({ slug: resource.slug, updatedAt: resource.updatedAt }));
  },

  async listAlternativeTargets() {
    const counts = new Map<string, { name: string; count: number }>();

    for (const resource of listable) {
      for (const name of resource.alternativeTo) {
        const key = slugifyProductName(name);
        const existing = counts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, { name, count: 1 });
        }
      }
    }

    return [...counts.entries()]
      .map(([slug, { name, count }]) => ({ slug, name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },

  async listTags() {
    const counts = new Map<string, number>();
    for (const resource of listable) {
      for (const tag of resource.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  },

  /**
   * The whole listable library, for the client-side search on `/resources`.
   *
   * Only the Git-based adapter can answer this cheaply. A database adapter should
   * either omit it or return a bounded projection — see the note on the interface.
   */
  async listAllForClient() {
    return listable;
  },
};
