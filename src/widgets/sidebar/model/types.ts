import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'

export type TabKey = 'files' | 'search' | 'invite' | 'settings'
export type PanelKey = 'files' | 'chats' | 'search' | 'invite' | 'settings'
export type PositionType = 'left' | 'right'

export interface Panel {
  key: PanelKey
  title: string
  content: ComponentType
}

export interface Tab {
  key: TabKey
  panels: readonly Panel[]
  icon: LucideIcon
  position: 'top' | 'bottom'
}

export interface SidebarConfig {
  primaryMinSize: number
  secondaryMinSize: number
  maxSize: number
}

export interface LayoutIndices {
  primary: number
  secondary: number
  main: number
}

export interface SidebarState {
  activeTab: TabKey | null
  openPanelsByTab: Record<TabKey, PanelKey[]>
  position: PositionType
  layout: number[]
  layoutIndices: LayoutIndices
}

export interface SidebarStore extends SidebarState {
  toggleTab: (tab: TabKey) => void
  togglePanel: (panel: PanelKey) => void
  togglePosition: () => void
  setLayout: (layout: number[]) => void
}
