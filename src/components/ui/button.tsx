import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Button styling is exported as a function as well as a component.
 *
 * Next's `Link` renders its own anchor, and wrapping it in a button element
 * would be invalid HTML. Rather than reaching for an `asChild` polymorphism
 * helper, `buttonClasses()` lets a link look like a button while staying an
 * anchor — which is also the correct semantics for navigation.
 */

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap transition-colors " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

// Hover raises contrast; pressed is one step darker, with no scale or bounce.
const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover active:bg-(--primary-pressed)",
  secondary:
    "bg-surface-raised text-fg border border-border-strong hover:bg-surface-hover hover:border-fg-subtle active:bg-(--fill-pressed)",
  outline: "border border-border-strong text-fg hover:bg-surface-hover hover:border-fg-subtle active:bg-(--fill-pressed)",
  ghost: "text-fg-muted hover:bg-surface-hover hover:text-fg active:bg-(--fill-pressed)",
  danger: "bg-danger-soft text-danger-fg border border-danger hover:bg-surface-hover active:bg-(--fill-pressed)",
};

const sizes: Record<ButtonSize, string> = {
  // Minimum 44px touch target on md and lg, per WCAG 2.5.5 guidance. `sm` grows
  // to 44px on coarse pointers.
  sm: "h-9 px-3 text-sm pointer-coarse:h-11",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
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
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...rest} />;
}
