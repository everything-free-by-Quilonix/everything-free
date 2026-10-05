import type { Metadata } from "next";

import { Container, PageHeader } from "@/components/ui/layout";
import { atlasGroups } from "@/features/categories/atlas-groups";
import { AtlasIndexFilter } from "@/features/categories/components/atlas-index-filter";
import { getFacets } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "All categories",
  description:
    "Every category in the Everything.Free library, grouped across everyday needs, education, creative work, AI, development, business, media and life.",
  path: "/categories",
});

/**
 * Category index: the Atlas Index at full size, with "Find a subject".
 *
 * Counts come from the facet computation over the whole library rather than a
 * separate query per category, so this page is one pass over the data regardless
 * of how many categories exist.
 *
 * Categories with no resources are still listed, with a zero count. The taxonomy
 * is the map of what this library intends to cover, and hiding the gaps would hide
 * exactly the information a contributor needs to decide where to help.
 *
 * Each group keeps its `id`, so the group links on category pages
 * (`/categories#{group}`) still land on it.
 */
export default async function CategoriesPage() {
  const facets = await getFacets({});

  return (
    <div className="pb-16">
      <PageHeader
        kicker="Index"
        title="Categories"
        description="Browse the library by topic. A category can appear under more than one heading where it genuinely belongs to both."
      />

      <Container className="pt-10">
        <AtlasIndexFilter groups={atlasGroups(facets.categories)} />
      </Container>
    </div>
  );
}
