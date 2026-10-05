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
      {/* 01. Dynamic Apple-style Atmospheric Ambient Glow Mesh matching brand gold & obsidian */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 h-[600px] overflow-hidden opacity-50 dark:opacity-65"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[480px] w-[800px] max-w-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,155,38,0.18),rgba(217,155,38,0.03),transparent_70%)] blur-3xl" />
        <div className="absolute left-1/3 top-24 h-[320px] w-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(250,247,242,0.05),transparent_70%)] blur-2xl" />
      </div>

      {/* Structural grid background with soft fade */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <Container className="relative pt-12 pb-16 sm:pt-20 sm:pb-22 lg:pt-24 lg:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 02. Interactive Apple-style Announcement Capsule */}
          <Link
            href="/students"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-fg backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-primary/15 hover:shadow-[0_0_24px_rgba(217,155,38,0.22)]"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-semibold text-primary">New:</span>
            <span className="text-fg-muted group-hover:text-fg transition-colors">
              90+ Verified Student Perks ($10,000+ Value)
            </span>
            <Icon
              name="arrow-right"
              size={12}
              className="text-primary transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          {/* 03. Primary Headline with Apple Gradient Typography */}
          <h1
            id="hero-heading"
            className="mt-6 font-display text-4xl font-bold tracking-tight text-fg sm:text-6xl md:text-7xl lg:text-[4.5rem] leading-[1.05]"
          >
            Find what&apos;s{" "}
            <span className="bg-gradient-to-r from-fg via-fg/95 to-primary bg-clip-text text-transparent">
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
              variant="beam"
              label="Search software, tools, resources..."
              placeholderText="Search software, tools, resources, or student perks..."
            />

            {/* Quick Interactive Category Intent Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle select-none mr-0.5">
                Quick:
              </span>
              <Link
                href="/students"
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-105"
              >
                <Icon name="graduation-cap" size={12} />
                Student Perks
              </Link>
              <Link
                href="/categories/developer-tools"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-all hover:border-border-strong hover:bg-surface-raised hover:text-fg hover:scale-105"
              >
                <Icon name="terminal" size={12} className="text-primary" />
                Dev & Cloud
              </Link>
              <Link
                href="/categories/creative-design"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-all hover:border-border-strong hover:bg-surface-raised hover:text-fg hover:scale-105"
              >
                <Icon name="sliders" size={12} className="text-info" />
                Design & 3D
              </Link>
              <Link
                href="/categories/ai-productivity"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-all hover:border-border-strong hover:bg-surface-raised hover:text-fg hover:scale-105"
              >
                <Icon name="cpu" size={12} className="text-warning" />
                AI Models
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface/70 px-2.5 py-1 text-xs font-medium text-fg-muted transition-all hover:border-border-strong hover:bg-surface-raised hover:text-fg hover:scale-105"
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
              className={buttonClasses({ variant: "primary", size: "lg", shape: "pill" })}
            >
              <span>Explore all resources</span>
              <Icon name="arrow-right" size={16} data-arrow="true" className="btn-icon-shift" />
            </Link>
            <Link
              href="/students"
              className={buttonClasses({ variant: "secondary", size: "lg", shape: "pill" })}
            >
              <Icon name="graduation-cap" size={16} className="text-emerald-500" />
              <span>Student Directory</span>
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/50 px-4 py-2 text-sm font-medium text-fg-muted backdrop-blur-xs transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
            >
              <Icon name="terminal" size={14} className="text-fg-subtle" />
              <span>Browser tools</span>
            </Link>
          </div>

          {/* 07. Apple Glass Metric Tiles (Replacing the flat divide line) */}
          <div className="mt-12 w-full max-w-3xl">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {/* Metric 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 dark:bg-surface/30 p-4.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                    {formatCount(resourceCount)}+
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-semibold text-fg">Free Software Catalogue</h3>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  Curated across 8 categories with 0 trial surprises.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 dark:bg-surface/30 p-4.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                    $10,000+
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    CampusKey
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-semibold text-fg">Free for Students</h3>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  GitHub Pack, Azure, JetBrains, Figma & AWS.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface/60 dark:bg-surface/30 p-4.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg text-left">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                    $0 / No Card
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
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
