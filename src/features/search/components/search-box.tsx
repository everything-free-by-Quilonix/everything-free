"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/config/deployment";
import { searchExamples } from "@/config/site";
import { cn } from "@/lib/utils/cn";

const emptySubscribe = () => () => {};

function getShortcutSnapshot() {
  if (typeof navigator === "undefined") return "⌘K";
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform);
  return isMac ? "⌘K" : "Ctrl K";
}

function getShortcutServerSnapshot() {
  return "⌘K";
}

/**
 * Beam Search Bar & Primary Search Box.
 *
 * Integrated with the 21st.dev / Spectrum UI Beam Search interaction pattern:
 * - Subtle animated beam traveling along the bottom edge when focused.
 * - Platform-adaptive keyboard shortcut indicator (`⌘K` on macOS, `Ctrl K` on Windows/Linux).
 * - Interactive clear button (`×`) when query text is present.
 * - Semantic form submission (`GET /resources/?q=...`) preserving URL routing and history.
 * - Full reduced-motion fallback to a calm static accent.
 */
export function SearchBox({
  defaultValue = "",
  size = "lg",
  variant = "beam",
  autoFocus = false,
  className,
  label = "Search software, tools, resources...",
  placeholderText,
  onChange,
  onClear,
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  variant?: "default" | "beam";
  autoFocus?: boolean;
  className?: string;
  label?: string;
  placeholderText?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [rotate, setRotate] = useState(false);
  const shortcutLabel = useSyncExternalStore(emptySubscribe, getShortcutSnapshot, getShortcutServerSnapshot);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Motion preference detection
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRotate(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Rotating placeholder
  useEffect(() => {
    if (!rotate || placeholderText) return;
    const timer = window.setInterval(() => {
      setExampleIndex((index) => (index + 1) % searchExamples.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [rotate, placeholderText]);

  // Route prefetching for instant results
  useEffect(() => {
    router.prefetch("/resources");
  }, [router]);

  const placeholder =
    placeholderText ?? (rotate ? `Try “${searchExamples[exampleIndex]}”` : "Search software, tools, resources...");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onChange?.(value);
  };

  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    onClear?.();
    onChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && query.length > 0) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <form
      action={withBasePath("/resources/")}
      method="get"
      role="search"
      className={cn("w-full", className)}
      aria-label={label}
    >
      <div
        className={cn(
          "group relative flex items-center gap-2.5 transition-all duration-200",
          variant === "beam"
            ? cn(
                "rounded-2xl border bg-surface/90 backdrop-blur-md shadow-raised",
                isFocused
                  ? "border-primary/60 ring-2 ring-primary-soft"
                  : "border-border-strong/80 hover:border-border-strong",
              )
            : cn(
                "rounded-xl border border-border-strong bg-surface",
                "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
              ),
          size === "lg" ? "p-2 pl-4 sm:pl-5" : "p-1.5 pl-3.5",
        )}
      >
        {/* Leading Search Icon */}
        <Icon
          name="search"
          size={size === "lg" ? 20 : 18}
          className={cn(
            "shrink-0 transition-colors duration-150",
            isFocused ? "text-primary" : "text-fg-subtle group-hover:text-fg-muted",
          )}
        />

        <label htmlFor="resource-search" className="sr-only">
          {label}
        </label>

        {/* Search Input */}
        <input
          ref={inputRef}
          id="resource-search"
          type="search"
          name="q"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle",
            size === "lg" ? "py-2 text-base" : "py-1.5 text-sm",
          )}
        />

        {/* Clear Button (appears when input has content) */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Icon name="close" size={14} />
          </button>
        )}

        {/* Trailing Section: Keyboard Shortcut & Submit Button */}
        <div className="flex items-center gap-2 shrink-0">
          <kbd
            className="hidden sm:inline-flex items-center rounded-lg border border-border/80 bg-surface-raised/80 px-2 py-1 text-[11px] font-mono font-medium text-fg-subtle select-none shadow-xs"
            title={shortcutLabel === "⌘K" ? "Press ⌘K to search" : "Press Ctrl+K to search"}
          >
            {shortcutLabel}
          </kbd>

          <Button
            type="submit"
            variant="primary"
            size={size === "lg" ? "md" : "sm"}
            shape="pill"
            className="shrink-0 font-medium"
          >
            Search
          </Button>
        </div>

        {/* 21st.dev Traveling Beam Animation along the bottom edge */}
        {variant === "beam" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px left-3 right-3 h-[2px] overflow-hidden rounded-full"
          >
            <div
              className={cn(
                "h-full w-44 rounded-full transition-opacity duration-300",
                isFocused ? "opacity-100 animate-beam-travel" : "opacity-0",
                "motion-reduce:animate-none motion-reduce:w-full motion-reduce:left-0 motion-reduce:translate-x-0 motion-reduce:opacity-80",
              )}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, var(--primary-soft) 25%, var(--primary) 50%, var(--primary-soft) 75%, transparent 100%)",
                filter: "drop-shadow(0 0 6px var(--primary-ring))",
              }}
            />
          </div>
        )}
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
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {queries.map((query) => (
        <li key={query}>
          <Link
            href={`/resources/?q=${encodeURIComponent(query)}`}
            className="inline-block rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            {query}
          </Link>
        </li>
      ))}
    </ul>
  );
}
