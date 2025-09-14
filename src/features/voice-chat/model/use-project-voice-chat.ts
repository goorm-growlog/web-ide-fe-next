// 프로젝트 도메인 로직
import { useProjectMembers } from '@/entities/project/hooks/use-project'
import type { ProjectMember } from '@/entities/project/model/types'

interface UseProjectVoiceChatProps {
  projectId: string
}

export function useProjectVoiceChat({ projectId }: UseProjectVoiceChatProps) {
  const { members: projectMembers, isLoading: membersLoading } =
    useProjectMembers(parseInt(projectId, 10))

  // 프로젝트별 음성채팅 방 이름 생성
  const roomName = `project-${projectId}`

  // 참여자 정보 조회
  const getParticipantInfo = (participantIdentity: string) => {
    const userId = participantIdentity.replace('user_', '')
    return projectMembers?.find(
      (m: ProjectMember) => m.userId.toString() === userId,
    )
  }

  return {
    projectMembers: projectMembers || [],
    isLoading: membersLoading,
    roomName,
    getParticipantInfo,
  }
}
