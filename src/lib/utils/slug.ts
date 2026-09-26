/**
 * Slug helpers.
 *
 * `slugifyProductName` turns a paid product's display name into a URL segment
 * for the "free alternatives to X" pages. It must be stable: changing the
 * algorithm changes public URLs, so the rules here are intentionally boring.
 */
export function slugifyProductName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncates text at a word boundary, for meta descriptions and previews. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > maxLength * 0.6 ? lastSpace : maxLength).trimEnd()}…`;
}
