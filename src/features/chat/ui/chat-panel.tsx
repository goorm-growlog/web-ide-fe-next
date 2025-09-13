'use client'

import { memo, useCallback } from 'react'
import { DEFAULT_USER_CONFIG } from '@/features/chat/constants/chat-config'
import { CHAT_UI_TEXTS } from '@/features/chat/constants/ui-constants'
import { useChatScroll } from '@/features/chat/hooks/use-auto-scroll'
import useChat from '@/features/chat/hooks/use-chat'
import { ChatEmptyState } from '@/features/chat/ui/chat-empty-state'
import { ChatSkeleton } from '@/features/chat/ui/chat-skeleton'
import { MessageList } from '@/features/chat/ui/message-list/message-list'
import {
  COMMON_UI_TEXTS,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import { logger } from '@/shared/lib/logger'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area'
import { TextInput } from '@/shared/ui/text-input'

interface ChatPanelProps {
  projectId: string
  currentUserId?: number
}

/**
 * @todo 전역 상태 관리 스토어(Zustand/Redux)로 사용자 정보 관리
 * @todo 인증 시스템과 연동하여 실제 사용자 ID 가져오기
 */
const ChatPanel = memo(({ projectId, currentUserId }: ChatPanelProps) => {
  const { messages, sendMessage, isLoading } = useChat(projectId)
  const { scrollAreaRef } = useChatScroll(messages)

  const userId = currentUserId ?? DEFAULT_USER_CONFIG.MOCK_CURRENT_USER_ID

  const handleSendMessage = useCallback(
    (message: string) => {
      try {
        sendMessage(message)
      } catch (error) {
        logger.error('Failed to send message:', error)
      }
    },
    [sendMessage],
  )

  if (isLoading) {
    return (
      <PanelLayout className={cn(SCROLLABLE_PANEL_CONTENT_STYLES)}>
        <ChatSkeleton />
      </PanelLayout>
    )
  }

  if (messages.length === 0) return <ChatEmptyState />

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
        placeholder={CHAT_UI_TEXTS.MESSAGE_PLACEHOLDER}
        buttonText={COMMON_UI_TEXTS.SEND}
        onSend={handleSendMessage}
        disabled={false}
      />
    </PanelLayout>
  )
})

export default ChatPanel
export { ChatPanel }
