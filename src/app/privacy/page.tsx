import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { Container, PageHeader } from "@/components/ui/layout";
import { site } from "@/config/site";
import { availableTools } from "@/config/tools";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description:
    "What Everything.Free stores, what it does not, and how the browser-based tools handle your files. No analytics, no tracking, no accounts.",
  path: "/privacy",
});

/**
 * Privacy statement.
 *
 * Written to describe what the application actually does at this milestone. Every
 * claim here is verifiable from the source: there is no analytics script, no
 * account system, no cookie beyond the theme preference, and the tools are
 * implemented client-side.
 *
 * It is deliberately not a legal template. If tracking, accounts or server-side
 * tools are ever added, this page has to change in the same commit.
 */
export default function PrivacyPage() {
  const localToolCount = availableTools.filter(
    (tool) => tool.processing.location === "browser" && !tool.processing.leavesDevice,
  ).length;

  return (
    <div className="pb-16">
      <PageHeader
        title="Privacy"
        description="What this site does and does not do with your data, described in terms you can check against the source code."
      />

      <Container width="prose" className="pt-10">
        <Callout tone="success" icon="lock" title="The short version">
          No analytics, no tracking scripts, no advertising, no accounts, and no third-party embeds. All{" "}
          {localToolCount} available tools run entirely in your browser, so the files and text you put into them never
          reach a server.
        </Callout>

        <div className="mt-10 flex flex-col gap-10 leading-relaxed">
          <section aria-labelledby="collect-heading">
            <h2 id="collect-heading" className="font-display text-xl font-semibold">
              What is stored about you
            </h2>
            <p className="mt-3 text-fg-muted">
              One thing: your light or dark theme choice, kept in your browser&rsquo;s local storage under a single key.
              It never leaves your device and is not an identifier. Clearing site data removes it.
            </p>
            <p className="mt-3 text-fg-muted">
              There are no cookies, no accounts, no profiles and no advertising or analytics identifiers. Nothing you do
              here is linked to anything you do elsewhere.
            </p>
          </section>

          <section aria-labelledby="tools-heading">
            <h2 id="tools-heading" className="font-display text-xl font-semibold">
              The tools
            </h2>
            <p className="mt-3 text-fg-muted">
              Every tool currently on this site processes your input in your own browser using standard web APIs. Images
              are decoded and re-encoded locally; text is transformed locally; colour calculations are arithmetic. No
              file, and no part of a file, is uploaded.
            </p>
            <p className="mt-3 text-fg-muted">
              You do not have to take that on trust. Open your browser&rsquo;s network panel while using a tool, or
              disconnect from the internet once the page has loaded — the tools keep working.
            </p>
            <p className="mt-3 text-fg-muted">
              Each tool declares where its processing happens in the project&rsquo;s tool registry, and that declaration
              is validated when the site is built: a tool cannot claim local processing while also sending data away. If
              a future tool does need a server, its page will say so before you use it.
            </p>
          </section>

          <section aria-labelledby="external-heading">
            <h2 id="external-heading" className="font-display text-xl font-semibold">
              Links to other sites
            </h2>
            <p className="mt-3 text-fg-muted">
              This library is mostly links. Once you click through to a provider&rsquo;s site, you are subject to their
              privacy practices, not these — and many of them do track visitors.
            </p>
            <p className="mt-3 text-fg-muted">
              Outbound links carry <code className="rounded bg-surface-raised px-1 py-0.5 text-xs">noreferrer</code>, so
              the page you came from is not passed along. Fonts are self-hosted rather than loaded from a font CDN, which
              means visiting a page here does not create a request to a third party.
            </p>
          </section>

          <section aria-labelledby="forms-heading">
            <h2 id="forms-heading" className="font-display text-xl font-semibold">
              Submissions and reports
            </h2>
            <p className="mt-3 text-fg-muted">
              The{" "}
              <Link href="/submit" className="text-fg underline underline-offset-2 hover:text-primary">
                submission
              </Link>{" "}
              and{" "}
              <Link href="/report" className="text-fg underline underline-offset-2 hover:text-primary">
                report
              </Link>{" "}
              forms check what you enter in your own browser and then hand you back a prefilled issue for the public
              project repository. Nothing is sent to Everything.Free — there is no server to send it to — and nothing is
              filed until you choose to open that link.
            </p>
            <p className="mt-3 text-fg-muted">
              Because the destination is a public repository, anything you include becomes public. The optional email
              field exists only so a maintainer can follow up; leave it blank if you would rather not share it.
            </p>
          </section>

          <section aria-labelledby="hosting-heading">
            <h2 id="hosting-heading" className="font-display text-xl font-semibold">
              Hosting
            </h2>
            <p className="mt-3 text-fg-muted">
              Serving a web page necessarily involves your IP address reaching the host, and hosting providers keep
              operational logs. Everything.Free does not add any tracking on top of that and does not process those logs
              to profile visitors.
            </p>
          </section>

          <section aria-labelledby="changes-heading">
            <h2 id="changes-heading" className="font-display text-xl font-semibold">
              Changes
            </h2>
            <p className="mt-3 text-fg-muted">
              This page describes the current behaviour of the site. Because the project is open source, any change to
              what it does is visible in the commit that makes it — and this page is expected to change in the same
              commit.
            </p>
            <p className="mt-3 text-fg-muted">
              Questions or concerns can be raised on{" "}
              <Link href={site.contactUrl} className="text-fg underline underline-offset-2 hover:text-primary">
                the project issue tracker
              </Link>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
