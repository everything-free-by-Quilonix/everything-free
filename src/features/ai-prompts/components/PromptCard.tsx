"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, stretchedLink } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/icons";
import type { ExternalPrompt } from "@/types/ai-prompt";
import { cn } from "@/lib/utils/cn";

interface PromptCardProps {
  prompt: ExternalPrompt;
  onOpenModal?: (prompt: ExternalPrompt) => void;
  className?: string;
}

function getCategoryIcon(category: string): IconName {
  switch (category) {
    case "Coding":
      return "code";
    case "Writing":
      return "file-text";
    case "Productivity":
      return "sliders";
    case "Education":
      return "graduation-cap";
    case "Research":
      return "book-open";
    case "Marketing":
      return "send";
    case "Photography":
    case "Image Generation":
      return "image";
    case "Art":
      return "palette";
    case "3D":
      return "layers";
    case "Design":
      return "grid";
    case "UI/UX":
      return "monitor";
    case "Business":
      return "briefcase";
    case "Video":
      return "film";
    default:
      return "compass";
  }
}

export function PromptCard({ prompt, onOpenModal, className }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const categoryIcon = getCategoryIcon(prompt.category);

  return (
    <Card
      as="article"
      interactive
      className={cn(
        "group flex flex-col justify-between overflow-hidden border border-border bg-surface transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div>
        {/* Top Visual Banner: Cover Image or Styled Archetype Header */}
        {prompt.imageUrl ? (
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-bg-subtle border-b border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prompt.imageUrl}
              alt={`Sample output for ${prompt.title}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/25 to-transparent pointer-events-none" />

            {/* Overlaid Badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-medium bg-surface border border-border text-fg shadow-xs">
                <Icon name={categoryIcon} size={11} className="text-fg-subtle" />
                {prompt.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium text-fg bg-surface border border-border shadow-xs">
                {prompt.sourceName}
              </span>
            </div>

            {/* Bottom-left Platform Badges on Image */}
            <div className="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-1 pointer-events-none">
              {prompt.platform.slice(0, 2).map((plat) => (
                <span
                  key={plat}
                  className="px-1.5 py-0.5 rounded-xs text-[10px] font-medium bg-bg/90 border border-border text-fg-subtle shadow-xs"
                >
                  {plat}
                </span>
              ))}
              {prompt.platform.length > 2 ? (
                <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-medium bg-bg/90 border border-border text-fg-subtle shadow-xs">
                  +{prompt.platform.length - 2}
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          /* Text Prompts: Clean Archetype Banner for Uniform Visual Rhythm */
          <div className="relative w-full p-4 bg-bg-subtle/80 border-b border-border flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-1.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-medium bg-surface border border-border text-fg shadow-xs">
                <Icon name={categoryIcon} size={12} className="text-fg-subtle" />
                {prompt.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium text-fg-muted bg-surface border border-border">
                {prompt.sourceName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {prompt.platform.map((plat) => (
                <Badge key={plat} size="sm" tone="neutral">
                  {plat}
                </Badge>
              ))}
              {prompt.model ? (
                <span className="text-[11px] font-mono text-fg-subtle px-1.5 py-0.5 rounded-xs bg-surface border border-border">
                  {prompt.model}
                </span>
              ) : null}
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Title */}
          <h3 className="text-base font-semibold leading-snug text-fg">
            {onOpenModal ? (
              <button
                type="button"
                onClick={() => onOpenModal(prompt)}
                className={cn("text-left font-semibold hover:underline focus:underline line-clamp-1", stretchedLink)}
              >
                {prompt.title}
              </button>
            ) : (
              <Link
                href={`/ai-prompts/${prompt.id}`}
                className={cn("hover:underline focus:underline line-clamp-1", stretchedLink)}
              >
                {prompt.title}
              </Link>
            )}
          </h3>

          {/* Prompt Snippet: Clean, proportional natural typography */}
          <div className="relative rounded-xs bg-bg-subtle/50 border border-border/80 p-3 transition-colors group-hover:border-border">
            <p className="text-xs sm:text-[13px] leading-relaxed text-fg-muted line-clamp-3 select-all">
              &ldquo;{prompt.prompt}&rdquo;
            </p>
          </div>

          {/* Single Attribution Line */}
          <div className="flex items-center justify-between gap-2 text-xs text-fg-subtle">
            <div className="flex items-center gap-1.5 truncate">
              <span>Attributed to:</span>
              <span className="font-medium text-fg truncate">
                {prompt.author || prompt.sourceName}
              </span>
            </div>

            {prompt.license ? (
              <span className="text-[11px] font-mono text-fg-subtle shrink-0">
                {prompt.license.includes("CC0") ? "CC0" : "Attribution"}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Single Clean Action Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 flex items-center justify-between gap-2 border-t border-border/70">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border text-xs font-medium transition-colors",
            copied
              ? "bg-surface-raised border-border-strong text-fg font-semibold"
              : "bg-surface border-border text-fg hover:bg-surface-hover",
          )}
        >
          <Icon name={copied ? "check" : "copy"} size={13} />
          <span>{copied ? "Copied Prompt!" : "Copy Prompt"}</span>
        </button>

        {/* View Details / Canonical Link */}
        <div className="relative z-10 flex items-center gap-1.5">
          {prompt.provenance.originalUrl ? (
            <a
              href={prompt.provenance.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View canonical record on ${prompt.sourceName}`}
              className="inline-flex size-7 items-center justify-center rounded-xs border border-border text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors pointer-coarse:size-9"
              title="View original source"
            >
              <Icon name="external-link" size={13} />
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => onOpenModal?.(prompt)}
            aria-label={`View details for ${prompt.title}`}
            className="inline-flex size-7 items-center justify-center rounded-xs border border-border text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors pointer-coarse:size-9"
            title="Expand prompt details"
          >
            <Icon name="arrow-right" size={13} />
          </button>
        </div>
      </div>
    </Card>
  );
}
