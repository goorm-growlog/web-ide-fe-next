'use client'

import useSWRInfinite from 'swr/infinite'
import { storyApi } from '@/entities/story/api/story-api'
import type { StoriesResponse, Story } from '@/entities/story/model/types'
import { swrConfig } from '@/shared/config/swr'
import { logger } from '@/shared/lib/logger'

const STORIES_PER_PAGE = 10

export const useStoriesInfinite = (): {
  stories: Story[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  loadMore: () => void
  refresh: () => void
  mutate: () => void
} => {
  // SWR 무한 스크롤 키 생성 함수
  const getKey = (
    pageIndex: number,
    previousPageData: StoriesResponse | null,
  ) => {
    // 마지막 페이지에 도달했으면 null 반환 (더 이상 로드하지 않음)
    if (previousPageData && !previousPageData.hasNext) return null

    // API 엔드포인트 반환
    return `stories?page=${pageIndex}&size=${STORIES_PER_PAGE}`
  }

  // 커스텀 fetcher 함수
  const fetcher = async (url: string): Promise<StoriesResponse> => {
    const urlObj = new URL(url, 'http://localhost')
    const page = parseInt(urlObj.searchParams.get('page') || '0', 10)
    const size = parseInt(urlObj.searchParams.get('size') || '10', 10)

    logger.debug('Fetching stories:', { page, size })
    return await storyApi.getStories(page, size)
  }

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<StoriesResponse>(getKey, fetcher, {
      ...swrConfig,
      // 무한 스크롤에 최적화된 설정
      revalidateFirstPage: false, // 첫 페이지 재검증 방지
      revalidateAll: false, // 모든 페이지 재검증 방지
    })

  // 모든 페이지의 스토리를 하나의 배열로 합치기
  const stories = data
    ? data.flatMap((page: StoriesResponse) => page.content)
    : []

  // 더 불러올 데이터가 있는지 확인
  const hasMore: boolean = data
    ? (data[data.length - 1]?.hasNext ?? false)
    : true

  // 로딩 상태
  const isLoadingMore = isValidating && data && data.length > 0

  // 다음 페이지 로드
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      logger.debug('Loading more stories:', { currentSize: size })
      setSize(size + 1)
    }
  }

  // 새로고침
  const refresh = () => {
    logger.debug('Refreshing stories')
    mutate()
  }

  return {
    stories,
    isLoading: Boolean(isLoading && !data), // 초기 로딩만
    isLoadingMore: Boolean(isLoadingMore),
    hasMore: Boolean(hasMore),
    error,
    loadMore,
    refresh,
    mutate,
  }
}
