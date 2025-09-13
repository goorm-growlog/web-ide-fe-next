'use client'

import { useCallback, useMemo } from 'react'
import { cn } from '@/shared/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn'
import { TAB_DEFINITIONS } from '@/widgets/sidebar/constants/config'
import { useOpenPanels } from '@/widgets/sidebar/model/hooks'
import type { PanelKey, TabKey } from '@/widgets/sidebar/model/types'

const PANEL_CONFIG = {
  HEADER_HEIGHT: 40, // h-10 = 2.5rem = 40px
} as const

interface TogglePanelsProps {
  activeTabKey: TabKey | null
}

const TRIGGER_CLASSES = cn(
  'w-full flex-row-reverse items-center justify-end gap-2 px-3',
  'cursor-pointer rounded-none',
  'text-muted-foreground text-xs uppercase tracking-wider',
  'hover:bg-accent/50 hover:text-foreground hover:no-underline',
  'focus:bg-accent/50',
  'duration-200 ease-out',
  'border-b',
  '[&[data-state=open]>svg]:rotate-0',
  '[&[data-state=closed]>svg]:-rotate-90',
)

const ITEM_CLASSES = cn(
  'flex flex-shrink-0 flex-col',
  'transition-all duration-300 ease-out',
)

const CONTENT_CLASSES = cn(
  'relative h-full flex-shrink-0',
  'transition-all duration-300 ease-out',
)

const TogglePanels = ({ activeTabKey }: TogglePanelsProps) => {
  const { openPanels, togglePanel } = useOpenPanels()

  const { panels, contentHeight } = useMemo(() => {
    const panels =
      TAB_DEFINITIONS.find(tab => tab.key === activeTabKey)?.panels || []
    const totalHeaders = panels.length * PANEL_CONFIG.HEADER_HEIGHT
    const contentHeight =
      openPanels.length > 0
        ? `calc(calc(100vh - ${totalHeaders}px) / ${openPanels.length})`
        : '0px'
    return {
      panels,
      contentHeight,
    }
  }, [activeTabKey, openPanels.length])

  const handlePanelToggle = useCallback(
    (panelKey: PanelKey) => {
      togglePanel(panelKey)
    },
    [togglePanel],
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
          const Component = panelDef.content
          const itemHeight = isOpen
            ? `calc(${PANEL_CONFIG.HEADER_HEIGHT}px + ${contentHeight})`
            : `${PANEL_CONFIG.HEADER_HEIGHT}px`

          return (
            <AccordionItem
              key={panelDef.key}
              value={panelDef.key}
              className={ITEM_CLASSES}
              style={{ height: itemHeight }}
            >
              <AccordionTrigger
                className={TRIGGER_CLASSES}
                style={{
                  height: `${PANEL_CONFIG.HEADER_HEIGHT}px`,
                  borderBottomColor: isOpen ? 'transparent' : '',
                }}
                onClick={() => handlePanelToggle(panelDef.key)}
              >
                {panelDef.title}
              </AccordionTrigger>
              <AccordionContent
                className={CONTENT_CLASSES}
                style={{
                  height: isOpen ? contentHeight : '0px',
                  overflowY: isOpen ? 'auto' : 'hidden',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <Component />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default TogglePanels
