import type { CSSProperties, ReactNode } from 'react'
import { SCROLLABLE_PANEL_CONTENT_STYLES } from '@/shared/constants/ui'
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
    className={cn(
      'flex h-full min-h-full w-full flex-1 flex-col',
      SCROLLABLE_PANEL_CONTENT_STYLES,
      className,
    )}
    style={style}
  >
    {children}
  </aside>
)

export default PanelLayout
