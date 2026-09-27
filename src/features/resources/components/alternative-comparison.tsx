import Link from "next/link";
import { getFreeStatus } from "@/config/free-status";
import { availabilityLabel, platformLabels } from "@/lib/resources/derive";
import { factEvidence, type Fact, type TriStateFact } from "@/lib/resources/evidence";
import { formatMonthYear } from "@/lib/utils/date";
import type { Availability, Resource } from "@/types/resource";
import { EvidenceTag } from "./evidence";

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

/*
 * Every cell shows the value and, underneath, its evidence state: "No" with
 * "✓ Confirmed", or "No" with "– Not verified". A comparison is exactly where a
 * reader would otherwise assume every cell was checked to the same standard.
 */
const COLUMNS: { key: string; label: string; render: (resource: Resource) => React.ReactNode }[] = [
  {
    key: "free-status",
    label: "Free status",
    render: (resource) => (
      <Cell resource={resource} fact="freeStatus">
        {getFreeStatus(resource.freeStatus).label}
      </Cell>
    ),
  },
  {
    key: "licence",
    label: "Licence",
    render: (resource) => (
      <Cell resource={resource} fact="license">
        {resource.license ?? "Not recorded"}
      </Cell>
    ),
  },
  {
    key: "platforms",
    label: "Platforms",
    render: (resource) => {
      const platforms = platformLabels(resource);
      return (
        <Cell resource={resource} fact="platforms">
          {platforms.length > 0 ? platforms.join(", ") : "Not recorded"}
        </Cell>
      );
    },
  },
  {
    key: "account",
    label: "Account needed",
    render: (resource) => <TriState resource={resource} fact="requiresAccount" />,
  },
  {
    key: "card",
    label: "Card needed",
    render: (resource) => <TriState resource={resource} fact="requiresCreditCard" />,
  },
  {
    key: "commercial",
    label: "Commercial use",
    render: (resource) => <TriState resource={resource} fact="commercialUse" />,
  },
  {
    key: "verified",
    label: "Last checked",
    render: (resource) =>
      formatMonthYear(resource.lastVerifiedAt) ?? <span className="text-fg-subtle">Never</span>,
  },
];

function Cell({ resource, fact, children }: { resource: Resource; fact: Fact; children: React.ReactNode }) {
  const evidence = factEvidence(resource, fact);
  return (
    <span className="flex flex-col gap-0.5" data-fact={fact}>
      <span className={evidence.state === "confirmed" ? "text-fg" : "text-fg-muted"}>{children}</span>
      <EvidenceTag evidence={evidence} className="text-[11px] font-normal" />
    </span>
  );
}

function TriState({ resource, fact }: { resource: Resource; fact: TriStateFact }) {
  const value: Availability = resource[fact];
  return (
    <Cell resource={resource} fact={fact}>
      {availabilityLabel(value)}
    </Cell>
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
          requirements, commercial use and the date of the last check. Each cell states whether an official source
          confirms it.
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
