import { Container } from "@/components/ui/layout";
import { ResourceGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="pb-16">
      {/* Category Header Skeleton */}
      <div className="border-b border-border/60 bg-bg py-8 sm:py-12">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-60 sm:h-10 sm:w-80 rounded-xl" />
              <Skeleton className="h-4 w-full max-w-xl rounded-md" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </Container>
      </div>

      {/* Grid Content */}
      <Container className="pt-8">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>

        <ResourceGridSkeleton count={6} />
      </Container>
    </div>
  );
}
