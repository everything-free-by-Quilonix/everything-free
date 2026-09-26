import { VERIFICATION_FRESHNESS_DAYS } from "@/config/verification";

/**
 * Date formatting and freshness helpers.
 *
 * Dates are rendered with an explicit UTC time zone and a fixed locale. Without
 * that, a server-rendered date and its client hydration can disagree when the
 * two are in different zones, which React reports as a hydration mismatch. It
 * also means "Last verified" reads the same for every visitor, which matters for
 * a value the product asks people to trust.
 */

const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const FULL_DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function parse(iso: string): Date | null {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "September 2026" — the granularity used on cards. */
export function formatMonthYear(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = parse(iso);
  return date ? MONTH_YEAR.format(date) : null;
}

/** "25 September 2026" — the granularity used on detail pages. */
export function formatFullDate(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = parse(iso);
  return date ? FULL_DATE.format(date) : null;
}

/** Whole days between `iso` and now. Negative for future dates. */
export function daysSince(iso: string | undefined, now: Date = new Date()): number | null {
  if (!iso) return null;
  const date = parse(iso);
  if (!date) return null;
  return Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}

/**
 * Whether a verification has aged past the freshness window.
 *
 * A listing that has never been verified is *not* stale — it is unverified, which
 * is a different state with different messaging. Returning `false` here keeps
 * those two cases from being conflated.
 */
export function isVerificationStale(lastVerifiedAt: string | undefined, now: Date = new Date()): boolean {
  const age = daysSince(lastVerifiedAt, now);
  if (age === null) return false;
  return age > VERIFICATION_FRESHNESS_DAYS;
}
