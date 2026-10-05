"use client";

import { useState } from "react";
import Image from "next/image";
import type { ResourceLogo as ResourceLogoData } from "@/types/resource";
import { cn } from "@/lib/utils/cn";

export interface ResourceLogoProps {
  logo?: ResourceLogoData;
  officialUrl?: string;
  name?: string;
  size?: number;
  className?: string;
}

/**
 * Extracts a clean hostname domain from a URL for logo resolution.
 */
function getDomain(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

/**
 * Renders an authentic tool logo / mark.
 *
 * 1. If an explicit self-hosted image is supplied in `logo`, renders it.
 * 2. If `officialUrl` is present, dynamically resolves the vendor's high-resolution
 *    brand mark/favicon from Google's global CDN.
 * 3. Gracefully and smoothly falls back to a clean typographic monogram if offline
 *    or if the remote icon fails to load.
 */
export function ResourceLogo({
  logo,
  officialUrl,
  name,
  size = 40,
  className,
}: ResourceLogoProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // 1. Explicit image
  if (logo?.kind === "image" && !imgError) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-surface-raised/60 p-1 shadow-2xs transition-all duration-200",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={logo.url}
          alt={logo.alt || `${name || "Resource"} logo`}
          width={logo.width || size}
          height={logo.height || size}
          className="size-full rounded-md object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const domain = getDomain(officialUrl);
  const logoUrl =
    domain && !imgError
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
      : null;

  const fallbackText =
    logo?.kind === "monogram"
      ? logo.text
      : name
        ? name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?"
        : "?";

  return (
    <div
      className={cn(
        "relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-surface-raised/70 p-1 shadow-2xs transition-all duration-200 group-hover:scale-105 group-hover:border-border-strong",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Background Monogram fallback (always rendered underneath to prevent layout shifts or empty flashes) */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center font-display font-semibold tracking-tight text-fg-muted transition-opacity duration-200",
          imgLoaded && !imgError ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        style={{ fontSize: Math.max(10, Math.round(size * 0.38)) }}
      >
        {fallbackText}
      </span>

      {/* Real brand logo */}
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name ? `${name} logo` : "Logo"}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={cn(
            "relative size-full rounded-md object-contain transition-opacity duration-300",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
    </div>
  );
}

