import type { Resource } from "@/types/resource";

import { gamesBrowser1Resources } from "./games-browser-1";
import { gamesBrowser2Resources } from "./games-browser-2";
import { gamesOpenSource1Resources } from "./games-open-source-1";
import { gamesOpenSource2Resources } from "./games-open-source-2";
import { listenAudio1Resources } from "./listen-audio-1";
import { readExplore1Resources } from "./read-explore-1";
import { watchAnimation1Resources } from "./watch-animation-1";
import { watchIndia1Resources } from "./watch-india-1";
import { listenAudio2Resources } from "./listen-audio-2";
import { listenMusic1Resources } from "./listen-music-1";
import { gamesIndie1Resources } from "./games-indie-1";
import { watchFilm2Resources } from "./watch-film-2";
import { watchIndia2Resources } from "./watch-india-2";
import { gamesF2p1Resources } from "./games-f2p-1";
import { expansionMedia1Resources } from "./expansion-media-1";
import { watchTvAnime1Resources } from "./watch-tv-anime-1";

/**
 * The entertainment research files, in one list.
 *
 * Each file is the output of one research pass (docs/entertainment-research.md).
 * Adding a file: export it here. `scripts/check-media-file.mts` validates a file
 * before it is added.
 */
export const entertainmentResources: Resource[] = [
  ...watchTvAnime1Resources,
  ...gamesBrowser1Resources,
  ...gamesBrowser2Resources,
  ...gamesOpenSource1Resources,
  ...gamesOpenSource2Resources,
  ...listenAudio1Resources,
  ...readExplore1Resources,
  ...watchAnimation1Resources,
  ...watchIndia1Resources,
  ...listenAudio2Resources,
  ...listenMusic1Resources,
  ...gamesIndie1Resources,
  ...watchFilm2Resources,
  ...watchIndia2Resources,
  ...gamesF2p1Resources,
  ...expansionMedia1Resources,
];
