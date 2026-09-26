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
 *    resolves. It says nothing about whether the resource is still free. And a 401
 *    or 403 does not mean a page is gone — bot protection answers automated clients
 *    that way — just as a redirect does not mean a link is broken. So the HTTP
 *    status never decides the final classification on its own:
 *
 *    - Needs manual review — failures the checker cannot explain (404, 5xx,
 *      timeouts, DNS errors) and anything risky, such as a redirect from HTTPS to
 *      plain HTTP. A person opens the page.
 *    - Redirected — the URL resolves somewhere else. Same-site redirects (a
 *      language page, a trailing slash) are usually fine; a different domain needs a
 *      person to confirm the destination is official before the listing changes.
 *    - Temporarily blocked / bot protection suspected — 401/403/429 responses,
 *      especially with a recognisable challenge (Cloudflare, Akamai, Anubis).
 *    - Confirmed broken — only when a person has opened the page and recorded it
 *      in `.github/link-triage.json`. Automation never puts a link here.
 *
 *    Human triage in `.github/link-triage.json` files a known finding correctly
 *    instead of raising it every month. A review applies only while the checker
 *    still sees what the reviewer saw, and expires after 90 days.
 *
 * 3. Cost nothing. Runs on GitHub's free runners with no external service.
 *
 * Usage: node check-links.mjs <path-to-link-manifest.json> [--out report.md] [--triage file.json]
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
/** Triage reviews expire like verification claims do. */
const REVIEW_FRESHNESS_DAYS = 90;
const CLASSIFICATIONS = ["bot-protection", "accepted-redirect", "confirmed-broken"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const today = new Date().toISOString().slice(0, 10);

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

/**
 * Recognisable bot-protection fingerprints. Each one is a reason to suspect the
 * checker was challenged rather than refused — never proof the page is fine.
 */
async function botSignals(response) {
  const signals = [];
  const header = (name) => response.headers.get(name) ?? "";
  const server = header("server").toLowerCase();

  if (header("cf-mitigated") === "challenge") signals.push("Cloudflare challenge");
  else if (server.includes("cloudflare") && [403, 503].includes(response.status)) signals.push("Cloudflare");
  if (server.includes("akamai")) signals.push("Akamai");
  if (response.url.includes("/.within.website")) signals.push("Anubis proof-of-work challenge");
  if (response.status === 429) signals.push("rate limited");

  // A bounded read: enough to recognise a challenge page, never a whole download.
  let body = "";
  try {
    body = (await response.text()).slice(0, 8192);
  } catch {
    body = "";
  }
  if (/Just a moment|challenge-platform|cf-browser-verification/i.test(body) && !signals.some((s) => s.startsWith("Cloudflare"))) {
    signals.push("Cloudflare challenge page");
  }
  if (/not a bot|anubis/i.test(body) && !signals.some((s) => s.startsWith("Anubis"))) signals.push("Anubis challenge page");
  if (/Access Denied/i.test(body) && server.includes("akamai")) signals[signals.indexOf("Akamai")] = "Akamai 'Access Denied'";

  return signals;
}

async function checkUrl(url) {
  const origin = new URL(url).origin;
  const rules = await getDisallowRules(origin);

  if (isDisallowed(url, rules)) {
    return { status: "skipped", detail: "Disallowed by the site's robots.txt" };
  }

  try {
    // HEAD first: it is the cheapest request for the other server. Some hosts
    // reject or mishandle it, and a HEAD response has no body to recognise a
    // challenge page by, so fall back to GET for those answers.
    let response = await request(url, "HEAD");

    if ([401, 403, 405, 429, 501].includes(response.status)) {
      await sleep(REQUEST_DELAY_MS);
      response = await request(url, "GET");
    }

    const finalUrl = response.url || url;
    const redirected = finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, "");

    if (response.status >= 400) {
      const signals = await botSignals(response);
      return { status: "failed", httpStatus: response.status, finalUrl, signals };
    }
    await response.body?.cancel();
    if (redirected) return { status: "redirected", httpStatus: response.status, finalUrl };
    return { status: "ok", httpStatus: response.status };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown error";
    const code = error?.cause?.code ? ` ${error.cause.code}` : "";
    return { status: "error", detail: reason === "TimeoutError" ? "Timed out" : `Request failed (${reason}${code})` };
  }
}

/* -------------------------------------------------------------------------- */
/* Triage                                                                     */
/* -------------------------------------------------------------------------- */

