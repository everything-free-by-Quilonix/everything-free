import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { audiences, getAudience } from "@/config/audiences";
import { getCategory } from "@/config/categories";
import { ResourceGrid } from "@/features/resources/components/resource-card";
import { getResources } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo/structured-data";
import { formatCount } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ audience: string }>;
}

export function generateStaticParams() {
  return audiences.map((audience) => ({ audience: audience.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience: slug } = await params;
  const audience = getAudience(slug);

  if (!audience) {
    return buildMetadata({
      title: "Not found",
      description: "This audience does not exist.",
      path: `/for/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: audience.name,
    description: `${audience.description} Free status, limitations and verification stated for every entry.`,
    path: `/for/${audience.slug}`,
  });
}

/**
 * Audience page.
 *
 * Resolves to an ordinary category query rather than a hand-maintained list. That
 * is what keeps these pages honest as the library grows: they cannot go stale
 * relative to the categories that feed them, because they *are* those categories.
 */
export default async function AudiencePage({ params }: PageProps) {
  const { audience: slug } = await params;
  const audience = getAudience(slug);

  if (!audience) notFound();

  const results = await getResources({
    categories: audience.categoryIds,
    perPage: 60,
    sort: "recently-verified",
  });

  const resources = results.items.map((match) => match.resource);
  const categories = audience.categoryIds.map(getCategory).filter(Boolean);

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: audience.name }]} />

          <div className="mt-6 flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-fg-muted"
            >
              <Icon name={audience.icon} size={22} />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl font-semibold">{audience.name}</h1>
              <p className="mt-2 max-w-2xl leading-relaxed text-fg-muted">{audience.description}</p>
              <p className="mt-4 text-sm text-fg-subtle">
                {formatCount(results.total)} {results.total === 1 ? "resource" : "resources"} across{" "}
                {categories.length} categories
              </p>
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <li key={category!.id}>
                <Link
                  href={`/categories/${category!.slug}`}
                  className="inline-block rounded-xs border border-border bg-surface px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                >
                  {category!.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </header>

      <Container className="pt-8">
        {resources.length > 0 ? (
          <ResourceGrid resources={resources} label={`Resources ${audience.name.toLowerCase()}`} />
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="This view draws from the categories listed above. It fills in as those categories grow."
            action={
              <Link href="/submit" className={buttonClasses({ variant: "primary" })}>
                Submit a resource
              </Link>
            }
          />
        )}
      </Container>

      <JsonLdScript
        data={[
          collectionSchema({
            name: audience.name,
            description: audience.description,
            path: `/for/${audience.slug}`,
            resources,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: audience.name, path: `/for/${audience.slug}` },
          ]),
        ]}
      />
    </div>
  );
}
