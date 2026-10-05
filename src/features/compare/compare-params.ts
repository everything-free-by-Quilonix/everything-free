/**
 * Quick Compare: URL parameters, the selection reducer and the difference lens.
 *
 * Pure `.ts` with no JSX, so the Node test runner pins every rule. The browser
 * never derives evidence here: every cell's words and evidence state arrive in
 * the build-time compare index; these functions only parse, select and compare
 * what was built.
 */
import type { CompareEntry, CompareFact } from "./compare-index-schema";

/** At most three listings are compared, on every entry point. */
export const MAX_COMPARE = 3;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG = 100;

export interface ParsedCompare {
  /** Valid, de-duplicated slugs in first-seen order, at most three. */
  slugs: string[];
  /** More than three valid slugs were given; the first three were kept. */
  truncated: boolean;
}

/**
 * `r` values: comma-separated and/or repeated. Each is trimmed and lower-cased,
 * must be a slug of at most 100 characters, and duplicates keep the first
 * occurrence. Invalid values are dropped silently, as `lib/search/params` does.
 */
export function parseCompareSlugs(values: readonly string[]): ParsedCompare {
  const seen: string[] = [];
  for (const value of values) {
    for (const part of value.split(",")) {
      const slug = part.trim().toLowerCase();
      if (!slug || slug.length > MAX_SLUG || !SLUG.test(slug) || seen.includes(slug)) continue;
      seen.push(slug);
    }
  }
  return { slugs: seen.slice(0, MAX_COMPARE), truncated: seen.length > MAX_COMPARE };
}

/** `diff=1` means only differences; anything else means all rows. */
export function parseDiff(value: string | null | undefined): boolean {
  return value === "1";
}

/** The `/compare/` URL for a selection, without the base path. */
export function compareHref(slugs: readonly string[], diff = false): string {
  const params = new URLSearchParams();
  if (slugs.length > 0) params.set("r", slugs.join(","));
  if (diff) params.set("diff", "1");
  const search = params.toString().replaceAll("%2C", ",");
  return search ? `/compare/?${search}` : "/compare/";
}

/** Splits requested slugs into those the index knows (in order) and a count of the rest. */
export function resolveCompare(
  slugs: readonly string[],
  entries: readonly CompareEntry[],
): { found: CompareEntry[]; missing: number } {
  const bySlug = new Map(entries.map((entry) => [entry.s, entry]));
  const found = slugs.flatMap((slug) => bySlug.get(slug) ?? []);
  return { found, missing: slugs.length - found.length };
}

/* -------------------------------------------------------------------------- */
/* Rows                                                                       */
/* -------------------------------------------------------------------------- */

/** The eight fact rows, in the fixed order the table prints them. */
export const COMPARE_FACTS: readonly CompareFact[] = [
  "freeStatus",
  "license",
  "platforms",
  "requiresAccount",
  "requiresCreditCard",
  "commercialUse",
  "personalUse",
  "openSource",
];

export type CompareRowId = CompareFact | "lastChecked" | "factsConfirmed";

export const COMPARE_ROWS: readonly { id: CompareRowId; label: string }[] = [
  { id: "freeStatus", label: "Free status" },
  { id: "license", label: "Licence" },
  { id: "platforms", label: "Platforms" },
  { id: "requiresAccount", label: "Account needed" },
  { id: "requiresCreditCard", label: "Credit card" },
  { id: "commercialUse", label: "Commercial use" },
  { id: "personalUse", label: "Personal use" },
  { id: "openSource", label: "Open source" },
  { id: "lastChecked", label: "Last checked" },
  { id: "factsConfirmed", label: "Facts confirmed" },
];

const isFact = (id: CompareRowId): id is CompareFact => (COMPARE_FACTS as readonly string[]).includes(id);

/** What a row compares for one listing: the displayed words, plus the evidence reason on fact rows. */
function rowKey(entry: CompareEntry, id: CompareRowId, total: number): string {
  if (isFact(id)) return `${entry.cells[id].text}\u0000${entry.cells[id].reason}`;
  if (id === "lastChecked") return entry.checked ?? "";
  return `${entry.k} of ${total}`;
}

/**
 * The difference lens: the rows whose displayed values or evidence reasons are
 * not the same for every listing. Fewer than two listings differ in nothing.
 */
export function diffRows(entries: readonly CompareEntry[], total: number): Set<CompareRowId> {
  const differing = new Set<CompareRowId>();
  if (entries.length < 2) return differing;
  for (const { id } of COMPARE_ROWS) {
    const first = rowKey(entries[0], id, total);
    if (entries.some((entry) => rowKey(entry, id, total) !== first)) differing.add(id);
  }
  return differing;
}

/**
 * The parity statement above the table. Compares confirmed-fact counts only;
 * `total` is the index's `t`, never a literal.
 */
export function paritySentence(entries: readonly CompareEntry[], total: number): string {
  const counts = entries.map((entry) => entry.k);
  if (counts.every((k) => k === 0)) {
    return "None of these listings has a confirmed fact yet. Every value below is as recorded, not checked.";
  }
  if (counts.every((k) => k === counts[0])) {
    return `Compared on equal evidence: each has ${counts[0]} of ${total} facts confirmed.`;
  }
  const [first, ...rest] = entries;
  const others = rest.map((entry) => `${entry.n} has ${entry.k}`).join("; ");
  return `Compared on unequal evidence: ${first.n} has ${first.k} of ${total} facts confirmed; ${others}.`;
}

/* -------------------------------------------------------------------------- */
/* Selection on /resources                                                    */
/* -------------------------------------------------------------------------- */

export type CompareAction = { type: "toggle"; slug: string } | { type: "clear" };

/**
 * The selection reducer `ResourceExplorer` runs through `useReducer`. `toggle`
 * removes a present slug, or appends an absent one only while fewer than three
 * are selected (otherwise the state is returned unchanged); `clear` empties it.
 * The input array is never mutated.
 */
export function compareSelection(state: readonly string[], action: CompareAction): string[] {
  if (action.type === "clear") return [];
  if (state.includes(action.slug)) return state.filter((slug) => slug !== action.slug);
  if (state.length >= MAX_COMPARE) return state as string[];
  return [...state, action.slug];
}
