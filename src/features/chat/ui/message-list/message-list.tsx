'use client'

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import type { ChatMessage } from '@/features/chat/types/client'
import { MessageItem } from '@/features/chat/ui/message-list/message-item'

interface MessageListProps {
  messages: ChatMessage[]
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  currentUserId?: string // Storybook용 옵셔널 prop
}

/**
 * 채팅 메시지 목록을 렌더링하는 컴포넌트
 *
 * 메시지가 없을 경우 빈 상태를 표시하고, 메시지가 있을 경우
 * 각 메시지를 개별 아이템으로 렌더링합니다.
 *
 * @param messages - 렌더링할 채팅 메시지 배열
 */
const MessageList = memo(
  ({
    messages,
    isLoadingMore,
    hasMore,
    onLoadMore,
    currentUserId,
  }: MessageListProps) => {
    const infiniteRef = useRef<HTMLLIElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const isInitialMount = useRef(true)
    const previousMessagesLength = useRef(0)

    const messageKeys = useMemo(
      () =>
        messages.map(
          (message, index) => `${message.timestamp.getTime()}-${index}`,
        ),
      [messages],
    )

    // 하단으로 스크롤
    const scrollToBottom = useCallback((smooth: boolean = true) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        })
      }
    }, [])

    // 최초 마운트 시에만 스크롤을 최하단으로 이동
    useEffect(() => {
      if (
        isInitialMount.current &&
        messages.length > 0 &&
        previousMessagesLength.current === 0
      ) {
        // 최초 마운트 시에만 스크롤을 최하단으로 이동
        scrollToBottom(false)
        isInitialMount.current = false
      }
      previousMessagesLength.current = messages.length
    }, [messages.length, scrollToBottom])

    // IntersectionObserver를 사용한 무한 스크롤
    useEffect(() => {
      const observer = new IntersectionObserver(
        entries => {
          const entry = entries[0]
          if (
            entry?.isIntersecting &&
            hasMore &&
            !isLoadingMore &&
            onLoadMore
          ) {
            console.log('🚀 IntersectionObserver: Calling onLoadMore!')
            onLoadMore()
          }
        },
        {
          rootMargin: '0px 0px 100px 0px',
          threshold: 0.1,
        },
      )

      if (infiniteRef.current) {
        observer.observe(infiniteRef.current)
      }

      return () => {
        if (infiniteRef.current) {
          observer.unobserve(infiniteRef.current)
        }
      }
    }, [hasMore, isLoadingMore, onLoadMore])

    return (
      <div ref={scrollContainerRef} className="h-full overflow-y-auto">
        <ul className="m-0 p-0">
          {/* 무한 스크롤 트리거 (상단) */}
          <li
            ref={infiniteRef}
            className="flex items-center justify-center py-4 text-muted-foreground text-sm"
          >
            {hasMore ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                더 많은 메시지 로딩 중...
              </div>
            ) : (
              <div className="text-xs">모든 메시지를 불러왔습니다</div>
            )}
          </li>

          {messages.map((message, index) => (
            <MessageItem
              key={messageKeys[index]}
              message={message}
              index={index}
              messages={messages}
              currentUserId={currentUserId}
            />
          ))}

          {/* 마지막 메시지 하단 여백을 위한 빈 요소 */}
          <li className="h-4" aria-hidden="true" />
        </ul>
      </div>
    )
  },
)

MessageList.displayName = 'MessageList'

export default MessageList
