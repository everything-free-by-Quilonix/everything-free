/**
 * The Quick Compare index, built once at build time.
 *
 * Pure `.ts` with no JSX and no repository import: the route passes data read
 * through `@/lib/repository`, and the unit test passes the seed data, so both
 * build the same object.
 *
 * Evidence: every cell's `state` and `reason` are `factEvidence`'s, unchanged,
 * and its words follow the Facts ledger's rule: the value when an official
 * source confirms it; "Listed as …" (free status) or "Recorded as …" when it is
 * only recorded (`hasRecordedValue`); "Unknown" otherwise. The browser prints
 * them verbatim and never upgrades them. `k` and `u` come from
 * `factMeterCounts`, and `t` is `FACTS.length`.
 */
import { getFreeStatus } from "@/config/free-status";
import { getPlatform } from "@/config/platforms";
import { categoryName } from "@/config/categories";
import { factMeterCounts } from "@/features/resources/fact-meter-counts";
import { orderedPlatforms } from "@/lib/resources/derive";
import {
  FACTS,
  factEvidence,
  hasRecordedValue,
  triStateStatements,
  type Fact,
  type TriStateFact,
} from "@/lib/resources/evidence";
import { formatMonthYear } from "@/lib/utils/date";
import type { Resource } from "@/types/resource";

import type { CompareCell, CompareEntry, CompareIndex } from "./compare-index-schema";

function cell(resource: Resource, fact: Fact, now: Date, confirmedText: string, recordedText: string): CompareCell {
  const { state, reason } = factEvidence(resource, fact, now);
  const text = state === "confirmed" ? confirmedText : hasRecordedValue(resource, fact) ? recordedText : "Unknown";
  return { text, state, reason };
}

function triState(resource: Resource, fact: TriStateFact, now: Date): CompareCell {
  const value = resource[fact];
  const statement = value === "unknown" ? "Unknown" : triStateStatements[fact][value];
  return cell(resource, fact, now, statement, `Recorded as ${value}`);
}

export function compareEntry(resource: Resource, now: Date = new Date()): CompareEntry {
  const status = getFreeStatus(resource.freeStatus);
  const platforms = orderedPlatforms(resource)
    .map((platform) => getPlatform(platform).label)
    .join(", ");
  const yesNo = resource.openSource ? "yes" : "no";
  const { confirmed: k, unsettled: u } = factMeterCounts(resource, now);

  return {
    s: resource.slug,
    n: resource.name,
    c: categoryName(resource.category),
    cells: {
      freeStatus: cell(resource, "freeStatus", now, status.label, `Listed as ${status.label.toLowerCase()}`),
      license: cell(resource, "license", now, resource.license ?? "Not recorded", `Recorded as ${resource.license}`),
      platforms: cell(resource, "platforms", now, platforms || "Not recorded", `Recorded as ${platforms}`),
      requiresAccount: triState(resource, "requiresAccount", now),
      requiresCreditCard: triState(resource, "requiresCreditCard", now),
      commercialUse: triState(resource, "commercialUse", now),
      personalUse: triState(resource, "personalUse", now),
      openSource: cell(resource, "openSource", now, resource.openSource ? "Yes" : "No", `Recorded as ${yesNo}`),
    },
    checked: formatMonthYear(resource.lastVerifiedAt) ?? null,
    k,
    u,
  };
}

export function buildCompareIndex(resources: readonly Resource[], now: Date = new Date()): CompareIndex {
  return { v: 1, t: FACTS.length, entries: resources.map((resource) => compareEntry(resource, now)) };
}
