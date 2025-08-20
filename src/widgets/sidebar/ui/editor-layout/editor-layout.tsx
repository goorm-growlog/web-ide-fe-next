'use client'

import { memo } from 'react'
import { useChatMessages } from '@/features/chat/hooks/use-chat-messages'
import ResizableGrowHandle from '@/shared/ui/resizable-grow-handle/resizable-grow-handle'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/shadcn/resizable'
import PrimarySidebar from '@/widgets/sidebar/ui/primary-sidebar/primary-sidebar'
import SecondarySidebar from '@/widgets/sidebar/ui/secondary-sidebar/secondary-sidebar'
import { useLayoutStore } from '../../store/layout-store'

interface EditorLayoutProps {
  children: React.ReactNode
}

const EditorLayout = memo(({ children }: EditorLayoutProps) => {
  const { layout, panelConfig, panelLayout, setPanelLayout } = useLayoutStore()
  const { messages, currentUserId, sendMessage } = useChatMessages()
  const isPrimaryLeft = layout === 'primary-left'

  const handleLayoutChange = (sizes: number[]) => {
    console.debug('Panel layout changed:', sizes)
    setPanelLayout(sizes)
  }

  const primaryPanel = (position: 'left' | 'right') => (
    <ResizablePanel
      defaultSize={panelLayout[isPrimaryLeft ? 0 : 2]}
      minSize={panelConfig.primaryMinSize}
      maxSize={panelConfig.maxSize}
    >
      <PrimarySidebar position={position} />
    </ResizablePanel>
  )

  const secondaryPanel = (
    <ResizablePanel
      defaultSize={panelLayout[isPrimaryLeft ? 2 : 0]}
      minSize={panelConfig.secondaryMinSize}
      maxSize={panelConfig.maxSize}
    >
      <SecondarySidebar
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={sendMessage}
      />
    </ResizablePanel>
  )

  const mainPanel = (
    <ResizablePanel defaultSize={panelLayout[1]}>
      <main className="h-full p-8">{children}</main>
    </ResizablePanel>
  )

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full"
        onLayout={handleLayoutChange}
      >
        {isPrimaryLeft ? (
          <>
            {primaryPanel('left')}
            <ResizableGrowHandle />
            {mainPanel}
            <ResizableGrowHandle />
            {secondaryPanel}
          </>
        ) : (
          <>
            {secondaryPanel}
            <ResizableGrowHandle />
            {mainPanel}
            <ResizableGrowHandle />
            {primaryPanel('right')}
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
})

export default EditorLayout
