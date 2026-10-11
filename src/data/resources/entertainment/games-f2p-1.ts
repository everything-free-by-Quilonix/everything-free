import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import { defineMediaList, type ResearchSource } from "./define-media";

/**
 * games-f2p, part 1: established free-to-play PC and cross-platform games.
 * Every value is backed by a page read on 2026-10-11. All have optional
 * purchases; each listing says what they are.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

const WARFRAME = "https://www.warframe.com/game/about";
const WT = "https://warthunder.com/en/game/about/";
const POE = "https://www.pathofexile.com/game";
const BRAWL = "https://www.brawlhalla.com/";
const OSRS = "https://oldschool.runescape.com/";

export const gamesF2p1Resources: Resource[] = defineMediaList([
  {
    slug: "warframe",
    name: "Warframe",
    shortDescription: "Free-to-play co-op sci-fi action shooter with cross-platform play on PC, consoles and iOS; optional Platinum purchases.",
    longDescription:
      "Warframe, by Digital Extremes, is a fast third-person action shooter with parkour combat, hundreds of weapons and open worlds, played by more than 80 million people. The official site offers 'Play Free Now' on PC, Steam, Epic, Xbox, PlayStation, Nintendo Switch, iOS and Android, with cross-platform play. Its rating lists in-game purchases: Platinum, bundles and Prime Access are sold in the store.",
    whyListed: "One of the most generous free-to-play games: everything can be earned by playing.",
    category: "games",
    resourceType: "GAME",
    officialUrl: WARFRAME,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["WINDOWS", "ANDROID", "IOS"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "In-game purchases: Platinum, bundles and Prime Access are sold for real money.",
      "Rated for blood and gore, violence and language.",
      "Needs an online account to play.",
    ],
    tags: ["shooter", "co-op", "cross-play", "sci-fi"],
    media: {
      formats: ["free-to-play", "pc-game"],
      access: ["free_full_access", "freemium", "free_download"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "Digital Extremes",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["shooter", "action", "co-op"],
      contentLanguages: ["en", "multi"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(WARFRAME, "Official About page: 'Play Free Now'; PC, Steam, Xbox, PlayStation, Switch, Epic, Apple, Google Play; cross-platform; store with Platinum; rating 'In-Game Purchases'")],
      checks: [
        ok("OFFICIAL_URL", WARFRAME, "warframe.com is Digital Extremes' official site for the game."),
        ok("FREE_STATUS", WARFRAME, "Every call to action reads 'Play Free Now', linking to free sign-up."),
        ok("ACCOUNT_REQUIREMENT", WARFRAME, "'Play Free Now' leads to account sign-up."),
        ok("LIMITATIONS", WARFRAME, "The rating notes 'In-Game Purchases'; the store sells Platinum, bundles and Prime Access."),
      ],
      notes: "Read on the official About page.",
    },
  },
  {
    slug: "war-thunder",
    name: "War Thunder",
    shortDescription: "Free-to-play cross-platform military MMO with 2,500+ aircraft, tanks, helicopters and ships; on PC, Mac, Linux and consoles.",
    longDescription:
      "War Thunder by Gaijin is a free-to-play online vehicle-combat game with more than 2,500 historically modelled aircraft, helicopters, ground vehicles and warships, and cross-platform play across Windows, Linux, Mac, PlayStation and Xbox. The official FAQ says you can download and play without restrictions or subscription fees; an internet connection is required. Premium vehicles and Gaijin Pass are optional purchases.",
    whyListed: "A deep, free simulation-leaning combat game that runs on Linux and Mac as well as Windows.",
    category: "games",
    resourceType: "GAME",
    officialUrl: WT,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: ["Always online; no offline play.", "Optional paid premium vehicles and currency are sold.", "Large download: 22–76 GB."],
    tags: ["simulation", "tanks", "aircraft", "cross-play", "linux"],
    media: {
      formats: ["free-to-play", "pc-game"],
      access: ["free_full_access", "freemium", "free_download"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "Gaijin Entertainment",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["simulation", "military", "multiplayer"],
      contentLanguages: ["en", "multi"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(WT, "Official About page + FAQ: free-to-play cross-platform MMO for Windows, Linux, Mac, PS4/5, Xbox; free to download and play without restrictions or subscription fees; online only; system requirements")],
      checks: [
        ok("OFFICIAL_URL", WT, "warthunder.com is Gaijin's official site for the game."),
        ok("FREE_STATUS", WT, "FAQ: 'You are free to download and play the game right away without any restrictions or subscription fees.'"),
        ok("PLATFORM_AVAILABILITY", WT, "Windows, Linux, Mac, PlayStation 4/5, Xbox One and Series X|S, with system requirements per OS."),
        ok("LIMITATIONS", WT, "FAQ: 'you need a permanent internet connection'; minimum client 22 GB, full client up to 76 GB."),
        ok("ACCOUNT_REQUIREMENT", WT, "The page's primary action is 'Register now!' before downloading."),
      ],
      notes: "Read on the official About page and FAQ. Purchases are visible in the Gaijin Pass menu but not detailed there.",
    },
  },
  {
    slug: "path-of-exile",
    name: "Path of Exile",
    shortDescription: "Dark-fantasy action RPG from Grinding Gear Games, free to play, with a promise it will never be 'pay to win'.",
    longDescription:
      "Path of Exile is an online action RPG with a vast passive skill tree, socketable skill gems, randomly generated areas and frequent seasonal leagues. Grinding Gear Games' official page says the game is free and will never be 'pay to win'; its shop sells cosmetic microtransactions, stash tabs and supporter packs. It runs on PC, Mac, Xbox One and PS4.",
    whyListed: "The benchmark for fair free-to-play: years of depth with no paid power.",
    category: "games",
    resourceType: "GAME",
    officialUrl: POE,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["WINDOWS", "MACOS"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: ["The shop sells microtransactions, packs and a vault pass; extra stash space is a common purchase.", "Online only, with an account."],
    tags: ["action-rpg", "arpg", "dark-fantasy", "loot"],
    media: {
      formats: ["free-to-play", "pc-game"],
      access: ["free_full_access", "freemium", "free_download"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "Grinding Gear Games",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["rpg", "action", "fantasy"],
      contentLanguages: ["en", "pt", "ru", "th", "de", "fr", "es", "ja", "ko"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(POE, "Official game page: 'The game is completely free and will never be pay to win'; PC, Mac, Xbox One, PS4; shop with packs, Kirac's Vault Pass, microtransactions; language versions")],
      checks: [
        ok("OFFICIAL_URL", POE, "pathofexile.com is Grinding Gear Games' official site."),
        ok("FREE_STATUS", POE, "'The game is completely free and will never be \"pay to win\".'"),
        ok("LIMITATIONS", POE, "The site's Shop sells packs, a vault pass, microtransactions and a mystery box."),
        ok("ACCOUNT_REQUIREMENT", POE, "Play starts by creating an account (Sign Up)."),
      ],
      notes: "Read on the official game page. Path of Exile 2 is a separate product and not covered here.",
    },
  },
  {
    slug: "brawlhalla",
    name: "Brawlhalla",
    shortDescription: "Free 2D platform fighter for up to 8 players, with full cross-play on PC, PlayStation, Xbox, Switch, iOS and Android.",
    longDescription:
      "Brawlhalla, by Blue Mammoth Games and Ubisoft, is a free-to-play platform fighting game with 50+ playable Legends, local and online play for up to eight players, and full cross-play across PC (Steam, Ubisoft Connect, Epic), PlayStation, Xbox, Nintendo Switch, iOS and Android. Its rating lists in-game purchases including random items; a battle pass and cosmetics are sold.",
    whyListed: "A polished free fighting game you can play with friends on almost any device.",
    category: "games",
    resourceType: "GAME",
    officialUrl: BRAWL,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["WINDOWS", "ANDROID", "IOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: ["In-game purchases including random items (loot boxes), and a paid battle pass.", "Some chests are not available in every region."],
    tags: ["fighting", "cross-play", "local-multiplayer", "mobile"],
    media: {
      formats: ["free-to-play", "pc-game", "mobile-game"],
      access: ["free_full_access", "freemium", "free_download"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "Blue Mammoth Games / Ubisoft",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["fighting", "multiplayer", "party"],
      contentLanguages: ["en", "multi"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(BRAWL, "Official site: 'Brawlhalla is a free 2D platform fighting game', up to 8 players, cross-play on PC, PS, Xbox, Switch, iOS, Android; ESRB 'In-Game Purchases (Includes Random Items)'; battle pass")],
      checks: [
        ok("OFFICIAL_URL", BRAWL, "brawlhalla.com is the developer's official site."),
        ok("FREE_STATUS", BRAWL, "'Brawlhalla is a free 2D platform fighting game' and is labelled Free to Play."),
        ok("PLATFORM_AVAILABILITY", BRAWL, "Desktop via Steam, Ubisoft Connect and Epic; PlayStation, Xbox, Switch; Android and iOS."),
        ok("LIMITATIONS", BRAWL, "ESRB descriptor 'In-Game Purchases (Includes Random Items)'; Battle Pass seasons; regional chest changes."),
      ],
      notes: "Read on the official homepage.",
    },
  },
  {
    slug: "old-school-runescape",
    name: "Old School RuneScape",
    shortDescription: "The classic retro MMO from Jagex, with a free-to-play version and paid membership that opens the full world.",
    longDescription:
      "Old School RuneScape is Jagex's community-polled version of the classic RuneScape MMO, on desktop and mobile. The official site offers 'Try Free' alongside 'Become a Member': free players get a smaller world and fewer skills, while membership unlocks the rest. It is rated PEGI 16 with in-game purchases, including random items.",
    whyListed: "A beloved MMO where the free version alone offers hundreds of hours.",
    category: "games",
    resourceType: "GAME",
    officialUrl: OSRS,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["WINDOWS", "MACOS", "ANDROID", "IOS"],
    requiresAccount: "yes",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "Much of the game world, quests and skills need paid membership.",
      "PEGI 16; in-game purchases including random items.",
    ],
    tags: ["mmo", "retro", "rpg", "mobile"],
    media: {
      formats: ["free-to-play", "pc-game", "mobile-game"],
      access: ["free_tier", "free_download"],
      offering: "selected-content",
      contentScope: "selected-works",
      provider: "Jagex",
      containsAds: "unknown",
      hasPaidFeatures: "yes",
      genres: ["mmo", "rpg", "retro"],
      contentLanguages: ["en"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [src(OSRS, "Official Old School RuneScape homepage: 'Try Free' and 'Become a Member'; download and mobile links; PEGI 16, in-game purchases (includes random items)")],
      checks: [
        ok("OFFICIAL_URL", OSRS, "oldschool.runescape.com is Jagex's official site for the game."),
        ok("FREE_STATUS", OSRS, "The homepage offers 'Try Free' alongside a paid 'Become a Member' option: a free tier."),
        ok("LIMITATIONS", OSRS, "PEGI notice: 'In-game Purchases (Includes Random Items)'; membership is sold separately."),
      ],
      notes: "Read on the official homepage. The exact free-world boundaries are on the membership page, not read in this pass.",
    },
  },
]);
