import type { IconName } from "@/components/icons";
import {
  MEDIA_ACCESS_TYPES,
  MEDIA_FORMATS,
  type ContentLicenseKind,
  type CreatorUse,
  type MediaAccessType,
  type MediaFormat,
  type MediaOffering,
  type RegionState,
} from "@/types/media";

/**
 * The entertainment vocabulary.
 *
 * Like `config/free-status.ts`, this is the one place an access type, format or
 * shelf is described in words, so cards, filters, detail pages and docs cannot
 * drift apart.
 */

export interface AccessTypeDefinition {
  id: MediaAccessType;
  label: string;
  /** One line a visitor can act on. */
  summary: string;
}

export const accessTypeDefinitions: Record<MediaAccessType, AccessTypeDefinition> = {
  free_full_access: {
    id: "free_full_access",
    label: "Free, full access",
    summary: "The relevant content is free to use without a paid subscription.",
  },
  free_with_ads: {
    id: "free_with_ads",
    label: "Free with ads",
    summary: "Free to watch or listen to, with advertising.",
  },
  free_tier: {
    id: "free_tier",
    label: "Free tier",
    summary: "A limited free plan or free catalogue exists alongside paid plans.",
  },
  free_open_source: {
    id: "free_open_source",
    label: "Open source",
    summary: "Published under an open-source licence. Content or hosting may be separate.",
  },
  public_domain: {
    id: "public_domain",
    label: "Public domain",
    summary: "The listed works are in the public domain, per the cited source.",
  },
  open_license: {
    id: "open_license",
    label: "Openly licensed",
    summary: "The listed works carry an open licence such as Creative Commons.",
  },
  free_download: {
    id: "free_download",
    label: "Free download",
    summary: "The content can legally be downloaded at no cost.",
  },
  free_streaming: {
    id: "free_streaming",
    label: "Free streaming",
    summary: "The content can legally be streamed at no cost.",
  },
  free_demo: {
    id: "free_demo",
    label: "Demo or preview",
    summary: "Only a demo, preview or selection is free; the full work is paid.",
  },
  temporary_free: {
    id: "temporary_free",
    label: "Temporary offer",
    summary: "Free for a limited time only. Check the end date.",
  },
  library_access: {
    id: "library_access",
    label: "Library card",
    summary: "Free through a participating library or institution membership.",
  },
  free_discovery: {
    id: "free_discovery",
    label: "Discovery only",
    summary: "Helps you find where to watch or play. It does not provide the content itself.",
  },
  freemium: {
    id: "freemium",
    label: "Freemium",
    summary: "Free to start, with paid upgrades or in-app purchases.",
  },
  unknown: {
    id: "unknown",
    label: "Access not established",
    summary: "The current access model has not been confirmed.",
  },
};

export const accessTypeList = MEDIA_ACCESS_TYPES.map((id) => accessTypeDefinitions[id]);

export function isMediaAccessType(value: string): value is MediaAccessType {
  return Object.hasOwn(accessTypeDefinitions, value);
}

/* -------------------------------------------------------------------------- */

export type MediaVerb = "watch" | "play" | "listen" | "read" | "explore";

export interface FormatDefinition {
  id: MediaFormat;
  label: string;
  verb: MediaVerb;
}

export const formatDefinitions: Record<MediaFormat, FormatDefinition> = {
  film: { id: "film", label: "Films", verb: "watch" },
  documentary: { id: "documentary", label: "Documentaries", verb: "watch" },
  "short-film": { id: "short-film", label: "Short films", verb: "watch" },
  series: { id: "series", label: "TV series", verb: "watch" },
  "web-series": { id: "web-series", label: "Web series", verb: "watch" },
  anime: { id: "anime", label: "Anime", verb: "watch" },
  animation: { id: "animation", label: "Animation", verb: "watch" },
  "live-tv": { id: "live-tv", label: "Live TV channels", verb: "watch" },
  "live-stream": { id: "live-stream", label: "Live streams", verb: "watch" },
  "video-platform": { id: "video-platform", label: "Video platforms", verb: "watch" },
  "browser-game": { id: "browser-game", label: "Browser games", verb: "play" },
  "pc-game": { id: "pc-game", label: "PC games", verb: "play" },
  "free-to-play": { id: "free-to-play", label: "Free-to-play", verb: "play" },
  "open-source-game": { id: "open-source-game", label: "Open-source games", verb: "play" },
  "indie-game": { id: "indie-game", label: "Indie games", verb: "play" },
  "game-jam": { id: "game-jam", label: "Game jams", verb: "play" },
  "interactive-fiction": { id: "interactive-fiction", label: "Interactive fiction", verb: "play" },
  "mobile-game": { id: "mobile-game", label: "Mobile games", verb: "play" },
  "game-store": { id: "game-store", label: "Stores & portals", verb: "play" },
  "cloud-gaming": { id: "cloud-gaming", label: "Cloud gaming", verb: "play" },
  "music-streaming": { id: "music-streaming", label: "Music streaming", verb: "listen" },
  "music-download": { id: "music-download", label: "Music downloads", verb: "listen" },
  "creator-music": { id: "creator-music", label: "Music for creators", verb: "listen" },
  "classical-music": { id: "classical-music", label: "Classical", verb: "listen" },
  radio: { id: "radio", label: "Radio", verb: "listen" },
  podcast: { id: "podcast", label: "Podcasts", verb: "listen" },
  audiobook: { id: "audiobook", label: "Audiobooks", verb: "listen" },
  "sound-effects": { id: "sound-effects", label: "Sound effects", verb: "listen" },
  webcomic: { id: "webcomic", label: "Webcomics", verb: "read" },
  manga: { id: "manga", label: "Manga", verb: "read" },
  "comic-archive": { id: "comic-archive", label: "Comic archives", verb: "read" },
  ebook: { id: "ebook", label: "Books", verb: "read" },
  museum: { id: "museum", label: "Museums", verb: "explore" },
  "cultural-archive": { id: "cultural-archive", label: "Cultural archives", verb: "explore" },
  photography: { id: "photography", label: "Photography", verb: "explore" },
  immersive: { id: "immersive", label: "Immersive & VR", verb: "explore" },
  "player-software": { id: "player-software", label: "Players & apps", verb: "explore" },
};

