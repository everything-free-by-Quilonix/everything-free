import { freeStatusDefinitions } from "@/config/free-status";
import { isCategoryId } from "@/config/categories";
import { isRegisteredMaintainer } from "@/config/maintainers";
import {
  confirmedChecks,
  isAccountableVerifier,
  isVerificationCheck,
  missingRequiredChecks,
  unresolvedChecks,
  VERIFICATION_FRESHNESS_DAYS,
} from "@/config/verification";
import { FACT_CHECK, TRI_STATE_FACTS } from "@/lib/resources/evidence";
import { VERIFICATION_CHECK_RESULTS, type Resource } from "@/types/resource";

/**
 * The library's data rules.
 *
 * `index.ts` runs these at module load and throws, so `next build` fails rather
 * than shipping a dangling cross-reference, a free-tier entry that forgot its
 * limits, a verification claim without evidence, or a fact whose evidence
 * contradicts its value. They live in their own module so the unit tests can run
 * them against deliberately broken listings.
 */

const DAY_MS = 86_400_000;

/** Tags that would restate an evidence-bearing fact, mapped to that fact. */
const FACT_RESTATING_TAGS: ReadonlyMap<string, string> = new Map([
  ["no-signup", "requiresAccount"],
  ["no-sign-up", "requiresAccount"],
  ["no-account", "requiresAccount"],
  ["no-login", "requiresAccount"],
  ["no-credit-card", "requiresCreditCard"],
  ["no-card", "requiresCreditCard"],
  ["commercial-use", "commercialUse"],
  ["personal-use", "personalUse"],
  ["open-source", "openSource"],
]);

export interface ValidationOptions {
  /** The moment "the future" starts from. Defaults to now. */
  now?: Date;
  /**
   * Who may sign off VERIFIED. Defaults to the maintainer register. Tests pass their
   * own check so they can exercise the sign-off rules without anyone being added
   * to the real register.
   */
  isMaintainer?: (verifiedBy: string | undefined) => boolean;
}

