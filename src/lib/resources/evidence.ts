import { getVerificationCheck } from "@/config/verification";
import { isVerificationStale } from "@/lib/utils/date";
import type {
  Availability,
  IsoDate,
  Resource,
  VerificationCheck,
  VerificationCheckRecord,
  VerificationSource,
} from "@/types/resource";

/**
 * Evidence for individual facts.
 *
 * A listing stores values — `requiresCreditCard: "no"`, `openSource: true`,
 * `freeStatus: "FREE"`. A stored value is only a claim. Most of the library was
 * compiled from public documentation, so most stored values have never been checked
 * against an official source. Showing them the way a confirmed fact is shown — a
 * green tick, a "No credit card" reassurance, a strict filter match — would present
 * a claim as evidence.
 *
 * This module answers, for one fact on one listing: *how do we know?* The answer is
 * derived from the listing's existing `verificationChecks`, never stored a second
 * time, so it cannot disagree with the evidence the verification panel shows.
 *
 * Three states, and nothing is promoted from one to another by default:
 *
 * - `confirmed`   — a current check record, citing a dated official source, confirms
 *                   the stored value.
 * - `unconfirmed` — a value is recorded, but no current check confirms it: nobody has
 *                   checked it yet, or the check has aged past the re-check window.
 * - `unknown`     — the value itself is not established: it is stored as unknown, or
 *                   someone looked and could not settle it.
 *
 * A stored `"no"` or `false` is therefore not a confirmed no, and a stored `"yes"`
 * or `true` is not a confirmed yes. Only a check record makes it one.
 *
 * Fact evidence is separate from the listing's overall verification status. A
 * Partially verified listing can have confirmed facts next to unknown ones, and an
 * Unverified listing can have one confirmed fact — its licence, say — while its free
 * status is still unchecked.
 */

export const FACTS = [
  "freeStatus",
  "requiresAccount",
  "requiresCreditCard",
  "commercialUse",
  "personalUse",
  "openSource",
  "license",
  "platforms",
  "limitations",
  "freeTierLimits",
  "pricing",
] as const;

export type Fact = (typeof FACTS)[number];

/** The facts stored as yes / no / unknown. */
export type TriStateFact = "requiresAccount" | "requiresCreditCard" | "commercialUse" | "personalUse";

export const TRI_STATE_FACTS: readonly TriStateFact[] = ["requiresAccount", "requiresCreditCard", "commercialUse", "personalUse"];

/** Which verification check establishes each fact. One check per fact, no inference across checks. */
export const FACT_CHECK: Record<Fact, VerificationCheck> = {
  freeStatus: "FREE_STATUS",
  requiresAccount: "ACCOUNT_REQUIREMENT",
  requiresCreditCard: "CREDIT_CARD_REQUIREMENT",
  commercialUse: "COMMERCIAL_USE",
  personalUse: "PERSONAL_USE",
  openSource: "OPEN_SOURCE_STATUS",
  license: "LICENSE",
  platforms: "PLATFORM_AVAILABILITY",
  limitations: "LIMITATIONS",
  freeTierLimits: "FREE_TIER_LIMITS",
  pricing: "PRICING_INFORMATION",
};

export type EvidenceState = "confirmed" | "unconfirmed" | "unknown";

/**
 * Why a fact has the state it has. The state drives behaviour (filters, which
 * statement a card may make); the reason drives the words a person reads.
 */
export type EvidenceReason =
  | "confirmed" //       → Confirmed
  | "stale" //           → Needs re-checking
  | "not-checked" //     → Not verified
  | "unresolved" //      → Not confirmed
  | "not-established"; // → Unknown

export interface FactEvidence {
  fact: Fact;
  check: VerificationCheck;
  state: EvidenceState;
  reason: EvidenceReason;
  /** The check record behind the state, when one exists. */
  record?: VerificationCheckRecord;
  /** The official page the record rests on. */
  source?: VerificationSource;
  /** The date of the verification pass the record belongs to. */
  checkedAt?: IsoDate;
  /** Who performed that pass. */
  checkedBy?: string;
}

