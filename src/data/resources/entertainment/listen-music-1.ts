import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import { defineMediaList, type ResearchSource } from "./define-media";

/**
 * listen-music, part 1. Every value is backed by a page read on 2026-10-11.
 * Free to listen is never recorded as free to reuse: reuse is per track unless a
 * source says otherwise.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const FMA = "https://freemusicarchive.org/faq";
const SPOTIFY_IN = "https://www.spotify.com/in-en/free/";

export const listenMusic1Resources: Resource[] = defineMediaList([
  {
    slug: "free-music-archive",
    name: "Free Music Archive",
    shortDescription: "Independent artists' music under Creative Commons, free to stream and download; each track states its own licence.",
    longDescription:
      "The Free Music Archive (FMA), run by Tribe of Noise, offers open-licensed original music by independent artists. Its FAQ says you can listen without an account or payment, but 'free' does not mean free to reuse without conditions: most tracks carry a Creative Commons licence (some allow commercial use, some do not), and the licence is shown on each track page and can be filtered in search.",
    whyListed: "One of the best sources of music video makers and podcasters can legally use — with the licence spelled out per track.",
    category: "music",
    subcategories: ["stock-media"],
    resourceType: "WEBSITE",
    officialUrl: "https://freemusicarchive.org/",
    licenseUrl: "https://freemusicarchive.org/License_Guide",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "Reuse depends on each track's licence: NonCommercial and NoDerivatives tracks cannot go in monetised or edited videos.",
      "Some artists register their music with YouTube Content ID, so even correctly licensed uses can be flagged.",
    ],
    tags: ["creative-commons", "royalty-free", "independent-music", "music-for-video"],
    alternativeTo: ["Epidemic Sound", "Artlist"],
    media: {
      formats: ["music-streaming", "music-download", "creator-music"],
      access: ["free_full_access", "free_streaming", "free_download", "open_license"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "Tribe of Noise (Free Music Archive)",
      containsAds: "unknown",
      hasPaidFeatures: "unknown",
      genres: ["electronic", "hip-hop", "folk", "rock", "ambient"],
      contentLanguages: ["multi"],
      region: { india: "unknown", availableIn: [] },
      contentLicense: {
        kind: "per-item",
        summary: "Mostly Creative Commons licences chosen per track (CC BY, BY-SA, BY-NC, BY-NC-ND, CC0 and others); shown on each track page.",
        creatorUse: "per-item",
        url: "https://freemusicarchive.org/License_Guide",
        sourceUrl: FMA,
        attribution: "Title, artist, 'From the Free Music Archive' and the licence, as the FAQ shows",
      },
    },
    research: {
      date: DATE,
      sources: [src(FMA, "FMA FAQ: listen without an account or paying; FREE does not mean free to reuse; most tracks CC-licensed; licence on each track page; Content ID caveat")],
      checks: [
        ok("OFFICIAL_URL", FMA, "freemusicarchive.org/faq is the archive's own FAQ."),
        ok("FREE_STATUS", FMA, "'You don't need to create an account, you can listen to music without paying.'"),
        ok("ACCOUNT_REQUIREMENT", FMA, "The FAQ states no account is needed to listen."),
        ok("LIMITATIONS", FMA, "'FREE doesn't mean you are free to use, alter or build upon all songs without any conditions'; Content ID claims possible."),
      ],
      notes: "Read in the FAQ. Downloads may need an account for some tracks; not checked track by track.",
    },
  },
  {
    slug: "spotify-free",
    name: "Spotify Free",
    shortDescription: "Spotify's free plan: millions of songs and podcasts with no credit card; Premium plans add more control.",
    longDescription:
      "Spotify's free plan, offered on its Indian site among others, lets you play millions of songs and podcasts and make playlists, with no credit card required; you sign up for a free account. Premium Standard, Platinum and Student plans are sold alongside it.",
    whyListed: "The most widely used free music streaming option in India, with Hindi and regional-language catalogues.",
    category: "music",
    subcategories: ["podcasts"],
    resourceType: "SERVICE",
    officialUrl: SPOTIFY_IN,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS", "WINDOWS", "MACOS"],
    requiresAccount: "yes",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [
      "Free accounts have fewer features than Premium; the free page does not list the exact limits.",
      "Listening only: the music cannot be reused in videos or elsewhere.",
    ],
    tags: ["music-streaming", "podcasts", "playlists", "india"],
    media: {
      formats: ["music-streaming", "podcast"],
      access: ["free_tier", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Spotify AB",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["bollywood", "pop", "regional", "podcasts"],
      contentLanguages: ["multi", "hi", "en"],
      region: {
        india: "available",
        availableIn: ["IN"],
        notes: "Read on Spotify's India (English) free-plan page.",
        sourceUrl: SPOTIFY_IN,
      },
      contentLicense: {
        kind: "all-rights-reserved",
        summary: "Licensed for personal listening on Spotify only.",
        creatorUse: "not-allowed",
        sourceUrl: SPOTIFY_IN,
      },
    },
    research: {
      date: DATE,
      sources: [src(SPOTIFY_IN, "Spotify India free page: play millions of songs and podcasts for free; sign up free; 'It's free. No credit card required.'; Premium plans listed")],
      checks: [
        ok("OFFICIAL_URL", SPOTIFY_IN, "spotify.com/in-en/free is Spotify's own India page."),
        ok("FREE_STATUS", SPOTIFY_IN, "'Play millions of songs and podcasts for free', alongside paid Premium plans: a free tier."),
        ok("CREDIT_CARD_REQUIREMENT", SPOTIFY_IN, "The page says 'It's free. No credit card required.'"),
        ok("ACCOUNT_REQUIREMENT", SPOTIFY_IN, "The call to action is 'Sign up free', i.e. a free account."),
      ],
      notes: "Read on the India free-plan page. The free plan's ads and skip limits are not stated there, so ads are unknown.",
    },
  },
]);
