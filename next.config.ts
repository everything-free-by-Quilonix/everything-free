import type { NextConfig } from "next";

import { basePath } from "./src/config/deployment";

/**
 * Next.js configuration.
 *
 * The application is built to have no server runtime: every route is statically
 * generated, there are no server actions, no API routes and no per-request
 * rendering. That is a deliberate cost decision — with nothing executing at request
 * time, hosting cannot generate a bill, and the project is not tied to one
 * provider's free tier.
 *
 * `STATIC_EXPORT=1` additionally emits a plain `out/` directory of HTML and assets,
 * for hosts that serve static files only. That is how production is built. The
 * default build produces the same static pages while keeping `next start`
 * available for local inspection.
 *
 * See `docs/deployment.md` for the hosting decision.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),

  /*
   * Derived from the public site URL in `config/deployment.ts`. On GitHub Pages the
   * site lives at `/everything-free/`, and without this every script, stylesheet and
   * internal link would point at the domain root and 404. Empty at a domain root.
   */
  basePath,

  /*
   * Automatically redirect root '/' to basePath in dev mode so browsing to
   * http://localhost:3000 directly lands on the homepage without needing
   * manual typing of the project prefix.
   */
  ...(!isStaticExport && basePath
    ? {
        async redirects() {
          return [
            {
              source: "/",
              destination: `${basePath}/`,
              basePath: false,
              permanent: false,
            },
          ];
        },
      }
    : {}),

  images: {
    /*
     * Image optimisation is a server feature, and on metered hosts it is billed per
     * transformation. The library ships no raster images — resource marks are
     * generated monograms and OpenGraph images are pre-rendered PNGs — so there is
     * nothing to optimise and no reason to keep the dependency.
     */
    unoptimized: true,
  },

  /*
   * Static hosts serve `/path/` from `/path/index.html`. Always emitting trailing
   * slashes — not only in the export — means local builds, canonical URLs and the
   * sitemap all agree with what production actually serves.
   */
  trailingSlash: true,

  reactStrictMode: true,

  /*
   * `X-Powered-By` advertises the framework and version to anyone scanning. It only
   * applies when a Node server is serving the app; under `STATIC_EXPORT` there is no
   * server and the host decides headers. See docs/deployment.md.
   */
  poweredByHeader: false,
};

export default nextConfig;
