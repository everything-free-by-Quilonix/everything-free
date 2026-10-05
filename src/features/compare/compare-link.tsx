"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

import { compareHref } from "./compare-params";

/**
 * "Compare with…": the record page's way into Quick Compare.
 *
 * When to use: once, in the record header's actions. When not to use: in lists,
 * where the compare toggle does the job.
 *
 * Keyboard: a plain link to `/compare/?r={slug}`, where the picker adds the rest.
 *
 * Evidence: none.
 *
 * Rendered only after hydration (the server snapshot is `false`): without
 * JavaScript the compare page cannot work, so the no-JS record page does not
 * offer it.
 */
const subscribe = () => () => {};

export function CompareLink({ slug }: { slug: string }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!hydrated) return null;

  return (
    <Link href={compareHref([slug])} className="link-inline self-center text-sm pointer-coarse:py-2">
      Compare with…
    </Link>
  );
}
