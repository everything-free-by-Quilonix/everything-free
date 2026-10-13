"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, tabs]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (activeBtn) {
      const containerRect = el.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      if (btnRect.left < containerRect.left + 48 || btnRect.right > containerRect.right - 48) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [activeCategoryId]);

  const scrollByDirection = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = Math.max(200, Math.floor(el.clientWidth * 0.6));
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const maskStyle = useMemo<React.CSSProperties>(() => {
    if (canScrollLeft && canScrollRight) {
      return {
        maskImage:
          "linear-gradient(to right, transparent 0%, black 48px, black calc(100% - 48px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 48px, black calc(100% - 48px), transparent 100%)",
      };
    }
    if (canScrollLeft) {
      return {
        maskImage: "linear-gradient(to right, transparent 0%, black 48px, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 48px, black 100%)",
      };
    }
    if (canScrollRight) {
      return {
        maskImage: "linear-gradient(to right, black 0%, black calc(100% - 48px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black 0%, black calc(100% - 48px), transparent 100%)",
      };
    }
    return {};
  }, [canScrollLeft, canScrollRight]);

  return (
    <nav aria-label="Category filters" className="relative w-full">
      {/* Subtle left navigation chevron when scrollable left */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-2 z-10 hidden sm:flex items-center pr-3 pointer-events-none">
          <button
            type="button"
            onClick={() => scrollByDirection("left")}
            aria-label="Scroll categories left"
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-fg shadow-2xs transition-colors hover:bg-surface-raised hover:border-border-strong cursor-pointer"
          >
            <Icon name="chevron-left" size={14} />
          </button>
        </div>
      )}

      {/* Horizontally scrollable tabs with edge fade mask and hidden scrollbar */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        style={{
          ...maskStyle,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 no-scrollbar scrollbar-none scroll-smooth transition-[mask-image]"
      >
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

      {/* Subtle right navigation chevron when scrollable right */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2 z-10 hidden sm:flex items-center pl-3 pointer-events-none">
          <button
            type="button"
            onClick={() => scrollByDirection("right")}
            aria-label="Scroll categories right"
            className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-fg shadow-2xs transition-colors hover:bg-surface-raised hover:border-border-strong cursor-pointer"
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
      )}
    </nav>
  );
}
