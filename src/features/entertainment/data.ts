import { getAllResourcesForClient } from "@/lib/repository";
import { discoveryLabels, type DiscoveryLabel } from "@/lib/entertainment/labels";
import { shelfResources } from "@/lib/entertainment/query";
import { entertainmentSignals } from "@/lib/entertainment/signals";
import type { Resource } from "@/types/resource";

/**
 * Server-side reads for the entertainment pages.
 *
 * Labels are computed once at build time and handed to the browser, so a label's
 * condition is evaluated in one place and the static HTML and the hydrated page
 * agree. They are as fresh as the last deploy.
 */
export async function getEntertainmentResources(shelf?: string): Promise<Resource[]> {
  return shelfResources(await getAllResourcesForClient(), shelf);
}

export function labelsFor(resources: readonly Resource[], now: Date = new Date()): Record<string, DiscoveryLabel[]> {
  return Object.fromEntries(resources.map((r) => [r.slug, discoveryLabels(r, entertainmentSignals, now)]));
}
