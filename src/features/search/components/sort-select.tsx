"use client";

import { useId } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { PARAM } from "@/lib/search/params";
import type { SortOption } from "@/types/search";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "recently-verified", label: "Recently checked" },
  { value: "recently-updated", label: "Recently updated" },
  { value: "name", label: "Name (A–Z)" },
];

/**
 * Sort control.
 *
 * "Best match" is only offered when there is a query to match against — an
 * option that silently does nothing is worse than one that is absent. A native
 * `<select>` is used rather than a custom listbox so that platform conventions,
 * keyboard handling and mobile pickers all work without reimplementation.
 *
 * Navigation is owned by `ResourceExplorer`: a sort change runs through the same
 * transition as a filter change, so the results region carries one pending state,
 * and the select is disabled while it runs so it cannot fire twice.
 */
export function SortSelect({
  hasQuery,
  isPending,
  onNavigate,
}: {
  hasQuery: boolean;
  isPending: boolean;
  onNavigate: (href: string) => void;
}) {
  const id = useId();
  const searchParams = useSearchParams();

  const options = hasQuery ? OPTIONS : OPTIONS.filter((option) => option.value !== "relevance");
  const current = searchParams.get(PARAM.sort) ?? (hasQuery ? "relevance" : "recently-verified");

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM.sort, value);
    params.delete(PARAM.page);
    onNavigate(`/resources?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="shrink-0 text-sm text-fg-muted">
        Sort
      </label>
      <div className="relative">
        <select
          id={id}
          value={current}
          disabled={isPending}
          onChange={(event) => handleChange(event.target.value)}
          className="max-w-36 appearance-none truncate rounded-sm border border-border-strong bg-surface py-2 pr-8 pl-3 text-sm text-fg transition-colors hover:border-fg-subtle disabled:opacity-60 sm:max-w-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={15}
          className="pointer-events-none absolute inset-y-0 right-2.5 my-auto text-fg-subtle"
        />
      </div>
    </div>
  );
}
