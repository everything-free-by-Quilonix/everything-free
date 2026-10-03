import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { Container, PageHeader } from "@/components/ui/layout";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { getCollections } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Collections",
  description:
    "Curated sets of free resources that solve one problem together — replacing a creative subscription, building a video pipeline, or keeping your data on your own machine.",
  path: "/collections",
});

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="pb-16">
      <PageHeader
        title="Collections"
        description="Groups of resources chosen to work together on one job. Each collection states the basis for its selection, because a curated list without a stated rationale is just an opinion."
      />

      <Container className="pt-10">
        <Callout tone="neutral" icon="info" className="mb-8">
          Collections are editorial. They are not ranked, measured or sponsored, and being in one is not an endorsement
          over anything left out.
        </Callout>

        {collections.length > 0 ? (
          <ul className="grid list-none border-t border-rule sm:grid-cols-2 sm:gap-x-8">
            {collections.map((collection) => (
              <li key={collection.slug} className="border-b border-rule">
                <CollectionCard collection={collection} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No collections yet"
            description="Collections are added when there is a real problem worth solving with a specific set of resources."
          />
        )}
      </Container>
    </div>
  );
}
