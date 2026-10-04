#!/usr/bin/env node
/**
 * Real-browser smoke test for the static export.
 *
 * Drives a locally installed Chrome over the DevTools Protocol, using Node's built-in
 * WebSocket — no Puppeteer, no Playwright, no new dependency. GitHub's Ubuntu runners
 * ship with Chrome, so this runs in CI at no cost.
 *
 * Why a browser and not just HTML assertions: the two failure modes that matter most
 * here are invisible to a file check. A wrong CSP hash silently disables all
 * interactivity; a wrong base path makes every asset 404 while the HTML still looks
 * fine. Only a real page load catches either.
 *
 *   node scripts/browser-smoke.mjs                  # serves ./out at the configured base path
 *   node scripts/browser-smoke.mjs --url <site-url> # tests a deployed site instead
 *
 * Assertions are structural rather than tied to today's data, so adding or editing a
 * resource does not break CI.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve } from "node:path";
import { argv, env, exit, platform } from "node:process";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const urlFlag = argv.indexOf("--url");
const remoteUrl = urlFlag !== -1 ? argv[urlFlag + 1]?.replace(/\/+$/, "") : null;
const DEFAULT_SITE_URL = "https://everything-free-by-quilonix.github.io/everything-free";
const configuredSite = (env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, "");
const basePath = new URL(remoteUrl ?? configuredSite).pathname.replace(/\/+$/, "");

const VIEWPORTS = {
  desktop: { width: 1366, height: 900, mobile: false, deviceScaleFactor: 1 },
  tablet: { width: 820, height: 1180, mobile: true, deviceScaleFactor: 2 },
  mobile: { width: 390, height: 844, mobile: true, deviceScaleFactor: 3 },
};

function findChrome() {
  const candidates = [
    env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  return candidates.find((path) => existsSync(path)) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Static server — behaves like a header-less static host                     */
/* -------------------------------------------------------------------------- */

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};

async function startServer(root) {
  const server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://local").pathname);
    const send404 = async () => {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
    };

    if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return send404();

    let file = normalize(join(root, pathname.slice(basePath.length)));
    if (!file.startsWith(root)) return send404();

    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      const body = await readFile(file);
      // Deliberately no security headers: the production host cannot send any, so
      // the meta-tag CSP has to hold up on its own.
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      await send404();
    }
  });

  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

/* -------------------------------------------------------------------------- */
/* Minimal DevTools Protocol client                                           */
/* -------------------------------------------------------------------------- */

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function launchChrome(chromePath) {
  const profile = await mkdtemp(join(tmpdir(), "ef-smoke-"));
  const child = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      ...(platform === "linux" ? ["--no-sandbox"] : []),
      "about:blank",
    ],
    // No inherited handles: otherwise Chrome's children keep the caller's stdout
    // open after this script exits.
    { stdio: "ignore", windowsHide: true },
  );

  // Chrome writes this file once DevTools is listening. A cold CI runner can take
  // well over 10 seconds to get there, so allow up to 30 before giving up.
  const STARTUP_TIMEOUT_MS = 30_000;
  const POLL_MS = 100;
  const portFile = join(profile, "DevToolsActivePort");
  for (let waited = 0; waited < STARTUP_TIMEOUT_MS && !existsSync(portFile); waited += POLL_MS) await sleep(POLL_MS);
  const [port, path] = (await readFile(portFile, "utf8")).trim().split("\n");

  const socket = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((ok, fail) => {
    socket.onopen = ok;
    socket.onerror = fail;
  });

  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();

  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id !== undefined && pending.has(message.id)) {
      const { ok, fail } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) fail(new Error(message.error.message));
      else ok(message.result);
    } else if (message.method) {
      for (const listener of listeners) listener(message);
    }
  };

  const send = (method, params = {}, sessionId) =>
    new Promise((ok, fail) => {
      const id = ++nextId;
      pending.set(id, { ok, fail });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });

  const exited = new Promise((ok) => child.once("exit", ok));

  const close = async () => {
    // Browser.close asks Chrome to shut down cleanly; it may not reply before exiting.
    send("Browser.close").catch(() => {});
    const clean = await Promise.race([exited.then(() => true), sleep(3000).then(() => false)]);

    if (!clean) {
      // `child.kill()` only kills the top process on Windows, leaving renderer and
      // GPU children alive — and holding any inherited handles. Kill the tree.
      if (platform === "win32") {
        await new Promise((ok) => spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" }).on("exit", ok));
      } else {
        child.kill("SIGKILL");
      }
    }

    socket.close();
    await sleep(300);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  };

  return { send, listeners, close };
}

async function openPage(browser, { viewport = VIEWPORTS.desktop, javascript = true } = {}) {
  const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true });
  const send = (method, params) => browser.send(method, params, sessionId);

  const events = { errors: [], failedRequests: [], loads: 0, lastStatus: null };

  const listener = (message) => {
    if (message.sessionId !== sessionId) return;
    const { method, params } = message;

    if (method === "Page.loadEventFired") events.loads += 1;
    if (method === "Runtime.exceptionThrown") {
      events.errors.push(`exception: ${params.exceptionDetails.exception?.description ?? params.exceptionDetails.text}`);
    }
    if (method === "Log.entryAdded" && params.entry.level === "error") {
      events.errors.push(`${params.entry.source}: ${params.entry.text}`);
    }
    if (method === "Runtime.consoleAPICalled" && params.type === "error") {
      events.errors.push(`console: ${params.args.map((a) => a.value ?? a.description).join(" ")}`);
    }
    if (method === "Network.responseReceived" && params.type === "Document") {
      events.lastStatus = params.response.status;
    }
    // Every 4xx/5xx, of any type, with its URL — a console "404" alone is unactionable.
    // The main document is excluded because navigation checks assert its status.
    if (method === "Network.responseReceived" && params.response.status >= 400 && params.type !== "Document") {
      events.failedRequests.push(`${params.response.status} ${params.type} ${params.response.url}`);
    }
    if (method === "Network.loadingFailed" && !params.canceled) {
      events.failedRequests.push(`${params.blockedReason ?? params.errorText} ${params.type}`);
    }
  };
  browser.listeners.add(listener);

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Network.enable");
  await send("Emulation.setDeviceMetricsOverride", viewport);
  if (!javascript) await send("Emulation.setScriptExecutionDisabled", { value: true });

  // Records CSP violations from inside the page. Installed by DevTools, so the page's
  // own policy does not apply to it.
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__cspViolations = [];
      document.addEventListener("securitypolicyviolation", (e) =>
        window.__cspViolations.push(e.violatedDirective + " " + (e.blockedURI || "inline")));`,
  });

  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    return result.value;
  };

  const waitFor = async (expression, timeout = 8000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        if (await evaluate(expression)) return true;
      } catch {
        /* page mid-navigation */
      }
      await sleep(100);
    }
    return false;
  };

  const goto = async (url) => {
    const before = events.loads;
    events.lastStatus = null;
    // Each navigation starts clean, so a failure is attributed to the page that
    // caused it rather than to whichever check happens to look next.
    events.errors.length = 0;
    events.failedRequests.length = 0;
    await send("Page.navigate", { url });
    const start = Date.now();
    while (events.loads === before && Date.now() - start < 15000) await sleep(50);
    await sleep(javascript ? 400 : 100);
  };

  const key = async (keyName, code, keyCode) => {
    for (const type of ["keyDown", "keyUp"]) {
      await send("Input.dispatchKeyEvent", { type, key: keyName, code, windowsVirtualKeyCode: keyCode });
    }
  };

  const close = async () => {
    browser.listeners.delete(listener);
    await browser.send("Target.closeTarget", { targetId });
  };

  return { send, evaluate, waitFor, goto, key, events, close };
}

/* -------------------------------------------------------------------------- */
/* Test harness                                                               */
/* -------------------------------------------------------------------------- */

const results = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true, detail: detail ?? "" });
    console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
  } catch (error) {
    results.push({ name, ok: false, detail: error.message });
    console.log(`  ✗ ${name} — ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** Selectors and expressions reused across checks. */
