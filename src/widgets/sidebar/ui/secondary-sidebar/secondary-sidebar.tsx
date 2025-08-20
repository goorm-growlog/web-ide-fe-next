import { memo } from 'react'
import type { ChatMessage } from '@/features/chat/model/types'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import { cn } from '@/shared/lib/utils'

export interface SecondarySidebarProps {
  messages: ChatMessage[]
  currentUserId: number
  onSendMessage: (message: string) => void
  className?: string
}

const SecondarySidebar = memo(
  ({
    messages,
    currentUserId,
    onSendMessage,
    className,
  }: SecondarySidebarProps) => {
    return (
      <aside
        className={cn(
          'flex h-full flex-1 flex-col overflow-hidden',
          'bg-background',
          className,
        )}
      >
        <ChatPanel
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
        />
      </aside>
    )
  },
)

export default SecondarySidebar
