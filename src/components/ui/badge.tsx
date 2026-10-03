import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import type { StatusTone } from "@/config/free-status";
import { cn } from "@/lib/utils/cn";

/**
 * Status badge.
 *
 * Every badge carries text. Tone is an additional signal, never the only one —
 * a colour-blind user, a user in high-contrast mode and a screen-reader user all
 * get the same information (WCAG 1.4.1).
 */

const tones: Record<StatusTone, string> = {
  success: "bg-success-soft text-success-fg border-success/30",
  info: "bg-info-soft text-info-fg border-info/30",
  primary: "bg-primary-soft text-primary border-primary/30",
  warning: "bg-warning-soft text-warning-fg border-warning/30",
  danger: "bg-danger-soft text-danger-fg border-danger/30",
  neutral: "bg-surface-raised text-fg-muted border-border-strong",
};

export interface BadgeProps {
  tone?: StatusTone;
  icon?: IconName;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", icon, size = "sm", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        tones[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={size === "sm" ? 12 : 14} className="shrink-0" /> : null}
      {children}
    </span>
  );
}

/** Low-emphasis label for tags and metadata. */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs bg-surface-raised px-2 py-0.5 text-xs text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
