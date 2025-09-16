'use client'

import { memo, useCallback } from 'react'
import { CHAT_UI_TEXTS } from '@/features/chat/constants/ui-constants'
import { useAutoScroll } from '@/features/chat/hooks/use-auto-scroll'
import type { ChatReturn } from '@/features/chat/types/client'
import { ChatSkeleton } from '@/features/chat/ui/chat-skeleton'
import MessageList from '@/features/chat/ui/message-list/message-list'
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
  chatData: ChatReturn
}

/**
 * @todo 전역 상태 관리 스토어(Zustand/Redux)로 사용자 정보 관리
 * @todo 인증 시스템과 연동하여 실제 사용자 ID 가져오기
 */
const ChatPanel = memo(({ chatData }: ChatPanelProps) => {
  const { messages, sendMessage, isLoading, hasMore, loadMore, isLoadingMore } =
    chatData
  const { scrollAreaRef } = useAutoScroll(
    messages,
    loadMore,
    hasMore,
    isLoadingMore,
  )

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

  return (
    <PanelLayout>
      <ScrollArea
        className={cn(
          SCROLLABLE_PANEL_CONTENT_STYLES,
          'flex-1 border-border not-last:border-b',
        )}
        ref={scrollAreaRef}
        onScroll={e => {
          const target = e.currentTarget
          if (target instanceof HTMLElement) {
            // 스크롤 이벤트 처리
          }
        }}
      >
        <MessageList messages={messages} isLoadingMore={isLoadingMore} />
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
