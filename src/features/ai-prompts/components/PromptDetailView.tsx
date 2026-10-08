"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Chip } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import type { ExternalPrompt } from "@/types/ai-prompt";

interface PromptDetailViewProps {
  prompt: ExternalPrompt;
  isModal?: boolean;
}

export function PromptDetailView({ prompt, isModal = false }: PromptDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col gap-6 text-fg">
      {/* Optional Preview Image */}
      {prompt.imageUrl ? (
        <div className="relative w-full h-52 sm:h-64 overflow-hidden rounded-md border border-border bg-bg-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={prompt.imageUrl}
            alt={`Sample output for ${prompt.title}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 pointer-events-none">
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-medium tracking-wide bg-surface-raised border border-border text-fg shadow-xs">
              {prompt.category}
            </span>
          </div>
        </div>
      ) : null}

      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {prompt.platform.map((plat) => (
            <Badge key={plat} tone="neutral" size="sm">
              {plat}
            </Badge>
          ))}
          <Chip className="text-xs font-medium">
            {prompt.category}
          </Chip>
          {prompt.model ? (
            <span className="text-xs font-mono text-fg-subtle px-2 py-0.5 rounded-xs bg-bg-subtle border border-border">
              {prompt.model}
            </span>
          ) : null}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-fg">
          {prompt.title}
        </h2>

        {prompt.description ? (
          <p className="text-sm leading-relaxed text-fg-muted">
            {prompt.description}
          </p>
        ) : null}
      </div>

      {/* Complete Prompt Box */}
      <div className="rounded-md border border-border bg-bg-subtle p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Prompt Content
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-surface text-xs font-medium text-fg hover:bg-surface-hover transition-colors"
          >
            <Icon name={copied ? "check" : "copy"} size={13} />
            <span>{copied ? "Copied" : "Copy Prompt"}</span>
          </button>
        </div>

        <div className="font-mono text-xs sm:text-sm leading-relaxed text-fg bg-surface p-4 rounded-xs border border-border whitespace-pre-wrap select-all">
          {prompt.prompt}
        </div>
      </div>

      {/* Transparent Provenance & Attribution Box */}
      <div className="rounded-md border border-border bg-surface p-4 sm:p-5 flex flex-col gap-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Data Provenance &amp; Attribution
        </h4>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          {/* Source */}
          <div className="flex flex-col gap-0.5">
            <span className="text-fg-subtle">Primary Source</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-fg">{prompt.sourceName}</span>
              <a
                href={prompt.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-fg hover:underline inline-flex items-center gap-0.5 text-[11px]"
              >
                <span>Dataset</span>
                <Icon name="external-link" size={11} />
              </a>
            </div>
          </div>

          {/* Author */}
          <div className="flex flex-col gap-0.5">
            <span className="text-fg-subtle">Original Creator / Post</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-fg">{prompt.author || "Community Contributor"}</span>
              {prompt.authorProfileUrl ? (
                <a
                  href={prompt.authorProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-fg hover:underline text-[11px]"
                >
                  (Profile)
                </a>
              ) : null}
            </div>
          </div>

          {/* License */}
          <div className="flex flex-col gap-0.5">
            <span className="text-fg-subtle">License</span>
            <span className="font-mono text-[11px] text-fg">{prompt.license || "Attributed Source"}</span>
          </div>

          {/* Verification Date */}
          <div className="flex flex-col gap-0.5">
            <span className="text-fg-subtle">Last Verified</span>
            <span className="text-fg-muted">{prompt.provenance.lastVerified}</span>
          </div>
        </div>

        {/* View Original Button */}
        {prompt.provenance.originalUrl ? (
          <div className="pt-2 border-t border-border/70 flex items-center justify-between">
            <span className="text-[11px] text-fg-subtle">
              Visit original creator post on {prompt.sourceName}
            </span>
            <a
              href={prompt.provenance.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-bg-subtle text-xs font-medium text-fg hover:bg-surface-hover hover:text-fg transition-colors"
            >
              <span>View Original</span>
              <Icon name="external-link" size={12} />
            </a>
          </div>
        ) : null}
      </div>

      {/* Tags */}
      {prompt.tags.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Taxonomy &amp; Tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map((tag) => (
              <Chip key={tag} className="text-[11px]">
                #{tag}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      {/* Modal footer if in modal */}
      {isModal ? (
        <div className="pt-2 flex items-center justify-between border-t border-border/70 text-xs text-fg-subtle">
          <span>Discovery record from {prompt.sourceName}</span>
          <Link
            href={`/ai-prompts/${prompt.id}`}
            className="hover:text-fg hover:underline font-medium"
          >
            Open standalone page &rarr;
          </Link>
        </div>
      ) : null}
    </div>
  );
}
