/**
 * Works around a Next.js 16 static-export bug in client-navigation payload paths.
 *
 * https://github.com/vercel/next.js/issues/85374
 *
 * For client-side navigation, the router fetches pre-rendered RSC payload segments
 * from a flat filename in the page's directory:
 *
 *   /resources/gimp/__next.resources.$d$slug.__PAGE__.txt
 *
 * but the export writes the same data as nested directories:
 *
 *   /resources/gimp/__next.resources/$d$slug/__PAGE__.txt
 *
 * Every prefetch then 404s, and client navigation degrades to full page loads. The
 * content is correct — only its location is wrong — so this pass copies each nested
 * segment file to the flat name the router asks for. Copies rather than moves, so
 * nothing that might read the nested path breaks, and it is idempotent: on a build
 * where the bug is fixed there is nothing nested to copy.
 *
 * Remove this once the upstream fix lands; `scripts/browser-smoke.mjs` fails on any
 * 404 during navigation, so a regression either way is caught.
 */

import { copyFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function fixRscPaths(outDir) {
  let copied = 0;

  for await (const file of walk(outDir)) {
    if (!file.endsWith(".txt")) continue;

    const parts = relative(outDir, file).split(sep);
    // Find the first directory component that starts a nested segment path.
    const start = parts.findIndex((part, index) => index < parts.length - 1 && part.startsWith("__next."));
    if (start === -1) continue;

    const pageDir = join(outDir, ...parts.slice(0, start));
    const flatName = parts.slice(start).join(".");
    const target = join(pageDir, flatName);

    if (!(await exists(target))) {
      await copyFile(file, target);
      copied += 1;
    }
  }

  return { copied };
}
