/**
 * Quick Compare: URL parsing, the selection reducer, the difference lens, the
 * parity sentence, and the build-time index's evidence against `factEvidence`.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { seedResources } from "@/data/resources";
import { buildCompareIndex } from "@/features/compare/build-compare-index";
import { compareIndexSchema, type CompareEntry } from "@/features/compare/compare-index-schema";
import {
  COMPARE_FACTS,
  compareHref,
  compareSelection,
  diffRows,
  paritySentence,
  parseCompareSlugs,
  parseDiff,
  resolveCompare,
} from "@/features/compare/compare-params";
import { FACTS, factEvidence, hasRecordedValue } from "@/lib/resources/evidence";
import { matchesFilters } from "@/lib/search/filters";

const listable = seedResources.filter((r) => matchesFilters(r, {}));
const real = buildCompareIndex(listable);

function entry(s: string, k: number, overrides: Partial<CompareEntry["cells"]> = {}, checked: string | null = null): CompareEntry {
  const base = { text: "Recorded as no", state: "unconfirmed", reason: "not-checked" } as const;
  return {
    s,
    n: s.toUpperCase(),
    c: "Design",
    cells: Object.fromEntries(COMPARE_FACTS.map((fact) => [fact, overrides[fact] ?? base])) as CompareEntry["cells"],
    checked,
    k,
    u: 0,
  };
}

describe("compare r parsing", () => {
  test("comma and repeated forms combine in order", () => {
    assert.deepEqual(parseCompareSlugs(["krita,gimp", "inkscape"]), { slugs: ["krita", "gimp", "inkscape"], truncated: false });
  });

  test("invalid values are dropped, values are trimmed and lower-cased", () => {
    assert.deepEqual(parseCompareSlugs([" Krita ", "not a slug", "-bad", "ok-1", "a".repeat(101), ""]).slugs, ["krita", "ok-1"]);
  });

  test("duplicates keep the first occurrence", () => {
    assert.deepEqual(parseCompareSlugs(["gimp,krita,gimp"]).slugs, ["gimp", "krita"]);
  });

  test("more than three keeps the first three and says so", () => {
    assert.deepEqual(parseCompareSlugs(["a,b,c,d"]), { slugs: ["a", "b", "c"], truncated: true });
  });

  test("unknown slugs are left out and counted", () => {
    const { found, missing } = resolveCompare(["krita", "not-a-real-slug"], real.entries);
    assert.deepEqual(found.map((e) => e.s), ["krita"]);
    assert.equal(missing, 1);
  });
});

describe("compare diff parsing and hrefs", () => {
  test("only '1' means differences", () => {
    assert.equal(parseDiff("1"), true);
    assert.equal(parseDiff("true"), false);
    assert.equal(parseDiff(null), false);
  });

  test("hrefs keep commas readable and add diff only when set", () => {
    assert.equal(compareHref(["krita", "gimp"]), "/compare/?r=krita,gimp");
    assert.equal(compareHref(["krita", "gimp"], true), "/compare/?r=krita,gimp&diff=1");
    assert.equal(compareHref([]), "/compare/");
  });
});

describe("diffRows", () => {
  test("a differing value marks its row", () => {
    const a = entry("a", 0);
    const b = entry("b", 0, { license: { text: "Recorded as MIT", state: "unconfirmed", reason: "not-checked" } });
    assert.deepEqual([...diffRows([a, b], 11)], ["license"]);
  });

  test("the same words with a different evidence reason still differ", () => {
    const a = entry("a", 1, { freeStatus: { text: "Free", state: "confirmed", reason: "confirmed" } });
    const b = entry("b", 1, { freeStatus: { text: "Free", state: "unconfirmed", reason: "stale" } });
    assert.ok(diffRows([a, b], 11).has("freeStatus"));
  });

  test("identical listings differ in nothing, and one listing alone in nothing", () => {
    assert.equal(diffRows([entry("a", 0), entry("b", 0)], 11).size, 0);
    assert.equal(diffRows([entry("a", 3)], 11).size, 0);
  });

  test("the last check and facts confirmed rows compare too", () => {
    const rows = diffRows([entry("a", 2, {}, "March 2026"), entry("b", 0)], 11);
    assert.ok(rows.has("lastChecked") && rows.has("factsConfirmed"));
  });
});

describe("paritySentence", () => {
  test("unequal evidence names each count against t", () => {
    assert.equal(
      paritySentence([entry("krita", 3), entry("gimp", 0)], 11),
      "Compared on unequal evidence: KRITA has 3 of 11 facts confirmed; GIMP has 0.",
    );
  });

  test("all zero says nothing is checked", () => {
    assert.equal(
      paritySentence([entry("a", 0), entry("b", 0)], 11),
      "None of these listings has a confirmed fact yet. Every value below is as recorded, not checked.",
    );
  });

  test("equal non-zero counts say so, with the index total", () => {
    assert.equal(paritySentence([entry("a", 4), entry("b", 4)], 9), "Compared on equal evidence: each has 4 of 9 facts confirmed.");
  });
});

describe("compareSelection", () => {
  test("toggle adds, toggle removes, clear empties", () => {
    const one = compareSelection([], { type: "toggle", slug: "a" });
    assert.deepEqual(one, ["a"]);
    assert.deepEqual(compareSelection(one, { type: "toggle", slug: "a" }), []);
    assert.deepEqual(compareSelection(["a", "b"], { type: "clear" }), []);
  });

  test("a fourth toggle returns the state unchanged", () => {
    const full = ["a", "b", "c"];
    assert.equal(compareSelection(full, { type: "toggle", slug: "d" }), full);
  });

  test("the input array is not mutated", () => {
    const state = Object.freeze(["a"]) as readonly string[];
    compareSelection(state, { type: "toggle", slug: "b" });
    compareSelection(state, { type: "toggle", slug: "a" });
    assert.deepEqual(state, ["a"]);
  });
});

describe("compare index from the seed data", () => {
  test("is accepted by the schema, with t equal to FACTS.length", () => {
    assert.ok(compareIndexSchema.safeParse(real).success);
    assert.equal(real.t, FACTS.length);
    assert.equal(real.entries.length, listable.length);
  });

  test("every cell carries factEvidence's state and reason, and never upgrades a value", () => {
    for (const resource of listable) {
      const e = real.entries.find((x) => x.s === resource.slug)!;
      for (const fact of COMPARE_FACTS) {
        const evidence = factEvidence(resource, fact);
        const c = e.cells[fact];
        assert.equal(c.state, evidence.state, `${resource.slug} ${fact}`);
        assert.equal(c.reason, evidence.reason, `${resource.slug} ${fact}`);
        if (evidence.state !== "confirmed") {
          const recorded = hasRecordedValue(resource, fact);
          assert.ok(
            recorded ? /^(Recorded|Listed) as /.test(c.text) : c.text === "Unknown",
            `${resource.slug} ${fact} reads "${c.text}"`,
          );
        }
      }
    }
  });

  test("the schema rejects k + u above t and an evidence state outside the union", () => {
    const base = real.entries[0];
    assert.equal(compareIndexSchema.safeParse({ ...real, entries: [{ ...base, k: 9, u: 9 }] }).success, false);
    const bad = { ...base, cells: { ...base.cells, license: { ...base.cells.license, state: "verified" } } };
    assert.equal(compareIndexSchema.safeParse({ ...real, entries: [bad] }).success, false);
    assert.equal(compareIndexSchema.safeParse({ ...real, v: 2 }).success, false);
  });
});