/** Whether the listing records a value for the fact at all. */
export function hasRecordedValue(resource: Resource, fact: Fact): boolean {
  switch (fact) {
    case "freeStatus":
      return resource.freeStatus !== "UNKNOWN";
    case "requiresAccount":
    case "requiresCreditCard":
    case "commercialUse":
    case "personalUse":
      return resource[fact] !== "unknown";
    case "license":
      return Boolean(resource.license);
    case "platforms":
      return resource.platforms.length > 0;
    case "openSource":
    case "limitations":
    case "freeTierLimits":
    case "pricing":
      // Always carries a value: a boolean, or a list that may legitimately be short.
      return true;
  }
}

/**
 * The evidence for one fact on one listing.
 *
 * `now` is a parameter so tests, and anything computing staleness, pass time in
 * explicitly rather than reading the clock.
 */
export function factEvidence(resource: Resource, fact: Fact, now: Date = new Date()): FactEvidence {
  const check = FACT_CHECK[fact];
  const record = resource.verificationChecks?.find((entry) => entry.check === check);
  const source = record?.sourceUrl
    ? resource.verificationSources?.find((entry) => entry.url === record.sourceUrl)
    : undefined;
  const base = {
    fact,
    check,
    record,
    source,
    checkedAt: record ? resource.lastVerifiedAt : undefined,
    checkedBy: record ? resource.verifiedBy : undefined,
  };

  if (record?.result === "confirmed") {
    // A confirmation expires with the pass it belongs to, exactly as the badge does.
    return isVerificationStale(resource.lastVerifiedAt, now)
      ? { ...base, state: "unconfirmed", reason: "stale" }
      : { ...base, state: "confirmed", reason: "confirmed" };
  }
  if (record?.result === "unresolved") return { ...base, state: "unknown", reason: "unresolved" };
  if (!hasRecordedValue(resource, fact)) return { ...base, state: "unknown", reason: "not-established" };
  return { ...base, state: "unconfirmed", reason: "not-checked" };
}

export function isFactConfirmed(resource: Resource, fact: Fact, now: Date = new Date()): boolean {
  return factEvidence(resource, fact, now).state === "confirmed";
}

/**
 * The value of a yes/no fact *only if an official source confirms it*; otherwise
 * `null`. Anything that makes a promise to a visitor — a reassurance on a card, a
 * strict filter — reads facts through this, so an unchecked "no" can never behave
 * like a confirmed one.
 */
export function confirmedAvailability(
  resource: Resource,
  fact: TriStateFact,
  now: Date = new Date(),
): Exclude<Availability, "unknown"> | null {
  const value = resource[fact];
  if (value === "unknown") return null;
  return isFactConfirmed(resource, fact, now) ? value : null;
}

/* -------------------------------------------------------------------------- */
/* Words                                                                      */
/* -------------------------------------------------------------------------- */

export const evidenceLabels: Record<EvidenceReason, string> = {
  confirmed: "Confirmed",
  stale: "Needs re-checking",
  "not-checked": "Not verified",
  unresolved: "Not confirmed",
  "not-established": "Unknown",
};

/** One sentence explaining an evidence state, for detail pages. */
export function evidenceExplanation(evidence: FactEvidence): string {
  switch (evidence.reason) {
    case "confirmed":
      return "Confirmed from the provider's own page.";
    case "stale":
      return "Was confirmed, but the check is older than the re-check window, so it may have changed.";
    case "unresolved":
      return "Looked for on the provider's own pages, but not settled.";
    case "not-established":
      return "Not established yet. Nobody has confirmed it either way.";
    case "not-checked":
      return "Recorded when the listing was compiled. Nobody has checked it against an official source yet.";
  }
}

