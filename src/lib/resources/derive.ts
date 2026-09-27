import { getPlatform, platformDefinitions } from "@/config/platforms";
import { getVerification, type VerificationDefinition } from "@/config/verification";
import { isVerificationStale } from "@/lib/utils/date";
import type { Availability, Platform, Resource } from "@/types/resource";

/**
 * Values derived from a resource rather than stored on it.
 *
 * Anything computable is computed, so the data cannot contradict itself. A
 * resource listing `ANDROID` is mobile-available by definition; storing a
 * separate `mobileAvailable` flag would only create a way for the two to disagree.
 */

export function isBrowserAvailable(resource: Resource): boolean {
  return resource.platforms.includes("BROWSER");
}

export function isDesktopAvailable(resource: Resource): boolean {
  return resource.platforms.some((platform) => platformDefinitions[platform].family === "desktop");
}

export function isMobileAvailable(resource: Resource): boolean {
  return resource.platforms.some((platform) => platformDefinitions[platform].family === "mobile");
}

export function isSelfHostable(resource: Resource): boolean {
  return resource.platforms.includes("SELF_HOSTED");
}

/**
 * Orders platforms for display.
 *
 * Fixed order rather than the order they happen to appear in the data, so the
 * platform row reads consistently across every card.
 */
const PLATFORM_ORDER: Platform[] = ["BROWSER", "WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS", "SELF_HOSTED"];

export function orderedPlatforms(resource: Resource): Platform[] {
  return PLATFORM_ORDER.filter((platform) => resource.platforms.includes(platform));
}

export function platformLabels(resource: Resource): string[] {
  return orderedPlatforms(resource).map((platform) => getPlatform(platform).shortLabel);
}

/**
 * The verification state to display, accounting for age.
 *
 * A listing verified beyond the freshness window is shown as needing a re-check
 * regardless of what the stored status says. This is what keeps a trust signal
 * from quietly decaying into a false one.
 */
export function effectiveVerification(resource: Resource, now: Date = new Date()): VerificationDefinition {
  const stored = getVerification(resource.verificationStatus);

  if (resource.verificationStatus === "REPORTED") return stored;
  if (isVerificationStale(resource.lastVerifiedAt, now)) return getVerification("OUTDATED");

  return stored;
}

/**
 * The single most important thing a user should know before clicking through.
 *
 * Cards have room for one limitation, so the first one is treated as the
 * headline. Data files list limitations in order of significance for this reason.
 */
export function headlineLimitation(resource: Resource): string | null {
  return resource.limitations[0] ?? null;
}

/*
 * Requirement signals for cards ("No credit card", "Commercial use allowed") used
 * to be derived here from the stored value alone, which put a reassurance on
 * listings nobody had checked. They now come from `lib/resources/evidence.ts`,
 * which only lets a confirmed fact make a claim.
 */

/**
 * The stored answer for a tri-state field, as a word. This is the *value* only;
 * whether it has been confirmed is a separate question, answered by
 * `factEvidence`, and every surface shows both.
 */
export function availabilityLabel(value: Availability): string {
  switch (value) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    default:
      return "Unknown";
  }
}
