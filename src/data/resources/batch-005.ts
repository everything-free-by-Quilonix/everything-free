import type { Platform } from "@/types/resource";
import { defineResources, type ResourceSeed } from "./define";

/**
 * Batch 005: Quality-First Global Gap Fill, Freshness & Long-Tail Discovery.
 * Focuses on:
 * - Professional Long-Tail Engineering (Chemical, Civil, SPICE, Whole-Building Physics, Wind, Hydraulics)
 * - Underrepresented Categories (Spreadsheets, Presentations, Weather, Personal Finance, Travel, Shopping, Everyday, Lifestyle, HR, Templates, Wallpapers)
 * - Creator & Publishing Long-Tail (Ebook EPUB Editing, Tablature, 3D PBR Texturing, Base-Mesh Modeling, Batch Audio Transcoding)
 * - Accessibility & Assistive Tech (Contrast Analysis, Text-to-Speech, Gaze/Gesture Entry)
 * - Open Knowledge, Digital Archives & Public Datasets (DOAB, SciELO, CiNii, CORE, HAL, AJOL, Persée, Global Fishing Watch, EMSC)
 * - Regional & Indian Long-Tail (Mandi Commodity Feeds, National Agriculture Market, Vidwan Scholar Registry, Karnataka Open Data, CSIR-NIScPR, Malayalam Lexicon, Muktabodha Sanskrit Manuscripts, IASc Open Access)
 * - Developer Tooling, Testing & Local AI (Load Testing, Mock Servers, Rust API Clients, PostgreSQL GraphQL, Offline LLM Runners, IDE AI Pair Programming)
 */
type BatchSeed = Omit<
  ResourceSeed,
  "requiresAccount" | "requiresCreditCard" | "commercialUse" | "personalUse" | "verificationStatus" | "compilationNotes" | "platforms"
> & {
  platforms?: Platform[];
};

function unverified(seed: BatchSeed): ResourceSeed {
  return {
    ...seed,
    platforms: seed.platforms ?? ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Compiled from project documentation, portal entries, and provider pricing terms. No verification pass has been recorded.",
  };
}

