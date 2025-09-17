'use client'

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import type { ChatMessage } from '@/entities/chat/model/types'
import { MessageItem } from '@/entities/chat/ui/message-item'
import { MessageError } from './message-error'
import { MessageLoading } from './message-loading'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  currentUserName: string
  onLoadMore: () => void
  onRetry: () => void
}

/**
 * 채팅 메시지 목록을 렌더링하는 컴포넌트
 *
 * 메시지가 없을 경우 빈 상태를 표시하고, 메시지가 있을 경우
 * 각 메시지를 개별 아이템으로 렌더링합니다.
 *
 * @param messages - 렌더링할 채팅 메시지 배열
 */
export const MessageList = memo(
  ({
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    currentUserName,
    onLoadMore,
    onRetry,
  }: MessageListProps) => {
    const infiniteRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const isInitialMount = useRef(true)
    const previousMessagesLength = useRef(0)

    const messageKeys = useMemo(
      () => messages.map((message, index) => `${message.timestamp}-${index}`),
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

    // 초기 로딩
    if (isLoading) {
      return <MessageLoading />
    }

    // 에러 상태
    if (error) {
      return <MessageError error={error} onRetry={onRetry} />
    }

    // 빈 상태
    if (!isLoading && messages.length === 0) {
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>아직 메시지가 없습니다.</p>
        </div>
      )
    }

    return (
      <div ref={scrollContainerRef} className="h-full overflow-y-auto">
        <div className="m-0 p-0">
          {/* 무한 스크롤 트리거 (상단) */}
          <div
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
          </div>

          {messages.map((message, index) => {
            const isCurrentUser = message.sender.name === currentUserName
            const prevMessage = messages[index - 1]
            const showAvatar =
              !prevMessage || prevMessage.sender.id !== message.sender.id

            return (
              <MessageItem
                key={messageKeys[index]}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
              />
            )
          })}

          {/* 마지막 메시지 하단 여백을 위한 빈 요소 */}
          <div className="h-4" aria-hidden="true" />
        </div>
      </div>
    )
  },
)
