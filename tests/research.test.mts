/**
 * Research overlays: dated evidence applied to listings that already exist.
 * The overlay may correct facts, but the status is always derived from the checks.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { seedResources } from "@/data/resources";
import { researchOverlays } from "@/data/resources/research";
import { applyResearch, type ResearchOverlay } from "@/data/resources/research/apply";
import { findDataProblems } from "@/data/resources/validate";

import { makeResource } from "./fixtures.mjs";

const URL = "https://example.com/pricing";

function overlay(slug: string, freeConfirmed: boolean): ResearchOverlay {
  return {
    slug,
    set: { limitations: ["Corrected limit"] },
    research: {
      date: "2026-10-11",
      sources: [{ url: URL, label: "Pricing page" }],
      checks: freeConfirmed
        ? [{ check: "FREE_STATUS", result: "confirmed", evidence: "Free plan at $0.", sourceUrl: URL }]
        : [{ check: "OFFICIAL_URL", result: "confirmed", evidence: "Official site.", sourceUrl: URL }],
      notes: "Test pass.",
    },
  };
}

describe("applyResearch", () => {
  test("a confirmed free status makes the listing partially verified, never verified", () => {
    const [result] = applyResearch([makeResource({ slug: "a" })], [overlay("a", true)]);
    assert.equal(result.verificationStatus, "PARTIALLY_VERIFIED");
    assert.deepEqual(result.limitations, ["Corrected limit"]);
    assert.equal(result.verificationSources?.[0]?.retrievedAt, "2026-10-11");
  });

  test("without a confirmed free status the listing stays unverified", () => {
    const [result] = applyResearch([makeResource({ slug: "a" })], [overlay("a", false)]);
    assert.equal(result.verificationStatus, "UNVERIFIED");
  });

  test("an overlay for a slug that does not exist fails loudly", () => {
    assert.throws(() => applyResearch([makeResource({ slug: "a" })], [overlay("missing", true)]), /not in the library/);
  });

  test("two overlays for one slug fail loudly", () => {
    assert.throws(() => applyResearch([makeResource({ slug: "a" })], [overlay("a", true), overlay("a", true)]), /twice/);
  });
});

describe("the recorded research passes", () => {
  test("every overlaid listing is in the library and passes validation", () => {
    const slugs = new Set(researchOverlays.map((entry) => entry.slug));
    const overlaid = seedResources.filter((resource) => slugs.has(resource.slug));
    assert.equal(overlaid.length, slugs.size);
    // Validate the whole library (cross-references need it), then look at these listings.
    const problems = findDataProblems([...seedResources]).filter((problem) =>
      [...slugs].some((slug) => problem.includes(`"${slug}"`)),
    );
    assert.deepEqual(problems, []);
  });

  test("no overlaid listing claims VERIFIED", () => {
    const slugs = new Set(researchOverlays.map((entry) => entry.slug));
    for (const resource of seedResources.filter((entry) => slugs.has(entry.slug))) {
      assert.notEqual(resource.verificationStatus, "VERIFIED", resource.slug);
    }
  });
});
