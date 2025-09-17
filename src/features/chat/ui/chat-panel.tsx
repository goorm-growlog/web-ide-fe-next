'use client'

import { memo, useCallback } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import { CHAT_UI_TEXTS } from '@/features/chat/constants/ui-constants'
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
import { TextInput } from '@/shared/ui/text-input'

interface ChatPanelProps {
  chatData: ChatReturn
  currentUserId?: string // Storybook용 옵셔널 prop
}

/**
 * @todo 전역 상태 관리 스토어(Zustand/Redux)로 사용자 정보 관리
 * @todo 인증 시스템과 연동하여 실제 사용자 ID 가져오기
 */
const ChatPanel = memo(({ chatData, currentUserId }: ChatPanelProps) => {
  const { user } = useAuth()
  const { messages, sendMessage, isLoading, hasMore, loadMore, isLoadingMore } =
    chatData

  // currentUserId가 제공되면 그것을 사용하고, 없으면 useAuth에서 가져온 user.id 사용
  const actualCurrentUserId = currentUserId || user?.id

  console.log('🎯 ChatPanel: Rendering with state', {
    messagesCount: messages.length,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMore: !!loadMore,
    currentUserId: actualCurrentUserId,
  })

  // currentUserId 전달 확인
  console.log('🔍 ChatPanel currentUserId check:', {
    currentUserId,
    userFromAuth: user?.id,
    actualCurrentUserId,
    messagesSample: messages.slice(0, 3).map(m => ({ name: m.user.name })),
  })

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
      <div
        className={cn(
          SCROLLABLE_PANEL_CONTENT_STYLES,
          'flex-1 border-border not-last:border-b',
        )}
      >
        <MessageList
          messages={messages}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          currentUserId={actualCurrentUserId || ''}
        />
      </div>

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
