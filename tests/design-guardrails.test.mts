/**
 * Design guardrails.
 *
 * Each rule here keeps one decision of the design direction
 * (docs/design/global-ui-direction-002.md) true as the code changes: a plain
 * file walk plus a regex, with the owner lists as data at the top of the file.
 * A rule that fails names the files that broke it. CSS is checked with its
 * comments stripped, so prose about a banned pattern never trips a rule.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, test } from "node:test";

// ---------------------------------------------------------------------------
// Owner lists and allow-lists
// ---------------------------------------------------------------------------

/** The only file that may touch client storage: the theme preference. */
const STORAGE_OWNER = "src/components/layout/theme.tsx";

// ---------------------------------------------------------------------------
// File walk
// ---------------------------------------------------------------------------

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

type SourceFile = { path: string; text: string };

function walk(dir: string, out: SourceFile[] = []): SourceFile[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push({ path: relative(ROOT, full).split(sep).join("/"), text: readFileSync(full, "utf8") });
  }
  return out;
}

const SRC = walk(join(ROOT, "src"));
const byExt = (...exts: string[]) => SRC.filter((f) => exts.some((e) => f.path.endsWith(e)));
const CODE = byExt(".ts", ".tsx");
const CSS = byExt(".css").map((f) => ({ ...f, text: f.text.replace(/\/\*[\s\S]*?\*\//g, "") }));

/** "path:line: match" for every match of `pattern` in `files`. */
function hits(files: SourceFile[], pattern: RegExp): string[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const re = new RegExp(pattern.source, flags);
  const found: string[] = [];
  for (const file of files) {
    for (const m of file.text.matchAll(re)) {
      const line = file.text.slice(0, m.index).split("\n").length;
      found.push(`${file.path}:${line}: ${m[0]}`);
    }
  }
  return found;
}

/**
 * Every declaration in a stylesheet with the at-rule and selector preludes that
 * enclose it, outermost first.
 */
function cssDeclarations(text: string): Array<{ decl: string; within: string[]; line: number }> {
  const out: Array<{ decl: string; within: string[]; line: number }> = [];
  const stack: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== "{" && ch !== "}" && ch !== ";") continue;
    const segment = text.slice(start, i).trim();
    if (ch === "{") stack.push(segment.replace(/\s+/g, " "));
    else if (segment) out.push({ decl: segment, within: [...stack], line: text.slice(0, i).split("\n").length });
    if (ch === "}") stack.pop();
    start = i + 1;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

describe("design guardrails", () => {
  test("only the theme preference touches client storage", () => {
    const files = CODE.filter((f) => f.path !== STORAGE_OWNER);
    assert.deepEqual(hits(files, /\b(?:localStorage|sessionStorage)\b/), []);
  });

  test("no transition-all", () => {
    assert.deepEqual(hits([...CODE, ...CSS], /\btransition-all\b/), []);
  });

  test("no arbitrary duration, easing or delay classes", () => {
    assert.deepEqual(hits(CODE, /\b(?:duration|ease|delay)-\[/), []);
  });

  test("relative colour only inside an @supports (color: oklch(from …)) block", () => {
    const found: string[] = [];
    for (const file of CSS) {
      for (const { decl, within, line } of cssDeclarations(file.text)) {
        if (!decl.includes("oklch(from")) continue;
        if (within.some((p) => /^@supports\s*\(color:\s*oklch\(from\b/.test(p))) continue;
        found.push(`${file.path}:${line}: ${decl}`);
      }
    }
    assert.deepEqual(found, []);
  });

  test("globals.css declares no token and references no status colour", () => {
    const globals = CSS.filter((f) => f.path === "src/app/globals.css");
    assert.equal(globals.length, 1);
    assert.deepEqual(hits(globals, /(?:^|[\s;{])--[a-z0-9-]+\s*:/m), []);
    assert.deepEqual(hits(globals, /--(?:success|warning|danger|info)\b/), []);
  });
});
