"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/cn";
import type { ExternalPrompt, PromptCategory, PromptPlatform } from "@/types/ai-prompt";
import { PromptCard } from "./PromptCard";
import { PromptDetailModal } from "./PromptDetailModal";
import { SourceExplorerCards } from "./SourceExplorerCards";

interface PromptExplorerProps {
  initialPrompts: ExternalPrompt[];
}

export function PromptExplorer({ initialPrompts }: PromptExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<PromptPlatform | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | "all">("all");
  const [activePrompt, setActivePrompt] = useState<ExternalPrompt | null>(null);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return initialPrompts.filter((item) => {
      // Source filter
      if (selectedSource !== "all") {
        const itemSourceLower = item.sourceName.toLowerCase();
        if (selectedSource === "diffusiondb" && !itemSourceLower.includes("diffusiondb")) return false;
        if (selectedSource === "wikiprompt" && !itemSourceLower.includes("wikiprompt")) return false;
        if (selectedSource === "open-image-prompts" && !itemSourceLower.includes("open image")) return false;
      }

      // Platform filter
      if (selectedPlatform !== "all") {
        if (!item.platform.includes(selectedPlatform) && !item.platform.includes("Universal")) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (!q) return true;

      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesPrompt = item.prompt.toLowerCase().includes(q);
      const matchesDesc = item.description?.toLowerCase().includes(q) ?? false;
      const matchesAuthor = item.author?.toLowerCase().includes(q) ?? false;
      const matchesSource = item.sourceName.toLowerCase().includes(q);
      const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchesPlatform = item.platform.some((p) => p.toLowerCase().includes(q));

      return (
        matchesTitle ||
        matchesPrompt ||
        matchesDesc ||
        matchesAuthor ||
        matchesSource ||
        matchesTags ||
        matchesPlatform
      );
    });
  }, [initialPrompts, searchQuery, selectedSource, selectedPlatform, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedSource !== "all" ||
    selectedPlatform !== "all" ||
    selectedCategory !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSource("all");
    setSelectedPlatform("all");
    setSelectedCategory("all");
  };

  // Curated prominent platforms for quick filters
  const quickPlatforms: PromptPlatform[] = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Midjourney",
    "Stable Diffusion",
    "FLUX",
  ];

  // Curated prominent categories for quick filters
  const quickCategories: PromptCategory[] = [
    "Writing",
    "Coding",
    "Image Generation",
    "Photography",
    "Art",
    "3D",
    "Productivity",
    "Research",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters Hub */}
      <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-md border border-border bg-surface">
        {/* Universal Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-subtle">
            <Icon name="search" size={18} />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across 14M+ open-source prompt records by keyword, platform, or model..."
            aria-label="Search prompts"
            className="w-full rounded-md border border-border-strong bg-surface py-3 pl-11 pr-10 text-sm sm:text-base text-fg placeholder:text-fg-subtle transition-colors focus:border-border-strong"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-fg-subtle hover:text-fg"
            >
              <Icon name="close" size={16} />
            </button>
          ) : null}
        </div>

        {/* Platform Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-fg-muted">
          <span className="font-medium text-fg-subtle mr-1">Platform:</span>
          <button
            type="button"
            onClick={() => setSelectedPlatform("all")}
            className={cn(
              "rounded-xs border px-2.5 py-1 font-medium transition-colors pointer-coarse:py-2",
              selectedPlatform === "all"
                ? "border-border-strong bg-surface-raised text-fg font-semibold shadow-xs"
                : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            All
          </button>
          {quickPlatforms.map((plat) => {
            const isSelected = selectedPlatform === plat;
            return (
              <button
                key={plat}
                type="button"
                onClick={() => setSelectedPlatform(isSelected ? "all" : plat)}
                className={cn(
                  "rounded-xs border px-2.5 py-1 font-medium transition-colors pointer-coarse:py-2",
                  isSelected
                    ? "border-border-strong bg-surface-raised text-fg font-semibold shadow-xs"
                    : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
                )}
              >
                {plat}
              </button>
            );
          })}
        </div>

        {/* Category Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-fg-muted pt-2 border-t border-border/60">
          <span className="font-medium text-fg-subtle mr-1">Category:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-xs border px-2.5 py-1 font-medium transition-colors pointer-coarse:py-2",
              selectedCategory === "all"
                ? "border-border-strong bg-surface-raised text-fg font-semibold shadow-xs"
                : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            All
          </button>
          {quickCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "all" : cat)}
                className={cn(
                  "rounded-xs border px-2.5 py-1 font-medium transition-colors pointer-coarse:py-2",
                  isSelected
                    ? "border-border-strong bg-surface-raised text-fg font-semibold shadow-xs"
                    : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Status & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-fg-muted border-t border-border/60">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="font-semibold text-fg">{filteredPrompts.length}</strong> curated prompts
              {selectedSource !== "all"
                ? ` from ${selectedSource}`
                : " from 3 connected open datasets (14M+ total records in external archives)"}
            </span>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-fg-subtle hover:text-fg underline font-medium"
            >
              Reset all filters
            </button>
          ) : null}
        </div>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onOpenModal={(p) => setActivePrompt(p)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching prompts found in curated catalog"
          description="Try clearing your search query or reset filters. You can also explore DiffusionDB (14M pairs) or Wikiprompt (55K prompts) directly via the source cards below."
        />
      )}

      {/* Aggregated Open Sources Dataset Explorer (Positioned below content) */}
      <div className="pt-6 border-t border-border">
        <SourceExplorerCards
          selectedSource={selectedSource}
          onSelectSource={(srcId) => setSelectedSource(srcId)}
        />
      </div>

      {/* Prompt Details Dialog Modal */}
      <PromptDetailModal
        prompt={activePrompt}
        onClose={() => setActivePrompt(null)}
      />
    </div>
  );
}
