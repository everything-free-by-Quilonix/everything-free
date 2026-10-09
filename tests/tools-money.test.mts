/**
 * The "Keep it free" tools: trial-reminder date maths and calendar output, and
 * the subscription audit's parsing, totals and matching against the real
 * alternative targets (so every match is a page the build generates).
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { seedResources } from "@/data/resources";
import { getTool, tools } from "@/config/tools";
import {
  addDays,
  buildTrialCalendar,
  escapeIcsText,
  foldIcsLine,
  parseIsoDate,
  trialSchedule,
  validateTrial,
  type TrialInput,
} from "@/features/tools/logic/trial-reminder";
import {
  auditSubscriptions,
  auditSummary,
  matchTarget,
  parseAmount,
  toMonthly,
  type AlternativeTarget,
} from "@/features/tools/logic/subscription-audit";
import { matchesFilters } from "@/lib/search/filters";
import { slugifyProductName } from "@/lib/utils/slug";

const trial = (overrides: Partial<TrialInput> = {}): TrialInput => ({
  name: "Example",
  startDate: "2026-01-30",
  lengthDays: 7,
  remindDaysBefore: 2,
  ...overrides,
});

describe("trial reminder", () => {
  test("rejects impossible dates", () => {
    assert.equal(parseIsoDate("2026-02-30"), null);
    assert.equal(parseIsoDate("2026-2-3"), null);
    assert.notEqual(parseIsoDate("2028-02-29"), null);
  });

  test("adds days across month and year ends", () => {
    assert.equal(addDays("2026-01-30", 7), "2026-02-06");
    assert.equal(addDays("2026-12-28", 7), "2027-01-04");
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  });

  test("schedules the reminder before the charge, never before the start", () => {
    const s = trialSchedule(trial(), "2026-02-01");
    assert.equal(s.chargeDate, "2026-02-06");
    assert.equal(s.reminderDate, "2026-02-04");
    assert.equal(s.daysUntilCharge, 5);
    assert.equal(s.reminderInPast, false);

    const short = trialSchedule(trial({ lengthDays: 1, remindDaysBefore: 5 }), "2026-01-30");
    assert.equal(short.reminderDate, "2026-01-30");

    assert.equal(trialSchedule(trial(), "2026-02-05").reminderInPast, true);
  });

  test("validation explains each problem", () => {
    assert.deepEqual(validateTrial(trial()), []);
    assert.equal(validateTrial(trial({ name: "  " })).length, 1);
    assert.equal(validateTrial(trial({ lengthDays: 0 })).length, 1);
    assert.equal(validateTrial(trial({ lengthDays: 2.5 })).length, 1);
    assert.equal(validateTrial(trial({ remindDaysBefore: 31 })).length, 1);
    assert.equal(validateTrial(trial({ cancelUrl: "javascript:alert(1)" })).length, 1);
    assert.deepEqual(validateTrial(trial({ cancelUrl: "https://example.com/cancel" })), []);
  });

  test("escapes TEXT values per RFC 5545", () => {
    assert.equal(escapeIcsText("a,b;c\\d\ne"), "a\\,b\\;c\\\\d\\ne");
  });

  test("folds long lines at 75 octets without splitting characters", () => {
    const folded = foldIcsLine(`SUMMARY:${"é".repeat(100)}`);
    const encoder = new TextEncoder();
    for (const part of folded.split("\r\n")) assert.ok(encoder.encode(part).length <= 75);
    assert.equal(folded.replace(/\r\n /g, ""), `SUMMARY:${"é".repeat(100)}`);
  });

  test("builds a well-formed calendar", () => {
    let n = 0;
    const ics = buildTrialCalendar([trial({ name: "Video, Plus; Pro", cancelUrl: "https://example.com/x" })], {
      includeChargeDay: true,
      now: new Date("2026-01-30T10:00:00Z"),
      makeId: () => `id-${++n}`,
    });
    assert.ok(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n"));
    assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
    assert.equal(ics.match(/BEGIN:VEVENT/g)?.length, 2);
    assert.equal(ics.match(/BEGIN:VALARM/g)?.length, 2);
    assert.ok(ics.includes("DTSTART;VALUE=DATE:20260204"));
    assert.ok(ics.includes("DTSTART;VALUE=DATE:20260206"));
    assert.ok(ics.includes("DTSTAMP:20260130T100000Z"));
    assert.ok(ics.includes("UID:id-1@everything.free"));
    assert.ok(ics.includes("Video\\, Plus\\; Pro"));
    // Every line ends CRLF; no bare LF.
    assert.equal(ics.replace(/\r\n/g, "").includes("\n"), false);

    const single = buildTrialCalendar([trial()], { includeChargeDay: false, makeId: () => "x" });
    assert.equal(single.match(/BEGIN:VEVENT/g)?.length, 1);
  });
});

/* -------------------------------------------------------------------------- */

