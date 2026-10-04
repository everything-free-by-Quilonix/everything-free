"use client";

import { useMemo } from "react";
import { getCategoryGroup, getCategory, type CategoryGroupId } from "@/config/categories";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

interface SubcategoryPillsProps {
  groupId: CategoryGroupId;
  activeCategoryId?: string;
  onSelectSubcategory: (subcategoryId: string) => void;
  resources: readonly Resource[];
  className?: string;
}

export function SubcategoryPills({
  groupId,
  activeCategoryId,
  onSelectSubcategory,
  resources,
  className,
}: SubcategoryPillsProps) {
  const group = getCategoryGroup(groupId);

  const subcategoriesWithCounts = useMemo(() => {
    if (!group) return [];

    return group.categoryIds.map((cid) => {
      const category = getCategory(cid);
      const count = resources.filter((r) => {
        const cats = [r.category, ...r.subcategories];
        return cats.includes(cid);
      }).length;

      return {
        id: cid,
        name: category?.name ?? cid,
        count,
      };
    });
  }, [group, resources]);

  if (!group || subcategoriesWithCounts.length <= 1) {
    return null;
  }

  const isAllGroupSelected = activeCategoryId === groupId;

  return (
    <div
      role="region"
      aria-label={`${group.name} subcategories`}
      className={cn("flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none", className)}
    >
      {/* "All [Group]" pill */}
      <button
        type="button"
        onClick={() => onSelectSubcategory(groupId)}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isAllGroupSelected
            ? "bg-primary text-primary-fg shadow-xs"
            : "border border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
        )}
      >
        <span>All {group.name}</span>
      </button>

      {/* Individual subcategory pills */}
      {subcategoriesWithCounts.map((sub) => {
        const isSelected = activeCategoryId === sub.id;

        return (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelectSubcategory(sub.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isSelected
                ? "bg-primary text-primary-fg shadow-xs"
                : "border border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
            )}
          >
            <span>{sub.name}</span>
            {sub.count > 0 ? (
              <span
                className={cn(
                  "tabular-nums text-[11px]",
                  isSelected ? "text-primary-fg/80" : "text-fg-subtle",
                )}
              >
                {sub.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
