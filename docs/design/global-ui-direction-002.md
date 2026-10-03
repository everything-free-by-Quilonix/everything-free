# Global UI direction 002: Everything.Free

Design direction for the `ui/global-premium-redesign-002` redesign. It is built on the audit and research in `docs/design/global-ui-research-002.md` (cited as "research §x") and on the code at base SHA `af01c3f`.

**Revision 5.** This pass answers the fourth design review in `.agents/ui-review/design-review.md` (verdict CHANGES_REQUESTED: 0 HIGH, 4 MEDIUM, 7 NIT). Every finding is addressed in place. §18.1 lists each finding, the decision taken and the section that changed. §18.2, §18.3 and §18.4 keep the responses to the third (revision 4), second (revision 3) and first (revision 2) reviews for traceability.

Everything in this document is a decision. Where options existed, one was chosen and the reason is stated. Where something depends on a prototype, the prototype, its pass condition and its fallback are stated as well.

---

## 0. Inputs, constraints and locked stack

### 0.1 What the data really supports (research §1.4–§1.6, re-checked for this document)

| Dimension | Real and usable | Notes |
| --- | --- | --- |
| Library size | Yes: `getResourceCount()` (726 today) | Always computed at build. Never written into copy |
| Subjects | Yes: 72 categories in 8 groups (`config/categories.ts`). Per-category counts come from `computeFacets` | "Subjects with at least one listing" is computed, not assumed to be 72 |
| Free status | Yes: 4 of 8 values in use (431 / 213 / 73 / 9 today) | Classification. Its evidence state is separate |
| Platforms | Yes: 7 values | Classification, evidence via `PLATFORM_AVAILABILITY` |
| Resource type | Yes: 27 values | |
| Licence | Partly: `license` present on roughly 400 entries, `licenseUrl` on roughly 350 (line counts from a text search of `src/data/resources`, so approximate) | Missing means "Not recorded", never inferred |
| Source / pricing links | Partly: `sourceUrl` on roughly 465, `pricingUrl` on roughly 73 | Same rule |
| Evidence | Yes, per fact: 11 facts (`FACTS`), 5 reasons (`EvidenceReason`), 12 checks | 0 `VERIFIED`, 6 `PARTIALLY_VERIFIED`, 720 `UNVERIFIED`. 10 listings have any confirmed check |
| Connections | Yes: `alternativeTo[]`, `relatedResources[]`, collections, audiences | |
| Region / country / availability | **No** | No field exists. Tags such as `india` are topics, not availability claims |
| Interface languages | **No** | `languages[]` is empty on every entry |
| Popularity, ratings, usage | **No, and by design never** | The type's header comment forbids it |
| Screenshots / imagery | **No** | Generated monograms only. No hotlinked logos |

Two consequences shape the whole direction:

1. **The atlas is a map of subjects and evidence, not of geography.** "Global coverage" is expressed only through dimensions that exist. No map, no region filter, no "available in N countries" (research §1.6, §8).
2. **"Not verified yet" is the normal state, at 99% of the library.** It must look calm, legible and ordinary. It must not look alarming, and it must not be hidden.

### 0.2 Hard constraints

- **Out of bounds:** verification logic (`src/lib/resources/evidence.ts`, `src/config/verification.ts` rules), the verification data model (`src/types/resource.ts` evidence fields), resource data (`src/data/**`), CI (`.github/**`) and CODEOWNERS. These are read and imported, never edited.
- **`src/lib/**` stays untouched.** All 47 unit tests stay green without edits. New pure helpers go in `src/features/**`, next to the components that use them.
- **CSP** (research §1.2):
  - no runtime `<style>` injection;
  - no inline event handlers;
  - inline scripts must be static text;
  - `connect-src 'self'`, `font-src 'self'`, `img-src 'self' data: blob:`;
  - inline `style=""` attributes are allowed.
- **Static export.** No server runtime. Anything dynamic runs in the browser, against data emitted at build.
- **Smoke-test contracts** (research §1.9) are preserved. §11 lists each one and how it survives.
- **Evidence rule.** Unknown stays Unknown. No value is shown more confidently than `factEvidence` allows. Nothing appears that is not in the data.

### 0.3 Locked technology stack

| Layer | Decision | Change from today |
| --- | --- | --- |
| Framework | Next.js 16.3.6, React 19.2.8, App Router, static export | None |
| Styling | Tailwind CSS v4, with semantic tokens as CSS custom properties. Tokens are split into `src/styles/*.css` files imported by `globals.css` (Tailwind v4 inlines local `@import`s) | Files reorganised, no new tooling |
| Validation | `zod` 4.1.13 (already a dependency), used to parse the two new build-time JSON indexes in the browser | Existing dependency, new use |
| Fonts | `next/font/google`, self-hosted at build, latin subset, `display: swap`. **Inter** (UI and body, variable, `opsz` axis if exposed) and **Source Serif 4** (display and editorial, variable, `opsz` axis). **Manrope is removed** | One family swapped. Still two families |
| Icons | The existing hand-authored set in `src/components/icons/index.tsx` (24px grid, 1.75 stroke). New glyphs only if a functional need appears, drawn on the same grid | None |
| Motion | CSS transitions and animations, `@starting-style`, `transition-behavior: allow-discrete`, `linear()` easing, `::details-content`. No animation library. No view transitions in this pass (§16) | None |
| Overlays | Native `<dialog>` (`showModal()`), the HTML `popover` attribute, native `<details>` | Replaces the hand-rolled mobile-nav focus trap |
| New runtime dependencies | **None** | None |
| New dev dependencies | **None** | None |

Two decisions were considered and rejected:

- **Route view transitions in this pass**, either React `<ViewTransition>` with `experimental.viewTransition` or a hand-written `document.startViewTransition` wrapper around `router.push`.
  - The first is unverified under `output: export` with this CSP (research §3), and public React docs still call it experimental.
  - The second would only cover navigations the wrapper sees, not ordinary `next/link` clicks, so it would be inconsistent.

  Both are deferred to prototype P1 (§16). The experience is complete without them.
- **A monospace family for catalogue data.** Inter's `tnum` and `case` features cover counts, dates and identifiers at no download cost (research §7). A third family would breach the two-family budget.

---

## 1. Brand idea: the Global Utility Atlas

### 1.1 The idea in one line

**Everything.Free is a surveyed atlas of free resources. Every listing is a record. Every record shows where its facts came from and how much of it has been surveyed.**

An atlas is not a landing page. It has front matter (what this is, how to read it), a **legend** (one key of symbols used everywhere), an **index** (subjects you can jump to), **plates** (the records themselves), and a **survey statement** (what has been measured, and what has not). Each of these maps onto something Everything.Free already has, so the concept is a way of presenting real structure, not a costume.

| Atlas element | Everything.Free equivalent | Real data |
| --- | --- | --- |
| Front matter | Library introduction (the hero) | Build-time census: listings, subjects, tools |
| Legend | The five evidence states, with mark and word | `EvidenceReason`, `evidenceLabels` |
| Index | Subject index: 8 groups, 72 categories, live counts | `categoryGroups`, `computeFacets` |
| Plates / records | Resource Record and the record page | `Resource` |
| Grid reference | The coordinates line: subject · type · platforms · licence | `category`, `resourceType`, `platforms`, `license` |
| Survey statement | Survey bar: listings with a confirmed fact, partially verified, verified | `factEvidence`, `verificationStatus` |
| Marginal notes | Provenance: sources, read dates, who checked | `verificationSources`, `verificationChecks`, `verifiedBy` |

The concept blends four registers. The **digital atlas** supplies the legend, index, coordinates and survey. The **technical archive** supplies the record key, ledger, provenance and dates. The **modern editorial system** supplies the serif titles, standfirsts, running heads and measure. The **premium software product** supplies the command palette, sheets, keyboard paths and complete states. It is explicitly **not** a startup landing page: there is no pitch, no feature grid, no social proof, no call-to-action band, and no "Get started".

### 1.2 How each value is communicated

| Value | Expressed through | Never through |
| --- | --- | --- |
| Discovery | Subject index with counts, command palette, "Connected in the library", real search examples | "Explore the future" copy, random-scroll feeds |
| Trust | One legend used identically everywhere; evidence words beside every claim; the most reserved styling sits on trust UI (GOV.UK principle, research §2.6) | Trust badges, shields as decoration, "Trusted by" |
| Provenance | Provenance Rail on every record page; "How we know" disclosures; read dates as `<time>` | Unsourced ticks |
| Utility | Catch line on every record; primary "Open {host}" action; tools that run here | Feature marketing |
| Global coverage | Breadth of subjects and platforms, shown as counts | Maps, flags, country counts, globe graphics |
| Open access | Free-status classification with its definition; licence on the coordinates line; no accounts or tracking stated on `/privacy` | "Free forever!" claims |
| Technical precision | Tabular figures, fixed field order, exact dates, record keys, a strict type scale | Fake dashboards, fake metrics |

### 1.3 Voice

Plain, specific, sentence case. Copy states what is known and how. Counts are always computed. The library describes itself as "listings", "subjects" and "records", never as "thousands of tools". Banned phrases include "Discover thousands of free tools", "unlock", "supercharge", "seamless", "cutting-edge", "AI-powered", "best", and any superlative about a listing (the existing product rule).

---

## 2. Visual language

### 2.1 Colour: "paper and ink", defined in OKLCH

The palette moves from cool blue-black to a warm, low-chroma neutral, so gold reads as ink on paper rather than as gold on gunmetal (research §6.2, Linear L1). Both themes keep the existing semantic token names (`--bg`, `--surface`, `--fg`, `--border`, `--primary`, status tokens), so components keep compiling. Values change, and a few tokens are added.

Dark stays the default on `:root`, because no-JS must render correctly. Light opts in through `.light`, as today.

**Dark ("night chart")**

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `oklch(0.165 0.006 75)` | BASE |
| `--bg-subtle` | `oklch(0.185 0.006 75)` | BASE, alternate band |
| `--surface` | `oklch(0.205 0.007 75)` | CONTENT |
| `--surface-raised` | `oklch(0.235 0.008 75)` | ELEVATED |
| `--surface-hover` | `oklch(0.255 0.008 75)` | hover fill |
| `--rule` (new) | `oklch(0.27 0.008 75)` | hairline rules between records |
| `--border` | `oklch(0.30 0.008 75)` | component edges |
| `--border-strong` | `oklch(0.54 0.010 75)` | interactive edges only (≥ 3:1 on `--bg`, `--surface`, `--surface-raised` and `--surface-hover`: 3.80, 3.54, 3.29, 3.11) |
| `--fg` | `oklch(0.95 0.006 85)` | primary text |
| `--fg-muted` | `oklch(0.77 0.010 80)` | secondary text |
| `--fg-subtle` | `oklch(0.64 0.010 80)` | tertiary text (must still pass AA, see below) |
| `--primary` | `oklch(0.79 0.125 85)` | gold ink |
| `--primary-hover` | `oklch(0.84 0.120 87)` | |
| `--primary-fg` | `oklch(0.18 0.010 75)` | text on gold |
| `--focus` (new) | `= --primary` | focus ring |
| `--success-fg` | `oklch(0.80 0.130 160)` | Confirmed only |
| `--warning-fg` | `oklch(0.82 0.120 80)` | Not confirmed, Needs re-checking |
| `--danger-fg` | `oklch(0.72 0.150 28)` | errors only |

**Light ("paper")**

| Token | Value |
| --- | --- |
| `--bg` | `oklch(0.985 0.004 85)` |
| `--bg-subtle` | `oklch(0.965 0.005 85)` |
| `--surface` | `oklch(1 0 0)` |
| `--surface-raised` | `oklch(0.975 0.004 85)` |
| `--surface-hover` | `oklch(0.955 0.005 85)` (revision 2 left it undefined in light; defined now so the border test has a value to check) |
| `--rule` | `oklch(0.91 0.006 85)` |
| `--border` | `oklch(0.88 0.006 85)` |
| `--border-strong` | `oklch(0.62 0.008 80)` (3.49, 3.64, 3.39, 3.20 on `--bg`, `--surface`, `--surface-raised`, `--surface-hover`) |
| `--fg` | `oklch(0.22 0.010 75)` |
| `--fg-muted` | `oklch(0.42 0.010 75)` |
| `--fg-subtle` | `oklch(0.50 0.010 75)` |
| `--primary` | `oklch(0.50 0.100 80)` |
| `--primary-fg` | `oklch(0.99 0.004 85)` |
| `--success-fg` | `oklch(0.45 0.110 160)` |
| `--warning-fg` | `oklch(0.47 0.100 70)` |
| `--danger-fg` | `oklch(0.47 0.160 28)` |

The `-soft` and base status tokens are derived with `oklch(from var(--x) l c h / 0.12)`. Relative-colour syntax is unsupported in some engines, and a plain "declare twice, static first" fallback does **not** work here: a custom property accepts any token sequence, and any declaration containing `var()` is only checked at computed-value time, so in an old engine the second declaration still wins and then resolves to an invalid colour (transparent). Revision 2 specified that pattern; it is corrected here. Every relative-colour value is therefore declared **inside a feature query**, with the static value outside it:

```css
:root { --success-soft: oklch(0.80 0.130 160 / 0.12); }               /* static, same numbers as --success-fg */
@supports (color: oklch(from red l c h)) {
  :root { --success-soft: oklch(from var(--success-fg) l c h / 0.12); } /* only where it can resolve */
}
```

The `.light` block repeats the pair with the light theme's numbers. The same rule applies to every `oklch(from …)` value anywhere, including `materials.css` (§2.4: FUNCTIONAL background; §2.7: pressed fill), the fact meter (§8 C1) and the Survey bar fills (§5 M2). `design-guardrails.test.mts` gains one rule: any line containing `oklch(from` must sit inside an `@supports (color: oklch(from` block, checked by tracking the enclosing at-rule while walking each `.css` file. `theme-color` in `layout.tsx` is updated to the sRGB equivalents of the two `--bg` values.

`--border-strong` marks interactive edges only (inputs, select, secondary buttons). Non-interactive structure, including the homepage section rules (§4.2), uses `--border` or `--rule`, so the corrected, higher-contrast `--border-strong` does not make editorial rules heavy.

**Contrast is a tested invariant, not a hope.** These values are starting points. A new unit test, `tests/tokens.test.mts`, parses the token blocks in `src/styles/tokens.css`, converts OKLCH to sRGB (about 30 lines of standard maths in the test file), and asserts WCAG 2.x ratios for both themes:

- `--fg`, `--fg-muted`, `--fg-subtle`, `--success-fg`, `--warning-fg` and `--danger-fg` on **all five surfaces**: `--bg`, `--bg-subtle`, `--surface`, `--surface-raised` and `--surface-hover`: ≥ 4.5:1, in both themes. Each pair occurs: `--fg-subtle` carries real text such as "Never checked" and sits on hovered records (`--surface-hover`); `EvidenceTag` colours sit on the record header band (`--bg-subtle`); palette rows and the filter sheet sit on `--surface-raised`. All 30 pairs per theme pass (third design review's calculation) with the values above; the lowest is dark `--fg-subtle` on `--surface-hover` at 4.69, so the test exists to stop regressions, not to fix today's values.
- `--primary` against `--bg`, and `--primary-fg` on `--primary`: ≥ 4.5:1.
- `--focus` against `--bg` and `--surface`: ≥ 3:1 (WCAG 1.4.11).
- `--border-strong` against `--bg`, `--surface`, `--surface-raised` **and** `--surface-hover`: ≥ 3:1, in both themes. It marks interactive edges, and controls actually sit on all four: the palette input and filter-sheet controls on `--surface-raised` (ELEVATED), the secondary button filled with `--surface-raised`, the sort select on `--surface`, and hovered rows on `--surface-hover`.

If a value fails, the implementer adjusts its L (lightness) only, keeping hue and chroma, until it passes. The test is the owner of this invariant. The ratios quoted in the tables were recalculated for this revision with the same OKLCH → sRGB maths the test uses. Revision 2's dark `--border-strong` (`oklch(0.49 0.010 75)`) failed on `--surface` (2.86), `--surface-raised` (2.66) and `--surface-hover` (2.52), and the light `oklch(0.65 0.008 80)` failed on the new light `--surface-hover` (2.84). Both values above are the corrected ones.

**Gold discipline: a closed list.** `--primary` (and its `-hover`/`-soft` derivatives) appears in exactly these five roles and nowhere else:

1. **Brand dot:** the gold "." in the wordmark. The "EF" gold tile in `brand.tsx` is removed; the wordmark alone is the brand in the header. `favicon.ico` and `src/app/og/**` are not touched.
2. **Primary action:** `Button variant="primary"` and anything styled through `buttonClasses({ variant: "primary" })`, one per view at most. The skip link uses the same style, because it is the page's first action.
3. **Focus:** the focus ring (`--focus`) and the `:target:not(#main)` flash (§2.4 FOCUS).
4. **Selected / current indicators:** the segmented-control indicator, the active palette row's leading rule, the current header-nav underline, the current pagination page, and checkbox/radio `accent-color` (set once in `globals.css`, not per component).
5. **Text selection:** `::selection` on `--primary-soft`.

Removed as part of this work, so the list is true on day one:

- the "Results for “q”" query text in `resource-explorer.tsx` becomes `--fg`;
- the inferred-filter `bolt` icon in `active-filters.tsx` (chip and hint) is removed. The chip gains a visible text prefix "Inferred ·", and the hint reads "Filters marked “Inferred” were taken from the wording of your search. Remove any that are wrong.";
- `OpenSourceBadge` and every `tone="primary"` Badge or Callout render the neutral style. `badge.tsx` and `callout.tsx` map `primary` to the same classes as `neutral`. `config/free-status.ts` is not edited;
- the `hover:text-primary` on inline text links across pages is replaced by one `@utility link-inline` in `globals.css`: `--fg` text, a 1px underline in `--border-strong`, and on hover the underline colour moves to `--fg`;
- decorative gold icons (about, free-status and verification eyebrows, the verification "required" shield, the record page "library" icon, both hero icons) are deleted under the icon rule (§2.6). On `/verification` the required checks are marked by the existing words, with "Required for Verified" added as an `xs` kicker;
- `focus:border-primary` / `focus-within:border-primary` / `focus-within:border-primary/50` in `field.tsx`, `search-box.tsx`, `sort-select.tsx` and `card.tsx` are removed, **together with the outline suppression beside them**, because today the gold border is the only focus indicator on those controls and Tailwind's `focus:outline-none` (utilities layer) beats the base-layer `:focus-visible` outline:
  - `field.tsx` (line 20, every `Field` input and textarea, including the submit and report forms) and `sort-select.tsx` (line 51): `focus:outline-none` is deleted with `focus:border-primary`. The global `:focus-visible` outline (`--focus`, 2px, offset 2px) then applies unchanged;
  - `search-box.tsx`: the inner `<input>` keeps `outline-none` (line 100), because the visible field is the wrapper. The wrapper's `focus-within:border-primary` (line 81) is replaced by a keyboard-only outline on the wrapper: `has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-(--focus)`. A pointer click into the field therefore shows the caret only, and Tab shows the ring, which matches every other control;
  - `card.tsx`: `focus-within:border-primary/50` is deleted. Interactive cards contain a link, and that link draws the global outline;
  - the guardrail rule that keeps this true is in §14 (`outline-none` allow-list), and smoke check 13 asserts the computed outline;
- the gold count pill on the mobile "Filters" button is replaced by the text "Filters · 3" (§3.5);
- the `whyListed` gold border and the gold search highlight.

**Guardrail.** `tests/design-guardrails.test.mts` fails on `/\b(?:text|bg|border(?:-[trblxyse])?|ring|outline|accent|decoration|fill|stroke|from|via|to|shadow|caret|divide)-primary(?!-fg)\b/` (which also catches directional borders such as today's `border-l-primary` on the record page's "Why it is listed" card, banned gradient stops, and shadow, caret and divide colours), and on `/var\(--primary/` in `.tsx` inline styles, in any `.tsx` file outside this owner list: `components/ui/button.tsx`, `components/layout/brand.tsx`, `components/layout/site-header.tsx` (skip link), `components/layout/nav-links.tsx` (current underline), `components/ui/segmented-control.tsx`, `features/palette/command-palette.tsx`, `features/search/components/pagination.tsx`, `features/resources/components/on-this-page.tsx` (current section), and `features/tools/implementations/**` (tool UIs keep their own primary actions). In CSS, `--primary` may be referenced only in `styles/tokens.css`, `styles/materials.css`, `styles/motion.css` and `app/globals.css`. `text-primary-fg` (text on gold) is excluded by the negative look-ahead, because it only ever sits on a gold owner.

**Evidence colour rule (unchanged, now centralised).** Success colour means confirmed evidence: a Confirmed fact, or a listing whose effective verification is Verified. Not confirmed and Needs re-checking use `--warning-fg`. Not verified and Unknown share `--fg-subtle`. The `STYLE` map in `features/resources/components/evidence.tsx` remains the single owner of fact marks. Every surface that shows a fact's evidence (record, snapshot, rail, compare, palette, verification-panel rows, the filter panel's "Confirmed only" note) renders the mark through `EvidenceMark` from that file and never restyles it. Non-evidence uses of green are removed (§12.3 lists each file).

**Info blue is retired from the UI** to keep the palette to neutrals, gold and three semantic hues. `badge.tsx` and `callout.tsx` map `tone="info"` to the neutral style. Hand-written info styles move to the neutral CONTENT style (a 1px `--rule` border, no fill): the `verification-panel.tsx` "Evidence complete, awaiting sign-off" note and the `<noscript>` notes in `submit-form.tsx` and `report-form.tsx`. The `--info*` tokens stay defined so nothing breaks at compile time.

### 2.2 Typography

**Families**

- **Source Serif 4** (OFL, variable, `opsz` 8–60) is the editorial voice: the homepage library introduction, page titles (`h1`), section titles on editorial pages (`h2` on home, categories, collections, about, verification), record names on the record page, and standfirsts at `lg` size. It is never used for controls, labels, evidence, tables, form fields or record names inside lists.
- **Inter** (OFL, variable) is everything else. Features: `cv11`, `ss01` (already set), `tnum` wherever numbers are compared (counts, dates, table cells), and `case` on uppercase kickers.
- Loaded in `layout.tsx` as `Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter", axes: ["opsz"] })` and `Source_Serif_4({ subsets: ["latin"], display: "swap", variable: "--font-source-serif", axes: ["opsz"], style: ["normal"] })`. The next/font variable is deliberately **not** named `--font-serif`, so the theme token below never refers to itself; this mirrors the existing `--font-inter` → `--font-sans` pattern. If `next/font/google`'s typings reject `axes: ["opsz"]` for either family (the research flagged this as unconfirmed), drop the `axes` option for that family only. Display headings then rely on the static weight, and nothing else changes.
- Tokens, in the `@theme inline` block (§13, moved to `tokens.css`):
  - `--font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif` (unchanged);
  - `--font-serif: var(--font-source-serif), ui-serif, Georgia, serif` (new; Tailwind generates the `font-serif` utility from it);
  - `--font-display: var(--font-inter), ui-sans-serif, system-ui, sans-serif`, the same stack as `--font-sans`. `--font-display` stops being a separate face. About 70 existing `font-display` usages (labels, footer kickers, the "Menu" span, list `h3`s, aside `h2`s, the wordmark, the monogram, `dd` values, and the inline `var(--font-display)` in `contrast-checker.tsx`) therefore stay Inter with no visual change, and the tool UIs keep their own styling. Manrope is removed, so nothing else could be meant by it.
- **The serif is opt-in, never inherited through `font-display`.** It is applied only through the `font-serif` utility, at exactly these sites:
  - every page `h1`: the files that render an `h1` today replace `font-display` with `font-serif` on it (`app/**/page.tsx`, `app/not-found.tsx`, `app/error.tsx`, `features/search/components/{resource-explorer,static-library}.tsx`), and `PageHeader` in `components/ui/layout.tsx` adds `font-serif`;
  - the homepage introduction `h1` (`features/home/components/hero.tsx`);
  - editorial `h2`s: `Section variant="editorial"` (in `components/ui/layout.tsx`) puts `font-serif` on its `h2`, and the hand-written section `h2`s on `/about` and `/verification` (the editorial pages listed above that do not use `Section`) replace `font-display` with `font-serif`;
  - the record-page name (`h1`) and `lg` standfirsts on the pages above;
  - Atlas Index group titles (`features/categories/components/atlas-index.tsx`, §8 C4) and the editorial collection row's name (`features/collections/components/collection-card.tsx`, §4.2).
- The base-layer heading rule becomes `h1, .editorial h2 { font-family: var(--font-serif) }`, which covers any `h1` with no font class (same `var()` mechanism as today's base rule on `var(--font-display)`). Other headings inherit Inter from `body`, at weight 600. A heading that keeps an explicit `font-display` class stays Inter, which is the intended result.
- The guardrail test (§14) fails on `font-serif` outside the files named in the list above, so the serif cannot drift into labels, tables or list record names.

**Scale.** `rem`-based and fluid with `clamp()`, defined as Tailwind v4 `--text-*` theme tokens so the existing utilities pick them up.

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `--text-2xs` (new) | 0.6875rem (11px) | 1rem | kickers and record keys only, always uppercase or tabular, never body text |
| `--text-xs` | 0.75rem | 1.125rem | meta lines, evidence lines |
| `--text-sm` | 0.875rem | 1.375rem | record descriptions, UI |
| `--text-base` | 1rem | 1.625rem | body, inputs (≥16px, which also avoids iOS zoom) |
| `--text-lg` | 1.125rem | 1.75rem | standfirsts |
| `--text-xl` | clamp(1.25rem, 1.16rem + 0.4vw, 1.375rem) | 1.3 | record name on cards, `h3` |
| `--text-2xl` | clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem) | 1.2 | `h2` |
| `--text-3xl` | clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem) | 1.12 | page `h1` |
| `--text-display` | clamp(2.25rem, 1.6rem + 2.8vw, 3.75rem) | 1.05 | homepage introduction only |

- **Tracking:** serif display at `-0.01em`; Inter headings at `-0.011em`; kickers at `+0.08em`, uppercase. There is no aggressive negative tracking.
- **Weights:** serif display 500 at `display` and 600 at `3xl`. Inter body 400, labels 500, headings 600. Nothing below 400, and no light weights at small sizes (research A6).
- **Measure:** prose is capped at `--container-prose` (46rem, about 70ch). Standfirsts are capped at 38rem.
- **Kept:** `text-wrap: balance` on headings and `pretty` on paragraphs. Copy uses curly quotes and the real ellipsis character.
- **Kinetic type:** none. There is no reveal, no split text and no animated variable axes (research Part 4). The expression is static scale contrast.

### 2.3 Grid and spacing

- **Container:** `--container-content: 80rem` stays. Gutters are 16px, 24px from `sm`, and 32px from `lg`.
- **Editorial grid:** from `lg`, editorial pages use a 12-column grid with a **margin column** of 3 columns (the marginalia, §5 M5) and a content field of 9. Below `lg` the margin column collapses into an inline kicker above the content. Product pages (`/resources`, record pages) use their own two-pane grids, described in §3.
- **Spacing scale:** a 4px base, restricted to the steps 1, 2, 3, 4, 6, 8, 12, 16 and 24 (in Tailwind units). Other steps are a review finding. Section rhythm is `py-16` on mobile and `py-24` from `lg`. Inside a record, the rhythm is 4/8/12px.
- **Alignment:** everything sits on the left edge of the content field. Centred stacks are used only for empty states and the 404.
- `html { scroll-padding-top: calc(var(--header-h) + var(--toolbar-h, 0px) + 16px) }`, so anchors and focused elements are never hidden by sticky chrome. `--header-h` is 56px on mobile and 64px from `lg`. Both are declared on `html` in `tokens.css`. A custom property set on a descendant cannot reach `html`, so the toolbar height is declared from the root: `html:has([data-results-toolbar]) { --toolbar-h: 48px }`. The results toolbar (§3.5) carries `data-results-toolbar`; on every other page `--toolbar-h` falls back to `0px`.

