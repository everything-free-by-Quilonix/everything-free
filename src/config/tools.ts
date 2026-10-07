import {
  TOOL_INTEGRATION_TYPES,
  type Tool,
  type ToolGroup,
  type ToolGroupId,
  type ToolIntegrationType,
} from "@/types/tool";

/**
 * The integrated tools registry.
 *
 * Product principle: do not rebuild a good tool that already exists. The library
 * is the primary answer, and this section only holds things that are genuinely
 * better done here — small, focused jobs that can run entirely in the browser
 * with no upload, no queue and no account.
 *
 * Each entry declares where processing happens. Tool pages render their privacy
 * disclosure from that declaration rather than from hand-written copy, so the
 * statement shown to the user cannot drift away from the implementation.
 * `assertToolIntegrity()` at the bottom rejects contradictory declarations at
 * build time — most importantly, a tool cannot claim browser-local processing
 * while also admitting that data leaves the device.
 */

export interface ToolIntegrationDefinition {
  id: ToolIntegrationType;
  label: string;
  description: string;
  /** 1 is most preferred. Lower cost and better privacy rank higher. */
  preference: number;
  /** What has to be true before this mechanism may be used. */
  requirement: string;
}

/**
 * The integration mechanisms, in preference order.
 *
 * Documented here rather than only in prose so the tools index can show the
 * ordering, and so a reviewer has a concrete reference when a contributor proposes
 * an integration that is more convenient than it is appropriate.
 */
export const toolIntegrationDefinitions: Record<ToolIntegrationType, ToolIntegrationDefinition> = {
  BROWSER_LOCAL: {
    id: "BROWSER_LOCAL",
    label: "Runs in your browser",
    description: "All processing happens on the user's own device using web standards.",
    preference: 1,
    requirement: "No input may leave the device. Costs nothing to run.",
  },
  OPEN_SOURCE: {
    id: "OPEN_SOURCE",
    label: "Open-source integration",
    description: "An existing open-source implementation, integrated under its licence.",
    preference: 2,
    requirement: "The licence must permit the use, and attribution obligations must be honoured.",
  },
  SELF_HOSTED: {
    id: "SELF_HOSTED",
    label: "Self-hosted",
    description: "We run an open-source implementation on infrastructure we control.",
    preference: 3,
    requirement: "Must be affordable to host and must not put user data at unnecessary risk.",
  },
  API: {
    id: "API",
    label: "Free API",
    description: "A third-party API provides the capability.",
    preference: 4,
    requirement: "The provider must be named, the free-tier ceiling recorded, and the privacy impact disclosed.",
  },
  EMBED: {
    id: "EMBED",
    label: "Embedded provider",
    description: "The provider's own tool, embedded with their permission.",
    preference: 5,
    requirement: "Written permission to embed. An iframe that renders is not permission.",
  },
  EXTERNAL_LINK: {
    id: "EXTERNAL_LINK",
    label: "Link to the provider",
    description: "The user is sent to the provider's own site.",
    preference: 6,
    requirement: "Always acceptable. This is the default when no better mechanism applies.",
  },
};

export const toolIntegrationList: ToolIntegrationDefinition[] = TOOL_INTEGRATION_TYPES.map(
  (id) => toolIntegrationDefinitions[id],
).sort((a, b) => a.preference - b.preference);

export function getToolIntegration(id: ToolIntegrationType): ToolIntegrationDefinition {
  return toolIntegrationDefinitions[id];
}

export const toolGroups: ToolGroup[] = [
  {
    id: "money",
    name: "Keep it free",
    description: "Stop free trials and forgotten subscriptions from quietly charging you.",
  },
  { id: "images", name: "Images", description: "Convert, resize and compress pictures." },
  { id: "documents", name: "Documents", description: "Work with PDFs and text documents." },
  { id: "text", name: "Text", description: "Clean up, reformat and measure text." },
  { id: "developer", name: "Developer", description: "Small utilities for building things." },
  { id: "design", name: "Design", description: "Checks and helpers for visual work." },
  { id: "converters", name: "Converters", description: "Move data between formats." },
];

