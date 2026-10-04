import type { ReactNode } from "react";

import { displayHost, ExternalLink } from "@/components/ui/external-link";
import { plural } from "@/components/ui/count";
import { getFreeStatus } from "@/config/free-status";
import {
  missingRequiredChecks,
  requiredVerificationChecks,
  VERIFICATION_FRESHNESS_DAYS,
  verificationStage,
  verificationStageLabels,
} from "@/config/verification";
import { effectiveVerification } from "@/lib/resources/derive";
import { factEvidence } from "@/lib/resources/evidence";
import { formatFullDate, isVerificationStale } from "@/lib/utils/date";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

import { EvidenceMark, EvidenceTag } from "./evidence";
import { LastVerified, VerificationBadge } from "./status-badges";

/**
 * Provenance rail: where a record comes from and how far it has been checked,
 * in the order evidence flows: source, evidence, status, licence, verification.
 *
 * When to use: once, at the top of the record-page aside. When not to use: in
 * lists or cards; it is a per-record reading, not a summary badge.
 *
 * Keyboard: static except its links, which follow reading order. Station labels
 * are `<p>` kickers, not headings, so the page outline stays clean.
 *
 * Evidence: every value is a real field or an unchanged helper. Station 2 shows
 * the same required-checks figure as the Verification panel (the same
 * `requiredVerificationChecks`/`missingRequiredChecks` computation), and only
 * when check records exist. Status and licence carry `EvidenceTag`; the stale
 * suffix carries `EvidenceMark`. The ring markers are identical and neutral:
 * they mark position on the rail, never evidence. No element here carries
 * `data-fact`, so the smoke audits of the header and the Facts ledger are
 * unaffected.
 */
export function ProvenanceRail({ resource }: { resource: Resource }) {
  const sources = resource.verificationSources ?? [];
  const records = resource.verificationChecks ?? [];
  const latestRead = sources.reduce<string | undefined>(
    (latest, source) => (!latest || source.retrievedAt > latest ? source.retrievedAt : latest),
    undefined,
  );
  const requiredTotal = requiredVerificationChecks.length;
  const requiredConfirmed = requiredTotal - missingRequiredChecks(records).length;
  const stale = isVerificationStale(resource.lastVerifiedAt);

  const status = getFreeStatus(resource.freeStatus);
  const stage = verificationStage(resource);
  const stageLabel = verificationStageLabels[stage];
  const verification = effectiveVerification(resource);

  return (
    <section aria-labelledby="provenance-heading">
      <h2 id="provenance-heading" className="font-display text-sm font-semibold">
        Provenance
      </h2>
      <ol className="provenance mt-4 flex flex-col gap-5 text-sm">
        <Station label="Source">
          <p>
            Official site:{" "}
            <ExternalLink href={resource.officialUrl} className="link-inline" announceExternal={false}>
              <span translate="no">{displayHost(resource.officialUrl)}</span>
            </ExternalLink>
          </p>
          <p className="text-fg-muted">
            {resource.sourceUrl ? (
              <>
                Source code:{" "}
                <ExternalLink href={resource.sourceUrl} className="link-inline" announceExternal={false}>
                  <span translate="no">{displayHost(resource.sourceUrl)}</span>
                </ExternalLink>
              </>
            ) : (
              "No public source recorded"
            )}
          </p>
          {resource.pricingUrl || resource.licenseUrl ? (
            <p className="text-fg-muted">
              {resource.pricingUrl ? (
                <ExternalLink href={resource.pricingUrl} className="link-inline" announceExternal={false}>
                  Pricing page
                </ExternalLink>
              ) : null}
              {resource.pricingUrl && resource.licenseUrl ? " · " : null}
              {resource.licenseUrl ? (
                <ExternalLink href={resource.licenseUrl} className="link-inline" announceExternal={false}>
                  Licence text
                </ExternalLink>
              ) : null}
            </p>
          ) : null}
        </Station>

        <Station label="Evidence">
          <p className="text-fg-muted tabular-nums" data-provenance="pages">
            {sources.length > 0 ? (
              <>
                {formatCount(sources.length)} official {plural(sources.length, "page", "pages")} read, latest{" "}
                <time dateTime={latestRead}>{formatFullDate(latestRead)}</time>
              </>
            ) : (
              "No official pages read yet"
            )}
          </p>
          <p className="text-fg-muted tabular-nums" data-provenance="checks">
            {records.length > 0 ? (
              <>
                <span className="text-fg">
                  {requiredConfirmed} of {requiredTotal}
                </span>{" "}
                required checks recorded as confirmed
              </>
            ) : (
              "No checks recorded yet"
            )}
            {stale ? (
              <span className="text-warning-fg">
                {" · "}
                <EvidenceMark reason="stale" className="inline align-[-1px]" /> all need re-checking (older than{" "}
                {VERIFICATION_FRESHNESS_DAYS} days)
              </span>
            ) : null}
          </p>
        </Station>

        <Station label="Status">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-fg">{status.label}</span>
            <EvidenceTag evidence={factEvidence(resource, "freeStatus")} />
          </p>
          <p className="text-fg-muted">{status.summary}</p>
        </Station>

        <Station label="Licence">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {resource.license ? (
              <span className="text-fg" translate="no">
                {resource.license}
              </span>
            ) : (
              <span className="text-fg-subtle">Not recorded</span>
            )}
            <EvidenceTag evidence={factEvidence(resource, "license")} />
          </p>
          {resource.licenseNotes ? <p className="text-fg-muted">{resource.licenseNotes}</p> : null}
        </Station>

        <Station label="Verification">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <VerificationBadge resource={resource} />
            {stageLabel !== verification.label ? <span className="text-fg-muted">{stageLabel}</span> : null}
          </p>
          <p className="text-fg-muted">
            <LastVerified resource={resource} />
            {resource.verifiedBy ? (
              <>
                {" · "}
                {stage === "verified" ? "Signed off by" : "Checked by"} {resource.verifiedBy}
              </>
            ) : null}
          </p>
          <p>
            <a href="#verification" className="link-inline">
              See the verification record
            </a>
          </p>
        </Station>
      </ol>
    </section>
  );
}

function Station({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="relative flex flex-col gap-1 pl-6">
      <span
        aria-hidden="true"
        className="absolute top-1 left-0 size-[7px] rounded-full border border-border-strong"
      />
      <p className="kicker">{label}</p>
      {children}
    </li>
  );
}
