/**
 * Subscription audit: pure maths and product matching.
 *
 * The user types what they pay for and what it costs them. Prices are never
 * looked up or guessed (the project records no prices, and a stale price would be
 * a fabricated claim), so every amount on screen is one the user entered. What the
 * library contributes is the match: which of those products have free
 * alternatives listed, via the same `slugifyProductName` the
 * `/alternatives/[slug]` pages are generated from, so a match always links to a
 * page that exists.
 */
import { slugifyProductName } from "@/lib/utils/slug";

export const BILLING_PERIODS = ["month", "year", "week"] as const;
export type BillingPeriod = (typeof BILLING_PERIODS)[number];

export interface AlternativeTarget {
  name: string;
  slug: string;
  /** How many listings are presented as alternatives. */
  count: number;
}

export interface SubscriptionRow {
  name: string;
  /** As typed; parsed leniently ("9.99", "1,299", "₹499"). */
  amount: string;
  period: BillingPeriod;
}

/** Lenient amount parser. Returns null for anything that is not a non-negative number. */
export function parseAmount(input: string): number | null {
  // Keep digits and separators only: currency symbols and spaces are noise here.
  const cleaned = input.replace(/[^\d.,]/g, "");
  if (cleaned.length === 0) return null;
  let normalised: string;
  if (cleaned.includes(".") && cleaned.includes(",")) {
    // Both present: whichever comes last is the decimal separator ("1,299.00", "1.299,00").
    normalised =
      cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (/^\d+,\d{1,2}$/.test(cleaned)) {
    // A lone comma followed by one or two digits is a decimal comma ("9,99").
    normalised = cleaned.replace(",", ".");
  } else {
    // Otherwise commas group thousands ("1,299", "12,00,000").
    normalised = cleaned.replace(/,/g, "");
  }
  if (!/^\d+(?:\.\d+)?$/.test(normalised)) return null;
  const value = Number(normalised);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/** Monthly equivalent of an amount billed per `period`. */
export function toMonthly(amount: number, period: BillingPeriod): number {
  switch (period) {
    case "month":
      return amount;
    case "year":
      return amount / 12;
    case "week":
      return (amount * 52) / 12;
  }
}

/**
 * Words that describe a plan tier rather than a product: "Spotify Premium" and
 * "Spotify" should both find the "Spotify" page. Applied only as a fallback after
 * an exact match fails, so "ChatGPT Plus" still prefers its own page.
 */
const TIER_WORDS = new Set([
  "plus",
  "pro",
  "premium",
  "basic",
  "standard",
  "personal",
  "family",
  "individual",
  "team",
  "teams",
  "business",
  "plan",
  "subscription",
  "membership",
  "monthly",
  "annual",
  "yearly",
]);

function stripTiers(slug: string): string {
  return slug
    .split("-")
    .filter((part) => !TIER_WORDS.has(part))
    .join("-");
}

/**
 * Finds the alternatives page for a typed product name.
 *
 * Order: exact slug; then the same with plan-tier words removed on both sides,
 * preferring the target with more listings. Deliberately no fuzzy edit-distance
 * match: sending "Notion" to "Motion" would be worse than finding nothing.
 */
export function matchTarget(name: string, targets: readonly AlternativeTarget[]): AlternativeTarget | null {
  const slug = slugifyProductName(name);
  if (slug.length === 0) return null;

  const exact = targets.find((target) => target.slug === slug);
  if (exact) return exact;

  const core = stripTiers(slug);
  if (core.length === 0) return null;
  const candidates = targets.filter((target) => stripTiers(target.slug) === core);
  if (candidates.length === 0) return null;
  // "ChatGPT Pro" prefers the bare "ChatGPT" page over a sibling tier's page.
  const bare = candidates.find((target) => target.slug === core);
  if (bare) return bare;
  return [...candidates].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))[0];
}

export interface AuditLine {
  row: SubscriptionRow;
  monthly: number | null;
  target: AlternativeTarget | null;
}

export interface AuditTotals {
  lines: AuditLine[];
  /** Sum of every row with a valid amount. */
  monthly: number;
  yearly: number;
  /** The part of the yearly spend on products with a listed free alternative. */
  coveredYearly: number;
  coveredCount: number;
  /** Rows with a name and a usable amount. */
  pricedCount: number;
}

export function auditSubscriptions(
  rows: readonly SubscriptionRow[],
  targets: readonly AlternativeTarget[],
): AuditTotals {
  const lines: AuditLine[] = rows.map((row) => {
    const amount = parseAmount(row.amount);
    return {
      row,
      monthly: amount === null ? null : toMonthly(amount, row.period),
      target: row.name.trim() ? matchTarget(row.name, targets) : null,
    };
  });

  let monthly = 0;
  let covered = 0;
  let coveredCount = 0;
  let pricedCount = 0;
  for (const line of lines) {
    if (line.monthly === null || line.row.name.trim().length === 0) continue;
    pricedCount += 1;
    monthly += line.monthly;
    if (line.target) {
      covered += line.monthly;
      coveredCount += 1;
    }
  }

  return { lines, monthly, yearly: monthly * 12, coveredYearly: covered * 12, coveredCount, pricedCount };
}

/** Currencies offered in the picker. Symbols only: nothing is ever converted. */
export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD", "BRL", "IDR", "NGN"] as const;
export type Currency = (typeof CURRENCIES)[number];

export function formatMoney(value: number, currency: Currency): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" || currency === "IDR" ? 0 : 2,
  }).format(value);
}

/** A plain-text summary the user can paste into a note or a message. */
export function auditSummary(totals: AuditTotals, currency: Currency): string {
  const out = [
    `My subscriptions: ${formatMoney(totals.monthly, currency)} a month, ${formatMoney(totals.yearly, currency)} a year.`,
  ];
  for (const line of totals.lines) {
    if (line.monthly === null || !line.row.name.trim()) continue;
    const alt = line.target
      ? ` (free alternatives listed: ${line.target.count})`
      : "";
    out.push(`- ${line.row.name.trim()}: ${formatMoney(line.monthly, currency)}/month${alt}`);
  }
  if (totals.coveredCount > 0) {
    out.push(
      `${totals.coveredCount} of these have free alternatives on Everything.Free, covering ${formatMoney(totals.coveredYearly, currency)} a year.`,
    );
  }
  return out.join("\n");
}
