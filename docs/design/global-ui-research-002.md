# Global UI research 002 — Everything.Free

Research phase for the `ui/global-premium-redesign-002` redesign. Two parts:

1. **Current-app audit**: what the code actually does today, what data really exists, and which constraints a redesign must respect. Everything here was read from the worktree at base SHA `af01c3f`.
2. **2025–2026 research**: references, effects, components, motion, materials and typography, each judged against what Everything.Free is: a global, evidence-aware library of free resources.

No code was changed in this step. Sources are cited inline. Content from sources is paraphrased for licensing compliance, and no passage quotes more than a short phrase.

---

## Part 1 — Current-app audit

### 1.1 Stack and build

| Item | Finding | Where |
| --- | --- | --- |
| Framework | Next.js `16.3.6`, React `19.2.8`, App Router, all routes static | `package.json`, `next.config.ts` |
| Styling | Tailwind v4 (`@import "tailwindcss"`, `@theme inline`), semantic CSS custom properties | `src/app/globals.css` |
| Runtime deps | `next`, `react`, `react-dom`, `zod` only. No animation, UI-kit or icon library | `package.json` |
| Fonts | Inter (body) and Manrope (display) via `next/font/google`, self-hosted at build, `display: swap`, latin subset | `src/app/layout.tsx` |
| Icons | ~45 hand-authored SVG glyphs on a 24px grid, 1.75 stroke, decorative by default | `src/components/icons/index.tsx` |
| Static export | `npm run build:static` → `STATIC_EXPORT=1 next build` → `fix-rsc-paths.mjs` → `csp.mjs` | `scripts/build-static.mjs` |
| Base path | `/everything-free` on GitHub Pages, derived from `NEXT_PUBLIC_SITE_URL` | `src/config/deployment.ts` |
| Verify commands | `npm run lint`, `npm run typecheck`, `npm test` (47 tests), `npm run build`, `npm run build:static`, `npm run test:browser` (61 checks), `npm run backlog:check`, `npm run check:verification` | `package.json`, `.agents/ui-review/baseline.txt` |

Baseline (from `.agents/ui-review/baseline.txt`): all of the above pass. 1,114 exported HTML pages, 8,190 inline scripts hashed.

### 1.2 Content Security Policy: hard constraints on any visual effect

`scripts/csp.mjs` writes a per-page `<meta http-equiv="Content-Security-Policy">`:

- `script-src 'self' 'sha256-…'`. Every inline script must be **static text** so it can be hashed. No `'unsafe-inline'`, no nonces (there is no server).
- `style-src-elem 'self'`. **Injected `<style>` elements are blocked.** Any library that injects a runtime `<style>` tag (CSS-in-JS, some animation and toast libraries) breaks under this policy.
- `style-src-attr 'unsafe-inline'`. Inline `style="…"` attributes are allowed. This is how a React `style={{ viewTransitionName }}` or CSS custom-property props would work.
- `font-src 'self'`, `img-src 'self' data: blob:`, `connect-src 'self'`. **No font CDN, no remote images, no third-party fetches.** A lazily fetched same-origin JSON index is allowed.
- The build **fails** on inline event handlers (`onclick="…"`) or `javascript:` URLs in the exported HTML.

Consequences for the redesign: effects must be CSS in the main stylesheet, or JS in bundled chunks. Any new inline bootstrap script, such as a motion-preference script, must be static text like `ThemeScript`. WebGL or canvas assets would need to be same-origin. No library that injects styles at runtime.

### 1.3 Routes (all statically generated)

`/`, `/resources` (static fallback + client explorer), `/resources/[slug]` (726), `/categories`, `/categories/[slug]`, `/collections`, `/collections/[slug]`, `/for/[audience]` (6), `/alternatives`, `/alternatives/[slug]`, `/tools`, `/tools/[slug]` (3 available + 1 planned), `/free-status`, `/verification`, `/submit`, `/report`, `/about`, `/privacy`, `/terms`, `/og/[image]` (pre-rendered PNG), `/link-manifest.json`, `sitemap.xml`, `robots.txt`, plus `not-found.tsx` and `error.tsx`.

Primary nav (`src/config/navigation.ts`) has five items: Browse, Categories, Tools, Collections, Alternatives. The footer has four groups: Discover, Use, Trust, Contribute. The "Use" links open confirmed-only filters and say so in their labels.

### 1.4 The real catalogue (measured from `out/link-manifest.json`)

| Measure | Value |
| --- | --- |
| Resources | **726** |
| `VERIFIED` | **0** (maintainer register is empty; a test asserts this) |
| `PARTIALLY_VERIFIED` | 6 |
| `UNVERIFIED` | 720 |
| Stage `awaiting-sign-off` / `partial` / `started` / `not-started` | 4 / 2 / 4 / 716 |
| Listings with any confirmed check | 10 |
| Free status: `OPEN_SOURCE` / `FREE` / `FREE_TIER` / `PERSONAL_FREE` | 431 / 213 / 73 / 9 |
| Editorial spotlight entries | 10 |
| Categories / category groups | 72 / 8 |
| Audiences / collections / tools | 6 / 6 / 4 (one planned) |

**Docs are stale.** `docs/architecture.md` still describes ~44 resources and 244 pages, and the status table in `docs/verification.md` still says 44 resources. The real catalogue is 726 entries and 1,114 pages. Any redesign copy that quotes counts must read them from the repository, as the hero already does with `getResourceCount()`. It must not hard-code them.

The library's honest shape is "large and mostly unchecked". 99% of listings are `UNVERIFIED`. The visual language has to make **"not verified yet" look normal, calm and legible**, not alarming, and not hidden. That is the single most important design input from the data.

### 1.5 Structured fields on `Resource` (`src/types/resource.ts`)

Identity and copy: `id`, `slug`, `name`, `shortDescription` (≤130 chars, enforced), `longDescription`, `whyListed`, `compilationNotes`.
Taxonomy: `category`, `subcategories[]`, `resourceType` (27 values), `tags[]`, `alternativeTo[]`, `relatedResources[]`.
Links: `officialUrl` (HTTPS enforced), `sourceUrl?`, `pricingUrl?`, `licenseUrl?`.
Free/licence: `freeStatus` (8 values, 4 used), `openSource`, `license?`, `licenseNotes?`, `limitations[]`, `pricingNotes?`.
Availability: `platforms[]` (BROWSER, WINDOWS, MACOS, LINUX, ANDROID, IOS, SELF_HOSTED), `languages[]` (ISO 639-1).
Tri-state facts: `requiresAccount`, `requiresCreditCard`, `commercialUse`, `personalUse` (`yes | no | unknown`).
Capabilities: `apiAvailable`, `embedAvailable`, `downloadAvailable` (booleans defaulting to `false`, meaning "not advertised").
Evidence: `verificationStatus`, `verificationNotes?`, `lastVerifiedAt?`, `verifiedBy?`, `verificationSources[]` (url, label, retrievedAt), `verificationChecks[]` (check, result, evidence, sourceUrl).
Media: `logo` (monogram by default, never hotlinked), `screenshots[]` (currently unused in data).
Dates: `submittedAt`, `updatedAt`. Curation: `editorialSpotlight?`.

There is deliberately **no rating, review count, download count or popularity**. The type's own header comment says so.

### 1.6 Is there structured region / geographic data? **No.**

