import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { displayHost, ExternalLink } from "@/components/ui/external-link";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { getCategory } from "@/config/categories";
import { getFreeStatus } from "@/config/free-status";
import { site } from "@/config/site";
import { RecordList } from "@/features/resources/components/resource-record";
import { ResourceFacts } from "@/features/resources/components/resource-facts";
import { ResourceLogo } from "@/features/resources/components/resource-logo";
import { EvidenceMark, EvidenceTag } from "@/features/resources/components/evidence";
import { ProvenanceRail } from "@/features/resources/components/provenance-rail";
import { ResourceSnapshot } from "@/features/resources/components/resource-snapshot";
import { VerificationPanel } from "@/features/resources/components/verification-panel";
import { FACTS, factEvidence } from "@/lib/resources/evidence";
import { getResourceBySlug, getSimilarResources, listResourceIndexEntries, slugifyProductName } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, resourceSchema } from "@/lib/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders every resource page at build time.
 *
 * The library is bounded and its content is not personalised, so static
 * generation is the right default: pages are served from the edge as HTML with no
 * per-request data work, which is what makes the detail pages fast and cheap to
 * host.
 */
export async function generateStaticParams() {
  const entries = await listResourceIndexEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return buildMetadata({
      title: "Resource not found",
      description: "This resource is not in the library.",
      path: `/resources/${slug}`,
      noIndex: true,
    });
  }

  const status = getFreeStatus(resource.freeStatus);
  // Search results and link previews quote this, so an unchecked classification is
  // labelled as one there too.
  const confirmed = factEvidence(resource, "freeStatus").state === "confirmed";

  return buildMetadata({
    title: confirmed ? `${resource.name} — ${status.label}` : `${resource.name} — ${status.label} (not verified)`,
    description: confirmed
      ? `${resource.shortDescription} ${status.summary}`
      : `${resource.shortDescription} Listed as ${status.label.toLowerCase()}; not yet verified against the provider's own pages.`,
    path: `/resources/${resource.slug}`,
    type: "article",
    modifiedTime: resource.updatedAt,
    ogImageFor: resource.slug,
  });
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) notFound();

  const status = getFreeStatus(resource.freeStatus);
  const similar = await getSimilarResources(resource, 4);
  const category = getCategory(resource.category);

  const freeStatusEvidence = factEvidence(resource, "freeStatus");
  // Only an unconfirmed success is muted; cautions keep their tone either way, and
  // only a caution carries an icon (the warning triangle). The config's status
  // icons reuse the reserved evidence glyphs, so they are not rendered.
  const statusTone =
    status.tone === "success" && freeStatusEvidence.state !== "confirmed" ? "neutral" : status.tone;
  const statusIcon = status.caveat && (status.tone === "warning" || status.tone === "danger") ? "alert-triangle" : null;
  const limitationsEvidence = factEvidence(resource, "limitations");
  const confirmedCount = FACTS.filter((fact) => factEvidence(resource, fact).state === "confirmed").length;
  const headerEvidenceSentence =
    freeStatusEvidence.state === "confirmed"
      ? `The free status is confirmed from an official source. ${confirmedCount} of ${FACTS.length} facts on this page are confirmed; each one below says whether it is.`
      : confirmedCount > 0
        ? `The free status has not been confirmed yet. ${confirmedCount} of ${FACTS.length} facts on this page are; each one below says whether it is.`
        : "Nothing on this page has been confirmed from an official source yet. It was compiled from public documentation — treat it as a starting point.";

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
    { label: resource.name },
  ];

  return (
    <article className="pb-16">
      {/* ------------------------------------------------------- identity */}
      <header className="border-b border-border bg-bg-subtle py-8 sm:py-10">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <ResourceLogo logo={resource.logo} size={64} className="sm:size-20" />

            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-3xl font-semibold">{resource.name}</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-fg-muted">{resource.shortDescription}</p>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:w-52">
              <ExternalLink
                href={resource.officialUrl}
                showIcon={false}
                className={buttonClasses({ variant: "primary", size: "md", className: "w-full" })}
              >
                Open {displayHost(resource.officialUrl)}
                <Icon name="external-link" size={15} />
              </ExternalLink>

              {resource.sourceUrl ? (
                <ExternalLink
                  href={resource.sourceUrl}
                  showIcon={false}
                  className={buttonClasses({ variant: "secondary", size: "md", className: "w-full" })}
                >
                  <Icon name="repo" size={15} />
                  Source code
                </ExternalLink>
              ) : null}

              <p className="text-center text-xs text-fg-subtle">Opens the provider&rsquo;s own site</p>
            </div>
          </div>

          <div className="mt-8">
            <ResourceSnapshot resource={resource} size="full" />
          </div>
          {/* Resource status and fact evidence are different things, and the
              header says so once, plainly, before any detail. */}
          <p className="mt-3 max-w-2xl text-sm text-fg-subtle">{headerEvidenceSentence}</p>
        </Container>
      </header>

      <Container className="pt-10">
        {/* The rail comes first in reading order: below lg it follows the
            header's snapshot; from lg it heads the second column, sticky inside a
            row that takes the spare height, so the aside blocks sit at its foot
            and never scroll up beneath it. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[1fr_auto]">
          <div className="lg:col-start-2 lg:row-start-1">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
              <ProvenanceRail resource={resource} />
            </div>
          </div>

          {/* ----------------------------------------------- main column */}
          <div className="flex min-w-0 flex-col gap-10 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            {/* The caveat sits immediately under the status, before anything
                persuasive, so the trade-off is read before the feature list. */}
            {status.caveat ? (
              <Callout tone={statusTone} icon={statusIcon} title={`${status.label} — what that means`}>
                <p>{status.definition}</p>
                <p className="mt-1.5 font-medium text-fg">{status.caveat}</p>
              </Callout>
            ) : (
              <Callout tone={statusTone} icon={statusIcon} title={`${status.label} — what that means`}>
                {status.definition}
              </Callout>
            )}

            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="font-display text-xl font-semibold">
                About {resource.name}
              </h2>
              <p className="mt-3 leading-relaxed text-fg-muted">{resource.longDescription}</p>
              {/* Prose is a description, not evidence. Any fact it mentions — an
                  account, a licence, a limit — is confirmed or not in the panel. */}
              <p className="mt-2 text-xs text-fg-subtle" data-testid="description-evidence-note">
                The description, reasons and feature list on this page are written from public documentation. Whether
                each fact they mention is confirmed is shown in{" "}
                <a href="#facts-heading" className="underline underline-offset-2 hover:text-fg">
                  the facts panel
                </a>
                .
              </p>
            </section>

            <section aria-labelledby="why-heading">
              <h2 id="why-heading" className="font-display text-xl font-semibold">
                Why it is listed
              </h2>
              <Card className="mt-3 p-5">
                <p className="leading-relaxed text-fg-muted">{resource.whyListed}</p>
              </Card>
            </section>

            {/* ------------------------------------------- limitations */}
            <section aria-labelledby="limitations-heading">
              <h2 id="limitations-heading" className="font-display text-xl font-semibold">
                Limitations of the free offering
              </h2>
              <div className="mt-2">
                <EvidenceTag evidence={limitationsEvidence} />
                <span className="ml-2 text-xs text-fg-subtle">
                  {limitationsEvidence.state === "confirmed"
                    ? "Checked against the provider's own pages."
                    : "Compiled from public documentation; not yet checked against the provider's own pages."}
                </span>
              </div>
              {resource.limitations.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-2.5">
                  {resource.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2.5 text-sm leading-relaxed">
                      <Icon name="alert-triangle" size={15} className="mt-0.5 shrink-0 text-warning-fg" />
                      <span className="text-fg-muted">{limitation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                // An empty list is only a reassurance if someone checked. Otherwise
                // it just means nothing has been written down.
                <p className="mt-3 flex items-start gap-2.5 text-sm text-fg-muted">
                  <EvidenceMark reason={limitationsEvidence.reason} size={15} className="mt-0.5" />
                  {limitationsEvidence.state === "confirmed"
                    ? "The provider's own pages document no significant limitations on the free offering."
                    : "No limitations have been recorded, and nobody has checked yet whether there are any."}{" "}
                  If you find one, please report it so this entry can be corrected.
                </p>
              )}

              {resource.pricingNotes ? (
                <Callout tone="neutral" icon="wallet" title="Where the free/paid line sits" className="mt-4">
                  {resource.pricingNotes}
                </Callout>
              ) : null}
            </section>

            {/* ---------------------------------------------- features */}
            {resource.features.length > 0 ? (
              <section aria-labelledby="features-heading">
                <h2 id="features-heading" className="font-display text-xl font-semibold">
                  What it does
                </h2>
                {/* A description, not a set of confirmed claims: plain bullets, not
                    green ticks, which on this site mean "confirmed". */}
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {resource.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-fg-subtle" />
                      <span className="text-fg-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* ------------------------------------------------- facts */}
            <section aria-labelledby="facts-heading">
              <h2 id="facts-heading" className="font-display text-xl font-semibold">
                Details
              </h2>
              <p className="mt-1.5 text-sm text-fg-subtle">
                Each fact shows its value and whether an official source confirms it. Open &ldquo;How we know&rdquo; for
                the source, the date it was read and who read it. Always confirm anything critical on the provider&rsquo;s
                own site.
              </p>
              <div className="mt-3">
                <ResourceFacts resource={resource} />
              </div>
            </section>

            {/* ------------------------------------------ alternatives */}
            {resource.alternativeTo.length > 0 ? (
              <section aria-labelledby="alternative-to-heading">
                <h2 id="alternative-to-heading" className="font-display text-xl font-semibold">
                  People use this instead of
                </h2>
                <p className="mt-1.5 text-sm text-fg-muted">
                  Listed as an alternative to these paid products. That does not mean it matches them feature for
                  feature — read the limitations above and judge for your own use.
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {resource.alternativeTo.map((product) => (
                    <li key={product}>
                      <Link
                        href={`/alternatives/${slugifyProductName(product)}`}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                      >
                        <Icon name="refresh-cw" size={14} className="text-fg-subtle" />
                        {product}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* --------------------------------------------- similar */}
            {similar.length > 0 ? (
              <section aria-labelledby="similar-heading">
                <h2 id="similar-heading" className="font-display text-xl font-semibold">
                  Similar resources
                </h2>
                <div className="mt-4">
                  <RecordList layout="grid" resources={similar} label="Similar listings" />
                </div>
              </section>
            ) : null}
          </div>

          {/* ---------------------------------------------------- sidebar */}
          <aside className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
            {/* ------------------------------------------ verification */}
            <div id="verification">
              <VerificationPanel resource={resource} />
            </div>

            {/* --------------------------------------- source of truth */}
            <Card className="p-5">
              <h2 className="font-display text-sm font-semibold">Where this information comes from</h2>
              <ul className="mt-3 flex flex-col gap-3 text-sm">
                <li>
                  <span className="text-fg-muted">
                    <span className="font-medium text-fg">Everything.Free</span> writes the description, category,
                    limitations and verification notes on this page.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="globe" size={15} className="mt-0.5 shrink-0 text-fg-subtle" />
                  <span className="text-fg-muted">
                    <span className="font-medium text-fg">{displayHost(resource.officialUrl)}</span> is operated by its
                    own provider. Its features, pricing and terms are theirs to change, and can change without this page
                    being updated.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
                {site.name} is not affiliated with {resource.name} and does not host, operate or endorse it.
              </p>
            </Card>

            {/* ------------------------------------------------ report */}
            <Card className="p-5">
              <h2 className="font-display text-sm font-semibold">Something wrong here?</h2>
              <p className="mt-2 text-sm text-fg-muted">
                Broken link, changed pricing, or a limitation we missed — corrections are the most useful thing you can
                contribute.
              </p>
              <Link
                href={`/report?resource=${resource.slug}`}
                className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}
              >
                <Icon name="flag" size={14} />
                Report incorrect information
              </Link>
            </Card>

            {/* -------------------------------------------------- tags */}
            {resource.tags.length > 0 ? (
              <div>
                <h2 className="font-display text-sm font-semibold">Tags</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/resources?tag=${encodeURIComponent(tag)}`}
                        className="inline-block rounded-xs bg-surface-raised px-2 py-1 text-xs text-fg-muted transition-colors hover:text-fg"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>

      <JsonLdScript
        data={[
          resourceSchema(resource),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
            { name: resource.name, path: `/resources/${resource.slug}` },
          ]),
        ]}
      />
    </article>
  );
}
