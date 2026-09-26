import { ContrastChecker } from "../implementations/contrast-checker";
import { ImageConverter } from "../implementations/image-converter";
import { TextToolkit } from "../implementations/text-toolkit";

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
 */
export function ToolSurface({ slug }: { slug: string }) {
  switch (slug) {
    case "image-converter":
      return <ImageConverter />;
    case "contrast-checker":
      return <ContrastChecker />;
    case "text-toolkit":
      return <TextToolkit />;
    default:
      return null;
  }
}

/** Slugs with a working implementation. Kept in sync with the switch above. */
const IMPLEMENTED = new Set(["image-converter", "contrast-checker", "text-toolkit"]);

export function hasToolImplementation(slug: string): boolean {
  return IMPLEMENTED.has(slug);
}