- There is **no `region`, `country`, `availableIn` or locale field** on `Resource`, in `define.ts` defaults, or in `validate.ts`. A search of `src/` for region/country/geograph terms finds them only in prose descriptions, limitations text, and a `role="region"` ARIA attribute.
- `languages[]` exists in the type, but **not one of the 726 data entries sets it**. `defineResource()` defaults it to `[]`, which the type documents as "not yet recorded". So interface-language coverage cannot be shown either.
- Geography appears only in **free-text tags**, inconsistently: `india` ×29, `indian-languages` ×10, `latin-america` ×2, `global-health` ×2, and singletons such as `africa`, `south-africa`, `europe`, `european-union`, `japan-research`, `global-south`. That is 1,646 distinct tags across 2,641 uses. These are topics, not availability claims. `india` can mean "Indian government source" or "content about India", never "available only in India".
- Some regional *restrictions* exist only as limitation prose, for example Google AI Studio "available only in listed countries" in `batch-006.ts`.

**Conclusion.** A global coverage map, a region filter, or any "available in N countries" surface **cannot be built honestly from current data**. Building one would invent claims, which breaks the project's core rule that no surface claims more than the evidence. The "Global Utility Atlas" concept must be expressed through dimensions that do exist: topic (category and group), free status, platform, resource type, licence and evidence state. A real region dimension would be a separate **data** project. It would need a schema field, a verification check (`REGIONAL_AVAILABILITY`), build validation and per-listing evidence. It is out of scope for a UI redesign, and these notes record it as a future option only.

### 1.7 The evidence model the UI must preserve

`src/lib/resources/evidence.ts` derives, per fact, a state from recorded checks: **confirmed / unconfirmed (not-checked or stale) / unknown (unresolved or not-established)**. One check per fact, no cross-inference, and confirmations expire after 90 days. UI rules encoded there and in components:

- A stored `"no"`/`false` is **not** a confirmed no. Only a check record makes it one (`confirmedAvailability`).
- Cards show **at most one line per evidence state** (`cardEvidenceSummary`). Values appear only on the "Confirmed" line. Every other fact is named without its value.
- Every state has its own **icon and word**, never colour alone (`evidence.tsx`: check-circle, help-circle, clock, minus-circle). Only "Confirmed" uses the success colour. "Not verified" and "Unknown" share the muted style on purpose.
- Detail pages show value + evidence tag + a native `<details>` "How we know" (source, read date, who checked).
- Confirmed-fact filters match confirmed evidence only, and the UI states how many listings were held back (`excludedByEvidence`, `unconfirmedHint`).
- Titles, OG and JSON-LD say "(not verified)" when the free status is unchecked.
- `validate.ts` makes impossible evidence states fail the build. Tags that restate facts (`no-signup`, `open-source`…) are rejected.

The 47 unit tests (`tests/evidence.test.mts`, `tests/library.test.mts`) exercise this logic directly, with no DOM. A redesign that leaves `lib/` untouched keeps them green. A redesign that changes **presentation** must keep the DOM contracts the browser smoke test audits (§1.9).

### 1.8 Current design system and UI, honestly assessed

**Tokens** (`globals.css`): dark-first, with values on `:root` so no-JS renders correctly. Near-black `#0a0a0f`, cool blue-grey surfaces (`#12121a`, `#181822`), gold primary `#d4af37` (lowered to `#8a6d12` in light mode for AA), and status pairs (success, warning, danger, info) with `-fg` and `-soft` variants. There are three shadow tokens. The global `prefers-reduced-motion` rule collapses every animation and transition to 0.01ms. `:focus-visible` uses a 2px primary outline that is never removed.

**Components** (`src/components/ui`): `Button`/`buttonClasses` (5 variants, 3 sizes, 44px+ targets at md/lg), `Card` (stretched-link pattern, one tab stop), `Badge`, `Callout`, `DataList`, `EmptyState`, `ExternalLink`, `Field`, `Skeleton`, and layout `Container`/`Section`/`SectionLink`/`Breadcrumbs`.

**What is already strong and must survive:**
- Honest empty states on every homepage section.
- A real `<form method="get">` for search and filters, so filtering degrades without JS.
- URL as the only filter state.
- `<fieldset>/<legend>` filter groups.
- Zero-count options disabled rather than hidden.
- Native `<details>` for disclosure.
- A hand-built mobile dialog with focus trap, Escape, scroll lock and focus return.
- A skip link.
- `aria-live` result counts.
- `text-wrap: balance/pretty`.
- No fake metrics anywhere.

**What reads as generic, or as "AI premium SaaS", today:**
- **Hero**: a centred stack with a pill eyebrow ("Free status, limits and verification stated plainly" in a `rounded-full` chip), a big centred wordmark with a gold dot, a faded **64px grid background with a radial mask** (`hero-grid`), and a **translucent `backdrop-blur-sm` card** below the search. The grid-plus-glass hero is exactly the template pattern the brief rejects.
- **Pill chips everywhere**: search suggestions are `rounded-full`. Alternatives, tags and audiences all use rounded bordered boxes with the same weight.
- **Uniform card grids**: categories, spotlight, recently checked, tools, collections and audiences are all `rounded-xl border bg-surface` grids of the same rhythm. The page has no editorial hierarchy. Every section has equal weight, so nothing leads.
- **Typography**: Manrope display plus Inter body, both geometric sans. That is competent but anonymous, and there is no typographic voice for an archive or atlas.
- **Colour**: cool blue-tinted greys with gold read close to a "luxury dark template". Gold is used for the logo dot, primary buttons, focus, search highlight and the `whyListed` border all at once, which dilutes it.
- **Header**: `bg-bg/85 backdrop-blur-md`. That is translucency used as default styling, not as a functional layer.
- **Rotating search placeholder** (every 3.6s, disabled under reduced motion). That is motion without purpose, and text that changes under the cursor.

**Functional gaps the redesign can genuinely solve:**
- Mobile filters toggle an inline block above the results instead of a sheet. A long filter form pushes results off-screen.
- There is no sticky results toolbar. Count, sort and active filters scroll away.
- There is no keyboard path to "jump to a resource". Search requires going to `/resources`.
- Detail pages are long (identity, caveat, about, why, limitations, features, facts, alternatives, similar, plus a sidebar). There is no on-page index, and the primary "Open site" action scrolls away on mobile.
- Card density: every card carries badge row, platforms, evidence lines, limitation, match reasons and trust row. That is honest but visually heavy at 726 cards.

**Performance baseline** (uncompressed, from `baseline.txt`): `/resources` ships **8.6 MB of HTML** and 680 KB JS. The static fallback renders all 726 cards, and the RSC payload carries the full library. `/` is 276 KB HTML and 612 KB JS. **Every extra DOM node on the resource card is multiplied by 726 on `/resources`.** The card redesign must reduce, not grow, per-card markup. Card-level JS effects (pointer tracking, per-card observers) are ruled out on cost alone.

### 1.9 Browser smoke-test contracts (`scripts/browser-smoke.mjs`, 61 checks)

The redesign must keep these hooks, or update the smoke test deliberately in the same change:

- Hydration signal: `button[aria-label^="Switch to"]` (the theme toggle) must exist after hydration.
- Cards: `main article`, card title link `h3 a[href*="/resources/"]`, `ul[aria-label="What has been checked"]`, `[data-evidence-group="…"]`, `[data-fact]`, `[data-evidence]`, a free-status badge `[data-fact="freeStatus"][data-evidence]`, and the open-source chip `[data-fact="openSource"]`.
- Detail facts: `#facts-heading ~ div dl > div` with `dt`/`dd`. A `details` whose summary contains "View verification evidence", closed by default, with external source links. An `h2` with the text "Verification" whose parent holds the panel text.
- Filters: `[data-testid="evidence-filter-notice"]` containing "N more listings record it". Active-filter chips at `[aria-label="Active filters"] a`, including the text "No credit card · confirmed".
- Copy strings asserted: "set a filter automatically", "Listed as a free alternative to", "Nothing matched", "Browse by category" (used to detect leaving the homepage), and the collection note "not the same as each fact being confirmed" at `[data-testid="collection-evidence-note"]`.
- Comparison tables: `table tbody tr`, `th a` → resource, cells `[data-fact]` containing `[data-evidence]`.
- Client-side navigation from a homepage card must not reload the page (a `window.__noReload` marker is set).
- No horizontal overflow at each viewport on `/`, `/resources/`, a detail page, the image converter, `/submit/` and an alternatives page.
- Mobile: card evidence stays compact (one line per state). The mobile menu opens as a dialog, traps focus and closes on Escape.
- First Tab reaches a visible skip link.
- No-JS: `/resources/` lists the library as static HTML. Detail and category pages render fully. Submit and report offer the GitHub issue-form fallback.
- No CSP violations (`window.__cspViolations`) and no failed requests on any route.

