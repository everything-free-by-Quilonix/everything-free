"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/config/deployment";
import { listableFreeStatuses } from "@/config/free-status";
import { filterablePlatforms } from "@/config/platforms";
import { resourceTypeList } from "@/config/resource-types";
import { PARAM } from "@/lib/search/params";
import { cn } from "@/lib/utils/cn";
import type { ResourceFacets } from "@/types/search";

/**
 * Faceted filter panel.
 *
 * Three decisions worth recording:
 *
 * 1. It is a real `<form method="get">`. With JavaScript disabled the checkboxes
 *    and the Apply button still filter the library through an ordinary form
 *    submission. With JavaScript, `onChange` intercepts and does a client-side
 *    navigation instead, so filtering feels instant. Nothing here is
 *    JavaScript-only.
 *
 * 2. Groups are `<fieldset>` with a `<legend>`. Screen readers announce the group
 *    name with each option, which is the difference between hearing "Windows" and
 *    "Platform, Windows".
 *
 * 3. Options with a zero facet count are disabled rather than hidden. Hiding them
 *    makes the panel appear to change shape as you filter, and removes the useful
 *    information that the option exists but nothing currently matches.
 */

interface FilterPanelProps {
  facets: ResourceFacets;
  /** Total results for the current query, shown on the mobile toggle. */
  resultCount: number;
  activeFilterCount: number;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  className?: string;
}

export function FilterPanel({
  facets,
  resultCount,
  activeFilterCount,
  isOpen: controlledOpen,
  onToggleOpen,
  className,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalOpen(val);
    }
  };

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
    startTransition(() => {
      router.push(queryString ? `/resources?${queryString}` : "/resources", { scroll: false });
    });
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

  const clearAll = () => {
    update((params) => {
      const query = params.get(PARAM.q);
      const category = params.get(PARAM.category);
      const sort = params.get(PARAM.sort);
      for (const key of [...params.keys()]) params.delete(key);
      if (query) params.set(PARAM.q, query);
      if (category) params.set(PARAM.category, category);
      if (sort) params.set(PARAM.sort, sort);
    });
  };

  const visibleTypes = resourceTypeList
    .filter((type) => (facets.resourceTypes[type.id] ?? 0) > 0 || isChecked(PARAM.type, type.id))
    .sort((a, b) => (facets.resourceTypes[b.id] ?? 0) - (facets.resourceTypes[a.id] ?? 0));

  if (!open) {
    return null;
  }

  return (
    <div className={cn("w-full animate-in fade-in duration-200", className)}>
      <form
        id="filter-panel"
        method="get"
        action={withBasePath("/resources/")}
        className="block"
        onSubmit={(event) => {
          // JavaScript is available, so keep the navigation client-side.
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const params = new URLSearchParams();
          for (const [key, value] of formData.entries()) {
            if (typeof value === "string" && value.length > 0) params.append(key, value);
          }
          startTransition(() => router.push(`/resources?${params.toString()}`, { scroll: false }));
        }}
      >
        {/* Preserves the text query, category, and sort order across a no-JavaScript submit. */}
        <input type="hidden" name={PARAM.q} value={searchParams.get(PARAM.q) ?? ""} />
        <input type="hidden" name={PARAM.category} value={searchParams.get(PARAM.category) ?? ""} />
        <input type="hidden" name={PARAM.sort} value={searchParams.get(PARAM.sort) ?? ""} />

        <div
          className={cn(
            "flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-raised transition-opacity",
            isPending && "opacity-60",
          )}
          aria-busy={isPending}
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <Icon name="sliders" size={16} className="text-fg-subtle" />
              <h2 className="font-display text-sm font-semibold text-fg">Refine Filters</h2>
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                  {activeFilterCount} active
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded text-xs font-medium text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
                >
                  Clear all
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="flex size-7 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="close" size={15} />
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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

          {/*
            Evidence filters. Each one only matches listings where an official
            source confirms the fact; a recorded but unchecked value, or an unknown
            one, never matches. The count of listings held back is shown beside each
            option rather than hidden, and the group says the rule up front.
          */}
          <FilterGroup
            legend="Confirmed facts"
            description={
              <>
                <Icon name="check-circle" size={12} className="mr-1 inline text-success-fg" />
                Confirmed only: a listing matches when an official source confirms the fact.
              </>
            }
          >
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
            <FilterGroup legend="Resource type" collapsible defaultOpen={false}>
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
          </div>

          {/*
            Filtering runs in the browser so that this route can be a static file
            with no server behind it. That means it genuinely needs JavaScript, and
            saying so is better than showing an Apply button that would navigate
            without filtering anything.

            The library itself does not depend on this: every resource, category,
            collection and alternatives page is static HTML and works without
            JavaScript. Those are linked below.
          */}
          <noscript>
            <div className="rounded-lg border border-warning/30 bg-warning-soft px-3.5 py-3 text-xs leading-relaxed text-fg-muted">
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

          <div className="lg:hidden">
            <Button variant="secondary" size="md" className="w-full" onClick={() => setOpen(false)}>
              Show {resultCount} {resultCount === 1 ? "result" : "results"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
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
  collapsible = false,
  defaultOpen = true,
}: {
  legend: string;
  /** One line under the legend, stating how the group's filters decide a match. */
  description?: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  if (collapsible) {
    return (
      // `<details>` gives keyboard operation, correct expanded state and
      // find-in-page support with no JavaScript at all.
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer items-center justify-between rounded text-xs font-semibold tracking-wide text-fg-muted uppercase">
          {legend}
          <Icon
            name="chevron-down"
            size={14}
            className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <div className="mt-3 flex max-h-72 flex-col gap-2.5 overflow-y-auto pr-1">{children}</div>
      </details>
    );
  }

  return (
    <fieldset>
      <legend className="text-xs font-semibold tracking-wide text-fg-muted uppercase">{legend}</legend>
      {description ? <p className="mt-1.5 text-xs leading-snug text-fg-subtle">{description}</p> : null}
      <div className="mt-3 flex flex-col gap-2.5">{children}</div>
    </fieldset>
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
}: {
  name: string;
  value: string;
  label: string;
  hint?: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
}) {
  // Disabled rather than removed: the option still exists, it just has no matches
  // right now, and a panel that reshuffles as you click is disorienting.
  const disabled = count === 0 && !checked;

  return (
    <label
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
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-fg">{label}</span>
          <span className="shrink-0 text-xs text-fg-subtle" aria-hidden="true">
            {count}
          </span>
          <span className="sr-only">{count === 1 ? "1 result" : `${count} results`}</span>
        </span>
        {hint ? <span className="mt-0.5 block text-xs leading-snug text-fg-subtle">{hint}</span> : null}
      </span>
    </label>
  );
}
