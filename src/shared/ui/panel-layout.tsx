import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export interface PanelLayoutProps {
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export const PanelLayout = ({
  className,
  style,
  children,
}: PanelLayoutProps) => (
  <aside
    className={cn('flex h-full min-h-0 w-full flex-1 flex-col', className)}
    style={style}
  >
    {children}
  </aside>
)

export default PanelLayout
