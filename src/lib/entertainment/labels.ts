import { factEvidence } from "@/lib/resources/evidence";
import { daysSince, isVerificationStale } from "@/lib/utils/date";
import type { Resource } from "@/types/resource";

import type { EntertainmentSignals, GithubSignal } from "./signals-schema";

/**
 * Discovery labels.
 *
 * Every label has a written condition, checked here and nowhere else, and every
 * one that implies a measurement points at the dated evidence behind it. A label
 * whose condition cannot be met with real data is not shown — there is no
 * "Trending now" or "Popular" anywhere, because the project has no legitimate,
 * redistributable trend source for entertainment yet (docs/entertainment-signals.md).
 */

export const DISCOVERY_LABELS = [
  "recently-added",
  "recently-verified",
  "recently-updated",
  "free-this-week",
  "free-in-india",
  "open-source-pick",
  "hidden-gem",
  "community-favourite",
] as const;

export type DiscoveryLabelId = (typeof DISCOVERY_LABELS)[number];

export interface DiscoveryLabelDefinition {
  id: DiscoveryLabelId;
  label: string;
  /** The condition, as shown on the methodology page. */
  rule: string;
}

export const discoveryLabelDefinitions: Record<DiscoveryLabelId, DiscoveryLabelDefinition> = {
  "recently-added": {
    id: "recently-added",
    label: "Recently added",
    rule: "Entered the catalogue in the last 30 days. Says nothing about popularity.",
  },
  "recently-verified": {
    id: "recently-verified",
    label: "Recently checked",
    rule: "Its free status was confirmed against an official source in the last 30 days.",
  },
  "recently-updated": {
    id: "recently-updated",
    label: "Recently updated",
    rule:
      "Open-source project whose official GitHub repository received a commit in the 30 days before the signal was recorded, and the signal is no more than 14 days old.",
  },
  "free-this-week": {
    id: "free-this-week",
    label: "Free this week",
    rule: "A one-off free offer, confirmed on the provider's page, ending within the next 7 days.",
  },
  "free-in-india": {
    id: "free-in-india",
    label: "Available in India",
    rule: "A page read during verification says the free offer is available in India.",
  },
  "open-source-pick": {
    id: "open-source-pick",
    label: "Open source",
    rule: "Published under an open-source licence that was confirmed from the project's own licence file or page.",
  },
  "hidden-gem": {
    id: "hidden-gem",
    label: "Editor's pick",
    rule: "An editorial recommendation, with the reason written on the listing. Not a measured signal.",
  },
  "community-favourite": {
    id: "community-favourite",
    label: "Community favourite",
    rule:
      "The official GitHub repository has at least 1,000 stars, as recorded by the signal script within the last 30 days. The count and its date are shown.",
  },
};

export const RECENT_DAYS = 30;
export const SIGNAL_MAX_AGE_DAYS = 14;
export const STAR_SIGNAL_MAX_AGE_DAYS = 30;
export const COMMUNITY_STAR_THRESHOLD = 1000;

export interface DiscoveryLabel {
  id: DiscoveryLabelId;
  label: string;
  /** Specific detail, e.g. "Ends 14 October 2026" or "8,412 GitHub stars on 11 October 2026". */
  detail?: string;
}

function within(iso: string | undefined, days: number, now: Date): boolean {
  const age = daysSince(iso, now);
  return age !== null && age >= 0 && age <= days;
}

export function githubSignalFor(resource: Resource, signals: EntertainmentSignals | null): GithubSignal | undefined {
  const repo = resource.media?.githubRepo;
  if (!repo || !signals) return undefined;
  return signals.github.find((signal) => signal.repo.toLowerCase() === repo.toLowerCase());
}

export function discoveryLabels(
  resource: Resource,
  signals: EntertainmentSignals | null = null,
  now: Date = new Date(),
): DiscoveryLabel[] {
  const media = resource.media;
  if (!media) return [];
  const labels: DiscoveryLabel[] = [];
  const add = (id: DiscoveryLabelId, detail?: string) => labels.push({ id, label: discoveryLabelDefinitions[id].label, detail });

  const offer = media.offer;
  if (media.access.includes("temporary_free") && offer?.endsAt && !offer.recurring) {
    const left = -(daysSince(offer.endsAt, now) ?? 1);
    if (left >= 0 && left <= 7) add("free-this-week", `Ends ${offer.endsAt}`);
  }

  if (media.region.india === "available" && media.region.sourceUrl) add("free-in-india");

  if (resource.openSource && factEvidence(resource, "license").state === "confirmed") add("open-source-pick");

  if (media.editorial?.hiddenGem) add("hidden-gem", media.editorial.reason);

  const github = githubSignalFor(resource, signals);
  if (github) {
    if (
      within(github.observedAt, SIGNAL_MAX_AGE_DAYS, now) &&
      github.pushedAt &&
      (daysSince(github.pushedAt.slice(0, 10), new Date(`${github.observedAt}T00:00:00Z`)) ?? Infinity) <= RECENT_DAYS &&
      !github.archived
    ) {
      add("recently-updated", `Last commit ${github.pushedAt.slice(0, 10)}, recorded ${github.observedAt}`);
    }
    if (within(github.observedAt, STAR_SIGNAL_MAX_AGE_DAYS, now) && github.stars >= COMMUNITY_STAR_THRESHOLD) {
      add("community-favourite", `${github.stars.toLocaleString("en-GB")} GitHub stars on ${github.observedAt}`);
    }
  }

  if (within(resource.submittedAt, RECENT_DAYS, now)) add("recently-added");
  if (
    factEvidence(resource, "freeStatus").state === "confirmed" &&
    within(resource.lastVerifiedAt, RECENT_DAYS, now) &&
    !isVerificationStale(resource.lastVerifiedAt, now)
  ) {
    add("recently-verified");
  }

  return labels;
}

/** Whether a temporary offer's stated end date has passed. Used by the maintenance check. */
export function isOfferExpired(resource: Resource, now: Date = new Date()): boolean {
  const endsAt = resource.media?.offer?.endsAt;
  if (!endsAt) return false;
  return (daysSince(endsAt, now) ?? 0) > 0;
}

/** Whether the listing has passed its review date. */
export function isReviewDue(resource: Resource, now: Date = new Date()): boolean {
  const next = resource.media?.nextReviewAt;
  if (!next) return isVerificationStale(resource.lastVerifiedAt, now);
  return (daysSince(next, now) ?? 0) > 0;
}
