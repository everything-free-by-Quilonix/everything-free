import { aiResearch1 } from "./ai-1";
import { aiResearch2 } from "./ai-2";
import { aiResearch3 } from "./ai-3";
import type { ResearchOverlay } from "./apply";
import { studentsResearch1 } from "./students-1";

export { applyResearch } from "./apply";
export type { ResearchOverlay } from "./apply";

/** Every research pass over existing listings. Order does not matter; slugs must be unique. */
export const researchOverlays: ResearchOverlay[] = [...aiResearch1, ...aiResearch2, ...aiResearch3, ...studentsResearch1];
