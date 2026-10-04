# Global UI implementation plan 002: Everything.Free

This is the build order for `ui/global-premium-redesign-002`. It implements the approved direction (`docs/design/global-ui-direction-002.md`, revision 5, cited as "D §x") and the design system (`docs/design/global-ui-system-002.md`, cited as "S §x"). The research is `docs/design/global-ui-research-002.md`. Where the direction and the system disagree, the direction wins (S, Precedence). Where the user's original brief asks for something the direction does not cover, this plan says so and records the decision (see "Decisions taken by this plan").

The plan does not re-decide the architecture. It puts the work in order, says which guardrail lands in which increment, and gives each increment its files, acceptance checks and commits.

---

## 0. Ground rules for every increment

### 0.1 Paths and git

- Worktree (all work happens here): `c:\Users\appum\Downloads\everything.free-main\everything.free\.worktrees\ui-redesign-002`, branch `ui/global-premium-redesign-002`, base `af01c3f` (= `origin/main`).
- Use absolute paths, or pass the worktree as `cwd` on every shell call. A relative path run from the default cwd lands in the **main repo** at `c:\Users\appum\Downloads\everything.free-main\everything.free`. Never touch the main repo: no checkout, switch, stash, reset, restore, clean or commit there. Its pre-existing changes (`docs/architecture.md`, `.agents/`, `docs/verification/developer-resource-expansion-001-review.md`) belong to someone else.
- Commit only in the worktree, staging named files only (never `git add -A` or `git add .`):

  ```powershell
  git -C "c:\Users\appum\Downloads\everything.free-main\everything.free\.worktrees\ui-redesign-002" add <files…>
  git -C "c:\Users\appum\Downloads\everything.free-main\everything.free\.worktrees\ui-redesign-002" -c user.name="appukannadiga" -c user.email="215962484+Manvanth-Gowda-M@users.noreply.github.com" commit -m "<type>(ui): <summary>"
  ```

- Never change git config. Never use `--no-verify` or `--amend`. Never push, open a PR, merge or rebase. Never commit `.agents/**`, screenshots, `out/`, `.next/` or `tsconfig.tsbuildinfo`.
- Commit messages follow the repo's Conventional Commits style (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`), with the scope `ui`.

### 0.2 Verification

Node is v22.20.0, so `npm test` works (it needs 22.18+). Chrome is available locally, because the baseline ran `test:browser`.

| Name | Commands, run with the worktree as cwd | Pass condition |
| --- | --- | --- |
| **V** (every increment, before every commit) | `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` | Each exits 0. `npm test` reports ≥ 47 passing tests plus every test added so far, with 0 failures. `npm run build` prints its static page count with no data-validation error |
| **V+S** (the increments marked below) | V, then `npm run build:static` and `npm run test:browser` | `build:static` prints "Content Security Policy written into N pages (… inline scripts hashed, no 'unsafe-inline' for scripts)". `test:browser` reports all checks passed: 61 existing plus the ones added so far |
| **V+F** (increment 18 only) | V+S, then `npm run backlog:check` and `npm run check:verification` | Both exit 0 |

Baseline (`.agents/ui-review/baseline.txt`): lint, typecheck, 47/47 tests, build (1844 pages), build:static (1114 pages, 8190 hashed scripts), test:browser 61/61, backlog:check and check:verification all PASS. Bundle sizes: `/` JS 612,169 B and HTML 276,110 B; `/resources` HTML 8,632,437 B; CSS 41,802 B.

A failing check is fixed before the commit. It is never skipped, weakened, deleted or relaxed. That applies to the 47 unit tests and the 61 smoke checks, which are unchanged by this work: smoke additions are **additive only**, appended to `scripts/browser-smoke.mjs` with the existing `check()`, `waitFor` and `key()` helpers.

### 0.3 Hard constraints (apply to every increment, every reviewer checks them)

1. **Evidence display is non-negotiable.** A fact's state comes only from `factEvidence`, `cardEvidenceSummary`, `hasRecordedValue`, `effectiveVerification`, `isVerificationStale` and `config/verification` helpers, all imported unchanged. No surface shows an unverified fact as confirmed. Unknown stays "Unknown". Recorded-but-unchecked values read "Recorded as …" or "Listed as …". Success green means confirmed evidence only. The four evidence glyphs render only through `EvidenceMark`.
2. **Out of bounds, read and import only:** `src/lib/**`, `src/data/**`, `src/types/**`, `src/config/verification.ts`, `src/config/maintainers.ts`, `.github/**`, CODEOWNERS, `scripts/csp.mjs`, `scripts/build-static.mjs`, `scripts/fix-rsc-paths.mjs`. Other `src/config/*.ts` files are not edited either. Check before every commit: `git -C <worktree> diff --stat af01c3f -- src/lib src/data src/types src/config .github scripts/csp.mjs scripts/build-static.mjs scripts/fix-rsc-paths.mjs` prints nothing.
3. **Static export only.** No server runtime, API routes, server actions or per-request rendering. New JSON files are `dynamic = "force-static"` route handlers, the same pattern as `src/app/link-manifest.json/route.ts`. `build:static` (which uses `output: "export"`) is the proof.
4. **Strict CSP.** No inline event-handler attributes, no runtime `<style>` injection, and no new inline `<script>` beyond Next's own (static text, hashed by `scripts/csp.mjs`). `connect-src 'self'`: fetches are same-origin, through `withBasePath`. Inline `style=""` attributes are allowed and carry per-instance custom properties (`--w`, `--c`, `--u`, `--n`).
5. **Fonts are self-hosted through `next/font/google`** (downloaded at build). There is no CDN, no analytics, no tracking and no paid service.
6. **Zero new dependencies.** `package.json` and `package-lock.json` stay unchanged. If an implementer believes one is unavoidable, they stop and ask. If it is approved, it is installed with `npm install --save-exact <pkg>@<version>`, a well-known maintained package, with a written justification in the commit body.
7. **Real data only, and zero emoji.** Every count is computed (`libraryCensus`, `computeFacets`, `FACTS.length`, repository reads, `formatCount`). There are no fake testimonials, avatars, ratings, metrics, activity feeds or logos. The AI-slop ban list (S §19.3) applies.
8. **Per-section review.** Each increment that adds or restyles a user-facing section ends with a two-line note in the commit body: "Would Apple ship this?" (craft: hierarchy, states, spacing, motion) and "AI-slop check" (against D §10 and S §19.3). Apple is the craftsmanship benchmark only, never a visual model.

### 0.4 Guardrail rollout

`tests/design-guardrails.test.mts` (D §14) grows one rule at a time. Each rule lands in the increment that makes it true, so the test is green on every commit. Rule data (owner lists, `ROUNDED_FULL_ALLOWED`) lives at the top of the file. CSS rules strip `/* … */` comments first (`text.replace(/\/\*[\s\S]*?\*\//g, "")`), which resolves design-review NIT N3.

| Rule (D §14 / §6.7 / §2.x) | Lands in |
| --- | --- |
| Client storage outside `components/layout/theme.tsx`; `transition-all`; arbitrary `duration-[…]`/`ease-[…]`/`delay-[…]` classes | 01 |
| `oklch(from` outside an `@supports (color: oklch(from` block; `globals.css` declares no colour token and references no `--success*`/`--warning*`/`--danger*`/`--info*` | 01 |
| Radius ceiling (`rounded-(lg\|xl\|2xl\|3xl\|4xl)` with directional prefixes, plus arbitrary `rounded-[…]`) outside tool UIs | 01 |
| Focus suppression (`outline-none`/`outline-hidden`) outside the three-entry allow-list | 01 |
| `backdrop-blur`/`backdrop-filter` outside `materials.css`; `material-functional` in at most 3 files | 01 |
| Success rules 1 and 2; gold owner list (classes and `var(--primary` in `.tsx`; `--primary` in CSS only in the four style files) | 01 |
| Reserved evidence glyphs (three regexes); emoji scan of `src/**` (allowing ©, ®, ™) | 01 |
| `tokens.test.mts`: contrast pairs, `--surface-hover` in every theme block, `@theme inline` in `tokens.css` | 01 |
| `tokens.test.mts`: `--font-serif` and `--font-display` stacks; serif owner list | 02 |
| Count literals in `src/features/home/**` and `src/app/page.tsx`; `animate-` classes other than `animate-none` | 03 |
| `onEscape` anywhere in `src/` | 04 |
| `rounded-full` per-file count equals `ROUNDED_FULL_ALLOWED` exactly | 09 |
| `transition`/`animation` declarations and `@keyframes` outside `motion.css`; every `:target` in `motion.css` written `:target:not(#main)`; no `:target` in any other `.css` | 14 |