const listable = seedResources.filter((r) => matchesFilters(r, {}));
const realTargets: AlternativeTarget[] = (() => {
  const map = new Map<string, AlternativeTarget>();
  for (const r of listable) {
    for (const name of r.alternativeTo) {
      const slug = slugifyProductName(name);
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { name, slug, count: 1 });
    }
  }
  return [...map.values()];
})();

describe("subscription audit", () => {
  test("parses amounts leniently", () => {
    assert.equal(parseAmount("9.99"), 9.99);
    assert.equal(parseAmount("$9.99"), 9.99);
    assert.equal(parseAmount("₹1,299"), 1299);
    assert.equal(parseAmount("12,00,000"), 1200000);
    assert.equal(parseAmount("9,99"), 9.99);
    assert.equal(parseAmount("1.299,50"), 1299.5);
    assert.equal(parseAmount("1,299.50"), 1299.5);
    assert.equal(parseAmount(""), null);
    assert.equal(parseAmount("abc"), null);
    assert.equal(parseAmount("1.2.3"), null);
  });

  test("normalises billing periods to a month", () => {
    assert.equal(toMonthly(120, "year"), 10);
    assert.equal(toMonthly(10, "month"), 10);
    assert.equal(toMonthly(12, "week"), 52);
  });

  test("matches exact names and plan tiers, never near misses", () => {
    const targets: AlternativeTarget[] = [
      { name: "Notion", slug: "notion", count: 2 },
      { name: "ChatGPT Plus", slug: "chatgpt-plus", count: 3 },
      { name: "ChatGPT", slug: "chatgpt", count: 1 },
    ];
    assert.equal(matchTarget("notion", targets)?.slug, "notion");
    assert.equal(matchTarget("Notion Plus", targets)?.slug, "notion");
    assert.equal(matchTarget("ChatGPT Plus", targets)?.slug, "chatgpt-plus");
    assert.equal(matchTarget("ChatGPT Pro", targets)?.slug, "chatgpt");
    assert.equal(matchTarget("ChatGPT Plus subscription", targets)?.slug, "chatgpt");
    assert.equal(matchTarget("Claude Pro", [{ name: "Claude Max", slug: "claude-max", count: 1 }]), null);
    assert.equal(matchTarget("Motion", targets), null);
    assert.equal(matchTarget("Premium", targets), null);
    assert.equal(matchTarget("", targets), null);
  });

  test("every match against the real library is a generated alternatives page", () => {
    const slugs = new Set(realTargets.map((t) => t.slug));
    assert.ok(realTargets.length > 0);
    for (const target of realTargets) {
      const match = matchTarget(target.name, realTargets);
      assert.ok(match && slugs.has(match.slug), target.name);
    }
  });

  test("totals only rows with a name and a valid amount", () => {
    const targets: AlternativeTarget[] = [{ name: "Adobe Photoshop", slug: "adobe-photoshop", count: 3 }];
    const totals = auditSubscriptions(
      [
        { name: "Adobe Photoshop", amount: "240", period: "year" },
        { name: "Something else", amount: "5", period: "month" },
        { name: "", amount: "100", period: "month" },
        { name: "Bad", amount: "x", period: "month" },
      ],
      targets,
    );
    assert.equal(totals.pricedCount, 2);
    assert.equal(totals.monthly, 25);
    assert.equal(totals.yearly, 300);
    assert.equal(totals.coveredYearly, 240);
    assert.equal(totals.coveredCount, 1);
    const summary = auditSummary(totals, "USD");
    assert.ok(summary.includes("$25.00 a month"));
    assert.ok(summary.includes("Adobe Photoshop: $20.00/month (free alternatives listed: 3)"));
  });
});

describe("Keep it free tools are registered honestly", () => {
  test("both run locally, cost nothing and relate only to listable resources", () => {
    const listableSlugs = new Set(listable.map((r) => r.slug));
    for (const slug of ["trial-reminder", "subscription-audit"]) {
      const tool = getTool(slug);
      assert.ok(tool, slug);
      assert.equal(tool.status, "available");
      assert.equal(tool.integrationType, "BROWSER_LOCAL");
      assert.equal(tool.processing.leavesDevice, false);
      assert.equal(tool.infrastructureCost, "none");
      for (const related of tool.relatedResources) assert.ok(listableSlugs.has(related), `${slug} → ${related}`);
    }
    assert.equal(new Set(tools.map((t) => t.slug)).size, tools.length);
  });
});
