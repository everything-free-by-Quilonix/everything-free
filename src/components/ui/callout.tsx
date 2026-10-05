import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import type { StatusTone } from "@/config/free-status";
import { cn } from "@/lib/utils/cn";

/**
 * Inline notice for caveats, privacy statements and provenance notes.
 *
 * Carries an explicit `role` when the content is a warning a user must not miss,
 * so assistive technology announces it as an alert rather than as ordinary prose.
 *
 * `primary` and `info` render as `neutral`: gold is not a notice colour and info
 * blue is retired. `icon={null}` renders no icon; leaving `icon` undefined keeps
 * the tone's default. The four evidence glyphs are never a default here, because
 * they mean only the evidence reasons printed in the Legend.
 */

const neutral = { wrapper: "border-border bg-surface-raised", icon: "text-fg-subtle" };

const tones: Record<StatusTone, { wrapper: string; icon: string }> = {
  success: { wrapper: "border-success/30 bg-success-soft", icon: "text-success-fg" },
  info: neutral,
  primary: neutral,
  warning: { wrapper: "border-warning/30 bg-warning-soft", icon: "text-warning-fg" },
  danger: { wrapper: "border-danger/30 bg-danger-soft", icon: "text-danger-fg" },
  neutral,
};

const defaultIcons: Record<StatusTone, IconName> = {
  success: "check",
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
  id,
  /** Announce immediately. Reserve for content that changes a user's decision. */
  assertive = false,
}: {
  tone?: StatusTone;
  icon?: IconName | null;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Set when the notice is a link or focus target. */
  id?: string;
  assertive?: boolean;
}) {
  const styles = tones[tone];
  const iconName = icon === null ? null : (icon ?? defaultIcons[tone]);

  return (
    <div
      id={id}
      role={assertive ? "alert" : undefined}
      className={cn("flex gap-3 rounded-sm border px-4 py-3.5", styles.wrapper, className)}
    >
      {iconName ? <Icon name={iconName} size={17} className={cn("mt-0.5 shrink-0", styles.icon)} /> : null}
      <div className="min-w-0 text-sm leading-relaxed">
        {title ? <p className="font-medium text-fg">{title}</p> : null}
        {children ? <div className={cn("text-fg-muted", title && "mt-1")}>{children}</div> : null}
      </div>
    </div>
  );
}
