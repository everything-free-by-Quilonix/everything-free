import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import { defineMediaList, type ResearchSource } from "./define-media";

/**
 * games-indie, part 1: itch.io's free catalogue and jams, and two landmark free
 * indie games. Every value is backed by a page read on 2026-10-11.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const ITCH_FREE = "https://itch.io/games/free";
const ITCH_JAMS = "https://itch.io/jams";
const DDLC = "https://teamsalvato.itch.io/ddlc";
const FNF = "https://ninja-muffin24.itch.io/funkin";

export const gamesIndie1Resources: Resource[] = defineMediaList([
  {
    slug: "itch-io-free-games",
    name: "itch.io free games",
    shortDescription: "Over 1.5 million free indie games on itch.io, filterable by platform, genre, input, session length and accessibility.",
    longDescription:
      "itch.io is an open marketplace where independent developers publish games. Its free section lists more than 1.5 million free games, with filters for Windows, macOS, Linux, Android, iOS and play-in-browser, genre, input method, session length, multiplayer and accessibility features such as colour-blind support and blind-friendly play. Many are 'name your own price', so you can pay if you want to.",
    whyListed: "The largest free catalogue of indie, experimental and game-jam games anywhere, many playable in a browser.",
    category: "games",
    resourceType: "WEBSITE",
    officialUrl: ITCH_FREE,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [
      "Anyone can upload, so quality varies widely; demos and in-development games are mixed in (some titles are marked DEMO).",
      "Some free games are 18+ or contain disturbing content; check each game's page.",
    ],
    tags: ["indie", "itch-io", "html5", "game-jam", "visual-novel"],
    media: {
      formats: ["game-store", "indie-game", "browser-game", "pc-game"],
      access: ["free_full_access", "free_download"],
      offering: "selected-content",
      contentScope: "selected-works",
      provider: "itch corp and independent developers",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["indie", "visual-novel", "puzzle", "horror", "platformer"],
      contentLanguages: ["multi"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(ITCH_FREE, "itch.io 'Top free Games' page: 1,511,121 results; filters for browser/Windows/macOS/Linux/Android/iOS, genre, input, accessibility; demos listed")],
      checks: [
        ok("OFFICIAL_URL", ITCH_FREE, "itch.io/games/free is itch.io's own free-games browse page."),
        ok("FREE_STATUS", ITCH_FREE, "The page lists 1,511,121 games under the Price: Free filter."),
        ok("PLATFORM_AVAILABILITY", ITCH_FREE, "Platform filters offer Play in browser, Windows, macOS, Linux, Android and iOS."),
        ok("LIMITATIONS", ITCH_FREE, "Results include titles marked [DEMO] and 18+ games alongside full free games."),
      ],
      notes: "Read on the free-games browse page. Individual games' terms vary.",
    },
  },
  {
    slug: "itch-io-game-jams",
    name: "itch.io game jams",
    shortDescription: "Thousands of online game jams on itch.io; 600,000+ jam games you can play, and anyone can join or host a jam free.",
    longDescription:
      "itch.io hosts game jams online — short challenges where people make a game to a theme in hours or weeks — from GMTK Game Jam and GBJAM to Godot Wild Jam and India-based jams such as the Godot India Community Mini Jam. Its jams page says anyone can instantly create and host a jam and that more than 600,000 games have been made for jams hosted there, most of them free to play.",
    whyListed: "The best place to find tiny, inventive free games — and to start making your own.",
    category: "games",
    subcategories: ["learning"],
    resourceType: "COMMUNITY",
    officialUrl: ITCH_JAMS,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: ["Jam games are often short and unpolished by design; some jams are NSFW and are labelled as such."],
    tags: ["game-jam", "indie", "gamedev", "itch-io"],
    media: {
      formats: ["game-jam", "indie-game", "browser-game"],
      access: ["free_full_access"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "itch corp and jam hosts",
      containsAds: "unknown",
      hasPaidFeatures: "unknown",
      genres: ["indie", "experimental", "puzzle", "horror"],
      contentLanguages: ["multi"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(ITCH_JAMS, "itch.io Game Jams page: anyone can instantly create and host a jam; 607,221 games created for jams; featured and calendar of jams")],
      checks: [
        ok("OFFICIAL_URL", ITCH_JAMS, "itch.io/jams is itch.io's own game-jam directory."),
        ok("FREE_STATUS", ITCH_JAMS, "'Anyone can instantly create and host a jam'; 607,221 jam games are listed for play."),
        ok("LIMITATIONS", ITCH_JAMS, "The calendar includes jams marked NSFW alongside general ones."),
      ],
      notes: "Read on the jams page. Individual jam games may be paid or free; most are free.",
    },
  },
  {
    slug: "doki-doki-literature-club",
    name: "Doki Doki Literature Club!",
    shortDescription: "Team Salvato's acclaimed psychological-horror visual novel, free on Windows, macOS and Linux. Not for children.",
    longDescription:
      "Doki Doki Literature Club! is a visual novel by Team Salvato that presents itself as a cute dating game and becomes something much darker. Its official itch.io page says it is free to play in full; paying $10 or more is optional and unlocks a Fan Pack with the soundtrack, wallpapers and a concept-art booklet. The developer warns it is not suitable for children or those who are easily disturbed.",
    whyListed: "One of the most celebrated free indie games ever made, from its developer's own page.",
    category: "games",
    resourceType: "GAME",
    officialUrl: DDLC,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "Content warning from the developer: not suitable for children or those who are easily disturbed.",
      "The soundtrack and art Fan Pack needs a payment of $10 or more.",
    ],
    tags: ["visual-novel", "psychological-horror", "indie", "renpy"],
    media: {
      formats: ["indie-game", "pc-game", "interactive-fiction"],
      access: ["free_full_access", "free_download"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "Team Salvato",
      containsAds: "no",
      hasPaidFeatures: "yes",
      genres: ["visual-novel", "horror", "romance"],
      contentLanguages: ["en"],
      region: { india: "unknown", availableIn: [] },
      editorial: {
        hiddenGem: true,
        reason: "A free game that genuinely changed what people expected a visual novel could do — but read the content warning first.",
      },
    },
    research: {
      date: DATE,
      sources: [src(DDLC, "Official itch.io page: 100% free to play; optional $10+ for Fan Pack; Windows/macOS/Linux; not suitable for children or easily disturbed")],
      checks: [
        ok("OFFICIAL_URL", DDLC, "teamsalvato.itch.io/ddlc is published by Team Salvato, the developer."),
        ok("FREE_STATUS", DDLC, "'Doki Doki Literature Club (DDLC) is 100% free to play, but you are welcome to contribute any amount.'"),
        ok("CREDIT_CARD_REQUIREMENT", DDLC, "Download is 'Name your own price'; payment is optional except for the Fan Pack."),
        ok("PLATFORM_AVAILABILITY", DDLC, "Platforms listed: Windows, macOS, Linux."),
        ok("LIMITATIONS", DDLC, "'This game is not suitable for children or those who are easily disturbed.'"),
      ],
      notes: "Read on the developer's itch.io page.",
    },
  },
  {
    slug: "friday-night-funkin",
    name: "Friday Night Funkin'",
    shortDescription: "The hit free rhythm game from The Funkin' Crew; code on GitHub under Apache 2.0, art and music all rights reserved.",
    longDescription:
      "Friday Night Funkin' is a rhythm game in the style of Dance Dance Revolution: press the arrows in time to win a sing-off against your girlfriend's rock-star dad. Its official itch.io page offers Windows, macOS and Linux builds as 'name your own price' and links a playable version on Newgrounds. The source code is on GitHub under the Apache License 2.0, while the game's assets are all rights reserved.",
    whyListed: "A free indie phenomenon with an open codebase that a huge modding community builds on.",
    category: "games",
    subcategories: ["open-source"],
    resourceType: "GAME",
    officialUrl: FNF,
    sourceUrl: "https://github.com/FunkinCrew/Funkin",
    freeStatus: "FREE",
    openSource: true,
    license: "Apache-2.0",
    licenseNotes: "The code is Apache 2.0; the game's art, music and other assets are all rights reserved.",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "no",
    commercialUse: "unknown",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: ["Assets are all rights reserved, so the open-source licence covers the code only.", "Still marked 'In development'."],
    tags: ["rhythm", "indie", "haxe", "modding"],
    media: {
      formats: ["indie-game", "pc-game", "open-source-game"],
      access: ["free_full_access", "free_download", "free_open_source"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "The Funkin' Crew",
      containsAds: "no",
      hasPaidFeatures: "no",
      genres: ["rhythm", "music"],
      contentLanguages: ["en"],
      region: { india: "unknown", availableIn: [] },
      githubRepo: "FunkinCrew/Funkin",
    },
    research: {
      date: DATE,
      sources: [src(FNF, "Official itch.io page: name your own price downloads for Windows/macOS/Linux; source on GitHub under Apache 2.0, assets All Rights Reserved; also on Newgrounds")],
      checks: [
        ok("OFFICIAL_URL", FNF, "ninja-muffin24.itch.io/funkin is the developers' own page."),
        ok("FREE_STATUS", FNF, "Downloads are 'Name your own price' and the page is filed under Featured › Free."),
        ok("LICENSE", FNF, "'Source code is available on Github, under Apache 2.0 (assets All Rights Reserved)'; code licence listed as Apache 2.0."),
        ok("OPEN_SOURCE_STATUS", FNF, "The page links the source code at github.com/FunkinCrew/funkin."),
        ok("PLATFORM_AVAILABILITY", FNF, "Builds offered for Windows x64, macOS (Universal) and Linux x64."),
      ],
      notes: "Read on the developers' itch.io page.",
    },
  },
]);
