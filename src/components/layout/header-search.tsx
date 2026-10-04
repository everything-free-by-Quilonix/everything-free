"use client";

import { useCallback, useEffect, useSyncExternalStore, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";

/** The id `SearchBox` gives its input. Every search entry point uses it. */
const SEARCH_INPUT_ID = "resource-search";

/** How long to wait for the search input after navigating to `/resources`. */
const FOCUS_TIMEOUT_MS = 3000;

function focusSearchInput(): boolean {
  const input = document.getElementById(SEARCH_INPUT_ID);
  if (!(input instanceof HTMLInputElement)) return false;
  input.focus({ preventScroll: true });
  input.scrollIntoView({ block: "center" });
  input.select();
  return true;
}

/**
 * Focuses the search input once it exists. The results page renders it from a
 * client boundary, so after a navigation it appears a few frames later. Polling on
 * animation frames is bounded and stops as soon as the input is found.
 */
function focusWhenReady() {
  const deadline = performance.now() + FOCUS_TIMEOUT_MS;
  const tick = () => {
    if (focusSearchInput() || performance.now() > deadline) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select") !== null)
  );
}

// The platform never changes during a visit, so there is nothing to subscribe to.
const subscribe = () => () => {};
const getPlatform = () => (/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? "mac" : "other");
const getServerPlatform = () => "other";

/**
 * Header search control.
 *
 * A compact trigger, not a field: the search experience is the library's own
 * search box. It is a real link to `/resources`, so it works without JavaScript and
 * can be opened in a new tab. With JavaScript it goes one step further and puts the
 * cursor in the search box, using the one already on the page (the home hero, the
 * results page) when there is one instead of navigating away.
 *
 * Shortcuts: ⌘K / Ctrl+K anywhere, and `/` when not typing in a field. Both are
 * declared through `aria-keyshortcuts`. They are ignored while a modal is open so
 * they cannot pull focus out from under the mobile menu.
 */
export function HeaderSearch() {
  const router = useRouter();
  const platform = useSyncExternalStore(subscribe, getPlatform, getServerPlatform);

  const open = useCallback(() => {
    if (focusSearchInput()) return;
    router.push("/resources");
    focusWhenReady();
  }, [router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.shiftKey) return;
      if (document.querySelector('[aria-modal="true"]')) return;

      const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !isEditable(event.target);
      if (!commandK && !slash) return;

      event.preventDefault();
      open();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks keep their browser meaning (new tab, new window).
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (focusSearchInput()) {
      event.preventDefault();
      return;
    }
    // Let the link navigate, then focus the search box on arrival.
    focusWhenReady();
  };

  return (
    <Link
      href="/resources"
      onClick={onClick}
      aria-label="Search resources"
      aria-keyshortcuts="Meta+K Control+K /"
      className="inline-flex size-11 items-center justify-center gap-2 rounded-full text-sm font-medium text-fg-muted transition-colors duration-(--duration-hover) ease-(--ease-standard) hover:bg-surface-hover hover:text-fg lg:h-9 lg:w-auto lg:pr-2 lg:pl-3"
    >
      <Icon name="search" size={17} />
      <span className="hidden lg:inline">Search</span>
      <kbd
        aria-hidden="true"
        className="hidden h-5 min-w-9 items-center justify-center rounded-md border border-border px-1.5 font-sans text-[11px] font-medium text-fg-subtle xl:inline-flex"
      >
        {platform === "mac" ? "⌘K" : "Ctrl K"}
      </kbd>
    </Link>
  );
}
