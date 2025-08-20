'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/utils'
import type { Panel } from '../../model/types'
import TogglePanels from '../toggle-panels/toggle-panels'

interface SidebarProps {
  panels?: Panel[]
  className?: string
}

const Sidebar = memo(({ panels = [], className }: SidebarProps) => {
  if (panels.length === 0) {
    return (
      <aside
        className={cn(
          'flex h-full flex-1 flex-col overflow-hidden',
          'bg-muted/20',
          className,
        )}
      >
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          {'No panels available'}
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={cn(
        'flex h-full flex-1 flex-col overflow-hidden',
        'bg-background',
        className,
      )}
    >
      <TogglePanels panels={panels} />
    </aside>
  )
})

export default Sidebar
