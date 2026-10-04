"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * On this page: the record page's section list, with the section being read
 * marked as current.
 *
 * When to use: once per record page, fed the same `sections` array that decides
 * which sections render, so a link can never point at a missing section. When
 * not to use: as site navigation, or on short pages with one or two sections.
 *
 * Keyboard: plain links in reading order; following one moves the viewport and
 * the hash, as any anchor does. The command palette reads these links for its
 * "On this page" group.
 *
 * Evidence: none. It names sections; it states no fact.
 *
 * One `IntersectionObserver` per page watches the rendered headings only, in a
 * band 40 to 45 percent down the viewport; the last heading to enter the band
 * wins. Without JavaScript or the observer the list renders with no current
 * marker. The marker is the selected/current treatment: ink text and a 2px gold
 * underline, plus `aria-current="location"`.
 */
export interface PageSection {
  /** The id of the section's heading, the link target. */
  id: string;
  label: string;
}

export function OnThisPage({ sections }: { sections: readonly PageSection[] }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((entry) => entry.isIntersecting);
        if (entering.length > 0) setCurrent(entering[entering.length - 1].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page">
      <p className="kicker mb-2">On this page</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm xl:flex-col xl:gap-y-2">
        {sections.map((section) => {
          const isCurrent = current === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  "inline-block rounded-xs py-1 underline-offset-[0.2em] transition-colors pointer-coarse:py-2",
                  isCurrent
                    ? "text-fg underline decoration-primary decoration-2"
                    : "text-fg-muted hover:text-fg hover:underline",
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
