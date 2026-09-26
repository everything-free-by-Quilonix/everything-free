#!/usr/bin/env node
/**
 * Reports which listings need verification attention.
 *
 * This is the automation half of the trust model. It cannot verify anything — only a
 * person reading a provider's own pages can do that — but it can make sure the work
 * queue is always visible instead of quietly growing.
 *
 * The report sorts every listing into the same buckets the site and the generated
 * backlog use (the manifest's `stage`, computed by `config/verification.ts`), plus the
 * one thing only a scheduled job can know: what has aged past the freshness window
 * today.
 *
 * It makes no network requests at all: everything it needs is in the build manifest.
 *
 * Usage: node check-verification-freshness.mjs <link-manifest.json> [--out report.md]
 */

import { readFile, writeFile } from "node:fs/promises";
import { argv } from "node:process";

const REPO = "https://github.com/everything-free-by-Quilonix/everything-free";
const SITE = "https://everything-free-by-quilonix.github.io/everything-free";

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
  const { freshnessDays, requiredChecks, checks: checkDefinitions, maintainers } = manifest.rules;
  const label = (id) => checkDefinitions.find((c) => c.id === id)?.label ?? id;
  const requiredTotal = requiredChecks.length;

  const entries = [...manifest.entries]
    .map((entry) => ({ ...entry, age: daysSince(entry.lastVerifiedAt) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const verified = entries.filter((e) => e.stage === "verified");
  const awaitingSignOff = entries.filter((e) => e.stage === "awaiting-sign-off");
  // "Started" entries have checks recorded but not yet the free status, so the site
  // shows them as Unverified. They belong with the partial work here, flagged as such.
  const partial = entries.filter((e) => e.stage === "partial" || e.stage === "started");
  const neverVerified = entries.filter((e) => e.stage === "not-started");
  const stale = entries.filter((e) => e.age !== null && e.age > freshnessDays).sort((a, b) => b.age - a.age);

  console.log(`${entries.length} resources`);
  console.log(`  fully verified:           ${verified.length}`);
  console.log(`  awaiting sign-off:        ${awaitingSignOff.length}`);
  console.log(`  partially verified:       ${partial.length}`);
  console.log(`  never verified:           ${neverVerified.length}`);
  console.log(`  past ${freshnessDays}-day window:     ${stale.length}`);
  console.log(`  registered maintainers:   ${maintainers.length}`);

  const link = (e) => `[${e.name}](${SITE}/resources/${e.slug}/) (\`${e.slug}\`)`;
  const confirmedOf = (e) => requiredTotal - e.missingRequiredChecks.length;

  /**
   * Every section is always present, with "None." when empty, so the issue has the
   * same shape every month and a reader can find a section without searching.
   * Empty strings are the blank lines Markdown needs between blocks.
   */
  const section = (heading, blurb, list, render) => [
    `### ${heading}`,
    "",
    blurb,
    "",
    ...(list.length === 0 ? ["None."] : list.map(render)),
    "",
  ];

  const signOffSteps =
    maintainers.length === 0
      ? [
          "> **No maintainer is registered yet**, so nothing can be signed off. A maintainer first adds their own",
          "> handle to [`src/config/maintainers.ts`](" + REPO + "/blob/main/src/config/maintainers.ts) in a pull request they author.",
          "",
        ]
      : [`Registered maintainers: ${maintainers.map((m) => `\`${m}\``).join(", ")}.`, ""];

  const lines = [
    "## Verification status",
    "",
    "| | Count |",
    "| --- | --- |",
    `| Resources | ${entries.length} |`,
    `| Fully verified | ${verified.length} |`,
    `| Awaiting maintainer sign-off | ${awaitingSignOff.length} |`,
    `| Partially verified | ${partial.length} |`,
    `| Never verified | ${neverVerified.length} |`,
    `| Past the ${freshnessDays}-day freshness window | ${stale.length} |`,
    "",
    ...section(
      "Awaiting maintainer sign-off",
      "Every required check is confirmed against an official source. What is left is a person: a registered maintainer re-opens each source, updates the dates they read them, and signs off under their own GitHub handle ([how](" +
        REPO +
        "/blob/main/docs/verification.md#signing-off-maintainers)). No script can do this step.",
      awaitingSignOff,
      (e) =>
        `- [ ] ${link(e)} — ${confirmedOf(e)}/${requiredTotal} required checks confirmed, ${e.verificationSources.length} official source(s), evidence gathered by ${e.verifiedBy ?? "unknown"} on ${e.lastVerifiedAt}`,
    ),
    ...(awaitingSignOff.length > 0 ? signOffSteps : []),
    ...section(
      "Fully verified",
      "Signed off by a registered maintainer.",
      verified,
      (e) => `- ${link(e)} — signed off by ${e.verifiedBy} on ${e.lastVerifiedAt}`,
    ),
    ...section(
      "Partially verified",
      "Checks are recorded but the checklist is incomplete. Entries marked *free status not yet confirmed* are shown on the site as Unverified until that check is done.",
      partial,
      (e) => {
        const unresolved = e.unresolvedChecks.map(label);
        const remaining = e.missingRequiredChecks.filter((id) => !e.unresolvedChecks.includes(id)).length;
        const parts = [`${confirmedOf(e)}/${requiredTotal} required checks confirmed`];
        if (unresolved.length > 0) parts.push(`unresolved: ${unresolved.join(", ")}`);
        if (remaining > 0) parts.push(`${remaining} not yet checked`);
        if (e.stage === "started") parts.push("*free status not yet confirmed*");
        return `- ${link(e)} — ${parts.join("; ")}`;
      },
    ),
    ...section(
      "Never verified",
      "No check has been recorded against an official source. These listings were compiled from public documentation and show as Unverified, with no verification date.",
      neverVerified,
      (e) => `- ${link(e)}`,
    ),
    ...section(
      "Past freshness window",
      `Last checked more than ${freshnessDays} days ago, so the site now shows them as needing a re-check whatever their stored status.`,
      stale,
      (e) => `- ${link(e)} — last checked ${e.lastVerifiedAt} (${e.age} days ago)`,
    ),
    "---",
    "",
    `The full queue, with a check-by-check worksheet for every entry that has evidence, is [\`docs/verification-backlog.md\`](${REPO}/blob/main/docs/verification-backlog.md).`,
    "",
    "Verification is manual by design. Nothing in this repository marks a resource verified",
    "automatically — a badge is only as good as the person who checked it.",
  ];

  const report = lines.join("\n");

  if (outPath) {
    await writeFile(outPath, report, "utf8");
    console.log(`\nReport written to ${outPath}`);
  }

  if (process.env.GITHUB_OUTPUT) {
    const needsAttention = awaitingSignOff.length + partial.length + neverVerified.length + stale.length;
    const summary =
      `${verified.length} verified, ${awaitingSignOff.length} awaiting maintainer sign-off, ` +
      `${partial.length} partially verified, ${neverVerified.length} never verified, ${stale.length} past the freshness window`;
    await writeFile(process.env.GITHUB_OUTPUT, `needs_attention=${needsAttention}\nsummary=${summary}\n`, { flag: "a" });
  }
}

await main();
