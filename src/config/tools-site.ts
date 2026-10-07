import { z } from "zod";

import { toolsSiteCatalog } from "@/data/tools-site";

/**
 * Everything.Free Tools: the sister site of browser tools.
 *
 * Its catalogue is read from a committed snapshot (`data/tools-site.ts`, refreshed
 * with `npm run sync:tools`), never fetched at build or run time. It is validated
 * here, at import, so a malformed or unexpected snapshot fails the build instead of
 * rendering wrong links or a privacy label the tools site never made.
 *
 * These tools are run on the tools site. They are listed here as links, and are
 * not mixed into `config/tools.ts`, whose entries are tools that run on this site.
 */

export const TOOLS_SITE_ORIGIN = "https://everything-free-by-quilonix.github.io";
export const TOOLS_SITE_PATH = "/everything-free-tools/";

const toolsSiteUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith(`${TOOLS_SITE_ORIGIN}${TOOLS_SITE_PATH}`), {
    message: "must point into the Everything.Free Tools site",
  });

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const catalogSchema = z
  .object({
    version: z.literal(1),
    name: z.string().min(1),
    url: toolsSiteUrl,
    categories: z
      .array(
        z.object({
          slug,
          name: z.string().min(1),
          tagline: z.string().min(1),
          description: z.string().min(1),
          url: toolsSiteUrl,
          toolCount: z.number().int().positive(),
        }),
      )
      .min(1),
    tools: z
      .array(
        z.object({
          slug,
          name: z.string().min(1),
          description: z.string().min(1).max(160),
          url: toolsSiteUrl,
          category: slug,
          alsoIn: z.array(slug),
          processing: z.enum(["local", "network", "external"]),
          formats: z.array(z.string()),
          tags: z.array(z.string()),
        }),
      )
      .min(1),
  })
  .superRefine((catalog, context) => {
    const categories = new Set(catalog.categories.map((category) => category.slug));
    const seen = new Set<string>();
    for (const tool of catalog.tools) {
      if (seen.has(tool.slug)) context.addIssue({ code: "custom", message: `duplicate tool "${tool.slug}"` });
      seen.add(tool.slug);
      for (const id of [tool.category, ...tool.alsoIn]) {
        if (!categories.has(id))
          context.addIssue({ code: "custom", message: `"${tool.slug}" is in unknown category "${id}"` });
      }
    }
  });

export type ToolsSiteCatalog = z.infer<typeof catalogSchema>;
export type ToolsSiteTool = ToolsSiteCatalog["tools"][number];
export type ToolsSiteCategory = ToolsSiteCatalog["categories"][number];

export function parseToolsSiteCatalog(input: unknown): ToolsSiteCatalog {
  const result = catalogSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Tools site catalogue (src/data/tools-site.ts) is invalid. Run \`npm run sync:tools\`.\n  - ${result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n  - ")}`,
    );
  }
  return result.data;
}

export const toolsSite = parseToolsSiteCatalog(toolsSiteCatalog);

/** Categories with their tools (primary category only, so each tool is listed once), largest first. */
export function toolsSiteByCategory(): { category: ToolsSiteCategory; tools: ToolsSiteTool[] }[] {
  return toolsSite.categories
    .map((category) => ({ category, tools: toolsSite.tools.filter((tool) => tool.category === category.slug) }))
    .filter((entry) => entry.tools.length > 0)
    .sort((a, b) => b.tools.length - a.tools.length || a.category.name.localeCompare(b.category.name));
}

/** A hand-picked starting set, if those tools exist in the snapshot; otherwise the first tools listed. */
const FEATURED = ["json-formatter", "image-compressor", "qr-generator", "password-generator", "text-diff", "unit-converter"];

export function featuredToolsSiteTools(limit = 6): ToolsSiteTool[] {
  const bySlug = new Map(toolsSite.tools.map((tool) => [tool.slug, tool]));
  const chosen = FEATURED.flatMap((slug) => bySlug.get(slug) ?? []);
  for (const tool of toolsSite.tools) if (chosen.length < limit && !chosen.includes(tool)) chosen.push(tool);
  return chosen.slice(0, limit);
}
