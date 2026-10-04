import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/ui/callout";
import { Container } from "@/components/ui/layout";
import { CompareView } from "@/features/compare/compare-view";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Quick Compare. A static shell: the view reads `r` and `diff` from the URL and
 * the compare index in the browser, so the build writes only the Suspense
 * fallback into the HTML. That fallback is the honest no-JS state: the title
 * and a notice with a way on. `noIndex`, canonical `/compare/`, and not in the
 * sitemap: every comparison is a query over listings that are indexed already.
 */
export const metadata: Metadata = buildMetadata({
  title: "Compare listings",
  description: "Compare two or three free resources side by side, with the evidence for every value.",
  path: "/compare",
  noIndex: true,
});

function NoScriptShell() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Compare listings</h1>
      <noscript>
        <Callout tone="neutral" icon={null} title="Comparison needs JavaScript">
          Open each listing instead to see its facts and evidence.{" "}
          <Link href="/resources" className="link-inline rounded-xs">
            Browse the library
          </Link>
        </Callout>
      </noscript>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Container className="pt-10 pb-24">
      <Suspense fallback={<NoScriptShell />}>
        <CompareView />
      </Suspense>
    </Container>
  );
}
