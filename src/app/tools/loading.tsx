import { Container } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToolsLoading() {
  return (
    <div className="pb-16">
      {/* Page Header Skeleton */}
      <div className="border-b border-border/60 bg-bg py-8 sm:py-12">
        <Container>
          <div className="space-y-3">
            <Skeleton className="h-9 w-44 sm:h-10 sm:w-56 rounded-md" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
            <div className="flex items-center gap-3 pt-3">
              <Skeleton className="h-10 w-44 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>
        </Container>
      </div>

      <Container className="pt-10 space-y-12">
        {/* Featured Tools Grid Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-sm" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-md border border-border/60 bg-surface/75 p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-xs" />
                  </div>
                  <Skeleton className="mt-2.5 h-3.5 w-full rounded-sm" />
                  <Skeleton className="mt-1.5 h-3.5 w-4/5 rounded-sm" />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="size-4 rounded-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-sm" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-md border border-border/60 bg-surface/75 p-5 space-y-3">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-3.5 w-48 rounded-sm" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
