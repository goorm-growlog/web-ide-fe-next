'use client'

import { memo } from 'react'

export const MessageLoading = memo(() => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span className="text-muted-foreground text-sm">
          메시지를 불러오는 중...
        </span>
      </div>
    </div>
  )
})
