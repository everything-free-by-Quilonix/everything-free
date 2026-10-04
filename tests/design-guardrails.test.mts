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
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Owner lists and allow-lists
// ---------------------------------------------------------------------------

/** The only file that may touch client storage: the theme preference. */
const STORAGE_OWNER = "src/components/layout/theme.tsx";

/** Tool UIs keep their own styling and primary actions. */
const TOOL_UIS = "src/features/tools/implementations/";

/**
 * Files that may suppress the focus outline: `#main` is a programmatic focus
 * target only, and the search field draws its ring on the wrapper.
 */
const OUTLINE_SUPPRESSION_ALLOWED = ["src/app/layout.tsx", "src/features/search/components/search-box.tsx"];

/** The single translucent recipe, and the most files that may apply it. */
const MATERIALS_FILE = "src/styles/materials.css";
const MAX_FUNCTIONAL_FILES = 3;

/**
 * Gold is a closed list of five roles: brand dot, primary action (and the skip
 * link), focus, selected or current indicators, text selection.
 */
const GOLD_TSX_OWNERS = [
  "src/components/ui/button.tsx",
  "src/components/layout/brand.tsx",
  "src/components/layout/site-header.tsx",
  "src/components/layout/nav-links.tsx",
  "src/components/ui/segmented-control.tsx",
  "src/features/palette/command-palette.tsx",
  "src/features/search/components/pagination.tsx",
  "src/features/resources/components/on-this-page.tsx",
];
const GOLD_CSS_OWNERS = ["src/styles/tokens.css", "src/styles/materials.css", "src/styles/motion.css", "src/app/globals.css"];
const GOLD_CLASS =
  /\b(?:text|bg|border(?:-[trblxyse])?|ring|outline|accent|decoration|fill|stroke|from|via|to|shadow|caret|divide)-primary(?!-fg)\b/;

/** Success colour means confirmed evidence. These files own it. */
const SUCCESS_OWNERS = [
  "src/features/resources/components/evidence.tsx",
  "src/components/ui/badge.tsx",
  "src/components/ui/callout.tsx",
  "src/features/resources/components/survey-bar.tsx",
  "src/styles/tokens.css",
  "src/styles/materials.css",
];
/** Files that may pass a tone taken from a definition (each gates it on evidence). */
const DEFINITION_TONE_OWNERS = [
  "src/features/resources/components/status-badges.tsx",
  "src/app/resources/[slug]/page.tsx",
  "src/app/verification/page.tsx",
];

/** The four evidence glyphs are drawn only by `EvidenceMark`. */
const EVIDENCE_GLYPH_OWNER = "src/features/resources/components/evidence.tsx";
/** `definition.icon` there is a platform glyph, none of them reserved. */
const PLATFORM_ICON_OWNER = "src/features/resources/components/resource-facts.tsx";
/** The icon set itself names every glyph. */
const ICON_SET = "src/components/icons/index.tsx";
const RESERVED = "(?:check-circle|help-circle|clock|minus-circle)";

/**
 * The serif is the editorial voice only: page titles, editorial section titles,
 * the record-page name, Atlas Index group titles and the editorial collection row.
 */
const SERIF_OWNERS = [
  /^src\/app\/(?:.+\/)?page\.tsx$/,
  /^src\/app\/(?:not-found|error)\.tsx$/,
  /^src\/features\/home\/components\/hero\.tsx$/,
  /^src\/components\/ui\/layout\.tsx$/,
  /^src\/features\/search\/components\/(?:resource-explorer|static-library)\.tsx$/,
  /^src\/features\/categories\/components\/atlas-index\.tsx$/,
  /^src\/features\/collections\/components\/collection-card\.tsx$/,
];

/** Where every homepage number must come from the census or a repository read. */
const HOME_FEATURE = "src/features/home/";
const HOME_PAGE = "src/app/page.tsx";

/** Legal marks, which Unicode classes as pictographic but are not emoji. */
const EMOJI_ALLOWED = new Set(["©", "®", "™"]);

// ---------------------------------------------------------------------------
// File walk
// ---------------------------------------------------------------------------

