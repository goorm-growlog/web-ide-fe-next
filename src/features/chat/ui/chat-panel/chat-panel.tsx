'use client'

import { memo, useCallback, useMemo } from 'react'
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { parseChatMessages } from '@/features/chat/lib/message-parser'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input/text-input'
import { ChatMessageList } from '../chat-message-list/chat-message-list'
import styles from './chat-panel.module.css'

export const ChatPanel = memo(() => {
  const { messages, currentUserId, sendMessage } = useChatMessages()
  const { scrollAreaRef, scrollToBottom } = useChatScroll(messages)

  const parsedMessages = useMemo(() => parseChatMessages(messages), [messages])

  const handleSendMessage = useCallback(
    (message: string) => {
      sendMessage(message)
      scrollToBottom()
    },
    [sendMessage, scrollToBottom],
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
})

export default ChatPanel
