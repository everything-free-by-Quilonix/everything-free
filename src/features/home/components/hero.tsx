import Link from "next/link";
import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/layout";
import { intentExamples, searchExamples, site } from "@/config/site";
import { SearchBox, SearchSuggestions } from "@/features/search/components/search-box";
import { formatCount } from "@/lib/utils/format";

/**
 * Homepage hero.
 *
 * The job of this block is to answer one question in the first second: "can I
 * find the free thing I need here?" So it leads with search rather than with a
 * pitch, and the example queries are real searches that return real results.
 *
 * The only number shown is the library size, which we can count. There are no
 * user counts, download counts or "trusted by" claims, because we have no data to
 * support them.
 */
export function Hero({ resourceCount, toolCount }: { resourceCount: number; toolCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Purely decorative grid, faded at the edges. */}
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-fg-muted">
            <Icon name="shield-check" size={13} className="text-primary" />
            Free status, limits and verification stated plainly
          </p>

          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Everything<span className="text-primary">.</span>Free
          </h1>

          <p className="mt-4 text-lg text-fg-muted sm:text-xl">{site.shortDescription}</p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
            Discover free apps, websites, software, tools, learning resources and creative assets — all in one place.
          </p>

          <div className="mt-8">
            <SearchBox size="lg" label="Search free resources" />
          </div>

          <SearchSuggestions queries={searchExamples.slice(0, 5)} className="mt-5 justify-center" />

          <p className="mt-8 text-sm text-fg-subtle">
            {formatCount(resourceCount)} resources in the library · {formatCount(toolCount)} tools you can use here
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-xl border border-border bg-surface/70 p-5 backdrop-blur-sm">
          <h2 className="flex items-center gap-2 text-sm font-medium text-fg">
            <Icon name="bolt" size={15} className="text-primary" />
            Describe what you need
          </h2>
          <p className="mt-1.5 text-sm text-fg-muted">
            Search understands constraints written in plain language — things like “without a credit card”, “open
            source”, or “alternative to Photoshop” — and turns them into filters you can see and change.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {intentExamples.map((example) => (
              <li key={example}>
                <Link
                  href={`/resources?q=${encodeURIComponent(example)}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                >
                  <Icon name="search" size={14} className="shrink-0 text-fg-subtle" />
                  <span className="min-w-0 flex-1">“{example}”</span>
                  <Icon
                    name="arrow-right"
                    size={14}
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
