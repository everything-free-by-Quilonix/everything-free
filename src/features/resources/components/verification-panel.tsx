import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import {
  getVerificationCheck,
  missingRequiredChecks,
  requiredVerificationChecks,
  verificationCheckList,
  verificationStage,
} from "@/config/verification";
import { effectiveVerification } from "@/lib/resources/derive";
import { cn } from "@/lib/utils/cn";
import { formatFullDate, formatMonthYear } from "@/lib/utils/date";
import type { Resource, VerificationCheck, VerificationCheckRecord, VerificationSource } from "@/types/resource";

/**
 * The verification panel on a resource page.
 *
 * Two layers, because two audiences want different things:
 *
 * - Everyone gets the summary: the status, when it was last checked, how many of the
 *   required checks are confirmed, and — when it applies — that the evidence is
 *   complete but still awaiting a maintainer's sign-off.
 * - Anyone who wants to audit the claim opens "View verification evidence": every
 *   check with its result, what the source actually says, the page it came from and
 *   the date that page was read.
 *
 * The disclosure is a native `<details>` element: keyboard and screen-reader support
 * come built in, it works without JavaScript, and find-in-page searches it.
 */

type RowState = "confirmed" | "unresolved" | "not-checked";

const ROW_STATE: Record<RowState, { label: string; icon: IconName; className: string }> = {
  confirmed: { label: "Confirmed", icon: "check-circle", className: "text-success-fg" },
  unresolved: { label: "Could not confirm", icon: "help-circle", className: "text-warning-fg" },
  "not-checked": { label: "Not yet checked", icon: "minus-circle", className: "text-fg-subtle" },
};

interface Row {
  check: VerificationCheck;
  required: boolean;
  state: RowState;
  record?: VerificationCheckRecord;
  source?: VerificationSource;
}

function buildRows(resource: Resource): Row[] {
  const records = new Map((resource.verificationChecks ?? []).map((record) => [record.check, record]));
  const sources = new Map((resource.verificationSources ?? []).map((source) => [source.url, source]));

  const rows = verificationCheckList.map((definition): Row => {
    const record = records.get(definition.id);
    return {
      check: definition.id,
      required: definition.requiredForVerified,
      state: record ? record.result : "not-checked",
      record,
      source: record?.sourceUrl ? sources.get(record.sourceUrl) : undefined,
    };
  });

  // Gaps first within each group: the outstanding work is the most useful thing to
  // see, and a wall of green ticks should not bury the one check that failed.
  const order: Record<RowState, number> = { unresolved: 0, "not-checked": 1, confirmed: 2 };
  return rows.sort(
    (a, b) => Number(b.required) - Number(a.required) || order[a.state] - order[b.state],
  );
}

/**
 * Notes written while the listing was compiled. Labelled as such, because they
 * describe what the listing was based on — not a check anyone recorded.
 */
function CompilationNotes({ notes }: { notes: string }) {
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="text-xs font-medium text-fg">How this listing was compiled</p>
      <p className="mt-1 text-xs leading-relaxed text-fg-muted">{notes}</p>
      <p className="mt-1 text-xs leading-relaxed text-fg-subtle">Not verification: nothing here was recorded as checked.</p>
    </div>
  );
}

