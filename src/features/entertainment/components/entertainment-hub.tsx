"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "@/components/ui/external-link";
import {
  CLASSIC_BOOKS,
  ENTERTAINMENT_FILMS,
  FREE_ENTERTAINMENT_PORTALS,
  RADIO_STATIONS,
  type ClassicBook,
  type EntertainmentMedia,
  type RadioStation,
} from "@/data/entertainment";
import { Game2048 } from "@/features/tools/implementations/game-2048";
import { GameMinesweeper } from "@/features/tools/implementations/game-minesweeper";
import { GameSnake } from "@/features/tools/implementations/game-snake";
import { cn } from "@/lib/utils/cn";

/**
 * Things you can watch, play, hear and read on this page.
 *
 * Privacy and consent: nothing third-party loads until the visitor asks for it.
 * A film's Internet Archive player is created only after "Load player" is
 * pressed, with the notice that it connects to archive.org; a radio stream
 * connects only on "Play". This page's CSP allows exactly those origins
 * (scripts/csp.mjs), and no other page does.
 *
 * The three games are this project's own code and run entirely in the browser.
 * Commercial games emulated from archives were removed: an archive hosting a copy
 * is not the rights holder's permission.
 */

type HubTab = "watch" | "play" | "listen" | "read" | "portals";
type BuiltinGame = "2048" | "snake" | "minesweeper";

const TABS: { id: HubTab; label: string; icon: "film" | "gamepad" | "music" | "book-open" | "globe" }[] = [
  { id: "watch", label: "Public-domain films", icon: "film" },
  { id: "play", label: "Games", icon: "gamepad" },
  { id: "listen", label: "Live radio", icon: "music" },
  { id: "read", label: "Classic books", icon: "book-open" },
  { id: "portals", label: "Archives", icon: "globe" },
];

const FILM_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "cartoons", label: "Cartoons" },
  { id: "comedy", label: "Comedy" },
  { id: "noir", label: "Film noir" },
  { id: "horror", label: "Horror" },
  { id: "cinema", label: "Sci-fi & drama" },
];

const GAMES: { id: BuiltinGame; label: string; description: string }[] = [
  { id: "2048", label: "2048", description: "Slide numbered tiles with the arrow keys or by swiping to reach 2048." },
  { id: "snake", label: "Snake", description: "Eat pellets and grow, without hitting the walls or your own tail." },
  { id: "minesweeper", label: "Minesweeper", description: "Uncover every safe tile. The first click is always safe." },
];

function SelectCard({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex h-full w-full flex-col justify-between rounded-md border p-4 text-left transition-colors hover:bg-surface-hover",
        selected ? "border-border-strong bg-surface-raised" : "border-border bg-bg-subtle",
      )}
    >
      {children}
    </button>
  );
}

