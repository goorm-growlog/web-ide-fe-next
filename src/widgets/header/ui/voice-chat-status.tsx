'use client'

import { Mic, MicOff, Wifi, WifiOff } from 'lucide-react'
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
  isConnecting,
  hasError,
  isDisconnected,
  isMicrophoneEnabled,
  isSpeaking,
  participants,
  projectMembers,
  currentUser,
  onReconnect,
  onToggleMicrophone,
  className,
}: VoiceChatStatusProps) {
  // 상태 표시 아이콘
  const getStatusIcon = () => {
    if (isConnecting) {
      return <Wifi className="h-4 w-4 animate-pulse text-yellow-500" />
    }
    if (hasError) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    if (isDisconnected) {
      return <Wifi className="h-4 w-4 text-gray-500" />
    }
    return <Wifi className="h-4 w-4 text-green-500" />
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

  // 참가자 수 계산
  const totalParticipants = participants.length + (currentUser ? 1 : 0)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 상태 표시 */}
      <div className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-gray-600 text-xs">{totalParticipants}명</span>
      </div>

      {/* 참가자들 */}
      {participants.map(participant => {
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

      {/* 현재 사용자 */}
      {currentUserAvatarInfo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMicrophone}
          className="h-8 w-8 p-0 hover:bg-transparent"
          title={`마이크 ${isMicrophoneEnabled ? '끄기' : '켜기'}`}
        >
          <VoiceAvatar
            user={currentUserAvatarInfo}
            showMicrophoneStatus={true}
            isMicrophoneEnabled={isMicrophoneEnabled}
            showVoiceActivity={true}
            isSpeaking={isSpeaking}
            className="transition-transform hover:scale-105"
          />
        </Button>
      )}

      {/* 마이크 토글 버튼 (현재 사용자가 없을 때) */}
      {!currentUser && onToggleMicrophone && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMicrophone}
          className="h-8 w-8 p-0"
          title={`마이크 ${isMicrophoneEnabled ? '끄기' : '켜기'}`}
        >
          {isMicrophoneEnabled ? (
            <Mic className="h-4 w-4" />
          ) : (
            <MicOff className="h-4 w-4 text-red-500" />
          )}
        </Button>
      )}

      {/* 에러 시 재연결 버튼 */}
      {hasError && onReconnect && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReconnect}
          className="ml-2 h-6 px-2 text-xs"
        >
          재연결
        </Button>
      )}
    </div>
  )
}
