import type { ReactElement } from 'react'
import type IconButton from '@/shared/ui/icon-button'
import styles from './tab-switcher.module.css'

type TabSwitcherProps = {
  topTaps: ReactElement<typeof IconButton>[]
  bottomTaps: ReactElement<typeof IconButton>[]
}

const TabSwitcher = ({ topTaps, bottomTaps }: TabSwitcherProps) => {
  return (
    <nav className={styles.switcher}>
      <div className={styles.tabs}>{topTaps}</div>
      <div className={styles.tabs}>{bottomTaps}</div>
    </nav>
  )
}

export default TabSwitcher
