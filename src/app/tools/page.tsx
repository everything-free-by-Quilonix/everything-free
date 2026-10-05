import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Container, PageHeader, Section } from "@/components/ui/layout";
import { availableTools, getPopulatedToolGroups } from "@/config/tools";
import { featuredToolsSiteTools, toolsSite, toolsSiteByCategory } from "@/config/tools-site";
import { ToolCard } from "@/features/tools/components/tool-card";
import { ToolsSiteCard, ToolsSiteCategoryList } from "@/features/tools/components/tools-site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Free tools",
  description:
    "Free browser tools from Everything.Free: JSON, images, text, security, data and more. No account, and your files are never uploaded.",
  path: "/tools",
});

/**
 * Tools index.
 *
 * Two kinds of tool, kept visibly apart:
 * - the Everything.Free Tools site, the project's dedicated set of browser tools,
 *   listed from its published catalogue (see `config/tools-site.ts`);
 * - the few tools that run on this site itself (`config/tools.ts`).
 *
 * The library remains the answer for heavier jobs.
 */
export default function ToolsPage() {
  const groups = getPopulatedToolGroups();
  const featured = featuredToolsSiteTools();
  const byCategory = toolsSiteByCategory();
  const categoryName = new Map(toolsSite.categories.map((category) => [category.slug, category.name]));
  const localCount = toolsSite.tools.filter((tool) => tool.processing === "local").length;

  return (
    <div className="pb-16">
      <PageHeader
        title="Free tools"
        description="Browser tools for everyday jobs: format JSON, compress images, generate passwords, compare text and more. No upload, no account, no limits."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={toolsSite.url}
            className={buttonClasses({ variant: "primary" })}
          >
            Open Everything.Free Tools
            <Icon name="arrow-up-right" size={16} />
          </a>
          <p className="flex items-center gap-1.5 text-sm text-fg-muted">
            <Icon name="lock" size={14} className="text-success-fg" />
            {toolsSite.tools.length} tools
            {localCount === toolsSite.tools.length ? ", all processed in your browser" : `, ${localCount} processed in your browser`}
          </p>
        </div>
      </PageHeader>

      <Container>
        <Section
          id="tools-site"
          title="Start here"
          description="Popular jobs on Everything.Free Tools, the project's dedicated tools site."
          action={
            <a
              href={toolsSite.url}
              className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              All {toolsSite.tools.length} tools
              <Icon name="arrow-up-right" size={16} />
            </a>
          }
          className="pb-0 sm:pb-0"
        >
          <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tool) => (
              <li key={tool.slug} className="flex">
                <ToolsSiteCard tool={tool} categoryName={categoryName.get(tool.category)} />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="tools-site-categories"
          title="Browse by category"
          description="Every tool on Everything.Free Tools, grouped by the job it does."
          className="pb-0 sm:pb-0"
        >
          <ul className="grid list-none gap-4 md:grid-cols-2 xl:grid-cols-3">
            {byCategory.map(({ category, tools }) => (
              <li key={category.slug} className="flex">
                <ToolsSiteCategoryList category={category} tools={tools} />
              </li>
            ))}
          </ul>
        </Section>

        {groups.length > 0 ? (
          <Section
            id="tools-here"
            title="Tools on this site"
            description={`${availableTools.length} small ${availableTools.length === 1 ? "utility" : "utilities"} that run right here, also in your browser.`}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div className="flex flex-col gap-10">
                {groups.map(({ group, tools: groupTools }) => (
                  <section key={group.id} aria-labelledby={`${group.id}-heading`}>
                    <h3 id={`${group.id}-heading`} className="font-display text-lg font-semibold">
                      {group.name}
                    </h3>
                    <p className="mt-1 text-sm text-fg-muted">{group.description}</p>
                    <ul className="mt-4 grid list-none gap-4 sm:grid-cols-2">
                      {groupTools.map((tool) => (
                        <li key={tool.slug} className="flex">
                          <ToolCard tool={tool} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
                <Callout tone="success" icon="lock" title="Why these run locally">
                  <p>
                    Every tool listed here processes your input in your own browser. You can verify that: open the
                    network panel while using one, or disconnect from the internet after the page loads. It will keep
                    working.
                  </p>
                </Callout>
                <Callout tone="neutral" icon="info" title="For heavier work">
                  <p>
                    <Link href="/resources" className="text-fg underline underline-offset-2 hover:text-primary">
                      The library
                    </Link>{" "}
                    lists established free applications built for bigger jobs.
                  </p>
                </Callout>
              </aside>
            </div>
          </Section>
        ) : null}
      </Container>
    </div>
  );
}
