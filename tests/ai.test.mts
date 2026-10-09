/**
 * The AI section: the curated chat models, the chat helpers, the finder's honesty
 * rules against the real library, and the one CSP exception staying in step with
 * what the chat tool declares.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { prebuiltAppConfig } from "@mlc-ai/web-llm";
import { getTool } from "@/config/tools";
import { seedResources } from "@/data/resources";
import { fitHistory, splitThinking, transcript, type ChatTurn } from "@/features/ai/logic/chat";
import { AI_NEEDS, findAi, FINDER_CATEGORIES } from "@/features/ai/finder";
import { chatModels, defaultChatModel, formatMegabytes, MAX_DOWNLOAD_MB } from "@/features/ai/models";
import { categories } from "@/config/categories";
import { matchesFilters } from "@/lib/search/filters";
import { PAGE_CONNECT_SOURCES } from "../scripts/csp.mjs";

describe("chat models", () => {
  test("every model is a WebLLM prebuilt, under the size ceiling, Apache-2.0", () => {
    const prebuilt = new Map(prebuiltAppConfig.model_list.map((record) => [record.model_id, record]));
    assert.ok(chatModels.length >= 3);
    for (const model of chatModels) {
      const record = prebuilt.get(model.id);
      assert.ok(record, `${model.id} is not in WebLLM's prebuiltAppConfig`);
      assert.ok(model.downloadMB < MAX_DOWNLOAD_MB, `${model.id} is ${model.downloadMB} MB`);
      assert.equal(model.license, "Apache-2.0");
      // The GPU estimate shown to people is WebLLM's own, not one we invented.
      assert.ok(Math.abs((record.vram_required_MB ?? 0) - model.gpuMemoryMB) < 2, `${model.id} GPU memory`);
      // None may need an optional GPU feature, so every WebGPU device can try them.
      assert.equal(record.required_features, undefined, `${model.id} needs ${record.required_features}`);
      assert.ok(model.sourceUrl.startsWith("https://huggingface.co/"));
    }
    assert.equal(chatModels.filter((m) => m.isDefault).length, 1);
    assert.equal(new Set(chatModels.map((m) => m.id)).size, chatModels.length);
    assert.ok(chatModels.includes(defaultChatModel));
  });

  test("formats sizes", () => {
    assert.equal(formatMegabytes(295), "295 MB");
    assert.equal(formatMegabytes(1404), "1.4 GB");
  });
});

describe("chat helpers", () => {
  test("separates reasoning from the answer, including mid-stream", () => {
    assert.deepEqual(splitThinking("Hello"), { thinking: "", answer: "Hello", stillThinking: false });
    assert.deepEqual(splitThinking("<think>step 1</think>\n\nAnswer"), {
      thinking: "step 1",
      answer: "Answer",
      stillThinking: false,
    });
    assert.deepEqual(splitThinking("<think>step"), { thinking: "step", answer: "", stillThinking: true });
    assert.equal(splitThinking("<think></think>Hi").answer, "Hi");
  });

  test("keeps the newest turns that fit, always the last question, never starting with the AI", () => {
    const turns: ChatTurn[] = [
      { role: "user", content: "a".repeat(300) },
      { role: "assistant", content: "b".repeat(300) },
      { role: "user", content: "c".repeat(300) },
      { role: "assistant", content: "d".repeat(300) },
      { role: "user", content: "last" },
    ];
    const all = fitHistory(turns, 10_000);
    assert.equal(all.kept.length, 5);
    assert.equal(all.dropped, 0);

    const some = fitHistory(turns, 220); // ~660 characters
    assert.equal(some.kept.at(-1)?.content, "last");
    assert.equal(some.kept[0].role, "user");
    assert.ok(some.dropped > 0);

    const huge = fitHistory([{ role: "user", content: "x".repeat(100_000) }], 100);
    assert.equal(huge.kept.length, 1);
  });

  test("transcript drops reasoning", () => {
    assert.equal(
      transcript([
        { role: "user", content: "Hi" },
        { role: "assistant", content: "<think>hmm</think>Hello" },
      ]),
      "You: Hi\n\nAI: Hello",
    );
  });
});

describe("free AI finder", () => {
  const listable = seedResources.filter((r) => matchesFilters(r, {}));
  const known = new Set(categories.map((c) => c.id));

  test("every job maps to real categories and has at least one listing", () => {
    for (const need of AI_NEEDS) {
      for (const category of need.categories) assert.ok(known.has(category), `${need.id} → ${category}`);
      const { matches } = findAi(listable, { needId: need.id, runsOn: "any", promises: [] });
      assert.ok(matches.length > 0, `${need.id} has no listings`);
    }
    assert.equal(new Set(AI_NEEDS.map((n) => n.id)).size, AI_NEEDS.length);
    assert.ok(FINDER_CATEGORIES.length > 0);
  });

  test("promise filters match confirmed facts only and count what they hold back", () => {
    for (const need of AI_NEEDS) {
      const result = findAi(listable, { needId: need.id, runsOn: "any", promises: ["noCreditCardOnly"] });
      for (const resource of result.matches) {
        assert.ok(matchesFilters(resource, { noCreditCardOnly: true }), resource.slug);
      }
      const recorded = listable.filter(
        (r) => matchesFilters(r, { categories: need.categories, noCreditCardOnly: true }, { evidence: "recorded" }),
      ).length;
      assert.equal(result.matches.length + result.heldBack, recorded, need.id);
    }
  });

  test("'where' narrows by recorded platform", () => {
    const { matches } = findAi(listable, { needId: "own-device", runsOn: "computer", promises: [] });
    for (const r of matches) {
      assert.ok(r.platforms.some((p) => ["WINDOWS", "MACOS", "LINUX", "SELF_HOSTED"].includes(p)), r.slug);
    }
  });
});

describe("private AI chat is registered honestly", () => {
  test("runs locally, costs nothing, and declares every download", () => {
    const tool = getTool("private-ai-chat");
    assert.ok(tool);
    assert.equal(tool.integrationType, "BROWSER_LOCAL");
    assert.equal(tool.processing.leavesDevice, false);
    assert.equal(tool.infrastructureCost, "none");
    assert.ok(tool.attributions.some((a) => a.name.startsWith("WebLLM") && a.license === "Apache-2.0"));
    assert.ok((tool.processing.downloads ?? []).length > 0);
  });

  test("the chat page's CSP allows exactly the declared download origins, and no other page is widened", () => {
    const declared = (getTool("private-ai-chat")?.processing.downloads ?? []).flatMap((d) => d.origins).sort();
    assert.deepEqual(Object.keys(PAGE_CONNECT_SOURCES), ["tools/private-ai-chat/index.html"]);
    assert.deepEqual([...PAGE_CONNECT_SOURCES["tools/private-ai-chat/index.html"]].sort(), declared);
  });

  test("the declared origins cover where the models are actually served from", () => {
    const declared = getTool("private-ai-chat")?.processing.downloads?.flatMap((d) => d.origins) ?? [];
    const allows = (url: string) => {
      const host = new URL(url).host;
      return declared.some((origin) => {
        const pattern = origin.replace("https://", "");
        return pattern.startsWith("*.") ? host.endsWith(pattern.slice(1)) : host === pattern;
      });
    };
    const ours = prebuiltAppConfig.model_list.filter((r) => chatModels.some((m) => m.id === r.model_id));
    assert.equal(ours.length, chatModels.length);
    for (const record of ours) {
      assert.ok(allows(record.model), record.model);
      assert.ok(allows(record.model_lib), record.model_lib);
    }
    // Hugging Face redirects large files to its CDN.
    assert.ok(allows("https://us.aws.cdn.hf.co/xet-bridge-us/x"));
    assert.ok(allows("https://cas-bridge.xethub.hf.co/x"));
  });
});
