# Global coverage 002: what the library can say about where it reaches

This records plan 002 Decision 7 and increment 13. It says which "coverage" the redesign shows, which it does not, and why. It is a separate file so `docs/architecture.md` is not edited.

The figures below were counted from `seedResources` with a Node one-liner (through the test loader) when increment 13 was built. They describe the data on that day; the site itself never quotes them, because every count it shows is computed at build.

## What is built

- **Coverage by subject.** The Atlas Index on the homepage ("Browse by category") and at full size on `/categories` lists every subject in its groups with a live listing count from `computeFacets(resources, {})` (category plus subcategories). Subjects with no listings stay visible with "0" and are not links. At the time of writing, 71 of 72 subjects hold at least one of 726 listings. `/categories` adds "Find a subject", a type-to-narrow input that never touches the URL.
- **Coverage by platform.** Every record's coordinates line names its platforms, and the library filters count them (at the time of writing: Browser 395, Windows 315, Linux 305, macOS 303, Android 128, Self-hosted 104, iOS 91).
- **Survey by subject group.** `/verification` shows one row per group: listings, listings with at least one confirmed fact, partially verified and verified. It comes from `surveyByGroup` in `src/features/home/census.ts`, which counts each listing by its primary `category` only, using the same predicates as `libraryCensus` (`factEvidence`, `effectiveVerification`, staleness included). The caption says why its totals differ from the index counts and why rows can add up to more than the library.

## What is not built, and why

- **No region, country or availability-by-place field exists.** `src/types/resource.ts` has no such field. `Availability` there is the yes / no / unknown type for tri-state facts (account, card, commercial and personal use), not a geographic claim.
- **Interface languages are not recorded.** `Resource.languages` exists ("Empty means not yet recorded"), and it is empty on all 726 listings. A language count would be zero everywhere, or invented.
- **Tags are topics, not availability claims.** Some tags name places (at the time of writing `india` on 29 listings, and `europe`, `africa` and `australia` on one each). They say what a listing is about, for example an India-specific service, and nothing about where it can be used. Counting them as coverage would turn a topic into a claim no one checked.
- **By decision, there is no map, globe, flag, country count or "global coverage" figure** anywhere in the product. The redesign's "Global Utility Atlas" is a visual concept (index, legend, survey, coordinates), not a geographic claim. Copy says "coverage by subject", never "global coverage".

## What a future data project would need

1. **A schema field.** For example `availableIn` as ISO 3166-1 codes with an explicit "worldwide" value, and `languages` filled as ISO 639-1 codes. Both belong in `src/types/resource.ts` with validation in the data layer.
2. **A verification check.** A new entry in `src/config/verification.ts` (for example "Regional availability: does the provider's own documentation state where the free offering is available?"), so the value is confirmed from an official source like every other fact, with its own evidence state through `factEvidence`.
3. **Validation and tests.** Build-time validation that rejects unknown codes, tests for the new facet in `computeFacets` and `lib/search/params`, and the smoke audit extended to the new fact.

Only after all three would a coverage view by place be honest. Until then the index, the platform counts and the survey by subject group are the whole of what the data supports.
