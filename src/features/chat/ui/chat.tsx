'use client'

import { memo, useCallback } from 'react'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input/text-input'
import { useChatScroll } from '../hooks/use-chat-scroll'
import type { ChatMessage } from '../model/types'
import styles from './chat.module.css'
import { ChatMessageList } from './chat-message-list'

interface ChatProps {
  messages: ChatMessage[]
  currentUserId: number
  onSendMessage: (message: string) => void
}

export const Chat = memo(
  ({ messages, currentUserId, onSendMessage }: ChatProps) => {
    const { scrollAreaRef, scrollToBottom } = useChatScroll(messages)

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
                messages={messages}
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

export default Chat
