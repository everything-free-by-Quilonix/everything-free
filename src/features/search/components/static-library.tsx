import Link from "next/link";

import { Callout } from "@/components/ui/callout";
import { Container } from "@/components/ui/layout";
import { ResourceGrid } from "@/features/resources/components/resource-card";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

import { SearchBox } from "./search-box";

/**
 * The build-time rendering of `/resources`.
 *
 * Why this exists: `ResourceExplorer` reads the URL with `useSearchParams`, and in a
 * statically generated route Next.js cannot know the query string at build time, so
 * it writes only the nearest Suspense *fallback* into the HTML file. Whatever this
 * component renders is therefore exactly what a visitor without JavaScript sees, and
 * exactly what a search engine indexes for `/resources`.
 *
 * An earlier version used loading skeletons here, which meant the static page
 * contained no resources at all and showed placeholders forever with JavaScript off.
 * This renders the real, unfiltered library instead: every listable resource, in the
 * default order, as plain HTML.
 *
 * It deliberately shows everything without pagination. Paginated links would all
 * resolve to this same static file without JavaScript, so page 2 would silently show
 * page 1. At the current library size a complete list is honest and small; the point
 * at which it stops being small is the documented database migration trigger.
 *
 * Must not use `useSearchParams` or any component that does — it renders outside the
 * Suspense boundary, where that would fail the static build.
 */
export function StaticLibrary({ resources }: { resources: Resource[] }) {
  return (
    <>
      <div className="border-b border-border bg-bg-subtle py-8">
        <Container>
          <h1 className="font-serif text-3xl font-semibold">Browse free resources</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg-muted">
            Every entry states what “free” means for it, what the limits are, and which of its facts an official source
            confirms.
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBox size="md" label="Search free resources" />
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        <noscript>
          <Callout tone="warning" icon="info" title="Search and filters need JavaScript" className="mb-6">
            They run in your browser so this site needs no server. The full library is listed below, and every{" "}
            <Link href="/categories" className="text-fg underline underline-offset-2">
              category page
            </Link>{" "}
            works without JavaScript.
          </Callout>
        </noscript>

        <p className="text-sm text-fg-muted">
          {formatCount(resources.length)} {resources.length === 1 ? "resource" : "resources"}
          <span className="text-fg-subtle"> · most recently checked first</span>
        </p>

        <div className="mt-6">
          <ResourceGrid resources={resources} label="All resources" />
        </div>
      </Container>
    </>
  );
}
