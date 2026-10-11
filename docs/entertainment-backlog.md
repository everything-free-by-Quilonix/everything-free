# Entertainment catalogue: research report and backlog

What the first research wave (2026-10-11) covered, what it imported, what it
rejected and why, and what is still open. Counts come from the validated data:
run `npm run check:entertainment` for the current figures.

## Where the catalogue stands

146 entertainment listings in a library of 1,191 (after the third wave: free-to-play
PC games; KEXP, Radio Swiss Classic, Loyal Books, Storynory, WEBTOON, VIZ Shonen Jump,
Google Arts & Culture, British Museum, ARTE, CBC Gem, RetroCrush, Simon's Cat).
139 are *Partially verified* (free status confirmed against the provider's own page,
with dated sources); 6 older listings (Tubi, Pluto TV, Kanopy, Internet Archive films, Plex, JustWatch)
have corrected profiles but no recorded checks yet. 13 are confirmed ad-free and appear
under the "No ads" filter. **Nothing is Verified**: that
needs a registered maintainer's sign-off. The table below is from the first wave; run
`npm run check:entertainment` for current counts.

| Primary category | Listings |
| --- | ---: |
| Games (browser, open-source, portals) | 53 |
| Podcasts | 15 |
| Streaming (FAST, live TV, live cams) | 12 |
| Comics & manga (incl. readers) | 6 |
| Museums & culture | 6 |
| Movies | 4 |
| TV & web series, Books, Anime | 1 each |

These are well short of the brief's targets (100 films, 70 series, 50 anime,
…). The shortfall is deliberate: a candidate is only imported once its free model
has been read on the provider's own pages. Two automated research batches were
interrupted before writing their output; the tracks below that say "not started"
are the result, not a judgement that the category is thin.

| Track | State |
| --- | --- |
| Browser games and portals | 25 imported |
| Open-source games | 28 imported |
| FAST / live TV | 11 imported |
| Podcasts and audio apps | 15 imported (radio and audiobooks researched, not yet written — see below) |
| Comics, culture, live cams | 14 imported |
| Animation | 1 imported |
| Films and documentaries | **not started** beyond the retrofitted entries |
| PC free-to-play, stores, giveaways, cloud gaming | **not started** |
| Music streaming and creator music | **not started** |
| Anime streaming | **not started** |

## Existing listings corrected

The previous entertainment entries were compiled without evidence and made claims
the project cannot support:

- **Tubi** was described as "100% legal" with "no account" and no region. Tubi's
  help centre lists the US, Canada, Mexico, Australia, the UK, Puerto Rico and five
  Latin American countries; fetched from India its pages say Tubi is not available.
  The listing now says so and carries an ads limitation.
- **JustWatch** said titles were "100% free" and was classed as a content provider.
  It is now a discovery listing (`free_discovery`) whose button reads "Find where to
  watch".
- **Internet Archive feature films** claimed `openSource: true` with a licence of
  "Public Domain & Open Licences" and commercial use "yes". Rights are per item;
  those claims were removed.
- **Kanopy, Pluto TV, Plex**: ads or library-card requirements are now stated.
- **The on-site hub** embedded commercial MS-DOS and arcade games (Prince of Persia,
  SimCity, Lemmings, Pac-Man…) emulated from the Internet Archive. An archive hosting
  a copy is not the rights holder's permission; they were removed, along with the
  "MS-DOS & Arcade" portal. Its film player and radio also never worked in
  production, because the CSP allowed no frames or media; the page now loads them
  only on request, with a CSP that allows exactly those origins.

## Rejected, with reasons

| Candidate | Reason |
| --- | --- |
| Emulated commercial DOS/arcade games | No rights-holder permission |
| Y8 | Catalogue includes games named after commercial franchises with no licensing statement |
| Mihon, Tachiyomi | Manga readers whose extension ecosystem points at unofficial sources; Tachiyomi discontinued |
| Tapas | Service announced to close on 2027-03-31 |
| Azuki (now Omoi), Amar Chitra Katha app, Tinkle | Subscription or purchase only; no standing free catalogue found |
| Kuku FM | Every title leads to a free trial of a subscription (a trial is not free) |
| Berliner Philharmoniker Digital Concert Hall | 7-day trial only |
| Met Opera nightly streams | Programme ended |
| Mozilla Hubs | Shut down |
| British Library Sounds | Offline since the 2023 cyber-attack, no return date |
| BBC Sounds outside the UK | Closed internationally in July 2025; BBC audio outside the UK is listed instead |
| Studio Ghibli | No legal free streaming |
| Crunchyroll | Ended free ad-supported viewing on 31 December 2025; a paid plan is now required (Muse India is listed instead) |
| iptv-org/iptv (GitHub) | Popular on social media, but its own Legal section says links are user-submitted and only "to the best of our knowledge" published by the rights holders; nobody checks permission. The stricter Free-TV/IPTV list is listed instead, as a guide |
| "Free movies" GitHub web apps, Cloudstream/Stremio-style extension repos | They scrape or aggregate unlicensed streaming sites; providing a player does not make the source legal |
| NFDC Cinemas of India | Moved to a paid Prime Video add-on (₹199/year, per press reports) |
| Sansad TV live | Official site could not be reached from the research environment; backlog |

