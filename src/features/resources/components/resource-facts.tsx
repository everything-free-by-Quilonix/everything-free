import { Icon } from "@/components/icons";
import { DataList, type DataItem } from "@/components/ui/data-list";
import { ExternalLink } from "@/components/ui/external-link";
import { categoryName } from "@/config/categories";
import { getFreeStatus } from "@/config/free-status";
import { getPlatform } from "@/config/platforms";
import { getResourceType } from "@/config/resource-types";
import { orderedPlatforms } from "@/lib/resources/derive";
import { factEvidence, triStateStatements, type TriStateFact } from "@/lib/resources/evidence";
import { formatFullDate } from "@/lib/utils/date";
import type { Resource } from "@/types/resource";
import { FactValue } from "./evidence";

/**
 * The fact panel on a resource page.
 *
 * Every trust-sensitive fact is shown as two things: its value, and whether an
 * official source confirms it. They are never merged. A confirmed "No" reads
 * "No credit card needed · ✓ Confirmed"; an unchecked one reads
 * "Recorded as no · – Not verified"; an unsettled one reads "Unknown · ? Not
 * confirmed". "How we know" opens the source, the date it was read, who read it and
 * what the page says.
 *
 * Descriptive fields — type, category, languages — are editorial filing, not claims
 * about the provider, so they carry no evidence state.
 */

function TriStateValue({ resource, fact }: { resource: Resource; fact: TriStateFact }) {
  const value = resource[fact];
  const statement = value === "unknown" ? "Unknown" : triStateStatements[fact][value];
  return (
    <FactValue
      resource={resource}
      fact={fact}
      value={statement}
      unconfirmedValue={value === "unknown" ? undefined : <>Recorded as {value}</>}
    />
  );
}

export function ResourceFacts({ resource }: { resource: Resource }) {
  const platforms = orderedPlatforms(resource);
  const freeStatus = getFreeStatus(resource.freeStatus);

  const items: DataItem[] = [
    {
      term: "Free status",
      value: (
        <FactValue
          resource={resource}
          fact="freeStatus"
          value={freeStatus.label}
          unconfirmedValue={<>Listed as {freeStatus.label.toLowerCase()}</>}
        />
      ),
    },
    { term: "Credit card required", value: <TriStateValue resource={resource} fact="requiresCreditCard" /> },
    { term: "Account required", value: <TriStateValue resource={resource} fact="requiresAccount" /> },
    {
      term: "Commercial use",
      value: <TriStateValue resource={resource} fact="commercialUse" />,
      note:
        factEvidence(resource, "commercialUse").state === "confirmed"
          ? undefined
          : "Check the provider's terms before using it for paid work.",
    },
    { term: "Personal use", value: <TriStateValue resource={resource} fact="personalUse" /> },
    {
      term: "Open source",
      value: (
        <FactValue
          resource={resource}
          fact="openSource"
          value={resource.openSource ? "Yes" : "No"}
          unconfirmedValue={<>Recorded as {resource.openSource ? "yes" : "no"}</>}
        />
      ),
    },
    {
      term: "Licence",
      value: (
        <FactValue
          resource={resource}
          fact="license"
          value={resource.license ?? "Not recorded"}
          unconfirmedValue={<>Recorded as {resource.license}</>}
        />
      ),
      note: resource.licenseNotes,
    },
    {
      term: "Platforms",
      value: (
        <FactValue
          resource={resource}
          fact="platforms"
          value={
            <span className="flex flex-wrap gap-x-3 gap-y-1">
              {platforms.map((platform) => {
                const definition = getPlatform(platform);
                return (
                  <span key={platform} className="inline-flex items-center gap-1.5">
                    <Icon name={definition.icon} size={14} className="shrink-0 text-fg-subtle" />
                    {definition.label}
                  </span>
                );
              })}
            </span>
          }
          unconfirmedValue={<>Recorded as {platforms.map((p) => getPlatform(p).label).join(", ")}</>}
        />
      ),
    },
    {
      term: "Limitations",
      value: (
        <FactValue
          resource={resource}
          fact="limitations"
          value="Listed under Limitations above"
          unconfirmedValue="Listed above, not yet checked"
        />
      ),
    },
    {
      term: "Free-tier limits",
      value: (
        <FactValue
          resource={resource}
          fact="freeTierLimits"
          value="Included in the limitations above"
          unconfirmedValue="Not yet checked against the provider's pages"
        />
      ),
    },
    {
      term: "Pricing",
      value: (
        <FactValue
          resource={resource}
          fact="pricing"
          value={resource.pricingNotes ? "Where the free/paid line sits is described above" : "No paid tier recorded"}
          unconfirmedValue="Not yet checked against the provider's pages"
        />
      ),
    },
    {
      term: "Resource type",
      value: getResourceType(resource.resourceType).label,
    },
    {
      term: "Category",
      value: [resource.category, ...resource.subcategories].map(categoryName).join(", "),
    },
  ];

  if (resource.languages.length > 0) {
    items.push({ term: "Interface languages", value: resource.languages.join(", ") });
  }

  const capabilities = [
    resource.apiAvailable && "API available",
    resource.embedAvailable && "Can be embedded",
    resource.downloadAvailable && "Downloadable",
  ].filter(Boolean) as string[];

  if (capabilities.length > 0) {
    items.push({
      term: "Also offers",
      value: capabilities.join(" · "),
      note: "Recorded when the listing was compiled; not part of the verification checklist.",
    });
  }

  items.push({
    term: "Entry updated",
    value: formatFullDate(resource.updatedAt) ?? "Unknown",
    note: "When this listing was last edited, which is not the same as when its claims were verified.",
  });

  if (resource.sourceUrl) {
    items.push({
      term: "Source code",
      value: (
        <ExternalLink href={resource.sourceUrl} className="text-fg underline underline-offset-2 hover:text-primary">
          View repository
        </ExternalLink>
      ),
    });
  }

  if (resource.pricingUrl) {
    items.push({
      term: "Official pricing",
      value: (
        <ExternalLink href={resource.pricingUrl} className="text-fg underline underline-offset-2 hover:text-primary">
          Check current terms
        </ExternalLink>
      ),
      note: "Go here to confirm anything on this page for yourself.",
    });
  }

  return <DataList items={items} />;
}
