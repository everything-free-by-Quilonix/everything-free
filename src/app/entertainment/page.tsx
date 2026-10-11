import Link from "next/link";
import type { Metadata } from "next";

import { Icon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { plural } from "@/components/ui/count";
import { Container, Section, SectionLink } from "@/components/ui/layout";
import { withBasePath } from "@/config/deployment";
import { MIN_SHELF_LISTINGS, shelves } from "@/config/media";
import { MediaGrid } from "@/features/entertainment/components/media-card";
import { getEntertainmentResources, labelsFor } from "@/features/entertainment/data";
import { primaryMediaAction } from "@/lib/entertainment/actions";
import { discoveryLabelDefinitions, DISCOVERY_LABELS, githubSignalFor } from "@/lib/entertainment/labels";
import { shelfResources } from "@/lib/entertainment/query";
import { entertainmentSignals } from "@/lib/entertainment/signals";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatCount } from "@/lib/utils/format";
import type { Resource } from "@/types/resource";

export const metadata: Metadata = buildMetadata({
  title: "Free entertainment",
  description:
    "Legal free films, series, anime, games, music, podcasts, audiobooks, comics and culture — each with what is actually free, where it is available, and when it was last checked.",
  path: "/entertainment",
});

/** A landing section is only shown with enough listings to be worth a row. */
const MIN_ROW = 3;
const ROW = 8;

function row(resources: Resource[], predicate: (r: Resource) => boolean, sort?: (a: Resource, b: Resource) => number) {
  const picked = resources.filter(predicate);
  if (sort) picked.sort(sort);
  return picked.slice(0, ROW);
}

