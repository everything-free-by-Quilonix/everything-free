import Link from "next/link";
import type { Metadata } from "next";

import { buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { Container, Section, SectionLink } from "@/components/ui/layout";
import { audiences } from "@/config/audiences";
import { categoryGroups } from "@/config/categories";
import { site } from "@/config/site";
import { tools } from "@/config/tools";
import { CategoryGroupCard } from "@/features/categories/components/category-cards";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { libraryCensus } from "@/features/home/census";
import { Hero } from "@/features/home/components/hero";
import { RecordList } from "@/features/resources/components/resource-record";
import {
  getAlternativeTargets,
  getAllResourcesForClient,
  getCollections,
  getRecentlyVerified,
  getSpotlightResources,
} from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.shortDescription}`,
  description: site.description,
  path: "/",
});

/** A chrome text link inside an index row: muted, ink and underlined on hover. */
const indexLink = "rounded-xs text-fg underline-offset-[0.2em] decoration-border-strong hover:underline";

/**
 * Homepage.
 *
 * Every section reads from the repository and handles an empty result honestly.
 * None of them are padded with invented entries to look fuller — if a section has
 * nothing to show, it says what would fill it and how to contribute. Every count
 * comes from the census or a repository read at build.
 */
export default async function HomePage() {
  const [allResources, spotlight, recentlyVerified, collections, alternativeTargets] = await Promise.all([
    getAllResourcesForClient(),
    getSpotlightResources(6),
    getRecentlyVerified(6),
    getCollections(),
    getAlternativeTargets(),
  ]);

  const census = libraryCensus(allResources);
  const topAlternatives = alternativeTargets.slice(0, 10);

  return (
    <>
      <Hero census={census} />

      <Container>
        {/* ---------------------------------------------------- categories */}
        <Section
          id="categories"
          variant="editorial"
          kicker="Index"
          title="Browse by category"
          description="Every subject in the library, grouped by area: everyday needs, study, creative work, AI, development, business, media and life."
          action={<SectionLink href="/categories">All categories</SectionLink>}
        >
          <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          variant="editorial"
          kicker="Selection"
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
            <RecordList layout="grid" resources={spotlight} label="Editorially selected resources" />
          ) : (
            <EmptyState
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

        {/* ---------------------------------------------- recently checked */}
        <Section
          id="recently-verified"
          variant="editorial"
          kicker="Verification log"
          title="Recently checked"
          description="Free plans change. These entries had facts checked against official sources most recently. The badge on each says how far that checking got."
          action={<SectionLink href="/resources?sort=recently-verified">See all by date</SectionLink>}
        >
          {recentlyVerified.length > 0 ? (
            <RecordList layout="list" resources={recentlyVerified} label="Recently checked resources" />
          ) : (
            <EmptyState
              title="Nothing has been checked yet"
              description="Once contributors start confirming facts against official sources, the most recent checks will appear here."
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
          variant="editorial"
          kicker="In your browser"
          title="Tools you can use here"
          description="Small, focused jobs that run entirely in your browser. Your files are not uploaded."
          action={<SectionLink href="/tools">All tools</SectionLink>}
        >
          {tools.length > 0 ? (
            <ul className="list-none divide-y divide-rule border-y border-rule">
              {tools.slice(0, 4).map((tool) => {
                const planned = tool.status === "planned";
                const local = tool.processing.location === "browser" && !tool.processing.leavesDevice;
                return (
                  <li key={tool.slug} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">
                        {planned ? (
                          <span className="text-fg-muted">{tool.name}</span>
                        ) : (
                          <Link href={`/tools/${tool.slug}`} className={indexLink}>
                            {tool.name}
                          </Link>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-fg-muted">{tool.shortDescription}</p>
                    </div>
                    <p className="text-xs text-fg-subtle">
                      {planned ? "Planned" : local ? "Runs in your browser" : "Sends data to a server"}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              title="No integrated tools yet"
              description="Tools are added only where running something here is genuinely better than linking to an existing one."
            />
          )}
        </Section>

        {/* --------------------------------------------------- collections */}
        <Section
          id="collections"
          variant="editorial"
          kicker="Editorial sets"
          title="Collections"
          description="Sets of resources that solve one problem together, with the basis for each selection stated."
          action={<SectionLink href="/collections">All collections</SectionLink>}
        >
          {collections.length > 0 ? (
            <ul className="grid list-none border-t border-rule sm:grid-cols-2 sm:gap-x-8">
              {collections.slice(0, 6).map((collection) => (
                <li key={collection.slug} className="border-b border-rule">
                  <CollectionCard collection={collection} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No collections yet" description="Curated sets will appear here." />
          )}
        </Section>

        {/* ----------------------------------------------------- audiences */}
        <Section
          id="audiences"
          variant="editorial"
          kicker="Audiences"
          title="By what you do"
          description="Each of these is a saved view of the library rather than a separate list, so it stays current automatically."
        >
          <ul className="grid list-none border-t border-rule sm:grid-cols-2 sm:gap-x-8">
            {audiences.map((audience) => (
              <li key={audience.slug} className="border-b border-rule py-4">
                <Link href={`/for/${audience.slug}`} className={`${indexLink} text-sm font-medium`}>
                  {audience.name}
                </Link>
                <p className="mt-1 text-sm text-fg-muted">{audience.description}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* -------------------------------------------------- alternatives */}
        <Section
          id="alternatives"
          variant="editorial"
          kicker="Alternatives"
          title="Replacing something paid?"
          description="Free resources listed as alternatives to products people are trying to stop paying for."
          action={<SectionLink href="/alternatives">All alternatives</SectionLink>}
        >
          {topAlternatives.length > 0 ? (
            <>
              <ul className="grid list-none border-t border-rule sm:grid-cols-2 sm:gap-x-8">
                {topAlternatives.map((target) => (
                  <li key={target.slug} className="border-b border-rule">
                    <Link
                      href={`/alternatives/${target.slug}`}
                      className="group flex items-baseline gap-3 rounded-xs py-3 text-sm text-fg"
                    >
                      <span className="underline-offset-[0.2em] decoration-border-strong group-hover:underline">
                        {target.name}
                      </span>
                      <span aria-hidden="true" className="hidden flex-1 border-b border-dotted border-rule sm:block" />
                      <span className="ml-auto text-xs text-fg-muted tabular-nums sm:ml-0">
                        {target.count}
                        <span className="sr-only"> alternatives</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Callout tone="neutral" className="mt-8">
                Everything.Free does not claim any alternative is universally better. Each listing states its free
                status, limitations and licence so you can judge the trade-off for your own situation.
              </Callout>
            </>
          ) : (
            <EmptyState
              title="No alternatives recorded yet"
              description="Alternatives appear here once listings record the paid products they can replace."
            />
          )}
        </Section>

        {/* ----------------------------------------------------- community */}
        <Section id="contribute" variant="editorial" kicker="Contribute" title="Know something that belongs here?">
          <p className="max-w-(--measure-standfirst) text-base text-fg-muted">
            This library is built by the people who use it. Submissions need a working link, a clear free status and an
            honest account of the limitations — that last part is what makes the library worth trusting.
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
        </Section>
      </Container>
    </>
  );
}
