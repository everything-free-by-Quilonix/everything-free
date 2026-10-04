import type { ReactNode } from "react";

import { plural } from "@/components/ui/count";
import { getFreeStatus } from "@/config/free-status";
import { availabilityLabel, platformLabels } from "@/lib/resources/derive";
import { factEvidence, hasRecordedValue, type Fact, type TriStateFact } from "@/lib/resources/evidence";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

import { EvidenceTag } from "./evidence";
import { FactMeter } from "./fact-meter";
import { factMeterCounts } from "../fact-meter-counts";
import { FreeStatusBadge, OpenSourceBadge } from "./status-badges";

/**
 * Resource snapshot: the facts most people decide on, each with its evidence.
 *
 * When to use: `size="compact"` opens a record's facts zone; `size="full"` is the
 * readout in the record-page header. When not to use: as a row of coloured
 * badges; compact has two tokens at most, and full is a ruled grid of words.
 *
 * Keyboard: static.
 *
 * Evidence: this file computes no tone and no evidence state of its own. The
 * compact tokens come from `status-badges.tsx`, which gates tone on confirmed
 * evidence. The free-status token is the first `[data-fact]` in a record, which
 * the smoke audit relies on. The full grid reads every state from `factEvidence`
 * and `hasRecordedValue`, and words each value exactly as the Facts ledger does:
 * the value when confirmed, "Recorded as …" (or "Listed as …" for the free
 * status) when only recorded, "Unknown" when nothing is recorded.
 */
export function ResourceSnapshot({ resource, size }: { resource: Resource; size: "compact" | "full" }) {
  const showOpenSource = resource.openSource && resource.freeStatus !== "OPEN_SOURCE";

  if (size === "compact") {
    return (
      <div className="flex flex-wrap gap-1.5">
        <FreeStatusBadge resource={resource} variant="token" />
        {showOpenSource ? <OpenSourceBadge variant="token" resource={resource} /> : null}
      </div>
    );
  }

  const status = getFreeStatus(resource.freeStatus);
  const platforms = platformLabels(resource).length;
  const platformCount = `${formatCount(platforms)} ${plural(platforms, "platform", "platforms")}`;
  const meter = factMeterCounts(resource);

  return (
    // Cells are separated by the grid's 1px gaps over the rule colour; each cell
    // carries the header's own background, so nothing reads as a filled box.
    <dl className="grid grid-cols-3 gap-px border-y border-rule bg-rule md:grid-cols-6">
      <Cell label="Free status">
        <span className="flex flex-col items-start gap-1.5" data-fact="freeStatus" data-evidence={factEvidence(resource, "freeStatus").state}>
          <FactWords resource={resource} fact="freeStatus" value={status.label} recorded={<>Listed as {status.label.toLowerCase()}</>} />
        </span>
        {showOpenSource ? (
          <span className="mt-2 block">
            <OpenSourceBadge variant="token" resource={resource} />
          </span>
        ) : null}
      </Cell>
      <TriStateCell resource={resource} fact="requiresAccount" label="Account" />
      <TriStateCell resource={resource} fact="requiresCreditCard" label="Credit card" />
      <TriStateCell resource={resource} fact="commercialUse" label="Commercial use" />
      <Cell label="Platforms">
        {platforms === 0 ? (
          <span className="flex flex-col items-start gap-1.5">
            <span className="text-fg-subtle">Not recorded</span>
            <EvidenceTag evidence={factEvidence(resource, "platforms")} />
          </span>
        ) : (
          <span className="flex flex-col items-start gap-1.5">
            <FactWords resource={resource} fact="platforms" value={platformCount} recorded={<>Recorded as {platformCount}</>} />
          </span>
        )}
      </Cell>
      <Cell label="Facts confirmed">
        <FactMeter confirmed={meter.confirmed} unsettled={meter.unsettled} total={meter.total} labelled />
      </Cell>
    </dl>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 bg-bg-subtle px-2 py-3 sm:px-3">
      <dt className="kicker">{label}</dt>
      <dd className="mt-1.5 text-sm">{children}</dd>
    </div>
  );
}

/** The value line and, under it, its evidence tag. */
function FactWords({
  resource,
  fact,
  value,
  recorded,
}: {
  resource: Resource;
  fact: Fact;
  value: ReactNode;
  recorded: ReactNode;
}) {
  const evidence = factEvidence(resource, fact);
  const shown =
    evidence.state === "confirmed" ? (
      <span className="text-fg">{value}</span>
    ) : hasRecordedValue(resource, fact) ? (
      <span className="text-fg-muted">{recorded}</span>
    ) : (
      <span className="text-fg-muted">Unknown</span>
    );
  return (
    <>
      {shown}
      <EvidenceTag evidence={evidence} />
    </>
  );
}

function TriStateCell({ resource, fact, label }: { resource: Resource; fact: TriStateFact; label: string }) {
  const value = resource[fact];
  return (
    <Cell label={label}>
      <span className="flex flex-col items-start gap-1.5">
        <FactWords resource={resource} fact={fact} value={availabilityLabel(value)} recorded={<>Recorded as {value}</>} />
      </span>
    </Cell>
  );
}
