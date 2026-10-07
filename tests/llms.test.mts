/**
 * The AI-readable digest must not state a fact more confidently than the site does.
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { categories } from "@/config/categories";
import { seedResources } from "@/data/resources";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/seo/llms";

import { confirmed, makeResource, TODAY, withPass } from "./fixtures.mjs";

describe("llms.txt", () => {
  test("an unchecked value is written as recorded, not verified", () => {
    const text = buildLlmsFullTxt({ resources: [makeResource({ requiresCreditCard: "no" })], now: TODAY });
    const block = text.split("## Fixture")[1];
    assert.match(block, /Credit card required: recorded as no \(not verified\)/);
    assert.doesNotMatch(block, /\(confirmed/);
  });

  test("a confirmed value cites its dated source", () => {
    const resource = withPass([confirmed("CREDIT_CARD_REQUIREMENT")]);
    const text = buildLlmsFullTxt({ resources: [resource], now: TODAY });
    assert.match(text, /Credit card required: no \(confirmed, source: https:\/\/example\.org\/pricing, read 2026-09-26\)/);
  });

  test("a trial is never labelled free", () => {
    const trial = makeResource({ freeStatus: "TRIAL", limitations: ["Expires after 14 days."] });
    const text = buildLlmsFullTxt({ resources: [trial], now: TODAY });
    assert.match(text, /Free status: recorded as Trial/);
  });

  test("the index links every category that has listings, and the full file every listing", () => {
    const input = { resources: seedResources, alternatives: [], tools: [], collections: [], now: TODAY };
    const index = buildLlmsTxt(input);
    for (const id of new Set(seedResources.map((r) => r.category))) {
      const category = categories.find((entry) => entry.id === id);
      assert.ok(category && index.includes(`/categories/${category.slug}/`), id);
    }
    const full = buildLlmsFullTxt(input);
    for (const resource of seedResources) assert.ok(full.includes(`/resources/${resource.slug}/`), resource.slug);
  });
});
