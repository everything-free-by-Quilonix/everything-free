/**
 * The fact meter's counts.
 *
 * The meter is a level, not a score: confirmed facts, then facts that were
 * checked but are not settled, then the rest. These tests pin how each evidence
 * reason is counted, so the gauge can never draw more confirmation than
 * `factEvidence` states.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { seedResources } from "@/data/resources";
import { factMeterCounts } from "@/features/resources/fact-meter-counts";
import { FACTS } from "@/lib/resources/evidence";
import type { VerificationCheck } from "@/types/resource";
import { allRequiredConfirmed, confirmed, makeResource, TODAY, unresolved, withPass } from "./fixtures.mjs";

const EVERY_CHECK: VerificationCheck[] = [
  ...allRequiredConfirmed().map((record) => record.check),
  "OPEN_SOURCE_STATUS",
  "PLATFORM_AVAILABILITY",
];

describe("factMeterCounts", () => {
  test("total is FACTS.length", () => {
    assert.equal(factMeterCounts(makeResource(), TODAY).total, FACTS.length);
  });

  test("a never-checked listing has nothing confirmed and nothing unsettled", () => {
    assert.deepEqual(factMeterCounts(makeResource(), TODAY), { confirmed: 0, unsettled: 0, total: FACTS.length });
  });

  test("every fact confirmed fills the meter", () => {
    const resource = withPass(EVERY_CHECK.map(confirmed), { license: "MIT", openSource: true });
    assert.deepEqual(factMeterCounts(resource, TODAY), { confirmed: FACTS.length, unsettled: 0, total: FACTS.length });
  });

  test("an unresolved check counts as unsettled, not confirmed", () => {
    const resource = withPass([confirmed("FREE_STATUS"), unresolved("CREDIT_CARD_REQUIREMENT")]);
    const counts = factMeterCounts(resource, TODAY);
    assert.equal(counts.confirmed, 1);
    assert.equal(counts.unsettled, 1);
  });

  test("a confirmation past the re-check window counts as unsettled", () => {
    const resource = withPass([confirmed("FREE_STATUS"), confirmed("COMMERCIAL_USE")], {}, { date: "2025-01-10" });
    const counts = factMeterCounts(resource, TODAY);
    assert.equal(counts.confirmed, 0);
    assert.equal(counts.unsettled, 2);
  });

  test("confirmed + unsettled never exceeds total, across the real library", () => {
    for (const resource of seedResources) {
      const { confirmed: c, unsettled: u, total } = factMeterCounts(resource);
      assert.ok(c >= 0 && u >= 0 && c + u <= total, `${resource.slug}: ${c} + ${u} > ${total}`);
    }
  });
});
