import { ContrastChecker } from "../implementations/contrast-checker";
import { Game2048 } from "../implementations/game-2048";
import { ImageConverter } from "../implementations/image-converter";
import { PaletteExtractor } from "../implementations/palette-extractor";
import { PhotoMetadata } from "../implementations/photo-metadata";
import { PrivateAiChat } from "../implementations/private-ai-chat";
import { SubscriptionAudit } from "../implementations/subscription-audit";
import { TextToolkit } from "../implementations/text-toolkit";
import { TrialReminder } from "../implementations/trial-reminder";
import type { AlternativeTarget } from "../logic/subscription-audit";

/**
 * Renders the implementation for a tool slug.
 *
 * This is a switch rather than a slug-to-component lookup table that callers
 * instantiate. The difference matters: resolving a component reference during
 * render and then rendering it produces a *new* component identity on every
 * render, which resets the tool's internal state. Every state change in the image
 * converter would wipe the loaded file.
 *
 * Switching inside a statically-declared component keeps each implementation's
 * identity stable across renders, so tool state survives.
 *
 * Returns `null` for any slug without an implementation, which is how entries
 * marked `status: "planned"` behave.
 *
 * `alternativeTargets` is read from the repository at build time by the page and
 * only consumed by the subscription audit, which matches what the user types
 * against the library's "free alternatives to X" pages.
 */
export function ToolSurface({
  slug,
  alternativeTargets = [],
}: {
  slug: string;
  alternativeTargets?: readonly AlternativeTarget[];
}) {
  switch (slug) {
    case "image-converter":
      return <ImageConverter />;
    case "contrast-checker":
      return <ContrastChecker />;
    case "text-toolkit":
      return <TextToolkit />;
    case "trial-reminder":
      return <TrialReminder />;
    case "subscription-audit":
      return <SubscriptionAudit targets={alternativeTargets} />;
    case "photo-metadata":
      return <PhotoMetadata />;
    case "palette-extractor":
      return <PaletteExtractor />;
    case "private-ai-chat":
      return <PrivateAiChat />;
    case "play-2048":
      return <Game2048 />;
    default:
      return null;
  }
}

/** Slugs with a working implementation. Kept in sync with the switch above. */
const IMPLEMENTED = new Set([
  "image-converter",
  "contrast-checker",
  "text-toolkit",
  "trial-reminder",
  "subscription-audit",
  "photo-metadata",
  "palette-extractor",
  "private-ai-chat",
  "play-2048",
]);

export function hasToolImplementation(slug: string): boolean {
  return IMPLEMENTED.has(slug);
}

/** Tools whose surface needs the library's alternative targets. */
export function toolNeedsAlternativeTargets(slug: string): boolean {
  return slug === "subscription-audit";
}
