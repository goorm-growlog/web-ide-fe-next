'use client'

import { memo, useMemo } from 'react'
import { parseChatMessages } from '@/features/chat/lib/message-parser'
import { formatDate } from '@/shared/lib/date-utils'
import {
  createDateHeaderVisibilityChecker,
  createMessageKeyGenerator,
} from '../../lib/chat-message-utils'
import type { ParsedChatMessage } from '../../model/types'
import { ChatMessage } from '../chat-message/chat-message'
import { DateHeader } from './date-header'
import { EmptyState } from './empty-state'
import { SystemMessage } from './system-message'

interface ChatMessageListProps {
  messages: ParsedChatMessage[]
  currentUserId: number
}

// 메시지 타입을 결정하는 헬퍼 함수
const getMessageType = (message: ParsedChatMessage) => {
  const isSystemMessage =
    message.messageType === 'ENTER' || message.messageType === 'LEAVE'
  return { isSystemMessage }
}

/**
 * 시스템 메시지를 렌더링하는 컴포넌트
 */
const SystemMessageItem = ({ message }: { message: ParsedChatMessage }) => (
  <SystemMessage message={message} />
)

/**
 * 일반 채팅 메시지를 렌더링하는 컴포넌트
 */
const ChatMessageItem = ({
  message,
  isOwnMessage,
}: {
  message: ParsedChatMessage
  isOwnMessage: boolean
}) => <ChatMessage message={message} isOwnMessage={isOwnMessage} />

/**
 * 개별 메시지 아이템을 렌더링하는 컴포넌트
 */
const MessageItem = ({
  message,
  index,
  dateHeaderChecker,
  keyGenerator,
  currentUserId,
}: {
  message: ParsedChatMessage
  index: number
  dateHeaderChecker: ReturnType<typeof createDateHeaderVisibilityChecker>
  keyGenerator: ReturnType<typeof createMessageKeyGenerator>
  currentUserId: number
}) => {
  const showDateHeader = dateHeaderChecker(index)
  const messageKey = keyGenerator(message, index)
  const isOwnMessage = currentUserId === message.userId
  const { isSystemMessage } = getMessageType(message)

  return (
    <div key={messageKey}>
      {showDateHeader && <DateHeader date={formatDate(message.sentAt)} />}

      {isSystemMessage ? (
        <SystemMessageItem message={message} />
      ) : (
        <ChatMessageItem message={message} isOwnMessage={isOwnMessage} />
      )}
    </div>
  )
}

export const ChatMessageList = memo(
  ({ messages, currentUserId }: ChatMessageListProps) => {
    const parsedMessages = useMemo(
      () => parseChatMessages(messages),
      [messages],
    )

    if (parsedMessages.length === 0) {
      return <EmptyState />
    }

    // 헬퍼 함수들을 한 번만 생성
    const dateHeaderChecker = createDateHeaderVisibilityChecker(parsedMessages)
    const keyGenerator = createMessageKeyGenerator()

    return (
      <>
        {parsedMessages.map((message, index) => (
          <MessageItem
            key={`${message.userId}-${message.sentAt}-${index}`}
            message={message}
            index={index}
            dateHeaderChecker={dateHeaderChecker}
            keyGenerator={keyGenerator}
            currentUserId={currentUserId}
          />
        ))}
      </>
    )
  },
)
