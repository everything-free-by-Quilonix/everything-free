/**
 * The resource domain model.
 *
 * Design notes
 * ---------------------------------------------------------------------------
 * 1. Enumerations are declared as `as const` arrays with a derived union type.
 *    This gives one declaration that is usable both as a value (iterating to
 *    build filter UI, validating input) and as a type, with no duplication.
 *
 * 2. Tri-state facts use `Availability` instead of `boolean`. A directory that
 *    stores `requiresCreditCard: false` when nobody has actually checked is
 *    making a claim it cannot support. `'unknown'` is a first-class answer and
 *    the UI renders it as "not verified" rather than silently as "no".
 *
 * 3. Fields that are derivable are not stored. `browserAvailable`,
 *    `desktopAvailable` and `mobileAvailable` from the original field sketch
 *    are computed from `platforms` in `lib/resources/derive.ts`, so the two can
 *    never contradict each other.
 *
 * 4. There is deliberately no rating, review count, download count or view
 *    count. We do not collect that data, so we do not model it.
 */

/** ISO 8601 date, `YYYY-MM-DD`. Kept as a string so data stays serialisable. */
export type IsoDate = string;

/* -------------------------------------------------------------------------- */
/* Free status                                                                */
/* -------------------------------------------------------------------------- */

export const FREE_STATUSES = [
  "FREE",
  "FREE_TIER",
  "OPEN_SOURCE",
  "PERSONAL_FREE",
  "LIMITED_FREE",
  "TRIAL",
  "NOT_FREE",
  "UNKNOWN",
] as const;

export type FreeStatus = (typeof FREE_STATUSES)[number];

/* -------------------------------------------------------------------------- */
/* Resource type                                                              */
/* -------------------------------------------------------------------------- */

