'use client'

import { memo, useCallback } from 'react'
import { DEFAULT_USER_CONFIG } from '@/features/chat/constants/config'
import { useChatMessages } from '@/features/chat/model/use-chat-messages'
import { useChatScroll } from '@/features/chat/model/use-chat-scroll'
import { MessageList } from '@/features/chat/ui/message-list/message-list'
import { SCROLLABLE_PANEL_CONTENT_STYLES } from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'
import { ScrollArea } from '@/shared/ui/shadcn'
import { TextInput } from '@/shared/ui/text-input'

interface ChatPanelProps {
  currentUserId?: number
}

/**
 * @todo 전역 상태 관리 스토어(Zustand/Redux)로 사용자 정보 관리
 * @todo 인증 시스템과 연동하여 실제 사용자 ID 가져오기
 */
const ChatPanel = memo(({ currentUserId }: ChatPanelProps) => {
  const { messages, sendMessage } = useChatMessages()
  const { scrollAreaRef } = useChatScroll(messages)

  const userId = currentUserId ?? DEFAULT_USER_CONFIG.MOCK_CURRENT_USER_ID

  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        sendMessage(message)
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    },
    [sendMessage],
  )

  return (
    <PanelLayout>
      <ScrollArea
        className={cn(
          SCROLLABLE_PANEL_CONTENT_STYLES,
          'border-border not-last:border-b',
        )}
        ref={scrollAreaRef}
      >
        <MessageList messages={messages} currentUserId={userId} />
      </ScrollArea>

      <TextInput
        placeholder="Type your message..."
        buttonText="Send"
        onSend={handleSendMessage}
      />
    </PanelLayout>
  )
})

export default ChatPanel
export { ChatPanel }
