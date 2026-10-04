"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";

import { plural } from "@/components/ui/count";
import { containsTerm, normalizeText } from "@/lib/search/tokenize";

import { AtlasIndex, type AtlasGroup } from "./atlas-index";

/**
 * "Find a subject": narrows the Atlas Index on `/categories` as you type.
 *
 * When to use: only on `/categories`, around the full index. When not to use:
 * on the homepage, where the index is a summary, or as the library search; it
 * never touches the URL or the listings.
 *
 * Keyboard: one text input; Escape clears it. Matching rows stay links in
 * reading order; groups with no remaining row are removed, and a polite count
 * ("{n} subjects") follows the narrowing.
 *
 * Evidence: none; it filters subject names, not facts.
 *
 * The input renders only after hydration, so without JavaScript the full
 * index shows and nothing on the page needs a script to work.
 */
const subscribe = () => () => {};

export function AtlasIndexFilter({ groups }: { groups: readonly AtlasGroup[] }) {
  const id = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [query, setQuery] = useState("");
  const term = normalizeText(query.trim().slice(0, 60));

  const narrowed = useMemo(() => {
    if (!term) return groups;
    return groups
      .map((group) => ({
        ...group,
        // The filter panel's subject narrow uses the same rule.
        subjects: group.subjects.filter((s) => containsTerm(s.name, term)),
      }))
      .filter((group) => group.subjects.length > 0);
  }, [groups, term]);

  // A subject in two groups is one subject.
  const shown = new Set(narrowed.flatMap((group) => group.subjects.map((s) => s.id))).size;

  return (
    <div className="flex flex-col gap-8">
      {hydrated ? (
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <div className="w-full max-w-sm">
            <label htmlFor={`${id}-find`} className="text-sm font-medium text-fg">
              Find a subject
            </label>
            <input
              id={`${id}-find`}
              type="search"
              autoComplete="off"
              spellCheck={false}
              maxLength={60}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && query !== "") {
                  event.preventDefault();
                  setQuery("");
                }
              }}
              className="mt-1.5 h-11 w-full rounded-sm border border-border-strong bg-bg px-3 text-sm text-fg placeholder:text-fg-subtle"
            />
          </div>
          <p aria-live="polite" className="pb-3 text-sm text-fg-muted tabular-nums">
            {term ? `${shown} ${plural(shown, "subject", "subjects")}` : ""}
          </p>
        </div>
      ) : null}

      {narrowed.length > 0 ? (
        <AtlasIndex groups={narrowed} headingLevel="h2" anchors />
      ) : (
        <p className="text-sm text-fg-muted">No subject matches &ldquo;{query.trim()}&rdquo;</p>
      )}
    </div>
  );
}
