import type { ReactElement } from 'react'
import type IconButton from '@/shared/ui/icon-button'
import styles from './navigation.module.css'

type NavigationProps = {
  topButtons: ReactElement<typeof IconButton>[]
  bottomButtons: ReactElement<typeof IconButton>[]
}

const Navigation = ({ topButtons, bottomButtons }: NavigationProps) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.buttons}>{topButtons}</div>
      <div className={styles.buttons}>{bottomButtons}</div>
    </nav>
  )
}

export default Navigation