const ROOT = fileURLToPath(new URL("..", import.meta.url));

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
const TSX = byExt(".tsx");
const CODE = byExt(".ts", ".tsx");
const notTool = (f: SourceFile) => !f.path.startsWith(TOOL_UIS);
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

  test("no radius above 10px outside the tool UIs", () => {
    const files = TSX.filter(notTool);
    assert.deepEqual(hits(files, /\brounded(?:-[trblse]{1,2})?-(?:lg|xl|2xl|3xl|4xl)\b/), []);
    assert.deepEqual(hits(files, /\brounded(?:-[trblse]{1,2})?-\[/), []);
  });

  test("no bare rounded (4px, off the 3/6/10 scale) outside the tool UIs", () => {
    const files = TSX.filter(notTool);
    assert.deepEqual(hits(files, /(?<![\w-])rounded(?:-[trblse]{1,2})?(?![\w-])/), []);
  });

  test("focus outlines are suppressed only on the allow-list", () => {
    const files = TSX.filter(notTool).filter((f) => !OUTLINE_SUPPRESSION_ALLOWED.includes(f.path));
    assert.deepEqual(hits(files, /\boutline-(?:none|hidden)\b/), []);
  });

  test("blur exists only in materials.css", () => {
    assert.deepEqual(hits(CODE, /\bbackdrop-(?:blur|filter)\b/), []);
    const css = CSS.filter((f) => f.path !== MATERIALS_FILE);
    assert.deepEqual(hits(css, /\bbackdrop-(?:blur|filter)\b/), []);
  });

  test(`at most ${MAX_FUNCTIONAL_FILES} files apply the FUNCTIONAL material`, () => {
    const users = TSX.filter((f) => /\bmaterial-functional\b/.test(f.text)).map((f) => f.path);
    assert.ok(users.length <= MAX_FUNCTIONAL_FILES, `material-functional is applied in ${users.join(", ")}`);
  });

  test("gold appears only in its owners", () => {
    const tsx = TSX.filter(notTool).filter((f) => !GOLD_TSX_OWNERS.includes(f.path));
    assert.deepEqual(hits(tsx, GOLD_CLASS), []);
    assert.deepEqual(hits(tsx, /var\(--primary/), []);
    const css = CSS.filter((f) => !GOLD_CSS_OWNERS.includes(f.path));
    assert.deepEqual(hits(css, /--primary/), []);
  });

  test("success colour appears only in its owners (rule 1)", () => {
    const files = [...CODE, ...CSS].filter(notTool).filter((f) => !SUCCESS_OWNERS.includes(f.path));
    assert.deepEqual(hits(files, /\b(?:text|bg|border|fill|stroke)-success\b|--success/), []);
  });

  test("success and definition tones only where evidence gates them (rule 2)", () => {
    const tsx = TSX.filter(notTool);
    assert.deepEqual(hits(tsx, /\btone="success"/), []);
    const definitionTone = tsx.filter((f) => !DEFINITION_TONE_OWNERS.includes(f.path));
    assert.deepEqual(hits(definitionTone, /\btone=\{[^}]*\b\w+\.tone\b[^}]*\}/), []);
  });

  test("the four evidence glyphs are drawn only through EvidenceMark", () => {
    const tsx = TSX.filter(notTool).filter((f) => f.path !== EVIDENCE_GLYPH_OWNER);
    assert.deepEqual(hits(tsx, new RegExp(`\\b(?:name|icon)="${RESERVED}"`)), []);
    assert.deepEqual(hits(tsx, new RegExp(`\\bicon:\\s*"${RESERVED}"`)), []);
    const configIcons = TSX.filter((f) => f.path !== PLATFORM_ICON_OWNER);
    assert.deepEqual(hits(configIcons, /\b(?:name|icon)=\{\s*(?:status|definition|verification)\.icon\s*\}/), []);
  });

  test("no reserved glyph name appears as a bare literal, including inside JSX expressions", () => {
    const tsx = TSX.filter(notTool).filter((f) => f.path !== EVIDENCE_GLYPH_OWNER && f.path !== ICON_SET);
    assert.deepEqual(hits(tsx, new RegExp(`"${RESERVED}"`)), []);
  });

  test("the serif appears only at the editorial sites", () => {
    const files = TSX.filter((f) => !SERIF_OWNERS.some((owner) => owner.test(f.path)));
    assert.deepEqual(hits(files, /\bfont-serif\b/), []);
  });

  test("no emoji anywhere in src", () => {
    const found = hits([...CODE, ...byExt(".css")], /\p{Extended_Pictographic}/u).filter(
      (hit) => !EMOJI_ALLOWED.has(hit.slice(hit.lastIndexOf(" ") + 1)),
    );
    assert.deepEqual(found, []);
  });

  test("homepage copy states no count by hand", () => {
    const files = CODE.filter((f) => f.path.startsWith(HOME_FEATURE) || f.path === HOME_PAGE);
    assert.ok(files.length > 0);
    assert.deepEqual(hits(files, /\b\d{2,}\s+(?:listings?|resources?|subjects?|tools?)\b/i), []);
  });

  test("no Escape veto: onEscape appears nowhere in src", () => {
    assert.deepEqual(hits(CODE, /\bonEscape\b/), []);
  });

  test("no animation classes other than animate-none", () => {
    assert.deepEqual(hits(CODE, /\banimate-(?!none\b)[a-z0-9[-]+/), []);
  });

  test("globals.css declares no token and references no status colour", () => {
    const globals = CSS.filter((f) => f.path === "src/app/globals.css");
    assert.equal(globals.length, 1);
    assert.deepEqual(hits(globals, /(?:^|[\s;{])--[a-z0-9-]+\s*:/m), []);
    assert.deepEqual(hits(globals, /--(?:success|warning|danger|info)\b/), []);
  });
});
