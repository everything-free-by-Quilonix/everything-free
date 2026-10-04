import type { Resource } from "@/types/resource";
import { FreeStatusBadge, OpenSourceBadge } from "./status-badges";

/**
 * Resource snapshot: the facts most people decide on, each with its evidence.
 *
 * When to use: `size="compact"` opens a record's facts zone. When not to use: as
 * a row of coloured badges; there are two tokens at most.
 *
 * Keyboard: static.
 *
 * Evidence: this file computes no tone and no evidence state of its own. The
 * compact tokens come from `status-badges.tsx`, which gates tone on confirmed
 * evidence. The free-status token is the first `[data-fact]` in a record, which
 * the smoke audit relies on.
 */
export function ResourceSnapshot({ resource }: { resource: Resource; size: "compact" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <FreeStatusBadge resource={resource} variant="token" />
      {resource.openSource && resource.freeStatus !== "OPEN_SOURCE" ? (
        <OpenSourceBadge variant="token" resource={resource} />
      ) : null}
    </div>
  );
}
