'use client'

import { memo, useMemo } from 'react'
import type { Message } from '@/features/chat/types/message-types'
import { EmptyMessageList } from './empty-message-list'
import { MessageItem } from './message-item'

interface MessageListProps {
  messages: Message[]
  currentUserId: number
}

/**
 * 채팅 메시지 목록을 렌더링하는 컴포넌트
 *
 * 메시지가 없을 경우 빈 상태를 표시하고, 메시지가 있을 경우
 * 각 메시지를 개별 아이템으로 렌더링합니다.
 *
 * @param messages - 렌더링할 채팅 메시지 배열
 * @param currentUserId - 현재 로그인한 사용자의 ID
 */
const MessageList = memo(({ messages, currentUserId }: MessageListProps) => {
  const messageKeys = useMemo(
    () =>
      messages.map(
        (message, index) => `${message.userId}-${message.sentAt}-${index}`,
      ),
    [messages],
  )

  if (messages.length === 0) return <EmptyMessageList />

  return (
    <ul className="m-0 list-none overflow-x-hidden p-0">
      <li className="sr-only" id="message-list-description">
        {messages.length}개의 메시지가 있습니다
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
    </ul>
  )
})

MessageList.displayName = 'MessageList'

export default MessageList
export { MessageList }
