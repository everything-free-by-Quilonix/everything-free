import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Premium Liquid Glass Button System.
 *
 * Designed with quiet physicality:
 * - Highly rounded capsule or structured rounded-xl geometry.
 * - Translucent surface with delicate optical boundary and top rim highlight.
 * - Layered ambient and contact depth that responds naturally to hover and press.
 * - Full WCAG 2.1 AA keyboard focus outline and touch-friendly target sizing (≥44px).
 *
 * Exported as both `buttonClasses()` (for Next.js `<Link>` elements and raw anchors)
 * and the `<Button>` component for native interactive actions.
 */

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg";
export type ButtonShape = "pill" | "rounded";

const base =
  "btn-glass-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<ButtonVariant, string> = {
  primary: "btn-glass-primary",
  secondary: "btn-glass-secondary",
  accent: "btn-glass-accent",
  outline: "border border-border-strong text-fg hover:bg-surface-hover hover:border-fg/20 active:translate-y-[0.5px]",
  ghost: "text-fg-muted hover:bg-surface-hover hover:text-fg active:translate-y-[0.5px]",
  danger: "bg-danger text-white border border-white/20 shadow-sm hover:brightness-110 active:translate-y-[0.5px]",
};

const shapes: Record<ButtonShape, string> = {
  pill: "rounded-full",
  rounded: "rounded-xl",
};

const sizes: Record<ButtonSize, string> = {
  // WCAG 2.5.5 touch target guidance: md (h-11 = 44px) and lg (h-12.5 = 50px).
  // sm (h-9 = 36px) is reserved for compact toolbars or dense rows.
  sm: "h-9 px-3.5 text-xs sm:text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 sm:h-12.5 px-6 sm:px-7 text-base gap-2.5",
  "icon-sm": "h-9 w-9 p-0 min-w-9",
  "icon-md": "h-11 w-11 p-0 min-w-11",
  "icon-lg": "h-12 w-12 p-0 min-w-12",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  shape,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
} = {}): string {
  // Default shape: primary, accent, lg, and icon buttons default to capsule/pill.
  // Secondary / outline / ghost in md / sm default to rounded-xl for balanced density.
  const effectiveShape =
    shape ??
    (variant === "primary" || variant === "accent" || size === "lg" || size.startsWith("icon")
      ? "pill"
      : "rounded");

  return cn(base, variants[variant], shapes[effectiveShape], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  shape,
  loading = false,
  icon,
  className,
  type = "button",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, shape, className })}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex shrink-0 animate-spin mr-1.5" aria-hidden="true">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
