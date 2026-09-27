/**
 * Fact-level evidence: the ten scenarios the milestone set out, plus the rules
 * that make impossible evidence states fail the build.
 *
 * Run with `npm test`. Uses Node's built-in test runner against the TypeScript
 * source; see scripts/test/hooks.mjs.
 */

import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { findDataProblems } from "@/data/resources/validate";
import { cardEvidenceSummary, confirmedAvailability, factEvidence } from "@/lib/resources/evidence";
import { matchesFilters } from "@/lib/search/filters";
import { runSearch } from "@/lib/search/run-search";
import type { Resource } from "@/types/resource";

import { allRequiredConfirmed, confirmed, makeResource, TODAY, unresolved, withPass } from "./fixtures.mjs";

const REGISTERED = (handle: string | undefined) => handle === "@test-maintainer";
const problemsOf = (resource: Resource) =>
  findDataProblems([resource], { now: TODAY, isMaintainer: REGISTERED });

/** Every fact a card states, grouped by its evidence reason. */
function cardText(resource: Resource) {
  return Object.fromEntries(
    cardEvidenceSummary(resource, TODAY).map((group) => [group.reason, group.items.map((item) => item.text)]),
  );
}

function verifiedResource(overrides = {}) {
  return withPass(
    [...allRequiredConfirmed(), confirmed("OPEN_SOURCE_STATUS")],
    { verificationStatus: "VERIFIED", license: "Proprietary", ...overrides },
    { verifiedBy: "@test-maintainer" },
  );
}

describe("1. VERIFIED resource + confirmed fact", () => {
  const resource = verifiedResource();

  test("the data is valid when a registered maintainer signed it off", () => {
    assert.deepEqual(problemsOf(resource), []);
  });

  test("the fact is confirmed, with its source, date and verifier", () => {
    const evidence = factEvidence(resource, "requiresCreditCard", TODAY);
    assert.equal(evidence.state, "confirmed");
    assert.equal(evidence.source?.url, "https://example.org/pricing");
    assert.equal(evidence.checkedAt, "2026-09-26");
    assert.equal(evidence.checkedBy, "@test-maintainer");
  });

  test("the card states the confirmed value", () => {
    assert.deepEqual(cardText(resource).confirmed, [
      "no credit card needed",
      "no account needed",
      "commercial use allowed",
    ]);
  });

  test("the strict filter matches", () => {
    assert.equal(matchesFilters(resource, { noCreditCardOnly: true }), true);
  });
});

describe("2. VERIFIED resource + unknown fact", () => {
  test("VERIFIED with a confirmed check over an unknown value is an impossible state and fails the build", () => {
    const problems = problemsOf(verifiedResource({ requiresCreditCard: "unknown" }));
    assert.ok(problems.some((p) => p.includes('CREDIT_CARD_REQUIREMENT as confirmed but requiresCreditCard is "unknown"')));
  });

  test("VERIFIED with an unresolved required fact fails the build", () => {
    const records = allRequiredConfirmed().filter((r) => r.check !== "CREDIT_CARD_REQUIREMENT");
    const resource = withPass(
      [...records, unresolved("CREDIT_CARD_REQUIREMENT")],
      { verificationStatus: "VERIFIED", requiresCreditCard: "unknown" },
      { verifiedBy: "@test-maintainer" },
    );
    assert.ok(problemsOf(resource).some((p) => p.includes("has not confirmed required checks: CREDIT_CARD_REQUIREMENT")));
  });

  test("an optional fact nobody checked stays unconfirmed even on a VERIFIED listing", () => {
    const resource = verifiedResource();
    assert.deepEqual(problemsOf(resource), []);
    const platforms = factEvidence(resource, "platforms", TODAY);
    assert.equal(platforms.state, "unconfirmed");
    assert.equal(platforms.reason, "not-checked");
  });
});

