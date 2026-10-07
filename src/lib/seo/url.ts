import { siteUrl } from "@/config/deployment";

/**
 * Absolute URL for a site path, in the exact form the host serves it.
 *
 * The build uses `trailingSlash: true`, so a page lives at `/resources/gimp/`, and a
 * static host redirects `/resources/gimp` to it. Canonicals and sitemap entries
 * therefore carry the trailing slash — a canonical that points at a redirect is a
 * canonical search engines have to second-guess. Paths that name a file
 * (`/og/gimp.png`, `/sitemap.xml`) are left alone.
 *
 * Kept in its own module, free of JSX imports, so plain-Node code (the unit tests,
 * text routes) can use it.
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  const [pathname, suffix = ""] = withLeadingSlash.split(/(?=[?#])/);
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  const normalised = isFile || pathname.endsWith("/") ? pathname : `${pathname}/`;

  return `${siteUrl}${normalised}${suffix}`;
}
