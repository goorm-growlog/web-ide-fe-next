import { memo, useCallback, useMemo } from 'react'
import { shouldShowDateHeader } from '@/features/chat/lib/message-utils'
import { MESSAGE_TYPES, type Message } from '@/features/chat/model/types'
import { DateHeader } from '@/features/chat/ui/message-items/system-message-item'
import { MessageContent } from './message-content'

interface MessageItemProps {
  message: Message
  index: number
  messages: Message[]
  currentUserId: number
}

/**
 * 개별 메시지 아이템을 렌더링하는 컴포넌트
 *
 * @param message - 렌더링할 메시지
 * @param index - 메시지의 인덱스
 * @param messages - 전체 메시지 배열 (날짜 헤더 계산용)
 * @param currentUserId - 현재 사용자의 ID
 */
export const MessageItem = memo(
  ({ message, index, messages, currentUserId }: MessageItemProps) => {
    const showDateHeader = useMemo(
      () => shouldShowDateHeader(messages, index),
      [messages, index],
    )

    const isOwnMessage = useMemo(
      () => currentUserId === message.userId,
      [currentUserId, message.userId],
    )

    /**
     * 메시지가 그룹의 첫 번째인지 확인하는 함수
     */
    const checkIsFirstInGroup = useCallback(
      (showDateHeader: boolean): boolean => {
        if (message.messageType !== MESSAGE_TYPES.TALK) return true
        if (index === 0 || showDateHeader) return true

        const prevMessage = messages[index - 1]

        if (!prevMessage || prevMessage.messageType !== MESSAGE_TYPES.TALK)
          return true

        return prevMessage.userId !== message.userId
      },
      [index, messages, message.messageType, message.userId],
    )

    const isFirstInGroup = useMemo(
      () => checkIsFirstInGroup(showDateHeader),
      [checkIsFirstInGroup, showDateHeader],
    )

    return (
      <>
        {showDateHeader && (
          <li>
            <DateHeader date={message.sentAt} />
          </li>
        )}
        <MessageContent
          message={message}
          isOwnMessage={isOwnMessage}
          isFirstInGroup={isFirstInGroup}
        />
      </>
    )
  },
)
