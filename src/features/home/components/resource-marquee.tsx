import Link from "next/link";
import { ResourceLogo } from "@/features/resources/components/resource-logo";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

/**
 * Editorial resource marquee strip.
 *
 * Sits directly below the hero content as a visual proof-point of the actual
 * tools in the library. Shows real, curated entries with local marks/monograms.
 *
 * Interaction details:
 * - Slow, calm, continuous marquee animation via CSS transform.
 * - Pauses on hover and on keyboard focus within so items are easy to read and click.
 * - Under `prefers-reduced-motion: reduce`, animation is stopped and becomes a scrollable strip.
 * - Duplicate track has `aria-hidden="true"` and `tabIndex={-1}` so screen readers
 *   and keyboard navigation only encounter the items once.
 */
export function ResourceMarquee({
  resources,
  className,
}: {
  resources: readonly Resource[];
  className?: string;
}) {
  if (resources.length === 0) return null;

  return (
    <div className={cn("relative w-full overflow-hidden border-t border-border/60 bg-bg-subtle/50 py-7 sm:py-8", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-[11px] font-semibold tracking-[0.22em] text-fg-subtle uppercase">
          From the Everything.Free library
        </p>
      </div>

      <div
        className="marquee-fade relative mt-4 flex w-full overflow-hidden motion-reduce:overflow-x-auto motion-reduce:mask-none"
        aria-label="Library featured resources"
      >
        <div className="flex w-max shrink-0 items-center gap-3.5 sm:gap-4 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none pr-3.5 sm:pr-4">
          <ul className="flex list-none items-center gap-3.5 sm:gap-4 m-0 p-0">
            {resources.map((resource) => (
              <li key={resource.slug}>
                <Link
                  href={`/resources/${resource.slug}`}
                  className="group flex items-center gap-2.5 rounded-lg border border-border/80 bg-surface/90 px-3.5 py-2 text-fg transition-all duration-150 hover:border-border-strong hover:bg-surface-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ResourceLogo logo={resource.logo} size={22} className="rounded-md" />
                  <span className="whitespace-nowrap text-xs font-medium text-fg-muted transition-colors group-hover:text-fg">
                    {resource.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary duplicate track for seamless infinite looping */}
          <ul aria-hidden="true" className="flex list-none items-center gap-3.5 sm:gap-4 m-0 p-0 motion-reduce:hidden">
            {resources.map((resource) => (
              <li key={`dup-${resource.slug}`}>
                <Link
                  href={`/resources/${resource.slug}`}
                  tabIndex={-1}
                  className="group flex items-center gap-2.5 rounded-lg border border-border/80 bg-surface/90 px-3.5 py-2 text-fg transition-all duration-150 hover:border-border-strong hover:bg-surface-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ResourceLogo logo={resource.logo} size={22} className="rounded-md" />
                  <span className="whitespace-nowrap text-xs font-medium text-fg-muted transition-colors group-hover:text-fg">
                    {resource.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
