import { memo } from 'react'
import type { ChatMessage } from '@/features/chat/model/types'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import { cn } from '@/shared/lib/utils'

export interface SecondarySidebarProps {
  messages: ChatMessage[]
  currentUserId: number
  onSendMessage: (message: string) => void
  position?: 'left' | 'right'
  className?: string
}

const SecondarySidebar = memo(
  ({
    messages,
    currentUserId,
    onSendMessage,
    position = 'right',
    className,
  }: SecondarySidebarProps) => {
    return (
      <div
        className={cn(
          'w-80 min-w-80 max-w-96',
          position === 'left' ? 'border-r' : 'border-l',
          className,
        )}
      >
        <ChatPanel
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
        />
      </div>
    )
  },
)

export default SecondarySidebar
