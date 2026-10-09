"use client";

import { useMemo } from "react";
import { categoryGroups } from "@/config/categories";
import { formatCount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

export interface CategoryTab {
  id: string;
  label: string;
  count: number;
}

export function CategoryFilterBar({
  resources,
  activeCategoryId = "all",
  onSelectCategory,
  disabled = false,
}: {
  resources: Resource[];
  activeCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  disabled?: boolean;
}) {
  // Dynamically compute counts from real resource data for each category group
  const tabs = useMemo<CategoryTab[]>(() => {
    const totalCount = resources.length;
    const groupCountMap: Record<string, number> = {};

    for (const group of categoryGroups) {
      const catSet = new Set(group.categoryIds);
      let count = 0;
      for (const r of resources) {
        if (catSet.has(r.category) || r.category === group.id) {
          count++;
        }
      }
      groupCountMap[group.id] = count;
    }

    const result: CategoryTab[] = [
      { id: "all", label: "All", count: totalCount },
      ...categoryGroups.map((group) => ({
        id: group.id,
        label: group.id === "education" ? "Students & Education" : group.name,
        count: groupCountMap[group.id] ?? 0,
      })),
    ];

    return result;
  }, [resources]);

  return (
    <nav aria-label="Category filters" className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const isSelected =
            (tab.id === "all" && (!activeCategoryId || activeCategoryId === "all")) ||
            activeCategoryId === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCategory(tab.id)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors select-none",
                isSelected
                  ? "border border-border-strong bg-surface-raised text-fg font-semibold shadow-2xs"
                  : "border border-border/60 bg-surface/50 text-fg-muted hover:border-border-strong hover:bg-surface-raised hover:text-fg",
                disabled && "pointer-events-none opacity-60",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "tabular-nums text-[11px] px-1.5 py-0.2 rounded-xs font-mono",
                  isSelected
                    ? "bg-bg text-fg font-semibold"
                    : "bg-bg-subtle text-fg-subtle",
                )}
              >
                {formatCount(tab.count)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
