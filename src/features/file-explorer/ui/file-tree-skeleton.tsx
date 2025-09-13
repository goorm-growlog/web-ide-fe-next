'use client'

import { Skeleton } from '@/shared/ui/shadcn/skeleton'

/**
 * 파일 트리용 스켈레톤 아이템
 * 파일과 폴더의 구조를 미리 보여줌
 */
export const FileTreeSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {/* 폴더 아이템들 */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* 파일 아이템들 */}
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* 중첩된 폴더 */}
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="ml-6 flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}
