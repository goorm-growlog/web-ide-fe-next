import { memo, type ReactNode, useCallback, useMemo } from 'react'
import { cn } from '@/shared/lib/utils'
import { SIDEBAR_PANELS } from '../../constants/sidebar-panels'
import { PANEL_DEFINITIONS, TAB_DEFINITIONS } from '../../model/tab-definitions'
import type { Panel, PanelKey, Tab, TabKey } from '../../model/types'
import { useLayoutStore } from '../../store/layout-store'
import Sidebar from '../sidebar/sidebar'
import TabSwitcher from '../tab-switcher/tab-switcher'
import TogglePanels from '../toggle-panels/toggle-panels'

interface PrimarySidebarProps {
  position?: 'left' | 'right'
  className?: string
}

const PrimarySidebar = memo(
  ({ position = 'left', className }: PrimarySidebarProps) => {
    const { activeTabKey, setActiveTabKey } = useLayoutStore()

    const handleTabClick = useCallback(
      (key: TabKey) => {
        setActiveTabKey(key)
      },
      [setActiveTabKey],
    )

    const getPanelContent = useCallback((key: PanelKey): ReactNode => {
      return (
        SIDEBAR_PANELS[key]?.() || (
          <div className="p-4 text-muted-foreground text-sm">
            Unknown panel: {key}
          </div>
        )
      )
    }, [])

    const activePanels = useMemo((): Panel[] => {
      return PANEL_DEFINITIONS[activeTabKey].map(def => ({
        ...def,
        content: getPanelContent(def.key),
      }))
    }, [activeTabKey, getPanelContent])

    const tabs = useMemo((): Tab[] => {
      return TAB_DEFINITIONS.map(def => ({
        ...def,
        panels: def.key === activeTabKey ? activePanels : [],
      }))
    }, [activeTabKey, activePanels])

    const sidebarContent = (
      <Sidebar>
        <TogglePanels panels={activePanels} />
      </Sidebar>
    )

    const tabSwitcher = (
      <TabSwitcher
        tabs={tabs}
        activeTabKey={activeTabKey}
        onTabClick={handleTabClick}
        position={position}
        className="w-12 flex-shrink-0 md:w-14 lg:w-16"
      />
    )

    return (
      <div className={cn('flex h-full w-full', 'bg-background', className)}>
        {position === 'right' ? (
          <>
            {sidebarContent}
            {tabSwitcher}
          </>
        ) : (
          <>
            {tabSwitcher}
            {sidebarContent}
          </>
        )}
      </div>
    )
  },
)

PrimarySidebar.displayName = 'PrimarySidebar'

export default PrimarySidebar
