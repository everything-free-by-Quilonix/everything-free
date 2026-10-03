import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholder.
 *
 * The pulse animation is suppressed globally under `prefers-reduced-motion`
 * (see `globals.css`), which leaves a static block — still a useful signal that
 * content is coming, without the movement.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xs bg-surface-raised", className)} aria-hidden="true" />;
}

/**
 * Placeholder matching the resource card's shape.
 *
 * The wrapper carries `aria-busy` and a polite status message so a screen-reader
 * user is told the list is loading instead of hearing nothing.
 */
export function ResourceCardSkeleton() {
  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-10 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-4/5" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="mt-4 h-3 w-2/3" />
    </div>
  );
}

export function ResourceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <p role="status" className="sr-only">
        Loading resources…
      </p>
      {Array.from({ length: count }, (_, index) => (
        <ResourceCardSkeleton key={index} />
      ))}
    </div>
  );
}