export function VerificationPanel({ resource }: { resource: Resource }) {
  const verification = effectiveVerification(resource);
  const records = resource.verificationChecks ?? [];
  const sources = resource.verificationSources ?? [];

  const requiredTotal = requiredVerificationChecks.length;
  const requiredConfirmed = requiredTotal - missingRequiredChecks(records).length;
  const stage = verificationStage(resource);
  const awaitingSignOff = stage === "awaiting-sign-off";

  const rows = buildRows(resource);
  const lastChecked = formatMonthYear(resource.lastVerifiedAt);

  return (
    <Card className="p-5">
      <h2 className="font-display text-sm font-semibold">Verification</h2>

      {/* ------------------------------------------------------ summary */}
      <div className="mt-3 flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Icon name={verification.icon} size={16} className="shrink-0 text-fg-subtle" />
          <span className="font-medium text-fg">{verification.label}</span>
        </div>

        <ul className="flex flex-col gap-1.5 text-fg-muted">
          <li>
            {lastChecked ? (
              <>
                Last checked{" "}
                <time dateTime={resource.lastVerifiedAt} className="text-fg">
                  {lastChecked}
                </time>
              </>
            ) : (
              "Not checked against official sources yet"
            )}
          </li>
          {records.length > 0 ? (
            <li>
              <span className="text-fg tabular-nums">
                {requiredConfirmed} of {requiredTotal}
              </span>{" "}
              required checks confirmed
            </li>
          ) : null}
          {resource.verifiedBy ? (
            <li>
              {stage === "verified" ? "Signed off by" : "Checked by"} {resource.verifiedBy}
            </li>
          ) : null}
        </ul>

        {awaitingSignOff ? (
          <p className="rounded-sm border border-info/30 bg-info-soft px-3 py-2.5 text-xs leading-relaxed text-fg-muted">
            <span className="font-medium text-fg">Evidence complete, awaiting sign-off.</span> Every required check is
            backed by an official source, but a maintainer has not yet reviewed it and put their name to it. Only then is a
            listing marked Verified.
          </p>
        ) : null}

        {records.length === 0 ? (
          <p className="text-xs leading-relaxed text-fg-subtle">
            The details on this page were compiled from the provider&rsquo;s public documentation. None of them has been
            checked against an official source and recorded yet, so treat them as a starting point and confirm anything
            you rely on with the provider.
          </p>
        ) : stage === "started" ? (
          <p className="text-xs leading-relaxed text-fg-subtle">
            Some facts have been checked, but the free status itself has not been confirmed against an official source
            yet.
          </p>
        ) : null}
      </div>

      {/* ---------------------------------------------- full evidence */}
      {records.length > 0 ? (
        <details className="group mt-4 border-t border-border pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
            View verification evidence
            <Icon
              name="chevron-down"
              size={15}
              className="shrink-0 text-fg-subtle transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>

          <ol className="mt-3 flex list-none flex-col divide-y divide-border">
            {rows.map((row) => {
              const state = ROW_STATE[row.state];
              const definition = getVerificationCheck(row.check);
              return (
                <li key={row.check} className="py-3 first:pt-0">
                  <p className="flex items-start justify-between gap-2 text-xs">
                    <span className="font-medium text-fg">
                      {definition.label}
                      {row.required ? null : <span className="ml-1 font-normal text-fg-subtle">(optional)</span>}
                    </span>
                    <span className={cn("inline-flex shrink-0 items-center gap-1", state.className)}>
                      <Icon name={state.icon} size={12} />
                      {state.label}
                    </span>
                  </p>

                  {row.record ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{row.record.evidence}</p>
                  ) : (
                    <p className="mt-1.5 text-xs leading-relaxed text-fg-subtle">{definition.question}</p>
                  )}

                  {row.source ? (
                    <p className="mt-1.5 text-xs text-fg-subtle">
                      <ExternalLink
                        href={row.source.url}
                        className="text-fg-muted underline underline-offset-2 hover:text-primary"
                        announceExternal={false}
                      >
                        {new URL(row.source.url).hostname.replace(/^www\./, "")}
                        {new URL(row.source.url).pathname.replace(/\/$/, "")}
                      </ExternalLink>
                      {" · read "}
                      <time dateTime={row.source.retrievedAt}>{formatFullDate(row.source.retrievedAt)}</time>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {sources.length > 0 ? (
            <div className="mt-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-fg">Sources consulted</p>
              <ul className="mt-2 flex flex-col gap-2">
                {sources.map((source) => (
                  <li key={source.url} className="text-xs leading-relaxed">
                    <ExternalLink
                      href={source.url}
                      className="text-fg-muted underline underline-offset-2 hover:text-primary"
                      announceExternal={false}
                    >
                      {source.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {resource.verificationNotes ? (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs font-medium text-fg">Verification notes</p>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">{resource.verificationNotes}</p>
            </div>
          ) : null}

          {resource.compilationNotes ? <CompilationNotes notes={resource.compilationNotes} /> : null}
        </details>
      ) : resource.compilationNotes ? (
        <CompilationNotes notes={resource.compilationNotes} />
      ) : null}

      <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3">
        <Link
          href="/verification"
          className="inline-flex items-center gap-1 text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          How verification works
          <Icon name="chevron-right" size={12} />
        </Link>
        <Link
          href={`/report?resource=${resource.slug}`}
          className="inline-flex items-center gap-1 text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          Something out of date? Report it
          <Icon name="chevron-right" size={12} />
        </Link>
      </div>
    </Card>
  );
}
