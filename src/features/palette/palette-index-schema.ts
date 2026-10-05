import { z } from "zod";

/**
 * The palette index as fetched by the browser, validated before use.
 *
 * Version 1. A shape this schema rejects is treated as a load failure ("The
 * jump list could not load."), never partly rendered. `k + u ≤ t` is enforced
 * per listing, so a malformed index can never draw more confirmation than the
 * build computed.
 */
// zod's fast path compiles object parsers with `new Function`, which the
// strict CSP (no 'unsafe-eval') blocks and reports as a violation. The
// interpreted path gives the same results.
z.config({ jitless: true });

const count = z.number().int().nonnegative();
const slug = z.string().min(1);
const name = z.string().min(1);

const resourceEntry = z
  .object({
    s: slug,
    n: name,
    c: z.string(),
    f: z.string().min(1),
    k: count,
    u: count,
    o: z.string().url(),
  })
  .strict();

export const paletteIndexSchema = z
  .object({
    v: z.literal(1),
    t: count,
    resources: z.array(resourceEntry),
    subjects: z.array(z.object({ s: slug, n: name, g: z.string(), count }).strict()),
    collections: z.array(z.object({ s: slug, n: name }).strict()),
    tools: z.array(z.object({ s: slug, n: name, available: z.boolean() }).strict()),
    audiences: z.array(z.object({ s: slug, n: name }).strict()),
    alternatives: z.array(z.object({ s: slug, n: name, count }).strict()),
    pages: z.array(z.object({ href: z.string().startsWith("/"), n: name }).strict()),
    filters: z.array(z.object({ n: name, h: z.string().startsWith("/resources") }).strict()),
  })
  .strict()
  .refine((index) => index.resources.every((entry) => entry.k + entry.u <= index.t), {
    message: "a listing counts more facts than the index total",
  });

export type PaletteIndex = z.infer<typeof paletteIndexSchema>;
