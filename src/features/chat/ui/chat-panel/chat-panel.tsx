'use client'

import { memo, useCallback, useMemo } from 'react'
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { parseChatMessages } from '@/features/chat/lib/chat-message-parser'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input/text-input'
import { ChatMessageList } from '../chat-message-list/chat-message-list'

/**
 * 채팅 패널 메인 컴포넌트
 */
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
    <main className="flex h-full flex-col">
      <section
        className="relative flex-1 overflow-hidden border-border border-b"
        aria-label="Chat messages"
        role="log"
        aria-live="polite"
      >
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <ChatMessageList
            messages={parsedMessages}
            currentUserId={currentUserId}
          />
        </ScrollArea>
      </section>

      <section aria-label="Message input">
        <TextInput
          placeholder="Type your message..."
          buttonText="Send"
          onSend={handleSendMessage}
        />
      </section>
    </main>
  )
})

export default ChatPanel
