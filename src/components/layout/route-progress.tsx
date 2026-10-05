"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Global Top Route Buffer Bar.
 *
 * Provides immediate tactile feedback when navigating between routes:
 * 1. Shows a glowing, warm-gold indeterminate progress bar at the top edge of the viewport
 * 2. Uses direct DOM ref animation for zero unnecessary component re-renders
 * 3. Smoothly hides once the destination route mounts
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);

  // Complete and hide progress bar when route finishes mounting
  useEffect(() => {
    const el = barRef.current;
    if (el) {
      el.style.opacity = "0";
      const timer = setTimeout(() => {
        el.style.display = "none";
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal navigation links for instant tactile feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, downloads, new tabs, modifier keys, or anchor jumps
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check if it's an internal route link
      const isInternal =
        href.startsWith("/") ||
        (href.startsWith(window.location.origin) && !href.startsWith(`${window.location.origin}/#`));

      if (isInternal) {
        const url = new URL(href, window.location.href);
        // If navigating to the exact same URL, don't trigger
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }

        const el = barRef.current;
        if (el) {
          el.style.display = "block";
          el.style.opacity = "1";
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{ display: "none", opacity: 0 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-primary/20 backdrop-blur-xs transition-opacity duration-200"
    >
      <div className="relative h-full w-full">
        {/* Glowing architectural warm gold progress bar */}
        <div className="animate-buffer absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-primary shadow-[0_0_14px_rgba(217,155,38,0.9)]" />
      </div>
    </div>
  );
}
