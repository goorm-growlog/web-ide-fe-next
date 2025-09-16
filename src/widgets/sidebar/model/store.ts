import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_STATE } from '@/widgets/sidebar/constants/config'
import type { SidebarStore, TabKey } from '@/widgets/sidebar/model/types'

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      toggleTab: (tab: TabKey | null) => {
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
        })
      },

      setPrimarySize: (size: number) => {
        set({ primarySize: size })
      },

      setSecondarySize: (size: number) => {
        set({ secondarySize: size })
      },
    }),
    {
      name: 'sidebar-storage',
      partialize: state => ({
        activeTab: state.activeTab,
        openPanelsByTab: state.openPanelsByTab,
        position: state.position,
        primarySize: state.primarySize,
        secondarySize: state.secondarySize,
      }),
      // 저장된 상태 복원 및 초기값 보장
      onRehydrateStorage: () => state => {
        if (state) {
          // activeTab이 없으면 기본값 설정
          if (!state.activeTab) {
            state.activeTab = INITIAL_STATE.activeTab
          }
        }
      },
    },
  ),
)
