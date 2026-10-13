// Captures reference frames of the LIVE Everything.Free site with the locally
// installed Chrome (playwright-core drives it; no browser download).
// Output: src/assets/references/<viewport>/<name>.png and references.json
// Usage: node scripts/capture-references.mjs
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://everything-free.quilonix.in";
const OUT = new URL("../public/references/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => p && existsSync(p));

const viewports = {
  desktop: { width: 1440, height: 900, scale: 3 },
  laptop: { width: 1280, height: 800, scale: 2 },
  mobile: { width: 390, height: 844, scale: 3 },
};

/** Each shot: route, optional action, optional scroll target, full page or viewport. */
const shots = [
  { name: "home-hero", path: "/" },
  { name: "home-full", path: "/", fullPage: true },
  { name: "home-search-typed", path: "/", action: "search", query: "free video editor" },
  { name: "home-section-ai", path: "/", scrollTo: "text=Private AI" },
  { name: "home-section-entertainment", path: "/", scrollTo: "#entertainment" },
  { name: "home-section-categories", path: "/", scrollTo: "#categories" },
  { name: "home-section-tools", path: "/", scrollTo: "#tools" },
  { name: "home-section-alternatives", path: "/", scrollTo: "#alternatives" },
  { name: "home-footer", path: "/", scrollTo: "footer" },
  { name: "resources", path: "/resources" },
  { name: "resources-query", path: "/resources?q=free%20video%20editor" },
  { name: "resources-query-ai", path: "/resources?q=free%20AI%20voice%20generator%20without%20a%20credit%20card" },
  { name: "students", path: "/students" },
  { name: "ai", path: "/ai" },
  { name: "entertainment", path: "/entertainment" },
  { name: "tools", path: "/tools" },
  { name: "private-ai-chat", path: "/tools/private-ai-chat" },
  { name: "free-status", path: "/free-status" },
  { name: "alternatives", path: "/alternatives" },
  { name: "categories", path: "/categories" },
  { name: "resource-detail", path: "/resources/obsidian" },
  { name: "resource-detail-gimp", path: "/resources/gimp" },
];

const only = process.argv[2];
const results = [];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  for (const [vpName, vp] of Object.entries(viewports)) {
    if (only && only !== vpName) continue;
    const dir = join(OUT, vpName);
    await mkdir(dir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.scale,
      colorScheme: "dark",
      reducedMotion: "reduce",
      isMobile: vpName === "mobile",
      hasTouch: vpName === "mobile",
    });
    const page = await context.newPage();
    for (const shot of shots) {
      if (vpName !== "desktop" && shot.fullPage) continue;
      const file = join(dir, `${shot.name}.png`);
      const record = { viewport: vpName, ...vp, ...shot, file: `references/${vpName}/${shot.name}.png` };
      try {
        const res = await page.goto(BASE + shot.path, { waitUntil: "networkidle", timeout: 45000 });
        record.status = res?.status();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(600);
        if (shot.action === "search") {
          const input = page.locator('input[type="search"], input[role="combobox"], input[name="q"]').first();
          await input.click();
          await input.pressSequentially(shot.query, { delay: 25 });
          await page.waitForTimeout(900);
        }
        if (shot.scrollTo) {
          const el = page.locator(shot.scrollTo).first();
          await el.scrollIntoViewIfNeeded({ timeout: 5000 });
          await page.evaluate(() => window.scrollBy(0, -80));
          await page.waitForTimeout(500);
        }
        await page.screenshot({ path: file, fullPage: !!shot.fullPage });
        record.title = await page.title();
        record.ok = true;
      } catch (err) {
        record.ok = false;
        record.error = String(err).slice(0, 300);
      }
      results.push(record);
      console.log(`${record.ok ? "ok " : "ERR"} ${vpName} ${shot.name} ${record.status ?? ""} ${record.error ?? ""}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(join(OUT, `references${only ? "-" + only : ""}.json`), JSON.stringify(results, null, 2));
