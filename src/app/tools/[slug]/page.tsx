import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { getTool, getToolIntegration, tools } from "@/config/tools";
import { ResourceCard } from "@/features/resources/components/resource-card";
import { hasToolImplementation, ToolSurface } from "@/features/tools/components/tool-registry";
import { ToolAttributions, ToolPrivacyNotice } from "@/features/tools/components/tool-privacy";
import { getResourcesBySlugs } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return buildMetadata({
      title: "Tool not found",
      description: "This tool does not exist.",
      path: `/tools/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: tool.name,
    description: tool.shortDescription,
    path: `/tools/${tool.slug}`,
    // Planned tools have no functionality to offer a visitor from search.
    noIndex: tool.status === "planned",
  });
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  const isInteractive = tool.status === "available" && hasToolImplementation(tool.slug);
  const related = await getResourcesBySlugs(tool.relatedResources);

  return (
    <article className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: tool.name }]}
          />

          <div className="mt-6 flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-fg-muted"
            >
              <Icon name={tool.icon} size={24} />
            </span>

            <div className="min-w-0">
              <h1 className="font-serif text-3xl font-semibold">{tool.name}</h1>
              <p className="mt-2 max-w-2xl leading-relaxed text-fg-muted">{tool.longDescription}</p>

              <div className="mt-4">
                {tool.status === "planned" ? (
                  <Badge tone="neutral" size="md">
                    Planned — not available yet
                  </Badge>
                ) : (
                  <Badge tone="neutral" icon="lock" size="md">
                    Runs in your browser
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Container className="pt-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="flex min-w-0 flex-col gap-8">
            <ToolPrivacyNotice tool={tool} />

            {isInteractive ? (
              <Card className="p-5 sm:p-6">
                <h2 className="sr-only">{tool.name}</h2>
                <ToolSurface slug={tool.slug} />
              </Card>
            ) : (
              <Card className="border-dashed p-8 text-center">
                <p className="font-medium text-fg">This tool has not been built yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                  It is on the roadmap. Rather than shipping a button that does nothing, the page documents the intended
                  approach — including where processing will happen — so the plan is on the record before any code exists.
                </p>
                <Link
                  href="/tools"
                  className="mt-5 inline-flex items-center gap-1 text-sm text-fg-muted underline underline-offset-2 hover:text-fg"
                >
                  Tools that are available now
                  <Icon name="chevron-right" size={14} />
                </Link>
              </Card>
            )}

            <section aria-labelledby="tool-limitations">
              <h2 id="tool-limitations" className="font-display text-lg font-semibold">
                What it will not do
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {tool.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <Icon name="info" size={15} className="mt-0.5 shrink-0 text-fg-subtle" />
                    <span className="text-fg-muted">{limitation}</span>
                  </li>
                ))}
              </ul>
            </section>

            {related.length > 0 ? (
              <section aria-labelledby="tool-related">
                <h2 id="tool-related" className="font-display text-lg font-semibold">
                  For heavier work
                </h2>
                <p className="mt-1.5 text-sm text-fg-muted">
                  These established applications from the library go further than a browser tool can.
                </p>
                <ul className="mt-4 grid list-none gap-4 sm:grid-cols-2">
                  {related.map((resource) => (
                    <li key={resource.slug} className="flex">
                      <ResourceCard resource={resource} className="w-full" />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            <Card className="p-5">
              <h2 className="font-display text-sm font-semibold">Processing</h2>
              <dl className="mt-3 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-fg-muted">Where it runs</dt>
                  <dd className="text-right text-fg">
                    {tool.processing.location === "browser"
                      ? "Your browser"
                      : tool.processing.location === "server"
                        ? "Our server"
                        : "A third party"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-fg-muted">Data leaves device</dt>
                  <dd className="text-right text-fg">{tool.processing.leavesDevice ? "Yes" : "No"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-fg-muted">Integration</dt>
                  <dd className="text-right text-fg">{getToolIntegration(tool.integrationType).label}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-fg-muted">Infrastructure cost</dt>
                  <dd className="text-right text-fg">
                    {tool.infrastructureCost === "none"
                      ? "None"
                      : tool.infrastructureCost === "free-tier"
                        ? "Free tier"
                        : "Paid"}
                  </dd>
                </div>
                {tool.freeTierLimitation ? (
                  <div className="flex flex-col gap-1">
                    <dt className="text-fg-muted">Free-tier ceiling</dt>
                    <dd className="text-fg">{tool.freeTierLimitation}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-fg-subtle">
                This panel is generated from the tool&rsquo;s registry entry, which is validated at build time — a tool
                cannot claim local processing while also sending data away.
              </p>
            </Card>

            <Card className="p-5">
              <ToolAttributions tool={tool} />
              {tool.attributions.length === 0 ? (
                <>
                  <h2 className="font-display text-sm font-semibold">Built on</h2>
                  <p className="mt-2 text-sm text-fg-muted">
                    Browser standards only — no third-party libraries, so there is nothing to credit and nothing extra
                    for you to download.
                  </p>
                </>
              ) : null}
            </Card>

            <Callout tone="neutral" icon="shield-check">
              Everything.Free does not log, store or transmit anything you put into the tools on this site.
            </Callout>
          </aside>
        </div>
      </Container>

      <JsonLdScript
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ])}
      />
    </article>
  );
}
