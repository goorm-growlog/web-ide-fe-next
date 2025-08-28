import { memo, useCallback } from 'react'
import type { TabKey } from 'src/widgets/sidebar/model/types'
import TabSwitcher from 'src/widgets/sidebar/ui/tab-switcher'
import TogglePanels from 'src/widgets/sidebar/ui/toggle-panels'
import { cn } from '@/shared/lib/utils'
import { TAB_DEFINITIONS } from '@/widgets/sidebar/model/constants'
import { useActiveTab } from '@/widgets/sidebar/model/hooks'

interface PrimarySidebarProps {
  position?: 'left' | 'right'
  className?: string
}

const PANELS_LAYOUT_STYLES =
  'flex min-h-0 flex-1 flex-col h-full w-full overflow-hidden'
const SIDEBAR_LAYOUT_STYLES =
  'flex h-full w-full min-h-0 flex-row overflow-hidden bg-background'

const PrimarySidebar = memo(
  ({ position = 'left', className }: PrimarySidebarProps) => {
    const { activeTab, toggleTab } = useActiveTab()
    const isVisible = activeTab !== null

    const handleTabClick = useCallback(
      (key: TabKey) => toggleTab(key),
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
