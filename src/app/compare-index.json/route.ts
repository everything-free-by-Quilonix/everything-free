import { buildCompareIndex } from "@/features/compare/build-compare-index";
import { getAllResourcesForClient } from "@/lib/repository";

/**
 * The Quick Compare index, written once at build time.
 *
 * Every evidence field is computed here by `factEvidence` and `hasRecordedValue`
 * through the same pure builder the unit tests call; the browser never derives
 * evidence. Fetched only by `/compare/` (same origin, so `connect-src 'self'`
 * allows it). Not linked from the sitemap.
 */
export const dynamic = "force-static";

export async function GET() {
  const resources = await getAllResourcesForClient();
  return Response.json(buildCompareIndex(resources));
}
