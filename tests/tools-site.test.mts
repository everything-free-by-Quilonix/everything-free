import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  featuredToolsSiteTools,
  parseToolsSiteCatalog,
  TOOLS_SITE_ORIGIN,
  TOOLS_SITE_PATH,
  toolsSite,
  toolsSiteByCategory,
} from "@/config/tools-site";
import { toolsSiteCatalog } from "@/data/tools-site";

describe("Everything.Free Tools catalogue snapshot", () => {
  it("is valid and links only into the tools site", () => {
    assert.ok(toolsSite.tools.length > 0);
    for (const entry of [...toolsSite.tools, ...toolsSite.categories]) {
      assert.ok(entry.url.startsWith(`${TOOLS_SITE_ORIGIN}${TOOLS_SITE_PATH}`), entry.url);
    }
  });

  it("lists every tool exactly once across categories", () => {
    const listed = toolsSiteByCategory().flatMap((entry) => entry.tools.map((tool) => tool.slug));
    assert.equal(listed.length, toolsSite.tools.length);
    assert.equal(new Set(listed).size, listed.length);
  });

  it("features distinct tools that exist", () => {
    const featured = featuredToolsSiteTools(6);
    assert.equal(featured.length, Math.min(6, toolsSite.tools.length));
    assert.equal(new Set(featured).size, featured.length);
  });

  it("rejects a catalogue that points elsewhere, has an unknown version or a dangling category", () => {
    const base = structuredClone(toolsSiteCatalog) as { version: number; tools: { url: string; category: string }[] };
    const elsewhere = structuredClone(base);
    elsewhere.tools[0]!.url = "https://example.com/tools/json/";
    assert.throws(() => parseToolsSiteCatalog(elsewhere), /must point into the Everything.Free Tools site/);
    assert.throws(() => parseToolsSiteCatalog({ ...base, version: 2 }), /version/);
    const dangling = structuredClone(base);
    dangling.tools[0]!.category = "nope";
    assert.throws(() => parseToolsSiteCatalog(dangling), /unknown category "nope"/);
  });
});
