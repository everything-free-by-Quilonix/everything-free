import { matchesFilters } from "@/lib/search/filters";
import type { Platform, Resource } from "@/types/resource";
import type { EvidenceFilterKey, ResourceQuery } from "@/types/search";

/**
 * "Which free AI should I use?"
 *
 * A question about the job, then the library's own listings for it. Nothing here is
 * new data: every answer is a listing, and every filter is the library's own
 * `matchesFilters`, so the finder cannot claim more than `/resources` does.
 *
 * Two kinds of narrowing, the same as everywhere else in the library:
 *
 * - The job and "where it runs" are classifications: which categories a listing is
 *   filed under and which platforms it records.
 * - "No credit card", "No account" and "Open source" are promises, so they match
 *   only facts an official source confirms, and the finder says how many listings
 *   record the value without confirmation.
 */

export interface AiNeed {
  id: string;
  label: string;
  /** One sentence describing the job. */
  description: string;
  /** Library categories (or subcategories) that do this job. */
  categories: string[];
  /** Offer the on-device chat for this job. */
  privateChat?: boolean;
}

export const AI_NEEDS: readonly AiNeed[] = [
  {
    id: "chat",
    label: "Ask questions and chat",
    description: "A general assistant for questions, explanations and ideas.",
    categories: ["ai-chat"],
    privateChat: true,
  },
  {
    id: "writing",
    label: "Write, edit or summarise",
    description: "Drafting, rewording, grammar and summaries.",
    categories: ["ai-writing"],
    privateChat: true,
  },
  {
    id: "coding",
    label: "Help with code",
    description: "Completion, explanation and agents inside your editor or browser.",
    categories: ["ai-coding"],
  },
  {
    id: "research",
    label: "Research and study",
    description: "Answers grounded in your own documents, notebooks and sources.",
    categories: ["ai-research"],
  },
  {
    id: "images",
    label: "Make or edit images",
    description: "Generating pictures and reading text from them.",
    categories: ["ai-image"],
  },
  {
    id: "audio",
    label: "Transcribe or speak",
    description: "Speech to text, text to speech and audio generation.",
    categories: ["ai-audio", "ai-voice"],
  },
  {
    id: "build",
    label: "Build an app with an AI API",
    description: "Model APIs with a free allowance for developers.",
    categories: ["ai-apis"],
  },
  {
    id: "own-device",
    label: "Run models on my own computer",
    description: "Open-weight models and the apps that run them, with nothing sent away.",
    categories: ["ai-models"],
  },
  {
    id: "automate",
    label: "Automate tasks",
    description: "Chaining models into workflows and assistants that act for you.",
    categories: ["ai-automation", "ai-productivity"],
  },
];

export const RUNS_ON = ["any", "browser", "computer", "phone"] as const;
export type RunsOn = (typeof RUNS_ON)[number];

export const RUNS_ON_LABELS: Record<RunsOn, string> = {
  any: "Anywhere",
  browser: "In a browser",
  computer: "On my computer",
  phone: "On my phone",
};

const RUNS_ON_PLATFORMS: Record<Exclude<RunsOn, "any">, Platform[]> = {
  browser: ["BROWSER"],
  computer: ["WINDOWS", "MACOS", "LINUX", "SELF_HOSTED"],
  phone: ["ANDROID", "IOS"],
};

/** The promise filters the finder offers, in the order it shows them. */
export const FINDER_PROMISES: readonly { key: EvidenceFilterKey; label: string }[] = [
  { key: "noCreditCardOnly", label: "No credit card" },
  { key: "noAccountOnly", label: "No account" },
  { key: "openSourceOnly", label: "Open source" },
];

export interface FinderChoice {
  needId: string;
  runsOn: RunsOn;
  promises: readonly EvidenceFilterKey[];
}

export interface FinderResult {
  need: AiNeed;
  matches: Resource[];
  /** Listings that would match if recorded-but-unconfirmed values counted. */
  heldBack: number;
}

export function getNeed(id: string): AiNeed {
  return AI_NEEDS.find((need) => need.id === id) ?? AI_NEEDS[0];
}

/** Every category the finder covers, so the page can hand over only those listings. */
export const FINDER_CATEGORIES: readonly string[] = [...new Set(AI_NEEDS.flatMap((need) => need.categories))];

export function finderQuery(choice: FinderChoice): ResourceQuery {
  const need = getNeed(choice.needId);
  const query: ResourceQuery = { categories: need.categories };
  if (choice.runsOn !== "any") query.platforms = RUNS_ON_PLATFORMS[choice.runsOn];
  for (const key of choice.promises) query[key] = true;
  return query;
}

/**
 * Listings for a choice, ordered so the most-checked come first and then by name.
 * No listing is promoted for any other reason: there is no popularity data.
 */
export function findAi(resources: readonly Resource[], choice: FinderChoice): FinderResult {
  const need = getNeed(choice.needId);
  const query = finderQuery(choice);
  const matches = resources
    .filter((resource) => matchesFilters(resource, query))
    .sort(
      (a, b) =>
        (b.verificationChecks?.length ?? 0) - (a.verificationChecks?.length ?? 0) || a.name.localeCompare(b.name),
    );
  const recorded = resources.filter((resource) => matchesFilters(resource, query, { evidence: "recorded" })).length;
  return { need, matches, heldBack: recorded - matches.length };
}
