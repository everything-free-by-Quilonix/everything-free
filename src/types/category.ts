import type { IconName } from "@/components/icons";

/**
 * Category taxonomy.
 *
 * Categories are a *flat* set with globally unique slugs. Groups are curated
 * orderings that reference category ids.
 *
 * The reason: several categories legitimately belong under more than one
 * heading. "Books" is both an education and a media topic; "Music" is both
 * creative and entertainment. Nesting categories inside groups would force
 * duplicate entries, which means duplicate URLs for the same content — bad for
 * users and actively harmful for SEO. A flat set with many-to-many group
 * membership gives exactly one canonical page per category.
 */
export interface Category {
  id: string;
  /** URL segment under `/categories/`. */
  slug: string;
  name: string;
  /** Shown on the category page and in metadata descriptions. */
  description: string;
  /** Groups this category appears under. At least one. */
  groups: CategoryGroupId[];
}

export const CATEGORY_GROUP_IDS = [
  "general",
  "education",
  "creative",
  "ai",
  "development",
  "business",
  "media",
  "life",
] as const;

export type CategoryGroupId = (typeof CATEGORY_GROUP_IDS)[number];

export interface CategoryGroup {
  id: CategoryGroupId;
  name: string;
  description: string;
  icon: IconName;
  /** Category ids, in the order they should be presented. */
  categoryIds: string[];
}

/**
 * An audience-shaped entry point ("For Students", "For Developers", …).
 *
 * Audiences are not a third taxonomy: each one resolves to an ordinary library
 * query, so they stay consistent with the rest of the site automatically.
 */
export interface Audience {
  id: string;
  slug: string;
  name: string;
  /** Sentence describing who this is for. */
  description: string;
  icon: IconName;
  /** Categories that define this audience's slice of the library. */
  categoryIds: string[];
  /** Tags that also qualify a resource for this audience. */
  tags: string[];
}
