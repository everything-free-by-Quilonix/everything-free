import { tools } from "@/config/tools";
import { collections } from "@/data/collections";
import { getAlternativeTargets, getAllResourcesForClient } from "@/lib/repository";
import { buildLlmsTxt } from "@/lib/seo/llms";

/**
 * `/llms.txt` — a Markdown index of the library for AI assistants.
 * See `lib/seo/llms.ts`. Written once at build time.
 */
export const dynamic = "force-static";

export async function GET() {
  const [resources, alternatives] = await Promise.all([getAllResourcesForClient(), getAlternativeTargets()]);
  const body = buildLlmsTxt({
    resources,
    alternatives,
    tools: tools.filter((tool) => tool.status === "available"),
    collections,
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
