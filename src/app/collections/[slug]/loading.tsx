import { Container } from "@/components/ui/layout";
import { ResourceGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function CollectionDetailLoading() {
  return (
    <div className="pb-16">
      {/* Header Skeleton */}
      <div className="border-b border-border/60 bg-bg py-8 sm:py-12">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>

          <div className="mt-4 space-y-2">
            <Skeleton className="h-9 w-64 sm:h-10 sm:w-96 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        <Skeleton className="mb-8 h-16 w-full rounded-xl" />

        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>

        <ResourceGridSkeleton count={6} />
      </Container>
    </div>
  );
}
