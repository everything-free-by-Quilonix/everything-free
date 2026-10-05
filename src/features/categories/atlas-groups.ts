/**
 * The Atlas Index data: the eight groups in config order, each subject with
 * its listing count (0 when absent). Pure, and kept apart from the component
 * so the `/categories` filter island receives plain data and never bundles the
 * category config.
 */
import { categoryGroups, getCategoriesInGroup } from "@/config/categories";

import type { AtlasGroup } from "./components/atlas-index";

export function atlasGroups(counts: Readonly<Record<string, number>>): AtlasGroup[] {
  return categoryGroups.map((group) => ({
    id: group.id,
    name: group.name,
    subjects: getCategoriesInGroup(group.id).map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      count: counts[category.id] ?? 0,
    })),
  }));
}
