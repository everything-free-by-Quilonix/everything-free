import { withBasePath } from "@/config/deployment";

/**
 * One fetch of the compare index per page lifetime. Validation happens in the
 * view. "Try again" clears the cache with `resetCompareIndex`.
 */
let pending: Promise<unknown> | null = null;

export function loadCompareIndex(): Promise<unknown> {
  pending ??= fetch(withBasePath("/compare-index.json")).then((response) => {
    if (!response.ok) throw new Error(`compare index: HTTP ${response.status}`);
    return response.json() as Promise<unknown>;
  });
  return pending;
}

export function resetCompareIndex(): void {
  pending = null;
}
