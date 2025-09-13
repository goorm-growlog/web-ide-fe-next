'use client'

import { Skeleton } from '@/shared/ui/shadcn/skeleton'

/**
 * 채팅용 스켈레톤 아이템
 * 메시지 구조를 미리 보여줌
 */
export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 시스템 메시지 */}
      <div className="flex justify-center">
        <Skeleton className="h-7 w-36 bg-muted-foreground/20" />
      </div>

      {/* 사용자 메시지들 */}
      <div className="flex items-start space-x-4">
        <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-20 bg-muted-foreground/20" />
            <Skeleton className="h-4 w-16 bg-muted-foreground/20" />
          </div>
          <Skeleton className="h-5 w-56 bg-muted-foreground/20" />
          <Skeleton className="h-5 w-40 bg-muted-foreground/20" />
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-24 bg-muted-foreground/20" />
            <Skeleton className="h-4 w-16 bg-muted-foreground/20" />
          </div>
          <Skeleton className="h-5 w-48 bg-muted-foreground/20" />
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-18 bg-muted-foreground/20" />
            <Skeleton className="h-4 w-16 bg-muted-foreground/20" />
          </div>
          <Skeleton className="h-5 w-64 bg-muted-foreground/20" />
          <Skeleton className="h-5 w-32 bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  )
}