export const tools: Tool[] = [
  {
    id: "trial-reminder",
    slug: "trial-reminder",
    name: "Free-trial cancel reminder",
    shortDescription: "Work out when each free trial starts charging, and get a calendar reminder before it does.",
    longDescription:
      "Enter the free trials you have started. The tool works out the date each one converts to a paid plan and builds a calendar file with a reminder a few days earlier, plus the cancellation link if you have it. Import it once into Apple Calendar, Google Calendar or Outlook. The file is built inside this page; nothing is uploaded and there is no account.",
    icon: "flag",
    group: "money",
    status: "available",
    integrationType: "BROWSER_LOCAL",
    infrastructureCost: "none",
    processing: {
      location: "browser",
      leavesDevice: false,
      explanation:
        "The trial names, dates and links you enter stay in this page. The calendar file is generated by JavaScript on your device and saved straight to it; nothing is sent to Everything.Free, to a calendar provider or to anyone else. Close the tab and the list is gone. You can confirm this in your browser's network panel.",
    },
    attributions: [
      {
        name: "iCalendar format (RFC 5545, IETF)",
        url: "https://www.rfc-editor.org/rfc/rfc5545",
        license: "IETF Trust Legal Provisions",
        required: false,
      },
    ],
    limitations: [
      "The charge date is the start date plus the trial length. Providers differ: some charge at the start of the last day, some count the sign-up day, and some bill in another time zone. Check the provider's own terms, which is why the reminder defaults to two days early.",
      "Nothing is remembered between visits. Download the calendar file before closing the tab.",
      "Google Calendar may ignore the built-in alert time when importing a file, and use your default notification settings instead.",
      "It reminds you; it cannot cancel anything. Cancelling still happens in the provider's account settings.",
    ],
    relatedResources: ["thunderbird", "actual-budget"],
    tags: ["trial", "subscription", "reminder", "calendar", "ics", "money", "privacy"],
  },
  {
    id: "subscription-audit",
    slug: "subscription-audit",
    name: "Subscription audit & free swaps",
    shortDescription: "Add up what your subscriptions really cost a year, and see which ones have free alternatives listed.",
    longDescription:
      "List the paid products you subscribe to and what you pay for them. The tool totals the monthly and yearly cost, then checks each product against the library's free-alternatives pages, so you can see how much of your spending has a free option worth looking at. Prices are only ever the ones you type in.",
    icon: "wallet",
    group: "money",
    status: "available",
    integrationType: "BROWSER_LOCAL",
    infrastructureCost: "none",
    processing: {
      location: "browser",
      leavesDevice: false,
      explanation:
        "What you pay for, and how much, is personal. Everything you type stays in this page and is added up by JavaScript on your device. The list of products with free alternatives was built into the page when the site was published, so matching does not make any request. Nothing is stored or sent.",
    },
    attributions: [],
    limitations: [
      "Everything.Free records no prices. Totals are only as accurate as the amounts you enter, and currencies are labels: nothing is converted.",
      "Matching is by product name against the library's free-alternatives pages. A product listed under a different name will show as having no alternative; searching the library may still find one.",
      "A listed alternative is not a promise of a like-for-like replacement. Open the alternatives page and check each one's limitations before cancelling anything.",
      "Nothing is remembered between visits. Use Copy summary to keep a record.",
    ],
    relatedResources: ["actual-budget", "firefly-iii", "gnucash"],
    tags: ["subscription", "budget", "money", "alternatives", "savings", "privacy"],
  },
  {
    id: "image-converter",
    slug: "image-converter",
    name: "Image converter & compressor",
    shortDescription: "Convert between PNG, JPEG and WebP, resize, and reduce file size.",
    longDescription:
      "Converts images between PNG, JPEG and WebP, optionally resizing them and adjusting quality to bring the file size down. Everything happens inside this page using the browser's own canvas and image encoding — the files are never uploaded.",
    icon: "image",
    group: "images",
    status: "available",
    integrationType: "BROWSER_LOCAL",
    infrastructureCost: "none",
    processing: {
      location: "browser",
      leavesDevice: false,
      explanation:
        "Your images are decoded and re-encoded by your own browser on your own device. No file, and no part of a file, is sent to Everything.Free or to anyone else. You can confirm this by opening your browser's network panel while using the tool, or by disconnecting from the internet after the page loads — it will keep working.",
    },
    attributions: [],
    limitations: [
      "Very large images are limited by your device's available memory, not by a server.",
      "JPEG and WebP quality settings are applied by your browser's encoder, so results can differ slightly between browsers.",
      "Converting to JPEG removes transparency, because the format does not support it. Transparent areas become white.",
      "Does not read camera raw formats, HEIC, or multi-page TIFF.",
      "For batch processing hundreds of files or precise print colour work, use a desktop application instead.",
    ],
    relatedResources: ["gimp", "krita", "photopea"],
    tags: ["image", "convert", "compress", "resize", "webp", "privacy"],
  },
  {
    id: "contrast-checker",
    slug: "contrast-checker",
    name: "Colour contrast checker",
    shortDescription: "Check text colour combinations against WCAG 2.1 contrast requirements.",
    longDescription:
      "Calculates the contrast ratio between a text colour and a background colour, and reports whether it meets the WCAG 2.1 thresholds for normal text, large text and user-interface components. The calculation is pure arithmetic performed in this page.",
    icon: "contrast",
    group: "design",
    status: "available",
    integrationType: "BROWSER_LOCAL",
    infrastructureCost: "none",
    processing: {
      location: "browser",
      leavesDevice: false,
      explanation:
        "This is arithmetic on two colour values, carried out in your browser. Nothing is transmitted, stored or logged.",
    },
    attributions: [
      {
        name: "WCAG 2.1 relative luminance and contrast formulas (W3C)",
        url: "https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio",
        license: "W3C Software and Document Notice and License",
        required: false,
      },
    ],
    limitations: [
      "Contrast is one requirement among many. Passing it does not make an interface accessible.",
      "The ratio is defined for solid colours. Text over gradients, images or semi-transparent layers needs to be judged against the actual rendered pixels.",
      "WCAG 2.1 thresholds are based on a model that does not capture everything about human colour perception; passing the numbers is a floor, not a guarantee of legibility.",
    ],
    relatedResources: ["penpot", "inkscape"],
    tags: ["accessibility", "wcag", "contrast", "colour", "design"],
  },
  {
    id: "text-toolkit",
    slug: "text-toolkit",
    name: "Text toolkit",
    shortDescription: "Change case, make URL slugs, tidy whitespace and count words.",
    longDescription:
      "A set of everyday text operations in one place: convert between cases, generate a URL-safe slug, strip or normalise whitespace, remove duplicate lines, sort lines, and see live word, character, sentence and line counts.",
    icon: "type",
    group: "text",
    status: "available",
    integrationType: "BROWSER_LOCAL",
    infrastructureCost: "none",
    processing: {
      location: "browser",
      leavesDevice: false,
      explanation:
        "Your text stays in this page. It is transformed by JavaScript running on your device and is never sent anywhere, which matters if you are pasting anything confidential.",
    },
    attributions: [],
    limitations: [
      "Slug generation folds accented characters to their closest Latin equivalent and drops characters it cannot map, which does not produce useful results for non-Latin scripts.",
      "Word counting splits on whitespace, so it is not accurate for languages that do not separate words with spaces.",
      "Sentence counting uses punctuation heuristics and will miscount abbreviations and decimals.",
    ],
    relatedResources: ["languagetool", "libreoffice"],
    tags: ["text", "case", "slug", "word-count", "privacy"],
  },
];

