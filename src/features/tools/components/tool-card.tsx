import Link from "next/link";
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
      {/* No icon tile: the name leads, and the privacy position below says why. */}
      <h3 className="font-display text-base leading-tight font-semibold">
        {planned ? (
          tool.name
        ) : (
          <Link href={`/tools/${tool.slug}`} className={cn("rounded-xs", stretchedLink)}>
            {tool.name}
          </Link>
        )}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{tool.shortDescription}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {planned ? (
          <Badge tone="neutral">
            Planned
          </Badge>
        ) : local ? (
          <Badge tone="neutral" icon="lock">
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
