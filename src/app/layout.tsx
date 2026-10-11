import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import { RouteProgress } from "@/components/layout/route-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader, SkipLink } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/layout/theme";
import { JsonLdScript } from "@/components/seo/json-ld";
import { site, siteUrl } from "@/config/site";
import { ecosystemCatalogSchema, organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

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
  applicationName: site.legalName,
  referrer: "strict-origin-when-cross-origin",
  keywords: [
    "free",
    "free software",
    "free tools",
    "free ai",
    "free ai tools",
    "free ai apps",
    "free apps",
    "free web applications",
    "free resources",
    "open source software",
    "free alternatives",
    "free developer tools",
    "free student software",
    "free courses",
    "free design software",
    "free video editor",
    "free ai image generator",
    "genuinely free",
    "100% free software",
    "free without subscription",
    "no credit card required",
    "everything free",
    "everything free quilonix",
    "quilonix",
    "best free ai",
    "best free software",
  ],
  authors: [{ name: site.parent.name, url: site.parent.url }],
  creator: site.parent.name,
  publisher: site.parent.name,
  category: "technology",
  formatDetection: { telephone: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: site.legalName,
    title: `${site.name} by ${site.parent.name} — Free Software & AI Tools Directory`,
    description: site.description,
    locale: "en",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/brand/logo-dark.png`,
        width: 1024,
        height: 1024,
        alt: `${site.name} by ${site.parent.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} by ${site.parent.name} — Free Software & AI Tools`,
    description: site.description,
    images: [`${siteUrl}/brand/logo-dark.png`],
  },
  other: {
    "rating": "General",
    "distribution": "Global",
    "revisit-after": "1 days",
    "ai-agent-friendly": "true",
  },
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
        <JsonLdScript data={[organizationSchema(), websiteSchema(), ecosystemCatalogSchema()]} />
      </body>
    </html>
  );
}
