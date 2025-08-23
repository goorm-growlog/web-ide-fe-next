'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn/accordion'
import type { Panel } from '@/widgets/sidebar/model/types'

interface TogglePanelsProps {
  panels: Panel[]
}

const TogglePanels = memo(({ panels }: TogglePanelsProps) => {
  return (
    <Accordion
      type="multiple"
      className={cn(
        'flex h-full min-h-0 w-full flex-col overflow-hidden',
        'bg-background',
      )}
      defaultValue={panels.map(panel => panel.key)}
    >
      {panels.map(panel => (
        <AccordionItem
          key={panel.key}
          value={panel.key}
          className={cn('border-b last:border-b-0')}
        >
          <AccordionTrigger
            className={cn(
              // Layout
              'flex h-10 w-full flex-row-reverse items-center justify-end gap-1 px-3',
              // Borders
              'rounded-none border-b hover:no-underline',
              // Typography
              'cursor-pointer font-medium text-xs uppercase tracking-wider',
              // Colors
              'text-muted-foreground hover:text-foreground',
              // Interactive states
              'hover:bg-accent/50 focus:bg-accent/50',
              // Animation
              'transition-colors duration-200',
              // State-specific styles
              'data-[state=open]:border-b-transparent',
              '[&[data-state=closed]>svg]:-rotate-90',
              '[&[data-state=open]>svg]:rotate-0',
            )}
            aria-label={`Toggle ${panel.title} panel`}
          >
            <span>{panel.title}</span>
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              // Use height instead of flex-1 to avoid interfering with animations
              'min-h-0 w-full overflow-y-auto',
              // Scroller
              'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
            )}
          >
            {panel.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
})

export default TogglePanels
