/**
 * The command palette's jump index, built once at build time.
 *
 * Pure `.ts` with no JSX and no repository import: the route passes data read
 * through `@/lib/repository`, and the unit test passes the seed data, so both
 * build the same object. Everything here is derived with unchanged helpers.
 *
 * Evidence: a listing's free-status words are decided here with `factEvidence`,
 * exactly as the Facts ledger words them: the label when an official source
 * confirms it, "Listed as {label}" when it is only recorded. The browser prints
 * `f` verbatim and never upgrades it. `k` and `u` come from `factMeterCounts`,
 * the function the record page uses, and `t` is `FACTS.length` at build.
 *
 * Hrefs are stored without the base path; `router.push` adds it.
 */
import { audiences } from "@/config/audiences";
import { categoryGroups, categoryList, categoryName } from "@/config/categories";
import { getFreeStatus, listableFreeStatuses } from "@/config/free-status";
import { filterablePlatforms } from "@/config/platforms";
import { resourceTypeList } from "@/config/resource-types";
import { availableTools } from "@/config/tools";
import { factMeterCounts } from "@/features/resources/fact-meter-counts";
import { FACTS, factEvidence } from "@/lib/resources/evidence";
import { computeFacets } from "@/lib/search/filters";
import { buildResourcesHref } from "@/lib/search/params";
import type { Collection } from "@/types/collection";
import type { Resource } from "@/types/resource";

import type { PaletteIndex } from "./palette-index-schema";
import { HOME_SECTIONS, PALETTE_PAGES } from "./palette-search";

export function buildPaletteIndex(input: {
  resources: readonly Resource[];
  alternatives: readonly { name: string; slug: string; count: number }[];
  collections: readonly Collection[];
  now?: Date;
}): PaletteIndex {
  const { resources, alternatives, collections, now = new Date() } = input;
  const facets = computeFacets(resources, {});

  const firstGroup = (id: string) => categoryGroups.find((group) => group.categoryIds.includes(id))?.name ?? "";

  return {
    v: 1,
    t: FACTS.length,
    resources: resources.map((resource) => {
      const status = getFreeStatus(resource.freeStatus);
      const confirmed = factEvidence(resource, "freeStatus", now).state === "confirmed";
      const { confirmed: k, unsettled: u } = factMeterCounts(resource, now);
      return {
        s: resource.slug,
        n: resource.name,
        c: categoryName(resource.category),
        f: confirmed ? status.label : `Listed as ${status.label.toLowerCase()}`,
        k,
        u,
        o: resource.officialUrl,
      };
    }),
    subjects: categoryList.map((category) => ({
      s: category.slug,
      n: category.name,
      g: firstGroup(category.id),
      count: facets.categories[category.id] ?? 0,
    })),
    collections: collections.map((collection) => ({ s: collection.slug, n: collection.name })),
    tools: availableTools.map((tool) => ({ s: tool.slug, n: tool.name, available: true })),
    audiences: audiences.map((audience) => ({ s: audience.slug, n: audience.name })),
    alternatives: alternatives.map((target) => ({ s: target.slug, n: target.name, count: target.count })),
    // The fixed pages, then the homepage sections as `/#{id}` (Decision 5).
    pages: [...PALETTE_PAGES, ...HOME_SECTIONS.map((section) => ({ href: `/#${section.id}`, n: section.n }))],
    // Filter rows: the same labels the active-filter tokens print, with hrefs
    // from the unchanged URL builder. Evidence filters keep "· confirmed".
    filters: [
      ...listableFreeStatuses.map((status) => ({
        n: status.label,
        h: buildResourcesHref({ freeStatuses: [status.id] }),
      })),
      ...resourceTypeList.map((type) => ({ n: type.label, h: buildResourcesHref({ resourceTypes: [type.id] }) })),
      ...filterablePlatforms.map((platform) => ({
        n: platform.label,
        h: buildResourcesHref({ platforms: [platform.id] }),
      })),
      { n: "No credit card · confirmed", h: buildResourcesHref({ noCreditCardOnly: true }) },
      { n: "No account needed · confirmed", h: buildResourcesHref({ noAccountOnly: true }) },
      { n: "Commercial use allowed · confirmed", h: buildResourcesHref({ commercialUseOnly: true }) },
      { n: "Open source · confirmed", h: buildResourcesHref({ openSourceOnly: true }) },
    ],
  };
}
