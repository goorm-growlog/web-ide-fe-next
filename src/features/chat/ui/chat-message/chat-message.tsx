import type { ParsedChatMessage } from '@/features/chat/model/types'
import { MessageContent } from '@/features/chat/ui/chat-message/message-content'
import { OtherUserAvatar } from '@/features/chat/ui/chat-message/other-user-avatar'
import { formatTime } from '@/shared/lib/date-utils'
import styles from './chat-message.module.css'

interface ChatMessageProps {
  message: ParsedChatMessage
  isOwnMessage?: boolean
}

// 클래스명 생성을 위한 헬퍼 함수
const getMessageClasses = (isOwnMessage: boolean) => {
  if (isOwnMessage) {
    return {
      item: styles.item,
      content: styles.content,
      bubble: styles.bubble,
    }
  }

  return {
    item: `${styles.item} ${styles.otherMessage}`,
    content: `${styles.content} ${styles.otherMessage}`,
    bubble: `${styles.bubble} ${styles.otherMessage}`,
  }
}

/**
 * 채팅 메시지를 렌더링하는 메인 컴포넌트
 */
export const ChatMessage = ({
  message,
  isOwnMessage = false,
}: ChatMessageProps) => {
  const messageClasses = getMessageClasses(isOwnMessage)

  return (
    <div className={messageClasses.item}>
      {!isOwnMessage && <OtherUserAvatar message={message} />}

      <div className={messageClasses.content}>
        <div className={messageClasses.bubble}>
          <p className={styles.text}>
            <MessageContent parts={message.parts} />
          </p>
        </div>
        <div className={styles.time}>{formatTime(message.sentAt)}</div>
      </div>
    </div>
  )
}