describe("3. PARTIALLY_VERIFIED resource + confirmed fact", () => {
  const resource = withPass(
    [confirmed("FREE_STATUS"), confirmed("COMMERCIAL_USE")],
    { verificationStatus: "PARTIALLY_VERIFIED" },
  );

  test("the data is valid", () => {
    assert.deepEqual(problemsOf(resource), []);
  });

  test("the fact is confirmed although the listing is only partially verified", () => {
    assert.equal(factEvidence(resource, "commercialUse", TODAY).state, "confirmed");
    assert.equal(confirmedAvailability(resource, "commercialUse", TODAY), "yes");
    assert.equal(matchesFilters(resource, { commercialUseOnly: true }), true);
  });

  test("the card claims only what is confirmed", () => {
    const text = cardText(resource);
    assert.deepEqual(text.confirmed, ["commercial use allowed"]);
    assert.deepEqual(text["not-checked"], ["credit card", "account"]);
  });
});

describe("4. PARTIALLY_VERIFIED resource + unknown fact", () => {
  const resource = withPass(
    [confirmed("FREE_STATUS"), unresolved("CREDIT_CARD_REQUIREMENT")],
    { verificationStatus: "PARTIALLY_VERIFIED", requiresCreditCard: "unknown" },
  );

  test("the data is valid", () => {
    assert.deepEqual(problemsOf(resource), []);
  });

  test("the fact is unknown, because someone looked and could not settle it", () => {
    const evidence = factEvidence(resource, "requiresCreditCard", TODAY);
    assert.equal(evidence.state, "unknown");
    assert.equal(evidence.reason, "unresolved");
    assert.equal(confirmedAvailability(resource, "requiresCreditCard", TODAY), null);
  });

  test("the card says 'Not confirmed', never 'No credit card'", () => {
    const text = cardText(resource);
    assert.deepEqual(text.unresolved, ["credit card"]);
    assert.ok(!(text.confirmed ?? []).some((item) => item.includes("credit card")));
  });

  test("an unresolved check next to a stored 'no' fails the build", () => {
    const broken = withPass(
      [confirmed("FREE_STATUS"), unresolved("CREDIT_CARD_REQUIREMENT")],
      { verificationStatus: "PARTIALLY_VERIFIED", requiresCreditCard: "no" },
    );
    assert.ok(problemsOf(broken).some((p) => p.includes("CREDIT_CARD_REQUIREMENT as unresolved")));
  });
});

describe("5. UNVERIFIED resource + existing unverified value", () => {
  const resource = makeResource({ requiresCreditCard: "no", commercialUse: "yes" });

  test("a stored 'no' is a claim, not a confirmed no", () => {
    const evidence = factEvidence(resource, "requiresCreditCard", TODAY);
    assert.equal(evidence.state, "unconfirmed");
    assert.equal(evidence.reason, "not-checked");
    assert.equal(confirmedAvailability(resource, "requiresCreditCard", TODAY), null);
  });

  test("a stored 'yes' is a claim, not a confirmed yes", () => {
    assert.equal(confirmedAvailability(resource, "commercialUse", TODAY), null);
  });

  test("the card lists every fact as not verified and states no value", () => {
    const text = cardText(resource);
    assert.equal(text.confirmed, undefined);
    assert.deepEqual(text["not-checked"], ["free status", "credit card", "account", "commercial use"]);
  });
});

describe("6. Strict filter with a confirmed 'no'", () => {
  test("matches", () => {
    const resource = withPass(
      [confirmed("FREE_STATUS"), confirmed("CREDIT_CARD_REQUIREMENT")],
      { verificationStatus: "PARTIALLY_VERIFIED", requiresCreditCard: "no" },
    );
    assert.equal(matchesFilters(resource, { noCreditCardOnly: true }), true);
  });

  test("a confirmed 'yes' does not match 'No credit card'", () => {
    const resource = withPass(
      [confirmed("FREE_STATUS"), confirmed("CREDIT_CARD_REQUIREMENT")],
      { verificationStatus: "PARTIALLY_VERIFIED", requiresCreditCard: "yes" },
    );
    assert.equal(matchesFilters(resource, { noCreditCardOnly: true }), false);
  });
});

