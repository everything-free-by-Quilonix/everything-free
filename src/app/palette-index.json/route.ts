import { buildPaletteIndex } from "@/features/palette/build-palette-index";
import { getAlternativeTargets, getAllResourcesForClient, getCollections } from "@/lib/repository";

/**
 * The command palette's jump index, written once at build time.
 *
 * Read through the repository only, and built by the same pure function the unit
 * tests call, so what the palette offers is what the site renders. Fetched by the
 * browser on first open (same origin, so `connect-src 'self'` allows it). Not
 * linked from the sitemap.
 */
export const dynamic = "force-static";

export async function GET() {
  const [resources, alternatives, collections] = await Promise.all([
    getAllResourcesForClient(),
    getAlternativeTargets(),
    getCollections(),
  ]);
  return Response.json(buildPaletteIndex({ resources, alternatives, collections }));
}
