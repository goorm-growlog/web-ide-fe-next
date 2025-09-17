'use client'

import { useCallback, useEffect, useRef } from 'react'

interface UseAutoScrollOptions {
  /**
   * 자동 스크롤이 활성화될 조건
   * @param isUserAtBottom - 사용자가 스크롤 하단에 있는지 여부
   * @param isUserMessage - 사용자가 보낸 메시지인지 여부
   * @param isOtherUserMessage - 다른 사용자가 보낸 메시지인지 여부
   */
  shouldAutoScroll: (
    isUserAtBottom: boolean,
    isUserMessage: boolean,
    isOtherUserMessage: boolean,
  ) => boolean
  /**
   * 스크롤 위치 복원을 위한 콜백
   */
  onScrollPositionRestore?: (scrollTop: number) => void
}

export const useAutoScroll = (options: UseAutoScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef<number>(0)
  const isUserScrollingRef = useRef<boolean>(false)
  const lastMessageCountRef = useRef<number>(0)

  // 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    if (containerRef.current) {
      scrollPositionRef.current = containerRef.current.scrollTop
    }
  }, [])

  // 스크롤 위치 복원
  const restoreScrollPosition = useCallback(() => {
    if (containerRef.current && scrollPositionRef.current > 0) {
      containerRef.current.scrollTop = scrollPositionRef.current
      options.onScrollPositionRestore?.(scrollPositionRef.current)
    }
  }, [options])

  // 하단으로 스크롤
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      })
    }
  }, [])

  // 사용자가 하단에 있는지 확인
  const isUserAtBottom = useCallback(() => {
    if (!containerRef.current) return false

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const threshold = 100 // 100px 여유
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const isAtBottom = isUserAtBottom()
    isUserScrollingRef.current = !isAtBottom

    // 스크롤 위치 저장
    saveScrollPosition()
  }, [isUserAtBottom, saveScrollPosition])

  // 스크롤 로직 분리
  const handleScrollLogic = useCallback(
    (messageCount: number, isUserMessage: boolean, isAtBottom: boolean) => {
      if (
        lastMessageCountRef.current > 0 &&
        messageCount > lastMessageCountRef.current
      ) {
        // 새 메시지가 추가된 경우
        if (isUserMessage) {
          // 사용자 메시지: 항상 하단으로 스크롤
          scrollToBottom(true)
        } else if (isAtBottom) {
          // 다른 사용자 메시지: 사용자가 하단에 있을 때만 스크롤
          scrollToBottom(true)
        }
      } else if (lastMessageCountRef.current > messageCount) {
        // 이전 메시지가 로드된 경우 (무한 스크롤)
        restoreScrollPosition()
      }
    },
    [scrollToBottom, restoreScrollPosition],
  )

  // 메시지 변경 시 자동 스크롤 처리
  const handleMessageChange = useCallback(
    (
      messageCount: number,
      isUserMessage: boolean,
      isOtherUserMessage: boolean,
      isLoadingMore: boolean = false,
    ) => {
      if (!containerRef.current) return

      const isAtBottom = isUserAtBottom()
      const shouldScroll = options.shouldAutoScroll(
        isAtBottom,
        isUserMessage,
        isOtherUserMessage,
      )

      console.log('🔄 useAutoScroll: handleMessageChange called', {
        messageCount,
        lastMessageCount: lastMessageCountRef.current,
        isAtBottom,
        isUserMessage,
        isOtherUserMessage,
        isLoadingMore,
        shouldScroll,
        containerHeight: containerRef.current.scrollHeight,
        containerScrollTop: containerRef.current.scrollTop,
        containerClientHeight: containerRef.current.clientHeight,
      })

      // 무한 스크롤로 이전 메시지를 불러올 때는 스크롤 위치 복원
      if (isLoadingMore) {
        console.log(
          '🔄 useAutoScroll: Restoring scroll position for infinite scroll',
        )
        restoreScrollPosition()
      }
      // 새로운 메시지가 추가될 때만 자동 스크롤 수행
      else if (
        lastMessageCountRef.current > 0 &&
        messageCount > lastMessageCountRef.current
      ) {
        console.log(
          '📜 useAutoScroll: New messages added, checking scroll logic',
        )
        if (shouldScroll) {
          console.log(
            '📜 useAutoScroll: Executing scroll logic for new messages',
          )
          handleScrollLogic(messageCount, isUserMessage, isAtBottom)
        }
      }

      lastMessageCountRef.current = messageCount
    },
    [isUserAtBottom, options, handleScrollLogic, restoreScrollPosition],
  )

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    containerRef,
    scrollToBottom,
    isUserAtBottom,
    handleMessageChange,
    saveScrollPosition,
    restoreScrollPosition,
  }
}