export default async function EntertainmentPage() {
  const all = await getEntertainmentResources();
  const labelsBySlug = labelsFor(all);
  const hasLabel = (r: Resource, id: string) => labelsBySlug[r.slug]?.some((l) => l.id === id);
  const byName = (a: Resource, b: Resource) => a.name.localeCompare(b.name);

  const content = all.filter((r) => r.media!.offering !== "discovery").length;
  const discovery = all.filter((r) => r.media!.offering === "discovery").length;
  const software = all.filter((r) => r.media!.offering === "software").length;

  const rows = [
    {
      id: "play-now",
      title: "Play in your browser",
      description: "Games whose own page is where you play. Nothing to install; the game runs on the developer's site, not here.",
      href: "/entertainment/games?browser=1",
      items: row(all, (r) => primaryMediaAction(r).kind === "play-browser", byName),
    },
    {
      id: "watch",
      title: "Free to watch",
      description: "Services and archives where the films and series themselves are free — with ads, from the public domain, or from the rights holder.",
      href: "/entertainment/watch?content=1",
      items: row(all, (r) => ["watch-free", "watch-library"].includes(primaryMediaAction(r).kind), byName),
    },
    {
      id: "india",
      title: "Available in India",
      description: "A page read during verification says the free offer works in India. Everything else says “not established” until someone checks.",
      href: "/entertainment/browse?india=1",
      items: row(all, (r) => hasLabel(r, "free-in-india"), byName),
    },
    {
      id: "open-source",
      title: "Open-source games",
      description: "Licences confirmed from each project's own licence file. Some engines need original game data you must own; the listing says so.",
      href: "/entertainment/games?format=open-source-game&oss=1",
      items: row(all, (r) => r.media!.formats.includes("open-source-game") && hasLabel(r, "open-source-pick"), byName),
    },
    {
      id: "listen",
      title: "Listen free",
      description: "Radio, podcasts and audiobooks. Free to listen is never presented as free to reuse; the licence is on each listing.",
      href: "/entertainment/listen",
      items: row(all, (r) => ["listen-free", "listen-live"].includes(primaryMediaAction(r).kind), byName),
    },
    {
      id: "updated",
      title: "Recently updated projects",
      description: "Open-source projects with a commit in the 30 days before the last signal run, from GitHub's public API. Dated on each card.",
      href: "/entertainment/browse?oss=1",
      items: row(all, (r) => hasLabel(r, "recently-updated"), byName),
    },
    {
      id: "community",
      title: "Community favourites",
      description: "Open-source projects with at least 1,000 GitHub stars, as recorded by the signal script. The count and its date are on each card.",
      href: "/entertainment/browse?oss=1",
      items: row(
        all,
        (r) => hasLabel(r, "community-favourite"),
        (a, b) =>
          (githubSignalFor(b, entertainmentSignals)?.stars ?? 0) - (githubSignalFor(a, entertainmentSignals)?.stars ?? 0) ||
          byName(a, b),
      ),
    },
    {
      id: "checked",
      title: "Recently checked",
      description: "Listings whose free status was confirmed against the provider's own pages most recently.",
      href: "/entertainment/browse?sort=recently-verified",
      items: row(all, (r) => hasLabel(r, "recently-verified"), (a, b) => (b.lastVerifiedAt ?? "").localeCompare(a.lastVerifiedAt ?? "") || byName(a, b)),
    },
  ].filter((section) => section.items.length >= MIN_ROW);

  return (
    <div className="pb-16">
      <header className="border-b border-border bg-bg-subtle py-12 sm:py-16">
        <Container>
          <p className="kicker mb-3">Entertainment</p>
          <h1 className="max-w-3xl font-serif text-3xl font-semibold sm:text-4xl">
            Things to watch, play, hear and read — legally, and without paying.
          </h1>
          <p className="mt-4 max-w-(--measure-standfirst) text-lg text-fg-muted">
            Every listing says exactly what is free (the whole catalogue, some of it, or only a guide to it), whether there are
            ads, where it is available, and which official page says so. Links go to the provider; nothing is hosted or
            re-uploaded here.
          </p>

          <form action={withBasePath("/entertainment/browse/")} method="get" role="search" className="mt-8 flex max-w-2xl gap-2">
            <label htmlFor="entertainment-search" className="sr-only">
              Search free entertainment
            </label>
            <input
              id="entertainment-search"
              type="search"
              name="q"
              placeholder="Try “kannada”, “strategy”, “public domain”, “podcast”…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-base text-fg placeholder:text-fg-subtle"
            />
            <button type="submit" className={buttonClasses({ variant: "primary" })}>
              Search
            </button>
          </form>

          <p className="mt-5 text-sm text-fg-subtle tabular-nums">
            {formatCount(all.length)} {plural(all.length, "listing", "listings")}: {formatCount(content - software)} provide the
            content itself, {formatCount(discovery)} {plural(discovery, "is a guide", "are guides")} to where it is,{" "}
            {formatCount(software)} {plural(software, "is", "are")} software you run yourself.
          </p>
        </Container>
      </header>

      <Container>
        <nav aria-label="Entertainment shelves" className="py-10">
          <ul className="grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shelves.map((shelf) => {
              const count = shelfResources(all, shelf.slug).length;
              return (
                <li key={shelf.slug}>
                  <Link
                    href={`/entertainment/${shelf.slug}`}
                    className="group flex h-full items-start gap-3 rounded-md border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-hover"
                  >
                    <Icon name={shelf.icon} size={20} className="mt-0.5 shrink-0 text-fg-subtle group-hover:text-fg" />
                    <span className="min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-base font-semibold text-fg">{shelf.name}</span>
                        <span className="text-xs text-fg-subtle tabular-nums">
                          {count >= MIN_SHELF_LISTINGS ? formatCount(count) : count > 0 ? `Developing · ${count}` : "In research"}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-fg-muted line-clamp-2">{shelf.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/entertainment/on-site"
                className="group flex h-full items-start gap-3 rounded-md border border-dashed border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-hover"
              >
                <Icon name="play-circle" size={20} className="mt-0.5 shrink-0 text-fg-subtle group-hover:text-fg" />
                <span>
                  <span className="font-display text-base font-semibold text-fg">Play and watch here</span>
                  <span className="mt-1 block text-sm text-fg-muted">
                    Three small games that run locally, plus public-domain films, live radio and classic books that load only
                    when you press play.
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {rows.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            title={section.title}
            description={section.description}
            action={<SectionLink href={section.href}>See all</SectionLink>}
            className="border-t border-border"
          >
            <MediaGrid resources={section.items} labelsBySlug={labelsBySlug} label={section.title} />
          </Section>
        ))}

        <Section
          id="how-labels-work"
          title="How the labels work"
          description="Labels are rules, not opinions about popularity. There is no “Trending” or “Most popular” here: no trend source we could legitimately reuse exists for most of this catalogue, and inventing one would be the first false claim on the page."
          className="border-t border-border"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {DISCOVERY_LABELS.map((id) => (
              <div key={id}>
                <dt className="text-sm font-medium text-fg">{discoveryLabelDefinitions[id].label}</dt>
                <dd className="mt-1 text-sm text-fg-muted">{discoveryLabelDefinitions[id].rule}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-fg-muted">
            Something wrong — a service that changed its free plan, a region that is now blocked, a dead link?{" "}
            <Link href="/report" className="link-inline rounded-xs">
              Report it
            </Link>
            . Corrections are the most useful contribution there is.
          </p>
        </Section>
      </Container>
    </div>
  );
}