---

## Decisions taken by this plan

Each decision is final for the implementer. The reasoning follows each one.

1. **The workflow tail is not restructured.** The 18 increments form one dependency chain: tokens, then type, then primitives, then chrome, and so on. They share the same files (`resource-explorer.tsx`, `app/resources/[slug]/page.tsx`, `design-guardrails.test.mts`), and the guardrails tighten along the chain. Separate FEAT steps would add hand-off cost without gaining any independence. The existing implement-and-review build loop runs this plan increment by increment, and its stop contracts (`.agents/ui-review/build-verdict.json` APPROVED, then `.agents/ui-review/quality-gate.json` PASS) are untouched.
2. **Design-review NITs.**
   - N1: `features/tools/implementations/image-converter.tsx`'s `file:rounded-md` becomes `file:rounded-sm` in increment 01, so it still nests inside its 8px parent.
   - N2: option (a). "The just-added compare item" is not flashed. `aria-pressed` and the tray text confirm the addition, so `compare-tray.tsx` and `compare-toggle.tsx` stay off the gold list.
   - N3: the CSS guardrails strip comments first (§0.4).
3. **Search has no autocomplete dropdown on the search field.** The brief asks for "suggestions, keyboard nav, instant filtering". The approved design puts those on purpose-built surfaces: query suggestions are the real `intentExamples` as text links; the keyboard-first suggestion list is the command palette (increment 10), with arrows, Enter and live results on every keystroke; instant filtering is the URL-driven `ResourceExplorer`, which re-runs `runSearch` on every change, plus the instant type-to-narrow subject filter. S §14.1 marks the search field's Expanded state "n/a: no autocomplete popup". A second suggestion popup would duplicate the palette.
4. **There is no dedicated licence facet.** `ResourceQuery` (`src/types/search.ts`) and `lib/search/params` have no licence field, and both are out of bounds. A filter outside them would be dropped from the URL on the next change, and `computeFacets` could not count it. Licence is reachable three ways: the confirmed-only "Open source" filter, free-text search (`lib/search/engine.ts` scores `license` at weight 5, with the reason "Licence mentions …"), and the coordinates line on every record. A licence facet is backlogged as a `lib/` and `types/` change with its own tests.

   **Verification-status filter group (recorded in increment 09).** Increment 09 lists "verification status" among the "As recorded" groups. It is not built, for a reason in the same out-of-bounds layers. `ResourceQuery.verificationStatuses` and its `?verification=` parameter exist, but `ResourceFacets` (`src/types/search.ts`, filled by `computeFacets` in `lib/search/filters`) carries no verification counts, so the group could not show counts or disable empty options as every other group does. The predicate also matches the stored `verificationStatus`, not `effectiveVerification`, so a lapsed "Verified" listing would match a "Verified" filter while its record reads otherwise, which the evidence rule does not allow. It is backlogged as a `lib/` and `types/` change: verification counts in `ResourceFacets`, a predicate on `effectiveVerification`, and their tests. Verification state stays visible on every record (the record foot and the fact meter) and on `/verification`.
5. **The palette gains three actions the brief names and the direction does not:**
   - **Copy official URL.** The palette index gains `o` (the `officialUrl`) per resource entry. With a listing row active, Shift+Enter copies it with `navigator.clipboard.writeText`. The result goes to the palette's polite live region: "Copied the official link for {name}", or on failure "Could not copy. The official link is {url}". Shift+Enter was chosen because Ctrl+Shift+C opens DevTools in Chromium, and Ctrl/⌘+C must keep copying selected input text. The option's `aria-describedby` points at the footer hint "Shift+Enter copies the official link". There is no toast, because nothing in the product uses one (D §2.4). A URL is a pointer, not a claim, so it carries no evidence mark (D §3.2 station 1).
   - **Filter rows.** When the query matches a free-status, resource-type or platform label, or an evidence-filter label ("no credit card", "open source"), a "Filter the library" group (max 3 rows) offers "Show {label} listings". Its `href` is built with the unchanged `buildResourcesHref` from `lib/search/params`. Evidence-filter rows say "· confirmed", exactly as the active-filter tokens do.
   - **Jump to sections.** "Go to" gains the homepage section anchors that exist after increment 03: Subjects index, A starting selection, Recently checked, Tools, Collections, Alternatives. On a record page it also gains "On this page" rows for the sections that page renders (the same `sections` array, read from the DOM `nav[aria-label="On this page"] a`).

   All three are additive to D §3.4, use existing data and no new storage, and keep the combobox pattern intact.
6. **Quick Compare (increment 12) keeps its number but stays separable.** Its commits touch only compare files plus three additive hooks: the optional `renderCompare` prop on `RecordList`, `useReducer(compareSelection, [])` in `ResourceExplorer`, and the `compare-link.tsx` island on the record page. Later increments that touch compare (14 tray ENTER, 15 segmented slide, 16 overflow check) do so in **separate commits whose subject starts `compare:`**, so all compare work can be reverted as a set (D §15 criterion 19).
7. **Global coverage is documented in a new file,** `docs/design/global-coverage-002.md`. It is not added to `docs/architecture.md`, which has uncommitted edits in the main repo and would conflict.
8. **The README tech-stack line is updated:** "Inter and Manrope" becomes "Inter and Source Serif 4". A stale font name would be a factual error in a doc that this change makes wrong.
9. **Measurement uses one scratch script,** `.agents/ui-review/measure.mjs`, which is never committed. It reads `out/`: the byte size of `index.html` and `resources/index.html`; the summed size of unique `<script src>` and `<link rel="stylesheet">` assets referenced by `/`; total CSS bytes; the count of `@font-face` families; per-record element counts; and the gzip size of `palette-index.json` and `compare-index.json` through `zlib.gzipSync`. Results are appended to `.agents/ui-review/perf.md`, which is also not committed.

---

## Implementation Plan

- [ ] 00. Commit the design documents and capture the pre-change baselines.
      With nothing else changed, commit the four design docs as the branch's first commit. Before any rebuild (`out/` still holds the base-SHA export), write `.agents/ui-review/measure.mjs` and record in `.agents/ui-review/perf.md` the element count of three `/resources` articles: `supabase` (the confirmed-heavy smoke fixture); the first `OPEN_SOURCE` entry with stage `not-started` in `out/link-manifest.json`; and the first non-open-source `not-started` entry. The count is the opening tags `<[a-z]` between that article's `<article` and its `</article>` in `out/resources/index.html`. Also record the CSS bytes.
      Files: `docs/design/global-ui-research-002.md`, `docs/design/global-ui-direction-002.md`, `docs/design/global-ui-system-002.md`, `docs/design/global-ui-plan-002.md` (commit); `.agents/ui-review/measure.mjs`, `.agents/ui-review/perf.md` (not committed).
      Commit: `docs(ui): add global UI research, direction, system and plan 002`.
      Verify: `git -C <worktree> show --stat HEAD` lists exactly the four `docs/design/*.md` files. `perf.md` holds three element counts and a CSS byte figure.

