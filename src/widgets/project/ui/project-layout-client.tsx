'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useProjectVoiceChat } from '@/features/voice-chat/model/use-project-voice-chat'
import { useVoiceChat } from '@/features/voice-chat/model/use-voice-chat'
import { ProjectHeader } from '@/widgets/header/ui/project-header'
import EditorLayout from '@/widgets/sidebar/ui/editor-layout'

interface ProjectLayoutClientProps {
  projectId: string
}

export function ProjectLayoutClient({ projectId }: ProjectLayoutClientProps) {
  const { user } = useAuth()
  const { projectMembers, roomName } = useProjectVoiceChat({ projectId })

  // 사용자 정보가 없으면 음성채팅 초기화하지 않음
  const voiceChat = useVoiceChat({
    roomName,
    userName: user?.name || 'Unknown User',
    userId: user?.id || 'guest',
  })

  const currentUser = projectMembers.find(
    (member: { userId: number }) => member.userId === Number(user?.id),
  )

  // 사용자 정보 로딩 중이면 로딩 표시
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2"></div>
          <p className="mt-2 text-gray-600 text-sm">사용자 정보 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader
        projectId={projectId}
        voiceChatStatus={{
          isConnected: voiceChat.isConnected,
          isConnecting: voiceChat.isConnecting,
          hasError: !!voiceChat.error,
          isDisconnected: !voiceChat.isConnected && !voiceChat.isConnecting,
          isMicrophoneEnabled: voiceChat.isMicrophoneEnabled,
          isSpeaking: voiceChat.isSpeaking,
        }}
        participants={voiceChat.participants.map(p => ({
          identity: p.identity,
          name: p.name || p.identity,
          isMicrophoneEnabled: true, // 간소화: 기본값 사용
          isSpeaking: p.isSpeaking,
          volume: 50, // 기본 볼륨
        }))}
        projectMembers={projectMembers}
        currentUser={currentUser}
        onReconnect={voiceChat.connect}
        onToggleMicrophone={voiceChat.toggleMicrophone}
      />

      <div className="h-screen pt-[70px]">
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
