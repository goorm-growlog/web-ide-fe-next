'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/ky-client'
import { getProject } from '@/entities/project/api/project'
import { isProjectActive, isProjectInactive } from '@/entities/project/model/permissions'
import { useUnifiedProjects } from '@/features/project/project-list/model/use-unified-projects'
import EditorLayout from '@/widgets/sidebar/ui/editor-layout'
import { ConnectionStatus, type ConnectionStatusType } from '@/entities/websocket/ui/connection-status'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { FILE_EXPLORER_WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const hasProcessedRef = useRef(false) // useRef로 중복 실행 방지
  const { refetch } = useUnifiedProjects() // 캐시 무효화를 위한 refetch 함수
  const projectId = Number(params.projectId)

  // WebSocket 연결 관리
  const { connect, disconnect, reconnect, isConnecting, isConnected, error, status } = useWebSocketClient()

  useEffect(() => {
    // 이미 처리했거나 projectId가 없으면 실행하지 않음
    if (hasProcessedRef.current || !projectId) return

    const handleProjectAccess = async () => {
      try {
        hasProcessedRef.current = true // 처리 시작 시 즉시 플래그 설정
        setIsLoading(true)

        // 1단계: 프로젝트 정보 조회
        const project = await getProject(projectId)

        // 2단계: 상태에 따른 분기 처리
        if (isProjectActive(project)) {
          // ACTIVE 프로젝트: 바로 접근 (openProject 호출 불필요)
          // 토스트 제거: 프로젝트 리스트에서 접근 시 중복 방지

        } else if (isProjectInactive(project)) {
          // INACTIVE 프로젝트: openProject API 호출 필요
          
          const response = await authApi.post(`/projects/${projectId}/open`).json()
          toast.success('Project has been activated')

          // 프로젝트 상태가 변경되었으므로 캐시 무효화
          refetch()

        } else {
          // DELETING 프로젝트
          toast.error('Project is being deleted')
          router.push('/project')
          return
        }

        // 3단계: WebSocket 연결 설정
        const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN || ''
        connect({
          url: FILE_EXPLORER_WEBSOCKET_CONFIG.WS_URL,
          token,
        })

      } catch (error: any) {
        // 에러 상세 처리
        if (error.response?.status === 403) {
          toast.error('Inactive project can only be accessed by owner')
        } else if (error.response?.status === 404) {
          toast.error('Project not found')
        } else {
          toast.error('Cannot access project')
        }

        router.push('/project')
      } finally {
        setIsLoading(false)
      }
    }

    handleProjectAccess()

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      disconnect()
    }
  }, [projectId, router, connect, disconnect]) // useRef는 의존성에서 제외

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await reconnect()
    } catch (error) {
      console.error('Reconnection failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const getConnectionStatus = (): ConnectionStatusType => {
    if (isConnecting || status === 'connecting') return 'connecting'
    if (error || status === 'error') return 'error'
    if (isConnected || status === 'connected') return 'connected'
    return 'initializing'
  }

  const connectionStatus = getConnectionStatus()

  // 로딩 중이거나 프로젝트 접근 중일 때
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading Project {projectId}...</h1>
          <p className="text-muted-foreground">Preparing your project.</p>
        </div>
      </div>
    )
  }

  // WebSocket 연결 상태에 따른 UI 표시
  return (
    <EditorLayout>
      <div className="flex h-full">
        <div className="flex flex-col flex-1">
          <div className="flex-1 flex items-center justify-center p-8">
            {connectionStatus === 'error' ? (
              <ConnectionStatus
                status="error"
                error={error || 'Unknown error'}
                onRetry={handleRetry}
                isRetrying={isRetrying}
              />
            ) : (
              <ConnectionStatus status={connectionStatus} />
            )}
          </div>
        </div>
      </div>
    </EditorLayout>
  )
}
