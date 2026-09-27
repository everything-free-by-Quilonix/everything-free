# Dependency and service audit

Every external dependency, and whether the application would still work without it.

The question each entry answers: **could this ever produce a bill, a quota, or an outage we cannot absorb?**

Audited against the codebase, not from memory. Verified by `grep` for `fetch(`, `process.env`, `"use server"`, remote asset URLs, analytics and tracking identifiers.

---

## Summary

| | |
| --- | --- |
| Runtime npm dependencies | 4 |
| External services required | **0** |
| External services optional | 2 (GitHub, static host) |
| Paid services | **0** |
| Third-party network requests at runtime | **0** |
| Outbound requests made by the app | **0** |
| Analytics / tracking | **0** |

No `fetch()` call exists anywhere in `src/`. The only environment variable read is `NEXT_PUBLIC_SITE_URL`.

---

## npm dependencies

### Runtime

| Package | Purpose | Required | Cost | Removable |
| --- | --- | --- | --- | --- |
| `next` | Framework, static generation, routing | Yes | Free, MIT | No |
| `react` | UI | Yes | Free, MIT | No |
| `react-dom` | DOM renderer | Yes | Free, MIT | No |
| `zod` | Runtime validation of submitted form input | Yes | Free, MIT | Could be hand-written; not worth it |

That is the entire runtime dependency list. Icons, class-name joining, theming, date formatting and all three browser tools are implemented directly rather than pulled in — each was a deliberate decision to avoid a dependency for something small.

### Development

| Package | Purpose | Ships to users |
| --- | --- | --- |
| `typescript` | Type checking | No |
| `eslint`, `eslint-config-next` | Linting | No |
| `tailwindcss`, `@tailwindcss/postcss` | Styling, compiled at build | CSS only |
| `@types/*` | Type definitions | No |

### Build and test tooling that is not an npm package

- **Node's built-in test runner** (`node --test`), for `npm test`. Test files are TypeScript, run through Node's own type stripping (Node 22.18+). A small resolver hook in `scripts/test/` maps the `@/` import alias and extensionless imports the way the bundler does. No Vitest, Jest or ts-node, and nothing to install.
- **Chrome**, for `npm run test:browser`. The smoke test drives whatever Chrome is already installed, over the DevTools protocol, with no Puppeteer or Playwright download. CI uses the Chrome preinstalled on GitHub's Ubuntu runners.
- **GitHub Actions** from the `actions/` organisation only (`checkout`, `setup-node`, `upload-artifact`, `configure-pages`, `upload-pages-artifact`, `deploy-pages`), on their current major versions. No third-party actions.

### Supply-chain posture

- Versions are pinned for `next`, `react`, `react-dom` and `zod`; `npm ci` in CI installs exactly the lockfile.
- Four runtime packages, all widely used and actively maintained.
- No `postinstall` scripts from third parties.
- Adding a fifth runtime dependency needs an argument in the pull request.

---

## External services

### GitHub — optional at runtime, used for contribution

| | |
| --- | --- |
| **Purpose** | Source hosting, CI, deployment, hosting (Pages), submission and moderation queue, scheduled maintenance |
| **Required?** | As the current host, yes. The built site itself has no dependency on GitHub, and runs unchanged on another static host |
| **Free option** | Actions and Pages are free for public repositories |
| **Limitation** | Standard runners are free only while the repository is public. Workflows run on push, on pull requests and monthly |
| **Fallback** | Any Git host plus any CI. Submissions could move to email or a form |
| **Works without it?** | **Not while it is also the host.** A GitHub Pages outage takes the site down. An Issues or Actions outage does not: the site keeps serving and only contributions and deploys wait. Re-hosting `out/` elsewhere needs no code change |

Outbound links to GitHub are ordinary links the user chooses to follow.

### Static host — required, interchangeable

