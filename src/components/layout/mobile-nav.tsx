"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/layout";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { Brand } from "./brand";
import { ThemeToggle } from "./theme";

/** Matches the exit transition below; under reduced motion the panel unmounts at once. */
const EXIT_MS = 180;

/**
 * Mobile navigation panel.
 *
 * Implemented as a modal dialog by hand rather than with a headless library, which
 * means the accessibility obligations are ours to meet explicitly:
 *
 * - `role="dialog"` + `aria-modal` so assistive tech treats it as a layer.
 * - Escape closes it, as do the close button, the scrim and every link in it.
 * - Focus moves into the panel on open and returns to the trigger on close, so a
 *   keyboard user is never dropped at the top of the document.
 * - Focus is cycled within the panel while it is open.
 * - Background scrolling is locked, otherwise the page moves behind the overlay.
 * - While the exit transition plays the panel is `inert`, so nothing in it can be
 *   focused or clicked on the way out.
 *
 * The panel is portalled to `<body>`: the capsule uses `backdrop-filter`, which
 * makes it the containing block for fixed descendants, so a fixed overlay rendered
 * inside it would be clipped to the capsule. It opens directly over the capsule
 * with the same gutters and first-row height, so it reads as the header expanding.
 *
 * Closing on navigation is done in the link handlers rather than in an effect
 * watching the pathname. Setting state from an effect in response to a route change
 * causes an extra render pass after the new page has already painted; handling it
 * at the interaction that causes it is both cheaper and easier to follow.
 */
export function MobileNav() {
  // `open` is the logical state; `mounted` keeps the panel in the DOM while it
  // animates out.
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<number | undefined>(undefined);

  const show = useCallback(() => {
    window.clearTimeout(exitTimer.current);
    setScrolled(document.getElementById("site-header")?.hasAttribute("data-scrolled") ?? false);
    setMounted(true);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.clearTimeout(exitTimer.current);
    if (reduced) setMounted(false);
    else exitTimer.current = window.setTimeout(() => setMounted(false), EXIT_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

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

    // Initial focus on the close control: it sits where the trigger was, so focus
    // does not visibly jump, and Tab moves straight on into the links.
    (panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusable()[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
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

    // The panel only exists below `lg`. If the viewport grows past it (rotation,
    // window resize) the open dialog would vanish while still locking the page.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = () => {
      if (desktop.matches) close();
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  const panel = (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      data-state={open ? "open" : "closed"}
      data-scrolled={scrolled ? "" : undefined}
      inert={!open}
    >
      {/* Decorative scrim. The close button below is the accessible control;
          this only handles pointer dismissal. */}
      <div
        className={cn(
          "absolute inset-0 bg-(--scrim) transition-opacity ease-(--ease-standard) starting:opacity-0",
          open ? "opacity-100 duration-(--duration-state)" : "opacity-0 duration-180",
        )}
        onClick={close}
        aria-hidden="true"
      />

      <Container className="pointer-events-none relative">
        <div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={cn(
            "site-panel pointer-events-auto flex origin-top flex-col overflow-y-auto overscroll-contain",
            "transition-[opacity,transform] ease-(--ease-standard) starting:-translate-y-2 starting:scale-[0.98] starting:opacity-0",
            open
              ? "translate-y-0 scale-100 opacity-100 duration-(--duration-state)"
              : "-translate-y-1 scale-[0.99] opacity-0 duration-180",
          )}
        >
          <div className="site-panel-bar flex shrink-0 items-center justify-between pr-1.5 pl-4 sm:pl-5">
            <Brand onClick={close} />
            <button
              type="button"
              onClick={close}
              data-autofocus
              className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors duration-(--duration-hover) hover:bg-surface-hover hover:text-fg"
              aria-label="Close menu"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <nav aria-label="Main" className="px-2 pt-1 pb-2">
            <ul className="flex flex-col">
              {primaryNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex min-h-14 items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors duration-(--duration-hover)",
                        active ? "bg-surface-hover text-fg" : "text-fg-muted hover:bg-surface-hover hover:text-fg",
                      )}
                    >
                      {/* Current-page mark, so the location is not conveyed by
                          background tint alone. */}
                      {active ? (
                        <span aria-hidden="true" className="absolute top-1/2 left-1.5 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-fg">{item.label}</span>
                        {item.description ? (
                          <span className="mt-0.5 block text-xs text-fg-subtle">{item.description}</span>
                        ) : null}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={16}
                        className="shrink-0 text-fg-subtle transition-transform duration-(--duration-hover) group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mx-4 h-px shrink-0 bg-border" aria-hidden="true" />

          <div className="flex flex-col gap-1 p-2">
            <Link
              href="/submit"
              onClick={close}
              className="group flex h-12 items-center justify-between rounded-2xl bg-primary px-4 text-sm font-medium text-primary-fg transition-colors duration-(--duration-hover) hover:bg-primary-hover"
            >
              Submit a resource
              <Icon
                name="arrow-right"
                size={16}
                strokeWidth={2}
                className="transition-transform duration-(--duration-hover) group-hover:translate-x-0.5"
              />
            </Link>
            <ThemeToggle variant="row" />
          </div>
        </div>
      </Container>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={show}
        className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors duration-(--duration-hover) ease-(--ease-standard) hover:bg-surface-hover hover:text-fg lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={mounted ? "site-menu" : undefined}
        aria-haspopup="dialog"
      >
        <Icon name="menu" size={20} />
      </button>

      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
