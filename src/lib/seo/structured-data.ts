import { getFreeStatus } from "@/config/free-status";
import { site, siteUrl } from "@/config/site";
import type { Resource } from "@/types/resource";
import { absoluteUrl } from "./metadata";

/**
 * JSON-LD builders.
 *
 * Structured data is only added where it is factually supportable. In particular
 * there is no `aggregateRating` anywhere, because no ratings are collected —
 * emitting a fabricated one would be both dishonest and a search-policy
 * violation.
 *
 * `offers` is emitted with a zero price only for statuses where free use is
 * genuinely unconditional. A trial or a personal-use-only licence is not a free
 * offer, and marking it as one would misrepresent it in search results.
 */

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: siteUrl,
    description: site.description,
    parentOrganization: {
      "@type": "Organization",
      name: site.parent.name,
      url: site.parent.url,
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: siteUrl,
    description: site.description,
    // Declares the search endpoint so engines can offer a direct site search.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/resources?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Statuses where describing the resource as costing nothing is accurate. */
const UNCONDITIONALLY_FREE = new Set(["FREE", "OPEN_SOURCE"]);

export function resourceSchema(resource: Resource): JsonLd {
  const status = getFreeStatus(resource.freeStatus);

  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": resource.resourceType === "MOBILE_APP" ? "MobileApplication" : "SoftwareApplication",
    name: resource.name,
    description: resource.longDescription,
    url: absoluteUrl(`/resources/${resource.slug}`),
    sameAs: resource.officialUrl,
    applicationCategory: resource.category,
    dateModified: resource.updatedAt,
  };

  if (resource.platforms.length > 0) {
    schema.operatingSystem = resource.platforms.join(", ");
  }

  if (resource.license) {
    schema.license = resource.license;
  }

  if (UNCONDITIONALLY_FREE.has(resource.freeStatus)) {
    schema.offers = {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    };
  } else {
    // For everything else, state the pricing situation in prose rather than
    // asserting a price that does not hold.
    schema.disambiguatingDescription = `${status.label}: ${status.summary}`;
  }

  return schema;
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionSchema({
  name,
  description,
  path,
  resources,
}: {
  name: string;
  description: string;
  path: string;
  resources: Resource[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: resources.length,
      itemListElement: resources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: resource.name,
        url: absoluteUrl(`/resources/${resource.slug}`),
      })),
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export type { JsonLd };
