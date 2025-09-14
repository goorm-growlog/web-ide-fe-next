'use client'

import { Mic, MicOff, RotateCcw, Wifi, WifiOff } from 'lucide-react'
import type { ProjectMember } from '@/entities/project/model/types'
import { createUserAvatarInfo } from '@/entities/user'
import type { Participant } from '@/entities/voice-chat/model/types'
import { VoiceAvatar } from '@/entities/voice-chat/ui/voice-avatar'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'

interface VoiceChatStatusProps {
  isConnected: boolean
  isConnecting: boolean
  hasError: boolean
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

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 상태 표시 (이상한 상태일 때만) */}
      {getStatusIcon() && (
        <div className="flex items-center">{getStatusIcon()}</div>
      )}

      {/* 참가자들 - 연결 완료일 때만 표시 */}
      {isConnected &&
        participants.map(participant => {
          const avatarInfo = getParticipantAvatarInfo(participant)
          return (
            <VoiceAvatar
              key={participant.identity}
              user={avatarInfo}
              showMicrophoneStatus={true}
              isMicrophoneEnabled={participant.isMicrophoneEnabled}
              showVoiceActivity={true}
              isSpeaking={participant.isSpeaking}
            />
          )
        })}

      {/* 현재 사용자 아바타 - 연결 완료일 때만 표시 */}
      {isConnected && currentUserAvatarInfo && (
        <VoiceAvatar
          user={currentUserAvatarInfo}
          showMicrophoneStatus={true}
          isMicrophoneEnabled={isMicrophoneEnabled}
          showVoiceActivity={true}
          isSpeaking={isSpeaking}
        />
      )}

      {/* 마이크 토글 버튼 - 연결 완료일 때만 표시 */}
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

      {/* 재연결 버튼 (에러 또는 연결 끊김 시) */}
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
