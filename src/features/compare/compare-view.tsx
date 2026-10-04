"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Callout } from "@/components/ui/callout";
import { plural } from "@/components/ui/count";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cleanQuery, MAX_QUERY, scoreEntry } from "@/features/palette/palette-search";
import { EvidenceTag } from "@/features/resources/components/evidence";
import { FactMeter } from "@/features/resources/components/fact-meter";
import { Legend } from "@/features/resources/components/legend";
import { cn } from "@/lib/utils/cn";

import { compareIndexSchema, type CompareEntry, type CompareIndex } from "./compare-index-schema";
import { loadCompareIndex, resetCompareIndex } from "./compare-loader";
import {
  COMPARE_FACTS,
  COMPARE_ROWS,
  compareHref,
  diffRows,
  MAX_COMPARE,
  paritySentence,
  parseCompareSlugs,
  parseDiff,
  resolveCompare,
  type CompareRowId,
} from "./compare-params";

/**
 * Quick Compare: two or three listings side by side on objective fields, with
 * each value's evidence, the parity statement and the difference lens.
 *
 * When to use: only at `/compare/`, from the tray on `/resources` or a record's
 * "Compare with…". When not to use: as a ranking. It never scores, orders or
 * recommends; columns keep the order of the link.
 *
 * Keyboard: the table is a focusable scroll region; the row lens is a native
 * radio group; "Add a listing" is a combobox with a listbox popup (arrows move,
 * Enter adds, Escape clears). Removing a column moves focus to the table, or
 * to `#main` when the table gives way to the picker.
 *
 * Evidence: every cell's words and `data-evidence` come verbatim from the
 * build-time index (`factEvidence`, `hasRecordedValue`), validated by the
 * schema; nothing is derived here. "Unknown" stays Unknown and "Recorded as …"
 * is never upgraded. The parity sentence and the meters use the index's `t`.
 */

type Load = { state: "loading" } | { state: "ready"; index: CompareIndex } | { state: "error" };

const LENS = [
  { value: "all", label: "All rows" },
  { value: "diff", label: "Only differences" },
] as const;

