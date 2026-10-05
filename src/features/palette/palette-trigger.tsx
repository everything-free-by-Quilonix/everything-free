"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { Kbd } from "@/components/ui/kbd";

import { prefetchPaletteIndex } from "./palette-loader";

/**
 * Palette trigger: the header's search control and the global shortcuts.
 *
 * When to use: once, in the site header. When not to use: as a second search
 * field; the palette is a jump list and hands off to `/resources` for search.
 *
 * Keyboard: ⌘K on macOS and Ctrl+K elsewhere toggle the palette from anywhere,
 * including inside inputs; `/` opens it when focus is not in a text control and
 * no modifier is held. Both are ignored while another modal is open. Without
 * JavaScript the trigger is a plain link to `/resources/`.
 *
 * Behaviour: the palette code loads with `next/dynamic` on first open, so it is
 * not part of any page's initial scripts. Hover or focus prefetches the index.
 *
 * Evidence: none of its own.
 */

const CommandPalette = dynamic(() => import("./command-palette").then((module) => module.CommandPalette), {
  ssr: false,
});

const OTHER_MODAL = "dialog[open]:not([data-palette])";

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

const noop = () => () => {};

/** "⌘K" or "Ctrl K", known only in the browser; null on the server and before hydration. */
export function usePaletteShortcutLabel(): string | null {
  return useSyncExternalStore(
    noop,
    () => {
      const platform =
        (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
        navigator.platform;
      return /mac|iphone|ipad/i.test(platform) ? "⌘K" : "Ctrl K";
    },
    () => null,
  );
}

/**
 * The hero's hint, rendered only after hydration (the shortcut needs JS) and
 * hidden on touch-first devices, which rarely have the keys.
 */
export function PaletteShortcutHint({ className }: { className?: string }) {
  const label = usePaletteShortcutLabel();
  if (!label) return null;
  return (
    <p className={`pointer-coarse:hidden ${className ?? ""}`}>
      Or press <Kbd>{label}</Kbd> to jump to any listing.
    </p>
  );
}

export function PaletteTrigger() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const show = useCallback(() => {
    setLoaded(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (document.querySelector(OTHER_MODAL)) return;
      const k = event.key === "k" || event.key === "K";
      if (k && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        setLoaded(true);
        setOpen((value) => !value);
        return;
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping(event.target)) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show]);

  return (
    <>
      <Link
        href="/resources"
        aria-label="Search resources"
        aria-keyshortcuts="Meta+K Control+K /"
        onClick={(event) => {
          event.preventDefault();
          // Focus first, so the palette returns focus here when it closes.
          event.currentTarget.focus();
          show();
        }}
        onPointerEnter={prefetchPaletteIndex}
        onFocus={prefetchPaletteIndex}
        className="inline-flex size-11 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg active:bg-(--fill-pressed)"
      >
        <Icon name="search" size={20} />
      </Link>
      {loaded ? <CommandPalette open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
