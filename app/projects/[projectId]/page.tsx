'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EditorLayout from '@/widgets/sidebar/ui/editor-layout'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { getProject, openProject } from '@/entities/project/api/project'
import { FILE_EXPLORER_WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'
import useChat from '@/features/chat/hooks/use-chat'
import useFileTree from '@/features/file-explorer/hooks/use-file-tree'

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const projectId = String(params.projectId)
  const [isReady, setIsReady] = useState(false)
  const isInitializedRef = useRef(false)
  const toastShownRef = useRef(false)

  const { connect, disconnect, isConnected } = useWebSocketClient()

  // 프로젝트 초기화
  useEffect(() => {
    // 이미 초기화된 경우 중복 실행 방지
    if (isInitializedRef.current) return

    const init = async () => {
      try {
        console.log('🚀 프로젝트 초기화 시작:', projectId)
        const project = await getProject(Number(projectId))

        switch (project.status) {
          case 'ACTIVE':
            console.log('✅ 프로젝트가 이미 활성 상태')
            setIsReady(true)
            isInitializedRef.current = true
            break
          case 'INACTIVE':
            console.log('🔄 프로젝트 활성화 중...')
            await openProject(Number(projectId))

            // 토스트 중복 방지
            if (!toastShownRef.current) {
              console.log('🎉 Project activated 토스트 표시')
              toast.success('Project activated')
              toastShownRef.current = true
            }

            setIsReady(true)
            isInitializedRef.current = true
            break
          default:
            console.log('❌ 프로젝트 초기화 실패')
            toast.error('Failed to initialize project')
            router.push('/projects')
            break
        }
      } catch (error) {
        console.log('❌ 프로젝트 초기화 에러:', error)
        toast.error('Failed to initialize project')
      }
    }

    init()
  }, [projectId, router])

  // WebSocket 연결
  useEffect(() => {
    if (!isReady) return

    connect({
      url: FILE_EXPLORER_WEBSOCKET_CONFIG.WS_URL,
    })

    return () => {
      disconnect()
    }
  }, [isReady, connect, disconnect])

  const fileTreeData = useFileTree({
    projectId: projectId,
    isConnected
  })

  const chatData = useChat({
    projectId: projectId,
    isConnected
  })

  return (
    <div className="h-screen">
      <EditorLayout
        projectId={projectId}
        fileTreeData={fileTreeData}
        chatData={chatData}
      />
    </div>
  )
}
