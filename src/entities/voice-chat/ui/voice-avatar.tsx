import { MicOff } from 'lucide-react'
import type { UserAvatarInfo } from '@/entities/user'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'

export interface VoiceAvatarProps {
  user: UserAvatarInfo
  showMicrophoneStatus?: boolean
  isMicrophoneEnabled?: boolean
  showVoiceActivity?: boolean
  isSpeaking?: boolean
  className?: string
}

export function VoiceAvatar({
  user,
  showMicrophoneStatus = false,
  isMicrophoneEnabled = false,
  showVoiceActivity = false,
  isSpeaking = false,
  className,
}: VoiceAvatarProps) {
  return (
    <div className={cn('relative', className)}>
      {/* 사용자 아바타 */}
      <Avatar className="h-6 w-6 border-2" style={{ borderColor: user.color }}>
        <AvatarImage src={user.profileImageUrl} alt={user.name} />
        <AvatarFallback className="bg-muted text-xs">
          {user.initials}
        </AvatarFallback>
      </Avatar>

      {/* 마이크 상태 아이콘 */}
      {showMicrophoneStatus && !isMicrophoneEnabled && (
        <div className="-bottom-0.5 -right-0.5 absolute">
          <MicOff
            className="h-2 w-2 text-red-600"
            strokeWidth={2.5}
            style={{
              filter:
                'drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)',
            }}
          />
        </div>
      )}

      {/* 음성 활동 상태 */}
      {showVoiceActivity && isMicrophoneEnabled && (
        <div
          className={cn(
            '-bottom-0.5 -right-0.5 absolute h-2 w-2 rounded-full border border-background',
            isSpeaking ? 'bg-green-500' : 'bg-gray-400',
          )}
        />
      )}
    </div>
  )
}
