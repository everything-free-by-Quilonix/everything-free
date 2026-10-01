# Batch 006 PR Review

Review of PR #14 (`data/resource-expansion-006`). This was a data-quality review, not a verification pass. Nothing it established is recorded as verification evidence, and no listing's verification state changed.

## Scope

- **Branch and commit:** `data/resource-expansion-006` at `be00d261d1305452b48c366e2941979ddca4078a` when the review started. The workspace was clean.
- **Base:** PR #14 targets `main` at `b06073b`, the merge commit of PR #13 (Cleanup 001). The cleanup commit `9eb500b` is an ancestor of the branch, and none of the 11 removed duplicate slugs appears anywhere in `src/`.
- **PR state:** open, not merged, not a draft. GitHub reported it mergeable and clean, and the CI check "Lint, types and data integrity" passed on `be00d26`.
- **Files in PR #14:** exactly the four expected:
  - `src/data/resources/batch-006.ts` (added)
  - `src/data/resources/index.ts` (+2 lines: import and spread)
  - `docs/verification-backlog.md` (106 lines added; the only 2 removed lines are the old resource count and the old unverified count)
  - `docs/verification/catalog-expansion-batch-006.md` (added)
- **Unrelated changes:** none. No UI, search, verification logic, maintainer configuration, CODEOWNERS, Tools repository or infrastructure file is touched.
- **Other worktree:** the `.codex` worktree (`data/resource-expansion-001`) was not touched.

## Baseline

| | Count |
| :--- | ---: |
| Catalog on `origin/main` | 622 |
| Added by batch 006 | 104 |
| Catalog on the branch | 726 |
| Catalog statuses on the branch | 720 `UNVERIFIED`, 6 `PARTIALLY_VERIFIED`, 0 `VERIFIED` |

## 104 Resource Review

I reviewed every entry field by field: name, slug, URLs, descriptions, type, category, tags, platforms, free status, licence, limitations and verification fields. The table records the outcome for each.

**Codes.** `OK` means no finding. `F` codes were corrected in this review. `Q` codes are flagged but not changed, because resolving them needs a fact the compilation research did not establish, or a maintainer decision. Each code is explained in the sections below.

**Corrections made in this review.** These are confined to `batch-006.ts`.

| Code | Correction | Entries |
| :--- | :--- | :--- |
| F1 | Removed unsupported popularity, ranking or superiority claims from `whyListed`, such as "one of the most widely taught", "the standard free option", "the main free source", "one of the few", "faster, simpler", "most practical" and "that many OCR services do not". These break the batch's own rule against fake popularity claims. Each was rewritten to state only what the entry already establishes. | 32 entries, marked F1 below |
| F2 | Python licence `PSF-2.0` changed to `Python-2.0`, with a `licenseNotes` line. SPDX lists `PSF-2.0` as not OSI-approved. The CPython LICENSE file already linked from the entry contains the full stack (PSF, BeOpen, CNRI, CWI), which SPDX identifies as `Python-2.0` (OSI-approved). The entry's description already said "OSI-approved licence". | `python` |
| F3 | Official URL changed from `/en/xnviewmp/` to `/en/xnview-mp/`. The old URL now redirects to the combined XnView MP / Classic page; the new one is the XnView MP page that states its freeware terms. | `xnview-mp` |
| F4 | Official URL changed from `docs.mealie.io` to `mealie.io`. The docs domain now redirects there, and the target is the same Mealie documentation site. | `mealie` |
| F5 | Removed the `code-editors` subcategory. Git is not an editor or IDE. | `git` |
| F6 | `whyListed` said uBlock Origin "asks for no donations or accounts". Only the donations part is stated by the project, and the account claim restated a fact recorded as unknown. Reworded to the README statement. | `ublock-origin` |

No free status, platform list, limitation, tag, slug or verification field was changed.

