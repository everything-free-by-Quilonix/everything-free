/**
 * The counts behind the fact meter: how many of a listing's facts an official
 * source confirms, and how many were checked but are not settled.
 *
 * Pure `.ts` with no JSX, so the Node test runner can import it. Every count
 * comes from `factEvidence`, unchanged, over `FACTS`; nothing is inferred here.
 *
 *   confirmed  state "confirmed"
 *   unsettled  reason "unresolved" (looked for, not settled) or "stale"
 *              (was confirmed, the check has expired)
 *   total      FACTS.length, never a literal
 */

import { FACTS, factEvidence } from "@/lib/resources/evidence";
import type { Resource } from "@/types/resource";

export interface FactMeterCounts {
  confirmed: number;
  unsettled: number;
  total: number;
}

export function factMeterCounts(resource: Resource, now: Date = new Date()): FactMeterCounts {
  let confirmed = 0;
  let unsettled = 0;
  for (const fact of FACTS) {
    const evidence = factEvidence(resource, fact, now);
    if (evidence.state === "confirmed") confirmed += 1;
    else if (evidence.reason === "unresolved" || evidence.reason === "stale") unsettled += 1;
  }
  return { confirmed, unsettled, total: FACTS.length };
}
