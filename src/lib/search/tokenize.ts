/**
 * Text normalisation for search.
 *
 * Kept deliberately small and dependency-free. The aim is not linguistic
 * sophistication but predictability: the same query should always produce the
 * same tokens, and the rules should be simple enough to reason about when a
 * result looks wrong.
 */

/**
 * Lowercases, strips diacritics and collapses punctuation to spaces.
 *
 * Diacritic folding means "précis" matches "precis", which matters for a library
 * that is meant to serve a global audience.
 */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Words carrying no discriminating power in this domain.
 *
 * `free` is in here for a specific reason: every resource in the library is
 * free, so the word appears in most descriptions and matching on it ranks
 * everything equally. Stripping it makes "free video editor" behave like
 * "video editor", which is what the user meant. `onlyStopwords` below handles
 * the edge case of a query that consists of nothing else.
 */
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "best",
  "but",
  "by",
  "can",
  "do",
  "for",
  "free",
  "from",
  "get",
  "good",
  "how",
  "i",
  "in",
  "is",
  "it",
  "looking",
  "make",
  "me",
  "my",
  "need",
  "of",
  "on",
  "or",
  "please",
  "so",
  "some",
  "something",
  "that",
  "the",
  "there",
  "thing",
  "this",
  "to",
  "use",
  "using",
  "want",
  "with",
  "without",
  "you",
  "your",
]);

/**
 * Very conservative singularisation.
 *
 * Only handles the cases that actually cause misses in this library — plural
 * category and type names such as "fonts", "courses", "editors". It deliberately
 * does not attempt real stemming, which would create surprising false matches.
 */
function singularize(term: string): string {
  if (term.length <= 3) return term;
  if (term.endsWith("ies")) return `${term.slice(0, -3)}y`;
  if (term.endsWith("ses") || term.endsWith("xes") || term.endsWith("ches") || term.endsWith("shes")) {
    return term.slice(0, -2);
  }
  if (term.endsWith("s") && !term.endsWith("ss") && !term.endsWith("us")) return term.slice(0, -1);
  return term;
}

/**
 * One word the user typed, plus the forms that should count as matching it.
 *
 * Variants exist so that singular and plural are *alternatives* for a single
 * term, not two separate requirements. Treating them as separate terms was a bug:
 * searching "students" then demanded that a resource contain both "students" and
 * "student", which almost nothing does, and AND-matching collapsed to nothing.
 */
export interface QueryTerm {
  /** The form the user typed, used in match explanations. */
  label: string;
  /** Any of these matching satisfies the term. */
  variants: string[];
}

export interface Tokenized {
  terms: QueryTerm[];
  /** True when the query contained only stopwords, so they had to be kept. */
  onlyStopwords: boolean;
}

function toTerm(word: string): QueryTerm {
  const variants = [word];
  const singular = singularize(word);
  if (singular !== word && singular.length > 2) variants.push(singular);
  return { label: word, variants };
}

export function tokenize(input: string): Tokenized {
  const normalized = normalizeText(input);
  if (normalized.length === 0) return { terms: [], onlyStopwords: false };

  const raw = normalized.split(" ").filter(Boolean);
  const meaningful = raw.filter((word) => !STOPWORDS.has(word) && word.length > 1);

  // "free" alone is a legitimate query; fall back to the raw words rather than
  // returning nothing and showing an empty result set.
  const words = meaningful.length > 0 ? meaningful : raw;
  const seen = new Set<string>();
  const terms: QueryTerm[] = [];

  for (const word of words) {
    if (seen.has(word)) continue;
    seen.add(word);
    terms.push(toTerm(word));
  }

  return { terms, onlyStopwords: meaningful.length === 0 };
}

/** Whether `haystack` contains `term` on a word boundary rather than mid-word. */
export function containsTerm(haystack: string, term: string): boolean {
  const normalized = normalizeText(haystack);
  if (!normalized.includes(term)) return false;

  // Cheap boundary check that avoids building a RegExp per field per term.
  let index = normalized.indexOf(term);
  while (index !== -1) {
    const before = index === 0 ? " " : normalized[index - 1];
    const isStart = before === " ";
    if (isStart) return true;
    index = normalized.indexOf(term, index + 1);
  }
  return false;
}
