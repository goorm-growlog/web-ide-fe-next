'use client'

import { memo, useCallback } from 'react'
import { DEFAULT_USER_CONFIG } from '@/features/chat/constants/chat-config'
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'
import { useChatScroll } from '@/features/chat/hooks/use-chat-scroll'
import { MessageList } from '@/features/chat/ui/message-list/message-list'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input'

/**
 * @todo 전역 상태 관리 스토어(Zustand/Redux)로 사용자 정보 관리
 * @todo 인증 시스템과 연동하여 실제 사용자 ID 가져오기
 */
export const ChatPanel = memo(() => {
  const currentUserId = DEFAULT_USER_CONFIG.MOCK_CURRENT_USER_ID

  const { messages, sendMessage } = useChatMessages()
  const { scrollAreaRef, scrollToBottom } = useChatScroll(messages)

  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        sendMessage(message)
        scrollToBottom()
      } catch (error) {
        console.error('Failed to send message:', error)
        scrollToBottom()
      }
    },
    [sendMessage, scrollToBottom],
  )

  return (
    <main className="flex h-full flex-col">
      <section className="relative flex-1 overflow-hidden border-border border-b">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <MessageList messages={messages} currentUserId={currentUserId} />
        </ScrollArea>
      </section>

      <section>
        <TextInput
          placeholder="Type your message..."
          buttonText="Send"
          onSend={handleSendMessage}
        />
      </section>
    </main>
  )
})
