import { getChatModel } from "../models";
import { modelManifest, type ManifestFile } from "../model-manifest";

/**
 * A downloaded chat model as one file the visitor can keep.
 *
 * WebLLM stores a model as separate files in three of the browser's caches, each
 * keyed by the address it was downloaded from. This module packs those files into
 * one `.efmodel` file the visitor saves to their device (on a phone, the Downloads
 * folder), and unpacks one back into the caches, so the model can be set up again
 * without the internet: after clearing browser data, in another browser, or on a
 * friend's device.
 *
 * Layout:
 *
 *   8 bytes   "EFMODEL1"
 *   4 bytes   header length, big-endian
 *   n bytes   header, UTF-8 JSON (ModelFileHeader)
 *   ...       each entry's bytes, in header order
 *
 * Trust. An imported file has been outside this site, and part of it is
 * WebAssembly that runs in the visitor's browser and sees their messages. So a file
 * is accepted only if every entry is a file of that model listed in the generated
 * manifest, and its bytes match the manifest's SHA-256 recorded from the official
 * source. A file can therefore only ever put back exactly what Hugging Face and
 * GitHub serve. The header's own hashes are never trusted.
 */

export const MAGIC = "EFMODEL1";
export const FORMAT_VERSION = 1;
export const FILE_EXTENSION = ".efmodel";

/** The caches WebLLM 0.2.x reads, and the only ones an import may write to. */
export const WEBLLM_CACHES = ["webllm/model", "webllm/config", "webllm/wasm"] as const;
export type WebllmCache = (typeof WEBLLM_CACHES)[number];

export interface ModelFileEntry {
  cache: WebllmCache;
  url: string;
  size: number;
  contentType: string;
}

export interface ModelFileHeader {
  format: number;
  modelId: string;
  createdAt: string;
  entries: ModelFileEntry[];
}

export class ModelFileError extends Error {}

const MAX_HEADER_BYTES = 1_000_000;

/** Bytes before the header JSON. */
export const PREFIX_BYTES = MAGIC.length + 4;

/** Where the trusted file list comes from. Tests pass a small one. */
export type ManifestLookup = (modelId: string) => readonly ManifestFile[];

export function manifestFor(modelId: string): readonly ManifestFile[] {
  return modelManifest[modelId] ?? [];
}

export function encodePrefix(header: ModelFileHeader): Uint8Array {
  const json = new TextEncoder().encode(JSON.stringify(header));
  const out = new Uint8Array(PREFIX_BYTES + json.length);
  out.set(new TextEncoder().encode(MAGIC), 0);
  new DataView(out.buffer).setUint32(MAGIC.length, json.length);
  out.set(json, PREFIX_BYTES);
  return out;
}

/** Length of the header JSON, from the first 12 bytes. */
export function readHeaderLength(prefix: Uint8Array): number {
  if (prefix.length < PREFIX_BYTES || new TextDecoder().decode(prefix.subarray(0, MAGIC.length)) !== MAGIC) {
    throw new ModelFileError(
      `That is not a model file saved by this chat. Choose a file ending in ${FILE_EXTENSION} that you saved here.`,
    );
  }
  const length = new DataView(prefix.buffer, prefix.byteOffset, prefix.byteLength).getUint32(MAGIC.length);
  if (length === 0 || length > MAX_HEADER_BYTES) throw new ModelFileError("This model file is damaged.");
  return length;
}

/** The files a model cannot run without. */
export function requiredFiles(modelId: string, lookup: ManifestLookup = manifestFor): string[] {
  const urls = lookup(modelId).map((file) => file.url);
  const name = (url: string) => url.slice(url.lastIndexOf("/") + 1);
  return urls.filter((url) => {
    const file = name(url);
    return (
      file.endsWith(".wasm") ||
      file === "mlc-chat-config.json" ||
      file === "tokenizer.json" ||
      /^params_shard_\d+\.bin$/.test(file)
    );
  });
}

/**
 * Checks a parsed header against the manifest and the file's real size.
 * Returns the entries with the SHA-256 each must have.
 */
