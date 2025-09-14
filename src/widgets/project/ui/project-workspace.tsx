'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useProjectVoiceChat } from '@/features/voice-chat/model/use-project-voice-chat'
import { useVoiceChat } from '@/features/voice-chat/model/use-voice-chat'
import { ProjectHeader } from '@/widgets/header/ui/project-header'
import EditorLayout from '@/widgets/sidebar/ui/editor-layout'

interface ProjectWorkspaceProps {
  projectId: string
}

/**
 * Project Workspace Widget
 *
 * 책임:
 * - 프로젝트 작업 공간 전체 레이아웃
 * - 음성채팅 기능 통합
 * - 프로젝트 헤더 + 에디터 레이아웃 조합
 */
export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const { user } = useAuth()
  const { projectMembers, roomName } = useProjectVoiceChat({ projectId })

  const voiceChat = useVoiceChat({
    roomName,
    userName: user?.name || 'Unknown User',
    userId: user?.id || 'guest',
  })

  const currentUser = projectMembers.find(
    (member: { userId: number }) => member.userId === Number(user?.id),
  )

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {/* 프로젝트 헤더 (fixed positioning) */}
      <ProjectHeader
        projectId={projectId}
        voiceChatStatus={{
          isConnected: voiceChat.isConnected,
          isConnecting: voiceChat.isConnecting,
          hasError: !!voiceChat.error,
          isDisconnected: !voiceChat.isConnected && !voiceChat.isConnecting,
          isMicrophoneEnabled: voiceChat.isMicrophoneEnabled,
          isSpeaking: voiceChat.isSpeaking,
          isTogglingMicrophone: voiceChat.isTogglingMicrophone,
        }}
        participants={voiceChat.participants}
        projectMembers={projectMembers}
        currentUser={currentUser}
        onReconnect={voiceChat.connect}
        onToggleMicrophone={voiceChat.toggleMicrophone}
        onSetParticipantVolume={voiceChat.setParticipantVolume}
      />

      {/* 에디터 레이아웃 (헤더 아래 나머지 전체 영역) */}
      <div className="absolute inset-0 top-[40px]">
        <EditorLayout projectId={projectId}>
          <div className="flex h-full items-center justify-center">
            <div className="space-y-4 text-center">
              <h1 className="font-bold text-2xl">Web IDE</h1>
              <p className="text-muted-foreground">
                Project {projectId} is ready. Use the file explorer to open
                files.
              </p>
            </div>
          </div>
        </EditorLayout>
      </div>
    </div>
  )
}
