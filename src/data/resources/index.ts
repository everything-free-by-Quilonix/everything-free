import { freeStatusDefinitions } from "@/config/free-status";
import { isCategoryId } from "@/config/categories";
import { isAccountableVerifier, isVerificationCheck, missingRequiredChecks } from "@/config/verification";
import { VERIFICATION_CHECK_RESULTS, type Resource } from "@/types/resource";

import { aiResources } from "./ai";
import { creativeResources } from "./creative";
import { developmentResources } from "./development";
import { educationResources } from "./education";
import { lifeResources } from "./life";
import { productivityResources } from "./productivity";

/**
 * The seed library.
 *
 * Data is split by domain purely for editing ergonomics; nothing downstream
 * depends on the file boundaries. Consumers should not import this directly —
 * go through `lib/repository` so the storage layer stays swappable.
 */
const allSeedResources: Resource[] = [
  ...creativeResources,
  ...developmentResources,
  ...educationResources,
  ...aiResources,
  ...productivityResources,
  ...lifeResources,
];

/**
 * Validates the seed set and throws on any inconsistency.
 *
 * This runs at module load, which means `next build` fails rather than shipping
 * a library with a dangling "related resource" link or a free-tier entry that
 * forgot to document its limits. These are exactly the mistakes that erode trust
 * in a directory, so they are treated as build errors rather than warnings.
 */
function validateSeedData(resources: Resource[]): void {
  const problems: string[] = [];
  const slugs = new Set<string>();

  for (const resource of resources) {
    const where = `"${resource.slug}"`;

    if (slugs.has(resource.slug)) problems.push(`Duplicate slug ${where}`);
    slugs.add(resource.slug);

    if (resource.id !== resource.slug) {
      problems.push(`${where} has id "${resource.id}" that does not match its slug`);
    }

    if (!isCategoryId(resource.category)) {
      problems.push(`${where} has unknown primary category "${resource.category}"`);
    }
    for (const sub of resource.subcategories) {
      if (!isCategoryId(sub)) problems.push(`${where} has unknown subcategory "${sub}"`);
      if (sub === resource.category) {
        problems.push(`${where} repeats its primary category "${sub}" as a subcategory`);
      }
    }

    const status = freeStatusDefinitions[resource.freeStatus];
    if (!status.listable) {
      problems.push(`${where} uses non-listable free status "${resource.freeStatus}"`);
    }
    if (status.requiresLimitations && resource.limitations.length === 0) {
      problems.push(
        `${where} is "${resource.freeStatus}" so it must document at least one limitation — hiding limits is not allowed`,
      );
    }

    // An entry claiming a verified state has to say what was actually verified.
    if (
      (resource.verificationStatus === "VERIFIED" || resource.verificationStatus === "PARTIALLY_VERIFIED") &&
      !resource.verificationNotes
    ) {
      problems.push(`${where} claims verification status "${resource.verificationStatus}" without verification notes`);
    }

    /*
     * `VERIFIED` is the strongest claim the project makes, so it has to be backed by
     * recorded evidence rather than a contributor's assurance: a date, an
     * attributable verifier, at least one official source, and every trust-critical
     * check confirmed.
     *
     * This is what stops the badge drifting back into meaning "looks right to me".
     */
    if (resource.verificationStatus === "VERIFIED") {
      if (!resource.lastVerifiedAt) {
        problems.push(`${where} is marked VERIFIED but has no lastVerifiedAt date`);
      }
      // The human gate. A pass by a script, bot or AI assistant may record evidence,
      // but only a named maintainer can put the VERIFIED badge on it.
      if (!isAccountableVerifier(resource.verifiedBy)) {
        problems.push(
          `${where} is marked VERIFIED but verifiedBy is ${JSON.stringify(resource.verifiedBy ?? null)}. ` +
            `VERIFIED requires the GitHub handle (@name) of the maintainer who reviewed the evidence`,
        );
      }
      if (!resource.verificationSources || resource.verificationSources.length === 0) {
        problems.push(`${where} is marked VERIFIED but cites no verificationSources`);
      }

      const missing = missingRequiredChecks(resource.verificationChecks);
      if (missing.length > 0) {
        problems.push(
          `${where} is marked VERIFIED but has not confirmed required checks: ${missing.join(", ")}. ` +
            `Either confirm them or use PARTIALLY_VERIFIED`,
        );
      }
    }

    const records = resource.verificationChecks ?? [];
    const sourceUrls = new Set((resource.verificationSources ?? []).map((source) => source.url));

    // A check record is a claim about a point in time, made by someone.
    if (records.length > 0) {
      if (!resource.lastVerifiedAt) {
        problems.push(`${where} records verification checks but has no lastVerifiedAt date`);
      }
      if (!resource.verifiedBy) {
        problems.push(`${where} records verification checks but not who performed them (verifiedBy)`);
      }
    }

    const seenChecks = new Set<string>();
    for (const record of records) {
      const label = `${where} check ${record.check}`;

      if (!isVerificationCheck(record.check)) problems.push(`${where} records unknown verification check "${record.check}"`);
      if (seenChecks.has(record.check)) problems.push(`${label} is recorded more than once`);
      seenChecks.add(record.check);

      if (!VERIFICATION_CHECK_RESULTS.includes(record.result)) {
        problems.push(`${label} has unknown result "${record.result}"`);
      }
      if (record.evidence.trim().length < 20) {
        problems.push(`${label} needs evidence saying what the source states (or why it could not be settled)`);
      }
      // Confirmed means "an official source says so" — so it must point at one.
      if (record.result === "confirmed" && !record.sourceUrl) {
        problems.push(`${label} is confirmed but cites no sourceUrl`);
      }
      if (record.sourceUrl && !sourceUrls.has(record.sourceUrl)) {
        problems.push(`${label} cites ${record.sourceUrl}, which is not listed in verificationSources`);
      }
    }

    for (const source of resource.verificationSources ?? []) {
      if (!/^https:\/\//.test(source.url)) {
        problems.push(`${where} cites a non-HTTPS verification source: ${source.url}`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(source.retrievedAt)) {
        problems.push(`${where} cites a verification source with an invalid retrievedAt: ${source.retrievedAt}`);
      }
      if (source.label.trim().length === 0) {
        problems.push(`${where} cites a verification source with no label saying what it establishes`);
      }
    }

    if (resource.openSource && !resource.license) {
      problems.push(`${where} is marked open source but records no licence`);
    }

    if (!/^https:\/\//.test(resource.officialUrl)) {
      problems.push(`${where} has a non-HTTPS official URL`);
    }

    if (resource.shortDescription.length > 130) {
      problems.push(`${where} has a short description of ${resource.shortDescription.length} characters (max 130)`);
    }
  }

  // Cross-references are checked after every slug is known, so order in the
  // data files does not matter.
  for (const resource of resources) {
    for (const related of resource.relatedResources) {
      if (!slugs.has(related)) {
        problems.push(`"${resource.slug}" links to unknown related resource "${related}"`);
      }
      if (related === resource.slug) {
        problems.push(`"${resource.slug}" lists itself as a related resource`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`Seed resource data is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

validateSeedData(allSeedResources);

export const seedResources: readonly Resource[] = Object.freeze(allSeedResources);