| # | Slug | Status | Licence | Type | Category | Platforms | Result |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `chatgpt` | FREE_TIER | — | AI_TOOL | ai-chat | B W M i A | OK |
| 2 | `claude` | FREE_TIER | — | AI_TOOL | ai-chat | B W M i A | F1 · Q-D2 |
| 3 | `google-gemini` | FREE_TIER | — | AI_TOOL | ai-chat | B | F1 · Q-P5 |
| 4 | `gemini-notebook` | FREE_TIER | — | AI_TOOL | ai-research | B | F1 |
| 5 | `google-ai-studio` | FREE_TIER | — | API | ai-apis | B | OK |
| 6 | `github-copilot-free` | FREE_TIER | — | AI_TOOL | ai-coding | B | Q-P1 |
| 7 | `git` | OPEN_SOURCE | GPL-2.0-only | DEVELOPER_TOOL | developer-utilities | W M L | F1 · F5 |
| 8 | `python` | OPEN_SOURCE | Python-2.0 | DEVELOPER_TOOL | developer-utilities | W M L | F1 · F2 |
| 9 | `nodejs` | OPEN_SOURCE | MIT | DEVELOPER_TOOL | developer-utilities | W M L | F1 |
| 10 | `lets-encrypt` | FREE | — | SERVICE | hosting | — | Q-P4 · Q-C1 |
| 11 | `firebase` | FREE_TIER | — | SERVICE | databases | B | Q-D1 |
| 12 | `tailscale` | PERSONAL_FREE | — | SERVICE | personal | W M L A i | F1 · Q-D2 |
| 13 | `grafana` | OPEN_SOURCE | AGPL-3.0-only | DEVELOPER_TOOL | monitoring | W M L SH | F1 |
| 14 | `uptime-kuma` | OPEN_SOURCE | MIT | DEVELOPER_TOOL | monitoring | SH | Q-LIM1 |
| 15 | `keycloak` | OPEN_SOURCE | Apache-2.0 | DEVELOPER_TOOL | authentication | SH | Q-D2 |
| 16 | `rclone` | OPEN_SOURCE | MIT | DEVELOPER_TOOL | storage | W M L | F1 · Q-D2 |
| 17 | `google-docs-editors` | FREE_TIER | — | WEB_APP | documents | B A i | F1 · Q-D2 |
| 18 | `microsoft-365-web` | FREE_TIER | — | WEB_APP | documents | B i A | F1 |
| 19 | `onlyoffice-desktop-editors` | OPEN_SOURCE | AGPL-3.0 | DESKTOP_APP | documents | W M L | F1 · Q-L1 |
| 20 | `grist` | OPEN_SOURCE | Apache-2.0 | WEB_APP | spreadsheets | B SH | F1 · Q-FS6 |
| 21 | `typst` | OPEN_SOURCE | Apache-2.0 | DEVELOPER_TOOL | documents | W M L B | F1 · Q-FS6 |
| 22 | `tesseract-ocr` | OPEN_SOURCE | Apache-2.0 | DEVELOPER_TOOL | utilities | W M L | F1 · Q-P2 |
| 23 | `paperless-ngx` | OPEN_SOURCE | GPL-3.0 | WEB_APP | documents | SH | Q-L1 |
| 24 | `freeplane` | OPEN_SOURCE | GPL-2.0 | DESKTOP_APP | productivity | W M L | Q-L1 |
| 25 | `twenty-crm` | OPEN_SOURCE | AGPL-3.0 | BUSINESS_TOOL | crm | SH | Q-L1 · Q-D3 |
| 26 | `gnucash` | OPEN_SOURCE | GPL-2.0-or-later | DESKTOP_APP | personal-finance | W M L | Q-D2 |
| 27 | `manager-io` | FREE | FSL-1.1-Apache-2.0 | DESKTOP_APP | business-finance | W M L | Q-L4 |
| 28 | `horilla` | OPEN_SOURCE | LGPL-2.1 | BUSINESS_TOOL | hr | SH | Q-L1 |
| 29 | `listmonk` | OPEN_SOURCE | AGPL-3.0 | BUSINESS_TOOL | marketing | SH | Q-L1 · Q-LIM1 |
| 30 | `google-search-console` | FREE | — | WEB_APP | marketing | B | Q-LIM3 |
| 31 | `datawrapper` | FREE_TIER | — | WEB_APP | analytics | B | F1 · Q-D4 · Q-C4 |
| 32 | `openrefine` | OPEN_SOURCE | BSD-3-Clause | DESKTOP_APP | research | W M L | Q-D2 |
| 33 | `reactive-resume` | OPEN_SOURCE | MIT | WEB_APP | career | B SH | OK |
| 34 | `zerodha-varsity` | FREE | — | EDUCATIONAL_RESOURCE | personal-finance | B A i | Q-D1 |
| 35 | `copernicus-climate-data-store` | FREE | — | DATASET | weather | B | F1 · Q-D2 |
| 36 | `nasa-power` | FREE | CC-BY-4.0 | DATASET | weather | B | Q-D1 |
| 37 | `climate-trace` | FREE | CC-BY-4.0 | DATASET | research | B | OK |
| 38 | `farmos` | OPEN_SOURCE | GPL-2.0-or-later | WEB_APP | business-finance | SH B | Q-L2 · Q-P3 |
| 39 | `google-earth-engine` | PERSONAL_FREE | — | SERVICE | maps | B | OK |
| 40 | `google-earth` | FREE_TIER | — | WEB_APP | maps | B W M L | Q-D2 · Q-P5 |
| 41 | `digital-earth-africa` | FREE | CC-BY-4.0 | DATASET | maps | B | Q-LIM4 · Q-U1 |
| 42 | `kaggle` | FREE | — | WEB_APP | research | B | Q-FS5 |
| 43 | `mozilla-common-voice` | FREE | CC0-1.0 | DATASET | research | B | F1 · Q-D2 |
| 44 | `india-meteorological-department` | FREE | — | WEBSITE | weather | B | Q-P5 |
| 45 | `bhuvan` | FREE | — | WEB_APP | maps | B | F1 |
| 46 | `digilocker` | FREE | — | SERVICE | everyday | B A i | OK |
| 47 | `income-tax-e-filing` | FREE | — | SERVICE | personal-finance | B W | OK |
| 48 | `national-career-service` | FREE | — | SERVICE | career | B A i | Q-R1 · Q-U1 |
| 49 | `sathee` | FREE | — | EDUCATIONAL_RESOURCE | exams | B | Q-P5 |
| 50 | `fossee` | FREE | CC-BY-SA-4.0 | EDUCATIONAL_RESOURCE | learning | B | Q-L5 |
| 51 | `mappls` | FREE_TIER | — | MOBILE_APP | maps | B A i | F1 · Q-FS1 |
| 52 | `rekhta` | FREE | — | WEBSITE | books | B | OK |
| 53 | `hindwi` | FREE | — | WEBSITE | books | B | OK |
| 54 | `alar` | FREE | ODbL-1.0 | WEBSITE | languages | B | Q-P5 |
| 55 | `olam` | FREE | — | WEBSITE | languages | B | Q-P5 |
| 56 | `smc-malayalam-fonts` | OPEN_SOURCE | OFL-1.1 | FONT | fonts | B | Q-D3 |
| 57 | `keyman` | OPEN_SOURCE | MIT | UTILITY | languages | W M L A i B | OK |
| 58 | `indictrans2` | OPEN_SOURCE | MIT | AI_TOOL | ai-models | SH | F1 · Q-R2 |
| 59 | `cologne-sanskrit-dictionaries` | FREE | — | WEBSITE | languages | B | OK |
| 60 | `aksharamukha` | FREE | — | WEB_APP | languages | B | OK |
| 61 | `medlineplus` | FREE | — | WEBSITE | health-fitness | B | Q-LIM2 · Q-D3 |
| 62 | `wger` | OPEN_SOURCE | AGPL-3.0-or-later | WEB_APP | health-fitness | B A i L SH | Q-D2 |
| 63 | `drip` | OPEN_SOURCE | GPL-3.0-or-later | MOBILE_APP | health-fitness | A i | OK |
| 64 | `usda-fooddata-central` | FREE | CC0-1.0 | DATASET | food | B | OK |
| 65 | `mealie` | OPEN_SOURCE | AGPL-3.0-only | WEB_APP | food | SH B | F4 · Q-P3 |
| 66 | `the-man-in-seat-61` | FREE | — | WEBSITE | travel | B | Q-D3 |
| 67 | `wikivoyage` | FREE | CC-BY-SA-4.0 | WEBSITE | travel | B | OK |
| 68 | `peertube` | OPEN_SOURCE | AGPL-3.0 | WEB_APP | streaming | SH B | Q-L1 |
| 69 | `thorium-reader` | OPEN_SOURCE | BSD-3-Clause | DESKTOP_APP | books | W M L i | Q-FS8 · Q-D3 |
| 70 | `be-my-eyes` | FREE | — | MOBILE_APP | everyday | i A W M | Q-FS4 |
| 71 | `seeing-ai` | FREE | — | MOBILE_APP | everyday | i A | Q-D2 |
| 72 | `wave-accessibility-tool` | FREE | — | DEVELOPER_TOOL | testing | B | OK |
| 73 | `ublock-origin` | OPEN_SOURCE | GPL-3.0 | UTILITY | personal | B | F6 · Q-L1 |
| 74 | `proton-vpn` | FREE_TIER | — | SERVICE | personal | W M L A i B | F1 |
| 75 | `eff-surveillance-self-defense` | FREE | CC-BY-4.0 | EDUCATIONAL_RESOURCE | personal | B | OK |
| 76 | `wormhole` | FREE | — | WEB_APP | everyday | B | OK |
| 77 | `catima` | OPEN_SOURCE | GPL-3.0-or-later | MOBILE_APP | everyday | A | OK |
| 78 | `ifixit` | FREE | CC-BY-NC-SA-3.0 | WEBSITE | lifestyle | B | Q-D2 |
| 79 | `lichess` | OPEN_SOURCE | AGPL-3.0-or-later | GAME | games | B A i | Q-D2 |
| 80 | `0-ad` | OPEN_SOURCE | GPL-2.0-or-later | GAME | games | W M L | OK |
| 81 | `siyavula-open-textbooks` | FREE | — | BOOK | books | B | OK |
| 82 | `david-rumsey-map-collection` | FREE | — | WEBSITE | maps | B | F1 · Q-FS2 |
| 83 | `edraak` | FREE | — | COURSE | courses | B | Q-P5 |
| 84 | `kiwix` | OPEN_SOURCE | GPL-3.0-or-later | DESKTOP_APP | learning | W M L A i B SH | Q-L6 |
| 85 | `kolibri` | OPEN_SOURCE | MIT | EDUCATIONAL_RESOURCE | learning | W M L A SH | OK |
| 86 | `scratch` | FREE | — | EDUCATIONAL_RESOURCE | learning | B W M A | F1 · Q-FS7 |
| 87 | `mit-app-inventor` | FREE | Apache-2.0 | WEB_APP | learning | B | Q-FS7 |
| 88 | `standard-ebooks` | FREE | Public domain (United States) | BOOK | books | B | F1 · Q-D3 |
| 89 | `librivox` | FREE | Public domain | BOOK | books | B | Q-C2 · Q-U2 |
| 90 | `oeis` | FREE | CC-BY-SA-4.0 | WEBSITE | mathematics | B | F1 |
| 91 | `redalyc` | FREE | — | WEBSITE | research | B | F1 |
| 92 | `quarto` | OPEN_SOURCE | MIT | DEVELOPER_TOOL | documents | W M L | OK |
| 93 | `fiji` | OPEN_SOURCE | GPL-3.0 | DESKTOP_APP | science | W M L | F1 · Q-L3 |
| 94 | `alphafold-protein-structure-database` | FREE | CC-BY-4.0 | DATASET | science | B | OK |
| 95 | `cern-open-data` | FREE | CC0-1.0 | DATASET | science | B | F1 |
| 96 | `siril` | OPEN_SOURCE | GPL-3.0 | DESKTOP_APP | photography | W M L | Q-L1 · Q-U2 |
| 97 | `xnview-mp` | PERSONAL_FREE | — | DESKTOP_APP | photography | W M L | F1 · F3 |
| 98 | `noto-fonts` | OPEN_SOURCE | OFL-1.1 | FONT | fonts | B | F1 · Q-D2 |
| 99 | `lively-wallpaper` | OPEN_SOURCE | GPL-3.0 | DESKTOP_APP | wallpapers | W | Q-L1 · Q-D2 |
| 100 | `mixxx` | OPEN_SOURCE | GPL-2.0-or-later | DESKTOP_APP | music | W M L | Q-C3 |
| 101 | `bandlab` | FREE_TIER | — | WEB_APP | music | B A i | OK |
| 102 | `imslp` | FREE | — | WEBSITE | music | B | F1 · Q-FS3 |
| 103 | `bbc-sound-effects` | PERSONAL_FREE | — | STOCK_AUDIO | stock-media | B | Q-FS2 |
| 104 | `chrome-music-lab` | FREE | — | WEB_APP | music | B | Q-D1 · Q-FS7 |

