import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { plural } from "@/components/ui/count";
import { EmptyState } from "@/components/ui/empty-state";
import { Container, PageHeader } from "@/components/ui/layout";
import { getAlternativeTargets } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Free alternatives to paid products",
  description:
    "Paid products people want to stop paying for, and the free resources listed as alternatives — with limitations and licence terms stated for each.",
  path: "/alternatives",
});

/**
 * Alternatives index.
 *
 * Targets are derived from the `alternativeTo` field across the library rather
 * than maintained as a separate list, so adding a resource automatically creates
 * or extends the relevant alternatives page.
 */
export default async function AlternativesPage() {
  const targets = await getAlternativeTargets();

  return (
    <div className="pb-16">
      <PageHeader
        title="Free alternatives"
        description="Start from the paid product you are trying to replace. Each page lists free resources that cover the same ground, with their limitations stated plainly."
      />

      <Container className="pt-10">
        <Callout tone="warning" icon="info" title="Read this first" className="mb-8">
          <p>
            A free alternative is rarely a drop-in replacement. Workflows differ, file formats differ, and some
            capabilities genuinely are missing. Everything.Free does not rank alternatives or claim any is
            &ldquo;best&rdquo; — it records comparable facts so you can judge the trade-off for your own work.
          </p>
        </Callout>

        {targets.length > 0 ? (
          // An index with dotted leaders, the same rows as the homepage section.
          <ul className="grid list-none border-t border-rule sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
            {targets.map((target) => (
              <li key={target.slug} className="border-b border-rule">
                <Link
                  href={`/alternatives/${target.slug}`}
                  className="group flex items-baseline gap-3 rounded-xs py-3 text-sm text-fg"
                >
                  <span className="min-w-0 underline-offset-[0.2em] decoration-border-strong group-hover:underline">
                    {target.name}
                  </span>
                  <span aria-hidden="true" className="hidden flex-1 border-b border-dotted border-rule sm:block" />
                  <span className="ml-auto shrink-0 text-xs text-fg-muted tabular-nums sm:ml-0">
                    {target.count}
                    <span className="sr-only"> {plural(target.count, "free alternative", "free alternatives")}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No alternatives recorded yet"
            description="This page is generated from the paid products that library entries record themselves as alternatives to. It fills up as the library grows."
          />
        )}
      </Container>
    </div>
  );
}
