import type { Resource, VerificationCheck, VerificationCheckRecord } from "@/types/resource";

import type { ResearchSource } from "../entertainment/define-media";
import { defineResearchedList } from "./define-researched";

/**
 * Creative media batch 1: audio, animation, video, photography, design, stock media,
 * fonts, icons and 3D. Every fact below comes from a provider page read on DATE.
 * Not registered in any index.
 */

const DATE = "2026-10-11";
const ok = (check: VerificationCheck, sourceUrl: string, evidence: string): VerificationCheckRecord => ({
  check,
  result: "confirmed",
  evidence,
  sourceUrl,
});
const src = (url: string, label: string): ResearchSource => ({ url, label });

/* Tenacity */
const TENACITY_HOME = "https://tenacityaudio.org/";
const TENACITY_REPO = "https://codeberg.org/tenacityteam/tenacity";

/* MusicBrainz Picard */
const PICARD_HOME = "https://picard.musicbrainz.org/";
const PICARD_DOWNLOADS = "https://picard.musicbrainz.org/downloads/";

/* MyPaint */
const MYPAINT_HOME = "https://www.mypaint.app/en/";
const MYPAINT_REPO = "https://github.com/mypaint/mypaint";

/* Graphite */
const GRAPHITE_HOME = "https://graphite.art/";
const GRAPHITE_LICENSE = "https://graphite.art/license/";

/* Lunacy */
const LUNACY_HOME = "https://icons8.com/lunacy";
const LUNACY_PRICING = "https://icons8.com/lunacy-pricing";

/* Bootstrap Icons */
const BSI_HOME = "https://icons.getbootstrap.com/";
const BSI_REPO = "https://github.com/twbs/icons";

/* Iconoir */
const ICONOIR_HOME = "https://iconoir.com/";

/* Ionicons */
const IONICONS_HOME = "https://ionic.io/ionicons";

/* Material Symbols */
const MATERIAL_REPO = "https://github.com/google/material-design-icons";

/* Hugin */
const HUGIN_HOME = "https://hugin.sourceforge.io/";
const HUGIN_DOWNLOAD = "https://hugin.sourceforge.io/download/";
const HUGIN_SF = "https://sourceforge.net/projects/hugin/";

/* Avidemux */
const AVIDEMUX_HOME = "https://avidemux.sourceforge.net/";

/* MKVToolNix */
const MKV_HOME = "https://mkvtoolnix.download/";
const MKV_REPO = "https://codeberg.org/mbunkus/mkvtoolnix";

/* Blockbench */
const BLOCKBENCH_HOME = "https://www.blockbench.net/";
const BLOCKBENCH_REPO = "https://github.com/JannisX11/blockbench";

/* Goxel */
const GOXEL_HOME = "https://goxel.xyz/";
const GOXEL_DOWNLOAD = "https://goxel.xyz/download";
const GOXEL_REPO = "https://github.com/guillaumechereau/goxel";

/* Material Maker */
const MM_HOME = "https://www.materialmaker.org/";
const MM_REPO = "https://github.com/RodZill4/material-maker";
const MM_ITCH = "https://rodzilla.itch.io/material-maker";

/* Coverr */
const COVERR_LICENSE = "https://coverr.co/license";

/* Atkinson Hyperlegible */
const ATKINSON_HOME = "https://www.brailleinstitute.org/freefont/";

/* Ek Type Anek */
const ANEK_PAGE = "https://ektype.in/anek-family.html";
const EKTYPE_LICENSING = "https://ektype.in/ektype-help.html?lnk=license";

