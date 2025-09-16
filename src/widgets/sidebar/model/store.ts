import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  PanelKey,
  SidebarStore,
  TabKey,
} from '@/widgets/sidebar/model/types'

// INITIAL_STATE를 store.ts 내부에서 직접 정의 (순환 참조 방지)
const INITIAL_STATE = {
  activeTab: 'files' as TabKey,
  openPanelsByTab: {
    files: ['files'] as PanelKey[],
    search: [],
    invite: ['invite', 'members'] as PanelKey[],
    settings: [],
  },
  position: 'left' as const,
  primarySize: 25,
  secondarySize: 25,
  panelInnerStates: {
    invite: {},
    members: {},
    files: {},
    chats: {},
    search: {},
    settings: {},
  },
}

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

      // 패널 내부 토글 상태를 독립적으로 관리하는 함수
      togglePanelInner: (panelKey: PanelKey, innerKey: string) => {
        const { panelInnerStates } = get()
        const currentState = panelInnerStates[panelKey]?.[innerKey] ?? true

        set({
          panelInnerStates: {
            ...panelInnerStates,
            [panelKey]: {
              ...panelInnerStates[panelKey],
              [innerKey]: !currentState,
            },
          },
        })
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
        panelInnerStates: state.panelInnerStates,
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