### 2.4 Surfaces: the semantic material system

Five materials. Each has a role, a fixed implementation, and a list of places it is forbidden. The materials live in `src/styles/materials.css` as utilities (`@utility material-base` and so on). Components use those utilities and never hand-assemble backgrounds, borders, blur and shadow.

| Material | Role | Implementation | Used for | Never used for |
| --- | --- | --- | --- | --- |
| **BASE** | The matte page | `background: var(--bg)`, no border, no shadow, no texture | Page background, alternate bands (`--bg-subtle`) | Anything interactive |
| **CONTENT** | Solid reading surfaces | Opaque `--surface` or plain `--bg`, structured by `--rule` hairlines and space. Borders only where a grouped object needs an edge (tables, form fields) | Records, ledgers, tables, prose, filter panel | Translucency, blur, glow, gradient fills |
| **ELEVATED** | Subtly raised, temporary or grouped above content | Opaque `--surface-raised`, `1px var(--border)`, shadow `--shadow-raised` (`0 1px 0 oklch(0 0 0 / .25), 0 8px 24px -12px oklch(0 0 0 / .5)` in dark; lighter in light) | Popovers (legend), the command palette, the filter sheet, the compare tray (§3.6), dialogs (with `--shadow-overlay` and a scrim of `oklch(0 0 0 / .6)`) | Inline content cards, records, section containers |
| **FUNCTIONAL** | Chrome that content scrolls under. Translucent so the layering is legible | `background: var(--bg)` as the static value, then, inside `@supports (color: oklch(from red l c h))` (§2.1), `background: oklch(from var(--bg) l c h / 0.94)`, `backdrop-filter: blur(8px) saturate(1.1)`, bottom hairline `--rule`. **Fully opaque** under `@media (prefers-reduced-transparency: reduce)` and under `@supports not (backdrop-filter: blur(1px))`. Text contrast is computed against the opaque colour, so the blur is never what makes text readable | Site header; sticky results toolbar on `/resources`; mobile sticky "Open {host}" bar on record pages | Records, cards, overlays, the hero, any surface that is not sticky or fixed |
| **FOCUS** | A temporary highlight of where the user's attention just went | `--focus` outline (2px, offset 2px); `:target:not(#main)` flash (one global rule in `motion.css`, §6.5: a from-only keyframe starting at `var(--primary-soft)`, which already carries the §2.1 fallback, and ending at the element's own background over `--dur-flash`; `#main`, the skip link's target, is excluded so the page landmark never tints); the active palette row (`--surface-hover` plus a 2px gold leading rule) | Focus-visible, anchor targets other than `#main`, active listbox option, the just-added compare item | Persistent decoration (including the compare "Differs" marker, which is ink, §8 C3), hover states, the `<main>` landmark |

Rules that follow from the table:

- Exactly **one** translucent recipe exists (FUNCTIONAL), and it is used by exactly three sticky or fixed surfaces: the site header, the `/resources` results toolbar, and the record page's mobile action bar. The compare tray is ELEVATED, not FUNCTIONAL: it is a temporary grouped object above content, not chrome that content scrolls under, so it needs no blur. The current translucent hero card and the `bg-bg/85 backdrop-blur-md` header class are deleted. The guardrail test counts files that apply `material-functional` and fails above 3 (`site-header.tsx`, `results-toolbar.tsx`, `mobile-action-bar.tsx`).
- Blur is never used for decoration and never stacked. Progressive blur is rejected (§7).
- **Elevation and z-index tokens:** `--z-content: 0`, `--z-sticky: 30` (toolbar, mobile action bar, compare tray), `--z-header: 40`, `--z-overlay: 50` (non-dialog overlays such as the legend popover fallback; `<dialog>` uses the top layer). These replace literal `z-40` and `z-50` classes. There is **no toast system in this pass** and no toast token: nothing in the product needs a transient notification, and every outcome is shown in place.
- Shadows exist only on ELEVATED. `--shadow-card` is redefined as `none`, so records and cards stop carrying shadows.

### 2.5 Geometry

- **Radii:** `--radius-xs: 3px` (tags, keyboard hints, tick meter cells); `--radius-sm: 6px` (buttons, inputs, select, segmented control); `--radius-md: 10px` (popovers, palette, sheet top corners, dialogs, tables, Card). There is no radius above 10px.
  - **These names are Tailwind v4's own radius keys** (defaults 2px, 4px, 6px), so they are set in the `@theme inline` block of `tokens.css` as `--radius-xs: 3px; --radius-sm: 6px; --radius-md: 10px;`, deliberately overriding the defaults. `rounded-xs`, `rounded-sm` and `rounded-md` are then the only radius-scale utilities in use. Bare `rounded` (a 4px literal in v4, used today only on inline links and summaries so their focus outline is rounded) is left as is.
  - **Existing classes are converted** in `src/**/*.tsx` outside `features/tools/implementations/**`: `rounded-md` (badges, tag chips, `Chip`) → `rounded-xs`; `rounded-lg` (controls, Callout, buttons, inputs, sort select) → `rounded-sm`; `rounded-xl` (Card, skeleton, search field, filter panel, comparison tables, page icon tiles) → `rounded-md`. Where §2.6 deletes an icon tile, its radius goes with it. The one `rounded-2xl` (`app/page.tsx`, Contribute) goes with the rewritten section. Convert `rounded-md` first, then `rounded-lg` and `rounded-xl`, so no class is converted twice.
  - **Enforced** by the guardrail (§5 M6, §14): `/\brounded(?:-[trblse]{1,2})?-(?:lg|xl|2xl|3xl|4xl)\b/` and `/\brounded(?:-[trblse]{1,2})?-\[/` fail in `src/**/*.tsx` outside `features/tools/implementations/**`. The directional prefix extends the review's regex so `rounded-t-xl` cannot slip past.
  - `rounded-full` is reserved for true circles, and the complete list after this work is a file-to-count map in the guardrail test (§5 M6). **No pill buttons and no pill chips.** Active-filter chips become `--radius-xs` tokens; the `SearchSuggestions` pills in `search-box.tsx` become text links separated by " · ".
- **Concentric nesting:** an inner radius equals the outer radius minus the padding, with a minimum of 2px.
- **Lines:** hairlines are 1px `--rule`. The section rule above a running head is 1px `--border` (non-interactive, so not `--border-strong`). Ledger leaders are a 1px dotted `--rule` (§5 M4). Focus is 2px.
- **Monograms** (`ResourceLogo`): square with `--radius-sm`, set in Inter 600 with `tnum` (no longer the display font), on `--surface-raised` with a `--border` edge. Sizes: 32px in records, 48px on the record page.
- **Hit targets:** at least 44×44px on touch for every control, and at least 32px on pointer-fine for dense controls such as compare toggles, with padding extending the target.

### 2.6 Iconography

There is **one** system: the existing hand-drawn set (24px grid, 1.75 stroke, round caps, `currentColor`, `aria-hidden` by default). Icons are **functional only**. They are permitted in exactly these roles:

1. **Evidence marks:** check-circle, help-circle, clock, minus-circle, always paired with the word.
2. **Unlabelled controls:** search, menu, close, theme toggle. Each has an `aria-label`.
3. **Direction and affordance:** external-link after outbound links; chevron-down on disclosures; arrow-right on "see all" links only.
4. **Warnings and errors:** alert-triangle in form errors, in error states, and on the record page's status Callout when it carries a caution (below).

**The four evidence glyphs are reserved.** check-circle, help-circle, clock and minus-circle are rendered **only** through `EvidenceMark` (and therefore through `EvidenceTag` and `CardEvidence`, which use it), and only to mean the evidence reasons printed in the Legend (M1). This is what makes the Legend the single key for every evidence symbol on a page. Today the same glyphs also carry other meanings (`config/free-status.ts`: `FREE` check-circle, `FREE_TIER` minus-circle, `TRIAL` clock, `UNKNOWN` help-circle; `config/verification.ts`: `UNVERIFIED` help-circle, `OUTDATED` clock). The configs are **not edited**; their `icon` values are simply no longer rendered on any surface. The conversions:

