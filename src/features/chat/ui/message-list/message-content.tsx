import { memo } from 'react'
import type { ChatMessage } from '@/features/chat/types/client'
import { SystemMessageItem } from '@/features/chat/ui/message-types/system-message-item'
import { TalkMessageItem } from '@/features/chat/ui/message-types/talk-message-item'

interface MessageContentProps {
  message: ChatMessage
  isOwnMessage: boolean
  isFirstInGroup: boolean
}

/**
 * 메시지 타입에 따른 렌더링을 담당하는 컴포넌트
 *
 * @param message - 렌더링할 메시지
 * @param isOwnMessage - 메시지가 현재 사용자의 것인지 여부
 * @param isFirstInGroup - 그룹 내 첫 번째 메시지인지 여부
 */
export const MessageContent = memo(
  ({ message, isOwnMessage, isFirstInGroup }: MessageContentProps) => {
    if (message.type !== 'TALK') {
      return <SystemMessageItem message={message} />
    }

    return (
      <TalkMessageItem
        message={message}
        isOwnMessage={isOwnMessage}
        isFirstInGroup={isFirstInGroup}
      />
    )
  },
)