const JS = {
  hydrated: `!!document.querySelector('button[aria-label^="Switch to"]')`,
  violations: `window.__cspViolations || []`,
  cards: `document.querySelectorAll('main article').length`,
  /**
   * Audits every resource card on the page against the manifest's fact evidence.
   * A card may only put a fact under "Confirmed" if the manifest says it is
   * confirmed, its free-status badge must carry the same evidence state, and no
   * reassurance ("no credit card", "commercial use allowed") may appear anywhere in
   * the evidence list outside the confirmed line. Returns the problems found.
   */
  cardAudit: (factsBySlug) => `(() => {
    const facts = ${JSON.stringify(factsBySlug)};
    const REASSURANCE = /no credit card|no account needed|commercial use allowed|personal use allowed/i;
    const problems = [];
    let audited = 0;
    for (const card of document.querySelectorAll('main article')) {
      const href = card.querySelector('h3 a')?.getAttribute('href') ?? '';
      const slug = (href.split('/resources/')[1] ?? '').replace(/\\/$/, '');
      if (!facts[slug]) continue;
      audited += 1;
      const f = facts[slug];
      for (const el of card.querySelectorAll('[data-evidence-group="confirmed"] [data-fact]')) {
        if (f[el.dataset.fact]?.state !== 'confirmed') problems.push(slug + ': shows ' + el.dataset.fact + ' as confirmed');
      }
      for (const group of card.querySelectorAll('[data-evidence-group]:not([data-evidence-group="confirmed"])')) {
        if (REASSURANCE.test(group.textContent)) problems.push(slug + ': reassurance outside Confirmed: ' + group.textContent.trim());
      }
      const badge = card.querySelector('[data-fact="freeStatus"]');
      if (!badge) problems.push(slug + ': no free-status badge');
      else if (badge.dataset.evidence !== f.freeStatus.state) problems.push(slug + ': free-status badge says ' + badge.dataset.evidence);
      const openSource = card.querySelector('[data-fact="openSource"]');
      if (openSource && openSource.dataset.evidence !== f.openSource.state) problems.push(slug + ': open-source chip says ' + openSource.dataset.evidence);
      if (!card.querySelector('ul[aria-label="What has been checked"]')) problems.push(slug + ': no evidence summary');
    }
    return { audited, problems };
  })()`,
  /** The value cell of a row in the resource page's Details list. */
  detailRow: (term) =>
    `[...document.querySelectorAll('#facts-heading ~ div dl > div')].find((row) => row.querySelector('dt')?.textContent.trim() === ${JSON.stringify(term)})?.querySelector('dd')`,
  h1: `document.querySelector('h1')?.textContent?.trim() ?? ""`,
  overflow: `document.documentElement.scrollWidth - window.innerWidth`,
  setValue: (selector, value) => `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
      : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`,
  click: (selector) => `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`,
  clickText: (tag, text) => `(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(tag)})].find((n) => n.textContent.trim() === ${JSON.stringify(text)});
    if (!el) return false; el.click(); return true;
  })()`,
};

async function assertCleanLoad(page, label) {
  const violations = await page.evaluate(JS.violations);
  assert(violations.length === 0, `${label}: CSP violations ${JSON.stringify(violations)}`);
  // Failed requests first: they carry the URL, which the matching console error does not.
  const failed = page.events.failedRequests.filter((e) => !/favicon/i.test(e));
  assert(failed.length === 0, `${label}: failed requests ${JSON.stringify(failed.slice(0, 3))}`);
  const errors = page.events.errors.filter((e) => !/favicon/i.test(e));
  assert(errors.length === 0, `${label}: console errors ${JSON.stringify(errors.slice(0, 3))}`);
}

