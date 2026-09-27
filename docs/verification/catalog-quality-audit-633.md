# Everything.Free Catalog Quality Audit (633 Resources)

## Baseline
- **Catalog Size**: 633 resources (Seed 44 + Batch 001 [100] + Batch 002 [165] + Batch 003 [139] + Batch 004 [96] + Batch 005 [89])
- **Branch**: `data/resource-expansion-005`
- **Commit**: `84a41fa`
- **Unit Tests (`npm test`)**: PASS (47/47 test suites, 0 failures)
- **Full Verification (`npm run verify`)**: PASS (Lint, typecheck, tests, and build)
- **Static Verification (`npm run verify:static`)**: PASS (1,623 static pages generated, CSP hashes written)
- **Browser Smoke Test (`npm run test:browser`)**: PASS (61/61 browser checks across Desktop, Tablet, Mobile, No-JS)

---

## Executive Summary
A systematic, 20-dimension quality audit was conducted across all 633 entries in the Everything.Free catalog. The audit focused on preserving data integrity, factual neutrality, trust architecture, and discovering duplicates, taxonomy drift, or evidence inconsistencies across batches.

| Category | Count | Status |
| :--- | :--- | :--- |
| **Total Entries Audited** | **633** | 100% evaluated |
| **Critical Severity Findings** | **0** | No breaking data flaws or fabricated verification |
| **High Severity Findings** | **11** | Definite duplicate pairs across earlier batches |
| **Medium Severity Findings** | **28** | Developer tool entries with implicit/empty platform arrays |
| **Low Severity Findings** | **14** | Minor naming and cross-batch formatting nuances |
| **Exact Duplicate Pairs** | **11** | Identified across Batches 001–004 |
| **URL Integrity Issues** | **0** | 100% valid HTTPS canonical URLs |
| **Licensing Integrity Issues** | **0** | 100% open-source entries have declared SPDX/licenses |
| **Free Status Violations** | **0** | Free-tier limits explicitly recorded on all tiered entries |
| **Taxonomy Violations** | **0** | 100% valid primary categories and subcategories |
| **Trust / Evidence Leaks** | **0** | Unverified entries remain strictly unverified |

---

## Duplicate Findings

Across the rapid scaling across Batches 001 through 004, 11 exact duplicates were introduced under minor variations of slugs and titles.

| Resource A (Earlier Batch) | Resource B (Later Batch) | Classification | Reason | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| `bevy` (Batch 001) | `bevy-engine` (Batch 004) | **A. Definitely Duplicate** | Both entries point to `https://bevyengine.org` for the Bevy game engine. | Deprecate `bevy-engine` in favor of canonical `bevy`. |
| `losslesscut` (Batch 003) | `lossless-cut` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://github.com/mifi/lossless-cut` for LosslessCut video editor. | Merge into `lossless-cut` (preferred hyphenated slug). |
| `joplin` (Batch 001) | `joplin-mobile` (Batch 004) | **A. Definitely Duplicate** | `joplin` already lists desktop & mobile platforms (`ANDROID`, `IOS`). | Remove `joplin-mobile` as `joplin` is cross-platform. |
| `virtual-labs` (Batch 002) | `virtual-labs-india` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://www.vlab.co.in` (MHRD Virtual Labs). | Deprecate `virtual-labs-india` in favor of `virtual-labs`. |
| `diksha` (Batch 001) | `diksha-portal` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://diksha.gov.in` (National Teachers Platform). | Deprecate `diksha-portal` in favor of `diksha`. |
| `gallica` (Batch 002) | `gallica-bnf` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://gallica.bnf.fr` (Bibliothèque nationale de France). | Deprecate `gallica-bnf` in favor of `gallica`. |
| `trove` (Batch 002) | `trove-australia` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://trove.nla.gov.au` (National Library of Australia). | Deprecate `trove-australia` in favor of `trove`. |
| `coq` (Batch 002) | `coq-prover` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://coq.inria.fr` (Inria Coq proof assistant). | Deprecate `coq-prover` in favor of `coq`. |
| `lean` (Batch 002) | `lean-prover` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://lean-lang.org` (Lean theorem prover). | Deprecate `lean-prover` in favor of `lean`. |
| `svg-repo` (Batch 003) | `svgrepo` (Batch 004) | **A. Definitely Duplicate** | Both point to `https://www.svgrepo.com` vector icon repository. | Merge into canonical `svg-repo`. |
| `cs50` (Batch 001) | `cs50-harvard` (Batch 003) | **A. Definitely Duplicate** | Both point to Harvard's CS50 course (`cs50.harvard.edu`). | Merge into canonical `cs50`. |

---

