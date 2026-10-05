import { Container } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="pb-16">
      {/* Header Skeleton */}
      <div className="border-b border-border/60 bg-bg py-8 sm:py-12">
        <Container>
          <div className="space-y-3">
            <Skeleton className="h-9 w-48 sm:h-10 sm:w-64 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-lg rounded-md" />
          </div>
        </Container>
      </div>

      <Container className="pt-10">
        <div className="flex flex-col gap-12">
          {Array.from({ length: 3 }, (_, groupIdx) => (
            <div key={groupIdx} className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="h-6 w-40 rounded-md" />
              </div>
              <Skeleton className="h-4 w-72 rounded-sm" />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, cardIdx) => (
                  <div
                    key={cardIdx}
                    className="flex flex-col justify-between rounded-2xl border border-border/60 bg-surface/75 p-5 backdrop-blur-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-28 rounded-md" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                      </div>
                      <Skeleton className="mt-2.5 h-3.5 w-full rounded-sm" />
                      <Skeleton className="mt-1.5 h-3.5 w-3/4 rounded-sm" />
                    </div>
                    <div className="mt-4 flex gap-1.5 pt-2">
                      <Skeleton className="h-5 w-16 rounded-md" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
