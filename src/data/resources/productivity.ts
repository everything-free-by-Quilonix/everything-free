import { defineResources } from "./define";

export const productivityResources = defineResources([
  {
    slug: "libreoffice",
    name: "LibreOffice",
    shortDescription: "Full office suite: documents, spreadsheets, presentations, drawings and databases.",
    longDescription:
      "LibreOffice is a desktop office suite comprising Writer, Calc, Impress, Draw, Base and Math. It uses the OpenDocument standard natively and reads and writes Microsoft Office formats, with no account, subscription or cloud dependency.",
    whyListed:
      "A complete office suite that works entirely offline with no account, and whose native file format is an open standard rather than a vendor container.",
    category: "documents",
    subcategories: ["spreadsheets", "presentations", "productivity", "open-source"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://www.libreoffice.org",
    sourceUrl: "https://git.libreoffice.org/core",
    licenseUrl: "https://www.libreoffice.org/licenses/",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MPL-2.0",
    licenseNotes:
      "Made available under the Mozilla Public License 2.0. It is based on Apache OpenOffice code under the Apache License 2.0 and bundles components under other open-source licences, which the installed Help › License Information dialog lists.",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "Word processor, spreadsheet and presentation applications",
      "Vector drawing and database tools",
      "Native OpenDocument format",
      "Reads and writes Microsoft Office formats",
      "Direct export to PDF",
      "Works entirely offline",
      "Extension ecosystem",
    ],
    limitations: [
      "Microsoft Office support is partial: most real-world .docx, .xlsx and .pptx files open and save well, but complex documents may not round-trip exactly.",
      "No real-time co-editing in the desktop applications; that exists only in separately hosted LibreOffice-based online suites.",
      "Some features, notably the Base database, need a Java runtime installed.",
    ],
    tags: ["office-suite", "documents", "spreadsheets", "offline", "open-standard"],
    alternativeTo: ["Microsoft Office", "Microsoft 365", "Google Workspace"],
    relatedResources: ["stirling-pdf", "zotero", "languagetool"],
    verificationStatus: "PARTIALLY_VERIFIED",
    compilationNotes: "Licence and platform support recorded from the project's site and source repository.",
    verificationNotes:
      "Every required check was confirmed against The Document Foundation's own pages on 26 September 2026: the LibreOffice FAQ, licences page, system requirements and the feature comparison on the project's wiki. The pass replaced an editorial remark that the interface is \"more traditional\" — the project documents several interface layouts, including a tabbed one — with a vendor-stated limitation, the Java requirement for Base. It also made the Microsoft Office limitation match the project's own wording (\"partial\" support) and recorded the licence's Apache OpenOffice origins. The evidence is complete, but this pass was agent-assisted, so the listing is not marked Verified until a registered maintainer re-opens the sources and signs it off.",
    lastVerifiedAt: "2026-09-26",
    verifiedBy: "agent-assisted pass — awaiting maintainer review",
    verificationSources: [
      {
        url: "https://www.libreoffice.org/faq/",
        label:
          "LibreOffice FAQ: free and open source under MPL 2.0; usable in a business on any number of computers without licence fees; donations optional and the download always free",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://www.libreoffice.org/licenses/",
        label:
          "Licences page: made available under MPL v2.0, based on Apache OpenOffice code, bundling other open-source components (the former /about-us/licenses/ address answers 301 here)",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://www.libreoffice.org/get-help/system-requirements/",
        label: "System requirements: Windows, macOS and GNU/Linux; Java needed for some features, notably Base; Android has a separate viewer",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://wiki.documentfoundation.org/Feature_Comparison:_LibreOffice_-_Microsoft_Office",
        label:
          "The Document Foundation's feature comparison: partial OOXML support; no synchronous collaborative editing in the desktop applications",
        retrievedAt: "2026-09-26",
      },
    ],
    verificationChecks: [
      {
        check: "OFFICIAL_URL",
        result: "confirmed",
        evidence: "libreoffice.org is The Document Foundation's site for LibreOffice; the FAQ, licences and system requirements pages under it loaded.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "FREE_STATUS",
        result: "confirmed",
        evidence:
          "The FAQ describes LibreOffice as free and open source software that you can use, share and modify under the Mozilla Public License 2.0. That is OPEN_SOURCE.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "FREE_TIER_LIMITS",
        result: "confirmed",
        evidence:
          "There is no tier to cap: the FAQ says it can be used on one computer or 10,000+ without licence fees, and the download is always free.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "LIMITATIONS",
        result: "confirmed",
        evidence:
          "The project's feature comparison rates Microsoft OOXML import and export as partial and says synchronous collaborative editing is not available in the desktop applications. The system requirements page says Java is required for some features, notably Base.",
        sourceUrl: "https://wiki.documentfoundation.org/Feature_Comparison:_LibreOffice_-_Microsoft_Office",
      },
      {
        check: "ACCOUNT_REQUIREMENT",
        result: "confirmed",
        evidence:
          "The FAQ describes the download as clicking Download and then a direct link on the next page; no account or sign-in is involved.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "CREDIT_CARD_REQUIREMENT",
        result: "confirmed",
        evidence: "The FAQ states donations are purely optional and LibreOffice can always be downloaded for free. No card is needed.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "COMMERCIAL_USE",
        result: "confirmed",
        evidence:
          "The FAQ answers 'Can I use LibreOffice in my business?' with yes — on one computer or 10,000+ in an enterprise, without licence fees.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "PERSONAL_USE",
        result: "confirmed",
        evidence: "The FAQ says anyone can use, share and modify the software under the MPL 2.0.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "LICENSE",
        result: "confirmed",
        evidence:
          "The licences page states LibreOffice is made available under the MPL v2.0, based on Apache-licensed OpenOffice code and bundling other open-source components. Matches the recorded MPL-2.0 and the licence note.",
        sourceUrl: "https://www.libreoffice.org/licenses/",
      },
      {
        check: "PRICING_INFORMATION",
        result: "confirmed",
        evidence:
          "No paid edition from The Document Foundation: the FAQ says it is free, with optional donations, and points larger deployments to paid support from third-party professionals.",
        sourceUrl: "https://www.libreoffice.org/faq/",
      },
      {
        check: "PLATFORM_AVAILABILITY",
        result: "confirmed",
        evidence:
          "The system requirements page covers Windows, macOS and GNU/Linux — the three platforms recorded. Android has only a separate viewer, so it is not listed.",
        sourceUrl: "https://www.libreoffice.org/get-help/system-requirements/",
      },
      {
        check: "OPEN_SOURCE_STATUS",
        result: "confirmed",
        evidence: "Free and open source under the MPL 2.0, per the FAQ and the licences page. Matches openSource: true.",
        sourceUrl: "https://www.libreoffice.org/licenses/",
      },
    ],
    editorialSpotlight: true,
  },
  {
    slug: "obsidian",
    name: "Obsidian",
    shortDescription: "Local-first note-taking on plain Markdown files, free for any use.",
    longDescription:
      "Obsidian is a note-taking application that works directly on a folder of Markdown files on your own disk. It links notes together, visualises those links as a graph, and has a large community plugin ecosystem. Optional paid add-ons provide hosted sync and publishing.",
    whyListed:
      "Notes are plain Markdown files in a folder you control, so the data survives the application. Free for personal and commercial use, with only the optional hosted services paid.",
    category: "productivity",
    subcategories: ["personal", "study-tools", "documents"],
    resourceType: "DESKTOP_APP",
    officialUrl: "https://obsidian.md",
    pricingUrl: "https://obsidian.md/pricing",
    licenseUrl: "https://obsidian.md/license",
    freeStatus: "FREE",
    openSource: false,
    license: "Proprietary",
    licenseNotes:
      "Obsidian is not open source, but its data format is: notes are plain Markdown files in an ordinary folder, so there is no lock-in even though the application is proprietary.",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "Stores notes as plain Markdown files locally",
      "Bidirectional links and a graph view",
      "Works fully offline with no account",
      "Large community plugin and theme ecosystem",
      "Available on desktop and mobile",
    ],
    limitations: [
      "Hosted sync across devices is a paid add-on; you can sync the folder yourself with other tools instead.",
      "Publishing notes as a website is a separate paid add-on.",
      "The application is closed source, although the note files are not.",
    ],
    pricingNotes:
      "The application is free for all uses, including commercial. Optional Commercial and Catalyst licences exist as a way to support development, and Sync and Publish are separate paid services.",
    tags: ["notes", "markdown", "local-first", "personal-knowledge", "offline", "students"],
    alternativeTo: ["Notion", "Evernote", "Roam Research"],
    relatedResources: ["languagetool", "anki", "libreoffice"],
    verificationStatus: "PARTIALLY_VERIFIED",
    verificationNotes:
      "Every checklist item was confirmed against Obsidian's own pages on 26 September 2026: the licence overview, pricing FAQ, download page, Sync page and the announcement that removed the commercial-licence requirement. That announcement corrects a widely repeated claim that workplace use needs a paid licence. The licence overview and pricing FAQ were re-read the same day while preparing for sign-off, and one editorial remark that no Obsidian page states was removed from the limitations. The evidence is complete, but this pass was agent-assisted, so the listing is not marked Verified until a maintainer listed in the project's maintainer register re-opens the sources and signs it off under their own GitHub handle.",
    lastVerifiedAt: "2026-09-26",
    verifiedBy: "agent-assisted pass — awaiting maintainer review",
    verificationSources: [
      {
        url: "https://obsidian.md",
        label: "Obsidian homepage on the vendor's own domain",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://obsidian.md/license",
        label: "Licence overview: free for any purpose, no account needed to download or use, rights to app code reserved",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://obsidian.md/pricing",
        label: "Pricing FAQ: no payment required for commercial use; Sync and Publish are refundable paid purchases",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://obsidian.md/blog/free-for-work/",
        label: "Vendor announcement making the Commercial licence optional; all features free without limits",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://obsidian.md/download",
        label: "Download page listing iOS, Android, Windows, Mac and Linux builds",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://obsidian.md/sync",
        label: "Sync page pricing Obsidian Sync as a paid per-user subscription",
        retrievedAt: "2026-09-26",
      },
    ],
    verificationChecks: [
      {
        check: "OFFICIAL_URL",
        result: "confirmed",
        evidence: "obsidian.md is the vendor's own domain; the homepage and the licence, pricing and download pages under it all loaded.",
        sourceUrl: "https://obsidian.md",
      },
      {
        check: "FREE_STATUS",
        result: "confirmed",
        evidence:
          "The licence overview states Obsidian can be downloaded and used for free, forever, for any purpose. That matches FREE: no time limit and no paid upgrade needed for normal use.",
        sourceUrl: "https://obsidian.md/license",
      },
      {
        check: "FREE_TIER_LIMITS",
        result: "confirmed",
        evidence:
          "The announcement states all features are available for free without limits. The only paid items are the optional supporter licences and the separate Sync and Publish services, so the app itself has no free-tier cap.",
        sourceUrl: "https://obsidian.md/blog/free-for-work/",
      },
      {
        check: "LIMITATIONS",
        result: "confirmed",
        evidence:
          "Sync is sold as a per-user monthly subscription; the pricing FAQ describes Sync and Publish as refundable purchases, confirming both are paid; the licence overview reserves the vendor's rights to the app's code, confirming it is closed source. Every listed limitation is now one of these vendor-stated facts.",
        sourceUrl: "https://obsidian.md/sync",
      },
      {
        check: "ACCOUNT_REQUIREMENT",
        result: "confirmed",
        evidence: "The licence overview states that you can download and use Obsidian without creating an account.",
        sourceUrl: "https://obsidian.md/license",
      },
      {
        check: "CREDIT_CARD_REQUIREMENT",
        result: "confirmed",
        evidence:
          "The licence overview states that you can download and use Obsidian without creating an account, and that an account is only needed for payments or add-on services. Using the app involves no account and no payment step, so no card is required.",
        sourceUrl: "https://obsidian.md/license",
      },
      {
        check: "COMMERCIAL_USE",
        result: "confirmed",
        evidence:
          "The pricing FAQ answers 'Do I have to pay for commercial use?' with 'No'; the Commercial licence is encouraged but optional.",
        sourceUrl: "https://obsidian.md/pricing",
      },
      {
        check: "PERSONAL_USE",
        result: "confirmed",
        evidence: "The licence overview lists personal use first among the purposes Obsidian may be used for free.",
        sourceUrl: "https://obsidian.md/license",
      },
      {
        check: "LICENSE",
        result: "confirmed",
        evidence:
          "The licence overview says the vendor owns and reserves rights to the code in the app, and use is governed by its Terms of Service. That matches the recorded 'Proprietary'.",
        sourceUrl: "https://obsidian.md/license",
      },
      {
        check: "PRICING_INFORMATION",
        result: "confirmed",
        evidence:
          "The pricing FAQ confirms the Commercial and Catalyst licences are optional supporter purchases, and that Sync and Publish are the paid services. This matches the recorded free/paid boundary.",
        sourceUrl: "https://obsidian.md/pricing",
      },
      {
        check: "OPEN_SOURCE_STATUS",
        result: "confirmed",
        evidence:
          "Not open source: the licence overview reserves the vendor's rights to the app's code rather than publishing it under an open-source licence. Matches openSource: false.",
        sourceUrl: "https://obsidian.md/license",
      },
      {
        check: "PLATFORM_AVAILABILITY",
        result: "confirmed",
        evidence:
          "The download page offers builds for iOS, Android, Windows, Mac and Linux — the five platforms recorded.",
        sourceUrl: "https://obsidian.md/download",
      },
    ],
    editorialSpotlight: true,
  },
  {
    slug: "thunderbird",
    name: "Thunderbird",
    shortDescription: "Desktop email, calendar and contacts client.",
    longDescription:
      "Thunderbird is a desktop email client with integrated calendaring, contacts, feed reading and chat. It supports IMAP, POP and standards-based calendar protocols, and stores mail locally so it remains readable offline.",
    whyListed:
      "A standards-based mail client that works with any provider, keeps mail on your own machine, and is maintained by a non-profit rather than funded by advertising.",
    category: "communication",
    subcategories: ["productivity", "personal", "open-source"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://www.thunderbird.net",
    sourceUrl: "https://github.com/thunderbird/thunderbird-android",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "MPL-2.0",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "IMAP and POP support for any provider",
      "Integrated calendar and contacts",
      "Local mail storage and offline search",
      "OpenPGP end-to-end encryption built in",
      "Add-on support",
    ],
    limitations: [
      "It is a client only — you still need an email account from a provider.",
      "Initial setup of multiple accounts and folder rules takes some work.",
      "Add-on compatibility can break across major releases.",
    ],
    tags: ["email", "calendar", "offline", "privacy"],
    alternativeTo: ["Microsoft Outlook", "Spark Premium", "Superhuman"],
    relatedResources: ["signal", "libreoffice"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Licence and desktop platform support recorded from the project's site. The Android client is a separate codebase; its feature parity with desktop was not assessed.",
    verificationNotes:
      "Only the official URL has been checked, during link-health triage on 26 September 2026. The monthly link check reported a redirect: thunderbird.net answers with a temporary (302) redirect to a language-specific page such as /en-US/. That is a locale choice, not a move, so the listing keeps the language-neutral address and every visitor lands on their own language. The free status, licence, platforms and every other check are not yet verified.",
    lastVerifiedAt: "2026-09-26",
    verifiedBy: "agent-assisted pass — awaiting maintainer review",
    verificationSources: [
      {
        url: "https://www.thunderbird.net",
        label:
          "Thunderbird's own domain: answers 302 to a language-specific page (/en-US/ for an English request), which loads",
        retrievedAt: "2026-09-26",
      },
    ],
    verificationChecks: [
      {
        check: "OFFICIAL_URL",
        result: "confirmed",
        evidence:
          "thunderbird.net is the project's own domain. The root address redirects temporarily to a page in the visitor's language, which loaded, so the language-neutral address is the right one to list.",
        sourceUrl: "https://www.thunderbird.net",
      },
    ],
  },
  {
    slug: "signal",
    name: "Signal",
    shortDescription: "End-to-end encrypted messaging and calls, run by a non-profit.",
    longDescription:
      "Signal provides end-to-end encrypted one-to-one and group messaging, voice and video calls across mobile and desktop. It is operated by a non-profit foundation funded by donations, and both the clients and the protocol are openly licensed.",
    whyListed:
      "Encryption is on by default rather than an option, the clients are open source, and the funding model is donations rather than advertising or a paid tier.",
    category: "communication",
    subcategories: ["personal", "open-source"],
    resourceType: "MOBILE_APP",
    officialUrl: "https://signal.org",
    sourceUrl: "https://github.com/signalapp",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "AGPL-3.0 (clients); GPL-3.0 (server)",
    platforms: ["ANDROID", "IOS", "WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "yes",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "End-to-end encryption on by default",
      "Encrypted voice and video calls",
      "Group messaging",
      "Disappearing messages",
      "Desktop clients linked to the mobile app",
    ],
    limitations: [
      "Registration requires a phone number, though a separate username can be used for contact.",
      "The desktop client must be linked to a registered mobile device.",
      "Message history does not sync from the cloud by design, which makes moving to a new device more involved.",
      "Everyone you talk to has to install it too.",
    ],
    tags: ["messaging", "encryption", "privacy", "non-profit"],
    alternativeTo: ["WhatsApp", "Telegram Premium"],
    relatedResources: ["thunderbird"],
    verificationStatus: "UNVERIFIED",
    compilationNotes:
      "Licensing and the phone-number registration requirement are documented by the project. Current username and discovery behaviour was not re-checked.",
  },
  {
    slug: "vlc",
    name: "VLC media player",
    shortDescription: "Plays essentially any audio or video format, on almost any platform.",
    longDescription:
      "VLC is a media player that handles a very wide range of container and codec combinations without separate codec packs, alongside streaming, conversion and basic subtitle handling. It runs on desktop and mobile platforms and is developed by the non-profit VideoLAN project.",
    whyListed:
      "It plays files other players refuse, contains no advertising or bundled software, and asks for nothing — a rare combination in consumer media software.",
    category: "utilities",
    subcategories: ["video", "audio", "streaming", "open-source"],
    resourceType: "OPEN_SOURCE",
    // Trailing slash on purpose. VideoLAN serves this page over HTTPS, but its server
    // redirects the slashless address to plain HTTP (checked 2026-09-26). Linking the
    // slash form keeps visitors on HTTPS. Do not "tidy" it back.
    officialUrl: "https://www.videolan.org/vlc/",
    sourceUrl: "https://code.videolan.org/videolan/vlc",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0-or-later",
    platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "Very broad format and codec support with nothing to install separately",
      "No advertising and no bundled extras",
      "Network stream playback",
      "Basic format conversion",
      "Subtitle handling and synchronisation",
    ],
    limitations: [
      "The interface is functional rather than polished.",
      "Its conversion and editing capabilities are rudimentary next to dedicated tools.",
    ],
    tags: ["media-player", "video", "audio", "codecs", "no-ads", "everyday"],
    alternativeTo: ["Paid media players with codec packs"],
    relatedResources: ["obs-studio", "shotcut"],
    verificationStatus: "UNVERIFIED",
    compilationNotes: "Licence and platform support recorded from the project's site and source repository.",
    verificationNotes:
      "Only the official URL has been checked, during link-health triage on 26 September 2026. The monthly link check reported that the listed address redirected to plain HTTP. VideoLAN's server does that for https://www.videolan.org/vlc (no trailing slash), while https://www.videolan.org/vlc/ loads directly over HTTPS, so the listing now links the HTTPS address rather than following the downgrade. The free status, licence, platforms and every other check are not yet verified.",
    lastVerifiedAt: "2026-09-26",
    verifiedBy: "agent-assisted pass — awaiting maintainer review",
    verificationSources: [
      {
        url: "https://www.videolan.org/vlc/",
        label:
          "VLC page on VideoLAN's own domain: returns 200 over HTTPS at this address; the address without the trailing slash answers 301 to http://www.videolan.org/vlc/",
        retrievedAt: "2026-09-26",
      },
    ],
    verificationChecks: [
      {
        check: "OFFICIAL_URL",
        result: "confirmed",
        evidence:
          "videolan.org is the VideoLAN project's own domain and the VLC page loaded over HTTPS. The listing uses the trailing-slash address because the slashless one redirects to plain HTTP.",
        sourceUrl: "https://www.videolan.org/vlc/",
      },
    ],
  },
  {
    // Added 26 September 2026, after the verification workflow was in place, and
    // verified through it before listing rather than compiled first.
    slug: "keepassxc",
    name: "KeePassXC",
    shortDescription: "Offline password manager that keeps an encrypted database on your own computer.",
    longDescription:
      "KeePassXC stores passwords, TOTP secrets, SSH keys and notes in a single encrypted KeePass (KDBX) database file on your own device. It can fill logins through a browser extension and Auto-Type, generate passwords and passphrases, and works entirely offline; syncing between devices is done by placing the file in a folder you already sync.",
    whyListed:
      "Most password managers are hosted services with a paid tier. This one has no account and no server: the encrypted file is yours, stays on your machine, and opens in other KeePass-compatible apps.",
    category: "utilities",
    subcategories: ["personal", "open-source"],
    resourceType: "OPEN_SOURCE",
    officialUrl: "https://keepassxc.org",
    sourceUrl: "https://github.com/keepassxreboot/keepassxc",
    licenseUrl: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
    freeStatus: "OPEN_SOURCE",
    openSource: true,
    license: "GPL-2.0-only OR GPL-3.0-only",
    platforms: ["WINDOWS", "MACOS", "LINUX"],
    requiresAccount: "no",
    requiresCreditCard: "no",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    features: [
      "Encrypted KeePass (KDBX 4) database stored locally",
      "Browser extension for filling logins from the local database",
      "Password and passphrase generator",
      "TOTP codes and SSH agent integration",
      "Works fully offline; network access only for optional favicon downloads",
    ],
    limitations: [
      "No mobile app of its own; the project points to other KeePass-compatible apps for Android and iOS.",
      "No built-in sync: to use the database on several devices you keep the file in a folder synced by another service.",
      "Auto-Type on Linux works only in an X11 session, not under Wayland.",
      "No plugin support, by design.",
    ],
    pricingNotes: "No paid edition. Development is supported by optional donations.",
    tags: ["password-manager", "security", "offline", "privacy", "everyday"],
    alternativeTo: ["1Password", "LastPass", "Dashlane"],
    relatedResources: ["signal", "thunderbird"],
    verificationStatus: "PARTIALLY_VERIFIED",
    verificationNotes:
      "Checked against KeePassXC's own download page, FAQ and the licence file in the official repository on 26 September 2026, before the entry was listed. Every required check is confirmed. The limitations are the ones the project itself states in its FAQ. The evidence is complete, but this pass was agent-assisted, so the listing is not marked Verified until a registered maintainer re-opens the sources and signs it off.",
    lastVerifiedAt: "2026-09-26",
    verifiedBy: "agent-assisted pass — awaiting maintainer review",
    verificationSources: [
      {
        url: "https://keepassxc.org/download/",
        label:
          "Download page: version 2.7.12 for macOS, Windows 10/11 and Linux; direct downloads and package managers with no sign-in; donations optional for 'this free software'",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://keepassxc.org/docs/",
        label:
          "FAQ: no own mobile app (recommends KeePassDX, KeePass2Android, Strongbox, KeePassium); sync by storing the database in a synced folder; no plugins; Auto-Type on Linux X11 only; network access only for opt-in favicons",
        retrievedAt: "2026-09-26",
      },
      {
        url: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
        label: "Licence file in the official repository: GNU GPL version 2 or (at your option) version 3",
        retrievedAt: "2026-09-26",
      },
    ],
    verificationChecks: [
      {
        check: "OFFICIAL_URL",
        result: "confirmed",
        evidence:
          "keepassxc.org is the project's site, and the official repository keepassxreboot/keepassxc names it as its homepage. The download page and FAQ loaded.",
        sourceUrl: "https://keepassxc.org/download/",
      },
      {
        check: "FREE_STATUS",
        result: "confirmed",
        evidence:
          "The licence file releases KeePassXC under the GNU GPL version 2 or 3, and the download page calls it free software. That is OPEN_SOURCE.",
        sourceUrl: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
      },
      {
        check: "FREE_TIER_LIMITS",
        result: "confirmed",
        evidence: "There is no tier to cap: the download page offers the full current release (2.7.12) and mentions no paid edition.",
        sourceUrl: "https://keepassxc.org/download/",
      },
      {
        check: "LIMITATIONS",
        result: "confirmed",
        evidence:
          "The FAQ states there is no KeePassXC mobile app, that syncing is done by storing the database in a shared cloud folder, that plugins are not supported, and that Auto-Type on Linux works only under X11, not Wayland.",
        sourceUrl: "https://keepassxc.org/docs/",
      },
      {
        check: "ACCOUNT_REQUIREMENT",
        result: "confirmed",
        evidence:
          "The download page links installers and package-manager commands directly, with no sign-in, and describes it as keeping passwords on your own computer with no clouds and no third parties.",
        sourceUrl: "https://keepassxc.org/download/",
      },
      {
        check: "CREDIT_CARD_REQUIREMENT",
        result: "confirmed",
        evidence:
          "The download page has no payment step; donating is presented as optional support for 'this free software'. No card is needed.",
        sourceUrl: "https://keepassxc.org/download/",
      },
      {
        check: "COMMERCIAL_USE",
        result: "confirmed",
        evidence:
          "The GNU GPL versions 2 and 3, under which it is released, place no restriction on running the program for any purpose, including at work.",
        sourceUrl: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
      },
      {
        check: "PERSONAL_USE",
        result: "confirmed",
        evidence: "Released as free software under the GPL, which permits running it for any purpose.",
        sourceUrl: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
      },
      {
        check: "LICENSE",
        result: "confirmed",
        evidence:
          "The COPYING file says the program may be redistributed and modified under the GNU GPL 'either version 2 or (at your option) version 3'. Recorded as GPL-2.0-only OR GPL-3.0-only.",
        sourceUrl: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
      },
      {
        check: "PRICING_INFORMATION",
        result: "confirmed",
        evidence: "No paid edition is offered; the download page asks only for optional donations to cover the team's expenses.",
        sourceUrl: "https://keepassxc.org/download/",
      },
      {
        check: "PLATFORM_AVAILABILITY",
        result: "confirmed",
        evidence: "The download page offers macOS, Windows 10/11 and Linux builds — the three platforms recorded.",
        sourceUrl: "https://keepassxc.org/download/",
      },
      {
        check: "OPEN_SOURCE_STATUS",
        result: "confirmed",
        evidence: "GPL version 2 or 3, with the source published in the official GitHub repository. Matches openSource: true.",
        sourceUrl: "https://github.com/keepassxreboot/keepassxc/blob/develop/COPYING",
      },
    ],
    submittedAt: "2026-09-26",
    updatedAt: "2026-09-26",
  },
]);
