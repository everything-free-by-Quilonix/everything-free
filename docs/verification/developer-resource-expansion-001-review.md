# Developer Resource Expansion 001 — PR Review

Review only. Nothing was merged, committed, pushed, staged, amended or retargeted, and no tracked file was edited. This report is an untracked file and must not be committed to the PR branch.

- Audit date: 2026-10-02. Every provider page cited here was fetched on 2026-10-02, by the six slice audits, the cross-cutting audit, or (for a few re-checks, each marked "re-fetched by this aggregation") this aggregation.
- Fetching a provider page is not verification. Nothing in this report changes any verification state, and none of it should be recorded as `verificationChecks`, `verificationSources`, `verifiedBy` or `lastVerifiedAt`.
- Classes used: **BLOCKING** (must be fixed before the content lands on `main`), **NON-BLOCKING** (accuracy fix for a follow-up pass), **REQUIRES MANUAL REVIEW** (an official source could not settle it, or it needs a maintainer decision). Only BLOCKING items appear under "Required changes".
- Sources: notes in `.agents/tasks/pr15-review/` (`slice-a.md` to `slice-f.md`, `cross-cutting.md`, `baseline.txt`), plus repo files read directly for this aggregation (`batch-007.ts`, `docs/verification.md`, `src/types/resource.ts`, the PR report, existing batch files).

## PR audited

