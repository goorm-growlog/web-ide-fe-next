'use client'

import { memo } from 'react'
import {
  DateHeader,
  SystemMessage,
} from 'src/features/chat/ui/chat-message/message-layout'
import {
  generateMessageKey,
  isOwnMessage,
  isSystemMessage,
  shouldShowDateHeader,
} from '@/features/chat/lib/chat-message-utils'
import { formatDate } from '@/shared/lib/date-utils'
import type { ParsedChatMessage } from '../../model/types'
import { ChatMessage } from '../chat-message/chat-message'
import { NoMessages } from './no-messages'

interface ChatMessageListProps {
  messages: ParsedChatMessage[]
  currentUserId: number
}

/**
 * 시스템 메시지를 렌더링하는 컴포넌트
 *
 * @param message - 렌더링할 시스템 메시지
 */
const SystemMessageItem = memo(
  ({ message }: { message: ParsedChatMessage }) => (
    <SystemMessage message={message} />
  ),
)

/**
 * 일반 채팅 메시지를 렌더링하는 컴포넌트
 *
 * @param message - 렌더링할 채팅 메시지
 * @param isOwnMessage - 메시지가 현재 사용자의 것인지 여부
 */
const ChatMessageItem = memo(
  ({
    message,
    isOwnMessage,
  }: {
    message: ParsedChatMessage
    isOwnMessage: boolean
  }) => <ChatMessage message={message} isOwnMessage={isOwnMessage} />,
)

/**
 * 메시지 타입에 따른 렌더링을 담당하는 컴포넌트
 *
 * @param message - 렌더링할 메시지
 * @param isOwnMessage - 메시지가 현재 사용자의 것인지 여부
 */
const MessageContent = memo(
  ({
    message,
    isOwnMessage,
  }: {
    message: ParsedChatMessage
    isOwnMessage: boolean
  }) => {
    if (isSystemMessage(message)) {
      return <SystemMessageItem message={message} />
    }

    // 일반 채팅 메시지로 처리
    return <ChatMessageItem message={message} isOwnMessage={isOwnMessage} />
  },
)

/**
 * 개별 메시지 아이템을 렌더링하는 컴포넌트
 *
 * @param message - 렌더링할 메시지
 * @param index - 메시지의 인덱스
 * @param messages - 전체 메시지 배열 (날짜 헤더 계산용)
 * @param currentUserId - 현재 사용자의 ID
 */
const MessageItem = memo(
  ({
    message,
    index,
    messages,
    currentUserId,
  }: {
    message: ParsedChatMessage
    index: number
    messages: ParsedChatMessage[]
    currentUserId: number
  }) => {
    const shouldShowHeader = shouldShowDateHeader(messages, index)
    const messageKey = generateMessageKey(message, index)
    const isOwn = isOwnMessage(message, currentUserId)

    return (
      <div key={messageKey}>
        {shouldShowHeader && <DateHeader date={formatDate(message.sentAt)} />}
        <MessageContent message={message} isOwnMessage={isOwn} />
      </div>
    )
  },
)

/**
 * 채팅 메시지 목록을 렌더링하는 컴포넌트
 *
 * 메시지가 없을 경우 빈 상태를 표시하고, 메시지가 있을 경우
 * 각 메시지를 개별 아이템으로 렌더링합니다.
 *
 * @param messages - 렌더링할 채팅 메시지 배열
 * @param currentUserId - 현재 로그인한 사용자의 ID
 */
export const ChatMessageList = memo(
  ({ messages, currentUserId }: ChatMessageListProps) => {
    if (messages.length === 0) {
      return <NoMessages />
    }

    return (
      <>
        {messages.map((message, index) => (
          <MessageItem
            key={generateMessageKey(message, index)}
            message={message}
            index={index}
            messages={messages}
            currentUserId={currentUserId}
          />
        ))}
      </>
    )
  },
)
