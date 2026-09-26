import Link from "next/link";
import { Icon } from "@/components/icons";
import { getFreeStatus } from "@/config/free-status";
import { availabilityLabel, platformLabels } from "@/lib/resources/derive";
import { formatMonthYear } from "@/lib/utils/date";
import type { Availability, Resource } from "@/types/resource";

/**
 * Factual comparison table.
 *
 * The product rule is that no alternative is declared "best". So this compares
 * only fields with objective answers — free status, licence, platforms, account and
 * card requirements, commercial use, verification date — and offers no score,
 * ranking or recommendation.
 *
 * Implemented as a real `<table>` with `scope` on the headers. A grid of divs would
 * look the same and leave screen-reader users unable to associate a cell with its
 * row and column, which is the entire value of a comparison.
 */

const COLUMNS: { key: string; label: string; render: (resource: Resource) => React.ReactNode }[] = [
  {
    key: "free-status",
    label: "Free status",
    render: (resource) => getFreeStatus(resource.freeStatus).label,
  },
  {
    key: "licence",
    label: "Licence",
    render: (resource) => resource.license ?? <Unknown />,
  },
  {
    key: "platforms",
    label: "Platforms",
    render: (resource) => {
      const platforms = platformLabels(resource);
      return platforms.length > 0 ? platforms.join(", ") : <Unknown />;
    },
  },
  {
    key: "account",
    label: "Account needed",
    render: (resource) => <TriState value={resource.requiresAccount} />,
  },
  {
    key: "card",
    label: "Card needed",
    render: (resource) => <TriState value={resource.requiresCreditCard} />,
  },
  {
    key: "commercial",
    label: "Commercial use",
    render: (resource) => <TriState value={resource.commercialUse} />,
  },
  {
    key: "verified",
    label: "Last checked",
    render: (resource) => formatMonthYear(resource.lastVerifiedAt) ?? <Unknown label="Never" />,
  },
];

function Unknown({ label = "Not recorded" }: { label?: string }) {
  return <span className="text-fg-subtle">{label}</span>;
}

function TriState({ value }: { value: Availability }) {
  if (value === "unknown") return <Unknown label="Not verified" />;

  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon
        name={value === "yes" ? "check" : "close"}
        size={13}
        className={value === "yes" ? "text-success-fg" : "text-fg-subtle"}
      />
      {availabilityLabel(value)}
    </span>
  );
}

export function AlternativeComparison({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) return null;

  return (
    // Horizontally scrollable on narrow screens, and focusable so a keyboard user
    // can scroll it without a pointer.
    <div className="overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label="Comparison table">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Factual comparison of free alternatives. Columns cover free status, licence, platforms, account and card
          requirements, commercial use and verification date.
        </caption>
        <thead>
          <tr className="border-b border-border bg-bg-subtle text-left">
            <th scope="col" className="sticky left-0 bg-bg-subtle px-4 py-3 font-medium whitespace-nowrap">
              Resource
            </th>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.slug} className="border-b border-border last:border-b-0">
              <th scope="row" className="sticky left-0 bg-surface px-4 py-3 text-left font-medium whitespace-nowrap">
                <Link href={`/resources/${resource.slug}`} className="rounded hover:text-primary hover:underline">
                  {resource.name}
                </Link>
              </th>
              {COLUMNS.map((column) => (
                <td key={column.key} className="px-4 py-3 whitespace-nowrap text-fg-muted">
                  {column.render(resource)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
