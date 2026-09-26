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
 * Two parts:
 *
 * - The queue: every resource, in the order the work is worth doing.
 * - The worksheets: for every resource with recorded checks, all twelve checks — what
 *   was confirmed, what could not be settled, what nobody has looked at — with the
 *   evidence, the page it rests on, the date that page was read and who read it. A
 *   maintainer can see exactly what remains without opening the data file.
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
    title: "1. Awaiting maintainer sign-off",
    why: "Every required check is confirmed with an official source. A maintainer listed in `src/config/maintainers.ts` re-opens the sources, and signs off with their GitHub handle. This is the cheapest work in the queue.",
    test: (e) => e.stage === "awaiting-sign-off",
  },
  {
    id: "user-value",
    title: "2. High user value",
    why: "Entries surfaced on the homepage. They are seen most, so an error in them misleads the most people. (Selected editorially — no usage data is collected.)",
    test: (e) => e.editorialSpotlight && e.stage !== "verified",
  },
  {
    id: "started",
    title: "3. Checks already started",
    why: "A pass has recorded sources. Finishing it is cheaper than starting a new one.",
    test: (e) => e.stage === "partial" || e.stage === "started",
  },
  {
    id: "straightforward",
    title: "4. Straightforward official documentation",
    why: "Open-source projects publish a licence file and usually a single project site, so most checks can be settled from one or two official pages.",
    test: (e) => e.freeStatus === "OPEN_SOURCE" && e.stage !== "verified",
  },
  {
    id: "drift",
    title: "5. Likely to go out of date",
    why: "Free tiers, trials, limited and personal-use offerings change with the vendor's pricing decisions, so their claims decay fastest.",
    test: (e) => e.conditionalFreeStatus && e.stage !== "verified",
  },
  {
    id: "remaining",
    title: "6. Remaining",
    why: "Everything else not yet verified.",
    test: (e) => e.stage !== "verified",
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

const RESULT_LABEL = {
  confirmed: "✅ Confirmed",
  unresolved: "⚠️ Could not confirm",
  "not-checked": "⬜ Not checked",
};

/** Markdown table cells cannot contain raw pipes or newlines. */
const cell = (value) => String(value).replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");

const STAGE_ORDER = ["awaiting-sign-off", "partial", "started", "not-started", "verified"];

function nextAction(entry, label) {
  switch (entry.stage) {
    case "verified":
      return "Re-check when stale or reported";
    case "awaiting-sign-off":
      return "Maintainer: re-open the sources and sign off";
    case "not-started":
      return "Start a verification pass (begin with Free status)";
    default:
      if (entry.unresolvedChecks.length > 0) {
        return `Settle ${entry.unresolvedChecks.map(label).join(", ")} from an official source`;
      }
      return `Confirm ${entry.missingRequiredChecks.length} remaining required check(s)`;
  }
}

function renderWorksheet(entry, rules, label) {
  const stageLabel = rules.stages.find((s) => s.id === entry.stage)?.label ?? entry.stage;
  const required = entry.checks.filter((c) => c.required);
  const confirmed = required.filter((c) => c.result === "confirmed").length;

  const lines = [
    `### ${entry.name} \`${entry.slug}\``,
    "",
    `**${stageLabel}** · shown on the site as ${STATUS_LABEL[entry.verificationStatus] ?? entry.verificationStatus} · ` +
      `${confirmed}/${required.length} required checks confirmed · last checked ${entry.lastVerifiedAt ?? "never"} · ` +
      `checked by ${entry.verifiedBy ?? "—"}`,
    "",
    "| Check | Result | Evidence | Source | Read on |",
    "| --- | --- | --- | --- | --- |",
  ];

  // Required checks first, then optional; gaps before confirmations within each, so
  // the outstanding work is at the top of every worksheet.
  const order = { unresolved: 0, "not-checked": 1, confirmed: 2 };
  const checks = [...entry.checks].sort(
    (a, b) => Number(b.required) - Number(a.required) || order[a.result] - order[b.result],
  );

  for (const check of checks) {
    const definition = rules.checks.find((c) => c.id === check.id);
    lines.push(
      `| ${[
        `${cell(label(check.id))}${check.required ? "" : " *(optional)*"}`,
        RESULT_LABEL[check.result],
        cell(check.evidence ?? `_${definition?.question ?? ""}_`),
        check.sourceUrl ? `[${cell(check.sourceLabel ?? check.sourceUrl)}](${check.sourceUrl})` : "—",
        check.readOn ?? "—",
      ].join(" | ")} |`,
    );
  }
  lines.push("");
  return lines;
}

function render(manifest) {
  const { rules } = manifest;
  const labels = new Map(rules.checks.map((check) => [check.id, check.label]));
  const label = (id) => labels.get(id) ?? id;
  const requiredTotal = rules.requiredChecks.length;

  const entries = [...manifest.entries].sort((a, b) => a.name.localeCompare(b.name));
  const byTier = new Map(TIERS.map((tier) => [tier.id, []]));
  for (const entry of entries) {
    const tier = TIERS.find((t) => t.test(entry));
    byTier.get(tier.id).push(entry);
  }

  const inStage = (...stages) => entries.filter((e) => stages.includes(e.stage)).length;
  const maintainerLine =
    rules.maintainers.length === 0
      ? "No maintainer is registered in `src/config/maintainers.ts` yet, so nothing can be signed off. A maintainer adds their own handle there first."
      : `Maintainers who can sign off: ${rules.maintainers.map((m) => `\`${m}\``).join(", ")}.`;

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
    `| Verified (signed off by a maintainer) | ${inStage("verified")} |`,
    `| Evidence complete, awaiting maintainer sign-off | ${inStage("awaiting-sign-off")} |`,
    `| Partially verified (free status confirmed, checklist incomplete) | ${inStage("partial")} |`,
    `| Checks started, free status not yet confirmed | ${inStage("started")} |`,
    `| Not verified yet (no checks recorded) | ${inStage("not-started")} |`,
    "",
    maintainerLine,
    "",
    `\`VERIFIED\` requires all ${requiredTotal} required checks confirmed against official sources, a dated source for each, and`,
    `sign-off by a registered maintainer. Claims older than ${rules.freshnessDays} days are shown on the site as needing a`,
    "re-check; the monthly freshness workflow reports those separately.",
    "",
    "## Queue",
    "",
  ];

  for (const tier of TIERS) {
    const tierEntries = byTier.get(tier.id);
    if (tierEntries.length === 0) continue;

    lines.push(`### ${tier.title}`, "", tier.why, "");
    lines.push(
      "| Resource | Status | Required checks confirmed | Remaining | Last checked | Checked by | Next action |",
      "| --- | --- | --- | --- | --- | --- | --- |",
    );

    for (const entry of tierEntries) {
      const confirmedRequired = requiredTotal - entry.missingRequiredChecks.length;
      const remaining =
        entry.missingRequiredChecks.length === 0
          ? "—"
          : entry.missingRequiredChecks.length === requiredTotal
            ? "All"
            : entry.missingRequiredChecks
                .map((id) => (entry.unresolvedChecks.includes(id) ? `${label(id)} (unresolved)` : label(id)))
                .join(", ");
      const hasWorksheet = entry.checks.some((c) => c.result !== "not-checked");
      const name = hasWorksheet ? `[${cell(entry.name)}](#${anchor(entry)})` : cell(entry.name);

      lines.push(
        `| ${[
          `${name} \`${entry.slug}\``,
          STATUS_LABEL[entry.verificationStatus] ?? entry.verificationStatus,
          `${confirmedRequired}/${requiredTotal}`,
          cell(remaining),
          entry.lastVerifiedAt ?? "never",
          cell(entry.verifiedBy ?? "—"),
          cell(nextAction(entry, label)),
        ].join(" | ")} |`,
      );
    }
    lines.push("");
  }

  const worksheets = entries
    .filter((e) => e.checks.some((c) => c.result !== "not-checked"))
    .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage) || a.name.localeCompare(b.name));

  lines.push(
    "## Worksheets",
    "",
    "Every resource with recorded checks, check by check. **Not checked** rows show the question still to answer.",
    "For a resource with no checks yet, run `npm run worksheet -- <slug>` for a blank worksheet and a record template.",
    "",
  );
  for (const entry of worksheets) lines.push(...renderWorksheet(entry, rules, label));

  lines.push(
    "---",
    "",
    "Automation can generate this list, check links and flag stale dates. It cannot decide that anything is",
    "free, and it cannot mark anything verified — both need a person reading the provider's own pages.",
    "",
  );

  return lines.join("\n");
}

/** GitHub's heading anchor for a worksheet heading "### Name `slug`". */
function anchor(entry) {
  return `${entry.name} ${entry.slug}`
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
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
