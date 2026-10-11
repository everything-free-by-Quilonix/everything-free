import { z } from "zod";

/**
 * The entertainment signal file, `src/data/entertainment-signals.json`.
 *
 * Written by `scripts/fetch-entertainment-signals.mjs` from public APIs and
 * committed, so the build never makes a network request. It is data from outside
 * the project, so it is validated at the boundary: a malformed or tampered file
 * yields no signals (and no labels), never a half-trusted one.
 *
 * Each signal records its source, what was observed, when, and an evidence URL a
 * visitor can open to check it.
 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const isoDateTime = z.string().regex(/^\d{4}-\d{2}-\d{2}T/);

export const githubSignalSchema = z
  .object({
    repo: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
    source: z.literal("github-rest-api"),
    /** Day the API was queried. */
    observedAt: isoDate,
    stars: z.number().int().nonnegative(),
    /** Last push to any branch, as GitHub reports it. */
    pushedAt: isoDateTime.nullable(),
    archived: z.boolean(),
    /** The repository page, where the numbers can be checked. */
    evidenceUrl: z.string().startsWith("https://github.com/"),
  })
  .strict();

export const entertainmentSignalsSchema = z
  .object({
    version: z.literal(1),
    generatedAt: isoDateTime,
    /** What the run did and did not cover, in words. */
    notes: z.string(),
    github: z.array(githubSignalSchema),
  })
  .strict();

export type GithubSignal = z.infer<typeof githubSignalSchema>;
export type EntertainmentSignals = z.infer<typeof entertainmentSignalsSchema>;

/** Parses the signal file, returning `null` (no signals) when it is invalid. */
export function parseSignals(raw: unknown): EntertainmentSignals | null {
  const result = entertainmentSignalsSchema.safeParse(raw);
  return result.success ? result.data : null;
}
