'use client'

import { RefreshCw } from 'lucide-react'
import { StoryList } from '@/features/stories/components/story-list'
import { useStoriesInfinite } from '@/features/stories/hooks/use-stories-infinite'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'

export const StoriesPage = () => {
  const {
    stories,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  } = useStoriesInfinite()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
          <div>
            <h1 className="font-bold text-2xl text-foreground">스토리</h1>
            <p className="text-muted-foreground">SWR 기반 무한 스크롤 테스트</p>
          </div>
          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', isLoading ? 'animate-spin' : '')}
            />
            새로고침
          </Button>
        </div>
      </header>

      <main className="py-8">
        <StoryList
          stories={stories}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          onLoadMore={loadMore}
          onRetry={refresh}
        />
      </main>
    </div>
  )
}
