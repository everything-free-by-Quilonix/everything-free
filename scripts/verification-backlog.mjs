#!/usr/bin/env node
/**
 * Generates docs/verification-backlog.md from the build manifest.
 *
 * The backlog is a maintainer's work queue, and it must agree with the data exactly.
 * A hand-maintained list would drift the first time someone verified an entry and
 * forgot to update it. So it is generated, committed, and checked in CI:
 *
 *   node scripts/verification-backlog.mjs out/link-manifest.json --write docs/verification-backlog.md
 *   node scripts/verification-backlog.mjs out/link-manifest.json --check docs/verification-backlog.md
 *
 * `--check` exits non-zero if the committed file differs from what the data
 * produces, so a pull request that changes verification data without regenerating
 * the backlog fails.
 *
 * The output is deterministic by design. It contains no "generated at" timestamp and
 * no ages ("12 days ago"), only fixed dates from the data, so the file changes only
 * when the data does. Time-dependent reporting — what is past the freshness window
 * today — belongs to the scheduled freshness workflow, which files an issue.
 *
 * Nothing here decides whether anything is free, and nothing here can change a
 * verification status. It only reads.
 */

import { readFile, writeFile } from "node:fs/promises";
import { argv, exit } from "node:process";

/* -------------------------------------------------------------------------- */
/* Workflow order                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The order to work through the backlog in. This is a work queue, not a ranking of
 * resources: it says nothing about which resource is better, only which verification
 * is most worth doing next. Each entry lands in the first tier it qualifies for.
 */
const TIERS = [
  {
    id: "sign-off",
    title: "1. Ready for maintainer sign-off",
    why: "Every required check is confirmed with an official source. A maintainer reviews the evidence, re-opens the sources, and signs off with their GitHub handle. This is the cheapest work in the queue.",
    test: (e) => e.missingRequiredChecks.length === 0 && e.verificationStatus !== "VERIFIED",
  },
  {
    id: "user-value",
    title: "2. High user value",
    why: "Entries surfaced on the homepage. They are seen most, so an error in them misleads the most people. (Selected editorially — no usage data is collected.)",
    test: (e) => e.editorialSpotlight && e.verificationStatus !== "VERIFIED",
  },
  {
    id: "partial",
    title: "3. Partially verified with evidence",
    why: "A pass has started and recorded sources. Finishing it is cheaper than starting a new one.",
    test: (e) => e.confirmedChecks.length + e.unresolvedChecks.length > 0 && e.verificationStatus !== "VERIFIED",
  },
  {
    id: "straightforward",
    title: "4. Straightforward official documentation",
    why: "Open-source projects publish a licence file and usually a single project site, so most checks can be settled from one or two official pages.",
    test: (e) => e.freeStatus === "OPEN_SOURCE" && e.verificationStatus !== "VERIFIED",
  },
  {
    id: "drift",
    title: "5. Likely to go out of date",
    why: "Free tiers, trials, limited and personal-use offerings change with the vendor's pricing decisions, so their claims decay fastest.",
    test: (e) => e.conditionalFreeStatus && e.verificationStatus !== "VERIFIED",
  },
  {
    id: "remaining",
    title: "6. Remaining",
    why: "Everything else not yet verified.",
    test: (e) => e.verificationStatus !== "VERIFIED",
  },
  {
    id: "verified",
    title: "Verified",
    why: "Signed off by a maintainer. Re-check when the freshness window lapses or a report comes in.",
    test: () => true,
  },
];

/* -------------------------------------------------------------------------- */
/* Rendering                                                                  */
/* -------------------------------------------------------------------------- */

const STATUS_LABEL = {
  VERIFIED: "Verified",
  PARTIALLY_VERIFIED: "Partially verified",
  UNVERIFIED: "Unverified",
  OUTDATED: "Needs re-checking",
  REPORTED: "Reported",
};

/** Markdown table cells cannot contain raw pipes or newlines. */
const cell = (value) => String(value).replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");

function nextAction(entry, label) {
  if (entry.verificationStatus === "VERIFIED") return "Re-check when stale or reported";
  if (entry.missingRequiredChecks.length === 0) return "Maintainer: review evidence and sign off";
  if (entry.unresolvedChecks.length > 0) {
    return `Settle ${entry.unresolvedChecks.map(label).join(", ")} from an official source`;
  }
  if (entry.confirmedChecks.length > 0) {
    return `Confirm ${entry.missingRequiredChecks.length} remaining required check(s)`;
  }
  return "Start a verification pass";
}

