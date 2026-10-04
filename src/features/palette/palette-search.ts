/**
 * Palette search: scoring and grouping over the jump index. Pure, so the unit
 * tests pin every rule.
 *
 * Scoring per entry name, with the query trimmed, capped at 100 characters and
 * normalised with `normalizeText` (diacritics folded):
 *   exact name 100 · name prefix 80 · otherwise the weakest term decides:
 *   word-boundary term in name 60 · substring in name 40 · term in the
 *   subject or category 20.
 * Every term must match somewhere. Ties sort by name, so order is
 * deterministic. Groups are capped, and the last row always hands off to the
 * full search.
 */
import { normalizeText } from "@/lib/search/tokenize";

import type { PaletteIndex } from "./palette-index-schema";

export const MAX_QUERY = 100;

/**
 * The fixed pages: offered on an empty query and matched by name. Kept here, not
 * in the index builder, so the palette can show them before the index arrives.
 */
export const PALETTE_PAGES: { href: string; n: string }[] = [
  { href: "/resources/", n: "Browse all listings" },
  { href: "/categories/", n: "Subjects" },
  { href: "/collections/", n: "Collections" },
  { href: "/tools/", n: "Tools" },
  { href: "/alternatives/", n: "Alternatives" },
  { href: "/verification/", n: "How verification works" },
  { href: "/free-status/", n: "What “free” means" },
  { href: "/about/", n: "About Everything.Free" },
  { href: "/submit/", n: "Submit a resource" },
];

export const GROUP_CAPS = {
  listings: 6,
  subjects: 4,
  collections: 3,
  tools: 3,
  alternatives: 3,
  audiences: 2,
  filters: 3,
  pages: 3,
} as const;

export type PaletteGroupId = keyof typeof GROUP_CAPS | "goto" | "sections" | "search";

export interface PaletteRow {
  /** Stable within one result set: the DOM id of the option. */
  id: string;
  label: string;
  href: string;
  /** "{subject} · {free-status words}", or a short kind label. */
  secondary?: string;
  /** Fact meter counts, listings only. */
  meter?: { k: number; u: number };
  /** Matched span in `label`, as [start, end). */
  match?: [number, number];
  /** The official URL, listings only: Shift+Enter copies it. */
  official?: string;
  /** In-page anchors scroll rather than navigate. */
  anchor?: boolean;
}

export interface PaletteGroup {
  id: PaletteGroupId;
  label: string;
  rows: PaletteRow[];
}

/** An in-page target offered under "On this page" (read from the DOM by the caller). */
export interface PaletteSection {
  id: string;
  label: string;
}

/** The trimmed, capped query. */
export function cleanQuery(raw: string): string {
  return raw.trim().slice(0, MAX_QUERY);
}

/**
 * The score of one entry, or null when a term matches nowhere. `context` is the
 * subject or category name, which only weakly supports a match.
 */
export function scoreEntry(name: string, context: string, query: string): number | null {
  const q = normalizeText(query);
  if (!q) return null;
  const n = normalizeText(name);
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  const c = normalizeText(context);
  const words = ` ${n}`;
  let weakest = Infinity;
  for (const term of q.split(" ")) {
    const score = words.includes(` ${term}`) ? 60 : n.includes(term) ? 40 : c.includes(term) ? 20 : 0;
    if (score === 0) return null;
    weakest = Math.min(weakest, score);
  }
  return weakest;
}

/**
 * Where to underline in `name`: the whole query when the name starts with it,
 * otherwise the first term's first occurrence. Only when normalising kept the
 * length, so the span maps onto the original characters.
 */
export function matchSpan(name: string, query: string): [number, number] | undefined {
  const q = normalizeText(query);
  const n = normalizeText(name);
  if (!q || n.length !== name.length) return undefined;
  const target = n.startsWith(q) ? q : q.split(" ")[0];
  const at = n.indexOf(target);
  return at < 0 ? undefined : [at, at + target.length];
}

function ranked<T extends { n: string }>(
  entries: readonly T[],
  query: string,
  context: (entry: T) => string,
  cap: number,
): T[] {
  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry.n, context(entry), query) }))
    .filter((hit): hit is { entry: T; score: number } => hit.score !== null)
    .sort((a, b) => b.score - a.score || a.entry.n.localeCompare(b.entry.n, "en"))
    .slice(0, cap)
    .map((hit) => hit.entry);
}

const plural = (n: number, one: string, many: string) => (new Intl.PluralRules("en").select(n) === "one" ? one : many);

