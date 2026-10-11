import type { MediaProfile } from "@/types/media";
import type {
  Availability,
  FreeStatus,
  IsoDate,
  Platform,
  Resource,
  ResourceType,
  VerificationCheck,
  VerificationCheckRecord,
} from "@/types/resource";

import { defineResource } from "../define";

/**
 * Authoring helper for entertainment listings.
 *
 * An entertainment entry is an ordinary `Resource` with a `media` profile. This
 * helper exists so research files read as research — what was read, what it says —
 * and so the verification status is *derived* from the recorded checks instead of
 * typed in:
 *
 * - With a confirmed FREE_STATUS check, the listing is PARTIALLY_VERIFIED.
 * - Otherwise it is UNVERIFIED.
 * - It is never VERIFIED: that needs a registered maintainer's sign-off, which an
 *   automated or agent-assisted pass cannot give (see `config/verification.ts`).
 *
 * See docs/entertainment-research.md for the workflow and the evidence standard.
 */

/** Who performed the research pass. Deliberately not a GitHub handle: it cannot award VERIFIED. */
export const RESEARCH_VERIFIER = "agent-assisted research pass — awaiting maintainer review";

export interface ResearchSource {
  url: string;
  /** What this page establishes, specifically. */
  label: string;
  /** Defaults to the pass date. */
  retrievedAt?: IsoDate;
}

export interface ResearchPass {
  /** The date the pages were read. */
  date: IsoDate;
  /** Pages actually read. Every check's sourceUrl must be one of these. */
  sources: ResearchSource[];
  checks: VerificationCheckRecord[];
  /** What the pass settled and what it could not. */
  notes: string;
}

export interface MediaSeed {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  whyListed: string;
  category: string;
  subcategories?: string[];
  resourceType: ResourceType;
  officialUrl: string;
  sourceUrl?: string;
  pricingUrl?: string;
  licenseUrl?: string;
  freeStatus: FreeStatus;
  openSource: boolean;
  license?: string;
  licenseNotes?: string;
  platforms: Platform[];
  /** Interface languages (ISO 639-1). */
  languages?: string[];
  requiresAccount: Availability;
  requiresCreditCard: Availability;
  commercialUse: Availability;
  personalUse: Availability;
  apiAvailable?: boolean;
  embedAvailable?: boolean;
  downloadAvailable?: boolean;
  limitations: string[];
  pricingNotes?: string;
  features?: string[];
  tags?: string[];
  alternativeTo?: string[];
  relatedResources?: string[];
  media: MediaProfile;
  /**
   * The evidence. Omit only when nothing could be read; the listing is then
   * UNVERIFIED and `compilationNotes` must say what it was based on.
   */
  research?: ResearchPass;
  compilationNotes?: string;
  /** When the listing entered the catalogue. Defaults to the research date. */
  addedAt?: IsoDate;
}

const DAY_MS = 86_400_000;

function addDays(iso: IsoDate, days: number): IsoDate {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

function hasConfirmed(checks: readonly VerificationCheckRecord[], check: VerificationCheck): boolean {
  return checks.some((record) => record.check === check && record.result === "confirmed");
}

export function defineMedia(seed: MediaSeed): Resource {
  const { research, media, addedAt, compilationNotes, ...rest } = seed;
  const added = addedAt ?? research?.date;

  return defineResource({
    ...rest,
    verificationStatus: research && hasConfirmed(research.checks, "FREE_STATUS") ? "PARTIALLY_VERIFIED" : "UNVERIFIED",
    compilationNotes,
    ...(research
      ? {
          lastVerifiedAt: research.date,
          verifiedBy: RESEARCH_VERIFIER,
          verificationNotes: research.notes,
          verificationSources: research.sources.map((source) => ({
            url: source.url,
            label: source.label,
            retrievedAt: source.retrievedAt ?? research.date,
          })),
          verificationChecks: research.checks,
        }
      : {}),
    media: {
      ...media,
      nextReviewAt: media.nextReviewAt ?? (research ? addDays(research.date, 90) : undefined),
    },
    ...(added ? { submittedAt: added, updatedAt: research?.date ?? added } : {}),
  });
}

export function defineMediaList(seeds: MediaSeed[]): Resource[] {
  return seeds.map(defineMedia);
}