async function loadTriage(path) {
  if (!path) return new Map();
  const raw = JSON.parse(await readFile(path, "utf8"));
  const reviews = new Map();
  for (const review of raw.reviews ?? []) {
    const problems = [];
    if (!/^https:\/\//.test(review.url ?? "")) problems.push("url must be https");
    if (!CLASSIFICATIONS.includes(review.classification)) problems.push(`unknown classification ${review.classification}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt ?? "")) problems.push("reviewedAt must be YYYY-MM-DD");
    if (!review.reviewedBy || !review.evidence) problems.push("reviewedBy and evidence are required");
    if (problems.length > 0) throw new Error(`Invalid triage entry for ${review.url}: ${problems.join("; ")}`);
    reviews.set(review.url, review);
  }
  return reviews;
}

/** Whether a review still applies: fresh, and the checker still sees what the reviewer saw. */
function reviewApplies(review, result) {
  const age = (Date.parse(today) - Date.parse(review.reviewedAt)) / 86_400_000;
  if (age > REVIEW_FRESHNESS_DAYS) return { applies: false, why: `review from ${review.reviewedAt} has expired` };

  const expect = review.expect ?? {};
  if (review.classification === "accepted-redirect") {
    const matches = result.status === "redirected" && (!expect.finalUrlPrefix || result.finalUrl.startsWith(expect.finalUrlPrefix));
    return matches ? { applies: true } : { applies: false, why: "the response no longer matches the recorded review" };
  }
  const matches =
    (result.status === "failed" || result.status === "error") &&
    (!expect.status || expect.status.includes(result.httpStatus));
  return matches ? { applies: true } : { applies: false, why: "the response no longer matches the recorded review" };
}

/**
 * Files one result under one of the four report sections. The status code is an
 * input, never the verdict: a person's review, the redirect's destination and the
 * shape of the response all weigh in.
 */
function classify(target, result, reviews) {
  if (result.status === "ok") return { section: "ok" };
  if (result.status === "skipped") return { section: "skipped" };

  const review = reviews.get(target.url);
  const verdict = review ? reviewApplies(review, result) : null;
  const reviewed = verdict?.applies ? review : null;
  const staleNote = review && !verdict.applies ? ` A previous review no longer applies: ${verdict.why}.` : "";

  if (reviewed?.classification === "confirmed-broken") {
    return { section: "broken", attention: true, reviewed, note: "Fix the URL or archive the listing." };
  }

  if (result.status === "redirected") {
    const from = new URL(target.url);
    const to = new URL(result.finalUrl);
    if (from.protocol === "https:" && to.protocol === "http:") {
      return {
        section: "manual",
        attention: true,
        note: `Redirects from HTTPS to plain HTTP (${result.finalUrl}). Look for an HTTPS address on the same site before changing anything; never list the HTTP one.${staleNote}`,
      };
    }
    const sameSite = to.hostname.replace(/^www\./, "") === from.hostname.replace(/^www\./, "");
    return {
      section: "redirected",
      attention: !reviewed,
      reviewed,
      note:
        (sameSite
          ? "Same site (a language page, a trailing slash or a moved path). Usually fine."
          : "Different domain. Confirm the destination is the provider's own site before updating the listing.") + staleNote,
    };
  }

  const signals = result.signals ?? [];
  if (reviewed?.classification === "bot-protection" || signals.length > 0 || [401, 403, 429].includes(result.httpStatus)) {
    return {
      section: "blocked",
      attention: !reviewed,
      reviewed,
      note:
        (signals.length > 0 ? `Signals: ${signals.join(", ")}.` : "No challenge page recognised.") +
        (reviewed ? "" : " Open it in a browser; if it loads, record that in .github/link-triage.json.") +
        staleNote,
    };
  }

  const status = result.httpStatus;
  const observation =
    status === 404 || status === 410
      ? `The page may have moved or gone. Look for it on the provider's site before editing the listing.`
      : status >= 500
        ? "A server error, which is often temporary. Check again before acting."
        : "The checker could not reach it, which may be temporary.";
  return { section: "manual", attention: true, note: `${observation}${staleNote}` };
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  const manifestPath = argv[2];
  if (!manifestPath) {
    console.error("Usage: node check-links.mjs <link-manifest.json> [--out report.md] [--triage file.json]");
    process.exit(2);
  }

  const flag = (name) => (argv.indexOf(name) !== -1 ? argv[argv.indexOf(name) + 1] : null);
  const outPath = flag("--out");
  const reviews = await loadTriage(flag("--triage"));

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
  console.log(`Pacing: one request every ${REQUEST_DELAY_MS}ms, robots.txt honoured. ${reviews.size} triage review(s) loaded.\n`);

  // One request per distinct URL: a listing whose official and pricing URL are the
  // same page should not cost the provider two requests.
  const cache = new Map();
  const findings = [];
  for (const [index, target] of targets.entries()) {
    let result = cache.get(target.url);
    if (!result) {
      result = await checkUrl(target.url);
      cache.set(target.url, result);
      if (index < targets.length - 1) await sleep(REQUEST_DELAY_MS);
    }
    const filed = classify(target, result, reviews);
    findings.push({ ...target, ...result, ...filed });
    if (filed.section !== "ok") {
      const observed = result.httpStatus ? `HTTP ${result.httpStatus}` : result.detail;
      console.log(`${filed.section.toUpperCase().padEnd(10)} ${target.slug} (${target.kind}) — ${observed}${filed.reviewed ? " [reviewed]" : ""}`);
    }
  }

  const bySection = (section) => findings.filter((f) => f.section === section);
  const ok = bySection("ok");
  const manual = bySection("manual");
  const redirected = bySection("redirected");
  const blocked = bySection("blocked");
  const broken = bySection("broken");
  const skipped = bySection("skipped");
  const attention = findings.filter((f) => f.attention);

  console.log(`\n${ok.length} OK, ${attention.length} needing a person.`);

  const observed = (f) => (f.httpStatus ? `HTTP ${f.httpStatus}` : f.detail);
  const reviewLine = (f) =>
    f.reviewed
      ? `  - ✔ Reviewed ${f.reviewed.reviewedAt} by ${f.reviewed.reviewedBy}: ${f.reviewed.evidence}`
      : "  - ⏳ Not yet reviewed by a person.";

  const section = (heading, blurb, list, render) => [
    `### ${heading}`,
    "",
    blurb,
    "",
    ...(list.length === 0 ? ["None."] : list.flatMap(render)),
    "",
  ];

  const lines = [
    `Automated link check of ${targets.length} URLs across ${manifest.entries.length} resources on ${today}.`,
    "",
    "| | Count |",
    "| --- | --- |",
    `| Resolved normally | ${ok.length} |`,
    `| Needs manual review | ${manual.length} |`,
    `| Redirected | ${redirected.length} |`,
    `| Temporarily blocked / bot protection suspected | ${blocked.length} |`,
    `| Confirmed broken | ${broken.length} |`,
    `| Not checked (disallowed by the site's robots.txt) | ${skipped.length} |`,
    "",
    `**${attention.length}** finding(s) need a person this month.`,
    "",
    ...section(
      "Needs manual review",
      "The checker could not explain these. Open each one in a browser before editing anything.",
      manual,
      (f) => [`- **${f.name}** (\`${f.slug}\`, ${f.kind}): ${observed(f)}. ${f.note}`, `  - ${f.url}`],
    ),
    ...section(
      "Redirected",
      "The listed URL resolves somewhere else. A redirect is not a broken link; update a listing only once the destination is confirmed as the provider's own.",
      redirected,
      (f) => [`- **${f.name}** (\`${f.slug}\`, ${f.kind}): now resolves to ${f.finalUrl}. ${f.note}`, `  - Listed: ${f.url}`, reviewLine(f)],
    ),
    ...section(
      "Temporarily blocked / bot protection suspected",
      "The server refused the checker, which is what bot protection and rate limiting look like. This is not evidence the page is gone.",
      blocked,
      (f) => [`- **${f.name}** (\`${f.slug}\`, ${f.kind}): ${observed(f)}. ${f.note}`, `  - ${f.url}`, reviewLine(f)],
    ),
    ...section(
      "Confirmed broken",
      "Only a person can put a link here, after opening it in a browser and recording it in `.github/link-triage.json`.",
      broken,
      (f) => [`- **${f.name}** (\`${f.slug}\`, ${f.kind}): ${observed(f)}. ${f.note}`, `  - ${f.url}`, reviewLine(f)],
    ),
    skipped.length > 0 ? "<details><summary>Not checked automatically (robots.txt)</summary>\n" : null,
    ...skipped.map((f) => `- **${f.name}** (\`${f.slug}\`, ${f.kind}): ${f.url}`),
    skipped.length > 0 ? "\nThese sites ask automated clients not to fetch these paths, so the checker does not. Check them by hand now and then.\n</details>\n" : null,
    "---",
    "",
    "**A failure here is not proof a resource is gone, and a redirect is not proof a link is broken.** Check by hand",
    "before editing a listing, and record what you found in `.github/link-triage.json` so next month's report files it correctly.",
    "",
    "**This check says nothing about whether a resource is still free.** It only confirms that URLs resolve.",
    "Pricing and licence changes need a person reading the page — see `docs/verification.md`.",
  ];

  const report = lines.filter((line) => line !== null).join("\n");

  if (outPath) {
    await writeFile(outPath, report, "utf8");
    console.log(`Report written to ${outPath}`);
  }

  // Tells the workflow whether an issue is worth opening, or an open one can close.
  if (process.env.GITHUB_OUTPUT) {
    const summary = `${ok.length} OK, ${manual.length} need manual review, ${redirected.length} redirected, ${blocked.length} blocked or bot-protected, ${broken.length} confirmed broken`;
    await writeFile(process.env.GITHUB_OUTPUT, `attention_count=${attention.length}\nsummary=${summary}\n`, { flag: "a" });
  }
}

await main();
