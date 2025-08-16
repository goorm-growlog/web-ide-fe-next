'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn/accordion'
import type { Panel } from '@/widgets/sidebar/model/types'
import styles from './toggle-panels.module.css'

interface TogglePanelsProps {
  panels?: Panel[]
}

const mockPanels: Panel[] = [
  {
    type: 'files',
    title: 'Files',
    content: <div>Content 1</div>,
  },
  {
    type: 'search',
    title: 'Search',
    content: <div>Content 2</div>,
  },
  {
    type: 'invite',
    title: 'Invite',
    content: <div>Content 3</div>,
  },
]

export function TogglePanels({ panels = mockPanels }: TogglePanelsProps) {
  return (
    <Accordion type="multiple" className={styles.container}>
      {panels.map(panel => {
        return (
          <AccordionItem
            key={panel.type}
            value={panel.type}
            className={styles.item}
          >
            <AccordionTrigger className={styles.title}>
              {panel.title}
            </AccordionTrigger>
            <AccordionContent className={styles.content}>
              {panel.content}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
