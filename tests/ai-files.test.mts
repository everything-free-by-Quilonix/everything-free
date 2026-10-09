/**
 * The private AI chat's model files and reply rendering: saving a model to one
 * file and loading it back, refusal of altered or foreign files, the generated
 * manifest, and the Markdown parser.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { beforeEach, describe, test } from "node:test";
import { getTool } from "@/config/tools";
import { parseInline, parseMarkdown, safeHref } from "@/features/ai/logic/markdown";
import {
  exportModel,
  importModel,
  ModelFileError,
  modelFileName,
  requiredFiles,
  type ManifestLookup,
} from "@/features/ai/logic/model-file";
import { modelManifest, type ManifestFile } from "@/features/ai/model-manifest";
import { chatModels } from "@/features/ai/models";

/* ------------------------------------------------------------- fake caches */

class MemoryCache {
  entries = new Map<string, Response>();
  async keys() {
    return [...this.entries.keys()].map((url) => new Request(url));
  }
  async match(request: Request | string) {
    const url = typeof request === "string" ? request : request.url;
    return this.entries.get(url)?.clone();
  }
  async put(request: Request, response: Response) {
    this.entries.set(request.url, new Response(await response.arrayBuffer(), { headers: response.headers }));
  }
}

const stores = new Map<string, MemoryCache>();
(globalThis as unknown as { caches: unknown }).caches = {
  open: async (name: string) => {
    if (!stores.has(name)) stores.set(name, new MemoryCache());
    return stores.get(name)!;
  },
};

/* ------------------------------------------------------------- a tiny model */

const MODEL = chatModels[0].id;
const BASE = "https://huggingface.co/mlc-ai/test/resolve/main/";
const parts: Record<string, string> = {
  [`${BASE}mlc-chat-config.json`]: '{"conv":"x"}',
  [`${BASE}tokenizer.json`]: '{"vocab":[]}',
  [`${BASE}tensor-cache.json`]: '{"records":[]}',
  [`${BASE}params_shard_0.bin`]: "weights-0".repeat(50),
  [`${BASE}params_shard_1.bin`]: "weights-1".repeat(80),
  "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/test.wasm": "\0asm-code",
};
const cacheOf = (url: string) =>
  url.endsWith(".wasm") ? "webllm/wasm" : url.endsWith("mlc-chat-config.json") ? "webllm/config" : "webllm/model";
const fakeManifest: ManifestFile[] = Object.entries(parts).map(([url, body]) => ({
  url,
  size: Buffer.byteLength(body),
  sha256: createHash("sha256").update(body).digest("hex"),
}));
const lookup: ManifestLookup = (id) => (id === MODEL ? fakeManifest : []);

async function seedCaches() {
  stores.clear();
  for (const [url, body] of Object.entries(parts)) {
    const cache = await caches.open(cacheOf(url));
    await cache.put(new Request(url), new Response(body, { headers: { "content-type": "application/octet-stream" } }));
  }
}

async function bytesOf(blob: Blob) {
  return new Uint8Array(await blob.arrayBuffer());
}

describe("model files", () => {
  beforeEach(seedCaches);

  test("save then load puts back exactly the same files", async () => {
    const file = await exportModel(MODEL, lookup);
    stores.clear();
    const progress: number[] = [];
    const id = await importModel(file, (p) => progress.push(p), lookup);
    assert.equal(id, MODEL);
    assert.equal(progress.at(-1), 1);
    for (const [url, body] of Object.entries(parts)) {
      const response = await (await caches.open(cacheOf(url))).match(new Request(url));
      assert.ok(response, url);
      assert.equal(await response.text(), body, url);
    }
  });

  test("refuses a file with an altered part, and writes nothing", async () => {
    const bytes = await bytesOf(await exportModel(MODEL, lookup));
    const wasmAt = Buffer.from(bytes).indexOf("\0asm-code");
    bytes[wasmAt + 1] ^= 0xff; // change one byte of the code
    stores.clear();
    await assert.rejects(importModel(new Blob([bytes]), () => {}, lookup), /does not match the official model/);
    assert.equal(stores.size, 0);
  });

  test("refuses a file that adds something outside the official model", async () => {
    const extra = "https://evil.example/payload.wasm";
    const cache = await caches.open("webllm/wasm");
    await cache.put(new Request(extra), new Response("bad"));
    const header = {
      format: 1,
      modelId: MODEL,
      createdAt: "",
      entries: [{ cache: "webllm/wasm", url: extra, size: 3, contentType: "x" }],
    };
    const json = new TextEncoder().encode(JSON.stringify(header));
    const prefix = new Uint8Array(12);
    prefix.set(new TextEncoder().encode("EFMODEL1"));
    new DataView(prefix.buffer).setUint32(8, json.length);
    await assert.rejects(
      importModel(new Blob([prefix, json, "bad"]), () => {}, lookup),
      /not part of the official model/,
    );
  });

  test("refuses truncated files, other files and unknown models", async () => {
    const whole = await exportModel(MODEL, lookup);
    await assert.rejects(importModel(whole.slice(0, whole.size - 5), () => {}, lookup), ModelFileError);
    await assert.rejects(importModel(new Blob(["just a photo"]), () => {}, lookup), /not a model file/);
    await assert.rejects(importModel(whole, () => {}, () => []), /does not offer/);
  });

  test("will not save a model with parts missing", async () => {
    stores.get("webllm/wasm")!.entries.clear();
    await assert.rejects(exportModel(MODEL, lookup), /missing/);
  });

  test("names files after the model", () => {
    assert.equal(modelFileName("Qwen2.5-0.5B-Instruct-q4f16_1-MLC"), "qwen2.5-0.5b.efmodel");
  });
});

