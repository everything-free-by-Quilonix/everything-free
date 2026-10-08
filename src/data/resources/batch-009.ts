import type { Platform } from "@/types/resource";
import { defineResources, type ResourceSeed } from "./define";

/**
 * Batch 009: Trending Viral Tools, Rare Hidden Web Gems & Legal Free Movies & Cinema.
 *
 * Expands Everything.Free into high-demand areas:
 * - Legal, 100% free movie and streaming platforms (Tubi, Pluto TV, Kanopy, Internet Archive Film, Plex Free, Documentary+, Popcornflix, JustWatch Free)
 * - Rare & viral hidden utilities (Cobalt media downloader, Vectorpea, Radio Garden, Pollinations.ai, Archive.today, Caesium)
 * - Leading open-source subscription killers (n8n, AFFiNE, Spotube, FreeTube)
 */
type BatchSeed = Omit<
  ResourceSeed,
  "requiresAccount" | "requiresCreditCard" | "commercialUse" | "personalUse" | "verificationStatus" | "compilationNotes" | "platforms"
> & {
  platforms?: Platform[];
  requiresAccount?: "yes" | "no" | "unknown";
  requiresCreditCard?: "yes" | "no" | "unknown";
  commercialUse?: "yes" | "no" | "unknown";
  personalUse?: "yes" | "no" | "unknown";
};

function seed(item: BatchSeed): ResourceSeed {
  return {
    ...item,
    platforms: item.platforms ?? ["BROWSER"],
    requiresAccount: item.requiresAccount ?? "unknown",
    requiresCreditCard: item.requiresCreditCard ?? "no",
    commercialUse: item.commercialUse ?? "unknown",
    personalUse: item.personalUse ?? "yes",
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Compiled from official vendor documentation, licence agreements, and terms of service. No maintainer verification pass has been recorded.",
  };
}

