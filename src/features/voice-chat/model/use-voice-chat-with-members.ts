import { useMemo } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import { useProjectMembers } from '@/entities/project/hooks/use-project'
import type { ProjectMember } from '@/entities/project/model/types'
import { createUserAvatarInfo } from '@/entities/user'
import { useVoiceChatRoom } from './use-voice-chat-room'

interface UseVoiceChatWithMembersProps {
  projectId: string
  onError?: (error: string) => void
}

export function useVoiceChatWithMembers({
  projectId,
  onError,
}: UseVoiceChatWithMembersProps) {
  const { user } = useAuth()
  const { members: projectMembers, isLoading: membersLoading } =
    useProjectMembers(parseInt(projectId, 10))

  // 음성채팅 룸 훅
  const voiceChatRoom = useVoiceChatRoom({
    roomName: `project-${projectId}`,
    userName: user?.name || 'Unknown User',
    userId: user?.id || '1',
    ...(onError && { onError }),
  })

  // 현재 사용자 정보
  const currentUser = useMemo(() => {
    if (!user) return null
    return createUserAvatarInfo({
      name: user.name || 'Unknown',
      userId: user.id,
      profileImageUrl: undefined,
    })
  }, [user])

  // 참여자 아바타 정보 생성
  const getParticipantAvatarInfo = (participantIdentity: string) => {
    // identity에서 userId 추출 (user_123 형태)
    const userId = participantIdentity.replace('user_', '')

    // 프로젝트 멤버에서 해당 사용자 찾기
    const member = projectMembers?.find(
      (m: ProjectMember) => m.userId.toString() === userId,
    )

    if (member) {
      return createUserAvatarInfo({
        name: member.name,
        userId: member.userId,
        profileImageUrl: member.profileImageUrl,
      })
    }

    // 멤버를 찾지 못한 경우 기본값
    return createUserAvatarInfo({
      name: 'Unknown',
      userId: 0,
      profileImageUrl: undefined,
    })
  }

  // 음성채팅 상태
  const voiceChatStatus = useMemo(
    () => ({
      isConnected: voiceChatRoom.isConnected,
      isConnecting: voiceChatRoom.isConnecting,
      hasError: !!voiceChatRoom.error,
      isDisconnected: !voiceChatRoom.isConnected && !voiceChatRoom.isConnecting,
      isMicrophoneEnabled:
        voiceChatRoom.localParticipant?.isMicrophoneEnabled ?? false,
      isSpeaking: voiceChatRoom.speakingParticipants.has(
        `user_${user?.id || '1'}`,
      ),
    }),
    [
      voiceChatRoom.isConnected,
      voiceChatRoom.isConnecting,
      voiceChatRoom.error,
      voiceChatRoom.localParticipant,
      voiceChatRoom.speakingParticipants,
      user?.id,
    ],
  )

  return {
    // 음성채팅 상태
    voiceChatStatus,

    // 참여자 정보
    participants: voiceChatRoom.participants,
    projectMembers,
    currentUser,

    // 로딩 상태
    isLoading: membersLoading,

    // 액션
    connect: voiceChatRoom.connect,
    disconnect: voiceChatRoom.disconnect,
    toggleMicrophone: voiceChatRoom.toggleMicrophone,

    // 유틸리티
    getParticipantAvatarInfo,
  }
}