Platform abbreviations: B browser, W Windows, M macOS, L Linux, A Android, i iOS, SH self-hosted.

Result: 25 entries have no finding, 34 were corrected, and 45 carry flags only.

## Free Status Findings

Most classifications match the catalog's model:
- `FREE_TIER` is used where a permanent free plan has documented caps and paid plans sit above it. That covers the AI assistants, Google Docs, Microsoft 365, Firebase, Proton VPN, Datawrapper, Google Earth and BandLab.
- `FREE` is used where there is no paid upgrade for normal use. That covers Let's Encrypt, Kaggle, Wormhole, the Indian public services and the archives.
- `PERSONAL_FREE` is used where commercial use is restricted: Tailscale, Google Earth Engine, XnView MP and BBC Sound Effects.

No trial is presented as free.

Flagged, not changed:
- **Q-FS1 · Mappls is `FREE_TIER`, but its limitations list only separate paid products** (tracking devices and developer APIs), not caps on the free app. `FREE` may describe it more accurately. Not changed, because nothing establishes whether the consumer app has its own caps.
- **Q-FS2 · Non-commercial reuse is treated inconsistently.** BBC Sound Effects is `PERSONAL_FREE` because its sounds are licensed for personal, educational and research use only. The David Rumsey Map Collection is `FREE`, though its images may only be reused non-commercially and it carries a `stock-media` subcategory. iFixit and the Cologne dictionaries are `FREE` with non-commercial content licences, which fits better because reading is their main use. The project should decide whether a non-commercial reuse licence makes a resource `PERSONAL_FREE` when reuse is its main purpose.
- **Q-FS3 · IMSLP is `FREE` although a paid subscription removes a download wait.** Normal tasks complete without paying, so `FREE` is defensible; `FREE_TIER` would also be.
- **Q-FS4 · Be My Eyes is `FREE`, but its desktop apps are for personal use only.** This is recorded in limitations. The mobile app, the core product, is free for users and volunteers.
- **Q-FS5 · Kaggle is `FREE` with compute quotas.** This is consistent with the definitions: no paid plan was found, and `FREE_TIER` requires paid plans above the free one. No change is needed; noted for consistency with `google-colab` (`FREE_TIER`, which does have a paid tier).
- **Q-FS6 · Typst and Grist are open source, but their official URLs are hosted services.** The `OPEN_SOURCE` status describes the open code, while the official URL points at a hosted service with its own free plan. Typst's web editor is closed source, and Grist's hosted free plan has record limits. Both splits are disclosed in `licenseNotes` and limitations. CONTRIBUTING warns against `OPEN_SOURCE` implying the hosted version is free, so a maintainer may prefer the repository as the official URL, or a separate hosted listing.
- **Q-FS7 · The `openSource` flag is used inconsistently.** MIT App Inventor is `FREE` with `openSource: true` and Apache-2.0. Scratch (AGPL-3.0 editor) and Chrome Music Lab (Apache-2.0 code for many experiments) are `FREE` with `openSource: false`, and their licences appear only in `licenseNotes`. Pick one convention for hosted services whose code is open.
- **Q-FS8 · Thorium Reader is `OPEN_SOURCE` but lists iOS**, and whether the iOS app is open source was not established. The official desktop builds also include a closed LCP component, which `licenseNotes` discloses.