describe("7. Strict filter with unknown", () => {
  const unknown = makeResource({ requiresCreditCard: "unknown", commercialUse: "unknown" });

  test("unknown never matches 'no'", () => {
    assert.equal(matchesFilters(unknown, { noCreditCardOnly: true }), false);
    assert.equal(matchesFilters(unknown, { noCreditCardOnly: true }, { evidence: "recorded" }), false);
  });

  test("unknown never matches 'yes'", () => {
    assert.equal(matchesFilters(unknown, { commercialUseOnly: true }), false);
    assert.equal(matchesFilters(unknown, { commercialUseOnly: true }, { evidence: "recorded" }), false);
  });

  test("an unchecked 'no' does not match either — it is only counted as held back", () => {
    const unchecked = makeResource({ requiresCreditCard: "no" });
    assert.equal(matchesFilters(unchecked, { noCreditCardOnly: true }), false);
    assert.equal(matchesFilters(unchecked, { noCreditCardOnly: true }, { evidence: "recorded" }), true);
  });

  test("an expired confirmation no longer matches", () => {
    const stale = withPass(
      [confirmed("FREE_STATUS"), confirmed("CREDIT_CARD_REQUIREMENT")],
      { verificationStatus: "PARTIALLY_VERIFIED" },
      { date: "2026-01-10" },
    );
    const evidence = factEvidence(stale, "requiresCreditCard", TODAY);
    assert.equal(evidence.state, "unconfirmed");
    assert.equal(evidence.reason, "stale");
  });
});

describe("8. Search query containing 'without credit card'", () => {
  const confirmedNo = withPass(
    [confirmed("FREE_STATUS"), confirmed("CREDIT_CARD_REQUIREMENT")],
    { slug: "confirmed-no", name: "Voice Maker Confirmed", verificationStatus: "PARTIALLY_VERIFIED", tags: ["voice"] },
  );
  const uncheckedNo = makeResource({ slug: "unchecked-no", name: "Voice Maker Unchecked", tags: ["voice"] });
  const unknownCard = makeResource({
    slug: "unknown-card",
    name: "Voice Maker Unknown",
    tags: ["voice"],
    requiresCreditCard: "unknown",
  });
  const outcome = runSearch([confirmedNo, uncheckedNo, unknownCard], { q: "free AI voice maker without credit card" });

  test("the phrase becomes a confirmed-only filter the user can see", () => {
    assert.equal(outcome.effectiveQuery.noCreditCardOnly, true);
    assert.ok(outcome.inferredFilters.some((f) => f.key === "noCreditCardOnly" && f.label.includes("confirmed")));
  });

  test("only the listing with a confirmed 'no' is returned", () => {
    assert.deepEqual(
      outcome.results.items.map((match) => match.resource.slug),
      ["confirmed-no"],
    );
  });

  test("the unchecked 'no' is reported as held back; the unknown is not counted as a 'no'", () => {
    assert.equal(outcome.excludedByEvidence, 1);
  });
});

describe("9. Resource card with an unsupported reassurance", () => {
  test("recorded favourable values produce no confirmed statement", () => {
    const resource = makeResource({ requiresCreditCard: "no", requiresAccount: "no", commercialUse: "yes" });
    const text = cardText(resource);
    assert.equal(text.confirmed, undefined);
    for (const items of Object.values(text)) {
      for (const item of items) assert.ok(!/^no |allowed$/.test(item), `unsupported claim: ${item}`);
    }
  });

  test("an expired confirmation shows as 'Needs re-checking', not confirmed", () => {
    const stale = withPass(
      [confirmed("FREE_STATUS"), confirmed("CREDIT_CARD_REQUIREMENT")],
      { verificationStatus: "PARTIALLY_VERIFIED" },
      { date: "2026-01-10" },
    );
    const text = cardText(stale);
    assert.equal(text.confirmed, undefined);
    assert.ok(text.stale.includes("credit card"));
  });
});

