import { useCallback, useEffect, useRef } from 'react'
import type { ChatMessage } from '@/features/chat/types/client'

/**
 * 단순화된 채팅 자동 스크롤 훅
 * 기본적인 스크롤 기능만 제공
 */
export const useAutoScroll = (
  messages: ChatMessage[],
  loadMore?: () => void,
  hasMore?: boolean,
  isLoadingMore?: boolean,
) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const getViewport = useCallback(() => {
    const scrollArea = scrollAreaRef.current
    return scrollArea?.querySelector(
      '[data-radix-scroll-area-viewport]',
    ) as HTMLElement | null
  }, [])

  const scrollToBottom = useCallback(() => {
    const viewport = getViewport()
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  }, [getViewport])

  // 무한 스크롤 처리
  useEffect(() => {
    const viewport = getViewport()
    if (!viewport || !loadMore || !hasMore || isLoadingMore) return

    const handleScroll = () => {
      const isAtTop = viewport.scrollTop <= 10
      if (isAtTop) {
        loadMore()
      }
    }

    viewport.addEventListener('scroll', handleScroll, { passive: true })
    return () => viewport.removeEventListener('scroll', handleScroll)
  }, [getViewport, loadMore, hasMore, isLoadingMore])

  // 새 메시지 자동 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages.length, scrollToBottom])

  return {
    scrollAreaRef,
  }
}
