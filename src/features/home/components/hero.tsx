import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/layout";
import { intentExamples } from "@/config/site";
import { countNoun, type LibraryCensus } from "@/features/home/census";
import { Legend } from "@/features/resources/components/legend";
import { SurveyBar, SurveySummary } from "@/features/resources/components/survey-bar";
import { PaletteShortcutHint } from "@/features/palette/palette-trigger";
import { SearchBox } from "@/features/search/components/search-box";

/**
 * The Library introduction: the homepage's opening, as a library index rather
 * than a pitch.
 *
 * When to use: the homepage only. When not to use: anywhere a number would have
 * to be typed by hand; every figure here comes from `libraryCensus` at build.
 *
 * Keyboard: the search form and the text links, in reading order.
 *
 * Evidence: the title states the library's size and subjects, never that its
 * contents are free as a confirmed fact; the Legend and Survey bar say how much
 * of it an official source confirms, including when that is nothing.
 */
export function Hero({ census }: { census: LibraryCensus }) {
  const empty = census.listings === 0;

  return (
    <section aria-labelledby="library-heading">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">
            <p className="kicker">Everything.Free · Library index</p>

            <h1 id="library-heading" className="mt-4 max-w-4xl font-serif text-display font-medium">
              {empty ? (
                "The library has no listings yet."
              ) : (
                <>
                  A library of <span className="tabular-nums">{countNoun(census.listings, "listing", "listings")}</span>{" "}
                  of free resources, across{" "}
                  <span className="tabular-nums">{countNoun(census.subjectsWithListings, "subject", "subjects")}</span>.
                </>
              )}
            </h1>

            <p className="mt-6 max-w-(--measure-standfirst) text-lg text-fg-muted">
              Each listing says what &ldquo;free&rdquo; means for it, what the free offering limits, and which of its
              facts an official source confirms. Nothing is ranked by popularity, because nothing is tracked.
            </p>

            <div className="mt-8 max-w-2xl">
              <SearchBox size="lg" label="Search the library" />
            </div>
            {empty ? null : <PaletteShortcutHint className="mt-3 text-sm text-fg-subtle" />}

            {empty ? (
              <p className="mt-4 text-sm text-fg-muted">
                <Link href="/submit" className="link-inline">
                  Submit a resource
                </Link>
              </p>
            ) : (
              <p className="mt-4 max-w-2xl text-sm text-fg-muted">
                <span className="text-fg-subtle">Try: </span>
                {intentExamples.map((example, index) => (
                  <span key={example}>
                    {index > 0 ? <span className="text-fg-subtle"> · </span> : null}
                    <Link href={`/resources/?q=${encodeURIComponent(example)}`} className="link-inline">
                      {example}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-12 lg:col-span-4">
            <Legend variant="full" />

            {empty ? null : (
              <div>
                <p className="kicker">Survey</p>
                <div className="mt-3">
                  <SurveyBar survey={census.survey} size="sm" />
                </div>
                <div className="mt-3">
                  <SurveySummary census={census} />
                </div>
                <Link
                  href="/verification"
                  className="mt-3 inline-flex items-center gap-1 rounded-xs text-sm font-medium text-fg-muted underline-offset-[0.2em] transition-colors hover:text-fg hover:underline"
                >
                  How verification works
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
