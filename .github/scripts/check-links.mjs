#!/usr/bin/env node
/**
 * Link-health check for the external URLs in the library.
 *
 * Design constraints, in order of importance:
 *
 * 1. Be a good citizen. This touches other people's servers, so it fetches
 *    robots.txt first and honours it, identifies itself with a contact URL,
 *    serialises requests with a delay, and runs monthly rather than continuously.
 *    Never hammer a host we are recommending to users.
 *
 * 2. Draw only the conclusion the evidence supports. A 200 response means a URL
 *    resolves. It says nothing about whether the resource is still free, and this
 *    script never claims otherwise — pricing and licensing changes require a human
 *    reading the page. That boundary is the whole reason there is no automated
 *    "free status" checker here.
 *
 * 3. Cost nothing. Runs on GitHub's free runners with no external service.
 *
 * Usage: node check-links.mjs <path-to-link-manifest.json> [--out report.md]
 * Exit code is 0 even when links fail: the report is the output, and a red cross on
 * a scheduled job that depends on third-party uptime would train everyone to ignore it.
 */

import { readFile, writeFile } from "node:fs/promises";
import { argv } from "node:process";

const CONTACT_URL = "https://github.com/everything-free-by-Quilonix/everything-free";
const USER_AGENT = `EverythingFreeLinkCheck/1.0 (+${CONTACT_URL})`;

/** Delay between requests to the same host, and between requests generally. */
const REQUEST_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 15000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/* robots.txt                                                                 */
/* -------------------------------------------------------------------------- */

const robotsCache = new Map();

/**
 * Minimal robots.txt evaluation.
 *
 * Reads the `*` group and any group naming this agent, and collects Disallow rules.
 * Deliberately conservative: anything it cannot parse is treated as "allowed", but a
 * fetch failure is treated as "allowed" too, because a missing robots.txt means no
 * restrictions rather than total prohibition.
 */
async function getDisallowRules(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);

  let rules = [];
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      redirect: "follow",
    });

    if (response.ok) {
      const text = await response.text();
      let applies = false;

      for (const rawLine of text.split("\n")) {
        const line = rawLine.split("#")[0].trim();
        if (line.length === 0) continue;

        const [rawKey, ...rest] = line.split(":");
        const key = rawKey.trim().toLowerCase();
        const value = rest.join(":").trim();

        if (key === "user-agent") {
          applies = value === "*" || USER_AGENT.toLowerCase().startsWith(value.toLowerCase());
        } else if (key === "disallow" && applies && value.length > 0) {
          rules.push(value);
        }
      }
    }
  } catch {
    rules = [];
  }

  robotsCache.set(origin, rules);
  return rules;
}

function isDisallowed(url, rules) {
  const path = new URL(url).pathname;
  return rules.some((rule) => rule === "/" || path.startsWith(rule));
}

/* -------------------------------------------------------------------------- */
/* Checking                                                                   */
/* -------------------------------------------------------------------------- */

