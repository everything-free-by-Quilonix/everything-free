"use client";

import Link from "next/link";
import { Badge, Chip } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import type { AIImageCommand } from "@/types/ai-image-command";
import { CopyButton } from "./CopyButton";
import { StyleThumbnail } from "./StyleThumbnail";

interface CommandDetailViewProps {
  command: AIImageCommand;
  isModal?: boolean;
}

export function CommandDetailView({ command, isModal = false }: CommandDetailViewProps) {
  const quickSubject = command.bestFor[0]?.toLowerCase() || "your subject";
  const quickUsage = `${command.command} ${quickSubject}`;

  return (
    <div className="flex flex-col gap-6 text-fg">
      {/* Visual Reference Header */}
      <StyleThumbnail command={command} className="h-52 sm:h-64 aspect-auto rounded-md border border-border" />

      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm sm:text-base font-bold px-2.5 py-1 rounded-xs bg-bg-subtle border border-border-strong text-fg select-all">
            {command.command}
          </span>
          <Chip className="text-xs font-medium">{command.category}</Chip>
          <Badge tone="neutral" size="sm">ChatGPT &amp; Gemini</Badge>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-fg">
          {command.name}
        </h2>

        <p className="text-sm leading-relaxed text-fg-muted">
          <strong className="text-fg font-medium">What to expect: </strong>
          {command.description}
        </p>
      </div>

      {/* Direct 1-Click Command Box */}
      <div className="rounded-md border border-border bg-bg-subtle p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Command (Paste in ChatGPT or Gemini)
          </span>
          <CopyButton textToCopy={command.command} label={`Copy ${command.command}`} size="sm" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-xs bg-surface border border-border">
          <code className="font-mono text-base font-bold text-fg select-all">
            {command.command}
          </code>
          <span className="text-xs text-fg-subtle">
            Direct modifier
          </span>
        </div>
      </div>

      {/* Ready-to-Test Example Prompt */}
      <div className="rounded-md border border-border bg-surface p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Example Prompt
          </span>
          <CopyButton textToCopy={command.examplePrompt} label="Copy example" size="sm" />
        </div>

        <p className="font-mono text-xs leading-relaxed text-fg bg-bg-subtle p-3.5 rounded-xs border border-border select-all">
          {command.examplePrompt}
        </p>

        <p className="text-[11px] text-fg-muted">
          Quick syntax: <code className="font-mono text-fg bg-bg-subtle px-1 py-0.5 rounded-xs">{quickUsage}</code>
        </p>
      </div>

      {/* What it is Best For */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Best suited for
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {command.bestFor.map((item) => (
            <Chip key={item} className="text-xs">
              {item}
            </Chip>
          ))}
        </div>
      </div>

      {/* Trademark or policy notice if any */}
      {command.copyrightDisclaimer ? (
        <Callout tone="neutral" title="Usage Guidance">
          <p className="text-xs text-fg-muted leading-relaxed">
            {command.copyrightDisclaimer}
          </p>
        </Callout>
      ) : null}

      {/* Modal footer navigation if in modal */}
      {isModal ? (
        <div className="pt-2 flex items-center justify-between border-t border-border/70 text-xs text-fg-subtle">
          <span>Open anytime with ChatGPT or Gemini</span>
          <Link
            href={`/ai-image-commands/${command.id}`}
            className="hover:text-fg hover:underline font-medium"
          >
            Open standalone page &rarr;
          </Link>
        </div>
      ) : null}
    </div>
  );
}