- [ ] 01. Design tokens: token files, materials, radius scale, and colour, focus and glyph discipline (D §2.1, §2.4–§2.6, §12.3; S §1–§8, §10, §12).
      Depends on 00. Three commits.
      **01a. Token files and tests.**
      - Create `src/styles/tokens.css` with the OKLCH dark (`:root, .dark`) and light (`.light`) blocks from D §2.1 and S §2.1. That includes `--rule`, `--focus`, light `--primary-hover` and `--scrim`; `--shadow-card: none` and the `--shadow-raised` and `--shadow-overlay` values; the z tokens (`--z-content` 0, `--z-sticky` 30, `--z-header` 40, `--z-overlay` 50); and `--header-h` on `html` (56px, 64px from `lg`). Every `-soft` and relative-colour value follows the "static value first, `oklch(from …)` only inside `@supports (color: oklch(from red l c h))`" rule.
      - Move the whole `@theme inline` block from `globals.css` into `tokens.css`, adding `--color-rule`, `--radius-xs: 3px`, `--radius-sm: 6px` and `--radius-md: 10px`. The font and `--text-*` changes wait for 02.
      - Create `src/styles/materials.css`: `@utility material-base`, `material-content`, `material-elevated` and `material-functional` (opaque under `prefers-reduced-transparency: reduce` and `@supports not (backdrop-filter: blur(1px))`); `--fill-pressed` and `--primary-pressed`; and forced-colours fallbacks for the materials.
      - Rewrite `src/app/globals.css`. It keeps `@import "tailwindcss"` and `@custom-variant dark`, imports `../styles/tokens.css` and `../styles/materials.css`, and keeps the base layer, `:focus-visible` (now `var(--focus)`), `::selection`, scrollbar and the reduced-motion kill switch (which moves in 14). It adds checkbox and radio `accent-color: var(--primary)` and `@utility link-inline`, and deletes `hero-grid` and its usage in `hero.tsx`.
      - `src/app/layout.tsx`: `themeColor` becomes the sRGB equivalents of the two `--bg` values.
      - Add `tests/tokens.test.mts`: OKLCH to sRGB maths, every D §2.1 and S §2.3 contrast pair in both themes, `--surface-hover` in each block, and `@theme inline` present.
      - Add `tests/design-guardrails.test.mts` with the 01 rules from §0.4 that are already true: storage, `transition-all`, arbitrary motion classes, `oklch(from`, and no status tokens in `globals.css`.
      - If a contrast pair fails, adjust only that token's L value.
      Commit: `feat(ui): introduce OKLCH token, material and theme files`.
      **01b. Radius, z-index, focus and blur conversions.**
      - Convert radii in every non-tool `src/**/*.tsx` in this order: `rounded-md`→`rounded-xs`, then `rounded-lg`→`rounded-sm`, then `rounded-xl`→`rounded-md`. Today's counts are 11, 36 and 12, plus one `rounded-2xl` in `app/page.tsx`, which becomes `rounded-md` until 03. In `image-converter.tsx`, `file:rounded-md` becomes `file:rounded-sm` (N1).
      - Replace literal `z-40` (`site-header.tsx`) and `z-50` (`mobile-nav.tsx`, skip link) with the z tokens.
      - Remove `focus:border-primary` and `focus:outline-none` from `components/ui/field.tsx` and `sort-select.tsx`. In `search-box.tsx`, replace the wrapper's `focus-within:border-primary` with `has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--focus)`; the inner input keeps `outline-none`. If those variants fail to compile, use D §17 assumption 9's `.search-field` fallback in `materials.css`. Remove `focus-within:border-primary/50` from `card.tsx`. Remove `accent-primary` from `field.tsx`.
      - Site header: `bg-bg/85 backdrop-blur-md` becomes `material-functional`. Hero: drop its `backdrop-blur` translucent card in favour of opaque `bg-surface`, as an interim until the rewrite in 03.
      - Add the radius-ceiling, focus-suppression, blur and functional-count rules.
      Commit: `refactor(ui): adopt the 3/6/10px radius scale, z tokens and visible focus`.
      **01c. Colour and glyph discipline.**
      - Apply the gold removals of D §2.1 (the "Removed as part of this work" list): `hover:text-primary` becomes `link-inline` across pages; `Results for` and the inferred `bolt` lose gold; decorative gold icons are deleted; `border-l-primary` on "Why it is listed" goes. Also apply every row of D §12.3 "Conversions this requires", and the `badge.tsx` and `callout.tsx` maps where `primary` and `info` resolve to neutral.
      - Implement the `Badge` end state (`appearance?: "badge" | "ledger"`, `rounded-xs`, 1px border, neutral `--border`/`--surface`/`--fg-muted`). In `Callout`, add the `id` prop and `icon?: IconName | null`.
      - Export `EvidenceMark` from `evidence.tsx`, and replace the comment glyph there (the one emoji hit in `src`). Make `FreeStatusBadge` and `VerificationBadge` word-only.
      - Route verification-panel row icons and the filter-panel "Confirmed only" note through `EvidenceMark`. Remove the `verification.icon` summary icon. Convert the `/about` object-literal icons, the "Planned" badges, the "Ready to file" Callouts (`icon={null}`), the record-page status Callout's tone and icon rule, and the `/free-status` and `/verification` definition badges.
      - Restyle only. No copy changes beyond those D §2.1 names ("Inferred ·" lands in 05).
      - Add the success, gold, reserved-glyph and emoji rules.
      Commit: `refactor(ui): restrict gold, success colour and evidence glyphs to their owners`.
      Files: `src/styles/tokens.css`, `src/styles/materials.css` (new); `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/{badge,button,callout,card,field,empty-state,skeleton}.tsx` (`Chip` lives in `badge.tsx`; edit each only where it holds a converted class), `src/components/layout/{site-header,mobile-nav,brand}.tsx`, `src/features/**/*.tsx` and `src/app/**/*.tsx` that the conversions and counts above name, `src/features/tools/implementations/image-converter.tsx` (N1 only); `tests/tokens.test.mts`, `tests/design-guardrails.test.mts` (new).
      Verify: V+S after 01c. The guardrail and token tests pass. `test:browser` reports 61/61. A manual look at `/`, `/resources/` and `/resources/supabase/` in both themes shows nothing unreadable.

- [ ] 02. Typography (D §2.2; S §3).
      Depends on 01.
      - `layout.tsx`: use `Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter", axes: ["opsz"] })` and `Source_Serif_4({ subsets: ["latin"], display: "swap", variable: "--font-source-serif", axes: ["opsz"], style: ["normal"] })`. Remove Manrope and its class. If the typings reject `axes`, drop it for that family only.
      - `tokens.css` `@theme inline`: `--font-serif: var(--font-source-serif), ui-serif, Georgia, serif`; `--font-display` becomes the Inter stack; add the `--text-2xs`…`--text-display` scale with line heights.
      - The `globals.css` base heading rule becomes `h1, .editorial h2 { font-family: var(--font-serif) }`, with the D §2.2 tracking and weights. Add `@utility kicker` (`2xs`, uppercase, `+0.08em`, `case`) and `--measure-standfirst`.
      - Add `font-serif` to every page `h1` (`app/**/page.tsx`, `not-found.tsx`, `error.tsx`, the `h1`s in `resource-explorer.tsx` and `static-library.tsx`), to `PageHeader`'s `h1`, and to the hand-written section `h2`s on `/about` and `/verification`. No other `font-display` class changes.
      - Use `tnum` (`tabular-nums`) on counts and dates where they are compared.
      - Update the README tech-stack line (Decision 8).
      - Extend `tokens.test.mts` with the font-stack assertions. Add the serif-owner rule.
      Files: `src/app/layout.tsx`, `src/styles/tokens.css`, `src/app/globals.css`, `src/components/ui/layout.tsx`, the page files with an `h1` (list from `grep font-display` at the `h1` sites), `src/features/search/components/{resource-explorer,static-library}.tsx`, `README.md`, `tests/tokens.test.mts`, `tests/design-guardrails.test.mts`.
      Commit: `feat(ui): set Source Serif 4 for editorial titles and Inter for the interface`.
      Verify: V+S. `out/_next/static/media` holds only Inter and Source Serif 4 font files (no Manrope). `test:browser` reports 61/61.

