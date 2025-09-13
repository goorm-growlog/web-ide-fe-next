'use client'

import { Skeleton } from '@/shared/ui/shadcn/skeleton'

/**
 * 파일 트리용 스켈레톤 아이템
 * 파일과 폴더의 구조를 미리 보여줌
 */
export const FileTreeSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {/* 폴더 아이템들 */}
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-28 bg-muted-foreground/20" />
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-24 bg-muted-foreground/20" />
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-32 bg-muted-foreground/20" />
      </div>

      {/* 파일 아이템들 */}
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-36 bg-muted-foreground/20" />
      </div>
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-32 bg-muted-foreground/20" />
      </div>
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-40 bg-muted-foreground/20" />
      </div>
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-28 bg-muted-foreground/20" />
      </div>
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-44 bg-muted-foreground/20" />
      </div>

      {/* 중첩된 폴더 */}
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-24 bg-muted-foreground/20" />
      </div>
      <div className="ml-8 flex items-center space-x-3">
        <Skeleton className="h-5 w-5 bg-muted-foreground/20" />
        <Skeleton className="h-5 w-20 bg-muted-foreground/20" />
      </div>
    </div>
  )
}
