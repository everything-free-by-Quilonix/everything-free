"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

/**
 * Form primitives.
 *
 * Every control is wrapped by `Field`, which owns the id wiring. That is what
 * guarantees a real `<label for>` association, that help text and errors are
 * linked through `aria-describedby`, and that invalid controls expose
 * `aria-invalid`. Doing this in one place means a form cannot accidentally ship
 * an unlabelled input.
 */

const controlClasses =
  "w-full rounded-sm border border-border-strong bg-bg px-3 py-2.5 text-sm text-fg " +
  "transition-colors placeholder:text-fg-subtle hover:border-fg-subtle " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "aria-[invalid=true]:border-danger";

interface FieldContext {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
}

export interface FieldProps {
  label: string;
  /** Guidance shown under the label, before the control. */
  hint?: ReactNode;
  /** Validation message. Its presence marks the control invalid. */
  error?: string;
  required?: boolean;
  className?: string;
  children: (context: FieldContext) => ReactNode;
}

export function Field({ label, hint, error, required = false, className, children }: FieldProps) {
  const id = useId();
  const controlId = `${id}-control`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={controlId} className="text-sm font-medium text-fg">
        {label}
        {required ? (
          <span className="ml-1 text-danger-fg">
            *<span className="sr-only"> (required)</span>
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-fg-subtle">(optional)</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-fg-muted">
          {hint}
        </p>
      ) : null}

      {children({ controlId, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-xs text-danger-fg">
          <Icon name="alert-triangle" size={13} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  context,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { context: FieldContext }) {
  return (
    <input
      id={context.controlId}
      aria-describedby={context.describedBy}
      aria-invalid={context.invalid || undefined}
      className={cn(controlClasses, className)}
      {...rest}
    />
  );
}

export function TextArea({
  context,
  className,
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { context: FieldContext }) {
  return (
    <textarea
      id={context.controlId}
      rows={rows}
      aria-describedby={context.describedBy}
      aria-invalid={context.invalid || undefined}
      className={cn(controlClasses, "resize-y", className)}
      {...rest}
    />
  );
}

export function Select({
  context,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { context: FieldContext }) {
  return (
    <div className="relative">
      <select
        id={context.controlId}
        aria-describedby={context.describedBy}
        aria-invalid={context.invalid || undefined}
        className={cn(controlClasses, "appearance-none pr-9", className)}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute inset-y-0 right-3 my-auto text-fg-subtle"
      />
    </div>
  );
}

/**
 * Checkbox with its label as one click target.
 *
 * Uses a native input rather than a styled div so that keyboard behaviour, form
 * participation and assistive-technology semantics come for free.
 */
export function Checkbox({
  label,
  description,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; description?: ReactNode }) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn("flex gap-2.5", className)}>
      <input
        id={id}
        type="checkbox"
        aria-describedby={descriptionId}
        className="mt-0.5 size-4 shrink-0 cursor-pointer"
        {...rest}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm text-fg">
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-xs text-fg-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
