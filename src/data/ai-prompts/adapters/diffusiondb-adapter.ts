import type { ExternalPrompt, PromptCategory, PromptPlatform } from "@/types/ai-prompt";
import type { PromptSourceAdapter } from "./types";
import { isPromptBlocked } from "../takedown-registry";

export interface RawDiffusionDBRecord {
  id?: string;
  prompt: string;
  seed?: number;
  step?: number;
  cfg?: number;
  sampler?: string;
  image_name?: string;
  image_url?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export class DiffusionDBAdapter implements PromptSourceAdapter<RawDiffusionDBRecord> {
  sourceId = "diffusiondb";
  sourceName = "DiffusionDB";

  normalize(raw: RawDiffusionDBRecord): ExternalPrompt | null {
    if (!raw.prompt || raw.prompt.trim().length < 5) return null;

    const id = raw.id || `diffdb-${Buffer.from(raw.prompt.trim().slice(0, 40)).toString("hex").slice(0, 12)}`;
    if (isPromptBlocked(id)) return null;

    // Derive category from tags or prompt text
    const textLower = raw.prompt.toLowerCase();
    let category: PromptCategory = "Image Generation";

    if (textLower.includes("photo") || textLower.includes("portrait") || textLower.includes("camera") || textLower.includes("lens")) {
      category = "Photography";
    } else if (textLower.includes("painting") || textLower.includes("watercolor") || textLower.includes("oil") || textLower.includes("illustration")) {
      category = "Art";
    } else if (textLower.includes("3d") || textLower.includes("render") || textLower.includes("octane") || textLower.includes("isometric")) {
      category = "3D";
    } else if (textLower.includes("anime") || textLower.includes("manga")) {
      category = "Art";
    }

    const platform: PromptPlatform[] = ["Stable Diffusion"];

    // Clean title from prompt opening
    const titleCandidate = raw.prompt.trim().split(/[,.\n]/)[0].trim();
    const title = titleCandidate.length > 50 ? `${titleCandidate.slice(0, 47)}...` : titleCandidate;

    return {
      id,
      title: title || "Stable Diffusion Composition",
      prompt: raw.prompt.trim(),
      description: `Generative visual prompt from DiffusionDB. Configured for Stable Diffusion with cfg ${raw.cfg ?? 7.5} and steps ${raw.step ?? 50}.`,
      platform,
      model: "Stable Diffusion 1.5 / 2.1",
      category,
      tags: raw.tags || ["diffusiondb", "stable-diffusion", "cc0", "text-to-image"],
      imageUrl: raw.image_url,
      sourceUrl: "https://poloclub.github.io/diffusiondb/",
      sourceName: this.sourceName,
      author: raw.author || "Community Contributor",
      authorProfileUrl: undefined,
      license: "CC0 1.0 Universal",
      sourceType: "open_dataset",
      safetyStatus: "safe",
      provenance: {
        sourceName: this.sourceName,
        sourceRecordId: id,
        sourceUrl: "https://poloclub.github.io/diffusiondb/",
        originalUrl: "https://huggingface.co/datasets/poloclub/diffusiondb",
        author: raw.author || "Community Contributor",
        license: "CC0 1.0 Universal",
        importedAt: "2026-10-08",
        lastVerified: "2026-10-08",
      },
    };
  }

  batchNormalize(rawItems: RawDiffusionDBRecord[]): ExternalPrompt[] {
    const list: ExternalPrompt[] = [];
    const seenPrompts = new Set<string>();

    for (const item of rawItems) {
      const norm = this.normalize(item);
      if (norm) {
        const key = norm.prompt.toLowerCase().trim();
        if (!seenPrompts.has(key)) {
          seenPrompts.add(key);
          list.push(norm);
        }
      }
    }
    return list;
  }
}

export const diffusionDbAdapter = new DiffusionDBAdapter();
