import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  getActivePrompts,
  getPromptById,
  getPromptStaticParams,
  getPromptsByCategory,
  getPromptsByPlatform,
  getPromptsBySource,
} from "@/data/ai-prompts/normalized-prompts";
import {
  PROMPT_SOURCES_REGISTRY,
  getActivePromptSources,
  getPromptSource,
} from "@/data/ai-prompts/sources-registry";
import { isPromptBlocked } from "@/data/ai-prompts/takedown-registry";
import { PROMPT_CATEGORIES, PROMPT_PLATFORMS } from "@/types/ai-prompt";

describe("Everything.Free — AI Prompts Aggregator", () => {
  test("sources registry includes all 4 evaluated sources with legal terms", () => {
    assert.equal(PROMPT_SOURCES_REGISTRY.length, 4);

    const diffdb = getPromptSource("diffusiondb");
    assert.ok(diffdb);
    assert.equal(diffdb.integrationMode, "full");
    assert.ok(diffdb.license.includes("CC0"));
    assert.equal(diffdb.redistributionAllowed, true);

    const wikiprompt = getPromptSource("wikiprompt");
    assert.ok(wikiprompt);
    assert.equal(wikiprompt.integrationMode, "full");
    assert.equal(wikiprompt.attributionRequired, true);

    const openImage = getPromptSource("open-image-prompts");
    assert.ok(openImage);
    assert.equal(openImage.integrationMode, "full");
    assert.equal(openImage.attributionRequired, true);

    const krea = getPromptSource("krea");
    assert.ok(krea);
    assert.equal(krea.integrationMode, "reference_only");
    assert.equal(krea.redistributionAllowed, false);
  });

  test("active sources list excludes reference-only and blocked datasets from full ingestion", () => {
    const active = getActivePromptSources();
    assert.ok(active.length >= 3);
    assert.ok(!active.some((s) => s.integrationMode === "blocked"));
  });

  test("all normalized prompts have complete provenance, valid attribution, and unique IDs", () => {
    const prompts = getActivePrompts();
    assert.ok(prompts.length > 0, "Aggregator should contain active normalized prompts");

    const ids = new Set<string>();
    const promptHashes = new Set<string>();

    for (const p of prompts) {
      assert.ok(!ids.has(p.id), `Duplicate prompt ID detected: ${p.id}`);
      ids.add(p.id);

      // Verify prompt text length
      assert.ok(p.prompt.trim().length >= 15, `Prompt ${p.id} text too short`);

      // Verify mandatory provenance
      assert.ok(p.provenance, `Prompt ${p.id} missing provenance`);
      assert.ok(p.provenance.sourceName, `Prompt ${p.id} missing provenance.sourceName`);
      assert.ok(p.provenance.sourceUrl.startsWith("http"), `Prompt ${p.id} missing provenance.sourceUrl`);
      assert.ok(p.provenance.importedAt, `Prompt ${p.id} missing importedAt timestamp`);

      // Verify safety status is safe for public index
      assert.equal(p.safetyStatus, "safe", `Prompt ${p.id} must have safe content rating`);

      // Verify no takedown collision
      assert.equal(isPromptBlocked(p.id, p.sourceUrl), false, `Blocked prompt leaked into active index: ${p.id}`);

      // Verify category belongs to recognized schema
      assert.ok(PROMPT_CATEGORIES.includes(p.category), `Invalid category on ${p.id}: ${p.category}`);

      // Verify platforms belong to recognized schema
      for (const plat of p.platform) {
        assert.ok(PROMPT_PLATFORMS.includes(plat), `Invalid platform ${plat} on ${p.id}`);
      }

      // Check deduplication
      const cleanPrompt = p.prompt.trim().toLowerCase().replace(/\s+/g, " ");
      assert.ok(!promptHashes.has(cleanPrompt), `Duplicate prompt content across records: ${p.id}`);
      promptHashes.add(cleanPrompt);
    }
  });

  test("takedown mechanism correctly identifies blocked records", () => {
    assert.equal(isPromptBlocked("some-clean-random-id-999"), false);
  });

  test("query helper functions return correct filtered records", () => {
    const sample = getActivePrompts()[0];
    assert.ok(sample);

    const byId = getPromptById(sample.id);
    assert.ok(byId);
    assert.equal(byId.id, sample.id);

    const bySource = getPromptsBySource("wikiprompt");
    assert.ok(bySource.length > 0);
    assert.ok(bySource.every((p) => p.sourceName.toLowerCase().includes("wikiprompt")));

    const byCategory = getPromptsByCategory(sample.category);
    assert.ok(byCategory.length > 0);
    assert.ok(byCategory.every((p) => p.category === sample.category));

    const byPlatform = getPromptsByPlatform("ChatGPT");
    assert.ok(byPlatform.length > 0);
  });

  test("getPromptStaticParams generates static routes for all active prompts", () => {
    const params = getPromptStaticParams();
    const active = getActivePrompts();
    assert.equal(params.length, active.length);
    assert.ok(params.every((p) => typeof p.id === "string" && p.id.length > 0));
  });
});
