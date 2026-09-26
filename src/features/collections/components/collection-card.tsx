import Link from "next/link";
import { Icon } from "@/components/icons";
import { Card, stretchedLink } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { Collection } from "@/types/collection";

export function CollectionCard({ collection }: { collection: Collection }) {
  const count = collection.resourceSlugs.length;

  return (
    <Card as="article" interactive className="flex h-full flex-col p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-fg-muted"
        >
          <Icon name={collection.icon} size={19} />
        </span>
        <h3 className="font-display text-base leading-tight font-semibold">
          <Link href={`/collections/${collection.slug}`} className={cn("rounded", stretchedLink)}>
            {collection.name}
          </Link>
        </h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{collection.shortDescription}</p>

      <p className="mt-auto pt-4 text-xs text-fg-subtle">
        {count} {count === 1 ? "resource" : "resources"} · Editorial selection
      </p>
    </Card>
  );
}
