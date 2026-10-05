import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholder: a static block that mirrors the final layout.
 * Conforms to design guardrails (uses rounded-xs/sm, avoids disallowed animation classes).
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-xs bg-surface-raised", className)} aria-hidden="true" />;
}

export function ResourceCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-rule bg-surface p-4"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-xs" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded-xs" />
              <Skeleton className="h-3 w-16 rounded-xs" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-xs" />
        </div>

        <div className="mt-3 space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded-xs" />
          <Skeleton className="h-3.5 w-4/5 rounded-xs" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-rule pt-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-12 rounded-xs" />
          <Skeleton className="h-4 w-12 rounded-xs" />
        </div>
        <Skeleton className="h-4 w-16 rounded-xs" />
      </div>
    </div>
  );
}

export function ResourceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-busy="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <p role="status" className="sr-only">
        Loading resources…
      </p>
      {Array.from({ length: count }, (_, index) => (
        <ResourceCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div aria-hidden="true" className="border-b border-rule bg-surface py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-24 rounded-xs" />
        <Skeleton className="mt-3 h-8 w-64 sm:h-10 sm:w-80 rounded-sm" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl rounded-xs" />
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Skeleton className="h-8 w-24 rounded-xs" />
          <Skeleton className="h-8 w-28 rounded-xs" />
        </div>
      </div>
    </div>
  );
}

export function ResourceDetailSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p role="status" className="sr-only">
        Loading resource details…
      </p>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-xs" />
        <Skeleton className="h-4 w-24 rounded-xs" />
      </div>

      <div className="mt-6 rounded-sm border border-rule bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="size-16 shrink-0 rounded-xs" />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-7 w-48 rounded-xs" />
                <Skeleton className="h-5 w-20 rounded-xs" />
              </div>
              <Skeleton className="h-4 w-72 rounded-xs" />
            </div>
          </div>
          <Skeleton className="h-10 w-full sm:w-36 rounded-xs" />
        </div>
      </div>
    </div>
  );
}

export function StudentCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col justify-between overflow-hidden rounded-sm border border-rule bg-surface p-5"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="size-10 shrink-0 rounded-xs" />
          <Skeleton className="h-5 w-20 rounded-xs" />
        </div>
        <Skeleton className="mt-3 h-5 w-36 rounded-xs" />
        <Skeleton className="mt-2 h-3.5 w-full rounded-xs" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-rule pt-3">
        <Skeleton className="h-4 w-24 rounded-xs" />
        <Skeleton className="h-7 w-20 rounded-xs" />
      </div>
    </div>
  );
}

export function BrandBufferScreen({ message = "Loading Everything.Free..." }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative flex size-14 items-center justify-center rounded-sm border border-rule bg-surface">
        <span className="text-xl font-bold tracking-tight text-fg">
          Everything.Free
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-fg-muted">{message}</p>
    </div>
  );
}