- [ ] 03. Global layout: primitives, editorial grid, homepage Library introduction and census (D §2.3, §4.1, §4.2, §5 M1, M2, M5, M6; S §4, §14.1).
      Depends on 02. Two commits.
      **03a. Primitives and page frame.**
      - `components/ui/layout.tsx`: `Section` gains `kicker` and `variant: "default" | "editorial"` (margin-column running head from `lg`, serif `h2`, `.editorial`). Breadcrumbs become `xs`, `--fg-subtle` with `/` separators. `Container` gutters become 16, 24 and 32px.
      - `html` gets `scroll-padding-top: calc(var(--header-h) + var(--toolbar-h, 0px) + 16px)` and `scrollbar-gutter: stable`.
      - `card.tsx` per M6. `empty-state.tsx`: the icon disc is removed (S §14.1, dashed `--border`). `skeleton.tsx`: `animate-pulse` is removed, leaving a static block. `button.tsx` states per S §14.1 (pressed `--fill-pressed`, danger soft). `Chip` (in `badge.tsx`) is confirmed at `rounded-xs`.
      - `not-found.tsx` and `error.tsx`: icon discs and the danger fill go. Copy, digest and `console.error` stay.
      Commit: `feat(ui): editorial section frame and ruled primitives`.
      **03b. Homepage.**
      - Create the pure `src/features/home/census.ts` (`libraryCensus`; `surveyByGroup` waits for 13) and `tests/census.test.mts` (D §14 row for `libraryCensus`).
      - Create `src/features/resources/components/legend.tsx`, with `variant="full"` only for now (popover in 09), and `survey-bar.tsx`. The `--survey-partial` and `--survey-other` tokens and the bar drawing go in `materials.css`.
      - Rewrite `features/home/components/hero.tsx` as the Library introduction (D §4.1). The `h1` reads "A library of {n} listings of free resources, across {m} subjects." through `Intl.PluralRules("en")`, with the zero-listing and zero-confirmed copy. The fixed placeholder, the `intentExamples` text links and the right-hand Legend and Survey bar follow. The `Kbd` hint waits for 10.
      - Recompose `app/page.tsx` per D §4.2:
        - "Browse by category" keeps its `h2` and existing `CategoryGroupCard` grid until 13 (smoke contract);
        - spotlight and recently checked keep `ResourceGrid` until 06;
        - tools, collections, audiences, alternatives (dotted leaders) and Contribute become ruled editorial index lists (no icons, no hover arrows, no `rounded-2xl` box);
        - `collection-card.tsx` becomes the editorial row (serif name, no `Card`).
      - Add the count-literal and `animate-` rules. Add smoke check 1 (homepage `h1` contains `formatCount(manifest.count)`, and the page has no "thousands").
      Commit: `feat(ui): homepage library introduction with build-time census, legend and survey bar`.
      Files: `src/components/ui/{layout,card,empty-state,skeleton,button,badge}.tsx`, `src/app/{not-found,error,page}.tsx`, `src/app/globals.css`, `src/styles/materials.css`, `src/features/home/census.ts`, `src/features/home/components/hero.tsx`, `src/features/resources/components/{legend,survey-bar}.tsx`, `src/features/collections/components/collection-card.tsx`, `tests/census.test.mts`, `tests/design-guardrails.test.mts`, `scripts/browser-smoke.mjs`.
      Verify: V+S. The census tests pass. Smoke check 1 passes, and the existing "Browse by category" and card-audit checks still pass. Every census number on `/` matches `out/link-manifest.json` (`count`, and listings with any confirmed fact).

- [ ] 04. Navigation: shared Dialog, minimal desktop top nav, purpose-built mobile nav, footer (D §3.10, §4.3 Header and Footer; S §14.2).
      Depends on 03.
      - Create `src/components/ui/dialog.tsx` with exactly the D §3.11 signature and D §3.10 behaviour: mount while open with `showModal()` in a layout effect; explicit `role="dialog" aria-modal="true" data-ef-modal`; the `cancel` handler (`preventDefault` only if cancelable); a `close` listener through a ref; scrim click; focus store and restore with the `#main` fallback; `returnFocus`; the exit wait (`transitionend` or computed duration + 50ms, which is about 50ms now that there is no transition); the `palette-top` variant with `data-palette`; and `html:has(dialog[data-ef-modal][open]) { overflow: hidden }` in `materials.css`. There is no Escape-veto prop.
      - Create `src/components/ui/kbd.tsx`.
      - `site-header.tsx`: wordmark "Everything" + gold "." + "Free" in Inter 600 (`brand.tsx`, EF tile removed), five text-only nav items from `primaryNav`, the search link kept as the trigger slot (it becomes the palette trigger in 10), theme toggle, Submit (secondary) and `MobileNav`. Height comes from `--header-h`.
      - `nav-links.tsx`: the current item gets a 2px gold underline and `aria-current="page"`.
      - `mobile-nav.tsx` moves onto `Dialog variant="panel-right"`. The hand-rolled focus trap and nav icons go. Its current item is in ink (`--fg`), not gold (S §20 item 12). Keep the `aria-label="Open menu"` trigger.
      - `site-footer.tsx`: four text columns plus the colophon (D §4.3).
      - Add the `onEscape` rule.
      Files: `src/components/ui/{dialog,kbd}.tsx` (new), `src/components/layout/{site-header,nav-links,mobile-nav,brand,site-footer}.tsx`, `src/styles/materials.css`, `tests/design-guardrails.test.mts`.
      Commit: `feat(ui): native dialog primitive, text navigation and mobile menu`.
      Verify: V+S. The existing smoke checks "mobile menu opens as a dialog, traps focus, closes on Escape", "first Tab reaches a visible skip link" and the hydration signal still pass. Manual check at 390px: the menu opens and closes, and focus returns to "Open menu".

- [ ] 05. Search: field, results toolbar, Evidence Gate, active-filter tokens, result and empty states (D §3.5, §8 C2; S §14.1, §14.5; Decision 3).
      Depends on 04.
      - `search-box.tsx`: one fixed placeholder, "Try “free PDF tools” or “alternative to Photoshop”". The rotation timer and its media listener are deleted. `SearchSuggestions` become " · "-separated text links. The wrapper gets `data-search-field`, and `input type="search"`.
      - Create `src/features/search/components/results-toolbar.tsx`: `data-results-toolbar`, FUNCTIONAL, sticky at `top: var(--header-h)`, `--z-sticky`, `min-height` 48px, one `ResizeObserver` setting `data-wrapped`. `html:has([data-results-toolbar]) { --toolbar-h: 48px }` and the `[data-wrapped]` 88px rule go in `materials.css`.
      - The toolbar's count paragraph (`aria-live="polite"`) starts with the total: "{total} listings match", "{total} listings" or "0 listings match", through `Intl.PluralRules`. The " · page p of n" suffix shows from `sm`.
      - The sort select moves into the toolbar.
      - `resource-explorer.tsx`:
        - owns `useTransition`, `navigate` and `isPending`;
        - wraps results in `aria-busy` with the 0.6 dim;
        - "Results for “q”" is in `--fg`;
        - the inferred Callout is neutral with `icon={null}`;
        - the evidence-filter Callout gets `icon={null}` and `id="evidence-filter-notice"`, with its inner `data-testid` span and copy verbatim.
      - `sort-select.tsx` and `filter-panel.tsx` take `onNavigate` and `isPending` props. Their own `useTransition` and `router.push` are removed, and the URLs they build are unchanged.
      - Create `src/features/search/evidence-gate-copy.ts` (pure), `components/evidence-gate.tsx` (bar only when `!effectiveQuery.q?.trim()`, hidden below `sm`, no status hue) and `tests/evidence-gate-copy.test.mts` (every D §14 case, including the intent-only `runSearch` case).
      - `active-filters.tsx`: `rounded-xs` tokens, `h-8` (`pointer-coarse:h-11`), no `bolt`, the "Inferred ·" prefix, the D §2.1 hint sentence, and "Clear all" kept. Labels are unchanged ("No credit card · confirmed").
      - Empty states keep the "Nothing matched “{q}”" and "No resources match these filters" copy and the "Clear filters" action, restyled through `EmptyState`. The relaxed-matching Callout becomes neutral.
      - `pagination.tsx`: the current page gets a gold 2px rule (S §20 item 11).
      - `static-library.tsx`: restyle.
      - Add smoke check 13 (visible focus on the search wrapper and the sort select).
      Files: `src/features/search/components/{search-box,results-toolbar,evidence-gate,resource-explorer,sort-select,filter-panel,active-filters,pagination,static-library}.tsx`, `src/features/search/evidence-gate-copy.ts`, `src/styles/materials.css`, `tests/evidence-gate-copy.test.mts`, `scripts/browser-smoke.mjs`.
      Commits:
      - `feat(ui): sticky results toolbar and lifted search transitions`;
      - `feat(ui): evidence gate for confirmed-only filters`;
      - `refactor(ui): text-link suggestions and removable filter tokens`.
      Verify: V+S. The new copy tests pass. These existing checks are unchanged and pass: "filters update the URL and the results" (first number in `p[aria-live="polite"]`), "strict filter matches confirmed facts only", "natural-language constraint becomes a removable filter", "alternative-to query explains its matches", "no match shows the empty state" and "URL-driven filter loads directly". Smoke check 13 passes.