async function request(url, method) {
  return fetch(url, {
    method,
    headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function checkUrl(url) {
  const origin = new URL(url).origin;
  const rules = await getDisallowRules(origin);

  if (isDisallowed(url, rules)) {
    return { status: "skipped", detail: "Disallowed by the site's robots.txt" };
  }

  try {
    // HEAD first: it is the cheapest request for the other server. Some hosts
    // reject or mishandle it, so fall back to GET rather than reporting a false
    // failure.
    let response = await request(url, "HEAD");

    if (response.status === 405 || response.status === 501 || response.status === 403) {
      await sleep(REQUEST_DELAY_MS);
      response = await request(url, "GET");
    }

    const finalUrl = response.url || url;
    const redirected = finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, "");

    if (response.status >= 400) {
      return { status: "failed", detail: `HTTP ${response.status}`, finalUrl };
    }
    if (redirected) {
      return { status: "redirected", detail: `Now resolves to ${finalUrl}`, finalUrl };
    }
    return { status: "ok", detail: `HTTP ${response.status}` };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown error";
    return { status: "error", detail: reason === "TimeoutError" ? "Timed out" : `Request failed (${reason})` };
  }
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  const manifestPath = argv[2];
  if (!manifestPath) {
    console.error("Usage: node check-links.mjs <link-manifest.json> [--out report.md]");
    process.exit(2);
  }

  const outIndex = argv.indexOf("--out");
  const outPath = outIndex !== -1 ? argv[outIndex + 1] : null;

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  /** Flatten every URL we publish, remembering which resource it belongs to. */
  const targets = [];
  for (const entry of manifest.entries) {
    for (const [kind, url] of [
      ["official", entry.officialUrl],
      ["source", entry.sourceUrl],
      ["pricing", entry.pricingUrl],
      ["licence", entry.licenseUrl],
    ]) {
      if (url) targets.push({ slug: entry.slug, name: entry.name, kind, url });
    }
  }

  console.log(`Checking ${targets.length} URLs across ${manifest.entries.length} resources.`);
  console.log(`Pacing: one request every ${REQUEST_DELAY_MS}ms, robots.txt honoured.\n`);

  const problems = [];
  let okCount = 0;

  for (const [index, target] of targets.entries()) {
    const result = await checkUrl(target.url);

    if (result.status === "ok") {
      okCount += 1;
    } else if (result.status === "skipped") {
      console.log(`SKIP  ${target.slug} (${target.kind}) — ${result.detail}`);
    } else {
      problems.push({ ...target, ...result });
      console.log(`${result.status.toUpperCase()}  ${target.slug} (${target.kind}) — ${result.detail}`);
    }

    if (index < targets.length - 1) await sleep(REQUEST_DELAY_MS);
  }

  console.log(`\n${okCount} OK, ${problems.length} needing attention.`);

  const failures = problems.filter((p) => p.status === "failed" || p.status === "error");
  const redirects = problems.filter((p) => p.status === "redirected");

  /*
   * Built as an array of lines with `null` marking omitted sections. Filtering on
   * `null` rather than on empty strings is deliberate: empty strings are the blank
   * lines Markdown needs in order to render a list as a list rather than folding it
   * into the preceding paragraph.
   */
  const lines = [
    `Automated link check of ${targets.length} URLs across ${manifest.entries.length} resources.`,
    "",
    `- ${okCount} resolved normally`,
    `- ${failures.length} failed or unreachable`,
    `- ${redirects.length} redirected somewhere else`,
    "",
    failures.length > 0 ? "## Failed or unreachable" : null,
    failures.length > 0 ? "" : null,
    ...failures.map((p) => `- **${p.name}** (\`${p.slug}\`, ${p.kind}): ${p.detail}\n  - ${p.url}`),
    failures.length > 0 ? "" : null,
    redirects.length > 0 ? "## Redirected" : null,
    redirects.length > 0 ? "" : null,
    ...redirects.map((p) => `- **${p.name}** (\`${p.slug}\`, ${p.kind}): ${p.detail}\n  - Listed: ${p.url}`),
    redirects.length > 0 ? "" : null,
    "---",
    "",
    "**A failure here is not proof a resource is gone.** Servers block automated requests,",
    "rate-limit, or go down briefly. Check by hand before editing a listing.",
    "",
    "**This check says nothing about whether a resource is still free.** It only confirms",
    "that URLs resolve. Pricing and licence changes need a human reading the page — see",
    "`docs/verification.md`.",
  ];

  const report = lines.filter((line) => line !== null).join("\n");

  if (outPath) {
    await writeFile(outPath, report, "utf8");
    console.log(`Report written to ${outPath}`);
  }

  // Tells the workflow whether an issue is worth opening.
  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `problem_count=${problems.length}\n`, { flag: "a" });
  }
}

await main();
