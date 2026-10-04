/**
 * The command palette: index building, schema and search.
 *
 * Pins the scoring order, the group caps, the handoff row, the evidence words
 * each listing carries, and that an index built from the real seed data is one
 * the browser will accept.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { categoryGroups } from "@/config/categories";
import { collections } from "@/data/collections";
import { seedResources } from "@/data/resources";
import { buildPaletteIndex } from "@/features/palette/build-palette-index";
import { paletteIndexSchema, type PaletteIndex } from "@/features/palette/palette-index-schema";
import {
  cleanQuery,
  flattenRows,
  GROUP_CAPS,
  MAX_QUERY,
  matchSpan,
  resultCount,
  scoreEntry,
  searchPalette,
} from "@/features/palette/palette-search";
import { seedDataSource } from "@/lib/repository/seed-adapter";
import { FACTS, factEvidence } from "@/lib/resources/evidence";
import { matchesFilters } from "@/lib/search/filters";

const listable = seedResources.filter((r) => matchesFilters(r, {}));
const real = buildPaletteIndex({
  resources: listable,
  alternatives: await seedDataSource.listAlternativeTargets(),
  collections,
});

function fixture(names: string[]): PaletteIndex {
  return {
    v: 1,
    t: 11,
    resources: names.map((n, i) => ({ s: `r${i}`, n, c: "Design", f: "Free", k: 0, u: 0, o: "https://example.org/" })),
    subjects: [],
    collections: [],
    tools: [],
    audiences: [],
    alternatives: [],
    pages: [{ href: "/verification/", n: "How verification works" }],
    filters: [],
  };
}

const labels = (index: PaletteIndex, q: string) =>
  searchPalette(index, q).find((g) => g.id === "listings")?.rows.map((r) => r.label) ?? [];

describe("palette scoring", () => {
  test("exact, then prefix, then word boundary, then substring", () => {
    const index = fixture(["Photo Kit", "Photopea", "Open Photo", "Rephotograph", "Photo"]);
    assert.deepEqual(labels(index, "photo"), ["Photo", "Photo Kit", "Photopea", "Open Photo", "Rephotograph"]);
  });

  test("the subject alone supports a match only weakly", () => {
    assert.equal(scoreEntry("Krita", "Design", "design"), 20);
    assert.equal(scoreEntry("Krita", "Design", "audio"), null);
  });

  test("every term must match somewhere", () => {
    const index = fixture(["Free PDF Editor", "PDF Reader"]);
    assert.deepEqual(labels(index, "pdf editor"), ["Free PDF Editor"]);
  });

  test("diacritics fold both ways", () => {
    const index = fixture(["Précis", "Other"]);
    assert.deepEqual(labels(index, "precis"), ["Précis"]);
    assert.deepEqual(labels(fixture(["Precis"]), "précis"), ["Precis"]);
  });

  test("ties sort by name, so order is deterministic", () => {
    const index = fixture(["Zed Notes", "Alpha Notes", "Mid Notes"]);
    assert.deepEqual(labels(index, "notes"), ["Alpha Notes", "Mid Notes", "Zed Notes"]);
  });

  test("groups are capped and the handoff row is always last", () => {
    const index = fixture(Array.from({ length: 20 }, (_, i) => `Tool ${i}`));
    const groups = searchPalette(index, "tool");
    assert.equal(groups.find((g) => g.id === "listings")?.rows.length, GROUP_CAPS.listings);
    const last = flattenRows(groups).at(-1);
    assert.equal(last?.label, "Search the full library for “tool”");
    assert.equal(last?.href, "/resources/?q=tool");
    assert.equal(resultCount(groups), GROUP_CAPS.listings);
  });

  test("the query is trimmed and capped at 100 characters", () => {
    assert.equal(cleanQuery(`  ${"a".repeat(150)}  `).length, MAX_QUERY);
    const handoff = flattenRows(searchPalette(fixture([]), "x".repeat(150))).at(-1);
    assert.equal(handoff?.href, `/resources/?q=${"x".repeat(MAX_QUERY)}`);
  });

  test("a query with no match offers only the handoff", () => {
    const groups = searchPalette(fixture(["Krita"]), "zzzz");
    assert.deepEqual(groups.map((g) => g.id), ["search"]);
    assert.equal(resultCount(groups), 0);
  });

  test("an empty query lists the fixed pages and the page's own sections", () => {
    const groups = searchPalette(fixture([]), "  ", [{ id: "facts-heading", label: "Facts" }]);
    assert.deepEqual(groups.map((g) => g.id), ["goto", "sections"]);
    assert.deepEqual(groups[1].rows[0], { id: "section-facts-heading", label: "Facts", href: "#facts-heading", anchor: true });
  });

  test("before the index loads, a typed query still hands off", () => {
    assert.deepEqual(searchPalette(null, "blender").map((g) => g.id), ["search"]);
    assert.ok(searchPalette(null, "")[0].rows.length > 0);
  });

  test("the match span marks the prefix, and nothing when folding changed the length", () => {
    assert.deepEqual(matchSpan("Photopea", "photo"), [0, 5]);
    assert.deepEqual(matchSpan("Open Photo", "photo"), [5, 10]);
    assert.equal(matchSpan("Æsop", "aesop"), undefined);
  });

  test("listing rows carry the official link for Shift+Enter, other rows do not", () => {
    const rows = flattenRows(searchPalette(real, "krita"));
    const krita = rows.find((r) => r.href === "/resources/krita/");
    assert.ok(krita?.official?.startsWith("https://"));
    assert.ok(rows.filter((r) => !r.href.startsWith("/resources/krita")).every((r) => r.official === undefined));
  });

  test("filter rows use the active-filter labels and the URL builder", () => {
    const rows = searchPalette(real, "credit card").find((g) => g.id === "filters")?.rows ?? [];
    assert.deepEqual(
      rows.map((r) => [r.label, r.href]),
      [["No credit card · confirmed", "/resources?noCreditCard=1"]],
    );
  });
});

describe("palette index schema", () => {
  test("accepts a valid index", () => {
    assert.ok(paletteIndexSchema.safeParse(fixture(["Krita"])).success);
  });

  test("rejects k + u above t, a negative u, and another version", () => {
    const base = fixture(["Krita"]);
    const over = { ...base, resources: [{ ...base.resources[0], k: 9, u: 3 }] };
    const negative = { ...base, resources: [{ ...base.resources[0], u: -1 }] };
    assert.equal(paletteIndexSchema.safeParse(over).success, false);
    assert.equal(paletteIndexSchema.safeParse(negative).success, false);
    assert.equal(paletteIndexSchema.safeParse({ ...base, v: 2 }).success, false);
  });

  test("rejects an official link that is not a URL", () => {
    const base = fixture(["Krita"]);
    assert.equal(paletteIndexSchema.safeParse({ ...base, resources: [{ ...base.resources[0], o: "krita" }] }).success, false);
  });
});

describe("palette index from the seed data", () => {
  test("is accepted by the schema, with t equal to FACTS.length", () => {
    assert.ok(paletteIndexSchema.safeParse(real).success);
    assert.equal(real.t, FACTS.length);
  });

  test("has one entry per listable resource, each with k + u ≤ t", () => {
    assert.equal(real.resources.length, listable.length);
    assert.equal(new Set(real.resources.map((r) => r.s)).size, listable.length);
    assert.ok(real.resources.every((r) => r.k + r.u <= real.t));
  });

  test("words the free status as the ledger does: confirmed label, or 'Listed as …'", () => {
    for (const resource of listable) {
      const entry = real.resources.find((r) => r.s === resource.slug);
      const confirmed = factEvidence(resource, "freeStatus").state === "confirmed";
      assert.equal(entry?.f.startsWith("Listed as "), !confirmed, resource.slug);
    }
  });

  test("lists each subject once, grouped under its first group", () => {
    assert.equal(new Set(real.subjects.map((s) => s.s)).size, real.subjects.length);
    // Books sits in two groups; the palette names the first in config order.
    const containing = categoryGroups.filter((group) => group.categoryIds.includes("books"));
    assert.ok(containing.length >= 2, "books is expected to sit in two groups");
    assert.equal(real.subjects.find((s) => s.s === "books")?.g, containing[0].name);
  });
});