export function EntertainmentHub() {
  const [activeTab, setActiveTab] = useState<HubTab>("watch");

  const [selectedFilm, setSelectedFilm] = useState<EntertainmentMedia>(ENTERTAINMENT_FILMS[0]);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [filmCategory, setFilmCategory] = useState("all");

  const [activeStation, setActiveStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [radioError, setRadioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedBook, setSelectedBook] = useState<ClassicBook>(CLASSIC_BOOKS[0]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");

  const [activeGame, setActiveGame] = useState<BuiltinGame>("2048");

  const toggleRadio = (station: RadioStation) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeStation.id === station.id && isPlayingRadio) {
      audio.pause();
      return;
    }
    setRadioError(null);
    setIsBuffering(true);
    setActiveStation(station);
    audio.src = station.streamUrl;
    audio.play().catch(() => {
      setIsBuffering(false);
      setIsPlayingRadio(false);
      setRadioError(`${station.name} could not be reached. The station may be offline; try another.`);
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const filteredFilms =
    filmCategory === "all" ? ENTERTAINMENT_FILMS : ENTERTAINMENT_FILMS.filter((f) => f.category === filmCategory);

  return (
    <div className="flex flex-col gap-8">
      <audio
        ref={audioRef}
        preload="none"
        onPlaying={() => {
          setIsPlayingRadio(true);
          setIsBuffering(false);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPause={() => {
          setIsPlayingRadio(false);
          setIsBuffering(false);
        }}
        onError={() => {
          setIsPlayingRadio(false);
          setIsBuffering(false);
        }}
      />

      <div role="tablist" aria-label="On-site entertainment" className="flex flex-wrap gap-1.5 border-b border-border pb-4">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            role="tab"
            id={`hub-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`hub-panel-${tab.id}`}
            size="sm"
            variant={activeTab === tab.id ? "primary" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "watch" ? (
        <div role="tabpanel" id="hub-panel-watch" aria-labelledby="hub-tab-watch" className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-md border border-border">
            <div className="aspect-video w-full bg-black">
              {playerLoaded ? (
                <iframe
                  key={selectedFilm.id}
                  src={`https://archive.org/embed/${selectedFilm.embedId}`}
                  title={`${selectedFilm.title} — Internet Archive player`}
                  className="h-full w-full border-0"
                  allow="fullscreen"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="font-display text-xl font-semibold text-white">{selectedFilm.title}</p>
                  <p className="max-w-md text-sm text-white/75">
                    The film plays in the Internet Archive&rsquo;s player. Loading it connects your browser to archive.org,
                    which has its own privacy policy.
                  </p>
                  <Button variant="primary" onClick={() => setPlayerLoaded(true)}>
                    <Icon name="play-circle" size={16} />
                    Load player
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 p-5">
              <p className="text-xs text-fg-muted">
                {selectedFilm.year} · {selectedFilm.duration} · {selectedFilm.creator}
              </p>
              <h2 className="font-display text-2xl font-bold text-fg">{selectedFilm.title}</h2>
              <p className="text-sm leading-relaxed text-fg">{selectedFilm.description}</p>
              <p className="text-xs text-fg-muted">
                Status as described by the Internet Archive item: {selectedFilm.license}. Public-domain status is
                country-specific; check yours before reusing.{" "}
                <ExternalLink href={`https://archive.org/details/${selectedFilm.embedId}`} className="link-inline rounded-xs">
                  Open on archive.org
                </ExternalLink>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Film category">
            {FILM_CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                aria-pressed={filmCategory === cat.id}
                variant={filmCategory === cat.id ? "primary" : "secondary"}
                onClick={() => setFilmCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFilms.map((film) => (
              <li key={film.id}>
                <SelectCard selected={selectedFilm.id === film.id} onSelect={() => setSelectedFilm(film)}>
                  <span>
                    <span className="flex justify-between text-xs text-fg-muted">
                      <span className="capitalize">{film.category}</span>
                      <span>{film.duration}</span>
                    </span>
                    <span className="mt-1.5 block font-display text-base font-semibold text-fg">{film.title}</span>
                    <span className="mt-1 block text-xs text-fg-muted line-clamp-2">{film.description}</span>
                  </span>
                  <span className="mt-3 border-t border-border pt-2 text-2xs text-fg-subtle">
                    {film.creator} ({film.year})
                  </span>
                </SelectCard>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {activeTab === "play" ? (
        <div role="tabpanel" id="hub-panel-play" aria-labelledby="hub-tab-play" className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a game">
            {GAMES.map((game) => (
              <Button
                key={game.id}
                size="sm"
                aria-pressed={activeGame === game.id}
                variant={activeGame === game.id ? "secondary" : "ghost"}
                onClick={() => setActiveGame(game.id)}
              >
                {game.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-fg-muted">
            {GAMES.find((g) => g.id === activeGame)?.description} Written for this site; runs entirely in your browser with no
            ads and nothing sent anywhere. For thousands more, see the{" "}
            <Link href="/entertainment/games" className="link-inline rounded-xs">
              games shelf
            </Link>
            .
          </p>
          {activeGame === "2048" ? <Game2048 /> : null}
          {activeGame === "snake" ? <GameSnake /> : null}
          {activeGame === "minesweeper" ? <GameMinesweeper /> : null}
        </div>
      ) : null}

      {activeTab === "listen" ? (
        <div role="tabpanel" id="hub-panel-listen" aria-labelledby="hub-tab-listen" className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-md border border-border bg-surface-raised p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-fg-muted" aria-live="polite">
                {isBuffering ? "Connecting…" : isPlayingRadio ? "Playing live" : "Stopped"} · {activeStation.genre}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-fg">{activeStation.name}</h2>
              <p className="mt-1 text-xs text-fg-muted">
                {activeStation.location} · {activeStation.description}
              </p>
              <p className="mt-2 text-2xs text-fg-subtle">
                Pressing play connects your browser directly to the station&rsquo;s public stream.
              </p>
            </div>
            <Button variant="primary" onClick={() => toggleRadio(activeStation)}>
              <Icon name={isPlayingRadio ? "close" : "play-circle"} size={18} />
              {isPlayingRadio ? "Stop" : "Play"}
            </Button>
          </div>
          {radioError ? (
            <p role="status" className="text-sm text-fg-muted">
              {radioError}
            </p>
          ) : null}
          <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RADIO_STATIONS.map((station) => (
              <li key={station.id}>
                <SelectCard selected={activeStation.id === station.id} onSelect={() => toggleRadio(station)}>
                  <span>
                    <span className="flex justify-between text-xs text-fg-muted">
                      <span>{station.genre}</span>
                      <span>{station.location}</span>
                    </span>
                    <span className="mt-1.5 block font-display text-base font-semibold text-fg">{station.name}</span>
                    <span className="mt-1 block text-xs text-fg-muted">{station.description}</span>
                  </span>
                  <span className="mt-3 border-t border-border pt-2 text-2xs text-fg-subtle">
                    {activeStation.id === station.id && isPlayingRadio ? "Playing — press to stop" : "Press to play"}
                  </span>
                </SelectCard>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {activeTab === "read" ? (
        <div role="tabpanel" id="hub-panel-read" aria-labelledby="hub-tab-read" className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-subtle p-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a book">
              {CLASSIC_BOOKS.map((book) => (
                <Button
                  key={book.id}
                  size="sm"
                  aria-pressed={selectedBook.id === book.id}
                  variant={selectedBook.id === book.id ? "primary" : "ghost"}
                  onClick={() => {
                    setSelectedBook(book);
                    setChapterIndex(0);
                  }}
                >
                  {book.title}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-fg-muted" role="group" aria-label="Text size">
              {(["sm", "base", "lg"] as const).map((size) => (
                <Button
                  key={size}
                  size="sm"
                  aria-pressed={readerFontSize === size}
                  variant={readerFontSize === size ? "secondary" : "ghost"}
                  onClick={() => setReaderFontSize(size)}
                >
                  {size === "sm" ? "A−" : size === "base" ? "A" : "A+"}
                  <span className="sr-only">{size === "sm" ? " smaller text" : size === "base" ? " normal text" : " larger text"}</span>
                </Button>
              ))}
            </div>
          </div>
          <article className="rounded-md border border-border bg-surface p-6 sm:p-10">
            <header className="border-b border-border pb-6">
              <p className="text-xs text-fg-muted">Public-domain text · excerpt</p>
              <h2 className="mt-1 font-display text-3xl font-bold text-fg">{selectedBook.title}</h2>
              <p className="mt-1 text-sm text-fg-muted">
                {selectedBook.author} · {selectedBook.year < 0 ? `c. ${-selectedBook.year} BCE` : selectedBook.year}
              </p>
            </header>
            {selectedBook.chapters.length > 1 ? (
              <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Chapter">
                {selectedBook.chapters.map((chapter, index) => (
                  <Button
                    key={chapter.title}
                    size="sm"
                    aria-pressed={chapterIndex === index}
                    variant={chapterIndex === index ? "primary" : "secondary"}
                    onClick={() => setChapterIndex(index)}
                  >
                    {chapter.title}
                  </Button>
                ))}
              </div>
            ) : null}
            <div
              className={cn(
                "mt-8 max-w-(--measure-standfirst) whitespace-pre-line text-fg",
                readerFontSize === "sm" ? "text-sm leading-6" : readerFontSize === "base" ? "text-base leading-7" : "text-lg leading-8",
              )}
            >
              {selectedBook.chapters[chapterIndex]?.text ?? selectedBook.firstParagraph}
            </div>
            <p className="mt-8 text-sm text-fg-muted">
              The full text is free on{" "}
              <ExternalLink href="https://www.gutenberg.org/" className="link-inline rounded-xs">
                Project Gutenberg
              </ExternalLink>
              .
            </p>
          </article>
        </div>
      ) : null}

      {activeTab === "portals" ? (
        <div role="tabpanel" id="hub-panel-portals" aria-labelledby="hub-tab-portals">
          <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FREE_ENTERTAINMENT_PORTALS.map((portal) => (
              <li key={portal.name} className="flex flex-col justify-between rounded-md border border-border bg-surface p-5">
                <div>
                  <p className="text-xs text-fg-muted">{portal.freeScope}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-fg">{portal.name}</h3>
                  <p className="mt-1.5 text-sm text-fg-muted">{portal.description}</p>
                </div>
                <ExternalLink href={portal.url} className="link-inline mt-4 rounded-xs text-sm">
                  Visit {portal.name}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