describe("10. Resource detail with mixed evidence states", () => {
  const resource = withPass(
    [confirmed("FREE_STATUS"), confirmed("COMMERCIAL_USE"), unresolved("CREDIT_CARD_REQUIREMENT"), confirmed("LICENSE")],
    { verificationStatus: "PARTIALLY_VERIFIED", requiresCreditCard: "unknown", license: "MIT", openSource: true },
  );

  test("each fact carries its own state, independent of the listing's badge", () => {
    const states = Object.fromEntries(
      (["freeStatus", "commercialUse", "requiresCreditCard", "requiresAccount", "license", "platforms"] as const).map(
        (fact) => [fact, factEvidence(resource, fact, TODAY).reason],
      ),
    );
    assert.deepEqual(states, {
      freeStatus: "confirmed",
      commercialUse: "confirmed",
      requiresCreditCard: "unresolved",
      requiresAccount: "not-checked",
      license: "confirmed",
      platforms: "not-checked",
    });
  });

  test("a fact can be stronger than the listing: confirmed licence on an unverified listing", () => {
    const listing = withPass([confirmed("LICENSE"), unresolved("FREE_STATUS")], {
      verificationStatus: "UNVERIFIED",
      license: "MIT",
      openSource: true,
    });
    assert.deepEqual(problemsOf(listing), []);
    assert.equal(factEvidence(listing, "license", TODAY).state, "confirmed");
    assert.equal(factEvidence(listing, "freeStatus", TODAY).reason, "unresolved");
  });
});

describe("Impossible evidence states fail the build", () => {
  const cases: [string, Resource, string][] = [
    [
      "a confirmed free status of UNKNOWN",
      withPass([confirmed("FREE_STATUS")], { verificationStatus: "PARTIALLY_VERIFIED", freeStatus: "UNKNOWN" }),
      "FREE_STATUS as confirmed but its free status is UNKNOWN",
    ],
    [
      "a confirmed licence with no licence recorded",
      withPass([confirmed("LICENSE")], { license: undefined }),
      "LICENSE as confirmed but records no licence",
    ],
    [
      "confirmed platforms with none listed",
      withPass([confirmed("PLATFORM_AVAILABILITY")], { platforms: [] }),
      "PLATFORM_AVAILABILITY as confirmed but lists no platforms",
    ],
    [
      "OPEN_SOURCE classification with openSource false",
      makeResource({ freeStatus: "OPEN_SOURCE", openSource: false }),
      "classified OPEN_SOURCE but openSource is false",
    ],
    [
      "PERSONAL_FREE with commercial use allowed",
      makeResource({ freeStatus: "PERSONAL_FREE", commercialUse: "yes", limitations: ["Personal use only."] }),
      "PERSONAL_FREE, which means commercial use is restricted",
    ],
    [
      "a partially verified listing without a confirmed free status",
      withPass([confirmed("COMMERCIAL_USE")], { verificationStatus: "PARTIALLY_VERIFIED" }),
      "PARTIALLY_VERIFIED but its FREE_STATUS check is not confirmed",
    ],
    [
      "a verification date on a listing with no checks",
      makeResource({ lastVerifiedAt: "2026-09-25" }),
      "has lastVerifiedAt but no recorded verificationChecks",
    ],
    [
      "a tag restating a fact without its evidence",
      makeResource({ tags: ["voice", "no-signup"] }),
      'has the tag "no-signup", which restates the requiresAccount fact',
    ],
    [
      "VERIFIED by someone not in the maintainer register",
      withPass(allRequiredConfirmed(), { verificationStatus: "VERIFIED" }, { verifiedBy: "@someone-else" }),
      "not in the maintainer register",
    ],
  ];

  for (const [name, resource, message] of cases) {
    test(name, () => {
      const problems = problemsOf(resource);
      assert.ok(problems.some((p) => p.includes(message)), `expected "${message}" in:\n${problems.join("\n")}`);
    });
  }
});
