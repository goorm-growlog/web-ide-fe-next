'use client'

import { memo } from 'react'
import { cn } from '@/shared/lib/utils'
import IconButton from '@/shared/ui/icon-button/icon-button'
import type { Tab, TabKey } from '@/widgets/sidebar/model/types'

interface TabSwitcherProps {
  tabs: Tab[]
  activeTabKey: TabKey | null
  onTabClick: (key: TabKey) => void
  position?: 'left' | 'right'
}

const TabSwitcher = memo(
  ({ tabs, activeTabKey, onTabClick, position = 'left' }: TabSwitcherProps) => {
    const handleTabClick = (key: TabKey) => {
      onTabClick(key)
    }

    const topTabs = tabs.filter(tab => tab.position === 'top')
    const bottomTabs = tabs.filter(tab => tab.position === 'bottom')

    return (
      <nav
        className={cn(
          'flex flex-col items-center justify-between gap-4 p-2',
          position === 'left' ? 'border-r' : 'border-l',
        )}
      >
        {topTabs.length > 0 && (
          <div className="flex flex-col gap-2">
            {topTabs.map(tab => (
              <IconButton
                key={tab.key}
                Icon={tab.icon}
                title={tab.title}
                onClick={() => handleTabClick(tab.key)}
                isSelected={tab.key === activeTabKey}
                className="h-10 w-10 rounded-lg transition-all duration-200"
              />
            ))}
          </div>
        )}

        {bottomTabs.length > 0 && (
          <div className="flex flex-col gap-2">
            {bottomTabs.map(tab => (
              <IconButton
                key={tab.key}
                Icon={tab.icon}
                title={tab.title}
                onClick={() => handleTabClick(tab.key)}
                isSelected={tab.key === activeTabKey}
                className="h-10 w-10 rounded-lg transition-all duration-200"
              />
            ))}
          </div>
        )}
      </nav>
    )
  },
)

export default TabSwitcher
