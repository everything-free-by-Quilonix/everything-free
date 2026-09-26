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

`VERIFIED` requires all ten required checks confirmed, each citing a dated official source, **and sign-off under a maintainer's GitHub handle**. Both are enforced at build time. An entry claiming more than its evidence supports fails the build, and so does a `VERIFIED` badge awarded by a script, bot or AI assistant. Automated passes may gather evidence, but a person signs off.

> **Where the library stands:** **nothing is marked `VERIFIED`**, because no maintainer has signed anything off yet. Three entries have been re-checked against official pages only, with every check recorded. Obsidian has all ten required checks confirmed and is awaiting sign-off. Supabase and Autodesk Fusion have nine; neither vendor documents whether a card is needed, so that field says "unknown". The other forty entries were compiled from each project's own documentation and have no per-check records yet.
>
> The work queue is [`docs/verification-backlog.md`](docs/verification-backlog.md), generated from the data and kept in sync by CI.

---

## Features

**Library**
- Resource model covering free status, licensing, platforms, requirements, limitations and verification
- 8 category groups over a flat, canonically-slugged taxonomy of 72 categories
- 27 resource types
- 43 hand-written seed resources — small on purpose, because a directory's value is accuracy, not size
- Curated collections with a stated rationale for each selection
- "Free alternatives to X" pages, derived automatically from the library
- Audience views (students, creators, developers, small businesses, researchers) that resolve to live queries rather than hand-maintained lists

**Search**
- Weighted relevance scoring across name, alternatives, tags, category, description and features
- **Explainable results** — every match states why it matched
- Deterministic natural-language constraint extraction: *"free AI voice generator without a credit card"* becomes search terms plus a no-credit-card filter, shown to the user and removable
- AND-first matching with an OR fallback, so a narrow query degrades to near misses rather than a dead end
- Faceted filtering with live counts, entirely URL-driven — shareable and bookmarkable. Runs in the browser so the page stays static; the rest of the library works without JavaScript

**Tools**
- Three working utilities that run **entirely in your browser**: image converter/compressor, WCAG contrast checker, text toolkit
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

**Tri-state facts, not booleans.** `requiresAccount`, `commercialUse` and similar fields are `'yes' | 'no' | 'unknown'`. Storing `false` when nobody has checked is a claim the project cannot support, and the UI renders `'unknown'` as "Not verified" rather than silently as "No". Strict filters exclude unknowns deliberately.

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
- Dangling `relatedResources` and collection references
- Taxonomy contradictions — a group listing a category that does not claim it, or vice versa
- **Tools declaring browser-local processing while also admitting data leaves the device**

---

## Getting started

Requires Node.js 20.9+.

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
npm run verify         # lint + typecheck + build
npm run verify:static  # lint + typecheck + static export
npm run test:browser   # loads the export in local Chrome: routes, CSP, navigation, tools, forms, mobile, no-JS
```

Maintenance, after a `build:static`:

```bash
npm run backlog              # regenerate docs/verification-backlog.md (CI checks it with backlog:check)
npm run check:verification   # freshness and completeness summary (no network requests)
npm run check:links          # external link health (paced, honours robots.txt)
```

### Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site. Sets canonicals, the sitemap, OpenGraph URLs **and the base path** the build is served under | `https://everything-free-by-quilonix.github.io/everything-free` |

No other configuration, no database and no API keys are required.

---

## Tech stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, Server Components) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 with CSS-variable design tokens |
| Validation | Zod 4 — **only** at the untrusted-input boundary |
| Fonts | Inter and Manrope, self-hosted via `next/font` |
| Icons | Hand-authored inline SVG set |
| Data | Typed modules in the Git repository — no database |
| Hosting | GitHub Pages, static files only — portable to any static host |

Runtime dependencies: React, Next.js and Zod. That is the whole list. Icons, class-name joining, theming, date formatting and the tools are all implemented directly rather than pulled in, which keeps the JavaScript shipped to a reader close to the minimum and the supply chain small enough to audit.

No page makes a third-party network request.

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
