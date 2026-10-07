"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { STUDENT_OFFERS, type StudentOffer } from "@/data/students/campus-key";
import { cn } from "@/lib/utils/cn";

// Categories mapped to clean display names
const CATEGORIES = [
  "All",
  "Developer and Cloud",
  "AI and Productivity",
  "Design and Engineering",
  "Learning",
  "Hardware and Shopping",
  "Travel",
  "Government and Scholarships",
  "Campus Programs",
] as const;

function getDomain(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function StudentExplorer() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedReq, setSelectedReq] = useState<string>("All");
  const [selectedOffer, setSelectedOffer] = useState<StudentOffer | null>(null);

  // Filtered list
  const filteredOffers = useMemo(() => {
    return STUDENT_OFFERS.filter((offer) => {
      // Category filter
      if (selectedCategory !== "All" && offer.category !== selectedCategory) {
        return false;
      }

      // Requirement filter
      if (selectedReq !== "All") {
        const hasReq = offer.verification.some((v) =>
          v.toLowerCase().includes(selectedReq.toLowerCase()),
        );
        if (!hasReq) return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = offer.name.toLowerCase().includes(q);
        const matchesProvider = offer.provider.toLowerCase().includes(q);
        const matchesOffer = offer.offer.toLowerCase().includes(q);
        const matchesCat = offer.category.toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesOffer && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [search, selectedCategory, selectedReq]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: STUDENT_OFFERS.length };
    for (const offer of STUDENT_OFFERS) {
      counts[offer.category] = (counts[offer.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="mx-auto w-full max-w-(--container-content) px-4 pt-6 pb-20 sm:px-6 lg:px-8">
      {/* 1. Header & Value Stats */}
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xs border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-fg-muted">
          <Icon name="graduation-cap" size={14} />
          CampusKey · Verified Student Directory
        </span>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
          Free Software & Perks for Students
        </h1>

        <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">
          Claim genuine free developer packs, cloud infrastructure, AI models, professional IDEs, and campus software with your student status.
        </p>

        {/* Stats strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-sm border border-border bg-surface px-6 py-3.5">
          <div className="text-center">
            <span className="font-display text-xl sm:text-2xl font-bold text-fg">90+</span>
            <p className="text-[11px] font-medium text-fg-subtle uppercase tracking-wider">Verified Perks</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="font-display text-xl sm:text-2xl font-bold text-fg">$10,000+</span>
            <p className="text-[11px] font-medium text-fg-subtle uppercase tracking-wider">Software Value</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="font-display text-xl sm:text-2xl font-bold text-fg">100% Free</span>
            <p className="text-[11px] font-medium text-fg-subtle uppercase tracking-wider">Zero Tuition Cost</p>
          </div>
        </div>

        {/* 2. Search Input */}
        <div className="relative mt-8 w-full max-w-2xl">
          <div className="relative flex items-center">
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-4 text-fg-subtle"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student tools (GitHub Pack, JetBrains, Azure, Figma)..."
              className="h-11 w-full rounded-sm border border-border-strong bg-surface pl-11 pr-10 text-sm text-fg shadow-xs placeholder:text-fg-subtle"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3.5 rounded-xs p-1 text-fg-subtle hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="close" size={14} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-sm border border-border bg-surface p-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] ?? 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-surface-raised font-semibold text-fg"
                    : "text-fg-muted hover:bg-surface-hover hover:text-fg",
                )}
              >
                <span>{cat}</span>
                <span className="rounded-xs bg-surface px-1.5 py-0.2 text-[10px] tabular-nums text-fg-subtle">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Requirement Filters */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-fg-subtle text-[11px] font-medium mr-1">Filter by requirement:</span>
          {[
            { id: "All", label: "All" },
            { id: "college email", label: "College Email (.edu / .ac)" },
            { id: "github", label: "GitHub Student Pack" },
            { id: "id card", label: "Student ID Card" },
          ].map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={() => setSelectedReq(req.id)}
              className={cn(
                "rounded-xs px-2.5 py-1 font-medium transition-colors",
                selectedReq === req.id
                  ? "border border-border-strong bg-surface-raised text-fg"
                  : "border border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {req.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Results Grid */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between text-xs text-fg-muted">
          <span>
            Showing <strong className="text-fg">{filteredOffers.length}</strong> perks
            {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
            {selectedReq !== "All" ? ` requiring ${selectedReq}` : ""}
          </span>
          {search || selectedCategory !== "All" || selectedReq !== "All" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedReq("All");
              }}
              className="text-fg-muted underline hover:text-fg cursor-pointer"
            >
              Reset all filters
            </button>
          ) : null}
        </div>

        {filteredOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-16 text-center">
            <Icon name="search" size={28} className="text-fg-subtle" />
            <h2 className="mt-3 text-sm font-semibold text-fg">No student perks match your query</h2>
            <p className="mt-1 text-xs text-fg-muted max-w-sm">
              Try searching for something else or clearing the requirement filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSelectedReq("All");
              }}
              className="mt-4 rounded-xs border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg hover:bg-surface-hover"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => {
              const domain = getDomain(offer.url);
              const logoUrl = domain
                ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
                : null;
              const initials = offer.name.slice(0, 2).toUpperCase();

              return (
                <article
                  key={offer.slug}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-border bg-surface p-4 sm:p-5"
                >
                  <div>
                    {/* Top Header: Logo + Provider & Category */}
                    <div className="flex items-start gap-3">
                      <div className="relative flex size-10 shrink-0 select-none items-center justify-center overflow-hidden rounded-xs border border-border bg-surface-raised p-1">
                        <span aria-hidden="true" className="absolute font-display text-xs font-semibold text-fg-muted">
                          {initials}
                        </span>
                        {logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logoUrl}
                            alt=""
                            width={36}
                            height={36}
                            loading="lazy"
                            className="relative size-full rounded-xs object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-fg-subtle">
                            {offer.provider}
                          </span>
                          <span className="rounded-xs border border-border bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle truncate max-w-[120px]">
                            {offer.category}
                          </span>
                        </div>
                        <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight text-fg mt-0.5">
                          {offer.name}
                        </h3>
                      </div>
                    </div>

                    {/* Offer Perk */}
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-fg-muted line-clamp-2">
                      {offer.offer}
                    </p>

                    {/* Value Badge */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-xs border border-border bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-fg">
                        <Icon name="check" size={10} className="shrink-0" />
                        {offer.value.length > 35 ? `${offer.value.slice(0, 35)}…` : offer.value}
                      </span>
                    </div>

                    {/* Verification Requirements Pills */}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {offer.verification.map((v) => (
                        <span
                          key={v}
                          className="rounded-xs border border-border bg-bg-subtle px-1.5 py-0.5 text-[10px] text-fg-subtle"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions: How to Claim & Direct Portal Link */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOffer(offer)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-fg-muted hover:text-fg transition-colors cursor-pointer"
                    >
                      <Icon name="info" size={13} />
                      How to claim
                    </button>

                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xs border border-border bg-surface-raised px-2.5 py-1 text-xs font-semibold text-fg transition-colors hover:bg-surface-hover"
                    >
                      Claim Offer
                      <Icon name="arrow-up-right" size={12} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. How to Claim Modal Dialog */}
      {selectedOffer ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedOffer(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-sm border border-border bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  {selectedOffer.provider} · {selectedOffer.category}
                </span>
                <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-fg">
                  {selectedOffer.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                aria-label="Close modal"
                className="rounded-xs p-1 text-fg-subtle hover:bg-surface-raised hover:text-fg"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* What you get */}
            <div className="mt-4 rounded-xs border border-border bg-surface-raised p-3.5 text-xs text-fg">
              <strong className="font-semibold block mb-0.5">What students get:</strong>
              {selectedOffer.offer} ({selectedOffer.value})
            </div>

            {/* Eligibility */}
            <div className="mt-3.5 text-xs">
              <strong className="text-fg font-semibold block mb-1">Who is eligible:</strong>
              <p className="text-fg-muted leading-relaxed">{selectedOffer.eligibility}</p>
            </div>

            {/* Verification needed */}
            <div className="mt-3.5 text-xs">
              <strong className="text-fg font-semibold block mb-1.5">Verification required:</strong>
              <div className="flex flex-wrap gap-1.5">
                {selectedOffer.verification.map((v) => (
                  <span
                    key={v}
                    className="rounded-xs border border-border bg-surface-raised px-2 py-1 text-xs font-medium text-fg-muted"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Step by step guide */}
            <div className="mt-5 border-t border-border pt-4">
              <strong className="font-display text-sm font-semibold text-fg block mb-2.5">
                Step-by-step instructions to claim:
              </strong>
              <ol className="flex flex-col gap-2.5 text-xs leading-relaxed text-fg-muted">
                {selectedOffer.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-xs bg-surface-raised font-mono text-[11px] font-semibold text-fg">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Notes if any */}
            {selectedOffer.notes ? (
              <div className="mt-4 rounded-xs border border-border bg-surface-raised p-3 text-[11.5px] leading-relaxed text-fg-subtle">
                <strong className="font-medium text-fg block mb-0.5">Important note:</strong>
                {selectedOffer.notes}
              </div>
            ) : null}

            {/* Modal Footer CTA */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setSelectedOffer(null)}
                className="rounded-xs border border-border px-4 py-2 text-xs font-medium text-fg-muted hover:bg-surface-raised hover:text-fg"
              >
                Close
              </button>
              <a
                href={selectedOffer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                Go to Official Claim Portal
                <Icon name="arrow-up-right" size={13} />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
