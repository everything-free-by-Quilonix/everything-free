import { Chip } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface PromptSourceBadgeProps {
  sourceName: string;
  license?: string;
  className?: string;
}

export function PromptSourceBadge({ sourceName, license, className }: PromptSourceBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs text-fg-muted", className)}>
      <span className="font-semibold text-fg">Source:</span>
      <Chip className="font-medium">
        {sourceName}
      </Chip>
      {license ? (
        <span className="text-[11px] text-fg-subtle truncate max-w-[150px]">
          ({license})
        </span>
      ) : null}
    </div>
  );
}
