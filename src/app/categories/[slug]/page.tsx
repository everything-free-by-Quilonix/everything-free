import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { categories, getCategoryBySlug, getCategoryGroup } from "@/config/categories";
import { ResourceGrid } from "@/features/resources/components/resource-card";
import { getResourcesByCategory } from "@/lib/repository";
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
    description: `${category.description} Every entry states its free status, limitations and when it was last verified.`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const results = await getResourcesByCategory(category.id, { perPage: 60, sort: "recently-verified" });
  const resources = results.items.map((match) => match.resource);
  const groups = category.groups.map(getCategoryGroup).filter(Boolean);

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

          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{category.name}</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{category.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-subtle">
            <span>
              {formatCount(results.total)} {results.total === 1 ? "resource" : "resources"}
            </span>
            {groups.length > 0 ? (
              <span className="flex items-center gap-2">
                Also under:
                {groups.map((group) => (
                  <Link
                    key={group!.id}
                    href={`/categories#${group!.id}`}
                    className="rounded underline underline-offset-2 hover:text-fg"
                  >
                    {group!.name}
                  </Link>
                ))}
              </span>
            ) : null}
          </div>
        </Container>
      </header>

      <Container className="pt-8">
        {resources.length > 0 ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-muted">Sorted by most recently verified.</p>
              <Link
                href={`/resources?category=${category.id}`}
                className={buttonClasses({ variant: "secondary", size: "sm" })}
              >
                <Icon name="filter" size={14} />
                Filter this category
              </Link>
            </div>

            <ResourceGrid resources={resources} label={`Free ${category.name} resources`} />
          </>
        ) : (
          <EmptyState
            icon="compass"
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
