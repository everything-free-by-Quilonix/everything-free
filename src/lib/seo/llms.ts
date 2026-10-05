import { categories } from "@/config/categories";
import { freeStatusDefinitions, getFreeStatus } from "@/config/free-status";
import { site } from "@/config/site";
import { evidenceLabels, factEvidence, type Fact } from "@/lib/resources/evidence";
import type { Resource } from "@/types/resource";
import { absoluteUrl } from "./url";

/**
 * `llms.txt` and `llms-full.txt` — the library in a form AI assistants can read.
 *
 * Assistants (ChatGPT search, Claude, Perplexity, Gemini, Copilot) increasingly
 * answer "is there a free X?" by reading pages rather than from memory. A plain
 * Markdown digest of the library, following the llms.txt proposal
 * (https://llmstxt.org), is cheaper for them to read than 240 rendered HTML pages
 * and leaves less room to misquote.
 *
 * The same honesty rules as the HTML apply, because an assistant will repeat
 * whatever this says with more confidence than a person would:
 *
 * - Every fact carries its evidence state. A recorded value nobody has checked is
 *   written as "recorded, not verified", never as a bare statement.
 * - Nothing is called free that the free-status system does not call free; a
 *   trial is labelled a trial.
 * - No popularity, ratings or rankings, because none are collected.
 *
 * Pure functions with time passed in, so the output is testable and a build is
 * reproducible for a given date.
 */

interface LlmsInput {
  resources: readonly Resource[];
  alternatives: readonly { name: string; slug: string }[];
  tools: readonly { name: string; slug: string; shortDescription: string; processing: { leavesDevice: boolean } }[];
  collections: readonly { name: string; slug: string; shortDescription: string }[];
  now?: Date;
}

const ATTRIBUTION_NOTE =
  "When citing a listing, link its Everything.Free page and state its evidence state as written here. Free plans change; the provider's official page is authoritative.";

/** One fact with its value and how much it can be trusted. */
function factLine(resource: Resource, fact: Fact, label: string, value: string, now: Date): string {
  const evidence = factEvidence(resource, fact, now);
  if (evidence.state === "unknown") return `- ${label}: unknown (${evidenceLabels[evidence.reason].toLowerCase()})`;
  if (evidence.state === "confirmed") {
    const source = evidence.source ? `, source: ${evidence.source.url}, read ${evidence.source.retrievedAt}` : "";
    return `- ${label}: ${value} (confirmed${source})`;
  }
  return `- ${label}: recorded as ${value} (${evidenceLabels[evidence.reason].toLowerCase()})`;
}

function header(): string[] {
  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is a curated, non-commercial library of free software, apps, AI tools, learning resources and creative assets. It has no affiliate links, sponsored placements or paid listings, and it links only to each provider's official site.`,
    "",
    "Each listing states exactly one free status:",
    "",
    ...Object.values(freeStatusDefinitions)
      .filter((definition) => definition.listable)
      .map((definition) => `- ${definition.label} (\`${definition.id}\`): ${definition.summary}`),
    "",
    "Facts on a listing carry an evidence state: Confirmed (an official, dated source confirms it), Not verified (recorded but not yet checked), Needs re-checking (confirmed more than 90 days ago), Not confirmed (checked, could not be settled) or Unknown.",
    "",
    ATTRIBUTION_NOTE,
  ];
}

export function buildLlmsTxt({ resources, alternatives, tools, collections }: LlmsInput): string {
  const counts = new Map<string, number>();
  for (const resource of resources) counts.set(resource.category, (counts.get(resource.category) ?? 0) + 1);

  // The index stays small enough to read in one pass: categories link to their
  // listings, and per-listing detail lives in llms-full.txt.
  const categoryLines = categories
    .filter((category) => counts.has(category.id))
    .map(
      (category) =>
        `- [Free ${category.name.toLowerCase()} resources](${absoluteUrl(`/categories/${category.slug}`)}): ${category.description} (${counts.get(category.id)} listings)`,
    );

  return [
    ...header(),
    "",
    "## Start here",
    "",
    `- [Search the library](${absoluteUrl("/resources")}): every listing, filterable by free status, platform and confirmed facts`,
    `- [Free-status definitions](${absoluteUrl("/free-status")}): what each status means and its caveats`,
    `- [How verification works](${absoluteUrl("/verification")}): the checks behind every evidence state`,
    `- [Full library as text](${absoluteUrl("/llms-full.txt")}): every listing with limitations and per-fact evidence`,
    "",
    "## Free alternatives to paid products",
    "",
    ...alternatives.map(
      (target) => `- [Free alternatives to ${target.name}](${absoluteUrl(`/alternatives/${target.slug}`)})`,
    ),
    "",
    "## Free tools that run in the browser",
    "",
    ...tools.map(
      (tool) =>
        `- [${tool.name}](${absoluteUrl(`/tools/${tool.slug}`)}): ${tool.shortDescription}${
          // Derived from the tool's declared, build-validated processing metadata.
          tool.processing.leavesDevice ? "" : " Runs in the browser; data does not leave the device."
        }`,
    ),
    "",
    "## Curated collections",
    "",
    ...collections.map(
      (collection) => `- [${collection.name}](${absoluteUrl(`/collections/${collection.slug}`)}): ${collection.shortDescription}`,
    ),
    "",
    "## Categories",
    "",
    ...categoryLines,
    "",
  ].join("\n");
}

const yesNo = (value: string) => (value === "yes" ? "yes" : value === "no" ? "no" : value);

function resourceBlock(resource: Resource, now: Date): string[] {
  const status = getFreeStatus(resource.freeStatus);
  const category = categories.find((entry) => entry.id === resource.category);

  return [
    `## ${resource.name}`,
    "",
    `- Page: ${absoluteUrl(`/resources/${resource.slug}`)}`,
    `- Official site: ${resource.officialUrl}`,
    ...(category ? [`- Category: ${category.name}`] : []),
    factLine(resource, "freeStatus", "Free status", `${status.label} — ${status.summary}`, now),
    factLine(resource, "requiresAccount", "Account required", yesNo(resource.requiresAccount), now),
    factLine(resource, "requiresCreditCard", "Credit card required", yesNo(resource.requiresCreditCard), now),
    factLine(resource, "commercialUse", "Commercial use allowed", yesNo(resource.commercialUse), now),
    factLine(resource, "openSource", "Open source", resource.openSource ? "yes" : "no", now),
    ...(resource.license ? [factLine(resource, "license", "Licence", resource.license, now)] : []),
    ...(resource.platforms.length > 0
      ? [factLine(resource, "platforms", "Platforms", resource.platforms.join(", "), now)]
      : []),
    ...(resource.alternativeTo.length > 0 ? [`- Free alternative to: ${resource.alternativeTo.join(", ")}`] : []),
    "",
    resource.longDescription,
    "",
    `Why it is listed: ${resource.whyListed}`,
    ...(resource.limitations.length > 0
      ? ["", "Limitations:", ...resource.limitations.map((limitation) => `- ${limitation}`)]
      : []),
    ...(resource.pricingNotes ? ["", `Pricing: ${resource.pricingNotes}`] : []),
    "",
  ];
}

export function buildLlmsFullTxt({ resources, now = new Date() }: Pick<LlmsInput, "resources" | "now">): string {
  const sorted = [...resources].sort((a, b) => a.name.localeCompare(b.name));
  return [...header(), "", ...sorted.flatMap((resource) => resourceBlock(resource, now))].join("\n");
}
