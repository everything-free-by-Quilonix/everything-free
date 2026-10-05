import { getAllResourcesForClient } from "@/lib/repository";
import { buildLlmsFullTxt } from "@/lib/seo/llms";

/**
 * `/llms-full.txt` — every listing with its limitations and per-fact evidence, as
 * Markdown, for AI assistants. See `lib/seo/llms.ts`. Written once at build time.
 */
export const dynamic = "force-static";

export async function GET() {
  const resources = await getAllResourcesForClient();
  return new Response(buildLlmsFullTxt({ resources }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
