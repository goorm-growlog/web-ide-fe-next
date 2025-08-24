import type { TabKey } from 'src/widgets/sidebar/model/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PositionType = 'left' | 'right'

interface SidebarPositionStore {
  position: PositionType
  setPosition: (position: PositionType) => void
  togglePosition: () => void

  activeTabKey: TabKey
  setActiveTabKey: (key: TabKey) => void

  sidebarLayout: number[]
  setSidebarLayout: (layout: number[]) => void
}

const DEFAULT_SIDEBAR_LAYOUT: number[] = [25, 50, 25]

export const useLayoutStore = create<SidebarPositionStore>()(
  persist(
    (set, get) => ({
      position: 'left',
      setPosition: position => set({ position }),
      togglePosition: () => {
        const currentPosition = get().position
        const newPosition = currentPosition === 'left' ? 'right' : 'right'
        set({ position: newPosition })
      },

      activeTabKey: 'files',
      setActiveTabKey: (activeTabKey: TabKey) => set({ activeTabKey }),

      sidebarLayout: DEFAULT_SIDEBAR_LAYOUT,
      setSidebarLayout: (sidebarLayout: number[]) => set({ sidebarLayout }),
    }),
    {
      name: 'editor-layout',
      partialize: state => ({
        position: state.position,
        sidebarLayout: state.sidebarLayout,
      }),
    },
  ),
)
