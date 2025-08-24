'use client'

import { memo, type ReactNode } from 'react'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import ResizableGrowHandle from '@/shared/ui/resizable-grow-handle'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/shadcn/resizable'
import { SIDEBAR_CONFIG } from '@/widgets/sidebar/constants/sidebar-config'
import { useLayoutStore } from '@/widgets/sidebar/model/store'
import PrimarySidebar from '@/widgets/sidebar/ui/primary-sidebar'
import Sidebar from '@/widgets/sidebar/ui/sidebar'

interface EditorLayoutProps {
  children: ReactNode
}

const EditorLayout = memo(({ children }: EditorLayoutProps) => {
  const { position, sidebarLayout, setSidebarLayout } = useLayoutStore()
  const isPrimaryLeft = position === 'left'
  const primaryPosition = isPrimaryLeft ? 'left' : 'right'

  const handleLayoutChange = (sizes: number[]) => {
    setSidebarLayout(sizes)
  }

  const primaryIndex = isPrimaryLeft ? 0 : 2
  const secondaryIndex = isPrimaryLeft ? 2 : 0
  const mainIndex = 1

  const primaryPanel = (
    <ResizablePanel
      defaultSize={sidebarLayout[primaryIndex] ?? 25}
      maxSize={SIDEBAR_CONFIG.maxSize}
      minSize={0}
      className="min-w-16"
    >
      <PrimarySidebar position={primaryPosition} />
    </ResizablePanel>
  )

  const secondaryPanel = (
    <ResizablePanel
      defaultSize={sidebarLayout[secondaryIndex] ?? 25}
      maxSize={SIDEBAR_CONFIG.maxSize}
      minSize={10}
      className="min-w-16"
    >
      <Sidebar>
        <ChatPanel />
      </Sidebar>
    </ResizablePanel>
  )

  const mainPanel = (
    <ResizablePanel
      defaultSize={sidebarLayout[mainIndex] ?? 50}
      maxSize={100}
      minSize={0}
      className="max-w-full"
    >
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
            {primaryPanel}
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
            {primaryPanel}
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
})

EditorLayout.displayName = 'EditorLayout'

export default EditorLayout
