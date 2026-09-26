# Verification

How Everything.Free decides what it is willing to claim.

Verification is the project's only real differentiator. Anyone can list free tools; the value here is that each entry states how much it has actually been checked, against what, when, and by whom. That is only worth anything if the badges are hard to earn.

**The goal is honest badges, not more badges.**

---

## The current state, stated plainly

| | Count |
| --- | --- |
| Resources | 43 |
| `VERIFIED` | **0** |
| `PARTIALLY_VERIFIED` | 42 |
| `UNVERIFIED` | 1 |
| With per-check evidence records | 3 |
| Evidence complete, awaiting maintainer sign-off | 1 (Obsidian) |

Nothing is marked `VERIFIED`, and that is correct: no maintainer has signed anything off yet.

Three entries were re-checked on 26 September 2026 against official pages only, with every check recorded individually:

| Resource | Required checks confirmed | Outstanding |
| --- | --- | --- |
| Obsidian | 10 / 10 | Maintainer sign-off |
| Supabase | 9 / 10 | Credit-card requirement — the Terms reserve payment-method validation at signup |
| Autodesk Fusion (personal) | 9 / 10 | Credit-card requirement — no official page states it either way |

That pass corrected four published claims. Supabase's paused projects do not wake on the next request; they need a manual resume. Its two-project limit is per person, not per plan. Neither Supabase nor Fusion is documented as card-free, so both now say "unknown" instead of "no". And Fusion's list of reduced features now uses Autodesk's own wording.

The other 40 entries were compiled from each project's own public documentation. They carry a review date but no per-check records, so every required check is still open for them.

The full work queue is [`verification-backlog.md`](verification-backlog.md), generated from the data and kept in sync by CI.

---

## Verification statuses

| Status | Meaning | Requirements |
| --- | --- | --- |
| `VERIFIED` | Every trust-critical fact confirmed against official sources, and signed off | All 10 required checks confirmed, each citing a dated official source, **signed off by a maintainer's GitHub handle**. Enforced at build time |
| `PARTIALLY_VERIFIED` | The headline status is right; some details are not yet confirmed | Verification notes explaining what is *not* confirmed |
| `UNVERIFIED` | In the library, not yet checked by anyone | — |
| `OUTDATED` | Last check older than the freshness window | **Computed, never stored** |
| `REPORTED` | An open problem report against this entry | — |

### Freshness

A verification older than **90 days** (`VERIFICATION_FRESHNESS_DAYS`) is shown as needing a re-check whatever its stored status says. `effectiveVerification()` computes this, so a stale entry cannot keep displaying a confident badge. Re-verifying existing entries is real, recurring work, as valuable as adding new ones.

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

The required set is the group of facts that determine **whether, and on what terms, something is free**: the claims a user acts on. Platform coverage and open-source status are worth recording but do not by themselves make a listing untrustworthy.

---

## Per-check records

Each check a verifier looked at gets one record in `verificationChecks`:

```ts
{
  check: "CREDIT_CARD_REQUIREMENT",
  result: "unresolved",
  evidence:
    "No official page states that the Free plan needs no card. The Terms of Service reserve the right " +
    "to validate a payment method upon account creation, so a card may be asked for. Recorded as unknown " +
    "rather than guessed; confirming it needs a signup test or an explicit vendor statement.",
  sourceUrl: "https://supabase.com/terms",
}
```

| Field | Meaning |
| --- | --- |
| `result: "confirmed"` | An official source establishes the fact, and the listing agrees with it |
| `result: "unresolved"` | Looked for, not settled. The evidence says what was found and why it is not enough |
| *(no record)* | Not looked at |
| `evidence` | What the source actually says, paraphrased and specific enough to check. Not "confirmed on pricing page" |
| `sourceUrl` | The page it rests on. Required for `confirmed`, and must be one of the entry's `verificationSources` |

There is deliberately no "failed" result. If a source contradicts the listing, **correct the listing**, then record the check as confirmed against the corrected value. A contradiction you cannot resolve is `unresolved`, and the listing's field becomes `unknown`.

`unresolved` exists so a gap is not mistaken for oversight. Knowing a check was attempted, and why it could not be settled, tells the next person exactly where to look.

---

## The human gate

**No script, bot or AI assistant can mark anything `VERIFIED`.** The build enforces this.

`VERIFIED` requires `verifiedBy` to be a GitHub handle, `@name`, belonging to the maintainer who reviewed the evidence. Anything else fails the build:

```
"obsidian" is marked VERIFIED but verifiedBy is "agent-assisted pass — awaiting maintainer review".
VERIFIED requires the GitHub handle (@name) of the maintainer who reviewed the evidence
```

Automated and AI-assisted passes are still useful, and their work is kept. They gather sources and record evidence under an honest label such as `"agent-assisted pass — awaiting maintainer review"`, and the entry stays `PARTIALLY_VERIFIED`. When every required check is confirmed, the resource page shows **"Evidence complete, awaiting sign-off"**, never a Verified badge.

### Signing off (maintainers)

1. Open each source in the entry's `verificationSources` yourself. Pricing pages change, and the date on the evidence is the date someone else read it.
2. Read every `confirmed` record against its source. If the source no longer says it, fix the record, not just the badge.
3. If everything holds, set:

   ```ts
   verificationStatus: "VERIFIED",
   verifiedBy: "@your-github-handle",
   lastVerifiedAt: "<today>",
   ```

   Update each source's `retrievedAt` to the date you re-read it.
