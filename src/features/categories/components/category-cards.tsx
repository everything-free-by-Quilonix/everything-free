import Link from "next/link";
import { Icon } from "@/components/icons";
import { Card, stretchedLink } from "@/components/ui/card";
import { getCategoriesInGroup } from "@/config/categories";
import { cn } from "@/lib/utils/cn";
import type { Category, CategoryGroup } from "@/types/category";

/**
 * A category group as a card, with a few of its categories listed inside.
 *
 * The inner category links are real links, so the card cannot use a single
 * stretched link over the whole surface — that would swallow them. Instead the
 * group heading is the stretched link and the inner links are raised above it with
 * `relative`. Both remain independently focusable and announced.
 */
export function CategoryGroupCard({ group, previewCount = 5 }: { group: CategoryGroup; previewCount?: number }) {
  const categories = getCategoriesInGroup(group.id);
  const preview = categories.slice(0, previewCount);
  const remaining = categories.length - preview.length;

  return (
    <Card as="article" interactive className="flex h-full flex-col p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-border bg-surface-raised text-fg-muted"
        >
          <Icon name={group.icon} size={19} />
        </span>
        <h3 className="font-display text-base font-semibold">
          <Link href={`/categories#${group.id}`} className={cn("rounded", stretchedLink)}>
            {group.name}
          </Link>
        </h3>
      </div>

      <p className="mt-3 text-sm text-fg-muted">{group.description}</p>

      <ul className="relative mt-4 flex flex-wrap gap-1.5">
        {preview.map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className="inline-block rounded-xs border border-border bg-bg-subtle px-2 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              {category.name}
            </Link>
          </li>
        ))}
        {remaining > 0 ? (
          <li className="inline-flex items-center px-1 text-xs text-fg-subtle">+{remaining} more</li>
        ) : null}
      </ul>
    </Card>
  );
}

/** Compact category link with an optional result count. */
export function CategoryLink({ category, count }: { category: Category; count?: number }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex items-baseline justify-between gap-3 rounded-sm border border-border bg-surface px-3.5 py-3 transition-colors hover:border-border-strong hover:bg-surface-raised"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-fg">{category.name}</span>
        <span className="mt-0.5 block truncate text-xs text-fg-subtle">{category.description}</span>
      </span>
      {count !== undefined ? (
        <span className="shrink-0 text-xs text-fg-subtle tabular-nums">
          {count}
          <span className="sr-only"> resources</span>
        </span>
      ) : null}
    </Link>
  );
}