export function validateHeader(
  raw: unknown,
  fileSize: number,
  headerLength: number,
  lookup: ManifestLookup = manifestFor,
): { header: ModelFileHeader; expected: Map<string, string> } {
  const damaged = new ModelFileError("This model file is damaged or incomplete. Save it again from a browser that has the model.");
  if (!raw || typeof raw !== "object") throw damaged;
  const header = raw as ModelFileHeader;
  if (header.format !== FORMAT_VERSION) {
    throw new ModelFileError("This model file was saved by a different version of the chat and cannot be loaded here.");
  }
  const model = getChatModel(header.modelId);
  const manifest = lookup(header.modelId);
  if (!model || manifest.length === 0) {
    throw new ModelFileError("This file holds a model this chat does not offer, so it cannot be loaded.");
  }
  if (!Array.isArray(header.entries) || header.entries.length === 0) throw damaged;

  const byUrl = new Map(manifest.map((file) => [file.url, file]));
  const expected = new Map<string, string>();
  let total = 0;
  for (const entry of header.entries) {
    const known = byUrl.get(entry?.url);
    if (
      !known ||
      !WEBLLM_CACHES.includes(entry.cache) ||
      entry.size !== known.size ||
      typeof entry.contentType !== "string" ||
      expected.has(entry.url)
    ) {
      throw new ModelFileError(
        "This file contains something that is not part of the official model, so it was not loaded. Download the model from the official source instead.",
      );
    }
    expected.set(entry.url, known.sha256);
    total += entry.size;
  }

  const missing = requiredFiles(header.modelId, lookup).filter((url) => !expected.has(url));
  if (missing.length > 0) throw damaged;
  if (PREFIX_BYTES + headerLength + total !== fileSize) throw damaged;

  return { header, expected };
}

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** `qwen2.5-0.5b.efmodel` from a model's display name. */
export function modelFileName(modelId: string): string {
  const name = getChatModel(modelId)?.name ?? modelId;
  return `${name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "")}${FILE_EXTENSION}`;
}

/* -------------------------------------------------------------------------- */
/* Browser side: reading the caches and writing them back                     */
/* -------------------------------------------------------------------------- */

/**
 * Packs a saved model into one Blob. The parts are Blobs from the Cache API, which
 * the browser keeps on disk, so this does not load the model into memory.
 */
export async function exportModel(modelId: string, lookup: ManifestLookup = manifestFor): Promise<Blob> {
  const wanted = new Set(lookup(modelId).map((file) => file.url));
  const entries: ModelFileEntry[] = [];
  const parts: Blob[] = [];
  for (const name of WEBLLM_CACHES) {
    const cache = await caches.open(name);
    for (const request of await cache.keys()) {
      if (!wanted.has(request.url) || entries.some((e) => e.url === request.url)) continue;
      const response = await cache.match(request);
      if (!response) continue;
      const blob = await response.blob();
      entries.push({
        cache: name,
        url: request.url,
        size: blob.size,
        contentType: response.headers.get("content-type") ?? "application/octet-stream",
      });
      parts.push(blob);
    }
  }
  const have = new Set(entries.map((e) => e.url));
  if (requiredFiles(modelId, lookup).some((url) => !have.has(url))) {
    throw new ModelFileError("Part of this model is missing from the browser. Load it once, then save it to a file.");
  }
  const header: ModelFileHeader = { format: FORMAT_VERSION, modelId, createdAt: new Date().toISOString(), entries };
  return new Blob([encodePrefix(header) as BlobPart, ...parts], { type: "application/octet-stream" });
}

/**
 * Checks a model file and puts its parts back where WebLLM looks for them.
 * Nothing is written until every part has been checked, so a bad file leaves the
 * browser exactly as it was.
 */
export async function importModel(
  file: Blob,
  onProgress: (fraction: number) => void,
  lookup: ManifestLookup = manifestFor,
): Promise<string> {
  const headerLength = readHeaderLength(new Uint8Array(await file.slice(0, PREFIX_BYTES).arrayBuffer()));
  let raw: unknown;
  try {
    raw = JSON.parse(await file.slice(PREFIX_BYTES, PREFIX_BYTES + headerLength).text());
  } catch {
    throw new ModelFileError("This model file is damaged.");
  }
  const { header, expected } = validateHeader(raw, file.size, headerLength, lookup);

  const total = header.entries.reduce((sum, e) => sum + e.size, 0);
  let offset = PREFIX_BYTES + headerLength;
  let done = 0;
  const verified: { entry: ModelFileEntry; blob: Blob }[] = [];
  for (const entry of header.entries) {
    const blob = file.slice(offset, offset + entry.size);
    const hash = await sha256Hex(await blob.arrayBuffer());
    if (hash !== expected.get(entry.url)) {
      throw new ModelFileError(
        "Part of this file does not match the official model. It may be damaged or altered, so nothing was loaded.",
      );
    }
    verified.push({ entry, blob });
    offset += entry.size;
    done += entry.size;
    onProgress((done / total) * 0.9);
  }

  for (const [index, { entry, blob }] of verified.entries()) {
    const cache = await caches.open(entry.cache);
    await cache.put(
      new Request(entry.url),
      new Response(blob, { headers: { "content-type": entry.contentType, "content-length": String(entry.size) } }),
    );
    onProgress(0.9 + ((index + 1) / verified.length) * 0.1);
  }
  return header.modelId;
}
