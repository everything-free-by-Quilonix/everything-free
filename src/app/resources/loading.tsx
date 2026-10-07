import { Container } from "@/components/ui/layout";
import { ResourceGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <div className="pb-16">
      {/* Page Header Skeleton */}
      <div className="border-b border-border/60 bg-bg py-8 sm:py-12">
        <Container>
          <div className="space-y-3">
            <Skeleton className="h-5 w-24 rounded-xs" />
            <Skeleton className="h-9 w-64 sm:h-10 sm:w-80 rounded-md" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>

          {/* Filter Pills Skeleton */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-8 w-24 rounded-sm" />
            <Skeleton className="h-8 w-28 rounded-sm" />
            <Skeleton className="h-8 w-32 rounded-sm" />
            <Skeleton className="h-8 w-20 rounded-sm" />
            <Skeleton className="h-8 w-24 rounded-sm" />
          </div>
        </Container>
      </div>

      {/* Main Content Area */}
      <Container className="pt-8">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        {/* 9 Card Skeletons in responsive grid */}
        <ResourceGridSkeleton count={9} />
      </Container>
    </div>
  );
}
