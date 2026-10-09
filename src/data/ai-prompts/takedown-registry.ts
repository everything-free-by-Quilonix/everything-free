/**
 * Takedown and removal registry for external prompt content.
 *
 * If a creator or source requests removal, a URL changes, or a license status shifts,
 * adding an ID or URL pattern here immediately filters it out from the normalized dataset
 * and discovery interface without touching UI components.
 */

export interface TakedownRecord {
  idOrPattern: string;
  reason: string;
  requestedBy?: string;
  removedAt: string;
}

export const TAKEDOWN_REGISTRY: TakedownRecord[] = [
  // Example entry format:
  // {
  //   idOrPattern: "wikiprompt-12345",
  //   reason: "Author requested removal",
  //   requestedBy: "original_author",
  //   removedAt: "2026-10-08",
  // }
];

const blockedIdsSet = new Set(TAKEDOWN_REGISTRY.map((t) => t.idOrPattern.toLowerCase()));

/**
 * Checks if a prompt ID or source URL is blocked by takedown policy.
 */
export function isPromptBlocked(promptId: string, sourceUrl?: string): boolean {
  const normalizedId = promptId.toLowerCase();
  if (blockedIdsSet.has(normalizedId)) {
    return true;
  }
  if (sourceUrl) {
    const normalizedUrl = sourceUrl.toLowerCase();
    for (const record of TAKEDOWN_REGISTRY) {
      if (normalizedUrl.includes(record.idOrPattern.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}
