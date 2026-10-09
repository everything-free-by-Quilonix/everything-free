"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/config/deployment";
import { usePaletteShortcutLabel } from "@/features/palette/palette-trigger";
import { cn } from "@/lib/utils/cn";


/**
 * The primary search entry point.
 *
 * Built as a real `<form method="get" action="/resources">`, so submitting it is
 * an ordinary navigation that puts the query in the URL, and browser history and
 * autofill behave normally. The results themselves are computed in the browser on
 * `/resources`, which keeps that page static — so ranking the results does need
 * JavaScript, even though submitting the form does not.
 *
 * The placeholder is fixed. A placeholder that changes under the cursor is
 * unrequested movement, and the examples it would cycle through are shown as
 * real links beside the field instead.
 */
const DEFAULT_PLACEHOLDER = "Search software, tools, resources...";

export function SearchBox({
  defaultValue = "",
  size = "lg",
  variant = "beam",
  autoFocus = false,
  className,
  placeholder = DEFAULT_PLACEHOLDER,
  label = "Search free resources",
  showShortcut = true,
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  variant?: "default" | "beam";
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  showShortcut?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shortcutLabel = usePaletteShortcutLabel();

  // Prefetching the results route makes the first search feel immediate without
  // preloading anything the user has not signalled intent for.
  useEffect(() => {
    router.prefetch("/resources");
  }, [router]);

  return (
    <form
      action={withBasePath("/resources/")}
      method="get"
      role="search"
      className={cn("w-full", className)}
      aria-label={label}
    >
      <div
        data-search-field=""
        className={cn(
          "relative flex items-center gap-2.5 overflow-hidden rounded-md border bg-surface transition-colors",
          isFocused ? "border-border-strong shadow-sm" : "border-border hover:border-border-strong",
          // The wrapper is the visible field, so it carries the keyboard focus ring;
          // the inner input suppresses its own outline.
          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--focus)",
          size === "lg" ? "p-2 pl-4" : "p-1.5 pl-3",
        )}
      >
        <Icon name="search" size={size === "lg" ? 20 : 18} className="shrink-0 text-fg-subtle" />

        <label htmlFor="resource-search" className="sr-only">
          {label}
        </label>
        <input
          ref={inputRef}
          id="resource-search"
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle text-left",
            size === "lg" ? "py-2 text-base" : "py-1.5 text-sm",
          )}
        />

        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
            className="flex size-6 items-center justify-center rounded-xs text-fg-subtle transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <Icon name="close" size={14} />
          </button>
        ) : null}

        {showShortcut && shortcutLabel && !value ? (
          <kbd
            aria-hidden="true"
            className="hidden sm:inline-flex items-center rounded-xs border border-border bg-surface-raised px-1.5 py-0.5 text-2xs font-mono font-medium text-fg-subtle select-none"
          >
            {shortcutLabel}
          </kbd>
        ) : null}

        <Button
          type="submit"
          variant={size === "lg" ? "primary" : "secondary"}
          size={size === "lg" ? "md" : "sm"}
          className="shrink-0"
        >
          Search
        </Button>

        {/* Traveling Beam interaction on focus */}
        {variant === "beam" && isFocused ? (
          <div className="motion-beam-line" aria-hidden="true" />
        ) : null}
      </div>
    </form>
  );
}


/**
 * Example queries as links.
 *
 * Deliberately links rather than buttons: each one is a real destination, so
 * middle-clicking, opening in a new tab and sharing all behave as expected.
 */
export function SearchSuggestions({ queries, className }: { queries: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-baseline gap-x-1.5 text-sm text-fg-subtle", className)}>
      {queries.map((query, index) => (
        <li key={query}>
          {index > 0 ? <span aria-hidden="true">· </span> : null}
          {/* `Link`, not a raw anchor: it applies the base path, which a plain
              `href` would not. */}
          <Link href={`/resources/?q=${encodeURIComponent(query)}`} className="link-inline rounded-xs">
            {query}
          </Link>
        </li>
      ))}
    </ul>
  );
}