describe("generated model manifest", () => {
  test("lists every chat model, with the files it needs, from the declared origins only", () => {
    const tool = getTool("private-ai-chat")!;
    const origins = tool.processing.downloads!.flatMap((d) => d.origins);
    const allowed = (url: string) =>
      origins.some((o) => {
        const host = new URL(url).host;
        const pattern = o.replace("https://", "");
        return pattern.startsWith("*.") ? host.endsWith(pattern.slice(1)) : host === pattern;
      });
    for (const model of chatModels) {
      const files = modelManifest[model.id];
      assert.ok(files?.length, `${model.id} missing from manifest; run npm run ai:manifest`);
      for (const file of files) {
        assert.match(file.sha256, /^[0-9a-f]{64}$/, file.url);
        assert.ok(file.size > 0, file.url);
        assert.ok(allowed(file.url), file.url);
      }
      const required = requiredFiles(model.id);
      assert.ok(required.some((u) => u.endsWith(".wasm")), `${model.id}: no wasm`);
      assert.ok(required.some((u) => u.endsWith("mlc-chat-config.json")), `${model.id}: no config`);
      assert.ok(required.some((u) => /params_shard_0\.bin$/.test(u)), `${model.id}: no weights`);
      // The size the page shows is the size of the files.
      const mb = files.reduce((sum, f) => sum + f.size, 0) / 1e6;
      assert.ok(Math.abs(mb - model.downloadMB) < 2, `${model.id}: page says ${model.downloadMB} MB, files are ${mb}`);
    }
  });
});

describe("reply markdown", () => {
  test("parses the blocks models use", () => {
    const blocks = parseMarkdown(
      "# Title\n\nSome **bold** and `code`.\n\n- one\n- two\n\n1. first\n2. second\n\n```js\nconst a = 1;\n```\n\n> quoted\n\n---",
    );
    assert.deepEqual(
      blocks.map((b) => b.type),
      ["heading", "paragraph", "list", "list", "code", "quote", "rule"],
    );
    const code = blocks[4];
    assert.ok(code.type === "code" && code.language === "js" && code.text === "const a = 1;" && !code.open);
  });

  test("an unclosed fence while streaming is still code", () => {
    const [block] = parseMarkdown("```python\nprint('hi')");
    assert.ok(block.type === "code" && block.open && block.text === "print('hi')");
  });

  test("inline formatting nests, and snake_case is not italic", () => {
    assert.deepEqual(parseInline("**a *b***"), [
      { type: "strong", children: [{ type: "text", text: "a " }, { type: "em", children: [{ type: "text", text: "b" }] }] },
    ]);
    assert.deepEqual(parseInline("use my_var_name"), [{ type: "text", text: "use my_var_name" }]);
  });

  test("only web links are clickable; anything else becomes text", () => {
    assert.equal(safeHref("https://example.com/a"), "https://example.com/a");
    assert.equal(safeHref("javascript:alert(1)"), null);
    assert.equal(safeHref("data:text/html,x"), null);
    assert.deepEqual(parseInline("[click](javascript:alert(1))"), [{ type: "text", text: "click" }]);
    const [link] = parseInline("[site](https://example.com)");
    assert.equal(link.type, "link");
  });

  test("raw HTML from a model stays text", () => {
    assert.deepEqual(parseInline("<img src=x onerror=alert(1)>"), [{ type: "text", text: "<img src=x onerror=alert(1)>" }]);
  });
});
