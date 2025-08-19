import styles from './chat-message.module.css'

/**
 * 날짜 헤더 렌더링 컴포넌트
 */
export const DateHeader = ({ date }: { date: string }) => (
  <div className={styles.system}>
    <div className={styles.systemText}>{date}</div>
  </div>
)
