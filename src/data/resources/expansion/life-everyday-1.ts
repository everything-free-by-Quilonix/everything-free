import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * Life & everyday, batch 1: Indian government citizen portals plus self-hostable and
 * mobile tools for groceries, recipes, habits, fitness tracking, travel logs, weather
 * and wallpapers. Every value below comes from a page fetched on DATE. Not registered.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

/* India ------------------------------------------------------------------- */
const UIDAI = "https://uidai.gov.in/en/";
const PARIVAHAN = "https://parivahan.gov.in/";
const MYGOV_OVERVIEW = "https://www.mygov.in/overview/";
const SEBI_HOME = "https://investor.sebi.gov.in/";
const SEBI_SUPPORT = "https://investor.sebi.gov.in/Investor-support.html";
const RBI_FE = "https://www.rbi.org.in/FinancialEducation/Home.aspx";

/* Global ------------------------------------------------------------------ */
const VENTUSKY_ABOUT = "https://my.ventusky.com/about/";
const VENTUSKY_PREMIUM = "https://my.ventusky.com/premium/";
const VENTUSKY_FEATURES = "https://my.ventusky.com/premium/features";
const TANDOOR_README = "https://raw.githubusercontent.com/TandoorRecipes/recipes/develop/README.md";
const GROCY_HOME = "https://grocy.info/";
const GROCY_README = "https://raw.githubusercontent.com/grocy/grocy/master/README.md";
const KITCHENOWL_README = "https://raw.githubusercontent.com/TomBursch/kitchenowl/main/README.md";
const VARIETY_README = "https://raw.githubusercontent.com/varietywalls/variety/master/README.md";
const VARIETY_LICENSE = "https://raw.githubusercontent.com/varietywalls/variety/master/LICENSE";
const LOOP_README = "https://raw.githubusercontent.com/iSoron/uhabits/dev/README.md";
const OPENTRACKS_README = "https://raw.githubusercontent.com/OpenTracksApp/OpenTracks/main/README.md";
const OPENTRACKS_LICENSE = "https://raw.githubusercontent.com/OpenTracksApp/OpenTracks/main/LICENSE";
const ADVENTURELOG_README = "https://raw.githubusercontent.com/seanmorley15/AdventureLog/main/README.md";

