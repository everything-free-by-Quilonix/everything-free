"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { AIImageCommand, CommandCategory } from "@/types/ai-image-command";
import { COMMAND_CATEGORIES } from "@/types/ai-image-command";
import { aiChatPrompts } from "@/data/ai-chat-prompts";
import { aiPluginsTools } from "@/data/ai-plugins-tools";
import { CommandCard } from "./CommandCard";
import { CommandModal } from "./CommandModal";
import { CopyButton } from "./CopyButton";

interface CommandExplorerProps {
  initialCommands: AIImageCommand[];
}

type MainTab = "images" | "chat" | "plugins";
type PlatformFilter = "all" | "chatgpt" | "gemini";

export function CommandExplorer({ initialCommands }: CommandExplorerProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("images");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory | "all">("all");
  const [activeCommand, setActiveCommand] = useState<AIImageCommand | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const cmd of initialCommands) {
      map.set(cmd.category, (map.get(cmd.category) ?? 0) + 1);
    }
    return map;
  }, [initialCommands]);

  // Filtered Image commands
  const filteredCommands = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace(/^\//, "");

    return initialCommands.filter((cmd) => {
      if (selectedPlatform === "chatgpt") {
        if (cmd.platforms.chatgpt === "unsupported" || cmd.platforms.chatgpt === "unknown") return false;
      } else if (selectedPlatform === "gemini") {
        if (cmd.platforms.gemini === "unsupported" || cmd.platforms.gemini === "unknown") return false;
      }

      if (selectedCategory !== "all" && cmd.category !== selectedCategory) {
        return false;
      }

      if (!query) return true;

      const matchesCommand = cmd.id.toLowerCase().includes(query) || cmd.command.toLowerCase().includes(query);
      const matchesName = cmd.name.toLowerCase().includes(query);
      const matchesDesc = cmd.description.toLowerCase().includes(query);
      const matchesCategory = cmd.category.toLowerCase().includes(query);
      const matchesTags = cmd.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesSyntax = cmd.syntax.toLowerCase().includes(query);
      const matchesBestFor = cmd.bestFor.some((bf) => bf.toLowerCase().includes(query));

      return (
        matchesCommand ||
        matchesName ||
        matchesDesc ||
        matchesCategory ||
        matchesTags ||
        matchesSyntax ||
        matchesBestFor
      );
    });
  }, [initialCommands, searchQuery, selectedPlatform, selectedCategory]);

  // Filtered Chat Prompts
  const filteredChatPrompts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace(/^\//, "");
    if (!query) return aiChatPrompts;
    return aiChatPrompts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.command.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  // Filtered Plugins & Tools
  const filteredPlugins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return aiPluginsTools;
    return aiPluginsTools.filter(
      (pl) =>
        pl.name.toLowerCase().includes(query) ||
        pl.description.toLowerCase().includes(query) ||
        pl.type.toLowerCase().includes(query) ||
        pl.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedPlatform !== "all" ||
    selectedCategory !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedPlatform("all");
    setSelectedCategory("all");
  };

  const quickPillCategories: Array<CommandCategory | "Photography" | "Art" | "3D" | "Film" | "Anime" | "Design"> = [
    "Photography",
    "Film",
    "Art",
    "3D",
    "Anime",
    "Design",
    "Effects",
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 3-Step "How It Works" Visual Guide */}
      <div className="rounded-md border border-border bg-surface-raised/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-border">
          <span className="text-xs font-semibold tracking-wider uppercase text-fg-subtle">
            How this works in 3 easy steps
          </span>
          <span className="text-xs text-fg-muted">
            Works directly on ChatGPT, Google Gemini & Claude
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-sm border border-border/80 bg-surface p-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-raised border border-border text-xs font-bold text-fg">
              1
            </span>
            <div>
              <p className="text-xs font-semibold text-fg">Pick a style or prompt</p>
              <p className="text-[11px] text-fg-muted mt-0.5">
                Browse 108 visual styles, coding shortcuts, or writing templates below.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-sm border border-border/80 bg-surface p-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-raised border border-border text-xs font-bold text-fg">
              2
            </span>
            <div>
              <p className="text-xs font-semibold text-fg">Click &ldquo;Copy Command&rdquo;</p>
              <p className="text-[11px] text-fg-muted mt-0.5">
                Copies the command or complete example directly to your clipboard with one click.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-sm border border-border/80 bg-surface p-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-raised border border-border text-xs font-bold text-fg">
              3
            </span>
            <div>
              <p className="text-xs font-semibold text-fg">Paste &amp; Generate</p>
              <p className="text-[11px] text-fg-muted mt-0.5">
                Type the command followed by your subject in ChatGPT or Gemini to get the visual style.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section Tabs: Image Prompts / Writing Prompts / Free Plugins */}
      <div className="flex border-b border-border">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors pointer-coarse:py-3",
              activeTab === "images"
                ? "border-fg text-fg bg-surface-raised/40"
                : "border-transparent text-fg-muted hover:text-fg hover:border-border-strong",
            )}
          >
            <Icon name="image" size={15} />
            <span>AI Image Prompts</span>
            <span className="rounded-xs bg-surface-raised px-1.5 py-0.2 text-[11px] font-mono text-fg-subtle">
              {initialCommands.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors pointer-coarse:py-3",
              activeTab === "chat"
                ? "border-fg text-fg bg-surface-raised/40"
                : "border-transparent text-fg-muted hover:text-fg hover:border-border-strong",
            )}
          >
            <Icon name="terminal" size={15} />
            <span>Chat & Writing Prompts</span>
            <span className="rounded-xs bg-surface-raised px-1.5 py-0.2 text-[11px] font-mono text-fg-subtle">
              {aiChatPrompts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("plugins")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors pointer-coarse:py-3",
              activeTab === "plugins"
                ? "border-fg text-fg bg-surface-raised/40"
                : "border-transparent text-fg-muted hover:text-fg hover:border-border-strong",
            )}
          >
            <Icon name="sliders" size={15} />
            <span>Free AI Plugins & Tools</span>
            <span className="rounded-xs bg-surface-raised px-1.5 py-0.2 text-[11px] font-mono text-fg-subtle">
              {aiPluginsTools.length}
            </span>
          </button>
        </div>
      </div>

      {/* Universal Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-fg-subtle">
            <Icon name="search" size={18} />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "images"
                ? "Search styles, cameras, effects (e.g. 35mm, watercolor, cyberpunk, 3D)..."
                : activeTab === "chat"
                  ? "Search writing and coding prompts (e.g. summarize, debug, explain)..."
                  : "Search free AI tools & extensions (e.g. local ai, vscode, privacy)..."
            }
            aria-label="Search prompts and commands"
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

        {/* Tab-Specific Filters for Image Prompts */}
        {activeTab === "images" ? (
          <>
            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
              <span className="font-medium text-fg-subtle mr-1">Platform:</span>
              <button
                type="button"
                onClick={() => setSelectedPlatform(selectedPlatform === "chatgpt" ? "all" : "chatgpt")}
                className={cn(
                  "rounded-xs border px-2.5 py-1 font-medium transition-colors pointer-coarse:py-2",
                  selectedPlatform === "chatgpt"
                    ? "border-border-strong bg-surface-raised text-fg shadow-2xs font-semibold"
                    : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
                )}
              >
                ChatGPT
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlatform(selectedPlatform === "gemini" ? "all" : "gemini")}
                className={cn(
                  "rounded-xs border px-2.5 py-1 font-medium transition-colors pointer-coarse:py-2",
                  selectedPlatform === "gemini"
                    ? "border-border-strong bg-surface-raised text-fg shadow-2xs font-semibold"
                    : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
                )}
              >
                Gemini
              </button>

              <span className="text-border mx-1" aria-hidden="true">|</span>

              <span className="font-medium text-fg-subtle mr-1">Styles:</span>
              {quickPillCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? "all" : cat)}
                    className={cn(
                      "rounded-xs border px-2 py-1 font-medium transition-colors pointer-coarse:py-2",
                      isSelected
                        ? "border-border-strong bg-surface-raised text-fg shadow-2xs font-semibold"
                        : "border-border bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sub-Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-fg-muted">
              <div className="flex items-center gap-1.5">
                <label htmlFor="category-select" className="text-fg-subtle font-medium">
                  Category:
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CommandCategory | "all")}
                  className="rounded-xs border border-border bg-surface px-2 py-1 text-xs text-fg"
                >
                  <option value="all">All ({initialCommands.length})</option>
                  {COMMAND_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({categoryCounts.get(cat) ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>
                  Showing <strong className="font-semibold text-fg">{filteredCommands.length}</strong> styles
                </span>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-fg-subtle hover:text-fg underline"
                  >
                    Reset
                  </button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: AI IMAGE PROMPTS (108 STYLES)                     */}
      {/* ========================================================= */}
      {activeTab === "images" ? (
        filteredCommands.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCommands.map((command) => (
              <CommandCard
                key={command.id}
                command={command}
                onOpenModal={(cmd) => setActiveCommand(cmd)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No image styles found"
            description="Try searching with a simpler keyword like 'film', 'photo', 'art', or '3D'."
            action={
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-sm border border-border-strong bg-surface-raised px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover transition-colors"
              >
                Reset filters
              </button>
            }
          />
        )
      ) : null}

      {/* ========================================================= */}
      {/* TAB 2: WRITING & CHAT PROMPTS                             */}
      {/* ========================================================= */}
      {activeTab === "chat" ? (
        filteredChatPrompts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredChatPrompts.map((item) => (
              <Card key={item.id} className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-xs bg-bg-subtle border border-border text-fg">
                      {item.command}
                    </span>
                    <Chip className="text-[11px] font-medium">{item.category}</Chip>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-fg">
                    {item.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-fg-muted leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 rounded-xs border border-border bg-bg-subtle p-3 text-xs font-mono text-fg leading-relaxed select-all">
                    {item.prompt}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-fg-subtle">
                    Works on ChatGPT, Claude & Gemini
                  </span>
                  <CopyButton textToCopy={item.prompt} label="Copy prompt" size="sm" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No chat prompts found"
            description="Try searching for another keyword or clear your query."
            action={
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-sm border border-border-strong bg-surface-raised px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover transition-colors"
              >
                Clear search
              </button>
            }
          />
        )
      ) : null}

      {/* ========================================================= */}
      {/* TAB 3: FREE AI PLUGINS & TOOLS                            */}
      {/* ========================================================= */}
      {activeTab === "plugins" ? (
        filteredPlugins.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPlugins.map((plugin) => (
              <Card key={plugin.id} className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-fg">{plugin.name}</span>
                    <Chip className="text-[11px] font-medium">{plugin.type}</Chip>
                  </div>

                  <p className="mt-2.5 text-xs text-fg-muted leading-relaxed">
                    {plugin.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {plugin.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-fg-subtle bg-surface-raised px-1.5 py-0.5 rounded-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-fg">
                    {plugin.freeStatus}
                  </span>

                  <a
                    href={plugin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-fg rounded-sm border border-border-strong bg-surface-raised px-3 py-1 hover:bg-surface-hover transition-colors"
                  >
                    <span>Get Free Tool</span>
                    <Icon name="external-link" size={12} />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No plugins found"
            description="Try searching for another term or clear your search."
            action={
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-sm border border-border-strong bg-surface-raised px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover transition-colors"
              >
                Clear search
              </button>
            }
          />
        )
      ) : null}

      {/* Modal Drawer for Image Commands */}
      <CommandModal
        command={activeCommand}
        onClose={() => setActiveCommand(null)}
      />
    </div>
  );
}
