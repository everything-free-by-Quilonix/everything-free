# Global UI system 002: Everything.Free

The design system for the `ui/global-premium-redesign-002` redesign. It turns the approved direction, `docs/design/global-ui-direction-002.md` (revision 5, cited as "direction §x"), and the research, `docs/design/global-ui-research-002.md` (cited as "research §x"), into tokens, component specifications, motion categories and rules that can be implemented without further design decisions.

**Precedence.** The direction is approved and wins over this document. Every token value and component rule here either restates the direction or adds a detail the direction leaves open. Each such addition is listed in §20 so a reviewer can check it on its own. If an implementer finds a conflict, the direction's text applies and this document is corrected.

**Benchmark, not a model.** Apple's interfaces are used only as a bar for craft: hierarchy, restraint, complete states, motion that explains, accessibility. Nothing here copies Apple's appearance, and nothing reproduces Liquid Glass. The visual language is Everything.Free's own: the Global Utility Atlas (direction §1), set as paper and ink, ruled rather than boxed, with one legend for every evidence mark.

---

## 0. Non-negotiables

These apply to every token, component and page. A change that breaks one of them is rejected in review, whatever else it improves.

1. **Evidence display.** A fact's evidence state comes only from `factEvidence` (`src/lib/resources/evidence.ts`, unchanged). No value is shown more confidently than its state allows. Unknown stays "Unknown". Recorded-but-unchecked values read "Recorded as …" or "Listed as …". Success green means confirmed evidence and nothing else. The four evidence glyphs (check-circle, help-circle, clock, minus-circle) are rendered only by `EvidenceMark` and mean only what the Legend says (direction §2.6, §12.3).
2. **Real data only.** Every count is computed at build (`libraryCensus`, `computeFacets`, `FACTS.length`, repository reads). No count literal in copy. No fake testimonials, avatars, ratings, metrics, activity, dashboards, logos or screenshots. No region, country or language claims, because no such data exists (direction §0.1).
3. **Zero emoji** in UI strings, config copy, comments and CSS (`\p{Extended_Pictographic}` guardrail; `©`, `®`, `™` allowed).
4. **Strict CSP and static export.** No runtime `<style>` injection, no inline event handlers, static inline scripts only, `connect-src 'self'`, `font-src 'self'`, `img-src 'self' data: blob:`. Inline `style=""` attributes are allowed and are how per-instance values (`--w`, `--c`, `--i`) are passed. No server runtime.
5. **No new dependencies**, runtime or dev. Motion is CSS. Overlays are native `<dialog>`, `popover` and `<details>`.
6. **Out of bounds:** `src/lib/**`, `src/data/**`, `src/types/**`, `src/config/verification.ts`, `.github/**`, CODEOWNERS. Read and import only.
7. **The AI-template ban list** (brief §1) is a design constraint, not a taste. §19.3 maps every banned pattern to the token or rule that excludes it.

---

## 1. Token architecture

### 1.1 Files