const batch005Seeds: ResourceSeed[] = [
  unverified({
    "slug": "gnumeric",
    "name": "Gnumeric",
    "shortDescription": "Lightweight, high-precision spreadsheet application with comprehensive statistical analysis tools.",
    "longDescription": "Gnumeric is an open-source spreadsheet program developed as part of the GNOME desktop environment. It focuses on computational accuracy, support for advanced financial and statistical functions, and fast handling of large datasets without heavy memory overhead.",
    "whyListed": "Provides research-grade numerical precision and extensive mathematical and statistical functions in a lightweight desktop application.",
    "category": "spreadsheets",
    "subcategories": [
        "mathematics",
        "productivity"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://www.gnumeric.org",
    "sourceUrl": "https://gitlab.gnome.org/GNOME/gnumeric",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "LINUX",
        "WINDOWS"
    ],
    "downloadAvailable": true,
    "features": [
        "High mathematical precision",
        "650+ built-in spreadsheet functions",
        "Statistical analysis suite",
        "Extensible plugin architecture",
        "Fast XML file format support"
    ],
    "tags": [
        "spreadsheet",
        "statistics",
        "data-analysis",
        "gnome",
        "desktop-calc"
    ],
    "alternativeTo": [
        "Microsoft Excel"
    ],
    "relatedResources": [
        "libreoffice",
        "r-project"
    ]
}),

  unverified({
    "slug": "rows",
    "name": "Rows",
    "shortDescription": "Modern collaborative spreadsheet with built-in API integrations, enrichment tools, and sharing.",
    "longDescription": "Rows is a modern web spreadsheet that combines traditional grid computations with built-in integrations for web APIs, market data, and business tools. It enables users to build interactive forms, dashboards, and automated workflows directly inside spreadsheet cells.",
    "whyListed": "Modernizes spreadsheets with native API connectors and publishing tools on a generous free tier for individuals and small teams.",
    "category": "spreadsheets",
    "subcategories": [
        "collaboration",
        "business-finance"
    ],
    "resourceType": "WEB_APP",
    "officialUrl": "https://rows.com",
    "pricingUrl": "https://rows.com/pricing",
    "freeStatus": "FREE_TIER",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "limitations": [
        "Free plan limited to up to 10 members, 50 integration tasks per month, and standard execution limits"
    ],
    "features": [
        "Built-in API integrations",
        "Data enrichment features",
        "Interactive web embed sharing",
        "AI spreadsheet assistant",
        "Automated scheduling"
    ],
    "tags": [
        "spreadsheet",
        "api-integrations",
        "data-enrichment",
        "collaboration",
        "workspace"
    ],
    "alternativeTo": [
        "Airtable",
        "Microsoft Excel"
    ],
    "relatedResources": [
        "baserow",
        "nocodb"
    ]
}),

  unverified({
    "slug": "marp",
    "name": "Marp",
    "shortDescription": "Markdown presentation ecosystem that converts simple Markdown documents into polished slide decks.",
    "longDescription": "Marp (Markdown Presentation Ecosystem) allows writers and developers to create slide presentations using standard Markdown syntax. With support for custom CSS themes, math typesetting via KaTeX, and export to PDF, PPTX, and HTML, it streamlines technical slide authoring.",
    "whyListed": "Enables fast, version-controlled slide deck creation directly from Markdown files without manual layout formatting.",
    "category": "presentations",
    "subcategories": [
        "documents",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://marp.app",
    "sourceUrl": "https://github.com/marp-team/marp",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Markdown-to-slides conversion",
        "VS Code extension support",
        "PDF, PPTX, and HTML export",
        "Custom CSS theming",
        "KaTeX mathematical typesetting"
    ],
    "tags": [
        "markdown",
        "presentations",
        "slides",
        "developer-tools",
        "cli"
    ],
    "alternativeTo": [
        "Microsoft PowerPoint",
        "Google Slides"
    ],
    "relatedResources": [
        "slidev",
        "obsidian"
    ]
}),

  unverified({
    "slug": "slidev",
    "name": "Slidev",
    "shortDescription": "Presentation slides maker for developers powered by Vite, Vue 3, and Markdown.",
    "longDescription": "Slidev is an open-source presentation tool designed for developers. It combines Markdown content with interactive Vue components, live code runners, syntax highlighting, LaTeX formulas, and recording capabilities in a local web application.",
    "whyListed": "Brings modern web interactivity, live code snippets, and component rendering into technical presentations.",
    "category": "presentations",
    "subcategories": [
        "developer-utilities",
        "learning"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://sli.dev",
    "sourceUrl": "https://github.com/slidevjs/slidev",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Vite-powered instant HMR",
        "Interactive Vue components in slides",
        "Built-in Monaco code editor",
        "Presenter mode with notes",
        "Export to PDF and SPA"
    ],
    "tags": [
        "slides",
        "developer-presentations",
        "vue",
        "vite",
        "markdown"
    ],
    "alternativeTo": [
        "Keynote",
        "Microsoft PowerPoint"
    ],
    "relatedResources": [
        "marp",
        "obsidian"
    ]
}),

  unverified({
    "slug": "sozi",
    "name": "Sozi",
    "shortDescription": "Open-source zoomable presentation editor based on SVG standards and web browsers.",
    "longDescription": "Sozi is a presentation tool that creates non-linear, zooming presentations based on SVG vector graphics. Instead of traditional sequential slides, presentations are organized as a large visual canvas with animated transitions, pans, and rotations displayed in web browsers.",
    "whyListed": "Provides a non-linear, vector-based presentation format using standard open SVG graphics without vendor lock-in.",
    "category": "presentations",
    "subcategories": [
        "design",
        "three-d"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://sozi.baierouge.fr",
    "sourceUrl": "https://github.com/sozi-projects/Sozi",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Zooming canvas presentations",
        "SVG standard compliance",
        "HTML5 standalone export",
        "Non-linear navigation",
        "Custom transition timing"
    ],
    "tags": [
        "presentations",
        "svg",
        "vector-graphics",
        "visual-canvas",
        "zooming-slides"
    ],
    "alternativeTo": [
        "Prezi"
    ],
    "relatedResources": [
        "inkscape",
        "marp"
    ]
}),

  unverified({
    "slug": "open-meteo",
    "name": "Open-Meteo",
    "shortDescription": "Open-source weather API providing high-resolution global forecasts and historical climate data.",
    "longDescription": "Open-Meteo is an open-source weather forecasting API that aggregates meteorological data from national weather services like NOAA, DWD, ECMWF, and JMA. It provides hourly forecasts, solar radiation metrics, marine models, and historical climate archives without mandatory API keys for non-commercial use.",
    "whyListed": "Delivers open meteorological and climate datasets with clear licensing and easy developer integration.",
    "category": "weather",
    "subcategories": [
        "apis",
        "research"
    ],
    "resourceType": "API",
    "officialUrl": "https://open-meteo.com",
    "sourceUrl": "https://github.com/open-meteo/open-meteo",
    "freeStatus": "FREE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "BROWSER"
    ],
    "apiAvailable": true,
    "features": [
        "Global hourly weather forecasts",
        "Historical weather archive from 1940",
        "Solar and air quality models",
        "Marine and wave forecasts",
        "JSON API with zero setup"
    ],
    "tags": [
        "weather-api",
        "meteorology",
        "forecast",
        "climate-data",
        "historical-weather"
    ],
    "alternativeTo": [
        "OpenWeatherMap",
        "AccuWeather API"
    ],
    "relatedResources": [
        "breezy-weather",
        "windy"
    ]
}),

  unverified({
    "slug": "breezy-weather",
    "name": "Breezy Weather",
    "shortDescription": "Clean, modern, open-source weather application for Android with multiple source providers.",
    "longDescription": "Breezy Weather is an open-source Android weather application built with modern Material Design principles. It aggregates forecasts from Open-Meteo, MET Norway, and other open meteorological services, offering detailed hourly graphs, precipitation radar, and customizable widgets without ads or trackers.",
    "whyListed": "Provides a privacy-respecting, tracker-free mobile weather experience with comprehensive meteorological visualizations.",
    "category": "weather",
    "subcategories": [
        "utilities",
        "lifestyle"
    ],
    "resourceType": "MOBILE_APP",
    "officialUrl": "https://github.com/breezy-weather/breezy-weather",
    "sourceUrl": "https://github.com/breezy-weather/breezy-weather",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "ANDROID"
    ],
    "downloadAvailable": true,
    "features": [
        "Multiple weather data sources",
        "Hourly forecast graphs",
        "Severe weather alerts",
        "Home screen widgets",
        "Material You dynamic theming"
    ],
    "tags": [
        "weather-app",
        "android",
        "material-design",
        "forecast",
        "privacy"
    ],
    "alternativeTo": [
        "AccuWeather",
        "The Weather Channel App"
    ],
    "relatedResources": [
        "open-meteo",
        "windy"
    ]
}),

  unverified({
    "slug": "windy",
    "name": "Windy",
    "shortDescription": "Interactive global meteorological visualization platform with real-time weather models.",
    "longDescription": "Windy is an advanced weather visualization service that renders global meteorological data on interactive animated maps. It displays wind patterns, wave swells, satellite radar, pressure systems, and temperature forecasts using ECMWF, GFS, and ICON numerical prediction models.",
    "whyListed": "Offers professional-grade meteorological radar, wind stream animations, and multi-model comparisons for free.",
    "category": "weather",
    "subcategories": [
        "maps",
        "science"
    ],
    "resourceType": "WEB_APP",
    "officialUrl": "https://www.windy.com",
    "pricingUrl": "https://www.windy.com/subscription",
    "freeStatus": "FREE_TIER",
    "openSource": false,
    "platforms": [
        "BROWSER",
        "ANDROID",
        "IOS"
    ],
    "limitations": [
        "Standard 3-hour forecast updates and model resolution; 1-hour updates and premium high-resolution layers require paid subscription"
    ],
    "features": [
        "Interactive animated wind particles",
        "Multi-model comparisons (ECMWF, GFS, ICON)",
        "Satellite and weather radar layers",
        "Airport METAR and TAF reports",
        "Hurricane and typhoon tracking"
    ],
    "tags": [
        "weather",
        "meteorology",
        "wind-forecast",
        "interactive-maps",
        "radar"
    ],
    "alternativeTo": [
        "Ventusky",
        "Weather Underground"
    ],
    "relatedResources": [
        "open-meteo",
        "breezy-weather"
    ]
}),

  unverified({
    "slug": "firefly-iii",
    "name": "Firefly III",
    "shortDescription": "Free and open-source self-hosted personal finance and double-entry budgeting manager.",
    "longDescription": "Firefly III is a self-hosted personal finance manager that uses double-entry bookkeeping principles. It allows users to track expenses, manage multiple bank accounts, set up automated transaction rules, manage budgets, and generate detailed financial reports in complete privacy.",
    "whyListed": "Empowers individuals to manage their complete financial lives with double-entry accounting on self-hosted infrastructure.",
    "category": "personal-finance",
    "subcategories": [
        "personal",
        "productivity"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.firefly-iii.org",
    "sourceUrl": "https://github.com/firefly-iii/firefly-iii",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Double-entry bookkeeping engine",
        "Budgeting and goal tracking",
        "Rule-based transaction automation",
        "Multi-currency and crypto support",
        "Comprehensive financial reports and charts"
    ],
    "tags": [
        "budgeting",
        "personal-finance",
        "self-hosted",
        "double-entry",
        "expense-tracker"
    ],
    "alternativeTo": [
        "YNAB",
        "Mint",
        "Monarch Money"
    ],
    "relatedResources": [
        "actual-budget",
        "paisa",
        "kresus"
    ]
}),

  unverified({
    "slug": "actual-budget",
    "name": "Actual Budget",
    "shortDescription": "Privacy-focused, local-first envelope budgeting application with optional encrypted sync.",
    "longDescription": "Actual Budget is an open-source, local-first personal finance application that implements zero-based envelope budgeting. Built with SQLite and web technologies, it works offline, encrypts synced data end-to-end, and provides fast, responsive budget management across desktop and mobile browsers.",
    "whyListed": "Provides a zero-based envelope budgeting workflow that is completely local-first and privacy-respecting.",
    "category": "personal-finance",
    "subcategories": [
        "productivity",
        "personal"
    ],
    "resourceType": "WEB_APP",
    "officialUrl": "https://actualbudget.org",
    "sourceUrl": "https://github.com/actualbudget/actual",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER",
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Zero-based envelope budgeting",
        "Local-first SQLite storage",
        "End-to-end encrypted synchronization",
        "Custom reporting and charts",
        "Automated bank transaction import"
    ],
    "tags": [
        "budgeting",
        "envelope-budget",
        "local-first",
        "finance",
        "privacy"
    ],
    "alternativeTo": [
        "YNAB",
        "EveryDollar"
    ],
    "relatedResources": [
        "firefly-iii",
        "paisa",
        "moneywallet"
    ]
}),

  unverified({
    "slug": "paisa",
    "name": "Paisa",
    "shortDescription": "Local-first personal finance and investment tracking application powered by plain text accounting.",
    "longDescription": "Paisa is a privacy-first personal finance management tool that builds a modern visual interface on top of Ledger and Beancount plain text accounting files. It offers portfolio valuation, expense analytics, multi-account tracking, and recurring transaction management completely offline.",
    "whyListed": "Brings modern graphical dashboards and investment analytics to plain text accounting without compromising user privacy.",
    "category": "personal-finance",
    "subcategories": [
        "productivity",
        "personal"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://paisa.fyi",
    "sourceUrl": "https://github.com/ananthakumaran/paisa",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Plain text accounting integration (Ledger/Beancount)",
        "Net worth and investment tracking",
        "Monthly budgeting and breakdown",
        "Completely offline and local",
        "Fast search and categorization"
    ],
    "tags": [
        "plain-text-accounting",
        "personal-finance",
        "ledger",
        "beancount",
        "investment-tracker"
    ],
    "alternativeTo": [
        "Quicken",
        "Personal Capital"
    ],
    "relatedResources": [
        "actual-budget",
        "firefly-iii",
        "gnumeric"
    ]
}),

  unverified({
    "slug": "moneywallet",
    "name": "MoneyWallet",
    "shortDescription": "Open-source expense and income tracker for Android and Linux with multi-currency support.",
    "longDescription": "MoneyWallet is a simple, open-source personal finance manager designed for mobile and desktop environments. It allows users to manage multiple wallets, track daily expenses and income, handle multi-currency conversions, and view spending statistics without advertisements or remote trackers.",
    "whyListed": "Offers a straightforward, offline-capable mobile expense tracker with multi-currency support and zero telemetry.",
    "category": "personal-finance",
    "subcategories": [
        "utilities",
        "personal"
    ],
    "resourceType": "MOBILE_APP",
    "officialUrl": "https://github.com/conebox/moneywallet",
    "sourceUrl": "https://github.com/conebox/moneywallet",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "ANDROID",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Multiple wallet management",
        "Multi-currency and exchange rates",
        "Categorized spending charts",
        "Recurring transaction scheduling",
        "CSV and database export/backup"
    ],
    "tags": [
        "expense-tracker",
        "mobile-finance",
        "android",
        "multi-currency",
        "privacy"
    ],
    "alternativeTo": [
        "Wallet by BudgetBakers",
        "Spendee"
    ],
    "relatedResources": [
        "actual-budget",
        "firefly-iii"
    ]
}),

  unverified({
    "slug": "transit",
    "name": "Transit",
    "shortDescription": "Real-time urban public transit navigation, schedule lookup, and multi-modal route planner.",
    "longDescription": "Transit is a comprehensive urban mobility application that provides real-time departure predictions, step-by-step navigation, and schedule lookups for public buses, trains, metros, ferries, and shared bikes across hundreds of metropolitan cities worldwide.",
    "whyListed": "Delivers reliable real-time public transit tracking and multi-modal navigation across major cities globally.",
    "category": "travel",
    "subcategories": [
        "maps",
        "lifestyle"
    ],
    "resourceType": "MOBILE_APP",
    "officialUrl": "https://transitapp.com",
    "pricingUrl": "https://transitapp.com/royale",
    "freeStatus": "FREE_TIER",
    "openSource": false,
    "platforms": [
        "ANDROID",
        "IOS"
    ],
    "limitations": [
        "Free tier provides nearby transit lines and full departure schedules; advanced future line departure browsing requires Royale subscription (often sponsored free by local transit agencies)"
    ],
    "features": [
        "Real-time vehicle departure countdowns",
        "Step-by-step GO transit navigation",
        "Offline schedule support",
        "Bike-share and scooter integration",
        "Disruption and service alerts"
    ],
    "tags": [
        "public-transit",
        "navigation",
        "metro-bus",
        "trip-planner",
        "urban-mobility"
    ],
    "alternativeTo": [
        "Citymapper",
        "Moovit"
    ],
    "relatedResources": [
        "organic-maps",
        "openstreetmap"
    ]
}),

  unverified({
    "slug": "wanderlog",
    "name": "Wanderlog",
    "shortDescription": "Collaborative travel planner and itinerary organizer for trips, maps, and flight notes.",
    "longDescription": "Wanderlog is a travel planning application that helps travelers organize flight, hotel, and restaurant reservations into a day-by-day itinerary on an interactive map. It supports real-time collaboration with travel companions, route optimization, and offline itinerary viewing.",
    "whyListed": "Streamlines vacation and trip planning by combining visual mapping, reservation organization, and team collaboration.",
    "category": "travel",
    "subcategories": [
        "collaboration",
        "lifestyle"
    ],
    "resourceType": "WEB_APP",
    "officialUrl": "https://wanderlog.com",
    "pricingUrl": "https://wanderlog.com/pro",
    "freeStatus": "FREE_TIER",
    "openSource": false,
    "platforms": [
        "BROWSER",
        "ANDROID",
        "IOS"
    ],
    "limitations": [
        "Free tier includes unlimited trips, collaborative planning, and map routing; offline mobile access and route optimization features require Wanderlog Pro"
    ],
    "features": [
        "Interactive map itinerary planner",
        "Real-time group trip collaboration",
        "Automatic reservation email parsing",
        "Budget and expense splitting",
        "Export itineraries to Google Maps"
    ],
    "tags": [
        "travel-planner",
        "itinerary",
        "trip-organizer",
        "travel-maps",
        "vacation"
    ],
    "alternativeTo": [
        "TripIt",
        "Google Travel"
    ],
    "relatedResources": [
        "organic-maps",
        "transit"
    ]
}),

  unverified({
    "slug": "pricehistory",
    "name": "PriceHistory.app",
    "shortDescription": "Price history tracker and analytics tool for major Indian e-commerce platforms.",
    "longDescription": "PriceHistory.app is a free online price tracking tool that monitors price fluctuations of products on major Indian e-commerce sites, including Amazon India and Flipkart. It provides historical price charts, lowest and highest recorded prices, and custom price drop alerts.",
    "whyListed": "Helps online shoppers in India avoid artificial discount markups by providing transparent historical pricing data.",
    "category": "shopping",
    "subcategories": [
        "utilities",
        "personal-finance"
    ],
    "resourceType": "WEB_APP",
    "officialUrl": "https://pricehistory.app",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER",
        "ANDROID"
    ],
    "features": [
        "Historical price fluctuation charts",
        "Amazon India and Flipkart product tracking",
        "Price drop email and Telegram alerts",
        "Lowest and highest recorded price indicators",
        "Browser extension and Android app"
    ],
    "tags": [
        "price-tracker",
        "india-shopping",
        "ecommerce",
        "price-history",
        "discounts"
    ],
    "alternativeTo": [
        "Keepa",
        "CamelCamelCamel"
    ],
    "relatedResources": [
        "keepassdx",
        "actual-budget"
    ]
}),

  unverified({
    "slug": "keepassdx",
    "name": "KeePassDX",
    "shortDescription": "Lightweight, open-source password manager for Android supporting KeePass databases.",
    "longDescription": "KeePassDX is a secure, open-source password vault application for Android that reads and writes standard KeePass (KDBX) database files. It features biometric authentication, auto-fill integration, offline database management, and zero internet permissions for maximum privacy.",
    "whyListed": "Provides a native, tracker-free Android password management interface for KeePass databases with no internet access requirement.",
    "category": "everyday",
    "subcategories": [
        "personal",
        "utilities"
    ],
    "resourceType": "MOBILE_APP",
    "officialUrl": "https://www.keepassdx.com",
    "sourceUrl": "https://github.com/Kunzisoft/KeePassDX",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "ANDROID"
    ],
    "downloadAvailable": true,
    "features": [
        "KDBX 3.x and 4.x database support",
        "Biometric unlock (fingerprint/face)",
        "Android system AutoFill service",
        "Hardware key (YubiKey) support",
        "Zero internet permissions"
    ],
    "tags": [
        "password-manager",
        "android",
        "keepass",
        "security",
        "offline-vault"
    ],
    "alternativeTo": [
        "1Password",
        "Bitwarden",
        "Dashlane"
    ],
    "relatedResources": [
        "keepassxc",
        "bitwarden"
    ]
}),

  unverified({
    "slug": "deskreen",
    "name": "Deskreen",
    "shortDescription": "Open-source application that turns any browser-enabled device into a secondary screen for your computer.",
    "longDescription": "Deskreen is a desktop application that streams your computer screen or individual application windows to any device with a modern web browser over a local Wi-Fi connection. It transforms tablets, phones, and smart TVs into secondary monitors without requiring proprietary cables.",
    "whyListed": "Repurposes existing tablets and mobile devices into wireless secondary desktop displays using standard local web technologies.",
    "category": "everyday",
    "subcategories": [
        "utilities",
        "productivity"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://deskreen.com",
    "sourceUrl": "https://github.com/pavlobu/deskreen",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Wireless screen extension over Wi-Fi",
        "Single application window sharing",
        "End-to-end encryption via WebRTC",
        "No client app installation needed on target device",
        "Multiple screen streams simultaneously"
    ],
    "tags": [
        "screen-sharing",
        "second-monitor",
        "display-extension",
        "webrtc",
        "desktop-tools"
    ],
    "alternativeTo": [
        "Duet Display",
        "Spacedesk"
    ],
    "relatedResources": [
        "localsend",
        "rustdesk"
    ]
}),

  unverified({
    "slug": "home-assistant",
    "name": "Home Assistant",
    "shortDescription": "Open-source home automation platform emphasizing local control, device compatibility, and privacy.",
    "longDescription": "Home Assistant is a self-hosted home automation system that integrates thousands of smart home devices, sensors, and services. It runs locally without cloud dependence, providing custom automations, energy tracking dashboards, and voice control in complete privacy.",
    "whyListed": "The premier open-source smart home hub that ensures all home automation logic runs locally without cloud subscriptions.",
    "category": "lifestyle",
    "subcategories": [
        "utilities",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.home-assistant.io",
    "sourceUrl": "https://github.com/home-assistant/core",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Apache-2.0",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER",
        "ANDROID",
        "IOS"
    ],
    "downloadAvailable": true,
    "features": [
        "Local device control and automation",
        "2,500+ device and service integrations",
        "Comprehensive home energy monitoring",
        "Customizable Lovelace dashboards",
        "Companion mobile apps with geolocation"
    ],
    "tags": [
        "home-automation",
        "smart-home",
        "iot",
        "local-control",
        "privacy"
    ],
    "alternativeTo": [
        "Samsung SmartThings",
        "Apple HomeKit",
        "Google Home"
    ],
    "relatedResources": [
        "actual-budget",
        "jellyfin"
    ]
}),

  unverified({
    "slug": "tuxpaint",
    "name": "Tux Paint",
    "shortDescription": "Open-source drawing and painting software designed for children and classrooms.",
    "longDescription": "Tux Paint is a free, open-source raster graphics editor designed specifically for children aged 3 to 12. It features an intuitive, child-friendly interface, playful sound effects, rubber stamps, magic distortion tools, and large drawing canvases used in elementary schools worldwide.",
    "whyListed": "Provides a safe, ad-free creative digital art studio for children and classrooms across all major operating systems.",
    "category": "lifestyle",
    "subcategories": [
        "design",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://tuxpaint.org",
    "sourceUrl": "https://sourceforge.net/projects/tuxpaint/",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID"
    ],
    "downloadAvailable": true,
    "features": [
        "Kid-friendly simple canvas interface",
        "Fun cartoon sound effects",
        "Extensive collection of rubber stamp images",
        "Magic creative effects and filters",
        "Multi-language support for classrooms"
    ],
    "tags": [
        "kids-drawing",
        "educational-art",
        "children",
        "painting",
        "creative-software"
    ],
    "alternativeTo": [
        "Kid Pix"
    ],
    "relatedResources": [
        "gcompris",
        "krita"
    ]
}),

  unverified({
    "slug": "frappe-hr",
    "name": "Frappe HR",
    "shortDescription": "Modern open-source HR and payroll management system for growing organizations.",
    "longDescription": "Frappe HR is a full-featured open-source human resource and payroll management application built on the Frappe framework. It streamlines employee onboarding, leave management, attendance tracking, expense claims, performance reviews, and multi-country payroll processing.",
    "whyListed": "Provides a complete enterprise-grade HR and payroll platform that can be self-hosted completely free without seat licensing.",
    "category": "hr",
    "subcategories": [
        "business-finance",
        "project-management"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://frappehr.com",
    "sourceUrl": "https://github.com/frappe/hrms",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Employee lifecycle management",
        "Leave and attendance tracking",
        "Customizable multi-currency payroll",
        "Expense claims and reimbursement",
        "Performance appraisals and goal tracking"
    ],
    "tags": [
        "hr-management",
        "payroll",
        "human-resources",
        "frappe",
        "open-source-erp"
    ],
    "alternativeTo": [
        "BambooHR",
        "Gusto",
        "Rippling"
    ],
    "relatedResources": [
        "openhrms",
        "docuseal",
        "mattermost"
    ]
}),

  unverified({
    "slug": "openhrms",
    "name": "OpenHRMS",
    "shortDescription": "Open-source human resource management software suite covering recruitment, attendance, and payroll.",
    "longDescription": "OpenHRMS is an open-source HR software suite built on Odoo that manages end-to-end human resource operations. It features modules for candidate recruitment, employee databases, attendance, payroll, appraisal systems, and company loan management for enterprises.",
    "whyListed": "Delivers a modular, Odoo-compatible open-source HR suite covering recruitment through payroll without per-employee licensing.",
    "category": "hr",
    "subcategories": [
        "business-finance",
        "collaboration"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.openhrms.com",
    "sourceUrl": "https://github.com/CybroOdoo/OpenHRMS",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "LGPL-3.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Recruitment and applicant tracking",
        "Attendance and biometric integration",
        "Salary structure and payroll engine",
        "Employee loan and advance tracking",
        "HR analytics and organizational charts"
    ],
    "tags": [
        "human-resources",
        "hrms",
        "odoo",
        "payroll-system",
        "recruitment"
    ],
    "alternativeTo": [
        "Workday",
        "Zoho People"
    ],
    "relatedResources": [
        "frappe-hr",
        "docuseal"
    ]
}),

  unverified({
    "slug": "html5-up",
    "name": "HTML5 UP",
    "shortDescription": "Responsive, customizable HTML5 and CSS3 site templates released under Creative Commons.",
    "longDescription": "HTML5 UP provides a curated collection of modern, responsive website templates built with HTML5, CSS3, and minimal vanilla JavaScript. Created by developer AJ, all templates are fully customizable, mobile-friendly, and free for personal and commercial use under Creative Commons CCA 3.0.",
    "whyListed": "Offers clean, fast-loading, responsive site templates with no framework bloat under permissive Creative Commons licensing.",
    "category": "templates",
    "subcategories": [
        "design",
        "developer-utilities"
    ],
    "resourceType": "TEMPLATE",
    "officialUrl": "https://html5up.net",
    "freeStatus": "FREE",
    "openSource": false,
    "license": "CC-BY-3.0",
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "100% responsive layouts",
        "Clean semantic HTML5 and CSS3 code",
        "Zero framework dependencies",
        "Free for personal and commercial projects with attribution",
        "Pre-built portfolio, agency, and landing templates"
    ],
    "tags": [
        "website-templates",
        "html5",
        "css3",
        "web-design",
        "creative-commons"
    ],
    "alternativeTo": [
        "ThemeForest",
        "TemplateMonster"
    ],
    "relatedResources": [
        "latex-templates",
        "tabler-icons"
    ]
}),

  unverified({
    "slug": "latex-templates",
    "name": "LaTeX Templates",
    "shortDescription": "Curated catalog of free LaTeX templates for papers, theses, books, presentations, and CVs.",
    "longDescription": "LaTeX Templates is a comprehensive online repository of professionally designed templates for typesetting academic articles, doctoral dissertations, laboratory reports, conference presentations, curricula vitae, and textbooks using LaTeX.",
    "whyListed": "Provides production-ready, beautifully typeset academic and professional LaTeX document templates ready for immediate compilation.",
    "category": "templates",
    "subcategories": [
        "documents",
        "research"
    ],
    "resourceType": "TEMPLATE",
    "officialUrl": "https://www.latextemplates.com",
    "freeStatus": "FREE",
    "openSource": false,
    "license": "CC-BY-NC-SA-3.0 / Permissive",
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Academic journal and thesis templates",
        "Professional résumé and CV layouts",
        "Beamer presentation templates",
        "Book and laboratory report formats",
        "Instant ZIP download and preview"
    ],
    "tags": [
        "latex",
        "typesetting",
        "academic-templates",
        "cv-templates",
        "thesis"
    ],
    "alternativeTo": [
        "Overleaf Premium Templates"
    ],
    "relatedResources": [
        "html5-up",
        "marp"
    ]
}),

  unverified({
    "slug": "nasa-apod",
    "name": "NASA APOD",
    "shortDescription": "NASA Astronomy Picture of the Day providing high-resolution public-domain astronomical imagery.",
    "longDescription": "NASA's Astronomy Picture of the Day (APOD) publishes a different high-resolution image or photograph of the universe every day, accompanied by a concise explanation written by professional astronomers. Images feature deep space telescopes, planetary rovers, and astrophotography.",
    "whyListed": "Supplies daily public-domain and openly licensed astronomical photography and high-resolution space wallpapers.",
    "category": "wallpapers",
    "subcategories": [
        "science",
        "stock-media"
    ],
    "resourceType": "STOCK_IMAGE",
    "officialUrl": "https://apod.nasa.gov/apod/astropix.html",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Daily high-resolution space photography",
        "Scientific commentary by astronomers",
        "Searchable archive dating back to 1995",
        "Public domain NASA assets",
        "High-resolution desktop wallpaper downloads"
    ],
    "tags": [
        "astronomy",
        "space-wallpapers",
        "nasa",
        "astrophotography",
        "public-domain"
    ],
    "alternativeTo": [
        "Getty Images Space Collection"
    ],
    "relatedResources": [
        "celestia",
        "wikimedia-commons"
    ]
}),

  unverified({
    "slug": "kodi",
    "name": "Kodi",
    "shortDescription": "Open-source home theater software and entertainment hub for videos, music, and digital media.",
    "longDescription": "Kodi is an award-winning open-source media player and entertainment hub that organizes and plays digital video, audio, podcasts, and photos from local and network storage. It runs on TVs, PCs, and set-top boxes with a 10-foot user interface and an extensive addon ecosystem.",
    "whyListed": "The standard open-source home theater and media center software with complete local library management and zero subscriptions.",
    "category": "movies",
    "subcategories": [
        "music",
        "streaming"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://kodi.tv",
    "sourceUrl": "https://github.com/xbmc/xbmc",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID"
    ],
    "downloadAvailable": true,
    "features": [
        "10-foot living room user interface",
        "Video and audio library organization",
        "Scraping of metadata, artwork, and subtitles",
        "PVR live TV recording support",
        "Extensive community addon repository"
    ],
    "tags": [
        "media-center",
        "home-theater",
        "video-player",
        "digital-media",
        "open-source-tv"
    ],
    "alternativeTo": [
        "Plex",
        "Apple TV"
    ],
    "relatedResources": [
        "jellyfin",
        "vlc"
    ]
}),

  unverified({
    "slug": "jellyfin",
    "name": "Jellyfin",
    "shortDescription": "Free, open-source software media system that puts you in control of managing and streaming your media.",
    "longDescription": "Jellyfin is a volunteer-built, open-source media server that allows users to stream their personal collection of movies, TV shows, music, and photos to any device. It has no premium tiers, no user tracking, and no central authentication servers.",
    "whyListed": "A 100% free software media streaming server with hardware transcoding and multi-device clients without premium paywalls.",
    "category": "streaming",
    "subcategories": [
        "movies",
        "music"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://jellyfin.org",
    "sourceUrl": "https://github.com/jellyfin/jellyfin",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID",
        "IOS",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Personal media streaming server",
        "Hardware-accelerated video transcoding",
        "Multi-user accounts with parental controls",
        "Live TV and DVR recording",
        "Native client apps across TV, mobile, and web"
    ],
    "tags": [
        "media-server",
        "streaming",
        "self-hosted",
        "video-streaming",
        "privacy"
    ],
    "alternativeTo": [
        "Plex Pass",
        "Emby Premiere"
    ],
    "relatedResources": [
        "kodi",
        "vlc"
    ]
}),

  unverified({
    "slug": "tuxguitar",
    "name": "TuxGuitar",
    "shortDescription": "Open-source multitrack guitar tablature editor and score player supporting Guitar Pro files.",
    "longDescription": "TuxGuitar is a multi-track tablature editor and player for musicians. It allows guitarists and composers to compose music, edit tablatures, view musical scores, practice with a built-in metronome, and import/export standard Guitar Pro (GP3, GP4, GP5) and MIDI files.",
    "whyListed": "Provides complete guitar tablature composition, editing, and playback with Guitar Pro compatibility in an open-source tool.",
    "category": "music",
    "subcategories": [
        "audio",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://tuxguitar.app",
    "sourceUrl": "https://github.com/helge17/tuxguitar",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "LGPL-2.1-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID"
    ],
    "downloadAvailable": true,
    "features": [
        "Multitrack tablature and sheet music editor",
        "Guitar Pro (GP3/GP4/GP5) import and export",
        "MIDI playback with speed trainer",
        "Chord diagrams and scale lookup",
        "Customizable fretboard and piano roll visualizers"
    ],
    "tags": [
        "tablature",
        "guitar-pro",
        "music-notation",
        "guitar-tabs",
        "midi-player"
    ],
    "alternativeTo": [
        "Guitar Pro",
        "Sibelius"
    ],
    "relatedResources": [
        "musescore",
        "audacity"
    ]
}),

  unverified({
    "slug": "soundconverter",
    "name": "SoundConverter",
    "shortDescription": "Leading audio file converter for the GNOME desktop supporting batch audio transcoding.",
    "longDescription": "SoundConverter is a dedicated audio transcoding application for Linux desktops. Built with GStreamer, it batch converts audio files between MP3, Ogg Vorbis, FLAC, WAV, AAC, and Opus formats with multi-threaded processing and metadata tag preservation.",
    "whyListed": "A fast, straightforward audio format converter that preserves tags and processes large audio batches efficiently.",
    "category": "audio",
    "subcategories": [
        "utilities",
        "music"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://soundconverter.org",
    "sourceUrl": "https://github.com/kassoulet/soundconverter",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Multi-threaded batch audio conversion",
        "Support for MP3, FLAC, Ogg, Opus, AAC, WAV",
        "Audio metadata and ID3 tag preservation",
        "Automatic output folder structure generation",
        "GStreamer multimedia engine"
    ],
    "tags": [
        "audio-converter",
        "batch-transcoder",
        "flac-to-mp3",
        "sound-tools",
        "gnome"
    ],
    "alternativeTo": [
        "dBpoweramp",
        "Switch Audio Converter"
    ],
    "relatedResources": [
        "audacity",
        "handbrake"
    ]
}),

  unverified({
    "slug": "armorpaint",
    "name": "ArmorPaint",
    "shortDescription": "Standalone 3D PBR texture painting application with node-based procedural texturing.",
    "longDescription": "ArmorPaint is a standalone 3D painting software designed for physically based rendering (PBR) texture creation. Artists can paint directly on 3D meshes using layers, node-based material shaders, and raytraced viewport rendering powered by the Armory engine.",
    "whyListed": "Enables physically based 3D texture painting with GPU acceleration and node materials without ongoing subscriptions.",
    "category": "three-d",
    "subcategories": [
        "design",
        "games"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://armorpaint.org",
    "sourceUrl": "https://github.com/armory3d/armortools",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Zlib",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Physically based 3D texture painting",
        "Node-based procedural material shaders",
        "GPU-accelerated raytraced viewport",
        "Direct export to game engines (Unity, Unreal, Godot)",
        "Layer masking and blending modes"
    ],
    "tags": [
        "3d-painting",
        "pbr-textures",
        "texturing",
        "game-development",
        "3d-art"
    ],
    "alternativeTo": [
        "Adobe Substance 3D Painter"
    ],
    "relatedResources": [
        "blender",
        "dust3d"
    ]
}),

  unverified({
    "slug": "dust3d",
    "name": "Dust3D",
    "shortDescription": "Quick 3D modeling software for game development and 3D printing base-mesh generation.",
    "longDescription": "Dust3D is an open-source 3D modeling software designed to create base 3D models in minutes. It uses skeletal node graphs to automatically generate manifold quad meshes, auto-rig characters, and create UV maps, accelerating 3D asset workflows for indie game creators and 3D printing enthusiasts.",
    "whyListed": "Radically speeds up 3D character and base-mesh modeling through automated quad-meshing and skeleton auto-rigging.",
    "category": "three-d",
    "subcategories": [
        "games",
        "design"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://dust3d.org",
    "sourceUrl": "https://github.com/huxingyi/dust3d",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Node-based skeletal 3D modeling",
        "Instant watertight manifold mesh generation",
        "Automatic character rigging and poses",
        "Automatic UV unwrapping",
        "Export to glTF, FBX, and OBJ"
    ],
    "tags": [
        "3d-modeling",
        "game-assets",
        "auto-rigging",
        "3d-printing",
        "base-mesh"
    ],
    "alternativeTo": [
        "ZBrush ZSpheres",
        "Cinema 4D"
    ],
    "relatedResources": [
        "blender",
        "armorpaint"
    ]
}),

  unverified({
    "slug": "sigil",
    "name": "Sigil",
    "shortDescription": "Multi-platform open-source EPUB ebook editor with full visual and code editing.",
    "longDescription": "Sigil is an open-source WYSIWYG and code editor for the EPUB ebook format. It gives authors and publishers precise control over EPUB 2 and EPUB 3 files, with live preview, automated table of contents generation, spell checking, and metadata editing.",
    "whyListed": "The standard open-source desktop tool for creating, validating, and formatting publication-grade EPUB ebooks.",
    "category": "documents",
    "subcategories": [
        "design",
        "utilities"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://sigil-ebook.com",
    "sourceUrl": "https://github.com/Sigil-Ebook/Sigil",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Full EPUB 2 and EPUB 3 specification support",
        "Split visual WYSIWYG and XHTML code view",
        "Automatic Table of Contents generator",
        "EPUB metadata editor and validator",
        "Plugin system for formatting automation"
    ],
    "tags": [
        "ebook-editor",
        "epub",
        "publishing",
        "book-formatting",
        "desktop-editor"
    ],
    "alternativeTo": [
        "Adobe InDesign Ebook Exporter",
        "Vellum"
    ],
    "relatedResources": [
        "calibre",
        "libreoffice"
    ]
}),

  unverified({
    "slug": "docuseal",
    "name": "DocuSeal",
    "shortDescription": "Open-source digital document signing platform providing electronic signature workflows.",
    "longDescription": "DocuSeal is an open-source platform for signing and processing digital documents. It provides an intuitive web interface to create fillable PDF forms, request e-signatures, automate signing workflows, and maintain cryptographic audit trails with self-hosted or cloud deployment.",
    "whyListed": "Provides a self-hostable, compliant electronic document signing solution without per-signature fees.",
    "category": "documents",
    "subcategories": [
        "business-finance",
        "collaboration"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.docuseal.com",
    "sourceUrl": "https://github.com/docusealco/docuseal",
    "pricingUrl": "https://www.docuseal.com/pricing",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "PDF form builder and field placement",
        "Mobile-friendly e-signature collection",
        "Cryptographic audit trail verification",
        "Automated email reminder workflows",
        "REST API and webhook integration"
    ],
    "tags": [
        "esignature",
        "document-signing",
        "pdf-forms",
        "contracts",
        "self-hosted"
    ],
    "alternativeTo": [
        "DocuSign",
        "HelloSign / Dropbox Sign",
        "PandaDoc"
    ],
    "relatedResources": [
        "frappe-hr",
        "openhrms"
    ]
}),

  unverified({
    "slug": "dwsim",
    "name": "DWSIM",
    "shortDescription": "Open-source chemical process simulator and CAPE-OPEN compliant thermodynamics engine.",
    "longDescription": "DWSIM is a chemical process simulator for Windows, Linux, and macOS. It allows chemical engineers to model steady-state and dynamic chemical processes, conduct rigorous thermodynamic flash calculations, and design unit operations such as distillation columns, reactors, and heat exchangers.",
    "whyListed": "Provides an open-source alternative to expensive commercial chemical process simulation suites for students and practicing engineers.",
    "category": "science",
    "subcategories": [
        "utilities",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://dwsim.org",
    "sourceUrl": "https://github.com/DanWBR/dwsim",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Rigorous thermodynamic property packages (Peng-Robinson, NRTL, UNIQUAC)",
        "Unit operations library (distillation, absorption, reactors, pumps)",
        "CAPE-OPEN thermodynamic and unit operation interfaces",
        "Dynamic and steady-state simulation modes",
        "Cross-platform graphical flowsheeting"
    ],
    "tags": [
        "chemical-engineering",
        "process-simulation",
        "thermodynamics",
        "engineering",
        "cape-open"
    ],
    "alternativeTo": [
        "Aspen Plus",
        "Honeywell UniSim",
        "Chemcad"
    ],
    "relatedResources": [
        "cantera",
        "openfoam"
    ]
}),

  unverified({
    "slug": "opensees",
    "name": "OpenSees",
    "shortDescription": "Open system for earthquake engineering simulation of structural and geotechnical systems.",
    "longDescription": "OpenSees (Open System for Earthquake Engineering Simulation) is an advanced finite element framework developed by UC Berkeley. It simulates the nonlinear seismic and structural response of buildings, bridges, and geotechnical soil foundations subject to earthquake excitations.",
    "whyListed": "The premier research-grade nonlinear finite element analysis framework for structural and earthquake engineering.",
    "category": "science",
    "subcategories": [
        "research",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://opensees.berkeley.edu",
    "sourceUrl": "https://github.com/OpenSees/OpenSees",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "OpenSees Open Source License",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Nonlinear material and element formulations",
        "Dynamic seismic ground motion response analysis",
        "Python (OpenSeesPy) and Tcl scripting interfaces",
        "Geotechnical soil-structure interaction modeling",
        "High-performance parallel computing support"
    ],
    "tags": [
        "earthquake-engineering",
        "structural-analysis",
        "finite-element",
        "geotechnical",
        "civil-engineering"
    ],
    "alternativeTo": [
        "SAP2000",
        "ETABS",
        "ANSYS Structural"
    ],
    "relatedResources": [
        "dwsim",
        "openfoam"
    ]
}),

  unverified({
    "slug": "ngspice",
    "name": "NGSPICE",
    "shortDescription": "Open-source SPICE circuit simulation engine for analog, digital, and mixed-signal electronics.",
    "longDescription": "NGSPICE is a general-purpose electronic circuit simulation engine based on SPICE3f5, Cider, and XSPICE. It performs DC operating point, transient, AC small-signal, noise, and mixed-signal simulations for analog and digital integrated circuits and PCB designs.",
    "whyListed": "The backbone open-source SPICE simulation engine used widely in academic research and open silicon electronic design automation.",
    "category": "science",
    "subcategories": [
        "utilities",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://ngspice.sourceforge.io",
    "sourceUrl": "https://sourceforge.net/projects/ngspice/",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "BSD-3-Clause",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Mixed-mode analog and event-driven digital simulation",
        "BSIM3, BSIM4, and BSIM-CMG semiconductor models",
        "Transient, Fourier, AC, DC, and distortion analyses",
        "Command line and shared library C API integration",
        "Integrated with KiCad and open-source EDA tools"
    ],
    "tags": [
        "circuit-simulation",
        "spice",
        "electronics",
        "eda",
        "analog-circuits"
    ],
    "alternativeTo": [
        "LTspice",
        "Cadence Spectre",
        "Synopsys HSPICE"
    ],
    "relatedResources": [
        "kicad",
        "librepcb"
    ]
}),

  unverified({
    "slug": "energyplus",
    "name": "EnergyPlus",
    "shortDescription": "Whole building energy simulation engine by the US Department of Energy for heating and cooling.",
    "longDescription": "EnergyPlus is an open-source building energy simulation engine funded by the U.S. Department of Energy (DOE). It models heating, cooling, lighting, ventilation, water use, and carbon emissions in residential and commercial buildings across varying environmental conditions.",
    "whyListed": "The gold-standard building physics and energy simulation engine used globally for sustainable architectural and HVAC engineering.",
    "category": "science",
    "subcategories": [
        "research",
        "utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://energyplus.net",
    "sourceUrl": "https://github.com/NREL/EnergyPlus",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "BSD-3-Clause",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Integrated thermal zone and HVAC system modeling",
        "Sub-hourly time-step calculation of heat balance",
        "Daylighting controls and solar radiation calculations",
        "Atmospheric pollutant and energy cost estimation",
        "Python API and EMS runtime scripting"
    ],
    "tags": [
        "building-energy",
        "energy-modeling",
        "architecture",
        "hvac-simulation",
        "green-building"
    ],
    "alternativeTo": [
        "IES VE",
        "eQUEST"
    ],
    "relatedResources": [
        "radiance",
        "openfoam"
    ]
}),

  unverified({
    "slug": "radiance",
    "name": "Radiance",
    "shortDescription": "Validated ray-tracing software suite for architectural lighting and daylighting simulation.",
    "longDescription": "Radiance is a physically validated synthetic imaging system developed by Lawrence Berkeley National Laboratory (LBNL). It uses backward ray-tracing to accurately predict light levels, luminance distributions, and glare metrics for architectural spaces under natural daylight and artificial lighting.",
    "whyListed": "The internationally recognized benchmark tool for physical lighting calculations and architectural daylight analysis.",
    "category": "science",
    "subcategories": [
        "design",
        "research"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.radiance-online.org",
    "sourceUrl": "https://github.com/LBNL-ETA/Radiance",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Radiance Open Source License",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Physically accurate backward ray-tracing",
        "Daylight autonomy and annual solar exposure calculations",
        "Daylight Glare Probability (DGP) evaluation",
        "High dynamic range (HDR) radiometric imaging",
        "Command line rendering pipelines and materials"
    ],
    "tags": [
        "lighting-simulation",
        "daylighting",
        "ray-tracing",
        "architecture",
        "optics"
    ],
    "alternativeTo": [
        "DIALux",
        "Relux"
    ],
    "relatedResources": [
        "energyplus",
        "blender"
    ]
}),

  unverified({
    "slug": "epanet",
    "name": "EPANET",
    "shortDescription": "Water distribution pipe network hydraulic and water quality modeling software by the US EPA.",
    "longDescription": "EPANET is an open-source software application developed by the U.S. Environmental Protection Agency (EPA). It performs extended-period simulation of hydraulic and water quality behavior within pressurized drinking water pipe distribution networks, modeling water age, chlorine decay, and pumping costs.",
    "whyListed": "The standard public-domain hydraulic simulation tool used worldwide for municipal drinking water network design.",
    "category": "science",
    "subcategories": [
        "utilities",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://www.epa.gov/water-research/epanet",
    "sourceUrl": "https://github.com/OpenWaterAnalytics/EPANET",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Public Domain / CC0",
    "platforms": [
        "WINDOWS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Pressurized pipe network hydraulic simulation",
        "Chemical reaction and disinfectant decay tracking",
        "Water age and source tracing throughout networks",
        "Energy usage and pump scheduling calculations",
        "Open C library (C-API) for automated analysis"
    ],
    "tags": [
        "hydraulics",
        "water-networks",
        "civil-engineering",
        "epa",
        "environmental-engineering"
    ],
    "alternativeTo": [
        "WaterCAD",
        "InfoWater"
    ],
    "relatedResources": [
        "swmm",
        "qgis"
    ]
}),

  unverified({
    "slug": "swmm",
    "name": "SWMM",
    "shortDescription": "Dynamic rainfall-runoff simulation model for urban drainage systems and stormwater management.",
    "longDescription": "The Storm Water Management Model (SWMM) is an open-source dynamic hydrological simulation model developed by the U.S. EPA. It models runoff quantity and quality from urban and natural drainage basins, sewer systems, detention ponds, and low-impact development (LID) green infrastructure.",
    "whyListed": "The global benchmark simulation model for municipal stormwater management, urban drainage, and flood prevention planning.",
    "category": "science",
    "subcategories": [
        "utilities",
        "research"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://www.epa.gov/water-research/storm-water-management-model-swmm",
    "sourceUrl": "https://github.com/OpenWaterAnalytics/Stormwater-Management-Model",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Public Domain / CC0",
    "platforms": [
        "WINDOWS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Dynamic rainfall-runoff and routing calculations",
        "Low Impact Development (LID) controls modeling",
        "Combined and sanitary sewer overflow simulation",
        "Water quality pollutant buildup and wash-off",
        "Integration with GIS mapping layers"
    ],
    "tags": [
        "stormwater",
        "hydrology",
        "urban-drainage",
        "flood-modeling",
        "civil-engineering"
    ],
    "alternativeTo": [
        "InfoWorks ICM",
        "CivilStorm"
    ],
    "relatedResources": [
        "epanet",
        "qgis"
    ]
}),

  unverified({
    "slug": "opendss",
    "name": "OpenDSS",
    "shortDescription": "Electric power distribution system simulator for grid analysis, solar, and smart grid studies.",
    "longDescription": "OpenDSS (Open Distribution System Simulator) is a simulation tool for electric power distribution systems developed by EPRI. It performs steady-state power flow, harmonics, fault calculations, and annual quasi-static time-series simulations for grid integration of solar PV, wind, and storage.",
    "whyListed": "The primary open platform for analyzing distributed renewable energy integration and electric grid modernization.",
    "category": "science",
    "subcategories": [
        "developer-utilities",
        "research"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.epri.com/pages/sa/opendss",
    "sourceUrl": "https://sourceforge.net/projects/electricdss/",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "BSD-3-Clause",
    "platforms": [
        "WINDOWS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Multi-phase unbalanced power flow calculations",
        "Solar PV and renewable generation hosting capacity",
        "Harmonics and fault analysis",
        "Quasi-static time-series (QSTS) simulations",
        "COM and Python direct interface automation"
    ],
    "tags": [
        "electrical-grid",
        "power-systems",
        "solar-integration",
        "smart-grid",
        "epri"
    ],
    "alternativeTo": [
        "CYME",
        "Synergi Electric"
    ],
    "relatedResources": [
        "ngspice",
        "openfast"
    ]
}),

  unverified({
    "slug": "openfast",
    "name": "OpenFAST",
    "shortDescription": "Multi-physics wind turbine engineering simulation tool developed by NREL.",
    "longDescription": "OpenFAST is a comprehensive multi-physics engineering tool developed by the National Renewable Energy Laboratory (NREL). It simulates the coupled aero-hydro-servo-elastic dynamics of land-based and offshore floating wind turbines subject to complex wind, wave, and structural loading.",
    "whyListed": "The world's leading open-source simulation code for wind turbine structural dynamics and offshore renewable energy engineering.",
    "category": "science",
    "subcategories": [
        "research",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://openfast.readthedocs.io",
    "sourceUrl": "https://github.com/OpenFAST/openfast",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Apache-2.0",
    "platforms": [
        "LINUX",
        "WINDOWS",
        "MACOS"
    ],
    "downloadAvailable": true,
    "features": [
        "Coupled aerodynamic, hydrodynamic, and structural solver",
        "Offshore floating foundation dynamics",
        "Turbine control system (servo) modeling",
        "Nonlinear multi-body structural mechanics",
        "Direct Python and MATLAB API interfaces"
    ],
    "tags": [
        "wind-energy",
        "multi-physics",
        "renewable-energy",
        "nrel",
        "aerodynamics"
    ],
    "alternativeTo": [
        "Bladed",
        "HAWC2"
    ],
    "relatedResources": [
        "openfoam",
        "energyplus"
    ]
}),

  unverified({
    "slug": "cantera",
    "name": "Cantera",
    "shortDescription": "Open-source suite of chemical kinetics, thermodynamics, and transport process tools.",
    "longDescription": "Cantera is an open-source suite of object-oriented software tools for problems involving chemical kinetics, thermodynamics, and transport processes. It is used across combustion science, electrochemistry, fuel cells, batteries, and reacting gas flows with Python, C++, and MATLAB interfaces.",
    "whyListed": "Enables high-precision chemical kinetics and electrochemical modeling with broad language bindings for researchers.",
    "category": "science",
    "subcategories": [
        "developer-utilities",
        "research"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://cantera.org",
    "sourceUrl": "https://github.com/Cantera/cantera",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "BSD-3-Clause",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Chemical equilibrium and reaction kinetics calculations",
        "1D laminar flame and reactor network simulations",
        "Electrochemical kinetics for batteries and fuel cells",
        "Comprehensive Python, C++, Fortran, and MATLAB APIs",
        "Extensible thermodynamic and transport property models"
    ],
    "tags": [
        "chemical-kinetics",
        "combustion",
        "electrochemistry",
        "thermodynamics",
        "scientific-computing"
    ],
    "alternativeTo": [
        "Chemkin",
        "ANSYS Forte"
    ],
    "relatedResources": [
        "dwsim",
        "openfoam"
    ]
}),

  unverified({
    "slug": "vesta",
    "name": "VESTA",
    "shortDescription": "3D visualization program for structural models, electron densities, and crystal morphologies.",
    "longDescription": "VESTA (Visualization for Electronic and STructural Analysis) is a cross-platform 3D visualization program for structural models, volumetric data such as electron and nuclear densities, and crystal morphologies. It is an indispensable tool in crystallography, materials science, and solid-state physics.",
    "whyListed": "The standard tool in materials science and solid-state chemistry for rendering crystal structures and volumetric electron densities.",
    "category": "science",
    "subcategories": [
        "three-d",
        "research"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://jp-minerals.org/vesta/en/",
    "freeStatus": "FREE",
    "openSource": false,
    "license": "VESTA License (Free for academic and non-commercial use)",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "3D crystal and molecular structure visualization",
        "Volumetric data isosurface rendering (electron densities)",
        "Polyhedral and ball-and-stick representations",
        "Coordination polyhedra calculations and powder diffraction simulation",
        "Export to vector images and 3D VRML/raster formats"
    ],
    "tags": [
        "crystallography",
        "materials-science",
        "crystal-structures",
        "electron-density",
        "molecular-visualization"
    ],
    "alternativeTo": [
        "CrystalMaker",
        "Diamond Crystallography"
    ],
    "relatedResources": [
        "avogadro",
        "pymol-open-source"
    ]
}),

  unverified({
    "slug": "cytoscape",
    "name": "Cytoscape",
    "shortDescription": "Open-source software platform for visualizing complex networks and integrating biological data.",
    "longDescription": "Cytoscape is an open-source software platform for visualizing molecular interaction networks and biological pathways, integrating them with high-throughput gene expression, proteomics, and phenotypic data. It features rich layout algorithms and an extensive App Store ecosystem.",
    "whyListed": "The definitive platform for network biology, biological pathway visualization, and molecular interaction analysis.",
    "category": "science",
    "subcategories": [
        "research",
        "design"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://cytoscape.org",
    "sourceUrl": "https://github.com/cytoscape/cytoscape",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "LGPL-2.1-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Complex network graph visualization and layout",
        "Multi-omics dataset integration (genomics, proteomics)",
        "Node and edge visual property mapping",
        "App Store with hundreds of bioinformatics plugins",
        "Export to high-resolution publication figures"
    ],
    "tags": [
        "bioinformatics",
        "network-biology",
        "pathway-analysis",
        "systems-biology",
        "data-visualization"
    ],
    "alternativeTo": [
        "Ingenuity Pathway Analysis (IPA)",
        "Gephi"
    ],
    "relatedResources": [
        "ugene",
        "jalview"
    ]
}),

  unverified({
    "slug": "ugene",
    "name": "UGENE",
    "shortDescription": "Open-source bioinformatics software suite with visual tools for DNA and protein sequence analysis.",
    "longDescription": "Unipro UGENE is a cross-platform bioinformatics workbench with a visual desktop interface. It combines dozens of biological tools for DNA and protein sequence viewing, multiple sequence alignment, plasmid design, next-generation sequencing (NGS) analysis, and automated computational pipelines.",
    "whyListed": "Brings powerful bioinformatics algorithms and sequence analysis workflows into an accessible visual desktop interface.",
    "category": "science",
    "subcategories": [
        "research",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://ugene.net",
    "sourceUrl": "https://github.com/ugeneunipro/ugene",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Visual genome and plasmid editor",
        "Multiple sequence alignment (Clustal, MUSCLE, MAFFT)",
        "NGS data processing and variant calling",
        "Visual workflow designer for automated pipelines",
        "3D macromolecular structure visualizer"
    ],
    "tags": [
        "bioinformatics",
        "genomics",
        "sequence-alignment",
        "dna-editor",
        "ngs"
    ],
    "alternativeTo": [
        "Geneious",
        "CLC Genomics Workbench",
        "SnapGene"
    ],
    "relatedResources": [
        "jalview",
        "bioconductor"
    ]
}),

  unverified({
    "slug": "jalview",
    "name": "Jalview",
    "shortDescription": "Open-source program for multiple sequence alignment editing, visualization, and analysis.",
    "longDescription": "Jalview is a cross-platform program developed at the University of Dundee for visualizing, editing, and analyzing multiple sequence alignments of proteins and nucleic acids. It links sequence alignments directly with phylogenetic trees, 3D structures, and secondary structure annotations.",
    "whyListed": "The standard academic tool for visualizing and curating multiple sequence alignments with linked 3D molecular structures.",
    "category": "science",
    "subcategories": [
        "research",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://www.jalview.org",
    "sourceUrl": "https://github.com/jalview/jalview",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Interactive multiple sequence alignment editing",
        "Integration with AlphaFold and PDB 3D structures",
        "Phylogenetic tree calculation and clustering",
        "Secondary structure and protein feature annotation",
        "Publication-quality vector figure export"
    ],
    "tags": [
        "sequence-alignment",
        "bioinformatics",
        "protein-structures",
        "phylogenetics",
        "molecular-biology"
    ],
    "alternativeTo": [
        "MegAlign",
        "BioEdit"
    ],
    "relatedResources": [
        "ugene",
        "cytoscape"
    ]
}),

  unverified({
    "slug": "bioconductor",
    "name": "Bioconductor",
    "shortDescription": "Open-source software repository for the analysis of high-throughput genomic and biomedical data in R.",
    "longDescription": "Bioconductor is an open-source project and software repository that provides specialized R packages for analyzing high-throughput genomic data. Supported by the international scientific community, it includes thousands of vetted tools for RNA-Seq, microarray, single-cell genomics, and proteomics analysis.",
    "whyListed": "The world's premier computational biology and statistical genomics ecosystem for research data science.",
    "category": "science",
    "subcategories": [
        "research",
        "mathematics"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.bioconductor.org",
    "sourceUrl": "https://github.com/Bioconductor",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Artistic-2.0 / GPL",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "2,000+ specialized genomic analysis R packages",
        "Rigorous statistical workflows for RNA-Seq and single-cell data",
        "Standardized data structures (SummarizedExperiment, GenomicRanges)",
        "Extensive peer-reviewed documentation and vignettes",
        "Regular bi-annual release cycle synced with R"
    ],
    "tags": [
        "bioinformatics",
        "r-packages",
        "genomics",
        "rna-seq",
        "computational-biology"
    ],
    "alternativeTo": [
        "Partek Flow",
        "Illumina BaseSpace Analysis"
    ],
    "relatedResources": [
        "r-project",
        "ugene"
    ]
}),

  unverified({
    "slug": "celestia",
    "name": "Celestia",
    "shortDescription": "Real-time 3D space simulation and celestial exploration software.",
    "longDescription": "Celestia is an open-source real-time 3D space simulation program that lets users explore the universe in three dimensions. Unlike planetarium software that looks up from Earth, Celestia lets you navigate freely between planets, stars, moons, asteroids, and spacecraft across time and space.",
    "whyListed": "Provides a visually accurate 3D interactive model of the solar system and galaxy for education and astronomy exploration.",
    "category": "science",
    "subcategories": [
        "learning",
        "three-d"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://celestia.space",
    "sourceUrl": "https://github.com/CelestiaProject/Celestia",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID",
        "IOS"
    ],
    "downloadAvailable": true,
    "features": [
        "Real-time 3D space navigation and orbital mechanics",
        "Catalog of over 100,000 stars, planets, and moons",
        "Accurate historical and future celestial positions",
        "Extensive user-created addon database",
        "Cross-platform desktop and mobile support"
    ],
    "tags": [
        "astronomy",
        "space-simulation",
        "3d-universe",
        "celestial-navigation",
        "education"
    ],
    "alternativeTo": [
        "Starry Night",
        "SpaceEngine"
    ],
    "relatedResources": [
        "stellarium",
        "nasa-apod"
    ]
}),

  unverified({
    "slug": "gretl",
    "name": "Gretl",
    "shortDescription": "Open-source cross-platform econometric and statistical analysis software package.",
    "longDescription": "Gretl (Gnu Regression, Econometrics and Time-series Library) is a high-performance open-source statistical software package for econometric analysis. It features a clean graphical user interface, support for time series, panel data, and maximum likelihood estimation, and scriptable automated analysis via hansl.",
    "whyListed": "Provides a robust, highly accurate econometrics and time-series package used in university economics departments worldwide.",
    "category": "mathematics",
    "subcategories": [
        "science",
        "learning"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://gretl.sourceforge.net",
    "sourceUrl": "https://sourceforge.net/projects/gretl/",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Econometric estimators (OLS, 2SLS, GMM, VAR, VECM, ARIMA, GARCH)",
        "Comprehensive matrix command language (hansl)",
        "Panel data and time-series analysis tools",
        "Native LaTeX table output formatting",
        "Direct integration with R, GNU Octave, and Python"
    ],
    "tags": [
        "econometrics",
        "statistics",
        "time-series",
        "regression-analysis",
        "data-analysis"
    ],
    "alternativeTo": [
        "Stata",
        "EViews",
        "SAS"
    ],
    "relatedResources": [
        "jasp",
        "r-project",
        "gnumeric"
    ]
}),

  unverified({
    "slug": "jasp",
    "name": "JASP",
    "shortDescription": "Free and user-friendly statistical software for Bayesian and classical data analysis.",
    "longDescription": "JASP is an open-source statistical software program supported by the University of Amsterdam. Designed with a familiar SPSS-like interface, it allows researchers to seamlessly perform both classical frequentist statistical tests and cutting-edge Bayesian statistical analyses with dynamic publication-ready output.",
    "whyListed": "Makes Bayesian and classical statistical hypothesis testing intuitive and accessible with publication-ready output.",
    "category": "mathematics",
    "subcategories": [
        "science",
        "research"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://jasp-stats.org",
    "sourceUrl": "https://github.com/jasp-stats/jasp-desktop",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Side-by-side Bayesian and frequentist statistical tests",
        "Dynamic real-time table and plot updates",
        "APA formatted output tables for direct publishing",
        "Open Science Framework (OSF) integration",
        "Modules for machine learning, meta-analysis, and audit"
    ],
    "tags": [
        "statistics",
        "bayesian-statistics",
        "data-analysis",
        "spss-alternative",
        "hypothesis-testing"
    ],
    "alternativeTo": [
        "IBM SPSS Statistics",
        "Minitab"
    ],
    "relatedResources": [
        "gretl",
        "r-project"
    ]
}),

  unverified({
    "slug": "sympy",
    "name": "SymPy",
    "shortDescription": "Open-source Python library for symbolic mathematics, computer algebra, and calculus.",
    "longDescription": "SymPy is a full-featured Python library for symbolic mathematics. It performs algebraic simplification, calculus, differential equations, linear algebra, discrete mathematics, and advanced computational physics entirely in pure Python without external proprietary dependencies.",
    "whyListed": "The foundational open-source Python computer algebra system for symbolic mathematics and scientific modeling.",
    "category": "mathematics",
    "subcategories": [
        "science",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.sympy.org",
    "sourceUrl": "https://github.com/sympy/sympy",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "BSD-3-Clause",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Symbolic calculus (derivatives, integrals, limits, series)",
        "Algebraic equation and system solving",
        "Matrix manipulation and linear algebra",
        "LaTeX output formatting and code generation (C, Fortran)",
        "Pure Python library with zero mandatory dependencies"
    ],
    "tags": [
        "symbolic-math",
        "computer-algebra",
        "python",
        "calculus",
        "mathematics"
    ],
    "alternativeTo": [
        "Wolfram Mathematica",
        "Maple"
    ],
    "relatedResources": [
        "maxima",
        "scilab"
    ]
}),

  unverified({
    "slug": "mattermost",
    "name": "Mattermost",
    "shortDescription": "Open-source secure collaboration and developer messaging platform for technical teams.",
    "longDescription": "Mattermost is an open-source collaboration platform designed for technical and engineering teams with high security requirements. It provides 1:1 and channel messaging, voice calls, structured playbooks for incident response, and Kanban boards on self-hosted servers.",
    "whyListed": "A privacy-first, self-hostable team communication and incident management hub built specifically for technical operations.",
    "category": "collaboration",
    "subcategories": [
        "communication",
        "project-management"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://mattermost.com",
    "sourceUrl": "https://github.com/mattermost/mattermost",
    "pricingUrl": "https://mattermost.com/pricing",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later / MIT",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER",
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID",
        "IOS"
    ],
    "downloadAvailable": true,
    "features": [
        "Organized channel and direct messaging",
        "Integrated audio calling and screen sharing",
        "Incident response playbooks and checklists",
        "Integrated project boards (Boards)",
        "Deep developer integrations (GitLab, GitHub, Jira)"
    ],
    "tags": [
        "team-chat",
        "developer-collaboration",
        "self-hosted-messaging",
        "incident-management",
        "collaboration"
    ],
    "alternativeTo": [
        "Slack",
        "Microsoft Teams"
    ],
    "relatedResources": [
        "zulip",
        "matrix-org",
        "docuseal"
    ]
}),

  unverified({
    "slug": "affine",
    "name": "AFFiNE",
    "shortDescription": "Next-generation open-source workspace combining notes, docs, and whiteboard canvases.",
    "longDescription": "AFFiNE is an open-source, local-first workspace that merges structured text documents with infinite whiteboard canvases. It allows teams and individuals to brainstorm, plan projects, write knowledge bases, and visualize ideas with offline-first data synchronization.",
    "whyListed": "Merges visual whiteboarding and structured markdown documentation into an open-source, local-first workspace.",
    "category": "collaboration",
    "subcategories": [
        "productivity",
        "documents"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://affine.pro",
    "sourceUrl": "https://github.com/toeverything/AFFiNE",
    "pricingUrl": "https://affine.pro/pricing",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MPL-2.0",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "BROWSER",
        "SELF_HOSTED"
    ],
    "downloadAvailable": true,
    "features": [
        "Dual doc and infinite canvas view modes",
        "Local-first data storage with CRDT sync",
        "Multi-modal block-based editor",
        "Self-hostable backend support",
        "Export to Markdown, HTML, and PDF"
    ],
    "tags": [
        "workspace",
        "whiteboard",
        "note-taking",
        "local-first",
        "collaboration"
    ],
    "alternativeTo": [
        "Notion",
        "Miro",
        "Mural"
    ],
    "relatedResources": [
        "obsidian",
        "logseq",
        "nocodb"
    ]
}),

  unverified({
    "slug": "nocodb",
    "name": "NocoDB",
    "shortDescription": "Open-source smart spreadsheet database alternative to Airtable connecting to any SQL database.",
    "longDescription": "NocoDB is an open-source no-code platform that transforms any relational database (PostgreSQL, MySQL, SQLite, SQL Server) into a smart collaborative spreadsheet. It allows teams to build grid views, Kanban boards, forms, and automated workflows on top of their existing data.",
    "whyListed": "Turns existing production SQL databases into collaborative no-code spreadsheet interfaces without vendor lock-in.",
    "category": "collaboration",
    "subcategories": [
        "databases",
        "business-finance"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://nocodb.com",
    "sourceUrl": "https://github.com/nocodb/nocodb",
    "pricingUrl": "https://nocodb.com/pricing",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Spreadsheet interface over existing SQL databases",
        "Grid, Gallery, Kanban, and Form views",
        "Role-based access control and team sharing",
        "Automated webhook and email triggers",
        "REST API generation from database schemas"
    ],
    "tags": [
        "no-code-database",
        "airtable-alternative",
        "spreadsheet-database",
        "sql-interface",
        "self-hosted"
    ],
    "alternativeTo": [
        "Airtable",
        "Smartsheet"
    ],
    "relatedResources": [
        "baserow",
        "rows"
    ]
}),

  unverified({
    "slug": "formbricks",
    "name": "Formbricks",
    "shortDescription": "Open-source survey suite and user experience feedback platform for digital products.",
    "longDescription": "Formbricks is an open-source micro-survey and user feedback platform. It allows product teams and web developers to create in-app surveys, link forms, and customer satisfaction workflows targeted to specific user actions without third-party tracking scripts.",
    "whyListed": "Enables product teams to gather targeted in-app user feedback with complete privacy control and self-hosting options.",
    "category": "marketing",
    "subcategories": [
        "analytics",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://formbricks.com",
    "sourceUrl": "https://github.com/formbricks/formbricks",
    "pricingUrl": "https://formbricks.com/pricing",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "In-app and website micro-surveys",
        "Targeted event triggers and user segmentation",
        "No-code survey builder interface",
        "Privacy-compliant response collection",
        "Native integrations with Slack, Zapier, and webhooks"
    ],
    "tags": [
        "surveys",
        "user-feedback",
        "product-analytics",
        "customer-experience",
        "self-hosted"
    ],
    "alternativeTo": [
        "Typeform",
        "SurveyMonkey",
        "Hotjar Surveys"
    ],
    "relatedResources": [
        "docuseal",
        "mattermost"
    ]
}),

  unverified({
    "slug": "kresus",
    "name": "Kresus",
    "shortDescription": "Self-hosted personal finance manager that connects to banks securely without external servers.",
    "longDescription": "Kresus is an open-source personal finance management application that you host yourself. It connects securely to financial institutions via open scrapers (such as Woob), categorizes transactions automatically, monitors account balances, and sends alerts for unexpected charges.",
    "whyListed": "Allows individuals to automate bank synchronization and personal finance tracking entirely on their own hardware.",
    "category": "personal-finance",
    "subcategories": [
        "personal",
        "utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://kresus.org",
    "sourceUrl": "https://framagit.org/kresusapp/kresus",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Automatic bank transaction synchronization",
        "Transaction auto-categorization and tagging",
        "Customizable balance alerts and notifications",
        "Interactive spending charts and reports",
        "Data export in OFX and CSV formats"
    ],
    "tags": [
        "personal-finance",
        "bank-sync",
        "self-hosted",
        "money-management",
        "privacy"
    ],
    "alternativeTo": [
        "Mint",
        "Bankin"
    ],
    "relatedResources": [
        "firefly-iii",
        "actual-budget"
    ]
}),

  unverified({
    "slug": "colour-contrast-analyser",
    "name": "Colour Contrast Analyser",
    "shortDescription": "Desktop tool for Windows and macOS to verify visual color contrast against WCAG guidelines.",
    "longDescription": "The Colour Contrast Analyser (CCA) by TPGi is a free desktop tool that helps designers and developers check the foreground and background color combinations of text and visual elements. It determines WCAG 2.1 AA and AAA compliance and includes a real-time screen eyedropper.",
    "whyListed": "The standard desktop accessibility tool for verifying digital contrast ratios and color-blindness simulation.",
    "category": "utilities",
    "subcategories": [
        "design",
        "testing"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://www.tpgi.com/color-contrast-checker/",
    "sourceUrl": "https://github.com/ThePacielloGroup/CCAe",
    "freeStatus": "FREE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS"
    ],
    "downloadAvailable": true,
    "features": [
        "WCAG 2.1 Level AA and AAA pass/fail indicator",
        "Screen color picker eyedropper tool",
        "Color blindness simulation filters (protanopia, deuteranopia)",
        "Support for alpha transparency calculation",
        "RGB, HEX, and HSL color space support"
    ],
    "tags": [
        "accessibility",
        "color-contrast",
        "wcag",
        "a11y",
        "design-tools"
    ],
    "alternativeTo": [
        "Stark Premium"
    ],
    "relatedResources": [
        "axe-devtools",
        "pa11y"
    ]
}),

  unverified({
    "slug": "read-aloud",
    "name": "Read Aloud",
    "shortDescription": "Open-source text-to-speech voice reader browser extension for articles, PDFs, and documents.",
    "longDescription": "Read Aloud is an open-source text-to-speech browser extension that reads aloud web pages, news articles, blog posts, textbooks, and PDF documents. It supports dozens of languages, keyboard shortcuts, and multiple voice synthesis engines for users with dyslexia or visual fatigue.",
    "whyListed": "A lightweight, privacy-respecting browser extension providing text-to-speech for web accessibility and hands-free reading.",
    "category": "study-tools",
    "subcategories": [
        "utilities",
        "learning"
    ],
    "resourceType": "UTILITY",
    "officialUrl": "https://readaloud.app",
    "sourceUrl": "https://github.com/ken107/read-aloud",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "One-click text-to-speech for web articles and PDFs",
        "Support for 40+ languages and native browser voices",
        "Customizable reading speed, pitch, and voice selection",
        "Text highlighting synced with speech",
        "Zero user tracking or telemetry"
    ],
    "tags": [
        "text-to-speech",
        "accessibility",
        "screen-reader",
        "dyslexia-tool",
        "audio-reading"
    ],
    "alternativeTo": [
        "Speechify",
        "NaturalReader"
    ],
    "relatedResources": [
        "nvda",
        "opendyslexic"
    ]
}),

  unverified({
    "slug": "dasher",
    "name": "Dasher",
    "shortDescription": "Information-efficient text-entry interface driven by continuous natural pointing gestures.",
    "longDescription": "Dasher is an open-source assistive text-entry system developed at the University of Cambridge and maintained by the Ace Centre. Driven by natural pointing gestures (eye-tracker, head-mouse, joystick, or mouse), it enables fast text composition for individuals who cannot use physical keyboards.",
    "whyListed": "A proven, highly efficient assistive communication tool allowing continuous text entry through gaze tracking and pointing gestures.",
    "category": "utilities",
    "subcategories": [
        "personal",
        "communication"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://dasher.acecentre.net",
    "sourceUrl": "https://github.com/dasher-project/dasher",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-2.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Gesture-driven dynamic zooming text entry",
        "Compatible with eye-trackers, head-trackers, and mice",
        "Predictive language model for high-speed typing",
        "Multi-language dictionary support",
        "Speech synthesis output integration"
    ],
    "tags": [
        "assistive-technology",
        "aac",
        "eye-tracking",
        "accessibility",
        "text-entry"
    ],
    "alternativeTo": [
        "Grid 3",
        "Tobii Communicator"
    ],
    "relatedResources": [
        "optikey",
        "nvda"
    ]
}),

  unverified({
    "slug": "doab",
    "name": "DOAB",
    "shortDescription": "Directory of Open Access Books providing access to peer-reviewed academic monographs.",
    "longDescription": "The Directory of Open Access Books (DOAB) is a community-driven discovery service that indexes and provides open access to scholarly, peer-reviewed monographs and academic books from international university presses and academic publishers.",
    "whyListed": "The premier global index for legally free, peer-reviewed academic textbooks and research monographs across all disciplines.",
    "category": "books",
    "subcategories": [
        "research",
        "learning"
    ],
    "resourceType": "BOOK",
    "officialUrl": "https://www.doabooks.org",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Index of 80,000+ peer-reviewed academic books",
        "Direct PDF and EPUB open downloads",
        "Subject classification across humanities, sciences, and social sciences",
        "Verified open licensing (Creative Commons)",
        "API and OAI-PMH metadata harvesting protocols"
    ],
    "tags": [
        "open-access",
        "academic-books",
        "textbooks",
        "peer-reviewed",
        "monographs"
    ],
    "alternativeTo": [
        "JSTOR Books Paywall"
    ],
    "relatedResources": [
        "doaj",
        "internet-archive"
    ]
}),

  unverified({
    "slug": "gcompris",
    "name": "GCompris",
    "shortDescription": "High-quality educational software suite with hundreds of activities for children aged 2 to 10.",
    "longDescription": "GCompris is an open-source educational software suite part of the KDE project. It provides over 150 interactive activities covering mathematics, science, reading, geography, typing, chess, and logical puzzles designed for early childhood and elementary classrooms.",
    "whyListed": "An ad-free, tracker-free open educational suite used worldwide in elementary schools and offline learning centers.",
    "category": "learning",
    "subcategories": [
        "study-tools",
        "games"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://gcompris.net",
    "sourceUrl": "https://invent.kde.org/education/gcompris",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "GPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "ANDROID"
    ],
    "downloadAvailable": true,
    "features": [
        "150+ educational learning games and activities",
        "Curriculum modules for math, geography, reading, and logic",
        "Kid-safe interface with no advertising or telemetry",
        "Multi-language voice prompts and translations",
        "Runs completely offline on low-spec hardware"
    ],
    "tags": [
        "kids-learning",
        "elementary-education",
        "kde-education",
        "educational-games",
        "offline-learning"
    ],
    "alternativeTo": [
        "ABCmouse",
        "BrainPOP"
    ],
    "relatedResources": [
        "tuxpaint",
        "anki"
    ]
}),

  unverified({
    "slug": "allen-brain-map",
    "name": "Allen Brain Map",
    "shortDescription": "Open-access digital brain atlases, neurobiology datasets, and cell-type databases.",
    "longDescription": "The Allen Brain Map is a portal of open-access research datasets, anatomical brain atlases, and cellular neurobiology databases created by the Allen Institute for Brain Science. It provides high-resolution gene expression data, single-cell transcriptomics, and neural connectivity maps for neuroscience research.",
    "whyListed": "An indispensable open scientific archive providing cellular-resolution mammalian brain atlases and transcriptomic datasets.",
    "category": "research",
    "subcategories": [
        "science",
        "learning"
    ],
    "resourceType": "DATASET",
    "officialUrl": "https://portal.brain-map.org",
    "freeStatus": "FREE",
    "openSource": false,
    "license": "Allen Institute Open Access Terms",
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Interactive 3D anatomical reference atlases",
        "Single-cell RNA-seq brain cell type data",
        "Neural connectivity and electrophysiology maps",
        "Human and mouse brain gene expression databases",
        "Python API (AllenSDK) for programmatic data access"
    ],
    "tags": [
        "neuroscience",
        "brain-atlas",
        "transcriptomics",
        "genomics",
        "open-science"
    ],
    "alternativeTo": [
        "Proprietary Neuroscience Atlases"
    ],
    "relatedResources": [
        "bioconductor",
        "cytoscape"
    ]
}),

  unverified({
    "slug": "scielo",
    "name": "SciELO",
    "shortDescription": "Open-access digital library of scientific journals across Latin America, Spain, and South Africa.",
    "longDescription": "SciELO (Scientific Electronic Library Online) is an electronic library providing open access to full-text scientific journals published across Latin America, Spain, Portugal, and South Africa. It covers medicine, agriculture, engineering, and social sciences with multi-lingual search.",
    "whyListed": "The landmark regional open-access publisher connecting researchers to peer-reviewed scientific scholarship from the Global South.",
    "category": "research",
    "subcategories": [
        "science",
        "books"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://scielo.org",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "1,800+ open-access peer-reviewed scientific journals",
        "Full-text articles in Spanish, Portuguese, and English",
        "Bibliometric citation and journal impact statistics",
        "Advanced subject-matter and author searching",
        "Direct XML and PDF article downloads"
    ],
    "tags": [
        "open-access",
        "latin-america",
        "scientific-journals",
        "global-south",
        "scholarly-research"
    ],
    "alternativeTo": [
        "Elsevier ScienceDirect Paywall"
    ],
    "relatedResources": [
        "doaj",
        "core-ac-uk",
        "doab"
    ]
}),

  unverified({
    "slug": "cinii-research",
    "name": "CiNii Research",
    "shortDescription": "Japanese academic literature database indexing research papers, books, and dissertations.",
    "longDescription": "CiNii Research is an academic information service operated by the National Institute of Informatics (NII) in Japan. It searches and aggregates millions of Japanese scholarly articles, university institutional repositories, doctoral dissertations, and research project grants.",
    "whyListed": "The primary discovery portal for Japanese academic papers, university research repositories, and doctoral dissertations.",
    "category": "research",
    "subcategories": [
        "learning",
        "books"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://cir.nii.ac.jp",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Comprehensive index of Japanese scholarly articles",
        "Full-text access to institutional repositories and dissertations",
        "Integrated research grant and project data (KAKEN)",
        "Author disambiguation and research entity profiles",
        "Open API for bibliographical metadata harvesting"
    ],
    "tags": [
        "japan-research",
        "academic-database",
        "dissertations",
        "open-access",
        "scholarly-articles"
    ],
    "alternativeTo": [
        "CiNii Paid Subscriptions"
    ],
    "relatedResources": [
        "core-ac-uk",
        "doab"
    ]
}),

  unverified({
    "slug": "core-ac-uk",
    "name": "CORE",
    "shortDescription": "World's largest aggregator of open access research papers from repositories and journals.",
    "longDescription": "CORE (COnnecting REpositories) is a global non-profit service managed by The Open University and Jisc. It aggregates and indexes millions of open-access research papers from thousands of institutional repositories and academic journals, offering full-text search and analytical tools.",
    "whyListed": "Aggregates over 200 million open-access scientific publications from universities worldwide in a single searchable index.",
    "category": "research",
    "subcategories": [
        "learning",
        "books"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://core.ac.uk",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Search over 200M+ open access research papers",
        "Direct full-text PDF download links",
        "Repository metadata synchronization and validation",
        "Researcher citation lookup and recommendations",
        "Open API for text and data mining"
    ],
    "tags": [
        "open-access",
        "research-papers",
        "academic-search",
        "institutional-repositories",
        "science"
    ],
    "alternativeTo": [
        "Scopus",
        "Web of Science"
    ],
    "relatedResources": [
        "doab",
        "scielo",
        "hal-science"
    ]
}),

  unverified({
    "slug": "hal-science",
    "name": "HAL Open Science",
    "shortDescription": "French multidisciplinary open-access archive for depositing and sharing scientific research.",
    "longDescription": "HAL (Hyper Articles en Ligne) is the national multidisciplinary open-access archive in France, maintained by the CNRS, Inria, and universities. It allows researchers to deposit and share preprints, published articles, dissertations, and conference proceedings across all scientific disciplines.",
    "whyListed": "France's national digital open-science repository hosting over a million full-text research articles and doctoral theses.",
    "category": "research",
    "subcategories": [
        "science",
        "learning"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://hal.science",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Multidisciplinary open research archive",
        "Full-text access to 1M+ scientific articles and theses",
        "Permanent DOI and citation tracking for preprints",
        "Institutional portals for European research institutes",
        "OAI-PMH metadata interoperability"
    ],
    "tags": [
        "open-science",
        "france-research",
        "preprints",
        "scientific-archive",
        "academic-repository"
    ],
    "alternativeTo": [
        "ResearchGate",
        "Academia.edu"
    ],
    "relatedResources": [
        "core-ac-uk",
        "arxiv",
        "persee"
    ]
}),

  unverified({
    "slug": "ajol",
    "name": "African Journals Online",
    "shortDescription": "Largest online digital library of peer-reviewed, African-published scholarly research journals.",
    "longDescription": "African Journals Online (AJOL) is the world's largest digital repository of peer-reviewed, published scholarly journals originating from the African continent. It provides access to research in medicine, agriculture, biodiversity, and African social sciences.",
    "whyListed": "A crucial open knowledge portal increasing the global visibility of African scientific and developmental research.",
    "category": "research",
    "subcategories": [
        "science",
        "learning"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://www.ajol.info",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "600+ peer-reviewed African research journals",
        "Open access to thousands of full-text articles",
        "Coverage across 30+ African nations",
        "Subject categories in health, agriculture, and humanities",
        "Journal quality assessment and indexing"
    ],
    "tags": [
        "african-research",
        "open-access",
        "scholarly-journals",
        "global-health",
        "academic-library"
    ],
    "alternativeTo": [
        "JSTOR African Studies Paywall"
    ],
    "relatedResources": [
        "doaj",
        "scielo",
        "core-ac-uk"
    ]
}),

  unverified({
    "slug": "persee",
    "name": "Persée",
    "shortDescription": "Open-access digital library of academic journals in the humanities and social sciences.",
    "longDescription": "Persée is a French open-access digital library created by the Ministry of Higher Education and Research. It digitizes and publishes complete retrospective collections of academic journals in archaeology, anthropology, history, linguistics, and philosophy with full-text search.",
    "whyListed": "Provides comprehensive, freely accessible retrospective archives of premier European humanities and social science journals.",
    "category": "research",
    "subcategories": [
        "books",
        "learning"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://www.persee.fr",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Complete back-catalogs of 350+ scholarly journals",
        "High-resolution OCR scanned pages and text",
        "Advanced search by author, period, and discipline",
        "Direct PDF download with complete citation info",
        "Semantic web data access via SPARQL endpoint"
    ],
    "tags": [
        "humanities",
        "social-sciences",
        "digital-archive",
        "french-scholarship",
        "open-access"
    ],
    "alternativeTo": [
        "JSTOR Arts & Sciences"
    ],
    "relatedResources": [
        "hal-science",
        "doab"
    ]
}),

  unverified({
    "slug": "chemrxiv",
    "name": "ChemRxiv",
    "shortDescription": "Premier open-access preprint repository for chemical and related scientific disciplines.",
    "longDescription": "ChemRxiv is a free submission and distribution service for unpublished preprints in chemistry, chemical engineering, and materials science. Co-operated by the ACS, RSC, GDCh, and chemical societies worldwide, it allows chemists to share findings prior to formal peer review.",
    "whyListed": "The premier global open preprint server accelerating dissemination of findings across all branches of chemical science.",
    "category": "research",
    "subcategories": [
        "science",
        "learning"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://chemrxiv.org",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Free preprint submissions and downloads",
        "Fast editorial screening and DOI assignment",
        "Version history tracking for research revisions",
        "Linked peer-reviewed final publication DOIs",
        "Direct integration with major chemistry journals"
    ],
    "tags": [
        "chemistry",
        "preprints",
        "chemical-sciences",
        "open-access",
        "materials-chemistry"
    ],
    "alternativeTo": [
        "Paywalled Chemistry Proceedings"
    ],
    "relatedResources": [
        "arxiv",
        "cantera",
        "dwsim"
    ]
}),

  unverified({
    "slug": "global-fishing-watch",
    "name": "Global Fishing Watch",
    "shortDescription": "Open data platform tracking global commercial fishing activity and vessel monitoring.",
    "longDescription": "Global Fishing Watch is an international non-profit research platform that uses satellite tracking, machine learning, and vessel AIS data to map global commercial fishing activity in near real-time. It provides open datasets and APIs for marine conservation and ocean governance.",
    "whyListed": "Provides transparent, global satellite datasets on ocean activity to support marine conservation research and public governance.",
    "category": "science",
    "subcategories": [
        "research",
        "maps"
    ],
    "resourceType": "DATASET",
    "officialUrl": "https://globalfishingwatch.org",
    "freeStatus": "FREE",
    "openSource": false,
    "license": "CC-BY-SA-4.0",
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Near real-time global fishing vessel tracking map",
        "Public datasets on vessel identity and fishing effort",
        "Marine protected area activity monitoring",
        "Public REST APIs for research querying",
        "Carrier vessel and transshipment tracking data"
    ],
    "tags": [
        "marine-conservation",
        "ocean-data",
        "satellite-tracking",
        "open-data",
        "environmental-science"
    ],
    "alternativeTo": [
        "Commercial Marine Traffic Feeds"
    ],
    "relatedResources": [
        "gbif",
        "openstreetmap"
    ]
}),

  unverified({
    "slug": "emsc-csem",
    "name": "EMSC",
    "shortDescription": "Real-time global earthquake information, seismic data feeds, and tsunami warning alerts.",
    "longDescription": "The European-Mediterranean Seismological Centre (EMSC) operates a real-time global earthquake monitoring and seismic data distribution service. It aggregates data from 85+ seismic networks worldwide, providing open earthquake catalogs, citizen science reports, and WebSocket seismic feeds.",
    "whyListed": "Delivers independent, real-time open seismic alerts and global earthquake scientific data feeds.",
    "category": "science",
    "subcategories": [
        "weather",
        "research"
    ],
    "resourceType": "DATASET",
    "officialUrl": "https://www.emsc-csem.org",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER",
        "ANDROID",
        "IOS"
    ],
    "features": [
        "Real-time global earthquake location and magnitude alerts",
        "Citizen-contributed 'felt report' maps",
        "Comprehensive historical earthquake database",
        "Public GeoJSON and WebSocket real-time seismic APIs",
        "Tsunami warning and impact assessments"
    ],
    "tags": [
        "earthquakes",
        "seismology",
        "geophysics",
        "real-time-alerts",
        "open-science"
    ],
    "alternativeTo": [
        "Proprietary Seismic Feeds"
    ],
    "relatedResources": [
        "usgs-earthexplorer",
        "open-meteo"
    ]
}),

  unverified({
    "slug": "agmarknet",
    "name": "Agmarknet",
    "shortDescription": "Agricultural marketing portal by Government of India providing daily mandi commodity prices.",
    "longDescription": "Agmarknet (Agricultural Marketing Information Network) is a portal developed by the Directorate of Marketing & Inspection, Ministry of Agriculture, Government of India. It connects agricultural produce markets (mandis) across India to publish daily commodity arrival figures and minimum, maximum, and modal prices.",
    "whyListed": "Provides daily official wholesale agricultural prices and commodity market arrival data for farmers and researchers across India.",
    "category": "business-finance",
    "subcategories": [
        "learning",
        "research"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://agmarknet.gov.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Daily mandi wholesale prices across all Indian states",
        "Commodity-wise arrival and price trend reports",
        "Historical agricultural commodity price trends",
        "Market profile directories for APMC mandis",
        "Public agricultural data reports"
    ],
    "tags": [
        "agriculture-india",
        "mandi-prices",
        "commodity-prices",
        "farmers",
        "government-portal"
    ],
    "alternativeTo": [
        "Private Agricultural Trade Feeds"
    ],
    "relatedResources": [
        "enam",
        "data-karnataka"
    ]
}),

  unverified({
    "slug": "enam",
    "name": "eNAM",
    "shortDescription": "National Agriculture Market electronic trading portal networking APMC mandis across India.",
    "longDescription": "eNAM (National Agriculture Market) is a pan-India electronic trading portal launched by the Government of India. It networks existing APMC mandis to create a unified national market for agricultural commodities, providing farmers with transparent price discovery and online auctioning.",
    "whyListed": "Unifies agricultural marketing across Indian states with real-time electronic bidding and transparent market rates.",
    "category": "business-finance",
    "subcategories": [
        "learning",
        "lifestyle"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://www.enam.gov.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER",
        "ANDROID"
    ],
    "features": [
        "Electronic auctioning and price discovery for farmers",
        "Unified mandi market rates across 1,000+ markets",
        "Commodity quality assaying parameters",
        "Direct online payment settlement for farm produce",
        "Mobile app for farmers and traders"
    ],
    "tags": [
        "agriculture",
        "electronic-mandi",
        "farmers-market",
        "india-agriculture",
        "commodity-trading"
    ],
    "alternativeTo": [
        "Traditional Middlemen Networks"
    ],
    "relatedResources": [
        "agmarknet",
        "data-karnataka"
    ]
}),

  unverified({
    "slug": "vidwan",
    "name": "Vidwan",
    "shortDescription": "Premier database of Indian scientists, researchers, and faculty profiles by INFLIBNET.",
    "longDescription": "Vidwan is the premier database of profiles of scientists, researchers, and faculty members working in leading academic institutions and R&D organizations across India. Developed by the INFLIBNET Centre, it provides verified academic profiles, publication records, and citation metrics.",
    "whyListed": "The authoritative national registry for discovering academic expertise, peer reviewers, and scientific research networks in India.",
    "category": "research",
    "subcategories": [
        "learning",
        "career"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://vidwan.inflibnet.ac.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Profiles of 150,000+ Indian researchers and experts",
        "Direct linkage to ORCID and Scopus publication records",
        "Expertise search across science, engineering, and humanities",
        "Peer-reviewer discovery for national funding bodies",
        "Institutional faculty analytics and collaboration networks"
    ],
    "tags": [
        "indian-researchers",
        "faculty-database",
        "inflibnet",
        "academic-profiles",
        "experts-registry"
    ],
    "alternativeTo": [
        "Elsevier Pure Profiles"
    ],
    "relatedResources": [
        "shodhganga",
        "ias-open-access"
    ]
}),

  unverified({
    "slug": "data-karnataka",
    "name": "Karnataka Open Data",
    "shortDescription": "Open government data portal of Karnataka providing datasets across state departments.",
    "longDescription": "The Karnataka Open Data Portal (data.karnataka.gov.in) is the official open data repository maintained by the Centre for e-Governance, Government of Karnataka. It publishes high-value machine-readable datasets covering agriculture, education, transport, public health, and municipal governance.",
    "whyListed": "Provides public machine-readable state government datasets from Karnataka for open civic technology and research.",
    "category": "research",
    "subcategories": [
        "utilities",
        "learning"
    ],
    "resourceType": "DATASET",
    "officialUrl": "https://data.karnataka.gov.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Machine-readable state datasets (CSV, JSON, XML)",
        "Departmental data across agriculture, health, and transport",
        "Open civic technology data access",
        "Visual charts and data visualizations",
        "API endpoints for automated dataset extraction"
    ],
    "tags": [
        "open-data",
        "karnataka",
        "state-government",
        "civic-tech",
        "public-datasets"
    ],
    "alternativeTo": [
        "Proprietary State Market Reports"
    ],
    "relatedResources": [
        "data-gov-in",
        "agmarknet"
    ]
}),

  unverified({
    "slug": "csir-niscpr",
    "name": "CSIR NIScPR Journals",
    "shortDescription": "Open-access peer-reviewed Indian scientific journals published by CSIR-NIScPR.",
    "longDescription": "The National Institute of Science Communication and Policy Research (CSIR-NIScPR) publishes over a dozen diamond open-access research journals. Covering Indian traditional knowledge, chemical technology, radio physics, biotechnology, and experimental biology, articles are freely accessible online.",
    "whyListed": "Provides immediate open access to premier peer-reviewed Indian scientific and technological research journals.",
    "category": "science",
    "subcategories": [
        "research",
        "learning"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://www.niscpr.res.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "15+ peer-reviewed scientific journals",
        "Journal of Traditional Knowledge (IJTK) full text",
        "Indian Journal of Chemical Technology & Biotechnology",
        "Free full-text PDF downloads without author fees",
        "Indexed in major international abstracting services"
    ],
    "tags": [
        "indian-science",
        "csir",
        "open-access-journals",
        "scientific-research",
        "traditional-knowledge"
    ],
    "alternativeTo": [
        "Commercial Science Publishers"
    ],
    "relatedResources": [
        "ias-open-access",
        "shodhganga"
    ]
}),

  unverified({
    "slug": "malayalam-lexicon",
    "name": "Malayalam Lexicon",
    "shortDescription": "Digital repository and linguistic database of Malayalam literature and terminology.",
    "longDescription": "The Malayalam Lexicon, developed by the University of Kerala and the Government of Kerala, is a monumental digital linguistic repository. It documents the evolution, etymology, meanings, and dialectal variations of the Malayalam language from ancient inscriptions to modern usage.",
    "whyListed": "The definitive cultural and linguistic digital dictionary and lexicographical database for the Malayalam language.",
    "category": "languages",
    "subcategories": [
        "books",
        "research"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://malayalamlexicon.kerala.gov.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "Comprehensive Malayalam etymological dictionary",
        "Historical and classical word origins and citations",
        "Searchable database across all volumes",
        "Cultural and dialectal linguistic documentation",
        "Freely accessible digital public resource"
    ],
    "tags": [
        "malayalam",
        "indian-languages",
        "lexicon",
        "dictionary",
        "kerala-heritage"
    ],
    "alternativeTo": [
        "Commercial Language Dictionaries"
    ],
    "relatedResources": [
        "tamil-virtual-academy",
        "muktabodha"
    ]
}),

  unverified({
    "slug": "muktabodha",
    "name": "Muktabodha",
    "shortDescription": "Digital library preserving rare Sanskrit manuscripts and classical philosophical texts.",
    "longDescription": "The Muktabodha Indological Research Institute is a non-profit digital library dedicated to preserving endangered Sanskrit texts. It offers high-resolution digital scans and searchable e-texts of rare manuscripts in Shaivism, Tantra, Yoga, and Vedic philosophy.",
    "whyListed": "Preserves and freely provides searchable digital access to rare, vulnerable Sanskrit manuscripts and classical philosophical treatises.",
    "category": "books",
    "subcategories": [
        "languages",
        "research"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://muktabodha.org",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "downloadAvailable": true,
    "features": [
        "Searchable Sanskrit e-text digital library",
        "High-resolution scanned palm-leaf and paper manuscripts",
        "Transliterated texts in Roman and Devanagari scripts",
        "Kashmir Shaivism and Agama manuscript collections",
        "Free scholarly access for researchers and students"
    ],
    "tags": [
        "sanskrit",
        "manuscripts",
        "digital-library",
        "indian-philosophy",
        "classical-texts"
    ],
    "alternativeTo": [
        "Gated Indology Manuscript Archives"
    ],
    "relatedResources": [
        "malayalam-lexicon",
        "doab"
    ]
}),

  unverified({
    "slug": "ias-open-access",
    "name": "Indian Academy of Sciences Journals",
    "shortDescription": "Open-access peer-reviewed scientific journals published by the Indian Academy of Sciences.",
    "longDescription": "The Indian Academy of Sciences (IASc), founded by Sir C.V. Raman, publishes open-access, peer-reviewed scientific journals across physics, chemistry, mathematics, earth sciences, and biology (including Pramana, Sadhana, and the Journal of Biosciences).",
    "whyListed": "Provides diamond open access to India's premier scientific academy research journals with zero author or reader charges.",
    "category": "science",
    "subcategories": [
        "research",
        "mathematics"
    ],
    "resourceType": "WEBSITE",
    "officialUrl": "https://www.ias.ac.in",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "BROWSER"
    ],
    "features": [
        "12+ diamond open access peer-reviewed journals",
        "Pramana (Journal of Physics) & Sadhana (Engineering)",
        "Journal of Biosciences & Journal of Chemical Sciences",
        "Free full-text PDF downloads dating back decades",
        "Resonance journal for science education"
    ],
    "tags": [
        "indian-academy-of-sciences",
        "scientific-journals",
        "open-access",
        "physics",
        "peer-reviewed"
    ],
    "alternativeTo": [
        "Paywalled Engineering & Physics Journals"
    ],
    "relatedResources": [
        "csir-niscpr",
        "vidwan"
    ]
}),

  unverified({
    "slug": "k6",
    "name": "k6",
    "shortDescription": "Open-source developer-centric load and performance testing tool for APIs and microservices.",
    "longDescription": "k6 by Grafana Labs is an open-source load testing tool designed for engineering teams. Written in Go with a JavaScript scripting runtime, it allows developers to write performance tests as code, run them locally or in CI/CD pipelines, and catch performance regressions early.",
    "whyListed": "The modern developer-friendly standard for API and microservice load testing with JavaScript test scripts.",
    "category": "testing",
    "subcategories": [
        "developer-utilities",
        "apis"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://k6.io",
    "sourceUrl": "https://github.com/grafana/k6",
    "pricingUrl": "https://k6.io/pricing",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "AGPL-3.0-or-later",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Load tests written in modern JavaScript/TypeScript",
        "High performance CLI engine with low memory footprint",
        "HTTP/1.1, HTTP/2, WebSockets, and gRPC protocol testing",
        "Direct output to Prometheus, Datadog, and Grafana",
        "Automated performance threshold checks in CI"
    ],
    "tags": [
        "load-testing",
        "performance-testing",
        "api-testing",
        "developer-tools",
        "grafana"
    ],
    "alternativeTo": [
        "JMeter",
        "LoadRunner",
        "Gatling Enterprise"
    ],
    "relatedResources": [
        "locust",
        "mockoon"
    ]
}),

  unverified({
    "slug": "locust",
    "name": "Locust",
    "shortDescription": "Scalable, open-source load testing framework where user behavior is defined in plain Python code.",
    "longDescription": "Locust is an open-source load testing tool where test scenarios and user interactions are written in standard Python code. It features a real-time web dashboard showing request latency and throughput, and can distribute load generation across thousands of worker machines.",
    "whyListed": "Enables developers to define complex, stateful load test behaviors using standard Python code with a live web UI.",
    "category": "testing",
    "subcategories": [
        "developer-utilities",
        "apis"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://locust.io",
    "sourceUrl": "https://github.com/locustio/locust",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Test scenario definitions in idiomatic Python",
        "Real-time web monitoring dashboard",
        "Distributed swarm load generation across machines",
        "Support for any HTTP, TCP, or custom protocol",
        "Fast execution with gevent coroutines"
    ],
    "tags": [
        "load-testing",
        "python",
        "performance",
        "benchmarking",
        "api-testing"
    ],
    "alternativeTo": [
        "Apache JMeter",
        "BlazeMeter"
    ],
    "relatedResources": [
        "k6",
        "mockoon"
    ]
}),

  unverified({
    "slug": "mockoon",
    "name": "Mockoon",
    "shortDescription": "Fast, open-source local mock API server desktop application for REST API development.",
    "longDescription": "Mockoon is an open-source visual application for designing and running local mock REST APIs. It requires no account, runs entirely on your local machine, and allows developers to configure custom endpoints, JSON response bodies, rules, proxies, and latency simulations in seconds.",
    "whyListed": "Provides an instant, local-first mock API server with no cloud setup or sign-in requirements.",
    "category": "developer-utilities",
    "subcategories": [
        "testing",
        "apis"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://mockoon.com",
    "sourceUrl": "https://github.com/mockoon/mockoon",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Local mock REST API server creation in seconds",
        "Dynamic templating with Faker.js data generation",
        "Automated route rules and latency simulation",
        "Proxy forwarding to real backend endpoints",
        "CLI runner for automated CI/CD pipelines"
    ],
    "tags": [
        "mock-server",
        "api-development",
        "rest-api",
        "testing-tools",
        "developer-utilities"
    ],
    "alternativeTo": [
        "Postman Mock Servers",
        "MockLab"
    ],
    "relatedResources": [
        "bruno",
        "k6",
        "yaak"
    ]
}),

  unverified({
    "slug": "yaak",
    "name": "Yaak",
    "shortDescription": "Fast, lightweight desktop REST, GraphQL, and gRPC client built in Rust.",
    "longDescription": "Yaak is an open-source desktop API client designed for speed and simplicity. Built in Rust and Tauri, it provides an ultra-fast, local-first interface to inspect, test, and debug REST endpoints, GraphQL queries, and WebSockets without heavy electron bloat.",
    "whyListed": "Delivers an ultra-responsive, local-first desktop API client with a small footprint built in Rust.",
    "category": "developer-utilities",
    "subcategories": [
        "apis",
        "testing"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://yaak.app",
    "sourceUrl": "https://github.com/mountain-loop/yaak",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Fast native performance with Rust and Tauri",
        "Support for REST, GraphQL, WebSockets, and gRPC",
        "Local-first storage with zero telemetry",
        "Environment variables and authentication presets",
        "Import from OpenAPI and Postman collections"
    ],
    "tags": [
        "api-client",
        "rest-client",
        "graphql",
        "rust",
        "developer-tools"
    ],
    "alternativeTo": [
        "Postman",
        "Insomnia"
    ],
    "relatedResources": [
        "bruno",
        "httpie-desktop",
        "mockoon"
    ]
}),

  unverified({
    "slug": "httpie-desktop",
    "name": "HTTPie Desktop",
    "shortDescription": "Modern visual API testing and development client with intuitive request workflows.",
    "longDescription": "HTTPie Desktop is a graphical API client from the creators of the popular HTTPie CLI. It features a clean, human-friendly interface for crafting HTTP requests, testing REST APIs, managing environment variables, and organizing API collections locally or with optional cloud sync.",
    "whyListed": "Brings the beloved human-friendly UX of the HTTPie command-line tool into a clean graphical desktop API client.",
    "category": "developer-utilities",
    "subcategories": [
        "apis",
        "testing"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://httpie.io",
    "pricingUrl": "https://httpie.io/pricing",
    "freeStatus": "FREE_TIER",
    "openSource": false,
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX",
        "BROWSER"
    ],
    "limitations": [
        "Free tier includes full visual API testing, local workspaces, and standard collections; advanced team sharing requires paid plan"
    ],
    "features": [
        "Human-friendly request builder and visual preview",
        "Automatic syntax highlighting and JSON formatting",
        "Environment variable management",
        "Command-line and desktop library synchronization",
        "Fast keyboard navigation and shortcuts"
    ],
    "tags": [
        "api-client",
        "http-client",
        "rest-api",
        "api-testing",
        "developer-utilities"
    ],
    "alternativeTo": [
        "Postman",
        "Paw"
    ],
    "relatedResources": [
        "yaak",
        "bruno"
    ]
}),

  unverified({
    "slug": "postgraphile",
    "name": "PostGraphile",
    "shortDescription": "Instant, performant GraphQL API generation from PostgreSQL database schemas.",
    "longDescription": "PostGraphile automatically creates a secure, highly performant GraphQL API from your PostgreSQL database schema. By leveraging PostgreSQL tables, views, computed columns, row-level security (RLS), and custom functions, it eliminates boilerplate API backend development.",
    "whyListed": "Instantly compiles a robust GraphQL API directly from PostgreSQL schemas with built-in row-level security.",
    "category": "apis",
    "subcategories": [
        "databases",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.graphile.org/postgraphile/",
    "sourceUrl": "https://github.com/graphile/crystal",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "SELF_HOSTED",
        "LINUX",
        "WINDOWS",
        "MACOS"
    ],
    "downloadAvailable": true,
    "features": [
        "Instant GraphQL API from PostgreSQL schemas",
        "Built-in PostgreSQL Row Level Security (RLS) support",
        "Automated CRUD queries, mutations, and subscriptions",
        "Extensible JavaScript/TypeScript plugin system",
        "Low latency with direct SQL query compilation"
    ],
    "tags": [
        "graphql",
        "postgresql",
        "api-generator",
        "backend",
        "developer-tools"
    ],
    "alternativeTo": [
        "Hasura Cloud",
        "Prisma"
    ],
    "relatedResources": [
        "supabase",
        "nocodb"
    ]
}),

  unverified({
    "slug": "lm-studio",
    "name": "LM Studio",
    "shortDescription": "Cross-platform desktop application to discover, download, and run local LLMs offline.",
    "longDescription": "LM Studio is a desktop application that lets you discover, download, and run open-weight language models (such as Llama, Mistral, Gemma, and DeepSeek) completely locally and offline on your computer. It includes a built-in chat interface and a local OpenAI-compatible API server.",
    "whyListed": "Makes running, benchmarking, and chatting with open-weight language models on consumer hardware accessible and offline.",
    "category": "ai-models",
    "subcategories": [
        "ai-chat",
        "developer-utilities"
    ],
    "resourceType": "DESKTOP_APP",
    "officialUrl": "https://lmstudio.ai",
    "freeStatus": "FREE",
    "openSource": false,
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "One-click model discovery and download from Hugging Face",
        "Hardware-accelerated GPU inference (Metal, CUDA, ROCm)",
        "Local OpenAI-compatible REST API server",
        "Model parameters and system prompt customization",
        "Completely offline and private execution"
    ],
    "tags": [
        "local-llm",
        "offline-ai",
        "hugging-face",
        "ai-chat",
        "model-runner"
    ],
    "alternativeTo": [
        "OpenAI ChatGPT Plus",
        "Claude Pro"
    ],
    "relatedResources": [
        "ollama",
        "lobe-chat"
    ]
}),

  unverified({
    "slug": "lobe-chat",
    "name": "LobeChat",
    "shortDescription": "Open-source modern AI chat framework supporting multiple model providers and plugins.",
    "longDescription": "LobeChat is an open-source, extensible chat application framework for AI language models. It supports multiple LLM providers (Ollama, OpenAI, Anthropic, Gemini, Groq), text-to-speech, multimodal vision models, agent marketplaces, and plugin ecosystems in a sleek modern interface.",
    "whyListed": "An open-source, beautifully designed AI conversation interface that connects to local and cloud models with plugin support.",
    "category": "ai-chat",
    "subcategories": [
        "ai-productivity",
        "developer-utilities"
    ],
    "resourceType": "WEB_APP",
    "officialUrl": "https://lobechat.com",
    "sourceUrl": "https://github.com/lobehub/lobe-chat",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "MIT",
    "platforms": [
        "SELF_HOSTED",
        "BROWSER",
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Multi-model provider support (local Ollama & cloud APIs)",
        "Visual plugin marketplace for web browsing and tools",
        "Text-to-speech voice synthesis and speech recognition",
        "Multimodal image recognition and document analysis",
        "Progressive Web App (PWA) and desktop apps"
    ],
    "tags": [
        "ai-chat",
        "llm-ui",
        "open-source-ai",
        "chatgpt-alternative",
        "local-ai"
    ],
    "alternativeTo": [
        "ChatGPT Plus",
        "Poe"
    ],
    "relatedResources": [
        "ollama",
        "lm-studio"
    ]
}),

  unverified({
    "slug": "continue-dev",
    "name": "Continue",
    "shortDescription": "Open-source AI code assistant extension for VS Code and JetBrains connecting to any model.",
    "longDescription": "Continue is the leading open-source AI code assistant extension for Visual Studio Code and JetBrains IDEs. It allows developers to generate, refactor, and explain code, create codebase embeddings for contextual search, and connect freely to any local or cloud LLM.",
    "whyListed": "An open-source AI coding assistant that gives developers full control over which models and data endpoints they use in their IDE.",
    "category": "ai-coding",
    "subcategories": [
        "code-editors",
        "developer-utilities"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://www.continue.dev",
    "sourceUrl": "https://github.com/continuedev/continue",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Apache-2.0",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Tab autocomplete and inline code generation",
        "Full codebase semantic indexing and context @-mentions",
        "Chat interface inside VS Code and JetBrains",
        "Works with local LLMs (Ollama, LM Studio) and cloud APIs",
        "Custom prompt slash commands and action rules"
    ],
    "tags": [
        "ai-coding",
        "copilot-alternative",
        "vs-code-extension",
        "developer-tools",
        "code-generation"
    ],
    "alternativeTo": [
        "GitHub Copilot",
        "Cursor"
    ],
    "relatedResources": [
        "aider",
        "ollama"
    ]
}),

  unverified({
    "slug": "aider",
    "name": "Aider",
    "shortDescription": "Open-source command-line AI pair programmer that edits code in your local git repository.",
    "longDescription": "Aider is an open-source command-line tool that lets you pair program with LLMs directly in your terminal. It edits code across multiple files in your local git repository, creates automatic git commits with sensible messages, and understands entire repository structures using tree-sitter map analysis.",
    "whyListed": "A premier terminal-based AI pair programmer that writes multi-file edits and automatically commits changes to git.",
    "category": "ai-coding",
    "subcategories": [
        "developer-utilities",
        "testing"
    ],
    "resourceType": "DEVELOPER_TOOL",
    "officialUrl": "https://aider.chat",
    "sourceUrl": "https://github.com/Aider-AI/aider",
    "freeStatus": "OPEN_SOURCE",
    "openSource": true,
    "license": "Apache-2.0",
    "platforms": [
        "WINDOWS",
        "MACOS",
        "LINUX"
    ],
    "downloadAvailable": true,
    "features": [
        "Multi-file code editing directly in local files",
        "Repository map generation using tree-sitter",
        "Automatic git commits with descriptive commit messages",
        "Voice-to-code dictation support",
        "Compatible with local models and major cloud APIs"
    ],
    "tags": [
        "ai-coding",
        "pair-programming",
        "git-tools",
        "terminal-tools",
        "cli-ai"
    ],
    "alternativeTo": [
        "GitHub Copilot Workspace",
        "Devin"
    ],
    "relatedResources": [
        "continue-dev",
        "ollama"
    ]
}),
];

export const batch005Resources = defineResources(batch005Seeds);