- [ ] 06. Resource records replace generic cards (D §3.1, §5 M3, M4, §8 C1; S §14.3, §14.4).
      Depends on 05.
      - Create `src/features/resources/fact-meter-counts.ts` (pure) and `tests/fact-meter.test.mts`, `components/fact-meter.tsx` (one element, `--c`/`--u`/`--n`; drawing and `--meter-unsettled` in `materials.css`, forced-colours border) and `components/coordinates-line.tsx`.
      - `status-badges.tsx`: `FreeStatusBadge` and `OpenSourceBadge` gain `variant: "badge" | "token"` with the D §3.11 signatures. The token variant keeps the `data-fact`/`data-evidence={state}` wrapper, the sr-only text and the visible "· not verified" suffix, and uses `Badge appearance="ledger"`.
      - Create `components/resource-snapshot.tsx` with `size="compact"` (renders exactly those two tokens and never reads `definition.tone`).
      - Create `components/resource-record.tsx` (`ResourceRecord` and `RecordList`, no `"use client"`, no hooks). Its anatomy is exactly D §3.1:
        - `data-zone="main"` holds no `data-fact`;
        - the snapshot opens `data-zone="facts"`;
        - the Catch line uses `headlineLimitation`;
        - the Matched line is text;
        - the foot carries the record key, `LastVerified`, `VerificationBadge`, the fact meter and `compareSlot`;
        - layout comes from `@container record (min-width: 44rem)`, with `content-visibility: auto; contain-intrinsic-size: auto 168px` in `layout="list"`.
      - Update every importer to `RecordList`: `app/page.tsx` (spotlight as `grid`, recently checked as `list`), `static-library.tsx`, `resource-explorer.tsx` (`list`), `categories/[slug]`, `collections/[slug]` (each record keeps its "chosen for" note and `data-testid="collection-evidence-note"`), `for/[audience]` and `alternatives/[slug]`.
      - Replace `ResourceCardSkeleton`/`ResourceGridSkeleton` with a record skeleton, or delete them if they have no importer. Delete `resource-card.tsx`.
      - Add smoke check 9 (the first `[data-fact]` in every `main article` is `freeStatus` with `data-evidence`).
      - Measure per-record element counts on the three 00 fixtures and the `/resources` HTML size. If the size exceeds 8,632,437 B, apply D §15 criterion 7's cut order (record key, then the licence part of the coordinates line, both from `/resources` list records only). Never cut evidence.
      Files: `src/features/resources/fact-meter-counts.ts`, `src/features/resources/components/{fact-meter,coordinates-line,resource-snapshot,resource-record,status-badges}.tsx`, the importers listed, `src/components/ui/skeleton.tsx`, `src/styles/materials.css`, `tests/fact-meter.test.mts`, `scripts/browser-smoke.mjs`; delete `src/features/resources/components/resource-card.tsx`.
      Commits:
      - `feat(ui): fact meter and coordinates line`;
      - `feat(ui): ruled resource records replace resource cards`.
      Verify: V+S. "cards never present an unconfirmed fact as confirmed", "client-side navigation from a resource card", "mobile: card evidence stays compact" and "no-JS: /resources lists the library" all pass unchanged. Check 9 passes. `perf.md` shows each fixture's element count ≤ its 00 count and `/resources` HTML ≤ 8,632,437 B.

- [ ] 07. Resource snapshots as data instruments (D §3.3; S §14.4).
      Depends on 06.
      - Add `size="full"` to `resource-snapshot.tsx`: a ruled 3-column grid (6 from `md`), with no fills.
      - Cell 1 is the free-status word carrying `data-fact="freeStatus" data-evidence`, plus the open-source token under the D §3.3 condition.
      - Cells 2–4 use the Facts ledger's exact phrasing: "Recorded as {lower-case value}", "Unknown", or `availabilityLabel` when confirmed.
      - Cell 5 counts platforms through `Intl.PluralRules`, or shows "Not recorded".
      - Cell 6 is `FactMeter labelled` with "{c} of {FACTS.length} facts confirmed" and " · {u} checked, not settled".
      - Each value gets an `EvidenceTag` under it.
      - On `app/resources/[slug]/page.tsx`, the full snapshot replaces the header's separate `FreeStatusBadge`/`VerificationBadge`/open-source badge row inside the page `<header>`. The rest of the page is reorganised in 11.
      Files: `src/features/resources/components/resource-snapshot.tsx`, `src/app/resources/[slug]/page.tsx`.
      Commit: `feat(ui): full resource snapshot on the record header`.
      Verify: V+S. "detail page shows value and evidence per fact, with mixed states" and "unverified listing shows recorded values as not verified" (`/Recorded as no/`, `header [data-fact="freeStatus"]`) pass unchanged. On `/resources/supabase/`, the confirmed cells show values and the unresolved card requirement shows "Unknown" with "Not confirmed".

- [ ] 08. Provenance rails from real data (D §3.2; S §14.4).
      Depends on 07.
      - Create the server component `src/features/resources/components/provenance-rail.tsx` with its five stations:
        1. Source: `officialUrl`, `sourceUrl` or "No public source recorded", `pricingUrl` and `licenseUrl` through `displayHost`.
        2. Evidence: the pages-read count and latest date, or "No official pages read yet"; "{requiredConfirmed} of {requiredTotal} required checks recorded as confirmed" from `requiredVerificationChecks` and `missingRequiredChecks` only when checks exist, otherwise "No checks recorded yet"; and the stale suffix with `EvidenceMark reason="stale"` when `isVerificationStale`.
        3. Status: label, `EvidenceTag` and summary.
        4. Licence: `license` or "Not recorded", plus `EvidenceTag` and `licenseNotes`.
        5. Verification: word-only `VerificationBadge`, stage label, "Last checked"/"Never checked", "Checked by", and the link to `#verification`.
      - The markup is `<section aria-labelledby="provenance-heading">` > `h2` > `ol`, with `<p>` kickers, neutral identical 7px ring markers (one `rounded-full`), and no `data-fact`.
      - Place it first in the record-page aside, sticky from `lg` inside a `lg:flex-1` wrapper (D §3.9 item 5a). Below `lg` it sits after the snapshot.
      - Add smoke check 10.
      Files: `src/features/resources/components/provenance-rail.tsx`, `src/app/resources/[slug]/page.tsx`, `scripts/browser-smoke.mjs`.
      Commit: `feat(ui): provenance rail from source to verification`.
      Verify: V+S. Check 10 passes for both branches (with and without check records). The existing "verification evidence is summarised", "unchecked listing claims no verification" and `#facts-heading ~ div [data-evidence="confirmed"]` count checks pass unchanged. The text contains no "of 12".

