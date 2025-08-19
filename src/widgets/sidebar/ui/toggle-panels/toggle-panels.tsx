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
  panels: Panel[]
}

const TogglePanels = ({ panels }: TogglePanelsProps) => {
  if (!panels) return null

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

export default TogglePanels
