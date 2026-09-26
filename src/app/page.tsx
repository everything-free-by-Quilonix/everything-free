import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { Container, Section, SectionLink } from "@/components/ui/layout";
import { audiences } from "@/config/audiences";
import { categoryGroups } from "@/config/categories";
import { site } from "@/config/site";
import { availableTools, tools } from "@/config/tools";
import { CategoryGroupCard } from "@/features/categories/components/category-cards";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { Hero } from "@/features/home/components/hero";
import { ResourceGrid } from "@/features/resources/components/resource-card";
import { ToolCard } from "@/features/tools/components/tool-card";
import {
  getAlternativeTargets,
  getCollections,
  getRecentlyVerified,
  getResourceCount,
  getSpotlightResources,
} from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.shortDescription}`,
  description: site.description,
  path: "/",
});

/**
 * Homepage.
 *
 * Every section reads from the repository and handles an empty result honestly.
 * None of them are padded with invented entries to look fuller — if a section has
 * nothing to show, it says what would fill it and how to contribute.
 */
export default async function HomePage() {
  const [resourceCount, spotlight, recentlyVerified, collections, alternativeTargets] = await Promise.all([
    getResourceCount(),
    getSpotlightResources(6),
    getRecentlyVerified(6),
    getCollections(),
    getAlternativeTargets(),
  ]);

  const topAlternatives = alternativeTargets.slice(0, 10);

  return (
    <>
      <Hero resourceCount={resourceCount} toolCount={availableTools.length} />

      <Container>
        {/* ---------------------------------------------------- categories */}
        <Section
          id="categories"
          title="Browse by category"
          description="Eight areas covering everyday needs, study, creative work, AI, development, business, media and life."
          action={<SectionLink href="/categories">All categories</SectionLink>}
        >
          <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryGroups.map((group) => (
              <li key={group.id} className="flex">
                <CategoryGroupCard group={group} />
              </li>
            ))}
          </ul>
        </Section>

        {/* ----------------------------------------------------- spotlight */}
        <Section
          id="spotlight"
          // "Popular" would imply measured demand. No usage is tracked, so the
          // heading says what this actually is: a selection.
          title="A starting selection"
          description={
            <>
              Chosen by the people maintaining this library as a place to start.{" "}
              <span className="text-fg-subtle">
                Everything.Free does not track usage, so this is not a ranking and nothing here is claimed to be the best
                option.
              </span>
            </>
          }
          action={<SectionLink href="/resources">Browse everything</SectionLink>}
        >
          {spotlight.length > 0 ? (
            <ResourceGrid resources={spotlight} label="Editorially selected resources" />
          ) : (
            <EmptyState
              icon="library"
              title="No resources have been selected yet"
              description="Selections appear here once maintainers mark entries for the homepage."
              action={
                <Link href="/resources" className={buttonClasses({ variant: "secondary" })}>
                  Browse the library
                </Link>
              }
            />
          )}
        </Section>

        {/* --------------------------------------------- recently verified */}
        <Section
          id="recently-verified"
          title="Recently verified"
          description="Free plans change. These are the entries whose details were checked most recently."
          action={<SectionLink href="/resources?sort=recently-verified">See all by date</SectionLink>}
        >
          {recentlyVerified.length > 0 ? (
            <ResourceGrid resources={recentlyVerified} label="Recently verified resources" />
          ) : (
            <EmptyState
              icon="shield-check"
              title="Nothing has been verified yet"
              description="Once contributors start confirming free status against official sources, the most recent checks will appear here."
              action={
                <Link href="/verification" className={buttonClasses({ variant: "secondary" })}>
                  How verification works
                </Link>
              }
            />
          )}
        </Section>

        {/* --------------------------------------------------------- tools */}
        <Section
          id="tools"
          title="Free tools you can use here"
          description="Small, focused jobs that run entirely in your browser. Your files are not uploaded."
          action={<SectionLink href="/tools">All tools</SectionLink>}
        >
          {tools.length > 0 ? (
            <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.slice(0, 4).map((tool) => (
                <li key={tool.slug} className="flex">
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="sliders"
              title="No integrated tools yet"
              description="Tools are added only where running something here is genuinely better than linking to an existing one."
            />
          )}
        </Section>

        {/* --------------------------------------------------- collections */}
        <Section
          id="collections"
          title="Collections"
          description="Sets of resources that solve one problem together, with the basis for each selection stated."
          action={<SectionLink href="/collections">All collections</SectionLink>}
        >
          {collections.length > 0 ? (
            <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 6).map((collection) => (
                <li key={collection.slug} className="flex">
                  <CollectionCard collection={collection} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="library" title="No collections yet" description="Curated sets will appear here." />
          )}
        </Section>

        {/* ----------------------------------------------------- audiences */}
        <Section
          id="audiences"
          title="Explore by what you do"
          description="Each of these is a saved view of the library rather than a separate list, so it stays current automatically."
        >
          <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience) => (
              <li key={audience.slug}>
                <Link
                  href={`/for/${audience.slug}`}
                  className="group flex h-full items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-raised"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-subtle text-fg-muted"
                  >
                    <Icon name={audience.icon} size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-fg">{audience.name}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-fg-muted">{audience.description}</span>
                  </span>
                  <Icon
                    name="arrow-right"
                    size={15}
                    className="mt-2 ml-auto shrink-0 text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* -------------------------------------------------- alternatives */}
        <Section
          id="alternatives"
          title="Looking to replace something paid?"
          description="Free resources listed as alternatives to products people are trying to stop paying for."
          action={<SectionLink href="/alternatives">All alternatives</SectionLink>}
        >
          {topAlternatives.length > 0 ? (
            <>
              <ul className="flex flex-wrap gap-2">
                {topAlternatives.map((target) => (
                  <li key={target.slug}>
                    <Link
                      href={`/alternatives/${target.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                    >
                      <Icon name="refresh-cw" size={14} className="text-fg-subtle" />
                      {target.name}
                      <span className="text-xs text-fg-subtle tabular-nums">
                        {target.count}
                        <span className="sr-only"> alternatives</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Callout tone="neutral" className="mt-6">
                Everything.Free does not claim any alternative is universally better. Each listing states its free
                status, limitations and licence so you can judge the trade-off for your own situation.
              </Callout>
            </>
          ) : (
            <EmptyState
              icon="refresh-cw"
              title="No alternatives recorded yet"
              description="Alternatives appear here once listings record the paid products they can replace."
            />
          )}
        </Section>

        {/* ----------------------------------------------------- community */}
        <Section id="contribute">
          <div className="rounded-2xl border border-border bg-bg-subtle p-8 sm:p-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Know something that belongs here?</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">
                This library is built by the people who use it. Submissions need a working link, a clear free status and
                an honest account of the limitations — that last part is what makes the library worth trusting.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/submit" className={buttonClasses({ variant: "primary", size: "md" })}>
                  Submit a resource
                </Link>
                <Link href="/report" className={buttonClasses({ variant: "secondary", size: "md" })}>
                  Report a problem
                </Link>
                <Link href="/free-status" className={buttonClasses({ variant: "ghost", size: "md" })}>
                  What “free” means here
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