export const factLabels: Record<Fact, string> = {
  freeStatus: "Free status",
  requiresAccount: "Account requirement",
  requiresCreditCard: "Credit-card requirement",
  commercialUse: "Commercial use",
  personalUse: "Personal use",
  openSource: "Open-source status",
  license: "Licence",
  platforms: "Platforms",
  limitations: "Limitations",
  freeTierLimits: "Free-tier limits",
  pricing: "Pricing",
};

/** Short names, for compact lists such as "Not verified: free status, credit card". */
export const factShortLabels: Record<Fact, string> = {
  freeStatus: "free status",
  requiresAccount: "account",
  requiresCreditCard: "credit card",
  commercialUse: "commercial use",
  personalUse: "personal use",
  openSource: "open source",
  license: "licence",
  platforms: "platforms",
  limitations: "limitations",
  freeTierLimits: "free-tier limits",
  pricing: "pricing",
};

/** What a confirmed yes/no fact means, in plain words. */
export const triStateStatements: Record<TriStateFact, Record<"yes" | "no", string>> = {
  requiresCreditCard: { no: "No credit card needed", yes: "Credit card required" },
  requiresAccount: { no: "No account needed", yes: "Account required" },
  commercialUse: { yes: "Commercial use allowed", no: "Not for commercial use" },
  personalUse: { yes: "Personal use allowed", no: "Not for personal use" },
};

/** Whether a confirmed value is the reassuring one ("no card", "commercial use allowed"). */
export function isFavourable(fact: TriStateFact, value: "yes" | "no"): boolean {
  return fact === "requiresCreditCard" || fact === "requiresAccount" ? value === "no" : value === "yes";
}

/* -------------------------------------------------------------------------- */
/* Card summary                                                               */
/* -------------------------------------------------------------------------- */

/** The facts a card has room for, in the order people ask about them. */
export const CARD_FACTS: readonly TriStateFact[] = ["requiresCreditCard", "requiresAccount", "commercialUse"];

export interface CardEvidenceGroup {
  reason: EvidenceReason;
  label: string;
  items: { fact: Fact; text: string }[];
}

/**
 * The compact, honest summary a card shows: one line per evidence state, never a
 * table. Confirmed facts state their value ("no credit card needed"); every other
 * fact is named without a value ("Not verified: credit card, account"), because a
 * card has no room to explain an unconfirmed value and must not look as if it is
 * making the claim.
 *
 * The free status is included only when it is *not* confirmed. When it is, the
 * listing's badge already says so — Partially verified and Verified both require it.
 */
export function cardEvidenceSummary(resource: Resource, now: Date = new Date()): CardEvidenceGroup[] {
  const order: EvidenceReason[] = ["confirmed", "unresolved", "stale", "not-checked", "not-established"];
  const groups = new Map<EvidenceReason, CardEvidenceGroup>();
  const add = (reason: EvidenceReason, fact: Fact, text: string) => {
    const group = groups.get(reason) ?? { reason, label: evidenceLabels[reason], items: [] };
    group.items.push({ fact, text });
    groups.set(reason, group);
  };

  const freeStatus = factEvidence(resource, "freeStatus", now);
  if (freeStatus.state !== "confirmed") add(freeStatus.reason, "freeStatus", factShortLabels.freeStatus);

  for (const fact of CARD_FACTS) {
    const evidence = factEvidence(resource, fact, now);
    const value = resource[fact];
    if (evidence.state === "confirmed" && value !== "unknown") {
      const statement = triStateStatements[fact][value];
      add("confirmed", fact, statement.charAt(0).toLowerCase() + statement.slice(1));
    } else {
      add(evidence.reason, fact, factShortLabels[fact]);
    }
  }

  return order.flatMap((reason) => {
    const group = groups.get(reason);
    return group ? [group] : [];
  });
}

/** The label to show beside a fact on a detail page, including the check it rests on. */
export function checkLabel(check: VerificationCheck): string {
  return getVerificationCheck(check).label;
}