| File | Holds | May reference |
| --- | --- | --- |
| `src/styles/tokens.css` | Theme blocks (`:root, .dark` and `.light`): colour, shadow, z-index, layout and focus custom properties. The whole `@theme inline` block: Tailwind colour mappings, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--container-*`, `--default-transition-*` | Raw values; `var()` of tokens in this file |
| `src/styles/materials.css` | `@utility material-base`, `material-content`, `material-elevated`, `material-functional`; derived fills (`--fill-pressed`, `--primary-pressed`, `--meter-unsettled`, `--survey-partial`, `--survey-other`); fact-meter and survey-bar drawing; the `html:has(...)` padding rules for the tray and action bar; the opaque fallbacks | Tokens from `tokens.css` |
| `src/styles/motion.css` | `--dur-*`, `--dist-*`, `--ease-*`; every `transition`, `animation` and `@keyframes` in the codebase; the motion utilities; the reduced-motion kill switch (moved unchanged from `globals.css`) | Tokens from `tokens.css` |
| `src/app/globals.css` | `@import "tailwindcss"`, `@custom-variant dark`, imports of the three files, the base layer (body, headings, `:focus-visible`, `::selection`, `::placeholder`, scrollbar, `accent-color`), `@utility link-inline`, `@utility hairline-t` | Tokens. It declares **no** colour token and references no `--success*`, `--warning*`, `--danger*` or `--info*` property |

`hero-grid` is deleted. `tests/tokens.test.mts` parses `tokens.css`; `tests/design-guardrails.test.mts` enforces the file boundaries (direction §14).

### 1.2 Naming and consumption

- **Semantic names only.** Components use role tokens (`bg-surface`, `text-fg-muted`, `border-rule`), never raw colours, raw durations or arbitrary values. The existing names (`--bg`, `--surface`, `--fg`, `--border`, `--primary`, status tokens) are kept, so components keep compiling.
- **One name per value.** No aliases are declared as custom properties. Vocabulary such as "medium motion" or "normal speed" (§9.1) maps to one CSS token; it is not a second token.
- **Relative colour inside a feature query.** Any `oklch(from …)` value sits inside `@supports (color: oklch(from red l c h))`, with a static value declared outside it (direction §2.1). A guardrail enforces this.
- **Tailwind access.** Colour tokens are exposed through `@theme inline` as `--color-*`, so `bg-surface-raised`, `text-fg-subtle`, `border-rule` and `border-border-strong` exist. `--rule` is newly mapped as `--color-rule: var(--rule)`.

---

## 2. Colour tokens

### 2.1 Theme values

Dark is the default on `:root` (so no-JS renders correctly); light opts in through `.light`. Values are the direction's (§2.1). Rows marked "system" are values this document adds where the direction is silent (§20).

| Token | Dark ("night chart") | Light ("paper") | Role |
| --- | --- | --- | --- |
| `--bg` | `oklch(0.165 0.006 75)` | `oklch(0.985 0.004 85)` | BASE page |
| `--bg-subtle` | `oklch(0.185 0.006 75)` | `oklch(0.965 0.005 85)` | BASE alternate band, record header band |
| `--surface` | `oklch(0.205 0.007 75)` | `oklch(1 0 0)` | CONTENT fill where a fill is needed |
| `--surface-raised` | `oklch(0.235 0.008 75)` | `oklch(0.975 0.004 85)` | ELEVATED fill, secondary button fill |
| `--surface-hover` | `oklch(0.255 0.008 75)` | `oklch(0.955 0.005 85)` | Hover fill, active listbox row |
| `--rule` | `oklch(0.27 0.008 75)` | `oklch(0.91 0.006 85)` | Hairlines between records, ledger leaders, empty meter cells |
| `--border` | `oklch(0.30 0.008 75)` | `oklch(0.88 0.006 85)` | Component edges (non-interactive), section rules |
| `--border-strong` | `oklch(0.54 0.010 75)` | `oklch(0.62 0.008 80)` | Interactive edges only |
| `--fg` | `oklch(0.95 0.006 85)` | `oklch(0.22 0.010 75)` | Primary text |
| `--fg-muted` | `oklch(0.77 0.010 80)` | `oklch(0.42 0.010 75)` | Secondary text |
| `--fg-subtle` | `oklch(0.64 0.010 80)` | `oklch(0.50 0.010 75)` | Tertiary text (still AA) |
| `--primary` | `oklch(0.79 0.125 85)` | `oklch(0.50 0.100 80)` | Gold ink |
| `--primary-hover` | `oklch(0.84 0.120 87)` | `oklch(0.44 0.095 80)` (system) | Primary button hover |
| `--primary-fg` | `oklch(0.18 0.010 75)` | `oklch(0.99 0.004 85)` | Text on gold |
| `--focus` | `var(--primary)` | `var(--primary)` | Focus ring |
| `--success-fg` | `oklch(0.80 0.130 160)` | `oklch(0.45 0.110 160)` | Confirmed evidence only |
| `--warning-fg` | `oklch(0.82 0.120 80)` | `oklch(0.47 0.100 70)` | Not confirmed, Needs re-checking, cautions |
| `--danger-fg` | `oklch(0.72 0.150 28)` | `oklch(0.47 0.160 28)` | Errors only |
| `--scrim` (system name) | `oklch(0 0 0 / 0.6)` | `oklch(0 0 0 / 0.6)` | `::backdrop` of modal dialogs (value from direction §2.4) |

**Base status tokens** (`--success`, `--warning`, `--danger`), used only as `/30` border tints in the Badge and Callout tone maps, take the same static numbers as their `-fg` token (system). **Soft tokens** (`--success-soft`, `--warning-soft`, `--danger-soft`, `--primary-soft`) are the `-fg` (or `--primary`) value at alpha 0.12, declared static first and relative inside the feature query:

```css
:root { --primary-soft: oklch(0.79 0.125 85 / 0.12); }
.light { --primary-soft: oklch(0.50 0.100 80 / 0.12); }
@supports (color: oklch(from red l c h)) {
  :root, .light { --primary-soft: oklch(from var(--primary) l c h / 0.12); }
}
```

**Kept for compile safety, no new uses:** `--info`, `--info-fg`, `--info-soft` (info is retired from the UI; `tone="info"` maps to neutral), `--secondary`, `--secondary-fg`, `--primary-ring` (no `.tsx` uses it at base SHA).

**`theme-color`** in `layout.tsx` is set to the sRGB equivalents of the two `--bg` values.

### 2.2 Derived fills (`materials.css`)

| Token | Static value | Relative value (inside `@supports`) | Use |
| --- | --- | --- | --- |
| `--fill-pressed` (system) | `var(--surface-hover)` | `oklch(from var(--surface-hover) calc(l - 0.02) c h)` | Pressed state of every neutral control (direction §2.7) |
| `--primary-pressed` (system) | `var(--primary)` | `oklch(from var(--primary) calc(l - 0.04) c h)` | Pressed primary button |
| `--meter-unsettled` | dark `oklch(0.82 0.120 80 / 0.45)`, light `oklch(0.47 0.100 70 / 0.45)` | `oklch(from var(--warning-fg) l c h / 0.45)` | Fact-meter unsettled cells |
| `--survey-partial` | dark `oklch(0.80 0.130 160 / 0.55)`, light `oklch(0.45 0.110 160 / 0.55)` | `oklch(from var(--success-fg) l c h / 0.55)` | Survey bar, partially verified |
| `--survey-other` | dark `oklch(0.80 0.130 160 / 0.25)`, light `oklch(0.45 0.110 160 / 0.25)` | `oklch(from var(--success-fg) l c h / 0.25)` | Survey bar, other listings with a confirmed fact |

`color-mix()` is not used, because the fallback rule does not cover it.

### 2.3 Contrast invariants (owner: `tests/tokens.test.mts`)

The test converts OKLCH to sRGB and asserts, in both themes:

- `--fg`, `--fg-muted`, `--fg-subtle`, `--success-fg`, `--warning-fg`, `--danger-fg` on `--bg`, `--bg-subtle`, `--surface`, `--surface-raised`, `--surface-hover`: ≥ 4.5:1 (30 pairs per theme; the lowest today is dark `--fg-subtle` on `--surface-hover` at 4.69).
- `--primary` on `--bg` and `--primary-fg` on `--primary`: ≥ 4.5:1. This system adds `--primary-fg` on `--primary-hover` ≥ 4.5:1, because the hover fill carries the same label (§20).
- `--focus` on `--bg` and `--surface`: ≥ 3:1 (WCAG 1.4.11).
- `--border-strong` on `--bg`, `--surface`, `--surface-raised`, `--surface-hover`: ≥ 3:1.

If a value fails, only its L changes, keeping hue and chroma. Text never relies on blur, translucency or an image behind it to reach its ratio.

### 2.4 Colour usage rules

- **Gold is a closed list of five roles** (direction §2.1): brand dot; one primary action per view (and the skip link); focus; selected/current indicators (segmented indicator, active palette row's leading rule, header nav underline, On-this-page current marker, current pagination page, checkbox/radio `accent-color`); `::selection`. The owner-file list in the guardrail is the enforcement. Gold is never used for icons, headings, numbers, highlights, borders of content, or hover.
- **Green means confirmed evidence** (a Confirmed fact, or an effective verification of Verified). The owners are `evidence.tsx` (`STYLE`, `EvidenceMark`), the Badge and Callout tone maps, `survey-bar.tsx`, the token files and tool implementations. No green ticks on features, principles, privacy notes or "Runs in your browser".
- **Warning amber** marks Not confirmed, Needs re-checking, and cautions (`PERSONAL_FREE`, `LIMITED_FREE`, data leaving the device).
- **Danger red** marks errors, the `TRIAL` caution, and filter removal on hover. It is never decorative.
- **Neutrals carry everything else.** Not verified and Unknown share `--fg-subtle`, so "never checked" looks calm and ordinary, never alarming: it is the state of 99% of the library.
- **No gradients** as fills of surfaces, text or borders. The only gradients in the product are the hard-stopped fills that draw the fact meter and are not visible as gradients.
- **Never colour alone.** Every coloured state has a word beside it (WCAG 1.4.1).

---

## 3. Typography tokens

### 3.1 Families

| Token | Stack | Use |
| --- | --- | --- |
| `--font-sans` | `var(--font-inter), ui-sans-serif, system-ui, sans-serif` | Everything not listed below |
| `--font-display` | Same stack as `--font-sans` | Existing `font-display` classes stay Inter (no visual change) |
| `--font-serif` | `var(--font-source-serif), ui-serif, Georgia, serif` | Opt-in through `font-serif` only, at the direction §2.2 sites: page `h1`s, the homepage introduction `h1`, editorial `h2`s (`Section variant="editorial"`, `/about`, `/verification`), the record-page name, `lg` standfirsts on those pages, Atlas Index group titles, the editorial collection row name |

Loaded with `next/font/google`, self-hosted, latin subset, `display: "swap"`: `Inter({ variable: "--font-inter", axes: ["opsz"] })` and `Source_Serif_4({ variable: "--font-source-serif", axes: ["opsz"], style: ["normal"] })`. Manrope is removed. If the typings reject `axes` for a family, drop it for that family only. Exactly two families ship. No monospace family: Inter `tnum` covers figures and keys.

**Never serif:** controls, labels, kickers, evidence, tables, form fields, record names inside lists, the wordmark, numbers in instruments.

**Inter features:** `cv11`, `ss01` on `body` (existing); `tnum` wherever figures are compared or aligned (counts, dates, record keys, table cells, pagination, the snapshot, the toolbar count, leaders); `case` on uppercase kickers. Utilities: Tailwind `tabular-nums` for `tnum`; `@utility kicker` (§3.3) applies `case`.

### 3.2 Scale

| Token | Size | Line height | Family and weight | Use |
| --- | --- | --- | --- | --- |
| `--text-2xs` | 0.6875rem (11px) | 1rem | Inter 500, uppercase or tabular | Kickers, record keys, `Kbd`. Never body text |
| `--text-xs` | 0.75rem | 1.125rem | Inter 400/500 | Meta lines, coordinates line, evidence lines, captions, breadcrumbs |
| `--text-sm` | 0.875rem | 1.375rem | Inter 400/500 | Record descriptions, UI labels, buttons, nav, table cells |
| `--text-base` | 1rem | 1.625rem | Inter 400 | Body prose, **all inputs, selects and textareas** (≥ 16px avoids iOS zoom) |
| `--text-lg` | 1.125rem | 1.75rem | Inter 400 or Source Serif 4 400 | Standfirsts |
| `--text-xl` | clamp(1.25rem, 1.16rem + 0.4vw, 1.375rem) | 1.3 | Inter 600 | Record names in lists, `h3` |
| `--text-2xl` | clamp(1.5rem, 1.3rem + 0.8vw, 1.875rem) | 1.2 | Inter 600, or serif 600 when editorial | `h2` |
| `--text-3xl` | clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem) | 1.12 | Source Serif 4 600 | Page `h1`, record-page name |
| `--text-display` | clamp(2.25rem, 1.6rem + 2.8vw, 3.75rem) | 1.05 | Source Serif 4 500 | Homepage introduction only |

All sizes are `rem`, so user font scaling works.

### 3.3 Typographic rules

- **Tracking:** serif display `-0.01em`; Inter headings `-0.011em`; kickers `+0.08em`. The base rule's `-0.02em` on all headings is replaced by these. No aggressive negative tracking.
- **Weights:** Inter 400 body, 500 labels and kickers, 600 headings; serif 500 at display, 600 at `3xl`. Nothing below 400; no light weights at small sizes.
- **Kicker** (`@utility kicker`, system name): `--text-2xs`, Inter 500, uppercase, `letter-spacing: 0.08em`, `font-feature-settings: "case"`, `--fg-subtle`. At most one per section. A kicker is a `<p>`, never a heading.
- **Measure:** prose ≤ `--container-prose` (46rem, about 70ch); standfirsts ≤ 38rem (`--measure-standfirst`, system name, in `tokens.css`).
- **Wrapping:** `text-wrap: balance` on headings, `pretty` on paragraphs (kept). Long identifiers (`translate="no"` product names, licence IDs, hosts) may break with `overflow-wrap: anywhere` inside narrow cells only.
- **Copy:** sentence case; curly quotes; the real ellipsis character; " · " (middle dot with spaces) as the only inline separator; "/" only in breadcrumbs; verb-first actions; no exclamation marks; counts through `formatCount` and `Intl.PluralRules("en")`.
- **Kinetic type:** none. No reveal, no split text, no animated axes. Optical sizing is static (`font-optical-sizing: auto`).

---

## 4. Spacing and layout tokens

### 4.1 Spacing scale

A 4px base, restricted to these Tailwind steps for padding, margin and gap:

| Step | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| px | 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96 |

- **Inside a record:** 4 / 8 / 12px rhythm.
- **Between grouped controls:** 8px. **Between groups:** 24px.
- **Section rhythm:** `py-16` on mobile, `py-24` from `lg`, separated by a 1px `--border` rule.
- **Dimensions are not spacing.** Heights and sizes (`h-9`, `h-10`, `h-11`, `size-11`) follow the hit-target rules (§11.4), not this scale. A `0.5` (2px) step is allowed only for optical alignment of an icon against a text baseline (`mt-0.5`), never for layout.
- Steps outside the list are a review finding.

### 4.2 Layout tokens (`tokens.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--container-content` | 80rem | Page container (kept) |
| `--container-prose` | 46rem | Prose measure (kept) |
| `--measure-standfirst` (system) | 38rem | Standfirsts |
| `--header-h` | 56px; 64px from `lg` | Sticky header height, `scroll-padding-top` |
| `--toolbar-h` | `0px` default; 48px via `html:has([data-results-toolbar])`; 88px via `html:has([data-results-toolbar][data-wrapped])` | Sticky results toolbar |
| Gutters | 16px; 24px from `sm`; 32px from `lg` | `Container` only |
| Filter sidebar | 17rem | `/resources` from `lg` |
| Record facts column | 17rem | `ResourceRecord` wide layout |
| On-this-page column | 11rem | Record page from `xl` |

`html { scroll-padding-top: calc(var(--header-h) + var(--toolbar-h, 0px) + 16px) }`.

### 4.3 Grids

- **Editorial pages** from `lg`: 12 columns; a 3-column margin column for running heads and marginalia, a 9-column content field. Below `lg` the margin column collapses into a kicker above the content.
- **Homepage introduction** from `lg`: 8 + 4 columns.
- **`/resources`** from `lg`: `17rem` sidebar + results; one-column `RecordList layout="list"` at every width.
- **Record page:** main column + aside from `lg`; plus an `11rem` On-this-page column from `xl`.
- **Alignment:** left edge of the content field everywhere. Centred stacks only for empty states, 404 and error pages.

---

## 5. Radius tokens

Set in `@theme inline`, deliberately overriding Tailwind's keys. **No radius above 10px exists.**

| Token | Value | Utility | Use |
| --- | --- | --- | --- |
| `--radius-xs` | 3px | `rounded-xs` | Badges, ledger tokens, active-filter tokens, `Kbd`, `Chip`, fact-meter cells |
| `--radius-sm` | 6px | `rounded-sm` | Buttons, inputs, selects, textareas, segmented control, monograms, Callout, compare toggle, pagination items |
| `--radius-md` | 10px | `rounded-md` | Card, popover, palette, dialog, filter-sheet top corners, tables, EmptyState, search field wrapper |
| (Tailwind literal) | 4px | `rounded` | Inline links and `<summary>` only, so their focus outline is rounded |
| (Tailwind literal) | 9999px | `rounded-full` | True circles only, per the `ROUNDED_FULL_ALLOWED` map (feature bullet dot, verification step numerals, rail station marker) |

- **Concentric nesting:** inner radius = outer radius − padding, minimum 2px. A `rounded-sm` control inside a `rounded-md` popover with 4px padding is correct (10 − 4 = 6).
- **Edges flush with the viewport have no radius:** the mobile menu panel, the FUNCTIONAL bars, the compare tray, and the bottom corners of the filter sheet.
- **Conversion order** (direction §2.5): `rounded-md` → `rounded-xs` first, then `rounded-lg` → `rounded-sm`, then `rounded-xl` → `rounded-md`. Tool implementations are exempt.
- **Banned:** `rounded-(lg|xl|2xl|3xl|4xl)` and `rounded-[…]` with any directional prefix, outside tool UIs. No pill buttons and no pill chips.

---

## 6. Border and line tokens

| Line | Width and style | Colour | Use |
| --- | --- | --- | --- |
| Hairline | 1px solid | `--rule` | Between records, snapshot cells, ledger rows, rail spine, FUNCTIONAL bottom edge, CONTENT block tops |
| Section rule | 1px solid | `--border` | Above running heads, between homepage sections, Card edge, table outer edge, popover edge |
| Interactive edge | 1px solid | `--border-strong` | Inputs, selects, secondary and outline buttons, compare toggle, active-filter tokens, rail station ring |
| Leader | 1px dotted | `--rule` | Ledger and index leaders (`aria-hidden` spacer inside `dt`) |
| Difference rule | 2px solid, `border-inline-start` | `--border-strong` | Compare "Differs" row headers (ink, not FOCUS) |
| Selected indicator | 2px solid | `--primary` | Segmented control, header nav current, On-this-page current, palette active row |
| Focus | 2px outline, 2px offset | `--focus` | All focus-visible |
| Error edge | 1px solid | `--danger` | `aria-invalid` controls |

`* { border-color: var(--border) }` in the base layer is kept, so a bare `border` class draws a component edge. `@utility hairline-t` changes to `border-top: 1px solid var(--rule)`.

---

## 7. Surface and material tokens

Five materials (direction §2.4). Components apply the utility; they never assemble backgrounds, borders, blur and shadow by hand.

| Material | Utility | Recipe | Used for | Never used for |
| --- | --- | --- | --- | --- |
| **BASE** | `material-base` | `background: var(--bg)` (or `--bg-subtle` for an alternate band). No border, shadow or texture | Page, alternate bands, record header band | Anything interactive |
| **CONTENT** | `material-content` | Opaque `--surface` or plain `--bg`; structure from `--rule` hairlines and space; an edge only where a grouped object needs one (tables, fields, Card) | Records, ledgers, tables, prose, filter panel, aside blocks, Verification panel | Translucency, blur, glow, gradient fills, shadow |
| **ELEVATED** | `material-elevated` | `--surface-raised`, 1px `--border`, `--shadow-raised` (dialogs `--shadow-overlay` plus `--scrim`) | Legend popover, command palette, filter sheet, mobile menu, compare tray | Inline cards, records, section containers |
| **FUNCTIONAL** | `material-functional` | Static `background: var(--bg)`; inside the relative-colour query `oklch(from var(--bg) l c h / 0.94)` with `backdrop-filter: blur(8px) saturate(1.1)`; bottom (or top, for bottom bars) 1px `--rule`. Fully opaque under `prefers-reduced-transparency: reduce` and `@supports not (backdrop-filter: blur(1px))` | Site header, `/resources` results toolbar, record-page mobile action bar. **Exactly three files** | Records, cards, overlays, the hero, anything not sticky or fixed |
| **FOCUS** | none (global rules) | `--focus` outline; `:target:not(#main)` flash; active listbox row (`--surface-hover` + 2px gold leading rule) | Focus-visible, anchor targets, active palette option | Persistent decoration, hover, `<main>` |

Rules: exactly one translucent recipe; blur never stacked and never decorative; text contrast always computed against the opaque value; progressive blur rejected.

---

## 8. Shadow, elevation and z-index tokens

### 8.1 Shadows (`tokens.css`)

| Token | Dark | Light (system values) | Use |
| --- | --- | --- | --- |
| `--shadow-card` | `none` | `none` | Kept as a name so existing `shadow-card` classes compile and draw nothing |
| `--shadow-raised` | `0 1px 0 oklch(0 0 0 / 0.25), 0 8px 24px -12px oklch(0 0 0 / 0.5)` | `0 1px 0 oklch(0.22 0.01 75 / 0.06), 0 8px 24px -12px oklch(0.22 0.01 75 / 0.16)` | Popover, compare tray, palette |
| `--shadow-overlay` | `0 1px 0 oklch(0 0 0 / 0.3), 0 24px 64px -16px oklch(0 0 0 / 0.7)` (system) | `0 1px 0 oklch(0.22 0.01 75 / 0.08), 0 24px 64px -16px oklch(0.22 0.01 75 / 0.22)` (system) | Modal dialogs |

Each shadow is two parts: a 1px contact line and one soft ambient layer. Shadows exist only on ELEVATED. No coloured shadows, no glows, no inner shadows.

### 8.2 Z-index

| Token | Value | Layer |
| --- | --- | --- |
| `--z-content` | 0 | Content; stretched links sit at the record's own stacking context |
| `--z-sticky` | 30 | Results toolbar, mobile action bar, compare tray, sticky sidebar |
| `--z-header` | 40 | Site header |
| `--z-overlay` | 50 | Non-dialog overlays (Legend popover fallback) |
| top layer | native | `<dialog>` via `showModal()` and `popover` |

Literal `z-40` and `z-50` classes are replaced by these. Inside a record, the compare toggle uses `position: relative; z-index: 1` to sit above the stretched link. **No toast layer and no toast system** in this pass: every outcome is shown in place (direction §2.4).

---

## 9. Motion tokens (`motion.css`)

### 9.1 Durations

Two vocabularies describe the same four tiers: **size of the change** (micro, small, medium, large) and **speed** (instant, fast, normal, slow). Each tier maps to exactly one CSS token from the direction. Specs and reviews may use either word; code uses only the token.

| Size tier | Speed tier | CSS token | ≥ `sm` | < `sm` | Used for |
| --- | --- | --- | --- | --- | --- |
| micro | instant | `--dur-instant` | 90ms | 90ms | FEEDBACK: hover, press and toggle colour changes. Also `--default-transition-duration` |
| small | fast | `--dur-quick` | 150ms | 130ms | Every EXIT; Legend popover ENTER; MOVE (segmented indicator, chevron); MORPH (`<details>`); results pending dim; mobile action bar |
| medium | normal | `--dur-move` | 220ms | 180ms | ENTER of the palette, mobile menu and compare tray |
| large | slow | `--dur-sheet` | 260ms | 220ms | ENTER of the filter sheet |
| (outside the scale) | — | `--dur-flash` | 900ms | 900ms | FOCUS `:target` fade only; never blocks interaction |

Ceiling: nothing exceeds 300ms except `--dur-flash`. Exits are always one tier shorter than or equal to their entry, so leaving never feels slower than arriving. Mobile values are redefined in `@media (max-width: 39.99rem)`.

### 9.2 Distances

| Token | ≥ `sm` | < `sm` | Use |
| --- | --- | --- | --- |
| `--dist-nudge` | 2px | 2px | Defined by the direction; no current use. A new use needs review |
| `--dist-short` | 6px | 4px | Palette (down), compare tray (up), mobile action bar (up) |
| `--dist-panel` | 24px | 16px | Mobile menu (from the right) |
| `--dist-sheet` | 40px | 24px | Filter sheet (up) |

Under `prefers-reduced-motion: reduce` every `--dist-*` is `0px`.

### 9.3 Easing

| Token | Value | Category |
| --- | --- | --- |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | MOVE, MORPH, FEEDBACK, FOCUS; also `--default-transition-timing-function` |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | EXIT |
| `--ease-spring` | `linear(0, 0.075 5%, 0.228 10%, 0.391 15%, 0.537 20%, 0.751 30%, 0.874 40%, 0.939 50%, 0.971 60%, 0.994 80%, 1)` | ENTER only. Critically damped (ω = 9), **no overshoot**, nothing bounces |
| `linear` (keyword) | — | The scroll-linked header hairline only |

### 9.4 Motion utilities

`motion-enter-palette`, `motion-enter-sheet`, `motion-enter-panel`, `motion-popover`, `motion-chevron`, `motion-scroll-hairline`, `motion-segment` (system), `motion-action-bar` (system), `motion-pending` (system), and the plain class `details.motion-details`. Components apply these and nothing else. No `transition`, `animation` or `@keyframes` outside `motion.css` (guardrail). No `transition: all`, no `transition-all`, no arbitrary `duration-[…]`, `ease-[…]` or `delay-[…]`, no `animate-*` other than `animate-none`.

---

## 10. Focus tokens

| Token | Value | Notes |
| --- | --- | --- |
| `--focus` | `var(--primary)` | ≥ 3:1 on `--bg` and `--surface` (tested) |
| `--focus-width` (system) | 2px | |
| `--focus-offset` (system) | 2px | |

```css
:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
  border-radius: 2px;   /* kept from today */
}
```

- **One indicator, never removed.** `outline-none`/`outline-hidden` are banned outside `layout.tsx` (`#main`, programmatic focus target), `search-box.tsx` (inner input; the wrapper draws the ring through `has-[input:focus-visible]:outline-2 outline-offset-2 outline-(--focus)`) and tool UIs.
- **Focus is not a border change.** `focus:border-primary` and its variants are removed with their `focus:outline-none`.
- **Never obscured.** `scroll-padding-top` (header + toolbar + 16px) and `scroll-padding-bottom` (tray 5rem, action bar 72px while visible) keep focused elements clear of sticky chrome (WCAG 2.4.11).
- **Composite widgets** draw focus on the element that receives it: the palette input carries the ring while `aria-activedescendant` marks the active row with the FOCUS row treatment; the segmented control draws the ring on the label of the focused radio (`has-[:focus-visible]`); a focusable table scroll region draws the ring on the region.
- **Forced colours:** the ring uses `Highlight`.
- **Programmatic targets** (`#main`, `#verification`, `#evidence-filter-notice`, On-this-page targets) carry `tabIndex={-1}` only where focus is moved to them by script (`#main`).

---

## 11. Breakpoints, container queries and input modes

### 11.1 Breakpoints (Tailwind v4 defaults, kept)

| Name | Min width | Design intent |
| --- | --- | --- |
| base | 0 | Phones, designed at 360px and checked at 390px |
| `sm` | 40rem (640px) | Large phones, small tablets: Evidence Gate appears, toolbar long count, mobile motion tokens end |
| `md` | 48rem (768px) | Tablets: snapshot goes to 6 columns |
| `lg` | 64rem (1024px) | Two-pane layouts: filter sidebar, record aside, sticky rail, editorial 12-column grid, header `Kbd` hint, `--header-h` 64px; filter sheet and mobile action bar end |
| `xl` | 80rem (1280px) | On-this-page becomes a sticky left column |

`2xl` is not used. The "max-width" query for mobile motion tokens is `39.99rem`. The JS check for closing the sheet uses `matchMedia("(min-width: 64rem)")`, the same value as `lg`.

### 11.2 Container queries

| Container | Query | Effect |
| --- | --- | --- |
| `record` (on `ResourceRecord`) | `min-width: 44rem` | Stacked → two-zone grid `minmax(0,1fr) 17rem` |

Records use a container query so the same component is correct in one-column lists, two-up homepage grids and the record page's "Similar listings".

### 11.3 Input-mode queries

- `@media (hover: hover)` gates every hover style (Tailwind v4's `hover:` already does this).
- `pointer-coarse:` raises dense controls to 44px (§11.4).
- `prefers-reduced-motion`, `prefers-reduced-transparency`, `forced-colors`, `prefers-color-scheme` (initial theme only, through the existing theme script) are honoured as in §17.

### 11.4 Hit targets

- Touch (`pointer: coarse`): every control ≥ 44×44px, by size or padding.
- Pointer-fine dense controls (compare toggle, pagination numbers, `sm` buttons, table links): ≥ 32px, with padding extending the target.
- Button `sm` (`h-9`, 36px) gets `pointer-coarse:h-11`. Pagination items are `size-11` and `pointer-fine:size-10`.
- Text links inside prose are exempt (WCAG 2.5.8 inline exception) but keep line height ≥ 1.375rem.

---

## 12. Iconography tokens

- **One set:** `src/components/icons/index.tsx`. 24px grid, 1.75 stroke (never changed per use), round caps and joins, `currentColor`, `aria-hidden` unless `label` is passed.
- **Rendered sizes (system):** 12 (inline `EvidenceTag`, filter "Confirmed only"), 13 (`CardEvidence` lines, form error), 14 (external-link after text, close on filter tokens, chevrons in `xs`/`sm` text), 16 (controls: buttons, search field, Callout, disclosure chevron in `sm`), 20 (header icon buttons: menu, search, theme). The Callout's 17px becomes 16. No other sizes outside tool UIs.
- **Colour:** icons take the text colour of their label, except evidence marks, which take `STYLE`'s colour. No gold icons.
- **Permitted roles only** (direction §2.6): (1) evidence marks, always with the word, only through `EvidenceMark`; (2) unlabelled controls (search, menu, close, theme), each with an `aria-label`; (3) direction and affordance (external-link after outbound links, chevron-down on disclosures, arrow-right on "see all" links, arrow-left/right on Previous/Next); (4) warnings and errors (alert-triangle in form errors, error states, and the record-page status Callout for cautions).
- **Reserved glyphs:** check-circle, help-circle, clock, minus-circle mean only the five evidence reasons. Free-status and verification badges are word-only.
- **Removed:** hero icons, nav icons in the mobile menu, audience and group icons, alternative chips' `refresh-cw`, per-limitation alert-triangles, empty-state discs, decorative eyebrow icons, the inferred-filter `bolt`, `/free-status` principle ticks, record-page "library"/"globe" list icons, the `repo` and `flag` icons inside buttons whose text already says "Source code" or "Report".
- **Icon placement:** leading icons sit 8px (`gap-2`) before their label in controls and 4–6px (`gap-1`/`gap-1.5`) in `xs` text; trailing affordance icons sit 4px after. Icons align to the first line's cap height with `mt-0.5` when text wraps.
- **No emoji, no "AI sparkle", no decorative 3D, no brand logos.** Monograms (`ResourceLogo`) are typographic, not icons: square, `--radius-sm`, Inter 600 `tnum`, `--surface-raised` fill, 1px `--border`; 32px in records, 48px on the record page.

---

## 13. The state model

Every interactive component specifies all eleven states below. "n/a" is allowed only with a reason. A missing state is a review blocker (direction §2.7).

| State | Global treatment | ARIA / DOM | Notes |
| --- | --- | --- | --- |
| **Default** | As specified per component | — | |
| **Hover** | Raises contrast only: text `--fg-muted` → `--fg`; fill → `--surface-hover`; interactive edge → `--fg-subtle`; links underline colour → `--fg`. `--dur-instant` | `@media (hover: hover)` only | Never reveals information that is otherwise hidden. Never moves, scales, glows or lifts |
| **Focus** | Global `:focus-visible` outline (§10) | `:focus-visible` | Also triggers `:focus-within` styling equal to hover on records and rows |
| **Pressed** | Fill `--fill-pressed` (neutral) or `--primary-pressed` (primary). No scale, no bounce, no shadow change | `:active`; toggles also `aria-pressed="true"` | Applied instantly on press, eased out on release |
| **Disabled** | `opacity: 0.5`, `cursor: not-allowed`, no hover | Native `disabled`, or `aria-disabled="true"` when the control must stay focusable to explain itself | A reason in text wherever the user could wonder why (zero-count filters, "Comparison is full, 3 of 3", "Pick at least 2") |
| **Loading** | Only where a real wait exists. The waiting region gets `aria-busy="true"` and `opacity: 0.6` (`motion-pending`), or a static skeleton mirroring the final layout after a 150ms show-delay and held for at least 300ms | `aria-busy`, a polite `role="status"` sentence | **No spinners and no shimmer**: both are infinite animations (§15.3). A control that triggered the wait is disabled for its duration and keeps its label |
| **Success** | The outcome is shown **in place, in neutral text**: the new state itself (results updated, sheet closed, item added to the tray, "Ready to file"). No green, no checkmark, no toast | Polite live region when the change is not where focus is | Green is reserved for confirmed evidence (§2.4). An evidence "Confirmed" is a data state, not a UI success |
| **Error** | Inline, in text: alert-triangle + message in `--danger-fg`, a 1px `--danger` edge on the control, and a recovery action ("Try again", a link, or the field to correct) | `aria-invalid="true"`, `aria-describedby` to the message; `role="alert"` only for errors that change a decision | Never a colour-only signal, never a modal, never a toast |
| **Selected** | Gold indicator (2px rule or underline, or `accent-color` for native inputs), text `--fg` at weight 500 | `aria-checked`, `aria-selected`, `aria-pressed` or `aria-current` | Gold role 4. Selection is always also expressed in ARIA and in text weight |
| **Expanded** | Chevron rotated 180° (`motion-chevron`); content revealed with MORPH where supported | Native `<details open>`, or `aria-expanded="true"` on the invoker | |
| **Collapsed** | Chevron at 0°; content removed from the accessibility tree (native `<details>`, or unmounted) | `aria-expanded="false"` | Content collapsed by default never holds a smoke-test contract that expects it visible, except the closed "View verification evidence", which is a contract |

**State precedence** when several apply: disabled > error > loading > selected > pressed > focus > hover > default. Focus is always drawn, even on a disabled-but-focusable (`aria-disabled`) control.

---

## 14. Component specifications

Each component lists its file, role, anatomy and every state. Each new file starts with the header comment: **when to use**, **when not to use**, **keyboard model**, **evidence obligations** (direction §2.7).

### 14.1 Primitives

#### Button (`components/ui/button.tsx`, `buttonClasses`)

Anatomy: optional 16px leading icon, label (Inter 500 `sm`, `lg` uses `base`), `rounded-sm`, `gap-2`. Sizes: `sm` `h-9 px-3` (`pointer-coarse:h-11`), `md` `h-11 px-4`, `lg` `h-12 px-6`. Variants: **primary** (gold fill, at most one per view), **secondary** (`--surface-raised`, 1px `--border-strong`), **outline** (transparent, 1px `--border-strong`), **ghost** (transparent, `--fg-muted`), **danger** (no current use outside tools; `--danger-soft` fill, `--danger-fg` text, 1px `--danger` edge, replacing today's white-on-red so it follows the token system).

| State | Treatment |
| --- | --- |
| Default | As per variant |
| Hover | primary → `--primary-hover`; secondary and outline → `--surface-hover` fill, edge `--fg-subtle`; ghost → `--surface-hover`, text `--fg` |
| Focus | Global outline |
| Pressed | primary → `--primary-pressed`; others → `--fill-pressed` |
| Disabled | Native `disabled`, or `aria-disabled` with `pointer-events: none` and a reason in adjacent text (compare "Pick at least 2") |
| Loading | `aria-disabled="true"` for the duration of the wait, label unchanged; the busy state lives on the affected region, not on the button. No spinner |
| Success | n/a on the button: the outcome is shown where it happens (sheet closes, results update) |
| Error | n/a on the button: the error is shown beside the operation it belongs to |
| Selected | n/a: a button that holds state is a toggle (Compare toggle) or a segmented control |
| Expanded / Collapsed | Invokers of menus and sheets (`Open menu`, `Filters · 3`) carry `aria-expanded` and `aria-controls` only while JS manages them; visual unchanged, because the opened surface is the indicator |

#### Text link (`@utility link-inline`)

`--fg` text, 1px underline in `--border-strong`, `text-underline-offset: 0.2em`, `rounded` (4px) for its focus outline. Navigation links in chrome (header, footer, breadcrumbs, tags, index rows) are text without underline in `--fg-muted`, underlined on hover.

| State | Treatment |
| --- | --- |
| Default | As above |
| Hover | Underline colour → `--fg`; chrome links: text → `--fg`, underline appears |
| Focus | Global outline |
| Pressed | Underline thickness 2px for the press |
| Disabled | n/a: a link that cannot be followed is rendered as text (zero-count subjects in the Atlas Index, "Planned" tools) |
| Loading | n/a: navigation is static and client-side; Next keeps the current page until the next one renders |
| Success / Error | n/a |
| Selected | `aria-current="page"` (header nav, pagination) or `"location"` (On this page): 2px gold underline, `--fg`, weight 500 |
| Expanded / Collapsed | n/a |

External links append the 14px external-link icon and sr-only " (opens in a new tab)" (existing `ExternalLink`).

#### Text input, textarea, select (`components/ui/field.tsx`)

Anatomy: label (Inter 500 `sm`, `--fg`), "(optional)" or a required marker with sr-only "(required)", optional hint (`xs`, `--fg-muted`), control (`rounded-sm`, 1px `--border-strong`, `--bg` fill, `px-3 py-2.5`, **`text-base`**), error line. Select adds a 16px chevron-down at the right, `pointer-events: none`.

| State | Treatment |
| --- | --- |
| Default | As above; placeholder `--fg-subtle` |
| Hover | Edge → `--fg-subtle` |
| Focus | Global outline; edge unchanged |
| Pressed | n/a (text entry) |
| Disabled | Native `disabled`, `opacity: 0.6` (kept), `cursor: not-allowed` |
| Loading | n/a: no field validates asynchronously |
| Success | n/a: valid fields look like default; there is no green "valid" state |
| Error | Edge `--danger`; message under the control: 13px alert-triangle + text in `--danger-fg`; `aria-invalid`, `aria-describedby`; on submit, focus moves to the first invalid field (existing) |
| Selected | Select: the chosen option is the displayed value (native) |
| Expanded / Collapsed | Select: native picker |

#### Checkbox and radio (native)

Native inputs, `size-4`, `accent-color: var(--primary)` set once in `globals.css`. The label and input form one click target ≥ 44px tall on touch through row padding.

| State | Treatment |
| --- | --- |
| Default | Native unchecked |
| Hover | Row text → `--fg` |
| Focus | Global outline on the input |
| Pressed | Native |
| Disabled | Native `disabled`; row `opacity: 0.5`; the count "0" stays visible as the reason (filters) |
| Loading | n/a on the input; filter navigation pending sets the results region busy |
| Success / Error | n/a |
| Selected | Native checked in gold (`accent-color`); the row label becomes weight 500 |
| Expanded / Collapsed | n/a |

#### Search field (`features/search/components/search-box.tsx`)

Anatomy: wrapper `[data-search-field]` (`rounded-md`, 1px `--border-strong`, `--bg`), 16px search icon, `<input type="search">` (`text-base`, inner `outline-none`), submit button (primary on the homepage introduction, secondary elsewhere). One fixed placeholder: "Try “free PDF tools” or “alternative to Photoshop”". Suggestions are text links separated by " · ".

| State | Treatment |
| --- | --- |
| Default | As above |
| Hover | Wrapper edge → `--fg-subtle` |
| Focus | Keyboard: outline on the wrapper (`has-[input:focus-visible]`); pointer: caret only |
| Pressed | Submit button per Button |
| Disabled | n/a: search is always available |
| Loading | n/a: submission is a GET navigation; on `/resources` the results region carries the pending state |
| Success | n/a: the results page is the outcome |
| Error | n/a: any query is valid; an empty submit lists everything |
| Selected / Expanded / Collapsed | n/a: no autocomplete popup (the palette is the jump surface) |

#### Sort select (`sort-select.tsx`)

A native select with a visible `<label>`, `rounded-sm`, 1px `--border-strong`, `max-width: 9rem` below `sm`. States as the select above, plus **Loading**: `disabled` while `isPending` so it cannot fire twice, and the results region dims.

#### Segmented control (`components/ui/segmented-control.tsx`)

A `<fieldset>` with a `legend` (visible or sr-only) and native radios visually hidden inside labelled segments. Track: 1px `--border-strong`, `rounded-sm`, `--bg`. Indicator: one absolutely positioned element per control, 2px gold bottom rule, moved with `transform: translateX(calc(var(--i) * 100%))` (`motion-segment`); `--i` is set inline. Only use: compare "All rows / Only differences".

| State | Treatment |
| --- | --- |
| Default | Segment labels `--fg-muted`, Inter 500 `sm` |
| Hover | Unselected label → `--fg`, fill `--surface-hover` |
| Focus | Outline on the focused segment's label |
| Pressed | `--fill-pressed` on the segment |
| Disabled | Whole control `opacity: 0.5`, radios `disabled`, `disabledReason` rendered as text after the control ("These listings match on every compared field") |
| Loading | n/a: the change is local |
| Success | The table updates in place; nothing else |
| Error | n/a |
| Selected | Label `--fg` weight 500; gold indicator under it; `checked` |
| Expanded / Collapsed | n/a |

Keyboard: native radio group (Tab into the group, arrows move and select).

#### Kbd (`components/ui/kbd.tsx`)

`<kbd>`, `--text-2xs`, `tnum`, `rounded-xs`, 1px `--border`, `px-1`, `--fg-subtle`. Text: "⌘K" or "Ctrl K" (the ⌘ symbol is a keyboard glyph, not an emoji; it is outside `Extended_Pictographic`). Renders nothing before hydration. Static: no interactive states (all n/a, because it is not interactive).

#### Badge and ledger token (`components/ui/badge.tsx`)

Anatomy: `rounded-xs`, 1px edge, `px-2 py-0.5 text-xs` (`sm`) or `px-2.5 py-1 text-sm` (`md`), Inter 500, word-only for status. Tones: **neutral** (and `primary`, `info`, mapped to it) `--border` edge, `--surface` fill, `--fg-muted` text; **success**, **warning**, **danger**: `-soft` fill, `-fg` text, `/30` border. `appearance="ledger"`: same, with a transparent fill when neutral. Tone gating lives in `status-badges.tsx` only.

States: Default only. Hover, Focus, Pressed, Disabled, Loading, Success, Error, Selected, Expanded, Collapsed are **n/a: a badge is a static label, never a control**. A badge inside a link takes the link's states.

#### Chip (`badge.tsx`)

`rounded-xs`, `--surface-raised`, `xs`, `--fg-muted`. Static label; all interactive states n/a. Tags and alternatives no longer use chips (text links).

#### Callout (`components/ui/callout.tsx`)

Anatomy: `rounded-sm`, 1px edge, `px-4 py-3.5`, optional 16px icon (`icon?: IconName | null`; `null` renders none), title (Inter 500, `--fg`), body (`--fg-muted`), optional `id` on the root. Tones: neutral (1px `--border`, `--surface-raised` fill), warning, danger; success is only reachable through evidence-gated callers; primary and info map to neutral.

States: Default. **Error** is the danger tone used for real errors, with `role="alert"` when `assertive`. **FOCUS** when it is the `:target` (`#evidence-filter-notice`): the flash returns to its own fill. Hover, Pressed, Disabled, Loading, Success, Selected, Expanded, Collapsed: n/a, because a callout is not a control; links inside it follow Text link.

#### Card (`components/ui/card.tsx`)

Only where a grouped object needs an edge: tool entries and definition/form panels. CONTENT: 1px `--border`, `--radius-md`, `--surface`, no shadow. `interactive` cards contain one stretched link.

| State | Treatment |
| --- | --- |
| Default | As above |
| Hover | Fill → `--surface-hover`, edge → `--border-strong` |
| Focus | The inner link draws the outline; the card gets `:focus-within` equal to hover |
| Pressed | `--fill-pressed` |
| Disabled | n/a: a planned tool is a non-interactive card with the word "Planned" |
| Loading / Success / Error | n/a: cards are static server output |
| Selected / Expanded / Collapsed | n/a |

#### Empty state (`components/ui/empty-state.tsx`)

Text-led, centred, `rounded-md`, 1px dashed `--border`, `--bg-subtle`, `px-6 py-10/16`. Title (Inter 500 `base`), description (`sm`, `--fg-muted`, ≤ 28rem), one next-step action. No icon disc. Copy says what would fill it and what to do next ("Nothing matched" plus "Clear filters"; "Selections appear here once maintainers mark entries"). Static; states n/a except the contained action.

#### Skeleton (`components/ui/skeleton.tsx`)

Static `--surface-raised` blocks, `rounded-xs` for text lines, `rounded-sm` for monograms. **`animate-pulse` is removed.** Used only for the palette's three placeholder rows (direction §7 row 33). The wrapper carries `aria-busy="true"` and a polite sr-only "Loading…" status. Shown after 150ms, held ≥ 300ms. `ResourceCardSkeleton` and `ResourceGridSkeleton` are deleted if unused after `ResourceCard` goes; otherwise renamed and reshaped to the record's anatomy.

#### Disclosure (native `<details>`)

`<summary>`: `list-none`, marker hidden, label + 12–16px chevron-down (`motion-chevron`), `rounded` for the focus outline. Panel: CONTENT. Class `motion-details` where MORPH applies (filter groups, "How we know", "View verification evidence").

| State | Treatment |
| --- | --- |
| Default | Summary `--fg-subtle` ("How we know") or `--fg` Inter 500 (filter groups) |
| Hover | Summary text → `--fg`, underline for text-style summaries |
| Focus | Outline on the summary |
| Pressed | Summary `--fill-pressed` for block summaries; none for inline text summaries |
| Disabled | n/a: a disclosure with nothing inside is not rendered |
| Loading / Success / Error | n/a: content is static |
| Selected | n/a |
| Expanded | `open`; chevron 180°; content height animates (MORPH) where `interpolate-size` is supported, instant elsewhere |
| Collapsed | Default for "How we know" and "View verification evidence" (contract); filter groups default open |

#### Dialog (`components/ui/dialog.tsx`)

Native `<dialog data-ef-modal role="dialog" aria-modal="true">`, mounted only while open, controlled by `open`, signatures and close semantics exactly as direction §3.10–§3.11. ELEVATED; `::backdrop` `--scrim`. Variants:

| Variant | Geometry | ENTER | EXIT |
| --- | --- | --- | --- |
| `panel-right` (mobile menu) | Full height, `min(20rem, 100vw - 3rem)` wide, flush right, no radius | `--dur-move`, `--ease-spring`, from `--dist-panel` right + opacity | `--dur-quick`, `--ease-exit`, mirrored |
| `sheet-bottom` (filters) | `92dvh`, full width, top corners `--radius-md`, flush bottom | `--dur-sheet`, `--ease-spring`, from `--dist-sheet` below + opacity | `--dur-quick`, mirrored |
| `palette-top` (palette) | `min(40rem, 100vw - 2rem)`, top 12vh, `--radius-md`; on mobile full width with 0.5rem inset at the top | `--dur-move`, `--ease-spring`, from `--dist-short` above + opacity | `--dur-quick`, mirrored |

| State | Treatment |
| --- | --- |
| Default (open) | As above; focus on `initialFocusRef` or the first focusable element |
| Hover / Pressed | n/a on the surface; its controls follow their own specs |
| Focus | Focus is held inside by `showModal()`; Tab cycles; the scrim is not focusable |
| Disabled | n/a |
| Loading | Content-level (palette skeleton) |
| Success | Closing is the success path for sheet and menu; focus returns to the invoker |
| Error | `showModal()` failure: unmount and fall back (palette → `router.push("/resources/")`), dev-only warning (direction §12.1) |
| Selected | n/a |
| Expanded | Mounted and `[open]` |
| Collapsed | Unmounted. Native browser close skips EXIT and unmounts at once |

Scroll lock: `html:has(dialog[data-ef-modal][open]) { overflow: hidden }` with `scrollbar-gutter: stable` on `html`.

#### Popover: Legend (`features/resources/components/legend.tsx`, `variant="popover"`)

Trigger: `<button type="button" popoverTarget={id}>` with the accessible name "What the evidence marks mean", styled as a ghost `sm` text button reading "Legend" with a 14px chevron-down. Popover: `popover="auto"`, ELEVATED, `rounded-md`, `p-4`, width `min(22rem, 100vw - 2rem)`, a heading "How to read the marks", the five rows. Anchored with inline `anchorName`/`positionAnchor` and `position-area: block-end span-inline-end`; fallback `position: fixed; inset: auto 1rem 1rem 1rem`. Fixed ids: `legend-filters`, `legend-facts`, `legend-compare`.

| State | Treatment |
| --- | --- |
| Default | Trigger `--fg-muted` |
| Hover | Trigger `--fg`, `--surface-hover` |
| Focus | Outline on the trigger; inside the open popover, the outline on whichever element is focused |
| Pressed | `--fill-pressed` |
| Disabled | n/a: the legend is always available |
| Loading / Success / Error | n/a: static, server-rendered |
| Selected | n/a |
| Expanded | `:popover-open`; trigger chevron rotated; ENTER `--dur-quick` opacity only (`motion-popover`) |
| Collapsed | Light dismiss and Escape are native; EXIT `--dur-quick` opacity with `display`/`overlay` discrete |

#### Breadcrumbs (`layout.tsx`)

`<nav aria-label="Breadcrumb"><ol>`, `xs`, `--fg-subtle`, separators "/" in `--fg-subtle` (`aria-hidden`), the current item `--fg` with `aria-current="page"`. Links follow Text link (chrome); other states n/a.

#### Pagination (`pagination.tsx`)

Previous/Next: outline buttons `h-10`, `rounded-sm`, with arrow icons. Page numbers: `size-11` (`pointer-fine:size-10`), `rounded-sm`, `tnum`, 1px `--border`. Gap "…" in `--fg-subtle`, `aria-hidden`.

| State | Treatment |
| --- | --- |
| Default | Numbers `--fg-muted` |
| Hover | `--surface-hover`, `--fg` |
| Focus | Outline |
| Pressed | `--fill-pressed` |
| Disabled | Previous on page 1 and Next on the last page are not rendered (existing) |
| Loading | The results region is busy during client navigation |
| Success / Error | n/a |
| Selected | Current page: `aria-current="page"`, `--fg` weight 600, 2px gold bottom rule inside the cell, no gold fill (gold role 4 as an indicator, not a fill; §20) |
| Expanded / Collapsed | n/a |

#### Data table (`alternative-comparison.tsx`, compare table, survey-by-group table)

A real `<table>` with a `<caption>`, inside `role="region" tabIndex={0} aria-label="…"` when it can scroll. CONTENT: outer 1px `--border`, `rounded-md` on the region, ruled rows (`--rule`), `th` Inter 500 `xs` kicker style for column heads, `tnum` cells, `px-3 py-2.5`. First column sticky at `inset-inline-start: 0` with `--surface` fill when the table scrolls horizontally. Fact cells keep `data-fact` and an `EvidenceTag`.

| State | Treatment |
| --- | --- |
| Default | As above |
| Hover | Row fill `--surface-hover` (pointer-fine), as reading aid only |
| Focus | Region outline when focused for scrolling; links inside follow Text link |
| Pressed / Disabled | n/a |
| Loading | Compare table only (§14.6) |
| Success | n/a |
| Error | Compare table only (§14.6) |
| Selected | n/a |
| Expanded / Collapsed | Compare "Only differences" removes identical rows from the DOM |

### 14.2 Chrome

#### Skip link (`site-header.tsx`)

First focusable element; visually hidden until focused, then shown top-left as a primary `sm` button (gold role 2). Target `#main`, which never tints (`:target:not(#main)`). States: Default hidden; Focus visible with outline; Hover/Pressed per primary Button; others n/a.

#### Site header (`site-header.tsx`)

FUNCTIONAL + `motion-scroll-hairline`, `--z-header`, height `--header-h`, full width, no radius, no floating pill. Left: wordmark ("Everything" + gold "." + "Free", Inter 600, no tile). Centre/left: five text nav items (`nav-links.tsx`). Right: palette trigger, theme toggle, Submit (secondary `sm`, from `sm`), menu button (below `lg`). The surface itself has no interactive states; its hairline is transparent at scroll 0 and `--rule` after 64px where scroll timelines exist, always visible otherwise.

#### Header nav item (`nav-links.tsx`)

`sm`, Inter 500, `--fg-muted`, `h-11` hit area. Hover `--fg`; Focus outline; Pressed `--fill-pressed` on the hit area; Selected `aria-current="page"`, `--fg`, 2px gold underline at the header's bottom edge; Disabled, Loading, Success, Error, Expanded, Collapsed n/a (plain links).

#### Palette trigger (`palette-trigger.tsx`)

`<Link href="/resources/">` with `aria-label="Search resources"` and `aria-keyshortcuts`. Below `lg`: 20px search icon in a 44px ghost icon button. From `lg`: icon + "Search" + `Kbd`, outline-style `h-9` (`rounded-sm`, `--border-strong`, `--fg-muted`, `min-width: 14rem`).

| State | Treatment |
| --- | --- |
| Default | As above; without JS it is a working link to `/resources/` |
| Hover | `--fg`, `--surface-hover`; `pointerenter` prefetches the index |
| Focus | Outline; `focus` prefetches the index |
| Pressed | `--fill-pressed` |
| Disabled | n/a |
| Loading | n/a on the trigger; the palette shows its skeleton |
| Success | The palette opens |
| Error | `showModal()` failure navigates to `/resources/` |
| Selected | n/a |
| Expanded / Collapsed | `aria-expanded` mirrors the palette's open state after hydration |

#### Theme toggle (`theme.tsx`, contract `button[aria-label^="Switch to"]`)

44px ghost icon button, sun/moon 20px, `aria-label` "Switch to light theme" / "Switch to dark theme". Hover, Focus, Pressed per ghost Button. Selected: n/a (the label states the action, and the page is the state). Loading: renders after hydration, as today. Disabled, Success, Error, Expanded, Collapsed: n/a.

#### Mobile menu (`mobile-nav.tsx` on `Dialog panel-right`)

Invoker: 44px ghost icon button `aria-label="Open menu"`. Panel: `h2` sr-only "Menu", Close button (`aria-label="Close menu"`), primary nav as a ruled list of `base` text links (`h-12` rows, no icons), then secondary links (`sm`, `--fg-muted`), then Submit (secondary, full width). States follow Dialog; the current item carries `aria-current="page"` and is shown in ink, `--fg` weight 600 with a 2px `--fg` leading rule, because `mobile-nav.tsx` is not on the gold owner list (§20). Focus returns to "Open menu" after close (contract).

#### Footer (`site-footer.tsx`)

BASE `--bg-subtle`, a 1px `--border` top rule, four text columns (kicker headings, `sm` links in `--fg-muted`), colophon in `xs` `--fg-subtle`: "Everything.Free, a Quilonix project. Released as open source. Set in Source Serif 4 and Inter." No social icons. Links follow Text link (chrome).

#### Section and PageHeader (`components/ui/layout.tsx`)

- **Section** `variant="default"`: `h2` Inter 600 `2xl`, optional description `sm/base` `--fg-muted`, optional action (SectionLink "See all" with arrow-right). `variant="editorial"`: from `lg` the kicker sits in the 3-column margin, the serif `h2` and one-sentence standfirst in the 9-column field; a 1px `--border` rule above. At most one kicker.
- **PageHeader**: BASE `--bg-subtle` band, 1px `--border` bottom, optional kicker (replaces `eyebrow` icon rows), serif `h1` `3xl`, standfirst `lg` ≤ 38rem.

Static; SectionLink follows Text link (chrome).

### 14.3 Evidence components

These components are the trust surface. They are the most reserved in styling (no fills, no motion), and they are the only places evidence marks and evidence colour come from.

#### EvidenceMark (`evidence.tsx`, new export)

`aria-hidden` icon at 12, 13 or 16px, glyph and colour from `STYLE`: confirmed check-circle `--success-fg`; unresolved help-circle `--warning-fg`; stale clock `--warning-fg`; not-checked minus-circle `--fg-subtle`; not-established help-circle `--fg-subtle`. Never rendered without its word nearby. Static: all interactive states n/a.

#### EvidenceTag (`evidence.tsx`)

Mark + `evidenceLabels[reason]`, `xs` Inter 500 in the mark's colour, `gap-1`, `data-evidence={state}` and `data-evidence-reason`. Static label: interactive states n/a.

#### CardEvidence (`evidence.tsx`)

`<ul aria-label="What has been checked">`, at most one line per reason, `xs`, line height 1.125rem, 13px mark, group label Inter 500 (`--fg` for Confirmed, `--fg-muted` otherwise), items in `--fg-muted`/`--fg-subtle`. Logic unchanged. Static.

#### FactValue and "How we know" (`evidence.tsx`)

Value phrasing: confirmed in `--fg`; recorded but unchecked "Recorded as {value}" in `--fg-muted`; no value "Unknown" in `--fg-muted`; `EvidenceTag` beside it. "How we know" is a Disclosure (§14.1) whose panel is CONTENT (`rounded-sm`, 1px `--border`, `--bg-subtle`, `px-2.5 py-2`), listing explanation, the record's evidence text, "Source: {host} · read {date}" (`<time>`), "Checked by {handle} · {month year}". The source link uses `link-inline` (no gold hover).

#### Legend (`legend.tsx`, `variant="full"`)

Five rows, each: 16px `EvidenceMark`, the label (Inter 500 `sm`, `--fg`, `min-width: 9rem`), the one-line explanation (`sm`, `--fg-muted`). Kicker "How to read a listing". Rows separated by `--rule` hairlines. Static. Popover variant: §14.1.

#### Fact meter (`fact-meter.tsx`, `materials.css`)

One `<span class="fact-meter" style="--c:3;--u:1;--n:11">`, `inline-size: calc(var(--n) * 6px + (var(--n) - 1) * 2px)` (system: 6px cells, 2px gaps), `block-size: 8px`, `rounded-xs` on cells via the mask. Fill order: confirmed `--success-fg`, unsettled `--meter-unsettled`, rest `--rule`. `aria-hidden` unless `labelled`, which adds the visible sentence "{c} of {n} facts confirmed[ · {u} checked, not settled]" in `xs` `tnum`. Forced colours: `forced-color-adjust: none` plus a 1px `CanvasText` border. Static: never animated, never called a score.

#### Survey bar (`survey-bar.tsx`)

`<div aria-hidden="true">` of four spans with inline `--w`; non-zero segments ≥ 2px; fills `--success-fg`, `--survey-partial`, `--survey-other`, `--rule`. Height 8px (`sm`) or 12px (`lg`), no radius on segments, `rounded-xs` on the track. The visible sentence beside it carries every number. Static, never animated in.

#### Coordinates line (`coordinates-line.tsx`)

`xs`, `tnum`, `--fg-muted`, parts in fixed order subject · type · platforms · licence, separators " · " in `--fg-subtle`, each part `white-space: nowrap`, absent parts omitted, sr-only "Available on:" before platforms, `translate="no"` on product names and licence IDs. Returns `null` when every part is absent. Static.

#### Facts ledger (`resource-facts.tsx`)

`#facts-heading` `h2` "Facts", then `div > dl > div > dt/dd` (structure unchanged). Each row: `dt` (`sm`, `--fg-muted`) containing a flex dotted leader (`aria-hidden`, 1px dotted `--rule`), `dd` right-aligned from `sm` with `FactValue`. Below `sm`, leaders hidden and values stack. Rows separated by `--rule`. The Legend popover trigger (`legend-facts`) sits beside the heading.

#### Record key

Kicker "Record · {slug}", `tnum`, `--fg-subtle`. Never styled as a serial number (no monospace box, no "#").

### 14.4 Records and the record page

#### ResourceRecord and RecordList (`resource-record.tsx`)

Anatomy and DOM order exactly as direction §3.1 (`data-zone="main"` then `data-zone="facts"`; the compact snapshot's free-status token is the first `[data-fact]`). CONTENT, no box; 1px `--rule` top hairline except the first; `p-4` (system), container `record`, wide layout `minmax(0,1fr) 17rem` with `gap-6`. Head: 32px monogram, name `h3` Inter 600 `xl` with the stretched link, coordinates line. Description `sm` `--fg-muted`. Catch line: kicker "Catch" + limitation `sm`. Matched line (search only) `xs` `--fg-subtle`. Foot: `xs` `tnum` `--fg-subtle` "Record · {slug} · {last checked} · {verification}" + fact meter + `compareSlot`. In `layout="list"`: `content-visibility: auto; contain-intrinsic-size: auto 168px`.

| State | Treatment |
| --- | --- |
| Default | As above |
| Hover | Row fill `--surface-hover`; name underlined |
| Focus | Outline on the name link; row `:focus-within` equal to hover |
| Pressed | Row fill `--fill-pressed` while the link is active |
| Disabled | n/a: every listed record is navigable |
| Loading | n/a per record; on `/resources` the list region dims while a transition is pending |
| Success / Error | n/a |
| Selected | When its compare toggle is pressed: the toggle shows the Selected state; the row itself is not tinted (no persistent decoration) |
| Expanded / Collapsed | n/a: records do not expand |

#### ResourceSnapshot (`resource-snapshot.tsx`)

**Full:** ruled grid inside the record `<header>`, 3 columns (6 from `md`), cells separated by `--rule`, `py-3 px-3`, kicker label, value line (`sm`), `EvidenceTag` under it; cell 6 holds the labelled fact meter. Phrasing exactly as direction §3.3. **Compact:** `FreeStatusBadge variant="token"` and, when applicable, `OpenSourceBadge variant="token"`, ledger appearance, word-only. Static: interactive states n/a.

#### Provenance Rail (`provenance-rail.tsx`)

`<section aria-labelledby="provenance-heading">`, `h2` Inter 600 `sm`, `<ol>` of five stations; spine 1px `--rule` (`ol::before`); each marker a 7px ring, 1px `--border-strong`, transparent, `rounded-full`, `aria-hidden`, identical for every station. Station: kicker label `<p>`, value `sm`, `EvidenceTag` or word-only `VerificationBadge`, links `link-inline`. Sticky from `lg` at `top: calc(var(--header-h) + 1rem)` inside a `lg:flex-1` wrapper. Static apart from its links; no "done" ticks, no progress, no "complete" state.

#### On this page (`on-this-page.tsx`)

`<nav aria-label="On this page">` with only the sections that render. From `xl`: sticky `11rem` left column, `sm` links stacked, 2px leading rule track in `--rule`. Below `xl`: inline wrapped list separated by " · ". Links follow Text link (chrome); **Selected** (`aria-current="location"`, from one `IntersectionObserver`) shows `--fg` weight 500 with a 2px gold leading rule (or underline inline). Without JS or the observer, no current marker. Activating a link uses NAVIGATION (smooth anchor scroll) and FOCUS (`:target` flash on the heading).

#### Mobile action bar (`mobile-action-bar.tsx`)

Below `lg`, FUNCTIONAL fixed bottom bar, `--z-sticky`, top hairline `--rule`, `px-4 py-3`, `padding-bottom: max(0.75rem, env(safe-area-inset-bottom))`, one full-width primary "Open {host}". Hidden until the header action group leaves the viewport.

| State | Treatment |
| --- | --- |
| Default (visible) | `data-visible`; `main` and `scroll-padding-bottom` gain 72px + safe area |
| Hover / Focus / Pressed | Per primary Button |
| Disabled | n/a: the URL always exists |
| Loading / Success / Error | n/a: an outbound link |
| Selected | n/a |
| Expanded | Appears with `motion-action-bar`: `--dur-quick`, `--ease-standard`, from `--dist-short` below + opacity |
| Collapsed | Hidden with the same tokens reversed; `visibility: hidden` after, so it leaves the tab order |

#### Verification panel (`verification-panel.tsx`)

CONTENT `<section id="verification" aria-labelledby="verification-heading">`, `--rule` top hairline, `h2` "Verification" a direct child; summary label word-only; ratio "{x} of {y} required checks recorded as confirmed" only when records exist; closed `<details>` "View verification evidence" (Disclosure); rows with `EvidenceMark`; the awaiting-sign-off note as neutral CONTENT. The panel is the `:target` of the rail link (FOCUS flash).

### 14.5 Search and discovery

#### Library introduction (`features/home/components/hero.tsx`)

Left-aligned 8 + 4 composition on `--bg`, no background graphics. Running head kicker "Everything.Free · Library index"; `h1` serif `--text-display` 500 with computed counts in `tnum`, same colour and weight as the sentence; standfirst `lg` `--fg-muted`; search field with a primary submit; `Kbd` hint after hydration; "Try:" examples as " · "-separated links. Right column: full Legend and the `sm` Survey bar with its sentence and "How verification works" link. Zero-listing and zero-confirmed copy per direction §4.1. Static apart from the search field and links.

#### Command palette (`command-palette.tsx`)

Dialog `palette-top`. Top: combobox input (`text-base`, no border, `h-12`, 16px search icon, `outline-none` is **not** used: the input draws the ring on keyboard focus, which is the initial focus), visually hidden title "Jump to a listing or page". Body: listbox of groups; group label is a kicker; rows `h-11`, `px-3`, name `sm` `--fg` with matched span as `<mark>` (`--fg`, underline, no fill), secondary line `xs` `--fg-muted` "{subject} · {free status}", trailing fact meter (`aria-hidden`) and sr-only count. Footer row (system): `xs` `--fg-subtle` key hints "Arrow keys to move · Enter to open · Esc to close", with the key names in `Kbd` (words, not arrow glyphs, so the emoji guardrail never has to judge them), hidden below `sm`. Last row always "Search the full library for “{q}”".

| State | Treatment |
| --- | --- |
| Default (empty query) | "Go to" group only |
| Hover | Pointer over a row makes it active (same as keyboard), `--surface-hover` |
| Focus | Ring on the input; active row: `--surface-hover` + 2px gold leading rule, `aria-selected="true"` via `aria-activedescendant` |
| Pressed | Active row `--fill-pressed` on pointer down |
| Disabled | n/a: rows are only rendered when they navigate |
| Loading | Index not yet arrived after 150ms: three static skeleton rows (§14.1 Skeleton), `aria-busy` on the listbox; typing still works |
| Success | Navigation: close without focus restore, focus `#main`. Results change: polite "{n} results" 300ms after typing stops |
| Error | Index load failure: row "The jump list could not load." + secondary `sm` "Try again"; "Go to" and the full-search row keep working |
| Selected | Active row (above) |
| Expanded | `aria-expanded="true"` on the combobox while open |
| Collapsed | Dialog unmounted; no results row states persist; nothing is stored |

Empty result for a query: a single line "No direct match for “{q}”" (`sm`, `--fg-muted`) above the full-search row, which stays.

#### Results toolbar (`results-toolbar.tsx`)

FUNCTIONAL, `[data-results-toolbar]`, sticky at `top: var(--header-h)`, `--z-sticky`, `min-height: 48px`, `px-4`, flex wrap `gap-2`, `data-wrapped` from one `ResizeObserver`. Contents: `<p aria-live="polite">` count (first number is the total; `tnum`; " · page p of n" in `--fg-subtle` from `sm`), Evidence Gate (from `sm`, when a confirmed-only filter is active), sort select, "Filters · 3" secondary button below `lg`. The bar itself is not interactive; children follow their specs. **Loading:** the count paragraph is not changed while pending; the results region below dims.

#### Evidence Gate (`evidence-gate.tsx`)

Inline `xs` `tnum` text from `evidenceGateCopy`; when `showBar`, a 6rem × 6px two-segment bar (`aria-hidden`; shown `--fg-muted`, held back `--rule`, no status hue); "What this means" link to `#evidence-filter-notice`. Static text; the link follows Text link; activating it uses NAVIGATION + FOCUS on the Callout.

#### Filter panel (`filter-panel.tsx`)

`<form method="get">`, two labelled regions: "Confirmed by an official source" (flags; Legend popover trigger `legend-filters`; `unconfirmedHint`; "Confirmed only" note with a 12px `EvidenceMark`) and "As recorded (not necessarily checked)". Groups are `<details open class="motion-details">` with `fieldset/legend`, rows of checkboxes with `tnum` counts right-aligned in `--fg-subtle`. Sticky sidebar from `lg` (`max-height` and own scroll, `overscroll-behavior: contain`).

| State | Treatment |
| --- | --- |
| Default | All groups open |
| Hover / Focus / Pressed | Per Checkbox and Disclosure |
| Disabled | Zero-count options `disabled`, count "0" visible, not hidden |
| Loading | While `isPending`: sr-only status "Updating results"; results region `aria-busy` + dim; controls stay enabled so the user can keep refining |
| Success | sr-only status "{n} results"; the toolbar count updates |
| Error | n/a: every combination is valid; zero results is the results area's empty state |
| Selected | Checked options per Checkbox, also listed as active-filter tokens |
| Expanded / Collapsed | Per Disclosure, MORPH where supported |

#### Subject type-to-narrow and "Find a subject" (`filter-panel.tsx`, `atlas-index-filter.tsx`)

`type="search"` input, `text-base`, `maxLength` 60, `h-11` (`pointer-fine:h-9`), `rounded-sm`, 1px `--border-strong`, rendered only after hydration. States per Text input; **Success** the list narrows instantly (no animation) and, for "Find a subject", a polite "{n} subjects"; **Empty** "No subject matches “{x}”"; Escape clears. Never changes the URL or checked state.

#### Filter sheet (`filter-sheet.tsx` on `Dialog sheet-bottom`)

Header: `h2` "Filters" + Close (`aria-label="Close filters"`); scrollable body with `FilterPanel` (`overscroll-behavior: contain`); sticky footer (`--surface-raised`, top hairline `--rule`, safe-area padding): ghost "Clear all" and primary "Show {total} results" (live). States per Dialog; **Success** "Show N results" closes the sheet and returns focus to "Filters · N"; resizing to `lg` closes it.

#### Active-filter tokens (`active-filters.tsx`)

`<ul aria-label="Active filters">` of links, each `rounded-xs`, 1px `--border-strong`, `--surface`, `xs`, `h-8` (`pointer-coarse:h-11`), label + 12px close icon + sr-only "Remove this filter"; inferred tokens prefixed "Inferred ·". Hover: edge `--danger`/50, text `--danger-fg` (it is a removal); Focus outline; Pressed `--fill-pressed`; Disabled, Loading, Success, Error, Selected, Expanded, Collapsed n/a (each token is a link to the query without it).

#### Atlas Index (`atlas-index.tsx`)

8 group `<section>`s (4 columns at `lg`, 2 at `sm`, 1 on mobile), serif `h3` group title, `<ul>` rows: name, dotted leader (`aria-hidden`), count `tnum`. Row link accessible name "{subject}, {n} listings". Zero-count rows are text in `--fg-subtle` with "0", not links. Rows follow Text link (chrome); groups emptied by "Find a subject" collapse (unrendered).

### 14.6 Quick Compare (separable final PR)

#### Compare toggle (`compare-toggle.tsx`)

`<button aria-pressed>` labelled "Compare", accessible name "Add {name} to comparison" / "Remove {name} from comparison", in the record foot, `relative z-1`. `h-8` (`pointer-coarse:h-11`), `px-2`, `rounded-sm`, 1px `--border-strong`, `xs` Inter 500.

| State | Treatment |
| --- | --- |
| Default | `--fg-muted`, transparent |
| Hover | `--fg`, `--surface-hover` |
| Focus | Outline |
| Pressed | `--fill-pressed` |
| Disabled | Tray full and this item not selected: `aria-disabled="true"`, `opacity: 0.5`, sr-only "Comparison is full, 3 of 3" |
| Loading | n/a: local state |
| Success | Tray appears or updates; its count is polite-announced |
| Error | n/a |
| Selected | `aria-pressed="true"`: the visible label stays "Compare" (direction §3.6); text `--fg` weight 600, fill `--surface-hover`, edge `--fg`. Ink, not gold: `compare-toggle.tsx` is not a gold owner (§20) |
| Expanded / Collapsed | n/a |

#### Compare tray (`compare-tray.tsx`)

`<nav aria-label="Comparison" data-compare-tray>`, ELEVATED fixed bottom bar (opaque, no blur), `--z-sticky`, full width, no radius, `px-4 py-3`, safe-area padding. Text "{n} of 3 selected: {names}" (`sm`, `tnum`, names truncated with "…" after 2 lines), primary "Compare {n} listings" (disabled below 2 with "Pick at least 2"), ghost "Clear". **Expanded**: ENTER `--dur-move`, `--dist-short` up + opacity via `@starting-style`. **Collapsed**: EXIT is instant (unmount); focus moves to the first record's toggle or `#main`. Padding rules in `materials.css`.

#### Compare view (`compare-view.tsx`)

Serif `h1` "Compare listings"; parity statement (`base`, `--fg`), Legend popover trigger (`legend-compare`); segmented control; the table (§14.1 Data table) with a fact meter in each column head, "Differs" kicker (`xs` uppercase `--fg`) + 2px `--border-strong` leading rule on differing row headers; "Add a listing" combobox reusing the palette's ARIA pattern inline.

| State | Treatment |
| --- | --- |
| Default | 2–3 columns |
| Loading | After a 150ms show-delay, the line "Loading the comparison…" (`sm`, `--fg-muted`, `role="status"`) in place of the table, with `aria-busy` on the region. No skeleton: skeletons are palette-only (direction §7 row 33) |
| Success | Table renders; notices for dropped slugs ("{n} listing(s) in this link were not found and were left out", "Only the first 3 are compared") as neutral Callouts above the table |
| Error | "The comparison data could not load." + "Try again" + plain links to each requested record |
| Empty | Fewer than 2 valid: "Pick two or three listings to compare", any valid slug pre-selected |
| No JS | `<noscript>` neutral Callout "Comparison needs JavaScript" + link to `/resources/` |
| Selected / Expanded / Collapsed | Per segmented control: "Only differences" removes identical rows from the DOM |

#### Compare link (`compare-link.tsx`)

"Compare with…" `link-inline` on the record page, rendered only after hydration. States per Text link.

### 14.7 Component inventory

| Group | Components |
| --- | --- |
| Primitives | Button, Text link, Text input / Textarea / Select, Checkbox / Radio, Search field, Sort select, Segmented control, Kbd, Badge / ledger token, Chip, Callout, Card, Empty state, Skeleton, Disclosure, Dialog (3 variants), Legend popover, Breadcrumbs, Pagination, Data table |
| Chrome | Skip link, Site header, Header nav item, Palette trigger, Theme toggle, Mobile menu, Footer, Section / PageHeader |
| Evidence | EvidenceMark, EvidenceTag, CardEvidence, FactValue + "How we know", Legend (full), Fact meter, Survey bar, Coordinates line, Facts ledger, Record key |
| Records | ResourceRecord / RecordList, ResourceSnapshot (full, compact), Provenance Rail, On this page, Mobile action bar, Verification panel |
| Search and discovery | Library introduction, Command palette, Results toolbar, Evidence Gate, Filter panel, Subject narrow / Find a subject, Filter sheet, Active-filter tokens, Atlas Index |
| Compare (final PR) | Compare toggle, Compare tray, Compare view, Compare link |

**Deliberately absent** (direction §7, §16; research Part 5): toast system, drawer, tabs, mega-menu, inspector/split view, density toggle, tooltip (every label is visible text; `title` attributes are not used as the only label), spinner, progress ring, rating, avatar, carousel.

---

## 15. Motion categories

### 15.1 Principles

1. Motion explains a state change. It never decorates.
2. Content is never delayed: nothing fades in on load or on scroll.
3. Exit mirrors entry; each surface has one direction of travel.
4. Latency beats animation: listbox focus, filter results and typing feedback are instant.
5. Motion is optional: every state is complete without it, and reduced motion removes it.

### 15.2 The eight categories

| Category | Meaning | Duration tier | Easing | Properties | Where | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- |
| **ENTER** | A surface appears | medium/normal (`--dur-move`: palette, menu, tray); large/slow (`--dur-sheet`: filter sheet); small/fast (`--dur-quick`: Legend popover, mobile action bar) | `--ease-spring` (popover, action bar: `--ease-standard`) | `opacity`, `transform`; start state from `@starting-style`; `::backdrop` opacity | Dialog variants, Legend popover, compare tray, mobile action bar | Instant (distances 0, durations 0.01ms) |
| **EXIT** | A surface leaves | small/fast (`--dur-quick`) | `--ease-exit` | `opacity`, `transform`, discrete `display` and `overlay` with `allow-discrete` | Dialog variants, Legend popover, mobile action bar. Compare tray: instant unmount. Native browser close: no EXIT | Instant |
| **MOVE** | An element changes position in place | small/fast | `--ease-standard` | `transform` | Segmented indicator (`translateX`), disclosure chevron (`rotate(180deg)`) | Instant |
| **MORPH** | An element changes size | small/fast | `--ease-standard` | `block-size` via `::details-content`, discrete `content-visibility`; inside `@supports (interpolate-size: allow-keywords)` | Filter groups, "How we know", "View verification evidence" | Instant |
| **FOCUS** | Attention lands somewhere | `--dur-flash` (outside the scale) | `--ease-standard` | `background-color` | `:target:not(#main)` flash from `--primary-soft` to the element's own background; focus ring appears without transition | Static `--primary-soft` tint while `:target`; `#main` never tinted |
| **FEEDBACK** | The system acknowledges input | micro/instant (hover, press, toggle); small/fast (results pending dim) | `--ease-standard` | `color`, `background-color`, `border-color`, `outline-color`, `opacity` | Every control; results `aria-busy` | Instant |
| **NAVIGATION** | The location changes | Anchor jumps: `scroll-behavior: smooth`. Route changes: **none in this pass** (view transitions deferred to prototype P1) | Browser | scroll | On-this-page links, rail link, Evidence Gate link | `scroll-behavior: auto` |
| **DISCOVERY** | More is revealed on request | None of its own; reuses MORPH | — | — | `<details>`, palette results (instant, no stagger), type-to-narrow (instant), "Only differences" (instant) | Same |

### 15.3 Rules

- Animatable properties: `opacity`, `transform`, `color`, `background-color`, `border-color`, `outline-color`; `block-size` and discrete `content-visibility` through `::details-content`; discrete `display`, `overlay`, `visibility` for EXIT. Never `transition: all`. Nothing that triggers layout is animated on list items.
- No animation over 300ms except FOCUS. **No infinite animations**: no spinners, no shimmer, no pulse, no looping anything.
- No stagger, no scroll-triggered reveal, no parallax, no scroll-scrubbed transforms, no cursor-following, no magnetic targets, no 3D, no motion blur, no type animation, no animated gradients (direction §7 rejects).
- Motion values appear only in `motion.css`. A `transition`, `animation` or `@keyframes` anywhere else fails the guardrail.
- The Dialog's exit wait reads the panel's **computed** `transitionDuration` + 50ms, so reduced motion shortens it automatically.
- Hover never animates layout or position; it only cross-fades colour at the micro tier.

---

## 16. Responsive rules

1. **Design mobile first, at 360px, and check at 390px.** Every page has an intended phone layout, not a squeezed desktop.
2. **No horizontal overflow** at any width (smoke check). Tables scroll inside a focusable region; the coordinates line wraps at separators; long hosts and identifiers break inside narrow cells.
3. **Adaptive surfaces at `lg`:** filter sidebar ↔ filter sheet (one form mounted at a time, by state); record aside stacks below the main column; the rail stops being sticky; the mobile action bar exists only below `lg`; the header gains the "Search" label and `Kbd`.
4. **Containers over viewports for components.** `ResourceRecord` adapts to its container (`44rem`), so it is correct in any list.
5. **Density per breakpoint:** snapshot 3 → 6 columns at `md`; Atlas Index 1 → 2 (`sm`) → 4 (`lg`) columns; editorial margin column only from `lg`; On-this-page column only from `xl`; ledger leaders only from `sm`.
6. **The toolbar never clips.** It grows (`min-height`, wrap) and `--toolbar-h` follows via `data-wrapped`. The Evidence Gate hides below `sm`; the count and the notice still carry the meaning.
7. **Fixed bars respect safe areas** (`env(safe-area-inset-bottom)`) and add matching `main` padding and `scroll-padding-bottom` only while visible.
8. **Viewport units:** `dvh` for the sheet and sidebar heights, never `vh` for anything a mobile toolbar can cover.
9. **Motion shrinks on small screens** (§9): shorter durations and distances below `sm`.
10. **Touch targets** per §11.4; nothing depends on hover.
11. **Text scales:** layouts hold at 200% browser zoom and at 320 CSS px (WCAG 1.4.10 reflow), with no content or function lost.
12. **Orientation:** no layout locks orientation.

---

## 17. Accessibility rules

Target: WCAG 2.2 AA. Full conformance needs assistive-technology testing and expert review; the checks below are what the build and smoke test enforce, plus the manual passes in direction §14.

**Perception**

- Contrast invariants in §2.3, tested in both themes. Text never sits on translucency for its contrast.
- Never colour alone: every evidence state has a mark and a word; every status has a word; "Differs" is text; meter and survey bar are `aria-hidden` with a text equivalent.
- `prefers-reduced-transparency: reduce` → FUNCTIONAL opaque. `forced-colors: active` → materials `Canvas`/`CanvasText`, rules `CanvasText`, focus `Highlight`, meter and survey bar `forced-color-adjust: none` with `CanvasText` borders.
- Content is not hidden behind hover. Find-in-page and screen readers reach every record (`content-visibility: auto` keeps content in the tree).

**Operation**

- Everything works by keyboard. Global shortcuts: ⌘K / Ctrl+K (toggle palette, works in inputs), `/` (opens when not typing, no modifier), Escape (clear query, then close). Shortcuts are ignored while another modal is open. `aria-keyshortcuts` is declared on the trigger.
- Focus is always visible (§10), never obscured by sticky chrome, and moved deliberately: dialogs trap focus natively and restore it, or move it to `#main` after navigation or when the stored element is gone.
- Skip link first in the tab order.
- No timing: nothing auto-advances, nothing rotates (the rotating placeholder is removed), no session timeouts.
- Targets per §11.4.

**Understanding**

- Labels are visible text; `aria-label` only for icon-only controls, and its text starts with the visible label where one exists.
- Errors say what went wrong and how to fix it, are linked by `aria-describedby`, and focus the first invalid field on submit.
- Copy is plain and specific; Unknown says "Unknown".
- Consistent identification: the same evidence state has the same mark, word and colour on every surface (single owner, `EvidenceMark`).

**Robustness and semantics**

- Native elements first: `<dialog>`, `popover`, `<details>`, `<fieldset>/<legend>`, `<table>` with `caption` and `scope`, `<dl>`, `<time>`, `<nav>` with labels, `<form method="get">`.
- ARIA patterns: combobox + listbox (palette, "Add a listing"), radio group (segmented control), `aria-pressed` toggles, `aria-current` for page and location, `aria-busy` for pending regions.
- Live regions: polite for result counts (toolbar count, palette count after 300ms, subject count); assertive only for decision-changing alerts. One announcement per change (the Evidence Gate's text is not inside the live count).
- Heading outline: one `h1` per page; kickers are `<p>`; Provenance station labels are `<p>`; section headings stay real headings.
- `translate="no"` on product names, licence IDs and hosts; `lang="en"` on `<html>`.
- No-JS: every page renders its content; features that need JS (palette, compare, type-to-narrow, compare link, action bar, Kbd hints) are absent rather than broken, and `/compare/` explains itself.

---

## 18. Performance rules

Binding budgets come from direction §15 criterion 7–8.

| Budget | Limit |
| --- | --- |
| `/resources` HTML | ≤ 8,632,437 bytes (baseline). Over it: drop the record key, then the licence part of the coordinates line, from `/resources` list records only; never cut evidence |
| `/` HTML | ≤ 303,700 bytes |
| JS referenced by `/` | ≤ 612,169 + 10,240 bytes uncompressed; palette and compare code not in initial chunks |
| CSS | ≤ 51,200 bytes uncompressed |
| Fonts | Exactly two families, latin subset, variable, self-hosted |
| Record DOM | ≤ the current card's element count for the same resource (three fixtures) |
| Palette index | Measured and recorded; above 30 KB gzip, `c` becomes an index into `subjects` |

Rules:

1. **Every node in a record is multiplied by 726** on `/resources`. Additions to `ResourceRecord` must be paid for by removals. The fact meter is one element; the survey bar is five.
2. **No per-record JS:** no per-record observers, listeners or hydration-only effects. Records are server components with no hooks.
3. **One observer per concern per page:** one `IntersectionObserver` for On-this-page, one for the action bar, one `ResizeObserver` for the toolbar.
4. **Lazy by intent:** the palette (`next/dynamic`) and its index load on first open or on trigger hover/focus; the compare index loads only on `/compare/`; nothing loads speculatively on page load.
5. **Compositor-only motion:** `opacity` and `transform` for movement; colour transitions at the micro tier; `block-size` only inside `::details-content`.
6. **One blur layer at most per viewport** (the header), plus the toolbar or action bar where present; never stacked, never on scrolling content. Opaque fallback where `backdrop-filter` is unsupported.
7. **`content-visibility: auto`** with `contain-intrinsic-size: auto 168px` on list records.
8. **No images, canvas, WebGL or shaders.** Monograms are text. The survey bar and meter are CSS.
9. **No layout shift:** `scrollbar-gutter: stable` for scroll lock; skeletons mirror final layout; hydration-only elements (Kbd, compare link, narrow inputs) reserve no space they then fill, because they sit at line ends or in their own row.
10. **Static first:** everything is exported HTML; JSON indexes are force-static same-origin files.

---

## 19. Review checklists

### 19.1 Component review

A component is ready when: all eleven states are specified or marked n/a with a reason (§13); the header comment exists; it uses only tokens and material utilities; it has no radius above 10px; it has no gold or green outside the owner lists; it meets hit targets; it works with keyboard, without hover, at 360px, under reduced motion, reduced transparency and forced colours; it adds nothing to the per-record budget without a matching removal; any number it shows is computed; any evidence it shows goes through `EvidenceMark`/`EvidenceTag`.

### 19.2 Guardrails that enforce this system

`tests/tokens.test.mts` (contrast, token presence, font stacks) and `tests/design-guardrails.test.mts` (emoji; motion outside `motion.css`; blur outside `materials.css`; ≤ 3 FUNCTIONAL files; success and gold owners; radius ceiling and `rounded-full` map; `:target:not(#main)`; storage outside `theme.tsx`; focus suppression allow-list; serif owners; reserved glyphs; `oklch(from` inside `@supports`; count literals), as specified in direction §14.

### 19.3 Ban list mapped to the system

| Banned pattern (brief §1) | Excluded by |
| --- | --- |
| Purple/blue gradient hero, cyan/purple glow, giant gradient headline, animated gradients | Warm OKLCH neutrals; no gradient fills (§2.4); serif headline in text colour; no `@keyframes` outside `motion.css` |
| Glassmorphism, floating glass cards, excessive blur | One FUNCTIONAL recipe on three sticky surfaces, 0.94 alpha, opaque fallbacks (§7) |
| Glowing borders, excessive shadows | Shadows only on ELEVATED, two-part, no colour (§8) |
| Generic bento grids, generic SaaS cards, giant rounded rectangles | Ruled records, index lists, `Card` only for grouped objects, 10px ceiling (§5) |
| Excessive pill buttons | No pills; `rounded-full` map limited to three true circles |
| Blobs, particles, star fields, decorative 3D, WebGL | No images, canvas or shaders (§18) |
| "AI sparkle" icons, emoji UI | Four functional icon roles (§12); emoji guardrail |
| Fake dashboards, testimonials, avatars, metrics, ratings, activity feeds | Real-data rule (§0); counts from census; no rating or avatar component exists |
| Meaningless parallax, endless scroll animations, cursor gimmicks | Motion categories only (§15); rejects in direction §7 |
| Generic "future technology" aesthetics | Paper-and-ink palette, serif editorial voice, atlas motifs |

---

## 20. Additions to the direction

The direction is the authority. These are details this document adds where the direction is silent; each is consistent with it and can be reverted without affecting any other rule.

| # | Addition | Section |
| --- | --- | --- |
| 1 | Light `--primary-hover` `oklch(0.44 0.095 80)`; contrast test adds `--primary-fg` on `--primary-hover` ≥ 4.5:1 | §2.1, §2.3 |
| 2 | Base status tokens take their `-fg` numbers; `--scrim` named for the direction's scrim value | §2.1 |
| 3 | `--fill-pressed` (the direction's pressed recipe, named) and `--primary-pressed` | §2.2 |
| 4 | Light `--shadow-raised` and both `--shadow-overlay` values | §8.1 |
| 5 | Duration vocabulary: micro/small/medium/large and instant/fast/normal/slow map one-to-one onto `--dur-instant`/`--dur-quick`/`--dur-move`/`--dur-sheet`; no new CSS tokens | §9.1 |
| 6 | Mobile action bar ENTER/EXIT at `--dur-quick`, `--dist-short`, and utilities `motion-segment`, `motion-action-bar`, `motion-pending` | §9.4, §14.4 |
| 7 | `--focus-width`, `--focus-offset` | §10 |
| 8 | `@utility kicker`, `--measure-standfirst` | §3.3, §4.2 |
| 9 | Icon rendered sizes 12/13/14/16/20; Callout icon 17 → 16 | §12 |
| 10 | Danger button restyled to soft fill and `-fg` text (no current non-tool use) | §14.1 |
| 11 | Pagination current page: gold 2px rule instead of gold fill (still gold role 4, owner `pagination.tsx`) | §14.1 |
| 12 | Compare toggle Selected and mobile-menu current item in ink (`--fg`), so neither file joins the gold owner list | §14.2, §14.6 |
| 13 | Palette footer key hints in words, and the "No direct match" line | §14.5 |
| 14 | `animate-pulse` removed from `Skeleton` (no infinite animation); compare loading as a status line, not a skeleton | §14.1, §14.6 |
| 15 | Fact meter cells 6px with 2px gaps, 8px tall; survey bar 8px / 12px | §14.3 |
| 16 | Record padding `p-4`, wide-layout `gap-6`; hit-target `pointer-coarse` raises on `sm` buttons, tokens and toggles | §11.4, §14.4 |
| 17 | Tooltips, spinners and progress rings listed as deliberately absent | §14.7 |

No addition introduces a dependency, touches `src/lib/**`, `src/data/**`, `src/types/**`, `src/config/verification.ts`, CI or CODEOWNERS, or changes a smoke-test contract.>