- [ ] 09. Filters: two evidence regions, subject narrow, Legend popover, mobile filter sheet (D §3.5 Filter panel and sheet, §5 M1; S §14.5).
      Depends on 08 (and uses the 04 Dialog and the 05 `onNavigate`).
      - `filter-panel.tsx`:
        - two labelled regions, "Confirmed by an official source" (flags, `unconfirmedHint`, the `EvidenceMark` "Confirmed only" note, and the Legend popover trigger `legend-filters` as `type="button"`) and "As recorded (not necessarily checked)" (free status, subject, platform, type, verification status);
        - groups as `<details open class="motion-details">` with `fieldset`/`legend`;
        - zero-count options disabled and still visible;
        - `useId` replaces `id="filter-panel"`;
        - the in-panel `lg:hidden` toggle and count pill are removed;
        - the sr-only `role="status"` reads `isPending`;
        - the subject type-to-narrow input (rendered after hydration, `maxLength` 60, `normalizeText` and `containsTerm`, "No subject matches “{x}”", Escape clears, never touches the URL).
      - `legend.tsx` gains `variant="popover"` (the `popover="auto"` attribute, `popoverTarget`, an anchor name through inline style, `position-area`, and a fixed fallback under `@supports not`).
      - Create `src/features/search/components/filter-sheet.tsx` (`Dialog sheet-bottom`, 92dvh, Close `aria-label="Close filters"`, a sticky footer with ghost "Clear all" and primary "Show {total} results", safe-area padding).
      - `resource-explorer.tsx` owns `sheetOpen`. The sidebar form mounts only when `!sheetOpen`, and the sheet's only while open. A `matchMedia("(min-width: 64rem)")` listener closes the sheet. The toolbar gains "Filters · N" below `lg`.
      - The sidebar is sticky from `lg` with its own scroll.
      - Add the `rounded-full` map rule (the final map from D §5 M6). Add smoke checks 6 and 12.
      Files: `src/features/search/components/{filter-panel,filter-sheet,resource-explorer,results-toolbar}.tsx`, `src/features/resources/components/legend.tsx`, `src/styles/materials.css`, `tests/design-guardrails.test.mts`, `scripts/browser-smoke.mjs`.
      Commits:
      - `feat(ui): confirmed and recorded filter regions with subject narrowing`;
      - `feat(ui): mobile filter sheet with one mounted filter form`.
      Verify: V+S. Checks 6 and 12 pass. "filters update the URL and the results" (desktop `input[name="openSource"]`) passes unchanged. A manual check without JS shows that the filter form still submits by GET and the Legend popover opens.

- [ ] 10. Command palette, ⌘K/Ctrl+K and `/` (D §3.4; S §14.5; Decision 5).
      Depends on 09 (and uses the Dialog, `Kbd`, `FactMeter` and `fact-meter-counts`).
      - Create `src/features/palette/build-palette-index.ts` (pure; resources, subjects with first-group `g`, collections, tools, audiences, alternatives and pages, plus `o` per resource for Decision 5), `palette-index-schema.ts` (zod, `v: z.literal(1)`, `k + u ≤ t` refine, `o` as `z.string().url()`), `palette-search.ts` (the D §3.4 scoring, group caps, the 100-char cap, the handoff row last, and the "Filter the library" rows from Decision 5 with hrefs from `buildResourcesHref`), `palette-trigger.tsx` and `command-palette.tsx` (loaded with `next/dynamic` on first open).
      - Create `src/app/palette-index.json/route.ts` (`force-static`, repository reads only).
      - The trigger is a `next/link` to `/resources/` with `aria-keyshortcuts`. It handles ⌘K/Ctrl+K (works in inputs) and `/` (not while typing). The `dialog[open]:not([data-palette])` guard applies. The index prefetches on hover or focus. The `Kbd` platform hint comes from `useSyncExternalStore` with a `null` server snapshot.
      - Combobox/listbox ARIA: `aria-activedescendant`, wrap-around arrows, Escape on a non-empty query cancels the `keydown` and clears, and Escape on an empty query closes.
      - Enter: `router.push` with `returnFocus={false}`, then focus `#main`.
      - Shift+Enter on a listing copies its official URL, with live-region feedback and the failure text.
      - The polite "{n} results" announcement waits 300ms. Three static skeleton rows appear after a 150ms show-delay. The error row "The jump list could not load." gets "Try again" and clears the cached promise. "No direct match for “{q}”" shows when nothing matches.
      - Footer key hints are words in `Kbd`, including "Shift+Enter copies the official link".
      - `<mark>` highlights in `--fg` with an underline.
      - `site-header.tsx` uses `PaletteTrigger`. The hero gets the "or press ⌘K to jump to any listing" hint after hydration.
      - Add `tests/palette-search.test.mts` (every D §14 case, plus the `o` field and filter rows), and smoke checks 2, 2a and 3 (the palette half).
      - Record the raw and gzip index size in `perf.md`. Above 30 KB gzip, apply D §17 assumption 4 (`c` becomes a subject index).
      Files: `src/features/palette/*` (new), `src/app/palette-index.json/route.ts` (new), `src/components/layout/site-header.tsx`, `src/features/home/components/hero.tsx`, `tests/palette-search.test.mts`, `scripts/browser-smoke.mjs`.
      Commits:
      - `feat(ui): build-time palette index and search`;
      - `feat(ui): keyboard-first command palette`.
      Verify: V+S. The palette tests and smoke checks 2, 2a and 3 pass, along with `__noReload` navigation. `perf.md` shows `/` JS ≤ 622,409 B, with the palette chunk absent from `/`'s initial scripts. A manual keyboard pass covers open, type, arrows, Enter, Shift+Enter (copy), and Escape twice.

- [ ] 11. Detail pages: the record page and every other page (D §3.9, §4.3; S §14.4).
      Depends on 10. Two commits.
      **11a. Record page.**
      - Reorganise `app/resources/[slug]/page.tsx` per D §3.9, using one `sections` array:
        - breadcrumbs;
        - the `<header>` on `--bg-subtle`: the "Record · {slug}" kicker, serif `h1`, standfirst, coordinates line, actions ("Open {host}", "Source code", the note), the full snapshot and `headerEvidenceSentence`;
        - the "On this page" nav, plus the client island `on-this-page.tsx` (one `IntersectionObserver`, `aria-current="location"`, gold underline);
        - the main column: the status Callout (tone and icon rule); About; Why it is listed (no gold border); "The catch" with the sub-label "Limitations of the free offering" (capital L) and the two empty states verbatim; What it does; "Facts" ledger with `#facts-heading`, unchanged `dl > div > dt/dd`, the dotted leader inside `dt`, `link-inline`, and a Legend popover `legend-facts`; "Connected in the library" (alternatives `h3` with the caveat verbatim and text links, Similar listings as a `RecordList grid`, In collections); and Verification as a CONTENT `<section id="verification" aria-labelledby="verification-heading">` with the `h2` a direct child (`verification-panel.tsx`);
        - the aside: the rail; "Where this information comes from" (no icons, the non-affiliation sentence verbatim); "Something wrong here?"; and Tags as " · " text links with unchanged `?tag=` hrefs.
      - `resource-facts.tsx`: ledger styling.
      - `alternative-comparison.tsx`: styling only.
      - Add smoke check 14.
      Commit: `feat(ui): record page as a catalogue record`.
      **11b. Other pages.**
      - Chapter openings for `categories/[slug]` (group kicker, serif `h1`, standfirst, count, and a "Nearby subjects" line with counts) and `collections/[slug]`.
      - `for/[audience]` and `alternatives/**` restyled (CONTENT, ruled rows, `tnum`).
      - Colour and icon discipline only on `/about`, `/free-status`, `/privacy`, `/terms`, `/submit`, `/report`, `/tools` and `/tools/[slug]`, plus `tool-card.tsx`, `tool-privacy.tsx`, `submit-form.tsx` and `report-form.tsx` (`<noscript>` and info notes become neutral CONTENT; primary anchors use `buttonClasses`). Copy is unchanged.
      - `/verification` becomes an editorial page with a static stage diagram. The full Legend and the coverage table land in 13.
      Commit: `feat(ui): editorial chapter openings and calm secondary pages`.
      Files: `src/app/resources/[slug]/page.tsx`, `src/features/resources/components/{on-this-page,resource-facts,verification-panel,alternative-comparison}.tsx`, `src/app/{categories,collections,for,alternatives,tools,verification,free-status,about,privacy,terms,submit,report}/**/page.tsx`, `src/features/tools/components/{tool-card,tool-privacy}.tsx`, `src/features/community/components/{submit-form,report-form}.tsx`, `scripts/browser-smoke.mjs`.
      Verify: V+S. Every existing detail-page check passes unchanged: the Verification `h2` parent text, the closed `details`, `!includes("Last checked")`, "Limitations" without JS, the collection note, the comparison table cells and the 404 copy. Check 14 passes.

