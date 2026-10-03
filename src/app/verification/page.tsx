import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import { Container, PageHeader } from "@/components/ui/layout";
import { site } from "@/config/site";
import {
  VERIFICATION_FRESHNESS_DAYS,
  verificationCheckList,
  verificationList,
  verificationStage,
} from "@/config/verification";
import { getAllResourcesForClient } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "How verification works",
  description:
    "What each verification status on Everything.Free means, what gets checked, who signs it off, how long a check stays current, and where the library stands today.",
  path: "/verification",
});

export default async function VerificationPage() {
  const resources = await getAllResourcesForClient();
  const stages = resources.map((resource) => verificationStage(resource));
  const count = (...wanted: ReturnType<typeof verificationStage>[]) => stages.filter((s) => wanted.includes(s)).length;
  const counts = {
    total: resources.length,
    verified: count("verified"),
    awaitingSignOff: count("awaiting-sign-off"),
    partial: count("partial"),
    notStarted: count("not-started", "started"),
  };

  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Trust"
        title="How verification works"
        description="A directory is only as useful as your ability to tell how much of it to believe. Every listing carries a verification status and the date it was last checked."
      />

      <Container width="prose" className="pt-10">
        <div className="flex flex-col gap-5">
          {verificationList.map((status) => (
            <Card key={status.id} className="p-6">
              <Badge tone={status.tone} size="md">
                {status.label}
              </Badge>
              <h2 className="mt-4 font-display text-lg font-semibold">{status.summary}</h2>
              <p className="mt-2 leading-relaxed text-fg-muted">{status.definition}</p>
            </Card>
          ))}
        </div>

        <section className="mt-14" aria-labelledby="freshness-heading">
          <h2 id="freshness-heading" className="font-display text-xl font-semibold">
            Verifications expire
          </h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            Free plans change quietly. A check older than {VERIFICATION_FRESHNESS_DAYS} days is automatically shown as{" "}
            <strong className="text-fg">needs re-checking</strong>, whatever the stored status says. The badge you see is
            computed from the date, so a stale listing cannot keep displaying a confident claim it no longer earns.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="checklist-heading">
          <h2 id="checklist-heading" className="font-display text-xl font-semibold">
            The checklist
          </h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            Verification is not one judgement, it is a list of separate facts. Each resource page shows which of these
            were confirmed against an official source and which are still outstanding, so you can see the shape of what
            is known rather than trusting a single badge.
          </p>

          <ul className="mt-5 flex flex-col divide-y divide-border">
            {verificationCheckList.map((check) => (
              <li key={check.id} className="py-3">
                <div className="min-w-0">
                  {check.requiredForVerified ? (
                    <p className="mb-0.5 text-xs font-medium text-fg-subtle">Required for Verified</p>
                  ) : null}
                  <p className="text-sm font-medium text-fg">
                    {check.label}
                    {check.requiredForVerified ? null : (
                      <span className="ml-2 text-xs font-normal text-fg-subtle">not required for Verified</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-fg-muted">{check.question}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm leading-relaxed text-fg-muted">
            A listing may only claim <strong className="text-fg">Verified</strong> once every required check is
            confirmed against an official source, each with the page and the date it was read, and a maintainer has
            signed it off. <strong className="text-fg">Partially verified</strong> means at least the free status itself
            was confirmed that way. These rules are enforced when the site is built — an entry that claims more than its
            evidence supports fails the build rather than shipping.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="human-heading">
          <h2 id="human-heading" className="font-display text-xl font-semibold">
            A person signs off every Verified badge
          </h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            Scripts and AI-assisted research can find official pages and record what they say, and that evidence is kept
            and shown. But a listing is only marked <strong className="text-fg">Verified</strong> when a maintainer has
            re-opened the sources and put their own GitHub handle on it. Maintainers are listed in a register in the
            repository, and each adds their own name to it. The build enforces both: no tool, script or assistant can
            award the badge by itself, and nobody outside the register can either.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="seed-heading">
          <h2 id="seed-heading" className="font-display text-xl font-semibold">
            Where the library stands
          </h2>
          {/* Counted from the data at build time, so this cannot drift from what
              the resource pages actually show. */}
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { term: "Verified", value: counts.verified },
              { term: "Evidence complete, awaiting sign-off", value: counts.awaitingSignOff },
              { term: "Partially verified", value: counts.partial },
              { term: "Free status not yet confirmed", value: counts.notStarted },
            ].map((item) => (
              <div key={item.term} className="rounded-sm border border-border bg-surface p-4">
                <dt className="text-xs text-fg-muted">{item.term}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                  {item.value}
                  <span className="ml-1 text-sm font-normal text-fg-subtle">of {counts.total}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Callout tone="info" icon="info" className="mt-4">
            <p>
              The library was compiled from each project&rsquo;s own public documentation, which is a reasonable basis
              but not the same as working through the checklist above. Until a listing&rsquo;s checks are recorded it is
              shown as <strong className="text-fg">Unverified</strong>, with no verification date, and its page says how
              it was compiled. The aim is the most trustworthy library, not the largest one, so an honest
              &ldquo;not checked yet&rdquo; is preferred to a badge the evidence does not support.
            </p>
            <p className="mt-2">
              Entries with recorded evidence show every check, the page it came from and the date it was read. Where a fact
              could not be established from an official source, the entry says so rather than guessing. Awarding the badge
              without that work would have taken one line of code and destroyed the only thing that makes it worth
              displaying.
            </p>
          </Callout>
        </section>

        <section className="mt-12" aria-labelledby="help-heading">
          <h2 id="help-heading" className="font-display text-xl font-semibold">
            Verifying an entry
          </h2>
          <ol className="mt-4 flex list-none flex-col gap-3">
            {[
              "Open the provider's own pricing, licence or documentation pages — not a review, a blog post or a summary.",
              "Work through the checklist above. For each fact, write down what the source actually says.",
              "Record the URL of every page you read, and the date you read it.",
              "If a source settles a fact, mark it confirmed. If you looked and could not settle it, mark it unresolved and say why — never guess.",
              "Open a pull request, or a report if you cannot edit the data yourself. A maintainer signs off Verified.",
            ].map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-relaxed">
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-fg-muted"
                >
                  {index + 1}
                </span>
                <span className="text-fg-muted">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm text-fg-muted">
            The full process, including how to record evidence, is in{" "}
            <ExternalLink
              href={`${site.repositoryUrl}/blob/main/docs/verification.md`}
              className="link-inline"
            >
              docs/verification.md
            </ExternalLink>
            . Found something out of date?{" "}
            <Link href="/report" className="link-inline">
              Report it
            </Link>
            .
          </p>
        </section>
      </Container>
    </div>
  );
}
