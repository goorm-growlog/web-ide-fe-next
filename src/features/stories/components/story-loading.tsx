'use client'

import { memo } from 'react'

export const StoryLoading = memo(() => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span className="text-muted-foreground">
          더 많은 스토리를 불러오는 중...
        </span>
      </div>
    </div>
  )
})
