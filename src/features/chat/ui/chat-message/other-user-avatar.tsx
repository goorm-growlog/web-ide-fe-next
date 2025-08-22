import type { ParsedChatMessage } from '@/features/chat/model/types'
import { getInitials } from '@/shared/lib/string-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'

// 아바타 관련 스타일 상수
const AVATAR_STYLES = {
  // 다른 사용자 아바타 (음수 마진으로 메시지와 정렬)
  otherUserAvatar: '-mt-5 h-9 w-9 shrink-0 self-start',

  // 아바타 폴백 스타일
  avatarFallback: 'bg-primary text-xs font-medium text-primary-foreground',
} as const

interface OtherUserAvatarProps {
  message: ParsedChatMessage
}

/**
 * 다른 사용자 메시지의 아바타를 렌더링하는 컴포넌트
 */
export const OtherUserAvatar = ({ message }: OtherUserAvatarProps) => (
  <Avatar className={AVATAR_STYLES.otherUserAvatar}>
    <AvatarImage
      src={`/api/avatars/${message.userId}`}
      alt={message.username}
    />
    <AvatarFallback className={AVATAR_STYLES.avatarFallback}>
      {getInitials(message.username)}
    </AvatarFallback>
  </Avatar>
)
