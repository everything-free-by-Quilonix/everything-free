# Entertainment discovery labels, signals and APIs

## Labels

Every label is a rule in `src/lib/entertainment/labels.ts`, evaluated at build time.
None measures popularity on the catalogue's own behalf, and none is shown unless its
condition holds.

| Label | Condition |
| --- | --- |
| Recently added | Entered the catalogue in the last 30 days |
| Recently checked | Free status confirmed against an official source in the last 30 days |
| Recently updated | Open-source project; its GitHub repository had a commit in the 30 days before the signal was recorded, the signal is ≤ 14 days old, and the repository is not archived |
| Community favourite | GitHub repository with ≥ 1,000 stars, recorded ≤ 30 days ago; the card shows the count and the date |
| Free this week | One-off offer, confirmed on the provider's page, ending within 7 days |
| Available in India | A page read during verification says the offer works in India |
| Open source | Licence confirmed from the project's own licence page or file |
| Editor's pick | `media.editorial.hiddenGem`, with a written reason. Editorial, and labelled as such |

**Not implemented, on purpose:** "Trending now", "Popular games" and "Most
watched". No legitimate, redistributable trend source exists for most of this
catalogue: platform charts (Steam, itch.io, Twitch, YouTube) are either
script-rendered, gated behind keys whose terms restrict redistribution, or were not
evaluated in this pass. Showing a trend without one would be the first false claim
on the page. If a source is added later, it goes in the signal file with its date
and evidence URL, and a label rule gets a test before it is shown.

A stale signal file switches its labels off by itself: the age checks above run
against the date each signal was recorded.

## The signal file

`src/data/entertainment-signals.json`, written by:

```bash
npm run signals:entertainment            # GITHUB_TOKEN optional
```

The script reads every `media.githubRepo` from the data files, asks the public
GitHub REST API for that repository's stars, last push and archived flag, and
records `observedAt` and the repository URL as evidence. A failed request keeps the
previous value and is reported; one failure never marks a project dead. The build
reads the committed file and never calls the network, so a GitHub outage cannot fail
a deploy. The file is validated with Zod at the boundary
(`lib/entertainment/signals-schema.ts`); an invalid file yields no signal labels.

Run it before a deploy you want fresh labels for, or add it to a scheduled workflow
that opens a pull request.

## Maintenance

```bash
npm run check:entertainment              # counts, expired offers, overdue reviews, signal age
npm run check:entertainment -- --strict  # non-zero exit on expired offers or a broken signal file
npm run check:links                      # link health, separate from the build
```

## APIs and feeds evaluated

Only what was read during this pass is stated as fact; the rest is marked.

| Source | Key | Free use | Used | Notes |
| --- | --- | --- | --- | --- |
| GitHub REST API | Optional (60 requests/hour without, 5,000 with) | Yes | **Yes** — signal script | Public repository metadata only |
| Podcast Index | Free key on sign-up | Index "available for free, for any use" | No | Candidate for a podcast directory feed |
| Radio Browser | None | "Can be used freely but without guarantee" | No | Open station database; JSON/M3U/PLS |
| Listen Notes | Key | Free plan for personal projects, quota-limited, "Powered by Listen Notes" required | No | Not suitable for a public catalogue on the free plan |
| Cleveland Museum of Art | None | CC0 data and images | No | Good candidate for artwork on culture cards |
| National Gallery of Art | — | CC0 dataset on GitHub | No | Bulk CSV, updated daily |
| Rijksmuseum data services | Per their docs | Mixed rights per item | No | Rights stated per item |
| TMDB, Wikidata, MusicBrainz, ListenBrainz, Open Library, Internet Archive, Jamendo, Steam, Epic, itch.io | — | **Not evaluated in this pass** | No | Terms, keys, caching and artwork rights still to be read. TMDB metadata would in any case not show that a title is free to watch |

## Artwork

Cards draw a typographic cover from the listing's own metadata. `media.artwork` is
supported, but the build only accepts it with an alt text, a credit and an HTTPS
licence page, and the card falls back to the typographic cover if the image fails or
hotlinking is refused. No listing uses artwork yet; the CC0 museum APIs above are the
obvious first source for the culture shelf.
