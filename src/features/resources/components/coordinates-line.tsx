import { categoryName } from "@/config/categories";
import { getResourceType } from "@/config/resource-types";
import { platformLabels } from "@/lib/resources/derive";
import type { Resource } from "@/types/resource";

/**
 * Coordinates line: a listing's grid reference, always in the same order:
 * subject · type · platforms · licence.
 *
 * When to use: under a record's name and in the record-page header. When not to
 * use: as a claim. These are recorded classifications; their evidence is stated
 * by the snapshot and the evidence list, never here.
 *
 * Keyboard: static text. Absent parts are omitted, never shown as "None", and
 * the separators are drawn by CSS between parts, so each part wraps whole.
 */
export function CoordinatesLine({ resource }: { resource: Resource }) {
  const platforms = platformLabels(resource);
  const type = getResourceType(resource.resourceType).label;
  const subject = categoryName(resource.category);

  const parts = [
    subject ? <span key="subject">{subject}</span> : null,
    type ? <span key="type">{type}</span> : null,
    platforms.length > 0 ? (
      <span key="platforms">
        <span className="sr-only">Available on: </span>
        {platforms.join(" ")}
      </span>
    ) : null,
    resource.license ? (
      <span key="license" translate="no">
        {resource.license}
      </span>
    ) : null,
  ].filter((part) => part !== null);

  if (parts.length === 0) return null;

  // A plain space between parts is the only break opportunity, so the line
  // wraps between parts and never inside one.
  return (
    <p className="coordinates text-xs text-fg-muted tabular-nums">
      {parts.flatMap((part, index) => (index === 0 ? [part] : [" ", part]))}
    </p>
  );
}
