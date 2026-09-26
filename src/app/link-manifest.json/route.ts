import { freeStatusDefinitions } from "@/config/free-status";
import { maintainers } from "@/config/maintainers";
import {
  confirmedChecks,
  missingRequiredChecks,
  requiredVerificationChecks,
  unresolvedChecks,
  VERIFICATION_FRESHNESS_DAYS,
  VERIFICATION_STAGES,
  verificationCheckList,
  verificationStage,
  verificationStageLabels,
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
    const recordsByCheck = new Map(records.map((record) => [record.check, record]));
    const sourcesByUrl = new Map((resource.verificationSources ?? []).map((source) => [source.url, source]));
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
      // Where the listing is in the verification workflow. Computed by the same
      // function the site uses, so every report buckets it identically.
      stage: verificationStage(resource),
      lastVerifiedAt: resource.lastVerifiedAt ?? null,
      verifiedBy: resource.verifiedBy ?? null,
      confirmedChecks: confirmedChecks(records),
      unresolvedChecks: unresolvedChecks(records),
      missingRequiredChecks: missingRequiredChecks(records),
      // The full worksheet: every check, including the ones nobody has looked at,
      // with the evidence and the source it rests on joined in. This is what lets a
      // maintainer see exactly what remains without reading the data file.
      checks: verificationCheckList.map((definition) => {
        const record = recordsByCheck.get(definition.id);
        const source = record?.sourceUrl ? sourcesByUrl.get(record.sourceUrl) : undefined;
        return {
          id: definition.id,
          required: definition.requiredForVerified,
          result: record?.result ?? "not-checked",
          evidence: record?.evidence ?? null,
          sourceUrl: record?.sourceUrl ?? null,
          sourceLabel: source?.label ?? null,
          readOn: source?.retrievedAt ?? null,
        };
      }),
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
        question: check.question,
        required: check.requiredForVerified,
      })),
      stages: VERIFICATION_STAGES.map((id) => ({ id, label: verificationStageLabels[id] })),
      // Who can sign off VERIFIED. Published so the reports can say plainly when
      // nobody can yet.
      maintainers: maintainers.map((maintainer) => maintainer.handle),
    },
    count: entries.length,
    entries,
  });
}
