import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Breadcrumbs, Container } from "@/components/ui/layout";
import { SectionLink } from "@/components/ui/layout";
import { getActivePrompts, getPromptById, getPromptStaticParams } from "@/data/ai-prompts/normalized-prompts";
import { PromptDetailView } from "@/features/ai-prompts/components/PromptDetailView";
import { PromptCard } from "@/features/ai-prompts/components/PromptCard";
import { buildMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getPromptStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const prompt = getPromptById(id);

  if (!prompt) {
    return buildMetadata({
      title: "Prompt not found",
      description: "This prompt record does not exist in the aggregated library.",
      path: `/ai-prompts/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${prompt.title} — AI Prompt (${prompt.sourceName}) | Everything.Free`,
    description: `${prompt.description || prompt.prompt.slice(0, 150)} Attributed to ${prompt.author || prompt.sourceName}.`,
    path: `/ai-prompts/${prompt.id}`,
  });
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { id } = await params;
  const prompt = getPromptById(id);

  if (!prompt) notFound();

  // Related prompts in the same category or source
  const relatedPrompts = getActivePrompts()
    .filter((p) => p.category === prompt.category && p.id !== prompt.id)
    .slice(0, 3);

  return (
    <div className="pb-24">
      {/* Header Bar with Breadcrumbs */}
      <div className="border-b border-border bg-bg-subtle py-8">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "AI Prompts", href: "/ai-prompts" },
              { label: prompt.title },
            ]}
          />
        </Container>
      </div>

      {/* Main Content */}
      <Container className="pt-8">
        <div className="mx-auto max-w-3xl">
          <PromptDetailView prompt={prompt} isModal={false} />
        </div>

        {/* Related Prompts in Category */}
        {relatedPrompts.length > 0 ? (
          <div className="mt-16 border-t border-border pt-12">
            <div className="mb-6 flex items-baseline justify-between">
              <div>
                <h3 className="text-lg font-semibold text-fg">
                  More {prompt.category} Prompts
                </h3>
                <p className="text-xs text-fg-muted">
                  Explore other open prompts indexed from verified datasets.
                </p>
              </div>
              <SectionLink href="/ai-prompts">View all prompts</SectionLink>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPrompts.map((rel) => (
                <PromptCard key={rel.id} prompt={rel} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
