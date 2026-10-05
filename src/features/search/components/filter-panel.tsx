"use client";

import { useId, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { categoryList } from "@/config/categories";
import { withBasePath } from "@/config/deployment";
import { listableFreeStatuses } from "@/config/free-status";
import { filterablePlatforms } from "@/config/platforms";
import { resourceTypeList } from "@/config/resource-types";
import { EvidenceMark } from "@/features/resources/components/evidence";
import { Legend } from "@/features/resources/components/legend";
import { PARAM } from "@/lib/search/params";
import { containsTerm, normalizeText } from "@/lib/search/tokenize";
import { cn } from "@/lib/utils/cn";
import type { ResourceFacets } from "@/types/search";

/**
 * Faceted filter panel.
 *
 * When to use: once per `/resources` view, as the sidebar from `lg` or inside the
 * filter sheet below it, never both at once (the explorer mounts one). When not
 * to use: on static lists, which link to filtered views instead.
 *
 * Keyboard: native checkboxes in `<fieldset>`s inside native `<details>` groups;
 * the subject narrow input clears on Escape; the Legend trigger opens a native
 * popover that Escape and an outside click dismiss.
 *
 * Evidence: the panel is split into two labelled regions so classification and
 * confirmation cannot be confused. "Confirmed by an official source" holds the
 * confirmed-only flags, whose counts are confirmed matches and whose hints say
 * how many more only record the value. "As recorded" holds classifications as
 * stored, which a match does not confirm.
 *
 * Three decisions worth recording:
 *
 * 1. It is a real `<form method="get">`. With JavaScript, `onChange` intercepts
 *    and navigates client-side, so filtering feels instant.
 * 2. Groups are `<fieldset>` with a `<legend>`. Screen readers announce the group
 *    name with each option, which is the difference between hearing "Windows" and
 *    "Platform, Windows".
 * 3. Options with a zero facet count are disabled rather than hidden. Hiding them
 *    makes the panel appear to change shape as you filter, and removes the useful
 *    information that the option exists but nothing currently matches.
 */

interface FilterPanelProps {
  facets: ResourceFacets;
  /** Total results for the current query, read by the status line. */
  resultCount: number;
  activeFilterCount: number;
  /** True while the explorer's navigation transition is pending. */
  isPending: boolean;
  /** Runs a client-side navigation inside the explorer's transition. */
  onNavigate: (href: string) => void;
  /** "sidebar" draws its own heading and edge; "sheet" leaves both to the sheet. */
  presentation?: "sidebar" | "sheet";
  /** Legend popover id: unique per mounted panel. */
  legendId?: string;
}

const noop = () => () => {};

export function FilterPanel({
  facets,
  resultCount,
  activeFilterCount,
  isPending,
  onNavigate,
  presentation = "sidebar",
  legendId = "legend-filters",
}: FilterPanelProps) {
  const searchParams = useSearchParams();
  const formId = useId();
  const confirmedId = useId();
  const recordedId = useId();

  const isChecked = (key: string, value: string) => searchParams.getAll(key).includes(value);
  const isFlagged = (key: string) => searchParams.get(key) === "1";

  /**
   * Applies a change by rebuilding the query string.
   *
   * Page is always reset: keeping `page=3` while narrowing the results lands the
   * user on an empty page, which reads as a bug.
   */
  const update = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete(PARAM.page);

    const queryString = params.toString();
    onNavigate(queryString ? `/resources?${queryString}` : "/resources");
  };

  const toggleValue = (key: string, value: string) => {
    update((params) => {
      const existing = params.getAll(key);
      params.delete(key);
      for (const entry of existing) {
        if (entry !== value) params.append(key, entry);
      }
      if (!existing.includes(value)) params.append(key, value);
    });
  };

  const toggleFlagParam = (key: string) => {
    update((params) => {
      if (params.get(key) === "1") params.delete(key);
      else params.set(key, "1");
    });
  };

  const clearAll = () => onNavigate(clearFiltersHref(searchParams));

  // Subjects are long; show the ones that currently have matches, plus any the
  // user has already selected so a selection never disappears from the panel.
  const visibleCategories = categoryList
    .filter((category) => (facets.categories[category.id] ?? 0) > 0 || isChecked(PARAM.category, category.id))
    .sort((a, b) => (facets.categories[b.id] ?? 0) - (facets.categories[a.id] ?? 0) || a.name.localeCompare(b.name));

  const visibleTypes = resourceTypeList
    .filter((type) => (facets.resourceTypes[type.id] ?? 0) > 0 || isChecked(PARAM.type, type.id))
    .sort((a, b) => (facets.resourceTypes[b.id] ?? 0) - (facets.resourceTypes[a.id] ?? 0));

  return (
    <form
      id={formId}
      method="get"
      action={withBasePath("/resources/")}
      onSubmit={(event) => {
        // JavaScript is available, so keep the navigation client-side.
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          if (typeof value === "string" && value.length > 0) params.append(key, value);
        }
        onNavigate(`/resources?${params.toString()}`);
      }}
    >
      {/* Preserves the text query and sort order across a no-JavaScript submit. */}
      <input type="hidden" name={PARAM.q} value={searchParams.get(PARAM.q) ?? ""} />
      <input type="hidden" name={PARAM.sort} value={searchParams.get(PARAM.sort) ?? ""} />

      <div className={cn("flex flex-col gap-6", presentation === "sidebar" ? "rounded-md border border-border bg-surface p-5" : "px-4 py-4")}>
        {presentation === "sidebar" ? (
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold">Filters</h2>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="rounded-xs text-xs text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
              >
                Clear all
              </button>
            ) : null}
          </div>
        ) : null}

        {/*
          Evidence filters. Each one only matches listings where an official
          source confirms the fact; a recorded but unchecked value, or an unknown
          one, never matches. The count of listings held back is shown beside each
          option rather than hidden, and the region says the rule up front.
        */}
        <section aria-labelledby={confirmedId} className="flex flex-col gap-3">
          <h3 id={confirmedId} className="text-sm font-semibold text-fg">
            Confirmed by an official source
          </h3>
          <p className="text-xs leading-snug text-fg-subtle">
            <EvidenceMark reason="confirmed" size={12} className="mr-1 inline" />
            Confirmed only: a listing matches when an official source confirms the fact.
          </p>
          <Legend variant="popover" id={legendId} />
          <FilterGroup legend="Facts">
            <FilterOption
              name={PARAM.noCreditCard}
              value="1"
              label="No credit card"
              hint={unconfirmedHint(facets.unconfirmed.noCreditCard)}
              count={facets.noCreditCard}
              checked={isFlagged(PARAM.noCreditCard)}
              onToggle={() => toggleFlagParam(PARAM.noCreditCard)}
            />
            <FilterOption
              name={PARAM.noAccount}
              value="1"
              label="No account needed"
              hint={unconfirmedHint(facets.unconfirmed.noAccount)}
              count={facets.noAccount}
              checked={isFlagged(PARAM.noAccount)}
              onToggle={() => toggleFlagParam(PARAM.noAccount)}
            />
            <FilterOption
              name={PARAM.commercialUse}
              value="1"
              label="Commercial use allowed"
              hint={unconfirmedHint(facets.unconfirmed.commercialUse)}
              count={facets.commercialUse}
              checked={isFlagged(PARAM.commercialUse)}
              onToggle={() => toggleFlagParam(PARAM.commercialUse)}
            />
            <FilterOption
              name={PARAM.openSource}
              value="1"
              label="Open source"
              hint={unconfirmedHint(facets.unconfirmed.openSource)}
              count={facets.openSource}
              checked={isFlagged(PARAM.openSource)}
              onToggle={() => toggleFlagParam(PARAM.openSource)}
            />
          </FilterGroup>
        </section>

        <section aria-labelledby={recordedId} className="flex flex-col gap-3 border-t border-rule pt-5">
          <h3 id={recordedId} className="text-sm font-semibold text-fg">
            As recorded <span className="font-normal text-fg-subtle">(not necessarily checked)</span>
          </h3>

          <FilterGroup
            legend="What “free” means"
            description="By each listing's recorded status. Each result shows whether its status is confirmed."
          >
            {listableFreeStatuses.map((status) => (
              <FilterOption
                key={status.id}
                name={PARAM.status}
                value={status.id}
                label={status.label}
                hint={status.summary}
                count={facets.freeStatuses[status.id] ?? 0}
                checked={isChecked(PARAM.status, status.id)}
                onToggle={() => toggleValue(PARAM.status, status.id)}
              />
            ))}
          </FilterGroup>

          {visibleCategories.length > 0 ? (
            <SubjectGroup names={visibleCategories.map((category) => category.name)}>
              {(matches) =>
                visibleCategories.map((category) => (
                  <FilterOption
                    key={category.id}
                    name={PARAM.category}
                    value={category.id}
                    label={category.name}
                    count={facets.categories[category.id] ?? 0}
                    checked={isChecked(PARAM.category, category.id)}
                    onToggle={() => toggleValue(PARAM.category, category.id)}
                    hidden={!matches(category.name)}
                  />
                ))
              }
            </SubjectGroup>
          ) : null}

          <FilterGroup legend="Platform">
            {filterablePlatforms.map((platform) => (
              <FilterOption
                key={platform.id}
                name={PARAM.platform}
                value={platform.id}
                label={platform.label}
                count={facets.platforms[platform.id] ?? 0}
                checked={isChecked(PARAM.platform, platform.id)}
                onToggle={() => toggleValue(PARAM.platform, platform.id)}
              />
            ))}
          </FilterGroup>

          {visibleTypes.length > 0 ? (
            <FilterGroup legend="Resource type">
              {visibleTypes.map((type) => (
                <FilterOption
                  key={type.id}
                  name={PARAM.type}
                  value={type.id}
                  label={type.label}
                  count={facets.resourceTypes[type.id] ?? 0}
                  checked={isChecked(PARAM.type, type.id)}
                  onToggle={() => toggleValue(PARAM.type, type.id)}
                />
              ))}
            </FilterGroup>
          ) : null}
        </section>

        {/*
          Filtering runs in the browser so that this route can be a static file
          with no server behind it. That means it genuinely needs JavaScript, and
          saying so is better than showing an Apply button that would navigate
          without filtering anything.
        */}
        <noscript>
          <div className="rounded-sm border border-border px-3.5 py-3 text-xs leading-relaxed text-fg-muted">
            <p className="font-medium text-fg">Filtering needs JavaScript</p>
            <p className="mt-1">
              These filters run in your browser. You can still browse the whole library by topic — every category page
              works without JavaScript.
            </p>
            <Link href="/categories" className="mt-2 inline-block text-fg underline underline-offset-2">
              Browse by category
            </Link>
          </div>
        </noscript>

        <p role="status" className="sr-only">
          {isPending ? "Updating results" : `${resultCount} results`}
        </p>
      </div>
    </form>
  );
}