/* -------------------------------------------------------------------------- */
/* Run                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error("No Chrome or Edge found. Set CHROME_PATH.");
    exit(2);
  }

  let server = null;
  let origin;
  if (remoteUrl) {
    origin = new URL(remoteUrl).origin;
  } else {
    const root = resolve("out");
    if (!existsSync(join(root, "index.html"))) {
      console.error("out/ is missing. Run `npm run build:static` first.");
      exit(2);
    }
    ({ server, origin } = await startServer(root));
  }

  const site = `${origin}${basePath}`;
  console.log(`Testing ${site}/ with ${chromePath.split(/[\\/]/).pop()}\n`);

  const browser = await launchChrome(chromePath);

  try {
    const manifest = await (await fetch(`${site}/link-manifest.json`)).json();
    const slugs = manifest.entries.map((entry) => entry.slug);
    assert(slugs.length > 0, "link manifest lists no resources");

    const routes = [
      "/",
      "/resources/",
      `/resources/${slugs[0]}/`,
      `/resources/${slugs[slugs.length - 1]}/`,
      "/categories/",
      "/categories/photography/",
      "/collections/",
      "/collections/student-starter-kit/",
      "/alternatives/",
      "/alternatives/adobe-photoshop/",
      "/for/students/",
      "/tools/",
      "/tools/image-converter/",
      "/tools/contrast-checker/",
      "/tools/text-toolkit/",
      "/submit/",
      "/report/",
      "/free-status/",
      "/verification/",
      "/about/",
      "/privacy/",
      "/terms/",
    ];

    /* ------------------------------------------------ direct loads, desktop */
    console.log("Direct navigation (desktop), JavaScript on");
    const desktop = await openPage(browser);
    for (const route of routes) {
      await check(`load ${route}`, async () => {
        desktop.events.errors.length = 0;
        desktop.events.failedRequests.length = 0;
        await desktop.goto(`${site}${route}`);
        assert(desktop.events.lastStatus === 200, `HTTP ${desktop.events.lastStatus}`);
        assert(await desktop.waitFor(JS.hydrated), "did not hydrate (scripts blocked or failed)");
        await assertCleanLoad(desktop, route);
        return await desktop.evaluate(JS.h1);
      });
    }

    await check("missing page returns 404 with the site's not-found page", async () => {
      await desktop.goto(`${site}/this-page-does-not-exist/`);
      assert(desktop.events.lastStatus === 404, `HTTP ${desktop.events.lastStatus}`);
      assert(/does not exist/i.test(await desktop.evaluate(JS.h1)), "custom 404 not rendered");
    });

    await check("static files: sitemap, robots, OG image", async () => {
      for (const [path, type] of [
        ["/sitemap.xml", "xml"],
        ["/robots.txt", "text/plain"],
        [`/og/${slugs[0]}.png`, "image/png"],
      ]) {
        const response = await fetch(`${site}${path}`);
        assert(response.ok, `${path} HTTP ${response.status}`);
        assert((response.headers.get("content-type") ?? "").includes(type), `${path} served as ${response.headers.get("content-type")}`);
      }
    });

    /* ------------------------------------------------------- behaviour */
    console.log("\nBehaviour");

    await check("homepage introduction states the library size from the data", async () => {
      await desktop.goto(`${site}/`);
      await desktop.waitFor(JS.hydrated);
      // The same formatting as `formatCount`, so the h1 must carry the exact built count.
      const count = new Intl.NumberFormat("en-GB").format(manifest.count);
      const h1 = await desktop.evaluate(JS.h1);
      assert(h1.includes(count), `h1 "${h1}" does not state ${count}`);
      assert(!(await desktop.evaluate(`/thousands/i.test(document.body.innerText)`)), "homepage says \"thousands\"");
      return h1;
    });

    await check("client-side navigation from a resource card", async () => {
      await desktop.goto(`${site}/`);
      await desktop.waitFor(JS.hydrated);
      const card = `main article h3 a[href*="/resources/"]`;
      const href = await desktop.evaluate(`document.querySelector(${JSON.stringify(card)})?.getAttribute('href')`);
      assert(href, "no resource card link on homepage");
      // Marks the document so a full reload (which would wipe the marker) can be
      // told apart from a genuine client-side transition.
      await desktop.evaluate(`window.__noReload = true`);
      await desktop.evaluate(JS.click(card));
      assert(await desktop.waitFor(`location.pathname === ${JSON.stringify(href)}`), `did not navigate to ${href}`);
      assert(await desktop.waitFor(`document.querySelector('h1') && !document.body.innerText.includes("Browse by category")`), "detail page did not render");
      assert(await desktop.evaluate(`window.__noReload === true`), "navigation fell back to a full page load");
      await assertCleanLoad(desktop, "after client navigation");
      return href;
    });

    /* ------------------------------------------------- command palette */
    const ctrlK = async (page) => {
      for (const type of ["keyDown", "keyUp"]) {
        await page.send("Input.dispatchKeyEvent", { type, key: "k", code: "KeyK", windowsVirtualKeyCode: 75, modifiers: 2 });
      }
    };
    const palette = {
      open: `!!document.querySelector('dialog[data-palette][open]')`,
      closed: `!document.querySelector('[data-palette]')`,
      input: `document.querySelector('[data-palette] [role="combobox"]')`,
    };

    await check("palette index loads and parses", async () => {
      const response = await fetch(`${site}/palette-index.json`);
      assert(response.ok, `HTTP ${response.status}`);
      const index = await response.json();
      assert(index.v === 1 && index.t > 0, "unexpected index header");
      assert(index.resources.length === manifest.count, `${index.resources.length} listings, manifest has ${manifest.count}`);
      assert(index.resources.every((r) => r.k + r.u <= index.t), "a listing counts more facts than the total");
      return `${index.resources.length} listings, t=${index.t}`;
    });

    await check("Ctrl+K palette: type, Escape clears, Escape closes, Enter navigates in place", async () => {
      const target = manifest.entries.find((e) => e.slug === "supabase") ?? manifest.entries[0];
      await desktop.goto(`${site}/resources/`);
      await desktop.waitFor(JS.hydrated);
      await ctrlK(desktop);
      assert(await desktop.waitFor(`${palette.open} && document.querySelector('[role="dialog"]') !== null`), "Ctrl+K did not open the palette");
      assert(await desktop.waitFor(`document.activeElement === ${palette.input}`), "focus is not on the combobox");
      await desktop.send("Input.insertText", { text: target.name });
      const option = `[...document.querySelectorAll('[data-palette] [role="option"]')].find((o) => o.textContent.includes(${JSON.stringify(target.name)}))`;
      assert(await desktop.waitFor(`!!${option}`), `${target.name} not offered`);
      await desktop.key("Escape", "Escape", 27);
      assert(await desktop.waitFor(`${palette.open} && ${palette.input}.value === ''`), "Escape with a query did not keep the palette open and clear it");
      await desktop.key("Escape", "Escape", 27);
      assert(await desktop.waitFor(palette.closed), "Escape on an empty query did not close");
      assert(await desktop.waitFor(`!!document.activeElement && !document.activeElement.closest('dialog')`), "focus was not returned to the page");

      await ctrlK(desktop);
      assert(await desktop.waitFor(palette.open), "Ctrl+K did not reopen the palette");
      await desktop.send("Input.insertText", { text: target.name });
      assert(await desktop.waitFor(`${option}?.getAttribute('aria-selected') === 'true'`), `${target.name} is not the active row`);
      await desktop.evaluate(`window.__noReload = true`);
      await desktop.key("Enter", "Enter", 13);
      assert(await desktop.waitFor(`location.pathname.endsWith('/resources/${target.slug}/')`), "Enter did not navigate");
      assert(await desktop.waitFor(palette.closed), "palette still open after navigating");
      assert(await desktop.evaluate(`window.__noReload === true`), "navigation fell back to a full page load");
      assert(await desktop.waitFor(`document.activeElement?.id === 'main'`), "focus did not move to the main region");
      return target.slug;
    });

    await check("palette opened without user activation still closes on Escape and reopens", async () => {
      await desktop.goto(`${site}/`);
      await desktop.waitFor(JS.hydrated);
      // An untrusted click: no user activation reaches the dialog.
      assert(await desktop.evaluate(JS.click('header a[aria-label="Search resources"]')), "palette trigger missing");
      assert(await desktop.waitFor(palette.open), "trigger click did not open the palette");
      await desktop.key("Escape", "Escape", 27);
      assert(await desktop.waitFor(palette.closed), "Escape did not close a palette opened without activation");
      await ctrlK(desktop);
      assert(await desktop.waitFor(palette.open), "Ctrl+K did not reopen the palette");
      await desktop.key("Escape", "Escape", 27);
      assert(await desktop.waitFor(palette.closed), "palette did not close again");
    });

    await check("verification evidence is summarised, then disclosed on demand", async () => {
      // Uses the manifest rather than a hard-coded slug, so the check follows the data:
      // pick any entry that has recorded per-check evidence.
      const audited = manifest.entries.find((e) => e.confirmedChecks.length + e.unresolvedChecks.length > 0);
      assert(audited, "no resource has recorded verification checks");
      await desktop.goto(`${site}/resources/${audited.slug}/`);
      await desktop.waitFor(JS.hydrated);
      const required = manifest.rules.requiredChecks.length;
      const confirmed = required - audited.missingRequiredChecks.length;
      assert(
        await desktop.evaluate(`document.body.innerText.includes(${JSON.stringify(`${confirmed} of ${required}`)})`),
        `summary does not state ${confirmed} of ${required} required checks`,
      );
      const details = `[...document.querySelectorAll('details')].find(d => d.querySelector('summary')?.textContent.includes('View verification evidence'))`;
      assert(await desktop.evaluate(`!!${details} && !${details}.open`), "evidence disclosure missing or open by default");
      await desktop.evaluate(`${details}.querySelector('summary').click()`);
      assert(await desktop.waitFor(`${details}.open`), "evidence disclosure did not open");
      const sourceLinks = await desktop.evaluate(`${details}.querySelectorAll('a[href^="http"]').length`);
      assert(sourceLinks > 0, "no source links inside the evidence");
      return `${audited.slug}: ${confirmed}/${required}, ${sourceLinks} source links`;
    });

    await check("an unchecked listing claims no verification and says how it was compiled", async () => {
      // A listing with no recorded checks must not show a verification date or an
      // evidence disclosure, and its compilation notes must be labelled as such.
      const unchecked = manifest.entries.find((e) => e.stage === "not-started");
      assert(unchecked, "no unchecked resource to test");
      await desktop.goto(`${site}/resources/${unchecked.slug}/`);
      await desktop.waitFor(JS.hydrated);
      // Scoped to the verification panel: related-resource cards elsewhere on the page
      // legitimately show their own check dates.
      const text = await desktop.evaluate(
        `[...document.querySelectorAll('h2')].find((h) => h.textContent.trim() === 'Verification')?.parentElement?.innerText ?? ''`,
      );
      assert(text.length > 0, "verification panel not found");
      assert(text.includes("Not checked against official sources yet"), "missing the not-checked statement");
      assert(!text.includes("Last checked"), "shows a check date for a listing with no recorded checks");
      assert(!text.includes("View verification evidence"), "offers evidence that does not exist");
      assert(text.includes("How this listing was compiled"), "compilation notes are not labelled");
      return unchecked.slug;
    });

    await check("provenance rail states the panel's required-checks figure, or that none are recorded", async () => {
      // Same picks as the two checks above, so the rail and the panel are read on
      // the same pages: one listing with check records, one without.
      const audited = manifest.entries.find((e) => e.confirmedChecks.length + e.unresolvedChecks.length > 0);
      const unchecked = manifest.entries.find((e) => e.stage === "not-started");
      assert(audited && unchecked, "no listing for one of the two branches");
      const station = `document.querySelector('[aria-labelledby="provenance-heading"] [data-provenance="checks"]')?.textContent ?? ''`;
      const panel = `[...document.querySelectorAll('h2')].find((h) => h.textContent.trim() === 'Verification')?.parentElement?.innerText ?? ''`;

      await desktop.goto(`${site}/resources/${audited.slug}/`);
      await desktop.waitFor(JS.hydrated);
      const withChecks = await desktop.evaluate(station);
      const pair = withChecks.match(/(\d+) of (\d+)/)?.[0];
      assert(pair, `station 2 has no ratio: ${withChecks}`);
      const panelText = await desktop.evaluate(panel);
      assert(panelText.includes(`${pair} required checks confirmed`), `panel does not show ${pair}: ${panelText.slice(0, 160)}`);
      const page = await desktop.evaluate(`document.body.innerText`);
      assert(!/\bof 12\b/.test(page), "a third denominator ('of 12') appears on the record page");

      await desktop.goto(`${site}/resources/${unchecked.slug}/`);
      await desktop.waitFor(JS.hydrated);
      const without = await desktop.evaluate(station);
      assert(without.includes("No checks recorded yet"), `station 2 reads: ${without}`);
      assert(!without.includes("required checks"), "station 2 shows a ratio with no check records");
      return `${audited.slug}: ${pair}; ${unchecked.slug}: none recorded`;
    });

    /* ------------------------------------------ fact-level evidence */
    const factsBySlug = Object.fromEntries(manifest.entries.map((entry) => [entry.slug, entry.facts]));

    await check("cards never present an unconfirmed fact as confirmed", async () => {
      // Every card surface: the browse page, the homepage, a category, an audience,
      // a collection chosen for a fact ("commercial use"), and an alternatives page.
      const routes = [
        "/resources/",
        "/",
        "/categories/photography/",
        "/for/developers/",
        "/collections/assets-safe-for-client-work/",
        "/alternatives/adobe-photoshop/",
      ];
      let audited = 0;
      for (const route of routes) {
        await desktop.goto(`${site}${route}`);
        await desktop.waitFor(JS.hydrated);
        const result = await desktop.evaluate(JS.cardAudit(factsBySlug));
        assert(result.problems.length === 0, `${route}: ${result.problems.slice(0, 3).join("; ")}`);
        assert(result.audited > 0, `${route}: no cards audited`);
        audited += result.audited;
        if (route.startsWith("/collections/")) {
          const note = await desktop.evaluate(`document.querySelector('[data-testid="collection-evidence-note"]')?.textContent ?? ""`);
          assert(note.includes("not the same as each fact being confirmed"), "collection does not say its selection is not confirmation");
        }
        if (route.startsWith("/alternatives/")) {
          // The comparison table: every fact cell carries the manifest's evidence state.
          const table = await desktop.evaluate(`(() => {
            const facts = ${JSON.stringify(factsBySlug)};
            const problems = [];
            let cells = 0;
            for (const row of document.querySelectorAll('table tbody tr')) {
              const slug = (row.querySelector('th a')?.getAttribute('href') ?? '').split('/resources/')[1]?.replace(/\\/$/, '') ?? '';
              if (!facts[slug]) { problems.push('row without a known resource: ' + slug); continue; }
              for (const cell of row.querySelectorAll('[data-fact]')) {
                cells += 1;
                const shown = cell.querySelector('[data-evidence]')?.dataset.evidence;
                if (shown !== facts[slug][cell.dataset.fact]?.state) problems.push(slug + ' ' + cell.dataset.fact + ' cell says ' + shown);
              }
            }
            return { cells, problems };
          })()`);
          assert(table.cells > 0, "comparison table has no fact cells");
          assert(table.problems.length === 0, `comparison: ${table.problems.slice(0, 3).join("; ")}`);
        }
      }
      return `${audited} cards on ${routes.length} pages`;
    });

    await check("strict filter matches confirmed facts only and says what it held back", async () => {
      await desktop.goto(`${site}/resources/?noCreditCard=1`);
      await desktop.waitFor(JS.hydrated);
      assert(await desktop.waitFor(`!!document.querySelector('[data-testid="evidence-filter-notice"]')`), "no confirmed-only notice");
      const slugsShown = await desktop.evaluate(
        `[...document.querySelectorAll('main article h3 a')].map((a) => a.getAttribute('href').split('/resources/')[1].replace(/\\/$/, ''))`,
      );
      assert(slugsShown.length > 0, "no results");
      for (const slug of slugsShown) {
        const entry = manifest.entries.find((e) => e.slug === slug);
        assert(entry.values.requiresCreditCard === "no" && entry.facts.requiresCreditCard.state === "confirmed", `${slug} matched without a confirmed "no"`);
      }
      const heldBack = manifest.entries.filter((e) => e.values.requiresCreditCard === "no" && e.facts.requiresCreditCard.state !== "confirmed").length;
      const notice = await desktop.evaluate(`document.querySelector('[data-testid="evidence-filter-notice"]').textContent`);
      assert(notice.includes(`${heldBack} more listings record it`), `notice does not report ${heldBack} held back: ${notice}`);
      assert(await desktop.evaluate(`[...document.querySelectorAll('[aria-label="Active filters"] a')].some((a) => a.textContent.includes("No credit card · confirmed"))`), "chip does not say confirmed");
      return `${slugsShown.length} confirmed, ${heldBack} held back`;
    });

    await check("search: 'without credit card' never badges an unconfirmed card", async () => {
      await desktop.goto(`${site}/resources/?q=${encodeURIComponent("free AI tool without credit card")}`);
      await desktop.waitFor(JS.hydrated);
      assert(await desktop.waitFor(`document.body.innerText.includes("set a filter automatically")`), "inferred-filter notice missing");
      const result = await desktop.evaluate(JS.cardAudit(factsBySlug));
      assert(result.problems.length === 0, result.problems.slice(0, 3).join("; "));
      const unknownCard = manifest.entries.filter((e) => e.values.requiresCreditCard === "unknown").map((e) => e.slug);
      const shown = await desktop.evaluate(`[...document.querySelectorAll('main article h3 a')].map((a) => a.getAttribute('href'))`);
      assert(!shown.some((href) => unknownCard.some((slug) => href.includes(`/resources/${slug}/`))), "a listing with an unknown card requirement matched");
      return `${result.audited} results, all confirmed`;
    });

    await check("detail page shows value and evidence per fact, with mixed states", async () => {
      // Supabase: free status and commercial use confirmed, card requirement unresolved.
      await desktop.goto(`${site}/resources/supabase/`);
      await desktop.waitFor(JS.hydrated);
      const card = await desktop.evaluate(`${JS.detailRow("Credit card required")}?.innerText ?? ""`);
      assert(/Unknown/.test(card) && /Not confirmed/.test(card), `card row reads: ${card}`);
      assert(!/No credit card needed/.test(card), "card row claims no card");
      const commercial = await desktop.evaluate(`${JS.detailRow("Commercial use")}?.innerText ?? ""`);
      assert(/Commercial use allowed/.test(commercial) && /Confirmed/.test(commercial), `commercial row reads: ${commercial}`);
      // "How we know" opens on demand and names the source and who checked it.
      const details = `${JS.detailRow("Credit card required")}.querySelector('details')`;
      assert(await desktop.evaluate(`!!${details} && !${details}.open`), "no closed 'How we know' disclosure");
      await desktop.evaluate(`${details}.querySelector('summary').click()`);
      assert(await desktop.waitFor(`${details}.open`), "disclosure did not open");
      const opened = await desktop.evaluate(`${details}.innerText`);
      assert(opened.includes("supabase.com") && opened.includes("Checked by"), `disclosure lacks source or verifier: ${opened.slice(0, 160)}`);
      const badge = await desktop.evaluate(`document.querySelector('header [data-fact="freeStatus"]')?.dataset.evidence`);
      assert(badge === "confirmed", `free-status badge evidence is ${badge}`);
      return "confirmed, not confirmed and not verified on one page";
    });

    await check("unverified listing shows recorded values as not verified", async () => {
      const unchecked = manifest.entries.find((e) => e.stage === "not-started" && e.values.requiresCreditCard === "no");
      assert(unchecked, "no unchecked listing with a recorded 'no'");
      await desktop.goto(`${site}/resources/${unchecked.slug}/`);
      await desktop.waitFor(JS.hydrated);
      const card = await desktop.evaluate(`${JS.detailRow("Credit card required")}?.innerText ?? ""`);
      assert(/Recorded as no/.test(card) && /Not verified/.test(card), `card row reads: ${card}`);
      const confirmedInDetails = await desktop.evaluate(`document.querySelectorAll('#facts-heading ~ div [data-evidence="confirmed"]').length`);
      assert(confirmedInDetails === 0, `${confirmedInDetails} facts shown as confirmed with no checks recorded`);
      const badge = await desktop.evaluate(`document.querySelector('header [data-fact="freeStatus"]')?.dataset.evidence`);
      assert(badge === "unconfirmed", `free-status badge evidence is ${badge}`);
      const title = await desktop.evaluate(`document.title`);
      assert(title.includes("(not verified)"), `title does not flag it: ${title}`);
      const offers = await desktop.evaluate(
        `[...document.querySelectorAll('script[type="application/ld+json"]')].some((s) => s.textContent.includes('"offers"'))`,
      );
      assert(!offers, "structured data offers a zero price for an unverified status");
      return unchecked.slug;
    });

    await check("record tags link to their tag listings", async () => {
      // The record -> tag-listing path lives only in the aside's Tags block.
      await desktop.goto(`${site}/resources/supabase/`);
      await desktop.waitFor(JS.hydrated);
      const tags = await desktop.evaluate(`(() => {
        const heading = [...document.querySelectorAll('aside h2')].find((h) => h.textContent.trim() === 'Tags');
        if (!heading) return null;
        return [...heading.parentElement.querySelectorAll('a[href*="?tag="]')].map((a) => ({
          text: a.textContent.trim(),
          tag: new URL(a.href).searchParams.get('tag'),
        }));
      })()`);
      assert(tags, "no Tags heading in the aside");
      assert(tags.length > 0, "Tags heading has no tag links");
      const wrong = tags.filter((t) => t.tag !== t.text);
      assert(wrong.length === 0, `tag links point elsewhere: ${JSON.stringify(wrong.slice(0, 3))}`);
      return `${tags.length} tags`;
    });

    await check("search: natural-language constraint becomes a removable filter", async () => {
      await desktop.goto(`${site}/resources/?q=${encodeURIComponent("free AI voice generator without a credit card")}`);
      assert(await desktop.waitFor(`document.body.innerText.includes("set a filter automatically")`), "inferred-filter notice missing");
      assert(await desktop.waitFor(`[...document.querySelectorAll('[aria-label="Active filters"] a')].some(a => a.textContent.includes("No credit card"))`), "no removable chip");
    });

    await check("search: alternative-to query explains its matches", async () => {
      await desktop.goto(`${site}/resources/?q=${encodeURIComponent("alternative to Photoshop")}`);
      assert(await desktop.waitFor(`document.body.innerText.includes("Listed as a free alternative to")`), "no match reason shown");
      return `${await desktop.evaluate(JS.cards)} results`;
    });

    await check("search: no match shows the empty state", async () => {
      await desktop.goto(`${site}/resources/?q=${encodeURIComponent("quantum banana synthesiser")}`);
      assert(await desktop.waitFor(`document.body.innerText.includes("Nothing matched")`), "empty state missing");
    });

    await check("filters update the URL and the results", async () => {
      // The total count, not the number of cards: results are paginated, so a
      // filter that still matches a full page would look unchanged by card count.
      const total = `Number((document.querySelector('p[aria-live="polite"]')?.textContent.match(/\\d+/) ?? [0])[0])`;
      await desktop.goto(`${site}/resources/`);
      await desktop.waitFor(JS.hydrated);
      assert(await desktop.waitFor(`${total} > 0`), "no result count shown");
      const before = await desktop.evaluate(total);
      assert(await desktop.evaluate(JS.click('input[name="openSource"]')), "open-source filter not found");
      assert(await desktop.waitFor(`location.search.includes("openSource=1")`), "URL did not update");
      assert(await desktop.waitFor(`${total} > 0 && ${total} < ${before}`), "result total did not change");
      return `${before} → ${await desktop.evaluate(total)} resources`;
    });

    await check("desktop: exactly one filter form is mounted", async () => {
      await desktop.goto(`${site}/resources/`);
      await desktop.waitFor(JS.hydrated);
      const forms = await desktop.evaluate(`[...document.querySelectorAll('form')].filter((f) => f.querySelector('input[name="openSource"]')).length`);
      assert(forms === 1, `${forms} filter forms at 1366px`);
      return "1 form";
    });

    await check("URL-driven filter loads directly", async () => {
      await desktop.goto(`${site}/resources/?platform=LINUX`);
      assert(await desktop.waitFor(`[...document.querySelectorAll('[aria-label="Active filters"] a')].some(a => a.textContent.includes("Linux"))`), "Linux chip missing");
      assert(await desktop.evaluate(`document.querySelector('input[name="platform"][value="LINUX"]').checked`), "checkbox not checked");
    });

    await check("keyboard focus is visible on the search field and the sort select", async () => {
      // A text input always matches :focus-visible, and focus moved from it by
      // script stays keyboard-modality, so both reads are the keyboard state.
      await desktop.goto(`${site}/resources/`);
      await desktop.waitFor(JS.hydrated);
      const read = (target) => `(() => {
        const el = ${target};
        if (!el) return null;
        el.focus();
        const ring = el.closest('[data-search-field]') ?? el;
        return { visible: el.matches(':focus-visible'), style: getComputedStyle(ring).outlineStyle, width: getComputedStyle(ring).outlineWidth };
      })()`;
      const field = await desktop.evaluate(read(`document.querySelector('[data-search-field] input[type="search"]')`));
      assert(field, "search field missing");
      assert(field.visible && field.style !== "none" && field.width !== "0px", `search wrapper outline ${field.style} ${field.width}`);
      const sort = await desktop.evaluate(read(`document.querySelector('[data-results-toolbar] select')`));
      assert(sort, "sort select missing from the results toolbar");
      assert(sort.visible && sort.style !== "none" && sort.width !== "0px", `sort select outline ${sort.style} ${sort.width}`);
      return `search ${field.style} ${field.width}, sort ${sort.style} ${sort.width}`;
    });

    await check("every record's first fact is its free status, with evidence", async () => {
      // The card audit reads the first [data-fact] in each article, so a record
      // that reorders its zones must fail here rather than pass the audit by luck.
      const audit = `(() => {
        const bad = [];
        // Records only: the homepage subject groups are articles too, until the Atlas Index.
        const records = document.querySelectorAll('main article[data-record]');
        for (const record of records) {
          const first = record.querySelector('[data-fact]');
          if (!first || first.dataset.fact !== 'freeStatus' || !first.hasAttribute('data-evidence')) {
            bad.push(record.querySelector('h3 a')?.getAttribute('href') ?? '?');
          }
        }
        return { count: records.length, bad };
      })()`;
      const counts = [];
      for (const route of ["/", "/resources/"]) {
        await desktop.goto(`${site}${route}`);
        await desktop.waitFor(JS.hydrated);
        assert(await desktop.waitFor(`document.querySelectorAll('main article[data-record]').length > 0`), `${route}: no records`);
        const { count, bad } = await desktop.evaluate(audit);
        assert(bad.length === 0, `${route}: first fact is not the free status in ${bad.slice(0, 3).join(", ")}`);
        counts.push(`${route} ${count}`);
      }
      return counts.join(", ");
    });

    await check("contrast checker computes a ratio", async () => {
      await desktop.goto(`${site}/tools/contrast-checker/`);
      await desktop.waitFor(JS.hydrated);
      await desktop.evaluate(JS.setValue('input[placeholder="#000000"]', "#000000"));
      assert(await desktop.waitFor(`/\\d+\\.\\d{2}:1/.test(document.body.innerText)`), "no ratio shown");
      return await desktop.evaluate(`document.body.innerText.match(/\\d+\\.\\d{2}:1/)[0]`);
    });

    await check("text toolkit transforms text", async () => {
      await desktop.goto(`${site}/tools/text-toolkit/`);
      await desktop.waitFor(JS.hydrated);
      await desktop.evaluate(JS.setValue("textarea", "hello world"));
      assert(await desktop.waitFor(JS.clickText("button", "UPPERCASE")), "UPPERCASE button not found");
      assert(await desktop.waitFor(`document.querySelector("textarea").value === "HELLO WORLD"`), "text not transformed");
    });

    await check("image converter runs locally and renders a blob: result", async () => {
      await desktop.goto(`${site}/tools/image-converter/`);
      await desktop.waitFor(JS.hydrated);
      const loaded = await desktop.evaluate(`(async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 64; canvas.height = 48;
        const ctx = canvas.getContext("2d"); ctx.fillStyle = "#d4af37"; ctx.fillRect(0, 0, 64, 48);
        const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
        const input = document.querySelector('input[type="file"]');
        const dt = new DataTransfer(); dt.items.add(new File([blob], "test.png", { type: "image/png" }));
        input.files = dt.files; input.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      })()`);
      assert(loaded, "could not supply a file");
      assert(await desktop.waitFor(JS.clickText("button", "Convert image")), "convert button did not appear");
      assert(await desktop.waitFor(`!!document.querySelector('a[download][href^="blob:"]')`), "no download link");
      assert(await desktop.waitFor(`(() => { const img = document.querySelector('img[src^="blob:"]'); return img && img.complete && img.naturalWidth > 0; })()`), "blob: preview did not render (CSP img-src?)");
      await assertCleanLoad(desktop, "image converter");
    });

    await check("submit form: empty submission shows errors", async () => {
      await desktop.goto(`${site}/submit/`);
      await desktop.waitFor(JS.hydrated);
      await desktop.evaluate(JS.click('form button[type="submit"]'));
      assert(await desktop.waitFor(`document.body.innerText.includes("could not be submitted yet")`), "no error summary");
      assert(await desktop.evaluate(`document.querySelectorAll('[aria-invalid="true"]').length > 0`), "no field marked invalid");
    });

    await check("submit form: valid submission yields a prefilled GitHub issue", async () => {
      await desktop.goto(`${site}/submit/`);
      await desktop.waitFor(JS.hydrated);
      for (const [selector, value] of [
        ['input[name="name"]', "Smoke Test Resource"],
        ['input[name="officialUrl"]', "https://example.org"],
        ['select[name="category"]', "utilities"],
        ['select[name="resourceType"]', "UTILITY"],
        ['select[name="freeStatus"]', "FREE"],
        ['textarea[name="whyListed"]', "Automated smoke test entry used only to check that validation succeeds."],
      ]) {
        assert(await desktop.evaluate(JS.setValue(selector, value)), `missing field ${selector}`);
      }
      await desktop.evaluate(JS.click('form button[type="submit"]'));
      assert(await desktop.waitFor(`!!document.querySelector('a[href^="https://github.com/everything-free-by-Quilonix/everything-free/issues/new"]')`), "no issue link");
    });

    await check("report form prefills a known resource from the URL", async () => {
      await desktop.goto(`${site}/report/?resource=${slugs[0]}`);
      assert(await desktop.waitFor(`document.querySelector('input[name="resourceSlug"]')?.value === ${JSON.stringify(slugs[0])}`), "slug not prefilled");
      assert(await desktop.evaluate(`document.querySelector('input[name="resourceSlug"]').readOnly`), "field not locked");
    });

    await check("keyboard: first Tab reaches a visible skip link", async () => {
      await desktop.goto(`${site}/`);
      await desktop.waitFor(JS.hydrated);
      await desktop.key("Tab", "Tab", 9);
      const text = await desktop.evaluate(`document.activeElement?.textContent?.trim()`);
      assert(text === "Skip to main content", `focused "${text}"`);
      const outline = await desktop.evaluate(`getComputedStyle(document.activeElement).outlineStyle`);
      assert(outline !== "none", "no focus outline");
      return `outline ${outline}`;
    });

    await check("palette parses its index without a CSP violation", async () => {
      // The index is validated in the browser; a validator that evals would be
      // blocked and reported by the strict policy.
      await desktop.goto(`${site}/`);
      await desktop.waitFor(JS.hydrated);
      desktop.events.errors.length = 0;
      desktop.events.failedRequests.length = 0;
      await ctrlK(desktop);
      assert(await desktop.waitFor(palette.open), "Ctrl+K did not open the palette");
      await desktop.send("Input.insertText", { text: "supabase" });
      assert(await desktop.waitFor(`[...document.querySelectorAll('[data-palette] [role="option"]')].some((o) => o.textContent.includes('Supabase'))`), "index did not load");
      await assertCleanLoad(desktop, "palette");
      await desktop.key("Escape", "Escape", 27);
      await desktop.key("Escape", "Escape", 27);
    });

    /* ------------------------------------------------- quick compare */
    const comparePair = ["supabase", slugs.find((s) => s !== "supabase")];
    const compareRoute = `/compare/?r=${comparePair.join(",")}`;

    await check("compare index loads, parses and matches the manifest's evidence", async () => {
      const response = await fetch(`${site}/compare-index.json`);
      assert(response.ok, `HTTP ${response.status}`);
      const index = await response.json();
      assert(index.v === 1 && index.t > 0, "unexpected index header");
      assert(index.entries.length === manifest.count, `${index.entries.length} listings, manifest has ${manifest.count}`);
      const problems = [];
      for (const entry of index.entries) {
        const facts = factsBySlug[entry.s];
        for (const [fact, cell] of Object.entries(entry.cells)) {
          if (cell.state !== facts?.[fact]?.state || cell.reason !== facts?.[fact]?.reason) problems.push(`${entry.s} ${fact}`);
        }
      }
      assert(problems.length === 0, `cells disagree with the manifest: ${problems.slice(0, 3).join("; ")}`);
      return `${index.entries.length} listings`;
    });

    await check("compare table states each fact's evidence exactly as the manifest does", async () => {
      await desktop.goto(`${site}${compareRoute}`);
      await desktop.waitFor(JS.hydrated);
      assert(await desktop.waitFor(`document.querySelectorAll('table tbody td[data-fact]').length > 0`), "comparison table did not render");
      const audit = await desktop.evaluate(`(() => {
        const facts = ${JSON.stringify(factsBySlug)};
        const cols = [...document.querySelectorAll('table thead th a')].map((a) => (a.getAttribute('href').split('/resources/')[1] ?? '').replace(/\\/$/, ''));
        const problems = [];
        let cells = 0;
        for (const row of document.querySelectorAll('table tbody tr')) {
          [...row.querySelectorAll('td')].forEach((td, i) => {
            if (!td.dataset.fact) return;
            cells += 1;
            const shown = td.querySelector('[data-evidence]')?.dataset.evidence;
            if (shown !== facts[cols[i]]?.[td.dataset.fact]?.state) problems.push(cols[i] + ' ' + td.dataset.fact + ' says ' + shown);
          });
        }
        return { cols, cells, problems };
      })()`);
      assert(audit.cols.join(",") === comparePair.join(","), `columns ${audit.cols.join(",")}`);
      assert(audit.cells === comparePair.length * 8, `${audit.cells} fact cells`);
      assert(audit.problems.length === 0, audit.problems.slice(0, 3).join("; "));
      await assertCleanLoad(desktop, "compare");
      return `${audit.cells} cells`;
    });

    await check("compare: an unknown slug leaves the picker and says it was left out", async () => {
      await desktop.goto(`${site}/compare/?r=not-a-real-slug`);
      await desktop.waitFor(JS.hydrated);
      assert(await desktop.waitFor(`document.body.innerText.includes("Pick two or three listings to compare")`), "picker empty state missing");
      assert(await desktop.evaluate(`document.body.innerText.includes("1 listing in this link was not found and was left out")`), "not-found notice missing");
      assert(await desktop.evaluate(`!document.querySelector('table')`), "a table rendered with no listings");
    });

    await check("compare toggles on /resources fill the tray, stop at three and open the comparison", async () => {
      await desktop.goto(`${site}/resources/`);
      await desktop.waitFor(JS.hydrated);
      const toggles = `[...document.querySelectorAll('main [data-compare-toggle]')]`;
      assert(await desktop.waitFor(`${toggles}.length >= 4`), "no compare toggles on records");
      for (const i of [0, 1, 2]) await desktop.evaluate(`${toggles}[${i}].click()`);
      assert(await desktop.waitFor(`document.querySelector('[data-compare-tray]')?.innerText.includes('3 of 3 selected')`), "tray does not show 3 of 3");
      assert(await desktop.evaluate(`${toggles}[3].getAttribute('aria-disabled') === 'true'`), "a fourth toggle is not disabled");
      await desktop.evaluate(`${toggles}[3].click()`);
      assert(await desktop.evaluate(`document.querySelector('[data-compare-tray]').innerText.includes('3 of 3 selected')`), "a fourth listing was added");
      await desktop.evaluate(`window.__noReload = true`);
      assert(await desktop.evaluate(JS.clickText("[data-compare-tray] a", "Compare 3 listings")), "no Compare link in the tray");
      assert(await desktop.waitFor(`location.pathname.endsWith('/compare/') && document.querySelectorAll('table thead th a').length === 3`), "comparison did not open with three columns");
      assert(await desktop.evaluate(`window.__noReload === true`), "navigation fell back to a full page load");
    });
    await desktop.close();

    /* ------------------------------------------------ viewports */
    for (const [name, viewport] of Object.entries({ tablet: VIEWPORTS.tablet, mobile: VIEWPORTS.mobile })) {
      console.log(`\n${name[0].toUpperCase()}${name.slice(1)} (${viewport.width}×${viewport.height})`);
      const page = await openPage(browser, { viewport });
      for (const route of ["/", "/resources/", `/resources/${slugs[0]}/`, "/tools/image-converter/", "/submit/", "/alternatives/adobe-photoshop/"]) {
        await check(`${name} ${route} has no horizontal overflow`, async () => {
          await page.goto(`${site}${route}`);
          await page.waitFor(JS.hydrated);
          const overflow = await page.evaluate(JS.overflow);
          assert(overflow <= 1, `content ${overflow}px wider than the viewport`);
        });
      }

      // Added routes: the comparison table and the subject index.
      for (const route of [compareRoute, "/categories/"]) {
        await check(`${name} ${route} has no horizontal overflow`, async () => {
          await page.goto(`${site}${route}`);
          await page.waitFor(JS.hydrated);
          if (route === compareRoute) assert(await page.waitFor(`!!document.querySelector('table')`), "comparison table did not render");
          const overflow = await page.evaluate(JS.overflow);
          assert(overflow <= 1, `content ${overflow}px wider than the viewport`);
        });
      }

      if (name === "mobile") {
        await check("mobile: card evidence stays compact", async () => {
          // At most one line per evidence state, never a table: three short lines.
          await page.goto(`${site}/resources/`);
          await page.waitFor(JS.hydrated);
          const sizes = await page.evaluate(
            `[...document.querySelectorAll('ul[aria-label="What has been checked"]')].map((ul) => ({ items: ul.children.length, height: ul.getBoundingClientRect().height }))`,
          );
          assert(sizes.length > 0, "no evidence summaries");
          const tallest = Math.max(...sizes.map((s) => s.height));
          assert(sizes.every((s) => s.items <= 3), "a card has more than three evidence lines");
          assert(tallest <= 90, `tallest evidence summary is ${Math.round(tallest)}px`);
          return `${sizes.length} cards, tallest ${Math.round(tallest)}px`;
        });

        await check("mobile menu opens as a dialog, traps focus, closes on Escape", async () => {
          await page.goto(`${site}/`);
          await page.waitFor(JS.hydrated);
          assert(await page.evaluate(JS.click('button[aria-label="Open menu"]')), "menu button missing");
          assert(await page.waitFor(`!!document.querySelector('[role="dialog"][aria-modal="true"]')`), "dialog did not open");
          assert(await page.waitFor(`document.querySelector('[role="dialog"]').contains(document.activeElement)`), "focus not moved into dialog");
          await page.key("Escape", "Escape", 27);
          assert(await page.waitFor(`!document.querySelector('[role="dialog"]')`), "Escape did not close");
          assert(await page.waitFor(`document.activeElement?.getAttribute("aria-label") === "Open menu"`), "focus not returned to trigger");
        });

        await check("mobile: the Filters sheet holds the only filter form and returns focus", async () => {
          await page.goto(`${site}/resources/`);
          await page.waitFor(JS.hydrated);
          const trigger = `[...document.querySelectorAll('[data-results-toolbar] button')].find((b) => b.textContent.trim().startsWith('Filters'))`;
          const forms = `[...document.querySelectorAll('form')].filter((f) => f.querySelector('input[name="openSource"]')).length`;
          assert(await page.evaluate(`!!${trigger}`), "no Filters button in the results toolbar");
          await page.evaluate(`${trigger}.click()`);
          assert(await page.waitFor(`!!document.querySelector('[role="dialog"][aria-modal="true"]')`), "sheet did not open");
          assert(await page.waitFor(`${forms} === 1`), `${await page.evaluate(forms)} filter forms with the sheet open`);
          assert(
            await page.evaluate(`document.querySelector('[role="dialog"]').contains(document.querySelector('input[name="openSource"]'))`),
            "the filter form is not inside the sheet",
          );
          const show = `[...document.querySelectorAll('[role="dialog"] button')].find((b) => /^Show \\d[\\d,]* results?$/.test(b.textContent.trim()))`;
          assert(await page.evaluate(`!!${show}`), "no 'Show N results' button");
          await page.evaluate(`${show}.click()`);
          assert(await page.waitFor(`!document.querySelector('[role="dialog"]')`), "Show N results did not close the sheet");
          assert(await page.waitFor(`document.activeElement === ${trigger}`), "focus not returned to the Filters button");
        });
      }
      await page.close();
    }

    /* ------------------------------------------------ JavaScript disabled */
    console.log("\nJavaScript disabled");
    const noJs = await openPage(browser, { javascript: false });
    await check("no-JS: /resources lists the library as static HTML", async () => {
      await noJs.goto(`${site}/resources/`);
      const cards = await noJs.evaluate(JS.cards);
      assert(cards === slugs.length, `${cards} cards, expected ${slugs.length}`);
      assert(await noJs.evaluate(`document.body.innerText.includes("Search and filters need JavaScript")`), "no-JS notice not shown");
      return `${cards} resources`;
    });
    await check("no-JS: resource and category pages render fully", async () => {
      await noJs.goto(`${site}/resources/${slugs[0]}/`);
      assert((await noJs.evaluate(JS.h1)).length > 0, "resource h1 missing");
      assert(await noJs.evaluate(`document.body.innerText.includes("Limitations")`), "resource body missing");
      await noJs.goto(`${site}/categories/photography/`);
      assert((await noJs.evaluate(JS.cards)) > 0, "category lists nothing");
    });
    await check("no-JS: submit and report offer the GitHub issue form", async () => {
      await noJs.goto(`${site}/submit/`);
      assert(await noJs.evaluate(`!!document.querySelector('a[href*="template=resource-submission"]')`), "submit fallback missing");
      await noJs.goto(`${site}/report/`);
      assert(await noJs.evaluate(`!!document.querySelector('a[href*="template=resource-correction"]')`), "report fallback missing");
    });
    await check("no-JS: no page offers Compare, and /compare/ says it needs JavaScript", async () => {
      await noJs.goto(`${site}/resources/supabase/`);
      assert(await noJs.evaluate(`!document.querySelector('a[href*="/compare/"]')`), "record page links to /compare/ without JavaScript");
      await noJs.goto(`${site}/resources/`);
      assert(await noJs.evaluate(`!document.querySelector('a[href*="/compare/"], [data-compare-toggle]')`), "/resources offers compare without JavaScript");
      await noJs.goto(`${site}${compareRoute}`);
      assert(await noJs.evaluate(`document.body.innerText.includes("Comparison needs JavaScript")`), "no-JS notice missing on /compare/");
      const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
      assert(!sitemap.includes("/compare"), "/compare/ is in the sitemap");
    });
    await noJs.close();
  } finally {
    await browser.close();
    server?.close();
  }

  const failed = results.filter((r) => !r.ok);
  const summary = `${results.length - failed.length}/${results.length} checks passed`;
  console.log(`\n${summary}`);

  // A machine-readable report, independent of how stdout is captured.
  const reportFlag = argv.indexOf("--report");
  if (reportFlag !== -1) {
    const lines = [
      summary,
      ...results.map((r) => `${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? ` — ${r.detail}` : ""}`),
    ];
    await writeFile(argv[reportFlag + 1], `${lines.join("\n")}\n`, "utf8");
  }

  exit(failed.length === 0 ? 0 : 1);
}

await main();
