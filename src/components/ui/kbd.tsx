import type { ReactNode } from "react";

/**
 * A keyboard key hint.
 *
 * When to use: beside a control that has a shortcut, or in a key-hint footer.
 * When not to use: as the only way a shortcut is described (the control keeps
 * `aria-keyshortcuts`), or for arrows drawn as glyphs; key names are words.
 *
 * Keyboard: static, not interactive.
 *
 * Evidence: none.
 */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded-xs border border-border px-1 font-sans text-2xs text-fg-subtle tabular-nums">
      {children}
    </kbd>
  );
}