- [ ] 12. Quick Compare with evidence parity (D §3.6, §8 C3; S §14.6; Decision 6).
      Depends on 11. Every commit is compare-only, so the set can be reverted.
      - Create `src/features/compare/compare-params.ts` (pure: `r` and `diff` parse and serialise, `diffRows`, `compareSelection`), `compare-index-schema.ts` (zod; `state` and `reason` `z.enum`s pinned with `satisfies` to `EvidenceState`/`EvidenceReason`, type-only import), `compare-view.tsx`, `compare-tray.tsx`, `compare-toggle.tsx` and `compare-link.tsx`.
      - Create `src/app/compare-index.json/route.ts` (`force-static`; evidence from `factEvidence` and `hasRecordedValue` at build) and `src/app/compare/page.tsx` (`noIndex`, canonical `/compare/`, a `Suspense` fallback with a `<noscript>` "Comparison needs JavaScript" Callout; not added to `sitemap.ts`).
      - Create `src/components/ui/segmented-control.tsx` (a radio group with the gold indicator).
      - Table:
        - a real `<table>` with caption, `scope` and fixed row order;
        - the 8 fact rows as `td[data-fact]` with `EvidenceTag`;
        - "Last checked" and "Facts confirmed" as plain `td`;
        - unknown values read "Unknown" and unchecked values "Recorded as …", never upgraded;
        - the parity sentence uses the index's `t`;
        - the "Differs" ink kicker with a 2px `--border-strong` leading rule;
        - "All rows / Only differences" (`diff=1`), disabled with a note when nothing differs;
        - a focusable scroll region;
        - a Legend popover `legend-compare`.
      - The `r` validation and notices and the load-failure copy follow D §12.1 and §12.2. The "Add a listing" combobox reuses `palette-search.ts`.
      - On `/resources`, `ResourceExplorer` gets `useReducer(compareSelection, [])` and `RecordList renderCompare`: an `aria-pressed` toggle in the record foot and `aria-disabled` when full.
      - The tray is ELEVATED and fixed (`<nav aria-label="Comparison" data-compare-tray>`, "Pick at least 2", Clear moves focus as D §3.6 says). The `html:has([data-compare-tray])` padding goes in `materials.css`.
      - `compare-link.tsx` on the record page renders only after hydration.
      - Add `tests/compare-params.test.mts`, and smoke checks 3 (compare half), 4, 5, 11 and 8 (the `/compare/?r=…` overflow).
      Files: `src/features/compare/*` (new), `src/app/compare-index.json/route.ts`, `src/app/compare/page.tsx`, `src/components/ui/segmented-control.tsx` (new), `src/features/search/components/resource-explorer.tsx`, `src/features/resources/components/resource-record.tsx` (slot only), `src/app/resources/[slug]/page.tsx` (link island only), `src/styles/materials.css`, `tests/compare-params.test.mts`, `scripts/browser-smoke.mjs`.
      Commits:
      - `compare: build-time compare index and params`;
      - `compare: quick compare view with evidence parity and difference lens`;
      - `compare: selection toggles and tray on the library`.
      Verify: V+S. The compare tests and checks 3, 4, 5, 8 and 11 pass. `/compare/` is absent from `out/sitemap.xml`. The compare index gzip size is in `perf.md`, fetched only on `/compare/`.

