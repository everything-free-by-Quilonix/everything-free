/**
 * The entertainment profile of a resource.
 *
 * Entertainment listings are ordinary library resources — one model, one set of
 * pages, one search — with an optional `media` block carrying the facts that only
 * matter for things you watch, play, listen to or read: what is actually free about
 * the *content*, whether it is the content itself or only a guide to it, where it
 * can be reached, and under what licence the content (not the software) is offered.
 *
 * The same principles as the rest of the model apply:
 *
 * - Access, pricing and licensing are separate questions. Free to stream is not
 *   free to download, which is not free to reuse in a video.
 * - Region, content licence and offer claims each name the source that supports
 *   them, and that source must be one of the listing's dated verification sources.
 *   A claim with no source is not made; the field stays "unknown".
 * - Nothing here measures popularity. Discovery labels are derived from dated
 *   evidence or are visibly editorial — see `lib/entertainment/labels.ts`.
 */
import type { Availability, IsoDate } from "./resource";

/* -------------------------------------------------------------------------- */
/* Access classification                                                      */
/* -------------------------------------------------------------------------- */

/**
 * What "free" means for the relevant content. A listing usually carries more than
 * one: a public-domain film archive is `public_domain`, `free_streaming` and
 * `free_download` at once. These never collapse into a binary free/paid flag.
 */
export const MEDIA_ACCESS_TYPES = [
  "free_full_access",
  "free_with_ads",
  "free_tier",
  "free_open_source",
  "public_domain",
  "open_license",
  "free_download",
  "free_streaming",
  "free_demo",
  "temporary_free",
  "library_access",
  "free_discovery",
  "freemium",
  "unknown",
] as const;

export type MediaAccessType = (typeof MEDIA_ACCESS_TYPES)[number];

/* -------------------------------------------------------------------------- */
/* Formats                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * What kind of entertainment the listing offers. Drives the shelves, the format
 * filter and the action label. A listing may have several formats (a FAST service
 * carries films and series).
 */
export const MEDIA_FORMATS = [
  // Watch
  "film",
  "documentary",
  "short-film",
  "series",
  "web-series",
  "anime",
  "animation",
  "live-tv",
  "live-stream",
  "video-platform",
  // Play
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
  // Listen
  "music-streaming",
  "music-download",
  "creator-music",
  "classical-music",
  "radio",
  "podcast",
  "audiobook",
  "sound-effects",
  // Read
  "webcomic",
  "manga",
  "comic-archive",
  "ebook",
  // Explore
  "museum",
  "cultural-archive",
  "photography",
  "immersive",
  // Software that plays or organises entertainment rather than providing it
  "player-software",
] as const;

export type MediaFormat = (typeof MEDIA_FORMATS)[number];

/**
 * Whether the destination *is* the content, part of it, or a guide to it.
 *
 * - `full-content`     — the relevant works themselves are there to watch/play/read.
 * - `selected-content` — some works are free; others are paid or locked.
 * - `discovery`        — a guide, index or search that points elsewhere. Never gets
 *                        a "Watch free" action.
 * - `software`         — a player, reader or engine; bring your own content.
 */
export const MEDIA_OFFERINGS = ["full-content", "selected-content", "discovery", "software"] as const;
export type MediaOffering = (typeof MEDIA_OFFERINGS)[number];

/**
 * How much of a work the free offer covers. Separates a full film from a
 * trailer, and a complete series from three sample episodes.
 */
export const MEDIA_CONTENT_SCOPES = ["complete-works", "selected-works", "previews-only", "information-only", "not-applicable"] as const;
export type MediaContentScope = (typeof MEDIA_CONTENT_SCOPES)[number];

/* -------------------------------------------------------------------------- */
/* Region                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Region state for one market.
 *
 * - `available`   — a source says the free offer works there.
 * - `partial`     — works there, but with a reduced catalogue or features.
 * - `unavailable` — a source says it does not operate there.
 * - `unknown`     — nobody has established it. The default.
 */
export const REGION_STATES = ["available", "partial", "unavailable", "unknown"] as const;
export type RegionState = (typeof REGION_STATES)[number];

