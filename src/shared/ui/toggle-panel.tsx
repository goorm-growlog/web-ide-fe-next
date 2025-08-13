import type { ReactNode } from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/shadcn/accordion'

import styles from './toggle-panel.module.css'

export interface TogglePanelProps {
  title: string
  children: ReactNode
}

const TogglePanel = ({ title, children }: TogglePanelProps) => {
  return (
    <AccordionItem className={styles.togglePanelItem} value={title}>
      <AccordionTrigger className={styles.togglePanelTitle}>
        {title}
      </AccordionTrigger>
      <AccordionContent className={styles.togglePanelContent}>
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

export default TogglePanel