- [ ] 13. Global coverage, only as far as the data supports it (D §0.1, §3.7, §8 C4).
      Depends on 11 (12 is not required).
      - Create `src/features/categories/components/atlas-index.tsx` (server: 8 group sections, serif `h3`, rows with leader and `tnum` count from `computeFacets(resources, {})`, zero-count rows as muted text "0", accessible name "{subject}, {n} listings") and `atlas-index-filter.tsx` (client, `/categories` only: "Find a subject", `maxLength` 60, a polite "{n} subjects", collapsing empty groups).
      - The homepage's "Browse by category" section becomes the Atlas Index, keeping that `h2` text with the kicker "Index".
      - `/categories` gets the full-size index plus the filter.
      - Delete `src/features/categories/components/category-cards.tsx`, after a search confirms no importer remains.
      - Add `surveyByGroup` to `census.ts` and its cases to `tests/census.test.mts`.
      - On `/verification`, add the full Legend, the `lg` Survey bar and the "Survey by subject group" table with the D §3.7 caption.
      - Write `docs/design/global-coverage-002.md` (Decision 7). It states:
        - what is built (subject coverage with live counts, platform coverage on records and filters, survey by subject group);
        - what is not built and why: no region, country or availability field exists in `src/types/resource.ts`; `languages[]` is empty on every listing (re-count with a Node one-liner over `seedResources` at implementation time and quote the result); tags such as `india` are topics, not availability claims;
        - that no map, globe, flag or country count exists, by decision;
        - what a future data project would need (a schema field, a verification check, and validation).
      - Add smoke check 8's `/categories/` overflow cases.
      Files: `src/features/categories/components/{atlas-index,atlas-index-filter}.tsx` (new), `src/app/page.tsx`, `src/app/categories/page.tsx`, `src/app/verification/page.tsx`, `src/features/home/census.ts`, `tests/census.test.mts`, `docs/design/global-coverage-002.md` (new), `scripts/browser-smoke.mjs`; delete `src/features/categories/components/category-cards.tsx`.
      Commits:
      - `feat(ui): atlas subject index with live counts`;
      - `feat(ui): survey by subject group and coverage record`.
      Verify: V+S. The `surveyByGroup` tests pass. The existing "Browse by category" homepage check passes. The atlas counts on `/categories/` equal `computeFacets` (each category page's listing count). A search of the built HTML finds no map, flag or country-count markup.

- [ ] 14. Motion system (D §6; S §9, §15).
      Depends on 13.
      - Create `src/styles/motion.css`:
        - the duration, distance and easing tokens with the below-`sm` overrides, and `--default-transition-duration`/`-timing-function` in `@theme`;
        - the utilities `motion-enter-palette`, `motion-enter-sheet`, `motion-enter-panel`, `motion-popover`, `motion-chevron`, `motion-segment`, `motion-pending` and `motion-scroll-hairline` (inside `@supports (animation-timeline: scroll())`);
        - the `details.motion-details` rules inside `@supports (interpolate-size: allow-keywords)`;
        - `@keyframes ef-flash` with `:target:not(#main)` and its reduced-motion static tint;
        - the reduced-motion kill switch, moved verbatim from `globals.css` (still `@layer base`), plus `--dist-*: 0px` under reduced motion.
      - Import it from `globals.css`.
      - Apply ENTER and EXIT through `@starting-style` and `allow-discrete` to the three Dialog variants and the Legend popover. The exit wait now reads real durations.
      - Apply `motion-scroll-hairline` to `site-header.tsx` only, `motion-chevron` to the disclosure chevrons (replacing their inline `transition-transform` classes) and `motion-pending` to the results dim.
      - Add the motion guardrail rules (§0.4, with comments stripped) and smoke checks 7 and 15.
      - Compare tray ENTER and the segmented indicator slide go in a separate commit, `compare: motion for tray and segmented control`.
      Files: `src/styles/motion.css` (new), `src/app/globals.css`, `src/components/ui/dialog.tsx`, `src/features/resources/components/{legend,evidence}.tsx`, `src/features/search/components/{filter-panel,resource-explorer}.tsx`, `src/components/layout/site-header.tsx`, `tests/design-guardrails.test.mts`, `scripts/browser-smoke.mjs`; compare commit: `src/features/compare/compare-tray.tsx`, `src/components/ui/segmented-control.tsx`.
      Commits:
      - `feat(ui): centralised motion tokens, overlays and target flash`;
      - `compare: motion for tray and segmented control`.
      Verify: V+S. Checks 7 and 15 pass under both motion settings. The existing mobile-menu Escape check passes with the animated EXIT (within the existing `waitFor`). A manual reduced-motion pass shows that nothing moves.

- [ ] 15. Advanced interactions, Effect Lab ADOPT rows only (D §7).
      Depends on 14.
      - Create `src/features/resources/components/mobile-action-bar.tsx` (client, below `lg`, FUNCTIONAL; one `IntersectionObserver` on the header action group; `data-visible`; `env(safe-area-inset-bottom)`; the `html:has(.action-bar[data-visible])` `scroll-padding-bottom` and `main` padding rules in `materials.css`; `motion-action-bar` ENTER and EXIT). It becomes the third and last `material-functional` file.
      - Mount it on the record page.
      - Audit every D §7 row against the code and record the result in the commit body. Each ADOPT row (1–11, 13, 36, 38, 42) is present and limited as stated. Each REJECT and DEFER row is absent: no view transitions, no scroll reveals, no parallax, no cursor effects, no shimmer, no rotating placeholder, no progressive blur, no WebGL or canvas.
      - Implement nothing beyond the ADOPT list.
      Files: `src/features/resources/components/mobile-action-bar.tsx` (new), `src/app/resources/[slug]/page.tsx`, `src/styles/materials.css`, `src/styles/motion.css`.
      Commit: `feat(ui): mobile record action bar`.
      Verify: V+S. The functional-count rule passes at 3 files. Manual check at 390px on `/resources/supabase/`: the bar appears after the header actions scroll away, never covers the focused element or the footer, and leaves no empty band when hidden.

- [ ] 16. Responsive pass (S §11, §16).
      Depends on 15.
      - Walk `/`, `/resources/`, a record page, `/categories/`, a category page, `/verification/`, `/compare/?r=…`, `/submit/` and `/tools/image-converter/` at 360, 390, 768, 1024, 1366 and 1920px, and at 200% zoom and 320 CSS px. Fix overflow, wrapping and density as S §16 states:
        - snapshot 3→6 columns at `md`; atlas 1→2→4; margin column from `lg`; On-this-page column from `xl`; ledger leaders from `sm`;
        - toolbar wrap with `data-wrapped`; sheet and sidebar heights in `dvh`;
        - hit targets per S §11.4 (`pointer-coarse` raises).
      - Compare-only fixes go in a `compare:` commit.
      - Add any missing route to smoke check 8's overflow loop, additively.
      Files: whichever component files the walk shows need a fix (only CSS class or token changes, no new components), `scripts/browser-smoke.mjs`.
      Commit: `fix(ui): responsive density and reflow across breakpoints` (plus `compare: …` if needed).
      Verify: V+S. Every overflow check passes at tablet and mobile. The breakpoint walk and its outcome are recorded in `.agents/ui-review/perf.md`.

- [ ] 17. Accessibility polish (S §17; D §14 Manual).
      Depends on 16.
      - Every component file created in this work starts with the when / when-not / keyboard / evidence header comment (D §15 criterion 15).
      - Confirm the `forced-colors: active` rules (`Canvas`/`CanvasText`, focus `Highlight`, meter and survey bar `forced-color-adjust: none` with borders) and `prefers-reduced-transparency`.
      - Check that `translate="no"` sits on product names, licence IDs and hosts.
      - Confirm one `h1` per page and the heading outline. Kickers and station labels are `<p>`.
      - Confirm one announcement per change (the Evidence Gate text sits outside the live count).
      - Add `aria-describedby` on form errors and focus the first invalid field (existing forms: verify, and fix only if broken).
      - Do a keyboard-only walkthrough of the palette, sheet, compare and record page. Do VoiceOver and NVDA passes where available, and forced colours on Windows. Record the results, and anything not testable here, in the commit body. Full WCAG conformance is not claimed: it needs assistive-technology testing and expert review.
      Files: the component files that lack headers or fail a check, `src/styles/{materials,tokens}.css`.
      Commit: `fix(ui): accessibility polish for headers, forced colours and announcements`.
      Verify: V+S. Smoke checks 13 and 15 still pass. A Windows forced-colours check of `/resources/` and a record page shows every boundary, the fact meter extent and the focus ring.

- [ ] 18. Performance polish and final verification (D §15 criteria 7–8; S §18).
      Depends on 17.
      - Run `measure.mjs` on a fresh `build:static` and record the results. Budgets:
        - `/resources` HTML ≤ 8,632,437 B (if over, apply D §15 criterion 7's cut order only);
        - `/` HTML ≤ 303,700 B;
        - `/` JS ≤ 622,409 B, with the palette and compare chunks not referenced by `/`;
        - CSS ≤ 51,200 B;
        - exactly two font families;
        - the three fixtures' record element counts ≤ their 00 values;
        - the palette index gzip size ≤ 30 KB, or assumption 4 applied.
      - Confirm one observer per concern per page, no per-record JS, and `content-visibility` on list records.
      - Run the final criteria checklist D §15 1–23. In particular, `git diff --stat af01c3f` shows nothing under `src/lib`, `src/data`, `src/types`, `.github`, `src/config` or CODEOWNERS, and `package.json` and `package-lock.json` are unchanged.
      - Report any budget overage as a blocker rather than cutting evidence.
      Files: only files a budget fix needs; `.agents/ui-review/perf.md` (not committed).
      Commit: `perf(ui): meet page, script and style budgets` (only if a code change was needed).
      Verify: V+F. The unit-test count is 47 plus every new test, all passing. `test:browser` reports 61 plus all additive checks, all passing. `backlog:check` and `check:verification` exit 0. The budget table in `perf.md` is all within limits.

---

## Known gaps carried forward (not built, by decision)

- **Licence facet:** needs `ResourceQuery` and `lib/search` changes (Decision 4).
- **Verification-status filter group:** needs verification counts in `ResourceFacets` and a predicate on `effectiveVerification` in `lib/search/filters` (Decision 4, increment 09 note).
- **Region, country, availability and interface-language coverage:** there is no data (increment 13, D §16).
- **Route view transitions, shared-element transitions, search-to-palette morph, swipe-to-dismiss, directional pagination, inspector or split view, density toggle:** DEFER or REJECT per D §7 and §16.
- **Recent searches and saved comparisons:** would need client storage, which `/privacy` rules out.
- **Unverified browser behaviour, checked by smoke rather than assumed:** `:focus-visible` on scripted `.focus()` (check 13), and `@starting-style` on a freshly opened `<dialog>`, which falls back to an instant appearance.
