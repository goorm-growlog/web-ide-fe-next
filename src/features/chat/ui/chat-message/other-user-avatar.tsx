import type { ParsedChatMessage } from '@/features/chat/model/types'
import { getInitials } from '@/shared/lib/string-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import styles from './chat-message.module.css'

interface OtherUserAvatarProps {
  message: ParsedChatMessage
}

/**
 * 다른 사용자 메시지의 아바타를 렌더링하는 컴포넌트
 */
export const OtherUserAvatar = ({ message }: OtherUserAvatarProps) => (
  <Avatar className={styles.avatar}>
    <AvatarImage
      src={`/api/avatars/${message.userId}`}
      alt={message.username}
    />
    <AvatarFallback className={styles.avatarFallback}>
      {getInitials(message.username)}
    </AvatarFallback>
  </Avatar>
)
