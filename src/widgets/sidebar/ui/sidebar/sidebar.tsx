'use client'

import { useState } from 'react'

import TogglePanels from '@/widgets/sidebar/ui/toggle-panels/toggle-panels'
import type { Tab, TabKey } from '../../model/types'
import TabSwitcher from '../tab-switcher/tab-switcher'
import styles from './sidebar.module.css'

interface SidebarProps {
  tabs: Tab[]
}

const Sidebar = ({ tabs }: SidebarProps) => {
  const [activeTabKey, setActiveTabKey] = useState<TabKey | null>(
    tabs[0]?.key ?? null,
  )
  const handleTabClick = (key: TabKey) => setActiveTabKey(key)
  const activeTab = tabs.find(tab => tab.key === activeTabKey)

  return (
    <div className={styles.container}>
      <TabSwitcher
        tabs={tabs}
        activeTabKey={activeTabKey}
        onTabClick={handleTabClick}
      />
      {activeTab && <TogglePanels panels={activeTab.panels} />}
    </div>
  )
}

export default Sidebar
