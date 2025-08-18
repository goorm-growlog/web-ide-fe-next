'use client'

import { memo, useMemo } from 'react'
import { formatDate } from '@/shared/lib/date-utils'
import { getSystemMessageText } from '@/shared/lib/string-utils'
import { Badge } from '@/shared/ui/shadcn/badge'
import type { ChatMessage } from '../model/types'
import { ChatMessageComponent } from './chat-message'
import styles from './chat-message-list.module.css'

interface ChatMessageListProps {
  messages: ChatMessage[]
  currentUserId: number
}

export const ChatMessageList = memo(
  ({ messages, currentUserId }: ChatMessageListProps) => {
    // 날짜 헤더 표시 여부를 결정하는 함수
    const shouldShowDateHeader = useMemo(() => {
      return (currentMessage: ChatMessage, currentIndex: number): boolean => {
        if (currentIndex === 0) return true

        const previousMessage = messages[currentIndex - 1]
        if (!previousMessage) return true

        const currentDate = new Date(currentMessage.sentAt).toDateString()
        const previousDate = new Date(previousMessage.sentAt).toDateString()

        return currentDate !== previousDate
      }
    }, [messages])

    // 안전한 키 생성 함수
    const generateKey = useMemo(() => {
      return (message: ChatMessage, index: number): string => {
        return `${message.userId}-${message.sentAt}-${index}`
      }
    }, [])

    if (messages.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <p className={styles.emptyText}>No messages yet</p>
          <p className={styles.emptySubtext}>Send your first message!</p>
        </div>
      )
    }

    return (
      <>
        {messages.map((message, index) => {
          const showDateHeader = shouldShowDateHeader(message, index)
          const messageKey = generateKey(message, index)

          return (
            <div key={messageKey}>
              {/* 날짜 헤더 (날짜가 바뀔 때만 표시) */}
              {showDateHeader && (
                <div className={styles.system}>
                  <div className={styles.systemText}>
                    {formatDate(message.sentAt)}
                  </div>
                </div>
              )}

              {/* 메시지 표시 */}
              {message.messageType === 'ENTER' ||
              message.messageType === 'LEAVE' ? (
                // 시스템 메시지
                <div className={styles.system}>
                  <Badge variant="secondary" className={styles.systemBadge}>
                    {getSystemMessageText(message)}
                  </Badge>
                </div>
              ) : (
                // 일반 메시지
                <ChatMessageComponent
                  key={messageKey}
                  message={message}
                  isOwnMessage={currentUserId === message.userId}
                />
              )}
            </div>
          )
        })}
      </>
    )
  },
)
