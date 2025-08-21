import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type PanelKey =
  | 'files'
  | 'files1'
  | 'chats'
  | 'search'
  | 'invite'
  | 'settings'
export interface Panel {
  key: PanelKey
  title: string
  content: ReactNode
}

export type TabKey = 'files' | 'search' | 'invite' | 'settings'
export interface Tab {
  key: TabKey
  panels: Panel[]
  icon: LucideIcon
  position: 'top' | 'bottom'
}
