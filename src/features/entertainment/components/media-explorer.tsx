"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { plural } from "@/components/ui/count";
import { EmptyState } from "@/components/ui/empty-state";
import { accessTypeDefinitions, formatDefinitions, languageName } from "@/config/media";
import { getPlatform } from "@/config/platforms";
import type { DiscoveryLabel } from "@/lib/entertainment/labels";
import {
  countMediaFilters,
  emptyMediaQuery,
  mediaFacets,
  parseMediaQuery,
  runMediaQuery,
  serializeMediaQuery,
  type MediaQuery,
  type MediaSort,
} from "@/lib/entertainment/query";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/utils/format";
import type { MediaAccessType, MediaFormat } from "@/types/media";
import type { Platform, Resource } from "@/types/resource";

import { MediaGrid } from "./media-card";

/**
 * Search, filter and sort for an entertainment shelf.
 *
 * Every control writes to the query string, so a filtered view is a shareable,
 * bookmarkable URL and the back button works. Filtering runs in the browser over
 * the listings rendered into the page; the static HTML (the Suspense fallback)
 * is the same unfiltered set, so nothing depends on JavaScript to be readable.
 */

const FLAG_FILTERS: { key: keyof MediaQuery; label: string; hint: string }[] = [
  { key: "browserPlay", label: "Plays in browser", hint: "The listing's own page is where the game is played; nothing to install." },
  { key: "india", label: "Available in India", hint: "A source read during verification says it works in India." },
  { key: "download", label: "Free download", hint: "The content can legally be downloaded at no cost." },
  { key: "openSource", label: "Open source (confirmed)", hint: "Licence confirmed from the project's own pages." },
  { key: "noAccount", label: "No account (confirmed)", hint: "An official page confirms no account is needed." },
  { key: "creatorUse", label: "Reuse allowed", hint: "Content licence (public domain or open) permits reuse, per a cited source." },
  { key: "contentOnly", label: "Hide discovery guides", hint: "Only listings that provide the content themselves." },
];

const SORT_LABELS: Record<MediaSort, string> = {
  relevance: "Most relevant",
  "recently-added": "Recently added",
  "recently-verified": "Recently checked",
  name: "Name",
};

