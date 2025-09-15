'use client'

import { Mic, MicOff, RotateCcw, Wifi, WifiOff } from 'lucide-react'
import type { ProjectMember } from '@/entities/project/model/types'
import { createUserAvatarInfo } from '@/entities/user'
import type { Participant } from '@/entities/voice-chat/model/types'
import { VoiceAvatar } from '@/entities/voice-chat/ui/voice-avatar'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'
import { VolumeSlider } from '@/shared/ui/volume-slider'

interface VoiceChatStatusProps {
  isConnected: boolean
  isConnecting: boolean
  hasError: boolean
  error?: string | null
  isDisconnected: boolean
  isMicrophoneEnabled: boolean
  isSpeaking: boolean
  isTogglingMicrophone?: boolean
  participants: Participant[]
  projectMembers: ProjectMember[]
  currentUser?:
    | {
        name: string
        userId: string
        profileImageUrl?: string
      }
    | undefined
  onReconnect?: (() => void) | undefined
  onToggleMicrophone?: (() => void) | undefined
  onVolumeChange?:
    | ((participantIdentity: string, volume: number) => void)
    | undefined
  className?: string
}

export function VoiceChatStatus({
  isConnected,
  isConnecting,
  hasError,
  isDisconnected,
  isMicrophoneEnabled,
  isSpeaking,
  isTogglingMicrophone = false,
  participants,
  projectMembers,
  currentUser,
  onReconnect,
  onToggleMicrophone,
  onVolumeChange,
  className,
}: VoiceChatStatusProps) {
  // 상태 표시 아이콘 (이상한 상태일 때만)
  const getStatusIcon = () => {
    if (isConnecting) {
      return (
        <div className="flex items-center gap-1">
          <Wifi className="h-4 w-4 animate-pulse text-yellow-500" />
          <span className="text-xs text-yellow-600">연결 중...</span>
        </div>
      )
    }
    if (hasError) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    if (isDisconnected) {
      return <Wifi className="h-4 w-4 text-gray-500" />
    }
    return null // 정상 연결 시에는 아이콘 표시 안함
  }

  // 참가자 아바타 정보 생성
  const getParticipantAvatarInfo = (participant: Participant) => {
    const userId = participant.identity.replace('user_', '')
    const projectMember = projectMembers.find(
      member => member.userId.toString() === userId,
    )

    if (projectMember) {
      return createUserAvatarInfo({
        name: projectMember.name,
        userId: projectMember.userId,
        profileImageUrl: projectMember.profileImageUrl,
      })
    }

    return createUserAvatarInfo({
      name: participant.name,
      userId: participant.identity,
    })
  }

  // 현재 사용자 아바타 정보
  const currentUserAvatarInfo = currentUser
    ? createUserAvatarInfo({
        name: currentUser.name,
        userId: currentUser.userId,
        profileImageUrl: currentUser.profileImageUrl,
      })
    : null

  // 참가자 볼륨 슬라이더 렌더링
  const renderVolumeSlider = (participant: Participant) => {
    if (!onVolumeChange) return null

    return (
      <div className="absolute top-full z-5 mt-2 translate-y-1 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <div className="relative w-fit pt-1">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 h-2 w-2 rotate-45 transform border-border border-t border-l bg-background" />
          <div className="min-w-[140px] rounded-xl border-border border-r border-b border-l bg-background p-3 shadow-xl backdrop-blur-sm">
            <div className="mb-2 text-center">
              <div className="font-medium text-foreground text-xs">
                {participant.name}
              </div>
              <div className="text-muted-foreground text-xs">Volume</div>
            </div>
            <VolumeSlider
              value={participant.volume}
              onChange={volume => onVolumeChange(participant.identity, volume)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 상태 표시 */}
      {getStatusIcon() && (
        <div className="flex items-center">{getStatusIcon()}</div>
      )}

      {/* 참가자들 */}
      {isConnected &&
        participants.map(participant => {
          const avatarInfo = getParticipantAvatarInfo(participant)
          return (
            <div
              key={participant.identity}
              className="group relative flex flex-col items-center gap-1"
            >
              <VoiceAvatar
                user={avatarInfo}
                showMicrophoneStatus={true}
                isMicrophoneEnabled={participant.isMicrophoneEnabled}
                showVoiceActivity={true}
                isSpeaking={participant.isSpeaking}
              />
              {renderVolumeSlider(participant)}
            </div>
          )
        })}

      {/* 현재 사용자 아바타 */}
      {isConnected && currentUserAvatarInfo && (
        <div className="relative z-20">
          <VoiceAvatar
            user={currentUserAvatarInfo}
            showMicrophoneStatus={true}
            isMicrophoneEnabled={isMicrophoneEnabled}
            showVoiceActivity={true}
            isSpeaking={isSpeaking}
          />
        </div>
      )}

      {/* 마이크 토글 버튼 */}
      {isConnected && onToggleMicrophone && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMicrophone}
          disabled={isTogglingMicrophone}
          className={cn(
            'h-6 w-6 p-0 transition-colors',
            isTogglingMicrophone && 'cursor-not-allowed opacity-50',
            isMicrophoneEnabled
              ? 'text-green-600 hover:bg-green-50'
              : 'text-red-500 hover:bg-red-50',
          )}
          title={
            isTogglingMicrophone
              ? '처리 중...'
              : `마이크 ${isMicrophoneEnabled ? '끄기' : '켜기'}`
          }
        >
          {isTogglingMicrophone ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isMicrophoneEnabled ? (
            <Mic className="h-3 w-3" />
          ) : (
            <MicOff className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* 재연결 버튼 */}
      {(hasError || isDisconnected) && onReconnect && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReconnect}
          className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
          title="재연결"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
