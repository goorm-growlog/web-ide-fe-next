import { Skeleton } from '@/shared/ui/skeleton'

// 간단한 프로젝트 카드 스켈레톤
export function ProjectCardSkeleton({ height = '150px' }: { height?: string }) {
  return (
    <div
      className="w-full rounded-lg border border-border p-4"
      style={{ height }}
    >
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

// 간단한 전체 프로젝트 목록 스켈레톤
export function ProjectListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Host Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ProjectCardSkeleton height="150px" />
          <ProjectCardSkeleton height="150px" />
        </div>
      </div>

      {/* Invited Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ProjectCardSkeleton height="120px" />
          <ProjectCardSkeleton height="120px" />
          <ProjectCardSkeleton height="120px" />
        </div>
      </div>
    </div>
  )
}
