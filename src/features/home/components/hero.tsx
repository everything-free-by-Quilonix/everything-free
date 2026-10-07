import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
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
  marqueeResources = [],
}: {
  resourceCount: number;
  verifiedCount?: number;
  toolCount: number;
  marqueeResources?: readonly Resource[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-bg" aria-labelledby="hero-heading">
      {/* Structural grid background with soft fade */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <Container className="relative pt-12 pb-16 sm:pt-20 sm:pb-22 lg:pt-24 lg:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 02. Interactive Apple-style Announcement Capsule */}
          <Link
            href="/students"
            className="group inline-flex items-center gap-2 rounded-xs border border-border-strong bg-surface-raised px-4 py-1.5 text-xs font-medium text-fg transition-colors hover:border-fg/40 hover:bg-surface-raised/90"
          >
            <span className="inline-flex size-2 rounded-xs bg-emerald-500" />
            <span className="font-semibold text-fg">New:</span>
            <span className="text-fg-muted group-hover:text-fg transition-colors">
              90+ Verified Student Perks ($10,000+ Value)
            </span>
            <Icon
              name="arrow-right"
              size={12}
              className="text-fg-subtle transition-transform group-hover:translate-x-1 group-hover:text-fg"
            />
          </Link>

          {/* 03. Primary Headline with Apple Gradient Typography */}
          <h1
            id="hero-heading"
            className="mt-6 font-display text-4xl font-bold tracking-tight text-fg sm:text-6xl md:text-7xl lg:text-[4.5rem] leading-[1.05]"
          >
            Find what&apos;s{" "}
            <span className="bg-gradient-to-r from-fg via-fg/95 to-fg/70 bg-clip-text text-transparent">
              genuinely free.
            </span>
          </h1>

          {/* 04. Supporting Description with Generous Breathing Room */}
          <p className="mt-5 max-w-2xl text-base text-fg-muted sm:text-lg sm:leading-relaxed">
            The open, evidence-backed directory of genuine free developer tools, creative suites, cloud tiers, student perks, and browser utilities &mdash; with zero trial traps.
          </p>

          {/* 05. Prominent Beam Search Bar */}
          <div className="mt-8 w-full max-w-2xl lg:max-w-[720px]">
            <SearchBox
              size="lg"
              label="Search software, tools, resources..."
            />

            {/* Quick Interactive Category Intent Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle select-none mr-0.5">
                Quick:
              </span>
              <Link
                href="/students"
                className="inline-flex items-center gap-1 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                <Icon name="graduation-cap" size={12} />
                Student Perks
              </Link>
              <Link
                href="/categories/developer-utilities"
                className="inline-flex items-center gap-1 rounded-sm border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
              >
                <Icon name="terminal" size={12} className="text-fg-subtle" />
                Dev & Cloud
              </Link>
              <Link
                href="/categories/design"
                className="inline-flex items-center gap-1 rounded-sm border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
              >
                <Icon name="sliders" size={12} className="text-info" />
                Design & 3D
              </Link>
              <Link
                href="/categories/ai-productivity"
                className="inline-flex items-center gap-1 rounded-sm border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
              >
                <Icon name="cpu" size={12} className="text-warning" />
                AI Models
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 rounded-sm border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
              >
                <Icon name="terminal" size={12} className="text-fg-subtle" />
                Local Tools
              </Link>
            </div>
          </div>

          {/* 06. Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources"
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              <span>Explore all resources</span>
              <Icon name="arrow-right" size={16} data-arrow="true" className="btn-icon-shift" />
            </Link>
            <Link
              href="/students"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <Icon name="graduation-cap" size={16} className="text-emerald-500" />
              <span>Student Directory</span>
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border/70 bg-surface/50 px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
            >
              <Icon name="terminal" size={14} className="text-fg-subtle" />
              <span>Browser tools</span>
            </Link>
          </div>

          {/* 07. Apple Glass Metric Tiles (Replacing the flat divide line) */}
          <div className="mt-12 w-full max-w-3xl">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {/* Metric 1 */}
              <div className="group relative overflow-hidden rounded-md border border-border/60 bg-surface/60 dark:bg-surface/30 p-4.5 transition-colors hover:border-border-strong hover:bg-surface-raised/90 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                    {formatCount(resourceCount)}+
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xs border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                    <span className="size-1.5 rounded-xs bg-emerald-500" />
                    Verified
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-semibold text-fg">Free Software Catalogue</h3>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Curated across 8 categories with 0 trial surprises.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="group relative overflow-hidden rounded-md border border-border/60 bg-surface/60 dark:bg-surface/30 p-4.5 transition-colors hover:border-border-strong hover:bg-surface-raised/90 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                    $10,000+
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xs border border-border-strong bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-fg-muted">
                    CampusKey
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-semibold text-fg">Free for Students</h3>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  GitHub Pack, Azure, JetBrains, Figma & AWS.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="group relative overflow-hidden rounded-md border border-border/60 bg-surface/60 dark:bg-surface/30 p-4.5 transition-colors hover:border-border-strong hover:bg-surface-raised/90 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                    $0 / No Card
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xs border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                    100% Free
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-semibold text-fg">Zero Paywalls</h3>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Clear free-tier limits stated upfront on every card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* 08. Resource Marquee Strip */}
      <ResourceMarquee resources={marqueeResources} />
    </section>
  );
}
