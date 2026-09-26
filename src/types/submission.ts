import type { FreeStatus, ResourceType } from "./resource";

/**
 * Community contribution models.
 *
 * These mirror the structured submission format documented in CONTRIBUTING.md,
 * so a GitHub issue and a form submission carry the same fields and can be
 * reconciled by a single moderation step later.
 *
 * Validation lives in `features/community/schema.ts` (Zod) because this is the
 * one place untrusted input enters the system.
 */

export interface ResourceSubmission {
  name: string;
  officialUrl: string;
  category: string;
  resourceType: ResourceType;
  freeStatus: FreeStatus;
  /** The contributor's case for listing it. Required — no unexplained entries. */
  whyListed: string;
  /** Known limits of the free offering. Required for non-`FREE` statuses. */
  limitations?: string;
  license?: string;
  commercialUse?: string;
  /** How the contributor established the free status. */
  verificationInformation?: string;
  /** Optional, only so a moderator can follow up. */
  contactEmail?: string;
}

export const REPORT_REASONS = [
  "BROKEN_LINK",
  "NO_LONGER_FREE",
  "PRICING_CHANGED",
  "INCORRECT_INFORMATION",
  "WRONG_CATEGORY",
  "DUPLICATE",
  "SUGGEST_ALTERNATIVE",
  "OTHER",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export interface ResourceReport {
  /** Slug of the resource being reported. */
  resourceSlug: string;
  reason: ReportReason;
  details: string;
  /** Link backing up the report, such as a changed pricing page. */
  evidenceUrl?: string;
  contactEmail?: string;
}

/** Result of handling a submission or report. */
export type SubmissionResult =
  | { status: "success"; message: string; reference?: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };
