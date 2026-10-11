/**
 * Checks one entertainment research file against every data rule, alongside the
 * library it will join (so duplicate slugs and official URLs are caught too).
 *
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --import ./scripts/test/register.mjs \
 *     scripts/check-media-file.mts src/data/resources/entertainment/<file>.ts
 *
 * Prints each problem that concerns the file's own listings and exits non-zero if
 * there are any. Makes no network requests.
 */
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { seedResources } from "@/data/resources";
import { findDataProblems } from "@/data/resources/validate";
import type { Resource } from "@/types/resource";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: check-media-file.mts <file.ts> [...]");
  process.exit(2);
}

const added: Resource[] = [];
for (const file of files) {
  const mod = (await import(pathToFileURL(resolve(file)).href)) as Record<string, unknown>;
  for (const value of Object.values(mod)) {
    if (Array.isArray(value) && value.every((v) => v && typeof v === "object" && "slug" in v)) {
      added.push(...(value as Resource[]));
    }
  }
}

const existing = new Set(seedResources.map((r) => r.slug));
const library = [...seedResources.filter((r) => !added.some((a) => a.slug === r.slug)), ...added];
const mine = added.map((r) => r.slug);
const problems = findDataProblems(library).filter((p) => mine.some((slug) => p.includes(`"${slug}"`)));

const withMedia = added.filter((r) => r.media).length;
const partial = added.filter((r) => r.verificationStatus === "PARTIALLY_VERIFIED").length;
const replacing = added.filter((r) => existing.has(r.slug)).length;
console.log(`${added.length} listings (${withMedia} with a media profile, ${partial} partially verified, ${replacing} replacing existing slugs)`);
if (problems.length > 0) {
  console.log(`\n${problems.length} problem(s):\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}
console.log("No problems.");