| Item | Value |
| --- | --- |
| Repository | `everything-free-by-Quilonix/everything-free` |
| PR | #15, "data: expand developer resource library 001" |
| Head | `data/developer-resource-expansion-001` at `c3bdd6d06148bfedd6037a2dc27454dbe54e177b` (the working copy for this review) |
| Base | `data/resource-expansion-006` at `b030e73` (PR #14's head) |
| Diff `b030e73...c3bdd6d` | 4 files, +3976 / −2 |

| File | Change |
| --- | --- |
| `src/data/resources/batch-007.ts` | added, +3425 |
| `docs/verification/developer-resource-expansion-001.md` | added, +396 |
| `docs/verification-backlog.md` | modified, +153 / −2 |
| `src/data/resources/index.ts` | modified, +2 |

PR state, and what the verdict means:

- PR #15 is already merged, but into its stacked base `data/resource-expansion-006` (merge commit `0efb494`, 2026-10-01T17:11:51Z), not into `main`. PR #14 was merged into `main` (`af01c3f`) 32 seconds earlier.
- Checked today from local remote-tracking refs (read-only): `origin/main` = `af01c3f`; `origin/data/resource-expansion-006` = `0efb494`, whose parents are `b030e73` and `c3bdd6d`; `c3bdd6d` is not an ancestor of `origin/main`; `src/data/resources/batch-007.ts` does not exist on `origin/main`. The PR metadata (merged flags, times, merger) comes from the cross-cutting audit's unauthenticated GitHub API GETs; I did not query the API again.
- So batch 007 is not on `main` and not on the deployed site. The merge-readiness verdict below answers one question: is the batch-007 content ready to land on `main`? Landing it needs a new PR into `main`.
- CI: one successful "Lint, types and data integrity" run exists on `c3bdd6d` (run 36896845537). `ci.yml` triggers only on `push`/`pull_request` to `main` and `workflow_dispatch`, so it was probably a manual dispatch; the event was not confirmed (REQUIRES MANUAL REVIEW). The merge commit `0efb494` has no check runs.

## Catalog baseline

| Measure | Before (`b030e73`) | After (`c3bdd6d`) |
| --- | ---: | ---: |
| Resources | 726 | 877 |
| `UNVERIFIED` | 720 | 871 |
| `PARTIALLY_VERIFIED` | 6 | 6 |
| `VERIFIED` | 0 | 0 |
| `FREE` | 213 | 276 |
| `OPEN_SOURCE` | 431 | 490 |
| `FREE_TIER` | 73 | 93 |
| `PERSONAL_FREE` | 9 | 18 |

- Counts re-run today: `batch007Resources.length` = 151 (151 unique slugs); `seedResources.length` = 877 (also in `baseline.txt`).
- Working copy: HEAD `c3bdd6d`. `docs/architecture.md` was already modified locally before this audit started (`baseline.txt`: 2 insertions, 5 deletions). Its diffstat was the same at the end of this run. It is a user edit outside the PR; it was not read and is not a finding.
- Local checks run by the cross-cutting audit on the working copy: `npm test` 47/47 pass; `npm run backlog:check` passes against an existing `out/link-manifest.json` (877 entries) that was not regenerated.

## New resources audited

Entries audited: **151**. Each was reviewed field by field (name, slug, URLs, type, category, subcategories, platforms, descriptions, whyListed, features, limitations, freeStatus, openSource, license, licenseNotes, API/download/embed flags, compilationNotes, tri-states, every verification field, dates).

| Slice | Scope | Entries |
| --- | --- | ---: |
| A | Public utility, scholarly and health APIs | 22 |
| B | Security data, public-sector and regional APIs, internet measurement | 28 |
| C | Maps and AI | 22 |
| D | Databases, infrastructure services, identity, hosting | 28 |
| E | Testing, security tools, DNS/TLS, CLI | 23 |
| F | Docs, references, meta-lists, observability, mobile/embedded, games/science | 28 |
| **Total** | | **151** |

Batch mix: API 52, DEVELOPER_TOOL 47, SERVICE 16, WEBSITE 10, DATASET 8, WEB_APP 8, AI_TOOL 3, DESKTOP_APP 3, BOOK 2, EDUCATIONAL_RESOURCE 1, COURSE 1. Free status: FREE 63, OPEN_SOURCE 59, FREE_TIER 20, PERSONAL_FREE 9.

Per-entry outcome. "B1" and "B2" refer to the blocking items under "Required changes". Evidence for every NON-BLOCKING and REQUIRES MANUAL REVIEW item is in the topical sections, or, for items that have no topical home, in "Per-entry evidence" after the slice tables.

### Slice A

| Slug | Type | Status | Outcome |
| --- | --- | --- | --- |
| wttr-in | API | FREE | NON-BLOCKING: self-hosting needs an OpenCage token and an upstream weather source |
| usgs-earthquake-api | API | FREE | REQUIRES MANUAL REVIEW: licence and credit page behind a bot check |
| frankfurter | API | FREE | No findings |
| nager-date | API | PERSONAL_FREE | REQUIRES MANUAL REVIEW: `openSource: false` while the repo is MIT and packages need a sponsor key |
| ipinfo-lite | API | FREE_TIER | REQUIRES MANUAL REVIEW: Lite-edition status rule; NON-BLOCKING: "without a request cap" in whyListed |
| db-ip-lite | DATASET | FREE | REQUIRES MANUAL REVIEW: Lite-edition status rule; NON-BLOCKING: primary category `apis` for a download-only dataset |
| gutendex | API | OPEN_SOURCE | No findings |
| jsonplaceholder | API | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split; repository inactive since 2021-06-14 |
| random-user-generator | API | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split; repository inactive since 2022-07-05 |
| endoflife-date | WEBSITE | OPEN_SOURCE | REQUIRES MANUAL REVIEW: hosted-with-code convention |
| semantic-scholar-api | API | FREE | REQUIRES MANUAL REVIEW: CC BY-NC returned data vs `FREE` |
| orcid-public-api | API | PERSONAL_FREE | B1 |
| datacite-rest-api | API | FREE | NON-BLOCKING: paging limitation overstated; `downloadAvailable` omits the data files |
| unpaywall | API | FREE | REQUIRES MANUAL REVIEW: official pages are JS-only; terms and Data Feed claims unconfirmed |
| opencitations | API | FREE | B1 |
| europe-pmc-api | API | FREE | REQUIRES MANUAL REVIEW: officialUrl returns 403 to scripts; limitations unconfirmed |
| ror-api | API | FREE | No findings |
| chembl | DATASET | FREE | NON-BLOCKING: `downloadAvailable` false despite full downloads |
| openml | DATASET | FREE | NON-BLOCKING: sourceUrl repo is maintenance-only; REQUIRES MANUAL REVIEW: rate-limit claim unsourced |
| common-crawl | DATASET | FREE | NON-BLOCKING: `apiAvailable` false despite the CDX index API |
| openfda | API | FREE | REQUIRES MANUAL REVIEW: key "required" vs documented keyless limits; NON-BLOCKING: `downloadAvailable` |
| clinicaltrials-gov-api | API | FREE | REQUIRES MANUAL REVIEW: limitations unconfirmable (JS-only pages) |

### Slice B

| Slug | Type | Status | Outcome |
| --- | --- | --- | --- |
| nvd-api | API | FREE | B1; REQUIRES MANUAL REVIEW: key-sharing clause not found; NON-BLOCKING: licenceNotes for CVE text |
| cisa-kev | DATASET | FREE | NON-BLOCKING: add licenseUrl; `apis` category for a dataset; `cc0` tag |
| first-epss | API | FREE | NON-BLOCKING: 1,000 requests/minute limit missing; scores generated by Empirical Security |
| osv-dev | API | FREE | NON-BLOCKING: licenseNotes omits share-alike and other source licences |
| deps-dev | API | FREE | NON-BLOCKING: BigQuery dataset needs a Google Cloud account and is billed beyond the free tier |
| ecosyste-ms | API | FREE_TIER | REQUIRES MANUAL REVIEW: bare `AGPL-3.0`; NON-BLOCKING: "some APIs paid-only" unsupported, CC BY-SA misread, sourceUrl is one repo |
| mitre-attack | DATASET | FREE | NON-BLOCKING: "spreadsheets" not re-confirmed; `research` category; licence string embeds commercial-use wording |
| circl-hashlookup | API | FREE | NON-BLOCKING: `downloadAvailable` (Bloom filter); NSRL 2023.09.2 vintage |
| abuse-ch | API | PERSONAL_FREE | B1; NON-BLOCKING: unattributed "otherwise sold commercially" |
| nws-api | API | FREE | NON-BLOCKING: coverage wording omits territories and marine zones |
| met-norway-api | API | FREE | No findings |
| openaq | API | FREE_TIER | B1; NON-BLOCKING: published MIT API code not recorded |
| fred-api | API | FREE | B1; NON-BLOCKING: hostname and logo restrictions missing |
| sec-edgar-apis | API | FREE | REQUIRES MANUAL REVIEW: official pages returned 403 |
| ecb-data-portal-api | API | FREE | B1; NON-BLOCKING: the two ECB documents differ on modification; resale condition; licenseUrl |
| data-police-uk | API | FREE | NON-BLOCKING: rolling ~3-year window and partial stop-and-search coverage; `downloadAvailable` |
| data-gov-sg-api | API | FREE | NON-BLOCKING: key-request wording; whyListed states coverage, not use; limits being tuned |
| data-gouv-fr-api-catalogue | WEBSITE | FREE | B2; NON-BLOCKING: name leads with the retired "api.gouv.fr" brand |
| brasilapi | API | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split; upstream data terms not stated; weak relatedResources; self-described experimental |
| entur-apis | API | FREE | B1; NON-BLOCKING: `NLOD` should carry its version (`NLOD-2.0`) |
| aladhan-api | API | FREE | REQUIRES MANUAL REVIEW: rate-limit claim unconfirmed; NON-BLOCKING: accuracy disclaimer missing |
| al-quran-cloud | API | FREE | NON-BLOCKING: limitation reads as non-commercial only; no-alteration and recitation caveats missing |
| aikosh | DATASET | FREE | B1; REQUIRES MANUAL REVIEW: registration from outside India; GPU allowance period |
| cloudflare-radar | WEBSITE | PERSONAL_FREE | REQUIRES MANUAL REVIEW: PERSONAL_FREE for CC BY-NC data; site unreadable to scripts |
| ripestat | API | PERSONAL_FREE | REQUIRES MANUAL REVIEW: shared PERSONAL_FREE question; NON-BLOCKING: officialUrl redirects |
| peeringdb | API | FREE | NON-BLOCKING: AUP understated; duplicate-query throttles missing; BSD-2-Clause code not recorded |
| ripe-atlas | SERVICE | PERSONAL_FREE | B1; REQUIRES MANUAL REVIEW: shared PERSONAL_FREE question; one-time credit grant |
| measurement-lab | DATASET | FREE | NON-BLOCKING: licenseNotes for CC0 data vs CC BY-NC-SA site content |

### Slice C

| Slug | Type | Status | Outcome |
| --- | --- | --- | --- |
| nominatim | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `GPL-2.0` should be `GPL-2.0-only`; Apache-2.0 part missing; licenseUrl is the usage policy |
| photon | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: officialUrl is komoot's demo instance; whyListed overstates public-instance autocomplete |
| overpass-api | API | OPEN_SOURCE | REQUIRES MANUAL REVIEW: bare `AGPL-3.0`; hosted-with-code convention; NON-BLOCKING: commercial-use limitation stricter than the operator's terms |
| osrm | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: demo server operator (FOSSGIS) not named |
| valhalla | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: "self-hosted only" ignores the documented demo server |
| openrouteservice | API | FREE_TIER | REQUIRES MANUAL REVIEW: recorded `GPL-3.0` conflicts with official project files; terms unreadable |
| openfreemap | SERVICE | FREE | No findings |
| protomaps-pmtiles | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: one entry covers format, basemap and hosted API; `apiAvailable` false |
| bigdatacloud-reverse-geocoding | API | FREE | REQUIRES MANUAL REVIEW: commercial-use and availability statements unsourced |
| geoapify | API | FREE_TIER | B1 |
| postcodes-io | API | FREE | REQUIRES MANUAL REVIEW: `FREE` vs Northern Ireland commercial licence; NON-BLOCKING: no `licenseNotes` (data licences, hosted/code split) |
| ban-geocoding | API | FREE | NON-BLOCKING: service renamed; decommission understated; refresh frequency conflict |
| openrouter | API | FREE_TIER | NON-BLOCKING: pricingUrl redirects |
| cloudflare-workers-ai | API | FREE_TIER | No findings |
| groq | API | FREE_TIER | REQUIRES MANUAL REVIEW: free-plan limits may now be published; NON-BLOCKING: "confirms" in compilationNotes |
| mistral-api | API | FREE_TIER | REQUIRES MANUAL REVIEW: training, card and evaluation statements unsourced; NON-BLOCKING: officialUrl is the corporate homepage; monthly credit form not stated |
| cohere-api | API | PERSONAL_FREE | B1; REQUIRES MANUAL REVIEW: training opt-out unsourced; NON-BLOCKING: provider calls it a "Trial API key" |
| llamafile | AI_TOOL | OPEN_SOURCE | NON-BLOCKING: officialUrl moved to `mozilla-ai`, no sourceUrl; MIT changes not in licenseNotes |
| vosk | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: IOS build is on request; WINDOWS and MACOS wheels omitted |
| paddleocr | AI_TOOL | OPEN_SOURCE | NON-BLOCKING: officialUrl lands on Baidu AI Studio's hosted service; unsourced Tesseract comparison |
| ocrmypdf | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: AGPL web wrapper not in licenseNotes; "no official GUI" partly contradicted |
| docling | AI_TOOL | OPEN_SOURCE | NON-BLOCKING: model licences and Python 3.10+ requirement not stated |

### Slice D

| Slug | Type | Status | Outcome |
| --- | --- | --- | --- |
| duckdb | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| apache-age | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| pocketbase | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `apiAvailable` false; pre-1.0 compatibility warning missing |
| appwrite | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: hosted-with-code convention; Cloud free-plan limits unreadable; NON-BLOCKING: shortDescription 113 characters |
| mongodb-atlas | SERVICE | FREE_TIER | REQUIRES MANUAL REVIEW: card statement source not found; NON-BLOCKING: "permanent" / "does not expire" stated as fact |
| datasette | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: JSON API stability (1.0 still alpha) |
| pgvector | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| backblaze-b2 | SERVICE | FREE_TIER | REQUIRES MANUAL REVIEW: free API-call terms stated for pay-as-you-go customers; card claim not re-read |
| cron-job-org | SERVICE | FREE | REQUIRES MANUAL REVIEW: bare `GPL-2.0`; "Germany" not found; NON-BLOCKING: `apiAvailable`; ToS shutdown and sustaining-member terms missing |
| healthchecks-io | SERVICE | FREE_TIER | REQUIRES MANUAL REVIEW: card and commercial-use statements in compilationNotes not found; NON-BLOCKING: no `licenseNotes` for the hosted/code split |
| webhook-site | WEB_APP | FREE_TIER | No findings |
| smee-io | SERVICE | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split |
| kroki | API | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split; `documents` category |
| ntfy | SERVICE | FREE_TIER | REQUIRES MANUAL REVIEW: `OR` operator and GPL variant; "best effort" uptime unsourced; NON-BLOCKING: app licences differ |
| mailpit | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `apiAvailable` false; REQUIRES MANUAL REVIEW: platforms not checked against release assets |
| brevo | SERVICE | FREE_TIER | B1; NON-BLOCKING: `marketing` category; free-plan branding not stated |
| mailtrap | SERVICE | FREE_TIER | NON-BLOCKING: whyListed "one free account"; "permanent" stated as fact |
| authelia | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: reverse-proxy dependency missing; "OpenID Certified" stated as fact |
| authentik | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: open-core rule applied inconsistently |
| openfga | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `apiAvailable` false; REQUIRES MANUAL REVIEW: binary OSes not checked |
| mosip | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: Inji and documentation licence sub-claims; NON-BLOCKING: India-only framing; sourceUrl is an organisation |
| sops | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `personal` subcategory; key-source requirement missing; REQUIRES MANUAL REVIEW: platforms |
| github-pages | SERVICE | FREE | REQUIRES MANUAL REVIEW: `FREE` vs `FREE_TIER`; NON-BLOCKING: a restriction listed as a feature |
| neocities | SERVICE | FREE_TIER | NON-BLOCKING: BSD-licensed backend code not recorded; `apiAvailable` false |
| github-codespaces | SERVICE | FREE_TIER | No findings |
| google-cloud-shell | SERVICE | FREE | B1; NON-BLOCKING: officialUrl redirects; pricingUrl missing |
| coolify | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: paid Coolify Cloud not mentioned (optional) |
| act | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: partial parity with GitHub-hosted runners not stated |

### Slice E

| Slug | Type | Status | Outcome |
| --- | --- | --- | --- |
| testcontainers | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: umbrella URL vs Java-only scope; Python port is Apache-2.0; Cloud product not mentioned |
| hurl | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| schemathesis | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| wiremock | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| lighthouse | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| webpagetest | WEB_APP | FREE_TIER | REQUIRES MANUAL REVIEW: officialUrl bot-challenged; ownership chain; NON-BLOCKING: Apache-2.0 branch omitted |
| nu-html-checker | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: officialUrl bot-challenged, mixed identity, hosted-with-code convention; NON-BLOCKING: W3C role wording; reasonable-use terms |
| mozilla-http-observatory | WEB_APP | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split; `SELF_HOSTED` possible |
| internet-nl | WEB_APP | FREE | NON-BLOCKING: CC BY 4.0 covers `/translations` only; REQUIRES MANUAL REVIEW: batch-API eligibility unsourced |
| semgrep | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: bare `LGPL-2.1`; Opengrep fork; NON-BLOCKING: name/officialUrl point at the commercial platform; open-core boundary and rules licence missing |
| syft | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| gitleaks | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: Betterleaks successor; NON-BLOCKING: security-patch-only status; Action licence key |
| openssf-scorecard | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `apiAvailable` false; GitHub authentication requirement |
| dependency-track | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| abuseipdb | API | PERSONAL_FREE | NON-BLOCKING: `personal` subcategory; "permanent" stated as fact |
| dnsviz | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: hosted-with-code convention; NON-BLOCKING: licenceNotes basis for `GPL-2.0-or-later` |
| zonemaster | WEB_APP | OPEN_SOURCE | REQUIRES MANUAL REVIEW: hosted-with-code convention |
| rdap-org | API | FREE | NON-BLOCKING: no `licenseNotes` for the hosted/code split; "no service guarantee" not on the page; IANA-only coverage missing |
| testssl-sh | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: bare `GPL-2.0`; bundled CC BY 3.0 US data undisclosed |
| yq | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| miller | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| qsv | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: separate qsv pro product not mentioned |
| shellcheck | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: bare `GPL-3.0` |

### Slice F

| Slug | Type | Status | Outcome |
| --- | --- | --- | --- |
| devdocs | WEB_APP | OPEN_SOURCE | No findings |
| can-i-use | WEBSITE | FREE | NON-BLOCKING: ads and paid ad removal not stated |
| tldr-pages | WEBSITE | FREE | NON-BLOCKING: official console clients vs `BROWSER` only |
| explainshell | WEB_APP | OPEN_SOURCE | REQUIRES MANUAL REVIEW: bare `GPL-3.0`; LLM extraction mode; hosted-with-code convention |
| learn-x-in-y-minutes | EDUCATIONAL_RESOURCE | FREE | No findings |
| free-programming-books | WEBSITE | FREE | No findings |
| rfc-editor | WEBSITE | FREE | No findings |
| beejs-guides | BOOK | FREE | NON-BLOCKING: licenseNotes can now cover the C guide |
| ostep | BOOK | FREE | No findings |
| missing-semester | COURSE | FREE | No findings |
| public-apis | WEBSITE | FREE | REQUIRES MANUAL REVIEW: "staff of the sponsor APILayer" unsourced |
| free-for-dev | WEBSITE | FREE | NON-BLOCKING: `hosting` primary category |
| awesome-selfhosted | WEBSITE | FREE | NON-BLOCKING: only primary `open-source` entry; `personal` subcategory; data repo; no "not verified" limitation |
| shields-io | SERVICE | OPEN_SOURCE | REQUIRES MANUAL REVIEW: hosted-with-code convention; NON-BLOCKING: `MIT OR Apache-2.0`; `design` subcategory |
| prometheus | DEVELOPER_TOOL | OPEN_SOURCE | No findings |
| glitchtip | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: hosted-with-code convention; NON-BLOCKING: "Free For Personal Projects" label |
| uptimerobot | SERVICE | FREE_TIER | B1; REQUIRES MANUAL REVIEW: "3 months of data"; NON-BLOCKING: "hobby and non-profit" label |
| android-studio | DESKTOP_APP | FREE | NON-BLOCKING: Windows on ARM unsupported |
| flutter | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: host OS platforms; NON-BLOCKING: `code-editors` subcategory |
| scrcpy | DESKTOP_APP | OPEN_SOURCE | No findings |
| platformio | DEVELOPER_TOOL | OPEN_SOURCE | REQUIRES MANUAL REVIEW: paid-services claim; NON-BLOCKING: `science` subcategory |
| wokwi | WEB_APP | PERSONAL_FREE | No findings |
| node-red | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: `lifestyle` subcategory |
| micropython | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: desktop platforms rest on source-only ports |
| ldtk | DESKTOP_APP | OPEN_SOURCE | NON-BLOCKING: `LINUX` missing; "without a parser library" overreaches |
| nakama | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: Nakama Enterprise and commercial licences not represented |
| rdkit | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: an official OS statement exists |
| astropy | DEVELOPER_TOOL | OPEN_SOURCE | NON-BLOCKING: thin features and shortDescription |

### Per-entry evidence

Evidence for slice-table items that are not evidenced elsewhere in this report. Provider pages were fetched on 2026-10-02 by the slice audit named in brackets; that is provider documentation, not verification. Repo evidence is `src/data/resources/batch-007.ts`.

| Resource | Finding | Evidence/source |
| --- | --- | --- |
| first-epss | NON-BLOCKING: `longDescription` credits only "a special interest group at FIRST" | www.first.org/epss/: "EPSS is maintained by the EPSS Special Interest Group at FIRST. Scores are generated by Empirical Security." (slice B) |
| nws-api | NON-BLOCKING: limitation "Coverage is the United States" omits territories and marine zones | GET api.weather.gov/alerts/active/count returned 200; its regions include the marine zones AT, GM, PA and PI, and its areas include GU (slice B) |
| data-gov-sg-api | NON-BLOCKING: published limits are being tuned | guide.data.gov.sg/developer-guide/api-rate-limits: "We are currently fine-tuning these rate limits." (slice B) |
| ripestat | NON-BLOCKING: `officialUrl` `https://stat.ripe.net/docs/data_api` redirects | Returned 200 after a redirect to `https://stat.ripe.net/docs/data-api/ripestat-data-api` (slice B) |
| google-cloud-shell | NON-BLOCKING: `officialUrl` `https://cloud.google.com/shell` redirects; no `pricingUrl` | It redirects to `https://docs.cloud.google.com/shell/docs`, a documentation landing page. `https://cloud.google.com/shell/pricing` exists ("Cloud Shell is free for users with a Google Cloud account.") but is not set as `pricingUrl` (slice D) |
| mistral-api | NON-BLOCKING: `officialUrl` is the corporate homepage; `longDescription` says "La Plateforme" | `officialUrl: "https://mistral.ai/"` in the entry. The API documentation is at docs.mistral.ai ("Activate Studio in Free mode and generate your first API key"), which now uses the name "Studio" (slice C, C1). The notes record no fetch of the homepage itself, so no redirect or response is claimed for it. |
| ntfy | NON-BLOCKING: one `license` value (`Apache-2.0 OR GPL-2.0`) covers the server only, while the entry lists `ANDROID` and `IOS` | GitHub shows ntfy-android as "Apache-2.0 license" and ntfy-ios as "MIT license" (slice D) |
| github-pages | NON-BLOCKING: a restriction is listed as a feature | `features` includes "One user or organisation site per account" (slice D, C7) |
| backblaze-b2 | REQUIRES MANUAL REVIEW: free API-call terms are stated for pay-as-you-go customers | backblaze.com/cloud-storage/pricing: "Class A, B, and C API calls are free for pay-as-you-go customers." Whether an account with no payment method on file gets the same terms was not established (slice D, C7) |
| rdap-org | NON-BLOCKING: IANA-only coverage not stated | about.rdap.org: "RDAP.org only knows about RDAP servers that are registered with IANA" (slice E) |
| webpagetest | REQUIRES MANUAL REVIEW: `officialUrl` is behind a bot challenge | webpagetest.org returned HTTP 403 "Security Verification" (© Catchpoint Systems), as the entry's `compilationNotes` already says (slice E, E-WPT-1) |
| nu-html-checker | NON-BLOCKING: limitation "No rate limit is published for the W3C instance" leaves out the reasonable-use request | validator/validator GitHub wiki "Service » HTTP interface": "Please use the Web service API reasonably. See the Terms of Service" (slice E, E-NU-4). The ToS page itself was not read. |
| explainshell | REQUIRES MANUAL REVIEW: LLM extraction mode | The raw README documents an LLM extraction mode for man pages (`python -m explainshell.manager extract --mode llm:…`). Whether the live database's option mapping is LLM-derived is not established (slice F, F-06) |
| brasilapi | NON-BLOCKING: weak `relatedResources` | `relatedResources` contains only `data-gouv-fr-api-catalogue` (slice B) |
| cisa-kev | NON-BLOCKING: no `licenseUrl` | The entry has no `licenseUrl`; `https://www.cisa.gov/sites/default/files/licenses/kev/license.txt` returned 200: "The KEV database is distributed under the Creative Commons 0 1.0 License" (slice B; C4) |
| mitre-attack | NON-BLOCKING: primary category `research` | `category: "research"`; `src/config/categories.ts` defines research as "Finding papers, managing citations and organising sources." The catalog already files data portals there, so the entry follows precedent (slice B, H3) |

### No findings

These 28 entries had no BLOCKING, NON-BLOCKING or REQUIRES MANUAL REVIEW data item after all checks (some still appear in the unranked quality groupings or catalog-convention notes below): frankfurter, gutendex, ror-api, met-norway-api, openfreemap, cloudflare-workers-ai, duckdb, apache-age, pgvector, webhook-site, github-codespaces, hurl, schemathesis, wiremock, lighthouse, syft, dependency-track, yq, miller, devdocs, learn-x-in-y-minutes, free-programming-books, rfc-editor, ostep, missing-semester, prometheus, scrcpy, wokwi.

## Overall findings

- All 151 entries are real, reachable resources from identifiable operators. On the evidence gathered, none is fake, dead, a duplicate of an existing entry, or a time-limited trial presented as free. No entry is recommended for removal.
- Structured verification integrity holds for all 151: every entry is `UNVERIFIED`, no verifier, date, source or check exists, and all 604 tri-state values are `unknown`.
- No existing resource was modified. Entries 0–725 are field-for-field identical before and after.
- Two BLOCKING items, both about how verification state is presented, not about whether the resources belong:
  - B1: the PR's own report says descriptions no longer state key, sign-up or commercial-use claims as facts; 15 entries still do.
  - B2: one `compilationNotes` carries a dated observation, which two repo files say that field must not carry.
- The PR report's claim that `licenseNotes` explains the hosted/code split in each of 19 entries is wrong for 9 of them. All slice audits rated this NON-BLOCKING, and it stays NON-BLOCKING: the structured fields follow the stated convention, and the gap is in notes and the report text.
- REQUIRES MANUAL REVIEW items fall into a few groups: free-status conventions a maintainer has to set (hosted service with published code; "Lite" editions; non-commercial data licences; open core), the eight bare GPL-family identifiers plus openrouteservice's conflicting licence files, and provider pages that could not be read by script today.
- NON-BLOCKING items are mostly `apiAvailable`/`downloadAvailable` under-claims, missing practical limitations, stale or redirecting URLs, licence-note gaps, and weak subcategory placements forced by missing categories.
- Process: the content is merged into a stacked branch only (see "Separate cleanup items").

### Contradictions between notes, and how they were resolved

| Topic | Notes disagree | Resolution |
| --- | --- | --- |
| uptimerobot commercial-use sentence | Slice F: BLOCKING. Cross-cutting: MEDIUM wording issue across 15+ entries | The sentence is one of 15 batch statements of the same kind. The existing catalog already carries similar prose (for example `font-squirrel` "licensed for commercial and personal work", `svg-repo`, `undraw`, `jitsi-meet` "no account registration required", `nasa-power` "without an account"), and the structured field stays `unknown`. So the prose alone is handled as a batch-wide wording fix. What is BLOCKING is that the PR's verification report states this was already done (B1). uptimerobot is named in B1. |
| gutendex | Cross-cutting: hosted-first `OPEN_SOURCE` and wrapper-like. Slice A: OK | Slice A's evidence is specific: the README says "Gutendex is a simple, self-hosted web API" and "You should run your own server", and "Project Gutenberg has no such public API of its own". Identity is the software, so `OPEN_SOURCE` follows the batch rule, and it is not a thin wrapper. No finding. |
| devdocs | Cross-cutting: hosted-first `OPEN_SOURCE`. Slice F: OK | The entry lists `SELF_HOSTED`, and the README documents Docker images (`ghcr.io/freecodecamp/devdocs`). Software identity is defensible. No finding. |
| overpass-api and shellcheck licence | Slices C and E: resolvable as `-or-later` from a source header (NON-BLOCKING). Slice B: still REQUIRES MANUAL REVIEW | One sampled header per project is strong evidence, not a project-wide statement. Kept as REQUIRES MANUAL REVIEW, with the evidence recorded, so no interpretation is invented. |
| openrouteservice licence | Slice C: REQUIRES MANUAL REVIEW, "resolve before merge" | Kept as REQUIRES MANUAL REVIEW, because the brief says unresolved licence interpretation is marked that way. It is listed first among the licence items for maintainers. |
| data-gouv-fr-api-catalogue dated note | Slice B: NON-BLOCKING. Cross-cutting: REQUIRES MANUAL REVIEW (policy call) | Not a policy call: `docs/verification.md` says compilation notes carry "no date", and `src/types/resource.ts` says the field "carries no date that could be mistaken for a check". Classed BLOCKING (B2); the fix is one sentence. |
| github-pages status | Slice D: NON-BLOCKING. Cross-cutting: REQUIRES MANUAL REVIEW | A status change is a maintainer decision. REQUIRES MANUAL REVIEW. |
| cohere-api status | Cross-cutting: TRIAL-like, REQUIRES MANUAL REVIEW. Slice C: OK on the repo definitions | Slice C checked CONTRIBUTING: `TRIAL` means "Free access expires", and no expiry was stated on three provider pages (cohere.com/pricing, docs.cohere.com/docs/rate-limits and docs.cohere.com/docs/how-does-cohere-pricing-work; slice C, §17 C2). `PERSONAL_FREE` fits. No status finding; the naming note stays. |
| hosted-with-code convention | Slices A and E: NON-BLOCKING. Cross-cutting: REQUIRES MANUAL REVIEW | It needs one maintainer rule before any data changes. REQUIRES MANUAL REVIEW. |

## Free-status findings

Definitions used: `src/config/free-status.ts` and CONTRIBUTING.md. `FREE` = usable in full without payment; `FREE_TIER` = a permanent free plan with limits and paid plans above it; `PERSONAL_FREE` = full use free for personal or non-commercial purposes; `TRIAL` = free access expires. Statuses were not changed.

### REQUIRES MANUAL REVIEW

| Topic | Resources | Evidence | Decision needed |
| --- | --- | --- | --- |
| Hosted service with published code | endoflife-date, overpass-api, nu-html-checker, dnsviz, zonemaster, explainshell, shields-io, appwrite, glitchtip | The `batch-007.ts` header says free status describes "the service people use" and `openSource`/`license` describe the code. These nine are `OPEN_SOURCE` although their listing is a public instance, or (appwrite, glitchtip) their only limitations describe a hosted free plan. Comparable kroki, smee-io, internet-nl, mozilla-http-observatory, wttr-in and rdap-org are `FREE` with `openSource: true`. The existing catalog is mixed (`open-meteo` FREE, `supabase` FREE_TIER, `open-elevation` OPEN_SOURCE). | One written rule, then apply it |
| Free "Lite" editions of paid data | ipinfo-lite (`FREE_TIER`), db-ip-lite (`FREE`); possibly unpaywall | ipinfo.io/developers/lite-api: "The IPinfo Lite API is our free-tier API access plan … no daily or monthly limit". ipinfo.io/pricing: "IPinfo Lite $0/mo Free forever · no credit card", with paid Core ($26/mo), Max ($163/mo) and Enterprise above it (both slice A). db-ip.com/db/lite.php calls Lite "subsets of the commercial databases". Same situation, different status. | One rule for both |
| GitHub Pages | github-pages (`FREE`) | docs.github.com (…/what-is-github-pages): Pages is available "in public repositories with GitHub Free … and in public and private repositories with GitHub Pro, GitHub Team…"; commercial SaaS and e-commerce use not allowed (…/github-pages-limits: "not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site … or providing commercial software as a service (SaaS)"; slice D, H3). A paid plan sits above it, which matches `FREE_TIER` (as for `github-actions`, `cloudflare-pages`). | Reclassify or record why not |
| Non-commercial data licences and permission models | cloudflare-radar, ripestat, ripe-atlas (`PERSONAL_FREE`); semantic-scholar-api, postcodes-io (`FREE`) | Radar API data is CC BY-NC 4.0 (developers.cloudflare.com/radar/: "Data available via Radar API endpoints is made available under the CC BY-NC 4.0 license.") and no paid data licence was found (slice B, H7), yet the PERSONAL_FREE caveat says "A paid licence is typically required for commercial or work use" (`src/config/free-status.ts`, `caveat`). RIPEstat requires written permission (RIPEstat service terms and conditions, `ripe.net/…/ripestat-service-terms-and-conditions/` §3.3: "Use … for commercial purposes … is not allowed unless permission to do so is granted in writing."; slice B) and RIPE Atlas prior permission for commercial use (RIPE Atlas service terms and conditions, `ripe.net/…/ripe-atlas-service-terms-and-conditions/` §4.5: "Any commercial use of the RIPE Atlas Data is subject to prior permission by the RIPE NCC."; slice B). Semantic Scholar data can be CC BY-NC per its licence agreement (www.semanticscholar.org/product/api/license: "Licensee's use of S2 Data accessed via the API are separately governed by the licenses … such as CC BY-NC or ODC-BY"; slice A, A-11b). postcodes.io (postcodes.io/docs/licences/): "Commercial use requires a licence from NI Land & Property Services" for BT postcodes (slice C, §11 C2). | Decide whether licence-level or permission-based restrictions change the status, and apply it to all five |
| Trial-like components | ripe-atlas, aikosh, mistral-api | RIPE Atlas (atlas.ripe.net/docs/getting-started/credits): "New users can claim a one-time grant of 50,000 free credits"; ongoing credits need a probe, sponsorship or membership (same page: earn credits "by hosting a RIPE Atlas probe, being a RIPE Atlas sponsor, being a RIPE NCC member ('Monthly Free Credits') … or through a transfer"; slice B). AIKosh (aikosh.indiaai.gov.in homepage, Notebooks section): "Free 4 Hours of GPU Access" with no stated period; Advance GPU "Requires Approval" (slice B). Mistral: free mode is the default (docs.mistral.ai/admin/billing-usage/subscriptions.md: "Free mode is the default state for new accounts") with "included monthly usage" (docs.mistral.ai/admin/billing-usage/usage-limits.md: "Free mode lets you create API keys and use included monthly usage within the limits shown on the Limits page"), now shown as "$10 /mo in API credits" (mistral.ai/pricing: "Test Mistral models in Studio. $10 /mo in API credits."); the "evaluation and prototyping" and training statements were not found today (mistral.ai/pricing now says "Test Mistral models in Studio"; slice C, §16 C2 and C8). | Establish periods and terms; the platform-level statuses are otherwise supported |
| Open-core rule | authentik | `authentik/enterprise/LICENSE`: the EE code "may only be used in production, if you … have a valid authentik Enterprise Edition subscription". The PR deferred Infisical, SigNoz, SuperTokens, Tabby and Weaviate for "separately licensed enterprise code in the repository" (deferral table in `docs/verification/developer-resource-expansion-001.md`; slice D, H1). | Accept with disclosure (and revisit the five) or defer authentik |
| `openSource: false` with an MIT repository | nager-date | Repo LICENSE is MIT (raw.githubusercontent.com/nager/Nager.Date/HEAD/LICENSE: "The MIT License (MIT) Copyright (c) 2016 nager.at") and the site says "Nager.Date is open-source" (site footer); the README (raw.githubusercontent.com/nager/Nager.Date/HEAD/README.md) says the NuGet and Docker builds "require a license key" from sponsorship ("Both options require a license key. As a sponsor of nager, you get a license key."; slice A, A-04b). | Record the code licence and the key split |

### NON-BLOCKING

- ecosyste-ms: `compilationNotes` says "commercial use restricted by the share-alike licence". CC BY-SA 4.0 does not prohibit commercial use; the provider sells "less restrictive licences" (ecosyste.ms/commercial).
- openaq, peeringdb, neocities: hosted services whose code is published, but the entries leave `openSource` unset (so `entry()` in `batch-007.ts` sets it to `false` for a non-`OPEN_SOURCE` status) and set no `sourceUrl`. Sources:
  - openaq: github.com/openaq/openaq-api returned 200 and shows "MIT license" (slice B).
  - peeringdb: github.com/peeringdb/peeringdb: "The source code powering PeeringDB is publicly available under a BSD 2-Clause license"; the raw LICENSE is BSD 2-Clause (slice B).
  - neocities: github.com/neocities/neocities: "Neocities.org - the web site. Yep, the backend is open source!"; `LICENSE.txt` begins "Copyright (c) 2013, Kyle Drake … Redistribution and use in source and binary forms … are permitted provided that…", a BSD-style text. Only the head was read, so the SPDX identifier is unconfirmed (slice D).
- Labels and conditions not represented (sources in the "Practical restrictions missing" table under "Limitation findings" for glitchtip, can-i-use and brevo):
  - glitchtip: "Free For Personal Projects" (glitchtip.com/pricing).
  - uptimerobot: "Good for hobby and non-profit projects. No credit card required!" (uptimerobot.com/pricing/), while uptimerobot.com/terms/ says "UptimeRobot is available for any use, including commercial and business use" (slice F, F-01 and F-03).
  - can-i-use: ads with paid ad removal (caniuse.com).
  - brevo: "No Brevo logo" is listed as a paid Starter feature (brevo.com/pricing/).
- mistral-api: add the monthly-credit form of the free allowance (mistral.ai/pricing: "$10 /mo in API credits"; slice C, §16 C2). cohere-api: the name says "evaluation key" (`name: "Cohere API (evaluation key)"` in `batch-007.ts`) while the pricing FAQ says "Trial API key" (cohere.com/pricing FAQ: "When an account is created, we automatically create an Trial API key"; slice C, §17 C1).

### Confirmed against provider pages today

openaq `FREE_TIER` (paid custom tier above), abuse-ch, nager-date, orcid-public-api, abuseipdb and wokwi `PERSONAL_FREE` (terms restrict free use to non-commercial work), al-quran-cloud `FREE` (commercial reproduction allowed with acknowledgement), peeringdb `FREE` (restriction is by purpose, not commercial status), ecosyste-ms, groq, openrouter, cloudflare-workers-ai, webpagetest, geoapify, mongodb-atlas, backblaze-b2, github-codespaces and healthchecks-io `FREE_TIER`, google-cloud-shell `FREE` ("free for users with a Google Cloud account", no paid tier). aladhan-api `FREE` is inferred: the keyless call works and no pricing exists, but no explicit "free" sentence was found.

Pages behind these confirmations, as recorded in the slice notes: openaq docs.openaq.org/using-the-api/rate-limits ("Custom use: Contact us for pricing"); abuse-ch abuse.ch/terms-of-use/ §3.1 and §4; nager-date nagerholidays.com/legal/termsofservice ("The Web API can be used for private or non-profit projects. For commercial purposes we require active sponsorship."); orcid-public-api info.orcid.org/ufaqs/what-are-the-api-limits/ ("the ORCID Public API is free for non-commercial use by individuals") and info.orcid.org/public-client-terms-of-service/; abuseipdb www.abuseipdb.com/legal ("You may not use Free plans for commercial purposes"); wokwi wokwi.com/legal/terms ("You may use the Service for your personal non-commercial purposes only"); al-quran-cloud alquran.cloud/terms-and-conditions; peeringdb www.peeringdb.com/aup; ecosyste-ms ecosyste.ms/pricing; groq console.groq.com/docs/billing-faqs ("you can downgrade to the Free tier at any time"); openrouter openrouter.ai/docs/api_reference/limits; cloudflare-workers-ai developers.cloudflare.com/workers-ai/platform/pricing/ ("included in both the Free and Paid Workers plans"); webpagetest logicmonitor.com/pricing/web-performance-optimization ("Free Starter Plan … $0"); geoapify geoapify.com/pricing/ ("3,000 credits / day"); mongodb-atlas www.mongodb.com/pricing ("Free forever"); backblaze-b2 www.backblaze.com/cloud-storage/pricing ("First 10GB storage is always free"); github-codespaces docs.github.com/en/billing/concepts/product-billing/github-codespaces ("GitHub Free for personal accounts 15 GB-month 120 hrs"); healthchecks-io healthchecks.io/pricing/ ("Hobbyist $0 / month"); google-cloud-shell cloud.google.com/shell/pricing; aladhan-api aladhan.com/prayer-times-api and GET api.aladhan.com/v1/timingsByCity (slices A to F).

## License findings

The audits did not assume that a GitHub repository means open source, that source-available means permissive, or that a free download allows commercial use. Example: webpagetest's master branch is Polyform Shield 1.0.0 (source-available), and the entry correctly keeps `openSource: false`. Every other `OPEN_SOURCE` or `openSource: true` licence value matched the official licence file, except where listed below. The OSI claim in the PR report holds: every `OPEN_SOURCE` licence value is an OSI licence family.

### The eight bare GPL-family identifiers: REQUIRES MANUAL REVIEW

| Resource | Recorded | Evidence found today | Status |
| --- | --- | --- | --- |
| openrouteservice | `GPL-3.0` | `NOTICE.md`: "The source code of OpenRouteService is licensed under the Apache license, Version 2.0" (re-fetched by this aggregation from raw.githubusercontent.com, 2026-10-02). The repo ships `LICENSE` (GPLv3 text) and `LICENSE.LESSER` (LGPLv3 text). Sampled Java headers (`RouteLeg.java`, `AvoidFeatureFlags.java`): LGPL "version 2.1 … or (at your option) any later version". | The licence family is unresolved, not only "only vs or later". The recorded `GPL-3.0` is not supported by these files. Resolve with HeiGIT or record the conflict before this licence is shown. |
| ecosyste-ms | `AGPL-3.0` | `LICENSE` is plain AGPL v3 text; README "GNU Affero License" (no version); site footer "AGPL-3". `sourceUrl` is only the `packages` repo. | No statement either way |
| overpass-api | `AGPL-3.0` | `src/overpass_api/core/datatypes.h`: "either version 3 of the License, or (at your option) any later version". One file sampled. | Evidence for `AGPL-3.0-or-later`; confirm project-wide |
| shellcheck | `GPL-3.0` | `src/ShellCheck/Analyzer.hs`: "either version 3 of the License, or (at your option) any later version"; `ShellCheck.cabal` "License: GPL-3". One file sampled. | Evidence for `GPL-3.0-or-later`; confirm |
| explainshell | `GPL-3.0` | `LICENSE` is verbatim GPLv3; README "licensed under GPLv3"; `matcher.py` has no header; no `setup.py`/`pyproject.toml`. | No statement either way. GPLv3 §14 is not used to infer a variant. |
| cron-job-org | `GPL-2.0` | `chronos/App.cpp`, `chronos/CurlWorker.cpp`: "either version 2 of the License, or (at your option) any later version". `api/index.php` and `frontend/src/index.js` have no notice. | Daemon points to `GPL-2.0-or-later`; other components unstated |
| testssl-sh | `GPL-2.0` | Script header: "License: GPLv2 … Redistribution + modification under this license permitted", with no "or later". Bundled SSL Labs client-simulation data: "Qualys SSL Labs Terms of Use (v2.2) … CC BY 3.0 US". | Header leans to `GPL-2.0-only` (maintainer call); bundled-data licence should go in `licenseNotes` |
| semgrep | `LGPL-2.1` | LICENSE is LGPL v2.1 text; README "License (LGPL-2.1)"; sampled `Main.ml` disclaims copyright; docs.semgrep.dev/licensing gives no variant. | No statement either way |

### Other licence findings

| Class | Resource | Problem | Evidence |
| --- | --- | --- | --- |
| REQUIRES MANUAL REVIEW | ntfy | `Apache-2.0 OR GPL-2.0`: the README says "dual licensed under the Apache License 2.0 and the GPLv2 License"; `OR` is a reading of that. `LICENSE.GPLv2`'s filled-in appendix says "version 2 … or (at your option) any later version". | README; `LICENSE.GPLv2` |
| REQUIRES MANUAL REVIEW | mosip | `licenseNotes` sub-claims "Inji wallet … MIT" and "Documentation is CC BY 4.0" were not checked. MPL-2.0 primary and MIT secondary are confirmed. | docs.mosip.io/…/license |
| REQUIRES MANUAL REVIEW | usgs-earthquake-api | "Public domain (US Government work)" could not be read on usgs.gov (HTTP 202 bot check). | usgs.gov copyrights page (www.usgs.gov/information-policies-and-instructions/copyrights-and-credits: HTTP 202, "JavaScript is disabled … verify that you're not a robot"; slice A) |
| NON-BLOCKING | nominatim | `GPL-2.0` is ambiguous; `lib-sql/functions.sql` has `SPDX-License-Identifier: GPL-2.0-only` and the repo has `LICENSES/GPL-2.0-only.txt`. Apache-2.0 (osm2pgsql Lua config) is missing from `license`. `licenseUrl` points to the OSMF usage policy. | `lib-sql/functions.sql` SPDX header; `LICENSES/GPL-2.0-only.txt`; the README lists Apache-2.0 for the osm2pgsql Lua config (slice C, §1) |
| NON-BLOCKING | dnsviz | `GPL-2.0-or-later` is supported by `setup.py` ("GNU General Public License v2 or later (GPLv2+)"), but no `licenseNotes` records the basis. | raw `setup.py` |
| NON-BLOCKING | testcontainers | `MIT` holds for Java, Go, Node, .NET and Rust; testcontainers-python is Apache-2.0 (`LICENSE.txt`). | LICENSE files of testcontainers-go, -node, -dotnet and -rs (MIT) and testcontainers-python `LICENSE.txt` (Apache 2.0) (slice E, E-TC-2) |
| NON-BLOCKING | shields-io | `MIT / Apache-2.0` is not an SPDX expression; `package.json` has `(MIT OR Apache-2.0)`. | `package.json` |
| NON-BLOCKING | entur-apis | `NLOD` has no version; the Entur terms link NLOD 2.0 (`met-norway-api` records `NLOD-2.0 / CC-BY-4.0`). | developer.entur.no/terms-of-service |
| NON-BLOCKING | llamafile, ocrmypdf, docling | No `licenseNotes` for MIT llama.cpp/whisper.cpp changes (llamafile), the AGPLv3 Docker web wrapper (ocrmypdf), or model licences differing from the MIT code (docling). | github.com/mozilla-ai/llamafile README: "our changes to llama.cpp and whisper.cpp are licensed under MIT"; ocrmypdf.readthedocs.io/en/latest/docker.html: "Unlike the rest of OCRmyPDF, this web service is licensed under the Affero GPLv3"; docling raw README: "For individual model usage, please refer to the model licenses found in the original packages" (slice C) |
| NON-BLOCKING | internet-nl | `licenseNotes` says "site content" is CC BY 4.0; the README limits CC BY 4.0 to files under `/translations`. | Raw Internet.nl README: "licensed under the Apache License, Version 2.0 … files under the `/translations` folder are licensed under … CC BY 4.0" (slice E, E-INL-1) |
| NON-BLOCKING | osv-dev, measurement-lab, nvd-api, ecb-data-portal-api | osv-dev sources include CC-BY-SA, MIT, BSD and Apache-2.0, not only CC BY/CC0. measurement-lab: CC0 data vs CC BY-NC-SA 4.0 site material. nvd-api: CVE record text comes from the CVE Program and CNAs. ECB: the ESCB policy says statistics must not be modified; the disclaimer allows stated modification; no `licenseUrl`. | https://google.github.io/osv.dev/data/ lists per-source licences including "Ubuntu CC-BY-SA 4.0", "Drupal MIT", "Rocky Linux BSD" and "Bitnami Apache 2.0". measurementlab.net footer: "All original material on Measurement Lab is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 4.0 International License." NVD API response carries `sourceIdentifier` values such as `security@apache.org`. ECB: the ESCB reuse policy (`usage_policy.en.html`) requires that "the statistics (including metadata) are not modified"; the ECB disclaimer says "If the information is modified … this must be stated explicitly" (all slice B) |
| NON-BLOCKING | beejs-guides | `licenseNotes` says the other guides "were not checked"; the Guide to C uses the same CC BY-NC-ND 3.0 terms. | beej.us/guide/bgc/html/ |
| NON-BLOCKING | mitre-attack | The `license` string "MITRE ATT&CK Terms of Use (royalty-free, including commercial use)" embeds a commercial-use statement; it matches the terms ("research, development, and commercial purposes") but would sit better in `licenseNotes`. | attack.mitre.org terms of use (attack.mitre.org/resources/legal-and-branding/terms-of-use/: "royalty-free license to use ATT&CK® for research, development, and commercial purposes"; slice B) |
| NON-BLOCKING | PR report | §Licensing counts "MIT 28, Apache-2.0 23, BSD-3-Clause 7, MPL-2.0 5" are counts across all 151, not among the 59 `OPEN_SOURCE` entries (MIT 18, Apache-2.0 20, BSD-3-Clause 5, MPL-2.0 4). | cross-cutting §7 D1 |

## Duplicate findings

**No duplicates.** Scripted comparison of all 151 against the 726 existing entries and each other, keyed on normalised name, slug, canonical `officialUrl` and `sourceUrl`, any URL, registrable domain, GitHub/GitLab owner and repo, and name/slug containment: 0 collisions involving batch 007. Every batch-007 `relatedResources` slug resolves, none points to itself, and no batch-007 slug collides with an existing slug.

Shared domains or owners, all distinct products and kept:

- `apache-age` with `apache-netbeans`, `apache-superset`; `cloudflare-radar` and `cloudflare-workers-ai` with `cloudflare`, `cloudflare-pages`; `chembl` with `pdbe`, `alphafold-protein-structure-database` (ebi.ac.uk).
- `google-cloud-shell` with nine `google.com` entries; `missing-semester` with `mit-opencourseware`, `scratch`, `mit-app-inventor`; `mozilla-http-observatory` with `mdn-web-docs`, `mozilla-common-voice`.
- `ripestat` with `ripe-atlas`; `usgs-earthquake-api` with `usgs-earthexplorer`; `github-codespaces` and `github-pages` with `github`, `github-actions`, `github-copilot-free`; `devdocs` with `freecodecamp`; `osv-dev` with `google-fonts`.

Near-match judgements (all kept):

| Pair | Judgement |
| --- | --- |
| github-pages, github-codespaces vs `github` | Sub-products with their own terms; follows the `github-actions` and `cloudflare-pages` precedent |
| llamafile vs `llama-cpp` | Built on llama.cpp; separate project |
| gutendex vs `project-gutenberg` | Separate API over Gutenberg metadata; Gutenberg has no public JSON API of its own |
| europe-pmc-api vs `pubmed-central` | Different operator (EMBL-EBI vs NIH/NLM); existing entry is a website with `apiAvailable: false` |
| ban-geocoding vs data-gouv-fr-api-catalogue | One API inside a catalogue; different types |
| frankfurter vs ecb-data-portal-api | Multi-source aggregator vs ECB's own SDMX API |
| photon vs nominatim; osrm vs valhalla vs openrouteservice | Complementary or alternative software, not identities |
| glitchtip vs `sentry`; uptimerobot vs `uptime-kuma`; appwrite/pocketbase vs `supabase`/`firebase` | Alternatives; separate vendors and codebases |
| abuseipdb vs abuse-ch | Different operators and datasets |
| name-only matches (`glitchtip`/`glitch`, `astropy`/`astro`, `nvd-api`/`nvda`, `micropython`/`python`, `internet-nl`/`inter-font`) | Unrelated or separate implementations |
| the four meta-lists | No meta-list duplicate in the existing catalog |

Identity issues (NON-BLOCKING):

- testcontainers: `officialUrl` redirects to the multi-language testcontainers.com, while `longDescription` and `sourceUrl` cover Java only (`https://testcontainers.org/` returns 200 after redirecting to `https://testcontainers.com/`, which lists Java, Go, .NET, Node.js, Python, Rust and other languages; slice E, H5 and E-TC-1).
- semgrep: `officialUrl` `semgrep.dev` is the commercial AppSec Platform ("Book demo", "Try for free"); the listing is the LGPL Community Edition engine (docs.semgrep.dev/licensing: "The Semgrep CE engine is an open source project licensed under LGPL 2.1"; slice E, E-SEM-1 and H1).
- photon: `officialUrl` is komoot's demo instance; the type and status describe the software (photon.komoot.io: "please be fair - extensive usage will be throttled", the demo instance; github.com/komoot/photon: the Apache-2.0 software; slice C, §2 C1).
- protomaps-pmtiles: one entry spans the PMTiles format and tools (BSD-3/CC0), the basemap (separate repo, ODbL data) and the hosted API (key required, free for non-commercial use). Sources: protomaps.com/api ("The hosted API requires an API key"; "free for non-commercial use"); protomaps.com/about ("a demo API with a soft limit of 1,000,000 tile requests per month. Commercial use of this API requires becoming a GitHub Sponsor"); docs.protomaps.com/pmtiles/ for the format, and the github.com/protomaps/PMTiles `LICENSE` (BSD-3 for the reference implementations; the spec is public domain or CC0); docs.protomaps.com/basemaps/downloads for the basemap (ODbL Produced Work; generation lives in `github.com/protomaps/basemaps`) (slice C, §8 C1).
- paddleocr: `paddleocr.com` meta-refreshes to Baidu AI Studio's hosted service page (`https://aistudio.baidu.com/paddleocr`); docs live at `paddleocr.ai` (the `paddlepaddle.github.io/PaddleOCR/.../installation.html` redirect lands on `http://www.paddleocr.ai/...`; slice C, §20 C1).
- llamafile: `github.com/Mozilla-Ocho/llamafile` redirects to `github.com/mozilla-ai/llamafile`; no `sourceUrl` (slice C, §18 C1).
- ecosyste-ms (`sourceUrl` is one service repo; the ecosyste.ms homepage lists Packages, Repositories, Advisories, Timeline and other services; slice B), mosip (`sourceUrl` is an organisation), awesome-selfhosted (canonical data lives in `awesome-selfhosted-data`; the repo's commit feed reads "[bot] build markdown from awesome-selfhosted-data …"; slice F, F-23).
- openml: the `sourceUrl` repo `openml/OpenML` is maintenance-only. Its README (raw.githubusercontent.com, fetched 2026-10-02, slice A): "This repository is in maintenance-only mode. We're phasing out the PHP-based REST API in favor of a much more modern FastAPI-based API (github.com/openml/server-api)". Point `sourceUrl` at the current repository or note the transition.
- ban-geocoding and data-gouv-fr-api-catalogue: names use retired brands ("API Adresse BAN" is now the Géoplateforme geocoding service; api.gouv.fr 301-redirects to data.gouv.fr/dataservices). Sources: adresse.data.gouv.fr/outils/api-doc/adresse: "L'API Adresse BAN est dépréciée et intégrée dans le nouveau Service de géocodage de la Géoplateforme" (slice C, §12 C1); `https://api.gouv.fr/` → 301 to `https://www.data.gouv.fr/dataservices` (slice B).
- nu-html-checker: the URL is W3C's hosted instance; the code is the validator/validator project (`validator.w3.org/nu/`, `/nu/about.html` and `validator.w3.org/` returned HTTP 403, a Cloudflare challenge; the project's own docs are at validator.github.io/validator/; slice E, H3 and E-NU-1).

Editorial identity questions (REQUIRES MANUAL REVIEW): gitleaks' README says it "is feature complete … security patches only" and the author now develops Betterleaks (raw README: "I'm shifting my focus to Betterleaks"; github.com/betterleaks/betterleaks: "maintained by the folks who made Gitleaks, including the original author"; slice E, E-GL-1); Opengrep is an active LGPL fork of Semgrep CE created after features moved behind a commercial licence (opengrep.dev: "a fork of Semgrep CE … in response to recent changes by Semgrep … removing critical features of the scanning engine behind a commercial license"; slice E, H1 and E-SEM-4). Whether either belongs in the catalog is a maintainer decision. No entries were created.

## API findings

- **Live today.** One harmless keyless GET per service returned 200 for wttr-in, usgs-earthquake-api, frankfurter, nager-date, gutendex, jsonplaceholder, random-user-generator, endoflife-date, orcid-public-api, datacite-rest-api, opencitations, europe-pmc-api (EBI host), ror-api, chembl, openml, openfda, clinicaltrials-gov-api, nvd-api, first-epss, osv-dev, deps-dev, ecosyste-ms, mitre-attack (TAXII), circl-hashlookup, nws-api, met-norway-api, ecb-data-portal-api, data-police-uk, data-gov-sg-api, data-gouv-fr-api-catalogue, brasilapi, entur-apis, aladhan-api, al-quran-cloud, ripestat, peeringdb, ripe-atlas, nominatim, photon, overpass-api, openfreemap, postcodes-io and ban-geocoding (Géoplateforme). The semantic-scholar-api and unpaywall endpoints answered (404 for an unindexed DOI; 422 "Email address required"), which confirms the services and the email rule.
- **Key-gated as documented.** abuse-ch (URLhaus) and openaq returned 401 without a key.
- **Not called.** Keyed APIs (openrouteservice, geoapify, openrouter, cloudflare-workers-ai, groq, mistral-api, cohere-api, abuseipdb); sec-edgar-apis (the SEC asks for a declared contact User-Agent, and none was invented); bigdatacloud-reverse-geocoding (its terms forbid server-side calls: bigdatacloud.com/free-api/free-reverse-geocode-to-city-api says the endpoint is "client-side only" and server-side calls may trigger "a temporary IP-level ban"; slice C, §9).

### REQUIRES MANUAL REVIEW

| Resource | Problem | Evidence |
| --- | --- | --- |
| sec-edgar-apis | No provider claim could be read: 10 requests/second, contact User-Agent, no CORS, bulk archives | sec.gov API pages returned 403 "Request Rate Threshold Exceeded" (www.sec.gov/search-filings/edgar-application-programming-interfaces and www.sec.gov/about/developer-resources; slice B) |
| openfda | Provider contradicts itself on keys | Authentication page (open.fda.gov/apis/authentication/; slice A) opens "An API key is required … The key is free of charge", then lists keyless limits; a keyless call worked; `compilationNotes` says "API key optional" |
| europe-pmc-api, unpaywall, clinicaltrials-gov-api, openml | Limitations and terms could not be re-read | 403 Cloudflare challenge (europepmc.org); JS-only shells (unpaywall.org, clinicaltrials.gov, openml.org). Pages: europepmc.org/RestfulWebService, /Copyright and /About; unpaywall.org/products/api, /legal, /products/data-feed and /products/snapshot; clinicaltrials.gov/data-api/api, /data-api/about-api and /about-site/terms-conditions; www.openml.org/ and /terms (slice A) |
| nvd-api | Limitation says keys "may not be shared"; wording not located | Terms page is JS-rendered; not found in the site bundle (nvd.nist.gov/developers/terms-of-use; bundle nvd.nist.gov/main-QN4PLKKZ.js; slice B) |
| aladhan-api | "The specification mentions rate limits but publishes no numbers" | Docs are client-rendered (aladhan.com/prayer-times-api; slice B) |
| groq | "Free-plan limits are shown in the console rather than published" may be out of date | console.groq.com rate-limits page (console.groq.com/docs/rate-limits; slice C, §15) now has a "Free Plan Limits" tab; static extraction cannot tell which table belongs to it |
| openrouteservice | Attribution, CC BY-SA 4.0 on results and Standard-plan commercial terms | account.heigit.org plans and ToS are JS-only; quotas were read from the app bundle only (account.heigit.org/info/plans, account.heigit.org/info/tos and the bundle account.heigit.org/chunk-7SF2PHKW.js; slice C, §6) |
| internet-nl | "Batch API is only for eligible organisations" | API terms v20250118 and batch FAQ give no eligibility criteria (internet.nl/faqs/batch-and-dashboard/ and the API terms of use v20250118; slice E, E-INL-2) |
| aikosh | Registration uses phone OTP; whether non-Indian numbers work is not stated | aikosh FAQ and terms (aikosh.indiaai.gov.in/home/faqs: "Verify your phone number via an OTP"; aikosh.indiaai.gov.in/home/terms-n-conditions; slice B) |
| cloudflare-radar | Website-side claims rest only on developer docs | radar.cloudflare.com/about returned 403 |

### NON-BLOCKING

- `apiAvailable: false` (set by default or explicitly) although a documented API exists. `resource-facts.tsx` only renders "API available" when the flag is true, so these hide a capability rather than claim a false one. llamafile's local API server is a catalog-wide convention question (`llama-cpp` is also `false`).

  | Resource | API evidence (fetched 2026-10-02) |
  | --- | --- |
  | pocketbase | pocketbase.io: "realtime subscriptions and easy to use REST api" (slice D). The entry's own `longDescription` says applications "talk to it through its Web APIs", and `features` lists "Realtime Web APIs". |
  | cron-job-org | cron-job.org/en/: "…applications via a simple REST API" (slice D) |
  | mailpit | mailpit.axllent.org: "multi-platform email testing tool & API for developers" and "REST API Integration testing" (slice D). The entry's `features` list "API for tests". |
  | openfga | The raw README lists "APIs (HTTP & gRPC)" among its highlights and links an "API Reference" at openfga.dev/api/service (re-fetched by this aggregation). openfga.dev describes Zanzibar-style relationship-based access control with a Docker quickstart (slice D, §5.20). |
  | neocities | neocities.org/api: "Use the Neocities API to manage your site", with upload, list, delete and site-info endpoints and an API key (slice D) |
  | openssf-scorecard | Raw README: "Scorecard REST API … api.scorecard.dev" (slice E) |
  | common-crawl | index.commoncrawl.org: "Search the CDX URL index … See the PyWB CDX Server API Reference for more about the query API … Please do not overload the URL index server" (slice A, A-20b) |
  | protomaps-pmtiles | protomaps.com/api: "The hosted API requires an API key" and is "free for non-commercial use" (slice C, §8). The entry's own `limitations` mention "Protomaps' hosted tile API". |
- `downloadAvailable: false` (the `define.ts` default, so an omission rather than a false claim) although official downloads exist:

  | Resource | Download evidence for this resource only (fetched 2026-10-02) |
  | --- | --- |
  | datacite-rest-api | support.datacite.org: the API docs navigation lists "DataCite Public Data File" and "DataCite Monthly Data File"; the Data File Use Policy says "The DataCite Data File includes all DOIs and deposited metadata in our database" under CC0 (slice A, A-13c) |
  | chembl | chembl.gitbook.io/chembl-interface-documentation/downloads: "ChEMBL Database downloads, which includes SQLite, MySQL and PostgreSQL versions … as well as SDF, FASTA", plus RDF (slice A, A-18b) |
  | openfda | open.fda.gov/data/downloads/ returned 200 with dataset download categories (Human Drug, Device, Food and others) (slice A, A-21c) |
  | circl-hashlookup | circl.lu/services/hashlookup/: a Bloom filter (about 700 MB) "updated on a monthly basis"; the entry's own `features` list a "Monthly offline Bloom filter" (slice B) |
  | data-police-uk | data.police.uk/about/ gives the CSV archive at `data.police.uk/data/archive/latest.zip` (slice B) |
- Limits stated inaccurately or incompletely: datacite-rest-api (only page-number paging stops at 10,000; cursor paging is unlimited), first-epss (1,000 requests/minute missing), ecosyste-ms ("some APIs are available only on paid plans" not on the pricing page), data-gov-sg-api (no "description of use" in the key flow), peeringdb (AUP limits use to approved Internet-operational purposes; duplicate-query throttles missing). Sources are in "Limitation findings": the "Stated more strongly than the source" table for datacite-rest-api, ecosyste-ms and data-gov-sg-api, and the "Practical restrictions missing" table for first-epss and peeringdb.
- API vs dataset typing: db-ip-lite and cisa-kev are `DATASET` with `apiAvailable: false` but primary category `apis`.
- openrouter `pricingUrl` redirects (`api-reference` → `api_reference`; `openrouter.ai/docs/api-reference/limits` → `/docs/api_reference/limits`, slice C, §13 C1).

## Developer-tool findings

Activity was read from release pages, Atom feeds and raw files because the GitHub REST API was rate-limited for most steps. Stars were not used.

- **Active.** Releases or commits in 2026 for nearly every tool, including duckdb, apache-age, pocketbase, appwrite, datasette, pgvector, healthchecks-io, smee-io, kroki, ntfy, mailpit, authelia, authentik, openfga, mosip, sops, coolify, act, nominatim, photon, osrm, valhalla, openrouteservice, llamafile, paddleocr, ocrmypdf, docling, hurl, schemathesis, wiremock, lighthouse, nu-html-checker, semgrep, syft, openssf-scorecard, dependency-track, testssl-sh, yq, miller, qsv, shellcheck, prometheus, glitchtip, scrcpy, platformio, node-red, micropython, nakama, rdkit, astropy.
- **Older activity, already disclosed in the entry:** vosk (last tag 2024-04-22, commits continue), ldtk (release 1.5.3 on 2024-01-15, commits in 2026), dnsviz (site in maintenance mode), devdocs (seeking maintainers).
- **Older activity, not disclosed (NON-BLOCKING):** jsonplaceholder (repo last commit 2021-06-14; the live service at jsonplaceholder.typicode.com says "Powered by json-server"), random-user-generator (2022-07-05; live API version matches), gitleaks (README: security patches only), webpagetest (repo last commit 2025-07-14). overpass-api's master last commit is 2024-03-20 and its last tag 2024-11-21; the public instance answered today.
- **Pre-1.0 or unstable APIs (NON-BLOCKING):** pocketbase ("full backward compatibility is not guaranteed before reaching v1.0.0"), datasette (stable JSON API is a 1.0 goal; 1.0 is at alpha 40).
- **Practical requirements missing (NON-BLOCKING):** authelia needs a supported reverse proxy; sops needs a key source (age, PGP or a cloud KMS); act has a documented support matrix, so runner parity is partial; openssf-scorecard needs GitHub authentication; gitleaks-action needs a free licence key for organisation repos; android-studio does not support Windows on ARM; docling needs Python 3.10+. The URL and quote for each are in the "Practical restrictions missing" table under "Limitation findings".
- **Commercial editions not mentioned (NON-BLOCKING):** testcontainers (Cloud/Desktop, free trial, pricing), qsv (qsv pro), nakama (Nakama Enterprise; "Commercial licenses are also available"), semgrep (proprietary AppSec Platform, Code, Secrets and Supply Chain, and the Semgrep Rules License), coolify (Coolify Cloud; optional to mention, since the self-hosted software is the listing). Sources for each are in the same table.
- **Subcategory or category misfits (NON-BLOCKING), mostly forced by missing categories:** kroki in `documents`, brevo in `marketing` (its whyListed and tags are transactional; `resend` sits in `communication`), sops and abuseipdb with `personal`, shields-io with `design`, flutter with `code-editors`, platformio with `science`, node-red with `lifestyle`, awesome-selfhosted as the only primary `open-source` entry, free-for-dev in `hosting`.
- **Confirmed fine:** wokwi in `science` matches existing `simulide` and `falstad-circuit`; security tools in `testing` match existing `owasp-zap` and `trivy`.

## Regional findings

The same evidence standard was applied as for every other entry.

| Region | Resource | Verdict | Evidence (fetched 2026-10-02) | Open item |
| --- | --- | --- | --- | --- |
| India | aikosh | Legitimate, useful | Terms (aikosh.indiaai.gov.in/home/terms-n-conditions): "designed, developed and hosted by the IndiaAI Division under the Ministry of Electronics and Information Technology"; 15,999+ datasets, 355 models (aikosh.indiaai.gov.in homepage: "15999+ Datasets 355 Models") | REQUIRES MANUAL REVIEW: registration from outside India; GPU allowance period |
| India | mosip | Legitimate, useful | mosip.io: "established in 2018 at the International Institute for Information Technology Bangalore"; docs: MPL-2.0 primary licence (docs.mosip.io/1.2.0/license: "The MPL 2.0 is the primary license used across all core MOSIP repositories") | NON-BLOCKING: India-originated but presented by MOSIP as used by many countries; per-country status not established |
| India | vosk | Legitimate, useful for India through language models, not an Indian provider | Models page (alphacephei.com/vosk/models): Hindi, Indian English, Gujarati and Telugu models under Apache 2.0 | NON-BLOCKING: platform list (iOS on request; Windows/macOS wheels omitted). The PR report's "India" row overstates regional coverage. |
| Brazil | brasilapi | Legitimate community project, useful | MIT repo active (2026-08-19; raw `BrasilAPI/BrasilAPI` LICENSE "MIT License" and the repo Atom feed); live CEP lookup (GET `/api/cep/v1/01001000` → 200); self-described beta/experimental (brasilapi.com.br: "Este projeto experimental…"; "Estamos em beta…") | NON-BLOCKING: upstream data terms not stated |
| France | data-gouv-fr-api-catalogue | Legitimate official catalogue (DINUM), useful | api.gouv.fr 301 → data.gouv.fr/dataservices; 1,261 APIs (www.data.gouv.fr/dataservices: "parmi les 1261 API sur data.gouv.fr"); catalogue API returns `access_type` (GET `www.data.gouv.fr/api/1/dataservices/?page_size=1`) | B2 dated note; retired brand in name |
| France | ban-geocoding | Legitimate national service (IGN/DINUM), useful | Live Géoplateforme search (`data.geopf.fr/geocodage/search`); Licence Ouverte 2.0 on data.gouv.fr (data.gouv.fr/datasets/base-adresse-nationale: "Licence Ouverte / Open Licence version 2.0") | NON-BLOCKING: rename; old endpoint scheduled for decommission at the end of January 2026 |
| France | mistral-api | Legitimate, useful; a French-headquartered mainstream LLM vendor, not a regional public resource | docs.mistral.ai: free mode is the default for new accounts (docs.mistral.ai/admin/billing-usage/subscriptions.md: "Free mode is the default state for new accounts") | REQUIRES MANUAL REVIEW: unsourced training and card statements. The PR report's "France" row overstates regional coverage. |
| Norway | met-norway-api | Legitimate, useful (global forecasts) | api.met.no licence (api.met.no/doc/License: NLOD 2.0 and CC BY 4.0) and ToS (api.met.no/doc/TermsOfService); live GET | None |
| Norway | entur-apis | Legitimate, useful | developer.entur.no: open services "Free and available to anyone" (developer.entur.no/docs/open-services); published rate limits (developer.entur.no/docs/open-services/journey-planner/rate-limiting); NLOD (developer.entur.no/terms-of-service) | B1 prose; NLOD version |
| Singapore | data-gov-sg-api | Legitimate, useful | Singapore Open Data Licence v1.0 (data.gov.sg/open-data-licence); published per-key limits (guide.data.gov.sg/developer-guide/api-rate-limits); live GET | NON-BLOCKING wording items |
| UK | data-police-uk | Legitimate, useful | OGL v3.0 (data.police.uk/about/: "licence: Open Government Licence v3.0"); "15 requests per second with a burst of 30" (data.police.uk/docs/api-call-limits/); live GET | NON-BLOCKING: rolling window, partial coverage |
| UK | postcodes-io | Legitimate, useful | MIT code (github.com/ideal-postcodes/postcodes.io `LICENSE`); OS OpenData and ONSPD data licences (postcodes.io/docs/licences/); live lookup | REQUIRES MANUAL REVIEW: NI commercial licence vs `FREE`; NON-BLOCKING: no `licenseNotes` |
| Islamic/Quran | aladhan-api | Legitimate, useful | Credits and terms page (aladhan.com/credits-and-terms); live prayer-times GET | REQUIRES MANUAL REVIEW: rate-limit claim; NON-BLOCKING: accuracy disclaimer |
| Islamic/Quran | al-quran-cloud | Legitimate, useful | Terms (alquran.cloud/terms-and-conditions, updated 14 June 2026): "The API is free and key-less"; commercial reproduction with acknowledgement | NON-BLOCKING: limitation wording; no-alteration rule |

Other regional public infrastructure in the batch: internet-nl (Dutch Internet Standards Platform; internet.nl/about/: "an initiative of the Dutch Internet Standards Platform"), zonemaster (AFNIC and the Swedish Internet Foundation; zonemaster.net: "Copyright © AFNIC and The Swedish Internet Foundation") (slice E).

Future coverage gaps, recorded and not filled. No entries were invented.

- **Africa:** no batch-007 entry. The PR report says openAFRICA (403) and Africa's Talking (pricing unclear) were deferred; those are report claims, not re-fetched here. MOSIP's homepage names several African adopting countries; that is a lead for research, not a basis for entries.
- **Latin America:** brasilapi only, a community project. No Spanish-speaking government API. The PR report deferred IBGE (no data licence established).
- **Southeast Asia:** data-gov-sg-api only. Vosk's Vietnamese and Filipino models are indirect coverage.

## Hidden-resource quality findings

Groupings only. No ranking or scoring is implied, and an entry can sit in more than one group. Obscurity was not a reason to reject, and fame was not a reason to accept.

### Resources with meaningful developer value beyond a listing

| Group | Resources | Why they fit |
| --- | --- | --- |
| Genuinely hidden or underrated | circl-hashlookup, first-epss, rdap-org, zonemaster, dnsviz, internet-nl, smee-io, kroki, cron-job-org, openfreemap, protomaps-pmtiles, apache-age, datasette, explainshell, deps-dev, ecosyste-ms, peeringdb, bigdatacloud-reverse-geocoding | Specific developer jobs (known-file filtering, exploit likelihood, RDAP bootstrap, DNS and mail standards tests, webhook relay, diagram rendering, donation-run cron, keyless tiles, graph queries in PostgreSQL) that are rarely surfaced outside their niche |
| Specialised APIs | nager-date, frankfurter, gutendex, endoflife-date, semantic-scholar-api, europe-pmc-api, opencitations, osv-dev, mitre-attack, abuse-ch, overpass-api, openrouteservice, geoapify, kroki, ipinfo-lite, db-ip-lite, abuseipdb, cloudflare-radar | Each answers one well-defined data question through a documented API or dataset; cloudflare-radar comes from a large vendor but is a specific public internet-measurement product |
| Public infrastructure | ror-api, orcid-public-api, datacite-rest-api, common-crawl, ripestat, ripe-atlas, peeringdb, measurement-lab, nominatim, osrm, overpass-api, rdap-org, rfc-editor, zonemaster, internet-nl, mosip | Run by registries, standards bodies, research infrastructure or non-profits for shared use |
| Scientific | usgs-earthquake-api, chembl, openml, europe-pmc-api, measurement-lab, rdkit, astropy, wokwi | Primary scientific data or domain libraries |
| Government | usgs-earthquake-api, openfda, clinicaltrials-gov-api, nvd-api, cisa-kev, nws-api, sec-edgar-apis, fred-api, ecb-data-portal-api, data-police-uk, data-gov-sg-api, data-gouv-fr-api-catalogue, ban-geocoding, met-norway-api, entur-apis, aikosh | Official primary sources with published terms |
| Security | nvd-api, cisa-kev, first-epss, osv-dev, deps-dev, mitre-attack, circl-hashlookup, abuse-ch, abuseipdb, semgrep, syft, gitleaks, openssf-scorecard, dependency-track, testssl-sh, mozilla-http-observatory, authelia, authentik, openfga, sops | Vulnerability data, supply-chain, secrets, TLS and access-control tooling |
| Useful small open-source projects | wttr-in, frankfurter, gutendex, brasilapi, smee-io, kroki, ntfy, mailpit, pocketbase, act, hurl, schemathesis, miller, qsv, yq, shellcheck, scrcpy, ldtk, micropython, glitchtip, datasette, webhook-site, healthchecks-io | Focused tools with clear scope and published code |
| Regional | aikosh, mosip, vosk, brasilapi, data-gouv-fr-api-catalogue, ban-geocoding, met-norway-api, entur-apis, data-gov-sg-api, data-police-uk, postcodes-io, aladhan-api, al-quran-cloud, internet-nl, zonemaster | See "Regional findings" |
| Niche developer utilities | tldr-pages, explainshell, can-i-use, devdocs, learn-x-in-y-minutes, shields-io, endoflife-date, nu-html-checker, photon, valhalla, apache-age, pgvector, duckdb, ocrmypdf, docling, paddleocr, llamafile, vosk, platformio, node-red, nakama, beejs-guides, ostep, missing-semester | Everyday or domain-specific developer aids |

### Entries that read as mainstream, weak, wrapper-like, redundant or low-value

| Group | Resources | Reason | Recommendation |
| --- | --- | --- | --- |
| Generic mainstream platforms | github-pages, github-codespaces, google-cloud-shell, android-studio, flutter, mongodb-atlas, brevo, mailtrap, uptimerobot, backblaze-b2, prometheus, lighthouse, testcontainers, wiremock, webpagetest, appwrite, coolify, openrouter, cloudflare-workers-ai | Widely known; they add catalog completeness more than discovery. Each has concrete developer value (official toolchain, hosted free tier, metrics base) | Keep on merit; no removal |
| Weak directory listings | public-apis, free-for-dev, awesome-selfhosted, free-programming-books | Meta-lists. public-apis: the raw README (raw.githubusercontent.com/public-apis/public-apis/master/README.md) opens with the sponsor heading "APILayer Unified Suite in now Live!" (sic) and an APILayer sign-up pitch, and has an "MCP Servers" section whose table uses "Auth \| Transport \| Install" columns instead of HTTPS/CORS (slice F, public-apis entry, F-25 and X-4; re-fetched by this aggregation). Entries include paid offerings, for example "paid per-call data" (corpusAI Cloud Pricing) and a server "paid via x402" (ScriptMasterLabs MCP). free-for-dev overlaps Everything.Free's own purpose; awesome-selfhosted has no "not verified" limitation; free-programming-books already indexes beejs-guides and ostep | Keep, but cap meta-lists at these four and do not let them stand in for curated entries. data-gouv-fr-api-catalogue is also a directory but an official one that records access conditions per API, so it is not in this group. |
| Thin wrappers | None confirmed | gutendex was considered and rejected (Gutenberg has no public JSON API; gutendex README: "Project Gutenberg has no such public API of its own"); frankfurter blends 104 central banks and adds history (frankfurter.dev: "tracks daily exchange rates from 104 central banks and official sources, covering 221 currencies back to 1948") (slice A) | None |
| Vendor free endpoint with a trade-off | bigdatacloud-reverse-geocoding | Free, keyless, client-side only; the provider pairs submitted locations with IPs to improve its geolocation, and a breach bans the IP from all its free APIs (bigdatacloud.com/free-api/free-reverse-geocode-to-city-api: "That anonymous pairing helps us continuously validate and improve our IP geolocation accuracy"; bigdatacloud.com/docs/article/fair-use-policy-for-free-client-side-reverse-geocoding-api: violations "may result in your IP address being banned, preventing access to all of BigDataCloud's free APIs"; slice C, §9) | Keep; the trade-off is already in `limitations` |
| Redundant or volatile | geoapify (overlaps openrouteservice for hosted location APIs); openrouter, groq, mistral-api, cohere-api, cloudflare-workers-ai (free AI tiers that change often) | Partial overlap or high churn, not identity duplication | Keep; schedule these early for verification |
| Low-value listing (resource is fine) | astropy, jsonplaceholder, random-user-generator | astropy's features are "Python package" and "BSD-3-Clause licence", and the shortDescription is 51 characters; the two fixtures are mainstream with low discovery value | Improve the astropy listing; keep the fixtures |

## Description findings

**No promotional superlatives.** Scans of names, descriptions, whyListed, features, limitations, licenseNotes and tags found no promotional "best", "#1", "fastest", "most powerful", "unbeatable", "better than", "leading" or "state-of-the-art". Hits in context are acceptable: lighthouse "best practices" (an audit category name), rdap-org "authoritative" (RDAP protocol term), circl-hashlookup and ntfy "best effort" (disclaimers), ostep "Three Easy Pieces" (book title), ldtk "simple export format" (the product's "Super Simple Export"), micropython "lightweight" (README wording). unpaywall's feature "Best free copy location" names the API field `best_oa_location`; naming the field would read better (NON-BLOCKING).

### Access and commercial-use statements written as fact (source of B1)

The tri-states for all of these are `unknown`. The statements mostly match what providers say today, so the issue is presentation and the PR's description of its own work, not accuracy.

| Resource | Field | Text |
| --- | --- | --- |
| uptimerobot | longDescription | "The free plan is permanent, and its terms allow commercial use." |
| ecb-data-portal-api | longDescription | "The ECB's reuse policy allows commercial and non-commercial use with the source cited." |
| entur-apis | longDescription | "Data is under the Norwegian Licence for Open Government Data, including commercial use." |
| geoapify | longDescription | "The free plan includes 3,000 credits a day and allows commercial use with attribution." |
| opencitations | whyListed | "It provides citation data that can be reused for any purpose, including commercial tools." |
| nvd-api | longDescription | "…with documented rate limits and an optional free key." |
| abuse-ch | longDescription | "Each has an API and data feeds that need a free Auth-Key." |
| openaq | longDescription | "Version 3 needs a free API key…" |
| fred-api | longDescription | "It needs a free API key per application." |
| orcid-public-api | longDescription | "An anonymous tier needs no credentials; registered public credentials raise the daily read limit." |
| cohere-api | shortDescription, longDescription | "Free evaluation key…"; "Cohere issues a free evaluation key on registration…" |
| ripe-atlas | longDescription | "Anyone can browse the public results; with a free RIPE NCC account…" |
| aikosh | longDescription | "Registered users can download open artefacts…" |
| google-cloud-shell | shortDescription, longDescription | "…free with a Google Cloud account"; "It is free for users with a Google Cloud account." |
| brevo | longDescription | "…once Brevo approves the account for sending." |

Not counted: restriction statements that restate a `PERSONAL_FREE` classification (nager-date, abuseipdb, the "non-commercial only" part of cohere-api) and wokwi, whose sentence is attributed ("Wokwi describes its free Community plan as…"). That attributed form is a workable fix for the 15 above.

### Other description items (NON-BLOCKING)

- Permanence stated as fact: mongodb-atlas ("permanent free 512 MB shared cluster", "it does not expire"), mailtrap ("Both have permanent free plans"), abuseipdb ("The free Individual plan is permanent"), uptimerobot. ipinfo-lite whyListed "without a request cap" matches IPinfo's "no daily or monthly limit" (ipinfo.io/developers/lite-api; slice A) but is unattributed.
- authelia "It is OpenID Certified": the provider says "OpenID Certified™" (www.authelia.com: "OpenID Connect 1.0 Provider which is OpenID Certified™"; slice D, §5.18); state it as the provider's claim.
- abuse-ch whyListed "data that is otherwise sold commercially": unattributed comparison. abuse.ch's own terms provide for paid for-profit access: abuse.ch/terms-of-use/ §4 says "commercial or for-profit needs may require a paid subscription, which will be managed by Spamhaus" (fetched 2026-10-02, slice B H8). Reword to state the value without the comparison.
- photon whyListed implies the public Photon instance suits autocomplete traffic; its README throttles or bans extensive use and points heavy users to self-hosting (github.com/komoot/photon README: "Extensive usage will be throttled or completely banned ... If you have a larger number of requests to make, please consider setting up your own private instance"; slice C, §2 C6).
- paddleocr "complementing Tesseract": unsourced comparison (the github.com/PaddlePaddle/PaddleOCR README has no mention of Tesseract; slice C, §20).
- nu-html-checker "W3C's conformance checker" overstates W3C's role; W3C hosts an instance of validator/validator (validator.github.io/validator/: it "can be run as an HTTP service, similar to validator.w3.org/nu"; the project's raw LICENSE is MIT text, © 2007–2016 Mozilla Foundation; slice E, E-NU-3).
- mailtrap whyListed "on one free account": the provider says the products are "sold separately", each with a free plan (mailtrap.io/pricing/ FAQ: "Email API/SMTP, Email Marketing and Email Sandbox are sold separately, all offering a free plan"; slice D, §5.17).
- ldtk "that game code can read without a parser library": Super Simple Export still includes an optional JSON file per level (ldtk.io/docs/game-dev/super-simple-export/: one PNG per layer, a composite PNG per level, an optional "very simple" JSON file per level, and CSV for IntGrid layers; slice F, F-19).
- data-gov-sg-api whyListed explains coverage ("a Southeast Asian government data API"), not developer use.
- postcodes-io shortDescription "Free UK postcode lookup" omits the Northern Ireland commercial caveat (postcodes.io/docs/licences/: "Commercial use requires a licence from NI Land & Property Services"; slice C, §11 C2).
- appwrite shortDescription is 113 characters; `resource.ts` asks for about 110 or fewer.
- mosip: the "india" framing understates MOSIP's own international presentation (www.mosip.io: "MOSIP offers countries modular and open-source technology to build and own their national identity systems", next to a list of countries; slice D, H7).
- groq `compilationNotes`: "the billing FAQ now confirms an ongoing free plan" uses verification wording in a non-evidence field; "states" is safer.
- astropy: features and shortDescription are too thin to say what it does.

Apart from these, descriptions say what the resource is, what it does and why a developer would use it, and free or limitation context appears either in the description or in `limitations`.

## Platform findings

- **Conventions confirmed.** All 52 APIs and all 8 DATASETs include `BROWSER`, matching existing practice (`open-meteo`, 44 of 46 existing DATASETs). Six entries have empty platforms (testcontainers, schemathesis, wiremock, flutter, rdkit, astropy); this follows 17 existing library entries (`jest`, `vitest`, `eslint`, `prettier` and others), and each `compilationNotes` explains it.
- **Backed by release assets or official statements:** hurl, syft, yq, miller, qsv, shellcheck, nu-html-checker, prometheus, scrcpy, docling, ocrmypdf, llamafile, android-studio, duckdb, apache-age, pgvector, testssl-sh, dnsviz, openssf-scorecard (README: "supports OSX and Linux"), paddleocr, node-red (macOS conservatively omitted), lighthouse (`BROWSER` only is conservative), osrm and protomaps-pmtiles (`SELF_HOSTED` only is conservative).

| Class | Resource | Problem | Evidence |
| --- | --- | --- | --- |
| NON-BLOCKING | vosk | `IOS` listed, but the iOS build is "Available on request. Drop us an e-mail"; `WINDOWS` and `MACOS` omitted although pip wheels exist | alphacephei.com/vosk/install |
| NON-BLOCKING | ldtk | `LINUX` missing | ldtk.io/download: "Windows Linux Ubuntu macOS"; v1.5.3 assets include `ubuntu-distribution.zip` |
| NON-BLOCKING | micropython | WINDOWS/MACOS/LINUX rest on Unix and Windows ports with no prebuilt builds; existing `python` excludes developer builds | micropython.org/download (`?port=unix`, `?port=windows` list source only) |
| NON-BLOCKING | rdkit | `[]` with a note that no official OS page was read, but one exists | rdkit.org/docs/Install.html: "Linux, Windows, and macOS RDKit platform wheels" |
| NON-BLOCKING | tldr-pages | `BROWSER` only while shortDescription says "readable in the terminal"; official console clients exist | tldr wiki "Official console clients" |
| NON-BLOCKING | mozilla-http-observatory, explainshell | Self-hosting is documented (npx CLI and Postgres; `make serve`) but `SELF_HOSTED` is absent | mdn-http-observatory raw README: `npx @mdn/mdn-http-observatory` CLI and self-hosting with Postgres (slice E, E-OBS-2); explainshell raw README documents a local run with `make serve` (slice F, F-05) |
| NON-BLOCKING | osv-dev | `BROWSER` while features list the separate osv-scanner CLI | entry fields |
| REQUIRES MANUAL REVIEW | flutter | Host development OSes not extractable from official pages today | docs.flutter.dev install pages render navigation only (docs.flutter.dev/install, /install/quick, /install/manual and /reference/supported-platforms; slice F, F-12) |
| REQUIRES MANUAL REVIEW | mailpit, openfga, sops | Per-OS release assets not checked | mailpit.axllent.org: "multi-platform email testing tool"; the openfga raw README lists "Precompiled Binaries"; for sops only the getsops.io homepage and LICENSE were read (slice D) |
| REQUIRES MANUAL REVIEW | catalog convention | Libraries are split between `[]` (17 entries) and listed OSes (`biopython`, `sympy`, `open-babel`, `python`, `django`, `flask`, `gdal`) | scripted catalog scan |

## Limitation findings

Documented provider information is not a verified repository fact. These items concern what `limitations` says; no verification state changes.

### Stated more strongly than the source (NON-BLOCKING)

| Resource | Limitation | What the source says |
| --- | --- | --- |
| datacite-rest-api | "Paging is capped at 10,000 records" | Only page-number pagination; "Cursor-based pagination has no limitations" (support.datacite.org/docs/pagination: "Method 1: Page number (up to 10,000 records)" and "Cursor-based pagination has no limitations on the number of records that can be retrieved"; slice A, A-13b) |
| ecosyste-ms | "Some APIs are available only on paid plans" | Tiers differ by rate limit, priority, SLA and dashboards; no paid-only API listed (ecosyste.ms/pricing: Free 300 requests/hour, Develop $200/month 1,000/h, Scale $1000/month 5,000/h, with no "only" or "paid" API wording; slice B) |
| overpass-api | "Commercial use should go to self-hosted or paid Overpass servers" | FOSSGIS terms allow commercial use where the service is not "a substantial part of an online offering"; "far less for regular use" not found (fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen/: "Commercial use is only permitted if the use of the services does not constitute a substantial part of an online offering"; dev.overpass-api.de/overpass-doc/en/preface/commons.html has no commercial-use text; slice C, §3) |
| valhalla | "Self-hosted only; this listing does not cover any hosted instance" | valhalla.github.io/valhalla/ documents a Demo Server at `valhalla1.openstreetmap.de` under "the usual fair-usage policy as OSRM & Nominatim demo servers (somewhat enforced by rate limits)" (slice C, §5). The FOSSGIS terms at fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen/ list `valhalla1.openstreetmap.de` among FOSSGIS's routing servers and set "Maximum one request per second" for them (re-fetched by this aggregation). |
| ocrmypdf | "there is no official graphical interface" | The official Docker image ships a Streamlit demo web service, with no authentication (ocrmypdf.readthedocs.io/en/latest/docker.html: "The OCRmyPDF Docker image includes an example, barebones web service built with Streamlit"; "intended for demonstration or development. It provides no security, no authentication"; slice C, §21) |
| rdap-org | "with no service guarantee" | The page says the operator runs it "in my own time and at my own cost" (about.rdap.org: "While I am currently an employee of ICANN, I run this service in my own time and at my own cost"; slice E, E-RD-1) |
| data-gov-sg-api | Key request needs "a description of use" | Email login, OTP, then a Developer or Production key (guide.data.gov.sg/developer-guide/how-to-request-an-api-key; slice B) |
| al-quran-cloud | "free for non-commercial use; commercial reproduction needs acknowledgement" reads as non-commercial only | "Commercial reproduction … requires no permission from us but a respectful acknowledgement" (alquran.cloud/terms-and-conditions, last updated 14 June 2026; slice B, H5) |
| ban-geocoding | Older endpoint "is deprecated"; data "refreshed twice a week" | The old URL "sera décommissionnée fin janvier 2026" (adresse.data.gouv.fr/outils/api-doc/adresse: "L'URL api-adresse.data.gouv.fr sera décommissionnée fin janvier 2026"); IGN's page says the index is updated weekly (cartes.gouv.fr géocodage help page, `cartes.gouv.fr/aide/…/geocodage/`, reached from geoservices.ign.fr: "L'index des adresses est actualisé chaque semaine"), while the adresse.data.gouv.fr page says "actualisé à partir des données de la BAN deux fois par semaine" (slice C, §12 C8) |

### Could not be sourced today (REQUIRES MANUAL REVIEW)

uptimerobot ("3 months of data"; pricing (uptimerobot.com/pricing/) shows "Monthly email reports … Only first 3 months"), nvd-api (keys "may not be shared"), aladhan-api (rate limits), openml (rate limits without an account), bigdatacloud-reverse-geocoding ("commercial use allowed under the fair-use policy", "No availability guarantee"), internet-nl (batch eligibility), cohere-api (training opt-out; data-usage page 404: docs.cohere.com/docs/data-usage-policy.md), mistral-api (training on free-mode data; no card needed; "evaluation and prototyping"), platformio ("Premium support and registry services for businesses are paid"), ntfy ("uptime is best effort"), appwrite (Cloud pauses after 1 week, 2 GB / 5 GB / 75,000 MAU, $150 verification), mongodb-atlas, backblaze-b2 and healthchecks-io (card or commercial-use statements in `compilationNotes`), clinicaltrials-gov-api, europe-pmc-api and unpaywall (pages unreadable), cron-job-org ("in Germany"), public-apis ("staff of the sponsor APILayer"), groq (free-plan limits), openrouteservice (attribution, result licence, commercial terms), webpagetest ("now part of LogicMonitor through Catchpoint"). mitre-attack's "spreadsheets" claim was not re-confirmed either (NON-BLOCKING).

Pages read without finding these statements, as recorded in the slice notes: uptimerobot.com/pricing/ (slice F, F-02); for nvd-api, aladhan-api, internet-nl, clinicaltrials-gov-api, europe-pmc-api, unpaywall, openml, groq and openrouteservice, the pages in the "REQUIRES MANUAL REVIEW" table under "API findings"; bigdatacloud.com/free-api/free-reverse-geocode-to-city-api, /docs/article/fair-use-policy-for-free-client-side-reverse-geocoding-api and /docs/article/why-is-reverse-geocoding-api-free (slice C, §9 C8); docs.cohere.com/docs/rate-limits and the 404 data-usage page (slice C, §17 C8); mistral.ai/pricing, docs.mistral.ai, docs.mistral.ai/llms.txt and help.mistral.ai/en/ (slice C, §16 C8); platformio.org/pricing, a JS shell with only a "Premium Support" footer link (slice F, F-14); ntfy.sh and docs.ntfy.sh/publish/ (slice D); appwrite.io/pricing, whose plan figures are rendered client-side, and appwrite.io/docs/advanced/billing/free (slice D); www.mongodb.com/pricing and www.mongodb.com/docs/atlas/reference/free-shared-limitations/ (slice D); healthchecks.io/pricing/ and healthchecks.io/docs/faq/ (slice D; the backblaze-b2 sign-up page was not re-read); the cron-job.org homepage, FAQ and ToS, with the imprint page not read (slice D); for public-apis, the GitHub About box (links `APILayer.com`) and the README (slice F, F-25); logicmonitor.com/pricing/web-performance-optimization, which is LogicMonitor-branded, with no ownership-chain page read (slice E, E-WPT-3); attack.mitre.org/resources/working-with-attack/, a 79-byte redirect stub (slice B).

### Practical restrictions missing (NON-BLOCKING)

| Resource | Missing restriction | Source |
| --- | --- | --- |
| wttr-in | Self-hosting needs an OpenCage token and an upstream weather source | github.com/chubin/wttr.in README Installation: "The configuration implies the use of OpenCage for geolocation (a token is required) and wttr.in as the source of weather data" (slice A) |
| first-epss | 1,000 requests/minute for unauthenticated endpoints | api.first.org |
| deps-dev | BigQuery dataset needs a Google Cloud account; billed beyond the free tier | docs.deps.dev/bigquery/v1 |
| data-police-uk | Street-level data covers a rolling window (September 2023 to August 2026); stop-and-search covers some forces | data.police.uk/about |
| fred-api | No "FRED", "ALFRED" or "Federal Reserve Bank" in hostnames; logo restriction | fred.stlouisfed.org/docs/api/terms_of_use.html: "FRED" may not appear in your hostname; slice B records the "ALFRED" and "Federal Reserve Bank" naming rule and the logo restriction from the same terms |
| ecb-data-portal-api | Resellers must tell buyers the data is free | ECB website disclaimer: "Where the information is incorporated in documents that are sold … must inform buyers … that the information may be obtained free of charge." (slice B) |
| peeringdb | Use limited to approved Internet-operational purposes; no bulk pass-on; no ad targeting; duplicate-query throttles | www.peeringdb.com/aup: data may not be reproduced, stored or transmitted "except for Internet operational purposes approved by PeeringDB"; it "may not be passed on in bulk … unless approved"; "Any use of this material to target advertising or similar activities is explicitly forbidden". docs.peeringdb.com/howto/work_within_peeringdbs_query_limits/: repeated identical anonymous requests over 100 KB are limited to 1 per hour, and of any size to 2 per minute (slice B, H6) |
| aladhan-api | Provider accuracy disclaimer | aladhan.com/credits-and-terms |
| al-quran-cloud | Text must not be altered; reciters may ask for content removal | alquran.cloud/terms-and-conditions: "The text must not be altered or commingled with non-Quranic material"; recitations may be bundled into a commercial product, but reciters "may ask you to remove the con[t]ent" (bracket as recorded in slice B) |
| brasilapi | Upstream data terms not stated | brasilapi.com.br: "Estamos em beta e ainda elaborando os Termos de Uso" (terms still being drafted); GET `/api/cep/v1/01001000` returned 200 with `"service":"open-cep"`, naming an upstream source whose terms are not stated (slice B) |
| circl-hashlookup | NSRL data version 2023.09.2 | hashlookup.circl.lu/info |
| cron-job-org | Shutdown without notice; sustaining members may get "reduced limitations" | cron-job.org/en/tos |
| brevo | Free-plan emails carry Brevo branding | www.brevo.com/pricing/: the paid Starter plan lists "No Brevo logo — Remove the 'Sent with Brevo' footer" (slice D) |
| glitchtip | Hosted free plan is labelled for personal projects | glitchtip.com/pricing: "Free For Personal Projects · Up to 1,000 events/mo" (slice F, F-10) |
| can-i-use | Ads, with paid ad removal | caniuse.com/: "Become a caniuse Patron to support the site and disable ads for only $1/month!" (slice F, F-26) |
| mistral-api | Free allowance shown as "$10 /mo in API credits" | mistral.ai/pricing |
| pocketbase | Pre-1.0 compatibility warning | Raw README: "full backward compatibility is not guaranteed before reaching v1.0.0" (slice D) |
| datasette | JSON API stability | datasette.io: one of the blockers for 1.0 is "providing a stable, fully documented JSON API"; latest listed release "datasette 1.0a40" (slice D) |
| authelia | Needs a supported reverse proxy | www.authelia.com: it "acts as a companion for common reverse proxies" (slice D) |
| sops | Needs a key source | getsops.io: "SOPS supports Age and PGP/GnuPG for offline identities, and Amazon AWS KMS, Google Cloud KMS, Azure KMS…" (slice D) |
| act | Parity with GitHub-hosted runners is partial | nektosact.com has sections "4. Unsupported functionality / 4.1. Support matrix" (slice D) |
| docling | Python 3.10+; model licences differ from the MIT code | Raw README: "Python 3.10 or higher"; "The Docling codebase is under MIT license. For individual model usage, please refer to the model licenses found in the original packages." (slice C, §22) |
| android-studio | Windows on ARM unsupported | developer.android.com/studio/install: "Windows machines with ARM-based CPUs aren't currently supported" (slice F, F-11). A later scripted re-fetch on 2026-10-02 was redirected to a sign-in page, so the quote rests on the slice F fetch. |
| openssf-scorecard | GitHub authentication required to run the CLI | Raw README: "you must authenticate your requests before running Scorecard", with a GitHub PAT or App (slice E) |
| gitleaks | Security-patch-only status; Gitleaks-Action licence key for organisation repos | Raw README: "Gitleaks is feature complete. I'm not merging new features into Gitleaks. Future releases will be security patches only." gitleaks.io: "If you are scanning repos that belong to a GitHub organization account, then you'll have to obtain a free license" (slice E, E-GL-2 and E-GL-3) |
| testcontainers | Commercial Testcontainers Cloud/Desktop not mentioned | testcontainers.org redirects to testcontainers.com, which has Desktop and Cloud menus; testcontainers.com/cloud/ shows "Free Trial", "Pricing" and "Sign up for free" (slice E, E-TC-3) |
| qsv | Separate qsv pro product not mentioned | qsv.dathere.com links to "qsv pro"; the raw README has a `pro` command to "Interact with the qsv pro API". The qsv pro terms were not researched (slice E, E-QSV-1) |
| nakama | Nakama Enterprise and commercial licences not represented | heroiclabs.com/nakama/: "Server License Apache 2.0. Commercial licenses are also available."; heroiclabs.com/pricing/: "All plans include Nakama Enterprise". The feature split between editions was not established (slice F, F-20) |
| semgrep | Proprietary products and the rules licence not represented | docs.semgrep.dev/licensing: registry rules are under the Semgrep Rules License v1.0, "available only for internal business use", and the AppSec Platform, Code, Secrets and Supply Chain are "Proprietary". semgrep.dev/legal/rules-license: "You may use the rules only for your own internal business purposes … does not allow you to distribute the rules, or to make them available to others as a service." (slice E, H1 and E-SEM-5) |
| webpagetest | Apache-2.0 branch alongside the Polyform Shield master branch not mentioned | github.com/catchpoint/WebPageTest: "The master branch … has the Polyform Shield 1.0.0 license. The apache branch has the more permissive Apache 2.0 license" (slice E) |
| coolify | Paid Coolify Cloud not mentioned (optional) | coolify.io: nav entries "To Cloud" and "Pricing", and "3,641+ customers in the cloud" (slice D, §5.27) |
| osrm | Demo server is operated by FOSSGIS under its own terms | Project-OSRM wiki `Demo-server`: "restricted to reasonable, non-commercial use-cases. Do not exceed 1 request per second"; routing.openstreetmap.de/about.html: operated by FOSSGIS, "One request per second max" (slice C, §4) |
| awesome-selfhosted | No limitation at all, so nothing says entries are unchecked | `batch-007.ts`: awesome-selfhosted sets no `limitations`; public-apis has "entries are not checked against the providers' current terms" and free-for-dev has "Entries are community-submitted and not verified against providers' current terms" |

## Verification-integrity findings

**Structured fields: PASS for all 151.** Re-checked today by a read-only inline script against `batch007Resources`:

| Check | Result |
| --- | --- |
| `verificationStatus` | `UNVERIFIED` × 151 |
| `verifiedBy`, `lastVerifiedAt`, `verificationSources`, `verificationChecks`, `verificationNotes`, `editorialSpotlight` | present on 0 entries |
| Tri-states (`requiresAccount`, `requiresCreditCard`, `commercialUse`, `personalUse`) | `unknown` 604/604 |
| `submittedAt` / `updatedAt` | `2026-10-01` only, from `COMPILED_ON`, commented in `batch-007.ts` as "Used for submittedAt / updatedAt only, never as a verification date" |
| `compilationNotes` contains "not a verification pass" | 151/151; provider access statements are labelled "(unverified)" |
| Maintainer register (`src/config/maintainers.ts`) | not in the diff; no verifier added |
| Backlog | 151 rows added, each "Unverified \| 0/10 \| All \| never"; slug set equals the batch slug set |
| PR report | "All newly added resources are UNVERIFIED unless the existing repository verification workflow explicitly confirms otherwise." is present verbatim |

There is also a structural guard: the `BatchSeed` type omits every verification and tri-state field, and `entry()` hard-codes `UNVERIFIED` and `unknown`, so a batch-007 seed cannot carry a verifier, date, source or check.

No verifier, date, verification source or verification check was fabricated.

**Prose:**

- BLOCKING (B1): 15 entries state access or commercial-use facts in descriptions while the matching tri-states are `unknown`, and the PR report says a final pass removed such claims. See "Description findings" and "Required changes".
- BLOCKING (B2): `data-gouv-fr-api-catalogue.compilationNotes` carries a dated observation ("On 1 October 2026 the catalogue listed 1,118 open, 38 account-only and 108 restricted services."). `src/types/resource.ts` says `compilationNotes` "carries no date that could be mistaken for a check"; `docs/verification.md` says it "carries no date and counts for nothing".
- NON-BLOCKING: `groq.compilationNotes` "the billing FAQ now confirms an ongoing free plan" uses verification wording in a non-evidence field.
- REQUIRES MANUAL REVIEW: openfda's authentication page (open.fda.gov/apis/authentication/) says a key "is required" and then documents keyless limits. A verifier must resolve this before any `ACCOUNT_REQUIREMENT` check.

This review fetched provider pages on 2026-10-02. That is not verification. None of the evidence quoted here should be turned into `verificationChecks`, `verificationSources`, `verifiedBy` or `lastVerifiedAt`, and no tri-state should change because of it.

## Existing-catalog regression

**PASS. PR #15 does not modify any existing resource.**

- Changed files (`git diff --name-status b030e73 c3bdd6d`, re-run today): `A batch-007.ts`, `M index.ts`, `M docs/verification-backlog.md`, `A docs/verification/developer-resource-expansion-001.md`. No config, validation, search, UI, test or workflow file changed.
- `index.ts`: exactly 2 added lines, the `batch007Resources` import after batch 006 and the `...batch007Resources` spread after `...batch006Resources`.
- Identity, URLs, taxonomy and verification state: the cross-cutting audit loaded `seedResources` from both trees. Entries 0–725 are deep-equal on every field and in the same order; entries 726–876 equal `batch007Resources` in order. The existing verification mix is unchanged (720 `UNVERIFIED`, 6 `PARTIALLY_VERIFIED`).
- Backlog: only the "Resources 726→877" and "Not verified yet 716→867" summary rows change; no existing row is removed or rewritten.
- Search: no search code changed; `npm test` 47/47 pass, including the pinned search and evidence assertions. New names that contain existing names (`github-pages`, `github-codespaces` for "github"; `cloudflare-radar`, `cloudflare-workers-ai` for "cloudflare") will also match those queries. That is expected additive behaviour.
- Validator: `findDataProblems` reports no problems for batch-007 slugs (slice F, all slices' `relatedResources` checks).

## Separate cleanup items

These are not defects in the batch-007 resources. They do not affect the merge-readiness verdict.

### Process

| Item | Class | Evidence | Action |
| --- | --- | --- | --- |
| PR #15 is merged into the stacked branch `data/resource-expansion-006` (`0efb494`), not into `main` (`af01c3f`) | Process item | `git merge-base --is-ancestor c3bdd6d origin/main` → not an ancestor; `batch-007.ts` absent on `origin/main`; `0efb494` parents are `b030e73` and `c3bdd6d` | Open a new PR into `main` (for example from `data/resource-expansion-006`) and run CI on it before landing |
| Merge commit `0efb494` has no check runs; the event of CI run 36896845537 on `c3bdd6d` is unconfirmed | REQUIRES MANUAL REVIEW | GitHub check-runs GETs (cross-cutting); the API rate limit ran out before the run event could be read | Confirm the event, and rely on CI from the new PR into `main` |
| PR report header is stale: "PR #14, open and not merged … Merge #14 first; this PR then applies cleanly to `main`" | NON-BLOCKING | PR #14 is merged; #15 went into the stacked base | Update the header in the new PR |

### PR report accuracy (NON-BLOCKING)

- §Licensing: "`licenseNotes` explains the split in each" of the 19 hosted entries with published code. 9 have no `licenseNotes` (jsonplaceholder, random-user-generator, brasilapi, postcodes-io, healthchecks-io, smee-io, kroki, mozilla-http-observatory, rdap-org), and of the 10 that do, only wttr-in and webhook-site (partly ecosyste-ms and openrouteservice) describe the split. Correct the sentence or add the notes.
- §Licensing counts mix all-151 counts with `OPEN_SOURCE`-only wording (see "License findings").
- §Duplicate Analysis omits several benign shared-domain pairs (apache.org, google.com, mit.edu, ebi.ac.uk, usgs.gov, ripe.net) and `nvd-api`/`nvda`.
- §Regional Coverage lists Vosk under India and Mistral under France; neither is a regional public resource.
- §Deferred: Flutter, Prometheus, Android Studio and UptimeRobot were accepted while NumPy, Polars, OpenCV, Vite, esbuild and Tailwind were deferred as "Well-known projects held back". The rationale reads as a popularity rule applied one way; reword it. No removal is recommended.

### Existing catalog (outside the PR diff)

| Item | Class | Evidence |
| --- | --- | --- |
| `glitch` (WEB_APP, FREE_TIER) describes live hosting that has ended | Cleanup | glitch.com redirects to blog.glitch.com; "On July 8, 2025 Glitch project hosting and user profiles will be shut down" (blog post dated May 22, 2025) |
| `thunderbird` (desktop) has `sourceUrl` `github.com/thunderbird/thunderbird-android` and platforms including `ANDROID`; `k9-mail` shares that repo | Cleanup | GitHub page title "Thunderbird for Android – … (fka K-9 Mail)" |
| `wikisource`, `wikisource-kannada`, `wikimedia-commons` share `github.com/wikimedia/mediawiki` | Cleanup (low) | shared `sourceUrl` |
| `sentry` (FREE_TIER, `SELF_HOSTED`) records no licence; its code is FSL-1.1-Apache-2.0 (source-available, not OSI) | Cleanup | `getsentry/sentry` `LICENSE.md` |
| CC-licensed entries marked `OPEN_SOURCE` (`wikidata`, `openalex`, `simple-icons`, `wikisource`, `wikisource-kannada`, `wikimedia-commons`, `storyweaver`, `open-tree-of-life`), while batch 007 treats CC as non-OSI `FREE` | Cleanup / convention | scripted catalog scan (slice F O-2) |
| `apis` ("Public and free-tier APIs you can build against") holds API tooling: `bruno`, `insomnia`, `fastapi`, `hoppscotch`, `swagger-editor`, `postgraphile` | Taxonomy drift, pre-existing | `src/config/categories.ts` |

### Workspace notes

- `docs/architecture.md` carries a local user edit that predates this audit (same diffstat at start and end). It was not read or touched and is not a finding.
- Earlier steps left untracked `tmp-pr15-slice*` files at the repo root; a check at the end of this run found no `tmp*` files there. This step created no temporary files.

## Required changes

Only BLOCKING items are listed. Both concern how verification state is presented; neither questions whether a resource belongs in the library.

| # | Resource | Problem | Evidence / source | Recommended action |
| --- | --- | --- | --- | --- |
| B1 | uptimerobot, ecb-data-portal-api, entur-apis, geoapify, opencitations, nvd-api, abuse-ch, openaq, fred-api, orcid-public-api, cohere-api, ripe-atlas, aikosh, google-cloud-shell, brevo | Short/long descriptions or `whyListed` state account, key, sign-up or commercial-use facts as plain fact while `requiresAccount` and `commercialUse` are `unknown`. The PR's verification report says this was already done: "Descriptions and features do not repeat these as facts: a final pass removed key, sign-up and card claims from short and long descriptions, `whyListed` and `features`." | `src/data/resources/batch-007.ts` (fields quoted under "Description findings"); `docs/verification/developer-resource-expansion-001.md` §Free-Status Analysis; `docs/verification.md`: "A value existing in the data is not evidence"; the same report sentence lists commercial use among the statements kept in `compilationNotes` | Attribute each statement to the provider (as `wokwi` does: "Wokwi describes its free Community plan as…") or move it to `limitations` / `compilationNotes`. Then make the report sentence match what was done. Leave every tri-state `unknown`. |
| B2 | data-gouv-fr-api-catalogue | `compilationNotes` contains a dated observation: "On 1 October 2026 the catalogue listed 1,118 open, 38 account-only and 108 restricted services." | `src/types/resource.ts` (`compilationNotes`: "carries no date that could be mistaken for a check"); `docs/verification.md` ("It carries no date and counts for nothing"); the catalogue showed 1,261 APIs on 2026-10-02, so the count is already stale | Remove the date and the counts; keep "api.gouv.fr redirects to data.gouv.fr/dataservices" |

## Deferred/future opportunities

Recorded for planning. None is required for this PR, and no entries were created from them.

- **Conventions to write down** (each blocks a group of REQUIRES MANUAL REVIEW items): hosted service with published code; free "Lite" editions of paid data; non-commercial data licences and permission-based commercial use vs the `PERSONAL_FREE` caveat text ("A paid licence is typically required…"); open-core repositories; platforms for libraries and SDKs; licence-shaped tags such as `cc0` and `open-government-licence`.
- **Licence decisions:** settle openrouteservice first (conflicting official files), then the other seven bare GPL-family identifiers, ntfy's operator and GPL variant, and semgrep's rules licence disclosure.
- **Schema work:** a structured "documented by the provider, not verified" field (today only free-text `compilationNotes`); SPDX validation for `license` (values such as `MIT / Apache-2.0` and bare `GPL-3.0` pass `validate.ts`); written definitions for `apiAvailable` and `downloadAvailable` (local API servers such as llamafile and `llama-cpp`; Docker or npm distribution for devdocs and node-red); populating the unused `languages` field (useful for vosk, aladhan-api, al-quran-cloud, brasilapi, ban-geocoding); what `sourceUrl` means for content projects on shared software.
- **Taxonomy work:** security, networking, datasets, mobile development, IoT/embedded and game-development categories. Their absence forces security tools into `testing`, feeds into `apis`, wokwi into `science`, node-red into `lifestyle`.
- **Coverage gaps:** Africa (no entries), Latin America (brasilapi only), Southeast Asia (data-gov-sg-api only). Research leads only, not entries: the PR's deferred openAFRICA, Africa's Talking and IBGE; MOSIP's list of adopting countries.
- **Editorial questions:** whether Betterleaks (successor to Gitleaks) or Opengrep (Semgrep CE fork) belong in the catalog; whether the five open-core deferrals should be revisited if authentik stays.
- **Verification planning:** pages that blocked scripts today need a browser read (usgs.gov, europepmc.org, unpaywall.org, clinicaltrials.gov, openml.org, sec.gov, radar.cloudflare.com, validator.w3.org, webpagetest.org, account.heigit.org, platformio.org, docs.flutter.dev). The free AI tiers (openrouter, groq, mistral-api, cohere-api, cloudflare-workers-ai) change often and suit early verification.

## Merge readiness

REQUIRES CHANGES

Deciding blocking items:

- **B1**: uptimerobot, ecb-data-portal-api, entur-apis, geoapify, opencitations, nvd-api, abuse-ch, openaq, fred-api, orcid-public-api, cohere-api, ripe-atlas, aikosh, google-cloud-shell and brevo state access or commercial-use facts in prose, contrary to the PR report's own account of its verification pass.
- **B2**: data-gouv-fr-api-catalogue has a dated observation in `compilationNotes`, which the repository's own rules forbid.

The verdict applies to landing the batch-007 content on `main`, which also needs a new PR into `main` with CI (see "Separate cleanup items"). Apart from B1 and B2, the 151 resources are legitimate and useful, verification state is intact, and no existing resource changes. The REQUIRES MANUAL REVIEW items are maintainer decisions. Settling the openrouteservice licence before the content reaches `main` is advisable, but it is not classed BLOCKING because no official source settles it.
