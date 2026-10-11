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
    url: "https://quilonix.in",
    website: "https://quilonix.in",
    tagline: "Intelligent Software, Cloud & AI Systems",
    email: "quilonix.ai@gmail.com",
  },
  social: {
    website: "https://quilonix.in",
    github: "https://github.com/Quilonix",
    linkedin: "https://www.linkedin.com/company/quilonix",
    youtube: "https://youtube.com/@quilonix",
    instagram: "https://www.instagram.com/quilonix.ai",
    huggingface: "https://huggingface.co/Quilonix",
    playStore: "https://play.google.com/store/apps/dev?id=8262374975871504599",
    email: "mailto:quilonix.ai@gmail.com",
  },
  tagline: "Discover. Compare. Use. Learn. — 100% Free Software & AI Tools Ecosystem",
  shortDescription: "The Free Software, AI Tools & Resources Ecosystem",
  description:
    "Everything.Free by Quilonix is the ultimate curated directory of genuinely free software, free AI tools, free open source applications, developer utilities, and student packs — verified with clear limitations, zero hidden paywalls, and no subscriptions.",
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
