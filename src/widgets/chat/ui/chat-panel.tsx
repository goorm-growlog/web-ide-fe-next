'use client'

import { RefreshCw } from 'lucide-react'
import { MessageInput } from '@/features/chat/components/message-input'
import { MessageList } from '@/features/chat/components/message-list'
import { useChatInfinite } from '@/features/chat/hooks/use-chat-infinite'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'

interface ChatPanelProps {
  roomId: string
  currentUserId: string
  className?: string
}

export const ChatPanel = ({
  roomId,
  currentUserId,
  className,
}: ChatPanelProps) => {
  const {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    sendMessage,
  } = useChatInfinite(roomId)

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content)
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  return (
    <div className={cn('flex h-full flex-col bg-background', className)}>
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b bg-card p-4">
        <div>
          <h2 className="font-semibold text-foreground">채팅방 {roomId}</h2>
          <p className="text-muted-foreground text-sm">
            {messages.length}개의 메시지
          </p>
        </div>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')}
          />
          새로고침
        </Button>
      </header>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          currentUserId={currentUserId}
          onLoadMore={loadMore}
          onRetry={refresh}
        />
      </div>

      {/* 메시지 입력 */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="메시지를 입력하세요..."
      />
    </div>
  )
}