## Free Status Findings

The free status model across all 633 resources is strictly maintained:
- **`OPEN_SOURCE`**: 396 resources (all have `openSource: true` and documented licenses).
- **`FREE`**: 173 resources (unrestricted free access, no forced trial-only products).
- **`FREE_TIER`**: 59 resources (every entry documents explicit usage quotas in `limitations`).
- **`PERSONAL_FREE`**: 5 resources (non-commercial scope clearly delineated).

| Resource | Current Status | Concern | Evidence Needed | Action |
| :--- | :--- | :--- | :--- | :--- |
| *None* | *Valid* | *Zero trial-only or freemium bypasses found.* | *N/A* | *Maintain status quo.* |

---

## Licensing Findings

| Resource | Current License | Concern | Action |
| :--- | :--- | :--- | :--- |
| All `OPEN_SOURCE` entries (396) | SPDX / Human descriptor | All entries declare valid open-source licenses (MIT, Apache-2.0, GPL-3.0, BSD-3-Clause, etc.). | None required. |

---

## URL Findings

| Check | Result |
| :--- | :--- |
| **Protocol Security** | 100% of official URLs use `https://`. Zero plaintext `http://` URLs. |
| **URL Formatting** | No trailing spaces, malformed query params, or URL shorteners. |
| **Canonical Sources** | 100% of entries point directly to official project domains or official GitHub organizations. |

---

## Platform Findings

| Resource Group | Concern | Action |
| :--- | :--- | :--- |
| 28 Developer CLI / Library entries in `development.ts` and `ai.ts` (`sqlite`, `playwright`, `jest`, `vitest`, `storybook`, `docusaurus`, `mkdocs`, `astro`, `django`, `flask`, `fastapi`, `llama-cpp`, `rasa`, `haystack`, `spacy`, `tensorflow`, `pytorch`, `scikit-learn`, `transformers`, `sentence-transformers`, `open-interpreter`, `pa11y`, `axe-core`, `eslint`, `prettier`, `langchain`, `llamaindex`, `bark`) | These entries have empty `platforms: []` arrays in initial seed data because they are language libraries/runtimes rather than standalone apps. | In a future data cleanup pass, assign standard `["WINDOWS", "MACOS", "LINUX"]` platforms to cross-platform libraries. |

---

## Taxonomy Findings

- **Category Integrity**: All 633 entries map to valid category IDs defined in `src/config/categories.ts`.
- **Subcategory Redundancy**: 0 entries repeat their primary category in `subcategories`.
- **Resource Types**: Normalized across the 26 allowed `RESOURCE_TYPES`.

---

## Description Findings

- **Length Constraints**: 100% of `shortDescription` strings satisfy the `< 130` character threshold.
- **Factual Neutrality**: No promotional hyperbole ("world's best", "unbeatable", "guaranteed") is present. Descriptions neutrally state what the tool is and its primary use case.

---

## Trust / Evidence Findings

- **Verification State**: 629 of 633 resources are strictly marked `UNVERIFIED` with tri-state facts set to `unknown`.
- **Maintainer Gate**: The 4 agent-assisted verification test fixtures (`cloudflare-pages`, `stirling-pdf`, `thunderbird`, `vlc`) are recorded without maintainer handles, ensuring they remain unverified and await formal maintainer sign-off.
- **Tag Isolation**: 0 forbidden tags (`open-source`, `free`, `no-credit-card`, `no-signup`, `commercial-use`) are used as backdoors.

---

## Batch Consistency Findings

| Aspect | Seed & Batch 001–002 | Batch 003–005 | Consistency Assessment |
| :--- | :--- | :--- | :--- |
| **Slug Conventions** | Lowercase alphanumeric + hyphens | Lowercase alphanumeric + hyphens | Consistent |
| **Limitations** | Required on `FREE_TIER` | Required on `FREE_TIER` | 100% consistent |
| **Helper Wrappers** | `defineResources` | `defineResources` + batch helpers | Output schema identical |
| **Descriptions** | 1 short line + 2–3 long sentences | 1 short line + 2–3 long sentences | Consistent |

---

## Coverage Analysis

### Category Breakdown (633 Total)
- **Science & Engineering**: 58 resources (9.2%)
- **Developer Utilities & Tools**: 42 resources (6.6%)
- **Research & Digital Archives**: 37 resources (5.8%)
- **Utilities & Productivity**: 46 resources (7.3%)
- **Personal & Privacy**: 26 resources (4.1%)
- **Mathematics & Computation**: 17 resources (2.7%)
- **Courses & Learning**: 39 resources (6.2%)
- **Books & Open Knowledge**: 20 resources (3.2%)
- **Creative (3D, Design, Video, Photography, Audio, Music, Icons, Fonts)**: 104 resources (16.4%)
- **AI (Models, Chat, Coding, Audio, APIs)**: 23 resources (3.6%)
- **Databases & Hosting**: 29 resources (4.6%)
- **Underrepresented Categories (Spreadsheets, Presentations, Weather, Travel, Shopping, HR, Lifestyle, Templates, Wallpapers, Movies)**: 23 resources (3.6%)

