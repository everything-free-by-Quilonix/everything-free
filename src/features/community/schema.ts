import { z } from "zod";

import { isCategoryId } from "@/config/categories";

/*
 * Zod 4 compiles schemas with `new Function` for speed, and probes whether that is
 * allowed by trying it. The site's CSP forbids eval, so the probe is blocked — which
 * Zod tolerates, but the browser still records a policy violation on every form page.
 * Jitless mode skips the compiler and the probe. The cost is irrelevant here: these
 * schemas validate one form submission at a time.
 */
z.config({ jitless: true });
import { isFreeStatus } from "@/config/free-status";
import { isResourceType } from "@/config/resource-types";
import { REPORT_REASONS } from "@/types/submission";

/**
 * Validation for untrusted input.
 *
 * This is the only place in the codebase that uses a runtime schema validator.
 * Everywhere else, data originates from typed source files and TypeScript is
 * sufficient. Form submissions do not: they arrive as strings over the network and
 * have to be checked at runtime, so Zod is warranted here and nowhere else.
 *
 * The rules encode the project's editorial standards rather than just shapes:
 * a submission must have an HTTPS official URL, must explain why it belongs in the
 * library, and must document limitations for any status where free use is
 * conditional. That last rule is enforced in code so the standard cannot be
 * quietly skipped.
 */

/** Requires HTTPS specifically, not merely a parseable URL. */
const httpsUrl = z
  .string()
  .trim()
  .min(1, "A URL is required.")
  .max(2000, "That URL is unusually long — please check it.")
  .refine(
    (value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a full URL beginning with https://" },
  );

const optionalHttpsUrl = z
  .union([httpsUrl, z.literal("")])
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const optionalEmail = z
  .union([z.string().trim().email("Enter a valid email address, or leave this empty."), z.literal("")])
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .transform((value) => (value === "" ? undefined : value))
    .optional();

export const resourceSubmissionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter the resource's name.")
      .max(80, "Please keep the name under 80 characters."),

    officialUrl: httpsUrl,

    category: z.string().trim().refine(isCategoryId, { message: "Choose a category from the list." }),

    resourceType: z.string().trim().refine(isResourceType, { message: "Choose a resource type from the list." }),

    freeStatus: z
      .string()
      .trim()
      .refine(isFreeStatus, { message: "Choose a free status from the list." })
      .refine((value) => value !== "NOT_FREE", {
        message: "Resources with no free offering are not listed. If it has a free tier, pick that status instead.",
      }),

    whyListed: z
      .string()
      .trim()
      .min(30, "Explain in a sentence or two why this belongs in the library. Entries without a reason are not accepted.")
      .max(600, "Please keep this under 600 characters."),

    limitations: optionalText(900),
    license: optionalText(120),
    commercialUse: optionalText(200),
    verificationInformation: optionalText(600),
    contactEmail: optionalEmail,
  })
  // Statuses where free use is conditional must say what the conditions are. This
  // is the central editorial rule of the project, enforced at the boundary.
  .refine(
    (data) =>
      !["FREE_TIER", "LIMITED_FREE", "PERSONAL_FREE", "TRIAL"].includes(data.freeStatus) ||
      (data.limitations !== undefined && data.limitations.length >= 10),
    {
      path: ["limitations"],
      message:
        "This free status has conditions attached, so the limitations must be described. Hiding limits is the one thing this library will not do.",
    },
  );

export type ResourceSubmissionInput = z.infer<typeof resourceSubmissionSchema>;

export const resourceReportSchema = z.object({
  resourceSlug: z
    .string()
    .trim()
    .min(1, "Which resource is this about?")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "That does not look like a resource identifier."),

  reason: z.enum(REPORT_REASONS, { message: "Choose what is wrong." }),

  details: z
    .string()
    .trim()
    .min(15, "Please describe the problem in a sentence or two so it can be checked.")
    .max(900, "Please keep this under 900 characters."),

  evidenceUrl: optionalHttpsUrl,
  contactEmail: optionalEmail,
});

export type ResourceReportInput = z.infer<typeof resourceReportSchema>;

/** Flattens Zod issues into the field-error shape the forms render. */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    errors[key] = [...(errors[key] ?? []), issue.message];
  }

  return errors;
}
