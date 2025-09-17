'use client'

import { memo, useEffect } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import type { ChatMessage } from '@/entities/chat/model/types'
import { MessageItem } from '@/entities/chat/ui/message-item'
import { useAutoScroll } from '@/features/chat/hooks/use-auto-scroll'
import { MessageError } from './message-error'
import { MessageLoading } from './message-loading'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: Error | null
  currentUserId: string
  onLoadMore: () => void
  onRetry: () => void
}

export const MessageList = memo(
  ({
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    currentUserId,
    onLoadMore,
    onRetry,
  }: MessageListProps) => {
    const [infiniteRef] = useInfiniteScroll({
      loading: isLoadingMore,
      hasNextPage: hasMore,
      onLoadMore,
      rootMargin: '0px 0px 400px 0px',
      delayInMs: 100,
    })

    // 자동 스크롤 훅
    const { containerRef, handleMessageChange } = useAutoScroll({
      shouldAutoScroll: (isUserAtBottom, isUserMessage, isOtherUserMessage) => {
        // 사용자 메시지이거나, 다른 사용자 메시지인데 사용자가 하단에 있을 때
        return isUserMessage || (isOtherUserMessage && isUserAtBottom)
      },
    })

    // 초기 로드 시 최하단으로 스크롤
    useEffect(() => {
      if (!isLoading && messages.length > 0 && containerRef.current) {
        // 초기 로드 시에는 강제로 최하단으로 스크롤
        const scrollToBottom = () => {
          if (containerRef.current) {
            // 여러 방법으로 스크롤 시도
            containerRef.current.scrollTop = containerRef.current.scrollHeight
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'auto',
            })
          }
        }

        // 즉시 스크롤
        scrollToBottom()

        // DOM 업데이트 후 다시 스크롤 (더 많은 시도)
        setTimeout(scrollToBottom, 10)
        setTimeout(scrollToBottom, 50)
        setTimeout(scrollToBottom, 100)
        setTimeout(scrollToBottom, 200)
        setTimeout(scrollToBottom, 500)
      }
    }, [isLoading, messages.length, containerRef]) // eslint-disable-line react-hooks/exhaustive-deps

    // 메시지 변경 시 자동 스크롤 처리
    useEffect(() => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        if (lastMessage) {
          const isUserMessage = lastMessage.sender.id === currentUserId
          const isOtherUserMessage = !isUserMessage

          handleMessageChange(
            messages.length,
            isUserMessage,
            isOtherUserMessage,
          )
        }
      }
    }, [messages, currentUserId, handleMessageChange])

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
      <div ref={containerRef} className="flex h-full flex-col overflow-y-auto">
        {/* 무한 스크롤 트리거 (상단) */}
        {hasMore && (
          <div ref={infiniteRef}>
            <MessageLoading />
          </div>
        )}

        {/* 메시지 목록 (최신 메시지가 아래) */}
        <div className="flex flex-1 flex-col">
          {messages.map((message, index) => {
            const isCurrentUser = message.sender.id === currentUserId
            const prevMessage = messages[index - 1]
            const showAvatar =
              !prevMessage || prevMessage.sender.id !== message.sender.id

            return (
              <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                showAvatar={showAvatar}
              />
            )
          })}
        </div>
      </div>
    )
  },
)
