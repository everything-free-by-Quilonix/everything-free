import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { JsonLdScript } from "@/components/seo/json-ld";
import { Callout } from "@/components/ui/callout";
import { countNoun } from "@/components/ui/count";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { collections } from "@/data/collections";
import { ResourceRecord } from "@/features/resources/components/resource-record";
import { getCollectionBySlug, getCollectionResources } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo/structured-data";
import { formatFullDate } from "@/lib/utils/date";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return buildMetadata({
      title: "Collection not found",
      description: "This collection does not exist.",
      path: `/collections/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: collection.name,
    description: collection.shortDescription,
    path: `/collections/${collection.slug}`,
    type: "article",
    modifiedTime: collection.updatedAt,
  });
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

  const resources = await getCollectionResources(collection);

  return (
    <article className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: collection.name },
            ]}
          />

          {/* Chapter opening: a running head, the serif title, the standfirst, the count. */}
          <p className="kicker mt-6">Collection</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">{collection.name}</h1>
          <p className="mt-3 max-w-(--measure-standfirst) text-lg leading-relaxed text-fg-muted">
            {collection.longDescription}
          </p>

          <p className="mt-4 text-sm text-fg-subtle tabular-nums">
            {countNoun(resources.length, "listing", "listings")} · Updated{" "}
            <time dateTime={collection.updatedAt}>{formatFullDate(collection.updatedAt)}</time>
          </p>
        </Container>
      </header>

      <Container className="pt-8">
        <Callout tone="neutral" icon={null} title="How these were chosen" className="mb-8">
          <p>{collection.rationale}</p>
          <p className="mt-2" data-testid="collection-evidence-note">
            A collection is chosen from what each listing records. That is not the same as each fact being confirmed:
            every card below says which of its facts an official source has confirmed and which have not been checked.
          </p>
        </Callout>

        {/* Ordered list: the sequence is deliberate — it follows the order you
            would actually use these in. */}
        <ol className="record-list" data-layout="list">
          {resources.map((resource, index) => (
            <li key={resource.slug}>
              <p className="kicker px-4 pt-4 tabular-nums">
                Step {index + 1}
                <span className="sr-only">: {resource.name}</span>
              </p>
              <ResourceRecord resource={resource} />
            </li>
          ))}
        </ol>
      </Container>

      <JsonLdScript
        data={[
          collectionSchema({
            name: collection.name,
            description: collection.shortDescription,
            path: `/collections/${collection.slug}`,
            resources,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: collection.name, path: `/collections/${collection.slug}` },
          ]),
        ]}
      />
    </article>
  );
}
