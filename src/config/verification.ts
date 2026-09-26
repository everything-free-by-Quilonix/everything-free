import type { IconName } from "@/components/icons";
import {
  VERIFICATION_CHECKS,
  VERIFICATION_STATUSES,
  type VerificationCheck,
  type VerificationCheckRecord,
  type VerificationStatus,
} from "@/types/resource";
import type { StatusTone } from "./free-status";

/**
 * The trust system.
 *
 * A directory is only worth using if you can tell how much to trust each entry.
 * These statuses are shown on every card and detail page alongside the date the
 * claim was last checked, so a stale listing is visibly stale rather than
 * quietly wrong.
 */

export interface VerificationDefinition {
  id: VerificationStatus;
  label: string;
  summary: string;
  definition: string;
  tone: StatusTone;
  icon: IconName;
}

export const verificationDefinitions: Record<VerificationStatus, VerificationDefinition> = {
  VERIFIED: {
    id: "VERIFIED",
    label: "Verified",
    summary: "Free status and limits confirmed against official sources.",
    definition:
      "A contributor opened the official pricing, licence or documentation pages and confirmed every claim in the listing, recording what they checked.",
    tone: "success",
    icon: "shield-check",
  },
  PARTIALLY_VERIFIED: {
    id: "PARTIALLY_VERIFIED",
    label: "Partially verified",
    summary: "Core claims checked; some details still need confirmation.",
    definition:
      "The resource exists, is reachable, and the headline free status is right, but at least one detail — an exact limit, commercial-use terms, or platform coverage — has not been confirmed against an official source.",
    tone: "info",
    icon: "shield-alert",
  },
  UNVERIFIED: {
    id: "UNVERIFIED",
    label: "Unverified",
    summary: "Submitted but not yet checked by anyone.",
    definition: "The entry is in the library but no verification pass has happened. Treat the details as a starting point.",
    tone: "neutral",
    icon: "help-circle",
  },
  OUTDATED: {
    id: "OUTDATED",
    label: "Needs re-checking",
    summary: "Last verified long enough ago that it may have changed.",
    definition:
      "Free plans change often. Once a listing passes its re-check window it is marked here until someone confirms it again.",
    tone: "warning",
    icon: "clock",
  },
  REPORTED: {
    id: "REPORTED",
    label: "Reported",
    summary: "Someone has flagged a problem that is still open.",
    definition:
      "A user reported that something is wrong — a dead link, a changed price, an inaccurate limit. The report is shown until it is resolved rather than hidden.",
    tone: "danger",
    icon: "flag",
  },
};

export const verificationList: VerificationDefinition[] = VERIFICATION_STATUSES.map(
  (id) => verificationDefinitions[id],
);

export function getVerification(id: VerificationStatus): VerificationDefinition {
  return verificationDefinitions[id];
}

export function isVerificationStatus(value: string): value is VerificationStatus {
  return Object.hasOwn(verificationDefinitions, value);
}

/**
 * How long a verification is considered current, in days.
 *
 * Used by `lib/resources/derive.ts` to decide when a listing should be surfaced
 * as needing a re-check. Ninety days is a deliberate compromise: free tiers
 * change more slowly than that in practice, but not much more slowly.
 */
export const VERIFICATION_FRESHNESS_DAYS = 90;

/* -------------------------------------------------------------------------- */
/* The verification checklist                                                 */
/* -------------------------------------------------------------------------- */

export interface VerificationCheckDefinition {
  id: VerificationCheck;
  label: string;
  /** What a contributor has to establish to mark this confirmed. */
  question: string;
  /**
   * Whether `VERIFIED` requires it.
   *
   * The required set is the group of facts that determine whether — and on what
   * terms — a resource is actually free. Those are the claims a user acts on. Facts
   * that are merely convenient, such as which platforms are supported, are worth
   * recording but do not by themselves make a listing untrustworthy.
   */
  requiredForVerified: boolean;
}

