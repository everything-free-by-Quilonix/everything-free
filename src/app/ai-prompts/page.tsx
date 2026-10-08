import type { Metadata } from "next";
import Link from "next/link";
import { getActivePrompts } from "@/data/ai-prompts/normalized-prompts";
import { PromptExplorer } from "@/features/ai-prompts/components/PromptExplorer";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "AI Prompts — Open-Source & Community Prompt Aggregator | Everything.Free",
  description:
    "Discover, search, and copy prompts aggregated from open-source AI libraries including DiffusionDB, Wikiprompt, and Open Image Prompts with full attribution.",
};

export default function AIPromptsPage() {
  const prompts = getActivePrompts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
          <Link href="/" className="hover:text-fg hover:underline">
            Home
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span className="font-semibold text-fg">AI Prompts</span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            AI Prompts
          </h1>
          <p className="text-base text-fg-muted max-w-3xl leading-relaxed">
            Discover prompts from open and community-driven AI prompt libraries — all in one place.
            Everything.Free aggregates public, open-licensed datasets with verified provenance, transparent author credits, and direct links to original sources.
          </p>
        </div>

        {/* Source Metric Highlights */}
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
          <div className="rounded-xs border border-border bg-surface p-3">
            <span className="block text-lg font-bold text-fg sm:text-xl">3</span>
            <span className="text-xs text-fg-subtle">Connected Datasets</span>
          </div>
          <div className="rounded-xs border border-border bg-surface p-3">
            <span className="block text-lg font-bold text-fg sm:text-xl">14M+</span>
            <span className="text-xs text-fg-subtle">External Records</span>
          </div>
          <div className="rounded-xs border border-border bg-surface p-3">
            <span className="block text-lg font-bold text-fg sm:text-xl">CC0 / Open</span>
            <span className="text-xs text-fg-subtle">Permitted Reuse</span>
          </div>
          <div className="rounded-xs border border-border bg-surface p-3">
            <span className="block text-lg font-bold text-fg sm:text-xl">100%</span>
            <span className="text-xs text-fg-subtle">Attributed Provenance</span>
          </div>
        </div>

        {/* Sister Hub Link to AI Image Commands */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
          <span>Looking for visual styles &amp; camera modifiers?</span>
          <Link
            href="/ai-image-commands"
            className="inline-flex items-center gap-1 font-medium text-fg underline hover:text-fg-muted"
          >
            <span>Explore AI Image Commands</span>
            <Icon name="arrow-right" size={12} />
          </Link>
        </div>
      </div>

      {/* Main Aggregator & Explorer Hub */}
      <PromptExplorer initialPrompts={prompts} />
    </div>
  );
}
