'use client'

import IconButton from '@/shared/ui/icon-button/icon-button'
import type { Tab, TabKey } from '../../model/types'
import styles from './tab-switcher.module.css'

interface TabSwitcherProps {
  tabs: Tab[]
  activeTabKey: TabKey | null
  onTabClick: (key: TabKey) => void
}

const TabSwitcher = ({ tabs, activeTabKey, onTabClick }: TabSwitcherProps) => {
  const topTabs = tabs
    .filter(tab => tab.position === 'top')
    .map(tab => (
      <IconButton
        key={tab.key}
        Icon={tab.icon}
        aria-label={tab.title}
        isSelected={activeTabKey === tab.key}
        onClick={() => onTabClick(tab.key)}
      />
    ))

  const bottomTabs = tabs
    .filter(tab => tab.position === 'bottom')
    .map(tab => (
      <IconButton
        key={tab.key}
        Icon={tab.icon}
        aria-label={tab.title}
        isSelected={activeTabKey === tab.key}
        onClick={() => onTabClick(tab.key)}
      />
    ))

  return (
    <nav className={styles.switcherContainer}>
      <div className={styles.tabsContainer}>{topTabs}</div>
      <div className={styles.tabsContainer}>{bottomTabs}</div>
    </nav>
  )
}

export default TabSwitcher