/**
 * The URL with every filter removed and the text query and sort kept, so "Clear
 * all" in the sidebar and in the sheet footer build the same address.
 */
export function clearFiltersHref(searchParams: { get(name: string): string | null }): string {
  const params = new URLSearchParams();
  const query = searchParams.get(PARAM.q);
  const sort = searchParams.get(PARAM.sort);
  if (query) params.set(PARAM.q, query);
  if (sort) params.set(PARAM.sort, sort);
  const queryString = params.toString();
  return queryString ? `/resources?${queryString}` : "/resources";
}

/** "8 more record this, not verified" — what a confirmed-only filter holds back. */
function unconfirmedHint(count: number): string | undefined {
  if (count === 0) return undefined;
  return `${count} more ${count === 1 ? "listing records" : "listings record"} this, not verified`;
}

function FilterGroup({
  legend,
  description,
  children,
  before,
}: {
  legend: string;
  /** One line under the legend, stating how the group's filters decide a match. */
  description?: ReactNode;
  children: ReactNode;
  /** Rendered above the options, inside the group (the subject narrow input). */
  before?: ReactNode;
}) {
  return (
    // `<details>` gives keyboard operation, correct expanded state and
    // find-in-page support with no JavaScript at all.
    <details open className="motion-details group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xs py-1 text-xs font-semibold tracking-wide text-fg-muted uppercase [&::-webkit-details-marker]:hidden">
        {legend}
        <Icon
          name="chevron-down"
          size={14}
          className="motion-chevron group-open:rotate-180"
        />
      </summary>
      <fieldset className="mt-2">
        <legend className="sr-only">{legend}</legend>
        {description ? <p className="mb-3 text-xs leading-snug text-fg-subtle">{description}</p> : null}
        {before}
        <div className="flex flex-col gap-2.5">{children}</div>
      </fieldset>
    </details>
  );
}