| | |
| --- | --- |
| **Purpose** | Serving files |
| **Required?** | Yes — something has to serve the site |
| **In use** | **GitHub Pages**, free for public repositories, deployed by Actions after CI passes |
| **Limitation** | 1 GB site size, 100 GB/month soft bandwidth limit, no custom response headers |
| **Fallback** | Cloudflare Pages, Netlify, or any static file server. The output is plain HTML with no provider-specific features |
| **Works without it?** | Not applicable, but **no lock-in**. Switching needs one environment variable (`NEXT_PUBLIC_SITE_URL`) and no code change |

See [`docs/deployment.md`](deployment.md).

---

## Services deliberately not used

| Service | Why not |
| --- | --- |
| **Database** (Supabase, Postgres, PlanetScale) | Not needed at 44 resources. Git provides review, diffs, history and rollback for free. See the [migration trigger](architecture.md#migration-trigger) |
| **Search** (Algolia, Elastic, Typesense Cloud) | In-process search over 44 records is faster than a network call. [When this changes](architecture.md#when-a-real-search-engine-becomes-necessary) |
| **AI APIs** | Natural-language search is deterministic phrase matching with no model. A paid API would make a core feature cost money per use |
| **Analytics** (GA, Plausible, PostHog) | Would contradict the privacy position and add a third-party request to every page. The project does not need to know what visitors do |
| **Error tracking** (Sentry) | Would send data off-device on error. The route error boundary logs to the console |
| **Email** (Resend, SendGrid) | No transactional email. Submissions go through GitHub |
| **Auth** (Auth0, Clerk) | No accounts, so no authentication |
| **Image CDN** (Cloudinary, imgix) | No raster images to serve. Marks are generated monograms |
| **Font CDN** (Google Fonts hosted) | Fonts are self-hosted via `next/font`, so no third-party request and no regulatory exposure |
| **CMS** (Contentful, Sanity) | The repository is the CMS |
| **Monitoring** (Pingdom, Better Uptime) | Static hosting has little to monitor. A free uptime check could be added later without code changes |

---

## Runtime network behaviour

What the browser requests when someone loads a page:

| Request | Origin | Notes |
| --- | --- | --- |
| HTML | Own host | Static file |
| CSS | Own host | One compiled stylesheet |
| JavaScript | Own host | Framework + client components |
| Fonts | Own host | Self-hosted WOFF2 via `next/font` |
| Images | — | None. Marks are inline SVG and CSS |

**No third-party request is made on any page.** Visiting Everything.Free does not tell any other company that you did.

Outbound links carry `rel="noopener noreferrer"`, so following one does not tell the destination which page you came from.

---

## Cost risk register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Traffic exceeds GitHub Pages' 100 GB/month soft limit | Low | GitHub asks the project to reduce load or move. It does not bill | Pages are ~65 MB in total and cache well. The export moves to Cloudflare Pages (unmetered bandwidth) with one environment variable |
| The repository is made private | Low | Pages needs a paid plan; Actions minutes become metered | Keep it public. It is an open-source project |
| A workflow is moved to a larger runner | Low | Larger runners are always billed | All workflows use `ubuntu-latest`, a standard runner |
| A dependency adds telemetry in a new version | Low | Privacy claims become false | Pinned versions; upgrades reviewed |
| Someone adds a server action or API route | Medium | Site stops being static, acquires a runtime | `build:static` in CI fails on this |
| Someone adds a paid third-party API | Low | Direct cost | Build rejects a tool declaring paid infrastructure |
| A scheduled workflow is made too frequent | Low | Rate-limiting by listed sites, reputational harm | Monthly schedules, `robots.txt` honoured, requests paced |

The two medium-to-notable risks both have automated guards rather than relying on reviewer vigilance.

---

## Re-running this audit

```bash
# Runtime dependencies
npm ls --omit=dev --depth=0

# Any outbound request, env read, or server-only code
grep -rnE "fetch\(|process\.env|\"use server\"" src/

# Analytics or third-party scripts
grep -rniE "gtag|analytics|googletagmanager|plausible|posthog|sentry" src/

# Remote assets
grep -rnE "https?://[^\"']+\.(png|jpe?g|svg|woff2?)" src/

# Proves no route needs a server
npm run build:static
```

Worth repeating whenever a dependency is added or a hosting decision is revisited.
