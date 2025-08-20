'use client'

import { memo, useMemo } from 'react'
import { cn } from '@/shared/lib/utils'
import IconButton from '@/shared/ui/icon-button/icon-button'
import type { Tab, TabKey } from '@/widgets/sidebar/model/types'

interface TabSwitcherProps {
  tabs: Tab[]
  activeTabKey: TabKey | null
  onTabClick: (key: TabKey) => void
  position?: 'left' | 'right'
  className?: string
}

const TabSwitcher = memo(
  ({
    tabs,
    activeTabKey,
    onTabClick,
    position = 'left',
    className,
  }: TabSwitcherProps) => {
    const { topTabs, bottomTabs } = useMemo(
      () => ({
        topTabs: tabs.filter(tab => tab.position === 'top'),
        bottomTabs: tabs.filter(tab => tab.position === 'bottom'),
      }),
      [tabs],
    )

    return (
      <nav
        className={cn(
          'flex h-full flex-col items-center justify-between gap-1 p-2 md:gap-2',
          position === 'left' ? 'border-r' : 'border-l',
          className,
        )}
      >
        {topTabs.length > 0 && (
          <div className="flex flex-col gap-1 md:gap-2">
            {topTabs.map(tab => (
              <IconButton
                key={tab.key}
                Icon={tab.icon}
                onClick={() => onTabClick(tab.key)}
                isSelected={tab.key === activeTabKey}
                className="h-8 w-8 rounded-lg transition-all duration-200 md:h-9 md:w-9 lg:h-10 lg:w-10"
              />
            ))}
          </div>
        )}

        {bottomTabs.length > 0 && (
          <div className="flex flex-col gap-1 md:gap-2">
            {bottomTabs.map(tab => (
              <IconButton
                key={tab.key}
                Icon={tab.icon}
                onClick={() => onTabClick(tab.key)}
                isSelected={tab.key === activeTabKey}
                className="h-8 w-8 rounded-lg transition-all duration-200 md:h-9 md:w-9 lg:h-10 lg:w-10"
              />
            ))}
          </div>
        )}
      </nav>
    )
  },
)

export default TabSwitcher
