import { categoryName } from "@/config/categories";
import { getResourceType } from "@/config/resource-types";
import type { Resource, ResourceMatch } from "@/types/resource";
import { containsTerm, normalizeText, tokenize, type QueryTerm } from "./tokenize";

/**
 * Relevance scoring.
 *
 * Field weights are ordered by how strongly a match in that field predicts that
 * the user meant this resource. A name match is close to certain. An
 * `alternativeTo` match is weighted almost as highly on purpose: someone typing
 * "photoshop" into a library of free resources is looking for a replacement for
 * Photoshop, and the resource that says so should outrank one that merely
 * mentions it in prose.
 *
 * Every scored field also produces a `matchReason`, because the product
 * requirement is that results explain themselves. Reasons are generated from the
 * same pass that scores, so an explanation can never disagree with the ranking.
 */

interface FieldRule {
  /** Text to search. */
  value: string;
  weight: number;
  /** Builds the user-facing explanation. */
  reason: (term: string) => string;
  /** Extra weight when the whole field equals the term. */
  exactBonus?: number;
}

function fieldsFor(resource: Resource): FieldRule[] {
  const categoryLabels = [resource.category, ...resource.subcategories].map(categoryName).join(" ");
  const typeLabel = getResourceType(resource.resourceType).label;

  return [
    {
      value: resource.name,
      weight: 100,
      exactBonus: 80,
      reason: (term) => `Name matches “${term}”`,
    },
    {
      value: resource.alternativeTo.join(" "),
      weight: 70,
      reason: (term) => `Listed as a free alternative to ${titleCase(term)}`,
    },
    {
      value: resource.tags.join(" "),
      weight: 34,
      reason: (term) => `Tagged “${term}”`,
    },
    {
      value: categoryLabels,
      weight: 28,
      reason: (term) => `Filed under ${titleCase(term)}`,
    },
    {
      value: typeLabel,
      weight: 24,
      reason: () => `Resource type is ${typeLabel}`,
    },
    {
      value: resource.shortDescription,
      weight: 20,
      reason: (term) => `Description mentions “${term}”`,
    },
    {
      value: resource.features.join(" "),
      weight: 14,
      reason: (term) => `Feature list mentions “${term}”`,
    },
    {
      value: resource.longDescription,
      weight: 8,
      reason: (term) => `Overview mentions “${term}”`,
    },
    {
      value: resource.whyListed,
      weight: 6,
      reason: (term) => `Listed because it mentions “${term}”`,
    },
    {
      value: resource.license ?? "",
      weight: 5,
      reason: (term) => `Licence mentions “${term}”`,
    },
  ];
}

function titleCase(term: string): string {
  return term.charAt(0).toUpperCase() + term.slice(1);
}

interface ScoreResult {
  score: number;
  reasons: string[];
  /** How many of the query's terms matched at least one field. */
  matchedTermCount: number;
}

function scoreResource(resource: Resource, terms: QueryTerm[]): ScoreResult {
  const fields = fieldsFor(resource);
  const reasons: string[] = [];
  const seenReasons = new Set<string>();
  let score = 0;
  let matchedTermCount = 0;

  for (const term of terms) {
    let termMatched = false;

    // Fields are ordered by weight, so the first field that matches any variant
    // is both the best score and the best explanation for this term.
    for (const field of fields) {
      if (field.value.length === 0) continue;

      const matchedVariant = term.variants.find((variant) => containsTerm(field.value, variant));
      if (!matchedVariant) continue;

      score += field.weight;
      if (field.exactBonus && normalizeText(field.value) === matchedVariant) {
        score += field.exactBonus;
      }
      termMatched = true;

      const reason = field.reason(term.label);
      if (!seenReasons.has(reason) && reasons.length < 3) {
        seenReasons.add(reason);
        reasons.push(reason);
      }
      break;
    }

    if (termMatched) matchedTermCount += 1;
  }

  return { score, reasons, matchedTermCount };
}

/**
 * Below this many strict matches, partial matches are included too.
 *
 * Strict all-terms matching gives precise results when the library has enough
 * depth on a topic, and unhelpfully thin ones when it does not. "free apps for
 * students" strictly requires both "app" and "student" in the same entry, which
 * excludes plenty of resources that are obviously relevant to a student.
 *
 * Rather than choosing precision or recall globally, the threshold switches: a
 * query with a healthy strict result set keeps it, and a sparse one widens to
 * partial matches ranked below the exact ones. Callers are told which happened so
 * the UI can say so.
 */
const MIN_STRICT_RESULTS = 3;

/**
 * Ranks resources against a free-text query.
 *
 * Results are always ordered by how many query terms matched before score, so
 * entries matching everything sit above entries matching one thing — whether or
 * not partial matches were admitted.
 */
export function rankResources(
  resources: readonly Resource[],
  rawQuery: string,
): { matches: ResourceMatch[]; relaxed: boolean; terms: QueryTerm[] } {
  const { terms } = tokenize(rawQuery);

  if (terms.length === 0) {
    return { matches: resources.map((resource) => ({ resource, score: 0, matchReasons: [] })), relaxed: false, terms };
  }

  const scored = resources.map((resource) => ({ resource, ...scoreResource(resource, terms) }));

  const anyMatch = scored.filter((entry) => entry.score > 0);
  const strict = anyMatch.filter((entry) => entry.matchedTermCount === terms.length);

  // With a single term, strict and partial are the same set, so nothing is relaxed.
  const relaxed = terms.length > 1 && strict.length < MIN_STRICT_RESULTS && anyMatch.length > strict.length;
  const chosen = relaxed ? anyMatch : strict;

  const matches = chosen
    .sort(
      (a, b) =>
        b.matchedTermCount - a.matchedTermCount ||
        b.score - a.score ||
        a.resource.name.localeCompare(b.resource.name),
    )
    .map(({ resource, score, reasons }) => ({ resource, score, matchReasons: reasons }));

  return { matches, relaxed, terms };
}
