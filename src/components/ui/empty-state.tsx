import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Empty state.
 *
 * Used wherever there is genuinely nothing to show. The project's position is
 * that an honest empty section is better than placeholder content that makes the
 * library look larger than it is, so this component is a first-class part of the
 * design system rather than an afterthought.
 *
 * Text-led: no icon disc. Every empty state should explain what would fill it and
 * offer a next step.
 */
export function EmptyState({
  title,
  description,
  action,
  className,
  compact = false,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-md border border-dashed border-border bg-bg-subtle text-center",
        compact ? "px-6 py-10" : "px-6 py-16",
        className,
      )}
    >
      <p className="text-base font-medium text-fg">{title}</p>
      {description ? <div className="mt-2 max-w-md text-sm text-fg-muted">{description}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
