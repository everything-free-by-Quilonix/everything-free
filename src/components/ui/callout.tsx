import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import type { StatusTone } from "@/config/free-status";
import { cn } from "@/lib/utils/cn";

/**
 * Inline notice for caveats, privacy statements and provenance notes.
 *
 * Carries an explicit `role` when the content is a warning a user must not miss,
 * so assistive technology announces it as an alert rather than as ordinary prose.
 */

const tones: Record<StatusTone, { wrapper: string; icon: string }> = {
  success: { wrapper: "border-success/30 bg-success-soft", icon: "text-success-fg" },
  info: { wrapper: "border-info/30 bg-info-soft", icon: "text-info-fg" },
  primary: { wrapper: "border-primary/30 bg-primary-soft", icon: "text-primary" },
  warning: { wrapper: "border-warning/30 bg-warning-soft", icon: "text-warning-fg" },
  danger: { wrapper: "border-danger/30 bg-danger-soft", icon: "text-danger-fg" },
  neutral: { wrapper: "border-border bg-surface-raised", icon: "text-fg-subtle" },
};

const defaultIcons: Record<StatusTone, IconName> = {
  success: "check-circle",
  info: "info",
  primary: "info",
  warning: "alert-triangle",
  danger: "alert-triangle",
  neutral: "info",
};

export function Callout({
  tone = "neutral",
  icon,
  title,
  children,
  className,
  /** Announce immediately. Reserve for content that changes a user's decision. */
  assertive = false,
}: {
  tone?: StatusTone;
  icon?: IconName;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  assertive?: boolean;
}) {
  const styles = tones[tone];

  return (
    <div
      role={assertive ? "alert" : undefined}
      className={cn("flex gap-3 rounded-lg border px-4 py-3.5", styles.wrapper, className)}
    >
      <Icon name={icon ?? defaultIcons[tone]} size={17} className={cn("mt-0.5 shrink-0", styles.icon)} />
      <div className="min-w-0 text-sm leading-relaxed">
        {title ? <p className="font-medium text-fg">{title}</p> : null}
        {children ? <div className={cn("text-fg-muted", title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  );
}
