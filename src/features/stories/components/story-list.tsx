'use client'

import { memo } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import type { Story } from '@/entities/story/model/types'
import { StoryItem } from '@/entities/story/ui/story-item'
import { StoryError } from './story-error'
import { StoryLoading } from './story-loading'

interface StoryListProps {
  stories: Story[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  onLoadMore: () => void
  onRetry: () => void
}

export const StoryList = memo(
  ({
    stories,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    onLoadMore,
    onRetry,
  }: StoryListProps) => {
    const [infiniteRef] = useInfiniteScroll({
      loading: isLoadingMore,
      hasNextPage: hasMore,
      onLoadMore,
      rootMargin: '0px 0px 400px 0px',
      delayInMs: 100,
    })

    // 초기 로딩
    if (isLoading) {
      return <StoryLoading />
    }

    // 에러 상태
    if (error) {
      return <StoryError error={error} onRetry={onRetry} />
    }

    // 빈 상태
    if (!isLoading && stories.length === 0) {
      return (
        <div className="mx-auto max-w-2xl p-4 text-center">
          <p className="text-muted-foreground">아직 스토리가 없습니다.</p>
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {stories.map(story => (
          <StoryItem key={story.id} story={story} />
        ))}

        {/* 무한 스크롤 트리거 */}
        {hasMore && (
          <div ref={infiniteRef}>
            <StoryLoading />
          </div>
        )}
      </div>
    )
  },
)
