import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import { defineMediaList, type ResearchSource } from "./define-media";

/**
 * India, part 2: regional-language kids' channels, South Indian films and music,
 * and web series — each confirmed from the rights holder's own website.
 * Every value is backed by a page read on 2026-10-11.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const YT_PREMIUM = "https://support.google.com/youtube/answer/6308116?hl=en";
const YT_SRC = src(YT_PREMIUM, "YouTube Help: Premium removes ads shown before and during videos, so free viewing is ad-supported");
const YT_ADS = "Ad-supported: YouTube shows ads unless you pay for YouTube Premium.";
const ytAds = ok("LIMITATIONS", YT_PREMIUM, "YouTube Help says ads before and during videos are removed only by paid YouTube Premium.");

const CHUCHU = "https://chuchutv.com/";
const INFOBELLS = "https://www.infobells.com/";
const LAHARI = "https://links.laharimusic.com/";
const GOLDMINES = "https://www.goldmines.co.in/channels.html";
const POCKET_ACES = "https://pocketaces.in/";

export const watchIndia2Resources: Resource[] = defineMediaList([
  {
    slug: "chuchu-tv",
    name: "ChuChu TV",
    shortDescription: "Chennai studio's nursery rhymes and kids' stories on YouTube in Tamil, Telugu, Kannada, Hindi, Bangla, English and more.",
    longDescription:
      "ChuChu TV Studios, based in Chennai, makes animated nursery rhymes, stories and learning videos for young children. Its website links official YouTube channels in English, Tamil, Hindi, Bangla, Telugu, Kannada, Spanish, Portuguese and French, plus a Hindi Indian Sign Language channel. Watching on YouTube is free with ads.",
    whyListed: "One of the most-watched kids' channels in the world, made in India and published by the studio in Indian languages.",
    category: "anime",
    subcategories: ["animation"],
    resourceType: "WEBSITE",
    officialUrl: CHUCHU,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS, "Aimed at toddlers and young children."],
    tags: ["india", "kids", "nursery-rhymes", "tamil", "sign-language"],
    media: {
      formats: ["animation", "series"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "ChuChu TV Studios LLP",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["kids", "nursery-rhymes", "learning"],
      contentLanguages: ["en", "ta", "hi", "bn", "te", "kn", "es", "pt", "fr"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(CHUCHU, "ChuChu TV homepage: languages available with links to official YouTube channels — English, Spanish, Portuguese, French, Tamil, Hindi, Bangla, Telugu, Kannada, Hindi ISL"), YT_SRC],
      checks: [
        ok("OFFICIAL_URL", CHUCHU, "chuchutv.com is the studio's own site; it links each official YouTube channel."),
        ok("FREE_STATUS", CHUCHU, "The studio publishes its rhymes and stories on public YouTube channels, which are free to watch."),
        ytAds,
      ],
      notes: "Channels read from the studio's homepage.",
    },
  },
  {
    slug: "infobells-rhymes",
    name: "Infobells",
    shortDescription: "Bengaluru studio's animated rhymes and stories for children in Hindi, Telugu, Tamil, Kannada, Bangla, Malayalam and English.",
    longDescription:
      "Infobells Interactive Solutions of Bengaluru makes 3D-animated nursery rhymes and stories that teach local culture and values. Its website describes regional rhyme channels in Hindi, Telugu, Tamil, Kannada, Bangla and Malayalam, and notes Infobells Hindi as the first Hindi kids' channel to reach a million subscribers and Infobells Kannada as the first Kannada kids' channel past 100,000. The videos are on YouTube, free with ads.",
    whyListed: "Kids' content in six Indian languages, including Kannada and Malayalam, from the studio that makes it.",
    category: "anime",
    subcategories: ["animation"],
    resourceType: "WEBSITE",
    officialUrl: INFOBELLS,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS],
    tags: ["india", "kids", "kannada", "telugu", "malayalam"],
    media: {
      formats: ["animation"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Infobells Interactive Solutions",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["kids", "nursery-rhymes", "stories"],
      contentLanguages: ["hi", "te", "ta", "kn", "bn", "ml", "en"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(INFOBELLS, "Infobells homepage: regional rhymes in Hindi, Telugu, Tamil, Kannada, Bangla, Malayalam; channel milestones (Hindi 1M, Telugu 1M, Tamil 750k, Kannada 100k, English 300k); Bengaluru address"), YT_SRC],
      checks: [
        ok("OFFICIAL_URL", INFOBELLS, "infobells.com is the company's own site, with its Bengaluru office address."),
        ok("FREE_STATUS", INFOBELLS, "The site describes its rhymes published on YouTube channels with subscriber counts; YouTube viewing is free."),
        ytAds,
      ],
      notes: "Read on the company homepage. The page names the channels but does not link them.",
    },
  },
  {
    slug: "lahari-music",
    name: "Lahari Music",
    shortDescription: "South India's biggest music label: Kannada, Telugu and Tamil film songs and albums on its official YouTube channels.",
    longDescription:
      "Lahari Recording Company of Bengaluru has published South Indian music since 1974. Its official links page points to its YouTube channels — Lahari Music (music videos and full albums) and Lahari Music Kannada (Kannada hits, lyrics and trailers) — alongside Spotify, JioSaavn and Apple Music. YouTube viewing is free with ads.",
    whyListed: "The largest legal free source of Kannada film music, from the label that holds the rights.",
    category: "music",
    resourceType: "WEBSITE",
    officialUrl: "https://www.youtube.com/@laharimusic_kannada",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS, "Listening only; the songs are not licensed for reuse in your videos."],
    tags: ["india", "kannada", "film-songs", "telugu", "tamil"],
    media: {
      formats: ["music-streaming"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Lahari Recording Company",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["film-songs", "devotional", "kannada"],
      contentLanguages: ["kn", "te", "ta"],
      region: { india: "unknown", availableIn: [] },
      contentLicense: {
        kind: "all-rights-reserved",
        summary: "Commercial recordings published for listening; reuse needs a licence from Lahari.",
        creatorUse: "not-allowed",
        sourceUrl: LAHARI,
      },
    },
    research: {
      date: DATE,
      sources: [src(LAHARI, "Lahari Music official links: YouTube @laharimusicindia (music videos & full albums), @laharimusic_kannada (Kannada hits, lyrics & trailers), licensing contact"), YT_SRC],
      checks: [
        ok("OFFICIAL_URL", LAHARI, "The label's own links page lists youtube.com/@laharimusic_kannada as its Kannada channel."),
        ok("FREE_STATUS", LAHARI, "The label publishes music videos and full albums on YouTube, free to watch."),
        ytAds,
      ],
      notes: "Read on the label's official links page, which also lists a licensing contact for reuse.",
    },
  },
  {
    slug: "goldmines-tv",
    name: "Goldmines TV channels",
    shortDescription: "Free-to-air Hindi movie channels of South Indian blockbusters dubbed in Hindi, on DD Free Dish and most DTH services.",
    longDescription:
      "Goldmines Telefilms runs Hindi movie channels — Goldmines, Goldmines Movies and Goldmines Bollywood — showing South Indian films (Telugu, Tamil and Kannada blockbusters) dubbed into Hindi, plus Bollywood. Its site says these three are free-to-air satellite channels available on DD Free Dish, and also carried by Airtel, Tata Play, Dish TV, Videocon d2h, Sun Direct and cable operators. The company also has a YouTube channel.",
    whyListed: "The most-watched way to see South Indian films in Hindi for free in India.",
    category: "streaming",
    subcategories: ["movies"],
    resourceType: "SERVICE",
    officialUrl: GOLDMINES,
    freeStatus: "FREE",
    openSource: false,
    platforms: [],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [
      "A TV channel: needs a DD Free Dish dish and set-top box, or another DTH or cable connection.",
      "Hindi only; the films are dubbed.",
    ],
    tags: ["india", "hindi-dubbed", "south-indian-films", "dd-free-dish", "tv"],
    relatedResources: ["dd-free-dish"],
    media: {
      formats: ["live-tv", "film"],
      access: ["free_full_access"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Goldmines Telefilms",
      containsAds: "unknown",
      hasPaidFeatures: "no",
      genres: ["action", "drama", "south-indian", "bollywood"],
      contentLanguages: ["hi"],
      region: {
        india: "available",
        availableIn: ["IN"],
        notes: "Free-to-air on DD Free Dish and carried by India's main DTH platforms, per Goldmines.",
        sourceUrl: GOLDMINES,
      },
    },
    research: {
      date: DATE,
      sources: [src(GOLDMINES, "Goldmines Channels page: three Hindi movie channels; 'Free to Air Satellite Channels ... available on DD Free Dish'; DTH and MSO distribution list; dubbed South Indian films")],
      checks: [
        ok("OFFICIAL_URL", GOLDMINES, "goldmines.co.in is Goldmines Telefilms' own site."),
        ok("FREE_STATUS", GOLDMINES, "'Goldmines, Goldmines Bollywood, and Goldmines Movies are Free to Air Satellite Channels and are available on DD Free Dish.'"),
        ok("ACCOUNT_REQUIREMENT", GOLDMINES, "Free-to-air satellite reception needs no subscription or sign-in."),
        ok("LIMITATIONS", GOLDMINES, "Distribution is via DD Free Dish, DTH services and cable operators, i.e. a TV connection is needed."),
      ],
      notes: "Read on the Channels page. Advertising is not stated there.",
    },
  },
  {
    slug: "dice-media",
    name: "Dice Media",
    shortDescription: "Award-winning Indian web series — Little Things, Half Love Half Arranged, Please Find Attached — on Dice Media's YouTube channel.",
    longDescription:
      "Dice Media, from Pocket Aces (part of Saregama), makes long-form web series for young adults, including Little Things, Half Love Half Arranged, Gharwaapsi, Operation MBBS, What The Folks and Please Find Attached, which have won e4m Play and IWM digital awards. Pocket Aces' site links the Dice Media YouTube channel; some series are also licensed to OTT platforms.",
    whyListed: "Some of India's best-loved web series, from the studio that makes them.",
    category: "tv-series",
    resourceType: "WEBSITE",
    officialUrl: "https://www.youtube.com/channel/UCC89oVFqenaffhBoyqxd6qw",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS, "Some seasons are licensed to paid OTT platforms rather than YouTube; brand integrations appear in episodes."],
    tags: ["india", "web-series", "hindi", "comedy", "romance"],
    media: {
      formats: ["web-series"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Dice Media (Pocket Aces / Saregama)",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["comedy", "romance", "drama", "youth"],
      contentLanguages: ["hi", "en"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(POCKET_ACES, "Pocket Aces site: Dice Media premium storytelling linked to its YouTube channel; series list and awards; content also licensed to OTT; part of Saregama"), YT_SRC],
      checks: [
        ok("OFFICIAL_URL", POCKET_ACES, "Pocket Aces, Dice Media's parent, links the Dice YouTube channel from its own site."),
        ok("FREE_STATUS", POCKET_ACES, "Dice Media publishes its series on its YouTube channel, free to watch."),
        ok("LIMITATIONS", POCKET_ACES, "Pocket Aces says it also licenses the content to OTT apps, TV and in-flight."),
      ],
      notes: "Read on Pocket Aces' site. Which seasons are complete on YouTube was not catalogued.",
    },
  },
]);
