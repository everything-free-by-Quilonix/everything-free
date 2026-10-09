import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { JsonLdScript } from "@/components/seo/json-ld";
import { Card, stretchedLink } from "@/components/ui/card";
import { Breadcrumbs, Container } from "@/components/ui/layout";
import { AiFinder } from "@/features/ai/components/ai-finder";
import { FINDER_CATEGORIES } from "@/features/ai/finder";
import { chatModels, formatMegabytes, MAX_DOWNLOAD_MB } from "@/features/ai/models";
import { getAllResourcesForClient } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Free AI: which one should I use?",
  description:
    "Find a free AI tool for the job, from the library's listings with their limits and evidence — or chat with an open-source model that runs privately in your browser.",
  path: "/ai",
});

/**
 * The AI section.
 *
 * Two things, both free to run: a finder over the library's own AI listings, and
 * a link to the on-device chat. The finder receives only AI listings, so the page
 * does not ship the whole library to the browser.
 */
export default async function AiPage() {
  const all = await getAllResourcesForClient();
  const aiResources = all.filter(
    (resource) =>
      FINDER_CATEGORIES.includes(resource.category) ||
      resource.subcategories.some((sub) => FINDER_CATEGORIES.includes(sub)),
  );
  const smallest = Math.min(...chatModels.map((model) => model.downloadMB));

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-10">
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Free AI" }]} />
          <h1 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">Which free AI should I use?</h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-fg-muted">
            Pick the job and the finder shows the free options in the library, each with its limits written down and
            how much of it has been checked. Or skip the sign-ups and chat with a model that runs on your own device.
          </p>
        </Container>
      </header>

      <Container className="pt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card as="article" interactive className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-base font-semibold">
                <Link href="/tools/private-ai-chat" className={cn("rounded-xs", stretchedLink)}>
                  Private AI chat
                </Link>
              </h2>
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-fg-subtle" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Open-source models running in your browser. No account, no key, no limits, and messages never leave your
              device. Downloads from {formatMegabytes(smallest)} to under {formatMegabytes(MAX_DOWNLOAD_MB)}, once.
            </p>
            <p className="mt-auto pt-3 text-xs text-fg-subtle">Needs a recent desktop browser with WebGPU.</p>
          </Card>

          <Card as="article" interactive className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-base font-semibold">
                <Link href="/ai-prompts" className={cn("rounded-xs", stretchedLink)}>
                  Prompts to start from
                </Link>
              </h2>
              <Icon name="arrow-right" size={16} className="mt-0.5 shrink-0 text-fg-subtle" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Openly licensed prompt libraries, with their sources credited, and a reference of image-prompt commands.
            </p>
          </Card>
        </div>

        <div className="mt-12">
          <AiFinder resources={aiResources} />
        </div>
      </Container>

      <JsonLdScript
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Free AI", path: "/ai" },
        ])}
      />
    </div>
  );
}
