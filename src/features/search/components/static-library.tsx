import Link from "next/link";

import { Callout } from "@/components/ui/callout";
import { Container } from "@/components/ui/layout";
import { plural } from "@/components/ui/count";
import { ResourceGrid } from "@/features/resources/components/resource-card";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

import { SearchBox } from "./search-box";

/**
 * The build-time rendering of `/resources`.
 *
 * Provides a clean static fallback for visitors without JavaScript and for search
 * engines indexing the full, unfiltered library.
 */
export function StaticLibrary({ resources }: { resources: Resource[] }) {
  return (
    <>
      <div className="border-b border-border bg-bg-subtle/60 py-8 sm:py-10">
        <Container>
          <div className="text-2xs font-semibold uppercase tracking-widest text-fg-subtle">
            RESOURCES
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            All free resources
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-fg-muted leading-relaxed">
            Browse the curated library of genuinely free software, tools, platforms and learning resources.
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBox
              size="md"
              variant="beam"
              placeholder="Search free resources, tools, and platforms..."
              label="Search free resources"
            />
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        <noscript>
          <Callout tone="neutral" icon={null} title="Search and filters need JavaScript" className="mb-6">
            They run in your browser so this site needs no server. The full library is listed below, and every{" "}
            <Link href="/categories" className="link-inline rounded-xs">
              category page
            </Link>{" "}
            works without JavaScript.
          </Callout>
        </noscript>

        <p className="text-sm text-fg-muted tabular-nums">
          <span className="font-semibold text-fg">{formatCount(resources.length)}</span>{" "}
          {plural(resources.length, "listing", "listings")}
          <span className="text-fg-subtle"> · most recently checked first</span>
        </p>

        <div className="mt-6">
          <ResourceGrid resources={resources} label="All resources" />
        </div>
      </Container>
    </>
  );
}

