import { categories } from "@/config/categories";
import { GAME_FORMATS, isMediaAccessType, isMediaFormat } from "@/config/media";
import {
  CONTENT_LICENSE_KINDS,
  CREATOR_USE_VALUES,
  MEDIA_CONTENT_SCOPES,
  MEDIA_OFFERINGS,
  REGION_STATES,
  type MediaAccessType,
} from "@/types/media";
import type { Resource } from "@/types/resource";

/**
 * Data rules for the entertainment profile.
 *
 * Run from `findDataProblems`, so a contradictory or unsupported entertainment
 * claim fails `next build` exactly as a hidden free-tier limit does. The theme is
 * the same: every access, region, licence and offer claim must agree with the rest
 * of the listing and name a dated source; anything unsourced stays "unknown".
 */

const MEDIA_GROUP_CATEGORIES = new Set(categories.filter((c) => c.groups.includes("media")).map((c) => c.id));

/** Access types that promise the content itself is free. */
const CONTENT_ACCESS: readonly MediaAccessType[] = [
  "free_full_access",
  "free_streaming",
  "free_download",
  "public_domain",
  "open_license",
];

/** Superlatives that replace a stated fact with an assurance. */
const ASSURANCE = /\b100\s?%\s*(?:free|legal|safe)\b|\bcompletely legal\b|\btotally free\b/i;
/** "Watch … free" phrasing, which a discovery-only listing must not use. */
const CONSUME_FREE = /\b(?:watch|stream|play|listen)(?:ing)?\b(?:\s+\S+){0,3}\s+(?:for\s+)?free\b/i;

const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const COUNTRY = /^(?:[A-Z]{2}|WORLDWIDE)$/;

