'use client'

import { useParams } from 'next/navigation'
import { memo, type ReactNode } from 'react'
import { DEFAULT_USER_CONFIG } from '@/features/chat/constants/chat-config'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import { cn } from '@/shared/lib/utils'
import { ResizableGrowHandle } from '@/shared/ui/resizable-grow-handle'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/shadcn/resizable'
import { DEFAULT_SIDEBAR_CONFIG } from '@/widgets/sidebar/constants/config'
import {
  useActiveTab,
  useLayout,
  useLayoutIndices,
  usePosition,
} from '@/widgets/sidebar/model/hooks'
import PrimarySidebar from '@/widgets/sidebar/ui/primary-sidebar'

interface EditorLayoutProps {
  children: ReactNode
  projectId?: string
}

const EditorLayout = memo(({ children, projectId }: EditorLayoutProps) => {
  const params = useParams()
  const actualProjectId = projectId || (params.projectId as string) || null
  const sidebarConfig = DEFAULT_SIDEBAR_CONFIG

  const { layout, setLayout } = useLayout()
  const { position } = usePosition()
  const { primary, secondary, main } = useLayoutIndices()

  const { activeTab, toggleTab } = useActiveTab()
  const isVisible = activeTab !== null
  const isPrimaryLeft = position === 'left'
  const primaryPosition = isPrimaryLeft ? 'left' : 'right'

  const currentUserId = DEFAULT_USER_CONFIG.MOCK_CURRENT_USER_ID

  const handleLayoutChange = (sizes: number[]) => setLayout(sizes)

  const primaryPanel = (
    <ResizablePanel
      defaultSize={isVisible ? (layout[primary] ?? 25) : 16}
      maxSize={sidebarConfig.maxSize}
      minSize={isVisible ? 10 : 16}
      className={cn('min-w-16', isVisible ? '' : 'max-w-16')}
    >
      <PrimarySidebar
        position={primaryPosition}
        activeTab={activeTab}
        toggleTab={toggleTab}
      />
    </ResizablePanel>
  )

  const secondaryPanel = (
    <ResizablePanel
      defaultSize={layout[secondary] ?? 25}
      maxSize={sidebarConfig.maxSize}
      minSize={10}
      className="min-w-16"
    >
      {actualProjectId ? (
        <ChatPanel projectId={actualProjectId} currentUserId={currentUserId} />
      ) : (
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-muted-foreground text-sm">
            No project selected
          </div>
        </div>
      )}
    </ResizablePanel>
  )

  const mainPanel = (
    <ResizablePanel
      defaultSize={layout[main] ?? 50}
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
