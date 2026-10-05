import type { MetadataRoute } from "next";

import { siteUrl, withBasePath } from "@/config/deployment";

/**
 * Robots configuration.
 *
 * Crawling is allowed broadly — discoverability is the point of the project — with
 * these exclusions:
 *
 * - `/report` is contextual and varies by query string, with nothing to index.
 * - Query strings on `/resources`. Every variant is served the same static HTML,
 *   with its canonical pointing at the clean `/resources`, so crawling permutations
 *   only burns crawl budget that belongs on the resource pages meant to rank.
 * - `/link-manifest.json`, a maintenance artefact rather than content.
 *
 * Written once at build time. `dynamic` is required explicitly under
 * `output: export`, which otherwise treats a metadata route as dynamic and refuses
 * to emit it.
 */
export const dynamic = "force-static";

/**
 * AI search and assistant crawlers, welcomed by name.
 *
 * `*` already allows them; naming them makes the intent explicit to operators who
 * look for their own token, and documents the decision. Being readable by these is
 * how the library gets cited when someone asks an assistant for a free tool.
 * A crawler that matches a named group ignores `*`, so each group repeats the same
 * disallows.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini and Vertex AI grounding
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "meta-externalagent",
  "CCBot", // Common Crawl, which many models are trained on
];

export default function robots(): MetadataRoute.Robots {
  // robots.txt paths are relative to the host root, so they carry the base
  // path. Note that crawlers only read robots.txt at the host root: on a
  // GitHub Pages project site this file is served at /everything-free/robots.txt
  // and is advisory at best. The sitemap and per-page canonicals carry the
  // weight there. See docs/deployment.md.
  const disallow = [withBasePath("/report/"), withBasePath("/resources/?*"), withBasePath("/link-manifest.json")];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).origin,
  };
}
