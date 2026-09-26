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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // robots.txt paths are relative to the host root, so they carry the base
        // path. Note that crawlers only read robots.txt at the host root: on a
        // GitHub Pages project site this file is served at /everything-free/robots.txt
        // and is advisory at best. The sitemap and per-page canonicals carry the
        // weight there. See docs/deployment.md.
        disallow: [withBasePath("/report/"), withBasePath("/resources/?*"), withBasePath("/link-manifest.json")],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).origin,
  };
}
