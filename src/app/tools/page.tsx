import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { Container, PageHeader } from "@/components/ui/layout";
import { availableTools, getPopulatedToolGroups } from "@/config/tools";
import { ToolCard } from "@/features/tools/components/tool-card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Tools you can use here",
  description:
    "Small, focused tools that run entirely in your browser — image conversion, contrast checking and text utilities. Your files are never uploaded.",
  path: "/tools",
});

/**
 * Tools index.
 *
 * States the section's own scope honestly: this is deliberately a short list. The
 * product's position is that rebuilding tools that already exist well is wasted
 * effort, so the library is the primary answer and this section only covers jobs
 * where running locally is the actual advantage.
 */
export default function ToolsPage() {
  const groups = getPopulatedToolGroups();

  return (
    <div className="pb-16">
      <PageHeader
        title="Tools you can use here"
        description="A small set of utilities that run in your browser. No upload, no queue, no account — and no file leaves your device."
      />

      <Container className="pt-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="flex flex-col gap-12">
            {groups.map(({ group, tools: groupTools }) => (
              <section key={group.id} aria-labelledby={`${group.id}-heading`}>
                <h2 id={`${group.id}-heading`} className="font-display text-lg font-semibold">
                  {group.name}
                </h2>
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
                Every available tool here processes your input in your own browser. You can verify that: open the network
                panel while using one, or disconnect from the internet after the page loads — it will keep working.
              </p>
            </Callout>

            <Callout tone="neutral" icon="info" title="Why the list is short">
              <p>
                Everything.Free does not try to rebuild tools that already exist and work well. A tool is only added here
                when running it locally is genuinely better than sending your files to someone else&rsquo;s server.
              </p>
              <p className="mt-2">
                For heavier work,{" "}
                <Link href="/resources" className="text-fg underline underline-offset-2 hover:text-primary">
                  the library
                </Link>{" "}
                lists established applications built for the job.
              </p>
            </Callout>

            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-medium text-fg">
                {availableTools.length} {availableTools.length === 1 ? "tool" : "tools"} available
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                Entries marked <span className="text-fg">Planned</span> are on the roadmap and are not interactive yet.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
