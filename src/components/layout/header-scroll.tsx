"use client";

import { useEffect, useRef } from "react";

/**
 * Marks the header as scrolled once the page leaves the top.
 *
 * An IntersectionObserver on a small sentinel pinned to the top of the document,
 * rather than a scroll listener: the browser reports the single threshold
 * crossing, so there is no per-frame work and nothing to throttle. The result is
 * one attribute on `#site-header`; the visual change is entirely CSS.
 *
 * Without JavaScript (or IntersectionObserver) the header simply keeps its
 * at-rest appearance, which is a complete state on its own.
 */
export function HeaderScrollSentinel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = ref.current;
    const header = document.getElementById("site-header");
    if (!sentinel || !header || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      header.toggleAttribute("data-scrolled", !entry.isIntersecting);
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  // Absolutely positioned against the initial containing block, so it sits at the
  // top of the document and scrolls away with it.
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6" />;
}
