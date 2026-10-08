"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import { PROMPT_SOURCES_REGISTRY } from "@/data/ai-prompts/sources-registry";
import { cn } from "@/lib/utils/cn";

interface SourceExplorerCardsProps {
  selectedSource: string;
  onSelectSource: (sourceId: string) => void;
  className?: string;
}

export function SourceExplorerCards({
  selectedSource,
  onSelectSource,
  className,
}: SourceExplorerCardsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
            Aggregated Open Sources
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Everything.Free indexes public, open-source datasets with explicit attribution and links back to creators.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROMPT_SOURCES_REGISTRY.map((src) => {
          const isSelected = selectedSource === src.id;
          const isReferenceOnly = src.integrationMode === "reference_only";

          return (
            <Card
              key={src.id}
              as="div"
              interactive={!isReferenceOnly}
              className={cn(
                "p-4 flex flex-col justify-between border bg-surface transition-colors",
                isSelected
                  ? "border-border-strong bg-surface-raised ring-1 ring-border-strong shadow-xs"
                  : "border-border",
                isReferenceOnly && "opacity-80 bg-surface/85",
              )}
            >
              <div className="flex flex-col gap-2.5">
                {/* Header: Name & Mode Badge */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-fg">
                      {src.name}
                    </span>
                    <span className="text-[11px] font-mono text-fg-subtle">
                      {src.totalSourceRecords}
                    </span>
                  </div>

                  <Badge
                    size="sm"
                    tone={isReferenceOnly ? "warning" : "neutral"}
                  >
                    {isReferenceOnly ? "Reference Only" : "Active Feed"}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-fg-muted leading-relaxed line-clamp-3">
                  {src.description}
                </p>

                {/* License Tag */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-fg-subtle">
                  <span>License:</span>
                  <span className="font-mono text-fg truncate max-w-[130px]" title={src.license}>
                    {src.license}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 mt-3 border-t border-border/70 flex items-center justify-between gap-2">
                {!isReferenceOnly ? (
                  <button
                    type="button"
                    onClick={() => onSelectSource(isSelected ? "all" : src.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-xs text-xs font-medium border transition-colors",
                      isSelected
                        ? "bg-fg text-bg border-fg"
                        : "bg-surface-raised border-border text-fg hover:bg-surface-hover",
                    )}
                  >
                    {isSelected ? "Active Filter" : "Explore Prompts"}
                  </button>
                ) : (
                  <span className="text-[11px] text-fg-subtle italic">
                    License unverified
                  </span>
                )}

                <a
                  href={src.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit official ${src.name} website`}
                  className="inline-flex size-6 items-center justify-center rounded-xs text-fg-subtle hover:text-fg hover:bg-surface-hover transition-colors"
                >
                  <Icon name="external-link" size={13} />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
