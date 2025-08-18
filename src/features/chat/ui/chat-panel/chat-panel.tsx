'use client'

import { memo, useCallback, useMemo } from 'react'
import { mockMessages } from '@/features/chat/fixtures/mock-data'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { parseChatMessages } from '@/features/chat/lib/message-parser'
import type { ChatMessage } from '@/features/chat/model/types'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input/text-input'
import { ChatMessageList } from '../chat-message-list/chat-message-list'
import styles from './chat-panel.module.css'

interface ChatPanelProps {
  messages?: ChatMessage[]
  currentUserId?: number
  onSendMessage?: (message: string) => void
}

export const ChatPanel = memo(
  ({
    messages = mockMessages,
    currentUserId = 2,
    onSendMessage = () => {
      console.log('Message sent')
    },
  }: ChatPanelProps) => {
    const { scrollAreaRef, scrollToBottom } = useChatScroll(messages)

    // ChatMessage[]를 ParsedChatMessage[]로 변환
    const parsedMessages = useMemo(
      () => parseChatMessages(messages),
      [messages],
    )

    const handleSendMessage = useCallback(
      (message: string) => {
        onSendMessage(message)
        scrollToBottom()
      },
      [onSendMessage, scrollToBottom],
    )

    return (
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          <ScrollArea className={styles.scrollArea} ref={scrollAreaRef}>
            <div className={styles.messageList}>
              <ChatMessageList
                messages={parsedMessages}
                currentUserId={currentUserId}
              />
            </div>
          </ScrollArea>
        </div>

        <TextInput
          placeholder="Type your message..."
          buttonText="Send"
          onSend={handleSendMessage}
        />
      </div>
    )
  },
)

export default ChatPanel
