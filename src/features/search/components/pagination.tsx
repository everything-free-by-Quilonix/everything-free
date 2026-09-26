import Link from "next/link";
import { Icon } from "@/components/icons";
import { buildResourcesHref } from "@/lib/search/params";
import { cn } from "@/lib/utils/cn";
import type { ResourceQuery } from "@/types/search";

/**
 * Pagination as links.
 *
 * Real anchors mean each page is crawlable and shareable, and `rel="prev"`/`next`
 * states the sequence relationship for crawlers. The current page is marked with
 * `aria-current="page"`.
 */
export function Pagination({
  query,
  page,
  totalPages,
}: {
  query: ResourceQuery;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => buildResourcesHref({ ...query, page: target });
  const pages = pageWindow(page, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-border-strong px-3 text-sm transition-colors hover:bg-surface-hover"
        >
          <Icon name="arrow-left" size={15} />
          Previous
        </Link>
      ) : null}

      <ul className="flex items-center gap-1">
        {pages.map((entry, index) =>
          entry === "gap" ? (
            <li key={`gap-${index}`} className="px-1.5 text-sm text-fg-subtle" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={entry}>
              <Link
                href={hrefFor(entry)}
                aria-current={entry === page ? "page" : undefined}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-lg text-sm transition-colors",
                  entry === page
                    ? "bg-primary font-semibold text-primary-fg"
                    : "border border-border text-fg-muted hover:bg-surface-hover hover:text-fg",
                )}
              >
                <span className="sr-only">Page </span>
                {entry}
              </Link>
            </li>
          ),
        )}
      </ul>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-border-strong px-3 text-sm transition-colors hover:bg-surface-hover"
        >
          Next
          <Icon name="arrow-right" size={15} />
        </Link>
      ) : null}
    </nav>
  );
}

/** First, last, and a window around the current page, with gap markers. */
function pageWindow(page: number, totalPages: number): (number | "gap")[] {
  const window = new Set<number>([1, totalPages, page]);
  for (const offset of [-1, 1]) {
    const candidate = page + offset;
    if (candidate > 1 && candidate < totalPages) window.add(candidate);
  }

  const sorted = [...window].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("gap");
    result.push(value);
  });

  return result;
}
