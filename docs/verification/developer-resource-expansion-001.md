# Developer Resource Expansion 001 — Report

Branch `data/developer-resource-expansion-001`, based on `origin/data/resource-expansion-006` at `b030e73` (PR #14, open and not merged). Data-only: one new data file (`src/data/resources/batch-007.ts`), a two-line registration in `src/data/resources/index.ts`, the regenerated `docs/verification-backlog.md`, and this report.

Why it is stacked on batch 006: PR #14 adds 104 entries and edits the same two generated or registration files. Branching from it means every candidate was checked for duplicates against all 726 entries that will exist once #14 lands, and the two PRs cannot conflict in `index.ts` or the backlog. Merge #14 first; this PR then applies cleanly to `main`.

## Starting State

| | Count |
| :--- | ---: |
| Starting catalog (622 on `main` + 104 from batch 006) | **726** |
| `OPEN_SOURCE` / `FREE` / `FREE_TIER` / `PERSONAL_FREE` | 431 / 213 / 73 / 9 |
| `UNVERIFIED` / `PARTIALLY_VERIFIED` / `VERIFIED` | 720 / 6 / 0 |
| Developer categories before (`developer-utilities`, `apis`, `testing`, `databases`, `hosting`, `code-editors`, `deployment`, `monitoring`, `ai-apis`, `authentication`, `storage`) | 45, 6, 13, 17, 14, 12, 6, 3, 2, 3, 2 |

## Research

| | Count |
| :--- | ---: |
| Candidates screened | **403** (400 on the working list plus 3 found during research) |
| Researched in depth | **196** |
| Accepted | **151** |
| Rejected | **23** |
| Deferred | **229** |

Every candidate was screened: a duplicate check against the 726 existing entries (name, slug, official URL, source URL, domain and tags), and, for the 274 candidates with a GitHub repository, licence, archive status, last push and latest release read from the GitHub API. "Researched in depth" means the provider's own documentation, terms, pricing page or licence file was read for that candidate. The remaining 207 were screened only, and none of them was accepted.

| Rejected by class | Count | Deferred by class | Count |
| :--- | ---: | :--- | ---: |
| abandoned | 4 | overlapping resource | 133 |
| already represented | 4 | insufficient information | 59 |
| trial only | 3 | unclear licensing | 18 |
| broken | 2 | abandoned | 6 |
| unsafe/untrusted | 2 | broken | 4 |
| not actually free | 2 | unclear pricing | 4 |
| unclear licensing | 2 | regional restriction | 2 |
| unclear pricing, regional restriction, duplicate, insufficient information | 1 each | poor developer utility | 2 |
| | | unclear identity | 1 |

Rejected means the candidate failed a listing rule (not free, trial only, broken, abandoned, already listed, licence problem). Deferred means it may qualify, but was not added now because of overlap with existing or accepted entries, unresolved licence or pricing questions, or because it was only screened. A deferral is not a judgment that the resource is unfit.

Sources were provider pages only: homepages, documentation, pricing and terms pages, licence files and official repositories. Where a page could not be fetched directly and an indexed excerpt of the official domain was used instead, the entry's `compilationNotes` records it (for example, the USGS entry).

## Acceptance Distribution

### By free status

| Status | New | Catalog after |
| :--- | ---: | ---: |
| `FREE` | 63 | 276 |
| `OPEN_SOURCE` | 59 | 490 |
| `FREE_TIER` | 20 | 93 |
| `PERSONAL_FREE` | 9 | 18 |

### By resource type

`API` 52, `DEVELOPER_TOOL` 47, `SERVICE` 16, `WEBSITE` 10, `DATASET` 8, `WEB_APP` 8, `AI_TOOL` 3, `DESKTOP_APP` 3, `BOOK` 2, `EDUCATIONAL_RESOURCE` 1, `COURSE` 1.

### By platform

`BROWSER` 106, `SELF_HOSTED` 34, `LINUX` 32, `MACOS` 29, `WINDOWS` 26, `ANDROID` 2, `IOS` 2. Six entries have no platforms (Testcontainers, Schemathesis, WireMock, Flutter, RDKit, Astropy) because no operating-system statement or per-OS release asset was established; each says so in `compilationNotes`.

74 entries have `apiAvailable: true`.

## Category Distribution

| Category | New | Category | New |
| :--- | ---: | :--- | ---: |
| apis | 39 | code-editors | 4 |
| testing | 20 | hosting, learning, books | 3 each |
| developer-utilities | 19 | weather, ai-models, documents, deployment, games | 2 each |
| maps | 11 | travel, ai-audio, ai-image, ai-research, storage | 1 each |
| databases | 7 | communication, marketing, courses, open-source | 1 each |
| research, monitoring, ai-apis | 5 each | | |
| science, authentication | 4 each | | |

Developer categories after: `developer-utilities` 64, `apis` 45, `testing` 33, `databases` 24, `hosting` 17, `code-editors` 16, `deployment` 8, `monitoring` 8, `ai-apis` 7, `authentication` 7, `storage` 3.

## Hidden and Underrated Discoveries

Resources a developer is unlikely to find through a popularity list, each with a specific use:

- CIRCL hashlookup: checks file hashes against known-file sets such as NIST NSRL, so incident responders can set known-good files aside.
- smee.io: relays webhooks to an app on your own machine during development.
- cron-job.org: donation-funded web cron with published source.
- rdap.org: RDAP bootstrap that redirects domain, IP and ASN lookups to the right registry.
- Zonemaster (AFNIC and the Swedish Internet Foundation) and DNSViz: DNS delegation and DNSSEC analysis.
- Internet.nl: tests whether a site, mail server or connection uses IPv6, DNSSEC, HTTPS and related standards.
- OpenFreeMap and Protomaps/PMTiles: OpenStreetMap vector tiles from a donation-funded host, or from a single file on static storage.
- BigDataCloud client-side reverse geocoding: device location to country, region, city and postcode, for client-side calls only.
- Base Adresse Nationale, Entur, Aladhan and Al Quran Cloud: national address, transport and religious-calendar APIs (see Regional Coverage).
- AIKosh and MOSIP: Indian government AI datasets and models, and open-source identity infrastructure from IIIT Bangalore.
- Vosk: offline speech recognition with small models, including Hindi and Indian English.
- ecosyste.ms: cross-registry package, repository and dependency data.
- OpenCitations and ROR: CC0 citation links and research-organisation identifiers.
- FIRST EPSS and CISA KEV: exploitation-likelihood scores and the known-exploited list, for deciding what to patch first.
- Kroki, Datasette and Apache AGE: diagram rendering over HTTP, data publishing with a JSON API, and graph queries inside PostgreSQL.

## Regional Coverage

| Region | Entries |
| :--- | :--- |
| India | AIKosh (IndiaAI), MOSIP (IIIT Bangalore), Vosk (Hindi and Indian English models) |
| Brazil | BrasilAPI |
| France | data.gouv.fr API catalogue, Base Adresse Nationale geocoding, Mistral API |
| Norway | MET Norway Weather API, Entur open APIs |
| Singapore | data.gov.sg API |
| United Kingdom | data.police.uk, postcodes.io |
| Arabic-speaking and Muslim-majority regions | Aladhan Prayer Times API, Al Quran Cloud API |
| Europe (other) | ECB Data Portal, Europe PMC, RIPEstat and RIPE Atlas (RIPE NCC), CIRCL hashlookup (Luxembourg), Internet.nl (Netherlands), Zonemaster (France and Sweden), Healthchecks.io (Latvia), cron-job.org, Overpass API (FOSSGIS), openrouteservice (HeiGIT), Photon (komoot) |

Gaps: Africa, Spanish-speaking Latin America and Southeast Asia beyond Singapore. The candidates for them did not pass: openAFRICA returned 403, Africa's Talking pricing was not established, API Setu needs organisation approval, the IBGE API has no stated licence, and Digitransit (Finland) returned 403. These are the first places to look in a follow-up batch.

## API Coverage

52 new entries are `API` resources and 74 have `apiAvailable: true`. Groups:

- Public utility APIs: wttr.in, USGS Earthquake, Frankfurter, Nager.Date, IPinfo Lite, DB-IP Lite, Gutendex, JSONPlaceholder, Random User Generator, endoflife.date.
- Scholarly and health: Semantic Scholar, ORCID, DataCite, Unpaywall, OpenCitations, Europe PMC, ROR, ChEMBL, OpenML, Common Crawl, openFDA, ClinicalTrials.gov.
- Government, weather and finance: NWS, MET Norway, OpenAQ, FRED, SEC EDGAR, ECB Data Portal, data.police.uk, data.gov.sg, data.gouv.fr catalogue, BrasilAPI, Entur.
- Maps: Nominatim, Photon, Overpass, OSRM, Valhalla, openrouteservice, OpenFreeMap, BigDataCloud, Geoapify, postcodes.io, Base Adresse Nationale.
- Internet measurement: Cloudflare Radar, RIPEstat, PeeringDB, RIPE Atlas, Measurement Lab.

## AI/ML Coverage

- Inference APIs with free use: OpenRouter, Cloudflare Workers AI, Groq, Mistral (`FREE_TIER`) and Cohere (`PERSONAL_FREE`, evaluation key for non-commercial use). Where the provider documents training on free-tier prompts (OpenRouter, Mistral, Cohere), it is in `limitations`. Groq's free-plan limits are shown only in its console, and the entry says so.
- Local and offline: llamafile, Vosk, PaddleOCR, OCRmyPDF, Docling.
- Data and models: AIKosh, OpenML, pgvector (vector search in PostgreSQL).

Five AI API candidates were rejected (Cerebras, NVIDIA API Catalog, SambaNova, GitHub Models, Hugging Face Inference Providers) because they were trials, credit-based, retired or already represented.

## Infrastructure Coverage

- Databases and backends: DuckDB, Apache AGE, PocketBase, Appwrite, MongoDB Atlas, Datasette, pgvector.
- Storage: Backblaze B2.
- Hosting and environments: GitHub Pages, Neocities, GitHub Codespaces, Google Cloud Shell, Coolify, act.
- Webhooks, cron, notifications and email: cron-job.org, Healthchecks.io, Webhook.site, smee.io, Kroki, ntfy, Mailpit, Brevo, Mailtrap.
- Observability: Prometheus, GlitchTip, UptimeRobot, RIPE Atlas.

## Security Coverage

The catalog has no security category, so these sit in `apis`, `testing` and `developer-utilities` (see Architecture Limitations).

- Vulnerability and supply-chain data: NVD API, CISA KEV, FIRST EPSS, OSV.dev, deps.dev, ecosyste.ms, MITRE ATT&CK.
- Threat intelligence: CIRCL hashlookup, abuse.ch, AbuseIPDB.
- Code and supply-chain tools: Semgrep, Syft, Gitleaks, OpenSSF Scorecard, Dependency-Track.
- Web, TLS and DNS checks: Mozilla HTTP Observatory, Internet.nl, testssl.sh, DNSViz, Zonemaster, rdap.org.
- Identity and secrets: Authelia, authentik, OpenFGA, MOSIP, SOPS.

## Developer Utility Coverage

- Command-line data tools: yq, Miller, qsv, ShellCheck.
- Testing and web quality: Testcontainers, Hurl, Schemathesis, WireMock, Lighthouse, WebPageTest, Nu Html Checker.
- Documentation and references: DevDocs, Can I use, tldr pages, explainshell, Learn X in Y minutes, RFC Editor, Beej's Guides, OSTEP, The Missing Semester, Shields.io.
- Mobile and embedded: Android Studio, Flutter, scrcpy, PlatformIO, Wokwi, Node-RED, MicroPython.
- Games and science: LDtk, Nakama, RDKit, Astropy.
- Meta-resources, kept to four: free-programming-books, Public APIs, free-for.dev and awesome-selfhosted. Each repository had commits in the week before compilation, per the GitHub API. free-for.dev has no licence file and is listed as `FREE` with no `license`. APIs.guru was rejected as stale, and the free-llm-api-resources repository no longer exists.

## Duplicate Analysis

Checked with a script against all 877 entries after the change:

| Check | Result |
| :--- | :--- |
| Duplicate slugs | 0 |
| Duplicate normalised names | 0 |
| Duplicate canonical official URLs | 0 |
| Duplicate canonical source URLs | 2, both existing before this batch (see below) |
| Existing entries changed | 0 (the first 726 entries are identical to the base) |

Near-matches, reviewed by hand and kept:

- `cloudflare-radar` and `cloudflare-workers-ai` next to `cloudflare`; `github-pages` and `github-codespaces` next to `github`. Each is a separate product with its own terms and limits. The existing umbrella entries were not changed.
- `mozilla-http-observatory` shares the `developer.mozilla.org` host with `mdn-web-docs`; `chembl` shares `ebi.ac.uk` with `pdbe`. These are different services.
- `micropython` next to `python`: a separate implementation for microcontrollers.
- Name matches with no relationship: `internet-nl` / `inter-font`, `openssf-scorecard` / `core-ac-uk`, `glitchtip` / `glitch`, `astropy` / `astro`.

Over-splitting: each product has one entry. The OpenStreetMap entries (Nominatim, Photon, Overpass, OSRM, Valhalla, openrouteservice, OpenFreeMap, Protomaps) are separate software from different maintainers, not one product split up. RIPEstat and RIPE Atlas are separate RIPE NCC services with different terms.

Existing catalog findings, reported but not changed in this PR:

- `glitch` is stale: Glitch ended project hosting on 2025-07-08.
- `thunderbird` and `k9-mail` share the source URL `github.com/thunderbird/thunderbird-android`. `wikisource`, `wikisource-kannada` and `wikimedia-commons` share `github.com/wikimedia/mediawiki`.

## Licensing Analysis

- `OPEN_SOURCE` (59) is used only where the licence is OSI-approved: MIT 28, Apache-2.0 23 (both counts include hosted services with published code), BSD-3-Clause 7, MPL-2.0 5, and others including BSD-2-Clause, PostgreSQL, AGPL-3.0, GPL and LGPL.
- Non-OSI licences such as CC0, CC BY, CC BY-SA, CC BY-NC, NLOD, OGL, Licence Ouverte, the Singapore Open Data Licence, IETF Trust provisions, US public domain and the MITRE ATT&CK terms are recorded in `license`, and those entries are `FREE` (or `PERSONAL_FREE` for Cloudflare Radar's CC BY-NC data), never `OPEN_SOURCE`.
- Hosted services with published code: in 19 entries the service is `FREE` or `FREE_TIER` while `openSource: true` and `license` describe the code (for example wttr.in, OSV.dev, Healthchecks.io, ntfy, Internet.nl). `licenseNotes` explains the split in each.
- Bare GPL-family identifiers (8 entries): ecosyste.ms and Overpass API (AGPL-3.0), openrouteservice, ShellCheck and explainshell (GPL-3.0), cron-job.org and testssl.sh (GPL-2.0), and Semgrep (LGPL-2.1). The licence files did not establish "only" versus "or later", and each entry's `licenseNotes` says so. A maintainer should confirm these before any of them is verified.
- Mixed licences, recorded as found: Nominatim (GPL-2.0 and GPL-3.0-or-later), ntfy (Apache-2.0 OR GPL-2.0), Shields.io (MIT / Apache-2.0), MET Norway (NLOD 2.0 / CC BY 4.0).
- 47 entries have no `license`, mostly hosted services and APIs whose terms are not a licence. Per-item licences (Europe PMC articles, OpenML datasets, Al Quran Cloud translations) are described in `limitations`.

## Free-Status Analysis

- `FREE` (63): no paid tier gates the listed use, as documented by the provider.
- `FREE_TIER` (20): IPinfo Lite, ecosyste.ms, OpenAQ, openrouteservice, Geoapify, OpenRouter, Cloudflare Workers AI, Groq, Mistral, MongoDB Atlas, Backblaze B2, Healthchecks.io, Webhook.site, ntfy, Brevo, Mailtrap, Neocities, GitHub Codespaces, WebPageTest and UptimeRobot. Each has its documented quotas in `limitations`.
- `PERSONAL_FREE` (9): used where the terms limit free use to non-commercial work: Nager.Date, ORCID, abuse.ch, Cloudflare Radar, RIPEstat, RIPE Atlas, Cohere, AbuseIPDB and Wokwi.
- Every `FREE_TIER` and `PERSONAL_FREE` entry has at least one limitation. The build enforces this.
- The catalog has no field for "documented but unverified". What a provider said about API keys, sign-up, cards and commercial use is therefore recorded in `compilationNotes`, labelled "(unverified)". Descriptions and features do not repeat these as facts: a final pass removed key, sign-up and card claims from short and long descriptions, `whyListed` and `features`. Documented quotas that depend on having a key, such as openFDA's keyed and keyless rate limits, stay in `limitations`.

## Verification Status

All newly added resources are UNVERIFIED unless the existing repository verification workflow explicitly confirms otherwise.

For this batch, that workflow confirmed nothing:

- All 151 entries are `UNVERIFIED`.
- No entry has `verificationChecks`, `verificationSources`, `verifiedBy` or `lastVerifiedAt`.
- All 604 tri-state facts (`requiresAccount`, `requiresCreditCard`, `commercialUse` and `personalUse` for each entry) are `unknown`.
- Every `compilationNotes` states that the research was not a verification pass.
- `submittedAt` and `updatedAt` are 2026-10-01, the compilation date. That date is never a verification date.

After the change: 877 resources, 0 fully verified, 4 awaiting sign-off, 6 partially verified, 867 never verified, 0 registered maintainers. These are the same verified and partial counts as before.

## Validation Results

All validation was run locally on Windows with Node 22. The two run outputs are counted separately because `verify:static` re-runs the full build.

| Command | Result |
| :--- | :--- |
| `npx tsc --noEmit` | Pass |
| `npm test` | 47/47 pass |
| `npm run verify` (lint, typecheck, test, build) | Pass. 877 `/resources/[slug]` routes and 878 OG images |
| `npm run verify:static` | Pass. 2,146 static pages; CSP written into 1,265 pages with no `'unsafe-inline'` for scripts |
| `npm run test:browser` | 61/61 pass, unchanged from the baseline. The no-JS check lists 877 resources |
| `npm run backlog`, then `npm run backlog:check` | Backlog regenerated for 877 resources; check passes |
| `npm run check:verification` | 877 resources: 0 verified, 4 awaiting sign-off, 6 partial, 867 never verified |
| Data rules (`findDataProblems`, run at load) | 0 problems |
| Batch check script (enums, duplicates, regression against base) | 0 problems; 0 existing entries changed |

CI only runs automatically for pull requests into `main`, so this stacked PR will not trigger it on its own (see Architecture Limitations).

## Rejected Candidates

| Candidate | Class | Reason |
| --- | --- | --- |
| REST Countries | unclear pricing | The service now issues keys under paid plans; the free terms were not clear when researched |
| WorldTimeAPI | broken | The service did not respond on any attempt during research |
| ip-api | unsafe/untrusted | The free endpoint is HTTP-only (no HTTPS) and limited to non-commercial use |
| Cerebras Inference | trial only | Free access was a time-limited credit trial that asks for a card |
| NVIDIA API Catalog | trial only | The terms describe trial and evaluation access, not an ongoing free service |
| GitHub Models | abandoned | A retirement date of 2026-07-30 was published, so the free tier has ended |
| SambaNova Cloud | not actually free | Use requires purchased or promotional credits |
| free-llm-api-resources | broken | The repository returns 404 (deleted) and no licence could be established |
| API Setu | regional restriction | Access needs organisation onboarding and approval, and some APIs are charged |
| DIGIT | abandoned | The DIGIT-OSS repository is archived on GitHub |
| Open Notify | unsafe/untrusted | The endpoints are HTTP-only and no recent maintenance was found |
| OpenSky Network | not actually free | The terms require a separate licence for use in applications |
| ThingsBoard | unclear licensing | The repository LICENSE is the Business Source License, which is not an open-source licence |
| Fly.io | trial only | New accounts get a trial and a card is required to continue |
| APIs.guru | abandoned | API definitions were last updated on 2024-03-01; later commits only touch the README and org files |
| httpbin | abandoned | Last release 2017-08 and last repository push 2024-05 |
| Dog CEO | unclear licensing | The repository has no licence file |
| Pro Git | already represented | The book is published on git-scm.com, already listed as `git`; its CC BY-NC-SA 3.0 licence also needs care |
| arXiv API | already represented | The `arxiv` listing already covers arXiv |
| NCBI E-utilities | already represented | NCBI resources are already listed (`ncbi-genbank`, `pubmed-central`) |
| data.gov.in API | duplicate | The same platform is already listed as `data-gov-in`, and the API portal showed a sandbox banner |
| HF Inference Providers | already represented | Covered by the existing `hugging-face` listing; the free allowance was a small monthly credit |
| NDAP | insufficient information | The site renders only with JavaScript and no terms or access rules could be read |

## Deferred Candidates

Grouped by reason. "Screened only" means only the duplicate check and repository facts were collected.

| Class | Candidates | Reason |
| --- | --- | --- |
| broken | crt.sh | Returned HTTP 502 on every attempt during research |
| broken | bund.dev | The source repository returned 404 and the site could not be read |
| broken | openAFRICA, Digitransit | Returned 403 during research |
| insufficient information | Materials Project | The terms page returned 403, so reuse terms could not be read |
| insufficient information | PageSpeed Insights | No quota or API terms were found beyond Google's general terms |
| insufficient information | ipify | The operator and terms were not established, and the repository was last pushed in 2024-02 |
| insufficient information | Hurricane Electric BGP Toolkit | Web-only and no terms of use were found; overlaps RIPEstat and PeeringDB |
| insufficient information | OpenTelemetry | Planned but not written; the project spans many components and needs its own scoping |
| insufficient information | mkcert | Last release 2022-04; whether it is mature or abandoned was not established |
| insufficient information | FerretDB | Screened only; release activity slowed after 2025-11 |
| insufficient information | LAMMPS, mtr, Tasmota | Screened only; the bare GPL identifiers also need confirming |
| insufficient information | Sunbird | Screened only; which Sunbird building block to list was not resolved |
| insufficient information | Emscripten, Eclipse Mosquitto, PrivateBin, tokei | Screened only; dual, mixed or unread licence files |
| insufficient information | just | Screened only; its CC0 licence would make it `FREE`, not `OPEN_SOURCE` |
| insufficient information | Wasmtime, tmux, rembg, OneSignal, Xcode, grep.app | Screened only; platforms, model licences or terms not researched |
| insufficient information | Gmsh, ParaView, croc, restic, BorgBackup | Screened only; outside the developer focus of this batch |
| insufficient information | dive | Screened only; last release 2025-03 |
| insufficient information | hyperfine, difftastic, grpcurl, RealFaviconGenerator, Turf.js, H3, QuestDB, Apache CouchDB, dbmate, usql, pgcli, Postal, Stryker Mutator, Maestro, Appium, Responsively App, Nuclei, Sigstore, Glances, Centrifugo, AssemblyScript, Raspberry Pi Imager, Thonny, delta, direnv, fzf, zoxide, btop, pre-commit, websocat, quicktype | Screened only; not researched in depth |
| unclear licensing | IBGE API | No data licence could be established for the API |
| unclear licensing | CoinGecko API | The free Demo plan does not grant a commercial licence |
| unclear licensing | Sunrise-Sunset API | The site terms read as personal use only |
| unclear licensing | Beckn Protocol | The specification is CC BY-NC-SA 4.0 (not open source) and it was unclear which artefact to list |
| unclear licensing | ESPHome | MIT with some components under GPL-3.0-or-later |
| unclear licensing | Rosetta Code | The site's GFDL version statements conflict |
| unclear licensing | Renode | GitHub reports no standard licence identifier; the licence file needs reading |
| unclear licensing | iperf3 | The licence is a BSD-3-Clause variant from LBNL that GitHub does not map to a standard identifier |
| unclear licensing | ROS 2 | The meta repository has no licence file; component licences vary |
| unclear licensing | roadmap.sh | Content is under a custom personal-use licence and the site sells a Pro plan |
| unclear licensing | Neo4j, Netdata | The core is GPL-3.0 but parts of the product are commercial or proprietary |
| unclear licensing | TimescaleDB | Mixed Apache-2.0 and Timescale License code |
| unclear licensing | Tabby, Weaviate, Infisical, SigNoz, SuperTokens | Open core: separately licensed enterprise code in the repository |
| unclear pricing | Railway | The free allowance is a small monthly credit and the card requirement was unclear |
| unclear pricing | Better Stack | The free plan is labelled for personal projects and commercial use was unclear |
| unclear pricing | Sarvam AI API | Free-tier terms were not established |
| unclear pricing | Africa's Talking | Sandbox versus live pricing was not established |
| unclear identity | bgp.tools | The operator is not named and there is no terms page |
| regional restriction | ModelScope | Access requires Alibaba Cloud real-name verification |
| regional restriction | Codeberg Pages | Free use is limited to free/libre projects; the terms need a closer read |
| abandoned | Indic NLP Library | No commits since 2024-06 and no release since 2021; worth a maintainer check |
| abandoned | GPT4All | Last repository push 2025-05 and last release 2025-02 |
| abandoned | Kokoro TTS | Last repository push 2025-08 and no releases |
| abandoned | PWABuilder, LibreSprite | Last release 2024-02 and 2023-12 |
| abandoned | IT Tools | Last release 2024-10; overlaps the existing DevToys listing |
| poor developer utility | GreyNoise Community | The free plan needs a business email and allows only a few lookups a day |
| poor developer utility | jsfxr | Narrow game-audio utility; screened only |
| overlapping resource | NASA API portal | Overlaps the existing `nasa-open-data` listing |
| overlapping resource | INSPIRE-HEP, NASA ADS | Held to avoid over-weighting scholarly APIs in one batch; ADS abstracts are also restricted to personal use |
| overlapping resource | UCI Machine Learning Repository | ML datasets are covered by OpenML here; licences vary per dataset |
| overlapping resource | GeoLite | DB-IP Lite and IPinfo Lite cover free IP data; GeoLite also needs an account and an EULA |
| overlapping resource | LocationIQ | Geocoding is covered by Nominatim, Photon and Geoapify in this batch |
| overlapping resource | GraphHopper | Routing is covered by OSRM, Valhalla and openrouteservice; the hosted free plan is non-commercial |
| overlapping resource | MapLibre GL JS | Web maps are covered by Leaflet and OpenLayers already |
| overlapping resource | Calendarific | Holiday data is covered by Nager.Date here |
| overlapping resource | Alpha Vantage, ExchangeRate-API | Financial and exchange-rate data is covered by Frankfurter, ECB, FRED and SEC EDGAR here |
| overlapping resource | PokeAPI, DummyJSON, Faker, Mockaroo | Practice APIs and fake data are covered by JSONPlaceholder and Random User here |
| overlapping resource | ICANN Lookup | rdap.org covers RDAP lookups in this batch |
| overlapping resource | doggo | DNS checks are covered by DNSViz and Zonemaster; its bare GPL-3.0 identifier also needs confirming |
| overlapping resource | SSL Labs Server Test | TLS testing is covered by testssl.sh and Internet.nl here; terms not researched |
| overlapping resource | AlienVault OTX | Threat data is covered by abuse.ch and AbuseIPDB here; terms not researched |
| overlapping resource | LibreSpeed | Speed testing is covered by Measurement Lab here |
| overlapping resource | Grype | Vulnerability scanning is covered by Trivy and OSV here |
| overlapping resource | TruffleHog | Secret scanning is covered by Gitleaks here |
| overlapping resource | Bandit | Static analysis is covered by Semgrep here |
| overlapping resource | OpenBao, age | Secrets handling is covered by SOPS in this batch |
| overlapping resource | ZITADEL, Ory Kratos, Logto, Better Auth | Identity is covered by Keycloak, authentik and Authelia |
| overlapping resource | Casbin, Cerbos | Authorisation is covered by OpenFGA here |
| overlapping resource | Gatus, Upptime | Uptime checks are covered by Uptime Kuma, Healthchecks.io and UptimeRobot; Upptime's last tagged release was 2020-10 |
| overlapping resource | Jaeger, Grafana Loki, VictoriaMetrics | Tracing was deferred with OpenTelemetry; Loki shares the existing `grafana` stack; metrics are covered by Prometheus |
| overlapping resource | Honeycomb, New Relic | Observability free tiers are covered by Sentry, Grafana and GlitchTip; terms not researched |
| overlapping resource | Gotify, Apprise | Notifications are covered by ntfy here |
| overlapping resource | Mailgun, Mailjet, SMTP2GO | Email sending is covered by Brevo and Mailtrap here and Resend already; SMTP2GO sign-up asks for a work email and SMS verification |
| overlapping resource | Svix, Hookdeck, Beeceptor | Webhook tooling and mocking are covered by Webhook.site, smee.io, WireMock and Mockoon |
| overlapping resource | Pact, Prism | API testing and mocking are covered by WireMock, Schemathesis and Mockoon |
| overlapping resource | Selenium, Cypress, WebdriverIO, Puppeteer | Browser automation and testing are covered by Playwright already |
| overlapping resource | Artillery, Gatling, Vegeta, oha | Load testing is covered by k6 and Locust already |
| overlapping resource | Woodpecker CI, Dagger, Jenkins | CI is covered by GitHub Actions and act |
| overlapping resource | Dokku, CapRover, Kamal | Self-hosted deployment is covered by Coolify here |
| overlapping resource | Surge, GitLab Pages | Static hosting is covered by GitHub Pages, Cloudflare Pages and Netlify |
| overlapping resource | Deno Deploy, Firebase Studio | deno.com and Firebase are already listed; hosted free terms not researched |
| overlapping resource | Replit | Browser IDEs are covered by CodeSandbox, StackBlitz and Codespaces; free terms not researched |
| overlapping resource | GitHub CLI | A client for the existing `github` listing |
| overlapping resource | Aiven, TiDB Cloud | Hosted database free tiers are covered by Neon, Supabase, Turso and MongoDB Atlas |
| overlapping resource | ClickHouse | Analytical SQL is covered by DuckDB here |
| overlapping resource | Typesense, OpenSearch | Search is covered by the existing Meilisearch listing |
| overlapping resource | sqlite-vec, LanceDB, FAISS, FastEmbed | Vector search and embeddings are covered by pgvector, Qdrant, Chroma, Milvus and Sentence Transformers |
| overlapping resource | sqlite-utils | Companion to Datasette, accepted here |
| overlapping resource | Adminer | Database GUIs are covered by DBeaver, pgAdmin and Beekeeper Studio |
| overlapping resource | Garnet, NATS, SeaweedFS, Garage | Covered by the existing Valkey, RabbitMQ and MinIO listings |
| overlapping resource | KoboldCpp, MLC LLM | Local LLM runners are covered by llama.cpp, Ollama, LM Studio and llamafile |
| overlapping resource | Cline, OpenHands | AI coding assistants are covered by Continue and Aider already |
| overlapping resource | faster-whisper | Overlaps the existing Whisper and whisper.cpp listings |
| overlapping resource | EasyOCR | OCR is covered by PaddleOCR and OCRmyPDF here; last release 2024-09 |
| overlapping resource | D2, Graphviz, PlantUML | Kroki, accepted here, renders all three |
| overlapping resource | React Native, Expo, Capacitor | Cross-platform mobile is covered by Flutter here |
| overlapping resource | Zephyr, ESP-IDF | Embedded development is covered by PlatformIO here |
| overlapping resource | Colyseus | Game servers are covered by Nakama here |
| overlapping resource | Box2D, Jolt Physics, MonoGame, Pyxel, Stride, O3DE | Game development is covered by Godot, raylib, Bevy and others already |
| overlapping resource | OpenGameArt | Game assets are covered by the existing Kenney listing; licences vary per asset |
| overlapping resource | Gerrit, Phorge | Code hosting and review are covered by Gitea, Forgejo and GitLab |
| overlapping resource | mdBook, Sphinx, Hugo, Zola | Documentation and site generators are covered by Docusaurus, MkDocs and Astro |
| overlapping resource | fx, csvkit, dasel | JSON, CSV and structured-data tooling is covered by jq, JSON Crack, yq, Miller and qsv |
| overlapping resource | xh | HTTP clients are covered by curl and HTTPie already |
| overlapping resource | shfmt | Shell tooling is covered by ShellCheck here |
| overlapping resource | cheat.sh | Command cheat sheets are covered by tldr pages here |
| overlapping resource | transform.tools | Format conversion is covered by DevToys already |
| overlapping resource | lazydocker, kind | Covered by the existing lazygit, k9s and k3s listings |
| overlapping resource | frp, bore | Tunnelling is covered by ngrok already |
| overlapping resource | htmx, Alpine.js, Pico CSS, Workbox | Front-end libraries were held back in this batch |
| overlapping resource | NumPy, Polars, OpenCV, Socket.IO, Vite, esbuild, Tailwind CSS | Well-known projects held back; the brief prefers less-covered resources |

## Architecture Limitations

These are reported here and not fixed, because this PR is data-only.

- No security, networking, datasets, mobile development, IoT or game development categories. Vulnerability feeds sit in `apis`, security tools in `testing`, DNS tools in `developer-utilities`, and Wokwi in `science`.
- There is no structured field for "documented by the provider but unverified". Provider statements about keys, sign-up, cards and commercial use therefore live in free-text `compilationNotes`, where filters cannot use them.
- `license` is free text. Values such as "MIT / Apache-2.0" or "Public domain (US Government work)" cannot be checked against SPDX automatically, and the deprecated bare GPL identifiers are accepted.
- The `languages` field is unused across the catalog, so interface languages (relevant for Vosk, Aladhan, Al Quran Cloud, BrasilAPI and BAN) are not filterable.
- CI (`.github/workflows/ci.yml`) runs automatically only for pull requests into `main`. A PR stacked on a feature branch gets no automatic checks.
- Existing data issues found during dedupe: the stale `glitch` entry and the shared source URLs listed under Duplicate Analysis.

## Files Changed

- `src/data/resources/batch-007.ts`: new, 151 entries.
- `src/data/resources/index.ts`: imports and spreads `batch007Resources` after `batch006Resources`.
- `docs/verification-backlog.md`: regenerated for 877 resources.
- `docs/verification/developer-resource-expansion-001.md`: this report.

No UI, search, verification logic, maintainer configuration, CODEOWNERS, workflow or infrastructure files were changed.
