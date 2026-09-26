#!/usr/bin/env node
/**
 * Prints the verification worksheet for one resource.
 *
 *   npm run build:static
 *   npm run worksheet -- obsidian
 *
 * Shows all twelve checks in the order a verifier should work them — gaps first —
 * with the evidence, source, date read and verifier for anything already recorded,
 * and the question to answer for anything not. It ends with a record template for
 * the checks still open, ready to paste into the resource's `verificationChecks`.
 *
 * It reads the build manifest, so what it prints is exactly what the site shows. It
 * never writes anything: filling in the evidence is a person's job.
 */

import { readFile } from "node:fs/promises";
import { argv, exit } from "node:process";

const [manifestPath, slug] = [argv[2], argv[3]];
if (!manifestPath || !slug) {
  console.error("Usage: npm run worksheet -- <slug>");
  exit(2);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const entry = manifest.entries.find((e) => e.slug === slug);
if (!entry) {
  const close = manifest.entries.filter((e) => e.slug.includes(slug)).map((e) => e.slug);
  console.error(`No resource with slug "${slug}".${close.length ? ` Did you mean: ${close.join(", ")}?` : ""}`);
  exit(1);
}

const { rules } = manifest;
const definition = (id) => rules.checks.find((c) => c.id === id);
const stageLabel = rules.stages.find((s) => s.id === entry.stage)?.label ?? entry.stage;
const required = entry.checks.filter((c) => c.required);
const confirmed = required.filter((c) => c.result === "confirmed").length;

const MARK = { confirmed: "[x]", unresolved: "[?]", "not-checked": "[ ]" };
const RESULT = { confirmed: "confirmed", unresolved: "could not confirm", "not-checked": "not checked" };
const order = { unresolved: 0, "not-checked": 1, confirmed: 2 };
const wrap = (text, indent) =>
  text
    .replace(/(.{1,88})(\s+|$)/g, `${indent}$1\n`)
    .trimEnd();

const out = [
  `${entry.name} (${entry.slug})`,
  `${stageLabel} · shown on the site as ${entry.verificationStatus}`,
  `${confirmed} of ${required.length} required checks confirmed · last checked ${entry.lastVerifiedAt ?? "never"} · checked by ${entry.verifiedBy ?? "nobody yet"}`,
  "",
];

for (const [heading, group] of [
  ["REQUIRED FOR VERIFIED", entry.checks.filter((c) => c.required)],
  ["OPTIONAL", entry.checks.filter((c) => !c.required)],
]) {
  out.push(heading);
  for (const check of [...group].sort((a, b) => order[a.result] - order[b.result])) {
    const def = definition(check.id);
    out.push(`  ${MARK[check.result]} ${def.label} — ${RESULT[check.result]}`);
    if (check.result === "not-checked") {
      out.push(wrap(def.question, "        "));
    } else {
      out.push(wrap(check.evidence, "        "));
      if (check.sourceUrl) {
        out.push(`        source: ${check.sourceUrl}`);
        if (check.sourceLabel) out.push(wrap(`label: ${check.sourceLabel}`, "        "));
        out.push(`        read on ${check.readOn ?? "?"} by ${entry.verifiedBy ?? "?"}`);
      }
    }
  }
  out.push("");
}

const open = entry.checks.filter((c) => c.result !== "confirmed");
if (open.length > 0) {
  out.push(
    "TEMPLATE for the checks still open. Fill in from the provider's own pages only;",
    "add every page you read to verificationSources with the date you read it.",
    "",
    ...open.flatMap((check) => [
      "      {",
      `        check: "${check.id}",`,
      `        result: "confirmed", // or "unresolved" — looked, could not settle it`,
      `        evidence: "", // what the page actually says, specific enough to re-check`,
      `        sourceUrl: "", // must also appear in verificationSources`,
      "      },",
    ]),
    "",
  );
}

out.push(
  entry.stage === "awaiting-sign-off"
    ? "Next: a registered maintainer re-opens every source and signs off. See docs/verification.md#signing-off-maintainers."
    : "Next: work the open checks above, then run `npm run build:static && npm run backlog`.",
);

console.log(out.join("\n"));
