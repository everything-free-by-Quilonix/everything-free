"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ResourceCard } from "@/features/resources/components/resource-card";
import { cn } from "@/lib/utils/cn";
import type { Resource } from "@/types/resource";

export interface ShowcaseTab {
  id: string;
  label: string;
  shortLabel?: string;
  icon: "compass" | "graduation-cap" | "terminal" | "palette" | "cpu" | "shield-check";
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  badge?: string;
}

const TABS: ShowcaseTab[] = [
  {
    id: "spotlight",
    label: "All Spotlight",
    shortLabel: "Spotlight",
    icon: "compass",
    description: "Curated standout software with generous, genuinely usable free plans.",
    viewAllHref: "/resources",
    viewAllLabel: "Browse all resources",
  },
  {
    id: "students",
    label: "Student Perks",
    shortLabel: "Students",
    icon: "graduation-cap",
    description: "Exclusive educational tiers and free packs offering over $10,000 in professional software.",
    viewAllHref: "/students",
    viewAllLabel: "Explore all 90+ student perks",
    badge: "$10k+",
  },
  {
    id: "developer",
    label: "Dev & Cloud",
    shortLabel: "Developer",
    icon: "terminal",
    description: "Generous free cloud tiers, databases, dev environments, and command-line toolchains.",
    viewAllHref: "/categories/developer-tools",
    viewAllLabel: "Explore developer tools",
  },
  {
    id: "design",
    label: "Design & 3D",
    shortLabel: "Design",
    icon: "palette",
    description: "World-class 3D modeling, vector editors, and creative suites with zero subscriptions.",
    viewAllHref: "/categories/creative-design",
    viewAllLabel: "Explore creative & design tools",
  },
  {
    id: "ai",
    label: "AI & Models",
    shortLabel: "AI Models",
    icon: "cpu",
    description: "Local model runners, open-source weights, and developer AI inference tiers.",
    viewAllHref: "/categories/ai-productivity",
    viewAllLabel: "Explore AI tools",
  },
  {
    id: "recently-checked",
    label: "Recently Checked",
    shortLabel: "Verified",
    icon: "shield-check",
    description: "Recently audited against official documentation to guarantee pricing and terms accuracy.",
    viewAllHref: "/resources?sort=recently-verified",
    viewAllLabel: "See all by verified date",
  },
];

export function DynamicShowcase({
  spotlightResources = [],
  studentResources = [],
  developerResources = [],
  designResources = [],
  aiResources = [],
  recentlyCheckedResources = [],
}: {
  spotlightResources: Resource[];
  studentResources: Resource[];
  developerResources: Resource[];
  designResources: Resource[];
  aiResources: Resource[];
  recentlyCheckedResources: Resource[];
}) {
  const [activeTab, setActiveTab] = useState<string>("spotlight");

  const resourceMap: Record<string, Resource[]> = useMemo(
    () => ({
      spotlight: spotlightResources,
      students: studentResources,
      developer: developerResources,
      design: designResources,
      ai: aiResources,
      "recently-checked": recentlyCheckedResources,
    }),
    [
      spotlightResources,
      studentResources,
      developerResources,
      designResources,
      aiResources,
      recentlyCheckedResources,
    ],
  );

  const currentTab = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
  const currentResources = resourceMap[activeTab] ?? [];

  return (
    <div className="w-full">
      {/* 1. Header with Apple-Style Subtitle & Description */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
            <Icon name="compass" size={13} />
            Interactive Discovery Hub
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Explore Curated Selections
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-muted">
            {currentTab.description}
          </p>
        </div>

        {/* Dynamic Action Link */}
        <Link
          href={currentTab.viewAllHref}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          <span>{currentTab.viewAllLabel}</span>
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* 2. Apple-Style Segmented Filter Pill Bar */}
      <div className="mt-6 flex items-center overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-flex items-center gap-1.5 rounded-2xl border border-border/70 bg-surface/75 p-1.5 backdrop-blur-md dark:bg-surface/40">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-fg shadow-sm scale-100"
                    : "text-fg-muted hover:bg-surface-raised hover:text-fg",
                )}
              >
                <Icon
                  name={tab.icon}
                  size={13}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary-fg" : "text-fg-subtle",
                  )}
                />
                <span>{tab.label}</span>

                {tab.badge ? (
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider",
                      isActive
                        ? "bg-primary-fg/20 text-primary-fg"
                        : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dynamic Animated Grid */}
      <div
        key={activeTab}
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-300"
      >
        {currentResources.slice(0, 6).map((resource) => (
          <div key={resource.slug} className="flex">
            <ResourceCard resource={resource} className="w-full" />
          </div>
        ))}
      </div>

      {/* 4. Bottom Quick Explore Footer */}
      <div className="mt-8 flex items-center justify-between rounded-2xl border border-border/60 bg-surface/50 p-4 backdrop-blur-xs sm:px-6">
        <div className="flex items-center gap-2 text-xs text-fg-subtle">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>
            Showing <strong className="text-fg">{Math.min(currentResources.length, 6)}</strong> handpicked selections
          </span>
        </div>

        <Link
          href={currentTab.viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg transition-colors hover:text-primary"
        >
          <span>{currentTab.viewAllLabel}</span>
          <Icon name="arrow-up-right" size={13} />
        </Link>
      </div>
    </div>
  );
}
