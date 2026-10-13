// Builds a contact sheet (PNG) from a set of images using local Chrome.
// Usage:
//   node scripts/contact-sheet.mjs references   -> public/references/contact-sheet-<vp>.png
//   node scripts/contact-sheet.mjs frames <dir> <out.png> [cols]
import { chromium } from "playwright-core";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome"].find(
  (p) => p && existsSync(p),
);
const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

async function sheet(files, out, { cols, title, thumbW, aspect }) {
  const cells = files
    .map(
      (f) => `<figure><div class="img" style="aspect-ratio:${aspect}"><img src="${pathToFileURL(f).href}"></div><figcaption>${basename(f)}</figcaption></figure>`,
    )
    .join("");
  const html = `<!doctype html><html><head><style>
    body{margin:0;background:#100e0b;color:#b8b4ad;font:13px/1.3 system-ui,sans-serif;padding:32px}
    h1{font:600 20px system-ui;color:#f0eeea;margin:0 0 20px}
    h1 b{color:#dfb453}
    .grid{display:grid;grid-template-columns:repeat(${cols},${thumbW}px);gap:18px}
    figure{margin:0}
    .img{overflow:hidden;border:1px solid #302d29;border-radius:6px;background:#191714}
    img{width:100%;display:block;object-fit:cover;object-position:top}
    figcaption{margin-top:6px;font-family:ui-monospace,monospace;font-size:12px}
  </style></head><body><h1>Everything<b>.</b>Free — ${title}</h1><div class="grid">${cells}</div></body></html>`;
  const tmp = join(root, ".contact-sheet.html");
  await writeFile(tmp, html);
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: cols * (thumbW + 18) + 64, height: 600 } });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  await (await import("node:fs/promises")).rm(tmp);
  console.log("wrote", out, files.length, "images");
}

const [mode, a, b, c] = process.argv.slice(2);
if (mode === "references") {
  for (const vp of ["desktop", "laptop", "mobile"]) {
    const dir = join(root, "public/references", vp);
    const files = (await readdir(dir)).filter((f) => f.endsWith(".png") && f !== "home-full.png").map((f) => join(dir, f));
    const mobile = vp === "mobile";
    await sheet(files, join(root, "public/references", `contact-sheet-${vp}.png`), {
      cols: mobile ? 8 : 5,
      thumbW: mobile ? 200 : 360,
      aspect: mobile ? "390/844" : vp === "desktop" ? "1440/900" : "1280/800",
      title: `live-site reference frames · ${vp}`,
    });
  }
} else if (mode === "frames") {
  const files = (await readdir(a)).filter((f) => f.endsWith(".png") || f.endsWith(".jpeg")).sort().map((f) => join(a, f));
  const vertical = (c ?? "").includes("vertical");
  await sheet(files, b, { cols: Number(c?.replace(/\D/g, "")) || 6, thumbW: vertical ? 180 : 320, aspect: vertical ? "9/16" : "16/9", title: `rendered film · ${basename(b)}` });
} else {
  console.error("usage: references | frames <dir> <out> [cols]");
  process.exit(1);
}
