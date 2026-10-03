"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { Button, buttonClasses } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ExternalLink } from "@/components/ui/external-link";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { REPORT_REASONS } from "@/types/submission";
import { composeReportIssue, issueTemplateUrls } from "../compose";
import { resourceReportSchema } from "../schema";
import { idleState, readField, validateAndCompose, type ContributionState } from "../state";

const REASON_LABELS: Record<(typeof REPORT_REASONS)[number], string> = {
  BROKEN_LINK: "The link is broken",
  NO_LONGER_FREE: "It is no longer free at all",
  PRICING_CHANGED: "The free plan or its limits have changed",
  INCORRECT_INFORMATION: "Something on the page is wrong",
  WRONG_CATEGORY: "It is in the wrong category",
  DUPLICATE: "It is listed twice",
  SUGGEST_ALTERNATIVE: "I want to suggest a related resource",
  OTHER: "Something else",
};

/**
 * Correction report form.
 *
 * Reports are the highest-value contribution to a directory, because a wrong entry
 * is worse than a missing one. The form is therefore short: resource, what is
 * wrong, and a couple of sentences.
 *
 * The resource slug is read from the URL in the browser rather than resolved on the
 * server, which keeps `/report` a static page. `resourceNames` is a small
 * slug-to-name map passed in at build time so the form can still confirm *which*
 * resource is being reported — a slug alone is easy to get wrong.
 */
export function ReportResourceForm({ resourceNames }: { resourceNames: Record<string, string> }) {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ContributionState>(idleState);

  const requested = searchParams.get("resource") ?? "";
  // Only prefill a slug that actually exists, so a mistyped or tampered query
  // string does not lock the field to something unreportable.
  const knownSlug = Object.hasOwn(resourceNames, requested) ? requested : "";
  const resourceName = knownSlug ? resourceNames[knownSlug] : undefined;

  const errors = state.status === "error" ? state.fieldErrors : {};
  const errorFor = (fieldName: string) => errors[fieldName]?.[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setState(
      validateAndCompose({
        schema: resourceReportSchema,
        values: {
          resourceSlug: readField(form, "resourceSlug"),
          reason: readField(form, "reason"),
          details: readField(form, "details"),
          evidenceUrl: readField(form, "evidenceUrl") ?? "",
          contactEmail: readField(form, "contactEmail") ?? "",
        },
        compose: composeReportIssue,
        successMessage:
          "The report passed every check. Open the prefilled issue below to file it — you can review and edit it before submitting.",
        errorMessage: "Some details need attention before this can be sent.",
      }),
    );
  };

  if (state.status === "success") {
    return (
      <Callout tone="neutral" icon={null} title="Ready to file" assertive>
        <p>{state.message}</p>
        <p className="mt-4">
          <ExternalLink
            href={state.url}
            showIcon={false}
            className={buttonClasses({ variant: "primary", size: "md" })}
          >
            Open the prefilled report
            <Icon name="external-link" size={15} />
          </ExternalLink>
        </p>
        <p className="mt-3 text-xs">Thank you — corrections are what keep the library worth using.</p>
      </Callout>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <noscript>
        <div className="rounded-sm border border-rule px-4 py-3.5 text-sm leading-relaxed">
          <p className="font-medium text-fg">This form needs JavaScript</p>
          <p className="mt-1 text-fg-muted">
            You can report the same problem through GitHub&rsquo;s issue form instead, which collects the identical
            fields.
          </p>
          <a
            href={issueTemplateUrls.correction}
            className="mt-2 inline-block text-fg underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report a problem on GitHub
          </a>
        </div>
      </noscript>

      {state.status === "error" ? (
        <Callout tone="danger" icon="alert-triangle" title="This could not be sent yet" assertive>
          <p>{state.message}</p>
          <ul className="mt-2 list-inside list-disc">
            {Object.entries(errors).map(([fieldName, messages]) => (
              <li key={fieldName}>{messages[0]}</li>
            ))}
          </ul>
        </Callout>
      ) : null}

      <Field
        label="Resource identifier"
        required
        hint={
          resourceName
            ? `Reporting ${resourceName}. This is the identifier from its page URL.`
            : "The last part of the resource page URL, for example “gimp”."
        }
        error={errorFor("resourceSlug")}
      >
        {(context) => (
          <TextInput
            context={context}
            name="resourceSlug"
            required
            defaultValue={knownSlug}
            readOnly={Boolean(knownSlug)}
            className={knownSlug ? "bg-surface-raised" : undefined}
            autoComplete="off"
          />
        )}
      </Field>

      <Field label="What is wrong?" required error={errorFor("reason")}>
        {(context) => (
          <Select context={context} name="reason" required defaultValue="">
            <option value="" disabled>
              Choose a reason
            </option>
            {REPORT_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {REASON_LABELS[reason]}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field
        label="Details"
        required
        hint="What should it say instead? Specifics make a report actionable."
        error={errorFor("details")}
      >
        {(context) => <TextArea context={context} name="details" required rows={5} maxLength={900} />}
      </Field>

      <Field
        label="Evidence URL"
        hint="A link that backs this up — a pricing page, a changelog, an announcement."
        error={errorFor("evidenceUrl")}
      >
        {(context) => <TextInput context={context} name="evidenceUrl" type="url" placeholder="https://" />}
      </Field>

      <Field
        label="Your email"
        hint="Only if you are happy to be asked a follow-up question."
        error={errorFor("contactEmail")}
      >
        {(context) => <TextInput context={context} name="contactEmail" type="email" autoComplete="email" />}
      </Field>

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Button type="submit" size="lg">
          Check and prepare report
        </Button>
        <p className="text-xs text-fg-muted">You will be able to review it before it is filed.</p>
      </div>
    </form>
  );
}
