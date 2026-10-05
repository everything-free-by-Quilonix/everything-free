import { cn } from "@/lib/utils/cn";

/**
 * Luxury Shimmer Skeleton base component.
 *
 * Implements a light-sweep shimmer wave across a elevated surface token.
 * Suppressed under prefers-reduced-motion in globals.css.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-raised/80 dark:bg-surface-raised/40",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/15 dark:after:via-white/5 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Skeleton placeholder matching the exact footprint of the compact Resource Card.
 */
export function ResourceCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-surface/75 p-4.5 backdrop-blur-md shadow-xs"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Squircle logo */}
            <Skeleton className="size-9 shrink-0 rounded-[10px]" />
            <div className="space-y-1.5">
              {/* Resource Title */}
              <Skeleton className="h-4.5 w-28 rounded-md" />
              {/* Category pill */}
              <Skeleton className="h-3 w-16 rounded-sm" />
            </div>
          </div>
          {/* Free Status Badge */}
          <Skeleton className="h-5.5 w-18 rounded-full" />
        </div>

        {/* Description Lines */}
        <div className="mt-3.5 space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded-sm" />
          <Skeleton className="h-3.5 w-4/5 rounded-sm" />
        </div>
      </div>

      {/* Footer Meta Row */}
      <div className="mt-4.5 flex items-center justify-between border-t border-border/40 pt-3">
        {/* Features / Tags */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
        {/* Verified Indicator */}
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Grid of Resource Card Skeletons.
 */
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

/**
 * Skeleton placeholder for page headers.
 */
export function PageHeaderSkeleton() {
  return (
    <div aria-hidden="true" className="border-b border-border/60 bg-bg py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="mt-3 h-8 w-64 sm:h-10 sm:w-80 rounded-xl" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl rounded-md" />
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for Resource Detail Pages (/resources/[slug]).
 */
export function ResourceDetailSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <p role="status" className="sr-only">
        Loading resource details…
      </p>

      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>

      {/* Main Hero Card Lockup */}
      <div className="mt-6 rounded-3xl border border-border/60 bg-surface/80 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="size-16 shrink-0 rounded-2xl sm:size-20" />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-7 w-48 rounded-lg sm:h-8" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-72 rounded-md" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
            </div>
          </div>
          {/* Claim / Visit Button */}
          <Skeleton className="h-10 w-full sm:w-36 rounded-full" />
        </div>

        {/* Fact Grid Tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-surface-raised/40 p-3.5">
              <Skeleton className="h-3 w-16 rounded-sm" />
              <Skeleton className="mt-2 h-5 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Content & Evidence Sections */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Why Listed Section */}
          <div className="rounded-2xl border border-border/60 bg-surface/60 p-6">
            <Skeleton className="h-5 w-32 rounded-md" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-5/6 rounded-sm" />
              <Skeleton className="h-4 w-4/6 rounded-sm" />
            </div>
          </div>
          {/* Verification Checks Evidence */}
          <div className="rounded-2xl border border-border/60 bg-surface/60 p-6">
            <Skeleton className="h-5 w-40 rounded-md" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <Skeleton className="h-4 w-36 rounded-sm" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-surface/60 p-6">
            <Skeleton className="h-5 w-28 rounded-md" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for Student Perks Cards.
 */
export function StudentCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-surface/75 p-5 backdrop-blur-md shadow-xs"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="size-11 shrink-0 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-3.5 h-5 w-36 rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-full rounded-sm" />
        <Skeleton className="mt-1.5 h-3.5 w-4/5 rounded-sm" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3.5">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Centered Brand Buffer Spinner Screen.
 *
 * Used for full-screen loading buffers with the signature Everything.Free golden square period.
 */
export function BrandBufferScreen({ message = "Loading Everything.Free..." }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative flex size-16 items-center justify-center">
        {/* Pulsing halo */}
        <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20 duration-1000" />
        {/* Outer squircle border */}
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-surface shadow-xl">
          <span className="font-display text-2xl font-black tracking-tighter text-fg">
            e<span className="inline-block size-2 rounded-[2px] bg-primary ml-0.5" />
          </span>
        </div>
      </div>

      <p className="mt-5 font-display text-sm font-semibold tracking-tight text-fg">{message}</p>
      <div className="mt-3 h-1 w-28 overflow-hidden rounded-full bg-border">
        <div className="animate-buffer h-full w-1/2 rounded-full bg-primary" />
      </div>
    </div>
  );
}
