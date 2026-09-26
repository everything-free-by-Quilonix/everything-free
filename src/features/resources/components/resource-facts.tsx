import { Icon } from "@/components/icons";
import { DataList, type DataItem } from "@/components/ui/data-list";
import { ExternalLink } from "@/components/ui/external-link";
import { categoryName } from "@/config/categories";
import { getPlatform } from "@/config/platforms";
import { getResourceType } from "@/config/resource-types";
import { availabilityLabel, orderedPlatforms } from "@/lib/resources/derive";
import { formatFullDate } from "@/lib/utils/date";
import type { Availability, Resource } from "@/types/resource";

/**
 * The fact panel on a resource page.
 *
 * Tri-state answers are rendered through `availabilityLabel`, so an unchecked
 * field reads "Not verified" rather than "No". That distinction is the difference
 * between a directory that is careful and one that quietly misleads.
 */

function AvailabilityValue({ value }: { value: Availability }) {
  const label = availabilityLabel(value);
  const icon = value === "yes" ? "check" : value === "no" ? "close" : "help-circle";
  const tone = value === "unknown" ? "text-fg-subtle" : "text-fg";

  return (
    <span className={`inline-flex items-center gap-1.5 ${tone}`}>
      <Icon name={icon} size={14} className="shrink-0 opacity-70" />
      {label}
    </span>
  );
}

export function ResourceFacts({ resource }: { resource: Resource }) {
  const platforms = orderedPlatforms(resource);

  const items: DataItem[] = [
    {
      term: "Resource type",
      value: getResourceType(resource.resourceType).label,
    },
    {
      term: "Category",
      value: [resource.category, ...resource.subcategories].map(categoryName).join(", "),
    },
    {
      term: "Platforms",
      value:
        platforms.length > 0 ? (
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
        ) : (
          <span className="text-fg-subtle">Not recorded</span>
        ),
    },
    {
      term: "Account required",
      value: <AvailabilityValue value={resource.requiresAccount} />,
    },
    {
      term: "Credit card required",
      value: <AvailabilityValue value={resource.requiresCreditCard} />,
    },
    {
      term: "Commercial use",
      value: <AvailabilityValue value={resource.commercialUse} />,
      note:
        resource.commercialUse === "unknown"
          ? "Nobody has established this yet. Check the provider's terms before using it for paid work."
          : undefined,
    },
    {
      term: "Personal use",
      value: <AvailabilityValue value={resource.personalUse} />,
    },
    {
      term: "Open source",
      value: resource.openSource ? (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="check" size={14} className="shrink-0 opacity-70" />
          Yes{resource.license ? ` — ${resource.license}` : ""}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="close" size={14} className="shrink-0 opacity-70" />
          No{resource.license ? ` — ${resource.license}` : ""}
        </span>
      ),
      note: resource.licenseNotes,
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
    items.push({ term: "Also offers", value: capabilities.join(" · ") });
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
