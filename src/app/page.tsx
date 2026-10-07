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
import { availableTools } from "@/config/tools";
import { CategoryGroupCard } from "@/features/categories/components/category-cards";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { DynamicShowcase } from "@/features/home/components/dynamic-showcase";
import { Hero } from "@/features/home/components/hero";
import { StudentBanner } from "@/features/home/components/student-banner";
import { featuredToolsSiteTools, toolsSite } from "@/config/tools-site";
import { ToolsSiteCard } from "@/features/tools/components/tools-site";
import {
  getAllResourcesForClient,
  getAlternativeTargets,
  getCollections,
  getMarqueeResources,
  getRecentlyVerified,
  getResourceCount,
  getSpotlightResources,
  getVerifiedResourceCount,
} from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.shortDescription}`,
  description: site.description,
  path: "/",
});

/**
 * Apple-Level Editorial Homepage.
 *
 * Combines atmospheric keynote lighting, dynamic interactive category switching,
 * verified student perks showcase, and clean Apple-level minimalist card previews.
 */
export default async function HomePage() {
  const [
    resourceCount,
    verifiedCount,
    marqueeResources,
    spotlight,
    recentlyVerified,
    allResources,
    collections,
    alternativeTargets,
  ] = await Promise.all([
    getResourceCount(),
    getVerifiedResourceCount(),
    getMarqueeResources(14),
    getSpotlightResources(6),
    getRecentlyVerified(6),
    getAllResourcesForClient(),
    getCollections(),
    getAlternativeTargets(),
  ]);

  // Curate top resources for dynamic live tabs
  const studentResources = allResources
    .filter((r) => r.category === "students" || r.tags.includes("students"))
    .slice(0, 6);

  const developerResources = allResources
    .filter(
      (r) =>
        r.category === "developer-tools" ||
        r.tags.includes("developer") ||
        r.tags.includes("hosting") ||
        r.tags.includes("database") ||
        r.category === "databases",
    )
    .slice(0, 6);

  const designResources = allResources
    .filter(
      (r) =>
        r.category === "3d" ||
        r.category === "vector" ||
        r.category === "raster" ||
        r.tags.includes("design") ||
        r.tags.includes("creative") ||
        r.tags.includes("video"),
    )
    .slice(0, 6);

  const aiResources = allResources
    .filter(
      (r) =>
        r.tags.includes("ai") ||
        r.tags.includes("llm") ||
        r.tags.includes("machine-learning") ||
        r.category === "productivity",
    )
    .slice(0, 6);

  const topAlternatives = alternativeTargets.slice(0, 10);

  return (
    <>
      {/* 01. Apple-Level Hero with Atmospheric Lighting & Floating Glass Tiles */}
      <Hero
        resourceCount={resourceCount}
        verifiedCount={verifiedCount}
        toolCount={availableTools.length + toolsSite.tools.length}
        marqueeResources={marqueeResources}
      />

      <Container className="space-y-16 sm:space-y-20 py-12 sm:py-16">
        {/* 02. CampusKey Student Spotlight Bento Banner */}
        <section aria-label="Student Perks Spotlight">
          <StudentBanner />
        </section>

        {/* 03. Interactive Dynamic Category Showcase (Segmented Controls) */}
        <section id="spotlight" aria-label="Interactive Resource Discovery" className="relative scroll-mt-20">
          <div id="recently-verified" className="absolute -top-20" />
          <DynamicShowcase
            spotlightResources={spotlight}
            studentResources={studentResources}
            developerResources={developerResources}
            designResources={designResources}
            aiResources={aiResources}
            recentlyCheckedResources={recentlyVerified}
          />
        </section>

        {/* 04. Browse by Category (Elevated Squircle Cards) */}
        <Section
          id="categories"
          title="Browse by category"
          description="Explore all eight curated domain areas covering developer tools, student perks, creative suites, AI, utilities, and daily essentials."
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

        {/* --------------------------------------------------------- tools */}
        <Section
          id="tools"
          title="Free tools you can use now"
          description={`${toolsSite.tools.length + availableTools.length} browser tools for everyday jobs. Your files are not uploaded.`}
          action={<SectionLink href="/tools">All tools</SectionLink>}
        >
          {toolsSite.tools.length > 0 ? (
            <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredToolsSiteTools(6).map((tool) => (
                <li key={tool.slug} className="flex">
                  <ToolsSiteCard tool={tool} />
                </li>
              ))}
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
            <EmptyState title="No collections yet" description="Curated sets will appear here." />
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
                  className="group flex h-full items-start gap-3 rounded-md border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-raised"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg-subtle text-fg-muted"
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
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
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
              title="No alternatives recorded yet"
              description="Alternatives appear here once listings record the paid products they can replace."
            />
          )}
        </Section>

        {/* ----------------------------------------------------- community */}
        <Section id="contribute">
          <div className="rounded-md border border-border bg-bg-subtle p-8 sm:p-12">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Know something that belongs here?</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">
                This library is built by the people who use it. Submissions need a working link, a clear free status and
                an honest account of the limitations — that last part is what makes the library worth trusting.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ variant: "primary", size: "md" })}
                >
                  <span>Submit a resource</span>
                  <Icon name="arrow-up-right" size={14} className="ml-1" />
                </a>
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
