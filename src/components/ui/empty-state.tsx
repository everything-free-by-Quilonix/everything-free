import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

/**
 * Empty state.
 *
 * Used wherever there is genuinely nothing to show. The project's position is
 * that an honest empty section is better than placeholder content that makes the
 * library look larger than it is, so this component is a first-class part of the
 * design system rather than an afterthought.
 *
 * Every empty state should explain what would fill it and offer a next step.
 */
export function EmptyState({
  icon = "compass",
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon?: IconName;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-bg-subtle text-center",
        compact ? "px-6 py-10" : "px-6 py-16",
        className,
      )}
    >
      <span
        className="mb-4 flex size-11 items-center justify-center rounded-full border border-border bg-surface text-fg-subtle"
        aria-hidden="true"
      >
        <Icon name={icon} size={20} />
      </span>
      <p className="text-base font-medium text-fg">{title}</p>
      {description ? <div className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">{description}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
