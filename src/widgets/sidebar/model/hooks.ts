import { useSidebarStore } from '@/widgets/sidebar/model/store'

/**
 * 통합된 사이드바 훅
 * 모든 사이드바 관련 상태와 액션을 하나의 훅으로 제공
 */
export const useSidebar = () => {
  const activeTab = useSidebarStore(state => state.activeTab)
  const toggleTab = useSidebarStore(state => state.toggleTab)

  const openPanels = useSidebarStore(state =>
    activeTab ? state.openPanelsByTab[activeTab] || [] : [],
  )
  const togglePanel = useSidebarStore(state => state.togglePanel)

  const position = useSidebarStore(state => state.position)
  const togglePosition = useSidebarStore(state => state.togglePosition)

  const layout = useSidebarStore(state => state.layout)
  const setLayout = useSidebarStore(state => state.setLayout)

  const layoutIndices = useSidebarStore(state => state.layoutIndices)

  return {
    // 탭 관련
    activeTab,
    toggleTab,

    // 패널 관련
    openPanels,
    togglePanel,

    // 위치 관련
    position,
    togglePosition,

    // 레이아웃 관련
    layout,
    setLayout,
    layoutIndices,
  }
}

// 기존 개별 훅들 (하위 호환성을 위해 유지)
export const useActiveTab = () => {
  const { activeTab, toggleTab } = useSidebar()
  return { activeTab, toggleTab }
}

export const useOpenPanels = () => {
  const { openPanels, togglePanel } = useSidebar()
  return { openPanels, togglePanel }
}

export const usePosition = () => {
  const { position, togglePosition } = useSidebar()
  return { position, togglePosition }
}

export const useLayout = () => {
  const { layout, setLayout } = useSidebar()
  return { layout, setLayout }
}

export const useLayoutIndices = () => {
  const { layoutIndices } = useSidebar()
  return layoutIndices
}
