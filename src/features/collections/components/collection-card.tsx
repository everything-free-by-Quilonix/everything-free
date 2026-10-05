import Link from "next/link";
import { countNoun } from "@/features/home/census";
import type { Collection } from "@/types/collection";

/**
 * A collection as an editorial index row: serif name, one-line standfirst and
 * its listing count. Ruled by its list, not boxed.
 *
 * When to use: inside a ruled list (`divide-y`) of collections. When not to use:
 * as a standalone card or tile.
 *
 * Keyboard: one link, the name.
 *
 * Evidence: a collection is an editorial selection; the row claims nothing
 * about any listing's facts.
 */
export function CollectionCard({ collection }: { collection: Collection }) {
  const count = collection.resourceSlugs.length;

  return (
    <div className="py-4">
      <h3 className="font-serif text-xl font-semibold">
        <Link
          href={`/collections/${collection.slug}`}
          className="rounded-xs underline-offset-[0.2em] hover:underline"
        >
          {collection.name}
        </Link>
      </h3>
      <p className="mt-1 max-w-(--measure-standfirst) text-sm text-fg-muted">{collection.shortDescription}</p>
      <p className="mt-2 text-xs text-fg-subtle">
        <span className="tabular-nums">{countNoun(count, "listing", "listings")}</span> · Editorial selection
      </p>
    </div>
  );
}
