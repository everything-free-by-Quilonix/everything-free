/**
 * The library census: every number the homepage introduction states.
 *
 * Pure and computed at build from the repository, so the copy can never claim
 * more than the data holds. No count anywhere in the homepage is typed by hand.
 *
 * Verification states use `effectiveVerification`, so a verification that has
 * aged past the re-check window is not counted as verified. "Has a confirmed
 * fact" uses `factEvidence` over every fact, the same reading the records use.
 */

import { categoryGroups, categoryList } from "@/config/categories";
import { availableTools } from "@/config/tools";
import { effectiveVerification } from "@/lib/resources/derive";
import { FACTS, factEvidence } from "@/lib/resources/evidence";
import { computeFacets } from "@/lib/search/filters";
import type { Resource } from "@/types/resource";

// The count copy helpers live in a data-free module so client components can
// share them; re-exported here for the introduction's existing imports.
export { countNoun, plural } from "@/components/ui/count";

export interface LibraryCensus {
  listings: number;
  subjectsWithListings: number;
  subjectsDefined: number;
  groups: number;
  verified: number;
  partiallyVerified: number;
  withConfirmedFact: number;
  /**
   * Mutually exclusive segments for the Survey bar, in drawing order. They sum
   * to `listings`: a listing falls in the first segment it qualifies for.
   */
  survey: { verified: number; partiallyVerified: number; otherConfirmedFact: number; noConfirmedFact: number };
  toolsAvailable: number;
}

/** Whether at least one of the listing's facts is confirmed by an official source. */
export function hasConfirmedFact(resource: Resource, now: Date = new Date()): boolean {
  return FACTS.some((fact) => factEvidence(resource, fact, now).state === "confirmed");
}

export function libraryCensus(resources: readonly Resource[], now: Date = new Date()): LibraryCensus {
  const facets = computeFacets(resources, {});
  const survey = { verified: 0, partiallyVerified: 0, otherConfirmedFact: 0, noConfirmedFact: 0 };
  let verified = 0;
  let partiallyVerified = 0;
  let withConfirmedFact = 0;

  for (const resource of resources) {
    const status = effectiveVerification(resource, now).id;
    const confirmedFact = hasConfirmedFact(resource, now);
    if (status === "VERIFIED") verified += 1;
    if (status === "PARTIALLY_VERIFIED") partiallyVerified += 1;
    if (confirmedFact) withConfirmedFact += 1;

    if (status === "VERIFIED") survey.verified += 1;
    else if (status === "PARTIALLY_VERIFIED") survey.partiallyVerified += 1;
    else if (confirmedFact) survey.otherConfirmedFact += 1;
    else survey.noConfirmedFact += 1;
  }

  return {
    listings: resources.length,
    subjectsWithListings: categoryList.filter((category) => (facets.categories[category.id] ?? 0) > 0).length,
    subjectsDefined: categoryList.length,
    groups: categoryGroups.length,
    verified,
    partiallyVerified,
    withConfirmedFact,
    survey,
    toolsAvailable: availableTools.length,
  };
}
