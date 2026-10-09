"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { parseMarkdown, type Block, type Inline } from "@/features/ai/logic/markdown";

/**
 * Renders a model's Markdown reply as React elements. No HTML from the model is
 * ever inserted: the parser produces a plain tree, and only http(s) links become
 * anchors, opening in a new tab with no referrer.
 */
export function ChatMarkdown({ text }: { text: string }) {
  const blocks = parseMarkdown(text);
  return <div className="flex flex-col gap-3">{blocks.map((block, index) => renderBlock(block, index))}</div>;
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="whitespace-pre-wrap">
          {renderInline(block.children)}
        </p>
      );
    case "heading": {
      const size = block.level === 1 ? "text-lg" : block.level === 2 ? "text-base" : "text-[0.9375rem]";
      return (
        <p key={key} role="heading" aria-level={block.level + 2} className={`${size} mt-1 font-semibold text-fg`}>
          {renderInline(block.children)}
        </p>
      );
    }
    case "code":
      return <CodeBlock key={key} language={block.language} text={block.text} />;
    case "list": {
      const items = block.items.map((item, index) => <li key={index}>{renderInline(item)}</li>);
      return block.ordered ? (
        <ol key={key} start={block.start} className="flex list-decimal flex-col gap-1 pl-6">
          {items}
        </ol>
      ) : (
        <ul key={key} className="flex list-disc flex-col gap-1 pl-6">
          {items}
        </ul>
      );
    }
    case "quote":
      return (
        <blockquote key={key} className="border-l-2 border-border-strong pl-3 text-fg-muted">
          {renderInline(block.children)}
        </blockquote>
      );
    case "rule":
      return <hr key={key} className="border-border" />;
  }
}

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "text":
        return node.text;
      case "strong":
        return (
          <strong key={index} className="font-semibold text-fg">
            {renderInline(node.children)}
          </strong>
        );
      case "em":
        return <em key={index}>{renderInline(node.children)}</em>;
      case "code":
        return (
          <code key={index} className="rounded-sm bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
            {node.text}
          </code>
        );
      case "link":
        return (
          <a key={index} href={node.href} target="_blank" rel="noopener noreferrer nofollow" className="link-inline">
            {renderInline(node.children)}
          </a>
        );
    }
  });
}

function CodeBlock({ language, text }: { language: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The code is visible and selectable.
    }
  };
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-raised px-3 py-1.5">
        <span className="font-mono text-xs text-fg-subtle">{language || "code"}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs text-fg-muted hover:bg-surface-hover hover:text-fg pointer-coarse:min-h-9"
        >
          <Icon name={copied ? "check" : "copy"} size={13} />
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[0.8125rem] leading-relaxed text-fg">
        <code>{text}</code>
      </pre>
    </div>
  );
}
