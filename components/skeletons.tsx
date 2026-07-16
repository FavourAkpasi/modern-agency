import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Every loading state in the app lives here, one export per consumer, each
// mirroring the layout of the real content so nothing shifts on swap.

// Mirrors the bento spans in `sections/projects1.tsx`.
const bentoSpans = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "sm:row-span-2",
  "sm:col-span-2",
  "",
]

// `count` keeps the placeholder tile/row count in step with the real data, so
// the layout doesn't jump when the skeleton swaps out.
type ProjectsSkeletonProps = {
  count?: number
}

export const ProjectsBentoSkeleton = ({ count = 6 }: ProjectsSkeletonProps) => (
  <div className="grid grid-flow-dense auto-rows-[170px] grid-cols-2 gap-4 sm:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("rounded-2xl", bentoSpans[i % bentoSpans.length])}
      />
    ))}
  </div>
)

export const ProjectsListSkeleton = ({ count = 6 }: ProjectsSkeletonProps) => (
  <div className="grid gap-12 md:grid-cols-2">
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 border-b border-border py-6"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-8 w-40 md:h-10 md:w-64" />
          </div>
          <Skeleton className="hidden h-3 w-24 sm:block" />
        </div>
      ))}
    </div>
    <div className="hidden md:block">
      <Skeleton className="aspect-4/5 w-full rounded-3xl" />
    </div>
  </div>
)

export const ProjectDrawerSkeleton = () => (
  <div>
    <Skeleton className="h-[40vh] w-full rounded-none" />
    <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 border-t border-border pt-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  </div>
)
