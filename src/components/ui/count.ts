/**
 * Count copy shared by every surface that states a number.
 *
 * Pure and free of data imports, so a client component can use it without
 * pulling repository or config modules into its bundle. Agreement comes from
 * `Intl.PluralRules("en")`; figures go through `formatCount`.
 */

import { formatCount } from "@/lib/utils/format";

const pluralRules = new Intl.PluralRules("en");

/** The singular or plural form for a count, chosen by `Intl.PluralRules("en")`. */
export function plural<T>(count: number, one: T, other: T): T {
  return pluralRules.select(count) === "one" ? one : other;
}

/** A count through `formatCount`, followed by the noun form that agrees with it. */
export function countNoun(count: number, one: string, other: string): string {
  return `${formatCount(count)} ${plural(count, one, other)}`;
}
