'use client'

import { forwardRef, memo, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface SidebarProps {
  children?: ReactNode
  className?: string
}

const Sidebar = memo(
  forwardRef<HTMLElement, SidebarProps>(({ children, className }, ref) => {
    const defaultEmptyState = (
      <div
        className={cn(
          'flex h-full items-center justify-center',
          'text-muted-foreground text-sm',
        )}
      >
        No content available
      </div>
    )

    return (
      <aside
        ref={ref}
        className={cn(
          'flex h-full flex-1 flex-col overflow-hidden',
          'bg-background',
          className,
        )}
      >
        {children || defaultEmptyState}
      </aside>
    )
  }),
)

export default Sidebar