## Backlog: candidates read but not settled

Each needs a page that states the free model before it can be listed.

- **Third wave, unreachable or unreadable on 2026-10-11**: Sansad TV and NewsOnAir
  (connection errors), Digital Comic Museum (403), MANGA Plus, Radio Paradise and the
  Indian Culture portal (JavaScript-only), Muse Asia / Ani-One (unreachable), Pokémon
  (bot filter), SBS On Demand and ABC iview (help pages 404). Toei Animation's site
  offers no free streaming.

- **India**: Prasar Bharati WAVES (only third-party descriptions found),
  NewsOnAir / Akashvani live radio (official pages list channels in Hindi, Tamil,
  Telugu, Kannada, Malayalam, Bengali, Marathi and more but never state "free"),
  IVM Podcasts, Suno India (fetch failed), Pocket FM (freemium terms read; account
  requirement unsettled), Films Division / NFDC and studio YouTube channels (not
  yet researched), MAP Bengaluru and the Indian Culture portal (no licence
  statement; JavaScript-only), JioSaavn, Gaana, Wynk (not yet researched).
- **Games**: Newgrounds, GamePix, Addicting Games, Agar.io (HTTP 403); Wordle and
  NYT Connections (which games are free is not stated on readable pages); Krunker,
  slither.io, Diep.io, Little Alchemy 2, Line Rider, Universal Paperclips, Cookie
  Clicker, QWOP, tetris.com, Board Game Arena, OGS (free model not stated or page
  script-rendered).
- **Audio**: Player FM (403), Radio Paradise, KEXP, Radio Swiss Jazz, CBC Music
  (no explicit free statement), Nightwave Plaza and Insight Timer (script-rendered),
  PennSound, Spoken Wikipedia, Musopen radio.
- **Read and explore**: WEBTOON help centre and Digital Comic Museum (HTTP 403),
  MANGA Plus (free chapter rules read from an app-store listing only), K MANGA,
  Shonen Jump, NYPL Digital Collections, Louvre, British Museum, explore.org (no
  free statement on the About page), NASA+ (no price statement on the pages read),
  Twitch, LoL Esports.
- **Film**: NFB (help page moved), Library of Congress National Screening Room
  (HTTP 403).

Radio, audiobook and meditation candidates whose free model *was* settled (SomaFM,
WFMU, NTS, TuneIn, Radio Browser, Shortwave, Medito, Lit2Go, Storynory, Loyal Books,
Libby, hoopla, Open Culture audiobooks) are recorded in the research notes and are
the first job for the next wave.

## India findings

Five listings have a sourced "Available in India" state: Samsung TV Plus, DD Free
Dish, DD National, NHK World-Japan and Open Library lending. India's public
broadcaster has a large regional-language radio and TV presence, but its official
pages do not state the access terms in a way that can be cited; that is the single
biggest gap. Region is otherwise left "not established" rather than assumed — a
service being reachable from India is not recorded as availability.

## Next expansion wave

1. Write the already-researched radio, audiobook and meditation entries.
2. Films and documentaries: national film boards and archives, public-domain
   collections, broadcaster documentary channels, India's Films Division and NFDC.
3. PC free-to-play titles and stores (Steam free section, Epic weekly giveaways as a
   recurring `temporary_free` offer, GOG, itch.io jams), and GeForce NOW's free tier
   with its published country list.
4. Music: Jamendo, Free Music Archive, Musopen, YouTube Audio Library, and Indian
   streaming services with their free-tier limits.
5. Anime from rights holders' own channels (Muse Asia, Ani-One) and Crunchyroll's
   current free model.
6. A maintainer pass: re-open the sources of the most-used listings and sign them
   off.

See [entertainment-research.md](entertainment-research.md) for how to add entries,
and [entertainment-signals.md](entertainment-signals.md) for labels and APIs.
