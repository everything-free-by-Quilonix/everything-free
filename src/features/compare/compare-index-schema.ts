import { z } from "zod";

import type { EvidenceReason, EvidenceState } from "@/lib/resources/evidence";

/**
 * The compare index as fetched by `/compare/`, validated before use.
 *
 * Version 1, with the same `v` and `t` header as the palette index. Each fact
 * cell carries the words the build chose and the `{ state, reason }` that
 * `factEvidence` returned, the shape `link-manifest.json` uses, so the table can
 * write `data-evidence` straight from it. Both evidence members are closed
 * enums pinned to the library's own unions (type-only import), so a change to
 * either union fails `typecheck`. A shape this schema rejects is a load failure,
 * never partly rendered; `k + u ≤ t` is enforced per listing.
 */
// zod's fast path compiles object parsers with `new Function`, which the
// strict CSP (no 'unsafe-eval') blocks and reports as a violation. The
// interpreted path gives the same results.
z.config({ jitless: true });

const evidenceState = z.enum(["confirmed", "unconfirmed", "unknown"]) satisfies z.ZodType<EvidenceState>;
const evidenceReason = z.enum([
  "confirmed",
  "stale",
  "unresolved",
  "not-established",
  "not-checked",
]) satisfies z.ZodType<EvidenceReason>;

const count = z.number().int().nonnegative();
const text = z.string().min(1);

const cell = z.object({ text, state: evidenceState, reason: evidenceReason }).strict();

const cells = z
  .object({
    freeStatus: cell,
    license: cell,
    platforms: cell,
    requiresAccount: cell,
    requiresCreditCard: cell,
    commercialUse: cell,
    personalUse: cell,
    openSource: cell,
  })
  .strict();

const entry = z
  .object({
    s: z.string().min(1),
    n: text,
    /** The subject name, for the picker. */
    c: z.string(),
    cells,
    /** "Month year" of the last check, or null when never checked. */
    checked: z.string().min(1).nullable(),
    k: count,
    u: count,
  })
  .strict();

export const compareIndexSchema = z
  .object({ v: z.literal(1), t: count, entries: z.array(entry) })
  .strict()
  .refine((index) => index.entries.every((e) => e.k + e.u <= index.t), {
    message: "a listing counts more facts than the index total",
  });

export type CompareIndex = z.infer<typeof compareIndexSchema>;
export type CompareEntry = CompareIndex["entries"][number];
export type CompareFact = keyof CompareEntry["cells"];
export type CompareCell = CompareEntry["cells"][CompareFact];