## Foundational Resource Findings

| Resource | Status | Assessment |
| :--- | :--- | :--- |
| Git | `OPEN_SOURCE` GPL-2.0-only | Appropriate. The whole product is free, and the type and licence are consistent with the COPYING file. Popularity claim corrected (F1); the `code-editors` subcategory was wrong and was removed (F5). |
| Python | `OPEN_SOURCE` | Appropriate. The licence identifier was not OSI-listed and was corrected to `Python-2.0` (F2). Popularity claim corrected (F1). Android and iOS embedding builds are correctly left out of platforms. |
| Node.js | `OPEN_SOURCE` MIT | Appropriate, and `licenseNotes` mentions bundled third-party licences. Popularity claim corrected (F1). |
| Let's Encrypt | `FREE` | Appropriate: free with no paid tier, and rate limits are listed. Platforms are empty, which is honest but repeats a pattern the audit flagged (Q-P4). The `personal` subcategory is doubtful (Q-C1). |
| Google Docs, Sheets and Slides | `FREE_TIER` | Describes the free personal offering, not paid Workspace. The 15 GB shared quota and account requirement are listed. The official URL is a Workspace product page that also markets paid business plans. That is acceptable, since it is Google's own product page. |
| Microsoft 365 for the web | `FREE_TIER` | The name says "(free)", and the 5 GB quota, account requirement, basic mobile editing and read-only-over-quota behaviour are all listed. Does not imply the subscription is free. |
| ChatGPT | `FREE_TIER` | Describes the free plan. Ads and unpublished, changing caps are disclosed. `compilationNotes` says some details came from excerpts because openai.com blocked fetches. |
| Claude | `FREE_TIER` | Describes the free plan and names what it excludes. Two features ("long-document analysis", "File creation and code execution") were not established as part of the free plan (Q-D2). |
| Google Gemini | `FREE_TIER` | Describes the free level with its caps and account requirement. The mobile apps are not recorded (Q-P5). |

