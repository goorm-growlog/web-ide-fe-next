'use client'

import { memo, useMemo } from 'react'
import type { ChatMessage } from '@/features/chat/types/client'
import { MessageItem } from '@/features/chat/ui/message-list/message-item'

interface MessageListProps {
  messages: ChatMessage[]
  isLoadingMore?: boolean
}

/**
 * 채팅 메시지 목록을 렌더링하는 컴포넌트
 *
 * 메시지가 없을 경우 빈 상태를 표시하고, 메시지가 있을 경우
 * 각 메시지를 개별 아이템으로 렌더링합니다.
 *
 * @param messages - 렌더링할 채팅 메시지 배열
 */
const MessageList = memo(({ messages, isLoadingMore }: MessageListProps) => {
  const messageKeys = useMemo(
    () =>
      messages.map(
        (message, index) => `${message.timestamp.getTime()}-${index}`,
      ),
    [messages],
  )

  return (
    <ul className="m-0 h-full overflow-y-auto p-0">
      {isLoadingMore && (
        <li className="flex items-center justify-center py-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            더 많은 메시지 로딩 중...
          </div>
        </li>
      )}

      {messages.map((message, index) => (
        <MessageItem
          key={messageKeys[index]}
          message={message}
          index={index}
          messages={messages}
        />
      ))}

      {/* 마지막 메시지 하단 여백을 위한 빈 요소 */}
      <li className="h-4" aria-hidden="true" />
    </ul>
  )
})

MessageList.displayName = 'MessageList'

export default MessageList
