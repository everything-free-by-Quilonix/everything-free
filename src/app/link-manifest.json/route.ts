import { freeStatusDefinitions } from "@/config/free-status";
import {
  confirmedChecks,
  missingRequiredChecks,
  requiredVerificationChecks,
  unresolvedChecks,
  VERIFICATION_FRESHNESS_DAYS,
  verificationCheckList,
} from "@/config/verification";
import { getAllResourcesForClient } from "@/lib/repository";

/**
 * A machine-readable maintenance manifest, written once at build time.
 *
 * Consumed by the scripts in `.github/scripts/` and `scripts/`: the monthly link
 * check, the verification-freshness report, and the generated verification backlog.
 * Deriving it from the same data the site renders means none of them can drift out
 * of sync with what is published.
 *
 * It also carries the verification *rules* — the required checks, their labels, and
 * the freshness window — so the Node scripts read them from here instead of keeping
 * their own copies of `config/verification.ts`. A copy is a second source of truth
 * waiting to disagree with the first.
 *
 * Everything here is already visible on the site; publishing it adds no disclosure.
 * It is deliberately narrow — a maintenance artefact, not a public API with a
 * stability commitment.
 */

export const dynamic = "force-static";

export async function GET() {
  const resources = await getAllResourcesForClient();

  const entries = resources.map((resource) => {
    const records = resource.verificationChecks ?? [];
    return {
      slug: resource.slug,
      name: resource.name,
      officialUrl: resource.officialUrl,
      // Secondary URLs are checked too: a dead repository or a moved pricing page is
      // as much a broken promise as a dead homepage.
      sourceUrl: resource.sourceUrl ?? null,
      pricingUrl: resource.pricingUrl ?? null,
      licenseUrl: resource.licenseUrl ?? null,
      freeStatus: resource.freeStatus,
      // Conditional statuses change with vendor pricing decisions, so they go stale
      // faster than an open-source licence does. Used to order the backlog.
      conditionalFreeStatus: freeStatusDefinitions[resource.freeStatus].requiresLimitations,
      editorialSpotlight: Boolean(resource.editorialSpotlight),
      verificationStatus: resource.verificationStatus,
      lastVerifiedAt: resource.lastVerifiedAt ?? null,
      verifiedBy: resource.verifiedBy ?? null,
      confirmedChecks: confirmedChecks(records),
      unresolvedChecks: unresolvedChecks(records),
      missingRequiredChecks: missingRequiredChecks(records),
      verificationSources: (resource.verificationSources ?? []).map((source) => ({
        url: source.url,
        label: source.label,
        retrievedAt: source.retrievedAt,
      })),
    };
  });

  return Response.json({
    // Deliberately no generation timestamp: the manifest feeds a committed, generated
    // document, and a timestamp would make every build produce a diff.
    rules: {
      freshnessDays: VERIFICATION_FRESHNESS_DAYS,
      requiredChecks: requiredVerificationChecks,
      checks: verificationCheckList.map((check) => ({
        id: check.id,
        label: check.label,
        required: check.requiredForVerified,
      })),
    },
    count: entries.length,
    entries,
  });
}
