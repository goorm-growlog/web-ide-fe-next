import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_STATE } from '@/widgets/sidebar/constants/config'
import type { SidebarStore, TabKey } from '@/widgets/sidebar/model/types'

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      toggleTab: (tab: TabKey) => {
        const { activeTab } = get()
        set({ activeTab: activeTab === tab ? null : tab })
      },

      togglePanel: panel => {
        const { activeTab, openPanelsByTab } = get()
        if (!activeTab) return

        const currentPanels = openPanelsByTab[activeTab] || []
        const isOpen = currentPanels.includes(panel)

        set({
          openPanelsByTab: {
            ...openPanelsByTab,
            [activeTab]: isOpen
              ? currentPanels.filter(p => p !== panel)
              : [...currentPanels, panel],
          },
        })
      },

      togglePosition: () => {
        const { position } = get()
        const newPosition = position === 'left' ? 'right' : 'left'
        set({
          position: newPosition,
          layoutIndices: {
            primary: newPosition === 'left' ? 0 : 2,
            secondary: newPosition === 'left' ? 2 : 0,
            main: 1,
          },
        })
      },

      setLayout: layout => {
        set({ layout: [...layout] })
      },
    }),
    {
      name: 'sidebar-storage',
      partialize: state => ({
        activeTab: state.activeTab,
        openPanelsByTab: state.openPanelsByTab,
        position: state.position,
        layout: state.layout,
        layoutIndices: state.layoutIndices,
      }),
    },
  ),
)
