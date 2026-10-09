import type { IconName } from "@/components/icons";

/**
 * Integrated tools — things a user can actually run on Everything.Free.
 *
 * The important field here is `processing`. Privacy claims are not written by
 * hand in page copy where they can drift away from the implementation; they are
 * derived from this declaration, and the tool page refuses to render without
 * it. If an implementation starts sending data to a server, the registry entry
 * has to change, and the disclosure changes with it.
 */

export const TOOL_PROCESSING_LOCATIONS = ["browser", "server", "third-party"] as const;

export type ToolProcessingLocation = (typeof TOOL_PROCESSING_LOCATIONS)[number];

export interface ToolProcessing {
  location: ToolProcessingLocation;
  /**
   * Whether the user's input ever leaves their device.
   *
   * Must be `false` only when the implementation genuinely performs all work
   * client-side. `'browser'` + `leavesDevice: true` is a contradiction and is
   * rejected by `config/tools.ts`.
   */
  leavesDevice: boolean;
  /** Plain-language explanation shown verbatim to the user. */
  explanation: string;
  /** Named third party that receives data, when one does. */
  thirdParty?: { name: string; url: string; privacyPolicyUrl?: string };
  /**
   * Files the tool downloads from another origin, on request, to do its work —
   * for example a model's weights. Downloads carry none of the user's input, so
   * they do not make a tool leave the device; they are still declared so the page
   * can say where they come from, and so the page's CSP can allow exactly these
   * origins and no others (`scripts/csp.mjs`).
   */
  downloads?: ToolDownload[];
}

export interface ToolDownload {
  /** What is downloaded, in plain words. */
  what: string;
  /** Who serves it. */
  from: string;
  url: string;
  /** HTTPS origins the browser connects to for it, including CDN redirects. */
  origins: string[];
}

export interface ToolAttribution {
  /** Project or library being used. */
  name: string;
  url: string;
  /** SPDX identifier where applicable. */
  license: string;
  /** Set when the licence obliges us to display credit. */
  required: boolean;
}

/**
 * How Everything.Free delivers a tool.
 *
 * The project does not intend to rebuild every tool that already exists, so these
 * are the legitimate mechanisms for offering one — in the order they should be
 * preferred:
 *
 * 1. `BROWSER_LOCAL`   — runs entirely on the user's device. No cost, no data leaves.
 * 2. `OPEN_SOURCE`     — an open-source implementation integrated under its licence.
 * 3. `SELF_HOSTED`     — we host an open-source implementation ourselves.
 * 4. `API`             — a free API powers it.
 * 5. `EMBED`           — the provider explicitly permits embedding.
 * 6. `EXTERNAL_LINK`   — we send the user to the provider. Always available, always safe.
 *
 * Disambiguation rule: this describes *where the work happens*, not where the code
 * came from. A tool built on an open-source library but executing in the browser is
 * `BROWSER_LOCAL`; the library is credited through `attributions`. Without that
 * rule the categories overlap and the classification stops being useful.
 *
 * `EMBED` requires that the provider permits it in writing. An iframe that happens
 * to render is not permission.
 */
export const TOOL_INTEGRATION_TYPES = [
  "BROWSER_LOCAL",
  "OPEN_SOURCE",
  "SELF_HOSTED",
  "API",
  "EMBED",
  "EXTERNAL_LINK",
] as const;

export type ToolIntegrationType = (typeof TOOL_INTEGRATION_TYPES)[number];

/**
 * What running a tool costs the project.
 *
 * `paid` exists so the model can describe reality, but it is rejected at build time
 * while the project runs without paid infrastructure. Removing that guard is a
 * deliberate decision someone has to make, not something that can arrive quietly in
 * a pull request.
 */
export const TOOL_INFRASTRUCTURE_COSTS = ["none", "free-tier", "paid"] as const;

export type ToolInfrastructureCost = (typeof TOOL_INFRASTRUCTURE_COSTS)[number];

export const TOOL_STATUSES = ["available", "planned"] as const;

/**
 * `planned` entries are roadmap items, rendered as clearly-labelled and
 * non-interactive. They exist so the tools section can communicate direction
 * without shipping a dead button that pretends to work.
 */
export type ToolStatus = (typeof TOOL_STATUSES)[number];

export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: IconName;
  /** Groups tools on the index page. */
  group: ToolGroupId;
  status: ToolStatus;
  /** The delivery mechanism. See `TOOL_INTEGRATION_TYPES` for the precedence rule. */
  integrationType: ToolIntegrationType;
  /** What hosting this tool costs the project. */
  infrastructureCost: ToolInfrastructureCost;
  /**
   * The binding constraint when `infrastructureCost` is `free-tier` — the quota,
   * rate limit or expiry that would eventually force a decision. Required for
   * `free-tier` so the ceiling is written down before it is hit.
   */
  freeTierLimitation?: string;
  processing: ToolProcessing;
  /** Open-source work this tool is built on. Empty when built on web standards. */
  attributions: ToolAttribution[];
  /** What this tool deliberately does not do. */
  limitations: string[];
  /** Slugs of library resources worth using instead for heavier jobs. */
  relatedResources: string[];
  tags: string[];
}

export const TOOL_GROUP_IDS = [
  "ai",
  "money",
  "images",
  "documents",
  "text",
  "developer",
  "design",
  "converters",
] as const;

export type ToolGroupId = (typeof TOOL_GROUP_IDS)[number];

export interface ToolGroup {
  id: ToolGroupId;
  name: string;
  description: string;
}
