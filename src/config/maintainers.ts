/**
 * The maintainer register: the people who may sign off a `VERIFIED` badge.
 *
 * `VERIFIED` is the strongest claim the project makes, and it is a human claim. The
 * build only accepts it when `verifiedBy` names someone listed here, so the list is
 * the explicit, reviewable record of who is accountable for sign-off.
 *
 * Rules for this file:
 *
 * - Each maintainer adds **their own** GitHub handle, in a pull request they author.
 * - Nobody adds a handle on someone else's behalf — not a contributor, a script, a
 *   bot or an AI assistant. A handle here that its owner did not add is a false claim
 *   about who checked something.
 * - Removing a handle does not un-verify past sign-offs retroactively; the build will
 *   fail for any listing still signed by them, which forces a re-check or a new
 *   sign-off. That is intended.
 *
 * It is empty on purpose. Until a maintainer records themselves here, no listing can
 * be marked `VERIFIED`, and resources whose evidence is complete are shown as
 * "awaiting sign-off" instead. See docs/verification.md#signing-off-maintainers.
 */

export interface Maintainer {
  /** GitHub handle, including the leading `@`. */
  handle: `@${string}`;
  /** The date the maintainer added themselves, as YYYY-MM-DD. */
  since: string;
}

export const maintainers: readonly Maintainer[] = [];

/** Whether a `verifiedBy` value names a registered maintainer. Case-insensitive, as GitHub handles are. */
export function isRegisteredMaintainer(verifiedBy: string | undefined): boolean {
  if (!verifiedBy) return false;
  const wanted = verifiedBy.toLowerCase();
  return maintainers.some((maintainer) => maintainer.handle.toLowerCase() === wanted);
}
