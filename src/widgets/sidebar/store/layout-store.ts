import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TabKey } from '../model/types'

type LayoutType = 'primary-left' | 'primary-right'

interface PanelConfig {
  primaryMinSize: number
  secondaryMinSize: number
  maxSize: number
}

interface LayoutStore {
  // Layout management
  layout: LayoutType
  setLayout: (layout: LayoutType) => void
  toggleLayout: () => void

  // Tab state management
  activeTabKey: TabKey
  setActiveTabKey: (key: TabKey) => void

  // Panel configuration
  panelConfig: PanelConfig

  // Panel layout array management
  panelLayout: number[]
  setPanelLayout: (layout: number[]) => void
}

const DEFAULT_PANEL_CONFIG: PanelConfig = {
  primaryMinSize: 2.5,
  secondaryMinSize: 2.5,
  maxSize: 45,
}

// Panel sizes: [primary, main, secondary]
const DEFAULT_PANEL_LAYOUT: number[] = [25, 50, 25]

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      // Layout management
      layout: 'primary-left',
      setLayout: layout => set({ layout }),
      toggleLayout: () => {
        const currentLayout = get().layout
        const newLayout =
          currentLayout === 'primary-left' ? 'primary-right' : 'primary-left'
        set({ layout: newLayout })
      },

      activeTabKey: 'files',
      setActiveTabKey: (activeTabKey: TabKey) => set({ activeTabKey }),

      // Panel configuration
      panelConfig: DEFAULT_PANEL_CONFIG,

      // Panel layout array management
      panelLayout: DEFAULT_PANEL_LAYOUT,
      setPanelLayout: (layout: number[]) => set({ panelLayout: layout }),
    }),
    {
      name: 'editor-layout',
      partialize: state => ({
        layout: state.layout,
        panelLayout: state.panelLayout,
      }),
    },
  ),
)
