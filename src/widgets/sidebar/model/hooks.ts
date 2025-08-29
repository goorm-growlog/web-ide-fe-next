import { useSidebarStore } from 'src/widgets/sidebar/model/sidebar-store'

export const useActiveTab = () => {
  const activeTab = useSidebarStore(state => state.activeTab)
  const toggleTab = useSidebarStore(state => state.toggleTab)
  return { activeTab, toggleTab }
}

export const useOpenPanels = () => {
  const activeTab = useSidebarStore(state => state.activeTab)
  const openPanels = useSidebarStore(state =>
    activeTab ? state.openPanelsByTab[activeTab] || [] : [],
  )
  const togglePanel = useSidebarStore(state => state.togglePanel)
  return { openPanels, togglePanel }
}

export const usePosition = () => {
  const position = useSidebarStore(state => state.position)
  const togglePosition = useSidebarStore(state => state.togglePosition)
  return { position, togglePosition }
}

export const useLayout = () => {
  const layout = useSidebarStore(state => state.layout)
  const setLayout = useSidebarStore(state => state.setLayout)
  return { layout, setLayout }
}

export const useLayoutIndices = () => {
  return useSidebarStore(state => state.layoutIndices)
}
