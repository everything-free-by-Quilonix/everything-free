import type { IconName } from "@/components/icons";
import { FREE_STATUSES, type FreeStatus } from "@/types/resource";

/**
 * Definitions for the free-status system.
 *
 * This file is the product's centre of gravity. Everything a user is told about
 * whether something is free — badge text, badge colour, the plain-language
 * meaning, the caveat — comes from here. There is no second place where a
 * status is described in prose, so the vocabulary cannot drift between the card,
 * the detail page, the filter panel and the documentation page.
 *
 * `tone` intentionally maps to semantic colour tokens, never raw hues, and is
 * always paired with a text label: colour is never the only signal (WCAG 1.4.1).
 */

export type StatusTone = "success" | "info" | "primary" | "warning" | "danger" | "neutral";

export interface FreeStatusDefinition {
  id: FreeStatus;
  /** Short badge text. Title case, no emoji. */
  label: string;
  /** One-line meaning, safe to show in a tooltip or beneath a badge. */
  summary: string;
  /** Fuller explanation for the documentation page. */
  definition: string;
  /**
   * The honest caveat. Non-null for every status where a user could be misled;
   * rendered next to the badge on detail pages.
   */
  caveat?: string;
  tone: StatusTone;
  icon: IconName;
  /**
   * Whether a resource with this status belongs in the browsable library.
   * `NOT_FREE` is modelled so that reports and comparisons can reference it,
   * but it is excluded from default listings.
   */
  listable: boolean;
  /** Whether a listing with this status must document its limitations. */
  requiresLimitations: boolean;
}

export const freeStatusDefinitions: Record<FreeStatus, FreeStatusDefinition> = {
  FREE: {
    id: "FREE",
    label: "Free",
    summary: "Usable in full without payment.",
    definition:
      "The resource can be used for its intended purpose without paying, without a time limit, and without a paid upgrade being required to complete normal tasks.",
    tone: "success",
    icon: "check-circle",
    listable: true,
    requiresLimitations: false,
  },
  FREE_TIER: {
    id: "FREE_TIER",
    label: "Free tier",
    summary: "A permanent free plan exists, with limits.",
    definition:
      "There is an ongoing free plan, but usage or features are capped. The free plan is not a trial: it does not expire. Paid plans exist above it.",
    caveat: "Check the listed limits before relying on this for important work.",
    tone: "info",
    icon: "minus-circle",
    listable: true,
    requiresLimitations: true,
  },
  OPEN_SOURCE: {
    id: "OPEN_SOURCE",
    label: "Open source",
    summary: "Source code is public under an open-source licence.",
    definition:
      "The source code is published under an identifiable open-source licence, which means it can be used, inspected, and usually self-hosted at no cost. Hosted convenience services around it may still be paid.",
    caveat: "Licence terms still apply, and a hosted version may be paid.",
    tone: "primary",
    icon: "repo",
    listable: true,
    requiresLimitations: false,
  },
  PERSONAL_FREE: {
    id: "PERSONAL_FREE",
    label: "Free for personal use",
    summary: "Free for personal use; commercial use is restricted.",
    definition:
      "Full use is free for personal or non-commercial purposes. Using it for work, for a business, or to make money generally requires a paid licence.",
    caveat: "A paid licence is typically required for commercial or work use.",
    tone: "warning",
    icon: "users",
    listable: true,
    requiresLimitations: true,
  },
  LIMITED_FREE: {
    id: "LIMITED_FREE",
    label: "Limited free",
    summary: "Genuinely free capability, but significant limits apply.",
    definition:
      "Something real can be accomplished without paying, but the limits are substantial enough that most people will hit them — for example watermarked output, hard export caps, or a small number of uses.",
    caveat: "The limits are significant. Read them before starting a project.",
    tone: "warning",
    icon: "alert-triangle",
    listable: true,
    requiresLimitations: true,
  },
  TRIAL: {
    id: "TRIAL",
    label: "Trial only",
    summary: "Temporary free access that expires.",
    definition:
      "Free access is time-limited or usage-limited and then stops. A trial is not a free product, and Everything.Free does not describe it as one.",
    caveat: "This is not free software. Access ends when the trial ends.",
    tone: "danger",
    icon: "clock",
    listable: true,
    requiresLimitations: true,
  },
  NOT_FREE: {
    id: "NOT_FREE",
    label: "Not free",
    summary: "No meaningful free use. Not listed as a free resource.",
    definition:
      "There is no usable free offering. These are not listed in the library; the status exists so that reports and comparisons can refer to products that are paid.",
    tone: "danger",
    icon: "x-circle",
    listable: false,
    requiresLimitations: false,
  },
  UNKNOWN: {
    id: "UNKNOWN",
    label: "Unconfirmed",
    summary: "Free status has not been established yet.",
    definition:
      "Nobody has established the free status to our standard yet. We would rather say so than guess.",
    caveat: "Treat the free status as unconfirmed and check the official site.",
    tone: "neutral",
    icon: "help-circle",
    listable: true,
    requiresLimitations: false,
  },
};

/** Ordered list for filter UI and the documentation page. */
export const freeStatusList: FreeStatusDefinition[] = FREE_STATUSES.map((id) => freeStatusDefinitions[id]);

/** Statuses that appear in browsable listings and filter controls. */
export const listableFreeStatuses: FreeStatusDefinition[] = freeStatusList.filter((s) => s.listable);

export function getFreeStatus(id: FreeStatus): FreeStatusDefinition {
  return freeStatusDefinitions[id];
}

/** Narrowing helper for values arriving from URLs or form input. */
export function isFreeStatus(value: string): value is FreeStatus {
  return Object.hasOwn(freeStatusDefinitions, value);
}
