import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui/layout";
import { EntertainmentHub } from "@/features/entertainment/components/entertainment-hub";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Entertainment & Media",
  description:
    "Free public domain cartoons, cinema, live worldwide radio streaming, classic books and in-browser games. 100% legal, ad-free and playable right here.",
  path: "/entertainment",
});

export default function EntertainmentPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Entertainment & Media"
        description="Public-domain cartoons, classic cinema, live streaming radio and retro games you can enjoy directly in your browser. Zero ads, zero accounts, completely free."
      />

      <Container className="pt-10">
        <EntertainmentHub />
      </Container>
    </div>
  );
}
