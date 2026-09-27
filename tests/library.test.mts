/**
 * Invariants of the real library, as shipped.
 *
 * These pin the state the project has committed to, so a change that quietly
 * weakens it fails here: nothing signed off without a registered maintainer, the
 * card questions still honestly unknown, and no card anywhere making a claim its
 * evidence does not support.
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { maintainers } from "@/config/maintainers";
import { verificationStage } from "@/config/verification";
import { seedResources } from "@/data/resources";
import { findDataProblems } from "@/data/resources/validate";
import { cardEvidenceSummary, CARD_FACTS, factEvidence, TRI_STATE_FACTS } from "@/lib/resources/evidence";
import { matchesFilters } from "@/lib/search/filters";
import { runSearch } from "@/lib/search/run-search";

const bySlug = (slug: string) => {
  const resource = seedResources.find((r) => r.slug === slug);
  assert.ok(resource, `missing ${slug}`);
  return resource;
};

describe("the library as shipped", () => {
  test("passes every data rule", () => {
    assert.deepEqual(findDataProblems(seedResources), []);
  });

  test("the maintainer register is empty, so nothing is VERIFIED", () => {
    assert.equal(maintainers.length, 0);
    assert.equal(seedResources.filter((r) => r.verificationStatus === "VERIFIED").length, 0);
  });

  test("exactly the four evidence-complete listings await sign-off", () => {
    const awaiting = seedResources.filter((r) => verificationStage(r) === "awaiting-sign-off").map((r) => r.slug);
    assert.deepEqual(awaiting.sort(), ["gimp", "keepassxc", "libreoffice", "obsidian"]);
  });

  test("Supabase and Autodesk Fusion card requirements stay unknown and unresolved", () => {
    for (const slug of ["supabase", "autodesk-fusion-personal"]) {
      const resource = bySlug(slug);
      assert.equal(resource.requiresCreditCard, "unknown");
      assert.equal(factEvidence(resource, "requiresCreditCard").reason, "unresolved");
    }
  });
});

describe("no surface claims more than the evidence", () => {
  test("every confirmed statement on a card rests on a confirmed check", () => {
    for (const resource of seedResources) {
      for (const group of cardEvidenceSummary(resource)) {
        for (const item of group.items) {
          const evidence = factEvidence(resource, item.fact);
          if (group.reason === "confirmed") {
            assert.equal(evidence.state, "confirmed", `${resource.slug}: ${item.text}`);
          } else {
            assert.notEqual(evidence.state, "confirmed", `${resource.slug}: ${item.fact} listed as ${group.reason}`);
          }
        }
      }
    }
  });

  test("every card accounts for each card fact exactly once", () => {
    for (const resource of seedResources) {
      const facts = cardEvidenceSummary(resource).flatMap((group) => group.items.map((item) => item.fact));
      for (const fact of CARD_FACTS) assert.equal(facts.filter((f) => f === fact).length, 1, `${resource.slug} ${fact}`);
    }
  });

  test("strict filters return only confirmed facts across the whole library", () => {
    for (const fact of TRI_STATE_FACTS) {
      const key = {
        requiresCreditCard: "noCreditCardOnly",
        requiresAccount: "noAccountOnly",
        commercialUse: "commercialUseOnly",
        personalUse: "personalUseOnly",
      }[fact] as "noCreditCardOnly";
      for (const resource of seedResources.filter((r) => matchesFilters(r, { [key]: true }))) {
        assert.equal(factEvidence(resource, fact).state, "confirmed", `${resource.slug} matched ${key}`);
      }
    }
  });

  test("'without a credit card' returns only confirmed no-card listings and reports the rest", () => {
    const outcome = runSearch(seedResources, { q: "free tools without a credit card" });
    for (const match of outcome.results.items) {
      assert.equal(match.resource.requiresCreditCard, "no");
      assert.equal(factEvidence(match.resource, "requiresCreditCard").state, "confirmed", match.resource.slug);
    }
    assert.ok(outcome.excludedByEvidence > 0, "listings with an unchecked 'no' should be reported as held back");
  });
});