export const verificationCheckDefinitions: Record<VerificationCheck, VerificationCheckDefinition> = {
  OFFICIAL_URL: {
    id: "OFFICIAL_URL",
    label: "Official URL",
    question: "Does the link go to the provider's own site, and does it load?",
    requiredForVerified: true,
  },
  FREE_STATUS: {
    id: "FREE_STATUS",
    label: "Free status",
    question: "Does the provider's own documentation support the free-status classification?",
    requiredForVerified: true,
  },
  FREE_TIER_LIMITS: {
    id: "FREE_TIER_LIMITS",
    label: "Free-tier limits",
    question: "What exactly does the free offering cap, and is that recorded?",
    requiredForVerified: true,
  },
  LIMITATIONS: {
    id: "LIMITATIONS",
    label: "Major limitations",
    question: "Are the significant limitations documented, including inconvenient ones?",
    requiredForVerified: true,
  },
  ACCOUNT_REQUIREMENT: {
    id: "ACCOUNT_REQUIREMENT",
    label: "Account requirement",
    question: "Can it be used without creating an account?",
    requiredForVerified: true,
  },
  CREDIT_CARD_REQUIREMENT: {
    id: "CREDIT_CARD_REQUIREMENT",
    label: "Credit-card requirement",
    question: "Is a payment method required to start using the free offering?",
    requiredForVerified: true,
  },
  COMMERCIAL_USE: {
    id: "COMMERCIAL_USE",
    label: "Commercial use",
    question: "Do the terms permit paid or business use of the free offering?",
    requiredForVerified: true,
  },
  PERSONAL_USE: {
    id: "PERSONAL_USE",
    label: "Personal use",
    question: "Do the terms permit personal, non-commercial use?",
    requiredForVerified: true,
  },
  LICENSE: {
    id: "LICENSE",
    label: "Licence",
    question: "Is the recorded licence the one the provider actually publishes?",
    requiredForVerified: true,
  },
  PRICING_INFORMATION: {
    id: "PRICING_INFORMATION",
    label: "Pricing information",
    question: "Where does the free/paid boundary sit, according to the provider?",
    requiredForVerified: true,
  },
  OPEN_SOURCE_STATUS: {
    id: "OPEN_SOURCE_STATUS",
    label: "Open-source status",
    question: "Is the source genuinely published under an open-source licence?",
    requiredForVerified: false,
  },
  PLATFORM_AVAILABILITY: {
    id: "PLATFORM_AVAILABILITY",
    label: "Platform availability",
    question: "Are the listed platforms the ones the provider supports?",
    requiredForVerified: false,
  },
};

export const verificationCheckList: VerificationCheckDefinition[] = VERIFICATION_CHECKS.map(
  (id) => verificationCheckDefinitions[id],
);

/** Checks that must all be confirmed before a listing may claim `VERIFIED`. */
export const requiredVerificationChecks: VerificationCheck[] = verificationCheckList
  .filter((check) => check.requiredForVerified)
  .map((check) => check.id);

export function getVerificationCheck(id: VerificationCheck): VerificationCheckDefinition {
  return verificationCheckDefinitions[id];
}

export function isVerificationCheck(value: string): value is VerificationCheck {
  return Object.hasOwn(verificationCheckDefinitions, value);
}

/** Checks recorded as confirmed in a pass. */
export function confirmedChecks(records: readonly VerificationCheckRecord[] = []): VerificationCheck[] {
  return records.filter((record) => record.result === "confirmed").map((record) => record.check);
}

/** Checks examined but not established. */
export function unresolvedChecks(records: readonly VerificationCheckRecord[] = []): VerificationCheck[] {
  return records.filter((record) => record.result === "unresolved").map((record) => record.check);
}

/** Required checks that are not confirmed — whether unresolved or never examined. */
export function missingRequiredChecks(records: readonly VerificationCheckRecord[] = []): VerificationCheck[] {
  const confirmed = new Set(confirmedChecks(records));
  return requiredVerificationChecks.filter((check) => !confirmed.has(check));
}

/**
 * A GitHub handle: `@` followed by 1–39 alphanumerics or single hyphens, not
 * starting or ending with a hyphen — GitHub's own username rules.
 */
const GITHUB_HANDLE = /^@[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

/**
 * Whether `verifiedBy` names an accountable person.
 *
 * `VERIFIED` is a human claim. Automation and AI-assisted passes are useful for
 * gathering and recording evidence, and that work is kept — but promoting a listing
 * to `VERIFIED` requires a maintainer to review the evidence and put their own
 * handle on it. This is the rule that stops any tool, script or agent from awarding
 * the badge on its own.
 */
export function isAccountableVerifier(verifiedBy: string | undefined): boolean {
  return typeof verifiedBy === "string" && GITHUB_HANDLE.test(verifiedBy);
}
