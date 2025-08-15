import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type PanelType = 'files' | 'chats' | 'search' | 'invite' | 'members'
export type Panel = {
  type: PanelType
  title: string
  content: ReactNode
}

export type TabKey = 'files' | 'search' | 'invite' | 'settings'
export type Tab = {
  key: TabKey
  icon: LucideIcon
  title: string
  position: 'top' | 'bottom'
  panels: Panel[]
}
