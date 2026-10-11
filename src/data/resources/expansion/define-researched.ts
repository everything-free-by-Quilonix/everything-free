import type { Resource } from "@/types/resource";

import { defineResource, type ResourceSeed } from "../define";
import { RESEARCH_VERIFIER, type ResearchPass } from "../entertainment/define-media";

/**
 * Authoring helper for new listings outside Entertainment.
 *
 * Same contract as `defineMedia`: an entry carries the research pass that backs it
 * (pages read, per-check evidence, what was not settled), and its verification
 * status is derived from those checks rather than typed in:
 *
 * - a confirmed FREE_STATUS check gives PARTIALLY_VERIFIED;
 * - anything less is UNVERIFIED;
 * - never VERIFIED, which needs a registered maintainer's sign-off.
 */

type DerivedFields =
  | "verificationStatus"
  | "verificationNotes"
  | "verificationSources"
  | "verificationChecks"
  | "verifiedBy"
  | "lastVerifiedAt"
  | "submittedAt"
  | "updatedAt";

export type ResearchedSeed = Omit<ResourceSeed, DerivedFields> & {
  research: ResearchPass;
};

export function defineResearched({ research, ...seed }: ResearchedSeed): Resource {
  const freeConfirmed = research.checks.some((c) => c.check === "FREE_STATUS" && c.result === "confirmed");
  return defineResource({
    ...seed,
    verificationStatus: freeConfirmed ? "PARTIALLY_VERIFIED" : "UNVERIFIED",
    lastVerifiedAt: research.date,
    verifiedBy: RESEARCH_VERIFIER,
    verificationNotes: research.notes,
    verificationSources: research.sources.map((source) => ({
      url: source.url,
      label: source.label,
      retrievedAt: source.retrievedAt ?? research.date,
    })),
    verificationChecks: research.checks,
    submittedAt: research.date,
    updatedAt: research.date,
  });
}

export function defineResearchedList(seeds: ResearchedSeed[]): Resource[] {
  return seeds.map(defineResearched);
}
