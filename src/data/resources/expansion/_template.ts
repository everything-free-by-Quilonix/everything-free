import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * TEMPLATE — copy this file to start a new expansion batch. Not registered.
 *
 * Rules (the build enforces them; run `npm run check:media-file -- <file>`):
 * - Every value comes from a page you actually fetched today. Unknown stays "unknown".
 * - Every confirmed check's sourceUrl must be listed in research.sources (HTTPS).
 * - FREE_TIER / LIMITED_FREE / PERSONAL_FREE need at least one limitation.
 * - OPEN_SOURCE needs openSource: true and `license`; a confirmed LICENSE check needs `license`.
 * - shortDescription 25–130 chars. No "100% free", "completely free", "totally free", "at zero cost".
 * - Forbidden tags: open-source, no-signup, no-account, no-login, no-credit-card, no-card,
 *   commercial-use, personal-use.
 * - relatedResources may only name slugs that exist. Slugs must be new.
 * - Trials are never listed as free. No piracy, cracked software or unauthorised streams.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const EXAMPLE = "https://example.org/pricing";

export const templateResources: Resource[] = defineResearchedList([
  {
    slug: "example-tool",
    name: "Example Tool",
    shortDescription: "One-line, factual description of what it does and what is free about it.",
    longDescription: "Two or three sentences: what it is, who makes it, what the free plan includes and excludes.",
    whyListed: "Why a visitor looking for free resources should care.",
    category: "utilities",
    resourceType: "WEB_APP",
    officialUrl: "https://example.org/",
    pricingUrl: EXAMPLE,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    limitations: ["What the free plan does not include, as the page states it"],
    features: ["Feature the page states"],
    tags: ["example"],
    research: {
      date: DATE,
      sources: [src(EXAMPLE, "What this page establishes")],
      checks: [ok("FREE_STATUS", EXAMPLE, "Quote or close paraphrase of what the page says.")],
      notes: "What was read, what was corrected, what was not checked.",
    },
  },
]);
