# Entertainment research workflow

How entertainment listings get into the library, what counts as evidence, and the
exact format a research file uses. The rules here are enforced by
`src/data/resources/validate.ts` and `src/data/resources/validate-media.ts`; a file
that breaks them fails `next build`.

Entertainment listings are **ordinary library resources** with a `media` profile
(`src/types/media.ts`). There is no second catalogue: they share the resource
pages, search, filters, verification model and link checks with everything else.

## The pipeline

1. **Discover** candidates — official sites, the starting list in the brief,
   LibreGameWiki, IFDB, Wikidata, official publisher channels.
2. **Record** each candidate's official URL and the pages that would settle it.
3. **Read** those pages (`web_fetch` or a browser). Only pages actually read count.
4. **Normalise** into a `defineMedia({...})` entry in
   `src/data/resources/entertainment/<area>.ts`.
5. **Deduplicate** — `scripts/check-media-file.mts` fails on a slug or official URL
   already in the library.
6. **Validate** the file:

   ```bash
   npm run check:media-file -- src/data/resources/entertainment/<area>.ts
   ```

7. **Import** — add the file's export to `src/data/resources/entertainment/index.ts`.
8. **Build and test** — `npm run verify:static`, `npm run check:entertainment`, and
   `npm run signals:entertainment` if the file adds GitHub repositories.
9. **Review** — a maintainer reads the diff, re-opens sources, and is the only person
   who can promote a listing to `VERIFIED`.

Candidates that could not be read, or whose free model could not be settled, go to
[`docs/entertainment-backlog.md`](entertainment-backlog.md) with the reason — not into
the catalogue as guesses.

## What may be listed

Only legal access to content, from the rights holder or an authorised distributor:

- the provider's own site, app or official channel;
- public-domain works with a source stating their status;
- openly licensed works with the licence named;
- discovery guides that link to authorised destinations (classified `free_discovery`);
- open-source game, player and reader projects from their official repository.

Never listed:

- piracy, unauthorised mirrors, "free movie" sites without licences, scanlation or
  unofficial anime streaming sites, ROM/ISO sites, cracked games, key resellers,
  APK mirrors;
- commercial games emulated without the rights holder's permission, even when an
  archive hosts them;
- unofficial uploads on video platforms — only a rights holder's or authorised
  distributor's own channel;
- anything requiring circumvention of DRM, region locks or paywalls.

## Evidence standard

A value is recorded **only when a page read in this pass supports it**, and then the
matching check is recorded as `confirmed`, citing that page. Anything not read stays
`"unknown"` (tri-state facts) or is left out (region, licence). That keeps every
"Confirmed" line on the site true.

| Check | Confirm it when an official page says… |
| --- | --- |
| `OFFICIAL_URL` | the URL is the provider's own and it loaded |
| `FREE_STATUS` | what is free (help/FAQ/pricing/about page) — this makes the listing *Partially verified* |
| `ACCOUNT_REQUIREMENT` | whether you can watch/play/listen without an account |
| `CREDIT_CARD_REQUIREMENT` | whether payment details are needed for the free part |
| `COMMERCIAL_USE` / `PERSONAL_USE` | the terms or licence on use (for media, usually personal yes, commercial per licence) |
| `LIMITATIONS` | the limitations you recorded (ads, region, free-chapter limits) |
| `FREE_TIER_LIMITS` | what the free part caps (or that there is no cap) |
| `PRICING_INFORMATION` | where the free/paid boundary sits |
| `LICENSE` / `OPEN_SOURCE_STATUS` | the licence file or page (software licence) |
| `PLATFORM_AVAILABILITY` | the supported devices |

Rules the build enforces:

- A `confirmed` check needs `sourceUrl`, and that URL must be in `research.sources`.
- Evidence text is at least 20 characters and paraphrases what the page says.
- `unresolved` (looked, could not settle) ⇒ the fact's value must be `"unknown"`.
- `confirmed` ⇒ the fact's value must not be `"unknown"`.
- Never mark anything `VERIFIED`; `defineMedia` derives the status.
- Region, content-licence and offer claims each need a `sourceUrl` that is one of the
  research sources. No source ⇒ `india: "unknown"`, `availableIn: []`.

## Access classification

`media.access` lists every way the content is free. Combine them:
a public-domain film archive is `["public_domain", "free_streaming", "free_download"]`;
an ad-supported service is `["free_with_ads", "free_streaming"]`.

| Type | Use when |
| --- | --- |
| `free_full_access` | the relevant content is free without a subscription |
| `free_with_ads` | free with advertising (`containsAds: "yes"`, ads named in limitations) |
| `free_tier` | a limited free plan/catalogue exists beside paid plans (`hasPaidFeatures: "yes"`) |
| `free_open_source` | open-source project (`openSource: true`, `license` set) |
| `public_domain` | the works are public domain (needs `contentLicense.kind` public-domain/per-item) |
| `open_license` | the works carry an open licence (needs `contentLicense.kind` open-license/per-item) |
| `free_download` / `free_streaming` | legally downloadable / streamable at no cost |
| `free_demo` | only a demo/preview is free (`freeStatus` LIMITED_FREE or TRIAL) |
| `temporary_free` | time-limited; needs `offer` (recurring or with `endsAt`) |
| `library_access` | needs a library card/institution (`requiresAccount` not `"no"`) |
| `free_discovery` | a guide to where content is; `offering: "discovery"`, `contentScope: "information-only"`, no content access types, and the short description must not read "watch free" |
| `freemium` | free to start, paid upgrades or in-app purchases |
| `unknown` | not established; cannot be combined |

