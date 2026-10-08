import type { MetadataRoute } from "next";

import { audiences } from "@/config/audiences";
import { categories } from "@/config/categories";
import { tools } from "@/config/tools";
import { collections } from "@/data/collections";
import { aiImageCommands } from "@/data/ai-image-commands";
import { getActivePrompts } from "@/data/ai-prompts/normalized-prompts";
import { getAlternativeTargets, listResourceIndexEntries } from "@/lib/repository";
import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * Sitemap.
 *
 * Only canonical, indexable URLs are included — no query-string variants of
 * `/resources`, and no planned tools, which have nothing to offer a visitor yet.
 *
 * URLs go through `absoluteUrl`, the same helper that builds canonicals, so a
 * sitemap entry and the page's own canonical are always the identical string,
 * trailing slash and base path included.
 *
 * Priorities are relative hints, not instructions. Resource detail pages are the
 * primary content, so they sit above navigational index pages.
 *
 * Generated once at build time; `dynamic` is required explicitly under
 * `output: export`.
 */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [resources, alternativeTargets] = await Promise.all([listResourceIndexEntries(), getAlternativeTargets()]);

  const now = new Date();
  const url = absoluteUrl;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: url("/resources"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/ai-prompts"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/ai-image-commands"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/categories"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/collections"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/tools"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/alternatives"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/free-status"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/verification"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/submit"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,

    // Resource pages use their own updatedAt so crawlers can prioritise entries
    // that have actually changed.
    ...resources.map((entry) => ({
      url: url(`/resources/${entry.slug}`),
      lastModified: new Date(`${entry.updatedAt}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),

    ...categories.map((category) => ({
      url: url(`/categories/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...collections.map((collection) => ({
      url: url(`/collections/${collection.slug}`),
      lastModified: new Date(`${collection.updatedAt}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    // Planned tools are noIndex, so they are excluded here too.
    ...tools
      .filter((tool) => tool.status === "available")
      .map((tool) => ({
        url: url(`/tools/${tool.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),

    ...alternativeTargets.map((target) => ({
      url: url(`/alternatives/${target.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...audiences.map((audience) => ({
      url: url(`/for/${audience.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),

    ...aiImageCommands.map((cmd) => ({
      url: url(`/ai-image-commands/${cmd.id}`),
      lastModified: new Date(`${cmd.verification.lastChecked}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...getActivePrompts().map((p) => ({
      url: url(`/ai-prompts/${p.id}`),
      lastModified: new Date(`${p.provenance.lastVerified}T00:00:00Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
