import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { Container, PageHeader } from "@/components/ui/layout";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of use",
  description:
    "How to use Everything.Free, the limits of what its information guarantees, and how third-party resources and trademarks are treated.",
  path: "/terms",
});

/**
 * Terms of use.
 *
 * Written as plain statements rather than a boilerplate template, and scoped to
 * what this site actually is: an index of links with editorial descriptions. The
 * most important section is the one disclaiming accuracy of third-party pricing,
 * because that is the claim most likely to be relied on and most likely to change.
 */
export default function TermsPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Terms of use"
        description="Short, and in plain language. This is an index of other people's work, and these terms say what that does and does not promise you."
      />

      <Container width="prose" className="pt-10">
        <Callout tone="warning" icon="alert-triangle" title="The part that matters">
          Everything.Free describes products it does not operate. Free plans, limits, licences and availability are
          controlled by their providers and change without notice. Always confirm anything you are going to rely on — a
          licence for paid work, a storage limit, an export cap — on the provider&rsquo;s own site before you commit to it.
        </Callout>

        <div className="mt-10 flex flex-col gap-10 leading-relaxed">
          <section aria-labelledby="use-heading">
            <h2 id="use-heading" className="font-display text-xl font-semibold">
              Using this site
            </h2>
            <p className="mt-3 text-fg-muted">
              Browse it, search it, link to it, use the tools. No account is required and there is no charge. Automated
              scraping that degrades the service for other people is not welcome; the project is open source, so if you
              need the data in bulk, take it from the repository instead.
            </p>
          </section>

          <section aria-labelledby="accuracy-heading">
            <h2 id="accuracy-heading" className="font-display text-xl font-semibold">
              Accuracy
            </h2>
            <p className="mt-3 text-fg-muted">
              Entries are compiled carefully and each one carries a verification status and a date, but they are provided
              without warranty. Some will be wrong, and some that are right today will be wrong next month.
            </p>
            <p className="mt-3 text-fg-muted">
              Everything.Free accepts no liability for decisions made on the basis of information here. If you find an
              error,{" "}
              <Link href="/report" className="text-fg underline underline-offset-2 hover:text-primary">
                reporting it
              </Link>{" "}
              is the fastest way to get it fixed.
            </p>
          </section>

          <section aria-labelledby="third-party-heading">
            <h2 id="third-party-heading" className="font-display text-xl font-semibold">
              Third-party resources
            </h2>
            <p className="mt-3 text-fg-muted">
              Listed resources are owned and operated by their respective providers. A listing is not an endorsement,
              partnership or affiliation, and Everything.Free receives nothing for it.
            </p>
            <p className="mt-3 text-fg-muted">
              When you use a listed resource, that provider&rsquo;s terms and privacy policy apply, not these. Complying
              with their licence — including any attribution, share-alike or non-commercial condition — is your
              responsibility. The licence information here is a summary and not legal advice.
            </p>
          </section>

          <section aria-labelledby="trademark-heading">
            <h2 id="trademark-heading" className="font-display text-xl font-semibold">
              Names and trademarks
            </h2>
            <p className="mt-3 text-fg-muted">
              Product and company names are used descriptively, to identify what is being written about. All trademarks
              remain the property of their owners. This site does not redistribute third-party logo artwork; resource
              marks are rendered as generated monograms for that reason.
            </p>
            <p className="mt-3 text-fg-muted">
              If you own a listed resource and want its entry corrected or removed,{" "}
              <Link href={site.contactUrl} className="text-fg underline underline-offset-2 hover:text-primary">
                open an issue
              </Link>{" "}
              and it will be dealt with.
            </p>
          </section>

          <section aria-labelledby="tools-terms-heading">
            <h2 id="tools-terms-heading" className="font-display text-xl font-semibold">
              The tools
            </h2>
            <p className="mt-3 text-fg-muted">
              The tools on this site run in your browser and are provided as-is. Keep your originals: a converter that
              runs locally is still software, and software has bugs. See{" "}
              <Link href="/privacy" className="text-fg underline underline-offset-2 hover:text-primary">
                Privacy
              </Link>{" "}
              for exactly how your files are handled.
            </p>
          </section>

          <section aria-labelledby="content-heading">
            <h2 id="content-heading" className="font-display text-xl font-semibold">
              Contributions
            </h2>
            <p className="mt-3 text-fg-muted">
              Submissions and reports are filed on a public repository, so anything you include in them is public. By
              contributing, you confirm the information is accurate to the best of your knowledge and that you are free to
              share it. Contributions that misrepresent a paid product as free will be rejected.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
