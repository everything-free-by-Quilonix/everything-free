/**
 * Where the site is deployed.
 *
 * One value — the public URL — determines everything that depends on location:
 * canonical URLs, the sitemap, OpenGraph tags, and the base path the static export
 * is built for. Deriving the base path from the URL rather than configuring it
 * separately means the two cannot disagree. A site built for
 * `https://example.github.io/everything-free` automatically gets
 * `basePath: "/everything-free"`; a site built for a root domain gets none.
 *
 * This file must stay free of imports: `next.config.ts` imports it directly,
 * outside the `@/` alias.
 *
 * The default is the free GitHub Pages address. The project does not own a custom
 * domain, and defaulting to one it does not own would publish canonical URLs and
 * a sitemap for someone else's site. Override with `NEXT_PUBLIC_SITE_URL` when
 * deploying elsewhere — see docs/deployment.md.
 */

export const DEFAULT_SITE_URL = "https://everything-free-by-quilonix.github.io/everything-free";

function readSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && raw.length > 0) {
    return raw.replace(/\/+$/, "");
  }

  // When deployed on Vercel, serve from the root domain:
  if (process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL) {
    const host =
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      process.env.VERCEL_URL;
    if (host) {
      return `https://${host.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
    }
    return "https://everything-free.vercel.app";
  }

  return DEFAULT_SITE_URL.replace(/\/+$/, "");
}

/** Public URL of the site, with no trailing slash. */
export const siteUrl = readSiteUrl();

/**
 * Path prefix the site is served under, with no trailing slash — `""` at a domain
 * root, `"/everything-free"` on a GitHub Pages project site.
 */
export const basePath = new URL(siteUrl).pathname.replace(/\/+$/, "");

/**
 * Prefixes a root-relative path with the base path.
 *
 * Next's `<Link>` and router do this automatically. Anything that bypasses them —
 * a plain `<form action>`, a raw `<a href>` — must go through this, or it will point
 * at the domain root and 404 on a project site.
 */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
