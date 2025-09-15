import { memo, useCallback, useMemo } from 'react'
import { shouldShowDateHeader } from '@/features/chat/lib/message-helpers'
import type { ChatMessage } from '@/features/chat/types/client'
import { MessageContent } from '@/features/chat/ui/message-list/message-content'
import { DateHeader } from '@/features/chat/ui/message-types/system-message-item'

interface MessageItemProps {
  message: ChatMessage
  index: number
  messages: ChatMessage[]
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
const MessageItem = memo(
  ({ message, index, messages, currentUserId }: MessageItemProps) => {
    const showDateHeader = useMemo(
      () => shouldShowDateHeader(messages, index),
      [messages, index],
    )

    const isOwnMessage = useMemo(
      () => currentUserId.toString() === message.user.id,
      [currentUserId, message.user.id],
    )

    /**
     * 메시지가 그룹의 첫 번째인지 확인하는 함수
     */
    const checkIsFirstInGroup = useCallback(
      (showDateHeader: boolean): boolean => {
        if (message.type !== 'TALK') return true
        if (index === 0 || showDateHeader) return true

        const prevMessage = messages[index - 1]

        if (!prevMessage || prevMessage.type !== 'TALK') return true

        return prevMessage.user.id !== message.user.id
      },
      [index, messages, message.type, message.user.id],
    )

    const isFirstInGroup = useMemo(
      () => checkIsFirstInGroup(showDateHeader),
      [checkIsFirstInGroup, showDateHeader],
    )

    return (
      <li>
        {showDateHeader && <DateHeader date={message.timestamp} />}
        <MessageContent
          message={message}
          isOwnMessage={isOwnMessage}
          isFirstInGroup={isFirstInGroup}
        />
      </li>
    )
  },
)

export default MessageItem
export { MessageItem }
