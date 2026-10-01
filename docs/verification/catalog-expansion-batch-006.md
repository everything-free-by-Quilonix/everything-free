# Batch 006 — Catalog Expansion Report

Branch `data/resource-expansion-006`, based on `origin/main` at `b06073b` (the merge of Cleanup 001, PR #13). Data-only: one new data file, a two-line registration in `src/data/resources/index.ts`, and the regenerated `docs/verification-backlog.md`.

## Starting State

| | Count |
| :--- | ---: |
| Resources on `origin/main` | **622** (633 before Cleanup 001, minus 11 duplicates removed) |
| `OPEN_SOURCE` / `FREE` / `FREE_TIER` / `PERSONAL_FREE` | 391 / 167 / 59 / 5 |
| `UNVERIFIED` / `PARTIALLY_VERIFIED` / `VERIFIED` | 616 / 6 / 0 |

The catalog was dumped from `seedResources` before any research, so every candidate was checked against the actual 622 entries, not the audit's 633.

## Research

| | Count |
| :--- | ---: |
| Candidates researched | **189** |
| Accepted | **104** |
| Rejected or deferred | **85** |

"Researched" means at least the provider's own site, licence file or repository was read for that candidate. A further 17 names on the initial list were never researched, mostly because the global-archives research run timed out. They are not counted (see the end of Rejections).

Sources were the provider's own pages only: homepages, pricing pages, download pages, licence files, documentation and official repositories (read through the GitHub API where pages were blocked). Where a page could only be read through a search excerpt of the official domain, the entry's `compilationNotes` says so.

## Accepted

### By free status

| Status | New | Catalog after |
| :--- | ---: | ---: |
| `FREE` | 46 | 213 |
| `OPEN_SOURCE` | 40 | 431 |
| `FREE_TIER` | 14 | 73 |
| `PERSONAL_FREE` | 4 | 9 |

Batch 006 is 38% `OPEN_SOURCE`, against 63% for the catalog before it.

### By category

| Category | New | | Category | New |
| :--- | ---: | --- | :--- | ---: |
| documents | 6 | | personal-finance | 3 |
| maps | 6 | | weather | 3 |
| books | 6 | | health-fitness | 3 |
| research | 5 | | science | 3 |
| everyday | 5 | | monitoring, business-finance, marketing, career, fonts, food, travel, games, photography | 2 each |
| learning | 5 | | ai-research, ai-apis, ai-coding, ai-models, hosting, databases, authentication, storage, spreadsheets, utilities, productivity, crm, hr, analytics, exams, streaming, testing, lifestyle, courses, mathematics, wallpapers, stock-media | 1 each |
| languages | 5 | | | |
| personal, music | 4 each | | | |
| ai-chat, developer-utilities | 3 each | | | |

### By resource type

`WEB_APP` 19, `WEBSITE` 14, `DESKTOP_APP` 12, `DEVELOPER_TOOL` 11, `SERVICE` 8, `DATASET` 8, `AI_TOOL` 6, `EDUCATIONAL_RESOURCE` 6, `MOBILE_APP` 5, `BUSINESS_TOOL` 3, `BOOK` 3, `FONT` 2, `UTILITY` 2, `GAME` 2, `API` 1, `COURSE` 1, `STOCK_AUDIO` 1.

### By platform

`BROWSER` 71, `WINDOWS` 31, `MACOS` 29, `LINUX` 26, `ANDROID` 21, `IOS` 19, `SELF_HOSTED` 16. One entry (Let's Encrypt) has no platforms, because it is used through ACME clients rather than an app.

Platforms were recorded only where an official download page, documentation or store link named them. Mobile apps were left out when no official page linking them was read (Google Gemini, IMD, SATHEE, Google Earth mobile). Python's Android and iOS builds are embedding builds for developers, so they were not recorded.

## Rejections

85 candidates were rejected or deferred. Each reason below is the main one; several candidates had more than one.

**Not actually free (7).** AWS Free Tier (new accounts now get time-limited credits), REAPER (60-day evaluation), Fritzing (official binaries are sold), edX (audit access expires), e-Yantra (flagship competition has a fee), FUTO Keyboard (a priced product paid on the honour system), Malwarebytes Free (on-demand clean-up only, personal use only).

**Unclear licensing (4).** Anytype (source-available licence, often described as open source; free-plan caps not confirmed), n8n (Sustainable Use Licence, not OSI), Kavita Kosh (states the poems remain copyrighted and are not licensed), Fontshare (current licence text could not be read).

**Discontinued, abandoned or broken (10).** Pocket (shut down), Banglapedia (serving a placeholder page), Marathi Vishwakosh (domain does not resolve; alternative has a broken certificate chain), Noolaham (repeated 522 errors; end-of-life server stack), Andhra Bharati (no updates since 2020; visible template errors), Avro Keyboard (no release since 2019), NITI Aayog NDAP (empty shell; deep links 404), India Code (mid-migration with a TLS fault), NIOS (TLS fault on the main domain), Frappe Books (README says releases are blocked).

**Insufficient information or unclear identity (18).** Microsoft Copilot (official pages contradict each other on sign-in and free use), Groq (pricing page removed; free plan in flux), HathiTrust (all pages returned 403), OpenIntro (a free English PDF could not be confirmed), Musopen (pages returned 403), Rome2Rio (homepage blocked; no free statement read), KoboToolbox (free-plan eligibility for non-nonprofits unclear), RBI DBIE (page content not readable), Skill India Digital Hub (free/paid split unclear), Sugamya Pustakalaya (cost and eligibility unclear), eSanjeevani (free model and patient platforms unverified), Indian Kanoon (operator and terms not established), Qatar Digital Library (pages returned 403; reuse terms unclear), Wellcome Collection (terms page not found), Global Forest Watch (mid-rename to Global Nature Watch; canonical name and URL unclear), HOT Tasking Manager (liveness not confirmed), Ushahidi (research run timed out), yt-dlp (site terms-of-service questions not assessed).

**Regional restriction (1).** Wave (US and Canada only).

**Duplicate (1).** Open Library is the Internet Archive's lending catalogue, and the existing `internet-archive` entry already covers its lending collections.

**Deferred: overlap or a saturated category (44).** These passed or nearly passed the gates, but were held back to keep the batch near its target and focused on gaps. They are good candidates for a later batch.
- Developer and infrastructure: Buzz (a Whisper front end; `whisper` and `whisper-cpp` are listed), Oracle Cloud Free Tier (card required; idle instances reclaimed; hosting already has 13 entries), Codeberg (Forgejo, Gitea, GitHub and GitLab are listed), Termux, OpenWrt, Homebrew, Burp Suite Community (overlaps OWASP ZAP), SSL Labs.
- Office: SoftMaker FreeOffice (overlaps LibreOffice and ONLYOFFICE), Xournal++, Jira, GanttProject (stable release from January 2024), Hemingway Editor.
- Business: Kimai (Clockify and Toggl listed), Dolibarr (ERPNext, Odoo and Akaunting listed).
- Creative: Paint.NET, Hugin, IrfanView (overlaps XnView MP), Gyroflow, Blockbench, Printables (per-model licences vary), Rijksmuseum (museum open access already well covered).
- Science and research: Hypothesis, jamovi (overlaps JASP and PSPP), Galaxy, NIST Chemistry WebBook (overlaps PubChem and ChemSpider; not openly licensed), NASA Worldview, uMap, Eurostat, MOSDAC.
- Privacy and utilities: Privacy Badger (overlaps uBlock Origin), Orbot and Tails (Tor Browser listed), Privacy Guides (overlaps EFF Surveillance Self-Defense), PowerToys, Everything, Qalculate!.
- Media and games: SuperTuxKart (1.x is in maintenance mode), Board Game Arena, Loop Habit Tracker, Podcast Index, KOReader, Audiobookshelf, Wikibooks.

**Not researched (17, not counted above).** Proxmox VE, PuTTY, HWiNFO, Ninite, Macrium Reflect Free, TeamViewer, Polona, Biblioteca Digital Hispánica, National Film Board of Canada, Delpher, data.gov.sg, IBGE, Global Digital Library, Biblioteca Virtual Miguel de Cervantes, Harvard Dataverse, LiteFarm and Data.gov. No conclusion is drawn about them.

## Notable Coverage Improvements

Categories the audit found thin, before and after:

| Category | Before | After | Added |
| :--- | ---: | ---: | :--- |
| everyday | 2 | 7 | DigiLocker, Be My Eyes, Seeing AI, Wormhole, Catima |
| languages | 7 | 12 | Alar (Kannada), Olam (Malayalam), Keyman, Aksharamukha, Cologne Sanskrit Dictionaries |
| ai-chat | 5 | 8 | ChatGPT, Claude, Google Gemini (the catalog had only self-hosted chat front ends) |
| weather | 3 | 6 | India Meteorological Department, Copernicus Climate Data Store, NASA POWER |
| health-fitness | 1 | 4 | MedlinePlus, wger, drip |
| monitoring | 1 | 3 | Grafana, Uptime Kuma |
| career | 1 | 3 | National Career Service, Reactive Resume |
| food | 1 | 3 | USDA FoodData Central, Mealie |
| travel | 2 | 4 | The Man in Seat 61, Wikivoyage |
| exams | 1 | 2 | SATHEE |
| storage, authentication, hr, crm, spreadsheets, wallpapers, streaming, ai-apis, ai-coding | 1–5 | +1 each | rclone, Keycloak, Horilla, Twenty, Grist, Lively Wallpaper, PeerTube, Google AI Studio, GitHub Copilot Free |

Other gaps filled:
- **Foundational tools missing from the catalog:** Git, Python, Node.js, Let's Encrypt, Google Docs/Sheets/Slides and Microsoft 365 for the web.
- **India:** eight public services (IMD, Bhuvan, DigiLocker, Income Tax e-Filing, National Career Service, SATHEE, FOSSEE, Mappls), plus Zerodha Varsity.
- **Indian languages:** nine resources: Rekhta (Urdu), Hindwi (Hindi), Alar (Kannada), Olam and SMC fonts (Malayalam), IndicTrans2 (22 scheduled languages), Keyman, Aksharamukha and the Cologne Sanskrit dictionaries. Tesseract OCR and Noto add Indic script support.
- **Africa, Arabic and Latin America:** Digital Earth Africa, Siyavula (South Africa), Edraak (Arabic), Redalyc (Latin American open access) and Mozilla Common Voice (which includes many African and South Asian languages).
- **Accessibility:** Be My Eyes, Seeing AI, WAVE and Thorium Reader.
- **Agriculture:** farmOS, NASA POWER and the Copernicus Climate Data Store.

Categories that are still thin: shopping (1), movies (1), ai-writing, ai-productivity, ai-automation and ai-voice (1 each), podcasts and templates (2 each), presentations and study-tools (3 each).

## Duplicate Prevention

1. **Before research**, every candidate name and domain was matched against the 622 existing entries by exact name, normalised name (lower-case alphanumerics), slug, official URL, source URL, domain root and tags. Six weak hits were reviewed by hand; none was a real duplicate.
2. **During selection**, each candidate was checked for project identity, mobile/desktop splits, hosted/upstream relationships and regional aliases. This produced one rejection (Open Library, part of the Internet Archive) and several overlap deferrals (Buzz, Codeberg, Orbot, Tails, Privacy Guides).
3. **Judgement calls, recorded here:**
   - Noto is listed separately from Google Fonts, following the precedent of `inter-font`. Noto is a font project; Google Fonts is a distribution library.
   - Rekhta and Hindwi are separate sites from the same foundation, for different languages.
   - GitHub Copilot Free sits alongside `github`, following the precedent of `github-actions`.
   - Proton VPN is a different product from `proton-mail`.
4. **After writing**, a script over the full 726-resource set confirmed:
   - no duplicate slugs, normalised names (ignoring parenthetical suffixes), canonical official URLs or source URLs;
   - no new entry shares an official-URL host with an existing entry, apart from github.com and gitlab.com project pages.
   The build's own validation also passed: unique slugs, valid categories, related resources that exist, and licences on every open-source entry.

## Verification

All newly added resources remain UNVERIFIED unless separately supported by the existing verification system.

None of the 104 is.
- Every entry has `verificationStatus: "UNVERIFIED"` and no `verifiedBy`, `lastVerifiedAt`, `verificationNotes`, `verificationSources` or `verificationChecks`.
- All four tri-state facts (`requiresAccount`, `requiresCreditCard`, `commercialUse`, `personalUse`) are `"unknown"` on every new entry, including where an official page states an answer. Compiling a listing is not a verification pass. Where a requirement was stated (an account, a PAN, a payment card), it is described in `limitations` and shows as unverified.
- Each entry's `compilationNotes` says it was compiled from the provider's own pages, that this was not verification, and any source gap specific to that entry. `submittedAt` and `updatedAt` record the compilation date only.
- No tag restates a fact (`open-source`, `no-signup` and similar), and no `OPEN_SOURCE` status was given without an OSI-recognised licence read from an official licence file or page. Where a project's code is open but the listed product is not (Typst's web editor, Manager.io, Tailscale, Proton VPN, Scratch, Chrome Music Lab), the status reflects the product and the split is in `licenseNotes`.

`npm run check:verification` after the batch: 726 resources, 0 fully verified, 4 awaiting sign-off, 6 partially verified, 716 never verified, 0 registered maintainers. Apart from the 104 additions, these figures are unchanged.

## Validation

| Check | Result |
| :--- | :--- |
| `npm test` | Pass, 47/47 |
| `npm run verify` | Pass (lint, typecheck, tests, build; 726 resource pages) |
| `npm run verify:static` | Pass (1,844 prerendered routes; CSP written into 1,114 HTML pages) |
| `npm run test:browser` | Pass, 61/61 (the no-JS check lists 726 resources) |
| `npm run backlog` then `npm run backlog:check` | Regenerated; matches the data |
| `npm run check:verification` | As above |
| Duplicate slug, normalised name, canonical URL and source URL checks | No duplicates |
| Invalid categories, types, platforms or related-resource references | None (enforced by the build) |
| Marketing-word scan of new descriptions | None found |

Files changed: `src/data/resources/batch-006.ts` (new), `src/data/resources/index.ts` (+2 lines), `docs/verification-backlog.md` (regenerated) and this report. No UI, search, verification logic, maintainer configuration, CODEOWNERS or infrastructure file was touched.

## Final Catalog

| | Count |
| :--- | ---: |
| Starting count on `origin/main` | 622 |
| + accepted in batch 006 | 104 |
| − cleanup applied in this batch | 0 (Cleanup 001's 11 removals were already merged and are in the 622) |
| **Final count** | **726** |
