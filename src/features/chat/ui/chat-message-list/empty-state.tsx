import styles from './chat-message-list.module.css'

/**
 * 빈 상태 렌더링 컴포넌트
 */
export const EmptyState = () => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>💬</div>
    <p className={styles.emptyText}>No messages yet</p>
    <p className={styles.emptySubtext}>Send your first message!</p>
  </div>
)
