import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

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
 * Inter is the interface: controls, labels, evidence, tables, body text. Source
 * Serif 4 is the editorial voice, opted into with the serif utility class on page
 * titles and editorial section titles only. Both are loaded through `next/font`, which
 * self-hosts the files at build time — no runtime request to a font CDN, so no
 * third-party connection on first paint and no layout shift from a late swap.
 * `display: swap` keeps text readable while the face loads.
 *
 * The serif's variable is deliberately named apart from the serif theme token in
 * tokens.css, so that token never refers to itself.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-serif",
  axes: ["opsz"],
  style: ["normal"],
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
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
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
    // sRGB equivalents of the two --bg tokens in src/styles/tokens.css.
    { media: "(prefers-color-scheme: dark)", color: "#100e0b" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` is required because ThemeScript mutates the
    // class list before React hydrates. It is scoped to this element only.
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <RouteProgress />
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
