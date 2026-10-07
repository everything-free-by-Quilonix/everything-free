import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Premium Liquid Glass / Soft Optical Glass Button System.
 *
 * Implements refined capsule geometry with tactile physical feeling:
 * - Primary: Soft optical glass with subtle inner highlight and controlled shadow
 * - Secondary: Tactile neutral surface with subtle border
 * - Ghost: Quiet, minimal surface
 * - States: Default, hover (subtle brightness & micro-lift), pressed, focus, disabled, loading
 *
 * Exported both as a component and as `buttonClasses()` for accessible anchor polymorphism.
 */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-fg border border-white/20 dark:border-white/15 " +
    "shadow-[inset_0_1px_0_0_oklch(1_0_0/0.32),0_2px_8px_-2px_oklch(0.79_0.125_85/0.3)] " +
    "hover:bg-primary-hover hover:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.4),0_4px_12px_-2px_oklch(0.79_0.125_85/0.4)] " +
    "active:translate-y-px active:shadow-[inset_0_1px_2px_0_oklch(0_0_0/0.25)]",
  secondary:
    "bg-surface-raised/90 text-fg border border-border-strong/80 shadow-2xs " +
    "hover:bg-surface-hover hover:border-fg-subtle active:translate-y-px active:bg-(--fill-pressed)",
  outline:
    "border border-border-strong text-fg hover:bg-surface-hover hover:border-fg-subtle active:translate-y-px active:bg-(--fill-pressed)",
  ghost: "text-fg-muted hover:bg-surface-hover/80 hover:text-fg active:bg-(--fill-pressed)",
  danger: "bg-danger-soft text-danger-fg border border-danger hover:bg-surface-hover active:translate-y-px active:bg-(--fill-pressed)",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8.5 px-3.5 text-xs pointer-coarse:h-11 pointer-coarse:px-4",
  md: "h-10 px-4.5 text-sm pointer-coarse:h-11",
  lg: "h-12 px-6 text-sm sm:text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  type = "button",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...rest}
    >
      {isLoading ? (
        <svg
          className="size-4 shrink-0 animate-none opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

