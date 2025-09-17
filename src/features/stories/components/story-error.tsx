'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { memo } from 'react'
import { Button } from '@/shared/ui/shadcn/button'

interface StoryErrorProps {
  error: Error
  onRetry: () => void
}

export const StoryError = memo(({ error, onRetry }: StoryErrorProps) => {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-800">
              스토리를 불러오는데 실패했습니다: {error.message}
            </span>
          </div>
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            다시 시도
          </Button>
        </div>
      </div>
    </div>
  )
})
