import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  aiImageCommands,
  getAIImageCommand,
  getAIImageCommandsByCategory,
  getCommandLibraryStats,
} from "@/data/ai-image-commands";
import { COMMAND_CATEGORIES } from "@/types/ai-image-command";

describe("ai-image-commands library", () => {
  test("contains at least 108 curated commands", () => {
    assert.ok(aiImageCommands.length >= 108, `Expected >= 108 commands, got ${aiImageCommands.length}`);
  });

  test("all command IDs and commands are unique and properly formatted", () => {
    const ids = new Set<string>();
    const commandStrings = new Set<string>();

    for (const cmd of aiImageCommands) {
      assert.ok(!ids.has(cmd.id), `Duplicate ID found: ${cmd.id}`);
      ids.add(cmd.id);

      assert.ok(!commandStrings.has(cmd.command), `Duplicate command string found: ${cmd.command}`);
      commandStrings.add(cmd.command);

      assert.equal(cmd.command, `/${cmd.id}`, `Command string should match /id: ${cmd.command} vs /${cmd.id}`);
      assert.match(cmd.id, /^[a-z0-9]+$/, `ID should be alphanumeric lowercase: ${cmd.id}`);
    }
  });

  test("all commands belong to recognized categories", () => {
    const validCategories = new Set(COMMAND_CATEGORIES);

    for (const cmd of aiImageCommands) {
      assert.ok(
        validCategories.has(cmd.category),
        `Command ${cmd.id} has invalid category: ${cmd.category}`,
      );
    }
  });

  test("no command falsely claims native slash command support for ChatGPT or Gemini", () => {
    for (const cmd of aiImageCommands) {
      assert.notEqual(
        cmd.platforms.chatgpt,
        "native",
        `Command ${cmd.id} falsely claims native support on ChatGPT`,
      );
      assert.notEqual(
        cmd.platforms.gemini,
        "native",
        `Command ${cmd.id} falsely claims native support on Gemini`,
      );
    }
  });

  test("verification details are present and well-formed", () => {
    const validStatuses = new Set(["verified", "partially_verified", "unverified", "unsupported"]);
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    for (const cmd of aiImageCommands) {
      assert.ok(
        validStatuses.has(cmd.verification.status),
        `Command ${cmd.id} has invalid verification status: ${cmd.verification.status}`,
      );
      assert.match(
        cmd.verification.lastChecked,
        isoDateRegex,
        `Command ${cmd.id} has invalid lastChecked date: ${cmd.verification.lastChecked}`,
      );
      assert.ok(
        cmd.verification.source.trim().length > 10,
        `Command ${cmd.id} missing meaningful verification source`,
      );
      assert.ok(
        cmd.syntax.trim().length > 10,
        `Command ${cmd.id} missing meaningful syntax modifier`,
      );
      assert.ok(
        cmd.examplePrompt.trim().length > 20,
        `Command ${cmd.id} missing realistic example prompt`,
      );
      assert.ok(
        cmd.bestFor.length > 0,
        `Command ${cmd.id} should have at least one bestFor entry`,
      );
    }
  });

  test("protected brand entries include trademark and policy disclaimers", () => {
    const trademarkCommands = ["pixar", "ghibli", "lego"];

    for (const id of trademarkCommands) {
      const cmd = getAIImageCommand(id);
      assert.ok(cmd, `Command ${id} should exist`);
      assert.ok(
        cmd.copyrightDisclaimer && cmd.copyrightDisclaimer.length > 20,
        `Command ${id} must carry an explicit trademark disclaimer`,
      );
      assert.equal(
        cmd.platforms.chatgpt,
        "style_reference",
        `Command ${id} should be classified as style_reference rather than direct command`,
      );
    }
  });

  test("helper functions return correct records", () => {
    const command = getAIImageCommand("35mm");
    assert.ok(command);
    assert.equal(command.name, "35mm Film Photography");

    const photoCommands = getAIImageCommandsByCategory("Photography");
    assert.ok(photoCommands.length > 10);
    assert.ok(photoCommands.every((c) => c.category === "Photography"));

    const stats = getCommandLibraryStats();
    assert.equal(stats.total, aiImageCommands.length);
    assert.ok(stats.verifiedCount > 80);
    assert.ok(stats.unsupportedCount >= 1);
  });

  test("all commands resolve a valid, high-resolution preview image", async () => {
    const { getCommandPreviewImage } = await import("@/data/ai-image-command-previews");

    for (const cmd of aiImageCommands) {
      const url = getCommandPreviewImage(cmd.id, cmd.category);
      assert.ok(url, `Command ${cmd.id} must resolve an image URL`);
      assert.ok(url.startsWith("https://"), `Command ${cmd.id} image must be HTTPS: ${url}`);
      assert.ok(url.includes("images.unsplash.com"), `Command ${cmd.id} image must use trusted CDN`);
    }
  });
});
