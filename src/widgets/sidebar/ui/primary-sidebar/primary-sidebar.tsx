import { memo, useCallback, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import Sidebar from '@/widgets/sidebar/ui/sidebar/sidebar'
import { mockTabs } from '../../fixtures/mock-data'
import type { TabKey } from '../../model/types'
import TabSwitcher from '../tab-switcher/tab-switcher'

interface PrimarySidebarProps {
  position?: 'left' | 'right'
  className?: string
  defaultTabKey?: TabKey
}

const PrimarySidebar = memo(
  ({
    position = 'left',
    className,
    defaultTabKey = 'files',
  }: PrimarySidebarProps) => {
    const [activeTabKey, setActiveTabKey] = useState<TabKey>(defaultTabKey)

    const handleTabClick = useCallback((key: TabKey) => {
      setActiveTabKey(key)
    }, [])

    const activeTab = mockTabs.find(tab => tab.key === activeTabKey)

    return (
      <div
        className={cn(
          'flex w-80 min-w-80 max-w-96',
          'bg-background',
          className,
        )}
      >
        {position === 'right' ? (
          <>
            <Sidebar panels={activeTab?.panels} />
            <TabSwitcher
              tabs={mockTabs}
              activeTabKey={activeTabKey}
              onTabClick={handleTabClick}
              position={position}
            />
          </>
        ) : (
          <>
            <TabSwitcher
              tabs={mockTabs}
              activeTabKey={activeTabKey}
              onTabClick={handleTabClick}
              position={position}
            />
            <Sidebar panels={activeTab?.panels} />
          </>
        )}
      </div>
    )
  },
)

export default PrimarySidebar
