import { formatDefinitions, type MediaVerb } from "@/config/media";
import type { MediaAccessType, MediaFormat } from "@/types/media";
import type { Resource } from "@/types/resource";

/**
 * What a card's primary button says.
 *
 * The label is derived from the evidence-backed profile, never written by hand, so
 * it cannot promise more than the listing supports. In particular "Watch free",
 * "Listen free", "Read free" and "Play in browser" each require the listing to
 * *be* the content, with an access type that says the content itself is free; a
 * discovery guide says "Find where to watch" and a store page says "Visit game page".
 */

export type MediaActionKind =
  | "watch-free"
  | "watch-library"
  | "listen-free"
  | "listen-live"
  | "read-free"
  | "play-browser"
  | "get-game"
  | "get-demo"
  | "claim-offer"
  | "browse-free-games"
  | "visit-game-page"
  | "explore-collection"
  | "get-app"
  | "discover"
  | "visit-site";

export interface MediaAction {
  kind: MediaActionKind;
  label: string;
  href: string;
}

const CONTENT_ACCESS: readonly MediaAccessType[] = [
  "free_full_access",
  "free_streaming",
  "free_download",
  "public_domain",
  "open_license",
  "free_with_ads",
];

const DISCOVER_LABEL: Record<MediaVerb, string> = {
  watch: "Find where to watch",
  play: "Find where to play",
  listen: "Find where to listen",
  read: "Find where to read",
  explore: "Browse the guide",
};

/** The verb most of a listing's formats share. Ties go to the first format. */
export function primaryVerb(formats: readonly MediaFormat[]): MediaVerb {
  const counts = new Map<MediaVerb, number>();
  for (const format of formats) {
    const verb = formatDefinitions[format].verb;
    counts.set(verb, (counts.get(verb) ?? 0) + 1);
  }
  let best: MediaVerb = formats[0] ? formatDefinitions[formats[0]].verb : "explore";
  for (const [verb, count] of counts) if (count > (counts.get(best) ?? 0)) best = verb;
  return best;
}

function action(kind: MediaActionKind, label: string, href: string): MediaAction {
  return { kind, label, href };
}

export function primaryMediaAction(resource: Resource): MediaAction {
  const href = resource.officialUrl;
  const media = resource.media;
  if (!media) return action("visit-site", "Visit official site", href);

  const access = new Set(media.access);
  const verb = primaryVerb(media.formats);
  const formats = new Set(media.formats);

  if (media.offering === "discovery") return action("discover", DISCOVER_LABEL[verb], href);
  if (access.has("unknown")) return action("visit-site", "Visit official site", href);

  if (media.offering === "software") {
    if (verb === "play") return action("get-game", "Get the game", href);
    return action("get-app", "Get the app", href);
  }

  const providesContent =
    (media.contentScope === "complete-works" || media.contentScope === "selected-works") &&
    CONTENT_ACCESS.some((type) => access.has(type));

  if (verb === "play") {
    if (access.has("temporary_free")) return action("claim-offer", "See this week's free games", href);
    if (access.has("free_demo")) return action("get-demo", "Get the demo", href);
    if (media.playInBrowser) return action("play-browser", "Play in browser", href);
    if (formats.has("game-store")) return action("browse-free-games", "Browse free games", href);
    if (formats.has("browser-game") || formats.has("cloud-gaming")) return action("visit-game-page", "Visit game page", href);
    if (media.contentScope === "complete-works" || media.contentScope === "selected-works") {
      return action("get-game", "Get the game", href);
    }
    return action("visit-game-page", "Visit game page", href);
  }

  if (!providesContent) {
    if (access.has("library_access") && verb === "watch") return action("watch-library", "Watch with a library card", href);
    return action("visit-site", "Visit official site", href);
  }

  switch (verb) {
    case "watch":
      if (access.has("library_access")) return action("watch-library", "Watch with a library card", href);
      return action("watch-free", "Watch free", href);
    case "listen":
      if (formats.has("radio") && !formats.has("podcast") && !formats.has("audiobook")) {
        return action("listen-live", "Listen live", href);
      }
      return action("listen-free", "Listen free", href);
    case "read":
      return action("read-free", "Read free", href);
    default:
      return action("explore-collection", "Explore collection", href);
  }
}

/** A second action, when the listing has one worth showing: the source code. */
export function secondaryMediaAction(resource: Resource): MediaAction | null {
  if (resource.openSource && resource.sourceUrl && resource.sourceUrl !== resource.officialUrl) {
    return action("visit-site", "View source code", resource.sourceUrl);
  }
  return null;
}
