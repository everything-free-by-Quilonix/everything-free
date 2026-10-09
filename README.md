# Everything.Free

**The free-resource ecosystem.**
Discover. Compare. Use. Learn. — Free.

A library of genuinely free resources across the internet, where the free status of every entry is stated precisely, the limitations are written down even when they are inconvenient, and you can see when someone last checked.

By [Quilonix](https://github.com/everything-free-by-Quilonix).

**Live site:** <https://everything-free-by-quilonix.github.io/everything-free/>, static files on GitHub Pages, deployed from `main` once CI passes.

---

## Why this exists

There is an enormous amount of genuinely free, genuinely good software and learning material on the internet. Finding it is the problem. Search results for "free" anything are dominated by paid products with trials, listicles chasing affiliate revenue, and directories that stopped being accurate years ago.

Everything.Free is an attempt at the opposite.

| | |
| --- | --- |
| **Not** an affiliate site | No referral links, sponsored placements or paid listings |
| **Not** a review site | No ratings or scores — that would need data we do not collect |
| **Not** a download host | Links go to the provider's own site, always |
| **Not** a piracy resource | Nothing here circumvents payment, licensing or access controls |
| **Not** the owner of anything listed | Every resource belongs to whoever made it |

---

## Core philosophy

1. **"Free" is defined precisely.** Eight classifications, not one word. A trial is never described as free.
2. **Limitations are shown.** Any status with conditions attached *must* document them — the build fails otherwise.
3. **"Unknown" is a valid answer.** Facts nobody has checked are marked unverified rather than guessed at.
4. **Claims are dated.** Every entry shows when it was last checked, and goes stale visibly.
5. **Official sources are preferred.** Links point at the provider, not a mirror or an aggregator.
6. **No fabricated content.** No fake reviews, ratings, user counts, testimonials or "trusted by" logos. Sections with no data show honest empty states.
7. **Don't rebuild what exists.** The library is the primary answer; tools are integrated only where running locally is genuinely better.

These are not aspirations in a document. Several are enforced in code — see [Data integrity](#data-integrity).

---

## Zero-cost philosophy

Everything.Free is intentionally built to run **without paid infrastructure** in its early stage. That is an architectural constraint, not a cost-saving afterthought, and it shapes real decisions:

- **No database.** Resource data lives in the Git repository as typed, validated modules. Git already provides structure, review, diffs, history, rollback and attribution — everything a resource library needs. See [why](docs/architecture.md#why-no-database).
- **No server.** Every route is statically generated. There are no server actions, no runtime API routes and no per-request rendering, so nothing executes when someone visits and hosting cannot generate usage charges.
- **Browser-side processing.** Search filtering and all the tools run on the user's own device. That makes them free to operate and, for the tools, genuinely private.
- **GitHub as infrastructure.** Submissions, corrections, moderation, CI and scheduled maintenance all run on facilities that are free for public repositories.
- **Open source, self-hosted assets.** Fonts are self-hosted, icons are hand-authored, OpenGraph images are pre-rendered at build time. No third-party request is made on any page.
- **No optional service becomes a hard dependency.** There is no analytics, error tracking, email, authentication, image CDN or AI API to fail or bill.

The constraint is enforced rather than trusted. `npm run build:static` uses `output: "export"`, which **fails if any route requires a server** — and CI runs it on every pull request. A change that would quietly acquire a hosting requirement fails before merge. Likewise, a tool declaring paid infrastructure fails the build.

**What this does not claim.** Not "everything will be free forever". Hosting a domain costs money, and some future capability may genuinely justify paid infrastructure. The commitment is narrower and keepable:

> The project is built to operate without mandatory paid infrastructure during its early stage, and the core library should keep working even if an optional service is unavailable.

If that ever changes, it should be a deliberate, reversible, documented decision — not something discovered on an invoice. The full breakdown is in [`docs/dependency-audit.md`](docs/dependency-audit.md).

---

## The free-status system

Every resource carries exactly one status.

| Status | Meaning |
| --- | --- |
| `FREE` | Usable in full without payment, with no time limit |
| `FREE_TIER` | A permanent free plan exists, with capped usage or features |
| `OPEN_SOURCE` | Source published under an identifiable open-source licence |
| `PERSONAL_FREE` | Free for personal use; commercial use restricted |
| `LIMITED_FREE` | Real free capability, but significant limits apply |
| `TRIAL` | Temporary free access that expires — **never** called free |
| `NOT_FREE` | No meaningful free use; excluded from listings |
| `UNKNOWN` | Free status not yet established |

`FREE_TIER`, `LIMITED_FREE`, `PERSONAL_FREE` and `TRIAL` are required to document at least one limitation. This is checked at build time, not left to reviewer discretion.

Definitions live in [`src/config/free-status.ts`](src/config/free-status.ts) and are the single source for badge text, filter labels, the submission form and the public [`/free-status`](src/app/free-status/page.tsx) page — so the vocabulary cannot drift between them.

### Verification

| Status | Meaning |
| --- | --- |
| `VERIFIED` | Every required fact confirmed against official sources, and signed off by a named maintainer |
| `PARTIALLY_VERIFIED` | Headline status correct; at least one detail unconfirmed |
| `UNVERIFIED` | In the library, not yet checked by anyone |
| `OUTDATED` | Last verified beyond the freshness window |
| `REPORTED` | An open report against this entry |

A verification older than 90 days is **automatically** displayed as needing a re-check, whatever the stored status says. A badge reading "Verified" against a two-year-old date is worse than no badge.

Verification is recorded **one check at a time**, not as a single judgement. For each of twelve checks a verifier records whether it was confirmed or could not be settled, what the official source actually says, and which page says it. Every source is dated. A resource page summarises the result ("9 of 10 required checks confirmed") and opens the full evidence on request, so the badge can be interrogated rather than taken on trust.

`VERIFIED` requires all ten required checks confirmed, each citing a dated official source, **and sign-off by a maintainer listed in [`src/config/maintainers.ts`](src/config/maintainers.ts)**. `PARTIALLY_VERIFIED` requires at least the free status confirmed that way; anything less is `UNVERIFIED`. All of this is enforced at build time. An entry claiming more than its evidence supports fails the build, and so does a `VERIFIED` badge awarded by a script, bot or AI assistant. Automated passes may gather evidence, but a person signs off.

> **Where the library stands:** **nothing is marked `VERIFIED`**, because no maintainer has registered or signed anything off yet. Four entries — Obsidian, GIMP, LibreOffice and KeePassXC — have all ten required checks confirmed against official pages and are awaiting sign-off. Supabase and Autodesk Fusion have nine; neither vendor documents whether a card is needed, so that field says "unknown". Four more have had their official URL checked. The other 34 were compiled from each project's own documentation, have no checks recorded, and are shown as Unverified with no verification date.
>
> The work queue is [`docs/verification-backlog.md`](docs/verification-backlog.md), generated from the data and kept in sync by CI.

**A recorded value is not a confirmed fact.** The badge describes the whole listing. Separately, every trust-sensitive fact (free status, account, credit card, commercial and personal use, open source, licence, platforms, limitations, free-tier limits, pricing) carries its own evidence state, derived from the recorded checks: **Confirmed**, **Not verified** (a value is recorded but nobody has checked it), **Needs re-checking**, **Not confirmed** (checked, could not be settled) or **Unknown**. Cards only state a value on their "Confirmed" line; everything else is named without a reassurance. Resource pages show each value next to its evidence, with the source, the date it was read and who checked it. Filters such as "No credit card" match **confirmed facts only**, and say how many listings they held back. See [Resource status and fact evidence](docs/verification.md#resource-status-and-fact-evidence).

---

## Features

**Library**
- Resource model covering free status, licensing, platforms, requirements, limitations and verification
- 8 category groups over a flat, canonically-slugged taxonomy of 72 categories
- 27 resource types
- 44 hand-written resources — small on purpose, because the aim is the most trustworthy way to find free resources, not the largest list of them
- Curated collections with a stated rationale for each selection
- "Free alternatives to X" pages, derived automatically from the library
- Audience views (students, creators, developers, small businesses, researchers) that resolve to live queries rather than hand-maintained lists

**Search**
- Weighted relevance scoring across name, alternatives, tags, category, description and features
- **Explainable results** — every match states why it matched
- Deterministic natural-language constraint extraction: *"free AI voice generator without a credit card"* becomes search terms plus a confirmed-only no-credit-card filter, shown to the user and removable
- Confirmed-fact filters (open source, no account, no credit card, commercial use, personal use) match only facts an official source confirms, and report how many listings record the value without confirmation
- AND-first matching with an OR fallback, so a narrow query degrades to near misses rather than a dead end
- Faceted filtering with live counts, entirely URL-driven — shareable and bookmarkable. Runs in the browser so the page stays static; the rest of the library works without JavaScript

**Tools**
- Eight working utilities that run **entirely in your browser**: a private AI chat (open-source models under 500 MB running on your own device via WebLLM; nothing you type leaves it), free-trial cancel reminder (calendar file), subscription audit with free-alternative matching, image converter/compressor, photo metadata (EXIF/GPS) viewer and lossless remover, colour palette extractor, WCAG contrast checker, text toolkit
- **"Which free AI should I use?"** at `/ai`: pick the job, and the finder shows the library's AI listings for it, with confirmed-only "no credit card / no account / open source" filters
- Privacy disclosure generated from declared processing metadata, validated at build time so a tool cannot claim local processing while sending data away

**Platform**
- Dark-first design system with light mode, built on semantic colour tokens
- WCAG 2.1 AA targeted throughout
- Per-page metadata, OpenGraph, canonical URLs, JSON-LD, sitemap, robots, generated OG images
- 240+ statically prerendered pages

---

## Architecture

Full detail in [`docs/architecture.md`](docs/architecture.md). In brief: contributors open pull requests, GitHub Actions validates the data, `next build` produces static files, and a free static host serves them. No database, no server, no runtime.

| Document | Covers |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | Data flow, lifecycles, search, tools, deployment, zero-cost strategy, database migration trigger |
| [`docs/verification.md`](docs/verification.md) | The trust model, the checklist, how to verify an entry |
| [`docs/moderation.md`](docs/moderation.md) | Resource lifecycle and editorial workflow |
| [`docs/deployment.md`](docs/deployment.md) | GitHub Pages hosting, the base path, the CSP, limitations, deploying elsewhere |
| [`docs/verification-backlog.md`](docs/verification-backlog.md) | Generated verification work queue |
| [`docs/tool-integration.md`](docs/tool-integration.md) | Integration classification and rules for adding a tool |
| [`docs/dependency-audit.md`](docs/dependency-audit.md) | Every dependency and service, and what happens without it |

```
src/
├── app/                      # Routes (App Router)
│   ├── resources/[slug]/     # Resource detail — statically prerendered
│   ├── categories/[slug]/    # Category listings
│   ├── collections/[slug]/   # Curated sets
│   ├── alternatives/[slug]/  # Free alternatives to a paid product
│   ├── tools/[slug]/         # Integrated tools
│   ├── for/[audience]/       # Audience views
│   ├── submit/ report/       # Community contribution
│   ├── free-status/ verification/   # Trust documentation
│   └── sitemap.ts robots.ts api/og/
├── components/
│   ├── icons/                # Hand-authored inline icon set — no icon dependency
│   ├── layout/               # Header, footer, nav, theme
│   ├── seo/                  # JSON-LD rendering
│   └── ui/                   # Primitives
├── config/                   # Taxonomies and definitions (build-time validated)
├── data/                     # Structured seed data
├── features/                 # Domain features: resources, search, tools, community…
├── lib/
│   ├── repository/           # Data-access abstraction
│   ├── search/               # Scoring, filters, intent, URL serialisation
│   ├── resources/            # Derived values
│   ├── seo/                  # Metadata and structured data
│   └── utils/
└── types/                    # Domain model
```

### Key decisions

**The repository abstraction.** Every read goes through [`lib/repository`](src/lib/repository/index.ts), backed by a [`ResourceDataSource`](src/lib/repository/types.ts) interface. The seed adapter implements it in memory; a Postgres or Supabase adapter would implement the same methods with SQL. `query()` receives the entire `ResourceQuery` rather than returning everything for the caller to filter, so a future SQL adapter can push filtering, sorting and pagination into the database. **No component imports seed data directly.** Switching storage is one line.

**Categories are flat, groups are orderings.** Several categories legitimately belong under more than one heading — Books is both education and media; Music is both creative and entertainment. Nesting categories inside groups would force duplicate entries and therefore duplicate URLs for the same content. A flat set with many-to-many group membership gives exactly one canonical page per category.

**Tri-state facts, not booleans.** `requiresAccount`, `commercialUse` and similar fields are `'yes' | 'no' | 'unknown'`. Storing `false` when nobody has checked is a claim the project cannot support, so the UI renders `'unknown'` as "Unknown" rather than silently as "No". A stored `'no'` is not treated as a confirmed no either: until its check is confirmed it reads "Recorded as no · Not verified". Confirmed-fact filters exclude both.

**Evidence is derived, not stored.** Each fact's evidence state comes from exactly one recorded check ([`lib/resources/evidence.ts`](src/lib/resources/evidence.ts)), with no inference across checks, so the cards, pages, filters, structured data and link manifest cannot disagree about what is confirmed.

**Derived values are not stored.** `browserAvailable`, `desktopAvailable` and `mobileAvailable` are computed from `platforms`, so the two can never contradict each other.

**URL-driven filter state.** Filters live in the query string, not component state. Any filtered view is shareable, and the back button works. Filtering executes in the browser through the same `runSearch` function the server uses, so results cannot diverge. The listing page is not indexed per-query, so thin permutations do not compete with the pages meant to rank.

**No usage metrics, anywhere.** There is no rating, review count, download count or view count in the model. The homepage's "Popular free resources" is an editorial selection and the UI says so.

**No third-party logos.** Resource marks are generated monograms. Hotlinking vendor logos would mean redistributing trademarked artwork without licence, adding a third-party request to every card, and shipping broken images when they move.

### Data integrity

Invalid data fails `next build` rather than shipping. Validation covers:

- Duplicate slugs; `id`/`slug` mismatches
- Unknown categories, subcategories, or a subcategory repeating the primary category
- A conditional free status with **no documented limitations**
- A `VERIFIED`/`PARTIALLY_VERIFIED` entry with no verification notes
- **`VERIFIED` without a maintainer's `@handle`, a date, dated sources, or all ten required checks confirmed**
- A confirmed check that cites no source, or cites a page missing from the entry's sources
- Open-source entries with no recorded licence; non-HTTPS official URLs
- **Impossible evidence states** — a confirmed check whose value is `unknown`, a confirmed free status of `UNKNOWN`, a confirmed licence or platform check with nothing recorded, `OPEN_SOURCE` with `openSource: false`, `PERSONAL_FREE` with commercial use `yes`, a tag such as `no-signup` that restates a fact without its evidence
- Dangling `relatedResources` and collection references
- Taxonomy contradictions — a group listing a category that does not claim it, or vice versa
- **Tools declaring browser-local processing while also admitting data leaves the device**

---

## Getting started

Requires Node.js 20.9+ to build, and 22.18+ for `npm test` (it uses Node's built-in test runner and TypeScript type stripping, so there is no test framework to install).

```bash
npm install
npm run dev     # http://localhost:3000/everything-free/  (base path comes from NEXT_PUBLIC_SITE_URL)
```

```bash
npm run build          # production build; runs all data validation
npm run build:static   # fully static export to out/ — fails if any route needs a server
npm run start          # serve the production build
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # unit tests: evidence states, confirmed-only filters, impossible-state rules
npm run verify         # lint + typecheck + unit tests + build
npm run verify:static  # lint + typecheck + unit tests + static export
npm run test:browser   # loads the export in local Chrome: routes, CSP, navigation, tools, forms, mobile, no-JS
```

Maintenance, after a `build:static`:

```bash
npm run backlog              # regenerate docs/verification-backlog.md (CI checks it with backlog:check)
npm run worksheet -- <slug>  # every check for one resource: evidence, source, date read, what is still open
npm run check:verification   # freshness and completeness summary (no network requests)
npm run check:links          # external link health (paced, honours robots.txt, applies .github/link-triage.json)
```

### Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site. Sets canonicals, the sitemap, OpenGraph URLs **and the base path** the build is served under | `https://everything-free-by-quilonix.github.io/everything-free` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console ownership token (optional; public by design) | unset |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools ownership token (optional; Bing's index also feeds ChatGPT search and Copilot) | unset |

The build also writes [`/llms.txt`](https://llmstxt.org) and `/llms-full.txt`: a Markdown digest of the library, with every fact's evidence state, for AI assistants.

No API keys or database are required.

---

## Tech stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Server Components) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 with CSS-variable design tokens |
| Validation | Zod 4 — **only** at the untrusted-input boundary |
| Fonts | Inter and Source Serif 4, self-hosted via `next/font` |
| Icons | Hand-authored inline SVG set |
| Data | Typed modules in the Git repository — no database |
| Hosting | GitHub Pages, static files only — portable to any static host |

Runtime dependencies: React, Next.js, Zod, and WebLLM for the private AI chat only (loaded on demand, never on other pages). Icons, class-name joining, theming, date formatting and the other tools are all implemented directly rather than pulled in, which keeps the JavaScript shipped to a reader close to the minimum and the supply chain small enough to audit.

No page makes a third-party network request on load. The private AI chat downloads its model from Hugging Face and GitHub when the visitor presses Download, and that page's CSP allows exactly those origins.

---

## Contributing

The library cannot be maintained by one person — free plans change too often. Corrections are the single most valuable contribution, because a wrong entry is worse than a missing one.

- [CONTRIBUTING.md](CONTRIBUTING.md) — submission format, review standards, how to verify an entry
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)

Submissions are accepted through the in-app form (which validates against the same rules and hands back a prefilled issue) or directly as a GitHub issue.

A submission needs: a working official link, an accurate free status, a stated reason for listing, and honest limitations.

---

## Roadmap

**Phase 1 — Foundation** ✅
Design system, homepage, search, categories, resource pages, tool architecture, seed data, SEO, accessibility, documentation.

**Phase 2 — Zero-cost infrastructure and trust foundation** ✅
Fully static architecture with no server runtime, verification checklist model with build-time enforcement, GitHub-based contribution and moderation workflow, scheduled link-health and verification-backlog reporting, documented dependency audit and deployment options.

**Phase 3 — Production pipeline and verification** *(in progress)*
Done: GitHub Pages production deployment gated on CI, a hash-based CSP, a browser smoke test in CI, per-check verification records with a human sign-off gate, and a generated backlog. Next: work the backlog. Maintainers sign off entries whose evidence is complete, then confirm the rest against official sources. This is human work and the highest-value thing the project can do. A database is explicitly *not* the next step — see the [migration trigger](docs/architecture.md#migration-trigger).

**Phase 4 — Integrated tools**
More browser-local utilities, prioritising genuine usefulness, permissive licensing and privacy. See the [integration model](docs/tool-integration.md).

**Phase 5 — Intelligent discovery**
Natural-language search beyond the current deterministic constraint extraction. Any model-based layer must be optional: keyword search has to keep working without it, and no paid AI API may become a hard dependency.

**Phase 6 — Ecosystem**
Browser extension, mobile app, public API, free-status change monitoring. A database becomes plausible around here — but only when a [migration trigger](docs/architecture.md#migration-trigger) is actually met.

---

## Licence

Source code: [MIT](LICENSE).

Resource listings describe products owned and operated by their respective providers. A listing is not an endorsement, partnership or affiliation. Licence information in the library is a summary, not legal advice — confirm anything you intend to rely on with the provider.

---

## Quilonix

Everything.Free is a [Quilonix](https://github.com/everything-free-by-Quilonix) project, developed in the open. It is built to stand on its own: you should never need to know about the parent organisation to use it.

The source being public means the classification rules, the seed data, and the validation that enforces them can all be read and challenged.
