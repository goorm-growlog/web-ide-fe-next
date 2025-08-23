import {
  getMessageAriaLabel,
  getMessageClasses,
} from '@/features/chat/lib/chat-message-utils'
import type { ParsedChatMessage } from '@/features/chat/model/types'
import { MessageContent } from '@/features/chat/ui/chat-message/message-content'
import { OtherUserAvatar } from '@/features/chat/ui/chat-message/other-user-avatar'
import { CHAT_MESSAGE_STYLES } from '@/features/chat/ui/constants/chat-styles'
import { formatTime } from '@/shared/lib/date-utils'

interface ChatMessageProps {
  message: ParsedChatMessage
  isOwnMessage?: boolean
}

/**
 * 채팅 메시지를 렌더링하는 메인 컴포넌트
 */
export const ChatMessage = ({
  message,
  isOwnMessage = false,
}: ChatMessageProps) => {
  const messageClasses = getMessageClasses(isOwnMessage)
  const sentAtDate = new Date(message.sentAt)
  const formattedTime = formatTime(message.sentAt)

  return (
    <li
      className={messageClasses.item}
      aria-label={getMessageAriaLabel(
        isOwnMessage,
        message.username || 'Unknown user',
        formattedTime,
      )}
    >
      {!isOwnMessage && <OtherUserAvatar message={message} />}

      <div className={messageClasses.content}>
        <section className={messageClasses.bubble} aria-label="Message content">
          <p className={CHAT_MESSAGE_STYLES.messageText}>
            <MessageContent parts={message.parts} />
          </p>
        </section>
        <time
          className={CHAT_MESSAGE_STYLES.timestamp}
          dateTime={message.sentAt}
          title={`Sent at ${sentAtDate.toLocaleString()}`}
        >
          {formattedTime}
        </time>
      </div>
    </li>
  )
}
