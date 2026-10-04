"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { FactMeter } from "@/features/resources/components/fact-meter";
import { cn } from "@/lib/utils/cn";

import { paletteIndexSchema, type PaletteIndex } from "./palette-index-schema";
import { loadPaletteIndex, resetPaletteIndex } from "./palette-loader";
import {
  cleanQuery,
  flattenRows,
  MAX_QUERY,
  resultCount,
  searchPalette,
  type PaletteRow,
  type PaletteSection,
} from "./palette-search";

/**
 * Command palette: jump to a listing, subject, collection, tool, alternative or
 * page from anywhere, by keyboard.
 *
 * When to use: opened only by `PaletteTrigger` (header control, ⌘K/Ctrl+K, `/`).
 * When not to use: as the library search; its last row always hands off to
 * `/resources` with the typed query.
 *
 * Keyboard (WAI-ARIA combobox with a listbox popup): Down and Up move through
 * every row and wrap; Enter opens the active row; Shift+Enter on a listing
 * copies its official link; Escape clears a typed query, and on an empty query
 * closes. Clearing cancels the keydown itself, so the dialog never sees a close
 * request it would have to veto.
 *
 * Evidence: a listing's secondary line prints the free-status words the build
 * decided with `factEvidence` ("Listed as …" unless confirmed), verbatim; the
 * mini fact meter draws the build's `k`/`u`/`t` and is named in words for
 * assistive technology. A copied URL is a pointer, not a claim, so it carries
 * no mark.
 */

type Load = { state: "loading" } | { state: "ready"; index: PaletteIndex } | { state: "error" };

function readSections(): PaletteSection[] {
  return [...document.querySelectorAll<HTMLAnchorElement>('nav[aria-label="On this page"] a[href^="#"]')]
    .map((link) => ({ id: link.hash.slice(1), label: link.textContent?.trim() ?? "" }))
    .filter((section) => section.id && section.label);
}

/**
 * Focus an in-page section after the hash scroll: its heading when it has one
 * (`{id}-heading`, the `Section` convention), else the element itself. Neither
 * is focusable by default, so it becomes a programmatic target (-1) first.
 */
