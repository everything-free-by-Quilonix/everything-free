"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { formatCount } from "@/lib/utils/format";

/**
 * Text transformations, all performed locally.
 *
 * Transforms are pure functions of the input, which keeps them testable and means
 * the undo story is simply "keep the previous value" — held in a single history
 * entry so a mistaken transform is recoverable without a full undo stack.
 */

type Transform = (input: string) => string;

const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

const titleCase: Transform = (input) =>
  input
    .toLowerCase()
    .split(/(\s+)/)
    .map((token, index) => {
      if (/^\s+$/.test(token) || token.length === 0) return token;
      // Leading word is always capitalised; minor words in the middle are not.
      if (index > 0 && SMALL_WORDS.has(token)) return token;
      return token[0].toUpperCase() + token.slice(1);
    })
    .join("");

const sentenceCase: Transform = (input) =>
  input
    .toLowerCase()
    // Capitalise the first letter of the string and of anything after . ! ?
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_match, prefix: string, letter: string) => prefix + letter.toUpperCase());

const slugify: Transform = (input) =>
  input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const collapseWhitespace: Transform = (input) => input.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

const stripLineBreaks: Transform = (input) => input.replace(/\s*\n\s*/g, " ").replace(/ {2,}/g, " ").trim();

const removeDuplicateLines: Transform = (input) => {
  const seen = new Set<string>();
  return input
    .split("\n")
    .filter((line) => {
      const key = line.trim();
      if (key.length === 0) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join("\n");
};

const sortLines: Transform = (input) =>
  input
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .sort((a, b) => a.localeCompare(b))
    .join("\n");

const reverseLines: Transform = (input) => input.split("\n").reverse().join("\n");

interface Action {
  id: string;
  label: string;
  transform: Transform;
}

const ACTION_GROUPS: { legend: string; actions: Action[] }[] = [
  {
    legend: "Case",
    actions: [
      { id: "upper", label: "UPPERCASE", transform: (input) => input.toUpperCase() },
      { id: "lower", label: "lowercase", transform: (input) => input.toLowerCase() },
      { id: "title", label: "Title Case", transform: titleCase },
      { id: "sentence", label: "Sentence case", transform: sentenceCase },
    ],
  },
  {
    legend: "Format",
    actions: [
      { id: "slug", label: "URL slug", transform: slugify },
      { id: "collapse", label: "Tidy whitespace", transform: collapseWhitespace },
      { id: "single-line", label: "Join into one line", transform: stripLineBreaks },
    ],
  },
  {
    legend: "Lines",
    actions: [
      { id: "dedupe", label: "Remove duplicates", transform: removeDuplicateLines },
      { id: "sort", label: "Sort A–Z", transform: sortLines },
      { id: "reverse", label: "Reverse order", transform: reverseLines },
    ],
  },
];

function countStats(text: string) {
  const trimmed = text.trim();
  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length,
    lines: text.length === 0 ? 0 : text.split("\n").length,
    // Heuristic: terminal punctuation followed by whitespace or end of string.
    sentences: trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || 1,
  };
}

export function TextToolkit() {
  const [text, setText] = useState("");
  const [previous, setPrevious] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaId = useId();

  const stats = useMemo(() => countStats(text), [text]);

  const apply = (transform: Transform) => {
    setPrevious(text);
    setText(transform(text));
    setCopied(false);
  };

  const undo = () => {
    if (previous === null) return;
    setText(previous);
    setPrevious(null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied. The textarea is selectable, so the user
      // still has a way to copy; no error state is warranted.
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="text-sm font-medium text-fg">
          Your text
        </label>
        <textarea
          id={textareaId}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setCopied(false);
          }}
          rows={10}
          spellCheck={false}
          placeholder="Paste or type text here."
          className="w-full resize-y rounded-lg border border-border-strong bg-bg px-3 py-2.5 font-mono text-sm leading-relaxed text-fg transition-colors placeholder:text-fg-subtle focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-fg-muted">Processed in your browser. Nothing is sent anywhere.</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-bg-subtle p-4 sm:grid-cols-5">
        {[
          { term: "Words", value: stats.words },
          { term: "Characters", value: stats.characters },
          { term: "No spaces", value: stats.charactersNoSpaces },
          { term: "Sentences", value: stats.sentences },
          { term: "Lines", value: stats.lines },
        ].map((entry) => (
          <div key={entry.term}>
            <dt className="text-xs text-fg-muted">{entry.term}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums">{formatCount(entry.value)}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-4">
        {ACTION_GROUPS.map((group) => (
          <fieldset key={group.legend} disabled={text.length === 0}>
            <legend className="text-xs font-semibold tracking-wide text-fg-muted uppercase">{group.legend}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.actions.map((action) => (
                <Button key={action.id} variant="secondary" size="sm" onClick={() => apply(action.transform)}>
                  {action.label}
                </Button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button onClick={() => void copy()} disabled={text.length === 0} size="md">
          <Icon name={copied ? "check" : "copy"} size={16} />
          {copied ? "Copied" : "Copy result"}
        </Button>

        <Button variant="ghost" size="md" onClick={undo} disabled={previous === null}>
          Undo last change
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            setPrevious(text);
            setText("");
          }}
          disabled={text.length === 0}
        >
          Clear
        </Button>

        <p role="status" aria-live="polite" className="sr-only">
          {copied ? "Copied to clipboard" : ""}
        </p>
      </div>
    </div>
  );
}
