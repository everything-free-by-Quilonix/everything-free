import type { Metadata } from "next";

import { Breadcrumbs, Container } from "@/components/ui/layout";
import { EntertainmentHub } from "@/features/entertainment/components/entertainment-hub";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Play and watch here",
  description:
    "Three small games that run in your browser, public-domain films from the Internet Archive, live internet radio and excerpts of classic books — nothing third-party loads until you press play.",
  path: "/entertainment/on-site",
});

export default function OnSitePage() {
  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Entertainment", href: "/entertainment" }, { label: "Play and watch here" }]} />
          <h1 className="mt-6 font-serif text-3xl font-semibold">Play and watch here</h1>
          <p className="mt-3 max-w-(--measure-standfirst) text-lg leading-relaxed text-fg-muted">
            The games are this site&rsquo;s own and run on your device. Films play in the Internet Archive&rsquo;s player and
            radio streams come straight from each station — neither connects until you press play.
          </p>
        </Container>
      </header>
      <Container className="pt-10">
        <EntertainmentHub />
      </Container>
    </div>
  );
}
