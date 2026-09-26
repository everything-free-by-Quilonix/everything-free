# Architecture

How Everything.Free is put together, and why.

The organising constraint is that the project must run **without paid infrastructure** in its early stage. That is not a background preference — it determines the data layer, the deployment model, the search implementation and the submission flow. Where a decision was made for cost reasons, this document says so.

---

## Current architecture

```
                         Contributors
                              │
                    Pull requests / Issues
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub repository  ·  the content source               │
│                                                         │
│   src/data/resources/*.ts     typed resource entries    │
│   src/data/collections.ts     curated sets              │
│   src/config/*.ts             taxonomies, definitions   │
└─────────────────────────────────────────────────────────┘
                              │
                    GitHub Actions — CI (free runners)
          lint · types · data validation · static export
          browser smoke test · backlog sync
                              │
                              ▼
         next build  →  RSC path fix  →  per-page CSP
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
      240 HTML pages                44 OG images (.png)
      sitemap · robots            link-manifest.json
              │
              ▼  only if CI passed
      GitHub Actions — Deploy to GitHub Pages
              │
              ▼
  everything-free-by-quilonix.github.io/everything-free/
```

There is no database, no API server, no server actions and no per-request rendering. The application is a set of static files.

### What this buys

| | |
| --- | --- |
| **Cost** | Nothing executes at request time, so hosting cannot generate usage charges |
| **Portability** | Served from GitHub Pages; deployable unchanged to Cloudflare Pages, Netlify or any object store |
| **Resilience** | Nothing to fail: no database outage, no cold starts, no rate limits |
| **Auditability** | Every listing's history is a Git history |

### What it costs

| | |
| --- | --- |
| **Search needs JavaScript** | `/resources` filters in the browser. Without JavaScript it still lists the complete library as static HTML — only filtering and ranking are unavailable. Every other page works fully without it |
| **Forms need JavaScript** | With a documented fallback to GitHub's own issue forms |
| **Library ships to the client** | ~43 entries of JSON. This is the scaling limit, and the database trigger |
| **Publishing requires a build** | A correction goes live on the next deploy, not instantly |

---

## Data flow

### Read path

Everything goes through one seam:

```
page / component
      │
      ▼
lib/repository/index.ts        public API — the only thing pages import
      │
      ▼
ResourceDataSource             the interface (lib/repository/types.ts)
      │
      ▼
seed-adapter.ts                in-memory over src/data/resources
```

Rules that hold this together:

- **No component imports `src/data` directly.** Everything reads through the repository.
- **Every repository function is `async`**, even though the seed adapter is synchronous. Introducing a database therefore does not change a single call site.
- **`query()` receives the whole `ResourceQuery`** rather than returning everything for the caller to filter, so a SQL adapter can push filtering, sorting and pagination into the database.
- Reads are wrapped in React's `cache()`, so a page and its `generateMetadata` resolve the same data once per render pass.

### Write path

