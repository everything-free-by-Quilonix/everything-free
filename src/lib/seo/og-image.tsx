import { ImageResponse } from "next/og";

import { site } from "@/config/site";

/**
 * Shared OpenGraph image renderer.
 *
 * Invoked from the static route handler at `app/og/[image]/route.tsx`, so every
 * image is rendered once at build time and written out as a `.png` file. No
 * runtime, no invocation cost, and the file extension means a header-less static
 * host serves it with the right content type.
 *
 * Constraints kept deliberately:
 *
 * - No external fonts or images are fetched. Satori uses the system font stack, so
 *   generation has no network dependency and cannot fail because a font CDN is slow.
 * - Titles are length-capped, so an unusually long resource name cannot produce a
 *   broken or overflowing image.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Filename of the site-wide image under `/og/`. Resources use `<slug>.png`. */
export const SITE_OG_IMAGE = "site.png";

/** Site path of the OG image for a resource, or the site default. */
export function ogImagePath(resourceSlug?: string): string {
  return `/og/${resourceSlug ? `${resourceSlug}.png` : SITE_OG_IMAGE}`;
}

const TITLE_MAX = 110;

export function renderOgImage({ title, subtitle }: { title: string; subtitle?: string }): ImageResponse {
  const safeTitle = title.length > TITLE_MAX ? `${title.slice(0, TITLE_MAX).trimEnd()}…` : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#d4af37",
              borderRadius: 14,
              color: "#0a0a0f",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            EF
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#f5f5f5", fontWeight: 600 }}>
            Everything
            <span style={{ color: "#d4af37" }}>.</span>
            Free
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: safeTitle.length > 60 ? 56 : 68,
              lineHeight: 1.12,
              color: "#f5f5f5",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {safeTitle}
          </div>

          {subtitle ? (
            <div style={{ display: "flex", fontSize: 28, color: "#a6a6b4", lineHeight: 1.3 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#a6a6b4" }}>{site.tagline}</div>
          <div style={{ display: "flex", fontSize: 20, color: "#74748a" }}>by {site.parent.name}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