/**
 * The Subject group with its type-to-narrow input. The input appears only after
 * hydration, hides non-matching rows, and never touches the URL or a checkbox.
 */
function SubjectGroup({
  names,
  children,
}: {
  names: readonly string[];
  children: (matches: (name: string) => boolean) => ReactNode;
}) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [narrow, setNarrow] = useState("");
  const inputId = useId();
  const term = normalizeText(narrow.trim());
  const matches = (name: string) => term.length === 0 || containsTerm(name, term);
  const anyMatch = names.some(matches);

  return (
    <FilterGroup
      legend="Subject"
      before={
        hydrated ? (
          <div className="mb-3">
            <label htmlFor={inputId} className="sr-only">
              Narrow subjects
            </label>
            <input
              id={inputId}
              type="search"
              autoComplete="off"
              maxLength={60}
              placeholder="Narrow subjects"
              value={narrow}
              onChange={(event) => setNarrow(event.target.value)}
              onKeyDown={(event) => {
                // Escape clears the narrow; it is cancelled here so a sheet
                // around the panel does not also close on the same key.
                if (event.key === "Escape" && narrow) {
                  event.preventDefault();
                  event.stopPropagation();
                  setNarrow("");
                }
              }}
              className="h-9 w-full rounded-xs border border-border-strong bg-bg px-2.5 text-sm placeholder:text-fg-subtle pointer-coarse:h-11"
            />
            <p role="status" className={anyMatch ? "sr-only" : "mt-2 text-xs text-fg-subtle"}>
              {anyMatch ? "" : `No subject matches “${narrow.trim()}”`}
            </p>
          </div>
        ) : null
      }
    >
      {children(matches)}
    </FilterGroup>
  );
}

function FilterOption({
  name,
  value,
  label,
  hint,
  count,
  checked,
  onToggle,
  hidden,
}: {
  name: string;
  value: string;
  label: string;
  hint?: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
  hidden?: boolean;
}) {
  // Disabled rather than removed: the option still exists, it just has no matches
  // right now, and a panel that reshuffles as you click is disorienting.
  const disabled = count === 0 && !checked;

  return (
    <label
      hidden={hidden}
      className={cn(
        "flex cursor-pointer items-start gap-2.5 text-sm",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
        className="mt-0.5 size-4 shrink-0"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-fg">{label}</span>
          <span className="shrink-0 text-xs text-fg-subtle tabular-nums" aria-hidden="true">
            {count}
          </span>
          <span className="sr-only">{count === 1 ? "1 result" : `${count} results`}</span>
        </span>
        {hint ? <span className="mt-0.5 block text-xs leading-snug text-fg-subtle">{hint}</span> : null}
      </span>
    </label>
  );
}
