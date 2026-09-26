import type { Metadata } from "next";
import { site, siteUrl } from "@/config/site";
import { truncate } from "@/lib/utils/slug";
import { OG_SIZE, ogImagePath } from "./og-image";

/**
 * Metadata helpers.
 *
 * Centralised so that every page gets a canonical URL, OpenGraph and Twitter tags
 * without each one remembering to. Two rules are enforced here:
 *
 * - Canonical URLs never carry query strings. A filtered listing must not compete
 *   with the clean listing in search results, so filtered views point their
 *   canonical at the base path.
 * - Descriptions are truncated at a word boundary to roughly the length search
 *   engines display, so they read as complete sentences rather than cut-off text.
 */

const DESCRIPTION_LIMIT = 158;

/**
 * Absolute URL for a site path, in the exact form the host serves it.
 *
 * The build uses `trailingSlash: true`, so a page lives at `/resources/gimp/`, and a
 * static host redirects `/resources/gimp` to it. Canonicals and sitemap entries
 * therefore carry the trailing slash — a canonical that points at a redirect is a
 * canonical search engines have to second-guess. Paths that name a file
 * (`/og/gimp.png`, `/sitemap.xml`) are left alone.
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const [pathname, suffix = ""] = withLeadingSlash.split(/(?=[?#])/);
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  const normalised = isFile || pathname.endsWith("/") ? pathname : `${pathname}/`;

  return `${siteUrl}${normalised}${suffix}`;
}

export interface PageMetadataInput {
  title: string;
  description: string;
  /** Path without query string. Used for the canonical URL. */
  path: string;
  /** Set for pages that should not be indexed, such as filtered listings. */
  noIndex?: boolean;
  type?: "website" | "article";
  /** Publication or update timestamp for article-type pages. */
  modifiedTime?: string;
  /** Resource slug whose OG image to use. Omit for the site-wide image. */
  ogImageFor?: string;
}

/**
 * Builds page metadata.
 *
 * OG image URLs are set explicitly and absolutely. Relative URLs would be resolved
 * against `metadataBase`, which drops the GitHub Pages base path; and the images
 * themselves are pre-rendered `.png` files under `/og/`, so there is nothing for the
 * framework to resolve.
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
  type = "website",
  modifiedTime,
  ogImageFor,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const trimmedDescription = truncate(description, DESCRIPTION_LIMIT);
  const image = {
    url: absoluteUrl(ogImagePath(ogImageFor)),
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    alt: title,
    type: "image/png",
  };

  return {
    title,
    description: trimmedDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      siteName: site.name,
      title,
      description: trimmedDescription,
      locale: "en",
      images: [image],
      ...(modifiedTime && type === "article" ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: trimmedDescription,
      images: [image.url],
    },
  };
}