export const formatList = MEDIA_FORMATS.map((id) => formatDefinitions[id]);

export function isMediaFormat(value: string): value is MediaFormat {
  return Object.hasOwn(formatDefinitions, value);
}

export const GAME_FORMATS: readonly MediaFormat[] = formatList.filter((f) => f.verb === "play").map((f) => f.id);

/* -------------------------------------------------------------------------- */
/* Shelves                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A shelf is a page under `/entertainment/<slug>` showing every listing with one
 * of its formats. Shelves overlap on purpose (an anime film is on Watch and Anime);
 * the listing itself has one canonical page under `/resources/`.
 */
export interface ShelfDefinition {
  slug: string;
  name: string;
  /** Standfirst on the shelf page. */
  description: string;
  icon: IconName;
  formats: MediaFormat[];
}

export const shelves: ShelfDefinition[] = [
  {
    slug: "watch",
    name: "Movies & TV",
    description:
      "Films, documentaries and series you can watch legally without paying — public-domain archives, ad-supported services, library-card streaming and official channels. Discovery guides are marked as such.",
    icon: "film",
    formats: ["film", "documentary", "short-film", "series", "web-series", "live-tv", "video-platform"],
  },
  {
    slug: "anime",
    name: "Anime & animation",
    description:
      "Anime from rights holders' own free catalogues, classic public-domain cartoons and openly licensed animated films.",
    icon: "play-circle",
    formats: ["anime", "animation"],
  },
  {
    slug: "games",
    name: "Games",
    description:
      "Browser games, free-to-play titles, open-source games, indie and game-jam releases, and the stores that carry free catalogues. Demos, freemium games and time-limited giveaways are labelled.",
    icon: "gamepad",
    formats: [
      "browser-game",
      "pc-game",
      "free-to-play",
      "open-source-game",
      "indie-game",
      "game-jam",
      "interactive-fiction",
      "mobile-game",
      "game-store",
      "cloud-gaming",
    ],
  },
  {
    slug: "listen",
    name: "Music & audio",
    description:
      "Free music streaming and downloads, music creators may reuse, internet radio, podcasts and audiobooks. Free to listen is never presented as free to reuse.",
    icon: "music",
    formats: ["music-streaming", "music-download", "creator-music", "classical-music", "radio", "podcast", "audiobook", "sound-effects"],
  },
  {
    slug: "read",
    name: "Comics & reading",
    description: "Webcomics, official free manga chapters, public-domain comic archives and free books.",
    icon: "book-open",
    formats: ["webcomic", "manga", "comic-archive", "ebook"],
  },
  {
    slug: "explore",
    name: "Live, culture & beyond",
    description:
      "Live streams, virtual museums, cultural-heritage collections, public-domain photography and browser-based immersive experiences.",
    icon: "globe",
    formats: ["live-stream", "museum", "cultural-archive", "photography", "immersive"],
  },
];

export function getShelf(slug: string): ShelfDefinition | undefined {
  return shelves.find((shelf) => shelf.slug === slug);
}

/**
 * Below this many listings a shelf is a "developing collection": still reachable,
 * clearly labelled, and kept out of the sitemap and search indexes so a thin page
 * does not pose as a finished one.
 */
export const MIN_SHELF_LISTINGS = 3;

/* -------------------------------------------------------------------------- */
/* Region, licence and offering wording                                       */
/* -------------------------------------------------------------------------- */

export const regionStateLabels: Record<RegionState, string> = {
  available: "Available",
  partial: "Partly available",
  unavailable: "Not available",
  unknown: "Not established",
};

export const offeringLabels: Record<MediaOffering, string> = {
  "full-content": "The content itself",
  "selected-content": "Some content is free",
  discovery: "A guide to where content is",
  software: "Software — bring your own content",
};

export const contentLicenseLabels: Record<ContentLicenseKind, string> = {
  "public-domain": "Public domain",
  "open-license": "Open licence",
  "per-item": "Varies by item",
  "all-rights-reserved": "All rights reserved",
  unknown: "Not established",
};

export const creatorUseLabels: Record<CreatorUse, string> = {
  allowed: "Reuse allowed",
  "allowed-with-attribution": "Reuse allowed with credit",
  "non-commercial-only": "Non-commercial reuse only",
  "per-item": "Check each item's licence",
  "not-allowed": "Not for reuse",
  unknown: "Not established",
};

/** Content-language names for the filters. Only codes the catalogue uses need to be here. */
export const languageNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  bn: "Bengali",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  or: "Odia",
  as: "Assamese",
  ur: "Urdu",
  sa: "Sanskrit",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  fr: "French",
  de: "German",
  es: "Spanish",
  pt: "Portuguese",
  it: "Italian",
  ru: "Russian",
  ar: "Arabic",
  nl: "Dutch",
  pl: "Polish",
  sv: "Swedish",
  tr: "Turkish",
  id: "Indonesian",
  th: "Thai",
  vi: "Vietnamese",
  multi: "Many languages",
};

export function languageName(code: string): string {
  return languageNames[code] ?? code.toUpperCase();
}
