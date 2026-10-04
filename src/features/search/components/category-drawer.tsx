"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { categoryGroups, type CategoryGroupId } from "@/config/categories";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

interface CategoryDrawerProps {
  resources: readonly Resource[];
  activeCategoryId?: string;
  activeCategoryName?: string;
  onSelectCategory: (categoryId: string | null) => void;
  className?: string;
}

interface NavItem {
  id: string | null;
  name: string;
  icon: IconName;
  count: number;
}

export function CategoryDrawer({
  resources,
  activeCategoryId,
  activeCategoryName = "All resources",
  onSelectCategory,
  className,
}: CategoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const handleSelect = (id: string | null) => {
    onSelectCategory(id);
    setIsOpen(false);
  };

  return (
    <div className={cn("w-full lg:hidden", className)}>
      {/* Mobile Category Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-left text-sm transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-medium text-fg-subtle">Category:</span>
          <span className="truncate font-semibold text-fg">{activeCategoryName}</span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0 text-xs text-fg-muted">
          <Icon name="chevron-down" size={16} className="text-fg-subtle" />
        </span>
      </button>

      {/* Drawer Overlay & Panel */}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select category"
          className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal / Bottom Sheet */}
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl sm:rounded-2xl border border-border bg-surface p-5 shadow-overlay animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h2 className="font-display text-base font-semibold text-fg">Browse by Category</h2>
                <p className="mt-0.5 text-xs text-fg-muted">Select an area to explore free resources</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close categories"
                className="flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto py-1 pr-1">
              <ul className="flex flex-col gap-1 list-none p-0 m-0">
                {navItems.map((item) => {
                  const isActive =
                    item.id === null
                      ? !activeCategoryId
                      : activeCategoryId === item.id;

                  return (
                    <li key={item.id ?? "all"}>
                      <button
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={cn(
                          "flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm transition-colors",
                          isActive
                            ? "bg-surface-raised font-medium text-fg border-l-2 border-primary"
                            : "text-fg-muted hover:bg-surface-hover hover:text-fg",
                        )}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <Icon
                            name={item.icon}
                            size={18}
                            className={cn(
                              "shrink-0",
                              isActive ? "text-primary" : "text-fg-subtle",
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                        </span>

                        <span
                          className={cn(
                            "shrink-0 rounded px-1.5 py-0.5 text-xs tabular-nums",
                            isActive
                              ? "bg-surface text-fg font-medium"
                              : "text-fg-subtle",
                          )}
                        >
                          {item.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
