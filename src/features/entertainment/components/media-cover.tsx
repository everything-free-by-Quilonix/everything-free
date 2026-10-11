"use client";

import { useState } from "react";

import { Icon, type IconName } from "@/components/icons";
import { formatDefinitions, type MediaVerb } from "@/config/media";
import { cn } from "@/lib/utils/cn";
import type { MediaArtwork, MediaFormat } from "@/types/media";

/**
 * The card's cover.
 *
 * By default a typographic cover drawn from the listing's own metadata — the verb,
 * the format and the name's initial — so no poster, album cover or game art is
 * copied from a rights holder. Licensed artwork (`media.artwork`, which the build
 * only accepts with a credit and a licence page) is shown instead when present,
 * lazily, and falls back to the typographic cover if it fails to load or the host
 * refuses hotlinking.
 */

const VERB_ICON: Record<MediaVerb, IconName> = {
  watch: "film",
  play: "gamepad",
  listen: "music",
  read: "book-open",
  explore: "compass",
};

const VERB_WORD: Record<MediaVerb, string> = {
  watch: "Watch",
  play: "Play",
  listen: "Listen",
  read: "Read",
  explore: "Explore",
};

export function MediaCover({
  name,
  verb,
  formats,
  artwork,
  className,
}: {
  name: string;
  verb: MediaVerb;
  formats: readonly MediaFormat[];
  artwork?: MediaArtwork;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = name.replace(/^[^\p{L}\p{N}]+/u, "").charAt(0).toUpperCase() || "?";
  const formatLabel = formats.slice(0, 2).map((f) => formatDefinitions[f].label).join(" · ");

  if (artwork && !failed) {
    return (
      <figure className={cn("relative overflow-hidden rounded-sm border border-border bg-bg-subtle", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimiser */}
        <img
          src={artwork.url}
          alt={artwork.alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 truncate bg-bg/80 px-2 py-0.5 text-2xs text-fg-subtle">
          {artwork.credit}
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-verb={verb}
      className={cn(
        "media-cover relative flex items-end justify-between overflow-hidden rounded-sm border border-border bg-bg-subtle px-3 pb-2.5 pt-3",
        className,
      )}
    >
      <div className="min-w-0">
        <span className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-widest text-fg-subtle">
          <Icon name={VERB_ICON[verb]} size={12} />
          {VERB_WORD[verb]}
        </span>
        <span className="mt-1 block truncate text-xs text-fg-muted">{formatLabel}</span>
      </div>
      <span className="font-display text-4xl font-semibold leading-none text-fg-subtle/60">{initial}</span>
    </div>
  );
}
