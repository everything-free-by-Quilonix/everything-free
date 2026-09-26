"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

export const THEME_STORAGE_KEY = "ef-theme";
const THEME_EVENT = "ef-theme-change";

type Theme = "light" | "dark";

/**
 * Theme bootstrap script.
 *
 * Runs synchronously in `<head>`, before first paint, so the correct theme is
 * applied without a flash of the wrong one. This cannot be done in a React effect:
 * effects run after paint, which is exactly when the flash would happen.
 *
 * The site is dark-first, and `globals.css` puts the dark values on `:root`. So if
 * this script fails or JavaScript is disabled, the page renders dark and correct
 * rather than broken — the script only ever *upgrades* to the user's preference.
 */
export function ThemeScript() {
  const script = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var m=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var c=document.documentElement.classList;c.remove("light","dark");c.add(m);}catch(e){}})();`;

  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}

/*
 * The current theme lives on `document.documentElement`, written by the bootstrap
 * script above. That makes it external state that React does not own, so it is read
 * through `useSyncExternalStore` rather than mirrored into component state.
 *
 * Reading it in an effect and calling `setState` would also work, but it means
 * rendering once with a guessed value and then correcting it — a cascading render,
 * and a visible flicker of the wrong icon. `useSyncExternalStore` is the API
 * designed for exactly this, and it handles the server/hydration case explicitly.
 */

function subscribe(onChange: () => void): () => void {
  // Our own toggle dispatches this event; `storage` covers the same site open in
  // another tab, so both windows stay in agreement.
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

/**
 * The server cannot know the preference, so it reports `null` and the button
 * renders a fixed-size placeholder. React uses this value during hydration and
 * then re-reads the client snapshot, which avoids both a hydration mismatch and a
 * layout shift.
 */
function getServerSnapshot(): Theme | null {
  return null;
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const apply = useCallback((next: Theme) => {
    const classList = document.documentElement.classList;
    classList.remove("light", "dark");
    classList.add(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage is unavailable in some private-browsing modes. The theme still
      // applies for this page view; it just will not persist.
    }

    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  if (theme === null) {
    // Reserves the button's footprint so the header does not shift on hydration.
    return <span className={className} style={{ display: "inline-block", width: 40, height: 40 }} aria-hidden="true" />;
  }

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      className={`inline-flex size-10 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg ${className ?? ""}`}
      // The accessible name states what the button will do, which is what a
      // screen-reader user needs. `aria-pressed` would be ambiguous for a two-way swap.
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
    </button>
  );
}
