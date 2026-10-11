/**
 * No ads, ever: Everything.Free itself carries no advertising, analytics or
 * tracking, and the entertainment filters let visitors avoid ad-supported
 * services. These tests make both promises fail the build if they are broken.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

import { seedResources } from "@/data/resources";
import { adRank, emptyMediaQuery, matchesMediaQuery, parseMediaQuery, runMediaQuery, serializeMediaQuery } from "@/lib/entertainment/query";

/** Ad networks, ad tags and trackers that must never be loaded by the site. */
const AD_AND_TRACKER_SOURCES = [
  "googlesyndication.com",
  "doubleclick.net",
  "adservice.google",
  "googletagmanager.com",
  "google-analytics.com",
  "adsbygoogle",
  "amazon-adsystem.com",
  "taboola.com",
  "outbrain.com",
  "media.net",
  "propellerads",
  "adsterra",
  "popads.net",
  "connect.facebook.net",
  "hotjar.com",
  "clarity.ms",
];

/** Files that may mention these names because they *describe* other sites, not load them. */
const ALLOWED_DIRS = [join("src", "data")];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mjs|mts|css|html)$/.test(name) ? [path] : [];
  });
}

describe("the site carries no ads or trackers", () => {
  const files = [...sourceFiles("src"), ...sourceFiles("scripts"), "next.config.ts"].filter(
    (file) => !ALLOWED_DIRS.some((dir) => file.startsWith(dir)),
  );

  test("no source file loads an ad network or tracker", () => {
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const needle of AD_AND_TRACKER_SOURCES) if (text.includes(needle)) hits.push(`${file}: ${needle}`);
    }
    assert.deepEqual(hits, []);
  });

  test("no ad or analytics package is a dependency", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8")) as Record<string, Record<string, string> | undefined>;
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    const banned = deps.filter((name) => /analytics|adsense|gtag|tracking|mixpanel|segment|posthog|hotjar|ads?-/i.test(name));
    assert.deepEqual(banned, []);
  });
});

describe("the No ads filter", () => {
  const media = seedResources.filter((resource) => resource.media);

  test("matches only listings recorded as carrying no ads", () => {
    const query = { ...emptyMediaQuery(), noAds: true };
    const matched = media.filter((resource) => matchesMediaQuery(resource, query));
    assert.ok(matched.length > 0);
    for (const resource of matched) assert.equal(resource.media!.containsAds, "no", resource.slug);
  });

  test("an unknown ad status is never shown as ad-free", () => {
    const query = { ...emptyMediaQuery(), noAds: true };
    for (const resource of media.filter((r) => r.media!.containsAds === "unknown")) {
      assert.equal(matchesMediaQuery(resource, query), false, resource.slug);
    }
  });

  test("round-trips through the URL as noads=1", () => {
    const text = serializeMediaQuery({ ...emptyMediaQuery(), noAds: true });
    assert.equal(text, "?noads=1");
    assert.equal(parseMediaQuery(new URLSearchParams(text)).noAds, true);
  });

  test("the default order puts ad-free listings before ad-supported ones", () => {
    const { items } = runMediaQuery(media, emptyMediaQuery());
    const content = items.filter((resource) => resource.media!.offering !== "discovery");
    const firstWithAds = content.findIndex((resource) => adRank(resource) === 2);
    const lastAdFree = content.map(adRank).lastIndexOf(0);
    if (firstWithAds !== -1 && lastAdFree !== -1) assert.ok(lastAdFree < firstWithAds);
  });
});
