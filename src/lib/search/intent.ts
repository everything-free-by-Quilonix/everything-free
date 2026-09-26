import type { ResourceQuery } from "@/types/search";
import { normalizeText } from "./tokenize";

/**
 * Deterministic intent extraction.
 *
 * The product goal is natural-language search — "I need a free tool to make a
 * professional résumé", "free AI voice generator without a credit card". Reaching
 * that with a model is a later phase. What is genuinely useful now, and cannot be
 * wrong in surprising ways, is recognising the *constraints* people state in
 * plain language and turning them into the same filters the sidebar sets.
 *
 * Every rule here is a visible phrase match. When a rule fires, the UI tells the
 * user which filter was applied and lets them remove it. Nothing is inferred
 * silently, and there is no model call, so results are reproducible.
 *
 * This is the seam a model-based parser plugs into later: it would return the
 * same `InferredIntent` shape and the rest of the pipeline would not change.
 */

export interface InferredFilter {
  /** Which `ResourceQuery` key this sets. */
  key: keyof ResourceQuery;
  /** Human sentence shown to the user, e.g. "Open source only". */
  label: string;
  /** The phrase in their query that triggered it. */
  matchedPhrase: string;
}

export interface InferredIntent {
  /** The query with recognised constraint phrases removed. */
  residualQuery: string;
  /** Filters to merge into the query, unless the user already set them. */
  filters: Partial<ResourceQuery>;
  /** Explanations, for display. */
  applied: InferredFilter[];
}

interface Rule {
  /** Phrases that trigger the rule, in normalised form. */
  phrases: string[];
  key: keyof ResourceQuery;
  label: string;
  apply: (query: Partial<ResourceQuery>) => void;
}

const RULES: Rule[] = [
  {
    phrases: ["without a credit card", "without credit card", "no credit card", "no card required"],
    key: "noCreditCardOnly",
    label: "No credit card required",
    apply: (q) => {
      q.noCreditCardOnly = true;
    },
  },
  {
    phrases: ["without signing up", "without an account", "without account", "no signup", "no sign up", "no account", "without registration"],
    key: "noAccountOnly",
    label: "No account required",
    apply: (q) => {
      q.noAccountOnly = true;
    },
  },
  {
    phrases: ["open source", "opensource", "foss"],
    key: "openSourceOnly",
    label: "Open source only",
    apply: (q) => {
      q.openSourceOnly = true;
    },
  },
  {
    phrases: ["for commercial use", "commercial use", "for client work", "for my business", "commercially"],
    key: "commercialUseOnly",
    label: "Commercial use permitted",
    apply: (q) => {
      q.commercialUseOnly = true;
    },
  },
  {
    phrases: ["self hosted", "self host", "self hostable", "selfhosted"],
    key: "platforms",
    label: "Self-hostable",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "SELF_HOSTED" as const])];
    },
  },
  {
    phrases: ["in the browser", "browser based", "no install", "without installing", "without downloading", "online"],
    key: "platforms",
    label: "Runs in a browser",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "BROWSER" as const])];
    },
  },
  {
    phrases: ["for android", "on android", "android"],
    key: "platforms",
    label: "Available on Android",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "ANDROID" as const])];
    },
  },
  {
    phrases: ["for iphone", "for ios", "on ios", "on iphone", "for ipad"],
    key: "platforms",
    label: "Available on iOS",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "IOS" as const])];
    },
  },
  {
    phrases: ["for linux", "on linux"],
    key: "platforms",
    label: "Available on Linux",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "LINUX" as const])];
    },
  },
  {
    phrases: ["for windows", "on windows"],
    key: "platforms",
    label: "Available on Windows",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "WINDOWS" as const])];
    },
  },
  {
    phrases: ["for mac", "on mac", "for macos", "on macos"],
    key: "platforms",
    label: "Available on macOS",
    apply: (q) => {
      q.platforms = [...new Set([...(q.platforms ?? []), "MACOS" as const])];
    },
  },
];

/**
 * Matches "alternative to X" / "replacement for X" and captures X.
 *
 * Anchored at the end of the phrase because the product name always follows.
 */
const ALTERNATIVE_PATTERNS = [
  /\balternatives? (?:to|for) ([a-z0-9 .+#]+)$/,
  /\breplacements? for ([a-z0-9 .+#]+)$/,
  /\binstead of ([a-z0-9 .+#]+)$/,
  /\blike ([a-z0-9 .+#]+) but free$/,
];

/**
 * Extracts constraints from a natural-language query.
 *
 * `explicit` holds filters the user set directly through the UI. Those always
 * win: if someone ticked a box, an inferred rule must not override it.
 */
export function inferIntent(rawQuery: string, explicit: Partial<ResourceQuery> = {}): InferredIntent {
  const normalized = normalizeText(rawQuery);
  if (normalized.length === 0) {
    return { residualQuery: "", filters: {}, applied: [] };
  }

  let residual = ` ${normalized} `;
  const filters: Partial<ResourceQuery> = {};
  const applied: InferredFilter[] = [];

  for (const pattern of ALTERNATIVE_PATTERNS) {
    const match = normalized.match(pattern);
    if (!match) continue;
    const target = match[1].trim();
    if (target.length < 2) continue;

    if (explicit.alternativeTo === undefined) {
      filters.alternativeTo = target;
      applied.push({
        key: "alternativeTo",
        label: `Free alternatives to ${target}`,
        matchedPhrase: match[0],
      });
    }
    // Keep the product name as a search term — it also appears in
    // `alternativeTo` lists and helps ranking — but drop the framing words.
    residual = residual.replace(match[0], ` ${target} `);
    break;
  }

  for (const rule of RULES) {
    // Longest phrase first so "no sign up" is not shadowed by a shorter variant.
    const phrase = [...rule.phrases].sort((a, b) => b.length - a.length).find((p) => residual.includes(` ${p} `));
    if (!phrase) continue;

    // Respect an explicit user choice rather than silently reasserting it.
    const alreadySet = explicit[rule.key] !== undefined;
    residual = residual.replace(` ${phrase} `, " ");

    if (alreadySet) continue;

    rule.apply(filters);
    applied.push({ key: rule.key, label: rule.label, matchedPhrase: phrase });
  }

  return {
    residualQuery: residual.replace(/\s+/g, " ").trim(),
    filters,
    applied,
  };
}
