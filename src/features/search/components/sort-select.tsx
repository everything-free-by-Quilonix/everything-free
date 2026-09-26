"use client";

import { useId, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { PARAM } from "@/lib/search/params";
import type { SortOption } from "@/types/search";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "recently-verified", label: "Recently verified" },
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
 */
export function SortSelect({ hasQuery }: { hasQuery: boolean }) {
  const id = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const options = hasQuery ? OPTIONS : OPTIONS.filter((option) => option.value !== "relevance");
  const current = searchParams.get(PARAM.sort) ?? (hasQuery ? "relevance" : "recently-verified");

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM.sort, value);
    params.delete(PARAM.page);
    startTransition(() => router.push(`/resources?${params.toString()}`, { scroll: false }));
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
          className="appearance-none rounded-lg border border-border-strong bg-surface py-2 pr-8 pl-3 text-sm text-fg transition-colors hover:border-fg-subtle focus:border-primary focus:outline-none disabled:opacity-60"
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
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-subtle"
        />
      </div>
    </div>
  );
}