There is no write path in the application. Data changes are Git commits. See [Submission lifecycle](#submission-lifecycle).

---

## Why no database

The previous milestone proposed a Postgres/Supabase adapter. It was reconsidered and rejected for now.

A database earns its place when it solves a problem you actually have. At 43 resources:

| Need | Database | Git + build |
| --- | --- | --- |
| Structured, typed data | ✅ | ✅ (TypeScript, checked at build) |
| Validation | ✅ (constraints) | ✅ (build fails on invalid data) |
| Version history | ⚠️ (needs audit tables) | ✅ (native) |
| Review before publish | ❌ (needs building) | ✅ (pull requests) |
| Diff of a change | ❌ (needs building) | ✅ (native) |
| Rollback | ⚠️ (needs backups) | ✅ (`git revert`) |
| Attribution | ❌ (needs auth) | ✅ (commit authorship) |
| Query flexibility | ✅ | ⚠️ (in-process, fine at this size) |
| Full-text search at scale | ✅ | ❌ |
| Cost | Free tier with an inactivity pause | Nothing |

Git wins on everything a **resource library** cares about — reviewability, diffability, reversibility, attribution — and loses only on scale, which is not yet a problem. The free tier of a hosted database would also introduce an inactivity pause and a quota, i.e. a dependency, in exchange for capabilities not currently needed.

`ResourceDataSource` stays precisely so this decision can be revisited cheaply.

### Migration trigger

Move to a database when **any** of these becomes true:

1. **The client payload gets uncomfortable.** `/resources` ships the listable library to the browser. Past roughly 500–1,000 entries, that becomes a real download cost and search should move server-side.
2. **Search needs ranking the in-process engine cannot do** — typo tolerance, stemming across languages, synonyms, or sub-100ms response over tens of thousands of rows.
3. **Contributions outgrow pull-request review.** If submissions arrive faster than maintainers can merge them, a moderation queue with state needs real storage.
4. **Something genuinely per-user appears** — saved collections, alerts, personalisation. All require identity, which requires storage.
5. **Build time becomes painful.** Static generation is linear in resource count; tens of thousands of pages will not build in a free CI window.

Until one of those bites, a database would be infrastructure supporting infrastructure.

### Migration path

Phased, so nothing has to happen at once:

- **Phase 1 (now)** — Git-based source. `seedDataSource` implements `ResourceDataSource`.
- **Phase 2** — Add a second adapter implementing the same interface. Keep Git as the authoring format and treat the database as a derived read model, populated by a build step. Data stays reviewable; queries get faster. Switch by changing one line in `lib/repository/index.ts`.
- **Phase 3** — Only if warranted: make the database authoritative, add caching and a dedicated search index. This is the point at which submissions need server-side validation and authentication, and the point at which hosting stops being free.

A database adapter should **not** implement `listAllForClient()`. That method exists for the static-search model and is the thing Phase 2 replaces.

---

## Resource lifecycle

```
SUBMITTED ──► UNDER_REVIEW ──► VERIFICATION_REQUIRED ──► PUBLISHED
                   │                                        │
                   ├──► REJECTED                            ├──► REPORTED ──► (corrected)
                   └──► DUPLICATE                           ├──► OUTDATED ──► (re-verified)
                                                            └──► ARCHIVED
```

These are **workflow** states, tracked as GitHub issue labels and pull-request status. They are deliberately not in the resource schema and not shown to users: a visitor needs to know how much to trust what is in front of them, not where it sits in a maintainer's queue.

The only states users see are the *verification* states, which are a different axis. See [`docs/moderation.md`](moderation.md) for the full workflow and [`docs/verification.md`](verification.md) for the trust model.

---

## Verification lifecycle

Published listings carry a verification status, shown on every card and detail page:

```
UNVERIFIED ──► PARTIALLY_VERIFIED ──► VERIFIED
     │                  │                  │
     └──────────────────┴──────────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
          OUTDATED            REPORTED
      (past 90 days,        (open problem
       computed, not         report against
       stored)               the entry)
```

Two properties matter:

- **`OUTDATED` is derived, not stored.** `effectiveVerification()` downgrades any claim older than `VERIFICATION_FRESHNESS_DAYS` (90) regardless of the stored status. A badge cannot keep asserting confidence it no longer earns.
- **`VERIFIED` is enforced at build time.** It requires every trust-critical check confirmed, at least one official source with a retrieval date, and a named verifier. An entry claiming more than its evidence supports **fails the build**.

Verification is manual by design. No automation in this repository marks anything verified.

---

## Search architecture

```
URL query string          ← the single source of filter state
      │
parseSearchParams()       → ResourceQuery
      │
inferIntent()             → extracts stated constraints from natural language
      │
matchesFilters()          → predicates, AND across filters, OR within each
      │
rankResources()           → weighted scoring, term-count-first ordering
      │
computeFacets()           → counts excluding the facet being counted
      │
paginate()
```

All of it composes in `lib/search/run-search.ts`, which is pure and environment-agnostic. The same function runs in the browser for live filtering and in the repository for any server-side use. **One implementation** means a client-side filter and a server render cannot disagree — the alternative, a simplified client copy, would silently drift from the real ranking.

Filter state lives in the URL, not in component state. Consequences: filtered views are shareable and bookmarkable, the back button works, and the page is server-renderable if that is ever needed again.

### When a real search engine becomes necessary

Not yet, and not for a while. The current engine is a linear scan with field weighting over 43 records — microseconds, and far faster than a network round trip to a search service.

Introduce a dedicated index (Typesense, Meilisearch, Postgres full-text — self-hosted or free-tier) only when:

- the corpus exceeds roughly 10,000 resources, **or**
- typo tolerance and stemming become the top source of failed searches, **or**
- search moves server-side and per-request latency becomes measurable.

Do **not** introduce a paid search API. At the point scale genuinely demands an index, a self-hosted open-source engine or Postgres full-text will handle it, and the cost decision should be made explicitly. Note that the intent extraction in `lib/search/intent.ts` is deterministic phrase matching, not a model — it costs nothing and will keep working regardless of what happens to the ranking layer.

---

## Tool architecture

Everything.Free does not intend to rebuild tools that already exist. The library is the primary answer; the tools section covers only jobs where running locally is genuinely better.

```
config/tools.ts                    registry: metadata, processing, cost, integration type
      │                            └── validated at build time
      ▼
features/tools/components/
      tool-registry.tsx            slug → implementation (static switch)
      tool-privacy.tsx             privacy notice, GENERATED from the registry
      │
      ▼
features/tools/implementations/
      image-converter.tsx          Canvas API
      contrast-checker.tsx         WCAG 2.1 arithmetic
      text-toolkit.tsx             string transforms
```

The load-bearing design decision: **privacy claims are derived from declared metadata, not written as page copy.** A tool declares `processing.location` and `processing.leavesDevice`, and the page renders its disclosure from that. Build-time validation rejects a tool claiming browser-local processing while also admitting data leaves the device, and rejects any tool declaring paid infrastructure.

`ToolSurface` is a static switch rather than a slug-to-component lookup that callers instantiate, because resolving a component reference during render creates a new component identity each render and would reset tool state on every keystroke.

See [`docs/tool-integration.md`](tool-integration.md) for the integration classification and the rules for adding one.

---

## Deployment architecture

Every route is static. The default `next build` produces no server-rendered routes; `npm run build:static` additionally emits a plain `out/` directory.

That second command is the project's architectural assertion: `output: export` **fails** if any route needs a server. CI runs it on every pull request, so a change that reintroduces a server requirement — and therefore a hosting cost — fails before merge rather than being discovered on a bill.

Two post-processing steps run on the export. `scripts/fix-rsc-paths.mjs` works around a Next.js 16 bug that, on Windows builds, writes client-navigation payloads where the router does not look for them. On the Linux runners that build production it finds nothing to fix. `scripts/csp.mjs` writes a hash-based Content Security Policy into each page, because the host cannot send headers.

The site URL decides the base path. On GitHub Pages it is served under `/everything-free/`, and the build derives that prefix from `NEXT_PUBLIC_SITE_URL`, so moving to a root domain is a variable change.

See [`docs/deployment.md`](deployment.md) for the host choice, the CSP and the known limitations.

---

## Zero-cost strategy

| Concern | Approach | Cost |
| --- | --- | --- |
| Content storage | Git repository | Free |
| Content validation | Build-time assertions | Free |
| CI | GitHub Actions on public repo | Free |
| Hosting | GitHub Pages, static files | Free for public repositories, no metered runtime |
| Search | In-process, runs in the browser | Free |
| Submissions | Validated client-side → GitHub issue | Free |
| Moderation | GitHub issues and pull requests | Free |
| Link monitoring | Monthly GitHub Action | Free |
| OG images | Pre-rendered `.png` files at build | Free |
| Verification backlog | Generated from the data, checked in CI | Free |
| Fonts | Self-hosted via `next/font` | Free |
| Analytics | None | Free |
| Tools | Browser-local | Free |
| Email | None | Free |
| Auth | None | Free |

Full per-dependency audit: [`docs/dependency-audit.md`](dependency-audit.md).

The principle is **no mandatory paid infrastructure during the early stage** — not a promise that the project will never cost anything. If a future capability genuinely requires paid infrastructure, that should be an explicit, reversible decision, and the core library should keep working without it.

---

## Failure modes

The application is designed so that the core library survives the loss of anything optional.

| If this fails | Effect |
| --- | --- |
| JavaScript disabled | Library fully browsable. Search filtering and forms unavailable, with documented fallbacks |
| GitHub Pages is down | The site is unavailable until it recovers. GitHub hosts both the site and the contribution workflow, so there is no independent fallback. Recovery elsewhere means building `out/` and uploading it to any static host (see [deployment](deployment.md#deploying-elsewhere)) |
| GitHub Issues or Actions are down | The site keeps serving. New submissions cannot be filed and deploys wait |
| CI fails on `main` | Nothing is deployed; the previous version stays live |
| Link-check workflow fails | Nothing user-facing. A report is missed |
| A listed third party disappears | Its page still renders; the link-check workflow reports it |

There is no database, AI API or analytics service to fail, because none are used.