export const RESOURCE_TYPES = [
  "WEBSITE",
  "WEB_APP",
  "MOBILE_APP",
  "DESKTOP_APP",
  "OPEN_SOURCE",
  "AI_TOOL",
  "API",
  "COURSE",
  "BOOK",
  "GAME",
  "DATASET",
  "TEMPLATE",
  "FONT",
  "ICON",
  "STOCK_IMAGE",
  "STOCK_VIDEO",
  "STOCK_AUDIO",
  "MUSIC",
  "EDUCATIONAL_RESOURCE",
  "PRODUCTIVITY_TOOL",
  "BUSINESS_TOOL",
  "DEVELOPER_TOOL",
  "CREATIVE_TOOL",
  "UTILITY",
  "SERVICE",
  "COMMUNITY",
  "OTHER",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

/* -------------------------------------------------------------------------- */
/* Platforms                                                                  */
/* -------------------------------------------------------------------------- */

export const PLATFORMS = [
  "BROWSER",
  "WINDOWS",
  "MACOS",
  "LINUX",
  "ANDROID",
  "IOS",
  "SELF_HOSTED",
] as const;

export type Platform = (typeof PLATFORMS)[number];

/* -------------------------------------------------------------------------- */
/* Verification                                                               */
/* -------------------------------------------------------------------------- */

export const VERIFICATION_STATUSES = [
  "VERIFIED",
  "PARTIALLY_VERIFIED",
  "UNVERIFIED",
  "OUTDATED",
  "REPORTED",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

/**
 * The individual facts a verification pass can establish.
 *
 * Recording checks individually is what lets a verification badge be *derived from
 * evidence* rather than asserted. Before this existed, "verified" was one
 * contributor's judgement with no way to ask which fields they actually looked at;
 * now a resource page can show exactly what was confirmed and what is still
 * outstanding — which is the question `docs/verification.md` is built around.
 *
 * Each check a verifier looked at is recorded as a `VerificationCheckRecord`. A check
 * with no record was not looked at. There is deliberately no "failed" result: if a
 * source contradicts the listing, the fix is to correct the listing, then record the
 * check as confirmed against the corrected value.
 */
export const VERIFICATION_CHECKS = [
  "OFFICIAL_URL",
  "FREE_STATUS",
  "FREE_TIER_LIMITS",
  "ACCOUNT_REQUIREMENT",
  "CREDIT_CARD_REQUIREMENT",
  "PLATFORM_AVAILABILITY",
  "COMMERCIAL_USE",
  "PERSONAL_USE",
  "OPEN_SOURCE_STATUS",
  "LICENSE",
  "LIMITATIONS",
  "PRICING_INFORMATION",
] as const;

export type VerificationCheck = (typeof VERIFICATION_CHECKS)[number];

/**
 * A page that was actually read in order to confirm something.
 *
 * `retrievedAt` matters as much as the URL: a vendor pricing page is a moving
 * target, so evidence without a date is not evidence. Sources should be the
 * provider's own pages — see the guidance in `docs/verification.md`.
 */
export interface VerificationSource {
  url: string;
  /** What this specific page establishes. */
  label: string;
  /** When the page was read. */
  retrievedAt: IsoDate;
}

export const VERIFICATION_CHECK_RESULTS = ["confirmed", "unresolved"] as const;

/**
 * - `confirmed`  — an official source states it, and the listing matches.
 * - `unresolved` — it was looked for and could not be established from an official
 *                  source. Recorded rather than left blank, so the next verifier
 *                  knows where the gap is and why.
 */
export type VerificationCheckResult = (typeof VERIFICATION_CHECK_RESULTS)[number];

/**
 * The outcome of one check in one verification pass.
 *
 * Per-check rather than per-resource, because a resource is never uniformly
 * verified: a pricing page can settle the free-tier limits while saying nothing
 * about commercial use. Recording each check separately — with its own evidence and
 * its own source — is what lets someone see exactly which claims on a page are
 * backed and which are not.
 *
 * The verifier and date are not repeated here: a record belongs to the resource's
 * current verification pass (`verifiedBy`, `lastVerifiedAt`), and each source
 * carries the date it was read.
 */
export interface VerificationCheckRecord {
  check: VerificationCheck;
  result: VerificationCheckResult;
  /**
   * What the source actually says — paraphrased, specific, and checkable. For an
   * unresolved check, what was looked for and why it could not be settled.
   */
  evidence: string;
  /**
   * URL of the `verificationSources` entry this rests on. Required for `confirmed`;
   * optional for `unresolved`, where it records the page that was checked and came
   * up empty.
   */
  sourceUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* Tri-state facts                                                            */
/* -------------------------------------------------------------------------- */

export const AVAILABILITY_VALUES = ["yes", "no", "unknown"] as const;

/**
 * A fact we may not yet know. Never coerce `'unknown'` to `false` in the UI:
 * "we have not checked" and "no" are different claims to a user deciding
 * whether to trust a listing.
 */
export type Availability = (typeof AVAILABILITY_VALUES)[number];

/* -------------------------------------------------------------------------- */
/* Supporting shapes                                                          */
/* -------------------------------------------------------------------------- */

/**
 * How to render a resource's mark.
 *
 * We default to a generated monogram rather than hotlinking third-party logo
 * files: it avoids shipping trademarked artwork we have no licence to
 * redistribute, avoids third-party requests on every card, and avoids broken
 * images. `image` exists for the future case where a resource explicitly
 * permits logo use and the asset is self-hosted in `public/branding`.
 */
export type ResourceLogo =
  | { kind: "monogram"; text: string }
  | { kind: "image"; url: string; alt: string; width: number; height: number };

export interface Screenshot {
  url: string;
  /** Describes what the screenshot shows, for screen-reader users. */
  alt: string;
  width: number;
  height: number;
  /** Required when the image is not ours to use unconditionally. */
  attribution?: string;
}

/* -------------------------------------------------------------------------- */
/* Resource                                                                   */
/* -------------------------------------------------------------------------- */

export interface Resource {
  id: string;
  /** URL segment under `/resources/`. Stable; changing it breaks links. */
  slug: string;
  name: string;

  /** One line for cards. Keep under ~110 characters so cards do not reflow. */
  shortDescription: string;
  /** Two or three sentences for the detail page. Plain text, no markup. */
  longDescription: string;
  /**
   * Why this is in the library at all. Surfaced verbatim on the detail page so
   * a listing is never unexplained.
   */
  whyListed: string;

  /** Primary category. Drives the canonical category page a resource sits on. */
  category: string;
  /** Additional categories it legitimately belongs to. */
  subcategories: string[];
  resourceType: ResourceType;

  /** Canonical vendor URL. Always prefer the official domain. */
  officialUrl: string;
  /** Source repository, when the project publishes one. */
  sourceUrl?: string;
  /** Vendor-published pricing page, so users can check our claims themselves. */
  pricingUrl?: string;
  /** Vendor-published licence text or terms. */
  licenseUrl?: string;

  logo: ResourceLogo;
  screenshots: Screenshot[];

  freeStatus: FreeStatus;
  openSource: boolean;
  /** SPDX identifier where one applies, otherwise a short human description. */
  license?: string;
  /**
   * Nuance the licence field cannot carry. Used for cases like an open-source
   * codebase shipping under a different licence than its official binaries.
   */
  licenseNotes?: string;

  platforms: Platform[];
  /** Interface languages, as ISO 639-1 codes. Empty means not yet recorded. */
  languages: string[];

  requiresAccount: Availability;
  requiresCreditCard: Availability;
  commercialUse: Availability;
  personalUse: Availability;

  apiAvailable: boolean;
  /** Whether the vendor permits embedding it inside another product. */
  embedAvailable: boolean;
  downloadAvailable: boolean;

  /**
   * What the free offering does *not* do. Never empty for `FREE_TIER`,
   * `LIMITED_FREE`, `PERSONAL_FREE` or `TRIAL` — see `data/validate.ts`.
   */
  limitations: string[];
  /** Plain-language summary of the free/paid boundary. */
  pricingNotes?: string;
  /**
   * How the listing was put together before anyone verified it — what it was based
   * on and what is known to be missing. Useful to the next verifier, and shown on the
   * page as exactly that. It is **not** evidence: nothing here counts towards a
   * verification status, and it carries no date that could be mistaken for a check.
   */
  compilationNotes?: string;

  features: string[];
  tags: string[];

  /** Names of paid products people come here looking to replace. */
  alternativeTo: string[];
  /** Slugs of resources worth looking at next. Symmetry is not required. */
  relatedResources: string[];

  verificationStatus: VerificationStatus;
  /**
   * What the current verification pass checked, how, and what it could not settle.
   * Only valid alongside recorded `verificationChecks`; notes from before any check
   * was recorded belong in `compilationNotes`.
   */
  verificationNotes?: string;
  /**
   * The date of the current verification pass. Only valid alongside recorded
   * `verificationChecks` — a date with no recorded checks would read as a check that
   * happened but left no evidence.
   */
  lastVerifiedAt?: IsoDate;
  /**
   * Who performed the current verification pass.
   *
   * For `VERIFIED` this must be the GitHub handle (`@name`) of a maintainer listed in
   * `config/maintainers.ts` — a person accountable for the claim. Any other value,
   * such as a description of an automated or agent-assisted pass, can record evidence
   * but cannot award `VERIFIED`. Enforced at build time.
   */
  verifiedBy?: string;
  /** Official pages read during verification, with the date each was read. */
  verificationSources?: VerificationSource[];
  /**
   * One record per check examined in the current pass. A check with no record was
   * not examined — which is different from `unresolved`, meaning it was examined
   * and could not be established.
   */
  verificationChecks?: VerificationCheckRecord[];

  submittedAt: IsoDate;
  updatedAt: IsoDate;

  /**
   * Editorial selection for homepage surfacing.
   *
   * This is not a popularity metric. We do not measure popularity, so ordering
   * is curated and the UI says so rather than implying measured demand.
   */
  editorialSpotlight?: boolean;
}

/** A resource plus the reasons a query matched it. */
export interface ResourceMatch {
  resource: Resource;
  score: number;
  /** Short human phrases such as "Name matches “blender”". */
  matchReasons: string[];
}
