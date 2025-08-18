'use client'

import { formatTime } from '@/shared/lib/date-utils'
import { getInitials } from '@/shared/lib/string-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import type { ChatMessage } from '../model/types'
import styles from './chat-message.module.css'

interface ChatMessageProps {
  message: ChatMessage
  isOwnMessage?: boolean
}

export const ChatMessageComponent = ({
  message,
  isOwnMessage = false,
}: ChatMessageProps) => {
  const itemClassName = `${styles.item} ${!isOwnMessage ? styles.otherMessage : ''}`
  const contentClassName = `${styles.content} ${!isOwnMessage ? styles.otherMessage : ''}`
  const bubbleClassName = `${styles.bubble} ${!isOwnMessage ? styles.otherMessage : ''}`

  return (
    <div className={itemClassName}>
      {!isOwnMessage && (
        <Avatar className={styles.avatar}>
          <AvatarImage
            src={`/api/avatars/${message.userId}`}
            alt={message.username}
          />
          <AvatarFallback className={styles.avatarFallback}>
            {getInitials(message.username)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={contentClassName}>
        <div className={bubbleClassName}>
          <p className={styles.text}>{message.content}</p>
        </div>
        <div className={styles.time}>{formatTime(message.sentAt)}</div>
      </div>
    </div>
  )
}
