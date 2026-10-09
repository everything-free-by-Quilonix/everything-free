"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CLASSIC_BOOKS,
  ENTERTAINMENT_FILMS,
  FREE_ENTERTAINMENT_PORTALS,
  RADIO_STATIONS,
  RETRO_EMULATED_GAMES,
  type ClassicBook,
  type EntertainmentMedia,
  type RadioStation,
  type RetroGame,
} from "@/data/entertainment";
import { Game2048 } from "@/features/tools/implementations/game-2048";
import { GameMinesweeper } from "@/features/tools/implementations/game-minesweeper";
import { GameSnake } from "@/features/tools/implementations/game-snake";

type HubTab = "watch" | "play" | "listen" | "read" | "portals";
type BuiltinGame = "2048" | "snake" | "minesweeper";

export function EntertainmentHub() {
  const [activeTab, setActiveTab] = useState<HubTab>("watch");

  // Cinema state
  const [selectedFilm, setSelectedFilm] = useState<EntertainmentMedia | null>(ENTERTAINMENT_FILMS[0]);
  const [filmCategory, setFilmCategory] = useState<string>("all");

  // Radio state
  const [activeStation, setActiveStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlayingRadio, setIsPlayingRadio] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Book reader state
  const [selectedBook, setSelectedBook] = useState<ClassicBook>(CLASSIC_BOOKS[0]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<"sm" | "base" | "lg">("base");

  // Game state
  const [gameMode, setGameMode] = useState<"builtin" | "emulated">("builtin");
  const [activeBuiltinGame, setActiveBuiltinGame] = useState<BuiltinGame>("2048");
  const [activeEmulatedGame, setActiveEmulatedGame] = useState<RetroGame | null>(RETRO_EMULATED_GAMES[0]);

  // Handle radio streaming
  const toggleRadio = (station: RadioStation) => {
    if (!audioRef.current) return;

    if (activeStation.id === station.id && isPlayingRadio) {
      audioRef.current.pause();
      setIsPlayingRadio(false);
      setIsBuffering(false);
    } else {
      setIsBuffering(true);
      setActiveStation(station);
      audioRef.current.src = station.streamUrl;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingRadio(true);
          setIsBuffering(false);
        })
        .catch(() => {
          setIsPlayingRadio(false);
          setIsBuffering(false);
        });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const filteredFilms =
    filmCategory === "all"
      ? ENTERTAINMENT_FILMS
      : ENTERTAINMENT_FILMS.filter((f) => f.category === filmCategory);

  const categories = [
    { id: "all", label: "All Titles" },
    { id: "cartoons", label: "Cartoons & Animation" },
    { id: "comedy", label: "Classic Comedy" },
    { id: "noir", label: "Film Noir & Thrillers" },
    { id: "horror", label: "Horror & Cult" },
    { id: "cinema", label: "Sci-Fi & Cinema" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hidden Persistent Audio Player */}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => {
          setIsPlayingRadio(true);
          setIsBuffering(false);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsPlayingRadio(true);
          setIsBuffering(false);
        }}
        onPause={() => {
          setIsPlayingRadio(false);
          setIsBuffering(false);
        }}
        onError={() => {
          setIsPlayingRadio(false);
          setIsBuffering(false);
        }}
      />

      {/* Main Mode Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-bg-subtle p-1">
          <Button
            size="sm"
            variant={activeTab === "watch" ? "primary" : "ghost"}
            onClick={() => setActiveTab("watch")}
          >
            <Icon name="film" size={16} />
            Watch Cinema & Cartoons ({ENTERTAINMENT_FILMS.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === "play" ? "primary" : "ghost"}
            onClick={() => setActiveTab("play")}
          >
            <Icon name="gamepad" size={16} />
            Play Games
          </Button>

          <Button
            size="sm"
            variant={activeTab === "listen" ? "primary" : "ghost"}
            onClick={() => setActiveTab("listen")}
          >
            <Icon name="music" size={16} />
            Live Radio ({RADIO_STATIONS.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === "read" ? "primary" : "ghost"}
            onClick={() => setActiveTab("read")}
          >
            <Icon name="book-open" size={16} />
            Classic Reader ({CLASSIC_BOOKS.length})
          </Button>

          <Button
            size="sm"
            variant={activeTab === "portals" ? "primary" : "ghost"}
            onClick={() => setActiveTab("portals")}
          >
            <Icon name="globe" size={16} />
            Free Media Vaults
          </Button>
        </div>

        {/* Global Radio Bar Indicator */}
        <div className="flex items-center gap-3 rounded-md border border-border bg-bg-subtle px-3 py-1.5 text-xs">
          <span className="text-fg-muted">Audio stream:</span>
          <span className="max-w-[140px] truncate font-medium text-fg sm:max-w-none">
            {activeStation.name}
          </span>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2.5 text-xs"
            onClick={() => toggleRadio(activeStation)}
          >
            <Icon name={isPlayingRadio ? "close" : "play-circle"} size={14} />
            {isBuffering ? "Connecting..." : isPlayingRadio ? "Stop" : "Tune in"}
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. WATCH: Public Domain Cartoons & Cinema                                 */}
      {/* ========================================================================= */}
      {activeTab === "watch" && (
        <div className="flex flex-col gap-6">
          {/* Active Theater Screen */}
          {selectedFilm && (
            <Card className="overflow-hidden p-0 shadow-sm">
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://archive.org/embed/${selectedFilm.embedId}`}
                  title={selectedFilm.title}
                  className="h-full w-full border-0"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col gap-2 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge size="sm" tone="info">
                      {selectedFilm.year}
                    </Badge>
                    <span className="text-xs font-medium uppercase tracking-wider text-fg-muted">
                      {selectedFilm.duration}
                    </span>
                    <span className="text-xs text-fg-muted">•</span>
                    <span className="text-xs text-fg-muted capitalize">{selectedFilm.category}</span>
                  </div>

                  <span className="text-xs text-fg-muted">
                    License: <strong className="font-medium text-fg">{selectedFilm.license}</strong>
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">
                  {selectedFilm.title}
                </h2>
                <p className="text-sm text-fg-muted">
                  Directed / Produced by {selectedFilm.creator}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg">{selectedFilm.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-border">
                  {selectedFilm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-xs bg-bg-subtle px-2 py-0.5 text-[11px] font-mono text-fg-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={filmCategory === cat.id ? "primary" : "secondary"}
                onClick={() => setFilmCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Media Catalog Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFilms.map((film) => {
              const isSelected = selectedFilm?.id === film.id;
              return (
                <div
                  key={film.id}
                  onClick={() => setSelectedFilm(film)}
                  className={`flex cursor-pointer flex-col justify-between rounded-md border p-4 transition-colors hover:bg-surface-hover ${
                    isSelected
                      ? "border-border-strong bg-surface-raised shadow-xs"
                      : "border-border bg-bg-subtle"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-fg-muted">
                      <span className="capitalize">{film.category}</span>
                      <span>{film.duration}</span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold text-fg">
                      {film.title}
                    </h3>
                    <p className="mt-1 text-xs text-fg-muted line-clamp-2">{film.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-[11px] font-medium text-fg-muted">
                      {film.creator} ({film.year})
                    </span>
                    <Button
                      size="sm"
                      variant={isSelected ? "primary" : "ghost"}
                      className="h-7 px-2 text-xs"
                    >
                      <Icon name="play-circle" size={14} />
                      {isSelected ? "Watching" : "Watch"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PLAY: In-Browser Retro & Casual Games                                 */}
      {/* ========================================================================= */}
      {activeTab === "play" && (
        <div className="flex flex-col gap-6">
          {/* Sub-Mode Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-subtle p-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={gameMode === "builtin" ? "primary" : "ghost"}
                onClick={() => setGameMode("builtin")}
              >
                Instant Local Games
              </Button>
              <Button
                size="sm"
                variant={gameMode === "emulated" ? "primary" : "ghost"}
                onClick={() => setGameMode("emulated")}
              >
                MS-DOS & Arcade Classics
              </Button>
            </div>

            {gameMode === "builtin" && (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant={activeBuiltinGame === "2048" ? "secondary" : "ghost"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setActiveBuiltinGame("2048")}
                >
                  2048
                </Button>
                <Button
                  size="sm"
                  variant={activeBuiltinGame === "snake" ? "secondary" : "ghost"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setActiveBuiltinGame("snake")}
                >
                  Retro Snake
                </Button>
                <Button
                  size="sm"
                  variant={activeBuiltinGame === "minesweeper" ? "secondary" : "ghost"}
                  className="h-7 px-2 text-xs"
                  onClick={() => setActiveBuiltinGame("minesweeper")}
                >
                  Minesweeper
                </Button>
              </div>
            )}
          </div>

          {/* Built-in Games Container */}
          {gameMode === "builtin" && (
            <div className="flex flex-col gap-6">
              {activeBuiltinGame === "2048" && (
                <div>
                  <div className="mb-6 rounded-md border border-border bg-bg-subtle p-4 text-center">
                    <h3 className="font-display text-lg font-bold text-fg">2048 Tile Puzzle</h3>
                    <p className="mt-1 text-xs text-fg-muted">
                      Slide numbered tiles with arrow keys or swipe to reach 2048. Runs 100% locally with zero ads.
                    </p>
                  </div>
                  <Game2048 />
                </div>
              )}

              {activeBuiltinGame === "snake" && (
                <div>
                  <div className="mb-6 rounded-md border border-border bg-bg-subtle p-4 text-center">
                    <h3 className="font-display text-lg font-bold text-fg">Classic Retro Snake</h3>
                    <p className="mt-1 text-xs text-fg-muted">
                      Eat red pellets, grow your snake, and avoid running into the walls or your own tail.
                    </p>
                  </div>
                  <GameSnake />
                </div>
              )}

              {activeBuiltinGame === "minesweeper" && (
                <div>
                  <div className="mb-6 rounded-md border border-border bg-bg-subtle p-4 text-center">
                    <h3 className="font-display text-lg font-bold text-fg">Classic Minesweeper</h3>
                    <p className="mt-1 text-xs text-fg-muted">
                      Uncover all safe tiles without hitting any hidden mines. First click is guaranteed safe.
                    </p>
                  </div>
                  <GameMinesweeper />
                </div>
              )}
            </div>
          )}

          {/* Emulated Retro Games Container */}
          {gameMode === "emulated" && (
            <div className="flex flex-col gap-6">
              {activeEmulatedGame && (
                <Card className="overflow-hidden p-0 shadow-sm">
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={`https://archive.org/embed/${activeEmulatedGame.embedId}`}
                      title={activeEmulatedGame.title}
                      className="h-full w-full border-0"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center gap-2">
                      <Badge size="sm" tone="info">
                        {activeEmulatedGame.platform}
                      </Badge>
                      <span className="text-xs text-fg-muted">{activeEmulatedGame.year}</span>
                      <span className="text-xs text-fg-muted">•</span>
                      <span className="text-xs text-fg-muted">{activeEmulatedGame.genre}</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-fg">
                      {activeEmulatedGame.title}
                    </h3>
                    <p className="text-xs text-fg-muted">
                      Developer: {activeEmulatedGame.developer} • Emulated via Internet Archive DOSBox in WebAssembly
                    </p>
                    <p className="mt-1 text-sm text-fg">{activeEmulatedGame.description}</p>
                  </div>
                </Card>
              )}

              {/* Game selection cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {RETRO_EMULATED_GAMES.map((game) => {
                  const isCurrent = activeEmulatedGame?.id === game.id;
                  return (
                    <div
                      key={game.id}
                      onClick={() => setActiveEmulatedGame(game)}
                      className={`flex cursor-pointer flex-col justify-between rounded-md border p-4 transition-colors hover:bg-surface-hover ${
                        isCurrent
                          ? "border-border-strong bg-surface-raised shadow-xs"
                          : "border-border bg-bg-subtle"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-fg-muted">
                          <span>{game.platform}</span>
                          <span>{game.year}</span>
                        </div>
                        <h4 className="mt-1.5 font-display text-base font-semibold text-fg">
                          {game.title}
                        </h4>
                        <p className="mt-1 text-xs text-fg-muted line-clamp-2">{game.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-fg-muted">{game.developer}</span>
                        <Button
                          size="sm"
                          variant={isCurrent ? "primary" : "secondary"}
                          className="h-7 px-2 text-xs"
                        >
                          <Icon name="gamepad" size={14} />
                          {isCurrent ? "Playing" : "Launch"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LISTEN: Live Radio Streams & Soundscapes                              */}
      {/* ========================================================================= */}
      {activeTab === "listen" && (
        <div className="flex flex-col gap-6">
          {/* Active Audio Banner */}
          <div className="flex flex-col gap-4 rounded-md border border-border bg-surface-raised p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge size="sm" tone={isBuffering ? "neutral" : isPlayingRadio ? "success" : "neutral"}>
                  {isBuffering ? "Connecting..." : isPlayingRadio ? "Streaming live" : "Ready"}
                </Badge>
                <span className="text-xs text-fg-muted">{activeStation.genre}</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-fg">{activeStation.name}</h2>
              <p className="mt-1 text-xs text-fg-muted">
                {activeStation.location} • {activeStation.description}
              </p>
            </div>

            <Button
              size="md"
              variant="primary"
              className="h-11 px-5"
              onClick={() => toggleRadio(activeStation)}
            >
              <Icon name={isPlayingRadio ? "close" : "play-circle"} size={18} />
              {isBuffering ? "Connecting..." : isPlayingRadio ? "Stop stream" : "Play stream"}
            </Button>
          </div>

          {/* Station Selection Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RADIO_STATIONS.map((station) => {
              const isCurrent = activeStation.id === station.id;
              const isPlaying = isCurrent && isPlayingRadio;

              return (
                <div
                  key={station.id}
                  onClick={() => toggleRadio(station)}
                  className={`flex cursor-pointer flex-col justify-between rounded-md border p-5 transition-colors hover:bg-surface-hover ${
                    isCurrent
                      ? "border-border-strong bg-surface-raised shadow-xs"
                      : "border-border bg-bg-subtle"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-fg-muted">
                      <span>{station.genre}</span>
                      <span>{station.location}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold text-fg">
                      {station.name}
                    </h3>
                    <p className="mt-1 text-xs text-fg-muted">{station.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-fg-muted">Direct public stream</span>
                    <Button
                      size="sm"
                      variant={isPlaying ? "primary" : "secondary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRadio(station);
                      }}
                    >
                      <Icon name={isPlaying ? "close" : "play-circle"} size={14} />
                      {isPlaying ? (isBuffering ? "Connecting..." : "Playing") : "Listen"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. READ: Public Domain Book Reader                                       */}
      {/* ========================================================================= */}
      {activeTab === "read" && (
        <div className="flex flex-col gap-6">
          {/* Book Selector Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg-subtle p-4">
            <div className="flex flex-wrap items-center gap-2">
              {CLASSIC_BOOKS.map((book) => (
                <Button
                  key={book.id}
                  size="sm"
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

            {/* Font Size Selector */}
            <div className="flex items-center gap-1 text-xs text-fg-muted">
              <span>Text size:</span>
              <Button
                size="sm"
                variant={readerFontSize === "sm" ? "secondary" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => setReaderFontSize("sm")}
              >
                A-
              </Button>
              <Button
                size="sm"
                variant={readerFontSize === "base" ? "secondary" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => setReaderFontSize("base")}
              >
                A
              </Button>
              <Button
                size="sm"
                variant={readerFontSize === "lg" ? "secondary" : "ghost"}
                className="h-7 px-2 text-xs"
                onClick={() => setReaderFontSize("lg")}
              >
                A+
              </Button>
            </div>
          </div>

          {/* Book Content Viewer */}
          <div className="rounded-md border border-border bg-surface p-6 sm:p-10 shadow-xs">
            <div className="border-b border-border pb-6">
              <span className="text-xs text-fg-muted">Public Domain Literature</span>
              <h2 className="mt-1 font-display text-3xl font-bold text-fg">{selectedBook.title}</h2>
              <p className="mt-1 text-sm text-fg-muted">
                By {selectedBook.author} ({selectedBook.year}) • {selectedBook.wordCount}
              </p>
            </div>

            {/* Chapter Selection if available */}
            {selectedBook.chapters.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedBook.chapters.map((ch, idx) => (
                  <Button
                    key={ch.title}
                    size="sm"
                    variant={chapterIndex === idx ? "primary" : "secondary"}
                    onClick={() => setChapterIndex(idx)}
                  >
                    {ch.title}
                  </Button>
                ))}
              </div>
            )}

            {/* Reading Body */}
            <div
              className={`mt-8 leading-relaxed text-fg whitespace-pre-line ${
                readerFontSize === "sm"
                  ? "text-sm leading-6"
                  : readerFontSize === "base"
                    ? "text-base leading-7"
                    : "text-lg leading-8"
              }`}
            >
              {selectedBook.chapters[chapterIndex]?.text ?? selectedBook.firstParagraph}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PORTALS: Curated Free Media Repositories                               */}
      {/* ========================================================================= */}
      {activeTab === "portals" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-border bg-bg-subtle p-6">
            <h2 className="font-display text-2xl font-bold text-fg">Curated Free Media Portals</h2>
            <p className="mt-1 text-sm text-fg-muted">
              Access the largest public domain and non-commercial digital repositories in human history. Over 100 million free books, historical films, open audiobooks, and preserved retro computer software.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FREE_ENTERTAINMENT_PORTALS.map((portal) => (
              <div
                key={portal.name}
                className="flex flex-col justify-between rounded-md border border-border bg-surface p-5 shadow-xs transition-colors hover:bg-surface-hover"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge size="sm" tone="neutral">
                      {portal.category}
                    </Badge>
                    <span className="text-xs font-mono text-fg-muted">{portal.freeScope}</span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold text-fg">
                    {portal.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">
                    {portal.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border">
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-fg hover:underline"
                  >
                    Launch portal
                    <Icon name="arrow-right" size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
