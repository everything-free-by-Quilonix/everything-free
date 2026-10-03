import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Surface container, CONTENT material.
 *
 * When to use: only where a grouped object needs an edge, such as a tool entry or
 * a definition or form panel. When not to use: records, the record page, the
 * Verification panel and section containers, which are ruled rather than boxed.
 *
 * `interactive` adds hover and focus-within affordances for cards that contain a
 * primary link. The pattern used throughout is a stretched link inside a
 * `relative` card: the whole card is clickable, but the accessible name and the
 * focus target remain the single real anchor, so keyboard and screen-reader users
 * get one stop rather than several. The inner link draws the focus outline.
 */
export function Card({
  children,
  className,
  interactive = false,
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li";
  /** Set when the card is a link target, e.g. an anchored definition. */
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative rounded-md border border-border bg-surface",
        interactive &&
          "transition-colors focus-within:border-border-strong focus-within:bg-surface-hover hover:border-border-strong hover:bg-surface-hover active:bg-(--fill-pressed)",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Expands a link to cover its nearest positioned ancestor.
 *
 * Applied to the single anchor inside an interactive card.
 */
export const stretchedLink = "after:absolute after:inset-0 after:content-['']";
