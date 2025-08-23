'use client'

import { memo, type ReactNode } from 'react'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import ResizableGrowHandle from '@/shared/ui/resizable-grow-handle/resizable-grow-handle'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/shadcn/resizable'
import PrimarySidebar from '@/widgets/sidebar/ui/primary-sidebar/primary-sidebar'
import Sidebar from '@/widgets/sidebar/ui/sidebar/sidebar'
import { useLayoutStore } from '../../store/layout-store'

interface EditorLayoutProps {
  children: ReactNode
}

const EditorLayout = memo(({ children }: EditorLayoutProps) => {
  const { layout, panelConfig, panelLayout, setPanelLayout } = useLayoutStore()
  const isPrimaryLeft = layout === 'primary-left'
  const primaryPosition = isPrimaryLeft ? 'left' : 'right'

  const handleLayoutChange = (sizes: number[]) => {
    setPanelLayout(sizes)
  }

  const primaryIndex = isPrimaryLeft ? 0 : 2
  const secondaryIndex = isPrimaryLeft ? 2 : 0
  const mainIndex = 1

  const primaryPanel = (
    <ResizablePanel
      defaultSize={panelLayout[primaryIndex] ?? 25}
      maxSize={panelConfig.maxSize}
      minSize={0}
      className="min-w-16"
    >
      <PrimarySidebar position={primaryPosition} />
    </ResizablePanel>
  )

  const secondaryPanel = (
    <ResizablePanel
      defaultSize={panelLayout[secondaryIndex] ?? 25}
      maxSize={panelConfig.maxSize}
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
      defaultSize={panelLayout[mainIndex] ?? 50}
      maxSize={100}
      minSize={0}
      className="max-w-full"
    >
      <main aria-label="Editor main" className="h-full p-8">
        {children}
      </main>
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
