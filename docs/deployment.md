# Deployment

The application produces static files and nothing else. With nothing executing at request time, hosting cannot generate a usage bill, and the project is not tied to one provider's free tier.

**Production host: GitHub Pages**, as a project site:

```
https://everything-free-by-quilonix.github.io/everything-free/
```

The project does not own a custom domain and does not need one.

---

## What the build produces

```bash
npm run build          # every route static; keeps `next start` available
npm run build:static   # the deployable export in out/
```

`build:static` (`scripts/build-static.mjs`) runs three steps:

1. `next build` with `output: "export"`. **This fails if any route needs a server** — a server action, an API route, per-request rendering. CI runs it on every pull request, so a change that reintroduces a server requirement fails before merge rather than turning up as a cost later.
2. `scripts/fix-rsc-paths.mjs` works around a Next.js 16 export bug ([vercel/next.js#85374](https://github.com/vercel/next.js/issues/85374)). The bug writes client-navigation payloads to nested paths the router never requests, so every client-side navigation silently degrades to a full page load. It shows up on **Windows builds only**: a Windows export needed 237 files copied to the right paths, while the Linux runners that build production needed none. The script is idempotent and does nothing where the export is already correct, so it is safe everywhere and keeps local Windows builds testable.
3. `scripts/csp.mjs` — writes a per-page Content Security Policy into every HTML file ([below](#content-security-policy)).

Current output:

| | |
| --- | --- |
| HTML pages | 244 |
| OpenGraph images | 45 real `.png` files under `/og/` |
| Total size | ~67 MB, 1,782 files on a Windows build (Pages limit: 1 GB) |
| Server runtime, API routes, server actions | **None** |

---

## Why GitHub Pages

One host, chosen on what was actually available at ₹0:

| | GitHub Pages |
| --- | --- |
| Cost | Free for public repositories |
| Build and deploy | GitHub Actions — free on standard runners in public repositories |
| Bandwidth | Soft limit of 100 GB/month. Exceeding it gets a request from GitHub to reduce load, not a bill |
| Site size | 1 GB published limit |
| Accounts needed | None beyond the GitHub organisation that already hosts the code |
| Custom response headers | **Not supported** |

Cloudflare Pages was the previous recommendation because it honours `public/_headers` and does not meter bandwidth. It was not chosen because it needs a separate account for the organisation, and everything else it offered has been solved inside the build:

| Former GitHub Pages gap | How it is handled now |
| --- | --- |
| No CSP header | A hash-based CSP in a `<meta>` tag on every page, which works on any host |
| OG images without a file extension served as the wrong type | OG images are emitted as real `.png` files |
| Site under a subpath | The base path is derived from the site URL at build time |

What remains is listed under [limitations](#limitations-on-github-pages). Moving hosts later needs no code change — see [elsewhere](#deploying-elsewhere).

Limits are from [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) and [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), read 2026-09-26. Free tiers change — the same standard this project applies to the resources it lists.

---

## How a deployment happens

```
push to main ─► CI (lint, types, build + data validation, static export,
                    browser smoke test, backlog sync)
                  │
                  └─ success ─► Deploy to GitHub Pages (builds the same commit, publishes out/)
```

- `.github/workflows/deploy-pages.yml` is triggered by **CI completing on `main`**, and runs only if CI succeeded on a push. A commit that fails any check is never published, and the commit deployed is the one CI tested.
- It builds with `NEXT_PUBLIC_SITE_URL` set to the Pages URL reported by `actions/configure-pages`, or the `SITE_URL` repository variable if one is set.
- It can be re-run by hand (Actions → Deploy to GitHub Pages → Run workflow).

Repository settings it depends on: **Settings → Pages → Source: GitHub Actions**.

---

## The site URL and the base path

One value decides everything location-dependent: `NEXT_PUBLIC_SITE_URL` (`src/config/deployment.ts`).

| Site URL | Base path | Asset and link prefix |
| --- | --- | --- |
| `https://everything-free-by-quilonix.github.io/everything-free` | `/everything-free` | `/everything-free/_next/…` |
| `https://example.org` | *(none)* | `/_next/…` |
| `http://localhost:3000` | *(none)* | `/_next/…` |

The base path is derived from the URL's path, so the two cannot disagree. It is baked in at build time along with canonical URLs, the sitemap and OpenGraph tags, none of which a static host can correct per request.

When unset, it defaults to the GitHub Pages URL above — never to a domain the project does not own, which would publish canonical URLs and a sitemap pointing at someone else's site.

`<Link>` and the router add the base path themselves. Anything that bypasses them — a plain `<form action>`, a raw `<a href>` — must use `withBasePath()`, or it points at the domain root and 404s on a project site. The browser smoke test catches that.

---

## Content Security Policy

GitHub Pages cannot send response headers, so the policy travels inside each page:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'sha256-…' …">
```

`scripts/csp.mjs` hashes every inline script on each page — the theme bootstrap, JSON-LD blocks and the framework's hydration payload — and writes a policy allowing exactly those. **Scripts need no `'unsafe-inline'`.** The build fails if any page contains an inline event handler or a `javascript:` URL, since neither can be hashed.

| Directive | Value | Why |
| --- | --- | --- |
| `script-src` | `'self'` + per-page hashes | No inline script runs unless it was in the build |
| `style-src-elem` | `'self'` | Blocks injected `<style>` elements |
| `style-src-attr` | `'unsafe-inline'` | React renders `style={{…}}` as attributes, which hashes cannot cover. The documented residual gap — style injection is far weaker than script injection |
| `img-src` | `'self' data: blob:` | `blob:` is the image converter's local output |
| `connect-src` | `'self'` | Client navigation fetches pre-rendered payloads from the same origin, nothing else |
| `object-src` / `base-uri` / `form-action` | `'none'` / `'self'` / `'self'` | |

Hashes are recomputed on every build, so framework upgrades cannot silently invalidate them. A wrong hash disables all interactivity without any visible error, which is why CI loads real pages in a browser and fails on any CSP violation.

---

## Limitations on GitHub Pages

- **No response headers.** `frame-ancestors`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `X-Content-Type-Options` cannot be set: browsers ignore `frame-ancestors` in a `<meta>` policy. The site can therefore be framed by another site. It has no accounts, sessions or state-changing actions, so there is nothing for a clickjacking attack to trigger. `public/_headers` sets all of these and is kept for any host that reads it.
- **`robots.txt` is advisory only.** Crawlers read `robots.txt` from the domain root, which on a project site belongs to the organisation's own site, not to this project. The file is still published, and the sitemap is linked from it and discoverable on its own.
- **No custom caching.** Pages sends `Cache-Control: max-age=600` on everything, so a deploy reaches every visitor within ten minutes. Build-hashed assets under `/_next/static/` could safely be cached for a year, but that cannot be declared here.
- **No redirects of its own.** The site does not need any. Every route has a pre-rendered file, and `trailingSlash` makes `/path/` resolve to `/path/index.html`. Pages itself redirects `/path` to `/path/` (301). Paths are case-sensitive, so `/RESOURCES/` is a 404.
- **Hidden files are not published.** `upload-pages-artifact` excludes dotfiles by default. Nothing here needs one: Jekyll never runs on an Actions deployment. `public/.nojekyll` is kept only for anyone deploying the export from a branch instead.

---

## Deploying elsewhere

The export is plain files and runs on any static host:

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain npm run build:static
# serve ./out
```

Hosts that read `public/_headers` (Cloudflare Pages, Netlify) additionally get the response headers GitHub Pages cannot send. Vercel's Hobby tier is restricted to non-commercial use by its terms.

To serve the GitHub Pages site from a custom domain later: add the domain in the Pages settings, set the `SITE_URL` repository variable to it, and re-run the deploy workflow. The base path disappears automatically.

---

## Verifying a deployment

The browser smoke test runs against a local server or a live URL:

```bash
npm run build:static
npm run test:browser                                                       # serves out/ at the base path
npm run test:browser -- --url https://everything-free-by-quilonix.github.io/everything-free
```

It drives the Chrome already installed on the machine (nothing is downloaded) and checks every route type directly and by client navigation, the custom 404, CSP violations, content types for the sitemap, `robots.txt` and OG images, search and filters, that cards and confirmed-only filters never present an unconfirmed fact as confirmed (audited against the link manifest), all three browser tools, the forms, the verification evidence disclosure, keyboard access, mobile layout, and no-JavaScript rendering. Any console error, failed request or CSP violation fails the check.

---

## Cost review

| | |
| --- | --- |
| Hosting | GitHub Pages, free for public repositories |
| Build and deploy | GitHub Actions standard runners, free for public repositories |
| Bandwidth | 100 GB/month soft limit; no overage billing |
| Runtime compute | None — nothing executes per request |
| Database, email, analytics, third-party APIs | None |
| Domain | None. The project uses the free `github.io` address |

Two things would introduce cost, and both are avoidable: making the repository private (Pages then requires a paid plan, and Actions minutes become metered against a quota), or switching a workflow to a larger runner (always billed). Neither is needed.
