#!/usr/bin/env node
/**
 * Reports which listings need verification attention.
 *
 * This is the automation half of the trust model. It cannot verify anything — only a
 * person reading a provider's own pages can do that — but it can make sure the work
 * queue is always visible instead of quietly growing.
 *
 * It makes no network requests at all: everything it needs is in the build manifest.
 *
 * Usage: node check-verification-freshness.mjs <link-manifest.json> [--out report.md]
 */

import { readFile, writeFile } from "node:fs/promises";
import { argv } from "node:process";

function daysSince(iso) {
  if (!iso) return null;
  const then = new Date(`${iso}T00:00:00Z`).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86_400_000);
}

async function main() {
  const manifestPath = argv[2];
  if (!manifestPath) {
    console.error("Usage: node check-verification-freshness.mjs <link-manifest.json> [--out report.md]");
    process.exit(2);
  }

  const outIndex = argv.indexOf("--out");
  const outPath = outIndex !== -1 ? argv[outIndex + 1] : null;

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  // The rules come from the manifest, which is generated from src/config/verification.ts,
  // so this script never carries its own copy of them.
  const FRESHNESS_DAYS = manifest.rules.freshnessDays;
  const REQUIRED_CHECKS = manifest.rules.requiredChecks;

  const stale = [];
  const neverVerified = [];
  const partial = [];
  let verified = 0;

  for (const entry of manifest.entries) {
    const age = daysSince(entry.lastVerifiedAt);
    const missing = entry.missingRequiredChecks;

    if (entry.verificationStatus === "VERIFIED") verified += 1;

    if (age === null) {
      neverVerified.push(entry);
      continue;
    }

    if (age > FRESHNESS_DAYS) {
      stale.push({ ...entry, age });
    }

    // Anything short of the full required set is outstanding work, regardless of age.
    if (missing.length > 0 && entry.verificationStatus !== "VERIFIED") {
      partial.push({ ...entry, missing, age });
    }
  }

  // Least-recently-checked first: that is the order a maintainer should work in.
  partial.sort((a, b) => (b.age ?? 0) - (a.age ?? 0) || a.missing.length - b.missing.length);
  stale.sort((a, b) => b.age - a.age);

  const total = manifest.entries.length;

  console.log(`${total} resources`);
  console.log(`  fully verified:        ${verified}`);
  console.log(`  never verified:        ${neverVerified.length}`);
  console.log(`  past ${FRESHNESS_DAYS}-day window:  ${stale.length}`);
  console.log(`  incomplete checklist:  ${partial.length}`);

  /**
   * Renders a section, or nothing when the list is empty.
   *
   * `null` marks omission; empty strings are meaningful blank lines that Markdown
   * needs to render lists correctly, so they must survive filtering.
   */
  const section = (heading, entries, render) => {
    if (entries.length === 0) return [];
    return [
      `### ${heading}`,
      "",
      ...entries.slice(0, 25).map(render),
      entries.length > 25 ? `- …and ${entries.length - 25} more` : null,
      "",
    ];
  };

  const lines = [
    "## Verification status",
    "",
    "| | Count |",
    "| --- | --- |",
    `| Resources | ${total} |`,
    `| Fully verified | ${verified} |`,
    `| Never verified | ${neverVerified.length} |`,
    `| Past the ${FRESHNESS_DAYS}-day freshness window | ${stale.length} |`,
    `| Incomplete checklist | ${partial.length} |`,
    "",
    ...section("Overdue for re-checking", stale, (e) => `- **${e.name}** (\`${e.slug}\`) — last verified ${e.age} days ago`),
    ...section("Never verified", neverVerified, (e) => `- **${e.name}** (\`${e.slug}\`) — ${e.verificationStatus}`),
    ...section(
      "Incomplete checklist",
      partial,
      (e) =>
        `- **${e.name}** (\`${e.slug}\`) — ${REQUIRED_CHECKS.length - e.missing.length}/${REQUIRED_CHECKS.length} required checks confirmed, ${e.verificationSources.length} source(s) cited`,
    ),
    "---",
    "",
    "Verification is manual by design. Nothing in this repository marks a resource",
    "verified automatically — a badge is only as good as the person who checked it.",
    "See `docs/verification.md` for the process and how to record evidence.",
  ];

  const report = lines.filter((line) => line !== null).join("\n");

  if (outPath) {
    await writeFile(outPath, report, "utf8");
    console.log(`\nReport written to ${outPath}`);
  }

  if (process.env.GITHUB_OUTPUT) {
    const needsAttention = stale.length + neverVerified.length + partial.length;
    await writeFile(process.env.GITHUB_OUTPUT, `needs_attention=${needsAttention}\n`, { flag: "a" });
  }
}

await main();
