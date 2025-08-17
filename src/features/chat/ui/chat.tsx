'use client'

import { useEffect, useRef } from 'react'
import { formatDate } from '@/shared/lib/date-utils'
import { requestScrollToBottom } from '@/shared/lib/scroll-utils'
import { getSystemMessageText } from '@/shared/lib/string-utils'
import { Badge } from '@/shared/ui/shadcn/badge'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input/text-input'
import type { ChatMessage } from '../model/types'
import styles from './chat.module.css'
import { ChatMessageComponent } from './chat-message'

interface ChatProps {
  messages: ChatMessage[]
  currentUserId?: number
  onSendMessage: (message: string) => void
}

export const Chat = ({ messages, currentUserId, onSendMessage }: ChatProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)

  // 채팅방에 처음 들어왔을 때와 내가 메시지를 보냈을 때만 스크롤을 최하단으로
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    )

    if (!scrollElement) return

    // 첫 번째 로드 시에만 스크롤을 최하단으로
    if (isFirstLoad.current && messages.length > 0) {
      scrollElement.scrollTop = scrollElement.scrollHeight
      isFirstLoad.current = false
    }
  }, [messages])

  // 메시지를 날짜별로 그룹핑하고 시스템 메시지와 일반 메시지로 분리
  const groupMessagesByDate = () => {
    const groups: {
      [key: string]: { messages: ChatMessage[]; systemMessages: ChatMessage[] }
    } = {}

    messages.forEach(message => {
      const date = new Date(message.sentAt)
      const dateKey = date.toDateString()

      if (!groups[dateKey]) {
        groups[dateKey] = { messages: [], systemMessages: [] }
      }

      if (message.messageType === 'ENTER' || message.messageType === 'LEAVE') {
        groups[dateKey].systemMessages.push(message)
      } else {
        groups[dateKey].messages.push(message)
      }
    })

    return groups
  }

  const messageGroups = groupMessagesByDate()

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        <ScrollArea className={styles.scrollArea} ref={scrollAreaRef}>
          <div className={styles.messageList}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💬</div>
                <p className={styles.emptyText}>No messages yet</p>
                <p className={styles.emptySubtext}>Send your first message!</p>
              </div>
            ) : (
              Object.entries(messageGroups).map(([dateKey, group]) => (
                <div key={dateKey}>
                  {/* 날짜 헤더: 날짜와 요일을 표시 (예: "2025.01.15 (Wed)") */}
                  <div className={styles.system}>
                    <div className={styles.systemText}>
                      {formatDate(
                        group.messages[0]?.sentAt ||
                          group.systemMessages[0]?.sentAt ||
                          '',
                      )}
                    </div>
                  </div>

                  {/* 시스템 메시지들 (입장/퇴장) */}
                  {group.systemMessages.map((message, index) => (
                    <div
                      key={`system-${message.userId}-${message.sentAt}-${index}`}
                      className={styles.system}
                    >
                      <Badge variant="secondary" className={styles.systemBadge}>
                        {getSystemMessageText(message)}
                      </Badge>
                    </div>
                  ))}

                  {/* 일반 메시지들 */}
                  {group.messages.map((message, index) => (
                    <ChatMessageComponent
                      key={`${message.userId}-${message.sentAt}-${index}`}
                      message={message}
                      isOwnMessage={currentUserId === message.userId}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <TextInput
        placeholder="Type your message..."
        buttonText="Send"
        onSend={message => {
          onSendMessage(message)
          // 내가 메시지를 보낸 후 스크롤을 최하단으로
          const scrollElement = scrollAreaRef.current?.querySelector(
            '[data-radix-scroll-area-viewport]',
          )
          if (scrollElement) {
            requestScrollToBottom(scrollElement as HTMLElement)
          }
        }}
      />
    </div>
  )
}

export default Chat
