import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { intentExamples, searchExamples } from "@/config/site";
import { SearchBox } from "@/features/search/components/search-box";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";
import { ResourceMarquee } from "./resource-marquee";

/**
 * Editorial Product Hero.
 *
 * Designed with editorial restraint and search-first usability:
 * 1. Subtle Everything.Free brand eyebrow
 * 2. High-impact, honest primary headline
 * 3. Concise supporting positioning
 * 4. Prominent, product-level search control with keyboard shortcut (⌘K)
 * 5. Quick query prompts preserving natural-language intent search
 * 6. Dual primary/secondary CTAs guiding users to resources and local tools
 * 7. Evidence-based statistics row reflecting live repository facts
 * 8. Continuous resource marquee showcasing genuine library tools with logos
 */
export function Hero({
  resourceCount,
  verifiedCount = 10,
  toolCount,
  marqueeResources = [],
}: {
  resourceCount: number;
  verifiedCount?: number;
  toolCount: number;
  marqueeResources?: readonly Resource[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg" aria-labelledby="hero-heading">
      {/* Subtle structural grid background */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <Container className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-22">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 01. Brand Eyebrow Label */}
          <p className="font-mono text-[11px] font-semibold tracking-[0.24em] text-fg-subtle uppercase select-none">
            EVERYTHING.FREE
          </p>

          {/* 02. Primary Headline */}
          <h1
            id="hero-heading"
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.06]"
          >
            Find what&apos;s genuinely free.
          </h1>

          {/* 03. Supporting Description */}
          <p className="mt-4 max-w-xl text-base text-fg-muted sm:text-lg sm:leading-relaxed">
            Software, tools and resources &mdash; without the usual guesswork.
          </p>

          {/* 04. Prominent Search Control */}
          <div className="mt-8 w-full max-w-2xl lg:max-w-[720px]">
            <SearchBox
              size="lg"
              variant="beam"
              label="Search software, tools, resources..."
              placeholderText="Search software, tools, resources..."
            />

            {/* Quick search intent pills */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-fg-subtle">
              <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle select-none">
                Try:
              </span>
              {searchExamples.slice(0, 3).map((query) => (
                <Link
                  key={query}
                  href={`/resources/?q=${encodeURIComponent(query)}`}
                  className="rounded-md border border-border/70 bg-surface/60 px-2 py-0.5 text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-fg"
                >
                  {query}
                </Link>
              ))}
              {intentExamples.slice(1, 2).map((query) => (
                <Link
                  key={query}
                  href={`/resources/?q=${encodeURIComponent(query)}`}
                  className="hidden sm:inline-block rounded-md border border-border/70 bg-surface/60 px-2 py-0.5 text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-fg"
                >
                  “{query}”
                </Link>
              ))}
            </div>
          </div>

          {/* 05. Primary & Secondary Actions */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources"
              className={buttonClasses({ variant: "primary", size: "lg", shape: "pill" })}
            >
              <span>Explore resources</span>
              <Icon name="arrow-right" size={16} data-arrow="true" className="btn-icon-shift" />
            </Link>
            <Link
              href="/tools"
              className={buttonClasses({ variant: "secondary", size: "lg", shape: "pill" })}
            >
              <Icon name="terminal" size={15} className="text-fg-subtle" />
              <span>Explore tools</span>
            </Link>
          </div>

          {/* 06. Trust / Statistics Row */}
          <div className="mt-12 w-full max-w-xl border-t border-border/70 pt-8">
            <div className="grid grid-cols-3 divide-x divide-border/80 text-center">
              <div className="px-2 sm:px-6">
                <div className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                  {formatCount(resourceCount)}
                </div>
                <div className="mt-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-fg-subtle uppercase sm:text-[11px]">
                  Resources
                </div>
              </div>
              <div className="px-2 sm:px-6">
                <div className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                  {formatCount(verifiedCount)}
                </div>
                <div className="mt-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-fg-subtle uppercase sm:text-[11px]">
                  Verified
                </div>
              </div>
              <div className="px-2 sm:px-6">
                <div className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                  {formatCount(toolCount)}
                </div>
                <div className="mt-1 font-mono text-[10px] font-semibold tracking-[0.16em] text-fg-subtle uppercase sm:text-[11px]">
                  Local Tools
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-fg-subtle">
              Every listing states its free tier limits, account rules, and official verification facts plainly.
            </p>
          </div>
        </div>
      </Container>

      {/* 07. Resource Marquee Strip */}
      <ResourceMarquee resources={marqueeResources} />
    </section>
  );
}
