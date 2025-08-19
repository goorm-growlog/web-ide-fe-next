'use client'

import { memo } from 'react'
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'
import { cn } from '@/shared/lib/utils'
import PrimarySidebar from '@/widgets/sidebar/ui/primary-sidebar/primary-sidebar'
import SecondarySidebar from '@/widgets/sidebar/ui/secondary-sidebar/secondary-sidebar'
import { useLayoutStore } from '../../store/layout-store'

interface EditorLayoutProps {
  children: React.ReactNode
}

const EditorLayout = memo(({ children }: EditorLayoutProps) => {
  const { layout } = useLayoutStore()
  const { messages, currentUserId, sendMessage } = useChatMessages()
  const isPrimaryLeft = layout === 'primary-left'

  return (
    <div
      className={cn(
        'flex h-screen overflow-hidden',
        'bg-background text-foreground',
      )}
    >
      <div className={cn('flex h-full w-full', 'flex-col md:flex-row')}>
        {isPrimaryLeft ? (
          <>
            <PrimarySidebar position="left" />
            <div className="flex-1 border-x p-8">{children}</div>
            <SecondarySidebar
              messages={messages}
              currentUserId={currentUserId}
              onSendMessage={sendMessage}
              position="right"
            />
          </>
        ) : (
          <>
            <SecondarySidebar
              messages={messages}
              currentUserId={currentUserId}
              onSendMessage={sendMessage}
              position="left"
            />
            <div className="flex-1 border-x p-8">{children}</div>
            <PrimarySidebar position="right" />
          </>
        )}
      </div>
    </div>
  )
})

export default EditorLayout
