import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TabKey } from '../model/types'

type LayoutType = 'primary-left' | 'primary-right'

interface PanelConfig {
  primaryMinSize: number // tabSwitcher width (48px ≈ 4%)
  secondaryMinSize: number
  maxSize: number
}

interface LayoutStore {
  // 기존 layout 관리
  layout: LayoutType
  setLayout: (layout: LayoutType) => void
  toggleLayout: () => void

  // 탭 상태 관리
  activeTabKey: TabKey
  setActiveTabKey: (key: TabKey) => void

  // 패널 설정
  panelConfig: PanelConfig

  // 패널 그룹 layout 배열 관리
  panelLayout: number[]
  setPanelLayout: (layout: number[]) => void
}

const DEFAULT_PANEL_CONFIG: PanelConfig = {
  primaryMinSize: 4, // tabSwitcher width (48px ≈ 4%)
  secondaryMinSize: 15,
  maxSize: 45,
}

const DEFAULT_PANEL_LAYOUT: number[] = [25, 50, 25] // [primary, main, secondary]

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      // 기존 layout 관리
      layout: 'primary-left',
      setLayout: layout => set({ layout }),
      toggleLayout: () => {
        const currentLayout = get().layout
        const newLayout =
          currentLayout === 'primary-left' ? 'primary-right' : 'primary-left'
        set({ layout: newLayout })
      },

      // 탭 상태 관리 (persist 제외)
      activeTabKey: 'files',
      setActiveTabKey: (activeTabKey: TabKey) => set({ activeTabKey }),

      // 패널 설정
      panelConfig: DEFAULT_PANEL_CONFIG,

      // 패널 그룹 layout 배열 관리
      panelLayout: DEFAULT_PANEL_LAYOUT,
      setPanelLayout: (layout: number[]) => set({ panelLayout: layout }),
    }),
    {
      name: 'sidebar-layout',
      partialize: state => ({
        layout: state.layout,
        panelLayout: state.panelLayout,
      }),
    },
  ),
)