export const lifeEveryday1Resources: Resource[] = defineResearchedList([
  /* ------------------------------------------------------------------ India */
  {
    slug: "myaadhaar-uidai",
    name: "myAadhaar (UIDAI)",
    shortDescription: "UIDAI's official portal and app to download e-Aadhaar, check update status and lock biometrics.",
    longDescription:
      "The Unique Identification Authority of India runs the myAadhaar portal and the Aadhaar app for Aadhaar holders. Downloading Aadhaar, checking update status and locking or unlocking biometrics are offered online; some updates carry a fee, such as the ₹75 address update shown on the UIDAI homepage.",
    whyListed:
      "It is the official route for routine Aadhaar tasks, which avoids unofficial agents and look-alike sites that charge for the same services.",
    category: "everyday",
    subcategories: ["personal"],
    resourceType: "SERVICE",
    officialUrl: UIDAI,
    freeStatus: "LIMITED_FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    languages: ["en", "hi"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Requires an Aadhaar number; the app's onboarding asks for the Aadhaar number, a SIM choice and face authentication",
      "Some services charge a fee — the UIDAI homepage lists ₹75 for an address update",
      "The Aadhaar app needs Android 9.0+ or iOS 16.0+ with an internet connection",
      "Some services must still be done in person at an Aadhaar Seva Kendra",
    ],
    features: [
      "Download e-Aadhaar",
      "Check Aadhaar update status",
      "Lock or unlock biometrics",
      "Order a PVC card, generate a VID, retrieve a lost UID",
      "Aadhaar Seva Kendra locator",
    ],
    tags: ["aadhaar", "india", "government", "identity", "uidai"],
    research: {
      date: DATE,
      sources: [src(UIDAI, "UIDAI homepage: services, fees, Aadhaar app FAQ")],
      checks: [
        ok("OFFICIAL_URL", UIDAI, "Copyright © 2026 Unique Identification Authority of India; links to the My Aadhaar Portal and Aadhaar App."),
        ok(
          "FREE_STATUS",
          UIDAI,
          "Service tiles show \"Download Aadhaar — Get your Aadhaar instantly\" with no fee, while \"Address Update\" shows \"₹75 fee\". Mandatory Biometric Update \"is FREE OF COST for children aged 5-17 years\" till 30 September 2027.",
        ),
        ok("PRICING_INFORMATION", UIDAI, "\"Address Update ... ₹75 fee\"; \"Charges waived off for availing service of email address update through Aadhaar mobile application till 31.12.2026\"."),
        ok(
          "PLATFORM_AVAILABILITY",
          UIDAI,
          "\"You can download the Aadhaar app on your Android/iOS device from the Play Store/App Store.\" Requires \"Android version 9.0 and above and iOS version 16.0 and above\".",
        ),
        ok(
          "LIMITATIONS",
          UIDAI,
          "App registration: \"Enters their Aadhaar number → Agrees to the Terms ... → Chooses the SIM card → Performs Face Authentication\". \"Visit your nearest Aadhaar Seva Kendra for service that needs to be done in person.\"",
        ),
      ],
      notes:
        "Read the UIDAI English homepage, including its Aadhaar app FAQ. The myAadhaar portal itself (myaadhaarbeta.uidai.gov.in) was not fetched; whether a login is needed for each individual service was not settled, so requiresAccount stays unknown.",
    },
  },
  {
    slug: "parivahan-sewa",
    name: "Parivahan Sewa",
    shortDescription: "MoRTH's portal for driving licence, vehicle registration, eChallan and PUCC services, plus the mParivahan app.",
    longDescription:
      "Parivahan Sewa is the Ministry of Road Transport and Highways portal for transport services in India: learner's and driving licence applications, vehicle registration, permits, eChallan and pollution certificates. It also links the mParivahan app for carrying licence and registration documents. Statutory fees and user charges apply to many of the services.",
    whyListed:
      "It is the official place to look up licence and vehicle details, book RTO appointments and pay challans, instead of third-party sites.",
    category: "travel",
    subcategories: ["everyday"],
    resourceType: "SERVICE",
    officialUrl: PARIVAHAN,
    freeStatus: "LIMITED_FREE",
    openSource: false,
    platforms: ["BROWSER", "ANDROID"],
    languages: ["en", "hi"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Licence, registration and permit services carry government fees and user charges, published on the portal's Fees & User Charges pages",
      "Many services expect a mobile number registered in the Vahan or Sarathi records",
    ],
    features: [
      "Learner's licence online test and appointment booking",
      "Vehicle registration services, transfer of ownership, duplicate RC",
      "eChallan, PUCC and Vahan Green Sewa",
      "Know your licence and vehicle details",
      "mParivahan app for licence and registration documents",
    ],
    tags: ["india", "government", "driving-licence", "vehicle", "transport"],
    research: {
      date: DATE,
      sources: [src(PARIVAHAN, "Parivahan Sewa homepage: services, fees section, mParivahan link")],
      checks: [
        ok("OFFICIAL_URL", PARIVAHAN, "\"This Website belongs to Ministry of Road Transport & Highways (MoRTH) Government of India.\""),
        ok(
          "LIMITATIONS",
          PARIVAHAN,
          "Menu lists \"Fees & User Charges\", \"Licensing Related Fees and Charges\" and \"Paid NR Services\". Pop-up: \"Driving license holders and registered Vehicle owners are urged to ensure that their mobile number is updated in the Vahan and Sarathi portal.\"",
        ),
        ok("PLATFORM_AVAILABILITY", PARIVAHAN, "Web portal; mParivahan is linked to mparivahan.parivahan.gov.in and a Google Play listing (com.nic.mparivahan)."),
      ],
      notes:
        "Read the Parivahan homepage only. The mParivahan site and the fee schedule pages were not fetched, and the homepage does not state which services are fee-free, so FREE_STATUS is not recorded. LIMITED_FREE reflects that informational lookups are offered alongside fee-bearing services.",
    },
  },
  {
    slug: "mygov-india",
    name: "MyGov",
    shortDescription: "Government of India's citizen engagement platform for discussions, polls, quizzes, tasks and contests.",
    longDescription:
      "MyGov is the Government of India's citizen engagement platform, part of Digital India Corporation under MeitY. Government departments use it for policy consultations, polls, surveys, quizzes, pledges and tasks, and it runs state instances in 28 states and union territories.",
    whyListed:
      "It is the official channel for commenting on draft policies and joining government quizzes and contests, some of which offer certificates or prizes.",
    category: "everyday",
    subcategories: ["personal"],
    resourceType: "COMMUNITY",
    officialUrl: "https://www.mygov.in/",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en", "hi"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: ["Taking part in tasks, discussions and contests goes through MyGov's Login/Register flow"],
    features: ["Do/Tasks and contests", "Discussions and policy consultations", "Polls and surveys", "Quizzes and pledges", "State MyGov instances"],
    tags: ["india", "government", "civic", "quiz", "consultation"],
    research: {
      date: DATE,
      sources: [src(MYGOV_OVERVIEW, "MyGov: An Overview")],
      checks: [
        ok(
          "OFFICIAL_URL",
          MYGOV_OVERVIEW,
          "\"MyGov has been established as Government of India's Citizen Engagement Platform\"; \"MyGov is part of Digital India Corporation, a Section 8 company under Ministry of Electronics and IT, Government of India.\"",
        ),
      ],
      notes:
        "Read the MyGov overview page. It describes the platform but says nothing about fees, so FREE_STATUS is not recorded as confirmed; FREE is the compiled value. The page header shows Login/Register; which activities need an account was not checked individually.",
    },
  },
  {
    slug: "sebi-investor-website",
    name: "SEBI Investor Website",
    shortDescription: "SEBI's investor education site with money basics, scam alerts, a toll-free helpline and an awareness test.",
    longDescription:
      "The Securities and Exchange Board of India runs an investor website in Hindi and English covering money management, investment avenues, securities-market basics and scam warnings. It links to the SCORES complaints system, intermediary registration checks and a toll-free helpline that answers procedural queries in seven languages.",
    whyListed:
      "It comes from the market regulator, carries no product promotion, and has tools to check whether a broker or adviser is registered before you invest.",
    category: "personal-finance",
    subcategories: ["learning"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: SEBI_HOME,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en", "hi"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "SEBI states it will not provide investment or legal advice through Ask SEBI or the helpline",
      "The helpline runs 9:00 a.m. to 6:00 p.m., closed Sundays and Maharashtra public holidays",
    ],
    features: [
      "Money Matters, Investment and Securities Market learning sections",
      "Scam warnings: dabba trading, fake trading apps, pump and dump",
      "SEBI Investor Awareness Test (SIAT)",
      "Toll-free helpline 1800-266-7575 / 1800-22-7575 in 7 languages",
      "Links to SCORES complaints and intermediary registration checks",
    ],
    tags: ["india", "investing", "financial-literacy", "sebi", "scam-awareness"],
    research: {
      date: DATE,
      sources: [src(SEBI_HOME, "SEBI investor website homepage"), src(SEBI_SUPPORT, "Investor Support: Ask SEBI, helpline, registration checks")],
      checks: [
        ok("OFFICIAL_URL", SEBI_HOME, "\"Welcome to Investor website of Securities and Exchange Board of India\"."),
        ok(
          "FREE_STATUS",
          SEBI_SUPPORT,
          "\"Toll-free Helpline Service for Investors ... available to investors from all over India and is in 7 languages\"; education sections on the homepage are open to read.",
        ),
        ok(
          "LIMITATIONS",
          SEBI_SUPPORT,
          "\"SEBI will not provide any investment / legal advice.\" Helpline \"available on all days from 9:00 a.m to 6:00 p.m (except on declared public holidays in Maharashtra and Sundays)\".",
        ),
      ],
      notes:
        "Read the homepage and the Investor Support page. The SIAT test is hosted at siat.nism.ac.in and was not fetched. No fee is mentioned anywhere on the pages read.",
    },
  },
  {
    slug: "rbi-financial-education",
    name: "RBI Financial Education",
    shortDescription: "Reserve Bank of India's financial literacy material in 13 languages: posters, leaflets, films and games.",
    longDescription:
      "The Reserve Bank of India's Financial Education site publishes literacy material on financial products, good financial practice, going digital and consumer protection. It is offered in 13 languages for banks and other stakeholders to download and use, and includes the Financial Literacy Week campaign material, films, games and a basic banking section for school children.",
    whyListed:
      "Plain-language banking and KYC material from the central bank, in Indian languages, is useful for families and for anyone running a literacy session.",
    category: "personal-finance",
    subcategories: ["learning"],
    resourceType: "EDUCATIONAL_RESOURCE",
    officialUrl: RBI_FE,
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    languages: ["en", "hi", "as", "bn", "gu", "kn", "ml", "mr", "or", "pa", "ta", "te", "ur"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [],
    features: [
      "Downloadable posters and leaflets, e.g. on KYC and CKYC",
      "Financial Awareness Messages (FAME)",
      "Films and games",
      "Basic banking material for school children",
      "Directory of Centres for Financial Literacy",
    ],
    tags: ["india", "banking", "financial-literacy", "rbi", "kyc"],
    research: {
      date: DATE,
      sources: [src(RBI_FE, "RBI Financial Education home")],
      checks: [
        ok("OFFICIAL_URL", RBI_FE, "\"Reserve Bank of India's Financial Education Initiative\"."),
        ok(
          "FREE_STATUS",
          RBI_FE,
          "\"it has created critical volume of literature and has uploaded on its website in 13 languages for banks and other stakeholders to download and use.\"",
        ),
      ],
      notes:
        "Read the Financial Education home page, including its language selector (Assamese, Bengali, English, Gujarati, Hindi, Kannada, Malayalam, Marathi, Oriya, Punjabi, Tamil, Telugu, Urdu). Reuse terms for the material beyond \"download and use\" were not checked. The rbikehtahai.rbi.org.in campaign site returned a CAPTCHA and was not used.",
    },
  },

  /* ----------------------------------------------------------------- Global */
  {
    slug: "ventusky",
    name: "Ventusky",
    shortDescription: "Animated weather maps for wind, rain, temperature, waves and air quality, with a paid Premium tier.",
    longDescription:
      "Ventusky is a weather visualisation app from a Czech meteorological company, available on the web, iOS and Android. It animates wind, precipitation, radar, clouds, pressure, sea state and air quality from models including ECMWF, GFS, ICON and GEM. Premium unlocks extra layers, long-range maps, widgets and notifications.",
    whyListed:
      "The web map shows a wide set of layers and models without paying, and Ventusky allows its images to be shared with a source credit.",
    category: "weather",
    resourceType: "WEB_APP",
    officialUrl: "https://www.ventusky.com/",
    pricingUrl: VENTUSKY_PREMIUM,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["BROWSER", "ANDROID", "IOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Advanced layers (sea, thunderstorm, detailed clouds, altitude levels) are free on desktop only for the first 6 days of the forecast; in the mobile apps they need Premium",
      "Forecast maps beyond 7 days are Premium on desktop",
      "Advanced widgets, advanced notifications and watch radar need Premium",
      "Historical data is only available through the website, not as an API or download",
    ],
    features: ["Wind animation", "Radar and satellite layers", "ECMWF, GFS, ICON and GEM models", "Sea and wave visualisation", "Air quality layer"],
    tags: ["weather-map", "radar", "forecast", "wind"],
    research: {
      date: DATE,
      sources: [
        src(VENTUSKY_ABOUT, "About Ventusky"),
        src(VENTUSKY_PREMIUM, "Premium: pricing and plans"),
        src(VENTUSKY_FEATURES, "Premium features: what needs Premium"),
      ],
      checks: [
        ok("OFFICIAL_URL", VENTUSKY_ABOUT, "\"The Ventusky application (web, iOS, Android) ... Ventusky s.r.o. ... Plzeň, Czech Republic\"."),
        ok(
          "FREE_STATUS",
          VENTUSKY_ABOUT,
          "\"The Ventusky application ... is accessible to anyone around the world\"; Premium is a separate paid subscription.",
        ),
        ok(
          "FREE_TIER_LIMITS",
          VENTUSKY_FEATURES,
          "\"On desktop, these layers are free for the first 6 days. In the Android and iOS app, they are available only with Premium.\" \"On desktop, the long-term forecast maps are part of Premium.\"",
        ),
        ok(
          "PRICING_INFORMATION",
          VENTUSKY_PREMIUM,
          "\"Buy Premium or Premium+ ... One yearly subscription\"; \"Your subscription renews automatically\". Premium covers 4 devices, Premium+ 25. Prices were not rendered in the fetched page.",
        ),
        ok("PLATFORM_AVAILABILITY", VENTUSKY_ABOUT, "\"The Ventusky application (web, iOS, Android)\"."),
      ],
      notes:
        "Read About, Premium and Premium features pages, plus the FAQ (historical data only via website). Subscription prices load dynamically and were not visible, so no figure is recorded. Whether the web map needs an account was not stated.",
    },
  },
  {
    slug: "tandoor-recipes",
    name: "Tandoor Recipes",
    shortDescription: "Self-hosted recipe manager with meal planning, shopping lists and recipe import from websites.",
    longDescription:
      "Tandoor is a self-hosted application for storing recipes, planning meals and building shopping lists, run with Docker. It imports recipes from sites that publish schema.org recipe data and from other recipe managers. The code is under AGPL v3 with a Commons Clause selling exception, and the developers also offer a paid hosted version, currently only in Germany.",
    whyListed:
      "The developers state that every feature is free for everyone to self-host, and it keeps a household's recipe collection off third-party services.",
    category: "food",
    subcategories: ["shopping"],
    resourceType: "WEB_APP",
    officialUrl: "https://tandoor.dev/",
    sourceUrl: "https://github.com/TandoorRecipes/recipes",
    freeStatus: "FREE",
    openSource: false,
    license: "AGPL-3.0 with Commons Clause",
    licenseNotes: "The Commons Clause selling exception means this is not an OSI-approved open-source licence.",
    platforms: ["SELF_HOSTED", "BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Must be self-hosted (Docker, Kubernetes, Unraid or Synology examples are provided)",
      "Commons Clause selling exception: the software may not be sold",
      "The project says it is not meant to be run as a public page; the permission system is basic",
      "The paid hosted version is currently only available in Germany",
    ],
    features: [
      "Recipe import from websites using ld+json or microdata",
      "Meal planning and shopping lists",
      "Recipe scaling and printing views",
      "Tags, batch tagging and ingredient merging",
      "Sync with Dropbox and Nextcloud",
    ],
    tags: ["recipes", "meal-planning", "self-hosted", "shopping-list", "cooking"],
    alternativeTo: ["Paprika"],
    research: {
      date: DATE,
      sources: [src(TANDOOR_README, "Tandoor README: features, hosting, licence")],
      checks: [
        ok("OFFICIAL_URL", TANDOOR_README, "README links the project site tandoor.dev and docs.tandoor.dev."),
        ok("FREE_STATUS", TANDOOR_README, "\"This software and *all* its features are and will always be free for everyone to use and enjoy.\""),
        ok(
          "LICENSE",
          TANDOOR_README,
          "\"Beginning with version 0.10.0 the code in this repository is licensed under the GNU AGPL v3 license with a common clause selling exception.\"",
        ),
        ok("OPEN_SOURCE_STATUS", TANDOOR_README, "Source is public, but the Commons Clause selling exception makes it source-available rather than OSI open source."),
        ok(
          "LIMITATIONS",
          TANDOOR_README,
          "\"A basic permission system exists but this application is not meant to be run as a public page.\" Hosted version \"currently only available in germany\".",
        ),
        ok("PLATFORM_AVAILABILITY", TANDOOR_README, "\"Easy setup with Docker and included examples for Kubernetes, Unraid and Synology\"; \"Optimized for use on mobile devices\"."),
      ],
      notes:
        "Read the GitHub README on the develop branch. The hosted app's pricing (app.tandoor.dev) was not fetched. Commercial use other than selling is not addressed on the pages read, so it stays unknown.",
    },
  },
  {
    slug: "grocy",
    name: "Grocy",
    shortDescription: "Self-hosted groceries and household manager: stock, shopping lists, meal plans and chores.",
    longDescription:
      "Grocy is a web-based, self-hosted groceries and household management application under the MIT licence. It tracks stock and best-before dates, builds shopping lists and meal plans, and manages chores, with a REST API. A Windows desktop build runs it without managing a web server.",
    whyListed:
      "It covers pantry tracking and household chores in one tool you run yourself, with no subscription.",
    category: "lifestyle",
    subcategories: ["shopping", "food"],
    resourceType: "OPEN_SOURCE",
    officialUrl: GROCY_HOME,
    sourceUrl: "https://github.com/grocy/grocy",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["SELF_HOSTED", "BROWSER", "WINDOWS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    apiAvailable: true,
    limitations: [
      "Needs a web server unless you use Grocy Desktop on Windows",
      "The installable web app (PWA) has no offline capability",
      "Android, iOS and Docker builds are community contributions, not part of the main project",
    ],
    features: ["Stock and best-before tracking", "Shopping lists", "Meal plans", "Chores", "RESTful API with Swagger UI", "Feature flags to hide unused sections"],
    tags: ["groceries", "pantry", "household", "self-hosted", "meal-planning"],
    research: {
      date: DATE,
      sources: [src(GROCY_HOME, "Grocy homepage"), src(GROCY_README, "Grocy README: features, licence")],
      checks: [
        ok("OFFICIAL_URL", GROCY_HOME, "\"Grocy is a web-based self-hosted groceries & household management solution for your home.\" Links to Source on GitHub."),
        ok("FREE_STATUS", GROCY_HOME, "\"Open Source. Built with passion.\" Download link; donations are optional (\"Say thanks\")."),
        ok("LICENSE", GROCY_README, "\"## License The MIT License (MIT)\"."),
        ok("OPEN_SOURCE_STATUS", GROCY_README, "Repository published on GitHub under the MIT License."),
        ok(
          "PLATFORM_AVAILABILITY",
          GROCY_HOME,
          "\"Grocy Desktop — Run Grocy without having to manage a webserver, just like a normal (Windows) desktop application.\" Docker, Home Assistant, Android and iOS options are marked \"Community contribution\".",
        ),
        ok("LIMITATIONS", GROCY_README, "\"installable web app (PWA, without providing any offline usage capabilities)\"."),
      ],
      notes: "Read the Grocy homepage and README. Community apps were not evaluated separately.",
    },
  },
  {
    slug: "kitchenowl",
    name: "KitchenOwl",
    shortDescription: "Self-hosted shared grocery list and recipe manager with meal plans and household expense tracking.",
    longDescription:
      "KitchenOwl is a self-hosted grocery list and recipe manager under the AGPL-3.0 licence. Shopping lists sync in real time between household members, recipes can be added to the list, and it includes a meal planner and shared expense tracking. Apps are published for Android, iOS and the web.",
    whyListed:
      "It is a shared shopping list for a household that you can run on your own server, with mobile apps and partial offline support.",
    category: "shopping",
    subcategories: ["food", "lifestyle"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://kitchenowl.org/",
    sourceUrl: "https://github.com/TomBursch/kitchenowl",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0",
    platforms: ["SELF_HOSTED", "ANDROID", "IOS", "BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: ["The project says it is still in development", "Offline support is partial"],
    features: [
      "Real-time shared shopping lists",
      "Recipe management and sharing",
      "Meal planner",
      "Household balances and expense tracking",
      "Recipe scraping from the web",
    ],
    tags: ["shopping-list", "groceries", "recipes", "self-hosted", "household"],
    research: {
      date: DATE,
      sources: [src(KITCHENOWL_README, "KitchenOwl README: features, apps, licence")],
      checks: [
        ok("OFFICIAL_URL", KITCHENOWL_README, "README links Website https://kitchenowl.org and Docs https://docs.kitchenowl.org."),
        ok("FREE_STATUS", KITCHENOWL_README, "\"KitchenOwl is Free Software: You can use, study share and improve it at your will.\""),
        ok("LICENSE", KITCHENOWL_README, "\"you can redistribute and/or modify it under the terms of the AGPL-3.0 License.\""),
        ok("OPEN_SOURCE_STATUS", KITCHENOWL_README, "Source published on GitHub under AGPL-3.0."),
        ok("PLATFORM_AVAILABILITY", KITCHENOWL_README, "Badges for Google Play, F-Droid and the App Store; \"Native Mobile/Web/Desktop apps\"; self-hosting guide."),
        ok("LIMITATIONS", KITCHENOWL_README, "\"Please keep in mind that this project is still in development.\" \"Partial offline support\"."),
      ],
      notes:
        "Read the GitHub README. The kitchenowl.org site was fetched but only returned footer links. Whether app.kitchenowl.org is a free hosted instance was not established, so no hosted-service claim is made.",
    },
  },
  {
    slug: "variety-wallpaper-manager",
    name: "Variety",
    shortDescription: "Linux wallpaper manager that rotates local images or downloads from Unsplash, Bing and other sources.",
    longDescription:
      "Variety is a GPL-3.0 wallpaper manager for Linux desktops. It rotates local images or downloads wallpapers from online sources such as Wallhaven, Unsplash, Bing and Reddit on a schedule, and can overlay quotations or a clock. It is packaged in the Arch, Debian, Ubuntu and NixOS repositories.",
    whyListed:
      "It is a long-standing, packaged way to get rotating wallpapers on most Linux desktop environments without a paid app.",
    category: "wallpapers",
    resourceType: "DESKTOP_APP",
    officialUrl: "https://github.com/varietywalls/variety",
    sourceUrl: "https://github.com/varietywalls/variety",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    platforms: ["LINUX"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "In maintenance mode: maintainers say they do not have time to triage all issues or make major changes",
      "Linux only; needs Python 3.9+",
      "Images downloaded from online sources keep their own owners' terms",
    ],
    features: [
      "Rotate wallpapers on an interval",
      "Download from Wallhaven, Unsplash, Bing, Reddit and other sources",
      "Quotations and digital clock overlays",
      "Tray icon to pause and resume",
      "Optional filters via ImageMagick",
    ],
    tags: ["wallpaper", "linux", "desktop", "customisation"],
    research: {
      date: DATE,
      sources: [src(VARIETY_README, "Variety README"), src(VARIETY_LICENSE, "Variety LICENSE file")],
      checks: [
        ok("OFFICIAL_URL", VARIETY_README, "README of the varietywalls/variety repository: \"Variety is a wallpaper manager for Linux systems.\""),
        ok("FREE_STATUS", VARIETY_LICENSE, "LICENSE file is the GNU General Public License Version 3."),
        ok("LICENSE", VARIETY_LICENSE, "\"GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007\"."),
        ok("OPEN_SOURCE_STATUS", VARIETY_LICENSE, "Source published on GitHub under GPL v3."),
        ok("PLATFORM_AVAILABILITY", VARIETY_README, "\"available in the distro repositories of: Arch Linux, Debian, Ubuntu, NixOS\"; \"To run Variety you will need Python 3.9+.\""),
        ok("LIMITATIONS", VARIETY_README, "\"Variety is in maintenance mode ... the current maintainers do not have the time to triage all issues and make major changes to the project.\""),
      ],
      notes:
        "Read README and LICENSE on master. The LICENSE text alone does not say whether \"or later\" applies, so the licence is recorded as GPL-3.0. requiresAccount \"no\" is the compiled value for a local desktop app and is not a confirmed check.",
    },
  },
  {
    slug: "loop-habit-tracker",
    name: "Loop Habit Tracker",
    shortDescription: "Android habit tracker with flexible schedules, reminders, widgets and CSV export; no ads or in-app purchases.",
    longDescription:
      "Loop is a GPL-3.0 Android app for building habits, with a habit-strength score, schedules such as three times a week, reminders and home-screen widgets. It works offline without an account and exports to CSV or SQLite. The developers state there are no ads and no in-app purchases.",
    whyListed:
      "All features are available to everyone with no account or subscription, and your data stays on the phone.",
    category: "lifestyle",
    subcategories: ["health-fitness"],
    resourceType: "MOBILE_APP",
    officialUrl: "https://github.com/iSoron/uhabits",
    sourceUrl: "https://github.com/iSoron/uhabits",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0-or-later",
    platforms: ["ANDROID"],
    requiresAccount: "no",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: ["Android only", "APKs from the releases page do not update automatically"],
    features: ["Habit strength score", "Flexible schedules", "Per-habit reminders", "Home-screen widgets", "CSV and SQLite export", "Works offline"],
    tags: ["habits", "android", "self-improvement", "privacy"],
    research: {
      date: DATE,
      sources: [src(LOOP_README, "Loop Habit Tracker README")],
      checks: [
        ok("OFFICIAL_URL", LOOP_README, "README of iSoron/uhabits: \"Loop is a mobile app that helps you create and maintain good habits\"."),
        ok("FREE_STATUS", LOOP_README, "\"All features are available to all users. There are no in-app purchases.\""),
        ok("LICENSE", LOOP_README, "\"under the terms of the GNU General Public License ... either version 3 of the License, or (at your option) any later version.\""),
        ok("OPEN_SOURCE_STATUS", LOOP_README, "\"The app is completely open-source (GPLv3).\""),
        ok("ACCOUNT_REQUIREMENT", LOOP_README, "\"Loop doesn't require an Internet connection or online account registration.\""),
        ok("PLATFORM_AVAILABILITY", LOOP_README, "\"The easiest way to install Loop is through the Google Play Store or F-Droid.\""),
      ],
      notes: "Read the README on the dev branch.",
    },
  },
  {
    slug: "opentracks",
    name: "OpenTracks",
    shortDescription: "Privacy-respecting Android sport tracker with GPX/KML export, Bluetooth sensors and no internet use.",
    longDescription:
      "OpenTracks is an Apache-2.0 Android app for recording runs, rides and outdoor activities. It records GPS tracks with markers and photos, reads Bluetooth LE heart-rate, cadence and power sensors, gives voice announcements and exports to KMZ, KML or GPX. The app does not use the internet, advertising, analytics or Google Play Services.",
    whyListed:
      "It is an activity tracker that keeps data on your phone, with standard export formats so you are not tied to a fitness platform.",
    category: "health-fitness",
    subcategories: ["travel"],
    resourceType: "MOBILE_APP",
    officialUrl: "https://github.com/OpenTracksApp/OpenTracks",
    sourceUrl: "https://github.com/OpenTracksApp/OpenTracks",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["ANDROID"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: ["Android only", "No built-in map; maps come through a separate dashboard app such as OSMDashboard"],
    features: [
      "GPS activity tracking with markers and photos",
      "Bluetooth LE heart rate, cycling cadence, speed and power",
      "Voice announcements",
      "Export as KMZ, KML or GPX",
      "Public API and Gadgetbridge integration",
    ],
    tags: ["fitness", "running", "cycling", "gps", "android", "privacy"],
    alternativeTo: ["Strava"],
    research: {
      date: DATE,
      sources: [src(OPENTRACKS_README, "OpenTracks README"), src(OPENTRACKS_LICENSE, "OpenTracks LICENSE file")],
      checks: [
        ok("OFFICIAL_URL", OPENTRACKS_README, "\"OpenTracks: a sport tracker — OpenTracks is a sport tracking application that completely respects your privacy.\""),
        ok("FREE_STATUS", OPENTRACKS_README, "Download table: \"Free (F-Droid)\", \"Free (Nightly for F-Droid)\", \"Donations\"."),
        ok("LICENSE", OPENTRACKS_LICENSE, "\"Apache License Version 2.0, January 2004\"."),
        ok("OPEN_SOURCE_STATUS", OPENTRACKS_LICENSE, "Source published under the Apache License 2.0."),
        ok("PLATFORM_AVAILABILITY", OPENTRACKS_README, "F-Droid and Google Play badges; Android package names listed."),
        ok(
          "LIMITATIONS",
          OPENTRACKS_README,
          "\"No Internet access: Internet is not used\"; maps via Dashboard API: \"The reference implementation is OSMDashboard, which presents an OpenStreetMap map\".",
        ),
      ],
      notes:
        "Read README and LICENSE on main. The README marks the Google Play build under a Donations column; whether that build is paid was not settled, so only the F-Droid route is described as free.",
    },
  },
  {
    slug: "adventurelog",
    name: "AdventureLog",
    shortDescription: "Self-hosted travel log and trip planner: pin visits, build itineraries and track countries visited.",
    longDescription:
      "AdventureLog is a GPL-3.0 self-hosted travel companion. You pin places you have visited with dates, notes and photos, build multi-day itineraries with lodging and checklists, and mark countries, regions and cities on a world map. It integrates with Immich, Strava and other services and runs with Docker.",
    whyListed:
      "It replaces subscription travel-journal apps with one you host yourself, and the developer states it is free to self-host.",
    category: "travel",
    subcategories: ["lifestyle"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://adventurelog.app/",
    sourceUrl: "https://github.com/seanmorley15/AdventureLog",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    platforms: ["SELF_HOSTED", "BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "yes",
    limitations: [
      "Must be self-hosted; requires Docker Engine and Compose v2 and 2 GB RAM on first boot",
      "Google Maps geocoding is an optional integration you configure yourself",
    ],
    features: [
      "Locations and visits with photos, notes and categories",
      "Multi-day trip itineraries with lodging and checklists",
      "World travel book of countries, regions and cities",
      "GPX trails and activities",
      "Collaboration via public links or shared editing",
    ],
    tags: ["travel", "trip-planner", "travel-journal", "self-hosted", "maps"],
    research: {
      date: DATE,
      sources: [src(ADVENTURELOG_README, "AdventureLog README")],
      checks: [
        ok("OFFICIAL_URL", ADVENTURELOG_README, "README links Documentation at https://adventurelog.app and the live demo."),
        ok("FREE_STATUS", ADVENTURELOG_README, "Comparison table: \"Cost — Free to self-host (GPL-3.0)\"."),
        ok("LICENSE", ADVENTURELOG_README, "\"Distributed under the GNU General Public License v3.0.\""),
        ok("OPEN_SOURCE_STATUS", ADVENTURELOG_README, "\"Open source, self-hosted, GPL-3.0\"."),
        ok("PLATFORM_AVAILABILITY", ADVENTURELOG_README, "\"Requirements: Docker Engine + Compose v2 · 2 GB RAM on first boot · Linux, VPS, homelab, or macOS\"."),
        ok("LIMITATIONS", ADVENTURELOG_README, "\"Requirements: Docker Engine + Compose v2 · 2 GB RAM on first boot\"."),
      ],
      notes: "Read the README on main. The adventurelog.app documentation site was not fetched separately.",
    },
  },
]);
