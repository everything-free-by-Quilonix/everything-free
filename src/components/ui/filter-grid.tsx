"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";

const CELL = { type: "spring", stiffness: 520, damping: 36, mass: 0.45 } as const;
const MOVE = { type: "spring", stiffness: 280, damping: 32, mass: 0.75 } as const;
const EASE = [0.23, 1, 0.32, 1] as const;
const LEAVE = { duration: 0.14, ease: [0.4, 0, 1, 1] } as const;
const INSTANT = { duration: 0 } as const;

export type FilterDefinition<T> = {
  id: string;
  label: string;
  match: (item: T) => boolean;
};

export type UseFilterGridOptions<T> = {
  items: readonly T[];
  filters: readonly FilterDefinition<T>[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  counts?: Record<string, number>;
  total?: number;
};

export type UseFilterGridResult<T> = {
  active: string;
  activeLabel: string;
  select: (id: string) => void;
  visible: T[];
  counts: Record<string, number>;
  total: number;
};

export function useFilterGrid<T>({
  items,
  filters,
  value,
  defaultValue,
  onValueChange,
  counts: externalCounts,
  total: externalTotal,
}: UseFilterGridOptions<T>): UseFilterGridResult<T> {
  const fallback = filters[0]?.id ?? "";
  const [internal, setInternal] = useState(() => defaultValue ?? fallback);

  const requested = value !== undefined ? value : internal;
  const current = filters.find((f) => f.id === requested) ?? filters[0];
  const active = current?.id ?? fallback;

  const counts = useMemo(() => {
    if (externalCounts) return externalCounts;
    const next: Record<string, number> = {};
    for (const filter of filters) {
      let n = 0;
      for (const item of items) {
        if (filter.match(item)) n += 1;
      }
      next[filter.id] = n;
    }
    return next;
  }, [filters, items, externalCounts]);

  const visible = useMemo(() => {
    const filter = filters.find((f) => f.id === active);
    if (!filter) return [...items];
    return items.filter((item) => filter.match(item));
  }, [filters, items, active]);

  const select = useCallback(
    (id: string) => {
      if (value === undefined) setInternal(id);
      if (id !== active) onValueChange?.(id);
    },
    [value, active, onValueChange],
  );

  return {
    active,
    activeLabel: current?.label ?? "",
    select,
    visible,
    counts,
    total: externalTotal !== undefined ? externalTotal : items.length,
  };
}

export type FilterGridProps<T> = {
  items: readonly T[];
  filters: readonly FilterDefinition<T>[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  columns?: number;
  rowHeight?: number;
  maxRows?: number;
  gap?: number;
  emptyLabel?: string;
  className?: string;
  counts?: Record<string, number>;
  total?: number;
  autoHeight?: boolean;
};

export function FilterGrid<T>({
  items,
  filters,
  getKey,
  renderItem,
  label,
  value,
  defaultValue,
  onValueChange,
  columns = 3,
  rowHeight,
  maxRows,
  gap = 20,
  emptyLabel = "Nothing matches this filter",
  className = "",
  counts: externalCounts,
  total: externalTotal,
  autoHeight = true,
}: FilterGridProps<T>) {
  const uid = useId();
  const gridId = `${uid}-grid`;
  const reduced = useReducedMotion();

  const { active, activeLabel, select, visible, counts, total } = useFilterGrid({
    items,
    filters,
    value,
    defaultValue,
    onValueChange,
    counts: externalCounts,
    total: externalTotal,
  });

  const gridRef = useRef<HTMLUListElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const heldFocus = useRef(false);

  const index = Math.max(
    0,
    filters.findIndex((f) => f.id === active),
  );

  const choose = useCallback(
    (id: string) => {
      const grid = gridRef.current;
      heldFocus.current =
        !!grid && grid.contains(document.activeElement) && grid !== document.activeElement;
      select(id);
    },
    [select],
  );

  const settle = useCallback(() => {
    if (!heldFocus.current) return;
    heldFocus.current = false;
    const grid = gridRef.current;
    if (grid && !grid.contains(document.activeElement)) grid.focus();
  }, []);

  const go = useCallback(
    (i: number) => {
      const next = filters[(i + filters.length) % filters.length];
      if (!next) return;
      chips.current[(i + filters.length) % filters.length]?.focus();
      choose(next.id);
    },
    [filters, choose],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(filters.length - 1);
    }
  };

  const swap = reduced ? INSTANT : CELL;
  const step = reduced ? INSTANT : { layout: MOVE, duration: 0.22, ease: EASE };
  const leave = reduced ? INSTANT : LEAVE;

  // Grid column classes based on columns prop
  const colsClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  // Fixed scrollbox mode if autoHeight is explicitly disabled and rowHeight/maxRows specified
  const isScrollBox = !autoHeight && rowHeight && maxRows;
  const cols = Math.max(1, Math.floor(columns));
  const rows = isScrollBox
    ? Math.min(Math.max(1, Math.ceil(total / cols)), Math.max(1, maxRows))
    : 1;
  const boxHeight = isScrollBox ? rows * rowHeight + (rows - 1) * gap : undefined;

  return (
    <div className={cn("w-full", className)}>
      {/* Segmented Filter Control Navigation */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div
          role="radiogroup"
          aria-label={label}
          aria-controls={gridId}
          className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-none"
        >
          {filters.map((filter, i) => {
            const on = i === index;
            const count = counts[filter.id] ?? 0;
            return (
              <button
                key={filter.id}
                ref={(node) => {
                  chips.current[i] = node;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={on ? 0 : -1}
                onClick={() => choose(filter.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group relative inline-grid h-8.5 shrink-0 select-none place-items-center rounded-[8px] px-3 outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
                )}
                style={{ touchAction: "manipulation" }}
              >
                {/* Active Sliding Thumb Pill */}
                {on ? (
                  <motion.span
                    aria-hidden
                    layoutId={reduced ? undefined : `${uid}-thumb`}
                    transition={CELL}
                    className="absolute inset-0 rounded-[8px] bg-stone-900 shadow-sm dark:bg-stone-100"
                  />
                ) : null}

                {/* Inactive Subtle Border & Background */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 rounded-[8px] border transition-colors",
                    on
                      ? "border-transparent"
                      : "border-border/80 bg-surface/70 group-hover:bg-surface-raised group-hover:border-border-strong",
                  )}
                />

                {/* Overlaid Animated Typography Layers */}
                <span className="relative col-start-1 row-start-1 inline-grid">
                  {/* Inactive state label */}
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ opacity: on ? 0 : 1 }}
                    transition={swap}
                    className="col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-fg-muted group-hover:text-fg"
                  >
                    <span>{filter.label}</span>
                    <span className="text-[10.5px] font-mono tabular-nums text-fg-subtle">
                      {count}
                    </span>
                  </motion.span>

                  {/* Active state label */}
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={swap}
                    className="col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-semibold text-stone-50 dark:text-stone-900"
                  >
                    <span>{filter.label}</span>
                    <span className="text-[10.5px] font-mono tabular-nums opacity-80">
                      {count}
                    </span>
                  </motion.span>

                  <span className="sr-only">
                    {filter.label}, {count} of {total}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative mt-6">
        <ul
          id={gridId}
          ref={gridRef}
          tabIndex={-1}
          aria-label={label}
          className={cn(
            "relative list-none outline-none",
            isScrollBox ? "overflow-y-auto overscroll-contain [scrollbar-gutter:stable]" : "",
            `grid ${colsClass}`,
          )}
          style={{
            gap: `${gap}px`,
            height: boxHeight ? `${boxHeight}px` : undefined,
          }}
        >
          <AnimatePresence initial={false} mode="popLayout" onExitComplete={settle}>
            {visible.map((item) => (
              <motion.li
                key={getKey(item)}
                layout={reduced ? false : "position"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: leave }}
                transition={step}
                className="flex min-w-0"
              >
                {renderItem(item)}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Empty State */}
        <AnimatePresence initial={false}>
          {visible.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: leave }}
              transition={reduced ? INSTANT : { duration: 0.2, ease: EASE }}
              className="py-16 text-center"
            >
              <p className="text-sm font-medium text-fg-muted">{emptyLabel}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="sr-only">
        {activeLabel}: {visible.length} of {total} shown
      </p>
    </div>
  );
}
