import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Breadcrumbs, Container } from "@/components/ui/layout";
import { SectionLink } from "@/components/ui/layout";
import { aiImageCommands, getAIImageCommand } from "@/data/ai-image-commands";
import { CommandDetailView } from "@/features/ai-image-commands/components/CommandDetailView";
import { CommandCard } from "@/features/ai-image-commands/components/CommandCard";
import { buildMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return aiImageCommands.map((command) => ({ id: command.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const command = getAIImageCommand(id);

  if (!command) {
    return buildMetadata({
      title: "Command not found",
      description: "This AI image prompt command does not exist in the library.",
      path: `/ai-image-commands/${id}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${command.command} — ${command.name} | AI Image Commands`,
    description: `${command.description} Verified prompt modifiers, syntax formulas, and platform compatibility for ChatGPT and Gemini.`,
    path: `/ai-image-commands/${command.id}`,
  });
}

export default async function CommandDetailPage({ params }: PageProps) {
  const { id } = await params;
  const command = getAIImageCommand(id);

  if (!command) notFound();

  // Find related commands in the same category
  const relatedCommands = aiImageCommands
    .filter((c) => c.category === command.category && c.id !== command.id)
    .slice(0, 3);

  return (
    <div className="pb-24">
      {/* Header Bar with Breadcrumbs */}
      <div className="border-b border-border bg-bg-subtle py-8">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "AI Image Commands", href: "/ai-image-commands" },
              { label: command.command },
            ]}
          />
        </Container>
      </div>

      <Container className="pt-10">
        <div className="mx-auto max-w-4xl flex flex-col gap-12">
          {/* Main Command Specifications */}
          <section aria-labelledby="command-specifications-heading">
            <h1 id="command-specifications-heading" className="sr-only">
              {command.name} ({command.command}) Prompt Command Specifications
            </h1>
            <CommandDetailView command={command} isModal={false} />
          </section>

          {/* Related Commands in same category */}
          {relatedCommands.length > 0 ? (
            <section
              aria-labelledby="related-commands-heading"
              className="pt-10 border-t border-border flex flex-col gap-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 id="related-commands-heading" className="font-display text-lg font-semibold text-fg">
                    More in {command.category}
                  </h2>
                  <p className="text-xs text-fg-muted mt-0.5">
                    Explore companion prompt modifiers and stylistic alternatives.
                  </p>
                </div>
                <SectionLink href="/ai-image-commands">All commands</SectionLink>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {relatedCommands.map((rel) => (
                  <CommandCard key={rel.id} command={rel} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
