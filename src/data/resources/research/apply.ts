import type { Resource, VerificationCheck } from "@/types/resource";

import { RESEARCH_VERIFIER, type ResearchPass } from "../entertainment/define-media";

/**
 * Research overlays: dated evidence for listings that already exist.
 *
 * Most of the library was compiled in batches with no checks recorded. Rewriting
 * those files to add evidence would bury each fact's source in a large diff, so a
 * research pass is recorded here instead, keyed by slug:
 *
 * - `set` corrects facts the official page contradicts or settles. Every
 *   corrected fact should be backed by a confirmed check in `research`.
 * - `research` is the pass itself — pages read, checks, what was not settled.
 *
 * The verification status is derived, exactly as for entertainment listings:
 * PARTIALLY_VERIFIED with a confirmed FREE_STATUS check, never VERIFIED (that
 * needs a maintainer). The merged listing goes through the normal validator.
 */

/** Facts a research pass may correct. Identity, taxonomy and the status fields are excluded. */
export type ResearchCorrection = Partial<
  Pick<
    Resource,
    | "shortDescription"
    | "longDescription"
    | "whyListed"
    | "officialUrl"
    | "pricingUrl"
    | "freeStatus"
    | "platforms"
    | "requiresAccount"
    | "requiresCreditCard"
    | "commercialUse"
    | "personalUse"
    | "limitations"
    | "features"
    | "pricingNotes"
  >
>;

export interface ResearchOverlay {
  slug: string;
  set?: ResearchCorrection;
  research: ResearchPass;
}

function confirmed(pass: ResearchPass, check: VerificationCheck): boolean {
  return pass.checks.some((record) => record.check === check && record.result === "confirmed");
}

/**
 * Applies overlays to the library. Throws on an unknown or repeated slug, so a
 * renamed listing cannot silently lose its evidence.
 */
export function applyResearch(resources: Resource[], overlays: readonly ResearchOverlay[]): Resource[] {
  const bySlug = new Map<string, ResearchOverlay>();
  for (const overlay of overlays) {
    if (bySlug.has(overlay.slug)) throw new Error(`Research overlay for "${overlay.slug}" is defined twice`);
    bySlug.set(overlay.slug, overlay);
  }

  const known = new Set(resources.map((resource) => resource.slug));
  for (const slug of bySlug.keys()) {
    if (!known.has(slug)) throw new Error(`Research overlay targets "${slug}", which is not in the library`);
  }

  return resources.map((resource) => {
    const overlay = bySlug.get(resource.slug);
    if (!overlay) return resource;
    const { research, set } = overlay;

    return {
      ...resource,
      ...set,
      verificationStatus: confirmed(research, "FREE_STATUS") ? "PARTIALLY_VERIFIED" : "UNVERIFIED",
      lastVerifiedAt: research.date,
      verifiedBy: RESEARCH_VERIFIER,
      verificationNotes: research.notes,
      verificationSources: research.sources.map((source) => ({
        url: source.url,
        label: source.label,
        retrievedAt: source.retrievedAt ?? research.date,
      })),
      verificationChecks: research.checks,
      updatedAt: research.date,
    };
  });
}