None of these entries implies that a paid ecosystem is free.

## Regional Resource Findings

Each regional entry was checked for official source, accessibility (a live request on 1 October 2026), recorded restrictions and active status.

| Group | Entries | Finding |
| :--- | :--- | :--- |
| Indian public services | IMD, Bhuvan, DigiLocker, Income Tax e-Filing, National Career Service, SATHEE, FOSSEE | All on official government or institute domains, and all returned HTTP 200. Recorded restrictions: Aadhaar sign-up (DigiLocker), PAN and Indian taxpayers only (Income Tax), Hindi by default (IMD), login required (SATHEE, NCS). NCS's "free of cost" statement came only from a search excerpt, which its `compilationNotes` does not say (Q-R1). `www.ncs.gov.in` redirects to `ncs.gov.in` (Q-U1). |
| Indian commercial / private | Mappls, Zerodha Varsity | Official domains, 200. The India focus is recorded for both. Mappls classification is flagged (Q-FS1). Varsity states "without signing up" in its description (Q-D1). |
| Indian languages | Rekhta, Hindwi, Alar, Olam, SMC fonts, Keyman, IndicTrans2, Cologne Sanskrit dictionaries, Aksharamukha | All 200. Each is a distinct resource; there are no regional mirrors. Language identity is carried by tags (`kannada`, `malayalam`, `urdu`, `hindi`, `sanskrit`, `indian-languages`). IndicTrans2 was last pushed in October 2025 and its Hugging Face models last changed in May 2025: mature, but not recently updated (Q-R2). |
| Africa | Digital Earth Africa, Siyavula | Official domains, 200. Digital Earth Africa redirects `www.` to `digitalearthafrica.org/en_za/` (Q-U1). Its sandbox phone-verification gap for some countries is documented by the provider but not recorded (Q-LIM4). Siyavula's CAPS curriculum focus is recorded. |
| Arabic | Edraak | 200. The free statement comes from Edraak's help centre via search excerpts, which `compilationNotes` discloses. Certificate terms were not established, and the limitation says so. |
| Latin America | Redalyc | 200. Popularity claim corrected (F1). |
| Multilingual | Mozilla Common Voice | 200. "many … South Asian languages" is broader than the release posts confirm; only Bengali and Sindhi were confirmed there (Q-D2). |

The `languages` field is empty for every new entry, as it is for all 622 existing entries, and the search layer does not read it. Regional discovery therefore relies on tags and categories, consistent with the rest of the catalog.

No regional entry duplicates an existing portal. Related-but-distinct pairs are listed under Duplicate Findings.

## Duplicate Findings

Deterministic checks across all 726 resources found:
- no duplicate slugs, exact names or normalised names (with or without parenthetical suffixes);
- no duplicate canonical official URLs;
- no new entry whose official URL is another entry's source URL.

Two source-URL duplicates exist, both between pre-existing entries and outside batch 006. They are listed under Catalog-Wide Regression.

Semantic review of every pair where a new entry shares a name fragment, a host or a registrable domain with another entry:

