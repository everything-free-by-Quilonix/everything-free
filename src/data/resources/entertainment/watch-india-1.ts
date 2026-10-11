import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import { defineMediaList, type ResearchSource } from "./define-media";

/**
 * India: free films, cartoons and live TV from rights holders and the public
 * broadcaster, plus one community playlist of officially free channels.
 * Every value is backed by a page read on 2026-10-11.
 *
 * YouTube channels are listed only when the studio's own website names or links
 * them, so each one is the rights holder's channel rather than a re-upload.
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
const YT_PREMIUM_SRC = src(YT_PREMIUM, "YouTube Help: Premium removes the ads shown before and during videos, so free viewing is ad-supported");
const YT_ADS = "Ad-supported: YouTube shows ads before and during videos unless you pay for YouTube Premium.";

const MX_FREE = "https://support.mxplayer.in/support/solutions/articles/43000788233-is-prime-membership-required-to-watch-mx-player-content-or-use-the-local-player-";
const MX_ACCOUNT = "https://support.mxplayer.in/support/solutions/articles/43000788237-i-have-never-registered-for-an-amazon-account-is-it-mandatory-to-sign-in-through-an-amazon-account-t";
const MX_ADS = "https://support.mxplayer.in/support/solutions/articles/43000608796-how-can-i-get-rid-of-advertisements-";

const PB_APPS = "https://prasarbharati.gov.in/get-apps/";
const WAVES_APPSTORE = "https://apps.apple.com/in/app/waves-pb/id6478751951";

const GG_DIGITAL = "https://www.greengold.tv/business-verticals/digital-media/";
const GG_HOME = "https://www.greengold.tv/";
const GG_FAST = "https://www.greengold.tv/news/green-gold-strikes-fast-gold-with-new-samsung-tv-plus-channel/";
const WOWKIDZ = "https://cosmos-maya.com/brands-wow-kidz/";
const SHEMAROO = "https://shemarooent.com/youtube";
const RAJSHRI = "https://rajshri.com/digital/";
const FREETV = "https://github.com/Free-TV/IPTV";

export const watchIndia1Resources: Resource[] = defineMediaList([
  {
    slug: "amazon-mx-player",
    name: "Amazon MX Player",
    shortDescription: "Amazon's ad-supported Indian streaming service: MX Originals, web series and films, free without Prime or an account.",
    longDescription:
      "Amazon MX Player is the free, ad-supported streaming side of MX Player, now part of Prime Video in India. Its help centre says MX Originals, Vdesi shows and movies remain free to watch with ads on the MX Player Android app and in the Prime Video app, that Prime is only needed for Prime Video's premium library, and that no Amazon account is required. Paid MX Gold and Prime plans reduce ads.",
    whyListed: "One of the largest free, licensed catalogues of Indian web series and films, with no subscription needed.",
    category: "tv-series",
    subcategories: ["movies"],
    resourceType: "SERVICE",
    officialUrl: "https://www.mxplayer.in/",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Ad-supported: the free version shows ads; MX Gold or Prime reduce or remove them.",
      "Prime Video's premium library needs a Prime membership; only MX Player content is free.",
      "On iOS and TVs the free content is watched in the Prime Video app, not a separate MX app.",
    ],
    tags: ["india", "web-series", "hindi", "avod", "originals"],
    alternativeTo: ["Netflix", "Amazon Prime Video", "JioHotstar"],
    media: {
      formats: ["web-series", "series", "film"],
      access: ["free_with_ads", "free_streaming"],
      offering: "selected-content",
      contentScope: "selected-works",
      provider: "Amazon (MX Player)",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["drama", "thriller", "comedy", "romance"],
      contentLanguages: ["hi", "multi"],
      region: {
        india: "available",
        availableIn: ["IN"],
        notes: "The help centre describes the service for 'our users in India' and as part of Prime Video in India. Other countries not checked.",
        sourceUrl: MX_ADS,
      },
    },
    research: {
      date: DATE,
      sources: [
        src(MX_FREE, "Help: Prime not required; MX Originals, Vdesi shows and movies free on the MX Player Android app and the Prime Video app"),
        src(MX_ACCOUNT, "Help: no Amazon account needed to access MX Player content"),
        src(MX_ADS, "Help: the free version is ad-supported; MX Local / MX Gold plans for users in India reduce ads"),
      ],
      checks: [
        ok("OFFICIAL_URL", MX_FREE, "support.mxplayer.in is MX Player's own help centre; it links the MX Player apps and Prime Video."),
        ok("FREE_STATUS", MX_FREE, "Prime is only required for Prime Video's premium library; MX Originals, Vdesi shows and movies stay free."),
        ok("ACCOUNT_REQUIREMENT", MX_ACCOUNT, "'No, you do not need to register for an Amazon account to access MX Player content.'"),
        ok("LIMITATIONS", MX_ADS, "'The free version of MX Player is ad-supported'; subscriptions and paid apps remove most ads."),
        ok("PLATFORM_AVAILABILITY", MX_FREE, "Free content is on the MX Player Android app and the Prime Video app on Android, iOS and TV."),
      ],
      notes: "Free model, account and ads read from MX Player's help centre. Which titles are free changes; payment details for the free part were not checked.",
    },
  },
  {
    slug: "waves-prasar-bharati",
    name: "WAVES (Prasar Bharati)",
    shortDescription: "Prasar Bharati's OTT app: Doordarshan and Akashvani archives, live TV and radio, films and shows, in many Indian languages.",
    longDescription:
      "WAVES is the streaming app of Prasar Bharati, India's public broadcaster (Doordarshan and Akashvani). Prasar Bharati's own apps page says it is available free on the app stores and lets you watch shows, the latest films, live TV and radio. The App Store listing, published by All India Radio, describes classics, animation, sports, podcasts and creator content, with the interface in English and nine more languages.",
    whyListed: "The official home of Doordarshan's archive and live channels — the most important legal free source of Indian-language TV.",
    category: "streaming",
    subcategories: ["tv-series", "movies"],
    resourceType: "MOBILE_APP",
    officialUrl: PB_APPS,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["ANDROID", "IOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Whether some content needs a paid plan, and how much advertising there is, was not stated on the official pages read; user reviews mention both.",
      "The app collects contact details such as phone number and email for account features, per its App Store privacy label.",
    ],
    tags: ["india", "doordarshan", "akashvani", "public-broadcaster", "regional"],
    media: {
      formats: ["live-tv", "series", "film", "radio", "animation"],
      access: ["free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Prasar Bharati (Doordarshan and Akashvani)",
      containsAds: "unknown",
      hasPaidFeatures: "unknown",
      genres: ["classics", "mythology", "news", "sports", "devotional"],
      contentLanguages: ["hi", "en", "bn", "ta", "te", "kn", "ml", "mr", "gu", "pa", "or", "ur"],
      region: {
        india: "available",
        availableIn: ["IN"],
        notes: "Published on the Indian App Store by All India Radio and listed on Prasar Bharati's own apps page.",
        sourceUrl: WAVES_APPSTORE,
      },
    },
    research: {
      date: DATE,
      sources: [
        src(PB_APPS, "Prasar Bharati 'Get Apps' page: WAVES available free on the app stores; watch shows, latest films, live TV/radio and more"),
        src(WAVES_APPSTORE, "App Store (India): WAVES PB by All India Radio, price Free, English + 9 languages, iPhone/iPad, privacy label"),
      ],
      checks: [
        ok("OFFICIAL_URL", PB_APPS, "prasarbharati.gov.in is the public broadcaster's own site; its apps page links the official WAVES apps."),
        ok("FREE_STATUS", PB_APPS, "The page says the WAVES app is available free and is for watching shows, films, live TV and radio."),
        ok("PLATFORM_AVAILABILITY", PB_APPS, "Download links are given for iOS and Android."),
      ],
      notes:
        "Free availability read on Prasar Bharati's own page. Paid plans and ads are reported in user reviews but are not stated on any official page read, so both are recorded as unknown.",
    },
  },
  {
    slug: "green-gold-tv-youtube",
    name: "Green Gold TV (Chhota Bheem)",
    shortDescription: "Green Gold Animation's official YouTube channel: Chhota Bheem, Mighty Little Bheem, Mighty Raju and Krishna cartoons.",
    longDescription:
      "Green Gold Animation of Hyderabad created Chhota Bheem, Mighty Little Bheem, Mighty Raju, Krishna and other Indian cartoons. Its website links its official YouTube channel, Green Gold TV, where the studio publishes episodes and films of its own shows. YouTube viewing is free with ads.",
    whyListed: "India's best-known kids' cartoon, published free by the studio that owns it rather than by re-uploaders.",
    category: "anime",
    subcategories: ["animation"],
    resourceType: "WEBSITE",
    officialUrl: "https://www.youtube.com/greengoldtv",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS, "The studio decides which episodes are on YouTube; full seasons are also licensed to TV and paid platforms."],
    tags: ["india", "kids", "chhota-bheem", "cartoons", "hindi"],
    media: {
      formats: ["animation", "series"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Green Gold Animation",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["kids", "adventure", "comedy", "mythology"],
      contentLanguages: ["hi", "en", "ta", "te"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [
        src(GG_DIGITAL, "Green Gold Digital Media page: links the official YouTube channel youtube.com/greengoldtv; distributes its shows on YouTube"),
        src(GG_HOME, "Green Gold homepage: creator of Chhota Bheem, Mighty Little Bheem, Mighty Raju, Krishna, Chorr Police and more"),
        YT_PREMIUM_SRC,
      ],
      checks: [
        ok("OFFICIAL_URL", GG_DIGITAL, "The studio's own Digital Media page links youtube.com/greengoldtv as its YouTube channel."),
        ok("FREE_STATUS", GG_DIGITAL, "The studio distributes its content through YouTube, where public videos are free to watch with ads."),
        ok("LIMITATIONS", YT_PREMIUM, "YouTube Help says ads before and during videos are removed only with paid YouTube Premium."),
      ],
      notes: "Channel ownership confirmed from the studio's website. Account, card and personal-use values follow from YouTube's public viewing; which episodes are published was not catalogued.",
    },
  },
  {
    slug: "green-gold-tv-samsung-fast",
    name: "Green Gold TV on Samsung TV Plus",
    shortDescription: "A 24/7 free Hindi kids' channel of Green Gold cartoons on Samsung TV Plus in India, with movie premieres at weekends.",
    longDescription:
      "Green Gold Animation launched Green Gold TV, a free ad-supported (FAST) channel on Samsung TV Plus, available across India in Hindi. It plays Mighty Raju, Super Bheem, Krishna Balram, Krishna, Chorr Police and Luv Kushh around the clock — about 70% episodes on weekdays and movie premieres at weekends — on Samsung TVs, without a subscription.",
    whyListed: "A lean-back, always-on channel of Indian cartoons for families with a Samsung TV.",
    category: "anime",
    subcategories: ["streaming"],
    resourceType: "SERVICE",
    officialUrl: GG_FAST,
    freeStatus: "FREE",
    openSource: false,
    platforms: [],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [
      "Ad-supported (a FAST channel).",
      "Only on Samsung devices with Samsung TV Plus; Samsung's own US support page says a Samsung account is needed on TVs.",
    ],
    tags: ["india", "kids", "fast", "samsung", "hindi"],
    relatedResources: ["samsung-tv-plus-fast", "green-gold-tv-youtube"],
    media: {
      formats: ["live-tv", "animation"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Green Gold Animation with Samsung TV Plus",
      containsAds: "yes",
      hasPaidFeatures: "no",
      genres: ["kids", "mythology", "adventure"],
      contentLanguages: ["hi"],
      region: {
        india: "available",
        availableIn: ["IN"],
        notes: "The announcement says the channel is available across India in Hindi.",
        sourceUrl: GG_FAST,
      },
    },
    research: {
      date: DATE,
      sources: [src(GG_FAST, "Green Gold news: Green Gold TV FAST channel on Samsung TV Plus, across India in Hindi, no subscriptions, logins or downloads; show list and schedule")],
      checks: [
        ok("OFFICIAL_URL", GG_FAST, "The announcement is on greengold.tv, the studio's own site."),
        ok("FREE_STATUS", GG_FAST, "It describes a free ad-supported streaming television channel 'without requiring subscriptions, logins or extra downloads'."),
        ok("LIMITATIONS", GG_FAST, "The channel is ad-supported and on Samsung TV Plus only, within its Kids category."),
      ],
      notes: "Read on the studio's announcement. Its 'no logins' line conflicts with Samsung's US note that TVs need a Samsung account, so the account requirement is left unknown.",
    },
  },
  {
    slug: "wow-kidz-motu-patlu",
    name: "Wow Kidz (Motu Patlu)",
    shortDescription: "Cosmos-Maya's official YouTube network for Motu Patlu, ViR: The Robot Boy and Chacha Bhatija, in 18 languages.",
    longDescription:
      "Wow Kidz is the YouTube brand of Cosmos-Maya, the studio behind Motu Patlu, ViR: The Robot Boy and Chacha Bhatija. The studio's page describes 38 channels with more than 1,000 half-hours, 10 shows and 30+ movies in 18 languages. Viewing on YouTube is free with ads.",
    whyListed: "Motu Patlu and other Indian cartoons from the studio that makes them, in many Indian languages.",
    category: "anime",
    subcategories: ["animation"],
    resourceType: "WEBSITE",
    officialUrl: WOWKIDZ,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS],
    tags: ["india", "kids", "motu-patlu", "cartoons", "hindi"],
    media: {
      formats: ["animation", "series", "film"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Cosmos-Maya",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["kids", "comedy", "adventure"],
      contentLanguages: ["hi", "multi"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [
        src(WOWKIDZ, "Cosmos-Maya Wow Kidz page: social media brand with 35-38 YouTube channels; Motu Patlu, ViR, Chacha Bhatija; 10 shows, 30+ movies, 18 languages"),
        YT_PREMIUM_SRC,
      ],
      checks: [
        ok("OFFICIAL_URL", WOWKIDZ, "The Wow Kidz page is on cosmos-maya.com, the studio's own site."),
        ok("FREE_STATUS", WOWKIDZ, "Wow Kidz publishes the studio's shows and movies on YouTube channels, which are free to watch."),
        ok("LIMITATIONS", YT_PREMIUM, "YouTube removes ads only with paid Premium, so free viewing is ad-supported."),
      ],
      notes: "Ownership and scale from the studio's page. The individual channel URLs are linked from that page but were not opened one by one.",
    },
  },
  {
    slug: "shemaroo-movies-youtube",
    name: "Shemaroo Movies (YouTube)",
    shortDescription: "Shemaroo's official YouTube movie channels: Bollywood, Gujarati, Marathi and Bengali films from its own library.",
    longDescription:
      "Shemaroo Entertainment, an Indian distributor since 1962, runs more than 50 YouTube channels. Its own site links them — Shemaroo, Shemaroo Movies, Shemaroo Comedy, Shemaroo Gujarati, Shemaroo MarathiBana and more — and describes a massive library across genres and languages. Viewing on YouTube is free with ads; its ShemarooMe app is a separate paid service.",
    whyListed: "Full Indian films published free by the company that holds their rights.",
    category: "movies",
    resourceType: "WEBSITE",
    officialUrl: "https://www.youtube.com/@shemaroomovies",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS, "Not every film in Shemaroo's catalogue is on YouTube; some channels show films in parts or as clips."],
    tags: ["india", "bollywood", "hindi-movies", "gujarati", "marathi"],
    media: {
      formats: ["film"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Shemaroo Entertainment",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["bollywood", "drama", "comedy", "action"],
      contentLanguages: ["hi", "gu", "mr", "bn"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [
        src(SHEMAROO, "Shemaroo YouTube page: 50+ YouTube channels, 15+ years on YouTube; links @shemaroomovies, Shemaroo Gujarati, MarathiBana and others"),
        YT_PREMIUM_SRC,
      ],
      checks: [
        ok("OFFICIAL_URL", SHEMAROO, "shemarooent.com, the company's own site, links youtube.com/@shemaroomovies as its Shemaroo Movies channel."),
        ok("FREE_STATUS", SHEMAROO, "The page presents the YouTube channels as Shemaroo's free 'on-the-go entertainment' with a massive library."),
        ok("LIMITATIONS", YT_PREMIUM, "Ads are shown on YouTube unless the viewer pays for Premium."),
      ],
      notes: "Channel ownership from Shemaroo's site. Which films are complete uploads was not catalogued.",
    },
  },
  {
    slug: "rajshri-youtube-channels",
    name: "Rajshri (YouTube channels)",
    shortDescription: "Rajshri Productions' official YouTube channels: Hindi, Telugu, Marathi and Bengali films, plus Rajshri Kids.",
    longDescription:
      "Rajshri, the studio behind Hum Aapke Hain Koun and Maine Pyar Kiya, lists its own YouTube channels: Rajshri (Bollywood movies, songs and scenes), Rajshri Telugu (thousands of Telugu films), Rajshri Marathi, Rajshri Bengali (classic Bengali films), Rajshri Kids (stories and rhymes in Hindi) and more. Viewing on YouTube is free with ads.",
    whyListed: "A family-film studio's own channels in four Indian languages, with a Hindi kids' channel alongside.",
    category: "movies",
    subcategories: ["anime"],
    resourceType: "WEBSITE",
    officialUrl: RAJSHRI,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    limitations: [YT_ADS, "Many uploads are songs, scenes and trailers rather than full films; check the video length."],
    tags: ["india", "bollywood", "telugu-movies", "bengali", "kids"],
    media: {
      formats: ["film", "animation"],
      access: ["free_with_ads", "free_streaming"],
      offering: "full-content",
      contentScope: "selected-works",
      provider: "Rajshri Entertainment",
      containsAds: "yes",
      hasPaidFeatures: "yes",
      genres: ["family", "bollywood", "classics", "kids"],
      contentLanguages: ["hi", "te", "mr", "bn"],
      region: { india: "unknown", availableIn: [] },
    },
    research: {
      date: DATE,
      sources: [
        src(RAJSHRI, "Rajshri Digital page: lists its YouTube channels — Rajshri, Rajshri Telugu ('thousands of new and classic Telugu films'), Marathi, Bengali, Kids"),
        YT_PREMIUM_SRC,
      ],
      checks: [
        ok("OFFICIAL_URL", RAJSHRI, "rajshri.com is the studio's own site; its Digital page lists the channels it runs."),
        ok("FREE_STATUS", RAJSHRI, "The flagship channel offers Bollywood movies, songs and scenes on YouTube, which is free to watch."),
        ok("LIMITATIONS", YT_PREMIUM, "YouTube shows ads unless the viewer pays for Premium."),
      ],
      notes: "Channels read from Rajshri's own site. The mix of full films versus clips was not catalogued.",
    },
  },
  {
    slug: "free-tv-iptv-playlist",
    name: "Free-TV IPTV playlist",
    shortDescription: "Community-kept GitHub playlist of TV channels that broadcasters provide free, for use in VLC or any IPTV player.",
    longDescription:
      "Free-TV/IPTV is an M3U playlist on GitHub listing TV channels from around the world that are officially free — over the air in their country, or on services such as Pluto TV, Samsung TV Plus and broadcasters' YouTube live streams. Its rules exclude paid channels, and contributors must show a channel is free before it is added; geo-blocked channels are marked. You open the playlist URL in a player such as VLC. It hosts no video itself.",
    whyListed: "The GitHub 'free TV' list whose rules actually require channels to be free and legal, unlike the larger scraped playlists.",
    category: "streaming",
    resourceType: "OTHER",
    officialUrl: FREETV,
    sourceUrl: FREETV,
    freeStatus: "FREE",
    openSource: false,
    licenseNotes: "The repository shows no licence file.",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Community-maintained: links break, and Everything.Free has not checked each channel's permission.",
      "Needs an IPTV-capable player (VLC, for example); it is a list of stream links, not an app.",
      "Some channels only work in their own country (marked as geo-blocked).",
    ],
    tags: ["iptv", "m3u", "live-tv", "github", "playlist"],
    relatedResources: ["vlc"],
    media: {
      formats: ["live-tv"],
      access: ["free_discovery"],
      offering: "discovery",
      contentScope: "information-only",
      provider: "Free-TV contributors on GitHub",
      containsAds: "unknown",
      hasPaidFeatures: "no",
      genres: ["news", "general"],
      contentLanguages: ["multi"],
      region: { india: "unknown", availableIn: [] },
      githubRepo: "Free-TV/IPTV",
    },
    research: {
      date: DATE,
      sources: [src(FREETV, "README: M3U playlist of free TV; only officially free channels, no paid channels; PR must show a channel is free; geo-blocked channels marked")],
      checks: [
        ok("OFFICIAL_URL", FREETV, "github.com/Free-TV/IPTV is the project's own repository and README."),
        ok("FREE_STATUS", FREETV, "The README's 'Only free channels' rule: no paid channels, only channels officially provided for free."),
        ok("ACCOUNT_REQUIREMENT", FREETV, "Use is pointing a player at the raw playlist URL; no sign-in is described."),
        ok("LIMITATIONS", FREETV, "Channels that only work in one country are marked geo-blocked; broken streams are moved to an Invalid list."),
      ],
      notes:
        "Rules read in the README. Listed as a discovery guide because it links to streams it does not host. iptv-org/iptv was evaluated and rejected: its Legal section admits links are only believed to be published by the rights holders.",
    },
  },
]);
