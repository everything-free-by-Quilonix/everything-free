import { Icon, type IconName } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, stretchedLink } from "@/components/ui/card";
import type { ToolsSiteCategory, ToolsSiteTool } from "@/config/tools-site";
import { cn } from "@/lib/utils/cn";

/**
 * Tools from the Everything.Free Tools site.
 *
 * They run on that site, so every link says so: an arrow, and screen-reader text
 * naming the destination. They open in the same tab, because it is the same
 * project on the same origin rather than a third party.
 */

const categoryIcons: Record<string, IconName> = {
  developer: "code",
  data: "database",
  text: "type",
  image: "image",
  security: "shield-check",
  files: "layers",
  math: "sliders",
  "color-design": "palette",
  "qr-barcode": "grid",
  education: "graduation-cap",
  everyday: "compass",
  pdf: "file-text",
  audio: "music",
  video: "film",
  accessibility: "users",
};

export function toolsSiteCategoryIcon(slug: string): IconName {
  return categoryIcons[slug] ?? "sliders";
}

function ProcessingBadge({ processing }: { processing: ToolsSiteTool["processing"] }) {
  if (processing === "local")
    return (
      <Badge tone="success" icon="lock">
        Runs in your browser
      </Badge>
    );
  if (processing === "network")
    return (
      <Badge tone="warning" icon="server">
        Sends data to a server
      </Badge>
    );
  return (
    <Badge tone="info" icon="external-link">
      External service
    </Badge>
  );
}

export function ToolsSiteCard({ tool, categoryName }: { tool: ToolsSiteTool; categoryName?: string }) {
  return (
    <Card as="article" interactive className="flex h-full w-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[0.9375rem] leading-snug font-semibold">
          <a href={tool.url} className={cn("rounded", stretchedLink)}>
            {tool.name}
            <span className="sr-only"> (on Everything.Free Tools)</span>
          </a>
        </h3>
        <Icon name="arrow-up-right" size={16} className="mt-0.5 shrink-0 text-fg-subtle" />
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{tool.description}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
        <ProcessingBadge processing={tool.processing} />
        {categoryName ? <span className="text-xs text-fg-subtle">{categoryName}</span> : null}
      </div>
    </Card>
  );
}

/** A compact, linked list of one category's tools. */
export function ToolsSiteCategoryList({
  category,
  tools,
  limit = 6,
}: {
  category: ToolsSiteCategory;
  tools: ToolsSiteTool[];
  limit?: number;
}) {
  const shown = tools.slice(0, limit);
  return (
    <Card as="article" className="flex h-full w-full flex-col">
      <div className="flex items-start gap-3 border-b border-border p-4">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-fg-muted"
        >
          <Icon name={toolsSiteCategoryIcon(category.slug)} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold">
            <a href={category.url} className="rounded hover:underline hover:underline-offset-2">
              {category.name}
              <span className="sr-only"> tools (on Everything.Free Tools)</span>
            </a>
          </h3>
          <p className="text-sm text-fg-muted">{category.tagline}</p>
        </div>
        <span className="text-xs text-fg-subtle tabular-nums">
          {category.toolCount}
          <span className="sr-only"> tools</span>
        </span>
      </div>
      <ul className="flex-1 list-none space-y-0.5 p-2">
        {shown.map((tool) => (
          <li key={tool.slug}>
            <a
              href={tool.url}
              className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface-raised hover:text-fg"
            >
              <span className="truncate">{tool.name}</span>
              <Icon name="arrow-up-right" size={14} className="shrink-0 text-fg-subtle" />
            </a>
          </li>
        ))}
      </ul>
      {category.toolCount > shown.length ? (
        <a
          href={category.url}
          className="border-t border-border px-4 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-raised hover:text-fg"
        >
          All {category.toolCount} {category.name.toLowerCase()} tools
        </a>
      ) : null}
    </Card>
  );
}
