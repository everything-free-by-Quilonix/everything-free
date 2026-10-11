import raw from "@/data/entertainment-signals.json";

import { parseSignals, type EntertainmentSignals } from "./signals-schema";

/**
 * The committed signal file, validated once. `null` when it fails validation, in
 * which case no signal-based label is shown anywhere.
 */
export const entertainmentSignals: EntertainmentSignals | null = parseSignals(raw);
