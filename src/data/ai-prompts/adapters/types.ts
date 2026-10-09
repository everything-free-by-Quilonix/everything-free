import type { ExternalPrompt } from "@/types/ai-prompt";

/**
 * Standard contract for source adapters ingesting external prompt repositories.
 */
export interface PromptSourceAdapter<TRaw = unknown> {
  sourceId: string;
  sourceName: string;
  normalize(raw: TRaw): ExternalPrompt | null;
  batchNormalize(rawItems: TRaw[]): ExternalPrompt[];
}
