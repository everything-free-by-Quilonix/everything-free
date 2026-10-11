import { ExternalLink } from "@/components/ui/external-link";
import {
  accessTypeDefinitions,
  contentLicenseLabels,
  creatorUseLabels,
  formatDefinitions,
  languageName,
  offeringLabels,
  regionStateLabels,
} from "@/config/media";
import { availabilityLabel } from "@/lib/resources/derive";
import { primaryMediaAction } from "@/lib/entertainment/actions";
import { discoveryLabels } from "@/lib/entertainment/labels";
import { entertainmentSignals } from "@/lib/entertainment/signals";
import { formatFullDate } from "@/lib/utils/date";
import type { Resource } from "@/types/resource";

/**
 * "What is free here" — the entertainment attribution panel on a record page.
 *
 * Answers, in order: who provides it; whether this is the content or a guide to
 * it; exactly which access types apply; ads and paid upgrades; where it is
 * available; the licence of the content (separately from the software); any time
 * limit; and which page each of the region, licence and offer claims rests on.
 *
 * It says what Everything.Free has *not* established as plainly as what it has,
 * and never claims the project verified copyright ownership: the licence line is
 * what the cited source states.
 */

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-rule/60 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-fg">{term}</dt>
      <dd className="text-sm text-fg-muted">{children}</dd>
    </div>
  );
}

function SourceNote({ url }: { url?: string }) {
  if (!url) return <span className="text-fg-subtle"> · no source recorded</span>;
  return (
    <>
      {" "}
      <ExternalLink href={url} className="link-inline rounded-xs text-xs">
        source
      </ExternalLink>
    </>
  );
}

export function AccessPanel({ resource }: { resource: Resource }) {
  const media = resource.media;
  if (!media) return null;

  const action = primaryMediaAction(resource);
  const labels = discoveryLabels(resource, entertainmentSignals);
  const license = media.contentLicense;
  const region = media.region;

  return (
    <section aria-labelledby="access-heading">
      <h2 id="access-heading" className="font-display text-xl font-semibold">
        What is free here
      </h2>
      <p className="mt-2 max-w-(--measure-standfirst) text-sm text-fg-muted">
        Access, licence and region are separate questions: free to stream is not free to download, and neither is permission
        to reuse. Each line below says what was recorded and, where it matters, the page it comes from.
      </p>

      <dl className="mt-4">
        <Row term="Provided by">{media.provider}</Row>
        <Row term="This listing is">
          {offeringLabels[media.offering]}
          {media.offering === "discovery" ? " — it does not host the content and points to other services." : "."}
        </Row>
        <Row term="Formats">{media.formats.map((f) => formatDefinitions[f].label).join(", ")}</Row>
        <Row term="What is free">
          <ul className="flex flex-col gap-1">
            {media.access.map((a) => (
              <li key={a}>
                <span className="font-medium text-fg">{accessTypeDefinitions[a].label}</span> — {accessTypeDefinitions[a].summary}
              </li>
            ))}
          </ul>
        </Row>
        <Row term="Advertising">{availabilityLabel(media.containsAds)}</Row>
        <Row term="Paid upgrades">{availabilityLabel(media.hasPaidFeatures)}</Row>
        {media.offer ? (
          <Row term="Time-limited offer">
            {media.offer.description}
            {media.offer.endsAt ? ` Ends ${formatFullDate(media.offer.endsAt)}.` : media.offer.recurring ? " Rotates on a schedule." : ""}{" "}
            Afterwards: {media.offer.afterwards}
            <SourceNote url={media.offer.sourceUrl} />
          </Row>
        ) : null}
        <Row term="India">
          {regionStateLabels[region.india]}
          {region.india !== "unknown" ? <SourceNote url={region.sourceUrl} /> : null}
        </Row>
        <Row term="Other regions">
          {region.availableIn.length > 0
            ? region.availableIn.map((c) => (c === "WORLDWIDE" ? "Worldwide" : c)).join(", ")
            : "Not established"}
          {region.notes ? <span className="block text-xs text-fg-subtle">{region.notes}</span> : null}
        </Row>
        <Row term="Content languages">
          {media.contentLanguages.length > 0 ? media.contentLanguages.map(languageName).join(", ") : "Not recorded"}
        </Row>
        <Row term="Content licence">
          {license ? (
            <>
              <span className="font-medium text-fg">{contentLicenseLabels[license.kind]}</span> — {license.summary}
              <span className="block">Reuse in your own work: {creatorUseLabels[license.creatorUse]}.</span>
              {license.attribution ? <span className="block">Credit requested: {license.attribution}</span> : null}
              {license.url ? (
                <ExternalLink href={license.url} className="link-inline mt-1 rounded-xs text-xs">
                  Provider&rsquo;s licence or terms
                </ExternalLink>
              ) : null}
              {license.kind !== "unknown" ? <SourceNote url={license.sourceUrl} /> : null}
            </>
          ) : (
            "Not established. Treat the content as all rights reserved unless the provider says otherwise."
          )}
        </Row>
        {media.genres.length > 0 ? <Row term="Genres">{media.genres.join(", ")}</Row> : null}
        {labels.length > 0 ? (
          <Row term="Labels">
            <ul className="flex flex-col gap-1">
              {labels.map((label) => (
                <li key={label.id}>
                  <span className="font-medium text-fg">{label.label}</span>
                  {label.detail ? ` — ${label.detail}` : ""}
                </li>
              ))}
            </ul>
          </Row>
        ) : null}
        {media.nextReviewAt ? <Row term="Next review due">{formatFullDate(media.nextReviewAt)}</Row> : null}
      </dl>

      <p className="mt-4 text-xs text-fg-subtle">
        The button on cards for this listing reads &ldquo;{action.label}&rdquo;, chosen from the facts above. Everything.Free does
        not host this content and has not independently established who owns its copyright; the licence line is what the cited
        source states.
      </p>
    </section>
  );
}
