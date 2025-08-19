'use client'

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

const TogglePanels = ({ panels }: TogglePanelsProps) => {
  if (!panels) return null

  return (
    <Accordion
      type="multiple"
      className={cn(
        'flex h-full min-h-0 w-full flex-col',
        'border-r',
        'bg-background',
      )}
      defaultValue={panels.map(panel => panel.type)}
    >
      {panels.map(panel => {
        return (
          <AccordionItem
            key={panel.type}
            value={panel.type}
            className={cn(
              'flex min-h-10 flex-col transition-all duration-200 ease-in-out',
              'data-[state=closed]:h-10 data-[state=closed]:flex-none',
              'data-[state=open]:min-h-0 data-[state=open]:flex-1',
              'border-b last:border-b-0',
            )}
          >
            <AccordionTrigger
              className={cn(
                'flex h-10 w-full flex-row-reverse items-center justify-end gap-1 px-3',
                'font-medium text-xs uppercase tracking-wider',
                'border-b hover:no-underline',
                'data-[state=open]:border-b-transparent',
                'hover:bg-accent/50 focus:bg-accent/50',
                'text-muted-foreground hover:text-foreground',
                'transition-colors duration-200',
                '[&[data-state=closed]>svg]:-rotate-90',
                '[&[data-state=open]>svg]:rotate-0',
                'cursor-pointer',
              )}
            >
              <span>{panel.title}</span>
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                'h-full min-h-0 w-full overflow-y-auto',
                'p-2 pb-4',
                'bg-background/50',
                'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
              )}
            >
              {panel.content}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default TogglePanels
