import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import { Container, PageHeader } from "@/components/ui/layout";
import { site } from "@/config/site";
import { getResourceCount } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Why Everything.Free exists, what it will and will not do, and how a resource library built on honest limitations differs from an affiliate directory.",
  path: "/about",
});

export default async function AboutPage() {
  const resourceCount = await getResourceCount();

  return (
    <div className="pb-16">
      <PageHeader
        title="About Everything.Free"
        description={site.tagline}
      />

      <Container width="prose" className="pt-10">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="why-heading">
            <h2 id="why-heading" className="font-serif text-2xl font-semibold">
              Why this exists
            </h2>
            <div className="mt-3 flex flex-col gap-3 leading-relaxed text-fg-muted">
              <p>
                There is an enormous amount of genuinely free, genuinely good software and learning material on the
                internet. Finding it is the problem. Search results for &ldquo;free&rdquo; anything are dominated by paid
                products with trials, listicles chasing affiliate revenue, and directories that stopped being accurate
                years ago.
              </p>
              <p>
                Everything.Free is an attempt at the opposite: a library where the free status of each entry is stated
                precisely, the limitations are written down even when they are inconvenient, and you can see when someone
                last checked.
              </p>
              <p>
                It currently holds {resourceCount} resources. That is small, and deliberately so — the entries were
                written by hand rather than scraped, because a directory&rsquo;s value is in its accuracy, not its size.
              </p>
            </div>
          </section>

          <section aria-labelledby="not-heading">
            <h2 id="not-heading" className="font-serif text-2xl font-semibold">
              What this is not
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                "Not an affiliate site. There are no referral links, sponsored placements or paid listings.",
                "Not a review site. No ratings, stars or scores — those would need data that is not collected.",
                "Not a mirror or a download host. Links go to the provider's own site, always.",
                "Not a piracy resource. Nothing here circumvents payment, licensing or access controls.",
                "Not the owner of anything it lists. Every resource belongs to whoever made it.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <Icon name="close" size={16} className="mt-0.5 shrink-0 text-fg-subtle" />
                  <span className="text-fg-muted">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="principles-heading">
            <h2 id="principles-heading" className="font-serif text-2xl font-semibold">
              How entries are written
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Precision over enthusiasm",
                  body: "Eight free-status classifications instead of one word. A trial is a trial.",
                  href: "/free-status",
                },
                {
                  title: "Limitations up front",
                  body: "Anything with conditions attached must document them. The build fails otherwise.",
                  href: "/free-status",
                },
                {
                  title: "Dated claims",
                  body: "Every entry shows when it was last checked, and goes stale visibly.",
                  href: "/verification",
                },
                {
                  title: "“Unknown” is an answer",
                  body: "Unchecked facts are marked unverified rather than guessed at.",
                  href: "/verification",
                },
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
                  >
                    More
                    <Icon name="chevron-right" size={12} />
                  </Link>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="quilonix-heading">
            <h2 id="quilonix-heading" className="font-serif text-2xl font-semibold">
              Everything.Free and {site.parent.name}
            </h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Everything.Free is a {site.parent.name} project, developed in the open. It is intended to stand on its own —
              you should never need to know or care about the parent organisation to use it.
            </p>
            <p className="mt-3 leading-relaxed text-fg-muted">
              The source is public, which means the classification rules, the seed data and the validation that enforces
              them can all be read and challenged.
            </p>
            <p className="mt-4">
              <ExternalLink
                href={site.githubUrl}
                className="text-sm link-inline"
              >
                View the project on GitHub
              </ExternalLink>
            </p>
          </section>

          <Callout tone="primary" icon="users" title="This only works with contributions">
            <p>
              A library like this cannot be maintained by one person — free plans change too often.{" "}
              <Link href="/submit" className="text-fg underline underline-offset-2">
                Adding a resource
              </Link>{" "}
              or{" "}
              <Link href="/report" className="text-fg underline underline-offset-2">
                correcting one
              </Link>{" "}
              is the most useful thing you can do here.
            </p>
          </Callout>
        </div>
      </Container>
    </div>
  );
}
