import { memo } from 'react'
import {
  MESSAGE_TYPES,
  type SystemMessage,
  type TalkMessage,
} from '@/features/chat/model/types'
import { SystemMessageItem } from '@/features/chat/ui/message-items/system-message-item'
import { TalkMessageItem } from '@/features/chat/ui/message-items/talk-message-item'

interface MessageContentProps {
  message: SystemMessage | TalkMessage
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
    if (message.messageType !== MESSAGE_TYPES.TALK) {
      return (
        <li>
          <SystemMessageItem message={message} />
        </li>
      )
    }

    return (
      <li>
        <TalkMessageItem
          message={message}
          isOwnMessage={isOwnMessage}
          isFirstInGroup={isFirstInGroup}
        />
      </li>
    )
  },
)