export const creativeMedia1Resources: Resource[] = defineResearchedList([
  /* ------------------------------------------------------------------ */
  /* Audio                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "tenacity",
    name: "Tenacity",
    shortDescription: "Multi-track audio editor and recorder, a volunteer-run fork of Audacity, under the GPL.",
    longDescription:
      "Tenacity is a cross-platform multi-track audio editor and recorder developed by volunteers. It started as a fork of Audacity and adds its own themes, Matroska import/export and sync-lock changes. Development happens on Codeberg.",
    whyListed: "An open-source audio editor for recording, cutting and exporting audio on Windows, macOS, Linux and BSD.",
    category: "audio",
    subcategories: ["music"],
    resourceType: "DESKTOP_APP",
    officialUrl: TENACITY_HOME,
    sourceUrl: TENACITY_REPO,
    licenseUrl: "https://codeberg.org/tenacityteam/tenacity/src/branch/main/LICENSE.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0-or-later",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: ["The project's GitHub mirror ignores pull requests and issues; contributions go through Codeberg"],
    features: [
      "Recording from real or virtual audio devices",
      "Import and export of many formats, extendable with FFmpeg",
      "Up to 32-bit float audio",
      "VST, LV2 and AU plug-in support",
      "Nyquist scripting, plus Python or Perl via named pipes",
      "Keyboard editing and screen reader support",
    ],
    tags: ["audio-editor", "recording", "audacity-fork", "podcasting"],
    alternativeTo: ["Adobe Audition"],
    relatedResources: ["audacity", "ardour"],
    research: {
      date: DATE,
      sources: [
        src(TENACITY_HOME, "Official site: description, platforms, features"),
        src(TENACITY_REPO, "Codeberg repository README: licence and contribution policy"),
      ],
      checks: [
        ok("OFFICIAL_URL", TENACITY_HOME, "tenacityaudio.org is the project site; it links releases on Codeberg."),
        ok("FREE_STATUS", TENACITY_REPO, "README: 'This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License ... version 2 of the License, or (at your option) any later version.'"),
        ok("OPEN_SOURCE_STATUS", TENACITY_HOME, "Site: 'developed by a group of volunteers as open-source software.'"),
        ok("LICENSE", TENACITY_REPO, "README licence section: GNU GPL version 2 or any later version."),
        ok("PLATFORM_AVAILABILITY", TENACITY_HOME, "Download button reads 'for Windows, Mac, Linux, and BSD'."),
        ok("LIMITATIONS", TENACITY_REPO, "README: 'we do NOT accept any pull requests or issues on GitHub anymore'; use Codeberg."),
      ],
      notes: "Read the official site and the Codeberg README. Commercial and personal use not stated separately beyond the GPL; left unknown. No account requirement stated.",
    },
  },
  {
    slug: "musicbrainz-picard",
    name: "MusicBrainz Picard",
    shortDescription: "Music tagger that identifies files via the MusicBrainz database and AcoustID fingerprints.",
    longDescription:
      "Picard is a cross-platform music tagger from the MetaBrainz Foundation. It looks up releases in the community-maintained MusicBrainz database, can identify untagged files by AcoustID audio fingerprint, fetches cover art and renames files with a scripting language.",
    whyListed: "Tidying a music library's tags and file names is otherwise slow manual work; Picard does it against an open database.",
    category: "audio",
    subcategories: ["music"],
    resourceType: "DESKTOP_APP",
    officialUrl: PICARD_HOME,
    sourceUrl: "https://github.com/metabrainz/picard",
    licenseUrl: "https://www.gnu.org/licenses/gpl-2.0.html",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0-or-later",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [],
    features: [
      "Supports MP3, FLAC, OGG, M4A, WMA, WAV and more",
      "AcoustID fingerprint lookup for files without metadata",
      "Whole-CD lookups",
      "Cover art download",
      "Scripting for file naming and tag formatting",
      "Plugin support",
    ],
    tags: ["music-tagger", "metadata", "musicbrainz", "cover-art"],
    alternativeTo: ["Mp3tag"],
    research: {
      date: DATE,
      sources: [
        src(PICARD_HOME, "Official site: features and licence"),
        src(PICARD_DOWNLOADS, "Downloads page: platforms"),
      ],
      checks: [
        ok("OFFICIAL_URL", PICARD_HOME, "picard.musicbrainz.org, 'Brought to you by MetaBrainz Foundation'."),
        ok("FREE_STATUS", PICARD_HOME, "'Picard is licensed under GPL 2.0 or later, and is hosted on GitHub'."),
        ok("OPEN_SOURCE_STATUS", PICARD_HOME, "Section headed 'Open Source'."),
        ok("LICENSE", PICARD_HOME, "'licensed under GPL 2.0 or later'."),
        ok("PLATFORM_AVAILABILITY", PICARD_DOWNLOADS, "Downloads for Windows (installer, portable, Microsoft Store), macOS (arm64 and x86_64) and Linux (Flatpak, Snap, distro packages); also Haiku, FreeBSD, OpenBSD."),
      ],
      notes: "Read the home and downloads pages. Version 3.0.1 is the current release on the downloads page. Account requirement for tagging not stated; left unknown.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Design                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "mypaint",
    name: "MyPaint",
    shortDescription: "Raster painting and sketching app with an infinite canvas and a configurable brush engine.",
    longDescription:
      "MyPaint is a community-developed raster painting program aimed at drawing from scratch with graphics tablets. It has an in-house brush engine that can emulate charcoal, pencil, ink and paint, a distraction-free fullscreen mode and layers.",
    whyListed: "A focused, open-source painting tool for tablet artists who do not need a full photo editor.",
    category: "design",
    subcategories: ["photography"],
    resourceType: "CREATIVE_TOOL",
    officialUrl: MYPAINT_HOME,
    sourceUrl: MYPAINT_REPO,
    licenseUrl: "https://github.com/mypaint/mypaint/blob/master/COPYING",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: ["The latest stable release linked from the site is v2.0.1; newer builds are nightly alphas that the README warns may crash"],
    features: [
      "Infinite canvas",
      "Configurable brush engine emulating traditional media",
      "Distraction-free fullscreen mode",
      "Graphics tablet support",
      "Layers, layer modes and layer groups",
    ],
    tags: ["painting", "drawing", "digital-art", "graphics-tablet"],
    alternativeTo: ["Corel Painter"],
    relatedResources: ["krita"],
    research: {
      date: DATE,
      sources: [
        src(MYPAINT_HOME, "Official site: description, downloads per OS"),
        src(MYPAINT_REPO, "GitHub repository: licence, features, nightly notes"),
      ],
      checks: [
        ok("OFFICIAL_URL", MYPAINT_HOME, "mypaint.app, linked from the GitHub repository 'About' box."),
        ok("FREE_STATUS", MYPAINT_REPO, "README 'Legal info': 'MyPaint is Free/Libre/Open Source software.'"),
        ok("OPEN_SOURCE_STATUS", MYPAINT_REPO, "Repository published publicly with a GPL-2.0 licence file."),
        ok("LICENSE", MYPAINT_REPO, "Repository sidebar: 'GPL-2.0 license'."),
        ok("PLATFORM_AVAILABILITY", MYPAINT_HOME, "Download v2.0.1 via Flathub (Linux), MacPorts (macOS) and a Windows installer."),
        ok("LIMITATIONS", MYPAINT_REPO, "README: 'Using alpha releases comes with its own risks. Sometimes bugs can sneak in that causes crashes'."),
      ],
      notes: "Read the official site and GitHub README. Licenses.md was not opened; the repository licence label is GPL-2.0.",
    },
  },
  {
    slug: "graphite-editor",
    name: "Graphite",
    shortDescription: "Node-based vector graphics editor and animation engine that runs locally in the browser (alpha).",
    longDescription:
      "Graphite is a vector graphics editor and procedural animation engine built around a node graph, so edits stay nondestructive. It is currently an alpha web app that runs locally in the browser; native Windows, macOS and Linux apps were at release-candidate stage when read.",
    whyListed: "A permissively licensed, browser-based vector and motion-graphics tool with no server involved in editing.",
    category: "design",
    subcategories: ["animation"],
    resourceType: "WEB_APP",
    officialUrl: GRAPHITE_HOME,
    sourceUrl: "https://github.com/GraphiteEditor/Graphite",
    licenseUrl: GRAPHITE_LICENSE,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT OR Apache-2.0",
    licenseNotes: "Source code is dual-licensed MIT or Apache-2.0. Logos and branding assets are under a separate proprietary Graphite Branding License; forks must replace them.",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "unknown",
    limitations: [
      "Alpha software",
      "Desktop apps were release candidates distributed through the project's Discord at the time of reading",
      "Branding assets may not be reused in forks",
    ],
    features: [
      "Nondestructive, node-based editing",
      "Vector editing tools",
      "Procedural generation and animation",
      "Runs locally in the browser; installable as a PWA",
    ],
    tags: ["vector-graphics", "motion-graphics", "procedural", "node-editor"],
    alternativeTo: ["Adobe Illustrator"],
    research: {
      date: DATE,
      sources: [
        src(GRAPHITE_HOME, "Official site: description, status, platforms"),
        src(GRAPHITE_LICENSE, "Licence page: code licence, commercial use, branding licence"),
      ],
      checks: [
        ok("OFFICIAL_URL", GRAPHITE_HOME, "graphite.art, operated by Graphite Labs; links the editor at editor.graphite.art."),
        ok("FREE_STATUS", GRAPHITE_HOME, "'Graphite is a free, open source vector graphics editor and animation engine, available now in alpha.'"),
        ok("OPEN_SOURCE_STATUS", GRAPHITE_LICENSE, "'Graphite is open source software made by its community'."),
        ok("LICENSE", GRAPHITE_LICENSE, "'dual-licensed under your choice of either the MIT License or the Apache License 2.0'."),
        ok("COMMERCIAL_USE", GRAPHITE_LICENSE, "'Builds of the application are free to use and redistribute, even for commercial purposes. The artwork you create always belongs to you.'"),
        ok("PLATFORM_AVAILABILITY", GRAPHITE_HOME, "'The web app is currently live and desktop apps for Windows, Mac, and Linux are now in a release candidate stage.'"),
        ok("LIMITATIONS", GRAPHITE_HOME, "'available now in alpha'; desktop download links are posted in the Discord announcements channel for testers."),
      ],
      notes: "Read the home page and licence page. Desktop platforms not listed because they were release candidates, not general releases, on the date read.",
    },
  },
  {
    slug: "lunacy",
    name: "Lunacy",
    shortDescription: "UI/UX design app from Icons8 with native desktop apps and a free plan capped at 10 cloud docs.",
    longDescription:
      "Lunacy is a UI and UX design application by Icons8 with auto layout, components, prototyping, real-time collaboration and offline mode. It has native apps for Windows, macOS and Linux and a browser version. The free plan limits cloud documents and built-in graphics resolution; Pro is paid per user.",
    whyListed: "A native, offline-capable interface design tool whose free plan covers a single designer.",
    category: "design",
    resourceType: "DESKTOP_APP",
    officialUrl: LUNACY_HOME,
    pricingUrl: LUNACY_PRICING,
    freeStatus: "FREE_TIER",
    openSource: false,
    platforms: ["WINDOWS", "MACOS", "LINUX", "BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Free plan: limited to 10 cloud documents",
      "Free plan: 30-day version history and 30-day storage for deleted docs",
      "Free plan: built-in icons, illustrations and photos are low-resolution raster only",
      "Free plan: no AI tools, and linking to Icons8 is required",
    ],
    pricingNotes: "Pro is $11.99 per user per month billed yearly; Enterprise is custom-priced.",
    features: [
      "Auto layout",
      "Components and variables",
      "Prototyping",
      "Real-time collaboration",
      "Online and offline modes",
      "Figma file import",
    ],
    tags: ["ui-design", "ux-design", "prototyping", "figma-alternative"],
    alternativeTo: ["Figma", "Sketch"],
    research: {
      date: DATE,
      sources: [
        src(LUNACY_HOME, "Product page: features, platforms"),
        src(LUNACY_PRICING, "Pricing page: free plan limits, Pro price"),
      ],
      checks: [
        ok("OFFICIAL_URL", LUNACY_HOME, "icons8.com/lunacy is the Icons8 product page for Lunacy."),
        ok("FREE_STATUS", LUNACY_PRICING, "Free plan '$0 ... For beginners'; FAQ: 'Lunacy provides an extensive free plan'."),
        ok("FREE_TIER_LIMITS", LUNACY_PRICING, "Free: 'Limited to 10 cloud docs', '30-day version history', 'Low-res raster icons', 'No AI tools', 'Linking to Icons8 is required'."),
        ok("PRICING_INFORMATION", LUNACY_PRICING, "Pro '$11.99 per user/month billed yearly'; Enterprise 'Custom price'."),
        ok("PLATFORM_AVAILABILITY", LUNACY_PRICING, "FAQ: 'Windows, macOS, and Linux. Lunacy has native apps for all the popular operating systems.' Product page also says 'Lunacy is now in your browser!'"),
        ok("LIMITATIONS", LUNACY_PRICING, "Free plan omits editable vector assets, AI upscaler and background remover, and unlimited cloud documents."),
      ],
      notes: "Read the product and pricing pages. Whether the desktop app needs an account offline was not stated; left unknown. Commercial use of designs on the free plan not stated.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Icons                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "bootstrap-icons",
    name: "Bootstrap Icons",
    shortDescription: "MIT-licensed SVG icon library from the Bootstrap team, usable with or without Bootstrap.",
    longDescription:
      "Bootstrap Icons is the official icon set of the Bootstrap project, with over 2,000 icons. It ships as individual SVGs, an SVG sprite, icon fonts, CSS and Sass, via npm, Composer, a CDN or a release archive.",
    whyListed: "A large, permissively licensed icon set that drops into any web project.",
    category: "icons",
    resourceType: "ICON",
    officialUrl: BSI_HOME,
    sourceUrl: BSI_REPO,
    licenseUrl: "https://github.com/twbs/icons/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [],
    features: [
      "Over 2,000 icons",
      "SVG files, SVG sprite and web fonts",
      "npm and Composer packages, CDN",
      "Figma file",
    ],
    tags: ["icons", "svg", "icon-font", "bootstrap"],
    research: {
      date: DATE,
      sources: [
        src(BSI_HOME, "Official icon site: description, formats, icon count"),
        src(BSI_REPO, "GitHub repository: MIT licence, install options"),
      ],
      checks: [
        ok("OFFICIAL_URL", BSI_HOME, "icons.getbootstrap.com; repo calls itself 'Official open source SVG icon library for Bootstrap'."),
        ok("FREE_STATUS", BSI_HOME, "'Free, high quality, open source icon library with over 2,078 icons.'"),
        ok("OPEN_SOURCE_STATUS", BSI_REPO, "'Official open source SVG icon library for Bootstrap'."),
        ok("LICENSE", BSI_REPO, "README 'License: MIT'; sidebar 'MIT license'."),
      ],
      notes: "Read the icon site and the GitHub README. Version 1.13.2 was current. The MIT licence permits commercial use, but the commercial-use check was not recorded separately.",
    },
  },
  {
    slug: "iconoir",
    name: "Iconoir",
    shortDescription: "MIT-licensed icon library in SVG, font, React, React Native, Flutter, Vue and Figma formats.",
    longDescription:
      "Iconoir is an open-source icon library with adjustable stroke weight and size, distributed for SVG, web font, React, React Native, Flutter, Vue, Swift, Figma and Framer. It is funded by donations through Open Collective.",
    whyListed: "A consistent line-icon set with packages for most front-end frameworks, under MIT.",
    category: "icons",
    resourceType: "ICON",
    officialUrl: ICONOIR_HOME,
    sourceUrl: "https://github.com/iconoir-icons/iconoir",
    licenseUrl: "https://github.com/iconoir-icons/iconoir/blob/main/LICENSE",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [],
    features: [
      "1,671 icons when read",
      "Adjustable stroke weight and size on the site",
      "React, React Native, Flutter, Vue, Swift and CSS packages",
      "Figma and Framer libraries",
    ],
    tags: ["icons", "svg", "react", "flutter"],
    research: {
      date: DATE,
      sources: [src(ICONOIR_HOME, "Official site: formats, icon count, licence footer")],
      checks: [
        ok("OFFICIAL_URL", ICONOIR_HOME, "iconoir.com links the iconoir-icons GitHub repository and licence."),
        ok("FREE_STATUS", ICONOIR_HOME, "'100% free icons. Iconoir is open source and we're ready for your help.'"),
        ok("OPEN_SOURCE_STATUS", ICONOIR_HOME, "'Iconoir is open source'."),
        ok("LICENSE", ICONOIR_HOME, "Footer: 'Content available under a MIT License.'"),
      ],
      notes: "Read the official home page. The site carries a sponsor banner for a separate paid icon product (Streamline); that is not part of Iconoir.",
    },
  },
  {
    slug: "ionicons",
    name: "Ionicons",
    shortDescription: "MIT-licensed SVG icon set from the Ionic team for web, iOS, Android and desktop apps.",
    longDescription:
      "Ionicons is the icon library maintained by Ionic, an OutSystems company. It provides SVG icons for web, iOS, Android and desktop apps, a downloadable designer pack, and usage docs for the web component.",
    whyListed: "An established, permissively licensed icon set with a ready-made web component.",
    category: "icons",
    resourceType: "ICON",
    officialUrl: IONICONS_HOME,
    sourceUrl: "https://github.com/ionic-team/ionicons",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [],
    features: ["SVG icons", "Web component usage", "Designer pack download", "Icon requests via GitHub issues"],
    tags: ["icons", "svg", "web-components", "ionic"],
    research: {
      date: DATE,
      sources: [src(IONICONS_HOME, "Official Ionicons page: licence, formats")],
      checks: [
        ok("OFFICIAL_URL", IONICONS_HOME, "ionic.io/ionicons, 'built by Ionic', linking the ionic-team/ionicons repository."),
        ok("FREE_STATUS", IONICONS_HOME, "'Completely open source, MIT licensed and built by Ionic.'"),
        ok("OPEN_SOURCE_STATUS", IONICONS_HOME, "'Open source icons.'"),
        ok("LICENSE", IONICONS_HOME, "Footer: 'Released under MIT License'."),
      ],
      notes: "Read the official Ionicons page. Icon count not stated on the fetched page and not recorded.",
    },
  },
  {
    slug: "material-symbols",
    name: "Material Symbols",
    shortDescription: "Google's variable-font icon set (Outlined, Rounded, Sharp) under the Apache 2.0 licence.",
    longDescription:
      "Material Symbols is Google's current Material Design icon set, built as variable fonts with fill, weight, grade and optical size axes, in Outlined, Rounded and Sharp styles. The repository also holds the older Material Icons set, which is no longer updated. Icons can be browsed at fonts.google.com/icons.",
    whyListed: "A large, Apache-licensed icon system whose variable axes let one font cover many visual weights.",
    category: "icons",
    subcategories: ["fonts"],
    resourceType: "ICON",
    officialUrl: MATERIAL_REPO,
    sourceUrl: MATERIAL_REPO,
    licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0.txt",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "Apache-2.0",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Only the 20 and 24 px designs have pixel-grid alignment",
      "No two-tone style in Material Symbols",
      "No third-party logos",
      "Google does not maintain the npm packages past v3 (2016); current npm packages are community-run",
    ],
    features: [
      "Variable fonts with fill, weight, grade and optical size axes",
      "Outlined, Rounded and Sharp styles",
      "Static SVG icons",
      "Hosted web font via Google Fonts",
    ],
    tags: ["icons", "material-design", "variable-font", "google"],
    research: {
      date: DATE,
      sources: [src(MATERIAL_REPO, "Official Google repository README: sets, axes, licence, limits")],
      checks: [
        ok("OFFICIAL_URL", MATERIAL_REPO, "google/material-design-icons, 'Material Design icons by Google (Material Symbols)'."),
        ok("FREE_STATUS", MATERIAL_REPO, "'We have made these icons available for you to incorporate into your products under the Apache License Version 2.0.'"),
        ok("OPEN_SOURCE_STATUS", MATERIAL_REPO, "Repository published under the Apache-2.0 licence."),
        ok("LICENSE", MATERIAL_REPO, "README licence section: Apache License Version 2.0."),
        ok("COMMERCIAL_USE", MATERIAL_REPO, "'incorporate into your products ... Feel free to remix and re-share ... We'd love attribution ... but it's not required.'"),
        ok("LIMITATIONS", MATERIAL_REPO, "'only the 20 and 24 px versions are designed with perfect pixel-grid alignment', 'there are no two-tone icons'; third-party logos excluded; npm not maintained by Google past v3."),
      ],
      notes: "Read the official GitHub README. The official URL is the repository rather than fonts.google.com/icons, which belongs to the existing Google Fonts listing's domain.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Photography                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "hugin",
    name: "Hugin",
    shortDescription: "Panorama stitcher that assembles overlapping photos into panoramas, built on Panorama Tools.",
    longDescription:
      "Hugin is a cross-platform panorama toolchain based on Panorama Tools. It stitches overlapping photographs into mosaics and immersive panoramas, with photometric correction for exposure, vignetting and white balance. The project publishes source code and links contributed binaries.",
    whyListed: "A long-running open-source alternative to paid panorama stitchers.",
    category: "photography",
    resourceType: "DESKTOP_APP",
    officialUrl: HUGIN_HOME,
    sourceUrl: HUGIN_SF,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "Windows installer is 64-bit; 32-bit Windows is supported only up to Hugin 2017.0",
      "The official macOS build (2019.0.0) does not run on Apple Silicon (arm64) Macs",
      "Linux users install from their distribution's package manager, Flatpak or a community AppImage",
    ],
    features: [
      "Stitches overlapping photos into panoramas",
      "Photometric correction of exposure, vignetting and white balance",
      "HDR panorama creation",
      "Localised into over 20 languages",
    ],
    tags: ["panorama", "photo-stitching", "hdr", "photography"],
    alternativeTo: ["PTGui"],
    research: {
      date: DATE,
      sources: [
        src(HUGIN_HOME, "Official site: description, status, latest release"),
        src(HUGIN_DOWNLOAD, "Download page: free status, platform builds and limits"),
        src(HUGIN_SF, "Official SourceForge project page: licence"),
      ],
      checks: [
        ok("OFFICIAL_URL", HUGIN_HOME, "hugin.sourceforge.io; Hugin 2025.0.1 released 2025-12-13."),
        ok("FREE_STATUS", HUGIN_DOWNLOAD, "'Open Source software, free to use, modify and share.'"),
        ok("OPEN_SOURCE_STATUS", HUGIN_DOWNLOAD, "'Open Source software'; source tarballs on SourceForge."),
        ok("LICENSE", HUGIN_SF, "Project page licence: 'GNU General Public License version 2.0 (GPLv2)'."),
        ok("PLATFORM_AVAILABILITY", HUGIN_DOWNLOAD, "64-bit Windows installer, a macOS dmg, and Linux via distribution packages, Flatpak and AppImage."),
        ok("LIMITATIONS", HUGIN_DOWNLOAD, "'32-bit versions of Windows are only supported up to Hugin 2017.0'; macOS build 'will not run on newer Mac computer with arm64 architecture'."),
      ],
      notes: "Read the home and download pages and the SourceForge project page the site links as its project hosting. Commercial use not stated separately.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Video                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "avidemux",
    name: "Avidemux",
    shortDescription: "Video editor for simple cutting, filtering and encoding, with job queues and scripting.",
    longDescription:
      "Avidemux is a video editor designed for simple cutting, filtering and encoding tasks. It supports AVI, DVD-compatible MPEG, MP4 and ASF among other formats, and tasks can be automated with projects, a job queue and scripting.",
    whyListed: "Quick cuts and re-encodes without learning a full non-linear editor.",
    category: "video",
    resourceType: "DESKTOP_APP",
    officialUrl: AVIDEMUX_HOME,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GNU GPL (version not stated on the home page)",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: ["The latest release listed on the home page was 2.8.1, dated 2022-09-23"],
    features: [
      "Cutting, filtering and encoding",
      "AVI, DVD-compatible MPEG, MP4 and ASF support",
      "Projects, job queue and scripting",
    ],
    tags: ["video-editor", "video-encoding", "cutting", "transcoding"],
    relatedResources: ["handbrake", "losslesscut"],
    research: {
      date: DATE,
      sources: [src(AVIDEMUX_HOME, "Official site: description, platforms, licence, latest news")],
      checks: [
        ok("OFFICIAL_URL", AVIDEMUX_HOME, "avidemux.sourceforge.net, with downloads, wiki and forums."),
        ok("FREE_STATUS", AVIDEMUX_HOME, "'Avidemux is a free video editor designed for simple cutting, filtering and encoding tasks.'"),
        ok("OPEN_SOURCE_STATUS", AVIDEMUX_HOME, "'available ... under the GNU GPL license'."),
        ok("LICENSE", AVIDEMUX_HOME, "'Avidemux is available for Linux, BSD, Mac OS X and Microsoft Windows under the GNU GPL license.'"),
        ok("PLATFORM_AVAILABILITY", AVIDEMUX_HOME, "'available for Linux, BSD, Mac OS X and Microsoft Windows'."),
      ],
      notes: "Read the official home page only; the GPL version number is not stated there, so `license` describes it rather than using an SPDX id. Latest news item: 2022-09-23, 2.8.1.",
    },
  },
  {
    slug: "mkvtoolnix",
    name: "MKVToolNix",
    shortDescription: "Tools to create, alter and inspect Matroska (MKV) files, with a GUI and command-line tools.",
    longDescription:
      "MKVToolNix is a set of tools by Moritz Bunkus for working with Matroska files: mkvmerge creates them from other media, mkvextract pulls tracks out, and mkvinfo inspects them. It is released regularly and packaged for Windows, Linux and, again from release 98, macOS.",
    whyListed: "The standard way to remux, add subtitles to or split MKV files without re-encoding.",
    category: "video",
    resourceType: "DESKTOP_APP",
    officialUrl: MKV_HOME,
    sourceUrl: MKV_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0",
    licenseNotes: "Bundled icons are CC BY 3.0; bundled libraries carry their own licences (LGPL, MIT, BSD, Boost) as listed in the README.",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: ["macOS binaries depend on community maintainers; the author had announced ending macOS support before they took it over"],
    features: [
      "mkvmerge: create Matroska files from other media",
      "mkvextract: extract tracks and data",
      "mkvinfo: inspect Matroska files",
      "GUI and command-line tools",
    ],
    tags: ["matroska", "mkv", "remux", "subtitles"],
    relatedResources: ["ffmpeg", "handbrake"],
    research: {
      date: DATE,
      sources: [
        src(MKV_HOME, "Official site: description, platforms, release news"),
        src(MKV_REPO, "Codeberg repository README: licence and third-party licences"),
      ],
      checks: [
        ok("OFFICIAL_URL", MKV_HOME, "mkvtoolnix.download, '© 2002 – 2026 Moritz Bunkus'; v102.0 released 2026-09-14."),
        ok("FREE_STATUS", MKV_REPO, "README: 'This code comes under the GPL v2 (see www.gnu.org or the file COPYING).'"),
        ok("OPEN_SOURCE_STATUS", MKV_REPO, "Source published on Codeberg under GPL v2."),
        ok("LICENSE", MKV_REPO, "'This code comes under the GPL v2'."),
        ok("PLATFORM_AVAILABILITY", MKV_HOME, "Title 'Matroska tools for Linux/Unix and Windows'; 2026-05-24 news: macOS DMGs provided again for releases 98 and newer."),
        ok("LIMITATIONS", MKV_HOME, "2026-01-02: author would stop macOS binaries; 2026-05-24: two community members took over macOS builds."),
      ],
      notes: "Read the official site home page, the source page and the Codeberg README.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* 3D                                                                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "blockbench",
    name: "Blockbench",
    shortDescription: "Low-poly 3D model editor with texture painting and animation, as a desktop or web app.",
    longDescription:
      "Blockbench is a model editor for low-poly models with pixel-art textures. It covers modelling with cuboids or meshes, UV mapping and painting directly on the model, keyframe animation and a plugin store, with dedicated formats for Minecraft Java and Bedrock Edition.",
    whyListed: "An approachable open-source tool for game-ready low-poly models and animations.",
    category: "three-d",
    subcategories: ["animation", "games"],
    resourceType: "DESKTOP_APP",
    officialUrl: BLOCKBENCH_HOME,
    sourceUrl: BLOCKBENCH_REPO,
    licenseUrl: "https://github.com/JannisX11/blockbench/blob/master/LICENSE.MD",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    licenseNotes: "Plugins and themes may be published under any licence, including proprietary or paid. Models and textures you create are your own.",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [],
    features: [
      "Cuboid and mesh low-poly modelling",
      "Automatic UV mapping and 3D/2D texture painting",
      "Keyframe animation with a graph editor",
      "Built-in plugin store",
      "Exports to standard formats and Minecraft formats",
    ],
    tags: ["3d-modeling", "low-poly", "pixel-art", "minecraft"],
    research: {
      date: DATE,
      sources: [
        src(BLOCKBENCH_HOME, "Official site: features, free statement, web app"),
        src(BLOCKBENCH_REPO, "GitHub repository: GPL-3.0 licence, plugin exception, ownership of creations"),
      ],
      checks: [
        ok("OFFICIAL_URL", BLOCKBENCH_HOME, "blockbench.net with Download and 'Open Web App' (web.blockbench.net)."),
        ok("FREE_STATUS", BLOCKBENCH_HOME, "'Blockbench is free to use for any type of project, forever, no strings attached.'"),
        ok("OPEN_SOURCE_STATUS", BLOCKBENCH_HOME, "'The project is open source under the GPL license.'"),
        ok("LICENSE", BLOCKBENCH_REPO, "'The Blockbench source-code is licensed under the GPL license version 3.'"),
        ok("COMMERCIAL_USE", BLOCKBENCH_HOME, "'free to use for any type of project'; README: 'All assets created with Blockbench ... are your own!'"),
        ok("PERSONAL_USE", BLOCKBENCH_HOME, "'free to use for any type of project, forever'."),
      ],
      notes: "Read the official home page and the GitHub README. Desktop operating systems were not listed on the pages read, so only the web app is recorded as a platform.",
    },
  },
  {
    slug: "goxel",
    name: "Goxel",
    shortDescription: "GPL-3.0 voxel editor with layers, unlimited scene size and exports to glTF, OBJ and MagicaVoxel.",
    longDescription:
      "Goxel is a 3D voxel editor by Guillaume Chereau. It uses sparse matrices so scenes have no size limit, supports layers, and exports to MagicaVoxel, Qubicle, glTF2, OBJ, PLY and other formats. Desktop builds for Windows, macOS and Linux are on GitHub; iOS and Android versions are also published.",
    whyListed: "A small open-source tool for voxel art, a style used in many games.",
    category: "three-d",
    subcategories: ["games"],
    resourceType: "DESKTOP_APP",
    officialUrl: GOXEL_HOME,
    sourceUrl: GOXEL_REPO,
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-3.0",
    licenseNotes: "The author offers the code under a commercial licence on request, and contributors sign a CLA so the mobile branch can be distributed under a non-GPL licence.",
    platforms: ["WINDOWS", "MACOS", "LINUX", "IOS", "ANDROID"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: ["The iOS and Android versions are distributed separately and their price and licence were not stated on the pages read"],
    features: [
      "Unlimited scene size",
      "Layers",
      "Unlimited undo",
      "Ray tracing and marching-cube rendering",
      "Export to MagicaVoxel, Qubicle, glTF2, OBJ, PLY and PNG",
    ],
    tags: ["voxel", "voxel-art", "3d-modeling", "game-assets"],
    alternativeTo: ["Qubicle"],
    research: {
      date: DATE,
      sources: [
        src(GOXEL_HOME, "Official site: features, platforms"),
        src(GOXEL_DOWNLOAD, "Download page: desktop and mobile builds"),
        src(GOXEL_REPO, "GitHub repository: licence, CLA note"),
      ],
      checks: [
        ok("OFFICIAL_URL", GOXEL_HOME, "'This is the official website of the 3D voxel editor Goxel.'"),
        ok("FREE_STATUS", GOXEL_HOME, "'Get the desktop version now for free in the download page.'"),
        ok("OPEN_SOURCE_STATUS", GOXEL_REPO, "Repository 'About': 'Goxel: Free and Open Source 3D Voxel Editor'."),
        ok("LICENSE", GOXEL_REPO, "'Goxel is released under the GNU GPL3 licence.'"),
        ok("PLATFORM_AVAILABILITY", GOXEL_DOWNLOAD, "Desktop 0.15.1 downloads for Windows, MacOS and Linux AppImage; links to iOS and Android versions."),
        ok("LIMITATIONS", GOXEL_REPO, "CLA exists 'to allow me to distribute the mobile branch goxel under a non GPL licence'."),
      ],
      notes: "Read the home, download and GitHub pages. Mobile store listings were not opened, so whether the mobile apps are paid is not recorded.",
    },
  },
  {
    slug: "material-maker",
    name: "Material Maker",
    shortDescription: "Node-based procedural PBR material and texture-painting tool, MIT-licensed, built on Godot.",
    longDescription:
      "Material Maker is a procedural materials authoring tool by Rodz Labs. Textures are built as node graphs from about 250 nodes, exported for Godot, Unity and Unreal, and an experimental painter textures 3D models with procedural brushes. Builds are pay-what-you-want on itch.io, including zero, and paid on Steam.",
    whyListed: "An open-source alternative for procedural game materials, with a community library of shared materials.",
    category: "three-d",
    subcategories: ["games"],
    resourceType: "DESKTOP_APP",
    officialUrl: MM_HOME,
    sourceUrl: MM_REPO,
    pricingUrl: MM_ITCH,
    licenseUrl: "https://github.com/RodZill4/material-maker/blob/master/LICENSE.md",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MIT",
    licenseNotes: "itch.io lists the code licence as MIT and the asset licence as CC0 1.0.",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: [
      "The Steam release is paid; the itch.io release is name-your-own-price and can be downloaded for $0",
      "The 3D painting tool is described as experimental",
    ],
    features: [
      "Around 250 base nodes, extensible with GLSL",
      "PBR export for Godot, Unity and Unreal",
      "Experimental procedural 3D painting",
      "Community library of materials, brushes and environments",
    ],
    tags: ["pbr", "procedural-textures", "materials", "game-assets"],
    alternativeTo: ["Adobe Substance 3D Designer"],
    relatedResources: ["blender", "godot"],
    research: {
      date: DATE,
      sources: [
        src(MM_HOME, "Official site: description, download links"),
        src(MM_REPO, "GitHub repository: MIT licence"),
        src(MM_ITCH, "Official itch.io page: pay-what-you-want, platforms, licences"),
      ],
      checks: [
        ok("OFFICIAL_URL", MM_HOME, "materialmaker.org, 'The open source procedural materials authoring tool'."),
        ok("FREE_STATUS", MM_ITCH, "'Material Maker is free and open source ... If you don't feel like paying anything, just click the \"No thanks, just take me to the downloads\" link'."),
        ok("OPEN_SOURCE_STATUS", MM_REPO, "'Unless otherwise specified, files in this repository are licensed under the MIT license.'"),
        ok("LICENSE", MM_REPO, "Repository licence: MIT."),
        ok("PRICING_INFORMATION", MM_ITCH, "'Name your own price'; author comment: 'it is paid on both Steam and itch. Except you choose the price on itch. And yeah, you can choose 0$.'"),
        ok("PLATFORM_AVAILABILITY", MM_ITCH, "'A downloadable tool for Windows, macOS, and Linux'."),
        ok("LIMITATIONS", MM_HOME, "Site lists an 'experimental painting tool'; Steam is a separate paid storefront."),
      ],
      notes: "Read the official site, GitHub README and the developer's itch.io page. Steam price was not read and is not recorded.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Stock media                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "coverr",
    name: "Coverr",
    shortDescription: "Stock videos and music usable commercially without attribution, under Coverr's own licence.",
    longDescription:
      "Coverr publishes stock video footage and music that can be downloaded and used for commercial and non-commercial projects without attribution. Its licence forbids building a competing service and using the content to train AI. The site also sells a Coverr+ subscription and AI generation tools, and supplements search with Shutterstock results.",
    whyListed: "A source of HD and some 4K b-roll and background video that can be used in commercial work.",
    category: "stock-media",
    subcategories: ["video"],
    resourceType: "STOCK_VIDEO",
    officialUrl: "https://coverr.co/",
    licenseUrl: COVERR_LICENSE,
    freeStatus: "FREE_TIER",
    openSource: false,
    license: "Coverr licence (not CC0)",
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    apiAvailable: true,
    downloadAvailable: true,
    limitations: [
      "Content may not be used to build a similar or competing service, or resold or redistributed",
      "Content may not be used to train AI models or as part of a dataset",
      "Model releases are not provided to users; no releases are held for brands, trademarks or landmarks shown",
      "Some search results are Shutterstock videos, which are not covered by Coverr's free licence",
      "A paid Coverr+ subscription and AI tools sit alongside the free downloads",
    ],
    features: ["Stock video in HD MP4, sometimes 4K", "Stock music", "API for developers", "No attribution required"],
    tags: ["stock-video", "b-roll", "stock-music", "video-backgrounds"],
    relatedResources: ["pexels", "pixabay", "mixkit"],
    research: {
      date: DATE,
      sources: [src(COVERR_LICENSE, "Coverr licence page and FAQ")],
      checks: [
        ok("OFFICIAL_URL", COVERR_LICENSE, "Licence page on coverr.co, the provider's own site."),
        ok("FREE_STATUS", COVERR_LICENSE, "'You may use Coverr.co's videos and music for both commercial and non-commercial purposes at no cost.'"),
        ok("COMMERCIAL_USE", COVERR_LICENSE, "'irrevocable, non-exclusive, worldwide copyright license to download, copy, modify, perform, and use videos and music ... including for commercial purposes'."),
        ok("PERSONAL_USE", COVERR_LICENSE, "'for both commercial and non-commercial purposes'."),
        ok("LICENSE", COVERR_LICENSE, "FAQ: 'Coverr started as CC0 ... We've since decided to keep our videos free to use for commercial purposes as long as it's not by competitors.'"),
        ok("LIMITATIONS", COVERR_LICENSE, "'This license does not permit: Compiling videos ... to create a similar or competing service. Using videos or music ... for training AI algorithms'; 'we do not provide these releases to users'; FAQ notes Shutterstock videos supplement the catalogue."),
        ok("FREE_TIER_LIMITS", COVERR_LICENSE, "Licence distinguishes 'Free Downloads' from 'Coverr+ Members'; FAQ: 'All of our videos are HD in MP4 format. We sometimes also offer 4K quality, which you're able to download free as well.'"),
      ],
      notes: "Read the licence page. The Coverr+ price was not read and is not recorded. API availability is from the licence FAQ ('Do you have an API? Yes').",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Fonts                                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: "atkinson-hyperlegible",
    name: "Atkinson Hyperlegible",
    shortDescription: "Braille Institute font family designed for low-vision readers, free for personal and commercial use.",
    longDescription:
      "Atkinson Hyperlegible is a font family from Braille Institute of America, designed so letters and numbers are easy to tell apart for readers with low vision. The family now has three versions: the original, Atkinson Hyperlegible Next (seven weights, variable) and Atkinson Hyperlegible Mono.",
    whyListed: "A legibility-focused typeface that can be used in commercial work, including signage, packaging and interfaces.",
    category: "fonts",
    resourceType: "FONT",
    officialUrl: ATKINSON_HOME,
    licenseUrl: "https://brailleinstitute.box.com/s/rin3vzegmcy7sil28yfqslz2r5etv5nl",
    freeStatus: "FREE",
    openSource: false,
    license: "Braille Institute End-User License Agreement",
    platforms: ["WINDOWS", "MACOS"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: [
      "The official download form asks for an email address and agreement to the EULA",
      "The EULA text was not read; check it before redistributing or modifying the font files",
    ],
    features: [
      "Three versions: Atkinson Hyperlegible, Next and Mono",
      "Next and Mono: weights from ExtraLight to ExtraBold, plus a variable version",
      "Next and Mono support over 150 languages",
      "Distinct letterforms for commonly confused characters such as B/8, O/0 and 1/I/l",
    ],
    tags: ["accessibility", "low-vision", "typeface", "legibility"],
    research: {
      date: DATE,
      sources: [src(ATKINSON_HOME, "Braille Institute font page: versions, free status, download process")],
      checks: [
        ok("OFFICIAL_URL", ATKINSON_HOME, "brailleinstitute.org/freefont, the creator's own download page."),
        ok("FREE_STATUS", ATKINSON_HOME, "'Good news, it's free for everyone—from personal use to all commercial applications.' and 'Free to download and use. Always.'"),
        ok("COMMERCIAL_USE", ATKINSON_HOME, "Each version: 'Free for personal use and all commercial applications.'"),
        ok("PERSONAL_USE", ATKINSON_HOME, "'Free for personal use and all commercial applications.'"),
        ok("LICENSE", ATKINSON_HOME, "'By downloading, installing and/or using the font software, you confirm that you have read and agree to be bound by the terms of this End-User License Agreement.'"),
        ok("PLATFORM_AVAILABILITY", ATKINSON_HOME, "Installation instructions given for Windows PC and Mac."),
        ok("LIMITATIONS", ATKINSON_HOME, "'Please enter your email address to begin downloading.' plus a required EULA agreement checkbox."),
      ],
      notes: "Read the Braille Institute font page. The linked EULA (Box file) was not opened, so the licence is named but its terms are not summarised. Not marked open source.",
    },
  },
  {
    slug: "ek-type-anek",
    name: "Anek (Ek Type)",
    shortDescription: "Variable type family from Mumbai's Ek Type covering Latin and nine Indian scripts, under the SIL OFL.",
    longDescription:
      "Anek is a variable font family designed by Ek Type, a Mumbai type collective. It covers Latin, Devanagari, Gujarati, Malayalam, Tamil, Telugu, Kannada, Gurmukhi, Odia and Bangla, with weight and width axes. Ek Type's open-sourced families are released under the SIL Open Font License; some of its other families are sold.",
    whyListed: "One family that sets Latin and nine Indian scripts in a matching style, which is rare among libre fonts.",
    category: "fonts",
    subcategories: ["languages"],
    resourceType: "FONT",
    officialUrl: ANEK_PAGE,
    sourceUrl: "https://github.com/EkType/Anek",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "SIL Open Font License",
    platforms: ["WINDOWS", "MACOS"],
    languages: [],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "unknown",
    personalUse: "unknown",
    downloadAvailable: true,
    limitations: ["Only Ek Type's open-sourced families are free; others such as Sama, Ek Odia and Ek Kannada are sold under paid licences"],
    features: [
      "Ten scripts: Latin, Devanagari, Gujarati, Malayalam, Tamil, Telugu, Kannada, Gurmukhi, Odia and Bangla",
      "Variable font with two axes (weight and width)",
      "Complete-family download from the official page",
      "Source files on GitHub",
    ],
    tags: ["indic-fonts", "devanagari", "variable-font", "india"],
    relatedResources: ["noto-fonts", "smc-malayalam-fonts"],
    research: {
      date: DATE,
      sources: [
        src(ANEK_PAGE, "Ek Type Anek family page: scripts, free status, source link"),
        src(EKTYPE_LICENSING, "Ek Type licensing help: OFL for open-sourced families, paid licence types"),
      ],
      checks: [
        ok("OFFICIAL_URL", ANEK_PAGE, "ektype.in, Ek Type's own site; Anek is 'designed, engineered and maintained by Ek Type'."),
        ok("FREE_STATUS", ANEK_PAGE, "Family page marked 'Free' and 'Free & Open Source' with a complete-family download."),
        ok("OPEN_SOURCE_STATUS", ANEK_PAGE, "'The source files can be downloaded from github.com/EkType/Anek'."),
        ok("LICENSE", EKTYPE_LICENSING, "'SIL OPEN FONT LICENSE (OFL) — Our open sourced families are released under this license.'"),
        ok("PLATFORM_AVAILABILITY", EKTYPE_LICENSING, "Installation instructions given for Windows and Mac."),
        ok("LIMITATIONS", EKTYPE_LICENSING, "Paid licence types (print/desktop, e-book, app embedding, broadcast, self-hosting, corporate) apply to Ek Type's licensed fonts; the home page marks Sama as 'Licensed' and Ek Odia/Ek Kannada as '(Buy)'."),
      ],
      notes: "Read the Anek family page and Ek Type's licensing help page. The OFL version number is not stated on those pages. The GitHub repository itself was not opened.",
    },
  },
]);
