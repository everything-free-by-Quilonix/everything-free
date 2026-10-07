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
      {/* Structural subtle grid background */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative pt-12 pb-14 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 01. Brand Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-fg-subtle">
            EVERYTHING.FREE
          </div>

          {/* 02. High-Impact Editorial Headline */}
          <h1
            id="hero-heading"
            className="mt-3 font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-fg leading-[1.08] text-balance"
          >
            Free resources, without<br className="hidden sm:inline" /> the guesswork.
            <span className="sr-only"> ({formatCount(resourceCount)} listings)</span>
          </h1>

          {/* 03. Supporting Description */}
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-fg-muted leading-relaxed text-pretty">
            A curated directory of software, tools and resources with transparent free-status information.
          </p>

          {/* 04. Hero Beam Search Bar */}
          <div className="mt-8 w-full max-w-2xl lg:max-w-[720px]">
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
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                <Icon name="graduation-cap" size={12} className="text-fg-subtle" />
                Student Perks
              </Link>
              <Link
                href="/categories/developer-utilities"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                <Icon name="terminal" size={12} className="text-fg-subtle" />
                Dev & Cloud
              </Link>
              <Link
                href="/categories/photography"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                <Icon name="sliders" size={12} className="text-fg-subtle" />
                Creative & Photo
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised/80 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                <Icon name="cpu" size={12} className="text-fg-subtle" />
                Local Tools
              </Link>
            </div>
          </div>

          {/* 05. Live Proof Counters Row */}
          <div className="mt-10 flex items-center justify-center gap-6 sm:gap-14 border-y border-rule/80 py-4.5 px-4 w-full max-w-xl">
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                {formatCount(resourceCount)}
              </span>
              <span className="mt-1 text-2xs font-semibold tracking-wider text-fg-subtle uppercase">
                Resources
              </span>
            </div>
            <div className="h-8 w-px bg-rule" aria-hidden="true" />
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                {formatCount(verifiedCount)}
              </span>
              <span className="mt-1 text-2xs font-semibold tracking-wider text-fg-subtle uppercase">
                Verified
              </span>
            </div>
            <div className="h-8 w-px bg-rule" aria-hidden="true" />
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg tabular-nums">
                {formatCount(toolCount)}
              </span>
              <span className="mt-1 text-2xs font-semibold tracking-wider text-fg-subtle uppercase">
                Local Tools
              </span>
            </div>
          </div>

          {/* 06. Guarantee Line */}
          <p className="mt-4 text-xs sm:text-sm text-fg-subtle flex flex-wrap items-center justify-center gap-2">
            <span>Completely free</span>
            <span aria-hidden="true">·</span>
            <span>Open source</span>
            <span aria-hidden="true">·</span>
            <span>No account</span>
          </p>

          {/* 07. Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