- `FreeStatusBadge` and `VerificationBadge` (`status-badges.tsx`) render **word-only**: no `icon` prop is passed to `Badge`. That covers records, the snapshot, Provenance Rail station 5 and the definition Badges on `/free-status` and `/verification`, which also stop passing `icon={status.icon}`. Nothing about their tone gating changes.
- The record page's status Callout passes `icon={status.caveat && (status.tone === "warning" || status.tone === "danger") ? "alert-triangle" : null}`: a caution (`PERSONAL_FREE`, `LIMITED_FREE`, `TRIAL`) gets role 4's warning icon, and every other status gets no icon. This replaces revision 3's `muted`/`status.icon` logic (§12.3).
- The `VerificationPanel` summary icon (`verification.icon`, line 107) is removed; the label carries the meaning. Its row icons render through `EvidenceMark` (§12.3).
- The evidence-filter Callout in `resource-explorer.tsx` (today `icon="check-circle"` on a neutral notice) and the inferred-filter Callout (today `icon="bolt"`) pass `icon={null}`.
- The remaining literal uses found by a search of `src/**/*.tsx` at base SHA are converted too, so the guardrail passes on day one: the "Ready to file" Callouts in `submit-form.tsx` and `report-form.tsx` (`icon="check-circle"`, already moving to `tone="neutral"`, §12.3) pass `icon={null}`; the "Planned" Badges in `tool-card.tsx` and `app/tools/[slug]/page.tsx` (`icon="clock"`) drop the icon, because the word "Planned" carries the meaning; the "Confirmed only" note in `filter-panel.tsx` (`name="check-circle"`) becomes `EvidenceMark` (§12.3), which is a correct evidence use.
- `Callout` gains `icon?: IconName | null`: `undefined` keeps today's tone default, `null` renders no icon. This sits beside the new `id` prop (§13).
- The guardrail test (§14) fails on `name="(check-circle|help-circle|clock|minus-circle)"`, `icon="(check-circle|help-circle|clock|minus-circle)"` or the object-literal `icon: "(check-circle|help-circle|clock|minus-circle)"` (the `/about` list items' form, removed by this work) in `.tsx` outside `evidence.tsx` and `features/tools/implementations/**`; config `.ts` files are exempt because they are not rendered; and on `(icon|name)={status.icon}`, `{definition.icon}` or `{verification.icon}` outside `resource-facts.tsx` (where `definition.icon` is a platform glyph: `globe`, `monitor`, `terminal`, `smartphone`, `server`, none of them reserved).

Icons are **removed from**:

- the hero eyebrow and the "Describe what you need" card (both deleted);
- primary-nav items in the mobile menu;
- audience tiles and category-group cards (the `icon` fields stay in config and are simply not rendered);
- alternative chips (`refresh-cw`);
- the per-limitation alert-triangle on records and the record page, which becomes the word-led **Catch** line (§3.1);
- empty states, which lead with text (`EmptyState icon` becomes optional and is not passed). The round icon discs in `components/ui/empty-state.tsx`, `app/error.tsx` (alert-triangle) and `app/not-found.tsx` (compass) are deleted with them;
- decorative eyebrow and list icons on `/about`, `/free-status`, `/verification` and the record page's "Where this information comes from" list. The `/free-status` principle list's green `check` icons are removed: the list is principles, not confirmed facts, so it becomes a plain ruled list in `--fg-muted`.

The free status is a word everywhere, on records and in the record-page snapshot alike (§3.3). No surface shows a free-status icon.

**Zero emoji.** No emoji in UI strings, config copy, component comments or CSS. The emoji check in `tests/design-guardrails.test.mts` (§14) scans `src/**/*.{ts,tsx,css}` for `\p{Extended_Pictographic}`. Docs are not scanned: research notes legitimately quote arrows such as `↔`. It allows only `©`, `®` and `™`, which are legal marks, not emoji. One existing violation is fixed as part of this work: `⏱` in a comment in `features/resources/components/evidence.tsx`, which becomes the word "clock". A scan of `src/` at base SHA found no emoji in `src/data`, so no resource data changes.

### 2.7 Component language

Every interactive component defines all of these states. A missing state is a review blocker.

| State | Treatment |
| --- | --- |
| Rest | As specified per component |
| Hover (pointer-fine only, `@media (hover: hover)`) | **Raises contrast.** Text moves from `--fg-muted` to `--fg`; fill moves to `--surface-hover`; border moves to `--border-strong`. Hover never reveals information that is otherwise hidden |
| Pressed (`:active`) | Fill one step darker: `--surface-hover` as the static value, then `oklch(from var(--surface-hover) calc(l - 0.02) c h)` inside the §2.1 feature query. No scale or bounce |
| Focus-visible | The global FOCUS outline. It is never removed, and it is never obscured thanks to `scroll-padding-top` |
| Selected / current | Gold indicator (segmented control, `aria-current` nav underline). State is also expressed in ARIA (`aria-pressed`, `aria-selected`, `aria-current`) |
| Disabled | `opacity: 0.5`, `cursor: not-allowed`, native `disabled` or `aria-disabled="true"` with a reason in text where useful (for example, zero-count filters) |
| Loading | Only where a real wait exists. Uses `aria-busy="true"` and a skeleton that mirrors the final layout, after a 150ms show-delay and with a 300ms minimum visible time |
| Error | Inline, in text, with `--danger-fg` and alert-triangle, and with a recovery action |
| Empty | Says what would fill it and offers the next step (existing rule) |

Copy rules: sentence case; actions are verb-first ("Open supabase.com", "Compare 2 listings", "Show 38 results"); no exclamation marks; counts use `formatCount` and `Intl.PluralRules("en")`.

Each new component file starts with a header comment covering **when to use**, **when not to use**, **keyboard model**, and **evidence obligations**, matching the codebase's existing comment style (research §2.5).

### 2.8 Motion language (summary)

Motion only explains a state change: something opened, closed, moved, was selected, navigated, or updated. It never decorates, never delays content, and never repeats on scroll. The full system is in §6.

---

## 3. Signature components

### 3.1 Resource Record (replaces `ResourceCard`)

**Role.** A listing in a list is a catalogue record, not a marketing card. It is ruled, not boxed. It reads top to bottom in decision order:

1. what it is;
2. what free means for it;
3. what has been checked;
4. what the catch is;
5. where the record stands.

**Files.**
- New: `src/features/resources/components/resource-record.tsx` exports `ResourceRecord` and `RecordList`.
- Deleted: `resource-card.tsx`.
- Updated to import `RecordList` in place of `ResourceGrid`: `src/app/page.tsx`, `static-library.tsx`, `resource-explorer.tsx`, and the category, collection, audience and alternatives pages.

**Anatomy.** DOM order is reading order, and every smoke-test hook is preserved. The record has exactly two wrapper zones, always in this DOM order:

```
<article class="record" data-record>                      ← `main article` contract
  <div data-zone="main">                                   ← no element in this zone carries data-fact
    head: [monogram 32]  <h3><a stretched href>Name</a></h3>          ← `h3 a[href*="/resources/"]`
          coordinates: Video · Desktop app · Win macOS Linux · GPL-3.0
    <p> shortDescription (≤130 chars, enforced by validation)
    Catch    First limitation text                         (omitted when none)
    Matched  Name matches “blender” · Listed as a free alternative to Photoshop   (search results only, one text line)
  </div>
  <div data-zone="facts">
    snapshot (compact): Free tier [data-fact="freeStatus" data-evidence]           ← FIRST [data-fact] in the article
                        Open source [data-fact="openSource" data-evidence]   (only when openSource && freeStatus !== OPEN_SOURCE)
    <ul aria-label="What has been checked">  CardEvidence, unchanged logic, restyled
    foot: Record · blender · Never checked · Unverified · [fact meter] · [compareSlot]
  </div>
</article>
```

**Smoke contract, stated explicitly.** `cardAudit` in `scripts/browser-smoke.mjs` reads `card.querySelector('[data-fact="freeStatus"]')`, the first match in the article, and requires its `data-evidence`. `CardEvidence` also emits `data-fact="freeStatus"` spans without `data-evidence` when the free status is unconfirmed. So: **in every `ResourceRecord`, the compact snapshot's free-status token is the first `[data-fact]` element in DOM order.** This holds because nothing in `data-zone="main"` carries `data-fact`, and the snapshot is the first child of `data-zone="facts"`. An additive smoke check (§14, browser item 9) asserts it, so a future reorder fails loudly.

**Layout.** It uses a container query (`@container record (min-width: 44rem)`), so the same component works in one-column lists and two-column grids:

- **Narrow (stacked):** the two zones stack, `main` first. This is what homepage two-up grids and mobile get.
- **Wide (two-zone):** `grid-template-columns: minmax(0,1fr) 17rem`; `main` is the left column and `facts` the right. Visual order equals DOM order, so no `order` or `grid-area` reordering is used. `/resources` uses a single-column `RecordList layout="list"` at every width, so the library reads as an index.

**Material.** CONTENT. There is no background box, border or shadow. Records are separated by a 1px `--rule` top hairline, and the first record in a list has none.

**Interaction.** Hover (pointer-fine) fills `--surface-hover` and underlines the name. The whole row is one target through the existing `stretchedLink` pattern, so there is one tab stop with the name as its accessible name. Focus-visible draws the FOCUS outline on the link, and the row receives `:focus-within` styling equal to hover. The compare toggle (§3.6) arrives through the `compareSlot` prop (§3.11), rendered in the foot, and sits above the stretched link with `position: relative; z-index: 1`. `ResourceRecord` has no `"use client"` directive and no hooks, so it can be imported by the client `ResourceExplorer` and by server pages alike; only `ResourceExplorer` passes `renderCompare` to `RecordList`.

**The Catch line.** This replaces the alert-triangle limitation line with a word-led line: a kicker reading "Catch", then `headlineLimitation(resource)`. If there is no limitation, the line is omitted. The record does not claim "no catch", because an empty list is a reassurance only when checked. The record page explains this (§3.9).

**Coordinates line** (motif M3) shows `categoryName(category)` · resource-type label · `platformLabels()` · `license`. Absent parts are omitted, never shown as "None". Product names and licence IDs get `translate="no"`. The platforms keep their `sr-only` prefix "Available on:".

**Performance.** These are binding acceptance criteria (§15):
- Per-record element count must not exceed the current card's element count for the same resource. The removed badge chrome, icons and nested flex wrappers pay for the fact meter, which is one element.
- `/resources` HTML must be ≤ the baseline of 8,632,437 bytes.
- In `layout="list"`, records get `content-visibility: auto; contain-intrinsic-size: auto 168px`. Content stays in the accessibility tree and remains find-in-page searchable.

**When not to use.** Inside tables (use Quick Compare cells) or for tools and collections, which use their own index rows (§4.2).

### 3.2 Provenance Rail

**Role.** It answers "where does this record come from, and how far has it been checked?" in one vertical read, in the order evidence actually flows: **source → evidence → status → licence → verification**.

**File.** `src/features/resources/components/provenance-rail.tsx`. It is a server component with the signature `ProvenanceRail({ resource })`.

**Placement.**
- **Desktop (`lg`+):** the first block in the record-page aside, `position: sticky; top: calc(var(--header-h) + 1rem)`. Only the rail is sticky, not the whole aside. It is compact (5 stations, about 360px), so it never exceeds the viewport.
- **Below `lg`:** rendered after the snapshot and before "About", not sticky.

**Stations.** All come from real fields. No station invents a value.

| # | Station | Shows | Data | Mark |
| --- | --- | --- | --- | --- |
| 1 | Source | "Official site: {host}" (link). "Source code: {host}" or "No public source recorded". "Pricing page" and "Licence text" links when present | `officialUrl`, `sourceUrl`, `pricingUrl`, `licenseUrl` via `displayHost` | None: these are pointers, not claims |
| 2 | Evidence | "{n} official pages read, latest {date}" or "No official pages read yet". Then, when `resource.verificationChecks` has at least one record, the **same figure the Verification panel shows**: "{requiredConfirmed} of {requiredTotal} required checks recorded as confirmed". When it has none, the line reads "No checks recorded yet", matching the panel, which hides the ratio in that case (`records.length > 0`); 716 listings take this branch. When `isVerificationStale(resource.lastVerifiedAt)` is true, the suffix " · all need re-checking (older than 90 days)" is appended in `--warning-fg` with `EvidenceMark reason="stale"` | `verificationSources`; `requiredTotal = requiredVerificationChecks.length` and `requiredConfirmed = requiredTotal - missingRequiredChecks(resource.verificationChecks).length` (both from `config/verification`, unchanged, and the same computation `verification-panel.tsx` uses); `isVerificationStale` from `@/lib/utils/date` (unchanged) | `EvidenceMark` only when stale |
| 3 | Status | Free-status label + `EvidenceTag` + the status summary sentence | `freeStatus`, `factEvidence(resource, "freeStatus")` | `EvidenceTag` (which renders `EvidenceMark`) |
| 4 | Licence | `license` or "Not recorded" + `EvidenceTag`, plus `licenseNotes` when present | `license`, `licenseNotes`, `factEvidence(resource, "license")` | `EvidenceTag` |
| 5 | Verification | `VerificationBadge` (existing, `effectiveVerification`); stage label (`verificationStageLabels[verificationStage(resource)]`); "Last checked {date}" or "Never checked"; "Checked by {handle}" when present; link "See the verification record" → `#verification` | `verificationStatus`, `verificationChecks`, `lastVerifiedAt`, `verifiedBy` | None: `VerificationBadge` is word-only (§2.6), so `help-circle` never means "Unverified" beside a help-circle that means "Unknown" |

Station 2 deliberately drops the first pass's "{c} of 12 checks confirmed · {u} could not be settled". `confirmedChecks` ignores the 90-day expiry, so it would overstate expired evidence, and "of 12" would be a third denominator beside the snapshot's "of 11 facts" and the panel's "of 10 required". Unsettled rows are already listed in the Verification panel, one link away. The record page therefore shows two ratios with two clearly different nouns: "{c} of {FACTS.length} facts confirmed" (snapshot, from `factEvidence`, staleness-aware; 11 today, never written as a literal) and "{x} of {y} required checks recorded as confirmed" (rail and panel, identical numbers).

**Markup.**

```
<section aria-labelledby="provenance-heading">
  <h2 id="provenance-heading">Provenance</h2>
  <ol>
    <li>…</li>
  </ol>
</section>
```

Each `<li>` has a kicker label (a `<p>`, not a heading, so the outline stays clean), a value, and an `EvidenceTag` (where a fact applies) or the word-only `VerificationBadge` (station 5). A 1px `--rule` vertical line joins the station markers (`ol::before`).

**Station markers are neutral and identical.** Every station, including Source, has the same marker: a 7px ring, 1px `--border-strong`, transparent fill, `rounded-full`, `aria-hidden`. The marker encodes position on the rail and nothing else. Evidence state is carried only by the `EvidenceTag`/`EvidenceMark` printed inside the station, so the Legend (M1) remains the single key for every evidence symbol on the page. There is no filled, dashed or square variant.

The rail uses **no** `data-fact` attributes and sits outside `#facts-heading`'s sibling tree and outside the page `<header>`. Smoke audits that count `[data-evidence]` there are therefore unaffected (§11).

### 3.3 Resource Snapshot

**Role.** A data instrument: a fixed-format readout of the facts most people decide on, with each value's evidence beside it. It is not a row of coloured badges. Every cell has the same anatomy, so the eye learns it once.

**File.** `src/features/resources/components/resource-snapshot.tsx`, exporting `ResourceSnapshot({ resource, size: "full" | "compact" })`.

**Full** (record-page header, inside the page `<header>`). A ruled grid: 3 columns on mobile and 6 from `md`, with cells separated by `--rule` hairlines and no fills.

| Cell | Label (kicker) | Value rule |
| --- | --- | --- |
| 1 | Free status | Label from `getFreeStatus`, as a word with **no icon** (§2.6). Carries `data-fact="freeStatus" data-evidence={state}`, which replaces the separate header badge and keeps the `header [data-fact="freeStatus"]` contract |
| 2 | Account | Stored `requiresAccount` value |
| 3 | Credit card | Stored `requiresCreditCard` value |
| 4 | Commercial use | Stored `commercialUse` value |
| 5 | Platforms | `n = platformLabels().length`, worded through `new Intl.PluralRules("en").select(n)`: "1 platform", "{n} platforms" (the names are on the coordinates line). With `n === 0`: "Not recorded" in `--fg-subtle`, matching the coordinates line, which omits the part |
| 6 | Facts confirmed | Fact meter (§8 C1) with C1's visible sentence: "{c} of {FACTS.length} facts confirmed", plus " · {u} checked, not settled" when `u > 0`. Built from `factMeterCounts`, never from a literal 11 |

For cells 1–4 the value line uses **the Facts ledger's words exactly** (`resource-facts.tsx`), so a reader sees one phrasing per state on the page:

- **confirmed:** the value in `--fg`: the free-status label for cell 1, `availabilityLabel(value)` ("Yes", "No") for cells 2–4;
- **recorded but not confirmed:** in `--fg-muted`. Cell 1 reads "Listed as {label.toLowerCase()}" (the ledger's free-status phrasing, `resource-facts.tsx:53`). Cells 2–4 read "Recorded as {value}" with the **lower-case stored value**, as `TriStateValue` renders it (`resource-facts.tsx:36`), so the smoke assertion `/Recorded as no/` reads the same words in the ledger and the snapshot;
- **no value** (`"unknown"`): "Unknown".

Cell 5 is a count, not a ledger value, so its unconfirmed line is "Recorded as {n} platform(s)", with the same plural rule ("Recorded as 1 platform"); the ledger names the platforms in full.

Under the value sits the `EvidenceTag`. When `resource.openSource && resource.freeStatus !== "OPEN_SOURCE"` (the condition today's record header uses in `app/resources/[slug]/page.tsx`, and the one §3.1 uses), an "Open source" token, rendered by `OpenSourceBadge variant="token"` (below) with `data-fact="openSource"` and `data-evidence={factEvidence(resource, "openSource").state}`, appears in cell 1 after the label, with its visible "· not verified" suffix when unconfirmed.

**Compact** (inside records). Only the free-status token and the optional open-source token, as small word-only ledger tokens (no icon, §2.6). `ResourceSnapshot size="compact"` renders `<FreeStatusBadge resource={resource} variant="token" />` and, under the same condition as above, `<OpenSourceBadge resource={resource} variant="token" />`, both from `status-badges.tsx`. It **never reads `definition.tone`** and computes no tone or evidence state of its own; `resource-snapshot.tsx` is deliberately not a tone owner (§12.3 rule 2). `variant="token"` (default `"badge"`) renders the same `<span data-fact=… data-evidence={state}>` wrapper and sr-only text as the badge variant, with `Badge appearance="ledger"`: Inter `xs` weight 500, `rounded-xs`, 1px `--border`, `bg-transparent` when the gated tone is `neutral`, and the tone map's fill and text otherwise (§13 `badge.tsx`). The gating stays `FreeStatusBadge`'s: neutral unless the free status is confirmed. `OpenSourceBadge`'s props become `{ variant?: "badge"; license?: string } | { variant: "token"; resource: Resource }` (it has no caller at base SHA, so nothing else changes); its token is always `neutral`, because open source is a classification, not a tone. Kept exactly:

- the free-status token keeps `FreeStatusBadge`'s sr-only " (free status not verified)" when unconfirmed, and `data-evidence={factEvidence(resource, "freeStatus").state}`;
- the open-source token (`OpenSourceBadge variant="token"`) renders `<span data-fact="openSource" data-evidence={factEvidence(resource, "openSource").state}>` around the label "Open source", keeps the card's visible "· not verified" suffix in `--fg-subtle` when unconfirmed, and its `data-evidence` is that state, never a boolean, so `unknown` and `unconfirmed` are both represented.

The tri-state facts on records are carried by `CardEvidence`, which keeps the "at most one line per state" contract.

### 3.4 Command Palette (⌘K / Ctrl+K, and `/`)

**Role.** A jump-to surface for a 726-record corpus: listings, subjects, collections, tools, alternatives and key pages, from any page, by keyboard. It is not a replacement for `/resources`. Its last row always hands off to full search.

**Files.**

| File | Kind | Purpose |
| --- | --- | --- |
| `src/app/palette-index.json/route.ts` | `dynamic = "force-static"`, same pattern as `link-manifest.json` | The slim index, emitted at build |
| `src/features/palette/build-palette-index.ts` | Pure `.ts`, no JSX, no repository import | `buildPaletteIndex(input)` builds the index object from data passed in. The route calls it; the unit test calls it with the real seed data |
| `src/features/palette/palette-index-schema.ts` | zod schema + `PaletteIndex` type | Validates the fetched JSON |
| `src/features/palette/palette-search.ts` | Pure functions | Scoring and grouping, unit-tested |
| `src/features/palette/palette-trigger.tsx` | Client, tiny, in every page's header | Shortcut listener, trigger link, `Kbd` hint |
| `src/features/palette/command-palette.tsx` | Client, loaded with `next/dynamic` on first open | Dialog, combobox, results |
| `src/components/ui/dialog.tsx` | Client primitive | Shared `<dialog>` primitive (§3.10) |
| `src/components/ui/kbd.tsx` | Primitive | Keyboard hint |

**Index shape** (version 1). Built from repository functions only:

```json
{
  "v": 1,
  "t": 11,
  "resources":    [{ "s": "blender", "n": "Blender", "c": "3D", "f": "Open source", "k": 0, "u": 0 }],
  "subjects":     [{ "s": "3d", "n": "3D", "g": "Creative", "count": 18 }],
  "collections":  [{ "s": "…", "n": "…" }],
  "tools":        [{ "s": "…", "n": "…", "available": true }],
  "audiences":    [{ "s": "…", "n": "…" }],
  "alternatives": [{ "s": "adobe-photoshop", "n": "Adobe Photoshop", "count": 7 }],
  "pages":        [{ "href": "/verification", "n": "How verification works" }]
}
```

`k` and `u` are `factMeterCounts(resource).confirmed` and `.unsettled` (§3.11): the number of the 11 `FACTS` whose `factEvidence(...)` state is `confirmed`, and the number whose reason is `unresolved` or `stale`. They are computed at build with the same function the record page uses, so a listing's fact meter draws identically in the palette, in compare and on its record. The top-level `t` is `FACTS.length` at build, so the browser never hard-codes 11 and never imports the evidence module. The schema validates `k`, `u` and `t` as `z.number().int().nonnegative()`, and `palette-search.test.mts` asserts `k + u ≤ t` and `t === FACTS.length` for every entry of an index built from the real seed data (below). `count` comes from `computeFacets` and from the alternative targets' `count`. `subjects` has **one entry per subject**, never two: `g` is the name of the first group in `categoryGroups` config order whose `categoryIds` contains the subject. The five subjects that sit in two groups (`books`, `music`, `travel`, `personal-finance`, `communication`) therefore get one palette row each; the Atlas Index (C4) still lists them under both groups, because an index and a jump list have different jobs. `palette-search.test.mts` asserts unique `subjects[].s` and the first-group rule for `books` (§14).

**Builder.** The index is built by one pure function, so the route and the test share it:

```ts
// src/features/palette/build-palette-index.ts  (pure .ts, no JSX; imported by the route and by tests)
export function buildPaletteIndex(input: {
  resources: readonly Resource[];                                            // the listable set
  alternatives: readonly { name: string; slug: string; count: number }[];    // ResourceDataSource.listAlternativeTargets() shape
  collections: readonly Collection[];
}): PaletteIndex;
```

It **derives** with `@/lib/resources/evidence` (`factEvidence`, through `factMeterCounts`), `@/lib/search/filters` (`computeFacets`) and `@/config/*` (`categoryGroups`, `availableTools`, the audiences config, `getFreeStatus`), all of which load under Node's type stripping. It takes its data as arguments and imports nothing from `@/lib/repository` (which wraps reads in React `cache`).

**Imports.** The route handler `src/app/palette-index.json/route.ts` **reads data only through `@/lib/repository`** (`getAllResourcesForClient`, `getAlternativeTargets`, `getCollections`), passes the results to `buildPaletteIndex`, and returns `Response.json(index)`. It never imports the data-source adapter. The test builds the same index from `seedResources.filter((r) => matchesFilters(r, {}))` (the listable set, computed the way `seed-adapter.ts` computes it), `seedDataSource.listAlternativeTargets()` and `collections` from `@/data/collections`, exactly as `library.test.mts` already imports seed data.

**Hrefs.** Every `href` the palette navigates to (index `pages[].href`, and the hrefs the palette builds from slugs, such as `/resources/{s}/`) is stored and built **without** `basePath`, because `router.push` adds it. Only the `fetch` URL for the index uses `withBasePath`. Expected size is about 70 KB raw and about 15 KB gzip; this is measured at implementation and recorded in the PR. The index is not linked from the sitemap.

**Opening.**
- ⌘K on macOS and Ctrl+K elsewhere, from anywhere, including inside inputs. It calls `preventDefault` and toggles the palette.
- `/` opens it only when focus is not in an `input`, `textarea`, `select` or `[contenteditable]`, and no modifier is held.
- Clicking the header trigger opens it too.
- Shortcuts are ignored while a modal dialog **other than the palette** is open: the guard is `document.querySelector('dialog[open]:not([data-palette])')`. The palette's own `<dialog>` carries `data-palette`, so ⌘K/Ctrl+K can still close it (toggle).
- The trigger is `<Link href="/resources/" aria-label="Search resources" aria-keyshortcuts="Meta+K Control+K /" onClick={open}>` from `next/link`, so `basePath` (`/everything-free` in production) is applied automatically. The `open` handler calls `preventDefault()` and opens the palette; it is attached by React, so it only runs after hydration. **Without JS it is a working link to `/resources/`** on GitHub Pages and locally.

**Platform hint.** The `Kbd` shows "⌘K" or "Ctrl K". `navigator.userAgentData` is not in TypeScript's `lib.dom`, so it is read through a narrowed type, with no `any` and no suppression:

```ts
const uaPlatform =
  (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform;
const isMac = /mac|iphone|ipad/i.test(uaPlatform);
```

It is read through `useSyncExternalStore` with a `null` server snapshot (the pattern `ThemeToggle` uses). The hint renders nothing until hydration, so there is no mismatch.

**Accessibility model** (WAI-ARIA combobox with listbox popup):
- `<dialog aria-labelledby="palette-title">` with a visually hidden title, "Jump to a listing or page".
- `<input role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant="{id}" aria-autocomplete="list">`.
- `<div id="palette-list" role="listbox">` holding `role="group"` sections, each `aria-labelledby` its visible group label, with `role="option"` rows and `aria-selected` on the active row.
- A polite live region announces "{n} results" 300 ms after typing stops.

**Keyboard.**
- ↓ and ↑ move through results, wrapping at the ends.
- Enter activates the active row: `router.push(href)`, then close.
- Escape clears a non-empty query; on an empty query it closes. **Query clearing does not go through the dialog's `cancel` event**, because under the HTML close-watcher rules (Chromium 120+) `cancel` is not cancelable without history-action user activation, so a veto there can fail and leave a natively closed `<dialog>` with React still `open`. Instead the combobox input handles `keydown`:

  ```ts
  onKeyDown={(event) => {
    if (event.key === "Escape" && query !== "") {
      event.preventDefault();   // cancelling the keydown stops the close request before any cancel event exists
      setQuery("");
    }
    // …arrow and Enter handling as below
  }}
  ```

  With an empty query the keydown is not prevented, the browser raises a close request, and the Dialog primitive handles it (§3.10).
- Tab stays inside the dialog, which is inert-backed through `showModal()`.
- **Focus after closing** depends on how it closed:
  - **Escape, Close or scrim click:** focus returns to the element focused before opening (stored on open by the Dialog primitive).
  - **Navigation (Enter or click on a result):** the restore is skipped, because the stored element may belong to the page being replaced. After `router.push`, focus moves to `#main` (which already has `tabIndex={-1}`). The palette calls its close path with a `{ restoreFocus: false }` flag, then `requestAnimationFrame(() => document.getElementById("main")?.focus())`.

**Results.**
- **Empty query:** a "Go to" group with Browse all listings, Subjects, Collections, Tools, Alternatives, How verification works, and What "free" means, and nothing else. There is **no recent history** (nothing is stored) and no "Try" suggestions: `searchExamples` is not used by the palette.
- **With a query** (trimmed, at most 100 characters, normalised with `normalizeText` from `lib/search/tokenize`, imported unchanged): up to 6 listings, 4 subjects, 3 collections, 3 tools and 3 alternatives. The last row is always "Search the full library for “{q}”", linking to `/resources?q={encoded}`.
- **Scoring:**
  - exact name: 100;
  - name prefix: 80;
  - word-boundary term in name (`containsTerm`): 60;
  - substring in name: 40;
  - term in subject or category name: 20.
  Every term must match somewhere. Ties sort by name ascending, so ordering is deterministic.
- **Row anatomy:** the name, with the matched span wrapped in `<mark>` styled as `--fg` plus underline (not a gold highlight); then the secondary line "{subject} · {free-status label}"; then a trailing mini fact meter, `<FactMeter confirmed={k} unsettled={u} total={t} />` (`aria-hidden`), with the sr-only text "{k} of {t} facts confirmed". The active row gets the FOCUS treatment.

**Loading.** The index is fetched on the first open, or earlier on `pointerenter` or `focus` of the trigger, through `fetch(withBasePath("/palette-index.json"))` (same-origin, so `connect-src 'self'` allows it). The promise is cached in module scope. The input is usable immediately. Three skeleton rows, mirroring the row layout, appear after a 150 ms show-delay if the index has not arrived. When it arrives, results compute for whatever has been typed.

**Material and motion.** ELEVATED, `--radius-md`, width `min(40rem, 100vw - 2rem)`, top offset 12vh. On mobile it is full-width at the top with a 0.5rem inset. ENTER and EXIT use the palette tokens (§6).

### 3.5 Advanced Search (`/resources`)

**Layout.**
- **`lg`+:** the page head (serif `h1` "Browse free resources", or "Results for “{q}”", with the search field), then two panes: a filter sidebar of `17rem` and the results.
  - The sidebar is `position: sticky; top: calc(var(--header-h) + 16px)`, with `max-height: calc(100dvh - var(--header-h) - 32px)`, `overflow-y: auto` and `overscroll-behavior: contain`. The results toolbar sits in the results column, not above the sidebar, so its height is not added.
- **Below `lg`:** the page head, then the toolbar, then results. Filters move into a sheet.

**Sticky results toolbar.** `results-toolbar.tsx`, a `<div data-results-toolbar>` in FUNCTIONAL material, `--z-sticky`, `top: var(--header-h)`, `min-height: 48px` (`--toolbar-h: 48px`, set from `html:has([data-results-toolbar])`, §2.3). Contents, left to right:

- `<p aria-live="polite">`, whose **first number is the total**: "{total} listings match" (any query or filter active) or "{total} listings" (none). At zero it reads "0 listings match", so the first number is still the total and the smoke regex reads 0. Singular uses `Intl.PluralRules("en")`: "1 listing matches". From `sm`, when `totalPages > 1`, today's suffix " · page {p} of {n}" follows in `--fg-subtle`, inside the same paragraph and after the total; below `sm` the suffix is dropped and the short form "{total} listings" is used. This keeps the smoke regex contract.
- The Evidence Gate (§8 C2), when a confirmed-only filter is active. Its bar appears only when `effectiveQuery.q` is empty; with residual query terms it is text only (C2).
- The sort select, `max-width: 9rem` below `sm` (the option text truncates inside the native select; the full label stays in the `<label>`).
- Below `lg` only, a "Filters" button (`Button variant="secondary"`) with the active count as plain text ("Filters · 3", with no pill and no gold), which opens the sheet. It replaces the existing in-panel `lg:hidden` toggle and its `aria-controls="filter-panel"`.

**Mobile fit at 390px.** The row holds the short count, the 9rem sort select and "Filters · 3" (the Evidence Gate is hidden below `sm`, C2). It is a single-line flex row with `flex-wrap: wrap` and `gap: 8px`. If it still wraps (long totals, large text settings), the toolbar grows: its height is `auto` from `min-height: 48px`, never clipped. Because `--toolbar-h` stays 48px in that case, the toolbar sets `--toolbar-h` from its measured height only through CSS it already owns: `html:has([data-results-toolbar][data-wrapped]) { --toolbar-h: 88px }`, where `data-wrapped` is set by `results-toolbar.tsx` (rendered inside the client `ResourceExplorer`) from one `ResizeObserver` that sets the attribute when its border-box block size exceeds 56px and removes it otherwise. 88px is two 40px rows plus the 8px gap. Without `ResizeObserver` the attribute is never set and `--toolbar-h` stays 48px. Without JS the explorer is not mounted, so the toolbar does not exist. Smoke check 8's "no horizontal overflow at mobile" covers the row.

The active-filter tokens (`[aria-label="Active filters"] a`, labels unchanged, such as "No credit card · confirmed") sit directly under the toolbar and are not sticky.

**Filter panel.** Same component, same `<form method="get">` semantics, same URL serialisation (`lib/search/params`, unchanged). It is restructured into two labelled regions, so classification and confirmation can never be confused:

1. **"Confirmed by an official source"**: the confirmed-only flags (no credit card, no account, commercial use, open source). The region header carries a Legend popover trigger (motif M1). The existing `unconfirmedHint` text stays.
2. **"As recorded (not necessarily checked)"**: free status, subject, platform, type, verification status.

Groups are native `<details open>`, animated with `::details-content` and `interpolate-size: allow-keywords` where supported, and instant elsewhere. Zero-count options stay disabled, not hidden.

**Subject type-to-narrow.** A small text input at the top of the Subject group: "Narrow subjects", `type="search"`, `autocomplete="off"`. It is rendered only after hydration. It hides non-matching checkbox rows using `normalizeText` and `containsTerm`. It never changes the URL or the checked state. If nothing matches, the line reads "No subject matches “{x}”". Escape clears it.

**Mobile filter sheet.** Below `lg`, the "Filters" button opens a `Dialog` (§3.10) presented as a bottom sheet:
- height `92dvh`, `--radius-md` top corners, ELEVATED;
- header: `h2` "Filters" and a Close button (`aria-label="Close filters"`);
- scrollable body containing `FilterPanel`, with `overscroll-behavior: contain`;
- sticky footer: "Clear all" (ghost) and the primary "Show {total} results", which closes the sheet. The total updates live, because each change already updates the URL and the results behind the sheet.

**One filter form at a time, enforced by state, not by CSS.** `display: none` does not unmount, so the first pass's claim was false. The corrected structure, all in `ResourceExplorer`:

```tsx
const [sheetOpen, setSheetOpen] = useState(false);
const [isPending, startTransition] = useTransition();          // lifted out of FilterPanel
const navigate = (href: string) => startTransition(() => router.push(href, { scroll: false }));

useEffect(() => {
  const mq = window.matchMedia("(min-width: 64rem)");          // Tailwind lg
  const onChange = (e: MediaQueryListEvent) => { if (e.matches) setSheetOpen(false); };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);

<ResultsToolbar … isPending={isPending} onNavigate={navigate} />  {/* passes both to SortSelect */}
<aside className="hidden lg:block">{sheetOpen ? null : <FilterPanel … isPending={isPending} onNavigate={navigate} />}</aside>
<FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} total={results.total}>
  <FilterPanel … isPending={isPending} onNavigate={navigate} />  {/* mounted only while the sheet is open */}
</FilterSheet>
<div aria-busy={isPending || undefined} className={isPending ? "opacity-60" : undefined}>…results…</div>
```

- `FilterPanel` loses its own `useTransition` and `router.push`; it calls `onNavigate(href)` with the same URL it builds today (`/resources?{query}`, serialised exactly as now). It receives `isPending` as a prop, so its sr-only `<p role="status">` keeps reading "Updating results" while a transition is pending and "{n} results" otherwise, unchanged.
- `SortSelect` gets the same `onNavigate` prop and loses its own `useTransition`, so a sort change sets the results region's `aria-busy` exactly like a filter change. It keeps `disabled={isPending}`, now reading an `isPending` prop passed by the toolbar, so the select still cannot fire twice during one transition.
- The hard-coded `id="filter-panel"` is replaced by `useId()`, so even a transient double mount cannot produce a duplicate ID.
- Resizing to `lg` while the sheet is open closes it, and the sidebar form mounts again.
- At 1366px the sheet is never open, so the desktop smoke query `input[name="openSource"]` resolves to the only form, the sidebar.

**Result updates.** No per-record animation. The pending treatment moves from the filter panel to the results region, which `ResourceExplorer` now owns: `aria-busy="true"` and `opacity: 0.6` while a transition is pending, using the FEEDBACK tokens. Route-level cross-fade is deferred to prototype P1 (§7 row 40, §16).

### 3.6 Quick Compare

**Role.** Compare two or three specific listings side by side on objective fields, with their evidence, and see exactly where they differ. This generalises the alternatives table to any pair or trio. The new proprietary behaviour (the difference lens and the evidence-parity statement) is concept C3 (§8).

**Why it is pulled forward from the research's "Defer".** Research Part 5 deferred a generic comparison view because a plain feature matrix adds little over the alternatives pages. C3 is not that: its parity statement is the one place the product can say "these listings were checked to different standards", which is the evidence rule applied to a comparison, and no other surface can say it. Its cost is isolated: one route (`/compare/`), one build-time JSON fetched only there, and one optional prop on `RecordList`. **It ships as a separable final PR**, after every other part of this direction has merged. C1, C2 and C4 already meet the "three new concepts" bar on their own, so if that PR is dropped or delayed, nothing else depends on it.

**Files.**

| File | Purpose |
| --- | --- |
| `src/app/compare-index.json/route.ts` (force-static) | Comparison view-model per listing, computed at build |
| `src/app/compare/page.tsx` | Static shell with `Suspense`, `noIndex` metadata, canonical `/compare/` |
| `src/features/compare/compare-params.ts` | Pure `.ts`: parse and serialise for `r` and `diff`; `diffRows` (C3); and the selection reducer `compareSelection(state: readonly string[], action: { type: "toggle" \| "clear"; slug?: string }): string[]`, which `ResourceExplorer` calls through `useReducer`. `toggle` removes a present slug, or appends an absent one only while `state.length < 3` (otherwise returns `state` unchanged); `clear` returns `[]`. All unit-tested |
| `src/features/compare/compare-index-schema.ts` | zod schema |
| `src/features/compare/compare-view.tsx` | Client: reads params, fetches the index, renders the table and the picker |
| `src/features/compare/compare-tray.tsx` | Client: selection tray on `/resources` |
| `src/features/compare/compare-toggle.tsx` | Client: per-record toggle |

**Compare index entry.** Every evidence field is computed at build by `factEvidence` and `hasRecordedValue`, unchanged. The browser never derives evidence.

```json
{ "s": "krita", "n": "Krita", "c": "Design",
  "values": { "freeStatus": "Open source", "license": "GPL-3.0", "platforms": ["Windows","macOS","Linux"],
              "requiresAccount": "no", "requiresCreditCard": "no", "commercialUse": "yes", "personalUse": "yes",
              "openSource": true },
  "recorded": { "freeStatus": true, "license": true, "platforms": true, "requiresAccount": true, "…": true },
  "evidence": { "freeStatus": { "state": "unconfirmed", "reason": "not-checked" },
                "license":    { "state": "unconfirmed", "reason": "not-checked" },
                "…":          { "state": "unconfirmed", "reason": "not-checked" } },
  "lastCheckedAt": null, "verification": "Unverified", "k": 0, "u": 0 }
```

The compare index has the same top-level `"v": 1` and `"t": FACTS.length` as the palette index. `evidence` stores `{ state, reason }` per fact, the shape `link-manifest.json` already uses, so `EvidenceTag` can write `data-evidence={state}` straight from the index and smoke check 4 compares like with like. Both members are validated with `z.enum`: `state` with `z.enum(["confirmed", "unconfirmed", "unknown"])` and `reason` with `z.enum(["confirmed", "stale", "unresolved", "not-established", "not-checked"])`. Each literal list is pinned to the existing `EvidenceState` / `EvidenceReason` types from `@/lib/resources/evidence` with `satisfies z.ZodType<EvidenceState>` (type-only import; nothing in `lib/` changes), so a future change to the union fails `typecheck`. `k` and `u` come from `factMeterCounts`, exactly as in the palette index.

Expected size is about 350 KB raw and about 45 KB gzip; this is measured and recorded in the PR. It is fetched **only** on `/compare/`.

**Selection.**
- On `/resources`, where the explorer is mounted and JS is running, each record shows a compare toggle in its foot: `<button aria-pressed>` with the accessible name "Add {name} to comparison" or "Remove {name} from comparison". The visible label is "Compare".
- At most 3 can be selected. When 3 are selected, the remaining toggles get `aria-disabled="true"` and sr-only text "Comparison is full, 3 of 3".
- Selection is React state in `ResourceExplorer` (`useReducer(compareSelection, [])`, so the 3-item cap lives in the tested pure reducer, not in the component). It survives filter, sort and page changes, because the explorer stays mounted across same-route navigations. It is **not persisted**: no storage is used, so the `/privacy` statement ("one thing … your theme choice") stays true.
- The static fallback (`StaticLibrary`, 726 records) renders no toggles.

**Tray.** An ELEVATED fixed bottom bar (`--z-sticky`; opaque `--surface-raised`, `--border`, `--shadow-raised`; no blur), shown only when 1 or more items are selected:

```
"2 of 3 selected: Krita, GIMP" · [Compare 2 listings] · [Clear]
```

The primary button is disabled with fewer than 2 selected, with the text "Pick at least 2". It is `<nav aria-label="Comparison" data-compare-tray>`.

- **Padding.** `materials.css` holds `html:has([data-compare-tray]) main { padding-bottom: 5rem }` and `html:has([data-compare-tray]) { scroll-padding-bottom: 5rem }`, so the tray never covers the last record, the pagination or a focused element. No JS measures it.
- **Motion.** ENTER only, via `@starting-style` (`--dur-move`, `--dist-short` up, opacity). **EXIT is instant**: Clear (or removing the last item) unmounts the tray in the same render, so there is nothing to animate and no exit wait. Focus after Clear moves to the first record's compare toggle if one is in the DOM, otherwise to `#main`, so it is never left on a removed node.

**Other entry points.**
- Record pages get a "Compare with…" text link → `/compare/?r={slug}`. It is rendered **only after hydration**, by a tiny client island `compare-link.tsx` that returns `null` until a `useSyncExternalStore` hydration flag (server snapshot `false`) is true. The no-JS record page therefore does not offer a feature it cannot deliver.
- `/compare/` itself has an "Add a listing" combobox that reuses `palette-search.ts` over the compare index names, using the same ARIA pattern as the palette, inline rather than in a dialog.

**No-JS state of `/compare/`.** A shared `/compare/` URL can still be opened without JS. The page's `Suspense` fallback is static HTML: a serif `h1` "Compare listings", then a `<noscript>` block holding a neutral `Callout` titled "Comparison needs JavaScript" with the body "Open each listing instead to see its facts and evidence." and a `Link` to `/resources/`. This is the same pattern `static-library.tsx` uses for "Search and filters need JavaScript". With JS, the `<noscript>` never renders and `compare-view.tsx` replaces the fallback. `/compare/` is `noIndex` and is **not** added to `sitemap.ts` (a static route list that does not include it today; the file is not edited).

**Table.**
- A real `<table>` with a caption. Columns are the 2–3 listings; each `th scope="col"` holds the name linked to the record, plus the monogram.
- Rows in fixed order: Free status, Licence, Platforms, Account needed, Credit card, Commercial use, Personal use, Open source, Last checked, Facts confirmed. Each row has a `th scope="row"`.
- The 8 fact rows (Free status, Licence, Platforms, Account needed, Credit card, Commercial use, Personal use, Open source) render `<td data-fact="{fact}">`, with the value phrased by the `FactValue` rule and an `EvidenceTag`, so `[data-evidence]` is present. This is the same contract as the alternatives table, so the smoke audit pattern can be reused. The two non-fact rows, "Last checked" and "Facts confirmed", render plain `<td>` with **no** `data-fact`, so smoke check 4 never looks up a fact that does not exist.
- The table wraps in the existing focusable scroll region pattern: `role="region" tabIndex={0} aria-label="Comparison table"`.

### 3.7 Global coverage, shown only where data supports it

**Decision.** Coverage is shown **by subject and by platform**, the dimensions that exist. It is labelled "coverage by subject", never "global coverage", and never geographic. **No map, no globe, no flags, no country or language counts** (research §1.6).

Where it appears:

1. **Homepage Atlas Index** (§8 C4): every subject with its live listing count.
2. **`/verification`: "Survey by subject group"**, a static, server-rendered table with 8 rows, one per group. Columns are listings, listings with at least one confirmed fact, partially verified, and verified. Membership uses each listing's **primary `category` only**, while the Atlas Index counts `category` plus `subcategories` through `computeFacets`. Both are defensible, and the caption names the difference: "Counted by each listing's main subject only, so these totals differ from the subject counts in the index. Some subjects sit in two groups, so rows can add up to more than the total."

   The rows come from one pure function in `src/features/home/census.ts`, beside `libraryCensus`:

   ```ts
   export function surveyByGroup(resources: readonly Resource[], now?: Date): {
     groupId: CategoryGroupId; listings: number; withConfirmedFact: number; partiallyVerified: number; verified: number;
   }[];
   ```

   It returns one row per entry of `categoryGroups`, in config order. A listing belongs to a group when `group.categoryIds.includes(resource.category)`, so a listing whose category sits in two groups (for example `books`) counts in both rows. `withConfirmedFact`, `partiallyVerified` and `verified` use exactly the predicates of the matching `libraryCensus` fields (`factEvidence` and `effectiveVerification`, with `now` passed through for staleness). `tests/census.test.mts` covers it, including the two-group case and that a row's `verified + partiallyVerified ≤ listings`.
3. **`/verification`: the full Survey bar** (motif M2) for the whole library.

### 3.8 Motion system

Centralised in `src/styles/motion.css` (tokens, utilities and keyframes). The only motion-related JavaScript is the Dialog primitive's exit wait (§3.10). Fully specified in §6.

### 3.9 The record page (`/resources/[slug]`)

The page is reorganised as a catalogue record. Every existing section and contract survives.

1. **Breadcrumbs** (unchanged component, restyled to `xs` and `--fg-subtle` with `/` separators).
2. **Record header** (`<header>`, CONTENT on `--bg-subtle` band):
   - kicker "Record · {slug}" (motif M4), set in `tnum`;
   - serif `h1` with the name;
   - standfirst: `shortDescription`;
   - the coordinates line;
   - actions: primary "Open {host}" with the external icon; secondary "Source code" when `sourceUrl` exists; the "Compare with…" text link, rendered only after hydration (§3.6, `compare-link.tsx`); the note "Opens the provider's own site";
   - the full Resource Snapshot;
   - the existing `headerEvidenceSentence`.
3. **On this page** navigation (`<nav aria-label="On this page">`). From `xl` it is a sticky left column (`11rem`); below `xl` it is an inline wrapped list under the header. The candidate links are About, Why it is listed, The catch, What it does, Facts, Connected in the library, Verification. **A link is rendered only when its section renders**: "What it does" is omitted when `features.length === 0`, and "Connected in the library" when every sub-group is empty. The page computes one `sections` array of `{ id, label }` from the same conditions that render the sections, and passes it both to the nav and to the island, so the two cannot disagree. The current section is marked with `aria-current="location"` by a small client island, `on-this-page.tsx`, using **one** `IntersectionObserver` per page with `rootMargin: "-40% 0px -55% 0px"` over the headings of the rendered sections only (up to seven), each looked up by `document.getElementById(id)` and skipped if absent. The last heading to intersect wins. Without JS or without `IntersectionObserver`, the list renders with no current marker. The marker uses the selected/current treatment (gold underline, §2.1 item 4), so `on-this-page.tsx` joins the gold owner list.
4. **Main column**, in this order:
   - the status Callout (unchanged copy). Its tone is `status.tone === "success" && !confirmed ? "neutral" : status.tone`: only an unconfirmed success is muted, because a caution (`warning` for `PERSONAL_FREE` and `LIMITED_FREE`, `danger` for `TRIAL`) never overclaims. Its icon is `status.caveat && (status.tone === "warning" || status.tone === "danger") ? "alert-triangle" : null` (§2.6): cautions get the warning icon, every other status gets none. `status.icon` is never rendered, because four of its values are reserved evidence glyphs;
   - About;
   - Why it is listed: the standfirst style, no gold border;
   - **The catch**, formerly "Limitations of the free offering". The `h2` reads "The catch", with the sub-label "Limitations of the free offering" directly under it. The capital L matters: the no-JS smoke check `innerText.includes("Limitations")` is case-sensitive. Each limitation is a ruled list item with no icon. The two honest empty states stay verbatim;
   - What it does;
   - **Facts**: `#facts-heading`, the sibling `div`, then `dl > div > dt/dd`, unchanged structure. The `h2` text changes from "Details" to **"Facts"**, matching the On-this-page link label and the ledger concept (no smoke check reads the heading text; `JS.detailRow` reads `dt` text only). Restyled as a ledger with dotted leaders (motif M4);
   - **Connected in the library**: `h2` "Connected in the library", then up to three sub-groups, each with an Inter 600 `h3`, in this order:
     - "Listed as an alternative to" (replaces the `h2` "People use this instead of"): today's caveat paragraph is kept **verbatim** directly under the `h3`: "Listed as an alternative to these paid products. That does not mean it matches them feature for feature — read the limitations above and judge for your own use." Then the `alternativeTo` products as text links to `/alternatives/{slugifyProductName(product)}`, separated by " · " (no chips, no `refresh-cw` icon);
     - "Similar listings" (replaces the `h2` "Similar resources"): `getSimilarResources` as a `RecordList layout="grid"`;
     - "In collections": collections that include this listing (`getCollections()` filtered by `resourceSlugs.includes(slug)`, an existing function used unchanged), as text links.

     Sub-groups with no entries are omitted, and the whole section is omitted when all three are empty;
   - **Verification**: `VerificationPanel`, unchanged contract (an `h2` "Verification", a closed `details` "View verification evidence"). Its root changes from `<Card>` to a CONTENT `<section id="verification" aria-labelledby="verification-heading">` (no box, `--rule` top hairline), with the `h2` "Verification" (`id="verification-heading"`) still a **direct child** of that root, so the smoke check's `h2.parentElement.innerText` still reads the whole panel. Inner markup and copy are otherwise unchanged. The `id` is the rail link's target.
5. **Aside**, in this order. Today's aside holds the Verification panel, two Cards and the Tags list; the panel moves to the main column (item 4), and both Cards and the Tags list survive as CONTENT blocks:
   - (a) **Provenance Rail**, sticky on `lg`+ (only the rail is sticky). A sticky element still occupies its place in flow, so a block placed straight after it would scroll up underneath it. To prevent the overlap, on `lg`+ the aside is a stretched grid item (`align-self: stretch`) laid out as `flex flex-col`, and the rail sits inside a wrapper `<div class="lg:flex-1">`. The wrapper fills the aside's spare height, and the rail sticks inside it, so it is released before (b) begins. (b), (c) and (d) therefore sit at the foot of the aside on `lg`+, where they read as the record's footnotes. Below `lg` nothing is sticky and the four blocks simply stack.
   - (b) **"Where this information comes from"**: CONTENT material (no `Card` box, a `--rule` top hairline, `pt-6`), `h2` in Inter 600 `sm`, the two existing list items as a plain ruled list with **no icons** (the `library` and `globe` icons are deleted, §2.6), and the non-affiliation sentence **verbatim**: "{site.name} is not affiliated with {resource.name} and does not host, operate or endorse it." The copy of both list items is unchanged. It is not sticky.
   - (c) **"Something wrong here?"**: the existing report block, same `h2`, copy and link, in the same CONTENT treatment as (b).
   - (d) **Tags**: CONTENT, a `--rule` top hairline, `h2` "Tags" in Inter 600 `sm`, and the tags as text links separated by " · " (no chips, matching the `SearchSuggestions` change in §2.5), in `--fg-muted` with the hover rule of §2.7. Each `href` is unchanged: `/resources?tag={encodeURIComponent(tag)}`, the only path from a record to its tag listings. The block is omitted when `tags.length === 0`, as today. On `lg`+ it is the last block of the aside, after (c), so the sticky-rail wrapper rule is unchanged.
6. **Mobile action bar** (below `lg`). `src/features/resources/components/mobile-action-bar.tsx` (client). A FUNCTIONAL fixed bottom bar with the primary "Open {host}". It appears only when the header's action group has scrolled out of view, observed by one `IntersectionObserver`. Without JS it is not rendered, because the header action exists. Rules:
   - `padding-bottom: env(safe-area-inset-bottom)`;
   - `html:has(.action-bar[data-visible]) { scroll-padding-bottom: 72px }`;
   - `main` gets matching bottom padding **only while the bar is visible**, so it never covers focus or the footer and leaves no empty band when hidden: `html:has(.action-bar[data-visible]) main { padding-bottom: calc(72px + env(safe-area-inset-bottom)) }` in `materials.css`, beside the `scroll-padding-bottom` rule.

### 3.10 Shared Dialog primitive

`src/components/ui/dialog.tsx` is the single overlay implementation for the mobile menu, command palette and filter sheet. It replaces the hand-rolled focus trap in `mobile-nav.tsx`.

- It renders a native `<dialog data-ef-modal role="dialog" aria-modal="true" …>` **only while open** (mounted, then `showModal()` in a layout effect). The explicit `role` and `aria-modal` keep the smoke contracts `[role="dialog"][aria-modal="true"]` on open and `!document.querySelector('[role="dialog"]')` after close. `data-ef-modal` is what the scroll-lock rule selects (below).
- It is **controlled**: the parent owns `open`. When `open` turns `false` (for any reason: Close button, "Show N results", navigation, or the parent reacting to `onRequestClose`), the primitive checks the element:
  - if `dialogEl.open` is still `true`, it sets `data-closing`, plays EXIT (§6), then calls `close()`, unmounts the `<dialog>` and calls `onExited`. The smoke `waitFor` tolerates the 150 ms;
  - if `dialogEl.open` is already `false` (the browser closed it natively, see below), it **skips EXIT**, because the element is already hidden, unmounts immediately and calls `onExited`.

  Focus is restored in both paths, as described under "Focus return".
- **Close requests (Escape, Android back).** The primitive never assumes it can veto a close. Under the HTML close-watcher rules (Chromium 120+) the `cancel` event is cancelable only when the page has history-action user activation; otherwise it fires with `cancelable: false` and the dialog closes natively whatever the handler does. So:
  - **`cancel` handler:** calls `onRequestClose("escape")`. If `event.cancelable` is `true`, it also calls `event.preventDefault()`, purely so EXIT can play before `close()`. Nothing depends on the `preventDefault` having worked.
  - **`close` handler** (attached once; it reads the latest `open` prop through a ref, never a stale closure): if the native `close` event fires while the `open` prop is still `true` (a non-cancelable Escape, Android back, or any other browser-initiated close), it calls `onRequestClose("escape")`. The parent sets `open` to `false`, and the primitive takes the "already closed" path above. When the primitive itself calls `close()` after EXIT, `open` is already `false`, so the handler does nothing.
  - Calling `onRequestClose` twice for one Escape (cancel, then close) is harmless: parents implement it as `setOpen(false)`, which is idempotent. The primitive keeps no other state about it.
  - There is **no Escape veto** in the API. A component that wants Escape to do something else first (the palette's query clearing, §3.4) cancels the `keydown` on its own control, which stops the close request before it starts.
- **Focus return.** On open, the primitive stores `document.activeElement`. After unmount it focuses that element, unless `returnFocus` is `false` at that moment or the element is no longer connected (`!el.isConnected`), in which case it focuses `#main`. The `aria-label="Open menu"` trigger regains focus after Escape, which is the existing contract. The palette sets `returnFocus={false}` before navigating (§3.4).
- **Scrim click:** a `click` whose target is the `<dialog>` element itself (outside the panel's bounding box) calls `onRequestClose("scrim")`. It is pointer-only; the Close button is the accessible control.
- The `palette-top` variant adds `data-palette` to the `<dialog>`, which the shortcut guard relies on (§3.4).
- **Scroll lock:** `html:has(dialog[data-ef-modal][open]) { overflow: hidden }`, plus `scrollbar-gutter: stable` on `html`, which prevents layout shift.
- **Variants:** `"panel-right"` (mobile menu), `"sheet-bottom"` (filters), `"palette-top"` (palette). Each has one direction of travel, and exit mirrors entry.
- **Exit wait.** The primitive waits for `transitionend` on the panel element, with a fallback timeout of the panel's computed `transitionDuration` plus 50ms (§6.5). Under reduced motion that computed value is `0.01ms`, so the fallback is about 50ms.

### 3.11 Component signatures

These are binding. Other components depend on them, so the implementer does not choose them.

```ts
// src/components/ui/dialog.tsx  ("use client")
export type DialogCloseReason = "escape" | "scrim";
export function Dialog(props: {
  open: boolean;
  onRequestClose: (reason: DialogCloseReason) => void; // the parent sets open=false in response
  onExited?: () => void;                               // after EXIT completes and the <dialog> unmounts
  variant: "panel-right" | "sheet-bottom" | "palette-top";
  labelledBy: string;                                  // id of the visible or sr-only title
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  // No Escape-veto prop: closes cannot be vetoed reliably (§3.10). Pre-empt Escape on the control's own keydown instead.
  returnFocus?: boolean;                               // default true; read at unmount time
  children: React.ReactNode;
}): React.JSX.Element | null;                           // null while closed and after EXIT

// src/components/ui/kbd.tsx
export function Kbd(props: { children: React.ReactNode }): React.JSX.Element;

// src/components/ui/segmented-control.tsx  ("use client"; a radio group)
export function SegmentedControl<T extends string>(props: {
  name: string; legend: string; value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void; disabled?: boolean; disabledReason?: string;
}): React.JSX.Element;

// src/components/ui/layout.tsx  (Section gains two props; existing props unchanged)
//   kicker?: string;                         at most one per section, rendered as a <p>, never a heading
//   variant?: "default" | "editorial";       "editorial" = margin-column running head + serif h2

// src/features/resources/components/resource-record.tsx  (no "use client", no hooks)
export function ResourceRecord(props: {
  resource: Resource; matchReasons?: string[]; compareSlot?: React.ReactNode;
}): React.JSX.Element;
export function RecordList(props: {
  resources: Resource[]; layout: "list" | "grid"; label?: string;
  reasonsBySlug?: Record<string, string[]>;
  renderCompare?: (resource: Resource) => React.ReactNode;   // only ResourceExplorer passes this
}): React.JSX.Element;

// src/features/resources/components/resource-snapshot.tsx
export function ResourceSnapshot(props: { resource: Resource; size: "full" | "compact" }): React.JSX.Element;

// src/features/resources/components/status-badges.tsx (the only tone source for the compact tokens, §12.3 rule 2)
export function FreeStatusBadge(props: { resource: Resource; size?: "sm" | "md"; variant?: "badge" | "token" }): React.JSX.Element;
export function OpenSourceBadge(
  props: { variant?: "badge"; license?: string } | { variant: "token"; resource: Resource },
): React.JSX.Element;

// src/components/ui/badge.tsx
// BadgeProps gains appearance?: "badge" | "ledger" (default "badge"); "ledger" is transparent when neutral (§13).

// src/features/resources/components/provenance-rail.tsx
export function ProvenanceRail(props: { resource: Resource }): React.JSX.Element;

// src/features/resources/components/fact-meter.tsx
// A count gauge (§8 C1): confirmed cells first, then unsettled, then unchecked. Positions do not identify facts.
export function FactMeter(props: {
  confirmed: number; unsettled: number; total: number;   // total = FACTS.length on the server, the index's `t` in the browser
  labelled?: boolean;                                      // true: visible text; false (default): aria-hidden
}): React.JSX.Element;

// src/features/resources/fact-meter-counts.ts  (pure .ts, no JSX, so the Node test runner can import it)
export function factMeterCounts(resource: Resource): { confirmed: number; unsettled: number; total: number };
// confirmed: state "confirmed"; unsettled: reason "unresolved" or "stale"; total: FACTS.length. All via factEvidence

// src/features/resources/components/coordinates-line.tsx
export function CoordinatesLine(props: { resource: Resource }): React.JSX.Element | null; // null when every part is absent

// src/features/resources/components/legend.tsx
export function Legend(props: { variant: "full" | "popover"; id?: string }): React.JSX.Element; // id required for "popover"

// src/features/resources/components/survey-bar.tsx
export function SurveyBar(props: { survey: LibraryCensus["survey"]; size: "sm" | "lg" }): React.JSX.Element;

// src/features/resources/components/evidence.tsx  (new export beside EvidenceTag)
export function EvidenceMark(props: { reason: EvidenceReason; size?: 12 | 13 | 16 }): React.JSX.Element; // aria-hidden icon

// src/features/home/census.ts  (pure)
export interface LibraryCensus {
  listings: number; subjectsWithListings: number; subjectsDefined: number; groups: number;
  verified: number; partiallyVerified: number; withConfirmedFact: number;
  survey: { verified: number; partiallyVerified: number; otherConfirmedFact: number; noConfirmedFact: number };
  toolsAvailable: number;
}
export function libraryCensus(resources: readonly Resource[], now?: Date): LibraryCensus;
```

---

## 4. Pages and information architecture

### 4.1 Homepage: Library introduction (the hero)

**Rule.** The hero is a dynamic library introduction. Its numbers come from a census computed at build from the repository. It never hard-codes counts, and it never says "Discover thousands of free tools".

**Census.** `src/features/home/census.ts` exports `libraryCensus(resources, now?)`. It is pure and unit-tested in `tests/census.test.mts`. It returns:

| Field | Computation |
| --- | --- |
| `listings` | `resources.length` (equals `getResourceCount()`) |
| `subjectsWithListings` | categories whose `computeFacets(resources, {})` count is > 0 |
| `subjectsDefined`, `groups` | `categoryList.length`, `categoryGroups.length` |
| `verified` | listings whose `effectiveVerification(r).id === "VERIFIED"`, so a stale verification is not counted |
| `partiallyVerified` | `effectiveVerification(r).id === "PARTIALLY_VERIFIED"` |
| `withConfirmedFact` | listings with ≥ 1 of the 11 `FACTS` confirmed by `factEvidence` |
| `survey` | **mutually exclusive** segments for the Survey bar: verified; partially verified; other listings with a confirmed fact; no confirmed fact. They sum to `listings`, and a test asserts this |
| `toolsAvailable` | `availableTools.length` |

`app/page.tsx` calls `getAllResourcesForClient()` once and passes the census down. Other sections keep their existing repository reads.

**Composition.** Left-aligned. From `lg`, an 8 + 4 column split. On `--bg`, with no background graphics.

Left (8 columns):

```
EVERYTHING.FREE · LIBRARY INDEX                                    ← running head (kicker)

A library of 726 listings of free                                  ← h1, serif, --text-display,
resources, across 68 subjects.                                       numbers in tnum, same colour as text

Each listing says what “free” means for it, what the free          ← standfirst, --text-lg, --fg-muted
offering limits, and which of its facts an official source
confirms. Nothing is ranked by popularity, because nothing
is tracked.

[ Search the library ________________________________ ] [Search]  ← existing GET form to /resources
  or press ⌘K to jump to any listing                               ← Kbd hint, after hydration only

Try: free alternative to Photoshop · free AI voice generator       ← intentExamples as text links,
without a credit card · free tools I can use for commercial work      separated by " · ", no pills
```

The numbers shown here are illustrative. The rendered sentence is "A library of {n} listings of free resources, across {m} subjects.", with `n = formatCount(census.listings)` and `m = formatCount(census.subjectsWithListings)`. It follows the §1.3 voice rule ("listings", "subjects"), and it does not state "free" as a library-wide fact, since 99% of free statuses are unconfirmed: the listings are *of* free resources as classified, which each record then qualifies.

Right (4 columns; below the search on mobile):

```
HOW TO READ A LISTING                                               ← kicker
✓ Confirmed          An official source confirms it                 ← the Legend (motif M1),
? Not confirmed      Looked for, not settled                          marks + words, from evidenceLabels
~ Needs re-checking  Was confirmed, the check expired
– Not verified       Recorded, never checked
? Unknown            Not established either way

SURVEY                                                              ← kicker
[█▌░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]                            ← Survey bar (motif M2)
10 of 726 listings have a fact confirmed by an official source.
6 are partially verified. 0 are fully verified.
How verification works →
```

The glyphs in this sketch stand for the existing SVG icons. They are not characters in the UI.

**Copy rules and edge cases.**
- **Plurals** use `Intl.PluralRules("en")`: "A library of 1 listing of free resources, across 1 subject."
- **Zero listings:** the `h1` reads "The library has no listings yet." The survey block is not rendered. The search and the "Submit a resource" link remain.
- **Zero verified:** stated plainly ("0 are fully verified"). It is never hidden or reworded to sound better.
- **`withConfirmedFact === 0`:** "No listing has a fact confirmed by an official source yet."
- **Removed:** the pill eyebrow, centred stack, `hero-grid` utility, translucent card, bolt and shield icons, and the rotating placeholder. The search field gets one fixed placeholder: "Try “free PDF tools” or “alternative to Photoshop”".
- The `searchExamples` constant stays in config, unedited. The hero stops using it (the rotating placeholder is removed), and the palette does not use it (§3.4). If nothing else imports it after this work, it is left in place as unused config; removing it would be a config edit, which is out of scope.

### 4.2 Homepage below the introduction

Each section has a running head (motif M5) in the margin column, a serif `h2`, one standfirst sentence, then dense content. Sections are separated by a 1px `--border` rule (non-interactive structure; `--border-strong` is reserved for interactive edges, §2.1). Weight is deliberately unequal: the index leads, and the rest follow.

1. **Atlas Index** (§8 C4). All 8 groups as columns of subjects, each with its live count.
2. **A starting selection.** `getSpotlightResources(6)` as a two-up `RecordList layout="grid"`. The existing "not a ranking" copy is kept.
3. **Recently checked.** `getRecentlyVerified(6)` as a one-column `RecordList layout="list"`. The empty state is unchanged.
4. **Tools you can use here.** An index list: name, one-line description, and "Runs in your browser". A planned tool shows the word "Planned" and is not a link. There are no cards and no icons.
5. **Collections.** An editorial list: serif name, standfirst, "{n} listings". Not cards.
6. **By what you do.** Audiences as a two-column text index with descriptions. No icons and no hover-reveal arrows.
7. **Replacing something paid?** Alternatives as an index with dotted leaders: "Adobe Photoshop ........ 7". The existing "does not claim any alternative is universally better" Callout is kept.
8. **Contribute.** A plain ruled section with no rounded box: a serif `h2`, the paragraph, and three actions (one primary).

### 4.3 Other pages

- **`/categories`:** the Atlas Index at full size, with the type-to-narrow input from C4.
- **`/categories/[slug]` and `/collections/[slug]`:** a chapter opening (kicker with the group name, serif `h1`, standfirst from `description`, count), then `RecordList layout="list"`. Category pages add a "Nearby subjects" line listing siblings in the same group, as text links with counts. The collection note `[data-testid="collection-evidence-note"]` is kept verbatim.
- **`/alternatives/[slug]`:** the existing `AlternativeComparison` table, restyled (CONTENT, ruled rows, `tnum`). Its contract is unchanged.
- **`/verification`:** the Legend in full, the Survey bar, the "Survey by subject group" table (§3.7), and the existing explanatory content. The process is a static, well-set diagram of the ordered stages. There is no scroll storytelling.
- **`/compare`:** see §3.6.
- **Header:** FUNCTIONAL material.
  - Wordmark: "Everything" + gold "." + "Free", in Inter 600. The gold "EF" tile is removed (§2.1 item 1).
  - Five text-only nav items. The current item gets a 2px gold underline and `aria-current="page"`.
  - Palette trigger: the search icon, plus "Search" and a `Kbd` from `lg`.
  - Theme toggle (contract `button[aria-label^="Switch to"]`).
  - Submit (secondary).
  - Mobile menu: the shared Dialog `panel-right`, with no nav icons.
- **Footer:** the four existing groups as text columns, plus a colophon: "Everything.Free, a Quilonix project. Released as open source. Set in Source Serif 4 and Inter." No social icons.
- **404 and error pages:** a centred, honest message that leads with text; the round icon discs are deleted (§2.6). The 404 keeps its "does not exist" heading text (a smoke contract), the library search form, and links to Browse and Subjects. The error page keeps its copy, its digest reference, "Try again" and "Go to the homepage", and its existing `console.error`; only the icon disc and the danger fill go.
- **Pages touched for colour and icon discipline only** (no layout change): `/about`, `/free-status`, `/privacy`, `/terms`, `/submit`, `/report`, `/tools` and `/tools/[slug]`. Their inline links move to `link-inline`, their `tone="success"`/`"primary"`/`"info"` Callouts and Badges move to `tone="neutral"` (§12.3), and their decorative icons are removed (§2.6). Copy is unchanged.

---

## 5. Signature motifs: the Everything.Free DNA

Six motifs. Each is built from real data and repeats across the product, so a screenshot of any page is recognisable without the logo.

### M1. The Legend

**What.** One key of evidence marks, each paired with its word, printed wherever marks appear and reachable in one interaction from any surface that shows them.

**Why.** Cartography's most transferable idea, and the core of trust: a reader never has to guess what a symbol means (research §8).

**Where:**
- the homepage introduction, in full;
- `/verification`, in full;
- a popover from the "Confirmed by an official source" filter region, the record page's Facts heading, and the compare page.

**How.**
- `src/features/resources/components/legend.tsx` renders the five `EvidenceReason`s, using `evidenceLabels` plus one-line explanations. It renders marks through a new exported `EvidenceMark({ reason })` in `evidence.tsx`, so the `STYLE` map stays the single owner.
- The popover uses the HTML `popover` attribute with a `popovertarget` invoker, so it **works without JS** (the attribute is server-rendered). Placement uses CSS anchor positioning: the trigger names the anchor and the popover references it, both through inline styles (allowed by the CSP), then `position-area: block-end span-inline-end` from `legend.tsx`'s classes:

  ```tsx
  <button type="button" popoverTarget={id} style={{ anchorName: `--${id}` } as React.CSSProperties}>…</button>
  <div id={id} popover="auto" style={{ positionAnchor: `--${id}` } as React.CSSProperties}>…</div>
  ```

  `popoverTarget` is React 19's prop name (the lower-case `popovertarget` is a TypeScript error on `<button>`). The `as React.CSSProperties` cast is needed only because the installed `csstype` may not list `anchorName`/`positionAnchor` yet; it is a cast on a style object, not a suppression.
- Fallback where anchor positioning is unsupported (`@supports not (position-area: block-end)`): `position: fixed; inset: auto 1rem 1rem 1rem`.

**A11y.** The trigger is `<button type="button" popoverTarget={id}>` with the accessible name "What the evidence marks mean", where `id` is the same value passed to `Legend variant="popover" id={id}`. The ids are fixed per surface: `legend-filters` (filter region), `legend-facts` (record page Facts heading) and `legend-compare` (compare page), so ids stay unique on every page. `type="button"` is required: the filter-region trigger sits inside the filter `<form>`, where a default button would submit the form instead of opening the popover. The popover has a heading. Light dismiss and Escape are native.

### M2. The Survey bar

**What.** One horizontal bar of mutually exclusive segments showing how much of the library has been surveyed. M2 is the bar only. It introduces **no** symbols of its own: evidence symbols mean only what the Legend (M1) says and are rendered only by `EvidenceMark` (the reserved-glyph rule and its conversions are in §2.6, enforced by the guardrail test), and the Provenance Rail's station markers are neutral position markers (§3.2).

**Why.** It is the atlas idea of surveyed against unsurveyed territory, made honest. With 10 of 726 listings carrying a confirmed fact, the bar is almost entirely unsurveyed, and it says so. It is distinctive *because* it is truthful.

**Where.** The homepage introduction and, larger, `/verification`.

**How.**
- The bar is a server-rendered `<div aria-hidden="true">` containing four `<span>`s, with widths set through inline `style="--w: 1.38%"`. Inline styles are permitted by the CSP.
- Each non-zero segment has a minimum width of 2px.
- Segment fills: `--success-fg`, `--survey-partial`, `--survey-other` and `--rule`. The two partial fills are tokens in `materials.css`, declared exactly like `--meter-unsettled` (§8 C1): static values first, the relative form only inside the §2.1 feature query (`color-mix()` is not used, because the fallback rule does not cover it):

  ```css
  :root  { --survey-partial: oklch(0.80 0.130 160 / 0.55); --survey-other: oklch(0.80 0.130 160 / 0.25); }   /* dark static */
  .light { --survey-partial: oklch(0.45 0.110 160 / 0.55); --survey-other: oklch(0.45 0.110 160 / 0.25); }   /* light static */
  @supports (color: oklch(from red l c h)) {
    :root, .light {
      --survey-partial: oklch(from var(--success-fg) l c h / 0.55);
      --survey-other:   oklch(from var(--success-fg) l c h / 0.25);
    }
  }
  ```
- The adjacent visible sentence carries all the numbers, so nothing depends on colour or on the bar.
- There is no animation, and the bar is never animated in.

### M3. The coordinates line

**What.** Every listing's grid reference, always in the same order: **subject · type · platforms · licence**. Inter `xs`, `tnum`, `--fg-muted`, with separators `" · "` in `--fg-subtle`.

**Why.** It replaces coloured badge clusters with one quiet, precise line. Consistent order is what makes it scannable across 24 records at once.

**Where.** Records, the record-page header, and the palette's secondary line (subject plus free status only).

**How.** `src/features/resources/components/coordinates-line.tsx`. Absent parts are omitted. It wraps at separators (`white-space: nowrap` on each part).

### M4. The ledger and the record key

**What.**
- Facts set as an archival ledger: each `dt` label is joined to its `dd` value by a dotted leader, with values right-aligned on wide screens.
- Every record carries its **record key**: the stable slug, set as a kicker ("Record · krita").
- Dates are always `<time>` elements, with full dates on record pages.

**Why.** It reads as a technical archive rather than a marketing page. The slug is a real, stable identifier ("changing it breaks links", per `types/resource.ts`), so it is honest to present it as a catalogue key. A sequence number would change as the library grows.

**Where:**
- the Facts panel;
- the alternatives index on the homepage ("Adobe Photoshop ........ 7");
- the record foot;
- the record header.

**How.**
- The leader is a `flex` spacer `<span aria-hidden="true">` with `border-bottom: 1px dotted var(--rule)`, placed *inside* the existing `dt`, so the `dl > div > dt/dd` structure is unchanged.
- Below `sm`, leaders are hidden and values stack under labels.

### M5. Running heads and marginalia

**What.** Each editorial section opens with a running head: a kicker in the margin column, a serif title, and a one-sentence standfirst. Below `lg`, the kicker sits above the title.

**Why.** It gives the editorial hierarchy the research found missing ("every section has equal weight", research §1.8) without decoration.

**Where.** Homepage sections, category and collection chapter openings, `/verification` and `/about`.

**How.** The `Section` component in `src/components/ui/layout.tsx` gains `kicker` and `variant="editorial"` props. At most one kicker per section. Kickers never replace headings: the `h2` stays the semantic title.

### M6. Ruled, not boxed

**What.** Structure comes from 1px hairlines and space, not from rounded bordered boxes with shadows.

**Why.** Linear's "structure should be felt, not seen". It is also the fastest way to stop looking like a SaaS template.

**Where.** Record lists, the snapshot grid, ledgers, tables, footer columns, and the contribute section.

**How.**
- `Card` is **not** used for records, for the record page, or for the Verification panel. On the record page, the `VerificationPanel` root becomes a CONTENT `<section>` with the `h2` "Verification" as a direct child, and the aside's two Cards become ruled CONTENT blocks (§3.9 items 4–5). `Callout` keeps its own bordered wrapper and never used `Card`.
- `Card` remains only where a grouped object needs an edge: tool entries (`tool-card.tsx`) and the existing definition and form panels on `/free-status`, `/about`, `/verification`, `/tools/[slug]` and `/submit`. Card itself is restyled once, so those uses follow: CONTENT material, a 1px `--border` edge, `--radius-md`, no fill beyond `--surface`, and no shadow (`--shadow-card: none`). Collections move to index rows (§4.2), so `collection-card.tsx` stops using `Card`.
- `--shadow-card` becomes `none`.
- A design-guardrail test (§14) enforces "no radius above 10px": it fails on `/\brounded(?:-[trblse]{1,2})?-(?:lg|xl|2xl|3xl|4xl)\b/` and on arbitrary `/\brounded(?:-[trblse]{1,2})?-\[/` in `src/**/*.tsx` outside `features/tools/implementations/**` (the radius tokens and class mapping are in §2.5), and on `rounded-full` beyond an explicit file-to-count map. The map is data in the test and lists every true circle that exists after this work:

```ts
// tests/design-guardrails.test.mts
const ROUNDED_FULL_ALLOWED: Record<string, number> = {
  "src/app/resources/[slug]/page.tsx": 1,                        // feature bullet dot (size-1.5)
  "src/app/verification/page.tsx": 1,                            // step numerals (size-6)
  "src/features/resources/components/provenance-rail.tsx": 1,    // neutral station marker (7px ring)
};
```

  Every other current `rounded-full` is removed by this work: the icon discs in `empty-state.tsx`, `error.tsx` and `not-found.tsx` (deleted, §2.6); the hero pill eyebrow (hero rewritten); the active-filter chips (`--radius-xs`); the mobile "Filters" count pill (now text); and the `SearchSuggestions` pills (now text links). The test counts occurrences per file, so a new circle anywhere, or a second one in an allowed file, fails until the map is edited in review.

---

## 6. Motion system

### 6.1 Principles

1. Motion explains a state change. It never decorates.
2. Content is never delayed. Nothing fades in on load or on scroll.
3. Exit mirrors entry. Each surface has one direction of travel.
4. Latency beats animation. Listbox focus, filter results and typing feedback are instant.
5. Motion is optional. Every state is fully communicated without it, and reduced motion removes it.

### 6.2 Tokens (`src/styles/motion.css`, on `:root`)

| Token | Value | Below `sm` |
| --- | --- | --- |
| `--dur-instant` | 90ms | 90ms |
| `--dur-quick` | 150ms | 130ms |
| `--dur-move` | 220ms | 180ms |
| `--dur-sheet` | 260ms | 220ms |
| `--dur-flash` | 900ms (FOCUS fade only) | 900ms |
| `--dist-nudge` | 2px | 2px |
| `--dist-short` | 6px | 4px |
| `--dist-panel` | 24px | 16px |
| `--dist-sheet` | 40px | 24px |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | same |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | same |
| `--ease-spring` | `linear(0, 0.075 5%, 0.228 10%, 0.391 15%, 0.537 20%, 0.751 30%, 0.874 40%, 0.939 50%, 0.971 60%, 0.994 80%, 1)` | same |

`--ease-spring` is a critically damped response, `1 − (1 + ωt)·e^(−ωt)` with ω = 9, sampled. It has **no overshoot**, so nothing bounces.

The `@theme` block sets `--default-transition-duration: var(--dur-instant)` and `--default-transition-timing-function: var(--ease-standard)`, so Tailwind's `transition-colors` uses tokens automatically.

### 6.3 Categories

| Category | Meaning | Tokens | Properties | Used by | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| **ENTER** | A surface appears | `--dur-move` (palette, menu) or `--dur-sheet` (sheet), `--ease-spring`. Distance: palette `--dist-short` down, menu `--dist-panel` from the right, sheet `--dist-sheet` up | `opacity`, `transform`. Entry state from `@starting-style`; backdrop opacity on `::backdrop` | Dialog variants, Legend popover (`--dur-quick`, opacity only), compare tray | Instant |
| **EXIT** | A surface leaves | `--dur-quick`, `--ease-exit`, mirrored distance | `opacity`, `transform`, with `display` and `overlay` under `transition-behavior: allow-discrete` | Dialog variants and the Legend popover. **Not** the compare tray, which unmounts on Clear and so leaves instantly (§3.6); a dialog closed natively by the browser also skips EXIT (§3.10) | Instant |
| **MOVE** | An element changes position in place | `--dur-quick`, `--ease-standard` | `transform` | Segmented-control indicator (`translateX`); disclosure chevron (`rotate(180deg)`) | Instant |
| **MORPH** | An element changes size or shape | `--dur-quick`, `--ease-standard` | `block-size` through `::details-content`, plus `content-visibility` as a discrete transition so closing animates too (`motion-details`, §6.5); inside `@supports (interpolate-size: allow-keywords)` only (progressive enhancement) | Filter groups, "How we know", "View verification evidence" | Instant |
| **FOCUS** | Attention lands somewhere | `--dur-flash`, `--ease-standard` | `background-color` | `:target:not(#main)` flash: one global rule on any `:target` element except the skip link's `#main` (§6.5), from `--primary-soft` back to the element's own background | A static `--primary-soft` tint shown for as long as the element is `:target`, with no fade; `#main` is never tinted |
| **FEEDBACK** | The system acknowledges input | `--dur-instant` (hover, press, toggle colours); `--dur-quick` (pending results opacity) | `color`, `background-color`, `border-color`, `opacity` | Every interactive control; results `aria-busy` | Instant |
| **NAVIGATION** | The location changes | Anchor jumps use `scroll-behavior: smooth`. Route changes have **no animation in this pass** (§7, deferred) | `scroll` | On-this-page links, rail "See the verification record" link | `scroll-behavior: auto` (existing rule) |
| **DISCOVERY** | More is revealed on request | No animation of its own. It reuses MORPH for disclosures. Palette results appear instantly, with no stagger | — | `<details>`, palette, type-to-narrow | Same, instant |

### 6.4 Rules

- Animatable properties are only `opacity`, `transform`, `color`, `background-color`, `border-color` and `outline-color`, plus `block-size` and the discrete `content-visibility` through `::details-content`, and the discrete `display` and `overlay` for EXIT. **Never `transition: all`.** No property that triggers layout is animated on list items.
- No animation exceeds 300ms except the FOCUS fade, which never blocks interaction.
- There are no infinite animations. Skeletons are static `--surface-raised` blocks with no shimmer.
- Motion values never appear as literals in components. They appear only in `motion.css`, or as Tailwind utilities defined from its tokens.

### 6.5 Implementation

- `motion.css` defines the tokens and the responsive overrides, using `@media (max-width: 39.99rem)` to redefine tokens.
- It defines the utilities `@utility motion-enter-palette`, `motion-enter-sheet`, `motion-enter-panel`, `motion-popover` and `motion-chevron`, and the `motion-details` class. Components apply these utilities and nothing else. There is no `motion-flash` utility (below).
- `motion-details` is applied to each animated `<details>`. It is written as a plain class rule rather than an `@utility`, because it targets a pseudo-element inside a feature query:

  ```css
  @supports (interpolate-size: allow-keywords) {
    details.motion-details { interpolate-size: allow-keywords; }
    details.motion-details::details-content {
      block-size: 0;
      overflow: clip;
      transition: block-size var(--dur-quick) var(--ease-standard),
                  content-visibility var(--dur-quick) allow-discrete;
    }
    details.motion-details[open]::details-content { block-size: auto; }
  }
  ```

  Without the discrete `content-visibility` transition, the content would be hidden at the instant of closing and only opening would animate. Outside the `@supports` block, disclosures open and close instantly.
- The `:target` flash is **one global rule**, so every anchored element (`#verification`, `#facts-heading`, `#evidence-filter-notice`, the On-this-page targets) behaves identically and no component opts in. It excludes `#main`: the skip link (`<a href="#main">`, `site-header.tsx`) makes `<main id="main">` the `:target`, and without the exclusion the whole page would wash gold, and stay gold under reduced motion:

  ```css
  @keyframes ef-flash { from { background-color: var(--primary-soft); } }   /* no "to": ends on the element's own background */
  :target:not(#main) { animation: ef-flash var(--dur-flash) var(--ease-standard); }
  @media (prefers-reduced-motion: reduce) {
    :target:not(#main) { animation: none; background-color: var(--primary-soft); }
  }
  ```

  The guardrail (§14) asserts that every `:target` selector in `motion.css` carries `:not(#main)`, and smoke check 15 (§14) asserts `<main>`'s background is unchanged after the skip link. A from-only keyframe interpolates to the element's computed background, so an element with its own fill (the neutral Callout) returns to that fill instead of snapping back from `transparent`. `--primary-soft` already carries the §2.1 static fallback.
- It also holds the header's scroll-state hairline (§7 row 2) as `@utility motion-scroll-hairline`: the `@keyframes` from `border-bottom-color: transparent` to `var(--rule)`, with `animation: <name> linear both; animation-timeline: scroll(root); animation-range: 0 64px;`, all inside `@supports (animation-timeline: scroll())`. Outside that `@supports`, the hairline is always visible. `materials.css`'s `material-functional` utility does **not** apply it; `site-header.tsx` applies both `material-functional` and `motion-scroll-hairline`, so motion stays in `motion.css` and the toolbar and action bar keep a constant hairline.
- The only motion-related JavaScript is in the Dialog primitive. It waits for `transitionend` on the panel, with a fallback timeout of the panel's own computed duration plus 50ms: `parseCssTime(getComputedStyle(panel).transitionDuration.split(",")[0]) + 50`, where `parseCssTime` handles both `s` and `ms` units. It reads the computed value, not the `--dur-*` token, because the reduced-motion kill switch collapses the computed duration but does not change the token.

### 6.6 Reduced motion and related preferences

- The global reduced-motion kill switch moves **unchanged** from `globals.css` into `motion.css`, so every motion declaration lives in one file:

```css
@layer base {
  /* Honour the OS-level reduced-motion preference everywhere, including
     third-party markup we do not control. */
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

  This is the existing block from `globals.css`'s base layer, with its comment, moved as is and deleted from `globals.css`. It stays in `@layer base` so cascade order does not change.
- The same media query in `motion.css` also sets every `--dist-*` token to `0px`, and replaces the global `:target:not(#main)` animation with the static tint (§6.5); `#main` stays untinted. The scroll-state hairline is left on, because it changes colour only and moves nothing.
- Dialog exit waits: with durations at 0.01ms, `transitionend` fires immediately, and the fallback timeout (computed duration + 50ms) is about 50ms.
- `@media (prefers-reduced-transparency: reduce)` makes FUNCTIONAL fully opaque.
- `@media (forced-colors: active)`: materials fall back to `Canvas` and `CanvasText`, rules use `CanvasText`, the focus ring uses `Highlight`, and the Survey bar and fact meter get `forced-color-adjust: none` with explicit `CanvasText` borders. Their adjacent text already carries the meaning.

### 6.7 Enforcement

`tests/design-guardrails.test.mts` (§14) fails on any of the following:
- `transition-all`, arbitrary `duration-[…]`, `ease-[…]` or `delay-[…]` classes;
- `animate-` classes other than `animate-none`, in `src/**/*.tsx`;
- any CSS declaration matching `/^\s*(transition|animation)(-duration|-timing-function|-delay)?\s*:/m` in any `.css` file other than `src/styles/motion.css`. Inside `motion.css` the rule does not apply, which is where the kill switch, the keyframes, the scroll hairline and every motion utility live. A `transition` or `animation` property elsewhere fails regardless of its value, so there is no "uses a token" judgement for the test to make;
- `@keyframes` in any `.css` file other than `motion.css`;
- `transition-property` and `animation-name` are deliberately not matched. Neither produces motion without a duration, and any duration outside `motion.css` is caught by the regex above. In practice no file other than `motion.css` needs either.

---

## 7. Experimental Effect Lab

Every candidate effect from the research (Part 4), plus those this direction introduces, judged on the brief's eight axes. Decisions: **ADOPT**, **ADOPT (limited)**, **DEFER** or **REJECT**.

| # | Concept | Purpose | Implementation | Performance cost | Accessibility | Brand fit | Repetition fatigue | Final decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | FUNCTIONAL header material (0.94 alpha + 8px blur) | Shows that content scrolls under chrome | One `@utility`; opaque fallbacks | One blurred layer, which is cheap | Contrast computed against the opaque value; reduced-transparency honoured | Quiet, functional | Invisible over time | **ADOPT** (header, results toolbar, mobile action bar only; the compare tray is ELEVATED) |
| 2 | Scroll-state header hairline | Marks where chrome ends once content passes under it | `@utility motion-scroll-hairline` in `motion.css` (§6.5): `animation-timeline: scroll(root)` on `border-bottom-color`, inside `@supports`; fallback is an always-visible hairline. Applied by `site-header.tsx` only | About 0 (compositor) | No information content | Neutral | None | **ADOPT (limited)** |
| 3 | Sticky results toolbar | Keeps count, sort and gate visible | `position: sticky` | About 0 | `scroll-padding-top` prevents hidden focus | Strong (instrument feel) | None | **ADOPT** |
| 4 | Mobile sticky "Open {host}" bar | Keeps the primary action reachable on long records | Fixed bar + one `IntersectionObserver` | One observer per page | Does not cover focus (`scroll-padding-bottom`); safe-area aware | Utility | None | **ADOPT** |
| 5 | Sheet enter/exit (bottom, 40px + fade) | Shows where filters live and that they are modal | `@starting-style` + `allow-discrete` | CSS only | Native dialog semantics; instant under reduced motion | Neutral | Short, so fine | **ADOPT** |
| 6 | Palette enter/exit (6px + fade) | Makes the palette feel immediate without a hard pop | Same technique | CSS only | Same | Neutral | Fine at 220ms | **ADOPT** |
| 7 | Damped `linear()` spring easing | Natural deceleration for overlays, without bounce | A token | None | No overshoot | Neutral | Fine | **ADOPT (limited)**: ENTER only |
| 8 | Animated `<details>` height | Shows the direction content opens | `::details-content` + `interpolate-size` | CSS only, progressive | Native semantics untouched | Neutral | Fine | **ADOPT** |
| 9 | Segmented selected-indicator slide | Shows which option took effect | `transform` on one indicator element | CSS only | Selection also in `aria-checked` | Neutral | Fine | **ADOPT (limited)**: compare "All rows / Only differences" only |
| 10 | `:target:not(#main)` FOCUS flash | Confirms where an anchor jump landed | Keyframe on `background-color` | CSS only | Static tint under reduced motion; never on the skip link's `#main` | Supports provenance links | Rare, so fine | **ADOPT** |
| 11 | Fact meter, static | Evidence density at a glance | One element, gradient segments (§8 C1) | One node per record | `aria-hidden` on records; text equivalent on the record page | Strong, unique | Static, so none | **ADOPT** |
| 12 | Fact meter / Survey bar animated fill-in | Spectacle | — | Paint per frame | Delays reading | Weak | High | **REJECT** |
| 13 | Survey bar, static | Honest library-wide survey status | Server-rendered spans | About 0 | Sentence carries the numbers | Strong, the atlas core | None | **ADOPT** |
| 14 | Root cross-fade view transition on route change | Continuity between list and record | Needs the Next `experimental.viewTransition` flag or a router wrapper; unverified under static export + CSP | Snapshot cost per navigation | Fine if short | Neutral | Fine | **DEFER**: needs prototype P1 (§16) |
| 15 | Shared-element monogram + name transition | "This is what you clicked" | Depends on #14 | Per navigation | Fine | Somewhat distinctive | Fine | **DEFER**: after P1 |
| 16 | Morph search field → palette | Origin of the palette | View transition | Moderate | Fine | Somewhat distinctive | Medium | **DEFER**: a plain ENTER is enough |
| 17 | Swipe-to-dismiss sheet | Mobile expectation | Pointer handling against scroll | JS on mobile | Needs a button alternative (which exists) | Neutral | Fine | **DEFER** |
| 18 | Directional pagination slide | Next/previous orientation | View-transition types | Per page | Fine | Weak | Medium | **DEFER** (unnecessary with no route transitions) |
| 19 | Per-record FLIP reorder on filter change | Shows ranking change | JS measuring 24 rows | Layout thrash | Confusing motion | Weak | High | **REJECT** |
| 20 | Appear-on-scroll fades and slides | None; delays content | IntersectionObserver per section | Observers + paint | Delays content for everyone | Template signature | Very high | **REJECT** |
| 21 | Scroll-scrubbed transforms, parallax, micro-parallax | Spectacle | Scroll timelines or listeners | GPU / main thread | Vestibular risk | AI-template | High | **REJECT** |
| 22 | Progressive blur | Aesthetic | Stacked masked `backdrop-filter` | Several repainting blur layers | Lowers legibility | Trendy | High | **REJECT** |
| 23 | Translucent or glass content cards | None | `backdrop-filter` on content | Blur × N | Contrast risk | The banned AI-glass cliché | High | **REJECT** |
| 24 | Material transition (opaque → glass header on scroll) | Marginal | Scroll listener | Low | Contrast shifts | Trendy | Medium | **REJECT** (one constant material) |
| 25 | Typography reveal, split text, variable-font animation | Spectacle | DOM splitting or `font-variation-settings` keyframes | Repaint per frame | Splitting harms screen readers and translation | AI-template cliché | Very high | **REJECT** |
| 26 | Mask or clip-path reveals on content | Spectacle | `clip-path` keyframes | Low | Delays content | Trendy | High | **REJECT** |
| 27 | Magnetic buttons, cursor followers, pointer lighting | Toy | Pointer listeners (× 726 records for lighting) | High | Moving targets harm motor-impaired users | Very AI-SaaS | High | **REJECT** |
| 28 | 3D transforms, spatial zoom transitions | Drama | `perspective`, `scale` | Moderate | Vestibular risk | Apple-imitative | High | **REJECT** |
| 29 | Motion blur | Novelty | `filter: blur` keyframes | Filter cost | Hurts legibility | Trendy | High | **REJECT** |
| 30 | WebGL, shader or canvas backgrounds; particles; star fields | Decoration | GPU context | Large (bundle, battery) | Neutral to poor | AI-template signature | High | **REJECT** |
| 31 | Scroll storytelling (pinned narrative) | Explaining verification, in theory | Pinned sections | High | Scroll-jacking | Trendy | High | **REJECT** (static diagram on `/verification`) |
| 32 | Animated gradients, glows, gradient text | Decoration | Background keyframes | Paint | Neutral | Banned pattern | High | **REJECT** |
| 33 | Skeleton shimmer | Signals loading | Gradient keyframe | Paint | Motion for its own sake | Generic | Medium | **REJECT** (static skeleton, palette only) |
| 34 | Hover-reveal arrows and secondary info | Calm rows | Opacity on hover | Low | Hidden from touch and keyboard users | Generic | Low | **REJECT** (hover raises contrast only) |
| 35 | Rotating search placeholder (existing) | None | Interval timer | Timer | Text changes under the reader | Template | High | **REJECT** (removed) |
| 36 | Depth layering (z-tokens: content < sticky < header < overlay; `<dialog>` in the top layer) | Predictable stacking, so sticky chrome, trays and overlays never fight | Tokens in `tokens.css` (§2.4); no visual depth effects | None | Nothing is ever covered unexpectedly; focus never lands under chrome | Neutral, invisible | None | **ADOPT**, as tokens only. No parallax depth, no layered shadows |
| 37 | Expanding navigation / mega-menu | Would expose deep IA from the header | Hover/focus-opened panel | JS + layout | Hover-opened menus fail touch and are fragile for keyboard users | Template | Medium | **REJECT**: five top-level items need no menu; the palette and the Atlas Index cover deep jumps |
| 38 | Adaptive surface: filter sidebar becomes a bottom sheet below `lg` | Filters stay reachable on small screens without pushing results down | `ResourceExplorer` state + shared Dialog (§3.5) | Sheet code loads with the explorer, small | Native modal semantics, Close button, focus return | Neutral, necessary | None | **ADOPT** (§3.5) |
| 39 | Drawer transitions | Side-entering panels | Same technique as the sheet | CSS only | Fine | Neutral | Fine | **REJECT** as a separate component: there is no drawer. The mobile menu's `panel-right` and the filter `sheet-bottom` cover every need |
| 40 | Filter-result cross-fade | Soften the swap when results change | Needs view transitions around `router.push` | Snapshot per change | Must be absent under reduced motion | Neutral | Medium on rapid filtering | **DEFER** with prototype P1 (§16). Today: instant swap plus the `aria-busy` pending dim |
| 41 | Spatial UI (depth-positioned panels, z-space navigation) | Spectacle | 3D transforms, perspective | Moderate to high | Vestibular risk; disorients | Apple-imitative | High | **REJECT** |
| 42 | Responsive motion (shorter durations and distances below `sm`) | Small screens travel less distance, so motion should be shorter | Token overrides in `motion.css` (§6.2) | None | Reduced motion still wins | Neutral | Lowers fatigue | **ADOPT** (§6.2) |
| 43 | Hide-on-scroll mobile header (research §2.4) | More reading space on mobile | Scroll-direction listener toggling `transform` | Scroll listener on every page | Chrome moves under the reader's thumb; a hidden header hides the menu and palette trigger; conflicts with the sticky toolbar's `top: var(--header-h)` and with `scroll-padding-top` | Neutral | Medium (header jumps on every direction change) | **REJECT**: the header stays static and sticky. The research suggestion is declined for these reasons |

---

## 8. New proprietary interaction and component concepts

Four concepts. Each solves a real problem with data that exists, is accessible, and costs little. Each is documented here before implementation.

### C1. Fact Meter

**Problem.** "How much of this listing has been checked?" currently takes reading three evidence lines and a badge. Across 24 results that cannot be compared at a glance.

**Concept.** An 11-cell **count gauge**, one cell for each entry in `FACTS`, filled in a fixed sequence:
1. confirmed cells first, as a solid `--success-fg` fill;
2. then checked-but-unsettled cells (`unresolved` or `stale`), as a 45% `--warning-fg` fill;
3. then the rest (`not-checked` or `not-established`), as empty `--rule` cells.

**Positions do not identify facts.** The third cell is not "Licence"; it is simply the third cell counted. The facts are named elsewhere: by `CardEvidence` on records and by the Facts ledger on the record page. The gauge reads like a level on an instrument, not a score: there is no percentage, no colour ramp and no "grade". Revision 2 claimed fixed fact positions, but the one-element gradient (below) can only draw a sorted count, and the `FactMeter({ confirmed, unsettled, total })` signature carries counts, not per-fact states. The concept now says what the implementation draws.

**Data.** `factMeterCounts(resource)` (§3.11), which calls `factEvidence(resource, fact)` for each of the 11 facts. On the server it runs directly. In the browser the meter reads the precomputed `k` (confirmed) and `u` (unsettled) and the top-level `t` (`FACTS.length`) from the palette and compare indexes (§3.4, §3.6). Nothing is derived client-side, and the same listing draws the same gauge on every surface.

**Implementation.**
- `src/features/resources/components/fact-meter.tsx` renders **one element**: `<span class="fact-meter" style="--c:3; --u:1; --n:11">`.
- `materials.css` draws the gauge with one `linear-gradient` of three hard-stopped fill segments: `0 → c/n` in `--success-fg`; `c/n → (c+u)/n` in the unsettled fill; then `(c+u)/n → 100%` in `--rule`. A `repeating-linear-gradient` mask cuts the 11 cells with 2px gaps. Every cell is a fill, which is all a gradient-plus-mask can draw; there are no outlined cells.
- The unsettled fill follows the §2.1 fallback rule (static value, relative value only inside the feature query):

  ```css
  :root  { --meter-unsettled: oklch(0.82 0.120 80 / 0.45); }   /* dark static */
  .light { --meter-unsettled: oklch(0.47 0.100 70 / 0.45); }   /* light static */
  @supports (color: oklch(from red l c h)) {
    :root, .light { --meter-unsettled: oklch(from var(--warning-fg) l c h / 0.45); }
  }
  ```
- In forced colours the meter keeps `forced-color-adjust: none` and adds a 1px `CanvasText` border, so its extent stays visible. The text count remains the authority.
- One DOM node per record keeps it inside the 726-record budget.

**Accessibility.**
- On records it is `aria-hidden`, because the `CardEvidence` list beside it names the facts.
- On the record page snapshot (cell 6, §3.3) it has visible text: "{c} of {FACTS.length} facts confirmed", plus " · {u} checked, not settled" when `u > 0` (for example "3 of 11 facts confirmed · 1 checked, not settled"). Both numbers come from `factMeterCounts`; 11 is never a literal.
- In the palette the row's sr-only text gives the count.
- It never relies on colour alone: the visible count is the authority.

**Edge cases.** All-empty is the normal state for 716 listings. It renders as calm hairline cells, never in a warning colour. If `FACTS.length` changes, `--n` follows, because it is read from `FACTS.length`.

### C2. Evidence Gate

**Problem.** When a confirmed-only filter is on (for example "No credit card · confirmed"), results drop sharply. Users can read that as "the library is thin" rather than "most listings are not checked yet". The existing notice is a paragraph under the results that scrolls away.

**Concept.** A compact gate in the sticky toolbar, visible whenever a confirmed-only filter is active:

```
Shown 4  |▮▮▮▮░░░░░░░░░░░░░░░░░░░░░░░| Held back 150 · not yet checked   [What this means]
```

It is a proportional two-segment bar for shown versus held back, with both numbers in text. **The bar is drawn only when there is no text query** (below). "What this means" is `<a href="#evidence-filter-notice">`, which scrolls to and FOCUS-flashes (`:target`) the existing evidence-filter Callout. That Callout gains `id="evidence-filter-notice"` on its root (`Callout` gets an optional `id` prop, forwarded to its root `<div>`, §13); its inner `[data-testid="evidence-filter-notice"]` span and its copy stay verbatim, including "N more listings record it", which is a smoke contract. The next filter change drops the hash, which is intended.

**Data.** `results.total` and `excludedByEvidence` from `runSearch`, both existing and unchanged. **The two numbers have different bases when a text query is present.** `runSearch` computes `excludedByEvidence` with the text query removed (`{ ...effectiveQuery, q: undefined }`, `lib/search/run-search.ts` line 162), deliberately, so the held-back count does not depend on ranking. `results.total` is the text-matched total. With `q="photo"`, a bar between "2 photo matches" and "150 held back from the whole library" would tell the reader that 150 photo listings were held back, which the data does not say. So:

- **No residual text query** (`!effectiveQuery.q`, the query `runSearch` actually executed, after intent extraction): bar plus text, as drawn above. This is the predicate, not the parsed `q`: a query made only of intent phrases ("without a credit card") has a non-empty parsed `q` but `effectiveQuery.q === undefined`, and then both numbers do share a base, so the bar is honest.
- **With a residual text query** (`effectiveQuery.q` non-empty): **no bar**, text only: "Shown {total} matching “{q}” · {n} listings in the library record this fact but are not yet checked", where `{q}` is `effectiveQuery.q` (the residual terms that were actually matched, not the typed sentence). The accessible text uses the same wording. `{q}` is shown as a text node, truncated to 40 characters with "…".

`lib/` stays untouched; the distinction lives in the copy.

**Implementation.**
- `src/features/search/evidence-gate-copy.ts` (pure `.ts`, no JSX): `evidenceGateCopy({ total, heldBack, q }): { showBar: boolean; text: string; accessibleText: string }`. The explorer passes `q: effectiveQuery.q`; `showBar` is `!q?.trim()`. Plurals use `Intl.PluralRules("en")`, including verb agreement ("1 listing in the library records this fact but is not yet checked"), and counts use `formatCount`.
- `src/features/search/components/evidence-gate.tsx`, a client component inside the explorer, renders `text`, `accessibleText` (sr-only) and, only when `showBar`, two spans with inline `--w` widths. **Colours carry no status hue:** the shown segment is `--fg-muted` and the held-back segment is `--rule`. Shown listings are a filter result, not a confirmation statement, so success green (rule 1, §12.3) and gold are both wrong here, and `evidence-gate.tsx` is not an owner of either.
- `tests/evidence-gate-copy.test.mts` covers both branches and the edge cases below.

**Accessibility.** The bar is `aria-hidden`. The accessible text (for example "4 shown, 150 held back because the fact is not yet checked") is part of the toolbar's content but **not** inside the `aria-live` count paragraph, to avoid double announcements. The gate is hidden below `sm`; the count and the notice still carry the meaning.

**Edge cases** (all covered by the unit test):
- No query, `heldBack === 0`: "Nothing held back", no bar.
- No query, `total === 0`: "Shown 0 · Held back {n}", with the bar entirely in the held-back segment; the empty state below explains it.
- With a query, `heldBack === 0`: "Shown {total} matching “{q}” · nothing held back", no bar.
- With a query, `total === 0`: the same text-only sentence with "Shown 0"; the empty state explains it.

### C3. Evidence-Parity Compare (difference lens)

**Problem.** Side-by-side comparisons invite the assumption that every cell was checked to the same standard. In this library they almost never are. Spotting the real differences between two or three listings also means reading every row.

**Concept.** Quick Compare (§3.6) adds two things no generic comparison table has:

1. **Parity statement.** Above the table, one sentence compares evidence depth:
   - "Compared on unequal evidence: Krita has 3 of 11 facts confirmed; GIMP has 0." when the meter counts differ;
   - "None of these listings has a confirmed fact yet. Every value below is as recorded, not checked." when all are zero;
   - "Compared on equal evidence: each has {k} of 11 facts confirmed." when the counts are equal and non-zero.

   "11" in these strings is the index's `t`, never a literal. The statement compares `k` only; `u` affects the drawn gauge, not the sentence. The column headers carry each listing's fact meter, drawn from that entry's `k`, `u` and the index's `t`.
2. **Difference lens.** Each row whose displayed values *or* evidence reasons differ gets the word "Differs" in its row header: an `xs` uppercase kicker in `--fg` above the row label, and a 2px `--border-strong` leading rule on that `th` (`border-inline-start`), with no fill and no gold. It is ink, not FOCUS: the marker is persistent for as long as the table is shown, and FOCUS is temporary by definition (§2.4), so `compare-view.tsx` stays off the gold owner list. A segmented control, "All rows / Only differences" (URL `diff=1`), hides the identical rows. If no row differs, the control is disabled with the note "These listings match on every compared field".

**Data.** The compare index, with evidence computed at build by `factEvidence`.

**Implementation.** `compare-view.tsx`, with a pure `diffRows(entries)` in `compare-params.ts`, which is unit-tested.

**Accessibility.**
- "Differs" is real text in the `th`, so it is announced with the row.
- Hidden rows are removed from the DOM, not just visually hidden, so screen-reader table navigation matches what is seen.
- The segmented control is a radio group.

### C4. Atlas Index

**Problem.** 72 subjects in 8 groups are currently shown as 8 equal cards with no counts. A reader cannot see where the library is deep or thin, and cannot jump to a subject by typing.

**Concept.** A subject index set like the back of an atlas:
- 8 group columns (4 at `lg`, 2 at `sm`, 1 on mobile). Each has a serif group title.
- Each subject is a row: name, dotted leader, then live count in `tnum`.
- Subjects with 0 listings stay visible but muted, with "0", because the index is honest about empty territory. They are not links.
- On `/categories`, a "Find a subject" input narrows rows across all groups using `normalizeText` and `containsTerm`. Groups with no remaining rows collapse, and a polite live count reads "{n} subjects".

**Data.** `categoryGroups`, `getCategoriesInGroup`, and per-category counts from `computeFacets(resources, {})`. A subject in two groups (for example Books) appears in both, as in a real index, and links to its single canonical page.

**Implementation.** `src/features/categories/components/atlas-index.tsx` (server) and `atlas-index-filter.tsx` (client island, `/categories` only). Without JS, the full index renders and the filter input is not rendered.

**Accessibility.** Each group is a `<section>` with an `h3` and a `<ul>`. Rows are links whose accessible name is "{subject}, {n} listings". The leader is `aria-hidden`.

---

## 9. Anti-trend filter results

Each adopted element is run through three tests:

- **D:** is it driven by real data?
- **T:** does it serve a real task?
- **G:** would a generic AI site generator produce it identically?

An element must score D or T as yes, and G as no.

| Element | Trend it could resemble | D | T | G | Result |
| --- | --- | --- | --- | --- | --- |
| Library introduction with live census | "Big number" hero | Yes | Yes (orients the visitor) | No: generators say "thousands", and these numbers are exact, plain and include the 0 verified | **PASS** |
| Legend (M1) | Feature-icon row | Yes | Yes | No | **PASS** |
| Survey bar (M2) | Progress-bar stat widget | Yes | Yes | No: it shows a 99%-empty bar on purpose | **PASS** |
| Coordinates line (M3) | Tag chips | Yes | Yes | No: a single quiet line, not chips | **PASS** |
| Ledger + record key (M4) | "Spec sheet" aesthetic | Yes | Yes | Partly | **PASS**, with the condition that the slug is shown only as a kicker and never styled as a fake serial number |
| Running heads (M5) | Editorial-template kickers | No | Yes | Partly | **PASS with limit**: at most one kicker per section, never above every block |
| Ruled, not boxed (M6) | Minimal template | No | Yes (density at 726 records) | No | **PASS** |
| Resource Record | Generic SaaS card | Yes | Yes | No | **PASS** |
| Provenance Rail | Timeline / stepper widget | Yes | Yes | Partly: the stepper visual is common | **PASS**: stations are real fields, markers are neutral and identical (no "done" ticks), with no progress percentage and no "complete" state |
| Resource Snapshot | Stats-card row | Yes | Yes | Partly | **PASS**: no big numbers, no icons per cell, evidence word in every cell |
| Fact Meter (C1) | Rating bars / progress rings | Yes | Yes | No: no score, no percentage, no colour ramp; a plain count of checked facts beside a named list | **PASS**, as long as it is never labelled a score or rating |
| Evidence Gate (C2) | Filter "result count" pill | Yes | Yes | No | **PASS**, with the condition that the proportional bar is drawn only when both numbers share a base (no text query) |
| Evidence-Parity Compare (C3) | Comparison table with a "Winner" | Yes | Yes | No: there is no winner and no recommendation | **PASS** |
| Atlas Index (C4) | Bento category grid | Yes | Yes | No | **PASS** |
| Command palette | Every 2025 dev-tool site | Yes (index) | Yes (726 records) | Partly | **PASS**: no AI sparkle, no "Ask AI", no fake suggestions; data-backed only |
| Mobile filter sheet | Standard | No | Yes | Partly | **PASS** (a necessary pattern) |
| FUNCTIONAL header blur | Glassmorphism | No | Yes (layer legibility) | Partly | **PASS with limit**: one material, three surfaces, 0.94 alpha |
| Serif display type | "Editorial luxury" template | No | Yes (archive voice) | Partly | **PASS**: no italic flourishes, no oversized pull quotes, no gradient |
| Gold accent | "Luxury dark template" | No | Yes (brand continuity) | Yes, if overused | **PASS with limit**: the closed five-role list in §2.1, enforced by a file owner list in the guardrail test |
| Compare tray | Floating glass action bar | No | Yes (selection state) | Partly | **PASS**: opaque ELEVATED, no blur, no pill, appears only with a selection |
| Dark default | Dark-mode SaaS | No | Yes (existing product decision) | Partly | **PASS**: warm neutrals, not blue-black |
| Monograms | Generic avatars | Yes (`logo.text`) | Yes | No | **PASS** |
| Effects marked REJECT in §7 | Template motion vocabulary | — | — | Yes | **REJECTED** |

---

## 10. AI-slop review per major section

| Section | What an AI website generator would produce | What this direction does instead | Residual risk and guard | Verdict |
| --- | --- | --- | --- | --- |
| Hero | Centred purple/blue gradient headline, "Discover thousands of free tools", glowing search bar, floating glass cards, particles, "Trusted by 10,000+ users" | Left-aligned serif sentence with exact build-time counts; plain search form; the evidence legend; an honest survey bar showing 0 verified | Pressure to make the numbers bigger or brighter. Guard: numbers stay in text colour and weight | **PASS** |
| Homepage sections | Uniform bento grid of icon cards, fake testimonials, "How it works" 1-2-3 with icons | Unequal editorial sections led by the Atlas Index; index lists with leaders; records as ruled rows; no testimonials or metrics | Re-introducing icon tiles for audiences. Guard: the icon rule (§2.6) and the radius-ceiling guardrail (§2.5) | **PASS** |
| Resource records | Glass cards with hover glow, star ratings, "Popular" badges, emoji category icons | Ruled records, coordinates line, evidence lines, Catch line, fact meter; no ratings, which do not exist | Badge creep. Guard: the compact snapshot allows two tokens maximum | **PASS** |
| Record page | Hero banner with screenshot carousel, "Get started" CTA band, feature cards with checkmarks | Catalogue record: key, serif name, snapshot instrument, provenance rail, ledger facts, connections | Green ticks on features. Guard: features stay plain bullets (existing rule: green means confirmed) | **PASS** |
| Search and filters | Animated filter chips, AI-sparkle "smart search" badge, shimmer skeletons | Two labelled filter regions (confirmed vs recorded), Evidence Gate, sticky toolbar, inferred filters shown as removable tokens with "set a filter automatically" | Calling inferred filters "AI". Guard: copy rule; there is no "AI" label on search | **PASS** |
| Command palette | "Ask AI anything" with a sparkle icon and suggested prompts | Jump list over a real index; empty state lists real pages; always hands off to full search | Adding "recent searches" (needs storage). Guard: §12 invariant, no storage beyond theme | **PASS** |
| Quick Compare | Feature matrix with a "Best choice" ribbon and score | Evidence-parity statement, difference lens, evidence in every cell, no winner | — | **PASS** |
| Header and footer | Glass pill navbar floating with glow; social icon row | Full-width FUNCTIONAL bar with hairline; text nav; text footer with colophon | — | **PASS** |
| Colour | Purple/cyan gradients, neon glows | Warm OKLCH neutrals, gold in a closed list of five roles, three semantic hues, green only for confirmed evidence | Gold or green spreading. Guard: the gold owner list and the success owner list in `design-guardrails.test.mts` | **PASS** |
| Typography | Giant gradient sans headline with kinetic reveal | Static serif display, Inter UI, tabular figures, no animation | — | **PASS** |
| Motion | Scroll reveals everywhere, parallax, cursor effects | Eight categories, all state-driven, ≤ 300ms, reduced-motion complete | Later "polish" adding appear-on-scroll. Guard: the guardrail test bans `animate-` classes | **PASS** |
| Iconography and copy | Icon beside every label, emoji, "supercharge your workflow" | Icons in four functional roles only; zero emoji, enforced by test; plain sentence-case copy | — | **PASS** |

---

## 11. Smoke-test contract preservation

None of the 61 existing checks needs to change. New checks are additive (§14).

| Contract (research §1.9) | How it survives |
| --- | --- |
| `button[aria-label^="Switch to"]` hydration signal | `ThemeToggle` unchanged; it moves position only |
| `main article`, `h3 a[href*="/resources/"]` | `ResourceRecord` renders `<article>` with an `h3` link |
| `ul[aria-label="What has been checked"]`, `[data-evidence-group]`, `[data-fact]`, `[data-evidence]` | `CardEvidence` is reused unchanged in logic; only classes change |
| Free-status badge `[data-fact="freeStatus"][data-evidence]` on cards (`cardAudit` reads the **first** `[data-fact="freeStatus"]` in each article) | Compact snapshot token keeps the wrapper and attributes, and is the first `[data-fact]` in DOM order, because `data-zone="main"` carries none and the snapshot opens `data-zone="facts"` (§3.1) |
| `[data-fact="openSource"]` chip with `data-evidence` | Compact snapshot token keeps it, with the same condition |
| `header [data-fact="freeStatus"]` evidence on detail pages | The full snapshot's free-status cell sits inside the record `<header>` with the attributes. The site header contains no `data-fact` |
| `#facts-heading ~ div dl > div` with `dt`/`dd` | Unchanged structure; the leader lives inside `dt` |
| `#facts-heading ~ div [data-evidence="confirmed"]` count | The rail and snapshot are outside that subtree |
| `details` with "View verification evidence", closed, external source links | `VerificationPanel` inner markup unchanged; only its root changes from `Card` to a CONTENT `<section>` (§3.9 item 4) |
| `h2` "Verification" whose parent holds the panel | The `h2` stays a direct child of the panel root, now `<section id="verification">`, so `h2.parentElement.innerText` still holds the whole panel. The rail's "Last checked" sits in the aside, outside that parent, so `!includes("Last checked")` is unaffected |
| `[data-testid="evidence-filter-notice"]` with "N more listings record it" | Inner span and copy kept verbatim; the Callout root gains `id="evidence-filter-notice"` for the Evidence Gate's link. The Evidence Gate is additional |
| `[aria-label="Active filters"] a` incl. "No credit card · confirmed" | `ActiveFilters` restyled only |
| `p[aria-live="polite"]` whose first number is the total | Toolbar count copy starts with the total |
| `input[name="openSource"]` clickable on desktop | The sheet's `FilterPanel` mounts only while `sheetOpen`, and the sidebar's only while it is not; at 1366px the sheet never opens, so the sidebar is the only form (§3.5) |
| Inferred-filter notice "set a filter automatically" | The Callout copy is unchanged; only its tone (`info` → `neutral`) and its `bolt` icon change |
| Copy: "Listed as a free alternative to", "Nothing matched", "Browse by category" | Unchanged strings. **"Browse by category" must remain on the homepage**: the Atlas Index `h2` reads "Browse by category", with the kicker "Index" |
| `[data-testid="collection-evidence-note"]` text | Kept verbatim |
| Comparison tables `table tbody tr`, `th a`, cells `[data-fact]` with `[data-evidence]` | `AlternativeComparison` unchanged in markup |
| Client navigation sets no reload (`__noReload`) | `next/link` everywhere; palette uses `router.push` |
| No horizontal overflow at tablet and mobile | Container queries, wrapping coordinates, scroll region for tables |
| Mobile evidence ≤ 3 lines and ≤ 90px tall | `CardEvidence` logic unchanged; `xs` line height 1.125rem, so 3 lines is about 56px |
| Mobile menu `[role="dialog"][aria-modal="true"]`, focus inside, Escape closes, focus returns to "Open menu", dialog absent after close | Dialog primitive: explicit attributes, mount-while-open, focus restore (§3.10). The smoke test opens the menu with an untrusted `el.click()`, so its Escape produces a non-cancelable `cancel`; the primitive's `close` listener brings React state back in line and unmounts without EXIT, so the check passes without relying on `preventDefault` |
| Visible skip link on first Tab | `SkipLink` unchanged |
| No-JS: `/resources/` static list; record and category pages complete; record body contains "Limitations" | `StaticLibrary` keeps the full list; the sub-label keeps "Limitations" |
| 404 `h1` matches /does not exist/ | Copy kept |
| No CSP violations, no failed requests | No inline handlers; new JSON routes are same-origin and exported; no runtime `<style>` |

---

## 12. Error handling, validation and invariants

### 12.1 Failure handling per operation

Production code does **no logging**. The site has no telemetry, and the console stays clean. Where noted, `console.warn` runs only when `process.env.NODE_ENV !== "production"`.

| Operation | Failure conditions | Recoverable? | What the user receives | Logging |
| --- | --- | --- | --- | --- |
| Fetch `palette-index.json` | Network error, non-2xx, invalid JSON, zod parse failure, `v !== 1` | Yes | In the listbox: the row "The jump list could not load." with a "Try again" button. The static "Go to" pages, which are bundled and not fetched, and the "Search the full library for …" row keep working. The cached promise is cleared, so the next open retries | Dev warn with the reason |
| Fetch `compare-index.json` | Same | Yes | The compare page shows "The comparison data could not load." with "Try again", plus plain links to each requested record (built from the validated slugs), so the visitor always has a path | Dev warn |
| `dialog.showModal()` | `InvalidStateError` (already open) or element disconnected | Yes | Guarded with `if (!el.open)`. On a thrown error the dialog unmounts. The palette trigger then navigates with `router.push("/resources/")`, the same destination as its no-JS `Link`. The menu and filter sheet buttons do nothing further, because the desktop alternatives exist and mobile retries on the next tap | Dev warn |
| Dialog exit wait | `transitionend` never fires | Yes | The fallback timeout unmounts anyway | None |
| Dialog closed natively by the browser | Non-cancelable `cancel` (no history-action activation), Android back, any other close request | Yes | The `close` listener calls `onRequestClose("escape")`; the primitive skips EXIT, unmounts and restores focus (§3.10). The palette's next ⌘K opens it rather than toggling a hidden dialog shut | None |
| `ResizeObserver` unavailable (results toolbar) | Old browser | Yes | `data-wrapped` is never set; `--toolbar-h` stays 48px. A wrapped toolbar may then cover up to 40px of an anchored target; no content is lost | None |
| Platform detection for `Kbd` | APIs unavailable | Yes | Shows "Ctrl K" | None |
| `IntersectionObserver` unavailable | Old browser | Yes | Mobile action bar not shown (the header button remains); no "current section" marker in "On this page" | None |
| "Compare with…" on record pages without JS | JS disabled or failed | Yes | The link is not rendered (`compare-link.tsx` returns `null` until hydrated). A shared `/compare/` URL opened without JS shows the `<noscript>` notice with a link to `/resources/` (§3.6) | None |
| Palette navigation removes the previously focused node | Route change | Yes | Focus moves to `#main` instead of the stale element (§3.4, §3.10) | None |
| Popover, anchor positioning, `@starting-style`, `interpolate-size`, `animation-timeline` unsupported | Older engines | Yes | CSS fallbacks: popover fixed at the bottom inset; no animation; static hairline | None |
| `router.push` from the palette | Navigation error | Yes | Next's own error boundary (`error.tsx`) handles it | Existing |
| Census at build | Inconsistent segments (impossible if lib is correct) | Fatal at test time | `tests/census.test.mts` fails CI-equivalent `npm test` | Test output |
| Font download at build (`next/font/google`) | Network failure | Fatal at build (existing behaviour) | Build fails; nothing is shipped with remote fonts | Build output |
| JSON index routes at build | Repository throws | Fatal at build | Build fails | Build output |

### 12.2 Validation of external inputs

| Input | Required | Type and limits | On failure |
| --- | --- | --- | --- |
| `/compare/?r=` | Optional | Comma-separated and/or repeated values. Each value is trimmed and lower-cased, must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`, and be ≤ 100 chars. Duplicates are removed, first occurrence wins. At most 3 are kept | Invalid values are dropped silently, matching `lib/search/params` behaviour. Valid but unknown slugs (absent from the index) are dropped with the notice "{n} listing(s) in this link were not found and were left out". More than 3: the first 3 are kept, with the notice "Only the first 3 are compared". Fewer than 2 valid: the picker empty state "Pick two or three listings to compare", with any 1 valid slug pre-selected |
| `/compare/?diff=` | Optional | `"1"` means only differences; anything else means all rows | Treated as all rows |
| Palette query | Optional | Text, `maxLength={100}`, trimmed, normalised with `normalizeText`. Rendered only as text nodes; highlights use a case-insensitive match on the raw query, and if it is not found there is no highlight | Over-length input is prevented by `maxLength`. Empty shows "Go to" |
| Subject narrow / Find a subject inputs | Optional | Text, `maxLength={60}`, same normalisation | Empty shows everything |
| `palette-index.json` / `compare-index.json` | Required by their features | zod schemas: `v: z.literal(1)`; `t: z.number().int().positive()`; arrays of strict objects (unknown keys stripped); strings non-empty; counts (`count`, `k`, `u`) `z.number().int().nonnegative()`, with a `.refine` that `k + u ≤ t` per entry; in the compare index each fact's evidence is `{ state: z.enum([...3 EvidenceState values]), reason: z.enum([...5 EvidenceReason values]) }` (§3.6) | Treated as a load failure (§12.1) |
| Existing `/resources` search params | Unchanged | `lib/search/params` (untouched) | Unchanged |

### 12.3 Invariants and their owners

| Invariant | Owner | Why that layer |
| --- | --- | --- |
| A fact's evidence state comes only from `factEvidence` | `src/lib/resources/evidence.ts` (unchanged). The JSON routes call it at build; components consume its output | One source of truth. The smoke test audits pages against the manifest, which uses the same function |
| Success colour means confirmed evidence only (a Confirmed fact, or an effective status of Verified) | `STYLE` in `evidence.tsx`, exported through `EvidenceMark`, plus the `success` entry of the tone maps in `badge.tsx` and `callout.tsx`. The guardrail test enforces it with two rules, listed after this table | Colour meaning is a trust contract, and a grep test is cheap and total |
| Gold appears only in the five roles of §2.1 | The gold owner list in §2.1, enforced by the guardrail test | Gold is the brand accent; letting it spread is how a restrained palette becomes a template |
| No count is hard-coded in copy | `libraryCensus` and repository reads. The guardrail test fails on the count-literal regex of §14 in `src/features/home/**` and `src/app/page.tsx`, and a smoke check asserts the homepage `h1` contains `formatCount(manifest.count)` | Build-time data is the only truthful source |
| Text and UI contrast meet WCAG AA in both themes | `tests/tokens.test.mts` | Tokens are the only place colour is defined |
| Motion uses tokens only and honours reduced motion | `motion.css` plus the guardrail test | Centralisation is what makes reduced motion complete |
| Only one translucent material exists | `materials.css`. The guardrail test fails on `backdrop-blur` classes or `backdrop-filter` declarations outside it | Blur creep is the most common slop regression |
| Nothing is stored client-side except the theme | The guardrail test fails on `localStorage` or `sessionStorage` outside `components/layout/theme.tsx` | It keeps the `/privacy` statement true without editing it |
| Zero emoji | Guardrail test (§2.6) | Total and automatic |
| At most 3 items in a comparison | `compare-params.ts`: the URL parser and the `compareSelection` reducer (state), both pure and unit-tested | Two entry points, one module, one rule each |
| Every focusable control shows a visible focus indicator (WCAG 2.4.7) | The global `:focus-visible` outline in `globals.css`, plus the guardrail rule that bans `outline-none` and `outline-hidden` outside a three-entry allow-list (§14), plus smoke check 13 | Suppression is a one-class regression that no visual review reliably catches; a grep and a computed-style check do |
| The serif appears only at the editorial sites of §2.2 | `--font-display` is the Inter stack; `font-serif` is opt-in; the guardrail owner list for `font-serif` (§14) | An alias would silently restyle every existing `font-display` usage |
| check-circle, help-circle, clock and minus-circle mean only the Legend's evidence reasons | `EvidenceMark` in `evidence.tsx`; the reserved-glyph guardrail rules (§2.6, §14) | The Legend can only be the single key if no other surface reuses its symbols |
| No geographic or region claims | Design review. There is no data field that could feed one | Cannot be enforced by code, because nothing exists to misuse |

**Success-colour guardrail, rule 1 (classes and tokens).** `/\b(text|bg|border|fill|stroke)-success\b|--success/` may appear only in:

- `src/features/resources/components/evidence.tsx` (`STYLE`, `EvidenceMark`);
- `src/components/ui/badge.tsx` and `src/components/ui/callout.tsx` (tone maps);
- `src/features/resources/components/survey-bar.tsx` (segment fills);
- `src/styles/tokens.css` (the `:root`/`.dark` and `.light` token blocks **and the whole `@theme inline` block**, including `--color-success: var(--success)` and its siblings) and `src/styles/materials.css` (fact-meter cells are drawn there);
- `src/features/tools/implementations/**` (a tool's own pass/fail result, such as the contrast checker's "Pass").

`src/app/globals.css` is deliberately **not** an owner. Today it holds the token blocks and `@theme inline`, which reference `--success*`; under this work all of them move to `tokens.css` (§13), so after the move `globals.css` declares no colour token and references no `--success*`, `--warning*`, `--danger*` or `--info*` custom property. Rule 1 therefore passes on day one, and a status token reintroduced into `globals.css` fails it.

**Rule 2 (tones).** A literal `tone="success"` may appear only in `src/features/tools/implementations/**`. A tone taken from a definition (`tone={….tone}` or `tone={definition.tone}`) may appear only in:

- `status-badges.tsx` (`FreeStatusBadge` already gates it on confirmed evidence, in both its `"badge"` and `"token"` variants; `VerificationBadge` uses `effectiveVerification`);
- `src/app/resources/[slug]/page.tsx` (the status Callout, gated so only an unconfirmed success is muted: `tone={status.tone === "success" && !confirmed ? "neutral" : status.tone}`; cautions keep their tone);
- `src/app/verification/page.tsx` (the verification-status definitions, which are the legend of real verification states).

`resource-snapshot.tsx` is **deliberately not a tone owner**. Its compact tokens are `FreeStatusBadge` and `OpenSourceBadge` with `variant="token"` (§3.3), so the first `[data-fact]` in every record, a smoke contract, has exactly one owner for its tone and evidence attributes.

**Conversions this requires** (each file is in §13 Modify):

| File | Today | After |
| --- | --- | --- |
| `features/resources/components/verification-panel.tsx` | `ROW_STATE.confirmed` uses `text-success-fg` | Row icons render through `EvidenceMark` (`confirmed`, `unresolved`, `not-checked`); `ROW_STATE` keeps labels only |
| `features/search/components/filter-panel.tsx` | `check-circle` in `text-success-fg` before "Confirmed only" | `<EvidenceMark reason="confirmed" size={12} />` |
| `app/free-status/page.tsx` | `Badge tone={status.tone}` on definitions; green `check` icons on the principles list | `tone="neutral"` (a free-status value is a classification, not evidence); principle icons removed (§2.6) |
| `app/privacy/page.tsx` | `Callout tone="success"` "The short version" | `tone="neutral"` |
| `app/tools/page.tsx` | `Callout tone="success"` "Why these run locally" | `tone="neutral"` |
| `app/tools/[slug]/page.tsx` | `Badge tone="success"` (lock) | `tone="neutral"` |
| `features/tools/components/tool-card.tsx` | `Badge tone="success"` "Runs in your browser" | `tone="neutral"` |
| `features/tools/components/tool-privacy.tsx` | `tone={local ? "success" : "warning"}` | `tone={local ? "neutral" : "warning"}`. The warning stays: data leaving the device is a caution |
| `features/community/components/submit-form.tsx`, `report-form.tsx` | `Callout tone="success" icon="check-circle"` "Ready to file" | `tone="neutral"` and `icon={null}` (reserved glyph, §2.6), keeping `assertive` and the copy |
| `features/tools/components/tool-card.tsx`, `app/tools/[slug]/page.tsx` | "Planned" `Badge icon="clock"` | No icon (reserved glyph, §2.6); the word carries it |
| `app/resources/[slug]/page.tsx` | status Callout `tone={status.tone} icon={status.icon}` | `tone={status.tone === "success" && !confirmed ? "neutral" : status.tone}` and `icon={status.caveat && (status.tone === "warning" \|\| status.tone === "danger") ? "alert-triangle" : null}` (§2.6). `warning` (`PERSONAL_FREE`, `LIMITED_FREE`) and `danger` (`TRIAL`) cautions keep their tone whether or not confirmed, and show alert-triangle; no status renders `status.icon`. The header's separate `FreeStatusBadge`/`VerificationBadge`/open-source `Badge` row is replaced by the snapshot (§3.3). The limitations empty-state icon becomes an `EvidenceMark` with `limitationsEvidence.reason` |
| `features/resources/components/status-badges.tsx` | `FreeStatusBadge` and `VerificationBadge` pass `icon={definition.icon}`; `OpenSourceBadge` is `tone="primary"` with `icon="repo"` and no evidence attributes | No `icon` prop: word-only (§2.6). Tone gating unchanged. `FreeStatusBadge` and `OpenSourceBadge` gain `variant?: "badge" \| "token"`; `"token"` uses `Badge appearance="ledger"` and carries the `data-fact`/`data-evidence` wrapper (§3.3) |
| `features/resources/components/verification-panel.tsx` (summary) | `<Icon name={verification.icon} />` before the status label | Icon removed; the label stays |
| `features/search/components/resource-explorer.tsx` | evidence-filter Callout `icon="check-circle"`; inferred Callout `icon="bolt"` | Both `icon={null}`; copy, `data-testid` and the new `id` unchanged |
| `app/verification/page.tsx`, `app/free-status/page.tsx` | definition Badges `icon={status.icon}` | No `icon` prop: word-only. On `/verification` the full Legend is the only place these glyphs appear |

---

## 13. Files

**Create**
- `src/styles/tokens.css`, `src/styles/materials.css`, `src/styles/motion.css`
- `src/components/ui/dialog.tsx`, `src/components/ui/kbd.tsx`, `src/components/ui/segmented-control.tsx`
- `src/features/resources/components/resource-record.tsx`, `resource-snapshot.tsx`, `provenance-rail.tsx`, `fact-meter.tsx`, `coordinates-line.tsx`, `legend.tsx`, `survey-bar.tsx`, `on-this-page.tsx` (client), `mobile-action-bar.tsx` (client)
- `src/features/home/census.ts`
- `src/features/categories/components/atlas-index.tsx`, `atlas-index-filter.tsx`
- `src/features/search/components/evidence-gate.tsx`, `filter-sheet.tsx`, `results-toolbar.tsx`
- `src/features/search/evidence-gate-copy.ts` (pure, §8 C2)
- `src/features/palette/build-palette-index.ts` (pure, §3.4), `palette-index-schema.ts`, `palette-search.ts`, `palette-trigger.tsx`, `command-palette.tsx`
- `src/features/compare/compare-params.ts`, `compare-index-schema.ts`, `compare-view.tsx`, `compare-tray.tsx`, `compare-toggle.tsx`, `compare-link.tsx` (all in the separable final PR, §3.6)
- `src/app/palette-index.json/route.ts`, `src/app/compare-index.json/route.ts`, `src/app/compare/page.tsx`
- `src/features/resources/fact-meter-counts.ts`
- `tests/census.test.mts`, `tests/palette-search.test.mts`, `tests/compare-params.test.mts`, `tests/tokens.test.mts`, `tests/design-guardrails.test.mts`, `tests/fact-meter.test.mts`, `tests/evidence-gate-copy.test.mts`

Pure helpers that tests import are `.ts` files with no JSX (`census.ts` with `libraryCensus` and `surveyByGroup`, `build-palette-index.ts`, `palette-search.ts`, `compare-params.ts` with `compareSelection` and `diffRows`, `fact-meter-counts.ts`, `evidence-gate-copy.ts`): the test runner relies on Node's type stripping, which does not compile JSX.

**Modify**
- `src/app/globals.css`: imports the three style files; **moves** the `:root`/`.dark` and `.light` token blocks **and the whole `@theme inline` block** (colour mappings, `--font-*`, `--shadow-*`, `--container-*`) to `src/styles/tokens.css`, unchanged in structure (Tailwind v4 processes `@theme` inside a locally imported file; `tokens.test.mts` already parses `tokens.css`, so values and mappings stay in one file); keeps `@import "tailwindcss"` and `@custom-variant dark`; deletes `hero-grid`; replaces the heading font rule with `h1, .editorial h2 { font-family: var(--font-serif) }` (§2.2); in the moved `@theme inline` block, `--font-display` becomes the Inter stack, `--font-serif` is added, and `--radius-xs/sm/md` override Tailwind's defaults (§2.5); every non-tool `.tsx` with `rounded-md`, `rounded-lg` or `rounded-xl` is converted by the §2.5 mapping; **moves** the reduced-motion kill switch to `motion.css` (§6.6); adds `@utility link-inline` and the global checkbox/radio `accent-color: var(--primary)` (§2.1). After this work `globals.css` declares no colour token and references no `--success*`, `--warning*`, `--danger*` or `--info*` custom property (success rule 1, §12.3).
- `src/app/layout.tsx`: fonts (Inter with `opsz`; Source Serif 4 with `variable: "--font-source-serif"`; Manrope removed, with its class on `<html>`) and `themeColor`. `<main id="main" tabIndex={-1} className="flex-1 outline-none">` keeps `outline-none`: `#main` is a programmatic focus target only (skip link, palette navigation), and it is on the §14 allow-list.
- `src/app/page.tsx`: census, new section composition.
- `src/features/home/components/hero.tsx`: rewritten as the Library introduction.
- `src/components/layout/site-header.tsx` (FUNCTIONAL + scroll hairline), `nav-links.tsx` (current underline), `mobile-nav.tsx` (onto Dialog, no nav icons), `site-footer.tsx`, `brand.tsx` (EF tile removed).
- `src/components/ui/layout.tsx`: `Section` gains `kicker` and `variant`.
- `button.tsx`, `badge.tsx` and `callout.tsx` (`primary` and `info` tones map to neutral; **`Badge` end state**, `appearance?: "badge" | "ledger"` with default `"badge"`: `rounded-xs`, a 1px border, and for `neutral` (and therefore `primary` and `info`) a `--border` edge, `--surface` fill and `--fg-muted` text; `success`, `warning` and `danger` keep the tone map's `-soft` fill, `-fg` text and `/30` border; `"ledger"` is the same anatomy with `bg-transparent` for neutral, used only by the `variant="token"` badges (§3.3); `Chip` becomes `rounded-xs`; `Callout` gains an optional `id` prop forwarded to its root, for `#evidence-filter-notice`, §8 C2, and its `icon` prop widens to `IconName | null`, where `null` renders no icon and `undefined` keeps the tone default, §2.6), `card.tsx` (`focus-within:border-primary/50` removed; restyled per §5 M6), `empty-state.tsx` (icon disc removed), `field.tsx` (`focus:border-primary` **and** `focus:outline-none` removed, so the global outline applies, §2.1; `accent-primary` removed in favour of the global rule), `skeleton.tsx`: tokens, radii, states.
- `src/components/ui/layout.tsx`: besides the `Section` props, `PageHeader`'s `h1` and the editorial `Section` `h2` get `font-serif` (§2.2).
- Every file that renders a page `h1` with `font-display` today replaces it with `font-serif` on that `h1` only (§2.2); on `/about` and `/verification` the section `h2`s do the same. No other `font-display` class is edited.
- `src/features/resources/components/evidence.tsx`: export `EvidenceMark`; replace the comment glyph; restyle; inline link to `link-inline`.
- `status-badges.tsx` (`OpenSourceBadge` neutral; `FreeStatusBadge` and `VerificationBadge` word-only, §2.6; `FreeStatusBadge` and `OpenSourceBadge` gain `variant="token"`, the only tone source for the compact snapshot, §3.3, §12.3), `resource-logo.tsx`, `resource-facts.tsx` (ledger; `link-inline`), `verification-panel.tsx` (root `Card` → CONTENT `<section id="verification" aria-labelledby="verification-heading">` with the `h2` as a direct child; summary `verification.icon` removed; row icons through `EvidenceMark`; awaiting-sign-off note to neutral CONTENT; `link-inline`; inner markup and copy otherwise unchanged), `alternative-comparison.tsx` (styling only).
- `src/features/search/components/resource-explorer.tsx` (owns `sheetOpen` and `useTransition`; "Results for" in `--fg`; inferred Callout neutral with `icon={null}`; evidence-filter Callout `icon={null}` and `id="evidence-filter-notice"`; passes `effectiveQuery.q` to the Evidence Gate; `useReducer(compareSelection, [])` in the compare PR), `filter-panel.tsx` (`onNavigate` and `isPending` props, its own `useTransition` removed; `useId`; in-panel mobile toggle removed; `EvidenceMark` in the "Confirmed only" note; `accent-primary` removed), `active-filters.tsx` (no `bolt`; "Inferred ·" prefix; `--radius-xs` tokens), `search-box.tsx` (fixed placeholder, rotation removed, suggestions as text links; wrapper `focus-within:border-primary` replaced by the `has-[input:focus-visible]` outline in `--focus`, inner input keeps `outline-none`, §2.1), `sort-select.tsx` (`onNavigate` and `isPending` props, its own `useTransition` removed; `focus:border-primary` **and** `focus:outline-none` removed; `max-width: 9rem` below `sm`), `static-library.tsx`, `pagination.tsx`.
- `src/features/collections/components/collection-card.tsx` (becomes the editorial collection row of §4.2; no `Card`; its name uses `font-serif`).
- `src/features/tools/components/tool-card.tsx`, `tool-privacy.tsx`; `src/features/community/components/submit-form.tsx`, `report-form.tsx` (success and info tones to neutral; primary-styled anchors use `buttonClasses({ variant: "primary" })`).
- Pages: `src/app/resources/[slug]/page.tsx`, `categories/page.tsx`, `categories/[slug]/page.tsx`, `collections/**`, `for/[audience]/page.tsx`, `alternatives/**`, `tools/page.tsx`, `tools/[slug]/page.tsx`, `verification/page.tsx`, `free-status/page.tsx`, `about/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `submit/page.tsx`, `report/page.tsx`, `not-found.tsx`, `error.tsx`.
- `scripts/browser-smoke.mjs`: additive checks only (§14).

**Delete**
- `src/features/resources/components/resource-card.tsx`.
- `src/features/categories/components/category-cards.tsx`. Its only importers at base SHA are `src/app/page.tsx` (`CategoryGroupCard`) and `src/app/categories/page.tsx` (`CategoryLink`), and the Atlas Index replaces both uses (§4.1–§4.3, C4). The implementer confirms with a search that no importer remains before deleting; `typecheck` fails if one does.

**Untouched (guarded):** `src/lib/**`, `src/data/**`, `src/types/**`, `src/config/verification.ts`, `src/config/maintainers.ts`, `.github/**`, CODEOWNERS, `scripts/csp.mjs`, `scripts/build-static.mjs`, and all `.github/scripts`. Other `src/config/*.ts` files are read only; no edits are planned.

---

## 14. Testability

**Unit tests** (Node test runner, `tests/**/*.test.mts`, no DOM):

| Test | Covers |
| --- | --- |
| `census.test.mts` | `libraryCensus`: counts against fixtures; survey segments are exclusive and sum to `listings`; zero and one listing; a stale verification is not counted as verified. `surveyByGroup`: one row per `categoryGroups` entry in config order; membership by primary `category` only (a subcategory does not count); a listing whose category sits in two groups counts in both rows; `verified + partiallyVerified ≤ listings` per row; the same staleness rule as `libraryCensus` |
| `palette-search.test.mts` | Scoring order, multi-term AND, normalisation of diacritics, deterministic ties, group caps, 100-character cap, the handoff row always last; the palette-index schema accepts a valid index and rejects `k + u > t`, a negative `u` and `v !== 1`; `buildPaletteIndex` called with the real seed data (§3.4 Imports) produces an index that the schema accepts, with `t === FACTS.length`, `k + u ≤ t` for every entry, one resource entry per listable resource, and one subject entry per subject whose `g` is its first containing group in `categoryGroups` order (checked for `books`) |
| `evidence-gate-copy.test.mts` | `evidenceGateCopy`: no query (bar shown; text "Shown {total} · Held back {n}"); with a query (no bar; "Shown {total} matching “{q}” · {n} listings in the library record this fact but are not yet checked"); `heldBack === 0` both ways; `total === 0` both ways; singular and plural agreement; a 60-character `q` truncated to 40 with "…"; an **intent-only** query: `runSearch` on the seed data with `q: "without a credit card"` and a confirmed-only filter yields `effectiveQuery.q === undefined`, and `evidenceGateCopy` with that `q` returns `showBar: true` and no quoted query; whitespace-only `q` is treated as empty |
| `compare-params.test.mts` | `r` parsing (comma and repeat forms, invalid, duplicate, more than 3, unknown), `diff` parsing, `diffRows` (value differs, evidence differs, none differ), `compareSelection` (toggle adds, toggle removes, a fourth toggle returns the state unchanged, clear empties, the input array is not mutated) |
| `tokens.test.mts` | OKLCH → sRGB conversion against known values; every contrast pair in §2.1, in both themes: the six text and status `-fg` tokens on all five surfaces (`--bg`, `--bg-subtle`, `--surface`, `--surface-raised`, `--surface-hover`) ≥ 4.5:1, and `--border-strong` ≥ 3:1 against `--bg`, `--surface`, `--surface-raised` and `--surface-hover`; every theme block defines `--surface-hover`; the `@theme inline` block is present in `tokens.css`, defines `--font-serif` as `var(--font-source-serif), …` and `--font-display` with the same stack as `--font-sans` |
| `design-guardrails.test.mts` | Emoji scan (§2.6); motion-class ban and the CSS motion-property regex outside `motion.css` (§6.7); `@keyframes` outside `motion.css`; blur outside `materials.css`; at most 3 files applying `material-functional` (§2.4); success-colour rules 1 and 2 with their owner lists (§12.3); gold owner list (§2.1); storage outside `theme.tsx`; **radius ceiling**: `/\brounded(?:-[trblse]{1,2})?-(?:lg\|xl\|2xl\|3xl\|4xl)\b/` and `/\brounded(?:-[trblse]{1,2})?-\[/` outside `src/features/tools/implementations/**`, and `rounded-full` beyond the `ROUNDED_FULL_ALLOWED` map (§2.5, §5 M6); **skip-link target**: every `:target` in `src/styles/motion.css` is written `:target:not(#main)` (`/:target(?!:not\(#main\))/` fails), and no other `.css` file contains `:target` (none does at base SHA) (§6.5); `transition-all`; any `oklch(from` outside an `@supports (color: oklch(from` block (§2.1); `onEscape` anywhere in `src/` (the removed Dialog veto, §3.10); **focus suppression**: `/\boutline-(?:none\|hidden)\b/` in `src/**/*.tsx` outside `src/app/layout.tsx` (`#main`, programmatic focus only), `src/features/search/components/search-box.tsx` (inner input; the indicator is on the wrapper) and `src/features/tools/implementations/**` (tool UIs unchanged) (§2.1); **serif owners**: `/\bfont-serif\b/` outside `src/app/**/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/features/home/components/hero.tsx`, `src/components/ui/layout.tsx`, `src/features/search/components/{resource-explorer,static-library}.tsx`, `src/features/categories/components/atlas-index.tsx` and `src/features/collections/components/collection-card.tsx` (§2.2); **reserved evidence glyphs**: `/\b(?:name\|icon)="(?:check-circle\|help-circle\|clock\|minus-circle)"/` and the object-literal form `/\bicon:\s*"(?:check-circle\|help-circle\|clock\|minus-circle)"/` (today `app/about/page.tsx`), both in `.tsx` outside `src/features/resources/components/evidence.tsx` and `src/features/tools/implementations/**` (config `.ts` files stay exempt, because they are not rendered), and `/\b(?:name\|icon)=\{\s*(?:status\|definition\|verification)\.icon\s*\}/` outside `src/features/resources/components/resource-facts.tsx` (platform glyphs) (§2.6); **count literals**: `/\b\d{2,}\s+(?:listings?\|resources?\|subjects?\|tools?)\b/i` in `src/features/home/**` and `src/app/page.tsx` (§12.3). (In this table the regex alternation bars are backslash-escaped for Markdown; the test uses plain alternation.) Each rule is a plain file walk plus regex, with the owner lists as data at the top of the file. The test must pass against the code as it stands **after** the conversions in §2.1 and §12.3, which is why those conversions are listed file by file |
| `fact-meter.test.mts` | `factMeterCounts` on fixtures: all confirmed, a stale fact counted as unsettled, an `unresolved` fact counted as unsettled, none confirmed; `confirmed + unsettled ≤ total`; `total === FACTS.length` |

**Browser smoke additions** (`scripts/browser-smoke.mjs`, additive):
1. Homepage `h1` contains `formatCount(manifest.count)`, and the page contains no "thousands".
2. Ctrl+K opens `[role="dialog"]` with focus on `[role="combobox"]`. Typing a known listing name shows it as an option. Escape with that query still typed leaves `[data-palette]` open and empties the input. Enter (after retyping) navigates with `__noReload` intact. Escape on an empty query closes, and focus returns.
2a. **Close without activation.** Open the palette with an untrusted `el.click()` on the trigger through `Runtime.evaluate` (no user activation), type nothing, press Escape. Assert `!document.querySelector('[data-palette]')` within the existing `waitFor`, then press Ctrl+K and assert the palette is open again (it reopens instead of toggling a hidden dialog shut, §3.10).
3. `/palette-index.json` and `/compare-index.json` load with status 200 and parse.
4. `/compare/?r={a},{b}`: the table renders, and every `td[data-fact]` has a `[data-evidence]` matching `manifest.entries[].facts`.
5. `/compare/?r=not-a-real-slug`: the picker empty state renders with the not-found notice.
6. Mobile `/resources/`: the "Filters" button opens a dialog; "Show N results" closes it; focus returns.
7. With `Emulation.setEmulatedMedia` set to `prefers-reduced-motion: reduce`, the palette dialog's computed `transition-duration` is ≤ 0.01ms.
8. The overflow checks gain `/compare/?r=…` and `/categories/` at tablet and mobile.
9. On `/resources/` and the homepage, for every `main article`, the first `[data-fact]` element in DOM order has `data-fact="freeStatus"` and a `data-evidence` attribute (§3.1 contract).
10. On a record page with check records, picked as `manifest.entries.find(e => e.confirmedChecks.length + e.unresolvedChecks.length > 0)` (the same pick as the existing verification check), the Provenance Rail's station 2 text contains the same "{x} of {y}" pair as the Verification panel's "required checks confirmed" line. On a record page with no check records, station 2 reads "No checks recorded yet" and does not contain "required checks".
11. With JS disabled, a record page contains no link to `/compare/`, and `/compare/` shows "Comparison needs JavaScript".
12. With JS enabled, `/resources/` at 1366px contains exactly one `form` with an `input[name="openSource"]`; at mobile width with the sheet open, also exactly one.
13. **Visible focus.** On a freshly loaded `/resources/` at 1366px, with no pointer interaction yet: call `.focus()` on the results-page search `input` and assert, in order, `input.matches(":focus-visible")` (so the check cannot pass vacuously) and `getComputedStyle(input.closest("[data-search-field]")).outlineStyle !== "none"`. The wrapper carries `data-search-field`, added in `search-box.tsx` for this check. Then do the same for the sort `select`, asserting `getComputedStyle(select).outlineStyle !== "none"`. Chromium applies `:focus-visible` to script focus when the last interaction was not a pointer, and always to text inputs; the first assertion confirms that before the outline is read.
14. **Record tags.** On the Supabase record page (the smoke test's existing detail fixture), the aside has an `h2` "Tags" followed by at least one `a[href*="?tag="]`, and each link's decoded `tag` search parameter equals its own text. This keeps the record → tag-listing path (§3.9 item 5d) from being dropped silently.
15. **Skip link leaves `<main>` untinted.** On `/`, read `getComputedStyle(document.querySelector("main")).backgroundColor`, press Tab once (the skip link) and Enter, assert `location.hash === "#main"`, and within 100ms (while a flash would be at its strongest) assert the same computed background as before; assert `getComputedStyle(main).animationName === "none"` as well. Repeat with `Emulation.setEmulatedMedia` set to `prefers-reduced-motion: reduce`, where the static tint would otherwise apply and persist (§6.5, §6.6).

**Manual** (recorded in the PR):
- A keyboard-only walkthrough of the palette, sheet, compare and record page.
- VoiceOver (Safari) and NVDA (Firefox) on the palette combobox, the compare table and the Provenance Rail.
- 200% browser zoom on the home, `/resources` and record pages.
- Windows forced-colours mode.
- Light and dark themes.

Full WCAG conformance cannot be claimed from these checks alone. It needs assistive-technology testing and expert review.

---

## 15. Acceptance criteria

1. `npm run lint`, `typecheck`, `test` (47 existing + new), `build`, `build:static`, `test:browser` (61 existing + new), `backlog:check` and `check:verification` all pass.
2. `git diff --stat` shows no changes under `src/lib/`, `src/data/`, `src/types/`, `.github/`, `src/config/verification.ts` or CODEOWNERS.
3. The homepage `h1` reads "A library of {n} listings of free resources, across {m} subjects." with the build-time listing count and subject count. No count literal appears in `src/features/home` or `src/app/page.tsx`, checked by the count-literal guardrail rule (§14). The rendered homepage text contains no "thousands" (smoke check 1).
4. There is no `hero-grid` utility, no `backdrop-blur` outside `materials.css`, no gradient background on any hero or heading, and no rotating placeholder.
5. Every colour pair in §2.1 passes `tokens.test.mts` in both themes.
6. `design-guardrails.test.mts` passes: zero emoji; `globals.css` holds no colour token and no status custom property; every `oklch(from` inside its feature query; no banned motion classes; no `transition`/`animation` declaration or `@keyframes` outside `motion.css`; one translucent material on at most 3 files; success colour and success tones only from their owners; gold only from its owners; no radius utility above `rounded-md` (10px) and no arbitrary `rounded-[…]` outside tool UIs; `rounded-full` matching `ROUNDED_FULL_ALLOWED` exactly; every `:target` in `motion.css` written `:target:not(#main)`; no client storage beyond the theme; no focus suppression outside its allow-list; `font-serif` only from its owners; reserved evidence glyphs only from `evidence.tsx`; no count literal in the homepage files.
7. `/resources` exported HTML ≤ 8,632,437 bytes. If it is exceeded, content is cut in this fixed order, re-measuring after each step: (i) the record key ("Record · {slug}") is dropped from `layout="list"` records on `/resources` (it stays on the record page and in other lists); (ii) the licence part of the coordinates line is dropped from those records (the licence stays on the record page, in the ledger and in the rail). No evidence element (`CardEvidence`, the snapshot tokens, `data-fact`/`data-evidence` attributes, the Catch line) is ever cut. If both steps are not enough, the overage is reported in the PR as a blocker rather than cut further. `/` HTML ≤ 303,700 bytes (baseline + 10%). JS referenced by `/` ≤ baseline 612,169 + 10,240 bytes, uncompressed; the palette and compare code are not in the initial chunks. CSS ≤ 51,200 bytes uncompressed. Exactly two font families are emitted.
8. A record's element count is ≤ the current card's for the same resource, measured on three fixtures: a confirmed-heavy one (the Supabase listing used by the smoke test), an open-source one, and a never-checked one.
9. ⌘K/Ctrl+K and `/` open the palette from any page. Results update on every keystroke with no network request after the first index load. Enter navigates client-side. Escape behaves as in §3.4, including when the palette was opened without user activation (smoke check 2a): it closes, and ⌘K/Ctrl+K reopens it.
10. `/compare/` renders 2–3 listings with the parity statement and the difference lens, and handles every invalid-input case in §12.2 with the stated copy.
11. Below `lg`, filters open in a modal sheet with Close and "Show {total} results". At `lg` and above, the filter sidebar is sticky and scrolls independently.
12. The record page shows the Snapshot, the Provenance Rail (five stations, real data only), the ledger Facts and "Connected in the library". All existing smoke contracts pass unchanged.
13. With reduced motion, no element animates position. With or without it, using the skip link leaves `<main>`'s computed background unchanged (smoke check 15). With reduced transparency, FUNCTIONAL surfaces are opaque. In forced colours, all boundaries remain visible.
14. Unknown and unconfirmed values never render more confidently than `factEvidence` states. This is audited by the existing smoke card and detail audits plus the new compare audit.
15. Every component file created in §13 has the when / when-not / keyboard / evidence header comment.
16. With a text query and a confirmed-only filter, the Evidence Gate draws no bar and uses the text-only sentence (§8 C2, `evidence-gate-copy.test.mts`). The record page keeps "Where this information comes from", including the non-affiliation sentence verbatim (§3.9 item 5).
17. The record page shows exactly two kinds of evidence ratio: "{c} of {FACTS.length} facts confirmed" (snapshot, built from `factMeterCounts`, never a literal) and "{x} of {y} required checks recorded as confirmed" (rail, equal to the panel's figures). No "of 12" appears (smoke check 10).
18. With JS disabled, no page links to `/compare/`, and `/compare/` explains that it needs JavaScript (smoke check 11). `/compare/` is absent from `sitemap.xml`.
19. Quick Compare (§3.6, C3) lands as the last, separable PR. Criteria 1–18 and 20–23 hold with or without it (criterion 10 and the compare parts of 14 apply only once it lands).
20. Every form field, the sort select and the search field show a visible focus indicator on keyboard focus: no `outline-none`/`outline-hidden` outside the §14 allow-list, and smoke check 13 reads a non-`none` computed outline on the search wrapper and the sort select.
21. Source Serif 4 is applied only through `font-serif` at the §2.2 sites (guardrail owner list); every other existing `font-display` usage renders in Inter.
22. check-circle, help-circle, clock and minus-circle are rendered only through `EvidenceMark` (reserved-glyph guardrail rules, §2.6). `FreeStatusBadge` and `VerificationBadge` are word-only; the record-page status Callout shows alert-triangle for cautions and no icon otherwise.
23. The record page aside keeps the Tags block as " · "-separated text links with unchanged `?tag=` hrefs, omitted when a listing has no tags (§3.9 item 5d, smoke check 14). The Facts `h2` reads "Facts", and the alternatives caveat sentence is unchanged (§3.9 item 4).

---

## 16. Out of scope, deferred and backlog

- **Route view transitions and the shared-element transition (DEFER).** Prototype P1, for a later pass:
  - enable `experimental.viewTransition` in a spike branch and add a root cross-fade (`--dur-route: 180ms`);
  - pass conditions: typecheck with no suppressions; `build:static` green; zero CSP violations; all smoke checks including `__noReload`; animation fully absent under reduced motion;
  - fallback: none (hard cut, as today).

  It was deferred because it needs an experimental flag whose static-export and CSP behaviour is unverified (research §3), and the experience works without it.
- **Search → palette morph, swipe-to-dismiss, directional pagination (DEFER).** Reasons in §7.
- **Inspector / split-view preview on `/resources` (DEFER).** It duplicates the record page and adds JS to the largest page (research §5).
- **A grid/list density toggle (REJECT for now).** It would need a new URL parameter that `lib/search/params` would drop on every filter change, and `lib/` is out of bounds.
- **Region or availability coverage, interface-language coverage (OUT OF SCOPE).** No data exists. This would be a data and schema project with its own verification check (research §1.6).
- **Recent searches or saved comparisons (OUT OF SCOPE).** They would need client storage and a privacy-page change.
- **Stale counts in `docs/architecture.md` and `docs/verification.md` (OPTIONAL).** They may be corrected if docs are touched. The UI must never copy them.
- Verification logic, data model, resource data, CI and CODEOWNERS: not touched.

---

## 17. Assumptions

1. Tailwind v4's PostCSS plugin inlines local `@import` files from `globals.css`. This is standard v4 behaviour. If it fails, the three style files are concatenated into `globals.css` in the same order, with no other change.
2. `next/font/google` offers `Source_Serif_4`, and both it and `Inter` accept `axes: ["opsz"]`. If the typings reject the axis, it is dropped as described in §2.2.
3. `computeFacets(resources, {})` returns per-category counts that match category-page membership, because both come from the same filter code. The census uses it for that reason.
4. The JSON index sizes (about 15 KB and 45 KB gzip) are estimates. The actual sizes are recorded in the PR, and if the palette index exceeds 30 KB gzip, `c` (category name) is replaced with a subject index into `subjects`.
5. Field-presence counts in §0.1 come from a text search of `src/data/resources` and are approximate. No design decision depends on their exact value, because absent values always render as "Not recorded" or are omitted.
6. Same-route navigations on `/resources` keep `ResourceExplorer` mounted, so the compare selection survives filter changes. If they do not, the selection resets on filter change. The tray then says "Selection clears when filters change" until fixed, and nothing is persisted as a workaround.
7. Node's type stripping (used by `npm test`) does not compile JSX, so pure helpers that tests import live in `.ts` files (§13). This was checked against `scripts/test/hooks.mjs`, which resolves `.ts`/`.tsx` but adds no transform.
8. Per the HTML spec's close-request processing, cancelling the Escape `keydown` (`preventDefault`) stops the browser from raising a close request, so the palette's query clearing (§3.4) never reaches the dialog. This is spec behaviour, not reproduced here (no browser run). Smoke check 2 asserts it. If an engine is found to close anyway, the primitive's `close` listener keeps state consistent (the palette closes rather than clearing), which is a degraded but correct outcome.
9. Tailwind v4 supports the `has-[input:focus-visible]:` variant and the `outline-(--focus)` custom-property shorthand used on the search wrapper (§2.1). Both are documented v4 syntax. If either fails to compile, the same three declarations go into `materials.css` as `.search-field:has(input:focus-visible) { outline: 2px solid var(--focus); outline-offset: 2px; }`, applied by class, with no change to behaviour or to smoke check 13.
10. `@theme inline` keeps emitting `--font-display` and `--font-serif` as custom properties, as it does for `--font-display` today (the base heading rule and `contrast-checker.tsx`'s inline `var(--font-display)` both rely on that). The token values change, the mechanism does not.

---

## 18. Responses to the design reviews

### 18.1 Fourth review (revision 5, this pass)

All 4 MEDIUM and 7 NIT findings in `.agents/ui-review/design-review.md` (revision 4 review, verdict file `design-verdict.json`) are **addressed**. None is backlogged or ignored. Before each change, the fact behind it was re-checked in source at base SHA: no `:target` rule exists in `src/` today, and the skip link targets `#main`; radius usage outside `features/tools/implementations/**` is `rounded-lg` ×36, `rounded-xl` ×12, `rounded-md` ×11, one `rounded-2xl`, and bare `rounded` only on inline links and summaries; `badge.tsx`'s neutral tone is `bg-surface-raised … border-border-strong` with `rounded-md`; `OpenSourceBadge` takes only `license` and has no caller; and `books`, `music`, `travel`, `personal-finance` and `communication` each sit in two `categoryGroups` entries.

| ID | Decision | Where |
| --- | --- | --- |
| M1 | Addressed as proposed. Both the flash rule and the reduced-motion rule use `:target:not(#main)`, so the skip link never tints the page. A guardrail fails on any `:target` in `motion.css` not written `:target:not(#main)` (and on `:target` in any other CSS file). New smoke check 15 compares `<main>`'s computed background before and within 100ms after the skip link, under both motion settings | §2.1 gold role 3, §2.4 FOCUS, §6.3 FOCUS, §6.5, §6.6, §7 row 10, §14 guardrails and smoke 15, §15 criteria 6 and 13 |
| M2 | Addressed as proposed. `--radius-xs: 3px; --radius-sm: 6px; --radius-md: 10px` are set in `tokens.css`'s `@theme inline` block, deliberately overriding Tailwind's keys. Outside tool UIs, `rounded-md` → `rounded-xs`, `rounded-lg` → `rounded-sm` and `rounded-xl` → `rounded-md`, converted in that order so no class converts twice. The guardrail bans `rounded-(lg\|xl\|2xl\|3xl\|4xl)` and `rounded-[`, with an optional directional prefix (`rounded-t-xl`) so the 10px ceiling cannot be bypassed. Bare `rounded` (4px, links) is left as is | §2.5, §5 M6, §9 table, §13 `globals.css`, §14, §15 criterion 6 |
| M3 | Addressed as proposed. "Differs" is an `xs` kicker in `--fg` with a 2px `--border-strong` leading rule on the `th`, no fill and no gold, so `compare-view.tsx` stays off the gold owner list. It is removed from FOCUS in §2.4 (and named under "Never used for") and from §6.3 | §2.4, §6.3, §8 C3 item 2 |
| M4 | Addressed as proposed. `FreeStatusBadge` and `OpenSourceBadge` gain `variant?: "badge" \| "token"`; `"token"` renders the `data-fact`/`data-evidence` wrapper and sr-only or visible "not verified" text with `Badge appearance="ledger"`. The compact snapshot renders those two components and never reads `definition.tone`; §12.3 states that `resource-snapshot.tsx` is deliberately not a tone owner. `OpenSourceBadge`'s token is always neutral, because open source is a classification | §3.3 Full cell 1 and Compact, §3.11, §12.3 rule 2 and conversions, §13 |
| N1 | Addressed: `/collections/[slug]` is removed from the "no layout change" list | §4.3 |
| N2 | Addressed: `--survey-partial` and `--survey-other` in `materials.css`, with static dark and light values and the relative form only inside `@supports (color: oklch(from red l c h))`, as for `--meter-unsettled` | §2.1, §5 M2 |
| N3 | Addressed: `/\bicon:\s*"(?:check-circle\|help-circle\|clock\|minus-circle)"/` is added for `.tsx` outside the owners; config `.ts` files stay exempt | §2.6, §14 |
| N4 | Addressed: `g` is the first containing group in `categoryGroups` order; one palette row per subject; the Atlas Index still lists two-group subjects twice. The palette test checks it | §3.4, §14 |
| N5 | Addressed: `html:has(.action-bar[data-visible]) main { padding-bottom: calc(72px + env(safe-area-inset-bottom)) }` in `materials.css`, beside the `scroll-padding-bottom` rule | §3.9 item 6 |
| N6 | Addressed: cell 5 uses `Intl.PluralRules("en")` ("1 platform", "Recorded as 1 platform"), and "Not recorded" in `--fg-subtle` for zero | §3.3 cell 5 |
| N7 | Addressed: `Badge` is `rounded-xs` with a 1px border; neutral (and so `primary` and `info`) is a `--border` edge, `--surface` fill and `--fg-muted` text; `success`/`warning`/`danger` keep the tone map; `appearance="ledger"` differs only in a transparent neutral fill | §3.11, §13 `badge.tsx` |

This pass supersedes one revision-4 decision: §18.2 N13's "one global `:target` rule" now reads `:target:not(#main)` (M1).

### 18.2 Third review (revision 4)

All 1 HIGH, 3 MEDIUM and 16 NIT findings in `.agents/ui-review/design-review.md` (revision 3 review) are **addressed**. None is backlogged or ignored. Before each change, the fact behind it was re-checked in source at base SHA: `focus:outline-none` in `field.tsx:20` and `sort-select.tsx:51`, `outline-none` on the inner input at `search-box.tsx:100` with `focus-within:border-primary` on the wrapper at line 81, and `outline-none` on `#main` in `layout.tsx`; the `--font-display` definition in `globals.css`'s `@theme inline` block and the `font-display` classes on page `h1`s, aside `h2`s and the footer kickers; the `icon` values in `config/free-status.ts` and `config/verification.ts`, the `icon={definition.icon}` props in `status-badges.tsx`, `verification.icon` in `verification-panel.tsx`, `icon="check-circle"` on the evidence-filter Callout, and `Callout`'s `icon ?? defaultIcons[tone]`; the record page's Tags block and its `?tag=` hrefs; `effectiveQuery` in `run-search.ts`; the ledger's "Listed as …" and lower-case "Recorded as {value}"; the toolbar's " · page p of n" suffix; `getAlternativeTargets`' return shape and `seedDataSource`.

| ID | Decision | Where |
| --- | --- | --- |
| F1 (HIGH) | Addressed as proposed. `focus:outline-none` is deleted together with `focus:border-primary` in `field.tsx` and `sort-select.tsx`; `search-box.tsx` keeps `outline-none` on the inner input and draws a keyboard-only `has-[input:focus-visible]` outline in `--focus` on the wrapper; `card.tsx`'s gold `focus-within` is deleted. A guardrail bans `outline-none`/`outline-hidden` outside `layout.tsx` (`#main`), `search-box.tsx` and tool UIs. New smoke check 13 confirms `:focus-visible` matches and then reads a non-`none` computed outline on the search wrapper and the sort select. A fallback is stated if the Tailwind variant does not compile | §2.1, §12.3, §13, §14 guardrails and smoke 13, §15 criterion 20, §17 assumption 9 |
| F2 | Addressed as proposed. `--font-display` is the Inter stack, so every existing `font-display` usage stays Inter. The serif is applied only through `font-serif` at the enumerated sites (page `h1`s, the hero `h1`, editorial `h2`s via `Section` and on `/about` and `/verification`, record names, `lg` standfirsts, Atlas Index group titles, the editorial collection name). The base rule is `h1, .editorial h2`. A guardrail owner list holds `font-serif` to those files | §2.2, §12.3, §13, §14, §15 criterion 21, §17 assumption 10 |
| F3 | Addressed as proposed, and extended to surfaces the finding did not list, found by searching `src/**/*.tsx` for the reserved names: the definition Badges on `/free-status` and `/verification` (`icon={status.icon}`) become word-only; the "Ready to file" Callouts in the submit and report forms (`icon="check-circle"`) pass `icon={null}`; the "Planned" tool Badges (`icon="clock"`) drop the icon. Without these, the new guardrail would fail on day one. The rule (§2.6): the four evidence glyphs render only through `EvidenceMark`. `FreeStatusBadge` and `VerificationBadge` are word-only; the status Callout uses alert-triangle for caveated warning/danger statuses and no icon otherwise; the panel summary icon and the evidence-filter Callout icon go; `Callout` gains `icon?: IconName \| null`. Two guardrail regexes cover literal names and the `status`/`definition`/`verification` `.icon` props (platform glyphs in `resource-facts.tsx` are allowed, none being reserved). The contradictory "keep their icon on the record page header" sentence is deleted | §2.6, §3.2 station 5, §3.3, §3.9 item 4, §5 M2, §12.3, §13, §14, §15 criterion 22 |
| F4 | Addressed as proposed. Aside block (d) Tags: CONTENT, `--rule` hairline, Inter 600 `sm` `h2`, " · "-separated text links with unchanged hrefs, omitted when empty, last on `lg`+. The description of today's aside is corrected. Smoke check 14 guards the links | §3.9 item 5, §14 smoke 14, §15 criterion 23 |
| N1 | Addressed: `showBar` is `!effectiveQuery.q`; the text-only sentence quotes `effectiveQuery.q`; the explorer passes it to `evidenceGateCopy`; an intent-only case and a whitespace case are tested | §3.5, §8 C2, §13, §14 |
| N2 | Addressed with the review's regex, plus `/var\(--primary/` in `.tsx` inline styles | §2.1 Guardrail |
| N3 | Addressed: `variable: "--font-source-serif"` and `--font-serif: var(--font-source-serif), ui-serif, Georgia, serif`; the token test checks it | §2.2, §13, §14 |
| N4 | Addressed: `popoverTarget={id}` with inline `anchorName` on the trigger and `positionAnchor` on the popover, both `--{id}` | §5 M1 |
| N5 | Addressed: `motion-details` transitions `block-size` and `content-visibility` (`allow-discrete`) inside `@supports (interpolate-size: allow-keywords)`; §6.4's property list includes the discrete properties | §6.3, §6.4, §6.5 |
| N6 | Addressed: "A library of {n} listings of free resources, across {m} subjects." | §4.1, §15 criterion 3 |
| N7 | Addressed: cell 1 reads "Listed as {label.toLowerCase()}", cells 2–4 use the lower-case stored value, and cell 6 shows C1's sentence built from `FACTS.length` and `factMeterCounts`. The "identical everywhere" claim is narrowed to what is true (cells 1–4 match the ledger; cell 5 is a count) | §3.3, §8 C1, §15 criterion 17 |
| N8 | Addressed: `openSource && freeStatus !== "OPEN_SOURCE"`, as in §3.1 | §3.3 |
| N9 | Addressed: "0 listings match" at zero; " · page {p} of {n}" in `--fg-subtle` from `sm` when there is more than one page | §3.5 |
| N10 | Addressed: `build-palette-index.ts` exports `buildPaletteIndex()`, called by the route and by the test with seed data; `compareSelection()` lives in `compare-params.ts` and `ResourceExplorer` uses it through `useReducer` | §3.4, §3.6, §12.3, §13, §14 |
| N11 | Addressed: `surveyByGroup(resources, now?)` in `census.ts`, with its signature, membership rule and tests (including the two-group case) | §3.7, §13, §14 |
| N12 | Addressed: shown segment `--fg-muted`, held-back segment `--rule`, no status hue | §8 C2 |
| N13 | Addressed: one global `:target` rule in `motion.css` with a from-only `ef-flash` keyframe; static tint under reduced motion; the `motion-flash` utility is dropped | §2.4, §6.3, §6.5, §6.6 |
| N14 | Addressed: the six text and status `-fg` tokens are tested on all five surfaces in both themes | §2.1, §14 |
| N15 | Addressed: a count-literal guardrail regex for `src/features/home/**` and `src/app/page.tsx`; a fixed cut order for the `/resources` budget (record key, then the licence part of the coordinates line, never an evidence element) | §12.3, §14, §15 criteria 3, 6 and 7 |
| N16 | Addressed: the alternatives caveat is kept verbatim under "Listed as an alternative to"; the Facts `h2` is renamed from "Details" to "Facts" | §3.9 item 4, §15 criterion 23 |

### 18.3 Second review (revision 3)

Kept for traceability. Two of these decisions are superseded by revision 4: N4's "when muted, `icon` is not passed" and N5's "the status Callout keeps `status.icon`" are replaced by the F3 icon rule in §18.2, and N14's `popovertarget={id}` is now `popoverTarget={id}` (§18.2 N4).

All 6 MEDIUM and 16 NIT findings in `.agents/ui-review/design-review.md` (revision 2 review) are **addressed**. None is backlogged or ignored. Before each change, the fact behind it was re-checked in source at base SHA: the `@theme inline` block in `globals.css` (lines 118–163); `excludedByEvidence` computed with `q: undefined` (`lib/search/run-search.ts` line 162); the aside's three blocks (`app/resources/[slug]/page.tsx` lines 322–352); `VerificationPanel`'s `<Card>` root and `records.length > 0` gating; `FilterPanel`'s `role="status"` reading `isPending` and `SortSelect`'s own `useTransition`; `Callout`'s props (no `id`); `status.icon` values in `config/free-status.ts`; the importers of `category-cards.tsx`; and the `collection-card.tsx` path. The `--border-strong` ratios were recalculated with the OKLCH → sRGB maths the token test will use, and they match the review's figures.

| ID | Decision | Where |
| --- | --- | --- |
| F1 | Addressed as proposed. The token blocks **and the whole `@theme inline` block** move to `tokens.css`; `globals.css` declares no colour token and references no `--success*`/`--warning*`/`--danger*`/`--info*`; it is explicitly not a rule-1 owner, and acceptance criterion 6 checks it | §12.3 rule 1, §13 Modify `globals.css`, §14 `tokens.test.mts`, §15 criterion 6 |
| F2 | Addressed as proposed. The bar is drawn only when the text query is empty; with a query the gate is text only, with the review's wording. A pure `features/search/evidence-gate-copy.ts` owns the copy and is unit-tested for both branches and edge cases; `lib/` untouched | §8 C2, §3.5 toolbar, §13, §14, §15 criterion 16 |
| F3 | Addressed as proposed. `onEscape` is removed from the Dialog API (and banned by the guardrail test). The palette clears its query on the input's `keydown` Escape with `preventDefault`. The primitive's `cancel` handler requests close and only prevents default when `cancelable`; a new `close` listener brings React state back when the browser closes natively, and the primitive then skips EXIT, unmounts and restores focus. Smoke step 2a opens the palette without activation, presses Escape, and checks that ⌘K reopens it | §3.4 Keyboard, §3.10, §3.11, §6.3, §11, §12.1, §14 smoke 2/2a, §15 criterion 9, §17 assumption 8 |
| F4 | Addressed as proposed. C1 is a **count gauge** (confirmed, then unsettled, then unchecked; positions do not identify facts). Unsettled cells are a 45% `--warning-fg` fill with static fallbacks; no outlined cells. `u` (and a top-level `t = FACTS.length`, so the browser never hard-codes 11) is added to the palette and compare indexes and both zod schemas, with `k + u ≤ t` tested. §9's justification now reads "no score, no percentage, no colour ramp" | §8 C1, §3.4, §3.6, §3.11, §9, §12.2, §14 |
| F5 | Addressed as proposed. The aside is (a) Provenance Rail, (b) "Where this information comes from" in CONTENT, no icons, non-affiliation sentence verbatim, (c) the report block. One addition: a sticky rail followed by more blocks would let them scroll up under it, so the rail sits in a `flex-1` wrapper and is released before (b) | §3.9 item 5, §15 criterion 16 |
| F6 | Addressed as proposed, plus one gap the finding exposed. Dark `--border-strong` is `oklch(0.54 0.010 75)` (≥ 3.11 on all four surfaces). Light `--surface-hover` was never defined in the light table; it is now `oklch(0.955 0.005 85)`, and against it the light `oklch(0.65 …)` gave 2.84, so light `--border-strong` becomes `oklch(0.62 0.008 80)` (≥ 3.20). The token test checks all four surfaces in both themes | §2.1, §14 |
| N1 | Addressed: station 2 reads "No checks recorded yet" when `verificationChecks` is empty; smoke 10 picks a listing with records and also checks the empty branch | §3.2, §14 smoke 10 |
| N2 | Addressed: compare `evidence` stores `{ state, reason }` per fact, validated with two `z.enum`s pinned to the `lib` types by `satisfies` | §3.6, §12.2 |
| N3 | Addressed: one `sections` array drives both the links and the observer; only rendered sections are linked and observed | §3.9 item 3 |
| N4 | Addressed: `tone={status.tone === "success" && !confirmed ? "neutral" : status.tone}`, in §3.9 and in rule 2. Additionally, when muted, `icon` is not passed, so the neutral default replaces `check-circle`, the Legend's Confirmed mark | §3.9 item 4, §12.3 |
| N5 | Addressed with the review's first option: the status Callout keeps `status.icon` | §2.6 item 4 |
| N6 | Addressed with the review's wording | §3.3 Compact |
| N7 | Addressed: the panel root is a CONTENT `<section id="verification">` with the `h2` as a direct child. M6 now lists exactly where `Card` remains, and `Card` itself is restyled for those uses | §3.9 item 4, §5 M6, §11, §13 |
| N8 | Addressed with the review's wording, listing what is read and what is derived | §3.4 Imports |
| N9 | Addressed with the narrowed type | §3.4 Platform hint |
| N10 | Addressed: `FilterPanel` and `SortSelect` both get `isPending` and `onNavigate`; `SortSelect` loses its own transition | §3.5, §13 |
| N11 | Addressed: tray EXIT is instant, with focus moved to a live node after Clear; padding through `html:has([data-compare-tray]) main { padding-bottom: 5rem }` (plus `scroll-padding-bottom`) in `materials.css` | §3.6 Tray, §6.3 |
| N12 | Addressed: `id="evidence-filter-notice"` on the Callout root (new optional `id` prop) and `<a href="#evidence-filter-notice">` | §8 C2, §11, §13 |
| N13 | Addressed: the primitive renders `<dialog data-ef-modal …>` | §3.10 |
| N14 | Addressed: `popovertarget={id}`, ids `legend-filters`, `legend-facts`, `legend-compare` | §5 M1 |
| N15 | Addressed: short count below `sm`, sort `max-width: 9rem`, `min-height: 48px` with `height: auto` on wrap. Because a wrapped toolbar would make `--toolbar-h` too small for `scroll-padding-top`, a `ResizeObserver` sets `data-wrapped` and CSS raises `--toolbar-h` to 88px | §3.5, §12.1 |
| N16 | Addressed: path corrected to `features/collections/components/collection-card.tsx`; `category-cards.tsx` is listed under Delete, since the Atlas Index replaces both of its importers | §13 |

**Found while revising (not in the review).** The §2.1 relative-colour fallback ("declare twice, static value first") does not work as revision 2 claimed. A custom property accepts any token sequence, and any declaration containing `var()` is only validated at computed-value time, so in an engine without relative-colour support the second declaration still wins and resolves to an invalid colour. Every `oklch(from …)` value now sits inside `@supports (color: oklch(from red l c h))`, with the static value outside, and the guardrail test enforces it (§2.1, §2.4, §2.7, §8 C1, §14).

### 18.4 First review (revision 2)

All 12 MEDIUM and 16 NIT findings of the first review were **addressed** in revision 2. None was backlogged or ignored. Section references below are to this document; criterion numbers have been updated to the current §15 numbering.

| ID | Decision | Where |
| --- | --- | --- |
| F1 | Addressed. Success colour now has two guardrail rules (classes/tokens, and tones) with owner lists; every current violation is converted file by file (verification-panel rows and the filter-panel note through `EvidenceMark`; free-status, privacy, tools, tools/[slug], tool-card, tool-privacy, submit and report forms to neutral). `free-status/page.tsx` and the other touched pages are in §13 Modify. `rounded-full` is a file-to-count map; the empty-state, error and 404 discs are deleted | §2.1, §2.5, §2.6, §5 M6, §12.3, §13, §14 |
| F2 | Addressed. The kill switch moves unchanged (same `@layer base`) into `motion.css`; the scroll hairline is `@utility motion-scroll-hairline` in `motion.css`, applied by `site-header.tsx`; the property regex is stated, plus a `@keyframes` rule | §6.5, §6.6, §6.7, §7 row 2 |
| F3 | Addressed. Station 2 shows the panel's own "{x} of {y} required checks recorded as confirmed" from `missingRequiredChecks`, plus a stale qualifier via `isVerificationStale`; "of 12" and "could not be settled" are dropped | §3.2, §15 criterion 17, smoke 10 |
| F4 | Addressed as proposed: `sheetOpen` in `ResourceExplorer`, sidebar form rendered only when the sheet is closed, `useId`, `matchMedia` close at `lg`, `useTransition` lifted with an `onNavigate` prop | §3.5, §11, smoke 12 |
| F5 | Addressed. The "first `[data-fact]`" contract is stated; the record has two wrapper zones, `main` then `facts`, with no `data-fact` in `main` and no visual reordering | §3.1, §11, smoke 9 |
| F6 | Addressed as proposed: the compare tray is ELEVATED; FUNCTIONAL is exactly header, results toolbar and mobile action bar, enforced by a file count | §2.4, §3.6, §7 row 1, §9 |
| F7 | Addressed. Gold is a closed five-role list (adding the focus flash, nav and pagination current indicators, checkbox accent and `::selection`); "Results for", the inferred `bolt`, `OpenSourceBadge`, `tone="primary"`, gold link hovers, decorative gold icons and gold focus borders are removed; a class-regex guardrail with a file owner list enforces it | §2.1, §3.9, §9, §10, §13 |
| F8 | Addressed. Rows 36–43 added with the review's decisions; the hide-on-scroll header is rejected with reasons | §7 |
| F9 | Addressed with one deliberate refinement. The review's signatures are adopted, plus `Kbd`, `SegmentedControl`, `ResourceSnapshot`, `ProvenanceRail` and `libraryCensus`. The Dialog's single `onClose` ("called after EXIT completes") is split into `onRequestClose(reason)` and `onExited`, and `returnFocusRef` becomes a `returnFocus` boolean with the stored element captured at open. Reason: the Dialog is controlled, so closes also start from the parent (Close button, "Show N results", navigation); one callback cannot both request a close and report its end. The boolean is what the palette needs for N8 | §3.10, §3.11 |
| F10 | Addressed with both options: "Compare with…" renders only after hydration (`compare-link.tsx`), and `/compare/` has a `<noscript>` fallback in its static Suspense shell. `/compare/` stays out of the sitemap without editing `sitemap.ts` | §3.6, §3.9, §12.1, §15 criterion 18, smoke 11 |
| F11 | Addressed. The trigger is a `next/link` `Link` to `/resources/`; palette hrefs are stored without `basePath`; only the index `fetch` uses `withBasePath` | §3.4, §12.1 |
| F12 | Addressed. Rail station markers are neutral and identical (7px `--border-strong` ring); evidence state is carried only by `EvidenceTag`/`EvidenceMark`/`VerificationBadge`. M2 is the Survey bar only. The reference square is dropped too, so the rail has one marker shape | §3.2, §5 M2, §9 |
| N1 | Addressed: `--border-strong` is `oklch(0.49 0.010 75)` dark and `oklch(0.65 0.008 80)` light; non-interactive section rules use `--border` | §2.1, §2.5, §4.2 |
| N2 | Addressed: "Recorded as {value}" everywhere | §3.3 |
| N3 | Addressed: one `IntersectionObserver` with the stated `rootMargin` in `on-this-page.tsx`; `searchExamples` is not used by the palette | §3.9, §3.4, §4.1 |
| N4 | Addressed: `html:has([data-results-toolbar]) { --toolbar-h: 48px }`; sidebar `top` is `--header-h` + 16px | §2.3, §3.5 |
| N5 | Addressed: static fallbacks declared before every relative-colour value, per theme | §2.1, §2.4 |
| N6 | Addressed: the fallback reads the panel's computed `transitionDuration` | §3.10, §6.5, §6.6 |
| N7 | Addressed: guard is `dialog[open]:not([data-palette])` | §3.4, §3.10 |
| N8 | Addressed: on navigation, focus moves to `#main`; restore only on Escape, Close or scrim | §3.4, §3.10 |
| N9 | Addressed: `<button type="button" popovertarget=…>`, with per-surface ids | §5 M1 |
| N10 | Addressed: only the 8 fact rows carry `td[data-fact]` | §3.6 |
| N11 | Addressed with both: a justification for reversing the research deferral, and Quick Compare ships as a separable final PR | §3.6, §15 criterion 19 |
| N12 | Addressed: the caption names the counting difference | §3.7 |
| N13 | Addressed: sr-only text and the "· not verified" suffix kept; open-source `data-evidence` from `factEvidence(…, "openSource").state` | §3.3 |
| N14 | Addressed: `getAlternativeTargets()` from `@/lib/repository` | §3.4 |
| N15 | Addressed: toasts and `--z-toast` removed; no toast system in this pass | §2.4 |
| N16 | Addressed: the awaiting-sign-off note (and the two form `<noscript>` notes) move to neutral CONTENT | §2.1 |

Nothing in this revision changes verification logic, the verification data model, resource data, CI or CODEOWNERS, and it adds no dependency.
