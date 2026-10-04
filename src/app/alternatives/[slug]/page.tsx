import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { JsonLdScript } from "@/components/seo/json-ld";
import { Callout } from "@/components/ui/callout";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { RecordList } from "@/features/resources/components/resource-record";
import { AlternativeComparison } from "@/features/resources/components/alternative-comparison";
import { getAlternativesFor, getAlternativeTargets } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, collectionSchema } from "@/lib/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const targets = await getAlternativeTargets();
  return targets.map((target) => ({ slug: target.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const target = await getAlternativesFor(slug);

  if (!target) {
    return buildMetadata({
      title: "Not found",
      description: "No alternatives are recorded for this product.",
      path: `/alternatives/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `Free alternatives to ${target.name}`,
    description: `${target.resources.length} free resources listed as alternatives to ${target.name}, each with its free status, limitations and licence terms stated.`,
    path: `/alternatives/${slug}`,
  });
}

export default async function AlternativePage({ params }: PageProps) {
  const { slug } = await params;
  const target = await getAlternativesFor(slug);

  if (!target) notFound();

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Alternatives", href: "/alternatives" },
              { label: target.name },
            ]}
          />

          <h1 className="mt-6 font-serif text-3xl font-semibold">
            Free alternatives to {target.name}
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
            {target.resources.length} {target.resources.length === 1 ? "resource" : "resources"} in the library cover
            similar ground. Compare the facts below rather than taking any of them as a like-for-like swap.
          </p>
        </Container>
      </header>

      <Container className="pt-8">
        <Callout tone="neutral" icon="info" className="mb-8">
          Everything.Free is not affiliated with {target.name} and makes no claim about which option is better. The
          comparison shows the fields we record; the differences that matter depend on what you are doing.
        </Callout>

        <section aria-labelledby="comparison-heading" className="mb-12">
          <h2 id="comparison-heading" className="font-display text-xl font-semibold">
            Side by side
          </h2>
          <p className="mt-1.5 text-sm text-fg-muted">
            Factual fields only. An empty or unverified cell means we have not established it, not that the answer is no.
          </p>
          <div className="mt-4">
            <AlternativeComparison resources={target.resources} />
          </div>
        </section>

        <section aria-labelledby="alternatives-heading">
          <h2 id="alternatives-heading" className="font-display text-xl font-semibold">
            The alternatives
          </h2>
          <div className="mt-4">
            <RecordList layout="list" resources={target.resources} label={`Free alternatives to ${target.name}`} />
          </div>
        </section>
      </Container>

      <JsonLdScript
        data={[
          collectionSchema({
            name: `Free alternatives to ${target.name}`,
            description: `Free resources listed as alternatives to ${target.name}.`,
            path: `/alternatives/${slug}`,
            resources: target.resources,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Alternatives", path: "/alternatives" },
            { name: target.name, path: `/alternatives/${slug}` },
          ]),
        ]}
      />
    </div>
  );
}