| Pair | Relationship | Classification |
| :--- | :--- | :--- |
| `noto-fonts` · `google-fonts` | Font project vs a distribution library that also serves Noto. Precedent: `inter-font`. | LEGITIMATE DISTINCT RESOURCE |
| `gemini-notebook` · `google-gemini` | Separate products; both now carry the Gemini brand | LEGITIMATE DISTINCT RESOURCE |
| `google-ai-studio` · `google-gemini` | Developer API vs consumer assistant | LEGITIMATE DISTINCT RESOURCE |
| `google-earth` · `google-earth-engine` | Globe viewer vs analysis platform | LEGITIMATE DISTINCT RESOURCE |
| Google products sharing google.com: `firebase`, `google-docs-editors`, `google-search-console`, `google-colab`, `google-fonts` | Umbrella company, separate products | LEGITIMATE DISTINCT RESOURCE |
| `github-copilot-free` · `github` | Separate product on the same host. Precedent: `github-actions`. | LEGITIMATE DISTINCT RESOURCE |
| `indictrans2`, `ublock-origin` and other github.com project pages | Different repositories on a shared host | LEGITIMATE DISTINCT RESOURCE |
| `copernicus-climate-data-store` · `copernicus-browser` | Same EU programme, different services (climate data vs Sentinel imagery) | LEGITIMATE DISTINCT RESOURCE |
| `nasa-power` · `nasa-open-data`, `nasa-images`, `nasa-apod` | Agency umbrella vs individual service; data.nasa.gov is a catalogue, POWER a specific service | LEGITIMATE DISTINCT RESOURCE |
| `alphafold-protein-structure-database` · `pdbe` | Same institute (EMBL-EBI); predicted vs experimental structures | LEGITIMATE DISTINCT RESOURCE |
| `mozilla-common-voice` · `mdn-web-docs` | Same organisation, unrelated services | LEGITIMATE DISTINCT RESOURCE |
| `scratch` · `mit-app-inventor` · `mit-opencourseware` | Same university domain, separate projects | LEGITIMATE DISTINCT RESOURCE |
| `rekhta` · `hindwi` | Same foundation, different languages and sites | LEGITIMATE DISTINCT RESOURCE |
| `alar` · `olam` | Same foundation, different languages | LEGITIMATE DISTINCT RESOURCE |
| `olam` · `malayalam-lexicon`; `alar` · `kanaja` | Different dictionaries or portals for the same language | LEGITIMATE DISTINCT RESOURCE |
| `fossee` · `spoken-tutorial` | Sibling IIT Bombay projects, different outputs | LEGITIMATE DISTINCT RESOURCE |
| `librivox` · `internet-archive` | Project whose audio is hosted by the platform | LEGITIMATE DISTINCT RESOURCE |
| `standard-ebooks` · `project-gutenberg` | Separate editions drawn from the same public-domain texts | LEGITIMATE DISTINCT RESOURCE |
| `cern-open-data` · `zenodo`; `medlineplus` · `pubmed-central` | Same operator, different services | LEGITIMATE DISTINCT RESOURCE |
| `tailscale` · `wireguard`; `proton-vpn` · `proton-mail`; `grafana` · `k6`; `indictrans2` · `bhashini`; `tesseract-ocr` · `stirling-pdf` | Built on, or from the same company as, a listed resource | LEGITIMATE DISTINCT RESOURCE |
| `python` · `biopython`; `freeplane` · `plane` | Name overlap only | LEGITIMATE DISTINCT RESOURCE |
| Open Library (rejected in batch 006) · `internet-archive` | A separate site, but an Internet Archive service whose lending the existing entry covers | POSSIBLE DUPLICATE (umbrella vs service). The rejection is defensible; a separate listing could also be argued. |

There are **no confirmed duplicates** in batch 006.

## Category Saturation / Deferred Candidates

All 44 deferred candidates were classified. None was added.

