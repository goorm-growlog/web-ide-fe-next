import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ChatReturn } from '@/features/chat/types/client'
import type { FileTreeReturn } from '@/features/file-explorer/types/client'

export type TabKey = 'files' | 'search' | 'invite' | 'settings'
export type PanelKey = 'files' | 'chats' | 'search' | 'invite' | 'settings'
export type PositionType = 'left' | 'right'

// 패널 렌더링에 필요한 공통 props
export interface PanelRenderProps {
  fileTreeData?: FileTreeReturn | undefined
  chatData?: ChatReturn | undefined
  projectId?: string | undefined
  onFileOpen?: ((filePath: string) => void) | undefined
}

// 슬롯 기반 패널 정의
export interface PanelSlot {
  key: PanelKey
  title: string
  render: (props: PanelRenderProps) => ReactNode
}

export interface Tab {
  key: TabKey
  panels: readonly PanelSlot[]
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
  primarySize: number
  secondarySize: number
}

export interface SidebarStore extends SidebarState {
  toggleTab: (tab: TabKey | null) => void
  togglePanel: (panel: PanelKey) => void
  togglePosition: () => void
  setPrimarySize: (size: number) => void
  setSecondarySize: (size: number) => void
}
