import type { CSSProperties } from "react";
import { countNoun, plural, type LibraryCensus } from "@/features/home/census";
import { formatCount } from "@/lib/utils/format";

/**
 * The Survey bar: how much of the library has been surveyed against official
 * sources, as one bar of mutually exclusive segments.
 *
 * When to use: the homepage introduction (`sm`) and `/verification` (`lg`), each
 * time beside `SurveySummary`. When not to use: per listing (that is the fact
 * meter), or without its sentence.
 *
 * Keyboard: static and `aria-hidden`; the sentence carries every number, so
 * nothing depends on the bar or on colour.
 *
 * Evidence: segments come only from `libraryCensus`, whose verification counts
 * exclude stale passes. The bar is never animated in.
 */

type Survey = LibraryCensus["survey"];

const SEGMENTS: readonly (keyof Survey)[] = ["verified", "partiallyVerified", "otherConfirmedFact", "noConfirmedFact"];

export function SurveyBar({ survey, size }: { survey: Survey; size: "sm" | "lg" }) {
  const total = SEGMENTS.reduce((sum, key) => sum + survey[key], 0);
  return (
    <div className="survey-bar" data-size={size} aria-hidden="true">
      {SEGMENTS.map((key) => {
        const value = survey[key];
        const width = total > 0 ? (value / total) * 100 : 0;
        return (
          <span
            key={key}
            data-segment={key}
            data-empty={value === 0 ? "" : undefined}
            style={{ "--w": `${width.toFixed(2)}%` } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

/** The sentences beside the bar. Zero is stated plainly, never hidden or reworded. */
export function SurveySummary({ census }: { census: LibraryCensus }) {
  const { listings, withConfirmedFact, partiallyVerified, verified } = census;

  return (
    <p className="text-sm text-fg-muted">
      {withConfirmedFact === 0 ? (
        "No listing has a fact confirmed by an official source yet."
      ) : (
        <>
          <span className="tabular-nums">{formatCount(withConfirmedFact)}</span> of{" "}
          <span className="tabular-nums">{countNoun(listings, "listing", "listings")}</span>{" "}
          {plural(withConfirmedFact, "has", "have")} a fact confirmed by an official source.
        </>
      )}{" "}
      <span className="tabular-nums">{formatCount(partiallyVerified)}</span>{" "}
      {plural(partiallyVerified, "is", "are")} partially verified.{" "}
      <span className="tabular-nums">{formatCount(verified)}</span> {plural(verified, "is", "are")} fully verified.
    </p>
  );
}
