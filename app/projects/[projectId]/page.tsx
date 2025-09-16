'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { getProject, openProject } from '@/entities/project/api/project'
import { FILE_EXPLORER_WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'
import useChat from '@/features/chat/hooks/use-chat'
import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import { useAuth } from '@/app/providers/auth-provider'
import { useProjectVoiceChat } from '@/features/voice-chat/model/use-project-voice-chat'
import { useVoiceChat } from '@/features/voice-chat/model/use-voice-chat'
import { ProjectHeader } from '@/widgets/header/ui/project-header'
import { logger } from '@/shared/lib/logger'

// EditorLayout을 클라이언트 사이드에서만 렌더링 (autoSaveId 작동을 위해)
const EditorLayout = dynamic(
  () => import('@/widgets/sidebar/ui/editor-layout'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2"></div>
          <p className="mt-2 text-gray-600 text-sm">레이아웃 로딩 중...</p>
        </div>
      </div>
    ),
  },
)

/**
 * 프로젝트 상세 페이지 컴포넌트
 *
 * 책임:
 * - 프로젝트 초기화 및 상태 관리
 * - WebSocket 연결 관리
 * - 파일 트리 및 채팅 데이터 관리
 * - 프로젝트 헤더 렌더링 (음성채팅 포함)
 * - EditorLayout 렌더링
 */
const Page = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.projectId)
  const { user, isLoading: authLoading } = useAuth()

  // 상태 관리
  const [isReady, setIsReady] = useState(false)
  const [isSecondaryPanelVisible, setIsSecondaryPanelVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const isInitializedRef = useRef(false)
  const toastShownRef = useRef(false)

  // WebSocket 클라이언트
  const { connect, disconnect, isConnected } = useWebSocketClient()

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 프로젝트 초기화 로직
  useEffect(() => {
    // 이미 초기화된 경우 중복 실행 방지
    if (isInitializedRef.current) return

    const initializeProject = async () => {
      try {
        logger.debug('프로젝트 초기화 시작', { projectId })
        const project = await getProject(Number(projectId))

        switch (project.status) {
          case 'ACTIVE':
            logger.debug('프로젝트가 이미 활성 상태', { projectId })
            setIsReady(true)
            isInitializedRef.current = true
            break

          case 'INACTIVE':
            logger.debug('프로젝트 활성화 중', { projectId })
            await openProject(Number(projectId))

            // 토스트 중복 방지
            if (!toastShownRef.current) {
              logger.debug('프로젝트 활성화 완료', { projectId })
              toast.success('Project activated')
              toastShownRef.current = true
            }

            setIsReady(true)
            isInitializedRef.current = true
            break

          default:
            logger.error('프로젝트 초기화 실패', { projectId, status: project.status })
            toast.error('프로젝트 상태를 확인할 수 없습니다. 프로젝트 목록으로 이동합니다.')
            router.push('/projects')
            break
        }
      } catch (error) {
        logger.error('프로젝트 초기화 에러', { projectId, error })
        toast.error('프로젝트를 불러올 수 없습니다. 프로젝트 목록으로 이동합니다.')
        // 프로젝트 초기화 실패 시 projects 페이지로 이동
        router.push('/projects')
      }
    }

    initializeProject()
  }, [projectId, router])

  // WebSocket 연결 관리
  useEffect(() => {
    if (!isReady) return

    connect({
      url: FILE_EXPLORER_WEBSOCKET_CONFIG.WS_URL,
    })

    return () => {
      disconnect()
    }
  }, [isReady, connect, disconnect])

  // 파일 트리 데이터 관리
  const fileTreeData = useFileTree({
    projectId: projectId,
    isConnected
  })

  // 채팅 데이터 관리
  const chatData = useChat({
    projectId: projectId,
    isConnected
  })

  // 프로젝트 음성채팅 데이터
  const { projectMembers, roomName } = useProjectVoiceChat({
    projectId: projectId
  })

  // 음성채팅 훅 초기화
  const voiceChat = useVoiceChat({
    roomName,
    userName: user?.name || 'Unknown User',
    userId: user?.id || 'guest',
    projectId: projectId,
  })

  // 현재 사용자 정보 (ProjectHeader 타입에 맞게 변환)
  const currentUser = projectMembers.find(
    (member: { userId: number }) => member.userId === Number(user?.id),
  ) ? {
    name: user?.name || 'Unknown User',
    userId: String(user?.id || 'guest'),
    ...(user?.profileImage && { profileImageUrl: user.profileImage })
  } : undefined

  // 이벤트 핸들러들
  const handleToggleSecondaryPanel = () => {
    logger.debug('세컨더리 패널 토글 요청', { projectId })
    setIsSecondaryPanelVisible(prev => !prev)
  }

  const handleExitProject = () => {
    router.push('/projects')
  }

  // 클라이언트 사이드 렌더링이 완료되지 않았거나 인증 로딩 중이거나 사용자 정보가 없으면 로딩 표시
  if (!isClient || authLoading || !user) {
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
    <>
      {/* 프로젝트 헤더 (고정 위치) */}
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
        onToggleChat={handleToggleSecondaryPanel}
        onExitProject={handleExitProject}
      />

      {/* 메인 콘텐츠 영역 (헤더 아래 전체 공간) */}
      <div className="absolute inset-x-0 top-[40px] bottom-0 h-[calc(100vh-40px)]">
        <EditorLayout
          projectId={projectId}
          fileTreeData={fileTreeData}
          chatData={chatData}
          secondaryPanel={{
            isVisible: isSecondaryPanelVisible,
            onToggle: handleToggleSecondaryPanel,
          }}
        />
      </div>
    </>
  )
}

export default Page
