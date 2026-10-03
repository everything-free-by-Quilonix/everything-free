"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { primaryNav } from "@/config/navigation";

/**
 * Mobile navigation panel.
 *
 * Implemented as a modal dialog by hand rather than with a headless library, which
 * means the accessibility obligations are ours to meet explicitly:
 *
 * - `role="dialog"` + `aria-modal` so assistive tech treats it as a layer.
 * - Escape closes it.
 * - Focus moves into the panel on open and returns to the trigger on close, so a
 *   keyboard user is never dropped at the top of the document.
 * - Focus is cycled within the panel while it is open.
 * - Background scrolling is locked, otherwise the page moves behind the overlay.
 * - Navigating closes it, since the panel would otherwise cover the destination.
 *
 * Closing on navigation is done in the link handlers rather than in an effect
 * watching the pathname. Setting state from an effect in response to a route change
 * causes an extra render pass after the new page has already painted; handling it
 * at the interaction that causes it is both cheaper and easier to follow.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    // Copied into the effect scope: by the time cleanup runs, the ref may point
    // somewhere else, and the exhaustive-deps rule is right to flag reading it then.
    const trigger = triggerRef.current;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const elements = focusable();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Icon name="menu" size={20} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-(--z-overlay) lg:hidden">
          {/* Decorative scrim. The close button below is the accessible control;
              this only handles pointer dismissal. */}
          <div className="absolute inset-0 bg-black/70" onClick={close} aria-hidden="true" />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto border-l border-border bg-bg shadow-overlay"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-sm font-semibold">Menu</span>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-10 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                aria-label="Close menu"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <nav aria-label="Main" className="flex-1 px-4 py-4">
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-start gap-3 rounded-sm px-3 py-3 transition-colors ${
                          active ? "bg-surface-raised text-fg" : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                        }`}
                      >
                        {item.icon ? <Icon name={item.icon} size={18} className="mt-0.5 shrink-0" /> : null}
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{item.label}</span>
                          {item.description ? (
                            <span className="mt-0.5 block text-xs text-fg-subtle">{item.description}</span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-border p-4">
              <Link
                href="/submit"
                onClick={close}
                className={buttonClasses({ variant: "primary", size: "md", className: "w-full" })}
              >
                Submit a resource
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
