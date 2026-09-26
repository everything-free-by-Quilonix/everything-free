# Moderation

The editorial workflow: how a submission becomes a published listing, and what happens to it afterwards.

All of it runs on GitHub — issues, labels, pull requests, review. There is no admin dashboard and no moderation database, because GitHub already provides a durable record, threaded discussion, assignment, search and an audit trail at no cost.

---

## Resource lifecycle

```
       Submission form  /  GitHub issue
                    │
                    ▼
              ┌─────────────┐
              │  SUBMITTED  │  label: resource-submission
              └─────────────┘
                    │
                    ▼
            ┌────────────────┐
            │  UNDER_REVIEW  │  a maintainer has picked it up
            └────────────────┘
                    │
        ┌───────────┼───────────────┬──────────────┐
        ▼           ▼               ▼              ▼
   ┌──────────┐ ┌──────────┐  ┌───────────────────────────┐
   │ REJECTED │ │DUPLICATE │  │  VERIFICATION_REQUIRED    │
   └──────────┘ └──────────┘  └───────────────────────────┘
                                          │
                                   pull request
                                  (data + evidence)
                                          │
                                  CI validation
                                          │
                                        merge
                                          │
                                        build
                                          ▼
                                 ┌──────────────┐
                                 │  PUBLISHED   │
                                 └──────────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                    ┌──────────┐   ┌──────────┐   ┌──────────┐
                    │ REPORTED │   │ OUTDATED │   │ ARCHIVED │
                    └──────────┘   └──────────┘   └──────────┘
```

### These are workflow states, not user-facing states

They live as **GitHub issue labels and pull-request status**, not in the resource schema.

That separation is deliberate. A visitor needs to know how much to trust what is in front of them — which is the *verification* status, a different axis. Where an entry sits in a maintainer's queue is internal process, and exposing it would clutter the interface with information nobody outside the project can act on.

The two axes are independent: a `PUBLISHED` resource can be `UNVERIFIED`, and a `VERIFICATION_REQUIRED` submission is not published at all.

| Axis | Where it lives | Who sees it |
| --- | --- | --- |
| Workflow state | GitHub labels | Maintainers |
| Verification status | `Resource.verificationStatus` | Everyone |

---

## State definitions

| State | Meaning | Exit |
| --- | --- | --- |
| `SUBMITTED` | Received, nobody has looked yet | → `UNDER_REVIEW` |
| `UNDER_REVIEW` | A maintainer is assessing it against the acceptance rules | → `VERIFICATION_REQUIRED`, `REJECTED`, `DUPLICATE` |
| `VERIFICATION_REQUIRED` | Accepted in principle; needs its facts established before publishing | → `PUBLISHED` |
| `PUBLISHED` | Live in the library | → `REPORTED`, `OUTDATED`, `ARCHIVED` |
| `REPORTED` | An open problem report exists. Surfaced to users | → `PUBLISHED` once resolved, or `ARCHIVED` |
| `OUTDATED` | Past the 90-day freshness window. **Computed, not stored** | → `PUBLISHED` on re-verification |
| `REJECTED` | Does not meet the rules. Reason recorded on the issue | Terminal |
| `DUPLICATE` | Already listed | Terminal, linked to the existing entry |
| `ARCHIVED` | Was listed, no longer qualifies — shut down, or no longer free | Terminal |

`ARCHIVED` is not the same as deleted. A resource that stopped being free is useful information, and removing it silently means the next person submits it again. Archiving is not yet implemented in the schema; when it is, archived entries should remain reachable and clearly labelled rather than being dropped from the library.

---

## Reviewing a submission

### 1. Is it in scope?

Accept if there is a genuinely free way to use it and that can be pointed at. Reject:

- paid products with a trial presented as free
- anything needing a licence key from an unofficial source
- resources that circumvent payment, licensing or access controls
- content that infringes copyright
- link shorteners, affiliate URLs, or mirrors in place of the official link
- undisclosed self-promotion — disclosing it is fine, hiding it is not

### 2. Is the free status right?

The most commonly wrong field, and the one the project rests on. Check the definitions in [`CONTRIBUTING.md`](../CONTRIBUTING.md#choosing-a-free-status). Watch for:

- a trial submitted as `FREE_TIER` (a free tier does not expire)
- a capped free plan submitted as `FREE`
- `OPEN_SOURCE` for a product whose *binaries* are proprietary
- `OPEN_SOURCE` implying the hosted version is free

### 3. Are the limitations documented?

Required for `FREE_TIER`, `LIMITED_FREE`, `PERSONAL_FREE` and `TRIAL`. The build enforces this, so a submission missing them cannot be merged — but catching it in review is faster than catching it in CI.

### 4. Is there a stated reason for listing?

`whyListed` is shown verbatim on the resource page. "It's free and useful" is not a reason.

### 5. Turn it into a pull request

Add the entry to the appropriate file in `src/data/resources/`, with whatever verification evidence exists. Link the PR to the issue so the trail is intact.

---

## Handling reports

Reports are the highest-value input the project receives, because a wrong entry is worse than a missing one. Someone will act on it.

| Report | Action |
| --- | --- |
| `BROKEN_LINK` | Confirm by hand. Update the URL, or archive if the resource is gone |
| `NO_LONGER_FREE` | Verify against official sources. Reclassify or archive |
| `PRICING_CHANGED` | Re-verify, update limitations, reset `lastVerifiedAt` |
| `INCORRECT_INFORMATION` | Correct the field and record what changed |
| `WRONG_CATEGORY` | Recategorise |
| `DUPLICATE` | Merge, keeping the better-verified entry |
| `SUGGEST_ALTERNATIVE` | Treat as a submission |

**Set `verificationStatus: "REPORTED"` while a report is open.** Users see it, which is the point — a known problem shown is better than a known problem hidden.

### Priority

1. Anything claiming something is free when it is not — this actively misleads
2. Broken links
3. Wrong limitations
4. Everything else

---

## Moderation principles

**Accuracy beats volume.** There is no target number of resources. A smaller, correct library is worth more than a large, stale one.

**Absent is better than wrong.** When a fact cannot be established, record it as unknown. The tri-state fields exist for exactly this.

**Explain rejections.** A contributor who understands why something was declined can submit something better. A silent close teaches nothing.

**Disclose conflicts.** A maintainer reviewing their own submission should say so and get a second opinion.

**No pay-for-placement, ever.** No sponsored listings, no affiliate links, no paid ordering. This is the one rule that cannot be traded away — the moment placement is purchasable, nothing else in the library can be trusted either.

---

## Labels

| Label | Use |
| --- | --- |
| `resource-submission` | New resource proposed |
| `correction` | Report against an existing entry |
| `verification` | Verification work needed or in progress |
| `link-health` | Automated link-check report |
| `duplicate` | Already listed |
| `wontlist` | Assessed and declined, reason recorded |
| `bug` | Site defect |
| `accessibility` | Accessibility defect — treated as a bug, not an enhancement |

The two scheduled workflows reuse a single open issue per label rather than filing a new one each month, so the tracker does not fill with near-identical reports.

---

## What is deliberately not built

- **No admin dashboard.** Everything is doable with GitHub's interface. A custom dashboard would need authentication, hosting and maintenance to replace something that already works.
- **No automated publishing.** A submission never becomes a listing without a human merging it.
- **No reputation system.** It would need identity, storage and moderation of its own, to rank contributors nobody is competing to be.
- **No automated verification.** Covered in [`docs/verification.md`](verification.md).
