import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Key/value presentation built on a real `<dl>`, styled as a ledger.
 *
 * A table or a grid of divs would look identical and mean nothing. Description
 * lists let assistive technology pair each term with its value, which is what
 * makes the resource fact panel navigable rather than a wall of text.
 *
 * From `sm` a dotted leader runs from the term to the value column (motif M4).
 * It is an empty, hidden span inside the `dt`, so the term's text is exactly
 * the term and nothing reads it aloud.
 */

export interface DataItem {
  term: string;
  value: ReactNode;
  /** Clarifies where the fact came from or what it does not cover. */
  note?: ReactNode;
}

export function DataList({ items, className }: { items: DataItem[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <dl className={cn("divide-y divide-rule border-y border-rule", className)}>
      {items.map((item) => (
        <div key={item.term} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-4">
          <dt className="flex items-baseline gap-2 text-sm text-fg-muted">
            {item.term}
            <span aria-hidden="true" className="hidden flex-1 border-b border-dotted border-rule sm:block" />
          </dt>
          <dd className="text-sm text-fg">
            {item.value}
            {item.note ? <p className="mt-1 text-xs text-fg-muted">{item.note}</p> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