export function CompareView() {
  const params = useSearchParams();
  const router = useRouter();

  const { slugs, truncated } = useMemo(() => parseCompareSlugs(params.getAll("r")), [params]);
  const diffOnly = parseDiff(params.get("diff"));

  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    let live = true;
    loadCompareIndex()
      .then((raw) => compareIndexSchema.parse(raw))
      .then(
        (index) => live && setLoad({ state: "ready", index }),
        (error: unknown) => {
          if (process.env.NODE_ENV !== "production") console.warn("compare index failed to load", error);
          if (live) setLoad({ state: "error" });
        },
      );
    return () => {
      live = false;
    };
  }, [attempt]);

  // "Loading…" only if the index is still missing after 150ms.
  useEffect(() => {
    if (load.state !== "loading") return;
    const timer = window.setTimeout(() => setSlow(true), 150);
    return () => window.clearTimeout(timer);
  }, [load.state, attempt]);

  const navigate = (nextSlugs: readonly string[], nextDiff = diffOnly) =>
    router.replace(compareHref(nextSlugs, nextDiff), { scroll: false });

  const index = load.state === "ready" ? load.index : null;
  const { found, missing } = useMemo(
    () => (index ? resolveCompare(slugs, index.entries) : { found: [] as CompareEntry[], missing: 0 }),
    [index, slugs],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Compare listings</h1>
        <p className="mt-3 max-w-(--measure-standfirst) text-base text-fg-muted">
          Two or three listings on the same fields, each value with its evidence. Nothing here is a ranking.
        </p>
      </div>

      {missing > 0 ? (
        <Callout tone="neutral" icon={null}>
          {missing} {plural(missing, "listing", "listings")} in this link {plural(missing, "was", "were")} not found and{" "}
          {plural(missing, "was", "were")} left out.
        </Callout>
      ) : null}
      {truncated ? (
        <Callout tone="neutral" icon={null}>
          Only the first {MAX_COMPARE} are compared.
        </Callout>
      ) : null}

      {load.state === "loading" ? (
        <div aria-busy="true">
          {slow ? (
            <p role="status" className="text-sm text-fg-muted">
              Loading the comparison…
            </p>
          ) : null}
        </div>
      ) : null}

      {load.state === "error" ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-fg">
            The comparison data could not load.{" "}
            <button
              type="button"
              className="link-inline rounded-xs"
              onClick={() => {
                resetCompareIndex();
                setSlow(false);
                setLoad({ state: "loading" });
                setAttempt((n) => n + 1);
              }}
            >
              Try again
            </button>
          </p>
          {slugs.length > 0 ? (
            <ul aria-label="Requested listings" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {slugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/resources/${slug}/`} className="link-inline" translate="no">
                    {slug}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {index && found.length < 2 ? (
        <div className="flex flex-col gap-4 border-t border-rule pt-6">
          <p className="text-base font-medium text-fg">Pick two or three listings to compare</p>
          {found.length === 1 ? (
            <p className="text-sm text-fg-muted">
              Selected: <span className="text-fg" translate="no">{found[0].n}</span>{" "}
              <button type="button" className="link-inline rounded-xs" onClick={() => navigate([])}>
                Remove
              </button>
            </p>
          ) : null}
          <Picker entries={index.entries} exclude={found.map((e) => e.s)} onPick={(s) => navigate([...found.map((e) => e.s), s])} />
        </div>
      ) : null}

      {index && found.length >= 2 ? (
        <CompareTable
          index={index}
          entries={found}
          diffOnly={diffOnly}
          onLens={(diff) => navigate(found.map((e) => e.s), diff)}
          onRemove={(slug) => navigate(found.map((e) => e.s).filter((s) => s !== slug))}
          onAdd={(slug) => navigate([...found.map((e) => e.s), slug])}
        />
      ) : null}
    </div>
  );
}

function CompareTable({
  index,
  entries,
  diffOnly,
  onLens,
  onRemove,
  onAdd,
}: {
  index: CompareIndex;
  entries: CompareEntry[];
  diffOnly: boolean;
  onLens: (diff: boolean) => void;
  onRemove: (slug: string) => void;
  onAdd: (slug: string) => void;
}) {
  const total = index.t;
  const differing = diffRows(entries, total);
  const lensOn = diffOnly && differing.size > 0;
  // Hidden rows are removed from the DOM, so table navigation matches the view.
  const rows = lensOn ? COMPARE_ROWS.filter((row) => differing.has(row.id)) : COMPARE_ROWS;
  const isFact = (id: CompareRowId) => (COMPARE_FACTS as readonly string[]).includes(id);

  return (
    <>
      <div className="flex flex-col gap-3 border-t border-rule pt-6">
        <p className="max-w-(--measure-standfirst) text-base text-fg">{paritySentence(entries, total)}</p>
        <Legend variant="popover" id="legend-compare" />
      </div>

      <SegmentedControl
        name="compare-rows"
        legend="Rows to show"
        value={lensOn ? "diff" : "all"}
        options={LENS}
        onChange={(value) => onLens(value === "diff")}
        disabled={differing.size === 0}
        disabledReason="These listings match on every compared field"
      />

      <div role="region" tabIndex={0} aria-label="Comparison table" className="overflow-x-auto rounded-md border border-border">
        <table className="w-full border-collapse text-sm tabular-nums">
          <caption className="sr-only">
            {entries.map((entry) => entry.n).join(", ")} compared on free status, licence, platforms, account and card
            requirements, commercial and personal use, open source, the last check and facts confirmed. Each fact states
            whether an official source confirms it.
          </caption>
          <thead>
            <tr className="border-b border-border bg-bg-subtle text-left align-top">
              <th scope="col" className="w-40 px-4 py-3 font-medium">
                <span className="sr-only">Field</span>
              </th>
              {entries.map((entry) => (
                <th key={entry.s} scope="col" className="min-w-44 px-4 py-3 font-medium">
                  <Link href={`/resources/${entry.s}/`} className="link-inline" translate="no">
                    {entry.n}
                  </Link>
                  <span className="mt-2 flex items-center gap-2">
                    <FactMeter confirmed={entry.k} unsettled={entry.u} total={total} />
                    <span className="sr-only">
                      {entry.k} of {total} facts confirmed
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      // The table stays with three columns; with two it gives way to the picker.
                      const target =
                        entries.length > 2
                          ? document.querySelector<HTMLElement>('[aria-label="Comparison table"]')
                          : document.getElementById("main");
                      target?.focus();
                      onRemove(entry.s);
                    }}
                    className="mt-2 rounded-xs text-xs font-normal text-fg-muted underline-offset-[0.2em] hover:text-fg hover:underline"
                  >
                    Remove<span className="sr-only"> {entry.n}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const differs = differing.has(row.id);
              return (
                <tr key={row.id} className="border-b border-rule align-top last:border-b-0">
                  <th
                    scope="row"
                    className={cn(
                      "px-4 py-3 text-left font-medium text-fg",
                      differs ? "border-s-2 border-s-border-strong" : "border-s-2 border-s-transparent",
                    )}
                  >
                    {differs ? <span className="kicker block text-fg">Differs</span> : null}
                    {row.label}
                  </th>
                  {entries.map((entry) => {
                    if (isFact(row.id)) {
                      const cell = entry.cells[row.id as keyof CompareEntry["cells"]];
                      return (
                        <td key={entry.s} data-fact={row.id} className="px-4 py-3">
                          <span className="flex flex-col gap-0.5">
                            <span className={cell.state === "confirmed" ? "text-fg" : "text-fg-muted"}>{cell.text}</span>
                            <EvidenceTag evidence={cell} className="font-normal" />
                          </span>
                        </td>
                      );
                    }
                    if (row.id === "lastChecked") {
                      return (
                        <td key={entry.s} className="px-4 py-3 text-fg-muted">
                          {entry.checked ?? <span className="text-fg-subtle">Never</span>}
                        </td>
                      );
                    }
                    return (
                      <td key={entry.s} className="px-4 py-3">
                        <FactMeter confirmed={entry.k} unsettled={entry.u} total={total} labelled />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {entries.length < MAX_COMPARE ? (
        <div className="flex flex-col gap-2">
          <Picker entries={index.entries} exclude={entries.map((e) => e.s)} onPick={onAdd} />
        </div>
      ) : null}
    </>
  );
}

/**
 * "Add a listing": the palette's scoring over the compare index names, as an
 * inline combobox (the palette's ARIA pattern, without the dialog).
 */
function Picker({
  entries,
  exclude,
  onPick,
}: {
  entries: readonly CompareEntry[];
  exclude: readonly string[];
  onPick: (slug: string) => void;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const trimmed = cleanQuery(query);

  const options = useMemo(() => {
    if (!trimmed) return [];
    return entries
      .filter((entry) => !exclude.includes(entry.s))
      .map((entry) => ({ entry, score: scoreEntry(entry.n, entry.c, trimmed) }))
      .filter((hit): hit is { entry: CompareEntry; score: number } => hit.score !== null)
      .sort((a, b) => b.score - a.score || a.entry.n.localeCompare(b.entry.n, "en"))
      .slice(0, 6)
      .map((hit) => hit.entry);
  }, [entries, exclude, trimmed]);

  const activeIndex = options.length === 0 ? -1 : Math.min(active, options.length - 1);
  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-opt-${i}`;
  const pick = (entry: CompareEntry) => {
    setQuery("");
    setActive(0);
    onPick(entry.s);
  };

  return (
    <div className="relative max-w-md">
      <label htmlFor={`${id}-input`} className="text-sm font-medium text-fg">
        Add a listing
      </label>
      <input
        id={`${id}-input`}
        type="text"
        role="combobox"
        aria-expanded={options.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        autoComplete="off"
        spellCheck={false}
        maxLength={MAX_QUERY}
        placeholder="Type a listing name"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && query !== "") {
            event.preventDefault();
            setQuery("");
            return;
          }
          if (options.length === 0) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive((activeIndex + step + options.length) % options.length);
          } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            pick(options[activeIndex]);
          }
        }}
        className="mt-1.5 h-11 w-full rounded-sm border border-border-strong bg-bg px-3 text-sm text-fg placeholder:text-fg-subtle"
      />
      <div id={listId} role="listbox" aria-label="Matching listings" className={options.length > 0 ? "material-elevated mt-1 rounded-md py-1" : undefined}>
        {options.map((entry, i) => (
          <div
            key={entry.s}
            id={optionId(i)}
            role="option"
            aria-selected={i === activeIndex}
            onPointerMove={() => setActive(i)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => pick(entry)}
            className={cn(
              // Selected, not focused: the input keeps DOM focus and the ring.
              // As in the palette, the active option takes a fill and a 2px
              // gold leading rule.
              "flex cursor-pointer items-baseline justify-between gap-3 border-s-2 border-transparent px-3 py-2 text-sm",
              i === activeIndex && "border-s-primary bg-surface-hover",
            )}
          >
            <span className="truncate text-fg" translate="no">
              {entry.n}
            </span>
            <span className="shrink-0 text-xs text-fg-muted">{entry.c}</span>
          </div>
        ))}
      </div>
      {trimmed && options.length === 0 ? (
        <p className="mt-2 text-sm text-fg-muted">No listing matches &ldquo;{trimmed}&rdquo;</p>
      ) : null}
    </div>
  );
}
