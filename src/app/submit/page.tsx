import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { Container, PageHeader } from "@/components/ui/layout";
import { SubmitResourceForm } from "@/features/community/components/submit-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Submit a resource",
  description:
    "Add a free resource to the Everything.Free library. Submissions need a working official link, an accurate free status and an honest account of the limitations.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Submit a resource"
        description="The library is built by the people who use it. Good submissions take a few minutes and save everyone else an hour."
      />

      <Container className="pt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="min-w-0">
            <SubmitResourceForm />
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <Card className="p-5">
              <h2 className="font-display text-sm font-semibold">What gets accepted</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
                <li>A genuinely free way to use it exists, and you can point to where that is stated.</li>
                <li>The link is the provider&rsquo;s own, not a mirror, aggregator or affiliate URL.</li>
                <li>The free status is described accurately — a trial is labelled a trial.</li>
                <li>The limitations are written down, including the inconvenient ones.</li>
              </ul>
            </Card>

            <Card className="p-5">
              <h2 className="font-display text-sm font-semibold">What does not</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
                <li>Paid products with a trial presented as free.</li>
                <li>Anything requiring a licence key from an unofficial source.</li>
                <li>Content that infringes copyright or circumvents paid access.</li>
                <li>Your own product submitted without disclosing that it is yours.</li>
              </ul>
            </Card>

            <Callout tone="neutral" icon="info">
              Unsure how a status should be classified?{" "}
              <Link href="/free-status" className="text-fg underline underline-offset-2 hover:text-primary">
                Read the definitions
              </Link>
              .
            </Callout>
          </aside>
        </div>
      </Container>
    </div>
  );
}
