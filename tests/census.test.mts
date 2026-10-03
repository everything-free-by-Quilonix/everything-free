/**
 * The library census behind the homepage introduction.
 *
 * Every number the introduction states comes from `libraryCensus`, so these
 * tests pin the counting rules: the Survey bar's segments never overlap and
 * always add up to the library, and a verification past the re-check window is
 * never counted as verified.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { categoryGroups, categoryList } from "@/config/categories";
import { availableTools } from "@/config/tools";
import { seedResources } from "@/data/resources";
import { libraryCensus } from "@/features/home/census";
import { computeFacets } from "@/lib/search/filters";
import type { Resource } from "@/types/resource";
import { allRequiredConfirmed, confirmed, makeResource, TODAY, withPass } from "./fixtures.mjs";

const sumSurvey = (survey: ReturnType<typeof libraryCensus>["survey"]) =>
  survey.verified + survey.partiallyVerified + survey.otherConfirmedFact + survey.noConfirmedFact;

function verified(overrides = {}, date?: string): Resource {
  return withPass(
    [...allRequiredConfirmed(), confirmed("OPEN_SOURCE_STATUS")],
    { slug: "verified", verificationStatus: "VERIFIED", license: "Proprietary", ...overrides },
    { verifiedBy: "@test-maintainer", ...(date ? { date } : {}) },
  );
}

function partial(overrides = {}): Resource {
  return withPass([confirmed("FREE_STATUS")], { slug: "partial", verificationStatus: "PARTIALLY_VERIFIED", ...overrides });
}

function oneConfirmedFact(overrides = {}): Resource {
  return withPass([confirmed("LICENSE")], { slug: "licence-only", license: "MIT", ...overrides });
}

describe("libraryCensus", () => {
  test("an empty library counts zero everywhere and its survey sums to zero", () => {
    const census = libraryCensus([], TODAY);
    assert.equal(census.listings, 0);
    assert.equal(census.subjectsWithListings, 0);
    assert.equal(census.verified, 0);
    assert.equal(census.partiallyVerified, 0);
    assert.equal(census.withConfirmedFact, 0);
    assert.equal(sumSurvey(census.survey), 0);
  });

  test("one unchecked listing: one listing, one subject, nothing confirmed", () => {
    const census = libraryCensus([makeResource()], TODAY);
    assert.equal(census.listings, 1);
    assert.equal(census.subjectsWithListings, 1);
    assert.equal(census.withConfirmedFact, 0);
    assert.deepEqual(census.survey, { verified: 0, partiallyVerified: 0, otherConfirmedFact: 0, noConfirmedFact: 1 });
  });

  test("each listing falls in exactly one survey segment, in priority order", () => {
    const resources = [
      verified(),
      partial(),
      oneConfirmedFact(),
      makeResource({ slug: "unchecked-a" }),
      makeResource({ slug: "unchecked-b" }),
    ];
    const census = libraryCensus(resources, TODAY);
    assert.deepEqual(census.survey, { verified: 1, partiallyVerified: 1, otherConfirmedFact: 1, noConfirmedFact: 2 });
    assert.equal(sumSurvey(census.survey), census.listings);
    assert.equal(census.verified, 1);
    assert.equal(census.partiallyVerified, 1);
    assert.equal(census.withConfirmedFact, 3);
  });

  test("a stale verification is neither verified nor a confirmed fact", () => {
    const stale = verified({}, "2025-01-01");
    const census = libraryCensus([stale], TODAY);
    assert.equal(census.verified, 0);
    assert.equal(census.withConfirmedFact, 0);
    assert.deepEqual(census.survey, { verified: 0, partiallyVerified: 0, otherConfirmedFact: 0, noConfirmedFact: 1 });
  });

  test("subjects count those with at least one listing, as computeFacets counts them", () => {
    const resources = [
      makeResource({ slug: "a", category: "utilities" }),
      makeResource({ slug: "b", category: "utilities" }),
      makeResource({ slug: "c", category: "photography" }),
    ];
    const census = libraryCensus(resources, TODAY);
    const facets = computeFacets(resources, {});
    const expected = categoryList.filter((c) => (facets.categories[c.id] ?? 0) > 0).length;
    assert.equal(census.subjectsWithListings, expected);
    assert.ok(census.subjectsWithListings >= 2);
  });

  test("structure counts come from config", () => {
    const census = libraryCensus([], TODAY);
    assert.equal(census.subjectsDefined, categoryList.length);
    assert.equal(census.groups, categoryGroups.length);
    assert.equal(census.toolsAvailable, availableTools.length);
  });

  test("the shipped library: segments are exclusive and sum to the listing count", () => {
    const census = libraryCensus(seedResources);
    assert.equal(census.listings, seedResources.length);
    assert.equal(sumSurvey(census.survey), census.listings);
    assert.equal(census.survey.verified, census.verified);
    assert.equal(census.survey.partiallyVerified, census.partiallyVerified);
    assert.ok(census.survey.otherConfirmedFact <= census.withConfirmedFact);
    assert.ok(census.subjectsWithListings <= census.subjectsDefined);
  });
});
