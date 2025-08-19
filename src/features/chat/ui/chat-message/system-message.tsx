import type { ParsedChatMessage } from '@/features/chat/model/types'
import { getSystemMessageText } from '@/shared/lib/string-utils'
import { Badge } from '@/shared/ui/shadcn/badge'
import styles from './chat-message.module.css'

/**
 * 시스템 메시지 렌더링 컴포넌트
 */
export const SystemMessage = ({ message }: { message: ParsedChatMessage }) => (
  <div className={styles.system}>
    <Badge variant="secondary" className={styles.systemBadge}>
      {getSystemMessageText(message)}
    </Badge>
  </div>
)