`offering`: `full-content` | `selected-content` | `discovery` | `software`.
`contentScope`: `complete-works` | `selected-works` | `previews-only` |
`information-only` | `not-applicable` (software must use `not-applicable`).

`playInBrowser: true` only when the official URL itself is where the game is played,
with nothing to install. Store pages and download pages are not.

## Free status mapping

| Situation | `freeStatus` |
| --- | --- |
| Public-domain archive; whole free catalogue with ads | `FREE` |
| Free-to-play game with optional purchases | `FREE` (with `freemium`, `hasPaidFeatures: "yes"`, and the purchases as a limitation) — or `LIMITED_FREE` if paying is needed to progress normally |
| Some chapters/episodes free, the rest paid | `LIMITED_FREE` |
| Free plan beside paid plans | `FREE_TIER` |
| Open-source game or player | `OPEN_SOURCE` (`openSource: true`, SPDX `license`) |
| Demo only | `LIMITED_FREE` or `TRIAL` |

`FREE_TIER`, `LIMITED_FREE`, `PERSONAL_FREE`, `TRIAL` must list limitations.

## Categories and formats

Primary `category` (one), from the Media & entertainment group: `movies`,
`tv-series`, `anime`, `games`, `music`, `podcasts`, `audiobooks`, `radio`, `books`,
`comics`, `streaming` (live streams, FAST/live TV), `culture`. Extra categories go in
`subcategories` (never repeating the primary); `open-source`, `learning`, `audio`,
`stock-media`, `animation` are also valid.

`media.formats` drive the shelves; see `MEDIA_FORMATS` in `src/types/media.ts`.

## Other field rules

- `slug`: lowercase kebab-case, unique across the whole library.
- `shortDescription`: factual, 25–130 characters. No "100% free/legal".
- `tags`: topics, lowercase kebab-case. Never a fact restated as a tag
  (`open-source`, `no-signup`, `no-account`, `no-credit-card`, `commercial-use`).
- `relatedResources`: only slugs that exist.
- `officialUrl`: HTTPS, the provider's own domain, the most specific relevant page
  (e.g. the free catalogue page, not a marketing homepage).
- `githubRepo`: `owner/name`, and `sourceUrl` must be exactly `https://github.com/owner/name`.
- `contentLanguages`: ISO 639-1 of the content (audio/subtitles/text). `multi` for many.
- Artwork: leave `artwork` out unless the image's licence page is known. Cards draw a
  typographic cover otherwise.

## Example

```ts
import type { Resource } from "@/types/resource";
import { defineMediaList } from "./define-media";

export const exampleResources: Resource[] = defineMediaList([
  {
    slug: "librivox-audiobooks",
    name: "LibriVox",
    shortDescription: "Volunteer-read recordings of public-domain books, free to stream and download.",
    longDescription: "…",
    whyListed: "…",
    category: "audiobooks",
    resourceType: "WEBSITE",
    officialUrl: "https://librivox.org/",
    freeStatus: "FREE",
    openSource: false,
    platforms: ["BROWSER"],
    requiresAccount: "unknown",
    requiresCreditCard: "unknown",
    commercialUse: "yes",
    personalUse: "yes",
    downloadAvailable: true,
    limitations: ["Recordings are public domain in the USA; LibriVox advises checking the status in your own country."],
    media: {
      formats: ["audiobook"],
      access: ["public_domain", "free_streaming", "free_download"],
      offering: "full-content",
      contentScope: "complete-works",
      provider: "LibriVox volunteers",
      containsAds: "unknown",
      hasPaidFeatures: "unknown",
      genres: ["classics"],
      contentLanguages: ["en", "multi"],
      region: { india: "unknown", availableIn: [] },
      contentLicense: {
        kind: "public-domain",
        summary: "Recordings dedicated to the public domain in the USA.",
        creatorUse: "allowed",
        url: "https://librivox.org/pages/public-domain/",
        sourceUrl: "https://librivox.org/pages/public-domain/",
      },
    },
    research: {
      date: "2026-10-11",
      sources: [{ url: "https://librivox.org/pages/public-domain/", label: "Public-domain page: …" }],
      checks: [
        {
          check: "FREE_STATUS",
          result: "confirmed",
          evidence: "The public-domain page says all recordings are public domain in the USA and free to use.",
          sourceUrl: "https://librivox.org/pages/public-domain/",
        },
      ],
      notes: "What this pass settled, and what it did not.",
    },
  },
]);
```
