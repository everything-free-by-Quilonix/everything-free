import { Container } from "@/components/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <div className="pb-16">
      {/* Page Header Skeleton */}
      <div className="border-b border-border/60 bg-bg py-8 sm:py-12">
        <Container>
          <div className="space-y-3">
            <Skeleton className="h-9 w-44 sm:h-10 sm:w-56 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>
        </Container>
      </div>

      <Container className="pt-10">
        <Skeleton className="mb-8 h-14 w-full rounded-xl" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-surface/75 p-6 backdrop-blur-md"
            >
              <div>
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="mt-3 h-3.5 w-full rounded-sm" />
                <Skeleton className="mt-1.5 h-3.5 w-4/5 rounded-sm" />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
