# Verification

How Everything.Free decides what it is willing to claim.

The project's goal is not the largest list of free resources. It is **the most trustworthy way to discover them**. That only works if every entry says how much it has actually been checked, against what, when, and by whom, and if the badges are hard to earn.

**The goal is honest badges, not more badges.**

---

## The current state, stated plainly

| | Count |
| --- | --- |
| Resources | 44 |
| `VERIFIED` | **0** |
| Evidence complete, awaiting maintainer sign-off | 4 — Obsidian, GIMP, LibreOffice, KeePassXC |
| Partially verified (free status confirmed, checklist incomplete) | 2 — Supabase, Autodesk Fusion |
| Checks started, free status not yet confirmed | 4 — VLC, Thunderbird, Cloudflare Pages, Stirling PDF |
| Not verified yet (no checks recorded) | 34 |
| Registered maintainers | 0 |

Nothing is marked `VERIFIED`, and that is correct: no maintainer has registered or signed anything off yet.

The live numbers, and a check-by-check worksheet for every entry with evidence, are in [`verification-backlog.md`](verification-backlog.md). It is generated from the data and kept in sync by CI.

**What changed on 26 September 2026.** The 39 seed entries compiled from each project's public documentation used to show "Partially verified" with a review date, although no check had ever been recorded for them. That overstated them. Each now carries only the status its recorded evidence supports: 33 show **Unverified** with no verification date and say how they were compiled, four have had their official URL checked during link triage, and GIMP and LibreOffice went through a full pass. Build rules stop the old state coming back ([below](#what-the-build-enforces)).

**Two card questions are still open, deliberately.** No official Supabase or Autodesk page says whether signing up for the free offering asks for a payment method. Supabase's Terms reserve the right to validate one at account creation. Both stay `unknown` until the vendor says so or a maintainer records a dated sign-up test. Converting "not established" into "no" would be exactly the kind of guess this project exists to avoid.

---

## Verification statuses

