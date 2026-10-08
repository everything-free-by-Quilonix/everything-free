"use client";

import Link from "next/link";
import { Card, stretchedLink } from "@/components/ui/card";
import { Icon } from "@/components/icons";
import type { AIImageCommand } from "@/types/ai-image-command";
import { StyleThumbnail } from "./StyleThumbnail";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils/cn";

interface CommandCardProps {
  command: AIImageCommand;
  onOpenModal?: (command: AIImageCommand) => void;
  className?: string;
}

export function CommandCard({ command, onOpenModal, className }: CommandCardProps) {
  // Construct a realistic quick example command
  const quickSubject = command.bestFor[0]?.toLowerCase() || "cityscape at dusk";
  const exampleCommandText = `${command.command} ${quickSubject}`;

  return (
    <Card
      as="article"
      interactive
      className={cn(
        "flex flex-col justify-between overflow-hidden transition-colors border border-border bg-surface group",
        className,
      )}
    >
      <div>
        {/* Visual Output Sample Preview */}
        <StyleThumbnail command={command} />

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Command Shorthand & Category */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm sm:text-base font-bold px-2 py-0.5 rounded-xs bg-bg-subtle border border-border-strong text-fg select-all">
              {command.command}
            </span>

            <span className="text-[11px] font-medium text-fg-subtle">
              {command.category}
            </span>
          </div>

          {/* Command Title & Expectation */}
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold leading-snug text-fg">
              {onOpenModal ? (
                <button
                  type="button"
                  onClick={() => onOpenModal(command)}
                  className={cn("text-left font-semibold hover:underline focus:underline", stretchedLink)}
                >
                  {command.name}
                </button>
              ) : (
                <Link href={`/ai-image-commands/${command.id}`} className={cn("hover:underline focus:underline", stretchedLink)}>
                  {command.name}
                </Link>
              )}
            </h3>

            {/* What to expect from this command */}
            <p className="text-xs leading-relaxed text-fg-muted">
              <span className="text-fg font-medium">What to expect: </span>
              {command.description}
            </p>
          </div>

          {/* Proper Example Box */}
          <div className="rounded-xs bg-bg-subtle border border-border p-2.5 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
              Example usage:
            </span>
            <p className="font-mono text-xs text-fg break-words select-all">
              {exampleCommandText}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Footer: Copy Command or Example */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 flex items-center justify-between gap-2 border-t border-border/70">
        <div className="relative z-10 flex items-center gap-1.5">
          {/* Quick 1-click button to copy the command itself */}
          <CopyButton
            textToCopy={command.command}
            label={`Copy ${command.command}`}
            size="sm"
          />

          {/* Quick 1-click button to copy the full example prompt */}
          <CopyButton
            textToCopy={command.examplePrompt}
            label="Copy example"
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={() => onOpenModal?.(command)}
          aria-label={`View details for ${command.name}`}
          className="relative z-10 inline-flex size-7 items-center justify-center rounded-sm border border-border text-fg-subtle hover:text-fg hover:bg-surface-hover pointer-coarse:size-9"
        >
          <Icon name="arrow-right" size={13} />
        </button>
      </div>
    </Card>
  );
}
