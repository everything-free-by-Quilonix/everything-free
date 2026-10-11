import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { JsonLdScript } from "@/components/seo/json-ld";
import { plural } from "@/components/ui/count";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { getShelf, MIN_SHELF_LISTINGS, shelves } from "@/config/media";
import { MediaGrid } from "@/features/entertainment/components/media-card";
import { MediaExplorer } from "@/features/entertainment/components/media-explorer";
import { getEntertainmentResources, labelsFor } from "@/features/entertainment/data";
import { runMediaQuery, emptyMediaQuery } from "@/lib/entertainment/query";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo/structured-data";
import { formatCount } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ shelf: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return shelves.map((shelf) => ({ shelf: shelf.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shelf: slug } = await params;
  const shelf = getShelf(slug);
  if (!shelf) return buildMetadata({ title: "Not found", description: "", path: `/entertainment/${slug}`, noIndex: true });
  const count = (await getEntertainmentResources(shelf.slug)).length;
  return buildMetadata({
    title: `Free ${shelf.name.toLowerCase()}`,
    description: shelf.description,
    path: `/entertainment/${shelf.slug}`,
    noIndex: count < MIN_SHELF_LISTINGS,
  });
}

export default async function ShelfPage({ params }: PageProps) {
  const { shelf: slug } = await params;
  const shelf = getShelf(slug);
  if (!shelf) notFound();

  const resources = await getEntertainmentResources(shelf.slug);
  const labelsBySlug = labelsFor(resources);
  // The order the explorer shows with no filters, so hydration does not reshuffle.
  const initial = runMediaQuery(resources, emptyMediaQuery()).items;

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Entertainment", href: "/entertainment" },
              { label: shelf.name },
            ]}
          />
          <h1 className="mt-6 font-serif text-3xl font-semibold">{shelf.name}</h1>
          <p className="mt-3 max-w-(--measure-standfirst) text-lg leading-relaxed text-fg-muted">{shelf.description}</p>
          <p className="mt-4 text-sm text-fg-subtle tabular-nums">
            {formatCount(resources.length)} {plural(resources.length, "listing", "listings")} · every one links to the
            provider&rsquo;s own site
          </p>
          <nav aria-label="Other shelves" className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {shelves
              .filter((other) => other.slug !== shelf.slug)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/entertainment/${other.slug}`}
                  className="rounded-xs text-fg-muted underline-offset-[0.2em] hover:text-fg hover:underline pointer-coarse:py-2"
                >
                  {other.name}
                </Link>
              ))}
          </nav>
        </Container>
      </header>

      <Container className="pt-8">
        {resources.length > 0 && resources.length < MIN_SHELF_LISTINGS ? (
          <p className="mb-6 max-w-(--measure-standfirst) rounded-sm border border-dashed border-border px-4 py-3 text-sm text-fg-muted">
            A developing collection: only {formatCount(resources.length)} {plural(resources.length, "listing has", "listings have")}{" "}
            had their free model read on the provider&rsquo;s own pages so far. Candidates still being checked are in the research
            backlog rather than listed here as guesses.
          </p>
        ) : null}
        {resources.length === 0 ? (
          <p className="text-fg-muted">
            This shelf is still being researched. Nothing is listed until its free model has been read on the provider&rsquo;s own
            pages.
          </p>
        ) : (
          <Suspense fallback={<MediaGrid resources={initial} labelsBySlug={labelsBySlug} label={shelf.name} />}>
            <MediaExplorer resources={resources} formats={shelf.formats} labelsBySlug={labelsBySlug} label={shelf.name} />
          </Suspense>
        )}
      </Container>

      <JsonLdScript
        data={[
          collectionSchema({
            name: `Free ${shelf.name}`,
            description: shelf.description,
            path: `/entertainment/${shelf.slug}`,
            resources,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Entertainment", path: "/entertainment" },
            { name: shelf.name, path: `/entertainment/${shelf.slug}` },
          ]),
        ]}
      />
    </div>
  );
}
