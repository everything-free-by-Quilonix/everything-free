/**
 * Content Security Policy for the static export.
 *
 * The production host (GitHub Pages) cannot send response headers, so the policy is
 * delivered as a `<meta http-equiv="Content-Security-Policy">` tag written into each
 * exported HTML file after the build.
 *
 * Scripts — strict, no 'unsafe-inline'
 *   Every inline script in the export is static text: the theme bootstrap and the
 *   framework's `self.__next_f.push(...)` payload chunks. Static text can be hashed,
 *   so each page's meta tag lists the SHA-256 of exactly the inline scripts that page
 *   contains. An injected script — which would not match a hash — does not run.
 *   Nonces are not an option: they need a server generating a fresh value per
 *   response, and there is no server.
 *
 * Styles — 'unsafe-inline' for attributes only
 *   React renders `style={{…}}` as `style="…"` attributes (866 of them at the time of
 *   writing — monogram sizing, the contrast checker's live preview). CSP hashes cannot
 *   cover attributes. `style-src-attr 'unsafe-inline'` allows them while
 *   `style-src-elem 'self'` still blocks injected `<style>` elements. Style injection
 *   is a far weaker attack than script injection; this is the documented residual gap.
 *
 * What a meta tag cannot do
 *   `frame-ancestors`, `report-uri`/`report-to` and `sandbox` are ignored in meta
 *   policies, so they are omitted rather than included and silently dropped. Framing
 *   protection therefore depends on the host; see docs/deployment.md.
 *
 * Safety net
 *   Hashes only work for inline *elements*. An inline event handler (`onclick="…"`) or
 *   a `javascript:` URL can never be allowed without 'unsafe-inline', and would be
 *   silently blocked. The export currently contains none; `applyCsp` fails the build if
 *   that ever changes, instead of shipping a page with dead interactivity.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const DATA_BLOCK = /type=["']?application\/(ld\+)?json/i;

/** Builds the policy string for one page, given its inline script hashes. */
export function buildPolicy(scriptHashes) {
  const scriptSources = ["'self'", ...scriptHashes.map((hash) => `'sha256-${hash}'`)];

  return [
    "default-src 'self'",
    `script-src ${scriptSources.join(" ")}`,
    // Fallback for browsers without CSP Level 3 -elem/-attr support.
    "style-src 'self' 'unsafe-inline'",
    "style-src-elem 'self'",
    "style-src-attr 'unsafe-inline'",
    // blob: is the image converter's locally generated result; data: covers inline
    // SVG data URIs.
    "img-src 'self' data: blob:",
    "font-src 'self'",
    // Client-side navigation fetches the pre-rendered RSC payload files from the
    // same origin. Nothing else is ever fetched.
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function sha256Base64(text) {
  return createHash("sha256").update(text, "utf8").digest("base64");
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

/**
 * Injects a per-page CSP meta tag into every HTML file under `outDir`.
 * Returns summary statistics; throws if a page contains something a hash-based
 * policy cannot allow.
 */
export async function applyCsp(outDir) {
  let pages = 0;
  let hashed = 0;
  const problems = [];

  for await (const file of htmlFiles(outDir)) {
    let html = await readFile(file, "utf8");

    if (html.includes('http-equiv="Content-Security-Policy"')) {
      problems.push(`${file}: already has a CSP meta tag`);
      continue;
    }

    // Handlers and javascript: URLs cannot be hashed. Match only real attributes
    // inside tags, not text that happens to contain "onclick=".
    const withoutScripts = html.replace(INLINE_SCRIPT, "");
    if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(withoutScripts)) {
      problems.push(`${file}: contains an inline event handler, which a hash-based CSP would block`);
    }
    if (/\shref=["']?\s*javascript:/i.test(withoutScripts)) {
      problems.push(`${file}: contains a javascript: URL, which a hash-based CSP would block`);
    }

    const hashes = new Set();
    for (const match of html.matchAll(INLINE_SCRIPT)) {
      const [, attributes, content] = match;
      if (DATA_BLOCK.test(attributes)) continue;
      hashes.add(sha256Base64(content));
    }

    const meta = `<meta http-equiv="Content-Security-Policy" content="${buildPolicy([...hashes])}"/>`;

    // A meta policy only governs content parsed after it, so it must come before
    // any script. `<meta charset>` is first in Next's head; insert straight after it.
    const charset = /<meta charSet="utf-8"\s*\/?>/i;
    if (charset.test(html)) {
      html = html.replace(charset, (tag) => `${tag}${meta}`);
    } else if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (tag) => `${tag}${meta}`);
    } else {
      problems.push(`${file}: has no <head> to place the policy in`);
      continue;
    }

    await writeFile(file, html, "utf8");
    pages += 1;
    hashed += hashes.size;
  }

  if (problems.length > 0) {
    throw new Error(`Could not apply a strict CSP:\n  - ${problems.join("\n  - ")}`);
  }

  return { pages, hashed };
}
