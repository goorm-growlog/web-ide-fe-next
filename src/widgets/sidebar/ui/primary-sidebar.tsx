import { memo, type ReactNode, useCallback, useMemo } from 'react'
import type {
  Panel,
  PanelKey,
  Tab,
  TabKey,
} from 'src/widgets/sidebar/model/types'
import TabSwitcher from 'src/widgets/sidebar/ui/tab-switcher'
import TogglePanels from 'src/widgets/sidebar/ui/toggle-panels'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel'
import Invite from '@/features/invite/ui/invite'
import Search from '@/features/search/ui/search'
import { cn } from '@/shared/lib/utils'
import {
  PANEL_DEFINITIONS,
  TAB_DEFINITIONS,
} from '@/widgets/sidebar/constants/tab-definitions'
import { useLayoutStore } from '@/widgets/sidebar/model/store'
import Sidebar from '@/widgets/sidebar/ui/sidebar'

interface PrimarySidebarProps {
  position?: 'left' | 'right'
  className?: string
}

const SIDEBAR_PANELS: Record<PanelKey, () => ReactNode> = {
  files: () => <FileExplorerPanel />,
  chats: () => <ChatPanel />,
  search: () => <Search />,
  invite: () => <Invite />,
  settings: () => (
    <div className="p-4 text-muted-foreground text-sm">Settings</div>
  ),
}

const PrimarySidebar = memo(
  ({ position = 'left', className }: PrimarySidebarProps) => {
    const { activeTabKey, setActiveTabKey } = useLayoutStore()

    const handleTabClick = useCallback(
      (key: TabKey) => setActiveTabKey(key),
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
