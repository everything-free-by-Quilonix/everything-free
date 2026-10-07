import Link from "next/link";
import { Icon } from "@/components/icons";
import { stretchedLink } from "@/components/ui/card";
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
const GROUP_THEMES: Record<string, { iconBg: string; text: string; border: string }> = {
  everyday: { iconBg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  study: { iconBg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  work: { iconBg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  developer: { iconBg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  creative: { iconBg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  business: { iconBg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  media: { iconBg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  life: { iconBg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
};

export function CategoryGroupCard({ group, previewCount = 5 }: { group: CategoryGroup; previewCount?: number }) {
  const categories = getCategoriesInGroup(group.id);
  const preview = categories.slice(0, previewCount);
  const remaining = categories.length - preview.length;
  const theme = GROUP_THEMES[group.id] ?? {
    iconBg: "bg-surface-raised",
    text: "text-fg",
    border: "border-border",
  };

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-md",
        "border border-border/60 bg-surface/75 dark:bg-surface/35 p-5",
        "transition-colors hover:border-border-strong hover:bg-surface-raised/90",
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-md border shadow-2xs",
                theme.iconBg,
                theme.text,
                theme.border,
              )}
            >
              <Icon name={group.icon} size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-fg-muted">
                <Link href={`/categories#${group.id}`} className={cn("rounded-xs", stretchedLink)}>
                  {group.name}
                </Link>
              </h3>
              <p className="text-[11px] font-medium text-fg-subtle">
                {categories.length} categories
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-fg-subtle/40 transition-colors group-hover:bg-surface-raised group-hover:text-fg"
          >
            <Icon name="arrow-up-right" size={13} />
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-fg-muted">{group.description}</p>
      </div>

      <ul className="relative mt-4 flex flex-wrap gap-1.5 pt-2">
        {preview.map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className="inline-block rounded-md border border-border/50 bg-bg-subtle/80 px-2 py-0.5 text-[11px] font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              {category.name}
            </Link>
          </li>
        ))}
        {remaining > 0 ? (
          <li className="inline-flex items-center px-1 text-[11px] font-medium text-fg-subtle">
            +{remaining} more
          </li>
        ) : null}
      </ul>
    </article>
  );
}

/** Compact category link with an optional result count. */
export function CategoryLink({ category, count }: { category: Category; count?: number }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex items-baseline justify-between gap-3 rounded-md border border-border bg-surface px-3.5 py-3 transition-colors hover:border-border-strong hover:bg-surface-raised"
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
