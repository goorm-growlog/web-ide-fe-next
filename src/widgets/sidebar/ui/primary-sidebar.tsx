import { memo, useCallback } from 'react'
import { cn } from '@/shared/lib/utils'
import { TAB_DEFINITIONS } from '@/widgets/sidebar/constants/config'
import type { TabKey } from '@/widgets/sidebar/model/types'
import TabSwitcher from '@/widgets/sidebar/ui/tab-switcher'
import TogglePanels from '@/widgets/sidebar/ui/toggle-panels'

interface PrimarySidebarProps {
  position?: 'left' | 'right'
  activeTab: TabKey | null
  toggleTab: (tab: TabKey) => void
  className?: string
}

const PANELS_LAYOUT_STYLES =
  'flex min-h-0 flex-1 flex-col h-full w-full overflow-hidden'
const SIDEBAR_LAYOUT_STYLES =
  'flex h-full w-full min-h-0 flex-row overflow-hidden bg-background'

const PrimarySidebar = memo(
  ({
    position = 'left',
    activeTab,
    toggleTab,
    className,
  }: PrimarySidebarProps) => {
    const isVisible = activeTab !== null

    const handleTabClick = useCallback(
      (tab: TabKey) => toggleTab(tab),
      [toggleTab],
    )

    const tabSwitcher = (
      <TabSwitcher
        tabs={TAB_DEFINITIONS}
        activeTabKey={activeTab}
        onTabClick={handleTabClick}
        position={position}
        className="w-12 flex-shrink-0 md:w-14 lg:w-16"
      />
    )

    const togglePanels = (
      <div className={PANELS_LAYOUT_STYLES}>
        <TogglePanels activeTabKey={activeTab} />
      </div>
    )

    return (
      <div className={cn(SIDEBAR_LAYOUT_STYLES, className)}>
        {position === 'right' ? (
          <>
            {isVisible && togglePanels}
            {tabSwitcher}
          </>
        ) : (
          <>
            {tabSwitcher}
            {isVisible && togglePanels}
          </>
        )}
      </div>
    )
  },
)

PrimarySidebar.displayName = 'PrimarySidebar'

export default PrimarySidebar
