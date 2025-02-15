import { Skeleton } from "@/components/ui/skeleton";

export default function ThemeContentSkeleton() {
  return (
    <div>
      <article className="container py-12 md:py-20">
        {/* Hero Section Skeleton */}
        <header className="mx-auto max-w-[80ch] space-y-8 text-center">
          {/* Image Skeleton */}
          <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-lg">
            <Skeleton className="absolute inset-0" />
          </div>
          <div className="space-y-6">
            <Skeleton className="mx-auto h-12 w-3/4" />
            <Skeleton className="mx-auto h-20 w-full" />
          </div>
        </header>

        {/* Quick Reference Grid Skeleton */}
        <section className="mx-auto mt-16 grid max-w-6xl gap-8 rounded-lg bg-muted p-8 md:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-8 w-40" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-40" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Skeleton */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-16">
          {/* Interpretation Section Skeleton */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-40 w-full" />
            </div>
          </section>

          {/* Detailed Analysis Skeleton */}
          <section className="max-w-[80ch] space-y-8 md:mx-auto">
            <Skeleton className="h-8 w-48" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </section>

          {/* Tips Section Skeleton */}
          <section className="mx-auto max-w-[80ch] space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="rounded-lg bg-muted p-6">
              <Skeleton className="h-32 w-full" />
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
