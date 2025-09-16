import { useMemo } from 'react'
import { useSidebarStore } from '@/widgets/sidebar/model/store'

/**
 * 통합된 사이드바 훅
 * 모든 사이드바 관련 상태와 액션을 하나의 훅으로 제공
 */
export const useSidebar = () => {
  const activeTab = useSidebarStore(state => state.activeTab)
  const toggleTab = useSidebarStore(state => state.toggleTab)

  // useMemo를 사용하여 무한 루프 방지
  const openPanelsByTab = useSidebarStore(state => state.openPanelsByTab)
  const openPanels = useMemo(
    () => (activeTab ? openPanelsByTab[activeTab] || [] : []),
    [activeTab, openPanelsByTab],
  )
  const togglePanel = useSidebarStore(state => state.togglePanel)

  const position = useSidebarStore(state => state.position)
  const togglePosition = useSidebarStore(state => state.togglePosition)

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

// 레이아웃 관련 훅들은 autoSaveId로 자동 관리되므로 제거됨
