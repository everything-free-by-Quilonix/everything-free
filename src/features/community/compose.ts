import { categoryName } from "@/config/categories";
import { getFreeStatus, isFreeStatus } from "@/config/free-status";
import { getResourceType, isResourceType } from "@/config/resource-types";
import { site } from "@/config/site";
import type { ResourceReportInput, ResourceSubmissionInput } from "./schema";

/**
 * Composes contributions into GitHub issues.
 *
 * Pure functions with no environment dependency, so the same composition runs in
 * the browser today and could run on a server, in a bot, or in a GitHub Action
 * later without being rewritten.
 *
 * Why GitHub issues rather than a database: at this stage the project has no paid
 * infrastructure, and GitHub already provides everything a submission queue needs
 * — a durable record, threaded discussion, labels, assignment, search and an audit
 * trail — for free. The output is deliberately the documented submission format
 * from CONTRIBUTING.md, so a form submission and a hand-written issue are the same
 * artefact and one review process handles both.
 *
 * Nothing here transmits anything. It builds a URL; the contributor decides
 * whether to open it. See `docs/architecture.md` for the full submission
 * lifecycle.
 */

const ISSUE_BASE = `${site.repositoryUrl}/issues/new`;

export interface ComposedIssue {
  title: string;
  body: string;
  labels: string[];
}

/**
 * Builds a GitHub issue URL with a prefilled title, body and labels.
 *
 * GitHub rejects very long URLs, so the body is capped. Truncation is signposted
 * in the body itself rather than silently dropping the end of someone's
 * submission.
 */
const BODY_URL_LIMIT = 6000;

export function issueUrl({ title, body, labels }: ComposedIssue): string {
  const safeBody =
    body.length > BODY_URL_LIMIT
      ? `${body.slice(0, BODY_URL_LIMIT)}\n\n_[Truncated because the prefilled link would be too long. Please paste the remainder.]_`
      : body;

  const params = new URLSearchParams({
    title,
    body: safeBody,
    labels: labels.join(","),
  });

  return `${ISSUE_BASE}?${params.toString()}`;
}

/** Direct links to the structured issue templates, for the no-JavaScript path. */
export const issueTemplateUrls = {
  submission: `${ISSUE_BASE}?template=resource-submission.yml`,
  correction: `${ISSUE_BASE}?template=resource-correction.yml`,
} as const;

/** Renders an optional field without pretending a blank answer is an answer. */
function field(value: string | undefined): string {
  return value && value.trim().length > 0 ? value : "_Not provided._";
}

export function composeSubmissionIssue(data: ResourceSubmissionInput): ComposedIssue {
  // The schema has already narrowed these, but the guards keep the label lookups
  // total rather than relying on a cast.
  const statusLabel = isFreeStatus(data.freeStatus) ? getFreeStatus(data.freeStatus).label : data.freeStatus;
  const typeLabel = isResourceType(data.resourceType) ? getResourceType(data.resourceType).label : data.resourceType;

  const body = [
    `**Resource name:** ${data.name}`,
    `**Official URL:** ${data.officialUrl}`,
    `**Category:** ${categoryName(data.category)} (\`${data.category}\`)`,
    `**Resource type:** ${typeLabel} (\`${data.resourceType}\`)`,
    `**Free status:** ${statusLabel} (\`${data.freeStatus}\`)`,
    "",
    "**Why should it be listed:**",
    data.whyListed,
    "",
    "**Known limitations:**",
    field(data.limitations),
    "",
    `**License:** ${field(data.license)}`,
    `**Commercial use:** ${field(data.commercialUse)}`,
    "",
    "**Verification information:**",
    field(data.verificationInformation),
    "",
    "---",
    "_Submitted through the Everything.Free submission form. Validated against the editorial rules in CONTRIBUTING.md before this link was generated._",
  ].join("\n");

  return {
    title: `Add resource: ${data.name}`,
    body,
    labels: ["resource-submission"],
  };
}

export function composeReportIssue(data: ResourceReportInput): ComposedIssue {
  const body = [
    `**Resource:** \`${data.resourceSlug}\``,
    `**Page:** ${site.url}/resources/${data.resourceSlug}/`,
    `**Reason:** ${data.reason}`,
    "",
    "**Details:**",
    data.details,
    "",
    `**Evidence:** ${field(data.evidenceUrl)}`,
    "",
    "---",
    "_Reported through the Everything.Free report form._",
  ].join("\n");

  return {
    title: `Correction: ${data.resourceSlug} (${data.reason})`,
    body,
    labels: ["correction"],
  };
}
