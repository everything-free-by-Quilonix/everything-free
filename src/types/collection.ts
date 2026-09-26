import type { IconName } from "@/components/icons";

/**
 * A hand-built list of resources that solve one problem together.
 *
 * Collections are editorial, and labelled as such. They are the one place where
 * Everything.Free expresses an opinion, so each one carries a `rationale`
 * explaining the basis for the selection.
 */
export interface Collection {
  id: string;
  slug: string;
  name: string;
  /** One line, used on cards. */
  shortDescription: string;
  /** Longer framing shown at the top of the collection page. */
  longDescription: string;
  /** Why these specific resources, and on what basis they were chosen. */
  rationale: string;
  icon: IconName;
  /** Resource slugs, in a deliberate order. */
  resourceSlugs: string[];
  updatedAt: string;
}
