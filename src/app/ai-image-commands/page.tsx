import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui/layout";
import { Callout } from "@/components/ui/callout";
import { aiImageCommands, getCommandLibraryStats } from "@/data/ai-image-commands";
import { CommandExplorer } from "@/features/ai-image-commands/components/CommandExplorer";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "AI Image Prompt Commands — ChatGPT & Gemini | Everything.Free",
  description:
    "Explore a curated library of AI image prompt modifiers, visual styles, photography effects, artistic techniques and creative presets for ChatGPT and Gemini.",
  path: "/ai-image-commands",
});

export default function AIImageCommandsPage() {
  const stats = getCommandLibraryStats();

  return (
    <div className="pb-20">
      <PageHeader
        kicker="Free AI Hub"
        title="Free AI Prompts, Commands & Plugins"
        description="Ready-to-use prompt templates, creative visual styles, and free tools for ChatGPT and Google Gemini. Zero complicated setup — just copy and paste into your chat."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-fg-subtle">
          <div>
            <span className="font-semibold text-fg tabular-nums">{stats.total}</span> verified image styles
          </div>
          <span aria-hidden="true">•</span>
          <div>
            Ready for <span className="font-medium text-fg">ChatGPT</span>, <span className="font-medium text-fg">Gemini</span> & <span className="font-medium text-fg">Claude</span>
          </div>
          <span aria-hidden="true">•</span>
          <div>
            100% Free to use
          </div>
        </div>
      </PageHeader>

      <Container className="pt-10">
        <div className="flex flex-col gap-10">
          {/* Methodology Guidance Callout */}
          <div className="grid gap-4 md:grid-cols-2">
            <Callout tone="neutral" icon="info" title="How to use these prompts">
              <p className="text-xs leading-relaxed text-fg-muted">
                ChatGPT and Google Gemini do not need complicated coding. Just click <strong>Copy</strong> on any
                card below, then paste it directly into your prompt. You get clean, professional results instantly.
              </p>
            </Callout>

            <Callout tone="neutral" icon="shield-check" title="Tested & Safe to Use">
              <p className="text-xs leading-relaxed text-fg-muted">
                Every style and command is tested against current AI models. We use carefully crafted descriptive words
                so you never get blocked by AI safety filters or trademark restrictions.
              </p>
            </Callout>
          </div>

          {/* Interactive Explorer */}
          <CommandExplorer initialCommands={aiImageCommands} />
        </div>
      </Container>
    </div>
  );
}