function render(manifest) {
  const labels = new Map(manifest.rules.checks.map((check) => [check.id, check.label]));
  const label = (id) => labels.get(id) ?? id;
  const requiredTotal = manifest.rules.requiredChecks.length;

  const entries = [...manifest.entries].sort((a, b) => a.name.localeCompare(b.name));
  const byTier = new Map(TIERS.map((tier) => [tier.id, []]));
  for (const entry of entries) {
    const tier = TIERS.find((t) => t.test(entry));
    byTier.get(tier.id).push(entry);
  }

  const count = (predicate) => entries.filter(predicate).length;
  const lines = [
    "# Verification backlog",
    "",
    "<!-- GENERATED FILE — do not edit by hand. -->",
    "<!-- Regenerate: npm run build:static && npm run backlog -->",
    "",
    "The work queue for verifying the library, generated from the resource data. CI fails if this file",
    "does not match the data, so it is always current as of the last merged change.",
    "",
    "The order below is a **verification workflow, not a ranking** of the resources. See",
    "[`verification.md`](verification.md) for how to verify an entry and what counts as evidence.",
    "",
    "## Summary",
    "",
    "| | Count |",
    "| --- | --- |",
    `| Resources | ${entries.length} |`,
    `| Verified (signed off by a maintainer) | ${count((e) => e.verificationStatus === "VERIFIED")} |`,
    `| Evidence complete, awaiting sign-off | ${byTier.get("sign-off").length} |`,
    `| With any recorded checks | ${count((e) => e.confirmedChecks.length + e.unresolvedChecks.length > 0)} |`,
    `| No checks recorded yet | ${count((e) => e.confirmedChecks.length + e.unresolvedChecks.length === 0)} |`,
    "",
    `\`VERIFIED\` requires all ${requiredTotal} required checks confirmed against official sources, a dated source for each, and`,
    `sign-off under a maintainer's GitHub handle. Claims older than ${manifest.rules.freshnessDays} days are shown on the site as needing a`,
    "re-check; the monthly freshness workflow reports those separately.",
    "",
  ];

  for (const tier of TIERS) {
    const tierEntries = byTier.get(tier.id);
    if (tierEntries.length === 0) continue;

    lines.push(`## ${tier.title}`, "", tier.why, "");
    lines.push(
      "| Resource | Status | Required checks confirmed | Remaining | Official sources | Last reviewed | Verifier | Next action |",
      "| --- | --- | --- | --- | --- | --- | --- | --- |",
    );

    for (const entry of tierEntries) {
      const confirmedRequired = requiredTotal - entry.missingRequiredChecks.length;
      const remaining =
        entry.missingRequiredChecks.length === 0
          ? "—"
          : entry.missingRequiredChecks
              .map((id) => (entry.unresolvedChecks.includes(id) ? `${label(id)} (unresolved)` : label(id)))
              .join(", ");

      lines.push(
        `| ${[
          `${cell(entry.name)} \`${entry.slug}\``,
          STATUS_LABEL[entry.verificationStatus] ?? entry.verificationStatus,
          `${confirmedRequired}/${requiredTotal}`,
          cell(remaining),
          entry.verificationSources.length === 0
            ? "—"
            : entry.verificationSources.map((source, i) => `[${i + 1}](${source.url})`).join(" "),
          entry.lastVerifiedAt ?? "never",
          cell(entry.verifiedBy ?? "—"),
          cell(nextAction(entry, label)),
        ].join(" | ")} |`,
      );
    }
    lines.push("");
  }

  lines.push(
    "---",
    "",
    "Automation can generate this list, check links and flag stale dates. It cannot decide that anything is",
    "free, and it cannot mark anything verified — both need a person reading the provider's own pages.",
    "",
  );

  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */
/* CLI                                                                        */
/* -------------------------------------------------------------------------- */

const manifestPath = argv[2];
const writeFlag = argv.indexOf("--write");
const checkFlag = argv.indexOf("--check");

if (!manifestPath || (writeFlag === -1 && checkFlag === -1)) {
  console.error("Usage: verification-backlog.mjs <link-manifest.json> (--write <file> | --check <file>)");
  exit(2);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const output = render(manifest);

if (writeFlag !== -1) {
  await writeFile(argv[writeFlag + 1], output, "utf8");
  console.log(`Wrote ${argv[writeFlag + 1]} (${manifest.entries.length} resources).`);
} else {
  const target = argv[checkFlag + 1];
  // Line endings are normalised so a Windows checkout with autocrlf does not read as a diff.
  const normalise = (text) => text.replace(/\r\n/g, "\n");
  const committed = await readFile(target, "utf8").catch(() => null);

  if (committed === null || normalise(committed) !== normalise(output)) {
    console.error(`✗ ${target} is out of date with the resource data.`);
    console.error("  Run: npm run build:static && npm run backlog — then commit the result.");
    exit(1);
  }
  console.log(`✓ ${target} matches the resource data.`);
}