export const batch009Resources = defineResources([
  /* ------------------------------------------------------------- Legal Free Movies & Streaming */
  seed({
    slug: "tubi",
    name: "Tubi TV",
    shortDescription: "Stream over 50,000 on-demand movies and television shows with no subscription required.",
    longDescription:
      "Tubi is a fully licensed, 100% legal ad-supported streaming service offering a massive catalogue of over 50,000 films and TV series from major Hollywood studios including MGM, Paramount, Lionsgate, and Warner Bros. It requires no credit card and can be watched completely without an account.",
    whyListed:
      "The largest completely legal on-demand movie and TV library on the web that never requires payment info or mandatory signup.",
    category: "movies",
    subcategories: ["streaming"],
    resourceType: "SERVICE",
    officialUrl: "https://tubitv.com",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "50,000+ legal on-demand movies and TV series",
      "No payment info or credit card ever requested",
      "Available across browsers, mobile devices, and smart TVs",
      "Subtitles and multi-genre curated categories",
    ],
    tags: ["movies", "streaming", "films", "tv-shows", "avod"],
    alternativeTo: ["Netflix", "Hulu", "Amazon Prime Video"],
    relatedResources: ["jellyfin", "kodi"],
  }),

  seed({
    slug: "pluto-tv",
    name: "Pluto TV",
    shortDescription: "Free streaming television with hundreds of live themed channels and on-demand movies.",
    longDescription:
      "Pluto TV provides hundreds of live, curated television channels covering news, sports, entertainment, and classic television alongside an extensive on-demand library of films. Owned by Paramount, it operates with standard commercial breaks and zero subscription fees.",
    whyListed:
      "A legitimate, legal replacement for expensive cable and live streaming television with zero registration friction.",
    category: "streaming",
    subcategories: ["movies"],
    resourceType: "SERVICE",
    officialUrl: "https://pluto.tv",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "250+ curated live streaming channels",
      "On-demand movies and complete TV series seasons",
      "No login or registration required to start watching",
      "Full electronic programme guide (EPG)",
    ],
    tags: ["live-tv", "streaming", "movies", "television", "channels"],
    alternativeTo: ["Cable TV", "Sling TV", "YouTube TV"],
    relatedResources: ["kodi", "jellyfin"],
  }),

  seed({
    slug: "kanopy",
    name: "Kanopy",
    shortDescription: "Ad-free streaming of acclaimed indie films, world cinema, and Criterion classics with a library card.",
    longDescription:
      "Kanopy partners with public libraries and higher education institutions worldwide to provide cardholders with free, ad-free streaming access to indie cinema, festival hits, Criterion Collection masterpieces, Great Courses, and award-winning documentaries.",
    whyListed:
      "Provides ad-free access to high-culture, Criterion, and independent cinema paid for by public library and academic partnerships.",
    category: "movies",
    subcategories: ["learning"],
    resourceType: "SERVICE",
    officialUrl: "https://www.kanopy.com",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "yes",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "Completely ad-free streaming playback",
      "Criterion Collection, A24, and Sundance film selections",
      "Kanopy Kids section with parental controls",
      "Supported by participating local library cards and university logins",
    ],
    tags: ["cinema", "indie-film", "criterion", "documentaries", "library-perk"],
    alternativeTo: ["Criterion Channel", "MUBI", "CuriosityStream"],
    relatedResources: ["jellyfin"],
  }),

  seed({
    slug: "internet-archive-movies",
    name: "Internet Archive Feature Films",
    shortDescription: "Thousands of historical, noir, silent, and public-domain classic films available to stream or download.",
    longDescription:
      "The Internet Archive Moving Image Archive hosts tens of thousands of classic feature films, film noir titles, silent cinema, B-movies, vintage animation, and historical newsreels that have entered the public domain or are openly licensed for free streaming and archival download.",
    whyListed:
      "The premier non-profit digital repository for public domain and historical feature cinema with permanent download links.",
    category: "movies",
    subcategories: ["books", "learning"],
    resourceType: "WEBSITE",
    officialUrl: "https://archive.org/details/movies",
    freeStatus: "FREE",
    openSource: true,
    license: "Public Domain & Open Licences",
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Tens of thousands of full-length classic and public-domain movies",
      "Multiple format downloads (MPEG4, OGG, ProRes, torrent)",
      "Classic film noir, horror, sci-fi, and silent movie collections",
      "Zero paywalls, subscriptions, or DRM restrictions",
    ],
    downloadAvailable: true,
    tags: ["public-domain", "classic-cinema", "film-archive", "film-noir"],
    alternativeTo: ["Turner Classic Movies", "Criterion Channel"],
    relatedResources: ["kodi", "jellyfin"],
  }),

  seed({
    slug: "plex-free",
    name: "Plex Free Movies & Live TV",
    shortDescription: "Free ad-supported streaming hub featuring over 50,000 on-demand titles and 300+ live TV channels.",
    longDescription:
      "Plex offers a free, legal on-demand streaming hub and live television service independent of its media server product. Users can watch thousands of studio-licensed movies and browse over 300 live TV channels on any connected device without a subscription.",
    whyListed:
      "Delivers high-quality AVOD streaming and live TV directly into browser and TV clients without requiring a media server setup.",
    category: "streaming",
    subcategories: ["movies"],
    resourceType: "SERVICE",
    officialUrl: "https://www.plex.tv/watch-free",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS", "WINDOWS", "MACOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "50,000+ on-demand movies and TV episodes",
      "300+ free live television streaming channels",
      "Universal watchlist syncing across all streaming services",
      "Available across web, mobile, smart TVs, and streaming sticks",
    ],
    tags: ["movies", "streaming", "live-tv", "films"],
    alternativeTo: ["Netflix", "Roku Channel", "Pluto TV"],
    relatedResources: ["jellyfin", "kodi"],
  }),

  seed({
    slug: "documentary-plus",
    name: "Documentary+",
    shortDescription: "Curated streaming platform for Oscar-winning, festival, and celebrated feature documentary films.",
    longDescription:
      "Documentary+ is a free global streaming service dedicated to nonfiction cinema. It features a curated library of feature documentaries and shorts directed by celebrated filmmakers, covering culture, politics, sports, music, and science.",
    whyListed:
      "A dedicated, premium-quality documentary channel streaming festival and award-winning nonfiction cinema for zero cost.",
    category: "movies",
    subcategories: ["learning", "streaming"],
    resourceType: "SERVICE",
    officialUrl: "https://www.docplus.com",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "Curated catalogue of festival and award-winning documentaries",
      "Feature-length films and acclaimed documentary shorts",
      "Categorized by biography, music, sports, politics, and science",
      "Clean web and mobile viewing with no subscription barrier",
    ],
    tags: ["documentaries", "nonfiction", "indie-film", "movies"],
    alternativeTo: ["CuriosityStream", "Docsville", "Netflix Documentary"],
    relatedResources: ["jellyfin"],
  }),

  seed({
    slug: "popcornflix",
    name: "Popcornflix",
    shortDescription: "Free on-demand streaming movies and vintage series with instant playback and zero account requirements.",
    longDescription:
      "Popcornflix is a free ad-supported streaming video service offering full-length movies, cult cinema, foreign films, and vintage TV series. It provides instant playback on web browsers, mobile apps, and connected televisions without credit cards or account creation.",
    whyListed:
      "Provides legal, immediate access to thousands of cult and indie feature movies with zero sign-in friction.",
    category: "movies",
    subcategories: ["streaming"],
    resourceType: "SERVICE",
    officialUrl: "https://popcornflix.com",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "Thousands of full-length films and TV series",
      "Cult classics, action movies, and foreign films",
      "Zero registration or payment required",
      "Available on web, mobile, and smart TVs",
    ],
    tags: ["movies", "streaming", "films", "cult-cinema"],
    alternativeTo: ["Netflix", "Hulu", "Amazon Prime Video"],
    relatedResources: ["tubi", "pluto-tv"],
  }),

  seed({
    slug: "justwatch",
    name: "JustWatch Free Filter",
    shortDescription: "Streaming search engine with dedicated filters showing which movies and shows are free to stream legally.",
    longDescription:
      "JustWatch indexes virtually all movies and TV shows across global streaming providers. Its dedicated Free and Ad-supported filters allow viewers to immediately discover what is legally watchable for zero dollars across services like Tubi, Pluto TV, Freevee, and library platforms.",
    whyListed:
      "Solves the fragmentation problem by identifying exactly where any movie or show is currently streaming 100% free.",
    category: "movies",
    subcategories: ["utilities", "everyday"],
    resourceType: "WEB_APP",
    officialUrl: "https://www.justwatch.com",
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "Aggregated search across hundreds of streaming services",
      "One-click 'Free' and 'Ads' price filters for legal streaming",
      "Watchlist tracking with price drop and new release alerts",
      "Country-specific streaming availability matching",
    ],
    limitations: [
      "Advanced filtering features and pro analytics require JustWatch Pro subscription.",
    ],
    tags: ["streaming-guide", "movie-search", "legal-streaming", "films"],
    alternativeTo: ["Reelgood", "Letterboxd Pro"],
    relatedResources: ["tubi", "pluto-tv"],
  }),

  /* ------------------------------------------------------------- Viral Catchy Tools & Rare Hidden Web Gems */
  seed({
    slug: "cobalt",
    name: "Cobalt",
    shortDescription: "Fast, ad-free, and tracker-free open-source media downloader for video and audio sharing platforms.",
    longDescription:
      "Cobalt is a minimalist, privacy-focused web downloader for saving video, audio, and stills from platforms like YouTube, TikTok, Instagram, Twitter/X, Reddit, Bilibili, and SoundCloud. Unlike predatory download sites, Cobalt has zero ads, zero trackers, and no malware.",
    whyListed:
      "Completely replaces shady, ad-bloated media ripping sites with a clean, transparent, open-source AGPL engine.",
    category: "utilities",
    subcategories: ["video", "audio"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://cobalt.tools",
    sourceUrl: "https://github.com/wukko/cobalt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0",
    platforms: ["BROWSER", "SELF_HOSTED"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Zero third-party advertisements, tracking pixels, or popups",
      "Supports YouTube, TikTok, Twitter/X, Instagram, SoundCloud, and Reddit",
      "Custom audio extraction, codec selection, and quality options",
      "Self-hostable via Docker with simple public API endpoints",
    ],
    downloadAvailable: true,
    apiAvailable: true,
    tags: ["media-downloader", "video-saver", "audio-extractor", "privacy-tool"],
    alternativeTo: ["4K Video Downloader", "Y2Mate", "SaveFrom"],
    relatedResources: ["vlc", "obs-studio"],
  }),

  seed({
    slug: "vectorpea",
    name: "Vectorpea",
    shortDescription: "Free in-browser vector graphics editor for opening, editing, and exporting SVG, AI, PDF, and EPS files.",
    longDescription:
      "Built by Ivan Kutskir (creator of Photopea), Vectorpea is a complete browser-based vector design suite capable of opening and editing Adobe Illustrator (.AI), SVG, PDF, and EPS vector illustrations. It requires zero installs, runs on any OS, and keeps graphics editable locally.",
    whyListed:
      "Solves the lack of free Adobe Illustrator file compatibility directly in the browser with full vector path editing.",
    category: "design",
    subcategories: ["everyday", "developer-utilities"],
    resourceType: "WEB_APP",
    officialUrl: "https://www.vectorpea.com",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Native opening and saving of Adobe Illustrator (.AI) files",
      "Comprehensive SVG, PDF, EPS, and DXF vector support",
      "Pen tool, boolean shapes, typography curves, and layer groups",
      "Runs entirely client-side without file uploads to central servers",
    ],
    tags: ["vector-editor", "illustrator-alternative", "svg", "design-tool"],
    alternativeTo: ["Adobe Illustrator", "CorelDRAW", "Affinity Designer"],
    relatedResources: ["photopea", "inkscape", "penpot"],
  }),

  seed({
    slug: "archive-today",
    name: "Archive.today",
    shortDescription: "Permanent webpage archiver creating clean, unpaywalled, and tamper-resistant web page snapshots.",
    longDescription:
      "Archive.today is a public web archiving service that saves permanent, unalterable text and graphical snapshots of web pages as they appear at a specific moment. It captures dynamic DOM states and provides short, durable links for citations and research.",
    whyListed:
      "A fast, independent public web preservation tool that captures unbloated, permanent historical snapshots of the web.",
    category: "utilities",
    subcategories: ["research", "personal"],
    resourceType: "WEBSITE",
    officialUrl: "https://archive.today",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Permanent textual and screenshot captures of web pages",
      "Bypasses script-heavy degradation and paywall popups",
      "Generates short, durable archive URLs for citations",
      "Zero account creation or payment barrier",
    ],
    tags: ["web-archive", "snapshots", "citation", "research-tool"],
    alternativeTo: ["Wayback Machine", "Pocket"],
    relatedResources: ["internet-archive-movies"],
  }),

  seed({
    slug: "radio-garden",
    name: "Radio Garden",
    shortDescription: "Explore thousands of live local radio stations worldwide by spinning an interactive 3D globe.",
    longDescription:
      "Radio Garden allows users to explore live broadcast radio from all over the world by rotating a 3D Earth globe. Clicking on any green dot instantly streams a local community, commercial, or public radio station broadcast live from that town or city.",
    whyListed:
      "An innovative, hypnotic discovery experience connecting global cultures and live music without accounts or subscription fees.",
    category: "music",
    subcategories: ["streaming", "travel"],
    resourceType: "WEB_APP",
    officialUrl: "https://radio.garden",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "Interactive 3D globe navigation across all continents and islands",
      "Thousands of live local AM and FM radio station feeds",
      "Search by city, country, or musical genre",
      "Bookmark favorite global stations for instant access",
    ],
    tags: ["radio", "live-audio", "globe", "world-music", "broadcasting"],
    alternativeTo: ["TuneIn Premium", "SiriusXM", "iHeartRadio"],
    relatedResources: ["spotube", "audacity"],
  }),

  seed({
    slug: "caesium",
    name: "Caesium Image Compressor",
    shortDescription: "High-ratio open-source batch image compressor that reduces file sizes by up to 90% without quality loss.",
    longDescription:
      "Caesium is an open-source image compression tool available for desktop and browser that helps photographers and web creators reduce photo sizes while keeping original visual fidelity. It supports batch processing for JPEG, PNG, and WebP images locally on your machine.",
    whyListed:
      "Replaces paid online compression tools with an unlimited, fast, and completely open-source batch processor.",
    category: "utilities",
    subcategories: ["photography", "design"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://saerasoft.com/caesium",
    sourceUrl: "https://github.com/Lymphatus/caesium-image-compressor",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    platforms: ["WINDOWS", "MACOS", "LINUX", "BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Reduces image file size by up to 90% with minimal perceptual loss",
      "Batch processing for thousands of pictures at once",
      "Side-by-side interactive preview with zoom comparison",
      "Metadata and EXIF preservation toggle",
    ],
    downloadAvailable: true,
    tags: ["image-compressor", "batch-photo", "tinypng-alternative", "optimization"],
    alternativeTo: ["TinyPNG Pro", "Kraken.io", "JPEGmini"],
    relatedResources: ["photopea", "gimp"],
  }),

  seed({
    slug: "pollinations-ai",
    name: "Pollinations.ai",
    shortDescription: "Free, open-source generative AI platform for creating images and text without signups or API keys.",
    longDescription:
      "Pollinations.ai is an open-source creative generative AI platform that provides free, fast text-to-image and conversational model generation with zero login friction. It offers open URL-based generation APIs and an interactive prompt interface powered by open-source models.",
    whyListed:
      "Eliminates subscription barriers and paywalls for generative AI by offering direct, keyless text-to-image generation.",
    category: "ai-chat",
    subcategories: ["design", "ai-models"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://pollinations.ai",
    sourceUrl: "https://github.com/pollinations/pollinations",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Keyless URL-based image generation API",
      "Zero signup or credit card requirement for web generator",
      "Supports multiple open image diffusion and LLM architectures",
      "Fully open-source community-supported infrastructure",
    ],
    apiAvailable: true,
    tags: ["generative-ai", "text-to-image", "ai-creative", "open-ai"],
    alternativeTo: ["Midjourney", "DALL-E 3", "RunwayML"],
    relatedResources: ["deepseek", "mistral-le-chat"],
  }),

  /* ------------------------------------------------------------- Trending Open-Source Subscription Killers */
  seed({
    slug: "freetube",
    name: "FreeTube",
    shortDescription: "Open-source desktop YouTube player built around privacy, ad-blocking, and distraction-free viewing.",
    longDescription:
      "FreeTube is an open-source desktop YouTube player designed for privacy. It lets you watch videos without advertisements and prevents Google from tracking your views using cookies and JavaScript. You can subscribe to channels and save playlists completely locally without a Google account.",
    whyListed:
      "A complete privacy-first YouTube desktop client with zero ads, local subscriptions, and sponsor blocking integration.",
    category: "utilities",
    subcategories: ["video", "streaming"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://freetubeapp.io",
    sourceUrl: "https://github.com/FreeTubeApp/FreeTube",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "Watch videos without banner or in-stream advertisements",
      "Local subscriptions and history with zero Google account tracking",
      "Built-in SponsorBlock integration to skip paid promotions",
      "Import and export subscriptions to standard OPML format",
    ],
    downloadAvailable: true,
    tags: ["youtube-client", "privacy-player", "adblock", "desktop-video"],
    alternativeTo: ["YouTube Premium"],
    relatedResources: ["vlc", "cobalt"],
  }),

  seed({
    slug: "n8n",
    name: "n8n",
    shortDescription: "Self-hostable workflow automation and AI agent orchestration platform with 400+ native integrations.",
    longDescription:
      "n8n is a fair-code, self-hostable workflow automation platform that lets teams connect hundreds of apps and design complex multi-step automations without paying per-task fees. It natively supports AI agents, custom JavaScript/Python execution, and webhook triggers.",
    whyListed:
      "Delivers enterprise-grade workflow and AI automation without the crippling task execution costs of proprietary SaaS.",
    category: "ai-automation",
    subcategories: ["developer-utilities", "productivity"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://n8n.io",
    sourceUrl: "https://github.com/n8n-io/n8n",
    freeStatus: "FREE",
    openSource: true,
    license: "Sustainable Use License",
    platforms: ["SELF_HOSTED", "BROWSER"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "400+ pre-built integrations for CRM, databases, messaging, and cloud",
      "Native AI agent nodes and LangChain integration",
      "Unlimited workflow executions on self-hosted instances",
      "Visual drag-and-drop workflow canvas with custom code nodes",
    ],
    tags: ["automation", "workflows", "integration", "ai-agents", "zapier-alternative"],
    alternativeTo: ["Zapier", "Make", "Workato"],
    relatedResources: ["supabase"],
  }),

  seed({
    slug: "anytype",
    name: "Anytype",
    shortDescription: "Local-first, encrypted, and peer-to-peer open-source workspace built as a private Notion alternative.",
    longDescription:
      "Anytype is a decentralized, local-first operating environment for notes, documents, tasks, and knowledge graphs. Built on an encrypted peer-to-peer sync protocol, all data remains stored on your local devices without central cloud tracking or corporate subscription lock-in.",
    whyListed:
      "A beautifully engineered, cryptographic alternative to Notion that guarantees complete data ownership and offline privacy.",
    category: "productivity",
    subcategories: ["documents", "personal"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://anytype.io",
    sourceUrl: "https://github.com/anyproto/anytype-ts",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Any Source Available License",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    features: [
      "End-to-end encrypted peer-to-peer synchronization",
      "Local-first document, graph view, and database object model",
      "Works 100% offline with zero remote telemetry",
      "Cross-platform desktop and mobile native clients",
    ],
    downloadAvailable: true,
    tags: ["workspace", "notes", "p2p", "local-first", "encrypted-notes"],
    alternativeTo: ["Notion", "Obsidian Sync", "Evernote"],
    relatedResources: ["obsidian", "libreoffice"],
  }),

  seed({
    slug: "spotube",
    name: "Spotube",
    shortDescription: "Open-source music client using Spotify metadata with YouTube playback for ad-free listening.",
    longDescription:
      "Spotube is an open-source cross-platform music streaming client that combines Spotify's data APIs with YouTube or Piped audio streams. It enables playback of playlists and tracks without advertisements, tracking, or a Spotify Premium subscription.",
    whyListed:
      "Offers an ad-free desktop and mobile listening experience with zero premium fees or battery-draining telemetry.",
    category: "music",
    subcategories: ["audio", "streaming"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://spotube.krtirtho.dev",
    sourceUrl: "https://github.com/KRTirtho/spotube",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "BSD-4-Clause",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "no",
    personalUse: "yes",
    features: [
      "Ad-free music streaming without premium subscription requirements",
      "Lightweight native interface with zero telemetry or tracking",
      "Synchronized time-stamped lyrics display",
      "Download tracks for offline playback",
    ],
    downloadAvailable: true,
    tags: ["music-player", "ad-free-music", "streaming-client", "offline-audio"],
    alternativeTo: ["Spotify Premium", "Apple Music", "YouTube Music Premium"],
    relatedResources: ["audacity", "radio-garden"],
  }),
]);
