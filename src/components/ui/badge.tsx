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
 *
 * Gold is never a badge colour, and info blue is retired: `primary` and `info`
 * render exactly like `neutral`. `success` is for confirmed evidence only, and
 * its callers gate it on that evidence.
 *
 * `appearance="ledger"` is the same anatomy with no fill, for the compact tokens
 * that sit inside a record's facts zone.
 */

const neutral = "border-border bg-surface text-fg-muted";
const neutralLedger = "border-border bg-transparent text-fg-muted";

const tones: Record<StatusTone, string> = {
  success: "bg-success-soft text-success-fg border-success/30",
  info: neutral,
  primary: neutral,
  warning: "bg-warning-soft text-warning-fg border-warning/30",
  danger: "bg-danger-soft text-danger-fg border-danger/30",
  neutral,
};

function toneClasses(tone: StatusTone, appearance: "badge" | "ledger"): string {
  const classes = tones[tone];
  return appearance === "ledger" && classes === neutral ? neutralLedger : classes;
}

export interface BadgeProps {
  tone?: StatusTone;
  icon?: IconName;
  size?: "sm" | "md";
  appearance?: "badge" | "ledger";
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", icon, size = "sm", appearance = "badge", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        toneClasses(tone, appearance),
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
