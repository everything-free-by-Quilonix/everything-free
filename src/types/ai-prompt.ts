/**
 * Type definitions for Everything.Free — AI Prompts Aggregator.
 *
 * Everything.Free acts strictly as an open discovery and aggregation layer
 * for public, open-source, and community prompt datasets. It preserves
 * full data provenance, original author attribution, source links, and licenses.
 */

export type SourceIntegrationMode =
  | "full"             // Full prompt ingestion and display permitted
  | "metadata_only"    // Only title, category, and canonical links displayed
  | "api"              // Live API integration
  | "reference_only"   // Indexed for research/citation only (e.g. unverified license)
  | "blocked";         // Excluded due to takedown, license restriction, or safety

export type PromptSourceType =
  | "open_dataset"
  | "api"
  | "public_archive"
  | "official";

export type ContentSafetyStatus = "safe" | "restricted" | "blocked";

export interface PromptSource {
  id: string;
  name: string;
  homepage: string;
  repository?: string;
  datasetUrl?: string;
  apiUrl?: string;
  license: string;
  attributionRequired: boolean;
  redistributionAllowed: boolean;
  imageRedistributionAllowed: boolean;
  integrationMode: SourceIntegrationMode;
  totalSourceRecords: string;
  description: string;
  lastChecked: string;
  notes?: string;
}

export interface DataProvenance {
  sourceName: string;
  sourceRecordId?: string;
  sourceUrl: string;
  originalUrl?: string;
  author?: string;
  authorProfileUrl?: string;
  license?: string;
  importedAt: string;
  lastVerified: string;
}

export type PromptCategory =
  | "Writing"
  | "Coding"
  | "Image Generation"
  | "Photography"
  | "Art"
  | "3D"
  | "Marketing"
  | "Productivity"
  | "Research"
  | "Education"
  | "Video"
  | "Design"
  | "UI/UX"
  | "Career"
  | "Other";

export type PromptPlatform =
  | "ChatGPT"
  | "Gemini"
  | "Claude"
  | "Midjourney"
  | "Stable Diffusion"
  | "FLUX"
  | "DALL-E"
  | "Leonardo"
  | "Grok"
  | "Ideogram"
  | "Universal"
  | "Other";

export interface ExternalPrompt {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  platform: PromptPlatform[];
  model?: string;
  category: PromptCategory;
  tags: string[];
  imageUrl?: string;
  sourceUrl: string;
  sourceName: string;
  author?: string;
  authorProfileUrl?: string;
  license?: string;
  sourceType: PromptSourceType;
  safetyStatus: ContentSafetyStatus;
  provenance: DataProvenance;
}

export const PROMPT_CATEGORIES: PromptCategory[] = [
  "Writing",
  "Coding",
  "Image Generation",
  "Photography",
  "Art",
  "3D",
  "Marketing",
  "Productivity",
  "Research",
  "Education",
  "Video",
  "Design",
  "UI/UX",
  "Career",
  "Other",
] as const;

export const PROMPT_PLATFORMS: PromptPlatform[] = [
  "ChatGPT",
  "Gemini",
  "Claude",
  "Midjourney",
  "Stable Diffusion",
  "FLUX",
  "DALL-E",
  "Leonardo",
  "Grok",
  "Ideogram",
  "Universal",
  "Other",
] as const;
