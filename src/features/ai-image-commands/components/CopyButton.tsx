"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: "sm" | "md";
}

export function CopyButton({
  textToCopy,
  label = "Copy modifier",
  copiedLabel = "Copied to clipboard",
  className,
  size = "sm",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : `${label}: ${textToCopy.slice(0, 40)}...`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-sm border border-border-strong/70 bg-surface-raised font-medium text-fg shadow-2xs transition-colors",
        "hover:bg-surface-hover hover:border-fg-subtle active:translate-y-px pointer-coarse:min-h-11",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        className,
      )}
    >
      <Icon name={copied ? "check" : "copy"} size={size === "sm" ? 13 : 15} />
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
