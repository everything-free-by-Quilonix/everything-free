/**
 * Synthetic listings for the unit tests.
 *
 * Built through the same `defineResource` the real data uses, so a fixture is a
 * complete, well-formed `Resource`. Each test then states only what it is about:
 * the status, the stored values, the check records.
 */

import { defineResource, type ResourceSeed } from "@/data/resources/define";
import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

export const TODAY = new Date("2026-09-27T12:00:00Z");
export const SOURCE = "https://example.org/pricing";

/** A fixed pass date, well inside the 90-day window relative to TODAY. */
export const PASS_DATE = "2026-09-26";

export function confirmed(check: VerificationCheck): VerificationCheckRecord {
  return {
    check,
    result: "confirmed",
    evidence: `The provider's own page states the ${check} value recorded here.`,
    sourceUrl: SOURCE,
  };
}

export function unresolved(check: VerificationCheck): VerificationCheckRecord {
  return {
    check,
    result: "unresolved",
    evidence: `The provider's own pages do not settle ${check}; recorded as unknown.`,
    sourceUrl: SOURCE,
  };
}

const REQUIRED: VerificationCheck[] = [
  "OFFICIAL_URL",
  "FREE_STATUS",
  "FREE_TIER_LIMITS",
  "LIMITATIONS",
  "ACCOUNT_REQUIREMENT",
  "CREDIT_CARD_REQUIREMENT",
  "COMMERCIAL_USE",
  "PERSONAL_USE",
  "LICENSE",
  "PRICING_INFORMATION",
];

/** Every required check confirmed. */
export function allRequiredConfirmed(): VerificationCheckRecord[] {
  return REQUIRED.map(confirmed);
}

/** A listing that has never been checked: compiled values only. */
export function makeResource(overrides: Partial<ResourceSeed> = {}): Resource {
  return defineResource({
    slug: "fixture",
    name: "Fixture",
    shortDescription: "A synthetic listing used by the unit tests.",
    longDescription: "A synthetic listing used by the unit tests.",
    whyListed: "It exists so the tests can describe one situation at a time.",
    category: "utilities",
    resourceType: "WEB_APP",
    officialUrl: "https://example.org",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    verificationStatus: "UNVERIFIED",
    ...overrides,
  });
}

/** Adds a verification pass (date, verifier, notes, source) around the given records. */
export function withPass(
  records: VerificationCheckRecord[],
  overrides: Partial<ResourceSeed> = {},
  { date = PASS_DATE, verifiedBy = "agent-assisted pass — awaiting maintainer review" } = {},
): Resource {
  return makeResource({
    verificationChecks: records,
    lastVerifiedAt: date,
    verifiedBy,
    verificationNotes: "A synthetic pass for the unit tests.",
    verificationSources: [{ url: SOURCE, label: "A synthetic official pricing page", retrievedAt: date }],
    ...overrides,
  });
}
