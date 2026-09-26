"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ExternalLink } from "@/components/ui/external-link";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { categoryGroups, getCategoriesInGroup } from "@/config/categories";
import { listableFreeStatuses } from "@/config/free-status";
import { resourceTypeList } from "@/config/resource-types";
import { composeSubmissionIssue, issueTemplateUrls } from "../compose";
import { resourceSubmissionSchema } from "../schema";
import { idleState, readField, validateAndCompose, type ContributionState } from "../state";

/**
 * Resource submission form.
 *
 * Validates against the editorial rules in the browser and returns a prefilled
 * GitHub issue. Nothing is transmitted until the contributor opens the link, and
 * they can edit the issue before filing it.
 *
 * Errors are reported in two places on purpose — a summary at the top marked as an
 * alert, and per-field messages wired through `aria-describedby`. A keyboard or
 * screen-reader user should not have to hunt through a long form to find what went
 * wrong (WCAG 3.3.1).
 *
 * This form needs JavaScript. The `<noscript>` block below is a real alternative
 * rather than an apology: GitHub's own issue template collects the same structured
 * fields, so a contributor without JavaScript loses nothing but the inline checks.
 */
export function SubmitResourceForm() {
  const [state, setState] = useState<ContributionState>(idleState);

  const errors = state.status === "error" ? state.fieldErrors : {};
  const errorFor = (fieldName: string) => errors[fieldName]?.[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setState(
      validateAndCompose({
        schema: resourceSubmissionSchema,
        values: {
          name: readField(form, "name"),
          officialUrl: readField(form, "officialUrl"),
          category: readField(form, "category"),
          resourceType: readField(form, "resourceType"),
          freeStatus: readField(form, "freeStatus"),
          whyListed: readField(form, "whyListed"),
          limitations: readField(form, "limitations") ?? "",
          license: readField(form, "license") ?? "",
          commercialUse: readField(form, "commercialUse") ?? "",
          verificationInformation: readField(form, "verificationInformation") ?? "",
          contactEmail: readField(form, "contactEmail") ?? "",
        },
        compose: composeSubmissionIssue,
        successMessage:
          "Your submission passed every check. Open the prefilled issue below to file it — nothing is sent until you do, so you can still edit it.",
        errorMessage: "Some details need attention before this can be submitted.",
      }),
    );
  };

  if (state.status === "success") {
    return (
      <Callout tone="success" icon="check-circle" title="Ready to file" assertive>
        <p>{state.message}</p>
        <p className="mt-4">
          <ExternalLink
            href={state.url}
            showIcon={false}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition-colors hover:bg-primary-hover"
          >
            Open the prefilled submission
            <Icon name="external-link" size={15} />
          </ExternalLink>
        </p>
        <p className="mt-3 text-xs">
          Everything.Free has no submissions database — contributions are handled as issues on the project repository,
          which keeps the project free to run. Your details have been validated and composed into the standard submission
          format.
        </p>
        <p className="mt-3">
          <button
            type="button"
            onClick={() => setState(idleState)}
            className="rounded text-xs underline underline-offset-2 hover:text-fg"
          >
            Submit another resource
          </button>
        </p>
      </Callout>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <noscript>
        <div className="rounded-lg border border-info/30 bg-info-soft px-4 py-3.5 text-sm leading-relaxed">
          <p className="font-medium text-fg">This form needs JavaScript</p>
          <p className="mt-1 text-fg-muted">
            It validates your submission in your browser before filing it. Without JavaScript you can submit the same
            information through GitHub&rsquo;s issue form instead, which collects the identical fields.
          </p>
          <a
            href={issueTemplateUrls.submission}
            className="mt-2 inline-block text-fg underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Submit a resource on GitHub
          </a>
        </div>
      </noscript>

      {state.status === "error" ? (
        <Callout tone="danger" icon="alert-triangle" title="This could not be submitted yet" assertive>
          <p>{state.message}</p>
          {Object.keys(errors).length > 0 ? (
            <ul className="mt-2 list-inside list-disc">
              {Object.entries(errors).map(([fieldName, messages]) => (
                <li key={fieldName}>{messages[0]}</li>
              ))}
            </ul>
          ) : null}
        </Callout>
      ) : null}

      <Field label="Resource name" required error={errorFor("name")}>
        {(context) => <TextInput context={context} name="name" required maxLength={80} autoComplete="off" />}
      </Field>

      <Field
        label="Official URL"
        required
        hint="The provider's own site, not a download mirror or a review page. Must be https."
        error={errorFor("officialUrl")}
      >
        {(context) => (
          <TextInput context={context} name="officialUrl" type="url" required placeholder="https://example.com" />
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" required error={errorFor("category")}>
          {(context) => (
            <Select context={context} name="category" required defaultValue="">
              <option value="" disabled>
                Choose a category
              </option>
              {categoryGroups.map((group) => (
                <optgroup key={group.id} label={group.name}>
                  {getCategoriesInGroup(group.id).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Resource type" required error={errorFor("resourceType")}>
          {(context) => (
            <Select context={context} name="resourceType" required defaultValue="">
              <option value="" disabled>
                Choose a type
              </option>
              {resourceTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <Field
        label="Free status"
        required
        hint="Be precise. A trial is not free, and a free tier is not the same as free."
        error={errorFor("freeStatus")}
      >
        {(context) => (
          <Select context={context} name="freeStatus" required defaultValue="">
            <option value="" disabled>
              Choose a free status
            </option>
            {listableFreeStatuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label} — {status.summary}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field
        label="Why should it be listed?"
        required
        hint="What does this do for someone that justifies a place in the library? Entries without a stated reason are not accepted."
        error={errorFor("whyListed")}
      >
        {(context) => <TextArea context={context} name="whyListed" required rows={4} maxLength={600} />}
      </Field>

      <Field
        label="Known limitations"
        hint="Required for any status with conditions attached: export caps, watermarks, seat limits, feature gating, expiry. One per line."
        error={errorFor("limitations")}
      >
        {(context) => <TextArea context={context} name="limitations" rows={4} maxLength={900} />}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Licence"
          hint="SPDX identifier if it is open source, e.g. MIT or GPL-3.0."
          error={errorFor("license")}
        >
          {(context) => <TextInput context={context} name="license" maxLength={120} autoComplete="off" />}
        </Field>

        <Field
          label="Commercial use"
          hint="Is paid or business use permitted on the free offering?"
          error={errorFor("commercialUse")}
        >
          {(context) => <TextInput context={context} name="commercialUse" maxLength={200} autoComplete="off" />}
        </Field>
      </div>

      <Field
        label="Verification information"
        hint="How did you establish the free status? A link to the pricing or licence page you checked is the most useful thing you can add."
        error={errorFor("verificationInformation")}
      >
        {(context) => <TextArea context={context} name="verificationInformation" rows={3} maxLength={600} />}
      </Field>

      <Field
        label="Your email"
        hint="Only used if a maintainer needs to ask you something. Leave it blank if you would rather not."
        error={errorFor("contactEmail")}
      >
        {(context) => <TextInput context={context} name="contactEmail" type="email" autoComplete="email" />}
      </Field>

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Button type="submit" size="lg">
          Check and prepare submission
        </Button>
        <p className="text-xs text-fg-muted">
          Validated in your browser. Nothing is sent anywhere without your confirmation.
        </p>
      </div>
    </form>
  );
}
