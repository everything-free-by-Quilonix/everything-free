import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import { defineMediaList, type ResearchSource } from "./define-media";

/**
 * Films and anime, part 2. Every value is backed by a page read on 2026-10-11.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const NFB = "https://www.nfb.ca/about/";
const MUSE_ABOUT = "https://www.e-muse.com/en/about-us/";
const MUSE_HINDI_NEWS = "https://www.animenewsnetwork.com/news/2026-05-29/muse-asia-launches-new-muse-hindi-dub-youtube-channel/.237931";
const YT_PREMIUM = "https://support.google.com/youtube/answer/6308116?hl=en";

export const watchFilm2Resources: Resource[] = defineMediaList([
  {
    slug: "nfb-films",
    name: "National Film Board of Canada",
    shortDescription: "Over 7,000 documentaries and animated films from the NFB, free to stream or download for personal use, in English and French.",
    longDescription:
      "The National Film Board of Canada has produced more than 14,000 works and won 12 Oscars. Its About page says over 7,000 productions are on NFB.ca, free to stream or download for personal use — documentaries, auteur animation from directors such as Ishu Patel, Caroline Leaf and Norman McLaren's successors, series and films for children, in English and French. A free profile adds favourites; some titles are rentals.",
    whyListed: "One of the world's great animation and documentary collections, legally free from the public producer that made it.",
    category: "movies",
    subcategories: ["anime", "learning"],
    resourceType: "WEBSITE",
    officialUrl: "https://www.nfb.ca/",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "Free streaming and downloads are for personal use; public screenings need a separate licence.",
      "A profile is needed to save favourites, rent or download; some titles are rentals rather than free.",
    ],
    tags: ["documentary", "animation", "canada", "short-films", "french"],
    media: {
      formats: ["documentary", "animation", "short-film", "film", "series"],
      access: ["free_full_access", "free_streaming", "free_download"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "National Film Board of Canada",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["documentary", "animation", "kids", "classics"],
      contentLanguages: ["en", "fr"],
      region: { india: "unknown", availableIn: [] },
      editorial: {
        hiddenGem: true,
        reason: "Decades of Oscar-winning auteur animation and documentary, free and little known outside Canada.",
      },
    },
    research: {
      date: DATE,
      sources: [src(NFB, "About the NFB: 14,000+ works, 7,000 free on nfb.ca; stream free or download for personal use; documentaries, animation, series; English and French; profile to rent/download")],
      checks: [
        ok("OFFICIAL_URL", NFB, "nfb.ca/about is the National Film Board's own page."),
        ok("FREE_STATUS", NFB, "'7,000 of which are available free of charge on nfb.ca' and 'can be streamed free of charge or downloaded for your personal use'."),
        ok("PERSONAL_USE", NFB, "Streaming and downloading are offered 'for your personal use'."),
        ok("LIMITATIONS", NFB, "Public screenings and institutional use go through separate licensing; a profile enables renting and downloading."),
      ],
      notes: "Read on the NFB's About page. Geographic restrictions on individual titles were not checked.",
    },
  },
  {
    slug: "muse-india-anime",
    name: "Muse India (YouTube)",
    shortDescription: "Licensed anime streamed free on YouTube for India by distributor Muse Communication, including Hindi dubs.",
    longDescription:
      "Muse Communication is a Taiwanese anime distributor that is the licensed agent for more than 30 anime and manga rights holders and has an office in Navi Mumbai. It runs free, ad-supported YouTube channels: Muse Asia, the Muse India channel launched in April 2022, and a Muse Hindi Dub channel launched in May 2026 with the Hindi dub of SPY×FAMILY. Which titles are available, and in which countries, varies.",
    whyListed: "The main legal free source of current anime for Indian viewers since Crunchyroll ended its free tier.",
    category: "anime",
    resourceType: "WEBSITE",
    officialUrl: "https://www.youtube.com/channel/UCA9nLwuoOjfMJMNt6fG5Rlw",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [
      "Ad-supported: YouTube shows ads unless you pay for YouTube Premium.",
      "Availability is per title and per country; some seasons are uploaded as a single long video.",
    ],
    tags: ["anime", "india", "hindi-dub", "licensed", "youtube"],
    media: {
      formats: ["anime", "series"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Muse Communication",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["anime", "action", "comedy", "fantasy"],
      contentLanguages: ["hi", "ja", "en"],
      region: {
        india: "available",
        availableIn: ["IN"],
        notes: "Anime News Network reports Muse India and Muse Hindi Dub stream in India; titles vary.",
        sourceUrl: MUSE_HINDI_NEWS,
      },
    },
    research: {
      date: DATE,
      sources: [
        src(MUSE_ABOUT, "Muse Communication About page: licensed agent for 30+ anime and manga rights holders; offices across Asia incl. Navi Mumbai, India"),
        src(MUSE_HINDI_NEWS, "Anime News Network (news report): Muse India YouTube channel since April 2022; new Muse Hindi Dub channel from May 2026; channel URL"),
        src(YT_PREMIUM, "YouTube Help: ads before and during videos are removed only with paid Premium"),
      ],
      checks: [
        ok("OFFICIAL_URL", MUSE_HINDI_NEWS, "The report links the Muse Hindi Dub channel and cites Muse India's own announcement."),
        ok("FREE_STATUS", MUSE_HINDI_NEWS, "Muse streams licensed anime on its YouTube channels, which are free to watch."),
        ok("LIMITATIONS", YT_PREMIUM, "Free YouTube viewing is ad-supported; Premium removes the ads."),
      ],
      notes:
        "Distributor status from Muse's own site; the India channels from a news report citing Muse's announcement (YouTube's channel pages could not be read). Crunchyroll was evaluated and rejected: it ended free ad-supported viewing on 31 December 2025.",
    },
  },
]);
