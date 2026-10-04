"use client";

/**
 * Compare toggle: adds a listing to, or removes it from, the comparison on
 * `/resources`.
 *
 * When to use: only through `RecordList renderCompare`, which only
 * `ResourceExplorer` passes, so it exists only where JavaScript is running.
 * When not to use: on server-rendered lists or the static fallback, which have
 * no selection to join.
 *
 * Keyboard: a `<button aria-pressed>`; Enter or Space toggles. It sits above the
 * record's stretched link, so it is its own tab stop. When three are selected
 * the others stay focusable with `aria-disabled` and say why.
 *
 * Evidence: none. Selecting a listing claims nothing about it.
 *
 * Selected is ink, not gold: the label stays "Compare", the edge and text turn
 * `--fg` and the fill `--surface-hover`.
 */
export function CompareToggle({
  name,
  selected,
  full,
  onToggle,
}: {
  name: string;
  selected: boolean;
  /** Three are selected and this one is not among them. */
  full: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-compare-toggle=""
      aria-pressed={selected}
      aria-disabled={full || undefined}
      aria-label={
        selected
          ? `Remove ${name} from comparison`
          : `Add ${name} to comparison${full ? ". Comparison is full, 3 of 3" : ""}`
      }
      onClick={() => {
        if (!full) onToggle();
      }}
      className={
        selected
          ? "relative z-1 inline-flex h-8 items-center rounded-sm border border-fg bg-surface-hover px-2 text-xs font-semibold text-fg pointer-coarse:h-11 active:bg-(--fill-pressed)"
          : full
            ? "relative z-1 inline-flex h-8 cursor-not-allowed items-center rounded-sm border border-border-strong px-2 text-xs font-medium text-fg-muted opacity-50 pointer-coarse:h-11"
            : "relative z-1 inline-flex h-8 items-center rounded-sm border border-border-strong px-2 text-xs font-medium text-fg-muted transition-colors pointer-coarse:h-11 hover:bg-surface-hover hover:text-fg active:bg-(--fill-pressed)"
      }
    >
      Compare
    </button>
  );
}
