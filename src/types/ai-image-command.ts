/**
 * Platform compatibility types for AI image prompt commands.
 *
 * Distinguishes between native engine commands (e.g. Midjourney parameter flags),
 * natural-language prompt modifiers, artistic style references, and unsupported syntax.
 */

export type PlatformSupport =
  | "native"
  | "prompt_modifier"
  | "style_reference"
  | "unsupported"
  | "unknown";

export type CommandVerificationStatus =
  | "verified"
  | "partially_verified"
  | "unverified"
  | "unsupported";

export type VerificationStatus = CommandVerificationStatus;

export type CommandCategory =
  | "Photography"
  | "Film"
  | "Art"
  | "Illustration"
  | "3D"
  | "Anime"
  | "Retro"
  | "Design"
  | "Product"
  | "Materials"
  | "Effects"
  | "Architecture"
  | "Maps"
  | "Advertising";

export interface VerificationDetails {
  status: VerificationStatus;
  lastChecked: string;
  source: string;
  notes?: string;
}

export interface AIImageCommand {
  id: string;
  command: string;
  name: string;
  description: string;
  category: CommandCategory;
  tags: string[];
  platforms: {
    chatgpt: PlatformSupport;
    gemini: PlatformSupport;
  };
  syntax: string;
  examplePrompt: string;
  bestFor: string[];
  verification: VerificationDetails;
  notes?: string;
  copyrightDisclaimer?: string;
  previewImage?: string;
}

export const COMMAND_CATEGORIES: CommandCategory[] = [
  "Photography",
  "Film",
  "Art",
  "Illustration",
  "3D",
  "Anime",
  "Retro",
  "Design",
  "Product",
  "Materials",
  "Effects",
  "Architecture",
  "Maps",
  "Advertising",
] as const;

export const PLATFORM_SUPPORT_LABELS: Record<PlatformSupport, { label: string; description: string }> = {
  native: {
    label: "Native",
    description: "Formally recognized syntax or engine parameter.",
  },
  prompt_modifier: {
    label: "Prompt Modifier",
    description: "Works reliably when described naturally in the prompt.",
  },
  style_reference: {
    label: "Style Reference",
    description: "Produces visual aesthetic; slash command syntax is not parsed.",
  },
  unsupported: {
    label: "Unsupported",
    description: "Does not reliably produce results or is blocked by system policies.",
  },
  unknown: {
    label: "Unverified",
    description: "Insufficient documentation or testing evidence.",
  },
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, { label: string; description: string }> = {
  verified: {
    label: "Verified",
    description: "Confirmed by official documentation or reproducible benchmarks.",
  },
  partially_verified: {
    label: "Partially Verified",
    description: "Works with caveats, prompt upsampling changes, or style shifts.",
  },
  unverified: {
    label: "Unverified",
    description: "Awaiting formal testing against latest model releases.",
  },
  unsupported: {
    label: "Unsupported",
    description: "Fails to render desired outcome or triggers policy filter.",
  },
};
