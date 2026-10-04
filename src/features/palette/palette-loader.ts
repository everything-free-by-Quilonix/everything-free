import { withBasePath } from "@/config/deployment";

/**
 * One fetch of the palette index per page lifetime, shared by the trigger's
 * prefetch (hover or focus) and the palette itself. The raw JSON is cached here;
 * validation happens in the palette chunk, so the schema library never loads
 * with the page. "Try again" clears the cache with `resetPaletteIndex`.
 */
let pending: Promise<unknown> | null = null;

export function loadPaletteIndex(): Promise<unknown> {
  pending ??= fetch(withBasePath("/palette-index.json")).then((response) => {
    if (!response.ok) throw new Error(`palette index: HTTP ${response.status}`);
    return response.json() as Promise<unknown>;
  });
  return pending;
}

/** Prefetch without surfacing a failure: the palette reports it when opened. */
export function prefetchPaletteIndex(): void {
  loadPaletteIndex().catch(() => {});
}

export function resetPaletteIndex(): void {
  pending = null;
}
