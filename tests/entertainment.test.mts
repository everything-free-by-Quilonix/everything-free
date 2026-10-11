/**
 * The entertainment layer: data rules, action wording, discovery labels and
 * filters. Each test states one situation and the claim the site may make about it.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { seedResources } from "@/data/resources";
import { findDataProblems } from "@/data/resources/validate";
import { findMediaProblems } from "@/data/resources/validate-media";
import { primaryMediaAction } from "@/lib/entertainment/actions";
import { discoveryLabels, isOfferExpired } from "@/lib/entertainment/labels";
import { matchesMediaQuery, parseMediaQuery, runMediaQuery, serializeMediaQuery, emptyMediaQuery } from "@/lib/entertainment/query";
import { parseSignals, type EntertainmentSignals } from "@/lib/entertainment/signals-schema";
import type { MediaProfile } from "@/types/media";
import type { Resource } from "@/types/resource";

import { confirmed, makeResource, PASS_DATE, SOURCE } from "./fixtures.mjs";

const NOW = new Date("2026-10-11T12:00:00Z");

function media(overrides: Partial<MediaProfile> = {}): MediaProfile {
  return {
    formats: ["film"],
    access: ["free_streaming"],
    offering: "full-content",
    contentScope: "complete-works",
    provider: "Example Films",
    containsAds: "no",
    hasPaidFeatures: "no",
    genres: ["drama"],
    contentLanguages: ["en"],
    region: { india: "unknown", availableIn: [] },
    ...overrides,
  };
}

function entry(m: Partial<MediaProfile> = {}, extra: Parameters<typeof makeResource>[0] = {}): Resource {
  return makeResource({
    category: "movies",
    shortDescription: "Example entertainment listing used in tests.",
    media: media(m),
    ...extra,
  });
}

const withSource = {
  verificationStatus: "PARTIALLY_VERIFIED" as const,
  lastVerifiedAt: PASS_DATE,
  verifiedBy: "test pass",
  verificationNotes: "Test pass notes.",
  verificationSources: [{ url: SOURCE, label: "Provider page", retrievedAt: PASS_DATE }],
  verificationChecks: [confirmed("FREE_STATUS")],
};

const problems = (r: Resource) => findMediaProblems(r);
const has = (r: Resource, fragment: string) => problems(r).some((p) => p.includes(fragment));

describe("media data rules", () => {
  test("a well-formed profile passes", () => {
    assert.deepEqual(problems(entry()), []);
  });

  test("a discovery service cannot claim to provide the content", () => {
    const r = entry({ offering: "discovery", access: ["free_discovery", "free_streaming"], contentScope: "information-only" });
    assert.ok(has(r, "cannot claim \"free_streaming\""));
  });

  test("a discovery service may not read as 'watch free'", () => {
    const r = entry(
      { offering: "discovery", access: ["free_discovery"], contentScope: "information-only" },
      { shortDescription: "Watch movies for free on any device you like." },
    );
    assert.ok(has(r, "reads as \"watch/play/listen free\""));
  });

  test("a trailer-only listing cannot claim free streaming", () => {
    assert.ok(has(entry({ contentScope: "previews-only" }), "cannot claim \"free_streaming\""));
  });

  test("ads must be declared and documented", () => {
    assert.ok(has(entry({ access: ["free_with_ads"], containsAds: "no" }), "containsAds"));
    assert.ok(has(entry({ access: ["free_with_ads"], containsAds: "yes" }), "must be stated among the limitations"));
  });

  test("a temporary offer needs a description and an end date or a recurring schedule", () => {
    assert.ok(has(entry({ access: ["temporary_free"] }), "without describing the offer"));
    const oneOff = entry(
      { access: ["temporary_free"], offer: { description: "Free this week", recurring: false, afterwards: "You keep the game.", sourceUrl: SOURCE } },
      withSource,
    );
    assert.ok(has(oneOff, "needs an endsAt date"));
  });

  test("region claims need a dated source", () => {
    assert.ok(has(entry({ region: { india: "available", availableIn: ["IN"] } }), "region availability is claimed without a sourceUrl"));
    const sourced = entry({ region: { india: "available", availableIn: ["IN"], sourceUrl: SOURCE } }, withSource);
    assert.deepEqual(problems(sourced), []);
    const foreign = entry({ region: { india: "available", availableIn: [], sourceUrl: "https://elsewhere.example" } }, withSource);
    assert.ok(has(foreign, "not one of the listing's verificationSources"));
  });

  test("creator reuse can only be promised by a public-domain or open licence", () => {
    const r = entry(
      { contentLicense: { kind: "per-item", summary: "Each track has its own licence.", creatorUse: "allowed", sourceUrl: SOURCE } },
      withSource,
    );
    assert.ok(has(r, "creator reuse is claimed"));
  });

  test("public_domain access needs a public-domain content licence", () => {
    assert.ok(has(entry({ access: ["public_domain"] }), "without a public-domain"));
  });

  test("playInBrowser needs a browser game", () => {
    assert.ok(has(entry({ playInBrowser: true }), "only for games"));
  });

  test("assurances instead of facts are rejected", () => {
    assert.ok(has(entry({}, { shortDescription: "100% free and 100% legal films for everyone." }), "assurance"));
  });

  test("a demo cannot be classified FREE", () => {
    const r = entry({ formats: ["pc-game"], access: ["free_demo"], hasPaidFeatures: "yes" }, { category: "games", limitations: ["Demo only."] });
    assert.ok(has(r, "LIMITED_FREE or TRIAL"));
  });

  test("library access cannot be account-free", () => {
    assert.ok(has(entry({ access: ["library_access"] }, { requiresAccount: "no" }), "library membership"));
  });

  test("duplicate official URLs are caught across listings", () => {
    const a = entry({}, { slug: "a", officialUrl: "https://www.example.org/films/" });
    const b = entry({}, { slug: "b", officialUrl: "https://example.org/films" });
    assert.ok(findDataProblems([a, b]).some((p) => p.includes("share the official URL")));
  });
});

describe("action wording follows the evidence", () => {
  test("content gets 'Watch free'; a guide never does", () => {
    assert.equal(primaryMediaAction(entry()).label, "Watch free");
    const guide = entry({ offering: "discovery", access: ["free_discovery"], contentScope: "information-only" });
    assert.equal(primaryMediaAction(guide).label, "Find where to watch");
  });

  test("a trailer page is only 'Visit official site'", () => {
    assert.equal(primaryMediaAction(entry({ contentScope: "previews-only", access: ["free_full_access"] })).kind, "visit-site");
  });

  test("'Play in browser' only with a playable destination; otherwise 'Visit game page'", () => {
    const playable = entry({ formats: ["browser-game"], playInBrowser: true }, { category: "games" });
    const page = entry({ formats: ["browser-game"] }, { category: "games" });
    assert.equal(primaryMediaAction(playable).label, "Play in browser");
    assert.equal(primaryMediaAction(page).label, "Visit game page");
  });

  test("unknown access never gets a content verb", () => {
    assert.equal(primaryMediaAction(entry({ access: ["unknown"] })).label, "Visit official site");
  });

  test("radio is 'Listen live', library film is 'Watch with a library card'", () => {
    assert.equal(primaryMediaAction(entry({ formats: ["radio"] }, { category: "radio" })).label, "Listen live");
    assert.equal(primaryMediaAction(entry({ access: ["library_access", "free_streaming"] }, { requiresAccount: "yes" })).kind, "watch-library");
  });
});

describe("discovery labels", () => {
  const signals: EntertainmentSignals = {
    version: 1,
    generatedAt: "2026-10-10T00:00:00Z",
    notes: "test",
    github: [
      {
        repo: "example/game",
        source: "github-rest-api",
        observedAt: "2026-10-10",
        stars: 5000,
        pushedAt: "2026-10-01T00:00:00Z",
        archived: false,
        evidenceUrl: "https://github.com/example/game",
      },
    ],
  };
  const game = entry(
    { formats: ["open-source-game"], githubRepo: "example/game" },
    { category: "games", sourceUrl: "https://github.com/example/game", submittedAt: "2025-01-01", updatedAt: "2025-01-01" },
  );
  const ids = (r: Resource, s: EntertainmentSignals | null = signals, now = NOW) => discoveryLabels(r, s, now).map((l) => l.id);

  test("GitHub signals yield 'recently updated' and 'community favourite' with their date", () => {
    assert.deepEqual(ids(game).sort(), ["community-favourite", "recently-updated"]);
    const detail = discoveryLabels(game, signals, NOW).find((l) => l.id === "community-favourite")?.detail;
    assert.match(detail ?? "", /5,000 GitHub stars on 2026-10-10/);
  });

  test("stale signals yield no label", () => {
    assert.deepEqual(ids(game, signals, new Date("2026-12-31T00:00:00Z")), []);
  });

  test("no signal file, no signal labels", () => {
    assert.deepEqual(ids(game, null), []);
  });

  test("an invalid signal file is rejected whole", () => {
    assert.equal(parseSignals({ version: 1, github: [{ repo: "x" }] }), null);
  });

  test("'Free this week' needs a one-off offer ending within 7 days", () => {
    const offer = (endsAt: string) =>
      entry(
        { formats: ["pc-game"], access: ["temporary_free"], offer: { description: "Free", endsAt, recurring: false, afterwards: "Keep it forever.", sourceUrl: SOURCE } },
        { category: "games" },
      );
    assert.ok(ids(offer("2026-10-14")).includes("free-this-week"));
    assert.ok(!ids(offer("2026-11-30")).includes("free-this-week"));
    assert.ok(isOfferExpired(offer("2026-10-01"), NOW));
  });

  test("there is no trending or popularity label at all", () => {
    for (const resource of seedResources) {
      for (const label of discoveryLabels(resource, signals, NOW)) {
        assert.doesNotMatch(label.label, /trending|popular|most/i);
      }
    }
  });
});

describe("filters and URL state", () => {
  test("round-trips through the query string", () => {
    const query = { ...emptyMediaQuery(), q: "chess", formats: ["browser-game" as const], india: true, sort: "name" as const };
    assert.deepEqual(parseMediaQuery(new URLSearchParams(serializeMediaQuery(query).slice(1))), query);
  });

  test("ignores unknown values", () => {
    const query = parseMediaQuery(new URLSearchParams("format=nope,film&access=bogus&sort=hot&platform=TOASTER"));
    assert.deepEqual(query.formats, ["film"]);
    assert.deepEqual(query.access, []);
    assert.deepEqual(query.platforms, []);
    assert.equal(query.sort, "relevance");
  });

  test("'Available in India' matches sourced India availability only", () => {
    const yes = entry({ region: { india: "available", availableIn: ["IN"], sourceUrl: SOURCE } }, withSource);
    const unknown = entry();
    const q = { ...emptyMediaQuery(), india: true };
    assert.equal(matchesMediaQuery(yes, q), true);
    assert.equal(matchesMediaQuery(unknown, q), false);
  });

  test("'No account' matches confirmed facts only", () => {
    const q = { ...emptyMediaQuery(), noAccount: true };
    assert.equal(matchesMediaQuery(entry({}, { requiresAccount: "no" }), q), false);
    const checked = entry({}, { ...withSource, requiresAccount: "no", verificationChecks: [confirmed("FREE_STATUS"), confirmed("ACCOUNT_REQUIREMENT")] });
    assert.equal(matchesMediaQuery(checked, q), true);
  });

  test("content comes before guides in the default order", () => {
    const guide = entry({ offering: "discovery", access: ["free_discovery"], contentScope: "information-only" }, { slug: "a-guide", name: "A guide" });
    const film = entry({}, { slug: "z-film", name: "Z film" });
    assert.deepEqual(runMediaQuery([guide, film], emptyMediaQuery()).items.map((r) => r.slug), ["z-film", "a-guide"]);
  });
});

describe("the entertainment catalogue as shipped", () => {
  const catalogue = seedResources.filter((r) => r.media);

  test("passes every rule", () => {
    assert.deepEqual(findDataProblems(seedResources), []);
  });

  test("nothing is VERIFIED, and every partially verified entry has dated sources", () => {
    for (const r of catalogue) {
      assert.notEqual(r.verificationStatus, "VERIFIED", r.slug);
      if (r.verificationStatus === "PARTIALLY_VERIFIED") assert.ok((r.verificationSources ?? []).length > 0, r.slug);
    }
  });

  test("no discovery listing gets a content verb", () => {
    for (const r of catalogue.filter((r) => r.media!.offering === "discovery")) {
      assert.equal(primaryMediaAction(r).kind, "discover", r.slug);
    }
  });

  test("every 'Play in browser' action points at a browser platform", () => {
    for (const r of catalogue) {
      if (primaryMediaAction(r).kind === "play-browser") assert.ok(r.platforms.includes("BROWSER"), r.slug);
    }
  });
});
