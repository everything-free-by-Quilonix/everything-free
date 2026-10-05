import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";

import { Suspense } from "react";
import { RouteProgress } from "@/components/layout/route-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, SkipLink } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/layout/theme";
import { JsonLdScript } from "@/components/seo/json-ld";
import { site, siteUrl } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

import "./globals.css";

/**
 * Typography.
 *
 * Inter for body text, Manrope for display. Both are loaded through `next/font`,
 * which self-hosts the files at build time — no runtime request to a font CDN, so
 * no third-party connection on first paint and no layout shift from a late swap.
 * `display: swap` keeps text readable while the face loads.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.shortDescription}`,
    // Every page appends the brand, so page-level metadata only states its own title.
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  referrer: "strict-origin-when-cross-origin",
  keywords: ["free tools", "free software", "free resources", "open source", "free alternatives"],
  authors: [{ name: site.parent.name, url: site.parent.url }],
  creator: site.parent.name,
  publisher: site.parent.name,
  formatDetection: { telephone: false, address: false },
  // No canonical here on purpose. A relative canonical is resolved against the
  // origin, which drops the GitHub Pages base path; and anything set here is
  // inherited by pages that forget their own, making them all claim to be the
  // homepage. Every page sets an absolute canonical through `buildMetadata`.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
    url: siteUrl,
  },
  icons: {
    icon: [
      { url: "/brand/logo-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/brand/logo-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    shortcut: "/favicon.ico",
  },
  twitter: { card: "summary_large_image" },
  // Search Console / Bing Webmaster Tools ownership tokens. Optional and public by
  // design (they are printed in the page); unset means no tag is emitted. Bing
  // matters beyond Bing: ChatGPT search and Copilot draw on its index.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom is never restricted: capping it breaks the primary accommodation for
  // low-vision users (WCAG 1.4.4).
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` is required because ThemeScript mutates the
    // class list before React hydrates. It is scoped to this element only.
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <SkipLink />
        <SiteHeader />
        {/* `tabIndex={-1}` makes the skip link's target programmatically focusable. */}
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <JsonLdScript data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
