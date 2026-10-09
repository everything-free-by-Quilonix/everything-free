import type { ExternalPrompt, PromptCategory, PromptPlatform } from "@/types/ai-prompt";
import type { PromptSourceAdapter } from "./types";
import { isPromptBlocked } from "../takedown-registry";

export interface RawOpenImagePromptRecord {
  id: string;
  prompt: string;
  title?: string;
  sourceUrl: string;
  originalPostUrl?: string;
  author?: string;
  platform?: string;
  labels?: string[];
  imageUrl?: string;
}

export class OpenImagePromptsAdapter implements PromptSourceAdapter<RawOpenImagePromptRecord> {
  sourceId = "open-image-prompts";
  sourceName = "Open Image Prompts";

  normalize(raw: RawOpenImagePromptRecord): ExternalPrompt | null {
    if (!raw.prompt || raw.prompt.trim().length < 5) return null;

    const id = `oip-${raw.id.toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
    if (isPromptBlocked(id, raw.sourceUrl || raw.originalPostUrl)) return null;

    const platformStr = (raw.platform || "").toLowerCase();
    const platforms: PromptPlatform[] = [];
    if (platformStr.includes("midjourney")) {
      platforms.push("Midjourney");
    } else if (platformStr.includes("stable") || platformStr.includes("sd")) {
      platforms.push("Stable Diffusion");
    } else if (platformStr.includes("dall")) {
      platforms.push("DALL-E");
    } else if (platformStr.includes("flux")) {
      platforms.push("FLUX");
    } else {
      platforms.push("Midjourney");
    }

    const textLower = raw.prompt.toLowerCase();
    let category: PromptCategory = "Image Generation";
    if (textLower.includes("photo") || textLower.includes("cinematic") || textLower.includes("portrait")) {
      category = "Photography";
    } else if (textLower.includes("painting") || textLower.includes("art") || textLower.includes("illustration")) {
      category = "Art";
    } else if (textLower.includes("3d") || textLower.includes("render") || textLower.includes("isometric")) {
      category = "3D";
    }

    const titleCandidate = raw.title || raw.prompt.trim().split(/[,.\n]/)[0].trim();
    const title = titleCandidate.length > 50 ? `${titleCandidate.slice(0, 47)}...` : titleCandidate;
    const authorName = raw.author || "Public Archive Contributor";

    return {
      id,
      title: title || "Visual Generation Prompt",
      prompt: raw.prompt.trim(),
      description: `Indexed visual prompt from Open Image Prompts public archive with attributed visual taxonomy.`,
      platform: platforms,
      model: raw.platform,
      category,
      tags: raw.labels || ["open-image-prompts", "visual-archive", category.toLowerCase()],
      imageUrl: raw.imageUrl,
      sourceUrl: raw.sourceUrl || "https://openimages.relakkesyang.org/",
      sourceName: this.sourceName,
      author: authorName,
      authorProfileUrl: undefined,
      license: "Public Community Archive Mirror",
      sourceType: "public_archive",
      safetyStatus: "safe",
      provenance: {
        sourceName: this.sourceName,
        sourceRecordId: raw.id,
        sourceUrl: raw.sourceUrl || "https://openimages.relakkesyang.org/",
        originalUrl: raw.originalPostUrl || raw.sourceUrl,
        author: authorName,
        license: "Public Archive with Source Credit",
        importedAt: "2026-10-08",
        lastVerified: "2026-10-08",
      },
    };
  }

  batchNormalize(rawItems: RawOpenImagePromptRecord[]): ExternalPrompt[] {
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

export const openImagePromptsAdapter = new OpenImagePromptsAdapter();