/* -------------------------------------------------------------------------- */
/* Lookups                                                                    */
/* -------------------------------------------------------------------------- */

const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

export function getTool(slug: string): Tool | undefined {
  return toolBySlug.get(slug);
}

export const availableTools: Tool[] = tools.filter((tool) => tool.status === "available");

export function getToolsInGroup(groupId: ToolGroupId): Tool[] {
  return tools.filter((tool) => tool.group === groupId);
}

/** Groups that currently contain at least one tool, for the index page. */
export function getPopulatedToolGroups(): { group: ToolGroup; tools: Tool[] }[] {
  return toolGroups
    .map((group) => ({ group, tools: getToolsInGroup(group.id) }))
    .filter((entry) => entry.tools.length > 0);
}

/* -------------------------------------------------------------------------- */
/* Integrity                                                                  */
/* -------------------------------------------------------------------------- */

function assertToolIntegrity(): void {
  const problems: string[] = [];
  const slugs = new Set<string>();

  for (const tool of tools) {
    if (slugs.has(tool.slug)) problems.push(`Duplicate tool slug "${tool.slug}"`);
    slugs.add(tool.slug);

    // The rule that makes the privacy claim trustworthy.
    if (tool.processing.location === "browser" && tool.processing.leavesDevice) {
      problems.push(
        `Tool "${tool.slug}" claims browser-local processing but also that data leaves the device. One of those is wrong.`,
      );
    }
    if (tool.processing.location !== "browser" && !tool.processing.leavesDevice) {
      problems.push(
        `Tool "${tool.slug}" processes data at "${tool.processing.location}" so it must declare that data leaves the device.`,
      );
    }
    if (tool.processing.location === "third-party" && !tool.processing.thirdParty) {
      problems.push(`Tool "${tool.slug}" sends data to a third party but does not name it.`);
    }
    if (tool.processing.explanation.trim().length === 0) {
      problems.push(`Tool "${tool.slug}" has no privacy explanation.`);
    }
    if (tool.limitations.length === 0) {
      problems.push(`Tool "${tool.slug}" documents no limitations.`);
    }

    if (!TOOL_INTEGRATION_TYPES.includes(tool.integrationType)) {
      problems.push(`Tool "${tool.slug}" has an unknown integrationType "${tool.integrationType}".`);
    }

    /*
     * The project currently runs on no paid infrastructure. Encoding that as a build
     * failure — rather than as a note in a document — means introducing a paid
     * dependency requires deliberately removing this check, which is a visible
     * decision in a diff rather than something that slips through review.
     */
    if (tool.infrastructureCost === "paid") {
      problems.push(
        `Tool "${tool.slug}" declares paid infrastructure. The project runs without paid services; ` +
          `this needs explicit approval and the removal of this guard.`,
      );
    }

    // A free tier without a recorded ceiling is a surprise waiting to happen.
    if (tool.infrastructureCost === "free-tier" && !tool.freeTierLimitation) {
      problems.push(
        `Tool "${tool.slug}" relies on a free tier but records no freeTierLimitation, so its ceiling is undocumented.`,
      );
    }
    if (tool.infrastructureCost !== "free-tier" && tool.freeTierLimitation) {
      problems.push(`Tool "${tool.slug}" records a freeTierLimitation but does not rely on a free tier.`);
    }

    // Consistency between the declared mechanism and the declared processing.
    if (tool.integrationType === "BROWSER_LOCAL") {
      if (tool.processing.location !== "browser" || tool.processing.leavesDevice) {
        problems.push(
          `Tool "${tool.slug}" is classified BROWSER_LOCAL but its processing declaration says otherwise.`,
        );
      }
      if (tool.infrastructureCost !== "none") {
        problems.push(`Tool "${tool.slug}" is BROWSER_LOCAL, so it cannot cost anything to run.`);
      }
    }

    if (tool.integrationType === "API" && !tool.processing.thirdParty) {
      problems.push(`Tool "${tool.slug}" is classified API but does not name the provider receiving data.`);
    }

    if (tool.integrationType === "OPEN_SOURCE" && tool.attributions.length === 0) {
      problems.push(`Tool "${tool.slug}" is classified OPEN_SOURCE but credits no project.`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Tool registry is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

assertToolIntegrity();
