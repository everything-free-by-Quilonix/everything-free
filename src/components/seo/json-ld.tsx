import type { JsonLd } from "@/lib/seo/structured-data";

/**
 * Embeds JSON-LD structured data.
 *
 * `<` is escaped in the serialised output. Without that, a `</script>` sequence
 * appearing inside any data field — a licence note, a limitation, anything
 * contributor-supplied — would terminate the script element early and inject
 * markup into the page. This is the one place untrusted-ish strings reach a raw
 * `dangerouslySetInnerHTML`, so the escaping lives here rather than at call sites.
 */
export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
