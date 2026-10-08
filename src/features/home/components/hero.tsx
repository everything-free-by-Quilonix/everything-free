import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { SearchBox } from "@/features/search/components/search-box";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";
import { ResourceMarquee } from "./resource-marquee";

/**
 * Editorial Search-First Hero.
 *
 * Implements the hybrid Editorial Search + Catalog / Index Hero:
 * - Brand eyebrow: EVERYTHING.FREE
 * - Clear editorial headline: "Free resources, without the guesswork."
 * - Concise supporting positioning
 * - Beam Search input with real shortcut (⌘K / Ctrl K) and traveling edge beam
 * - Live proof counters row from real application data (resources, verified, local tools)
 * - Guarantee line: "Completely free · Open source · No account"
 * - Natural transition into category discovery
 */
export function Hero({
  resourceCount,
  verifiedCount = 0,
  toolCount,
  marqueeResources = [],
}: {
  resourceCount: number;
  verifiedCount?: number;
  toolCount: number;
  marqueeResources?: readonly Resource[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-bg" aria-labelledby="hero-heading">
      {/* Global-Level Ambient Lighting & Subtle Grid Background */}
      <div className="motion-hero-ambient" aria-hidden="true" />
      <div className="motion-hero-grid" aria-hidden="true" />

      <Container className="relative pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 01. Brand Eyebrow with subtle live indicator */}
          <div className="motion-hero-enter-1 inline-flex items-center gap-2 rounded-xs border border-border bg-surface/80 px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-fg-subtle shadow-2xs">
            <span className="relative flex size-1.5 items-center justify-center" aria-hidden="true">
              <span className="motion-pulse-dot absolute size-2 rounded-xs bg-fg-subtle opacity-75" />
              <span className="relative size-1.5 rounded-xs bg-fg" />
            </span>
            EVERYTHING.FREE
          </div>

          {/* 02. High-Impact Editorial Headline */}
          <h1
            id="hero-heading"
            className="motion-hero-enter-2 mt-4 font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-fg leading-[1.08] text-balance"
          >
            Free resources, without<br className="hidden sm:inline" /> the guesswork.
            <span className="sr-only"> ({formatCount(resourceCount)} listings)</span>
          </h1>

          {/* 03. Supporting Description */}
          <p className="motion-hero-enter-3 mt-4 max-w-2xl text-base sm:text-lg text-fg-muted leading-relaxed text-pretty">
            A curated directory of software, tools and resources with transparent free-status information.
          </p>

          {/* 04. Hero Beam Search Bar */}
          <div className="motion-hero-enter-4 mt-8 w-full max-w-2xl lg:max-w-[720px]">
            <SearchBox
              size="lg"
              variant="beam"
              placeholder="Search software, tools, resources..."
              label="Search software, tools, resources..."
            />

            {/* Quick intent shortcuts */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-[11px] font-medium text-fg-subtle select-none mr-1">Quick:</span>
              <Link
                href="/students"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg shadow-2xs"
              >
                <Icon name="graduation-cap" size={12} className="text-fg-subtle" />
                Student Perks
              </Link>
              <Link
                href="/categories/developer-utilities"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg shadow-2xs"
              >
                <Icon name="terminal" size={12} className="text-fg-subtle" />
                Dev & Cloud
              </Link>
              <Link
                href="/categories/photography"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg shadow-2xs"
              >
                <Icon name="sliders" size={12} className="text-fg-subtle" />
                Creative & Photo
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg shadow-2xs"
              >
                <Icon name="cpu" size={12} className="text-fg-subtle" />
                Local Tools
              </Link>
            </div>
          </div>

          {/* 05. Live Proof Counters Row - Sleek tactile cards */}
          <div className="motion-hero-enter-5 mt-10 w-full max-w-xl">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 rounded-md border border-border bg-surface/60 p-2 sm:p-3 shadow-2xs">
              <div className="flex flex-col items-center py-2 px-1 transition-colors hover:bg-surface-hover/50 rounded-xs">
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                  {formatCount(resourceCount)}
                </span>
                <span className="mt-1 text-2xs font-semibold tracking-wider text-fg-subtle uppercase">
                  Resources
                </span>
              </div>
              <div className="flex flex-col items-center py-2 px-1 border-x border-border/80 transition-colors hover:bg-surface-hover/50 rounded-xs">
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                  {formatCount(verifiedCount)}
                </span>
                <span className="mt-1 text-2xs font-semibold tracking-wider text-fg-subtle uppercase">
                  Verified
                </span>
              </div>
              <div className="flex flex-col items-center py-2 px-1 transition-colors hover:bg-surface-hover/50 rounded-xs">
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                  {formatCount(toolCount)}
                </span>
                <span className="mt-1 text-2xs font-semibold tracking-wider text-fg-subtle uppercase">
                  Local Tools
                </span>
              </div>
            </div>

            {/* 06. Guarantee Line */}
            <p className="mt-3 text-xs sm:text-sm text-fg-subtle flex flex-wrap items-center justify-center gap-2">
              <span>Completely free</span>
              <span aria-hidden="true">·</span>
              <span>Open source</span>
              <span aria-hidden="true">·</span>
              <span>No account</span>
            </p>
          </div>

          {/* 07. Action CTAs */}
          <div className="motion-hero-enter-5 mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources"
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              <span>Explore all resources</span>
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link
              href="/tools"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <Icon name="terminal" size={16} />
              <span>Browser tools</span>
            </Link>
          </div>
        </div>
      </Container>

      {/* 08. Resource Marquee Strip */}
      <ResourceMarquee resources={marqueeResources} />
    </section>
  );
}