export function findMediaProblems(resource: Resource): string[] {
  const media = resource.media;
  if (!media) return [];

  const where = `"${resource.slug}" media`;
  const problems: string[] = [];
  const sources = new Set((resource.verificationSources ?? []).map((s) => s.url));
  const access = new Set(media.access);
  const has = (type: MediaAccessType) => access.has(type);

  /** A claim's source must be one of the listing's dated verification sources. */
  const needsSource = (what: string, url: string | undefined) => {
    if (!url) problems.push(`${where}: ${what} is claimed without a sourceUrl. Cite the page, or leave it unknown`);
    else if (!sources.has(url)) {
      problems.push(`${where}: ${what} cites ${url}, which is not one of the listing's verificationSources`);
    }
  };

  /* ---------------------------------------------------------------- shape */
  if (media.formats.length === 0) problems.push(`${where}: has no formats`);
  for (const format of media.formats) if (!isMediaFormat(format)) problems.push(`${where}: unknown format "${format}"`);
  if (new Set(media.formats).size !== media.formats.length) problems.push(`${where}: repeats a format`);

  if (media.access.length === 0) problems.push(`${where}: has no access types; use ["unknown"] if it is not established`);
  for (const type of media.access) if (!isMediaAccessType(type)) problems.push(`${where}: unknown access type "${type}"`);
  if (access.size !== media.access.length) problems.push(`${where}: repeats an access type`);
  if (has("unknown") && media.access.length > 1) problems.push(`${where}: "unknown" access cannot be combined with known access types`);

  if (!MEDIA_OFFERINGS.includes(media.offering)) problems.push(`${where}: unknown offering "${media.offering}"`);
  if (!MEDIA_CONTENT_SCOPES.includes(media.contentScope)) problems.push(`${where}: unknown contentScope "${media.contentScope}"`);
  if (media.provider.trim().length === 0) problems.push(`${where}: names no provider`);

  if (!MEDIA_GROUP_CATEGORIES.has(resource.category) && !resource.subcategories.some((c) => MEDIA_GROUP_CATEGORIES.has(c))) {
    problems.push(`${where}: has an entertainment profile but no category in the Media & entertainment group`);
  }

  /* ------------------------------------------- discovery is not the content */
  if (media.offering === "discovery") {
    if (!has("free_discovery")) problems.push(`${where}: is a discovery service but is not classified free_discovery`);
    for (const type of CONTENT_ACCESS) {
      if (has(type)) {
        problems.push(`${where}: is a discovery service, so it cannot claim "${type}" — it points to content, it does not provide it`);
      }
    }
    if (media.contentScope !== "information-only") {
      problems.push(`${where}: is a discovery service, so its contentScope must be "information-only"`);
    }
    if (CONSUME_FREE.test(resource.shortDescription)) {
      problems.push(`${where}: is discovery-only but its short description reads as "watch/play/listen free"`);
    }
  } else if (has("free_discovery")) {
    problems.push(`${where}: free_discovery is only for listings whose offering is "discovery"`);
  }

  if (media.contentScope === "previews-only" || media.contentScope === "information-only") {
    for (const type of ["free_full_access", "free_streaming", "free_download"] as const) {
      if (has(type)) problems.push(`${where}: offers ${media.contentScope.replace("-", " ")}, so it cannot claim "${type}"`);
    }
  }
  if (media.offering === "software" && media.contentScope !== "not-applicable") {
    problems.push(`${where}: is software, so contentScope must be "not-applicable"`);
  }

  /* ------------------------------------------------ access ⇔ other facts */
  if (has("free_with_ads") && media.containsAds !== "yes") {
    problems.push(`${where}: claims free_with_ads but containsAds is "${media.containsAds}"`);
  }
  if (media.containsAds === "yes" && resource.limitations.length === 0) {
    problems.push(`${where}: carries advertising, which must be stated among the limitations`);
  }
  for (const type of ["free_tier", "freemium", "free_demo"] as const) {
    if (!has(type)) continue;
    if (media.hasPaidFeatures !== "yes") problems.push(`${where}: claims ${type} but hasPaidFeatures is "${media.hasPaidFeatures}"`);
    if (resource.limitations.length === 0) problems.push(`${where}: claims ${type}, so it must document what the free part leaves out`);
  }
  if (has("free_demo") && !["LIMITED_FREE", "TRIAL"].includes(resource.freeStatus)) {
    problems.push(`${where}: only a demo is free, so the free status must be LIMITED_FREE or TRIAL, not ${resource.freeStatus}`);
  }
  if ((has("free_tier") || has("freemium")) && resource.freeStatus === "FREE" && media.hasPaidFeatures !== "yes") {
    problems.push(`${where}: a free tier implies paid features`);
  }
  if (has("library_access") && resource.requiresAccount === "no") {
    problems.push(`${where}: access depends on a library membership, so requiresAccount cannot be "no"`);
  }
  if (has("free_open_source") && (!resource.openSource || !resource.license)) {
    problems.push(`${where}: claims free_open_source but the listing is not marked open source with a licence`);
  }
  if (has("public_domain") && !["public-domain", "per-item"].includes(media.contentLicense?.kind ?? "")) {
    problems.push(`${where}: claims public_domain access without a public-domain (or per-item) content licence`);
  }
  if (has("open_license") && !["open-license", "per-item"].includes(media.contentLicense?.kind ?? "")) {
    problems.push(`${where}: claims open_license access without an open (or per-item) content licence`);
  }

  /* --------------------------------------------------------------- offers */
  if (has("temporary_free")) {
    if (!media.offer) problems.push(`${where}: claims temporary_free without describing the offer`);
    else if (!media.offer.recurring && !media.offer.endsAt) {
      problems.push(`${where}: a one-off temporary offer needs an endsAt date`);
    }
  }
  if (media.offer) {
    needsSource("the offer", media.offer.sourceUrl);
    if (media.offer.endsAt && !/^\d{4}-\d{2}-\d{2}$/.test(media.offer.endsAt)) {
      problems.push(`${where}: offer endsAt "${media.offer.endsAt}" is not YYYY-MM-DD`);
    }
    if (media.offer.afterwards.trim().length < 10) problems.push(`${where}: the offer must say what a user keeps afterwards`);
  }

  /* --------------------------------------------------------------- region */
  if (!REGION_STATES.includes(media.region.india)) problems.push(`${where}: unknown India region state "${media.region.india}"`);
  for (const code of media.region.availableIn) {
    if (!COUNTRY.test(code)) problems.push(`${where}: region "${code}" is not an ISO 3166-1 alpha-2 code or WORLDWIDE`);
  }
  if (media.region.india !== "unknown" || media.region.availableIn.length > 0) {
    needsSource("region availability", media.region.sourceUrl);
  }
  if (media.region.india === "unavailable" && media.region.availableIn.includes("IN")) {
    problems.push(`${where}: says India is unavailable but lists IN as available`);
  }

  /* ------------------------------------------------------ content licence */
  const license = media.contentLicense;
  if (license) {
    if (!CONTENT_LICENSE_KINDS.includes(license.kind)) problems.push(`${where}: unknown content licence kind "${license.kind}"`);
    if (!CREATOR_USE_VALUES.includes(license.creatorUse)) problems.push(`${where}: unknown creatorUse "${license.creatorUse}"`);
    if (license.kind !== "unknown") needsSource("the content licence", license.sourceUrl);
    if (license.summary.trim().length < 10) problems.push(`${where}: the content licence needs a summary`);
    if (
      (license.creatorUse === "allowed" || license.creatorUse === "allowed-with-attribution") &&
      !["public-domain", "open-license"].includes(license.kind)
    ) {
      problems.push(
        `${where}: creator reuse is claimed for a "${license.kind}" licence. Only a public-domain or open licence can promise reuse; per-item collections use "per-item"`,
      );
    }
    if (license.url && !/^https:\/\//.test(license.url)) problems.push(`${where}: content licence URL is not HTTPS`);
  }

  /* -------------------------------------------------------------- playing */
  if (media.playInBrowser) {
    if (!resource.platforms.includes("BROWSER")) problems.push(`${where}: playInBrowser requires the BROWSER platform`);
    if (!media.formats.some((f) => GAME_FORMATS.includes(f))) problems.push(`${where}: playInBrowser is only for games`);
    if (media.offering === "discovery" || media.offering === "software") {
      problems.push(`${where}: playInBrowser needs a playable destination, not a ${media.offering} listing`);
    }
  }

  /* ---------------------------------------------------- repository, art */
  if (media.githubRepo) {
    if (!REPO.test(media.githubRepo)) problems.push(`${where}: githubRepo "${media.githubRepo}" is not owner/name`);
    else if (resource.sourceUrl?.replace(/\/$/, "").toLowerCase() !== `https://github.com/${media.githubRepo}`.toLowerCase()) {
      problems.push(`${where}: githubRepo ${media.githubRepo} does not match sourceUrl ${resource.sourceUrl ?? "(none)"}`);
    }
  }
  if (media.artwork) {
    const art = media.artwork;
    if (!/^https:\/\//.test(art.url) && !art.url.startsWith("/")) problems.push(`${where}: artwork URL must be HTTPS or self-hosted`);
    if (art.alt.trim().length === 0) problems.push(`${where}: artwork has no alt text`);
    if (art.credit.trim().length === 0) problems.push(`${where}: artwork has no credit`);
    if (!/^https:\/\//.test(art.licenseUrl)) problems.push(`${where}: artwork needs an HTTPS licence or permission page`);
  }
  if (media.editorial && media.editorial.reason.trim().length < 20) {
    problems.push(`${where}: an editorial pick needs a written reason`);
  }

  /* ------------------------------------------------------- descriptions */
  for (const [field, text] of [
    ["shortDescription", resource.shortDescription],
    ["longDescription", resource.longDescription],
  ] as const) {
    if (ASSURANCE.test(text)) {
      problems.push(`${where}: ${field} uses an assurance ("100% free/legal") instead of saying what is free`);
    }
  }
  if (resource.shortDescription.trim().length < 25) problems.push(`${where}: short description is too thin to be useful`);

  if (media.nextReviewAt) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(media.nextReviewAt)) problems.push(`${where}: nextReviewAt is not YYYY-MM-DD`);
    else if (resource.lastVerifiedAt && media.nextReviewAt <= resource.lastVerifiedAt) {
      problems.push(`${where}: nextReviewAt must come after lastVerifiedAt`);
    }
  }

  return problems;
}

/** Canonical form of a URL for duplicate detection: no scheme, `www.`, query or trailing slash. */
export function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/** Entertainment listings that share an official URL with another listing. */
export function findDuplicateMediaUrls(resources: readonly Resource[]): string[] {
  const owners = new Map<string, string[]>();
  for (const resource of resources) {
    const key = canonicalUrl(resource.officialUrl);
    owners.set(key, [...(owners.get(key) ?? []), resource.slug]);
  }
  const problems: string[] = [];
  for (const [url, slugs] of owners) {
    if (slugs.length < 2) continue;
    const involvesMedia = slugs.some((slug) => resources.find((r) => r.slug === slug)?.media);
    if (involvesMedia) problems.push(`Listings ${slugs.map((s) => `"${s}"`).join(", ")} share the official URL ${url}`);
  }
  return problems;
}
