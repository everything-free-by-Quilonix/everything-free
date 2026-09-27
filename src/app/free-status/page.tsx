import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { Container, PageHeader } from "@/components/ui/layout";
import { freeStatusList } from "@/config/free-status";
import { getAllResourcesForClient, getFacets } from "@/lib/repository";
import { isFactConfirmed } from "@/lib/resources/evidence";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "What “free” means here",
  description:
    "The eight free-status classifications Everything.Free uses, what each one means, and why a trial is never described as free.",
  path: "/free-status",
});

/**
 * The free-status reference.
 *
 * This page is generated entirely from `config/free-status.ts`, which is the same
 * source the badges, filters and submission form read. Definitions therefore cannot
 * drift between the documentation and the product — a change here is a change
 * everywhere, by construction.
 */
export default async function FreeStatusPage() {
  const [facets, resources] = await Promise.all([getFacets({}), getAllResourcesForClient()]);
  // The count links to every listing filed under a status. How many of those have
  // had the classification itself confirmed is a different number, shown beside it.
  const confirmedByStatus = new Map<string, number>();
  for (const resource of resources) {
    if (isFactConfirmed(resource, "freeStatus")) {
      confirmedByStatus.set(resource.freeStatus, (confirmedByStatus.get(resource.freeStatus) ?? 0) + 1);
    }
  }

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <Icon name="shield-check" size={14} className="text-primary" />
            Trust
          </span>
        }
        title="What “free” means here"
        description="“Free” hides a lot of different arrangements. Everything.Free classifies every resource into one of eight statuses so you know which arrangement you are dealing with before you invest time in something."
      />

      <Container width="prose" className="pt-10">
        <Callout tone="warning" icon="alert-triangle" title="The rule that matters most">
          A trial is never described as free. Temporary access that expires is labelled{" "}
          <strong className="text-fg">Trial only</strong>, and a free plan with caps is labelled{" "}
          <strong className="text-fg">Free tier</strong> with its limits written down. Anything that would mislead you
          into starting work you cannot finish is called out rather than glossed over.
        </Callout>

        <div className="mt-10 flex flex-col gap-6">
          {freeStatusList.map((status) => {
            const count = facets.freeStatuses[status.id] ?? 0;

            return (
              <Card key={status.id} id={status.id} className="scroll-mt-24 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge tone={status.tone} icon={status.icon} size="md">
                    {status.label}
                  </Badge>

                  {status.listable ? (
                    <p className="text-xs text-fg-muted">
                      <Link
                        href={`/resources?status=${status.id}`}
                        className="underline underline-offset-2 hover:text-fg"
                      >
                        {count} {count === 1 ? "resource" : "resources"} in the library
                      </Link>
                      {count > 0 ? (
                        <span className="text-fg-subtle" data-testid="free-status-confirmed-count">
                          {" "}
                          · classification confirmed for {confirmedByStatus.get(status.id) ?? 0}
                        </span>
                      ) : null}
                    </p>
                  ) : (
                    <span className="text-xs text-fg-subtle">Not listed in the library</span>
                  )}
                </div>

                <h2 className="mt-4 font-display text-lg font-semibold">{status.summary}</h2>
                <p className="mt-2 leading-relaxed text-fg-muted">{status.definition}</p>

                {status.caveat ? (
                  <p className="mt-3 flex items-start gap-2 rounded-lg bg-bg-subtle px-3.5 py-3 text-sm">
                    <Icon name="info" size={15} className="mt-0.5 shrink-0 text-fg-subtle" />
                    <span className="text-fg-muted">{status.caveat}</span>
                  </p>
                ) : null}

                {status.requiresLimitations ? (
                  <p className="mt-3 text-xs text-fg-subtle">
                    Entries with this status must document at least one limitation. That rule is enforced when the
                    library is built, not left to reviewer discretion.
                  </p>
                ) : null}
              </Card>
            );
          })}
        </div>

        <section className="mt-14" aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="font-display text-xl font-semibold">
            The commitments behind the labels
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[
              "A trial is never presented as a free product.",
              "Limitations are shown, including the ones that make a resource less appealing.",
              "Where a fact has not been checked, the page says so rather than guessing.",
              "Open source, free tier and free-for-personal-use are treated as distinct things, because they are.",
              "Official sources are preferred, and links point to the provider rather than a mirror.",
              "No ratings, review counts or usage figures are shown, because none are collected.",
            ].map((principle) => (
              <li key={principle} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success-fg" />
                <span className="text-fg-muted">{principle}</span>
              </li>
            ))}
          </ul>
        </section>

        <Callout tone="neutral" icon="flag" title="Think a status is wrong?" className="mt-10">
          Classifications are judgements and some are genuinely arguable.{" "}
          <Link href="/report" className="text-fg underline underline-offset-2 hover:text-primary">
            Report it
          </Link>{" "}
          and it will be reviewed against the definitions on this page.
        </Callout>
      </Container>

      <JsonLdScript
        data={faqSchema(
          freeStatusList.map((status) => ({
            question: `What does “${status.label}” mean on Everything.Free?`,
            answer: status.definition,
          })),
        )}
      />
    </div>
  );
}
