/**
 * Entertainment catalogue health, offline.
 *
 *   npm run check:entertainment            # report
 *   npm run check:entertainment -- --strict  # exit non-zero on expired offers or a broken signal file
 *
 * Reports counts per shelf and category (from the validated data, not estimates),
 * expired temporary offers, listings past their review date, listings never
 * checked, and the age of the signal file. Makes no network requests: link health
 * stays in `npm run check:links`, which distinguishes transient failures from
 * confirmed removal and never edits the catalogue.
 */
import { readFileSync } from "node:fs";

import { categoryName } from "@/config/categories";
import { shelves } from "@/config/media";
import { seedResources } from "@/data/resources";
import { isOfferExpired, isReviewDue } from "@/lib/entertainment/labels";
import { shelfResources } from "@/lib/entertainment/query";
import { parseSignals } from "@/lib/entertainment/signals-schema";
import { daysSince } from "@/lib/utils/date";

const strict = process.argv.includes("--strict");
const now = new Date();
const catalogue = seedResources.filter((r) => r.media);

const byCategory = new Map<string, number>();
for (const r of catalogue) byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + 1);

const expired = catalogue.filter((r) => isOfferExpired(r, now));
const reviewDue = catalogue.filter((r) => isReviewDue(r, now));
const neverChecked = catalogue.filter((r) => !r.lastVerifiedAt);
const partial = catalogue.filter((r) => r.verificationStatus === "PARTIALLY_VERIFIED");
const india = catalogue.filter((r) => r.media!.region.india === "available");

const signals = parseSignals(JSON.parse(readFileSync(new URL("../src/data/entertainment-signals.json", import.meta.url), "utf8")));
const signalAge = signals ? daysSince(signals.generatedAt.slice(0, 10), now) : null;

const lines: string[] = [];
lines.push(`Entertainment listings: ${catalogue.length} (of ${seedResources.length} in the library)`);
lines.push(`  partially verified: ${partial.length} · never checked: ${neverChecked.length} · available in India (sourced): ${india.length}`);
lines.push("", "By shelf (a listing can sit on more than one):");
for (const shelf of shelves) lines.push(`  ${shelf.name.padEnd(26)} ${shelfResources(seedResources, shelf.slug).length}`);
lines.push("", "By primary category:");
for (const [id, count] of [...byCategory].sort((a, b) => b[1] - a[1])) lines.push(`  ${categoryName(id).padEnd(26)} ${count}`);
lines.push("", `Expired temporary offers: ${expired.length}`);
for (const r of expired) lines.push(`  - ${r.slug}: ended ${r.media!.offer!.endsAt}`);
lines.push(`Past review date: ${reviewDue.length}`);
for (const r of reviewDue.slice(0, 30)) lines.push(`  - ${r.slug}: review due ${r.media!.nextReviewAt ?? "(no date; last checked " + (r.lastVerifiedAt ?? "never") + ")"}`);
lines.push(`Never checked: ${neverChecked.length}`);
for (const r of neverChecked) lines.push(`  - ${r.slug}`);
lines.push(
  "",
  signals
    ? `Signal file: ${signals.github.length} GitHub repositories, generated ${signals.generatedAt} (${signalAge} days ago)` +
        (signalAge !== null && signalAge > 14 ? " — older than 14 days, so 'Recently updated' labels are off until it is refreshed" : "")
    : "Signal file: INVALID — no signal-based labels will show",
);

console.log(lines.join("\n"));

if (strict && (expired.length > 0 || !signals)) process.exit(1);
