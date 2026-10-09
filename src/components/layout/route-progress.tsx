"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Optical Route Navigation Buffer (inspired by 21st.dev & Linear).
 *
 * Provides immediate tactile feedback when navigating between routes:
 * 1. Shows a sleek, warm optical buffer bar along the top edge of the viewport
 * 2. Glides smoothly across during navigation transitions
 * 3. Rapidly completes (100%) and fades out when the target route mounts
 * 4. Strictly zero layout shift, pointer-events-none, and accessible aria-hidden
 */
export function RouteProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);

  // When pathname changes, complete the progress and fade out cleanly
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      const bar = barRef.current;
      const progress = progressRef.current;

      if (bar && progress) {
        progress.classList.add("motion-route-done");
        bar.style.opacity = "0";
        const timer = setTimeout(() => {
          bar.style.display = "none";
          progress.classList.remove("motion-route-done");
        }, 220);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  // Intercept click on internal navigation links for instant tactile buffer feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, downloads, new tabs, modifier keys, or hash-only links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.rel === "external" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // Check if it's an internal route link
      const isInternal =
        href.startsWith("/") ||
        (href.startsWith(window.location.origin) && !href.startsWith(`${window.location.origin}/#`));

      if (isInternal) {
        try {
          const url = new URL(href, window.location.href);
          // If navigating to the exact same pathname and search, do not trigger
          if (url.pathname === window.location.pathname && url.search === window.location.search) {
            return;
          }

          const bar = barRef.current;
          const progress = progressRef.current;

          if (bar && progress) {
            isNavigatingRef.current = true;
            progress.classList.remove("motion-route-done");
            bar.style.display = "block";
            // Trigger reflow to restart CSS animation
            void progress.offsetWidth;
            bar.style.opacity = "1";
          }
        } catch {
          // Ignore invalid URLs
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
      className="motion-route-bar"
      style={{ display: "none", opacity: 0 }}
    >
      <div ref={progressRef} className="motion-route-progress" />
    </div>
  );
}