4. Regenerate the backlog (`npm run build:static && npm run backlog`) and open a pull request. The handle on the entry is the accountable name for the claim.

---

## How to verify an entry

### 1. Use official sources only

Open the provider's own pricing, licence or documentation pages, or the licence file in its official repository. **Not** a review, a blog post, a listicle, a university IT page or another directory. If the only evidence is third-party, the check is not confirmed. Record it as `unresolved` and say what you found.

### 2. Record each source once, with a date

```ts
verificationSources: [
  {
    url: "https://supabase.com/pricing",
    label: "Pricing page: Free plan with 500 MB database per project, pausing after 1 week of inactivity, …",
    retrievedAt: "2026-09-26",
  },
],
```

The label states what *that page* establishes. A date matters as much as the URL: a vendor pricing page is a moving target, so evidence without a date is not evidence.

### 3. Work the checklist, one record per check

Confirm it from an official page, record it as unresolved with the reason, or leave it out. Leaving a check out is more useful than guessing, because the gap tells the next person where to look.

### 4. Say what you did *not* confirm

```ts
verificationNotes:
  "… Nine of ten required checks are confirmed. … The credit-card requirement could not be " +
  "established: the Terms reserve the right to validate a payment method at account creation, " +
  "and no official page says a card is never needed, so it is recorded as unknown.",
```

### 5. Attribute it honestly

```ts
lastVerifiedAt: "2026-09-26",
verifiedBy: "@your-github-handle",      // a person who did the pass
// or
verifiedBy: "agent-assisted pass — awaiting maintainer review",
```

### 6. Regenerate the backlog and open a pull request

```bash
npm run build:static   # fails if the claim outruns the evidence
npm run backlog        # updates docs/verification-backlog.md
```

CI rejects the change if the claim outruns the evidence or the backlog was not regenerated.

---

## What the build enforces

In `src/data/resources/index.ts`, at module load, so `next build` fails:

- `VERIFIED` without a maintainer handle, a date, sources, or all required checks confirmed
- A confirmed check with no `sourceUrl`
- A `sourceUrl` that is not one of the entry's `verificationSources`
- Evidence shorter than a sentence (under 20 characters)
- A check recorded twice, or an unknown check or result
- Check records with no `verifiedBy` or `lastVerifiedAt`
- Non-HTTPS or undated sources, or sources with no label
- A conditional free status with no documented limitations
- Verification claims without notes

Plus the non-verification rules: HTTPS URLs, unique slugs, known categories and platforms, no dangling cross-references, no self-contradicting tool privacy declarations, no tools declaring paid infrastructure.

---

## What is automated, and what is not

### Automated

- **Build-time rules** above, on every pull request.
- **Backlog sync** (`npm run backlog:check`, in CI). `docs/verification-backlog.md` must match the data.
- **Link health** (`.github/workflows/link-health.yml`), monthly. Confirms URLs resolve. Honours `robots.txt`, identifies itself, paces requests.
- **Verification freshness** (`.github/workflows/verification-freshness.yml`), monthly. Reports never-verified entries, incomplete checklists and anything past the 90-day window. Makes no network requests. Both scheduled jobs file or update a single issue under their own label instead of opening a new one each month.

### Not automated (and will not be)

- **Deciding whether something is free.** A 200 response means a URL resolves. It says nothing about pricing.
- **Classifying pricing.** Free-tier boundaries are written in prose, full of exceptions, and change without notice. A person reads them.
- **Marking anything verified.** No workflow, script or assistant can set `VERIFIED`. The build rejects it without a maintainer's handle.

---

## Link health

A failure is not proof a resource is gone. Servers block automated requests, rate-limit, or go down briefly. Reports say so, and every finding needs a human check before a listing is edited.

The checker fetches and honours `robots.txt` per origin, identifies itself with a contact URL, tries `HEAD` before `GET`, paces requests, times out rather than hanging, reports redirects separately from failures, and **never concludes anything about pricing**.

It runs monthly, not daily. These requests hit servers belonging to projects the library recommends. A dead link found three weeks late costs a user one click; an impolite crawler costs the project its standing.

---

## Pricing-change detection

There is deliberately no automated pricing monitor, and no AI-based one. A wrong automated conclusion about whether something is free is worse than no conclusion.

The design relies instead on:

1. **`lastVerifiedAt` and the 90-day window.** Claims expire visibly.
2. **Dated sources on every check.** Re-checking means re-opening a known list of pages.
3. **User reports.** The people who hit a changed limit find out before any crawler would.
4. **Low-frequency link checks**, which catch a pricing page that has moved or disappeared.

If automation is added later, it should narrow human attention, never replace it. For example, it could flag a changed pricing page for review. It must not update a free status on its own.

---

## Contributing verification

This is the most valuable contribution to the project, ahead of adding new resources. A wrong entry is worse than a missing one.

Pick anything from [`verification-backlog.md`](verification-backlog.md), work the checklist, record the evidence, and open a pull request. Confirming three checks and honestly recording seven as unresolved or unchecked is a real contribution. Claiming ten without looking is not, and the build will reject it.
