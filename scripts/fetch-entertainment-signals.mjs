#!/usr/bin/env node
/**
 * Refreshes src/data/entertainment-signals.json from the GitHub REST API.
 *
 *   node scripts/fetch-entertainment-signals.mjs            # write the file
 *   node scripts/fetch-entertainment-signals.mjs --dry-run  # print, do not write
 *
 * Reads the `githubRepo` of every entertainment listing from the data files and
 * asks GitHub for that repository's public metadata (stars, last push, archived).
 * Nothing else is collected.
 *
 * Rate limits and keys: unauthenticated requests are limited to 60 per hour per IP,
 * which covers the current catalogue. Set GITHUB_TOKEN (any token; no scopes needed)
 * to raise that to 5,000. The token is optional, read from the environment only, and
 * never written anywhere.
 *
 * This is deliberately separate from the build. The build reads the committed file
 * and never makes a network request, so a GitHub outage cannot fail a deploy.
 * A repository that fails to fetch keeps its previous signal (if any) and is
 * reported; it is never recorded as "dead" on one failed request.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DATA_DIRS = [join(ROOT, "src/data/resources"), join(ROOT, "src/data/resources/entertainment")];
const OUT = join(ROOT, "src/data/entertainment-signals.json");
const DRY = process.argv.includes("--dry-run");
const TIMEOUT_MS = 15_000;
const PAUSE_MS = 250;

async function repos() {
  const found = new Set();
  for (const dir of DATA_DIRS) {
    for (const name of await readdir(dir)) {
      if (!name.endsWith(".ts")) continue;
      const text = await readFile(join(dir, name), "utf8");
      for (const match of text.matchAll(/githubRepo:\s*"([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)"/g)) found.add(match[1]);
    }
  }
  return [...found].sort((a, b) => a.localeCompare(b));
}

async function fetchRepo(repo, attempt = 1) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "everything-free-signals", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (response.status === 403 || response.status === 429) {
      return { error: `rate limited (${response.status}); remaining ${response.headers.get("x-ratelimit-remaining")}` };
    }
    if (response.status >= 500 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return fetchRepo(repo, attempt + 1);
    }
    if (!response.ok) return { error: `HTTP ${response.status}` };
    const body = await response.json();
    return {
      signal: {
        repo,
        source: "github-rest-api",
        observedAt: new Date().toISOString().slice(0, 10),
        stars: body.stargazers_count,
        pushedAt: body.pushed_at ?? null,
        archived: Boolean(body.archived),
        evidenceUrl: body.html_url,
      },
    };
  } catch (error) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return fetchRepo(repo, attempt + 1);
    }
    return { error: String(error?.message ?? error) };
  }
}

const previous = await readFile(OUT, "utf8").then(JSON.parse).catch(() => ({ github: [] }));
const previousByRepo = new Map((previous.github ?? []).map((s) => [s.repo, s]));

const list = await repos();
const github = [];
const failures = [];
for (const repo of list) {
  const { signal, error } = await fetchRepo(repo);
  if (signal) github.push(signal);
  else {
    failures.push(`${repo}: ${error}`);
    if (previousByRepo.has(repo)) github.push(previousByRepo.get(repo));
  }
  await new Promise((r) => setTimeout(r, PAUSE_MS));
}

const output = {
  version: 1,
  generatedAt: new Date().toISOString(),
  notes:
    `GitHub repository metadata (stars, last push, archived) for ${list.length} open-source entertainment listings, ` +
    `from the public GitHub REST API. ${failures.length} request(s) failed and kept their previous value where one existed.`,
  github,
};

console.log(`${github.length}/${list.length} repositories recorded.`);
for (const failure of failures) console.log(`  failed: ${failure}`);
if (DRY) console.log(JSON.stringify(output, null, 2).slice(0, 2000));
else {
  await writeFile(OUT, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT}`);
}
