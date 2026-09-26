/**
 * Single source of truth for brand strings, canonical URL and social handles.
 *
 * Every page title, OpenGraph tag, sitemap entry and footer link reads from
 * here, so the product can be rebranded or moved to another domain without
 * touching component code.
 */

import { siteUrl } from "./deployment";

/**
 * Public URL of the site. Defined in `config/deployment.ts`, which is also where the
 * base path comes from, so the canonical URL and the path the build is served
 * under cannot disagree.
 */
export { siteUrl };

export const site = {
  name: "Everything.Free",
  /** Used where the parent brand should be visible but secondary. */
  legalName: "Everything.Free by Quilonix",
  parent: {
    name: "Quilonix",
    url: "https://github.com/everything-free-by-Quilonix",
  },
  tagline: "Discover. Compare. Use. Learn. — Free.",
  shortDescription: "The free-resource ecosystem.",
  description:
    "A trustworthy way to discover free apps, software, tools, learning resources and creative assets — each with its free status, its limitations and exactly how much of it has been checked.",
  url: siteUrl,
  locale: "en",
  githubUrl: "https://github.com/everything-free-by-Quilonix",
  repositoryUrl: "https://github.com/everything-free-by-Quilonix/everything-free",
  /** Where corrections and takedown requests should go. */
  contactUrl: "https://github.com/everything-free-by-Quilonix/everything-free/issues",
  securityUrl: "https://github.com/everything-free-by-Quilonix/everything-free/security/advisories/new",
} as const;

/** Rotating placeholders for the homepage search field. Real, useful queries. */
export const searchExamples = [
  "free video editor",
  "free AI image generator",
  "free courses",
  "free PDF tools",
  "free music",
  "free coding tools",
  "free design software",
  "free apps for students",
] as const;

/**
 * Natural-language examples shown as search suggestions. These demonstrate the
 * intent the search engine is being built toward and double as working queries
 * today, because the keyword engine still extracts meaningful terms from them.
 */
export const intentExamples = [
  "I need to edit a video for Instagram for free",
  "free alternative to Photoshop",
  "free AI voice generator without a credit card",
  "free tools I can use for commercial work",
] as const;