/** Every problem in the data, as readable sentences. Empty when the data is valid. */
export function findDataProblems(resources: readonly Resource[], options: ValidationOptions = {}): string[] {
  const now = options.now ?? new Date();
  const isMaintainer = options.isMaintainer ?? isRegisteredMaintainer;
  // One day of tolerance, because a date written in UTC+5:30 can legitimately be
  // "tomorrow" on a UTC build runner.
  const latestAcceptableDate = now.getTime() + DAY_MS;

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

    const records = resource.verificationChecks ?? [];
    const sourceUrls = new Set((resource.verificationSources ?? []).map((source) => source.url));
    const confirmed = new Set(confirmedChecks(records));
    const unresolved = new Set(unresolvedChecks(records));

    /*
     * Verification metadata only exists alongside recorded checks.
     *
     * A "last verified" date, a verifier or verification notes with no check behind
     * them is exactly the misleading state this rule removes: it reads as a check that
     * happened but left no evidence. Notes written while compiling a listing belong
     * in `compilationNotes`, which carries no date and counts for nothing.
     */
    if (records.length === 0) {
      for (const field of ["lastVerifiedAt", "verifiedBy", "verificationNotes", "verificationSources"] as const) {
        if (resource[field] !== undefined) {
          problems.push(
            `${where} has ${field} but no recorded verificationChecks. A verification claim needs the checks behind it; ` +
              `notes from compiling the listing belong in compilationNotes`,
          );
        }
      }
    } else {
      // A check record is a claim about a point in time, made by someone, explained.
      if (!resource.lastVerifiedAt) problems.push(`${where} records verification checks but has no lastVerifiedAt date`);
      if (!resource.verifiedBy) problems.push(`${where} records verification checks but not who performed them (verifiedBy)`);
      if (!resource.verificationNotes) {
        problems.push(`${where} records verification checks without verificationNotes saying what was and was not settled`);
      }
    }

    /*
     * The status must match the evidence, in both directions.
     *
     * "Partially verified" tells a visitor the headline claim — the free status — has
     * been confirmed from an official source. So it requires exactly that, and an
     * entry whose free status *is* confirmed may not understate it as unverified.
     */
    if (resource.verificationStatus === "PARTIALLY_VERIFIED" && !confirmed.has("FREE_STATUS")) {
      problems.push(
        `${where} is PARTIALLY_VERIFIED but its FREE_STATUS check is not confirmed. ` +
          `Partially verified means the free status was confirmed against an official source; otherwise use UNVERIFIED`,
      );
    }
    if (resource.verificationStatus === "UNVERIFIED" && confirmed.has("FREE_STATUS")) {
      problems.push(`${where} is UNVERIFIED but has a confirmed FREE_STATUS check; use PARTIALLY_VERIFIED`);
    }

    /*
     * `VERIFIED` is the strongest claim the project makes, so it has to be backed by
     * recorded evidence rather than a contributor's assurance: every required check
     * confirmed, sources read recently enough to still be true, and sign-off by a
     * maintainer in the register.
     *
     * This is what stops the badge drifting back into meaning "looks right to me".
     */
    if (resource.verificationStatus === "VERIFIED") {
      // The human gate. A pass by a script, bot or AI assistant may record evidence,
      // but only a registered maintainer can put the VERIFIED badge on it.
      if (!isAccountableVerifier(resource.verifiedBy)) {
        problems.push(
          `${where} is marked VERIFIED but verifiedBy is ${JSON.stringify(resource.verifiedBy ?? null)}. ` +
            `VERIFIED requires the GitHub handle (@name) of the maintainer who reviewed the evidence`,
        );
      } else if (!isMaintainer(resource.verifiedBy)) {
        problems.push(
          `${where} is marked VERIFIED by ${resource.verifiedBy}, who is not in the maintainer register ` +
            `(src/config/maintainers.ts). A maintainer adds their own handle there before signing anything off`,
        );
      }

      const missing = missingRequiredChecks(records);
      if (missing.length > 0) {
        problems.push(
          `${where} is marked VERIFIED but has not confirmed required checks: ${missing.join(", ")}. ` +
            `Either confirm them or use PARTIALLY_VERIFIED`,
        );
      }

      // Sign-off means re-reading the sources, not approving someone else's old notes.
      if (resource.lastVerifiedAt) {
        const signedOff = Date.parse(resource.lastVerifiedAt);
        for (const record of records) {
          if (record.result !== "confirmed" || !record.sourceUrl) continue;
          const source = resource.verificationSources?.find((s) => s.url === record.sourceUrl);
          if (source && signedOff - Date.parse(source.retrievedAt) > VERIFICATION_FRESHNESS_DAYS * DAY_MS) {
            problems.push(
              `${where} is marked VERIFIED on ${resource.lastVerifiedAt} but ${record.check} rests on ${source.url}, ` +
                `last read ${source.retrievedAt}. Re-read it and update retrievedAt before signing off`,
            );
          }
        }
      }
    }

    /*
     * Evidence and value must agree — impossible evidence states fail the build.
     *
     * - Looked for and not settled ⇒ the value is unknown. This stops an unresolved
     *   check sitting next to a confident "No credit card".
     * - Confirmed ⇒ the value is known. A check cannot confirm "unknown"; that
     *   combination would make the site show a confirmation of nothing.
     */
    for (const fact of TRI_STATE_FACTS) {
      const check = FACT_CHECK[fact];
      if (unresolved.has(check) && resource[fact] !== "unknown") {
        problems.push(
          `${where} records ${check} as unresolved but ${fact} is "${resource[fact]}". ` +
            `An unresolved check means the answer is not established: set ${fact} to "unknown"`,
        );
      }
      if (confirmed.has(check) && resource[fact] === "unknown") {
        problems.push(
          `${where} records ${check} as confirmed but ${fact} is "unknown". ` +
            `A confirmed check establishes the value: record what the source says, or mark the check unresolved`,
        );
      }
    }
    if (confirmed.has("FREE_STATUS") && resource.freeStatus === "UNKNOWN") {
      problems.push(`${where} records FREE_STATUS as confirmed but its free status is UNKNOWN`);
    }
    if (confirmed.has("LICENSE") && !resource.license) {
      problems.push(`${where} records LICENSE as confirmed but records no licence`);
    }
    if (confirmed.has("PLATFORM_AVAILABILITY") && resource.platforms.length === 0) {
      problems.push(`${where} records PLATFORM_AVAILABILITY as confirmed but lists no platforms`);
    }

    /*
     * Values that contradict each other, whatever the evidence. Each would make the
     * page say two incompatible things.
     */
    if (resource.freeStatus === "OPEN_SOURCE" && !resource.openSource) {
      problems.push(`${where} is classified OPEN_SOURCE but openSource is false`);
    }
    if (resource.freeStatus === "PERSONAL_FREE" && resource.commercialUse === "yes") {
      problems.push(
        `${where} is PERSONAL_FREE, which means commercial use is restricted, but commercialUse is "yes"`,
      );
    }

    // No evidence dated in the future, and no source read after the pass it belongs to.
    for (const date of [resource.lastVerifiedAt, ...(resource.verificationSources ?? []).map((s) => s.retrievedAt)]) {
      if (date && Date.parse(date) > latestAcceptableDate) {
        problems.push(`${where} records a verification date in the future: ${date}`);
      }
    }
    if (resource.lastVerifiedAt) {
      for (const source of resource.verificationSources ?? []) {
        if (source.retrievedAt > resource.lastVerifiedAt) {
          problems.push(
            `${where} cites ${source.url} read on ${source.retrievedAt}, after lastVerifiedAt ${resource.lastVerifiedAt}. ` +
              `lastVerifiedAt is the date of the pass, so it cannot precede the reading it is based on`,
          );
        }
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

    // A tag is a topic, shown as a chip and filtered by its recorded value. A tag
    // that restates a fact ("no-signup") would repeat the claim without its evidence
    // and give the confirmed-only filter a back door.
    for (const tag of resource.tags) {
      const fact = FACT_RESTATING_TAGS.get(tag);
      if (fact) {
        problems.push(`${where} has the tag "${tag}", which restates the ${fact} fact without its evidence; use the field instead`);
      }
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

  return problems;
}
