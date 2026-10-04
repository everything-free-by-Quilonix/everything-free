import Link from "next/link";
import { Icon } from "@/components/icons";
import { categoryName } from "@/config/categories";
import { getFreeStatus } from "@/config/free-status";
import { getPlatform } from "@/config/platforms";
import { getResourceType } from "@/config/resource-types";
import { buildResourcesHref } from "@/lib/search/params";
import type { InferredFilter } from "@/lib/search/intent";
import type { ResourceQuery } from "@/types/search";

/**
 * Removable tokens for every active filter.
 *
 * Rendered server-side as links, each pointing at the query *without* that
 * filter. No JavaScript, correct semantics, and every chip is a shareable URL in
 * its own right.
 *
 * `inferredFilters` are shown distinctly because they were derived from the
 * user's phrasing rather than chosen explicitly. Anything the system decided on a
 * user's behalf has to be visible and reversible.
 */
export function ActiveFilters({
  query,
  inferredFilters = [],
}: {
  query: ResourceQuery;
  inferredFilters?: InferredFilter[];
}) {
  const chips: { key: string; label: string; href: string; inferred?: boolean }[] = [];

  const withoutValue = <K extends keyof ResourceQuery>(key: K, value: unknown): ResourceQuery => ({
    ...query,
    [key]: (query[key] as unknown[]).filter((entry) => entry !== value),
    page: 1,
  });

  for (const status of query.freeStatuses ?? []) {
    chips.push({
      key: `status-${status}`,
      label: getFreeStatus(status).label,
      href: buildResourcesHref(withoutValue("freeStatuses", status)),
    });
  }

  for (const type of query.resourceTypes ?? []) {
    chips.push({
      key: `type-${type}`,
      label: getResourceType(type).label,
      href: buildResourcesHref(withoutValue("resourceTypes", type)),
    });
  }

  for (const platform of query.platforms ?? []) {
    chips.push({
      key: `platform-${platform}`,
      label: getPlatform(platform).label,
      href: buildResourcesHref(withoutValue("platforms", platform)),
    });
  }

  for (const category of query.categories ?? []) {
    chips.push({
      key: `category-${category}`,
      label: categoryName(category),
      href: buildResourcesHref(withoutValue("categories", category)),
    });
  }

  for (const tag of query.tags ?? []) {
    chips.push({
      key: `tag-${tag}`,
      label: tag,
      href: buildResourcesHref(withoutValue("tags", tag)),
    });
  }

  // Evidence filters say "confirmed" in the chip itself, so the rule is visible
  // wherever the filter is, not only in the sidebar.
  const flags: [keyof ResourceQuery, string][] = [
    ["openSourceOnly", "Open source · confirmed"],
    ["noAccountOnly", "No account needed · confirmed"],
    ["noCreditCardOnly", "No credit card · confirmed"],
    ["commercialUseOnly", "Commercial use allowed · confirmed"],
    ["personalUseOnly", "Personal use allowed · confirmed"],
  ];

  for (const [key, label] of flags) {
    if (!query[key]) continue;
    const inferred = inferredFilters.find((filter) => filter.key === key);
    chips.push({
      key: String(key),
      label,
      href: buildResourcesHref({ ...query, [key]: undefined, page: 1 }),
      inferred: Boolean(inferred),
    });
  }

  if (query.alternativeTo) {
    chips.push({
      key: "alternativeTo",
      label: `Alternative to ${query.alternativeTo}`,
      href: buildResourcesHref({ ...query, alternativeTo: undefined, page: 1 }),
      inferred: inferredFilters.some((filter) => filter.key === "alternativeTo"),
    });
  }

  if (chips.length === 0) return null;

  const hasInferred = chips.some((chip) => chip.inferred);

  return (
    <div className="flex flex-col gap-2">
      <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <li key={chip.key}>
            <Link
              href={chip.href}
              className="group inline-flex h-8 items-center gap-1.5 rounded-xs border border-border-strong bg-surface pr-2 pl-2.5 text-xs text-fg transition-colors pointer-coarse:h-11 hover:border-danger/50 hover:text-danger-fg active:bg-(--fill-pressed)"
            >
              {chip.inferred ? <span className="text-fg-muted">Inferred ·</span> : null}
              {chip.inferred ? " " : null}
              {chip.label}
              <Icon name="close" size={12} className="opacity-60 group-hover:opacity-100" />
              <span className="sr-only">Remove this filter</span>
            </Link>
          </li>
        ))}

        <li>
          <Link
            href={buildResourcesHref({ q: query.q, sort: query.sort })}
            className="rounded-xs px-2 py-1 text-xs text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
          >
            Clear all
          </Link>
        </li>
      </ul>

      {hasInferred ? (
        <p className="text-xs text-fg-subtle">
          Filters marked “Inferred” were taken from the wording of your search. Remove any that are wrong.
        </p>
      ) : null}
    </div>
  );
}
