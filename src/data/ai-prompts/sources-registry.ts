import type { PromptSource } from "@/types/ai-prompt";

/**
 * Verified registry of external open-source and public AI prompt datasets.
 *
 * Everything.Free does not claim ownership of external prompt content.
 * Every source is evaluated for licensing, attribution rules, and redistribution terms.
 */
export const PROMPT_SOURCES_REGISTRY: PromptSource[] = [
  {
    id: "diffusiondb",
    name: "DiffusionDB",
    homepage: "https://poloclub.github.io/diffusiondb/",
    repository: "https://github.com/poloclub/diffusiondb",
    datasetUrl: "https://huggingface.co/datasets/poloclub/diffusiondb",
    license: "CC0 1.0 Universal (Public Domain)",
    attributionRequired: false,
    redistributionAllowed: true,
    imageRedistributionAllowed: true,
    integrationMode: "full",
    totalSourceRecords: "14M prompt-image pairs (~1.8M unique prompts)",
    description: "The first large-scale text-to-image prompt dataset, containing millions of real Stable Diffusion generations released under CC0 public domain.",
    lastChecked: "2026-10-08",
    notes: "Tier 1 open dataset. Public domain CC0 license permits full discovery indexing with attribution preserved.",
  },
  {
    id: "wikiprompt",
    name: "Wikiprompt",
    homepage: "https://www.wikiprompt.org/",
    repository: "https://github.com/lschiaffino/wikiprompt-dataset",
    datasetUrl: "https://www.wikiprompt.org/dataset",
    apiUrl: "https://www.wikiprompt.org/api-docs",
    license: "CC BY-SA 4.0 (Compilation Metadata) + Public Posts with Author Credit",
    attributionRequired: true,
    redistributionAllowed: true,
    imageRedistributionAllowed: false,
    integrationMode: "full",
    totalSourceRecords: "55,000+ multi-model prompts",
    description: "An open community-maintained encyclopedia of AI prompts covering ChatGPT, Claude, Gemini, Midjourney, and specialized workflows.",
    lastChecked: "2026-10-08",
    notes: "Tier 2 source. Preserves author handle, canonical post link, model metadata, and compilation credit.",
  },
  {
    id: "open-image-prompts",
    name: "Open Image Prompts",
    homepage: "https://openimages.relakkesyang.org/",
    repository: "https://github.com/NanmiCoder/open-image-prompts",
    datasetUrl: "https://github.com/NanmiCoder/open-image-prompts/blob/main/DATASET.md",
    license: "Public Community Archive (Source Mirror with Attribution)",
    attributionRequired: true,
    redistributionAllowed: true,
    imageRedistributionAllowed: false,
    integrationMode: "full",
    totalSourceRecords: "19,794 source prompts & visual labels",
    description: "A public visual prompt repository indexing high-performing image generation prompts, original creator posts, and aesthetic tags.",
    lastChecked: "2026-10-08",
    notes: "Tier 3 source. Preserves original author credits, source platform links, and original media references without re-hosting.",
  },
  {
    id: "krea",
    name: "Krea Open Prompts",
    homepage: "https://github.com/krea-ai/open-prompts",
    repository: "https://github.com/krea-ai/open-prompts",
    license: "Unresolved / Archived Repository",
    attributionRequired: true,
    redistributionAllowed: false,
    imageRedistributionAllowed: false,
    integrationMode: "reference_only",
    totalSourceRecords: "10M+ historical generations",
    description: "Archived prompt repository with historic generations. Indexed for research reference only; prompt bodies not ingested due to unverified redistribution terms.",
    lastChecked: "2026-10-08",
    notes: "Tier 4 source. Maintained as reference-only citation in accordance with project licensing guardrails.",
  },
];

export function getPromptSource(id: string): PromptSource | undefined {
  return PROMPT_SOURCES_REGISTRY.find((s) => s.id === id);
}

export function getActivePromptSources(): PromptSource[] {
  return PROMPT_SOURCES_REGISTRY.filter((s) => s.integrationMode !== "blocked");
}
