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
      className={cn('flex h-full min-h-0 w-full flex-col', 'bg-background')}
      defaultValue={panels.map(panel => panel.key)}
    >
      {panels.map(panel => (
        <AccordionItem
          key={panel.key}
          value={panel.key}
          className={cn(
            // Layout
            'flex w-full flex-col overflow-hidden',
            // Borders
            'border-b last:border-b-0',
            // State-based sizing
            'data-[state=closed]:h-10 data-[state=closed]:flex-grow-0',
            'data-[state=open]:h-min-0 data-[state=open]:flex-grow-1',
            // Animation
            'transition[height,flex-grow] duration-300 ease-in-out',
          )}
        >
          <AccordionTrigger
            className={cn(
              // Layout
              'flex h-10 w-full flex-row-reverse items-center justify-end gap-1 px-3',
              // Typography
              'cursor-pointer font-medium text-xs uppercase tracking-wider',
              // Borders
              'rounded-none border-b hover:no-underline',
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
              // Layout
              'h-full min-h-0 w-full overflow-y-auto',
              // Scrollbar
              'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
            )}
            asChild
          >
            <section aria-labelledby={`${panel.key}-trigger`}>
              {panel.content}
            </section>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
})

export default TogglePanels
