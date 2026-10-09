"use client";

import { useState } from "react";
import type { AIImageCommand } from "@/types/ai-image-command";
import { getCommandPreviewImage } from "@/data/ai-image-command-previews";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

interface StyleThumbnailProps {
  command: AIImageCommand;
  className?: string;
}

/**
 * Visual reference card displaying high-fidelity visual output sample
 * for each AI image prompt command modifier.
 */
export function StyleThumbnail({ command, className }: StyleThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = command.previewImage || getCommandPreviewImage(command.id, command.category);

  return (
    <div
      className={cn(
        "relative w-full aspect-[16/10] overflow-hidden bg-bg-subtle select-none border-b border-border group",
        className,
      )}
    >
      {/* Real photographic/artistic reference output sample */}
      {!hasError ? (
        <>
          {/* Skeleton placeholder while image streams */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-surface flex items-center justify-center">
              <span className="text-[11px] font-mono text-fg-subtle">Loading sample...</span>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Visual sample output of ${command.name}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      ) : (
        /* Graceful fallback banner if network is offline */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-bg-subtle text-center">
          <div className="size-8 rounded-sm bg-surface-hover flex items-center justify-center text-fg-muted mb-2 border border-border">
            <Icon name="image" size={16} />
          </div>
          <span className="text-xs font-semibold text-fg">{command.name}</span>
          <span className="text-[10px] text-fg-subtle mt-0.5">{command.category} output</span>
        </div>
      )}

      {/* Gradient Vignette overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent pointer-events-none" />

      {/* Top Floating Badge: Category */}
      <div className="absolute top-2.5 right-2.5 pointer-events-none">
        <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-medium tracking-wide bg-surface-raised border border-border text-fg shadow-xs">
          {command.category}
        </span>
      </div>

      {/* Bottom Floating Visual Indicator: Style Name & Sample Indicator */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium bg-surface-raised border border-border text-fg shadow-xs">
          <Icon name="image" size={10} className="text-fg-muted" />
          <span className="truncate max-w-[130px] sm:max-w-[170px]">{command.command}</span>
        </div>

        <span className="text-[9px] uppercase tracking-wider font-semibold text-fg-subtle bg-surface-raised px-1.5 py-0.5 rounded-xs border border-border shadow-xs">
          Sample Output
        </span>
      </div>
    </div>
  );
}
