import { Suspense } from "react";
import type { Metadata } from "next";

import { plural } from "@/components/ui/count";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { formatList } from "@/config/media";
import { MediaGrid } from "@/features/entertainment/components/media-card";
import { MediaExplorer } from "@/features/entertainment/components/media-explorer";
import { getEntertainmentResources, labelsFor } from "@/features/entertainment/data";
import { emptyMediaQuery, runMediaQuery } from "@/lib/entertainment/query";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCount } from "@/lib/utils/format";

export const metadata: Metadata = buildMetadata({
  title: "Browse free entertainment",
  description:
    "Search and filter every free entertainment listing — films, series, anime, games, music, podcasts, audiobooks, comics and culture — by access model, language, device and licence.",
  path: "/entertainment/browse",
});

export default async function BrowseEntertainmentPage() {
  const resources = await getEntertainmentResources();
  const labelsBySlug = labelsFor(resources);
  const initial = runMediaQuery(resources, emptyMediaQuery()).items;
  const formats = formatList.map((f) => f.id);

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Entertainment", href: "/entertainment" }, { label: "Browse" }]} />
          <h1 className="mt-6 font-serif text-3xl font-semibold">All free entertainment</h1>
          <p className="mt-3 max-w-(--measure-standfirst) text-lg leading-relaxed text-fg-muted">
            Every entertainment listing in one place. Filters match recorded facts only: a listing whose region, licence or
            account requirement nobody has confirmed is left out of that filter rather than guessed into it.
          </p>
          <p className="mt-4 text-sm text-fg-subtle tabular-nums">
            {formatCount(resources.length)} {plural(resources.length, "listing", "listings")}
          </p>
        </Container>
      </header>
      <Container className="pt-8">
        <Suspense fallback={<MediaGrid resources={initial} labelsBySlug={labelsBySlug} label="Free entertainment" />}>
          <MediaExplorer resources={resources} formats={formats} labelsBySlug={labelsBySlug} label="Free entertainment" />
        </Suspense>
      </Container>
    </div>
  );
}
