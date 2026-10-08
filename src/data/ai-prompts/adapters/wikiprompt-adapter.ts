import type { ExternalPrompt, PromptCategory, PromptPlatform } from "@/types/ai-prompt";
import type { PromptSourceAdapter } from "./types";
import { isPromptBlocked } from "../takedown-registry";

export interface RawWikipromptRecord {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  author?: string;
  authorProfileUrl?: string;
  canonicalUrl?: string;
  originalSourceUrl?: string;
  platform?: string;
  model?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
}

export class WikipromptAdapter implements PromptSourceAdapter<RawWikipromptRecord> {
  sourceId = "wikiprompt";
  sourceName = "Wikiprompt";

  normalize(raw: RawWikipromptRecord): ExternalPrompt | null {
    if (!raw.prompt || raw.prompt.trim().length < 5) return null;

    const id = `wiki-${raw.id.toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
    if (isPromptBlocked(id, raw.canonicalUrl || raw.originalSourceUrl)) return null;

    // Normalize platform
    const platformStr = (raw.platform || raw.model || "").toLowerCase();
    const platforms: PromptPlatform[] = [];

    if (platformStr.includes("chatgpt") || platformStr.includes("gpt")) {
      platforms.push("ChatGPT");
    }
    if (platformStr.includes("gemini") || platformStr.includes("bard")) {
      platforms.push("Gemini");
    }
    if (platformStr.includes("claude")) {
      platforms.push("Claude");
    }
    if (platformStr.includes("midjourney")) {
      platforms.push("Midjourney");
    }
    if (platforms.length === 0) {
      platforms.push("Universal");
    }

    // Normalize category
    const catStr = (raw.category || "").toLowerCase();
    let category: PromptCategory = "Writing";

    if (catStr.includes("code") || catStr.includes("dev") || catStr.includes("program")) {
      category = "Coding";
    } else if (catStr.includes("image") || catStr.includes("art") || catStr.includes("visual")) {
      category = "Image Generation";
    } else if (catStr.includes("photo")) {
      category = "Photography";
    } else if (catStr.includes("product") || catStr.includes("work")) {
      category = "Productivity";
    } else if (catStr.includes("research") || catStr.includes("analysis")) {
      category = "Research";
    } else if (catStr.includes("market") || catStr.includes("copy")) {
      category = "Marketing";
    } else if (catStr.includes("edu") || catStr.includes("learn")) {
      category = "Education";
    } else if (catStr.includes("3d")) {
      category = "3D";
    }

    const canonical = raw.canonicalUrl || `https://www.wikiprompt.org/prompts/${raw.id}`;
    const authorName = raw.author || "Community Contributor";

    return {
      id,
      title: raw.title || "Community Curated Prompt",
      prompt: raw.prompt.trim(),
      description: raw.description || `Curated prompt aggregated from public community submissions via Wikiprompt.`,
      platform: platforms,
      model: raw.model || raw.platform,
      category,
      tags: raw.tags || ["wikiprompt", "community", category.toLowerCase()],
      imageUrl: raw.imageUrl,
      sourceUrl: canonical,
      sourceName: this.sourceName,
      author: authorName,
      authorProfileUrl: raw.authorProfileUrl,
      license: "CC BY-SA 4.0 (Compilation Metadata) + Original Public Post",
      sourceType: "api",
      safetyStatus: "safe",
      provenance: {
        sourceName: this.sourceName,
        sourceRecordId: raw.id,
        sourceUrl: canonical,
        originalUrl: raw.originalSourceUrl || canonical,
        author: authorName,
        authorProfileUrl: raw.authorProfileUrl,
        license: "CC BY-SA 4.0",
        importedAt: "2026-10-08",
        lastVerified: "2026-10-08",
      },
    };
  }

  batchNormalize(rawItems: RawWikipromptRecord[]): ExternalPrompt[] {
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

export const wikipromptAdapter = new WikipromptAdapter();
