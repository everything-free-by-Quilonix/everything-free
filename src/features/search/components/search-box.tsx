"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { withBasePath } from "@/config/deployment";
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
const PLACEHOLDER = "Try “free PDF tools” or “alternative to Photoshop”";

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

  // Prefetching the results route makes the first search feel immediate without
  // preloading anything the user has not signalled intent for.
  useEffect(() => {
    router.prefetch("/resources");
  }, [router]);

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
        data-search-field=""
        className={cn(
          "flex items-center gap-2 rounded-md border border-border-strong bg-bg transition-colors hover:border-fg-subtle",
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
          id="resource-search"
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={PLACEHOLDER}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-subtle",
            size === "lg" ? "py-2 text-base" : "py-1.5 text-sm",
          )}
        />

        {/* The large field is the homepage introduction's one primary action;
            elsewhere the page keeps its primary for something else. */}
        <Button
          type="submit"
          variant={size === "lg" ? "primary" : "secondary"}
          size={size === "lg" ? "md" : "sm"}
          className="shrink-0"
        >
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
