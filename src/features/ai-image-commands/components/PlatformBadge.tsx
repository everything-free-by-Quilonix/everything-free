import { Badge } from "@/components/ui/badge";
import type { PlatformSupport } from "@/types/ai-image-command";

interface PlatformBadgeProps {
  platform: "ChatGPT" | "Gemini";
  support: PlatformSupport;
  className?: string;
}

export function PlatformBadge({ platform, support, className }: PlatformBadgeProps) {
  const isUnsupported = support === "unsupported";

  const label =
    support === "native"
      ? "Native"
      : support === "prompt_modifier"
        ? "Prompt Modifier"
        : support === "style_reference"
          ? "Style Reference"
          : support === "unsupported"
            ? "Unsupported"
            : "Unverified";

  return (
    <span className={className}>
      <Badge
        tone={isUnsupported ? "warning" : "neutral"}
        size="sm"
        appearance="badge"
      >
        <span className="font-semibold text-fg">{platform}:</span>
        <span>{label}</span>
      </Badge>
    </span>
  );
}
