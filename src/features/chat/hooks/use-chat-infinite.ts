'use client'

import useSWRInfinite from 'swr/infinite'
import { chatApi } from '@/entities/chat/api/chat-api'
import type { ChatResponse } from '@/entities/chat/model/types'
import { swrConfig } from '@/shared/config/swr'
import { logger } from '@/shared/lib/logger'

const MESSAGES_PER_PAGE = 20

export const useChatInfinite = (roomId: string) => {
  // SWR 무한 스크롤 키 생성 함수
  const getKey = (pageIndex: number, previousPageData: ChatResponse | null) => {
    // 마지막 페이지에 도달했으면 null 반환 (더 이상 로드하지 않음)
    if (previousPageData && !previousPageData.hasNext) return null

    // API 엔드포인트 반환
    return `chat/rooms/${roomId}/messages?page=${pageIndex}&size=${MESSAGES_PER_PAGE}`
  }

  // SWR fetcher 함수
  const fetcher = async (url: string) => {
    const urlObj = new URL(url, 'http://localhost')
    const page = parseInt(urlObj.searchParams.get('page') || '0', 10)
    const size = parseInt(urlObj.searchParams.get('size') || '20', 10)

    logger.debug('Fetching chat messages:', { roomId, page, size })
    return await chatApi.getMessages(roomId, page, size)
  }

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<ChatResponse>(getKey, fetcher, {
      ...swrConfig,
      // 무한 스크롤에 최적화된 설정
      revalidateFirstPage: false, // 첫 페이지 재검증 방지
      revalidateAll: false, // 모든 페이지 재검증 방지
    })

  // 모든 페이지의 메시지를 하나의 배열로 합치기 (최신 메시지가 맨 아래)
  const messages = data
    ? data.flatMap((page: ChatResponse) => page.content)
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
      logger.debug('Loading more messages:', { currentSize: size })
      setSize(size + 1)
    }
  }

  // 새로고침
  const refresh = () => {
    logger.debug('Refreshing messages')
    mutate()
  }

  // 새 메시지 전송
  const sendMessage = async (content: string) => {
    try {
      const newMessage = await chatApi.sendMessage(roomId, content)
      // 새 메시지 추가 후 데이터 재검증
      mutate()
      return newMessage
    } catch (error) {
      logger.error('Failed to send message:', error)
      throw error
    }
  }

  return {
    messages,
    isLoading: Boolean(isLoading && !data && messages.length === 0), // 초기 로딩만 (메시지가 없을 때)
    isLoadingMore: Boolean(isLoadingMore),
    hasMore: Boolean(hasMore),
    error,
    loadMore,
    refresh,
    sendMessage,
    mutate,
  }
}
