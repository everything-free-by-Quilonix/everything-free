"use client";

import { useMemo } from "react";
import { Icon, type IconName } from "@/components/icons";
import { categoryGroups, type CategoryGroupId } from "@/config/categories";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

interface CategorySidebarProps {
  resources: readonly Resource[];
  activeCategoryId?: string;
  onSelectCategory: (categoryId: string | null) => void;
  className?: string;
}

interface NavItem {
  id: string | null;
  name: string;
  icon: IconName;
  count: number;
}

export function CategorySidebar({
  resources,
  activeCategoryId,
  onSelectCategory,
  className,
}: CategorySidebarProps) {
  // Precompute counts for each category group and total resources
  const { totalCount, groupCounts } = useMemo(() => {
    const counts = new Map<CategoryGroupId, number>();

    for (const group of categoryGroups) {
      const matchCount = resources.filter((r) => {
        const cats = [r.category, ...r.subcategories];
        return cats.some((c) => group.categoryIds.includes(c));
      }).length;
      counts.set(group.id, matchCount);
    }

    return {
      totalCount: resources.length,
      groupCounts: counts,
    };
  }, [resources]);

  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      {
        id: null,
        name: "All resources",
        icon: "grid",
        count: totalCount,
      },
    ];

    for (const group of categoryGroups) {
      items.push({
        id: group.id,
        name: group.name,
        icon: group.icon,
        count: groupCounts.get(group.id) ?? 0,
      });
    }

    return items;
  }, [totalCount, groupCounts]);

  return (
    <nav
      aria-label="Category navigation"
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 select-none",
        className,
      )}
    >
      <div className="px-3 pt-2 pb-2.5">
        <span className="text-[11px] font-semibold tracking-wider text-fg-subtle uppercase">
          Categories
        </span>
      </div>

      <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
        {navItems.map((item) => {
          const isActive =
            item.id === null
              ? !activeCategoryId
              : activeCategoryId === item.id;

          return (
            <li key={item.id ?? "all"}>
              <button
                type="button"
                onClick={() => onSelectCategory(item.id)}
                className={cn(
                  "group relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
                  isActive
                    ? "bg-surface-raised font-medium text-fg shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-primary"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    name={item.icon}
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors duration-150",
                      isActive
                        ? "text-primary"
                        : "text-fg-subtle group-hover:text-fg-muted",
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </span>

                <span
                  className={cn(
                    "shrink-0 rounded-md px-1.5 py-0.5 text-xs tabular-nums transition-colors duration-150",
                    isActive
                      ? "bg-surface text-fg font-medium"
                      : "text-fg-subtle group-hover:text-fg-muted",
                  )}
                >
                  {item.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