| Class | Count | Candidates |
| :--- | ---: | :--- |
| A. Correctly deferred | 17 | Burp Suite Community (overlaps OWASP ZAP; demo-limited Intruder), SoftMaker FreeOffice (overlaps LibreOffice and ONLYOFFICE; one-computer-per-organisation licence), Jira, GanttProject (stable release from January 2024), Kimai, Dolibarr, IrfanView (overlaps XnView MP), Rijksmuseum, jamovi (overlaps JASP), NIST Chemistry WebBook (not openly licensed; may charge in future), NASA Worldview, Eurostat (overlaps `data-europa-eu`), Privacy Badger (overlaps uBlock Origin), Privacy Guides (overlaps EFF SSD), PowerToys, SuperTuxKart (1.x in maintenance mode), Homebrew |
| B. Potentially valuable despite saturation | 21 | Buzz (a desktop GUI for users who won't use the Whisper CLI), Oracle Cloud Free Tier (the only always-free VM offer; card required), Termux (no Android terminal listed), SSL Labs, Xournal++ (stylus notes and PDF annotation), Hemingway Editor (writing tools are thin), Paint.NET, Hugin (no panorama tool listed), Gyroflow, Hypothesis, Galaxy (free public bioinformatics servers), uMap, Orbot and Tails (distinct needs from Tor Browser), Everything, Qalculate!, Board Game Arena, Loop Habit Tracker, KOReader, Audiobookshelf (podcasts has only 2 entries), Wikibooks (Wikivoyage was accepted on the same grounds) |
| C. Duplicate / near-duplicate | 1 | Codeberg: a hosted service that runs Forgejo, which is already listed. A distinct service, but it needs an explicit hosted-vs-upstream justification if listed. |
| D. Wrongly excluded | 0 | None was clearly wrong to defer. Wikibooks is the closest, given that Wikivoyage was accepted. |
| E. Needs more research | 5 | OpenWrt (router firmware does not fit the platform model), Blockbench (desktop platforms not confirmed), Printables (pages unreadable; licences vary per model), Podcast Index (data licence unknown), MOSDAC (scope of the free data unclear) |

Strategy notes for future batches:
- Most class B candidates were deferred because their category was full, even though they meet a different user need from what is listed (Orbot and Tails vs Tor Browser, Termux on Android, Hugin for panoramas). Judging overlap by user need rather than category count would recover them.
- Still thin after batch 006: shopping and movies (1 each); ai-writing, ai-productivity, ai-automation and ai-voice (1 each); podcasts and templates (2 each).

## Description Findings

No duplicate short descriptions, long descriptions or `whyListed` texts exist anywhere in the catalog. None of the banned marketing words (best, #1, ultimate, revolutionary, powerful, leading, popular, amazing) appears in the batch. The meaningful problem was unsupported popularity, ranking and superiority claims in `whyListed`, corrected under F1. No description implies verification.

Flagged, not changed:
- **Q-D1 · Account and payment facts stated in descriptions while the structured fields are "unknown".** On the page, a description answers a question that the facts panel shows as Unknown. These statements are the providers' own, not verification. The maintainers should choose between limitations wording and recording unverified values.
  - Firebase: "without billing details"
  - Zerodha Varsity: "without signing up"
  - NASA POWER: "without an account" and "API with no authentication"
  - Chrome Music Lab: "without an account"
- **Q-D2 · Details not established by the compilation research.** These are likely accurate, but no official page was read for them. Trim them or confirm them before merge if the bar is "only what was read".
  - Claude: "long-document analysis", and "File creation and code execution" as free-plan features
  - Tailscale: MagicDNS, exit nodes and subnet routing
  - Keycloak: LDAP and Active Directory federation, social login
  - rclone: "dozens" of providers, and the named providers
  - Google Docs: version history, Office import and export
  - GnuCash: invoicing, scheduled transactions, open formats
  - OpenRefine: faceting and clustering, undo history
  - Copernicus Climate Data Store: climate projections and seasonal forecasts
  - Mozilla Common Voice: "many … South Asian languages"
  - Google Earth: KML import, high-resolution printing
  - wger: "no ads"
  - Seeing AI: "Person recognition"
  - iFixit: "appliances"
  - Lichess: "tournaments"
  - Lively Wallpaper: "Pauses when a fullscreen app is running" (only partly read)
  - Noto: "consistent look"
- **Q-D3 · Mild evaluative wording kept:** "modern" (Twenty), "well-made" (SMC fonts), "trustworthy" (MedlinePlus), "carefully maintained" (Seat 61), "strong" (Thorium), "Carefully produced" (Standard Ebooks). Low priority.
- **Q-D4 · Datawrapper says "unlimited charts and views" without attribution.** This is the provider's own wording, and the API caps are listed.

## Licensing Findings

All 40 `OPEN_SOURCE` entries record a licence, and after F2 every one is OSI-approved according to the SPDX licence list (version 3.29.0). Nothing source-available is labelled open source:
- Manager.io (Functional Source License) is `FREE` with `openSource: false`.
- Anytype, n8n and FUTO Keyboard were rejected in batch 006 for this reason.

Flagged, not changed:
- **Q-L1 · Eleven entries use deprecated bare SPDX identifiers.**
  - `GPL-3.0`: Paperless-ngx, uBlock Origin, Fiji, Siril, Lively Wallpaper
  - `GPL-2.0`: Freeplane
  - `AGPL-3.0`: ONLYOFFICE, Twenty, listmonk, PeerTube
  - `LGPL-2.1`: Horilla

  SPDX defines these as equivalent to the `-only` forms. The compilation research did not establish whether "or later" applies, which several `licenseNotes` say. The existing 622 entries use a bare identifier only once. Resolving this needs each project's licence header, so it is left for a maintainer.
- **Q-L2 · farmOS `GPL-2.0-or-later` is derived**, not read from the project's licence file. farmos.org states the GNU GPL without a version; drupal.org requires GPL-2.0-or-later for the projects it hosts; and GitHub detects GPL-2.0. The derivation is disclosed in `licenseNotes`.
- **Q-L3 · Fiji `GPL-3.0` rests on GitHub's licence detection** for the `fiji/fiji` repository. Fiji's own pages say "GPL" without a version.
- **Q-L4 · Manager.io's licence label is not an SPDX identifier.** The value `FSL-1.1-Apache-2.0` is the licensor's own label; the SPDX identifier is `FSL-1.1-ALv2`, which is not OSI-approved. The classification is correct either way.
- **Q-L5 · FOSSEE's `CC-BY-SA-4.0` covers the Textbook Companions only**, and comes from contributor-form excerpts. `licenseNotes` says so.
- **Q-L6 · Kiwix's licence was read for kiwix-desktop only**, while the entry lists seven platforms. `licenseNotes` says so.

## Platform Findings

No platform was found to be over-declared. Under-declaration is deliberate where no official page linking an app was read.
- **Q-P1 · GitHub Copilot Free lists only `BROWSER`**, though its main surface is IDE extensions. `compilationNotes` explains this, but browse-by-platform will under-represent it.
- **Q-P2 · Tesseract's `WINDOWS` rests on third-party installers** (UB Mannheim) linked from the project's documentation. Disclosed in limitations.
- **Q-P3 · Self-hosted web apps are recorded inconsistently.**
  - With `SELF_HOSTED` and `BROWSER`: farmOS, Mealie, PeerTube, wger, Grist, Reactive Resume and Kiwix.
  - With `SELF_HOSTED` but not `BROWSER`: Paperless-ngx, listmonk, Uptime Kuma, Keycloak, Horilla, Twenty, Grafana and Kolibri.
  - The existing catalog lists both on 60 of its 88 self-hosted entries.
  - farmOS and Mealie have no free public instance, so `BROWSER` may suggest they can be used without hosting.
- **Q-P4 · Let's Encrypt has empty platforms.** This is honest, because the platform model has no "not applicable" value, but it adds a 17th empty-platform entry to a pattern the audit flagged.
- **Q-P5 · Mobile apps are not recorded** for Google Gemini, Google Earth, IMD (Mausam), SATHEE, Alar, Olam and Edraak, because no official page linking them was read. This is conservative and disclosed where relevant.

## Limitations Findings

Every `FREE_TIER` and `PERSONAL_FREE` entry documents its limits, which the build enforces. The important known restrictions are represented:
- quotas: Firebase, Datawrapper, NotebookLM, Copilot, Proton VPN, Earth Engine
- account and identity requirements: DigiLocker, Income Tax, Google and Microsoft accounts
- regional scope: AI Studio, Notebook, IMD, Siyavula, Varsity
- commercial-use restrictions: Tailscale, XnView MP, BBC Sound Effects, Earth Engine, Be My Eyes desktop
- data-use terms: AI Studio, Copilot

These are written as provider statements in `limitations`. None was converted into a check record.

Flagged, not changed:
- **Q-LIM1 · "No official hosted service"** is stated for Uptime Kuma without a source. listmonk's identical line came from a research summary of the install docs.
- **Q-LIM2 · MedlinePlus "Written for a US audience"** was not established.
- **Q-LIM3 · Google Search Console "proof that you own or manage the site"**: the ownership page was not read.
- **Q-LIM4 · Digital Earth Africa's sandbox verification gap is missing.** The provider documents that SMS verification does not work for some countries, and this is not recorded.

## Verification Integrity

All 104 new entries:
- are `UNVERIFIED`;
- have no `verifiedBy`, `lastVerifiedAt`, `verificationNotes`, `verificationSources` or `verificationChecks`;
- have all four tri-state facts set to `"unknown"`;
- carry a `compilationNotes` statement that compilation "was research for the listing, not a verification pass";
- are dated 2026-10-01 for `submittedAt` and `updatedAt` only;
- have no editorial spotlight.

No new entry is `PARTIALLY_VERIFIED` or `VERIFIED`. Catalog-wide, the only entries with any check records are the same 10 as on `main`. This review added no evidence.

`npm run check:verification`: 726 resources, 0 fully verified, 4 awaiting sign-off, 6 partially verified, 716 never verified, 0 registered maintainers.

## Catalog-Wide Regression

- **Existing entries unchanged:** the 622 entries from `origin/main` were rebuilt from a clean `git archive` and compared with the branch. All 622 are byte-identical as serialised `Resource` objects, in the same order, and the 104 new entries are appended after them.
- **Build rules:** `findDataProblems` over all 726 returns no problems. That covers duplicate slugs, unknown categories, missing free-tier limits, contradictory evidence states, impossible open-source states and unknown related resources.
- **Enumerations:** no invalid categories, subcategories, resource types, platforms or free statuses, and no repeated platforms.
- **Pre-existing, outside batch 006:** two source-URL duplicates.
  - `thunderbird` and `k9-mail` share `github.com/thunderbird/thunderbird-android`. This is a POSSIBLE DUPLICATE for a future cleanup pass.
  - `wikisource`, `wikisource-kannada` and `wikimedia-commons` share the MediaWiki repository. These are distinct sites.
- **Unreachable during review from this network (Q-U2):**
  - siril.org: connection failed from two HTTP clients, while its GitLab project responded.
  - The LibriVox homepage: HTTP 522 and timeouts, while its about page returned 200.

  Both loaded during compilation. This is not evidence that either service is gone; they are candidates for the link-health workflow.
- **Bot challenges, not failures:** chatgpt.com, claude.ai, bemyeyes.com and docs.paperless-ngx.com returned 403. gemini.google.com overflowed the HTTP client's header limit.

## Validation Results

All runs below are on the final data, after the corrections.

| Command | Result |
| :--- | :--- |
| `npm test` | 47/47 pass |
| `npm run verify` | Pass (lint, typecheck, tests, build) |
| `npm run verify:static` | Pass: 1,844 prerendered routes; CSP written into 1,114 HTML pages |
| `npm run test:browser` | 61/61 pass; the no-JS listing shows 726 resources |
| `npm run backlog:check` | Pass. The backlog is unchanged by the corrections. |
| GitHub CI on `be00d26` (before corrections) | Pass |

## Merge Readiness

READY FOR HUMAN REVIEW

The corrections in this review (F1–F6) remove every finding that was clearly wrong and could be fixed without new facts. The flagged items (Q codes) are classification, licence-terminology, platform-convention and wording decisions for a maintainer. The ones worth settling before merge are:
- Q-FS1, Mappls `FREE` vs `FREE_TIER`
- Q-FS2, non-commercial reuse vs `PERSONAL_FREE`
- Q-L1, deprecated SPDX identifiers
- Q-D1 and Q-D2, unverified details in descriptions
- Q-P3, `BROWSER` on self-hosted apps
