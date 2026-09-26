#!/usr/bin/env node
/**
 * Produces the fully static production build in `out/`.
 *
 * Two steps:
 *
 * 1. `next build` with `STATIC_EXPORT=1`, which sets `output: "export"`. That build
 *    is also the project's architectural assertion: it fails if any route needs a
 *    server — a server action, an API route, per-request rendering. If it succeeds,
 *    the application provably has no runtime, which is what the zero-cost guarantee
 *    rests on.
 *
 * 2. Post-export passes:
 *    - `fix-rsc-paths.mjs` puts client-navigation payloads where the router looks for
 *      them, working around a Next.js 16 export bug.
 *    - `csp.mjs` writes a strict, hash-based Content Security Policy into every HTML
 *      file. The production host cannot send headers, so the policy travels in the
 *      page itself.
 *
 * A wrapper script rather than an inline environment variable in package.json,
 * because `STATIC_EXPORT=1 next build` is not valid on Windows and the project
 * should build the same way everywhere without a cross-env dependency.
 */

import { spawn } from "node:child_process";
import { resolve } from "node:path";

import { applyCsp } from "./csp.mjs";
import { fixRscPaths } from "./fix-rsc-paths.mjs";

function run(command, args, env) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...env },
      // Required on Windows, where npx resolves to a shell script, not an executable.
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => resolvePromise(code ?? 1));
  });
}

const code = await run("npx", ["next", "build"], { STATIC_EXPORT: "1" });
if (code !== 0) process.exit(code);

try {
  const { copied } = await fixRscPaths(resolve("out"));
  console.log(`\n✓ Navigation payloads: ${copied} segment files copied to the paths the router requests (vercel/next.js#85374)`);

  const { pages, hashed } = await applyCsp(resolve("out"));
  console.log(`\n✓ Content Security Policy written into ${pages} pages (${hashed} inline scripts hashed, no 'unsafe-inline' for scripts)`);
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
