import type { Resource, ResourceLogo } from "@/types/resource";

/**
 * The date this seed set was compiled. Kept in one place so that every entry's
 * `submittedAt` is consistent and a future verification pass can tell which
 * entries have never been touched since seeding.
 */
export const SEED_DATE = "2026-09-25";

/**
 * Fields a seed entry must state explicitly.
 *
 * Anything that carries a factual claim about the resource is required: there is
 * no default for `freeStatus`, `requiresAccount`, `commercialUse` or
 * `verificationStatus`, because a default would be us inventing an answer.
 * Only presentational and additive fields get defaults.
 */
type RequiredFields =
  | "slug"
  | "name"
  | "shortDescription"
  | "longDescription"
  | "whyListed"
  | "category"
  | "resourceType"
  | "officialUrl"
  | "freeStatus"
  | "openSource"
  | "platforms"
  | "requiresAccount"
  | "requiresCreditCard"
  | "commercialUse"
  | "personalUse"
  | "verificationStatus";

export type ResourceSeed = Pick<Resource, RequiredFields> &
  Partial<Omit<Resource, RequiredFields | "id" | "logo">> & {
    /** Override the generated monogram, or supply a self-hosted image. */
    logo?: ResourceLogo;
  };

/**
 * Derives a one or two character monogram from a resource name.
 *
 * Multi-word names take the initials of the first two words; single words take
 * the first two characters. Non-alphanumeric leading characters are skipped so
 * that names like ".NET" or "7-Zip" still produce something sensible.
 */
function monogramFor(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
    .split(/[\s.-]+/)
    .filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Normalises a seed entry into a complete `Resource`.
 *
 * Defaults applied here are all "absence of a claim" defaults: empty arrays,
 * `false` for capabilities the vendor does not advertise, and `id` mirroring
 * `slug`. None of them assert anything about the resource that has not been
 * recorded.
 */
export function defineResource(seed: ResourceSeed): Resource {
  // `...seed` comes first so the `??` defaults below always win over an
  // explicitly-passed `undefined`, which would otherwise punch a hole in the type.
  return {
    ...seed,
    id: seed.slug,
    logo: seed.logo ?? { kind: "monogram", text: monogramFor(seed.name) },
    screenshots: seed.screenshots ?? [],
    subcategories: seed.subcategories ?? [],
    languages: seed.languages ?? [],
    features: seed.features ?? [],
    tags: seed.tags ?? [],
    limitations: seed.limitations ?? [],
    alternativeTo: seed.alternativeTo ?? [],
    relatedResources: seed.relatedResources ?? [],
    apiAvailable: seed.apiAvailable ?? false,
    embedAvailable: seed.embedAvailable ?? false,
    downloadAvailable: seed.downloadAvailable ?? false,
    submittedAt: seed.submittedAt ?? SEED_DATE,
    updatedAt: seed.updatedAt ?? SEED_DATE,
  } satisfies Resource;
}

/** Convenience wrapper so data files read as a list of entries. */
export function defineResources(seeds: ResourceSeed[]): Resource[] {
  return seeds.map(defineResource);
}