function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chip({
  pressed,
  onClick,
  children,
  count,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-xs transition-colors pointer-coarse:py-2",
        pressed
          ? "border-fg bg-fg text-bg"
          : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
      {count !== undefined ? <span className={cn("tabular-nums", pressed ? "text-bg/70" : "text-fg-subtle")}>{count}</span> : null}
    </button>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-2xs font-semibold uppercase tracking-widest text-fg-subtle">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

export function MediaExplorer({
  resources,
  formats,
  labelsBySlug,
  label,
}: {
  resources: Resource[];
  /** The shelf's formats, in display order. */
  formats: MediaFormat[];
  labelsBySlug: Record<string, DiscoveryLabel[]>;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = useMemo(() => parseMediaQuery(new URLSearchParams(searchParams.toString())), [searchParams]);
  const [text, setText] = useState(query.q ?? "");

  const navigate = (next: MediaQuery) => {
    startTransition(() => router.replace(`${pathname}${serializeMediaQuery(next)}`, { scroll: false }));
  };

  // Debounced free-text search, so typing does not push a history entry per key.
  useEffect(() => {
    const trimmed = text.trim();
    if (trimmed === (query.q ?? "")) return;
    const id = window.setTimeout(() => navigate({ ...query, q: trimmed || undefined }), 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigate is recreated each render by design
  }, [text]);

  const result = useMemo(() => runMediaQuery(resources, query), [resources, query]);
  const facets = useMemo(() => mediaFacets(resources), [resources]);
  const active = countMediaFilters(query);

  const shownFormats = formats.filter((f) => facets.formats[f]);
  const shownAccess = (Object.keys(facets.access) as MediaAccessType[])
    .filter((a) => a !== "unknown")
    .sort((a, b) => facets.access[b] - facets.access[a]);
  const shownLanguages = Object.keys(facets.languages)
    .filter((l) => l !== "multi")
    .sort((a, b) => facets.languages[b] - facets.languages[a])
    .slice(0, 14);
  const shownPlatforms = (Object.keys(facets.platforms) as Platform[]).sort((a, b) => facets.platforms[b] - facets.platforms[a]);
  const shownGenres = Object.keys(facets.genres)
    .filter((g) => facets.genres[g] > 1)
    .sort((a, b) => facets.genres[b] - facets.genres[a])
    .slice(0, 18);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="media-search" className="sr-only">
          Search {label}
        </label>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3">
          <Icon name="search" size={16} className="shrink-0 text-fg-subtle" />
          <input
            id="media-search"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by name, genre, language, provider…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xs bg-transparent py-2.5 text-sm text-fg placeholder:text-fg-subtle"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <span>Sort</span>
          <select
            value={query.sort}
            onChange={(e) => navigate({ ...query, sort: e.target.value as MediaSort })}
            className="rounded-sm border border-border bg-surface px-2 py-2 text-sm text-fg"
          >
            {(Object.keys(SORT_LABELS) as MediaSort[]).map((sort) => (
              <option key={sort} value={sort}>
                {SORT_LABELS[sort]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {shownFormats.length > 1 ? (
          <FilterGroup legend="Format">
            {shownFormats.map((format) => (
              <Chip
                key={format}
                pressed={query.formats.includes(format)}
                count={facets.formats[format]}
                onClick={() => navigate({ ...query, formats: toggle(query.formats, format) })}
              >
                {formatDefinitions[format].label}
              </Chip>
            ))}
          </FilterGroup>
        ) : null}

        <FilterGroup legend="Show only">
          {FLAG_FILTERS.map((flag) => (
            <span key={flag.key} title={flag.hint} className="inline-flex">
              <Chip pressed={Boolean(query[flag.key])} onClick={() => navigate({ ...query, [flag.key]: !query[flag.key] })}>
                {flag.label}
              </Chip>
            </span>
          ))}
        </FilterGroup>

        <details className="group rounded-md border border-border bg-bg-subtle px-4 py-3" open={active > 0 && query.access.length + query.languages.length + query.platforms.length + query.genres.length > 0}>
          <summary className="cursor-pointer select-none text-sm font-medium text-fg">
            Access, language, device and genre
          </summary>
          <div className="mt-4 flex flex-col gap-5">
            <FilterGroup legend="What is free">
              {shownAccess.map((access) => (
                <span key={access} title={accessTypeDefinitions[access].summary} className="inline-flex">
                  <Chip
                    pressed={query.access.includes(access)}
                    count={facets.access[access]}
                    onClick={() => navigate({ ...query, access: toggle(query.access, access) })}
                  >
                    {accessTypeDefinitions[access].label}
                  </Chip>
                </span>
              ))}
            </FilterGroup>
            {shownLanguages.length > 0 ? (
              <FilterGroup legend="Content language">
                {shownLanguages.map((code) => (
                  <Chip
                    key={code}
                    pressed={query.languages.includes(code)}
                    count={facets.languages[code]}
                    onClick={() => navigate({ ...query, languages: toggle(query.languages, code) })}
                  >
                    {languageName(code)}
                  </Chip>
                ))}
              </FilterGroup>
            ) : null}
            {shownPlatforms.length > 0 ? (
              <FilterGroup legend="Device">
                {shownPlatforms.map((platform) => (
                  <Chip
                    key={platform}
                    pressed={query.platforms.includes(platform)}
                    count={facets.platforms[platform]}
                    onClick={() => navigate({ ...query, platforms: toggle(query.platforms, platform) })}
                  >
                    {getPlatform(platform).shortLabel}
                  </Chip>
                ))}
              </FilterGroup>
            ) : null}
            {shownGenres.length > 0 ? (
              <FilterGroup legend="Genre">
                {shownGenres.map((genre) => (
                  <Chip
                    key={genre}
                    pressed={query.genres.includes(genre)}
                    count={facets.genres[genre]}
                    onClick={() => navigate({ ...query, genres: toggle(query.genres, genre) })}
                  >
                    {genre}
                  </Chip>
                ))}
              </FilterGroup>
            ) : null}
          </div>
        </details>
      </div>

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted tabular-nums" aria-live="polite">
          {formatCount(result.total)} {plural(result.total, "listing", "listings")}
          {active > 0 || query.q ? ` matching` : ""}
          {isPending ? <span className="sr-only"> (updating)</span> : null}
        </p>
        {active > 0 || query.q ? (
          <button
            type="button"
            onClick={() => {
              setText("");
              navigate(emptyMediaQuery());
            }}
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            <Icon name="close" size={14} />
            Clear filters
          </button>
        ) : null}
      </div>

      {result.items.length > 0 ? (
        <MediaGrid resources={result.items} labelsBySlug={labelsBySlug} reasonsBySlug={result.reasonsBySlug} label={label} />
      ) : (
        <EmptyState
          title="Nothing matches all of those filters"
          description="Filters only match facts a source has confirmed, so a listing whose detail is unknown is left out rather than guessed. Remove a filter to see more."
          action={
            <button
              type="button"
              onClick={() => {
                setText("");
                navigate(emptyMediaQuery());
              }}
              className={buttonClasses({ variant: "secondary" })}
            >
              Clear filters
            </button>
          }
        />
      )}
    </div>
  );
}