function focusSection(id: string) {
  const el = document.getElementById(`${id}-heading`) ?? document.getElementById(id);
  if (!el) return;
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

function Highlighted({ label, match }: { label: string; match?: [number, number] }) {
  if (!match) return <>{label}</>;
  const [start, end] = match;
  return (
    <>
      {label.slice(0, start)}
      <mark className="bg-transparent text-fg underline decoration-fg underline-offset-2">{label.slice(start, end)}</mark>
      {label.slice(end)}
    </>
  );
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const listId = `${baseId}-list`;
  const hintId = `${baseId}-copy-hint`;
  const inputRef = useRef<HTMLInputElement>(null);
  const afterClose = useRef<(() => void) | null>(null);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [restoreFocus, setRestoreFocus] = useState(true);
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [slow, setSlow] = useState(false);
  const [message, setMessage] = useState("");

  // Each opening starts fresh: an empty query and focus restored on close.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActive(0);
      setRestoreFocus(true);
      setMessage("");
    }
  }

  // One fetch per page lifetime; a shape the schema rejects is a load failure.
  useEffect(() => {
    let live = true;
    loadPaletteIndex()
      .then((raw) => paletteIndexSchema.parse(raw))
      .then(
        (index) => live && setLoad({ state: "ready", index }),
        () => live && setLoad({ state: "error" }),
      );
    return () => {
      live = false;
    };
  }, [attempt]);

  // Skeleton rows only if the index is still missing after 150ms.
  useEffect(() => {
    if (load.state !== "loading") return;
    const timer = window.setTimeout(() => setSlow(true), 150);
    return () => window.clearTimeout(timer);
  }, [load.state, attempt]);

  // The page's own sections, read once per opening.
  const sections = useMemo(() => (open ? readSections() : []), [open]);
  const onHome = pathname === "/";

  const index = load.state === "ready" ? load.index : null;
  const groups = useMemo(() => searchPalette(index, query, sections, { onHome }), [index, query, sections, onHome]);
  const rows = useMemo(() => flattenRows(groups), [groups]);
  const activeIndex = rows.length === 0 ? -1 : Math.min(active, rows.length - 1);
  const optionId = (i: number) => `${baseId}-opt-${i}`;
  const trimmed = cleanQuery(query);
  const matches = resultCount(groups);
  const noMatch = index !== null && trimmed.length > 0 && matches === 0;

  // Announce the count once typing pauses, never on every keystroke.
  useEffect(() => {
    if (!trimmed || !index) return;
    const timer = window.setTimeout(
      () => setMessage(matches === 0 ? `No direct match for “${trimmed}”` : `${matches} ${matches === 1 ? "result" : "results"}`),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [trimmed, matches, index]);

  useEffect(() => {
    if (activeIndex >= 0) document.getElementById(`${baseId}-opt-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, baseId]);

  // Where each group's rows start in the flat order, for option ids.
  const starts = groups.reduce<number[]>((acc, group, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + groups[i - 1].rows.length);
    return acc;
  }, []);

  const activate = (row: PaletteRow) => {
    setRestoreFocus(false);
    if (row.anchor) {
      const id = row.href.slice(1);
      afterClose.current = () => {
        window.location.hash = id;
        focusSection(id);
      };
    } else {
      router.push(row.href);
      // The page behind is being replaced, so focus goes to its main region.
      afterClose.current = () => document.getElementById("main")?.focus();
    }
    onClose();
  };

  const copy = (row: PaletteRow) => {
    const url = row.official;
    if (!url) return;
    const fail = () => setMessage(`Could not copy. The official link is ${url}`);
    if (!navigator.clipboard) return fail();
    navigator.clipboard.writeText(url).then(() => setMessage(`Copied the official link for ${row.label}`), fail);
  };

  const retry = () => {
    resetPaletteIndex();
    setSlow(false);
    setLoad({ state: "loading" });
    setAttempt((n) => n + 1);
  };

  return (
    <Dialog
      open={open}
      onRequestClose={onClose}
      onExited={() => {
        afterClose.current?.();
        afterClose.current = null;
      }}
      variant="palette-top"
      labelledBy={titleId}
      initialFocusRef={inputRef}
      returnFocus={restoreFocus}
    >
      <h2 id={titleId} className="sr-only">
        Jump to a listing or page
      </h2>
      <div className="flex shrink-0 items-center border-b border-rule px-4">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-labelledby={titleId}
          autoComplete="off"
          spellCheck={false}
          maxLength={MAX_QUERY}
          placeholder="Jump to a listing, subject or page"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && query !== "") {
              // Cancelling the keydown stops the close request before it starts.
              event.preventDefault();
              setQuery("");
              setActive(0);
              return;
            }
            if (rows.length === 0) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              const step = event.key === "ArrowDown" ? 1 : -1;
              setActive((activeIndex + step + rows.length) % rows.length);
              return;
            }
            if (event.key === "Enter" && activeIndex >= 0) {
              event.preventDefault();
              const row = rows[activeIndex];
              if (event.shiftKey) copy(row);
              else activate(row);
            }
          }}
          className="my-2 h-10 w-full rounded-xs bg-transparent text-base text-fg placeholder:text-fg-subtle"
        />
      </div>

      <div id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,28rem)] overflow-y-auto py-2">
        {groups.map((group, g) => {
          const labelId = `${baseId}-g-${group.id}`;
          return (
            <div key={group.id} role="group" aria-labelledby={labelId} className="py-1">
              <p id={labelId} className="kicker px-4 py-1.5">
                {group.label}
              </p>
              {group.rows.map((row, r) => {
                const i = starts[g] + r;
                const selected = i === activeIndex;
                return (
                  <div
                    key={row.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={selected}
                    aria-describedby={row.official ? hintId : undefined}
                    onPointerMove={() => setActive(i)}
                    // Keep focus in the input; the click activates.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => activate(row)}
                    className={cn(
                      // Selected, not focused: DOM focus stays in the input, which
                      // holds the only focus ring. The active row takes the
                      // selected role, a fill and a 2px gold leading rule.
                      "palette-option mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-e-sm border-s-2 border-transparent px-2 py-2 text-sm",
                      selected && "border-s-primary bg-surface-hover",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-fg">
                        <Highlighted label={row.label} match={row.match} />
                      </span>
                      {row.secondary ? (
                        <span className="block truncate text-xs text-fg-muted">{row.secondary}</span>
                      ) : null}
                    </span>
                    {row.meter && index ? (
                      <span className="shrink-0">
                        <FactMeter confirmed={row.meter.k} unsettled={row.meter.u} total={index.t} />
                        <span className="sr-only">
                          {row.meter.k} of {index.t} facts confirmed
                        </span>
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}

        {load.state === "loading" && slow && trimmed ? (
          <div aria-hidden="true" className="flex flex-col gap-2 px-4 py-2">
            {[0, 1, 2].map((n) => (
              <span key={n} className="block h-9 rounded-sm bg-surface-hover" />
            ))}
          </div>
        ) : null}

        {load.state === "error" ? (
          <Notice>
            The jump list could not load.{" "}
            <button type="button" onClick={retry} className="link-inline rounded-xs">
              Try again
            </button>
          </Notice>
        ) : null}

        {noMatch ? <Notice>No direct match for &ldquo;{trimmed}&rdquo;</Notice> : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {message}
      </p>

      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule px-4 py-2.5 text-xs text-fg-subtle">
        <span>
          <Kbd>Up</Kbd> <Kbd>Down</Kbd> to move
        </span>
        <span>
          <Kbd>Enter</Kbd> to open
        </span>
        <span id={hintId}>
          <Kbd>Shift+Enter</Kbd> copies the official link
        </span>
        <span>
          <Kbd>Esc</Kbd> clears, then closes
        </span>
      </div>
    </Dialog>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return <p className="px-4 py-3 text-sm text-fg-muted">{children}</p>;
}
