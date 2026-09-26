# Contributing to Everything.Free

Thank you for considering it. This library cannot be maintained by one person — free plans change too often, and nobody uses enough of the internet to keep 70 categories accurate alone.

**The most valuable contribution is a correction.** A wrong entry is worse than a missing one, because someone will act on it. If you notice a dead link, a free plan that has changed, or a limitation we failed to mention, reporting it is more useful than adding something new.

---

## Ways to contribute

| | How |
| --- | --- |
| Add a resource | The [submission form](https://everything-free-by-quilonix.github.io/everything-free/submit/), or a GitHub issue using the format below |
| Correct an entry | The report link on any resource page, or a GitHub issue |
| Verify an entry | Check its claims against official sources and open an issue with what you found |
| Improve the code | Pull request — please open an issue first for anything substantial |

The submission form validates against the same rules described here and hands you a prefilled issue. Nothing is filed until you confirm it.

---

## Resource submission format

Use this structure for a new resource. It mirrors what the form produces, so both routes are reviewed the same way.

```
Resource name:
Official URL:
Category:
Resource type:
Free status:
Why should it be listed:
Known limitations:
License:
Commercial use:
Verification information:
```

### Field guidance

**Official URL** — the provider's own site. Not a mirror, an aggregator, a review page, or a link with tracking or affiliate parameters. Must be HTTPS.

**Category** — one primary category from [`src/config/categories.ts`](src/config/categories.ts). Additional categories can be suggested as subcategories.

**Free status** — see the table below. This is the field most often got wrong, and it is the field the whole project rests on.

**Why should it be listed** — a sentence or two on what this does for someone that earns it a place. This is shown verbatim on the resource page. Submissions without a real reason are declined; "it's free and useful" is not a reason.

**Known limitations** — required for `FREE_TIER`, `LIMITED_FREE`, `PERSONAL_FREE` and `TRIAL`. Include the inconvenient ones: export caps, watermarks, seat limits, feature gating, storage quotas, expiry, inactivity pauses. **This is the part that makes the library worth using.** The build refuses entries that skip it.

**License** — SPDX identifier where one applies (`MIT`, `GPL-3.0-or-later`, `Apache-2.0`). If the situation is more complicated than one identifier — as with an open-source codebase shipping under a different licence than its official binaries — say so, and it will be recorded in the licence notes.

**Commercial use** — can it be used for paid work on the free offering? If you are not sure, say you are not sure. "Unknown" is recorded honestly; a guess is not.

**Verification information** — how you established the free status. A link to the exact pricing or licence page you read is the single most useful thing you can include.

---

## Choosing a free status

| Status | Use when |
| --- | --- |
| `FREE` | Fully usable without payment, no time limit, no paid upgrade needed for normal tasks |
| `FREE_TIER` | Permanent free plan with capped usage or features; paid plans sit above it |
| `OPEN_SOURCE` | Source published under an identifiable open-source licence |
| `PERSONAL_FREE` | Free for personal use; work, business or commercial use restricted |
| `LIMITED_FREE` | Something real can be done free, but most people will hit the limits |
| `TRIAL` | Free access expires. **Never** submit this as free |
| `UNKNOWN` | You cannot establish the status and would rather flag it than guess |

### Common mistakes

- **A trial submitted as `FREE_TIER`.** A free tier does not expire. A trial does. If access stops, it is `TRIAL`.
- **A free tier submitted as `FREE`.** If there is a cap you can hit, it is `FREE_TIER`, and the cap goes in the limitations.
- **`OPEN_SOURCE` for a product whose *binaries* are proprietary.** If what most people download is not open source, classify what they actually get and explain the split in licence notes.
- **`OPEN_SOURCE` implying the hosted version is free.** The code being open does not make the vendor's hosting free. Record the hosted plan separately.
- **Assuming commercial use is allowed** because something is free. Non-commercial Creative Commons licences and personal-use licences are common.

---

## What is not accepted

- Paid products with a trial presented as free
- Anything requiring a licence key, crack or activation from an unofficial source
- Resources that circumvent payment, licensing or access controls
- Content that infringes copyright
- Your own product submitted without disclosing that it is yours
- Link shorteners, affiliate URLs, or mirrors in place of the official link
- Entries whose free status you have not actually checked

Disclosing that a resource is yours does **not** disqualify it. Hiding it does.

---

## Verifying an entry

Verification is what separates this from a stale directory, and it is the most valuable contribution you can make. The full process is in **[`docs/verification.md`](docs/verification.md)** — read it before your first verification pass.

The short version:

1. Pick an entry from **[`docs/verification-backlog.md`](docs/verification-backlog.md)**, the generated work queue.
2. Open the provider's **own** pricing, licence or documentation pages — not a review, blog post, university IT page or other directory.
3. Record each page you read once, in `verificationSources`, with a label saying what that page establishes and the date you read it.
4. Add one record per check you looked at to `verificationChecks`:

   ```ts
   {
     check: "COMMERCIAL_USE",
     result: "confirmed",          // or "unresolved": looked for, not settled
     evidence: "What the page actually says, specific enough for someone else to check.",
     sourceUrl: "https://example.com/terms",   // must be one of verificationSources
   }
   ```

   A check you did not look at gets no record. If a source contradicts the listing, correct the listing. There is no "failed" result.
5. Say in `verificationNotes` what you did **not** confirm.
6. Put your GitHub handle (`@name`) in `verifiedBy` and the date in `lastVerifiedAt`. Leave `verificationStatus` as `PARTIALLY_VERIFIED`.
7. Run `npm run build:static && npm run backlog`, and commit the regenerated backlog with your change. CI fails if you forget.

**Confirming three checks and honestly recording the rest as unresolved or unchecked is a real contribution. Claiming all ten without looking is not.** The build rejects a confirmed check with no official source behind it.

**Only a maintainer marks an entry `VERIFIED`**, after re-opening the sources themselves. The build requires a maintainer's `@handle` on every `VERIFIED` entry and rejects one awarded by a script, bot or AI assistant. See [signing off](docs/verification.md#signing-off-maintainers).

A verification older than 90 days is automatically displayed as needing a re-check, so re-verifying existing entries is genuinely useful work.

Nothing in this library is currently marked `VERIFIED`. That is not an oversight.

---

## Code contributions

### Setup

```bash
npm install
npm run dev
```

### Before opening a pull request

```bash
npm run build      # includes all data validation
npm run lint
npx tsc --noEmit
```

`npm run build` is the important one: it runs the integrity checks over the taxonomy, seed data, collections and tool registry. If you have added data, this is what tells you whether it is consistent.

### Conventions

**Never import seed data in a component.** All reads go through [`lib/repository`](src/lib/repository/index.ts). This is what keeps the storage layer swappable.

**Add a new filter in one place.** Extend `ResourceQuery`, then the URL serialiser and the predicate. Both the UI and a future SQL adapter read the same type.

**Keep facts tri-state.** If a field can be unknown, model it as `'yes' | 'no' | 'unknown'`. Never coerce unknown to false in the UI.

**Do not store what you can derive.** Duplicated state is state that can disagree with itself.

**Dependencies need justification.** The runtime dependency list is React, Next.js and Zod. Adding a fourth should be argued for in the pull request. Icons, class-name joining, theming and the tools are all hand-written for this reason.

**Accessibility is not a follow-up.** New interactive UI needs keyboard operation, a visible focus state, an accessible name, and correct semantics. Colour must never be the only carrier of meaning. Respect `prefers-reduced-motion`.

**Server components by default.** Reach for `"use client"` only where interactivity actually requires it.

### Adding a tool

Tools are only added where running in the browser is genuinely better than linking to an existing application. Prefer browser APIs, then an existing permissively-licensed open-source library. Do not reimplement a solved problem.

Every tool must declare its `processing` metadata honestly. The build rejects a tool that claims browser-local processing while also declaring that data leaves the device, because the privacy notice shown to users is generated from that declaration. If your implementation sends data anywhere, say so — the tool will still be accepted, and the page will tell users the truth.

Tools must also document their limitations. There is no such thing as a tool with no trade-offs.

---

## Code of conduct

Participation is covered by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Please do not report security issues in public issues. See [SECURITY.md](SECURITY.md).

## Licence

Contributions are made under the [MIT Licence](LICENSE).
