import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { Container, PageHeader } from "@/components/ui/layout";
import { categoryGroups, getCategoriesInGroup } from "@/config/categories";
import { CategoryLink } from "@/features/categories/components/category-cards";
import { getFacets } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "All categories",
  description:
    "Every category in the Everything.Free library, grouped across everyday needs, education, creative work, AI, development, business, media and life.",
  path: "/categories",
});

/**
 * Category index.
 *
 * Counts come from the facet computation over the whole library rather than a
 * separate query per category, so this page is one pass over the data regardless
 * of how many categories exist.
 *
 * Categories with no resources are still listed, with a zero count. The taxonomy
 * is the map of what this library intends to cover, and hiding the gaps would hide
 * exactly the information a contributor needs to decide where to help.
 */
export default async function CategoriesPage() {
  const facets = await getFacets({});

  return (
    <div className="pb-16">
      <PageHeader
        title="Categories"
        description="Browse the library by topic. A category can appear under more than one heading where it genuinely belongs to both."
      />

      <Container className="pt-10">
        <div className="flex flex-col gap-14">
          {categoryGroups.map((group) => {
            const categories = getCategoriesInGroup(group.id);

            return (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-24">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-raised text-fg-muted"
                  >
                    <Icon name={group.icon} size={19} />
                  </span>
                  <div>
                    <h2 id={`${group.id}-heading`} className="font-display text-xl font-semibold tracking-tight">
                      {group.name}
                    </h2>
                    <p className="mt-1 text-sm text-fg-muted">{group.description}</p>
                  </div>
                </div>

                <ul className="mt-5 grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <CategoryLink category={category} count={facets.categories[category.id] ?? 0} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