function handoff(query: string): PaletteGroup {
  return {
    id: "search",
    label: "Search",
    rows: [
      {
        id: "search-all",
        label: `Search the full library for “${query}”`,
        href: `/resources/?q=${encodeURIComponent(query)}`,
      },
    ],
  };
}

/**
 * The groups for a query. `index` is null until the jump index has loaded: the
 * input is usable at once, the fixed pages show on an empty query, and a typed
 * query offers the full-search handoff.
 */
export function searchPalette(
  index: PaletteIndex | null,
  raw: string,
  sections: readonly PaletteSection[] = [],
): PaletteGroup[] {
  const query = cleanQuery(raw);

  if (!query) {
    const groups: PaletteGroup[] = [
      {
        id: "goto",
        label: "Go to",
        rows: (index?.pages ?? PALETTE_PAGES)
          .slice(0, 7)
          .map((page) => ({ id: `goto-${page.href}`, label: page.n, href: page.href })),
      },
    ];
    if (sections.length > 0) {
      groups.push({
        id: "sections",
        label: "On this page",
        rows: sections.map((section) => ({
          id: `section-${section.id}`,
          label: section.label,
          href: `#${section.id}`,
          anchor: true,
        })),
      });
    }
    return groups;
  }

  if (!index) return [handoff(query)];

  const span = (name: string) => matchSpan(name, query);
  const groups: PaletteGroup[] = [
    {
      id: "listings",
      label: "Listings",
      rows: ranked(index.resources, query, (r) => r.c, GROUP_CAPS.listings).map((r) => ({
        id: `listing-${r.s}`,
        label: r.n,
        href: `/resources/${r.s}/`,
        secondary: r.c ? `${r.c} · ${r.f}` : r.f,
        meter: { k: r.k, u: r.u },
        match: span(r.n),
        official: r.o,
      })),
    },
    {
      id: "subjects",
      label: "Subjects",
      rows: ranked(index.subjects, query, (s) => s.g, GROUP_CAPS.subjects).map((s) => ({
        id: `subject-${s.s}`,
        label: s.n,
        href: `/categories/${s.s}/`,
        secondary: `${s.g} · ${s.count} ${plural(s.count, "listing", "listings")}`,
        match: span(s.n),
      })),
    },
    {
      id: "collections",
      label: "Collections",
      rows: ranked(index.collections, query, () => "", GROUP_CAPS.collections).map((c) => ({
        id: `collection-${c.s}`,
        label: c.n,
        href: `/collections/${c.s}/`,
        secondary: "Collection",
        match: span(c.n),
      })),
    },
    {
      id: "tools",
      label: "Tools",
      rows: ranked(index.tools, query, () => "", GROUP_CAPS.tools).map((t) => ({
        id: `tool-${t.s}`,
        label: t.n,
        href: `/tools/${t.s}/`,
        secondary: "Tool that runs in your browser",
        match: span(t.n),
      })),
    },
    {
      id: "alternatives",
      label: "Alternatives",
      rows: ranked(index.alternatives, query, () => "", GROUP_CAPS.alternatives).map((a) => ({
        id: `alternative-${a.s}`,
        label: `Free alternatives to ${a.n}`,
        href: `/alternatives/${a.s}/`,
        secondary: `${a.count} ${plural(a.count, "listing", "listings")}`,
      })),
    },
    {
      id: "audiences",
      label: "Audiences",
      rows: ranked(index.audiences, query, () => "", GROUP_CAPS.audiences).map((a) => ({
        id: `audience-${a.s}`,
        label: a.n,
        href: `/for/${a.s}/`,
        match: span(a.n),
      })),
    },
    {
      id: "filters",
      label: "Filter the library",
      rows: ranked(index.filters, query, () => "", GROUP_CAPS.filters).map((f) => ({
        id: `filter-${f.h}`,
        label: f.n,
        href: f.h,
        secondary: "Show matching listings",
        match: span(f.n),
      })),
    },
    {
      id: "pages",
      label: "Go to",
      rows: ranked(index.pages, query, () => "", GROUP_CAPS.pages).map((p) => ({
        id: `page-${p.href}`,
        label: p.n,
        href: p.href,
        match: span(p.n),
      })),
    },
  ].filter((group) => group.rows.length > 0) as PaletteGroup[];

  groups.push(handoff(query));
  return groups;
}

/** Every row in display order, for arrow-key movement. */
export function flattenRows(groups: readonly PaletteGroup[]): PaletteRow[] {
  return groups.flatMap((group) => group.rows);
}

/** The count announced to assistive technology: every row except the handoff. */
export function resultCount(groups: readonly PaletteGroup[]): number {
  return groups.filter((group) => group.id !== "search").reduce((sum, group) => sum + group.rows.length, 0);
}