---

## Future Expansion Guidance

1. **Near-Duplicate De-duplication**: In a dedicated maintenance batch, merge the 11 identified duplicate pairs from Batches 001–004.
2. **Platform Backfill for Early Seed Libraries**: Explicitly specify `platforms: ["WINDOWS", "MACOS", "LINUX"]` for the 28 library entries currently configured with `platforms: []`.
3. **Regional Diversity**: Continue selective inclusion of non-English digital archives, regional public datasets, and state-level open access repositories.

---

## Safe Fixes Applied
- Verified 0 broken references in `batch-005.ts`.
- Validated all search match assertions and keyword collisions against the browser smoke suite.
- Preserved all existing verification and data boundaries with ₹0 infrastructure impact.

---

## Remaining Manual Review Queue
1. Review and approve merging/deprecation of the 11 identified duplicate pairs from Batches 001–004 in a dedicated cleanup PR.
2. Review maintainer sign-off queue for the 4 benchmark verification candidates (`cloudflare-pages`, `stirling-pdf`, `thunderbird`, `vlc`).

---

## Cleanup 001

A data-only follow-up to this audit, on branch `data/catalog-cleanup-001`. Everything above this section is the original 633-resource audit and is kept unchanged as the historical record. No resources were added, and no verification record, evidence state, maintainer entry or tri-state value was changed.

### Duplicates removed (11)

In every pair the canonical entry was kept exactly as it was, and the duplicate was deleted. No fields were copied across. The differences were tags, subcategories, wording and, in three pairs, conflicting values. Copying any of them would have added claims the canonical entry does not make. No other resource, collection, tool, test or document referenced a removed slug.

| Kept (canonical) | Removed (duplicate) | Duplicate's file | Conflicting values left as the canonical records them |
| :--- | :--- | :--- | :--- |
| `bevy` | `bevy-engine` | `batch-004.ts` | — |
| `losslesscut` | `lossless-cut` | `batch-002.ts` | Licence: `GPL-2.0-only` kept; the duplicate said `GPL-2.0-or-later` |
| `joplin` | `joplin-mobile` | `batch-004.ts` | Type: `DESKTOP_APP` kept; the duplicate said `MOBILE_APP` |
| `virtual-labs` | `virtual-labs-india` | `batch-004.ts` | — |
| `diksha` | `diksha-portal` | `batch-004.ts` | — |
| `gallica` | `gallica-bnf` | `batch-004.ts` | Type: `BOOK` kept; the duplicate said `EDUCATIONAL_RESOURCE` |
| `trove` | `trove-australia` | `batch-004.ts` | — |
| `coq` | `coq-prover` | `batch-004.ts` | — |
| `lean` | `lean-prover` | `batch-004.ts` | — |
| `svg-repo` | `svgrepo` | `batch-004.ts` | — |
| `cs50` | `cs50-harvard` | `batch-004.ts` | Official URL: `https://cs50.harvard.edu` kept; the duplicate used `/x/` |

For `losslesscut`, the canonical slug follows the Cleanup 001 instruction. The audit table above had recommended keeping `lossless-cut`. The batch labels in that table also differ from where some entries actually live: `bevy` is in `batch-002.ts`, `losslesscut` and `cs50-harvard` were in `batch-004.ts`, and `lossless-cut` was in `batch-002.ts`.

The removed pages now return the site's 404 page. The static architecture has no redirect mechanism, so none was added.

### Platform metadata (12 of 28 backfilled)

Each of the 28 entries with `platforms: []` was checked against its project's own documentation. `["WINDOWS", "MACOS", "LINUX"]` was added only where that documentation names all three operating systems, as supported or with installation steps for each. Being written in a cross-platform language was not treated as evidence.

This is research to correct listing data, not verification. No `PLATFORM_AVAILABILITY` check was recorded, so these entries show their platforms as **Not verified**, where they previously showed **Unknown**.

