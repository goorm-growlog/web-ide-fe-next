'use client'

import { useCallback, useMemo } from 'react'
import type { ChatReturn } from '@/features/chat/types/client'
import type { FileTreeReturn } from '@/features/file-explorer/types/client'
import { cn } from '@/shared/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn/accordion'
import { TAB_DEFINITIONS } from '@/widgets/sidebar/constants/config'
import { useOpenPanels } from '@/widgets/sidebar/model/hooks'
import type {
  PanelKey,
  PanelRenderProps,
  TabKey,
} from '@/widgets/sidebar/model/types'

const PANEL_CONFIG = {
  HEADER_HEIGHT: 40, // h-10 = 2.5rem = 40px
} as const

interface TogglePanelsProps {
  activeTabKey: TabKey | null
  fileTreeData?: FileTreeReturn | undefined
  chatData?: ChatReturn | undefined
  projectId?: string | undefined
  onFileOpen?: ((filePath: string) => void) | undefined
}

const TRIGGER_CLASSES = cn(
  'w-full flex-row-reverse items-center justify-end gap-2 px-3',
  'cursor-pointer rounded-none',
  'text-muted-foreground text-xs uppercase tracking-wider',
  'hover:bg-accent/50 hover:text-foreground hover:no-underline',
  'focus:bg-accent/50',
  'duration-200 ease-out',
  '[&[data-state=open]>svg]:rotate-0',
  '[&[data-state=closed]>svg]:-rotate-90',
)

const ITEM_CLASSES = cn(
  'flex flex-shrink-0 flex-col',
  'transition-all duration-300 ease-out',
)

const TogglePanels = ({
  activeTabKey,
  fileTreeData,
  chatData,
  projectId,
  onFileOpen,
}: TogglePanelsProps) => {
  const { openPanels, togglePanel } = useOpenPanels()

  const { panels } = useMemo(() => {
    const panels =
      TAB_DEFINITIONS.find(tab => tab.key === activeTabKey)?.panels || []
    return {
      panels,
    }
  }, [activeTabKey])

  const handlePanelToggle = useCallback(
    (panelKey: PanelKey) => {
      togglePanel(panelKey)
    },
    [togglePanel],
  )

  // 패널 렌더링에 필요한 props 준비
  const panelRenderProps: PanelRenderProps = useMemo(
    () => ({
      fileTreeData,
      chatData,
      projectId,
      onFileOpen,
    }),
    [fileTreeData, chatData, projectId, onFileOpen],
  )

  return (
    <div className="h-dvh bg-background">
      <Accordion
        type="multiple"
        value={openPanels}
        className="flex h-full flex-col"
      >
        {panels.map(panelDef => {
          const isOpen = openPanels.includes(panelDef.key)

          return (
            <AccordionItem
              key={panelDef.key}
              value={panelDef.key}
              className={cn(ITEM_CLASSES, 'flex flex-col')}
            >
              <AccordionTrigger
                className={cn(TRIGGER_CLASSES, !isOpen && 'border-b')}
                style={{
                  height: `${PANEL_CONFIG.HEADER_HEIGHT}px`,
                }}
                onClick={() => handlePanelToggle(panelDef.key)}
              >
                {panelDef.title}
              </AccordionTrigger>
              <AccordionContent>
                {panelDef.render(panelRenderProps)}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default TogglePanels
