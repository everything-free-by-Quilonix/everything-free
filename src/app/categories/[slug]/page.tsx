import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { plural } from "@/components/ui/count";
import { categories, getCategoriesInGroup, getCategoryBySlug, getCategoryGroup } from "@/config/categories";
import { RecordList } from "@/features/resources/components/resource-record";
import { getFacets, getResourcesByCategory } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo/structured-data";
import { formatCount } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Category not found",
      description: "This category does not exist.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Free ${category.name.toLowerCase()} resources`,
    description: `${category.description} Every entry states its free status, its limitations and how much of it has been checked.`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const results = await getResourcesByCategory(category.id, { perPage: 60, sort: "recently-verified" });
  const resources = results.items.map((match) => match.resource);
  const groups = category.groups.flatMap((id) => getCategoryGroup(id) ?? []);
  // Siblings in the same group(s), with the library-wide counts the Atlas Index
  // shows; subjects with no listings are left out of the line.
  const facets = await getFacets();
  const nearby = [...new Map(groups.flatMap((group) => getCategoriesInGroup(group.id)).map((c) => [c.id, c])).values()]
    .filter((sibling) => sibling.id !== category.id)
    .map((sibling) => ({ id: sibling.id, slug: sibling.slug, name: sibling.name, count: facets.categories[sibling.id] ?? 0 }))
    .filter((sibling) => sibling.count > 0);

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: category.name },
            ]}
          />

          {/* Chapter opening: the group as a running head, the subject as the title. */}
          {groups.length > 0 ? (
            <p className="kicker mt-6">
              {groups.map((group, index) => (
                <span key={group.id}>
                  {index > 0 ? " · " : null}
                  <Link
                    href={`/categories#${group.id}`}
                    className="inline-block rounded-xs hover:text-fg hover:underline pointer-coarse:py-2"
                  >
                    {group.name}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
          <h1 className="mt-3 font-serif text-3xl font-semibold">{category.name}</h1>
          <p className="mt-3 max-w-(--measure-standfirst) text-lg leading-relaxed text-fg-muted">
            {category.description}
          </p>
          <p className="mt-4 text-sm text-fg-subtle tabular-nums">
            {formatCount(results.total)} {plural(results.total, "listing", "listings")}
          </p>

          {nearby.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
              <span className="text-fg-subtle">Nearby subjects:</span>
              <ul aria-label="Nearby subjects" className="contents">
                {nearby.map((sibling, index) => (
                  <li key={sibling.id}>
                    <Link
                      href={`/categories/${sibling.slug}`}
                      className="rounded-xs text-fg-muted underline-offset-[0.2em] transition-colors hover:text-fg hover:underline"
                    >
                      {sibling.name}
                    </Link>{" "}
                    <span className="text-fg-subtle tabular-nums">
                      {formatCount(sibling.count)}
                      <span className="sr-only"> {plural(sibling.count, "listing", "listings")}</span>
                    </span>
                    {index < nearby.length - 1 ? (
                      <span aria-hidden="true" className="pl-2 text-fg-subtle">
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </header>

      <Container className="pt-8">
        {resources.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-muted">Sorted by most recently checked.</p>
              <Link
                href={`/resources?category=${category.id}`}
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                <Icon name="filter" size={14} />
                Filter this category
              </Link>
            </div>

            <RecordList layout="list" resources={resources} label={`Free ${category.name} resources`} />
          </>
        ) : (
          <EmptyState
            title={`Nothing in ${category.name} yet`}
            description={
              <>
                <p>
                  This category is part of the library&rsquo;s map but has no entries so far. Rather than filling it with
                  weak suggestions, it stays empty until something genuinely useful is added.
                </p>
                <p className="mt-2 text-fg-subtle">If you know a good free resource for this, it is a gap worth filling.</p>
              </>
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/submit" className={buttonClasses({ variant: "primary" })}>
                  <Icon name="plus" size={16} />
                  Submit a resource
                </Link>
                <Link href="/categories" className={buttonClasses({ variant: "secondary" })}>
                  Other categories
                </Link>
              </div>
            }
          />
        )}
      </Container>

      <JsonLdScript
        data={[
          collectionSchema({
            name: `Free ${category.name} resources`,
            description: category.description,
            path: `/categories/${category.slug}`,
            resources,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: category.name, path: `/categories/${category.slug}` },
          ]),
        ]}
      />
    </div>
  );
}
