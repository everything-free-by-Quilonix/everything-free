import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, stretchedLink } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { Tool } from "@/types/tool";

/**
 * Tool card.
 *
 * Leads with the privacy position, because that is the reason to use a tool here
 * rather than the first result on a search engine. Planned tools are visibly
 * non-interactive and labelled, so nothing looks clickable that is not.
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const planned = tool.status === "planned";
  const local = tool.processing.location === "browser" && !tool.processing.leavesDevice;

  return (
    <Card
      as="article"
      interactive={!planned}
      className={cn("flex h-full flex-col p-5", planned && "border-dashed opacity-80")}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-fg-muted"
        >
          <Icon name={tool.icon} size={19} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base leading-tight font-semibold">
            {planned ? (
              tool.name
            ) : (
              <Link href={`/tools/${tool.slug}`} className={cn("rounded", stretchedLink)}>
                {tool.name}
              </Link>
            )}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{tool.shortDescription}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {planned ? (
          <Badge tone="neutral" icon="clock">
            Planned
          </Badge>
        ) : local ? (
          <Badge tone="success" icon="lock">
            Runs in your browser
          </Badge>
        ) : (
          <Badge tone="warning" icon="server">
            Sends data to a server
          </Badge>
        )}
      </div>
    </Card>
  );
}
