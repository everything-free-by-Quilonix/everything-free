/**
 * A small Markdown parser for chat replies.
 *
 * Models answer in Markdown: paragraphs, lists, headings, code blocks, bold and
 * inline code. This turns that into a plain tree the chat renders as React
 * elements, so nothing a model writes is ever inserted as HTML. Unsupported syntax
 * stays visible as text, which is a safer failure than a dropped line.
 *
 * Streaming-aware: a code fence that has not closed yet is still shown as code.
 */

export type Inline =
  | { type: "text"; text: string }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "code"; text: string }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "paragraph"; children: Inline[] }
  | { type: "heading"; level: 1 | 2 | 3; children: Inline[] }
  | { type: "code"; language: string; text: string; open: boolean }
  | { type: "list"; ordered: boolean; start: number; items: Inline[][] }
  | { type: "quote"; children: Inline[] }
  | { type: "rule" };

const FENCE = /^\s{0,3}(```|~~~)\s*([\w+#.-]*)\s*$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const BULLET = /^\s{0,3}[-*+]\s+(.*)$/;
const NUMBERED = /^\s{0,3}(\d{1,9})[.)]\s+(.*)$/;
const QUOTE = /^\s{0,3}>\s?(.*)$/;
const RULE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const fence = FENCE.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      let open = true;
      while (i < lines.length) {
        if (lines[i].trim().startsWith(fence[1])) {
          open = false;
          i++;
          break;
        }
        body.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", language: fence[2], text: body.join("\n"), open });
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (RULE.test(line)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      const level = Math.min(3, heading[1].length) as 1 | 2 | 3;
      blocks.push({ type: "heading", level, children: parseInline(heading[2]) });
      i++;
      continue;
    }

    if (BULLET.test(line) || NUMBERED.test(line)) {
      const ordered = !BULLET.test(line);
      const start = ordered ? Number(NUMBERED.exec(line)![1]) : 1;
      const items: string[] = [];
      while (i < lines.length) {
        const match = ordered ? NUMBERED.exec(lines[i]) : BULLET.exec(lines[i]);
        if (match) {
          items.push(ordered ? match[2] : match[1]);
        } else if (lines[i].trim() !== "" && /^\s{2,}/.test(lines[i]) && items.length > 0) {
          items[items.length - 1] += ` ${lines[i].trim()}`; // continuation line
        } else {
          break;
        }
        i++;
      }
      blocks.push({ type: "list", ordered, start, items: items.map(parseInline) });
      continue;
    }

    if (QUOTE.test(line)) {
      const quoted: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        quoted.push(QUOTE.exec(lines[i])![1]);
        i++;
      }
      blocks.push({ type: "quote", children: parseInline(quoted.join(" ")) });
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !FENCE.test(lines[i]) &&
      !HEADING.test(lines[i]) &&
      !BULLET.test(lines[i]) &&
      !NUMBERED.test(lines[i]) &&
      !QUOTE.test(lines[i]) &&
      !RULE.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", children: parseInline(paragraph.join("\n")) });
  }

  return blocks;
}

/** Only web links are made clickable; anything else stays as text. */
export function safeHref(href: string): string | null {
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let buffer = "";
  const flush = () => {
    if (buffer) out.push({ type: "text", text: buffer });
    buffer = "";
  };

  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);

    if (rest[0] === "\\" && rest.length > 1 && /[\\`*_[\]()#+\-.!]/.test(rest[1])) {
      buffer += rest[1];
      i += 2;
      continue;
    }

    if (rest[0] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i + 1) {
        flush();
        out.push({ type: "code", text: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // The content may end in one `*`, so "**a *b***" closes the bold after the italic.
    const strong = /^(\*\*|__)(?=\S)([\s\S]*?\S\*?)\1(?![*_])/.exec(rest);
    if (strong) {
      flush();
      out.push({ type: "strong", children: parseInline(strong[2]) });
      i += strong[0].length;
      continue;
    }

    const em = /^([*_])(?=\S)([\s\S]*?\S)\1(?![*_\w])/.exec(rest);
    if (em && !(rest[0] === "_" && /\w/.test(text[i - 1] ?? ""))) {
      flush();
      out.push({ type: "em", children: parseInline(em[2]) });
      i += em[0].length;
      continue;
    }

    // One level of brackets inside the address, as in Wikipedia links.
    const link = /^\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/.exec(rest);
    if (link) {
      const href = safeHref(link[2]);
      flush();
      out.push(href ? { type: "link", href, children: parseInline(link[1]) } : { type: "text", text: link[1] });
      i += link[0].length;
      continue;
    }

    buffer += rest[0];
    i++;
  }
  flush();
  return out;
}
