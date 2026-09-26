import { Suspense } from "react";
import type { Metadata } from "next";

import { ResourceExplorer } from "@/features/search/components/resource-explorer";
import { StaticLibrary } from "@/features/search/components/static-library";
import { getAllResourcesForClient } from "@/lib/repository";
import { queryResources } from "@/lib/search/run-search";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * The browse and search route.
 *
 * Statically generated, in two layers:
 *
 * 1. `StaticLibrary` is rendered into the HTML file at build time — the complete,
 *    unfiltered library as plain markup. This is what search engines index and
 *    what visitors without JavaScript get.
 * 2. `ResourceExplorer` takes over in the browser, reads the query string, and does
 *    the filtering and ranking there through the same `runSearch` the server uses.
 *
 * Previously this route read `searchParams` on the server, which forced per-request
 * rendering and therefore a running server. Metadata is now fixed rather than
 * per-query; query variants all share this page's canonical URL.
 */
export const metadata: Metadata = buildMetadata({
  title: "Browse free resources",
  description:
    "Browse the full library of free apps, websites, software, tools and learning resources. Filter by free status, platform, licence and whether an account is needed.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = [...(await getAllResourcesForClient())];

  // The same default ordering the explorer uses when no query is present, so the
  // page does not visibly reshuffle when JavaScript takes over.
  const defaultOrder = queryResources(resources, { perPage: resources.length || 1 }).items.map(
    (match) => match.resource,
  );

  return (
    <div className="pb-16">
      {/* `useSearchParams` inside the explorer means the build writes this fallback
          into the HTML. It is the real library, not a loading skeleton. */}
      <Suspense fallback={<StaticLibrary resources={defaultOrder} />}>
        <ResourceExplorer resources={resources} />
      </Suspense>
    </div>
  );
}
