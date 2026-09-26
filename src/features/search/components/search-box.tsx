"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/config/deployment";
import { searchExamples } from "@/config/site";
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
 * The rotating placeholder is suppressed entirely under `prefers-reduced-motion`,
 * since a placeholder that changes under the cursor is exactly the kind of
 * unrequested movement that preference exists to stop.
 */
export function SearchBox({
  defaultValue = "",
  size = "lg",
  autoFocus = false,
  className,
  label = "Search free resources",
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [exampleIndex, setExampleIndex] = useState(0);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRotate(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!rotate) return;
    const timer = window.setInterval(() => {
      setExampleIndex((index) => (index + 1) % searchExamples.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [rotate]);

  // Prefetching the results route makes the first search feel immediate without
  // preloading anything the user has not signalled intent for.
  useEffect(() => {
    router.prefetch("/resources");
  }, [router]);

  const placeholder = rotate ? `Try “${searchExamples[exampleIndex]}”` : "What are you looking for?";

  return (
    <form
      // A plain form action bypasses Next's router, so the base path has to be
      // applied by hand or this submits to the domain root on a project site.
      action={withBasePath("/resources/")}
      method="get"
      role="search"
      className={cn("w-full", className)}
      // `aria-label` names the landmark so a screen-reader user scanning regions
      // can find it directly.
      aria-label={label}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border-strong bg-surface shadow-raised transition-colors",
          "focus-within:border-primary",
          size === "lg" ? "p-2 pl-4" : "p-1.5 pl-3",
        )}
      >
        <Icon name="search" size={size === "lg" ? 20 : 18} className="shrink-0 text-fg-subtle" />

        <label htmlFor="resource-search" className="sr-only">
          {label}
        </label>
        <input
          id="resource-search"
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle",
            size === "lg" ? "py-2 text-base" : "py-1.5 text-sm",
          )}
        />

        <Button type="submit" size={size === "lg" ? "md" : "sm"} className="shrink-0">
          Search
        </Button>
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
          {/* `Link`, not a raw anchor: it applies the base path, which a plain
              `href` would not. */}
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
