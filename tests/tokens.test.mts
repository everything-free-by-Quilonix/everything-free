/**
 * Colour tokens meet WCAG 2.x contrast in both themes.
 *
 * `src/styles/tokens.css` is the only place colour is defined, so this test
 * parses its two theme blocks, converts each OKLCH value to sRGB, and asserts
 * every text, status, focus and interactive-edge pair the design depends on.
 * If a value fails, only its lightness is meant to change.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

/** Top-level rules as [prelude, body] pairs, with nested blocks kept inside the body. */
function topLevelRules(text: string): Array<[string, string]> {
  const rules: Array<[string, string]> = [];
  let depth = 0;
  let preludeStart = 0;
  let bodyStart = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) bodyStart = i + 1;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        rules.push([text.slice(preludeStart, bodyStart - 1).trim(), text.slice(bodyStart, i)]);
        preludeStart = i + 1;
      }
    } else if (ch === ";" && depth === 0) {
      preludeStart = i + 1;
    }
  }
  return rules;
}

function declarations(body: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) map.set(m[1], m[2].trim());
  return map;
}

const rules = topLevelRules(css);
const block = (selector: string) => {
  const rule = rules.find(([prelude]) => prelude.replace(/\s+/g, " ") === selector);
  assert.ok(rule, `tokens.css has a "${selector}" block`);
  return declarations(rule[1]);
};
const themes = { dark: block(":root, .dark"), light: block(".light") };

type Rgb = [number, number, number];

/** OKLCH to linear sRGB (Björn Ottosson's matrices), clamped to the sRGB gamut. */
function oklchToLinearSrgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb: Rgb = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return rgb.map((v) => Math.min(1, Math.max(0, v))) as Rgb;
}

const encode = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function resolve(theme: Map<string, string>, name: string, seen = new Set<string>()): string {
  const value = theme.get(name);
  assert.ok(value, `token ${name} is defined`);
  const ref = /^var\((--[a-z0-9-]+)\)$/.exec(value);
  if (!ref) return value;
  assert.ok(!seen.has(name), `token ${name} does not refer to itself`);
  seen.add(name);
  return resolve(theme, ref[1], seen);
}

function parseOklch(value: string): Rgb {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(value);
  assert.ok(m, `"${value}" is an opaque oklch() colour`);
  return oklchToLinearSrgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

const luminance = ([r, g, b]: Rgb) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
function ratio(theme: Map<string, string>, fg: string, bg: string) {
  const a = luminance(parseOklch(resolve(theme, fg)));
  const b = luminance(parseOklch(resolve(theme, bg)));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const SURFACES = ["--bg", "--bg-subtle", "--surface", "--surface-raised", "--surface-hover"];
const TEXT = ["--fg", "--fg-muted", "--fg-subtle", "--success-fg", "--warning-fg", "--danger-fg"];

const PAIRS: Array<[fg: string, bg: string, min: number]> = [
  ...TEXT.flatMap((fg) => SURFACES.map((bg): [string, string, number] => [fg, bg, 4.5])),
  ["--primary", "--bg", 4.5],
  ["--primary-fg", "--primary", 4.5],
  ["--primary-fg", "--primary-hover", 4.5],
  ["--focus", "--bg", 3],
  ["--focus", "--surface", 3],
  ...["--bg", "--surface", "--surface-raised", "--surface-hover"].map(
    (bg): [string, string, number] => ["--border-strong", bg, 3],
  ),
];

describe("OKLCH conversion", () => {
  test("matches known sRGB values", () => {
    const hex = (rgb: Rgb) => rgb.map((v) => Math.round(encode(v) * 255));
    assert.deepEqual(hex(oklchToLinearSrgb(1, 0, 0)), [255, 255, 255]);
    assert.deepEqual(hex(oklchToLinearSrgb(0, 0, 0)), [0, 0, 0]);
    assert.deepEqual(hex(oklchToLinearSrgb(0.627955, 0.257683, 29.2339)), [255, 0, 0]);
    assert.deepEqual(hex(oklchToLinearSrgb(0.519752, 0.176858, 142.4953)), [0, 128, 0]);
  });
});

for (const [name, theme] of Object.entries(themes)) {
  describe(`${name} theme contrast`, () => {
    for (const [fg, bg, min] of PAIRS) {
      test(`${fg} on ${bg} is at least ${min}:1`, () => {
        const r = ratio(theme, fg, bg);
        assert.ok(r >= min, `${fg} on ${bg} is ${r.toFixed(2)}:1, below ${min}:1`);
      });
    }

    test("defines --surface-hover", () => {
      assert.ok(theme.has("--surface-hover"));
    });
  });
}

describe("token file structure", () => {
  test("tokens.css holds the @theme inline block", () => {
    assert.ok(rules.some(([prelude]) => prelude === "@theme inline"));
  });
});