### 1.10 Existing design documents

No `docs/design/*-001*` documents exist in the worktree or the main checkout. This is the first design document in the repository.

---
## Part 2 — Reference research (2025–2026)

Format per reference: **Reference · Observation · Useful principle · What not to copy · Potential Everything.Free application.**

### 2.1 Apple

#### A1. WWDC26 "Principles of great design" and the HIG design principles
- **Reference**: [Principles of great design, WWDC26 session 250](https://developer.apple.com/videos/play/wwdc2026/250/). Summary of the eight reintroduced HIG principles: [note.com write-up](https://note.com/mosa2003/n/n691835844d8d?hl=en). See also the [WWDC26 Design guide](https://developer.apple.com/wwdc26/guides/design/).
- **Observation**: Apple frames design as making something *with intention*. Every feature asks for a person's time, attention and trust, so choosing what to build often means deciding what to leave out. The principles are Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft and Delight. Forgiveness (undo, confirm only before real mistakes) supports Agency. Responsibility starts with privacy: don't ask for data before the person understands why. The WWDC26 design guide describes this year's platform changes as refinements to consistency, readability and accessibility, plus better adaptation across screen sizes. It is not a new visual style.
- **Useful principle**: the 2026 direction is *restraint and refinement*, not spectacle. "Purpose before pixels" is a test every effect in Part 3 is judged against.
- **What not to copy**: Apple's visual surface (SF typography, glass controls, icon styles, the Apple product-page scroll theatre).
- **EF application**: *Responsibility* maps directly onto EF's no-tracking, no-account, evidence-first stance. Agency maps onto URL-as-state, removable inferred filters and "Clear all". Forgiveness means filter changes are always reversible (Back works, chips remove). Craft means every state is designed, including the 99% "Not verified" state.

#### A2. HIG Materials and Liquid Glass
- **Reference**: [HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Apple Newsroom, June 2025](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/), [Meet Liquid Glass, WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/), [Get to know the new design system, WWDC25](https://developer.apple.com/videos/play/wwdc2025/356/).
- **Observation**: the HIG splits materials into two roles. Liquid Glass forms a *functional layer* for controls and navigation that floats above content. Standard materials differentiate *within* the content layer. The HIG explicitly says not to use Liquid Glass in the content layer, because it muddies hierarchy. Public reaction was mixed. Apple's own discussion forums document users seeking ways to reduce the glass effect ([Apple Community user doc](https://discussions.apple.com/docs/DOC-250010041)).
- **Useful principle**: translucency is a *layer signal* ("this is chrome, content is behind it"). It is not a surface finish.
- **What not to copy**: refraction, specular highlights, glass cards, glass buttons in content, or any imitation of Liquid Glass. The brief rejects this explicitly.
- **EF application**: at most one translucent functional layer (the sticky header, and the sticky results toolbar when pinned). Everything in the content layer stays opaque. Under `prefers-reduced-transparency: reduce` that layer goes fully opaque. Remove the translucent hero card.

#### A3. HIG Motion
- **Reference**: [HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion).
- **Observation**: add motion purposefully and never for its own sake. Make motion optional and never the only carrier of information. Feedback motion should follow gestures and expectations: a view revealed by sliding down should not dismiss sideways. Keep feedback animations brief and precise.
- **Useful principle**: *directional consistency* and *brevity*. The exit path mirrors the entry path.
- **What not to copy**: physics-heavy springs everywhere, and large zoom transitions.
- **EF application**: the filter sheet enters from the edge it lives on and leaves the same way. The disclosure chevron rotates in the direction content opens. Route transitions are short cross-fades, at most a few hundred milliseconds. Nothing depends on motion to communicate. The existing global reduced-motion kill switch stays.

#### A4. HIG Search fields
- **Reference**: [HIG Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields).
- **Observation**: placeholder text tells people what they can search. Start searching as people type where possible. Offer suggested or recent terms. Put the most relevant results first and consider grouping them. Offer scope bars and tokens to refine.
- **Useful principle**: tokens are a first-class refinement UI, the HIG's version of filter chips.
- **What not to copy**: the iOS search bar chrome.
- **EF application**: EF already turns natural-language constraints into removable filters (`inferIntent`). Those inferred filters are *tokens*, and they deserve token styling inside or under the field, not a separate callout. The placeholder should be one fixed, useful example rather than rotating. A command palette can show "recent" only if that is stored locally, with no tracking. Default to no history.

#### A5. HIG Sidebars, Sheets, Menus, Layout
- **Reference**: [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars), [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets), [Menus](https://developer.apple.com/design/human-interface-guidelines/menus), [Layout](https://developer.apple.com/design/human-interface-guidelines/layout).
- **Observation**:
  - Sidebars need a lot of space. Use a compact control when space is tight, and group deep hierarchies with disclosure controls.
  - Sheets present a focused task, then return to the parent. They can be modal, or non-modal when the user keeps working with the parent. Cancel/Close and Done have distinct meanings.
  - Menu items are labelled by what they do, verb-first for actions, and show keyboard equivalents.
  - Layout orders content by importance in reading order, uses alignment and indentation to convey hierarchy, groups related items with space or separators, and uses progressive disclosure.
- **Useful principle**: *the filter panel is a sidebar on desktop and a sheet on mobile*, the same content in two presentations.
- **What not to copy**: platform-specific bar heights and button placement.
- **EF application**: on desktop, keep the filter sidebar with disclosure groups. On mobile, turn it into a sheet with "Show N results" as its Done action and a separate Close. Detail pages get reading-order hierarchy: what it is, what free means here, the catch, the evidence, then everything else.

#### A6. HIG Accessibility and Typography
- **Reference**: [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Typography](https://developer.apple.com/design/human-interface-guidelines/typography).
- **Observation**: the HIG describes an accessible interface as intuitive, perceivable (never one channel only) and adaptable (respects system settings). It supports larger text and recommends avoiding very light weights at small sizes. It suggests adjusting weight, size and colour together to express hierarchy while keeping the relative hierarchy intact when text scales.
- **Useful principle**: hierarchy must survive 200% zoom and user font scaling.
- **EF application**: use a `rem`-based fluid scale and no light weights below about 20px. Evidence states keep icon + word. Test at 200% zoom in addition to the existing overflow checks.

### 2.2 Linear

#### L1. The March 2026 UI refresh
- **Reference**: [A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh) and the [changelog entry, 2026-03-12](https://linear.app/changelog/2026-03-12-ui-refresh).
- **Observation**: Linear names two principles. The first is "Don't compete for attention you haven't earned": orientation chrome such as the sidebar and tabs was dimmed and compacted so the work area leads. The second is "Structure should be felt not seen": borders and separators had proliferated, so they softened contrast and removed unnecessary ones. They cut icon count and size, and removed decorative icon backgrounds. They shifted the default palette from cool blue-grey toward a warmer, less saturated grey, tuning hue, chroma and lightness per token with an internal tool. They aimed for a change most people would not consciously notice.
- **Useful principle**: *density without noise* comes from subtraction: fewer borders, fewer icons, dimmer chrome, warmer neutrals.
- **What not to copy**: Linear's indigo accent, its app shell (sidebar + tabs) on a public reading site, and its exact grey ramp.
- **EF application**:
  - Dim header and footer chrome relative to content.
  - Remove most per-item icons. Audience tiles, alternative chips and the "refresh-cw" glyph beside every alternative add no information.
  - Replace boxed cards with hairline-ruled rows where scanning matters.
  - Move EF's cool `#12121a` greys toward a warmer neutral defined in OKLCH, so gold sits in a coherent palette instead of on blue-black.

#### L2. Linear 2024 redesign, command menu and keyboard-first workflow
- **Reference**: [How we redesigned the Linear UI (part II)](http://linear.app/blog/how-we-redesigned-the-linear-ui), [A design reset (part I)](https://linear.app/blog/a-design-reset), [Mobile redesign changelog 2025-10](https://linear.app/changelog/2025-10-16-mobile-app-redesign).
- **Observation**: the 2024 pass reduced visual noise in sidebar, tabs, headers and panels, and increased the hierarchy and density of navigation. The command menu reaches every action, and themes are switchable from it. The 2025 mobile redesign introduced a custom frosted material for its floating navigation only.
- **Useful principle**: every power feature has a keyboard path and stays out of the way until called. Translucency is again limited to floating navigation.
- **What not to copy**: shortcut density built for daily, all-day use. EF visitors are occasional, so shortcuts must be discoverable and optional.
- **EF application**:
  - Add `/` to focus search, and ⌘K / Ctrl+K for a resource-jump palette.
  - Make all filters keyboard-operable, which they already are as native checkboxes.
  - Show shortcuts in the UI (a `Kbd` hint in the search field), localised for platform symbols.

### 2.3 Figma

#### F1. Config 2026: Figma Motion, shaders, code layers
- **Reference**: [Config 2026 recap](https://www.figma.com/blog/config-2026-recap/), [Figma forum, everything announced](https://forum.figma.com/product-updates-3/everything-announced-at-config-2026-55221), [Figma Learn: what's new](https://help.figma.com/hc/en-us/articles/39582753756695-What-s-new-from-Config-2026).
- **Observation**: Figma Motion adds a timeline with keyframes and presets. Motion becomes a *design-system property*: animate a component once and it travels everywhere, like fills and type. Timing and easing values are inspectable in Dev Mode and exportable as CSS. Shader fills and effects arrive as parameterised materials. Code layers bring live code onto the canvas.
- **Useful principle**: **motion as tokens**. Durations and easings are named, shared and inspected like colour. They are not hand-tuned per component.
- **What not to copy**: shader-heavy hero visuals, and generative textures as decoration.
- **EF application**: define a small motion-token set (`--dur-*`, `--ease-*`) in `globals.css`. Components may only reference tokens, and reduced motion collapses them all.

#### F2. Figma web design trends 2026 and State of the Designer 2026
- **Reference**: [Top web design trends for 2026](https://www.figma.com/resource-library/web-design-trends/), [State of the Designer 2026](https://www.figma.com/blog/state-of-the-designer-2026/), [Figma 2026 AI report](https://www.figma.com/blog/2026-ai-report/).
- **Observation**: the trend list names immersive 3D/WebGL, experimental navigation (radial menus, interactive maps, nonlinear journeys), vibrant saturated colour, bold or kinetic typography, dark mode as baseline, and motion design. The AI report notes designers and developers increasingly doing each other's work.
- **Useful principle**: *expressive typography* is the trend with the best fit, because EF is a reading product. Experimental navigation via maps is the trend to resist, because EF has no region data (§1.6).
- **What not to copy**: kinetic hero lettering, neon or "dopamine" palettes, 3D objects, interactive maps without data.
- **EF application**: put the boldness into static editorial typography (scale contrast, a serif display voice, tabular figures), not into animation.

### 2.4 Framer

- **Reference**: [Triggering animations on scroll](https://www.framer.com/academy/lessons/framer-animations-trigger-on-scroll), [Scroll variants](https://www.framer.com/academy/lessons/framer-animations-scroll-variants), [Scroll transforms](https://www.framer.com/academy/lessons/scroll-transforms), [Scroll-direction trigger](https://www.framer.community/c/announcements/scroll-direction), [Framer updates](https://development.framer.com/updates).
- **Observation**: Framer's 2025–26 interaction vocabulary is:
  - **appear** effects on layer or section in view;
  - **scroll variants**, where sections map to component variants;
  - **scroll transforms**, where scroll progress maps continuously to position, scale, rotation and opacity;
  - **scroll-direction** triggers, such as hiding the nav on scroll-down;
  - **tickers**.
  The 2026 updates focus on agent workflows (Skills) rather than new effects.
- **Useful principle**: *variants triggered by state* (one component, defined states, animated between) is the part worth taking. Scroll-direction-aware chrome is a real reading benefit on mobile.
- **What not to copy**: appear-on-scroll fades on every section, which delay content and repeat on every visit. Also scroll-transform parallax and tickers. These are the signature of template sites.
- **EF application**: the header compacts or hides on scroll-down and returns on scroll-up, on mobile only, with a CSS fallback of always-visible. Components gain explicit variants (rest, hover, pressed, focus, selected, disabled, loading). Content never fades in on scroll.

### 2.5 Vercel / Geist

- **Reference**: [Web Interface Guidelines](https://vercel.com/design/guidelines), [Geist Sheet](https://vercel.com/geist/sheet), [Geist Command Menu](https://vercel.com/geist/command-menu), [Geist Menu](https://www.vercel.com/geist/menu), [Geist Tabs](https://www.vercel.com/geist/tabs), [Keyboard input](https://vercel.com/design/keyboard-input), [Geist Typography](https://vercel.com/geist/text), [Geist Table](https://vercel.com/geist/table).
- **Observation**, from the Web Interface Guidelines (paraphrased):
  - URL as state, and deep-link everything (filters, tabs, expanded panels).
  - Prefer CSS over the Web Animations API over JS libraries. Animate compositor properties only, and never `transition: all`.
  - Animations are interruptible and honour reduced motion.
  - Skeletons mirror final content exactly. Loading states get a short show-delay and a minimum visible time.
  - Every state is designed: empty, sparse, dense, error.
  - Status cues are never colour-only. Use tabular numbers for comparisons.
  - Hover, active and focus states raise contrast. Nested radii are concentric.
  - Use layered shadows and crisp semi-transparent borders.
  - Focus is never obscured by sticky elements. Use `scroll-margin-top` on anchored headings.
  - Set `overscroll-behavior: contain` in drawers.
  - Use `content-visibility: auto` for large lists.
  - Links are links.

  Geist **Sheet** is for persistent associated context, such as row inspection, where the page stays useful. It is non-modal by default, never used for destructive confirmation, and its side follows the trigger (an inspector from the right, a global filter from the left). It always has an explicit Close button and honours Escape. **Command Menu**: arrows move, Enter activates, Escape closes, Backspace on empty pops a nested page. **Tabs**: cap at 5–7 on desktop and 3–4 on mobile.
- **Useful principle**: *component discipline*. Each component has a stated "when to use", "when not to", keyboard behaviour and content rules.
- **What not to copy**: Vercel's monochrome brand, Geist typeface identity, aggressive negative display tracking, and Title Case UI copy (EF uses sentence case).
- **EF application**:
  - Adopt the guidelines as the review checklist for this redesign.
  - Use `content-visibility: auto` on `/resources` card rows to cut render cost across 726 entries.
  - Add `scroll-margin-top` for the sticky header (detail-page anchors like `#facts-heading`).
  - Mobile filter sheet: modal, because it owns the screen on mobile, with explicit Close and "Show N results".
  - Command menu keyboard model as specified.
  - Write each EF component with a when/when-not note in its header comment, which matches the codebase's existing comment style.

### 2.6 Other current premium references

| Reference | Observation | Useful principle | Not to copy | EF application |
| --- | --- | --- | --- | --- |
| [Our World in Data, new search (Nov 2025)](https://ourworldindata.org/introducing-new-search); [better maps](https://ourworldindata.org/new-features-better-maps) | One search across content types with scope buttons. Results render differently for a country query and a topic query. Rich results show key data inline. Every page states its open licence and source | Result templates adapt to *query intent*. Provenance is shown at the point of use | Maps and charts. They have data; EF does not | EF's `inferIntent` already classifies queries. An "alternative to X" query could lead with an "Alternatives to X" header row linking `/alternatives/x`; a category-name query could lead with that category. The same evidence footers stay |
| [MDN new frontend (2025)](https://developer.mozilla.org/en-US/blog/launching-new-front-end/); [deep dive](https://developer.mozilla.org/en-US/blog/mdn-front-end-deep-dive/); [feedback thread](https://github.com/orgs/mdn/discussions/822) | Unified styles, a search modal to jump to any page, a redesigned top nav, and web components with less unused JS. Some readers found the new styling harder to read ([user restyle gist](https://gist.github.com/quackbarc/6f837964a6e7d7d979b72e4f6c24ac36)) | A jump-to modal is the expected affordance for a large reference corpus. A redesign of a reading product risks *legibility regressions* | Its specific colour and type choices | Add a jump-to palette. Treat body-text contrast and measure as non-negotiable acceptance criteria |
| [GOV.UK Design System, brand refresh June 2025](https://design-system.service.gov.uk/); [brand guidelines](https://brand.design-system.service.gov.uk/introduction/) | Trust-first public service design. Tone shifts muted for sensitive topics and brighter for positive content. A small, defined motion language. Exhaustively documented components | *Trust is built by consistency and plain language*. Restraint scales with seriousness | The crown/dot identity, and the blue | Evidence surfaces (verification panel, "How we know") use the most reserved styling on the site. Brand expression lives in the masthead and editorial headings, never in trust UI |
| [Cooper Hewitt collection](https://collection.cooperhewitt.org/) | Archive search across conventional fields plus unusual dimensions (colour, size), with a random-object button. It states plainly that cataloguing is a work in progress | Serendipity paired with honesty about catalogue completeness | Museum object imagery | A "show me something" control that picks a random resource from a deterministic client list is genuine discovery. The site states plainly that the library is mostly unverified, as the hero already does |
| [Are.na](https://www.are.na/); [founders interview, Artforum](https://www.artforum.com/columns/the-founders-of-are-na-talk-about-the-history-of-their-online-platform-239620/) | No likes. Connection over popularity: things are understood by context and links between them. Quiet interface | A library without popularity signals can still feel alive through *connections* | Its block-grid aesthetic | Make `relatedResources`, `alternativeTo` and collections the visible connective tissue on detail pages: "Connected in the library". No popularity, ever |
| [Stripe Press](https://press.stripe.com/); [landing.love note on Stripe Press](https://www.landing.love/sites/stripe-tacit/) | Editorial, typography-first, generous whitespace, near-monochrome, the book as object | An *editorial* voice comes from type scale, measure and rhythm, not decoration | Book-cover imagery and 3D | Category and collection pages open like a chapter: large serif title, a one-paragraph standfirst, then a dense index |
| [Raycast, a fresh look and feel](https://www.raycast.com/blog/a-fresh-look-and-feel) | Stated principles: fast, simple, delightful. The palette is the product | A command surface is judged on *latency* first | The red gradient brand | The palette must open instantly and filter on each keystroke. That rules out a network round-trip per keystroke: load the index once, then filter locally |
| [NN/g skeleton screens](https://www.nngroup.com/articles/skeleton-screens/); [Carbon loading pattern](https://carbondesignsystem.com/patterns/loading-pattern/) | Skeletons suit full-page loads, should be brief, and should mirror the layout | Real content beats skeletons. Skeletons only cover unavoidable waits | Shimmer on everything | EF's static HTML means almost nothing loads late. Use skeletons only in the palette while its index loads |

---

## Part 3 — Web platform status (what is safe to build on in 2026)

| Capability | Status found | Source | Implication for EF |
| --- | --- | --- | --- |
| Same-document View Transitions (`document.startViewTransition`) | Shipped in Chromium, Safari 18+ and Firefox (144 per one compatibility summary; another source says 133). Treat as Baseline | [MDN guide](https://developer.mozilla.org/en-US/blog/view-transitions-beginner-guide/), [LambdaTest summary](https://www.lambdatest.com/web-technologies/view-transitions-ie), [Chrome 2025 update](https://developer.chrome.com/blog/view-transitions-in-2025) | Next.js client navigation is same-document, so route and filter transitions are viable as progressive enhancement |
| Cross-document View Transitions (`@view-transition`) | Chromium only, per the same summary | as above | Only relevant to full page loads. Low priority |
| React `<ViewTransition>` | Exported by the React build vendored inside Next 16.3.6 (`next/dist/compiled/react/cjs/react.production.js` exports `ViewTransition`). The public React docs still call it experimental. Next exposes `experimental.viewTransition` | [React docs](https://react.dev/reference/react/ViewTransition), [Next config doc](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) | **Not verified in this repo.** I found the React export but did not confirm the Next flag's typings or its behaviour under `output: export` with the CSP. The design step must prototype it first. Fallback: call `document.startViewTransition` directly around `router.push` in the filter panel |
| Scroll-driven animations (`animation-timeline`) | Chromium since 115. Safari 26 per a secondary source. Firefox not confirmed | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations), [Chrome docs](https://developer.chrome.com/docs/css-ui/scroll-driven-animations), [Chrome 145 scroll-triggered animations](https://developer.chrome.com/blog/scroll-triggered-animations) | Use only for enhancements where the no-support state is the correct default, such as a header hairline appearing after scrolling |
| CSS anchor positioning | Baseline Newly Available in 2026 (Firefox 147, Safari 26), with some sub-properties still limited | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning), [LambdaTest](https://www.lambdatest.com/web-technologies/css-anchor-positioning-safari) | Popovers, such as an evidence-legend popover or a sort menu, can be positioned in CSS with a static fallback |
| Popover API and Invoker Commands (`command`/`commandfor`) | Popover is Baseline. Invoker Commands reached Baseline in January 2026 | [MDN Popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using), [MDN Invoker Commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API), [InfoQ](https://www.infoq.com/news/2026/01/html-invoker-commands/) | Light-dismiss popovers and `<dialog>` opening **with no JS and no inline handlers**, which fits the CSP and the no-JS principle |
| `linear()` easing | Baseline | [MDN](https://developer.mozilla.org/docs/Web/CSS/easing-function/linear), [Josh Comeau](https://joshwcomeau.com/animation/linear-timing-function/) | Spring-like easing as a CSS token, with no physics library |
| `interpolate-size` / `::details-content` | Chromium first. Progressive enhancement | [piccalil](https://piccalil.li/blog/the-interpolate-size-property-is-a-great-example-of-progressive-enhancement/), [Builder.io](https://www.builder.io/blog/animated-css-accordions) | Animated native `<details>` where supported, instant elsewhere, so no JS accordion is needed |
| `@starting-style`, `transition-behavior: allow-discrete` | Baseline 2024–25 | MDN | Entry and exit animation for `<dialog>`/popover in pure CSS |
| `prefers-reduced-transparency` | About 73% global support | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency), [caniuse](https://caniuse.com/wf-prefers-reduced-transparency) | Honour it where present. The translucent layer must already meet contrast without it |
| `font-optical-sizing` | Baseline. Automatic for fonts with an `opsz` axis | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing), [Inter](https://rsms.me/inter/) | Inter 4 has text and display optical sizes. Whether `next/font/google` serves its `opsz` axis needs confirming at implementation (`axes: ["opsz"]`) |

---

## Part 4 — Effects research, judged against the eight questions

The questions, in column order:
1. **Problem**: what user problem does it solve?
2. **Improves**: what experience does it improve?
3. **EF**: does it strengthen Everything.Free?
4. **Cost**: does it slow the page? Remember the 726-card `/resources`.
5. **A11y**: is it accessible?
6. **RM**: is it compatible with reduced motion?
7. **Repeat**: would it still feel premium after repeated use?
8. **Distinct**: does it look distinctive, or merely trendy?

Verdicts: **ADOPT**, **ADOPT (limited)**, **DEFER** (worth it, but not now or needs data), or **REJECT**.

| Effect | Problem | Improves | EF | Cost | A11y | RM | Repeat | Distinct | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Scroll-linked motion (scrubbed transforms) | None for a reference site | Spectacle | No | GPU/main-thread work over long lists | Vestibular risk | Must be removed | Tires fast | Trendy (Framer template) | **REJECT** |
| Scroll-driven *state* cue (header hairline or shadow after 8px) | "Where does chrome end?" when content scrolls under the header | Orientation | Yes, quietly | CSS only, ~0 | Fine | Static state is the fallback | Invisible, so fine | Neutral | **ADOPT (limited)** |
| View transitions for route navigation | Hard cut between card and detail page loses place | Continuity | Yes | Native snapshot, short | Fine if brief | Disable entirely | Must be ≤250ms cross-fade | Neutral | **ADOPT (limited)**, root cross-fade only |
| Shared-element transition (card monogram + title → detail header) | Confirms "this is the thing you clicked" | Wayfinding | Yes | One named element per navigation | Fine | Disable | Fine if subtle | Somewhat distinctive | **ADOPT (limited)**, after a prototype verifies React `ViewTransition` under static export and CSP |
| Spatial or zoom transitions | None | Drama | No | Moderate | Vestibular risk | Remove | Tires | Apple-imitative | **REJECT** |
| Progressive blur (layered masked `backdrop-filter`) | None. Content under the header is already handled by an opaque or near-opaque bar | Aesthetic | No | Several blur layers repaint on scroll | Lowers legibility | n/a | Tires | Trendy | **REJECT** |
| Material transition (opaque → translucent header on scroll) | Marginal | Marginal | Weak | Low | Contrast risk | Fine | Fine | Trendy | **REJECT**. Use one consistent header material |
| Dynamic translucency in content | None | None | Contradicts HIG content-layer rule | Blur cost | Contrast | n/a | No | AI-glass cliché | **REJECT** |
| Typography reveal (headline fades or slides in) | None. It delays reading | Spectacle | No | Low | Delays content for everyone | Remove | Tires on the second visit | Trendy | **REJECT** |
| Variable-font animation (animating `wght`/`opsz`) | None | Novelty | No | Repaint per frame | Fine | Remove | Gimmick | Trendy | **REJECT**. Use static optical sizing (Part 7) |
| Character / word / line animation | None | Spectacle | No | DOM splitting hurts screen readers and translation | Poor (split text) | Remove | Tires | AI-template cliché | **REJECT** |
| Mask / clip-path reveals on content | None | Spectacle | No | Low | Delays content | Remove | Tires | Trendy | **REJECT** |
| Clip-path for a **state indicator** (sliding selected-segment highlight) | Shows which option is selected as it changes | Feedback | Yes, small | CSS only | Fine, state also in ARIA | Instant | Fine | Neutral | **ADOPT (limited)**, segmented controls only |
| Magnetic buttons / cursor-following | None. It makes targets move | Toy | No | Pointer listeners | Harms motor-impaired users | n/a | Annoying | Cliché | **REJECT** |
| Pointer-aware lighting (card spotlight) | None | Decoration | No | Per-card listeners × 726 | Neutral | n/a | Tires | Very AI-SaaS | **REJECT** |
| Micro-parallax | None | Depth illusion | No | Scroll listeners | Vestibular | Remove | Tires | Trendy | **REJECT** |
| Depth layering (clear z-order: content, sticky toolbar, sheet, dialog) | Users must know what is on top and modal | Clarity | Yes | Tokens only | Fine | n/a | Fine | Neutral, necessary | **ADOPT**, as elevation tokens, not visual flourish |
| 3D transforms | None | Novelty | No | Moderate | Vestibular | Remove | Tires | Trendy | **REJECT** |
| Motion blur | None | Novelty | No | Filter cost | Blur harms legibility | Remove | No | Trendy | **REJECT** |
| Spring physics (as `linear()` easing tokens) | Linear easing feels mechanical on sheets and popovers | Tactility of state changes | Yes, small | CSS only | Fine | Collapsed by global rule | Fine if damped with no visible bounce | Neutral | **ADOPT (limited)**, sheet and popover entry only, no overshoot on content |
| Gesture-driven interaction (swipe-to-dismiss sheet) | Mobile users expect to drag sheets away | Mobile ergonomics | Moderate | JS pointer handling | Needs a button alternative | Fine | Fine | Neutral | **DEFER**. Close button and Escape first. Add drag only if it can be done without fighting scroll |
| Contextual hover states (reveal secondary info on row hover) | Hidden information is invisible on touch and to keyboard users | Keeps rows calm | Mixed | Low | Must also show on `:focus-within` | Fine | Fine | Neutral | **ADOPT (limited)**. Hover only *raises contrast* or shows an affordance arrow. It never hides information |
| Expanding navigation (mega-menu) | Five nav items do not need it | None | No | JS | Menu-pattern complexity | — | — | — | **REJECT** |
| Morphing controls (search field → palette, filter button → sheet) | Shows the origin of a new surface | Continuity | Moderate | View transition | Fine | Disable | Fine if short | Somewhat distinctive | **DEFER**. Opening a palette or sheet plainly is fine. Revisit after the route-transition prototype |
| Adaptive surfaces (sidebar ↔ sheet by breakpoint) | Mobile filters currently push results away | Mobile filtering | Yes | Same markup, CSS | Dialog semantics on mobile | n/a | Fine | Necessary | **ADOPT** |
| Sticky contextual controls (results toolbar; detail "Open site" bar on mobile) | Count, sort and active filters scroll away; the primary action is lost on long pages | Orientation, action access | Yes | CSS `position: sticky` | Must not cover focused elements; set `scroll-margin` | n/a | Fine | Neutral | **ADOPT** |
| Command-palette transition | The palette should feel instant | Speed | Yes | `@starting-style` fade/scale ~120ms | Dialog semantics | Instant | Fine | Neutral | **ADOPT (limited)** |
| Sheet / drawer transitions | Shows where the sheet came from and where it goes | Spatial model | Yes | CSS `@starting-style` + `allow-discrete` | Fine | Instant | Fine | Neutral | **ADOPT (limited)**, ≤250ms, one direction per sheet |
| Filter transitions (results update) | A hard swap of 24 cards hides what changed | Continuity | Yes | One root cross-fade | Count already announced via `aria-live` | Disable | Fine at ~150ms | Neutral | **ADOPT (limited)**. Cross-fade only, no per-card choreography |
| Search-result reorder animation (FLIP per card) | Shows ranking change | Marginal | Weak | Per-card cost | Confusing motion | Remove | Tires | Trendy | **REJECT** |
| Shared image/element transitions | EF has no imagery; monograms only | — | — | — | — | — | — | — | Covered by the monogram row above |
| Progressive disclosure (`details`, "How we know", collapsed filter groups) | Detail pages are long; evidence detail is needed on demand | Scannability | **Yes, core** | Native | Native | Animation optional | Fine | Neutral | **ADOPT**, already present; animate with `::details-content` where supported |
| Directional navigation (pagination slides with direction) | Next/previous page orientation | Marginal | Weak | View-transition types | Fine | Disable | Okay | Neutral | **DEFER**. A plain cross-fade is enough |
| Scroll storytelling (pinned narrative sections) | Could explain the verification model | Comprehension, in theory | Weak. A static diagram does it better | High | Scroll-jacking harms everyone | Must be removed | Tires | Trendy | **REJECT**. Use a static, well-typeset diagram on `/verification` |
| Subtle shaders / WebGL / canvas backgrounds | None | Decoration | No | Large (GPU, bundle, battery) | Neutral to poor | Remove | Tires | AI-template signature | **REJECT** |
| Canvas for a **real** visualisation (e.g. the evidence distribution of the library) | "How much of this is checked?" | Honesty, made visible | Yes | Small if SVG | SVG + text table | Static | Fine | Distinctive (data-true) | **ADOPT (limited)**, as static server-rendered SVG, not canvas |
| Spatial UI | None on the web for this product | — | No | — | — | — | — | Apple-imitative | **REJECT** |
| Responsive motion (shorter or no motion on small screens and low power) | Mobile motion costs more and travels farther | Comfort | Yes | None | Positive | Positive | Positive | Neutral | **ADOPT**. Durations scale down below `sm`; sheets travel less distance |

**Summary of effect decisions**
- **Adopt**: adaptive sidebar ↔ sheet; sticky results toolbar and sticky mobile primary action; progressive disclosure with native `<details>`; elevation tokens; responsive motion tokens.
- **Adopt (limited)**: root cross-fade view transitions on route and filter changes; a shared-element transition for monogram + name, prototype first; damped `linear()` easing for sheet, palette and popover entry; a scroll-state header hairline; a selected-segment indicator; an honest static SVG of evidence distribution.
- **Defer**: swipe-to-dismiss; morphing search → palette; directional pagination.
- **Reject**: scroll-scrubbed transforms, parallax, progressive blur, content translucency, type reveals, split-text animation, variable-font animation, mask reveals on content, magnetic or cursor effects, pointer lighting, 3D, motion blur, shaders/WebGL backgrounds, scroll storytelling, mega-menus, and per-card reorder animation.

---

## Part 5 — Components research

Every component must have a genuine role in EF. Columns: role, verdict and notes (patterns from Geist, the HIG and WAI-ARIA).

| Component | Genuine role in Everything.Free | Verdict | Notes |
| --- | --- | --- | --- |
| Command palette | Jump to any of 726 resources, categories, collections or tools from any page by keyboard | **Adopt** | `<dialog>`, combobox + listbox ARIA pattern, `/` and ⌘K/Ctrl+K. Lazy-load a slim same-origin JSON index (slug, name, category, free status) generated at build, which fits `connect-src 'self'`. Results link to pages, so it never replaces `/resources`. Show a stable skeleton while the index loads. With no JS, the trigger is a link to `/resources` |
| Contextual navigation (breadcrumbs, "in this category") | Orientation in a 72-node taxonomy | **Adopt** | Breadcrumbs exist. Add sibling navigation on category pages |
| Adaptive navigation | Header nav → mobile dialog already | **Keep** | Polish only. The existing mobile dialog meets the focus contract the smoke test checks |
| Sheet (mobile filters) | Filters on mobile without losing results | **Adopt** | Modal `<dialog>` on mobile, explicit Close, footer "Show N results", `overscroll-behavior: contain`. The same `<form method="get">` so no-JS still works (the sheet is open-by-default or inline without JS) |
| Drawer | — | **Reject** | Covered by the sheet. A second overlay type adds nothing |
| Dialog | Mobile menu, palette, filter sheet | **Adopt**, one implementation | Consolidate the hand-rolled mobile-nav focus trap into a shared `<dialog>`-based primitive. Native `showModal()` provides the top layer, inertness and Escape |
| Popover | Evidence legend ("What do these states mean?"), sort menu | **Adopt (limited)** | HTML `popover` + Invoker Commands work without JS. Use anchor positioning with a static fallback |
| Segmented control | Grid/list density toggle on `/resources`; "Classification vs Confirmed" explanation | **Adopt (limited)** | Radio group semantics. Persisted in the URL (`view=list`) per the deep-link rule |
| Tabs | Detail page sections? | **Reject** | Hiding evidence behind tabs reduces scannability and find-in-page. Use an on-page index instead |
| Accordion / disclosure | Filter groups, "How we know", verification evidence | **Keep + refine** | Native `<details>`. The summary "View verification evidence" text is a smoke-test contract |
| Searchable select | Category filter (72 options) | **Adopt (limited)** | A filter-within-group text input that narrows checkboxes client-side and is hidden without JS. It does not replace checkboxes |
| Advanced filters | Already present | **Refine** | Visually separate "Classification" from "Confirmed facts" more strongly, using the confirmed-only legend as a group header |
| Filter sheet | See Sheet | **Adopt** | — |
| Data table | Alternatives comparison (exists); optional list view of results | **Keep + adopt list view** | Tabular numbers. Each fact cell keeps `[data-fact]` + `[data-evidence]`. Caption kept. Focusable scroll region (exists) |
| Comparison view | Alternatives pages | **Keep** | Possibly allow pinning 2–3 resources via the URL later. **Defer** |
| Resource record | The detail page as a catalogue record | **Adopt** (reframe) | An archival "record" layout: identifier block, facts ledger (`dl`), provenance (sources, read dates, who), connections. Keep the `#facts-heading ~ div dl > div` structure |
| Inspector panel / split view | Preview a resource beside results without leaving the list | **Defer** | Useful, but it duplicates the detail page and adds JS to a 726-card page. Revisit if the catalogue grows |
| Side panel | Detail-page sidebar (verification, provenance, report) | **Keep** | It becomes sticky on desktop if it is shorter than the viewport |
| Sticky contextual actions | Results toolbar; mobile "Open site" bar on detail pages | **Adopt** | Must not obscure focus. Use `scroll-padding-top` on `html` |
| Breadcrumbs | Exists | **Keep** | — |
| Progress indicators | Image converter processing; palette index load | **Adopt (limited)** | Use only where real waits exist |
| Inline status | Evidence tags, per-field form validation | **Keep + systematise** | One `Status` primitive for evidence (icon + word + tone), reused by cards, tables and detail pages so they cannot drift |
| Toasts | "Copied" in the text toolkit; "Link copied" | **Adopt (limited)** | One polite `aria-live` region, CSS-only animation, and no library because of the style-injection CSP |
| Keyboard navigation | Global `/`, ⌘K; arrow keys in the palette; Escape everywhere | **Adopt** | Show `Kbd` hints and localise platform symbols |
| Empty states | Already honest | **Keep + refine** | Every empty state offers a next step (Vercel's "no dead ends"). This exists today |
| Loading states | Rare: the site is static | **Keep minimal** | `aria-busy` + opacity on the filter panel during transition (exists) |
| Skeletons | Palette index only | **Adopt (limited)** | Mirror the final row layout exactly. Show-delay ~150ms |
| Error states | `error.tsx`, `not-found.tsx`, form errors | **Refine** | The 404 offers search and the most useful routes. Errors focus the first invalid field (exists in forms) |
| Responsive metadata | Card and detail metadata lines (category · type · platforms · licence) | **Adopt** | One "meta line" component with tabular, separator-consistent formatting that wraps gracefully, `translate="no"` on product names |

---

## Part 6 — Motion and material research, applied

### 6.1 Motion system (recommended)

Sources: [HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Vercel guidelines](https://vercel.com/design/guidelines), [Figma Motion](https://www.figma.com/blog/config-2026-recap/), [`linear()`](https://developer.mozilla.org/docs/Web/CSS/easing-function/linear).

- **Purpose test**: motion only explains a state change (opened, closed, selected, navigated, updated). It never decorates.
- **Tokens** (CSS custom properties in `globals.css`):
  - `--dur-instant` ~100ms for press and hover contrast;
  - `--dur-quick` ~160ms for disclosure and popover;
  - `--dur-move` ~240ms for sheet and palette;
  - `--dur-route` ~200ms for the view-transition cross-fade;
  - `--ease-out` (standard decelerate);
  - `--ease-spring`, a damped `linear()` curve with no visible overshoot.
- **Properties**: `opacity` and `transform` only, never `transition: all`. The existing `transition-colors` is fine for hover.
- **Reduced motion**: the existing global rule already collapses durations. View transitions must also be skipped (`@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation: none } }` or by not starting them).
- **Responsive**: shorter travel and duration below `sm`.
- **Remove**: the rotating search placeholder.

### 6.2 Material system (recommended): "paper and ink"

Sources: [HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Linear refresh](https://linear.app/now/behind-the-latest-design-refresh), [Vercel design rules](https://vercel.com/design/guidelines), [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency).

- **Content layer**: opaque surfaces. Structure comes from hairline rules, space and type, the way an archive or ledger works, not from boxed cards with shadows. Fewer borders, with softer contrast (Linear's "felt not seen").
- **Functional layer**: exactly one material, for the sticky header and the sticky toolbar. Near-opaque (≥ 0.94 alpha) with a light blur at most. Fully opaque under `prefers-reduced-transparency`. Contrast must pass without the blur.
- **Overlay layer**: sheet, dialog and palette are opaque and raised, with layered two-part shadows (ambient + direct) and a scrim.
- **Elevation tokens**: `content` < `sticky` < `overlay` < `toast`. Map these to z-index and shadow in one place.
- **Neutrals**: move from cool blue-grey to a warmer neutral defined in OKLCH, so gold reads as ink on paper rather than gold on gunmetal. Re-verify every AA pair: `--fg-muted` on `--bg` currently clears AA, and the redesign must keep that.
- **Gold discipline**: gold is reserved for brand mark, primary action and focus ring. Evidence colours stay semantic (success = confirmed only).

---

## Part 7 — Typography research, applied

Sources: [Inter](https://rsms.me/inter/) (text and display optical sizes), [font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing), [Inter optical sizing presets](https://nanx.me/blog/post/inter-optical-sizing/), [Geist typography presets](https://vercel.com/geist/text), [Figma 2026 trends: bold typography](https://www.figma.com/resource-library/web-design-trends/), [Stripe Press](https://press.stripe.com/).

Constraints: fonts must be self-hosted through `next/font` (as today), from OFL or similarly free licences, with no paid fonts and no runtime CDN. `font-src 'self'` enforces this.

Findings and recommendations:
- **Optical sizing beats two sans families.** Inter's display optical size gives large headings tighter, finer detail and small text sturdier shapes. If the `opsz` axis is available through `next/font/google` (`axes: ["opsz"]`, to be confirmed), Inter can carry UI text *and* tight-tracked display, so Manrope can be dropped. That saves a font download and removes the generic geometric look.
- **An editorial voice for headings and records.** A self-hosted OFL serif with its own `opsz` axis, such as Source Serif 4, gives category, collection and detail titles an archive or atlas voice that SaaS templates do not have. Use it for display and standfirsts only, never for UI controls or evidence labels. Display tracking stays modest, unlike Geist's aggressive negative tracking.
- **A mono for catalogue data**: optional and limited. A mono (OFL, such as IBM Plex Mono or JetBrains Mono) for record identifiers (the slug as a catalogue key), licence identifiers (SPDX), dates and counts. Otherwise use `font-variant-numeric: tabular-nums` with Inter (`tnum`), which costs nothing. Recommendation: start with Inter `tnum` and only add a mono if the record layout needs it.
- **Fluid scale**: a `clamp()`-based modular scale (about 1.2 on mobile, about 1.25 on desktop) in `rem`, so user font scaling works. Body at 16px minimum (and ≥16px inputs, to avoid iOS zoom). Measure is 60–75ch (the existing `--container-prose: 46rem` fits).
- **Editorial hierarchy**: masthead → section kicker (small caps or tracked label) → serif title → standfirst → dense index. Today every section is "h2 + muted description + grid", with no rhythm change.
- **Restrained kinetic type**: none. No split-text, no variable-axis animation, no reveal. Expression is static scale contrast. This is the decision with the biggest effect on avoiding the AI-template look.
- **Keep**: `text-wrap: balance` on headings and `pretty` on paragraphs. Add `font-feature-settings` for Inter `cv11`/`ss01` (already present), `tnum` for counts, and curly quotes and the ellipsis character in copy.
- **Budget**: Latin subset only (as today). Load at most 2 families with variable files. Preload the body face (next/font does this).

---

## Part 8 — Implications for the "Global Utility Atlas" concept

The atlas idea must be built from **real dimensions only**:

- **Territories = category groups and categories** (72 categories in 8 groups, in `src/config/categories.ts`). An atlas *index* (A–Z plus group) is honest and useful. A geographic map is not.
- **Legend = the evidence states.** Cartography's most transferable idea is the *legend*: one consistent key of symbols and words, shown wherever the symbols appear. EF already has five evidence states with icon + word. Make the legend a first-class, always-reachable popover and print it on `/verification`.
- **Coordinates = metadata.** Platform, type, licence and free status work as a compact, consistently ordered meta line, like a map grid reference. They are not a set of coloured badges.
- **Survey status = verification.** A map shows surveyed versus unsurveyed areas. EF can honestly show "726 listed · 10 with any confirmed fact · 0 verified" as a static, server-rendered SVG bar on `/verification` and the homepage, computed at build. This is the one data visualisation the data fully supports. It is also distinctive *because* it is honest.
- **No region, country or language coverage surfaces**, because there is no data (§1.6). If wanted later, that is a data and schema project with its own verification check.

---

## Part 9 — Key decisions handed to the design step

1. **Region data does not exist.** Do not build maps, region filters or "global coverage" counts. `languages[]` is empty for all 726 entries, so do not surface it either.
2. **Keep `lib/` untouched.** The redesign is presentational, so the 47 unit tests stay green. Keep every smoke-test contract in §1.9, or update the smoke test deliberately in the same change.
3. **CSP-compatible implementation**: CSS in the stylesheet, no runtime `<style>` injection, no inline handlers, no remote assets, and any new inline script must be static. Prefer native `<dialog>`, `popover`, `details` and Invoker Commands.
4. **Top adopt**: mobile filter sheet; sticky results toolbar and mobile primary-action bar; a command palette over a lazily loaded same-origin index; root cross-fade view transitions (shared element only after a prototype); `::details-content` disclosure animation; motion and elevation tokens; a warmer OKLCH neutral palette with disciplined gold; editorial serif display + Inter with optical sizing; the honest evidence-distribution SVG.
5. **Top reject**: grid-plus-glass hero, pill-chip overload, content translucency, progressive blur, scroll-scrubbed and parallax motion, split or kinetic type, cursor and pointer effects, WebGL/shaders, scroll storytelling, rotating placeholder.
6. **Performance guardrail**: the resource card's DOM must shrink. `/resources` renders 726 of them (8.6 MB HTML baseline). Consider `content-visibility: auto` on result rows and re-measure bundle and HTML bytes against `.agents/ui-review/baseline.txt`.
7. **Fix stale numbers** in `docs/architecture.md` and `docs/verification.md` (44 → live counts) when docs are touched. This is optional for the redesign, but the redesign must not copy the stale figures into the UI.
