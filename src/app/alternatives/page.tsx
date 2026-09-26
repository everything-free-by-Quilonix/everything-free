import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { Callout } from "@/components/ui/callout";
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
          <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {targets.map((target) => (
              <li key={target.slug}>
                <Link
                  href={`/alternatives/${target.slug}`}
                  className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 transition-colors hover:border-border-strong hover:bg-surface-raised"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-fg">{target.name}</span>
                    <span className="mt-0.5 block text-xs text-fg-subtle">
                      {target.count} {target.count === 1 ? "free alternative" : "free alternatives"}
                    </span>
                  </span>
                  <Icon
                    name="chevron-right"
                    size={16}
                    className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon="refresh-cw"
            title="No alternatives recorded yet"
            description="This page is generated from the paid products that library entries record themselves as alternatives to. It fills up as the library grows."
          />
        )}
      </Container>
    </div>
  );
}