export interface MediaRegion {
  /** India is a first-class discovery region for the project. */
  india: RegionState;
  /**
   * Other markets the source names, as ISO 3166-1 alpha-2 codes, or `"WORLDWIDE"`
   * when the provider says it has no geographic restriction.
   */
  availableIn: string[];
  /** Plain-language detail: "US, Canada and 30+ countries; not India". */
  notes?: string;
  /** Required when `india` is not unknown or `availableIn` is non-empty. */
  sourceUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* Content licence                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Licence of the *content*, not the software that serves it.
 *
 * - `public-domain`   — the listed works are in the public domain (in the stated
 *                       jurisdiction).
 * - `open-license`    — a named open licence (CC BY, CC BY-SA, CC0…) covers the
 *                       listed works.
 * - `per-item`        — mixed; each work states its own licence. The most common
 *                       case for archives and creator platforms.
 * - `all-rights-reserved` — free to watch/play, not to reuse.
 * - `unknown`
 */
export const CONTENT_LICENSE_KINDS = ["public-domain", "open-license", "per-item", "all-rights-reserved", "unknown"] as const;
export type ContentLicenseKind = (typeof CONTENT_LICENSE_KINDS)[number];

/**
 * Whether a creator may use the content in their own work (a video soundtrack, a
 * remix). Only `allowed` and `allowed-with-attribution` ever produce a
 * "creator use" filter match, and only with a source.
 */
export const CREATOR_USE_VALUES = ["allowed", "allowed-with-attribution", "non-commercial-only", "per-item", "not-allowed", "unknown"] as const;
export type CreatorUse = (typeof CREATOR_USE_VALUES)[number];

export interface ContentLicense {
  kind: ContentLicenseKind;
  /** "Public domain in the US", "CC BY 4.0 on most tracks; each track states its own". */
  summary: string;
  creatorUse: CreatorUse;
  /** The provider's licence or terms page. */
  url?: string;
  /** Required for anything other than `unknown`. */
  sourceUrl?: string;
  /** Attribution the provider asks for, when it asks for one. */
  attribution?: string;
}

/* -------------------------------------------------------------------------- */
/* Offers, artwork, editorial                                                 */
/* -------------------------------------------------------------------------- */

/** A time-limited free offer. Required whenever `temporary_free` is claimed. */
export interface MediaOffer {
  /** What is free, exactly: "Two games free each week from the Epic Games Store". */
  description: string;
  /** For a single offer, when it ends. Omitted for a recurring programme. */
  endsAt?: IsoDate;
  /** True for an ongoing programme of rotating offers (each with its own expiry). */
  recurring: boolean;
  /** What a user keeps after the offer ends. */
  afterwards: string;
  sourceUrl: string;
}

/**
 * Artwork shown on a card. Only used when the right to show it is recorded:
 * otherwise the card draws its own typographic cover. Never a poster, album cover
 * or still copied from a rights holder.
 */
export interface MediaArtwork {
  url: string;
  alt: string;
  /** Who made it, as the licence requires it to be credited. */
  credit: string;
  /** The licence or permission page for this specific image. */
  licenseUrl: string;
}

/**
 * An editorial recommendation. Shown as "Editor's pick", never as a measured
 * popularity claim, and always with the reason.
 */
export interface MediaEditorial {
  hiddenGem?: boolean;
  /** Why it is recommended. Required: an unexplained pick is an endorsement with nothing behind it. */
  reason: string;
}

/* -------------------------------------------------------------------------- */
/* The profile                                                                */
/* -------------------------------------------------------------------------- */

export interface MediaProfile {
  formats: MediaFormat[];
  access: MediaAccessType[];
  offering: MediaOffering;
  contentScope: MediaContentScope;
  /** Who provides the content or service — not always the listing's name. */
  provider: string;

  containsAds: Availability;
  /** Paid upgrades, premium tiers or in-app purchases exist alongside the free offer. */
  hasPaidFeatures: Availability;

  /**
   * True only when the official URL itself is a page where the game can be played
   * in a browser without installing anything. A store page is not.
   */
  playInBrowser?: boolean;

  /** Genres as lowercase words: "horror", "puzzle", "classical". */
  genres: string[];
  /**
   * Languages the *content* is offered in (audio, subtitles or text), ISO 639-1.
   * Separate from `Resource.languages`, which is the interface language.
   */
  contentLanguages: string[];

  region: MediaRegion;
  contentLicense?: ContentLicense;
  offer?: MediaOffer;
  artwork?: MediaArtwork;
  editorial?: MediaEditorial;

  /**
   * For open-source games and players: the `owner/name` of the official GitHub
   * repository, used by the activity-signal script. Must match `sourceUrl`.
   */
  githubRepo?: string;

  /** When a maintainer should look again. Defaults to 90 days after the last pass. */
  nextReviewAt?: IsoDate;
}
