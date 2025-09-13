'use client'

import { useEffect, useState } from 'react'
import EditorLayout from '@/widgets/sidebar/ui/editor-layout'
import { ConnectionStatus, type ConnectionStatusType } from '@/entities/websocket/ui/connection-status'
import { useWebSocketClient } from '@/entities/websocket/stores/websocket-client'
import { useAuthStore } from '@/entities/auth/model/store'
import { useFileTreeStore } from '@/features/file-explorer/stores/file-tree-store'
import { WEBSOCKET_CONFIG } from '@/features/file-explorer/config/websocket-config'

const ProjectPage = () => {
  const accessToken = useAuthStore(state => state.accessToken)
  const { connect, disconnect, reconnect, isConnecting, isConnected, error, status } = useWebSocketClient()
  const { clear } = useFileTreeStore()
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    const token = accessToken || process.env.NEXT_PUBLIC_ACCESS_TOKEN || ''
    connect({
      url: WEBSOCKET_CONFIG.WS_URL,
      token,
    })
    return () => {
      disconnect()
      // 파일 트리 상태 초기화
      clear()
    }
  }, [connect, disconnect, accessToken, clear])

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

export default ProjectPage
