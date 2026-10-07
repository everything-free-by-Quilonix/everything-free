"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";

interface FeaturedStudentBrand {
  name: string;
  perk: string;
  domain: string;
}

const TOP_STUDENT_BRANDS: FeaturedStudentBrand[] = [
  { name: "GitHub", perk: "Student Pack & Copilot", domain: "github.com" },
  { name: "Microsoft Azure", perk: "$100 Free Cloud Credits", domain: "azure.microsoft.com" },
  { name: "JetBrains", perk: "All IDEs Free License", domain: "jetbrains.com" },
  { name: "Figma", perk: "Professional Tier Free", domain: "figma.com" },
  { name: "Autodesk", perk: "AutoCAD & Fusion 360", domain: "autodesk.com" },
  { name: "AWS Educate", perk: "Cloud Labs & Sandboxes", domain: "aws.amazon.com" },
];

export function StudentBanner() {
  return (
    <div className="relative overflow-hidden rounded-md border border-border-strong bg-surface/85 p-6 sm:p-8 lg:p-10 shadow-xl">
      <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-xs border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-500">
            <Icon name="graduation-cap" size={14} />
            <span>CampusKey · College & Student Directory</span>
          </div>

          <h3 className="mt-3.5 font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl lg:text-4xl leading-tight">
            Claim Over <span className="text-emerald-500">$10,000+</span> in Free Pro Software.
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
            Verified student status unlocks GitHub Student Developer Pack, $100 Microsoft Azure cloud credits, JetBrains IDEs, Figma Pro, and Autodesk licenses &mdash; 100% free with no credit card required.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/students"
              className={buttonClasses({ variant: "primary", size: "md" })}
            >
              <span>Explore 90+ Student Perks</span>
              <Icon name="arrow-right" size={14} />
            </Link>

            <Link
              href="/collections/student-starter-kit"
              className="inline-flex items-center gap-1.5 rounded-xs border border-border/80 bg-surface/70 px-4 py-2.5 text-xs font-semibold text-fg-muted transition-colors hover:border-border-strong hover:bg-surface-raised hover:text-fg"
            >
              <Icon name="book-open" size={14} className="text-fg-subtle" />
              <span>Student Starter Kit</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Top Brand Cloud with Real Logos */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {TOP_STUDENT_BRANDS.map((brand) => {
              const logoUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(brand.domain)}&sz=128`;
              return (
                <Link
                  key={brand.name}
                  href="/students"
                  className="group flex items-center gap-3 rounded-md border border-border/70 bg-surface/80 p-3 transition-colors hover:border-emerald-500/40 hover:bg-surface-raised"
                >
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/70 bg-surface-raised p-1 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt={brand.name}
                      width={32}
                      height={32}
                      loading="lazy"
                      className="size-full rounded-md object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-fg group-hover:text-emerald-500 transition-colors">
                      {brand.name}
                    </p>
                    <p className="truncate text-[10.5px] text-fg-subtle">
                      {brand.perk}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