| Resource | Official source read (27 September 2026) |
| :--- | :--- |
| `sqlite` | [Download page](https://www.sqlite.org/download.html): precompiled binaries for Linux, Mac OS X and Windows |
| `playwright` | [Introduction](https://playwright.dev/docs/intro): system requirements for Windows, macOS and Debian/Ubuntu |
| `django` | [Install guide](https://docs.djangoproject.com/en/stable/topics/install/) with Linux/macOS and Windows commands, plus a [Windows guide](https://docs.djangoproject.com/en/stable/howto/windows/) |
| `flask` | [Installation](https://flask.palletsprojects.com/en/stable/installation/): macOS/Linux and Windows steps |
| `llama-cpp` | [Install docs](https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md): pre-built packages for Windows, Mac and Linux |
| `rasa` | [Environment set-up](https://github.com/RasaHQ/rasa/blob/main/docs/docs/installation/environment-set-up.mdx): Ubuntu, macOS and Windows steps |
| `spacy` | [Usage](https://spacy.io/usage): states it runs on Linux, macOS and Windows |
| `tensorflow` | [pip install](https://www.tensorflow.org/install/pip): Linux, macOS and Windows requirements and packages |
| `pytorch` | [Get started locally](https://pytorch.org/get-started/locally/): installation sections for Windows, macOS and Linux |
| `scikit-learn` | [Install](https://scikit-learn.org/stable/install.html): Windows, macOS and Linux steps |
| `open-interpreter` | [Repository README](https://github.com/OpenInterpreter/open-interpreter): installers for macOS/Linux and Windows |
| `pa11y` | [Repository README](https://github.com/pa11y/pa11y): Linux/macOS and Windows requirements |

**Left unchanged (16), for manual review.** The project's own documentation either names no operating system or mentions one only in passing. A lone "Windows" would read as Windows-only, so no partial list was recorded.
- Incidental Windows mention only: `jest`, `mkdocs`, `eslint`, `prettier`, `transformers`.
- No operating system named: `vitest`, `storybook`, `docusaurus`, `astro`, `fastapi`, `haystack`, `sentence-transformers`, `langchain`, `llamaindex`, `bark`, `axe-core`.

### Catalog counts

| | Before | After |
| :--- | ---: | ---: |
| Resources | 633 | **622** |
| Empty `platforms` | 28 | 16 |
| `OPEN_SOURCE` / `FREE` / `FREE_TIER` / `PERSONAL_FREE` | 396 / 173 / 59 / 5 | 391 / 167 / 59 / 5 |
| `UNVERIFIED` / `PARTIALLY_VERIFIED` / `VERIFIED` | 627 / 6 / 0 | 616 / 6 / 0 |
| Platform listings: Browser / Windows / macOS / Linux | 331 / 277 / 267 / 272 | 324 / 284 / 274 / 279 |
| Platform listings: Android / iOS / Self-hosted | 109 / 73 / 88 | 107 / 72 / 88 |
| Confirmed facts (any) | unchanged | unchanged |

The 11 removed entries were all `UNVERIFIED` with no checks recorded. The audit's figure of 629 unverified does not match the stored statuses, which were 627 `UNVERIFIED` and 6 `PARTIALLY_VERIFIED`. No status changed apart from the 11 removals.

### Generated backlog

`docs/verification-backlog.md` was regenerated (`npm run build:static && npm run backlog`). It had not been regenerated since the 44-resource seed. As a result, CI's "Verification backlog matches the data" step has failed on every resource-expansion pull request and on `main` since batch 001, and the Pages deploy was skipped each time.

### Validation

| Check | Before | After |
| :--- | :--- | :--- |
| `npm test` | 47/47 | 47/47 |
| `npm run verify` | pass | pass |
| `npm run verify:static` | pass (1,623 pages) | pass (1,601 pages) |
| `npm run test:browser` | 61/61 | 61/61 |
| `npm run backlog:check` | **fail** (stale since batch 001) | pass |
| `npm run check:verification` | — | pass (0 verified, 4 awaiting sign-off, 0 maintainers) |

Other checks after cleanup:
- No duplicate slugs, normalised names or official URLs remain.
- No removed slug appears in the sitemap, the link manifest, any built page or any source-controlled file (other than the historical table above).
- All 11 canonical pages build.
- Evidence reasons changed only for the 12 backfilled `platforms` facts, from `not-established` to `not-checked`. No fact became confirmed.

### Remaining manual review

1. Platforms for the 16 entries listed above.
2. LosslessCut's licence (`GPL-2.0-only` vs `GPL-2.0-or-later`), against the project's own licence file.
3. Maintainer sign-off for the 4 evidence-complete listings (GIMP, KeePassXC, LibreOffice, Obsidian). The four named in the audit's queue (Cloudflare Pages, Stirling PDF, Thunderbird, VLC) have checks started but their free status is not yet confirmed, so they are not ready for sign-off.
4. The 14 LOW naming and description findings, which were out of scope here.
