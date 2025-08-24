import { getInitials } from '@/shared/lib/string-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'

interface OtherUserAvatarProps {
  userImg: string
  username: string
}

export const OtherUserAvatar = ({
  userImg,
  username,
}: OtherUserAvatarProps) => (
  <Avatar className={'-mt-1 h-9 w-9 shrink-0 self-start'}>
    <AvatarImage src={userImg} />
    <AvatarFallback
      className={'bg-primary font-medium text-primary-foreground text-xs'}
    >
      {getInitials(username)}
    </AvatarFallback>
  </Avatar>
)
