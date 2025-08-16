'use client'

import {
  FilesIcon,
  Search,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
} from 'lucide-react'
import { useState } from 'react'
import FileExplorer from '@/features/file-explorer/ui/file-explorer'
import Invite from '@/features/invite/ui/invite'
import type { Tab, TabKey } from '../../model/types'
import TabSwitcher from '../tab-switcher/tab-switcher'
import { TogglePanels } from '../toggle-panels/toggle-panels'
import styles from './sidebar.module.css'

const mockItems = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)

const mockTabs: Tab[] = [
  {
    key: 'files',
    icon: FilesIcon,
    title: 'Files',
    position: 'top',
    panels: [
      {
        type: 'files',
        title: 'Files',
        content: <FileExplorer />,
      },
      {
        type: 'chats',
        title: 'Chats',
        content: (
          <div>
            {mockItems.map(item => (
              <div key={item}>{item}</div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    key: 'search',
    icon: SearchIcon,
    title: 'Search',
    position: 'top',
    panels: [{ type: 'search', title: 'Search', content: <Search /> }],
  },
  {
    key: 'invite',
    icon: Share2Icon,
    title: 'Invite',
    position: 'top',
    panels: [{ type: 'invite', title: 'Invite', content: <Invite /> }],
  },
  {
    key: 'settings',
    icon: SettingsIcon,
    title: 'Settings',
    position: 'bottom',
    panels: [],
  },
]

interface SidebarProps {
  tabs?: Tab[]
}

const Sidebar = ({ tabs = mockTabs }: SidebarProps) => {
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