| Status | Meaning | Requirements (enforced at build time) |
| --- | --- | --- |
| `VERIFIED` | Every required fact confirmed against official sources, and signed off | All 10 required checks confirmed; every source they rest on read within 90 days of sign-off; `verifiedBy` is a maintainer in [the register](#the-maintainer-register) |
| `PARTIALLY_VERIFIED` | The free status is confirmed; some details are not yet, or sign-off is pending | The `FREE_STATUS` check is confirmed against an official source |
| `UNVERIFIED` | The free status has not been confirmed from an official source | `FREE_STATUS` not confirmed. Other checks may have been started |
| `OUTDATED` | Last check older than the freshness window | **Computed, never stored** |
| `REPORTED` | An open problem report against this entry | — |

"Partially verified" is a promise about the headline claim. If a visitor sees it, someone confirmed from the provider's own pages that the thing is free in the way the listing says.

### Freshness

A check older than **90 days** (`VERIFICATION_FRESHNESS_DAYS`) is shown as needing a re-check, whatever the stored status says. `effectiveVerification()` computes this, so a stale entry cannot keep displaying a confident badge.

### Workflow stages

For maintainers, every listing also has a **stage**, derived from its evidence by `verificationStage()` in `src/config/verification.ts`. The resource page, the `/verification` page, the backlog and the monthly issue all use this one function, so they cannot disagree:

| Stage | Means |
| --- | --- |
| `verified` | Signed off |
| `awaiting-sign-off` | All required checks confirmed; a maintainer has not signed off yet. Shown as "Evidence complete, awaiting sign-off" |
| `partial` | Free status confirmed, other required checks open |
| `started` | Some checks recorded, free status not yet confirmed (shown as Unverified) |
| `not-started` | No checks recorded |

---

## Resource status and fact evidence

These are two different things, and the site never merges them.

- **Resource status** (`VERIFIED`, `PARTIALLY_VERIFIED`, `UNVERIFIED`) describes the listing as a whole: how far its checklist has got, and whether a maintainer has signed it off. It is the badge.
- **Fact evidence** describes one fact on the listing, such as "a credit card is not required". It answers a narrower question: has an official source confirmed *this* value?

A value existing in the data is not evidence. Most listings were compiled from public documentation, so a field like `requiresCreditCard: "no"` is a claim until a check confirms it. Showing it the way a confirmed fact is shown (a tick, a "No credit card" chip, a strict filter match) would present the claim as evidence.

### The three states

`src/lib/resources/evidence.ts` derives every fact's state from the recorded checks. Nothing about evidence is stored separately, so it cannot drift from them.

| State | Label | When |
| --- | --- | --- |
| Confirmed | **Confirmed** | The fact's check is `confirmed` and the pass is inside the 90-day window |
| Unconfirmed | **Not verified** | A value is recorded but its check has never been done |
| Unconfirmed | **Needs re-checking** | The check was confirmed, but the pass is older than 90 days |
| Unknown | **Not confirmed** | The check was done and could not settle it (`unresolved`); the value is `unknown` |
| Unknown | **Unknown** | No value is recorded and nothing has been checked |

Each fact rests on exactly one check, and nothing is inferred across checks. Open source needs `OPEN_SOURCE_STATUS`; a confirmed free status of "Open source" does not confirm it. Commercial use needs `COMMERCIAL_USE`; a confirmed licence does not confirm it.

`false` or `"no"` is never read as a confirmed no, and `true` or `"yes"` is never read as a confirmed yes. They are recorded values, shown as "Recorded as no · Not verified" until their check is confirmed.

### Who confirmed it

A confirmed check recorded by an agent-assisted pass counts as a confirmed fact. It rests on a dated official source that anyone can open, and the page says who recorded it ("Checked by …") and when. That is why a listing can show confirmed facts while its badge still says Partially verified or Unverified. `VERIFIED` remains the separate, human-only sign-off of the whole listing.

### Where it shows

- **Cards** show one short line per state, with a text label and an icon (never colour alone): "Confirmed: no credit card needed, commercial use allowed", "Not confirmed: credit card", "Not verified: free status, account". Values are stated only on the confirmed line. The free-status badge turns neutral with "(free status not verified)" for screen readers when the classification is unchecked, and the open-source chip reads "Open source · not verified".
- **Resource pages** show every fact as its value *and* its evidence, side by side. "How we know" opens the check's evidence, the source it rests on, the date that source was read, and who checked it. The page title, link previews and search snippets say "(not verified)" when the free status is unchecked, and structured data only includes a price offer when it is confirmed.
- **Comparison tables** on alternatives pages carry the evidence state in every fact cell.
- **Collections** are chosen from what listings record. Each collection says so, and each card says what is confirmed.

### Filters

Two kinds of filter behave differently, and the filter panel says which is which.

- **Classification filters** (free status, type, platform, category, tag) narrow by what a listing is filed under. Every result card shows how far that has been checked.
- **Confirmed-fact filters** (open source, no account needed, no credit card, commercial use allowed, personal use allowed) are promises. They match only a confirmed fact. A recorded but unchecked "no" does not match "No credit card", and `unknown` never matches either "yes" or "no".

The panel shows how many more listings record the value without confirmation, and the results say how many were held back, rather than quietly mixing them in or hiding that they exist. Plain-language search ("free AI tool without a credit card") applies the same confirmed-only filter and labels it "No credit card (confirmed only)".

### What the build refuses

Impossible evidence states fail `next build` (and `npm test`):

- A confirmed account, card, commercial-use or personal-use check next to a value of `unknown` (a confirmation of nothing)
- A confirmed `FREE_STATUS` with a free status of `UNKNOWN`
- A confirmed `LICENSE` with no licence recorded; a confirmed `PLATFORM_AVAILABILITY` with no platforms
- A free status of `OPEN_SOURCE` with `openSource: false`
- A free status of `PERSONAL_FREE` (commercial use restricted) with `commercialUse: "yes"`
- A tag that restates a fact (`no-signup`, `no-credit-card`, `commercial-use`, `open-source` and similar). Tags are topics and filter by their recorded value, so a fact-shaped tag would repeat the claim without its evidence and bypass the confirmed-only filter. Use the field.

---

## The checklist

Verification is not one judgement. It is a list of separate facts, each recorded individually so a resource page can show exactly what is known.

| Check | Question | Required for `VERIFIED` |
| --- | --- | --- |
| `OFFICIAL_URL` | Does the link go to the provider's own site, and does it load? | ✅ |
| `FREE_STATUS` | Does the provider's documentation support the classification? | ✅ |
| `FREE_TIER_LIMITS` | What exactly does the free offering cap? | ✅ |
| `LIMITATIONS` | Are the significant limitations documented, including inconvenient ones? | ✅ |
| `ACCOUNT_REQUIREMENT` | Can it be used without creating an account? | ✅ |
| `CREDIT_CARD_REQUIREMENT` | Is a payment method required to start? | ✅ |
| `COMMERCIAL_USE` | Do the terms permit paid or business use? | ✅ |
| `PERSONAL_USE` | Do the terms permit personal, non-commercial use? | ✅ |
| `LICENSE` | Is the recorded licence the one actually published? | ✅ |
| `PRICING_INFORMATION` | Where does the free/paid boundary sit? | ✅ |
| `OPEN_SOURCE_STATUS` | Is the source genuinely under an open-source licence? | — |
| `PLATFORM_AVAILABILITY` | Are the listed platforms the supported ones? | — |

The required set is the group of facts that determine **whether, and on what terms, something is free**: the claims a user acts on.

---

## What a record looks like

Each page that was read is listed once, with what it establishes and the date it was read:

```ts
verificationSources: [
  {
    url: "https://supabase.com/terms",
    label: "Terms of Service: … reserves the right to preauthorise or validate a payment method upon account creation …",
    retrievedAt: "2026-09-26",
  },
],
```

Each check that was looked at gets one record:

```ts
verificationChecks: [
  {
    check: "CREDIT_CARD_REQUIREMENT",
    result: "unresolved",
    evidence:
      "The sign-up form asks only for an email and password (or SSO), with no payment step. But the Terms reserve the right to …",
    sourceUrl: "https://supabase.com/terms",
  },
],
```

| Field | Meaning |
| --- | --- |
| `result: "confirmed"` | An official source establishes the fact, and the listing agrees with it |
| `result: "unresolved"` | Looked for, not settled. The evidence says what was found and why it is not enough |
| *(no record)* | Not looked at |
| `evidence` | What the source actually says, specific enough for someone else to re-check |
| `sourceUrl` | The page it rests on. Required for `confirmed`; must be one of the entry's `verificationSources` |

So for every check a maintainer can see the result, the evidence, the source URL, what that source establishes, the date it was read and who read it (`verifiedBy`). `npm run worksheet -- <slug>` prints all of that for one entry, and the backlog includes it for every entry with evidence.

There is deliberately no "failed" result. If a source contradicts the listing, **correct the listing**, then record the check as confirmed against the corrected value. A fact you could not settle is `unresolved`, and the matching field on the listing must be `unknown`; the build enforces this for the account, card, commercial-use and personal-use fields.

### Compilation notes are not evidence

`compilationNotes` records how a listing was put together before anyone verified it: what it was based on and what is known to be missing. The page shows it under "How this listing was compiled", labelled as not verification. It carries no date and counts for nothing.

`lastVerifiedAt`, `verifiedBy`, `verificationNotes` and `verificationSources` are only allowed alongside recorded checks. A verification date with no check behind it is the misleading state these rules removed.

---

## The workflow

The same steps for every entry, whether it is a first pass, finishing a partial one, or a re-check.

### 1. Pick the next entry

Take it from [`verification-backlog.md`](verification-backlog.md), in queue order. The queue is a work order, not a ranking of the resources.

### 2. Print its worksheet

```bash
npm run build:static
npm run worksheet -- gimp
```

It lists every check, gaps first, with the question to answer for each open one and a record template to paste.

### 3. Read the provider's own pages

Pricing, licence, terms, FAQ, downloads, release notes, the licence file in the official repository. **Not** reviews, blog posts, listicles, community forum answers, university IT pages or other directories. If the only evidence is third-party, the check is `unresolved`.

Start with `FREE_STATUS`: until it is confirmed, the entry stays Unverified however many other checks are done.

### 4. Record what you read

Add every page to `verificationSources` with a label and today's date, then one `verificationChecks` record per check you looked at. Write down what the page says, not "confirmed on pricing page".

### 5. Correct the listing

Verification is where listings get fixed. The passes so far corrected:

- **Supabase** — paused projects need a manual resume; the two-project limit is per person; the card requirement is unknown, not "no".
- **Autodesk Fusion** — the card requirement is unknown; Autodesk's own list of reduced features; the 10 active editable documents limit the listing had missed.
- **GIMP** — the listing said non-destructive adjustment layers were unavailable. GIMP 3.0 and 3.2 added them, so the line was removed.
- **LibreOffice** — an editorial remark about the interface was replaced with a vendor-stated limitation (Java for Base).
- **Obsidian** — an editorial remark no Obsidian page states was removed from the limitations.
- **Stirling PDF** — the site moved to stirling.com and the licence is MIT *except* some separately licensed directories, so commercial use is now unknown.

Remove limitations that are opinions rather than facts a source states. Add limitations the source states and the listing missed.

### 6. Set the status the evidence supports

- `FREE_STATUS` not confirmed → `UNVERIFIED`
- `FREE_STATUS` confirmed → `PARTIALLY_VERIFIED`, even if all ten are done
- `VERIFIED` → only a registered maintainer, at sign-off

Set `lastVerifiedAt` to today and `verifiedBy` to who did the pass: your `@handle`, or an honest description such as `"agent-assisted pass — awaiting maintainer review"`. Say in `verificationNotes` what was settled, what was not, and what you corrected.

### 7. Regenerate and open a pull request

```bash
npm run build:static   # fails if the claim outruns the evidence
npm run backlog        # updates docs/verification-backlog.md
```

CI rejects the pull request if the data breaks a rule or the backlog was not regenerated.

---

## The human gate

**No script, bot or AI assistant can mark anything `VERIFIED`.**

Automated and AI-assisted passes are useful, and their work is kept. They record evidence under an honest label, and the entry stays `PARTIALLY_VERIFIED`. When every required check is confirmed, the page says **"Evidence complete, awaiting sign-off"**, never Verified.

### The maintainer register

`src/config/maintainers.ts` lists the people who may sign off. `VERIFIED` is only accepted when `verifiedBy` is a handle in that list:

```
"obsidian" is marked VERIFIED by @someone, who is not in the maintainer register (src/config/maintainers.ts).
A maintainer adds their own handle there before signing anything off
```

- Each maintainer adds **their own** handle, in a pull request they author.
- Nobody adds a handle for someone else: not a contributor, a script, a bot or an assistant.
- The register is empty today, so nothing can be signed off yet. That is the intended starting point, not an oversight.

### Signing off (maintainers)

1. Make sure your handle is in `src/config/maintainers.ts` (added by you).
2. Run `npm run worksheet -- <slug>` and open **every** source yourself. Pricing pages change, and the evidence dates are when someone else read them.
3. Check every `confirmed` record against its source. If the source no longer says it, fix the record and the listing, not just the badge.
4. If everything holds, set:

   ```ts
   verificationStatus: "VERIFIED",
   verifiedBy: "@your-github-handle",
   lastVerifiedAt: "<today>",
   ```

   and update each source's `retrievedAt` to the date you re-read it. The build rejects a sign-off that rests on a source read more than 90 days before it.
5. Regenerate the backlog and open a pull request. The handle on the entry is the accountable name for the claim.

Entries ready for sign-off today: **Obsidian, GIMP, LibreOffice, KeePassXC**.

---

## What the build enforces

The rules live in `src/data/resources/validate.ts` and run from `src/data/resources/index.ts` at module load, so `next build` fails. `npm test` runs the same rules against the real data and against fixtures for each impossible state:

- `VERIFIED` without all required checks confirmed, without a maintainer from the register, or resting on a source read more than 90 days before sign-off
- `PARTIALLY_VERIFIED` without a confirmed `FREE_STATUS`; `UNVERIFIED` with one
- `lastVerifiedAt`, `verifiedBy`, `verificationNotes` or `verificationSources` with no recorded checks
- Recorded checks without `lastVerifiedAt`, `verifiedBy` or `verificationNotes`
- A confirmed check with no `sourceUrl`, or one not listed in `verificationSources`
- An unresolved account, card, commercial-use or personal-use check next to a field that is not `unknown`
- Evidence under 20 characters; a check recorded twice; unknown checks or results
- A verification date in the future, or a source read after the pass's `lastVerifiedAt`
- Non-HTTPS or undated sources, or sources with no label
- A conditional free status with no documented limitations
- The impossible evidence states listed [above](#what-the-build-refuses)

Plus HTTPS URLs, unique slugs, known categories and platforms, no dangling cross-references, no self-contradicting tool privacy declarations and no tools declaring paid infrastructure.

---

## What is automated, and what is not

### Automated

- **Build-time rules** above, on every pull request.
- **Unit tests** (`npm test`, in CI): the evidence states, confirmed-only filters and impossible-state rules, against fixtures and the real data.
- **Browser checks** (`npm run test:browser`, in CI; pass `--url` to run them against production): every card on the listing, home, category and audience pages is audited against the link manifest's fact evidence.
- **Backlog sync** (`npm run backlog:check`, in CI).
- **Verification freshness** (`.github/workflows/verification-freshness.yml`), monthly. Keeps one open issue whose description is always the current report: *Awaiting maintainer sign-off*, *Fully verified*, *Partially verified*, *Never verified*, *Past freshness window*. Makes no network requests.
- **Link health** (`.github/workflows/link-health.yml`), monthly. See [below](#link-health).

### Not automated (and will not be)

- **Deciding whether something is free.** A 200 response means a URL resolves. It says nothing about pricing.
- **Classifying pricing.** Free-tier boundaries are written in prose, full of exceptions, and change without notice.
- **Marking anything verified, or confirming a link is broken.** Both need a person.

---

## Link health

The monthly check requests every published URL (official, source, pricing, licence), honours `robots.txt`, identifies itself, paces requests and asks each distinct URL once. It files every finding into one of four sections:

| Section | What lands there |
| --- | --- |
| **Needs manual review** | Failures it cannot explain (404, 5xx, timeouts, DNS errors) and redirects from HTTPS to plain HTTP |
| **Redirected** | The URL resolves elsewhere. Same-site redirects (a language page, a trailing slash) are usually fine; a different domain needs a person to confirm it is official |
| **Temporarily blocked / bot protection suspected** | 401, 403 or 429, especially with a recognisable challenge (Cloudflare, Akamai, Anubis) |
| **Confirmed broken** | Only links a person opened and recorded as broken |

**The HTTP status never decides the verdict on its own.** A 403 from bot protection is not a dead page, a redirect is not a broken link, and nothing is "confirmed broken" without a person.

### Recording triage

When you have checked a finding by hand, record it in `.github/link-triage.json` so next month's report files it correctly:

```json
{
  "url": "https://www.pexels.com",
  "classification": "bot-protection",
  "expect": { "status": [403] },
  "reviewedAt": "2026-09-26",
  "reviewedBy": "@your-github-handle",
  "evidence": "Cloudflare challenge (cf-mitigated: challenge) for the checker; the site loads in a browser."
}
```

- `classification` is `bot-protection`, `accepted-redirect` or `confirmed-broken`.
- `expect` is what the checker must still see. If a reviewed 403 becomes a 404, the review stops applying and the link goes back to *Needs manual review*.
- Reviews expire after 90 days.
- Triage changes how a finding is reported. It never changes a listing: fix URLs in `src/data/resources`, and only once the new destination is confirmed as the provider's own.

The issue stays open while anything needs a person, and the workflow closes it once every finding is explained or reviewed.

---

## Pricing-change detection

There is deliberately no automated pricing monitor, and no AI-based one. A wrong automated conclusion about whether something is free is worse than no conclusion.

The design relies instead on:

1. **`lastVerifiedAt` and the 90-day window.** Claims expire visibly.
2. **Dated sources on every check.** Re-checking means re-opening a known list of pages.
3. **User reports.** The people who hit a changed limit find out before any crawler would.
4. **Low-frequency link checks**, which catch a pricing page that has moved or disappeared.

---

## Contributing verification

This is the most valuable contribution to the project, ahead of adding new resources. A wrong entry is worse than a missing one.

Pick anything from [`verification-backlog.md`](verification-backlog.md) and follow [the workflow](#the-workflow). Confirming three checks and honestly recording the rest as unresolved or unchecked is a real contribution. Claiming ten without looking is not, and the build will reject it.
