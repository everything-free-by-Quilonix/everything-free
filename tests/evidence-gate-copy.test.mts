/**
 * The Evidence Gate's copy.
 *
 * The bar compares shown against held back, which is honest only when both
 * numbers share a base. `runSearch` counts the held-back listings with the text
 * query removed, so these tests pin the rule: with residual query terms there is
 * no bar and the sentence says the held-back figure is library-wide.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { seedResources } from "@/data/resources";
import { evidenceGateCopy, GATE_QUERY_MAX } from "@/features/search/evidence-gate-copy";
import { parseSearchParams, searchParamsToInput } from "@/lib/search/params";
import { runSearch } from "@/lib/search/run-search";

describe("evidenceGateCopy without a text query", () => {
  test("draws the bar and states both numbers", () => {
    const copy = evidenceGateCopy({ total: 4, heldBack: 150 });
    assert.equal(copy.showBar, true);
    assert.equal(copy.text, "Shown 4 · Held back 150");
    assert.equal(copy.accessibleText, "4 shown, 150 held back because the fact is not yet checked.");
  });

  test("nothing held back draws no bar", () => {
    const copy = evidenceGateCopy({ total: 12, heldBack: 0 });
    assert.equal(copy.showBar, false);
    assert.equal(copy.text, "Nothing held back");
    assert.match(copy.accessibleText, /^12 shown\. Nothing held back/);
  });

  test("zero shown still draws the bar, all held back", () => {
    const copy = evidenceGateCopy({ total: 0, heldBack: 9 });
    assert.equal(copy.showBar, true);
    assert.equal(copy.text, "Shown 0 · Held back 9");
  });

  test("a whitespace-only query is treated as empty", () => {
    const copy = evidenceGateCopy({ total: 4, heldBack: 150, q: "   " });
    assert.equal(copy.showBar, true);
    assert.equal(copy.text, "Shown 4 · Held back 150");
  });

  test("counts use the library's number format", () => {
    assert.equal(evidenceGateCopy({ total: 1200, heldBack: 3400 }).text, "Shown 1,200 · Held back 3,400");
  });
});

describe("evidenceGateCopy with a residual text query", () => {
  test("draws no bar and says the held-back figure is library-wide", () => {
    const copy = evidenceGateCopy({ total: 2, heldBack: 150, q: "photo" });
    assert.equal(copy.showBar, false);
    assert.equal(
      copy.text,
      "Shown 2 matching “photo” · 150 listings in the library record this fact but are not yet checked",
    );
    assert.equal(copy.accessibleText, copy.text);
  });

  test("singular agreement", () => {
    assert.equal(
      evidenceGateCopy({ total: 1, heldBack: 1, q: "photo" }).text,
      "Shown 1 matching “photo” · 1 listing in the library records this fact but is not yet checked",
    );
  });

  test("nothing held back", () => {
    const copy = evidenceGateCopy({ total: 3, heldBack: 0, q: "photo" });
    assert.equal(copy.showBar, false);
    assert.equal(copy.text, "Shown 3 matching “photo” · nothing held back");
  });

  test("zero shown keeps the text-only sentence", () => {
    const copy = evidenceGateCopy({ total: 0, heldBack: 5, q: "photo" });
    assert.equal(copy.showBar, false);
    assert.match(copy.text, /^Shown 0 matching “photo” · 5 listings in the library record this fact/);
  });

  test("a long query is truncated to 40 characters with an ellipsis", () => {
    const q = "a".repeat(60);
    const copy = evidenceGateCopy({ total: 1, heldBack: 2, q });
    assert.ok(copy.text.includes(`“${"a".repeat(GATE_QUERY_MAX)}…”`));
    assert.ok(!copy.text.includes("a".repeat(GATE_QUERY_MAX + 1)));
  });
});

describe("evidenceGateCopy with runSearch", () => {
  test("an intent-only query leaves no residual terms, so the bar is honest", () => {
    const query = parseSearchParams(searchParamsToInput(new URLSearchParams("q=without+a+credit+card")));
    const outcome = runSearch(seedResources, query);
    assert.equal(outcome.effectiveQuery.noCreditCardOnly, true);
    assert.equal(outcome.effectiveQuery.q, undefined);
    const copy = evidenceGateCopy({
      total: outcome.results.total,
      heldBack: outcome.excludedByEvidence,
      q: outcome.effectiveQuery.q,
    });
    assert.ok(outcome.excludedByEvidence > 0, "the seed data records unchecked credit-card facts");
    assert.equal(copy.showBar, true);
    assert.ok(!copy.text.includes("“"), "an intent-only query is not quoted back");
  });
});
