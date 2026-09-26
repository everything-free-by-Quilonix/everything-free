import { Suspense } from "react";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { Container, PageHeader } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { issueTemplateUrls } from "@/features/community/compose";
import { ReportResourceForm } from "@/features/community/components/report-form";
import { getAllResourcesForClient } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Report a problem",
  description:
    "Report a broken link, a changed free plan or incorrect information on an Everything.Free listing. Corrections are the most valuable contribution to the library.",
  path: "/report",
  // The page only makes sense in context and its content varies by query string.
  noIndex: true,
});

/**
 * Report route.
 *
 * Statically generated. The `?resource=` slug is read in the browser rather than
 * from server-side `searchParams`, which is what keeps this page a static file.
 * A build-time slug-to-name map is passed down so the form can still name the
 * resource being reported and reject an unknown slug.
 */
export default async function ReportPage() {
  const resources = await getAllResourcesForClient();
  const resourceNames = Object.fromEntries(resources.map((resource) => [resource.slug, resource.name]));

  return (
    <div className="pb-16">
      <PageHeader
        title="Report a problem"
        description="A wrong entry is worse than a missing one. If something here is out of date or inaccurate, telling us is the single most useful thing you can do."
      />

      <Container width="prose" className="pt-10">
        <Callout tone="info" icon="info" className="mb-8">
          Free plans change without notice, and this library will always lag behind reality somewhere. Reports are how
          that gap gets closed.
        </Callout>

        {/*
          The form reads `?resource=` with `useSearchParams`, so at build time only
          this fallback is written into the HTML. That makes the fallback the no-JS
          experience, and it has to be useful on its own: the GitHub issue form
          collects the same fields, so it is offered here rather than left inside
          the suspended form where it would never render.
        */}
        <Suspense
          fallback={
            <>
              <noscript>
                <Callout tone="info" icon="info" title="This form needs JavaScript">
                  You can report the same problem through GitHub&rsquo;s issue form instead, which collects the identical
                  fields.{" "}
                  <a
                    href={issueTemplateUrls.correction}
                    className="text-fg underline underline-offset-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report a problem on GitHub
                  </a>
                </Callout>
              </noscript>
              <Skeleton className="h-96 w-full rounded-xl" />
            </>
          }
        >
          <ReportResourceForm resourceNames={resourceNames} />
        </Suspense>
      </Container>
    </div>
  );
}
