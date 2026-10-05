import { Container } from "@/components/ui/layout";
import { Skeleton, StudentCardSkeleton } from "@/components/ui/skeleton";

export default function StudentsLoading() {
  return (
    <div className="min-h-screen pb-20">
      {/* Student Hero Skeleton */}
      <div className="relative overflow-hidden border-b border-border/60 bg-bg py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill */}
            <div className="inline-flex justify-center">
              <Skeleton className="h-6 w-44 rounded-xs" />
            </div>

            {/* Title */}
            <Skeleton className="mx-auto mt-4 h-10 w-3/4 sm:h-12 rounded-md" />

            {/* Description */}
            <Skeleton className="mx-auto mt-3 h-4 w-5/6 rounded-md" />
            <Skeleton className="mx-auto mt-2 h-4 w-2/3 rounded-md" />

            {/* Search Box Skeleton */}
            <div className="mx-auto mt-8 max-w-xl">
              <Skeleton className="h-12 w-full rounded-md" />
            </div>

            {/* Category Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Skeleton className="h-8 w-24 rounded-sm" />
              <Skeleton className="h-8 w-28 rounded-sm" />
              <Skeleton className="h-8 w-32 rounded-sm" />
              <Skeleton className="h-8 w-24 rounded-sm" />
              <Skeleton className="h-8 w-20 rounded-sm" />
            </div>
          </div>
        </Container>
      </div>

      {/* Perks Grid Skeletons */}
      <Container className="pt-10">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, index) => (
            <StudentCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
