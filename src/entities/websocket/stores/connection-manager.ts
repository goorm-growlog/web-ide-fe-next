import type { IPublishParams } from '@stomp/stompjs'
import type { StateCreator } from 'zustand'
import { LOG_PREFIX } from '@/entities/websocket/config/websocket-config'
import { createErrorHandler } from '@/entities/websocket/lib/error-handler'
import { createStompClient } from '@/entities/websocket/lib/stomp-client'
import type {
  ConnectionManager,
  ConnectionParams,
  ConnectionStatus,
  WebSocketError,
} from '@/entities/websocket/types/websocket-types'
import { getCachedSession } from '@/shared/api/ky-client'

export const createConnectionManager: StateCreator<
  ConnectionManager,
  [],
  [],
  ConnectionManager
> = (set, get) => {
  // 🎯 표준화된 에러 처리
  const errorHandler = createErrorHandler(LOG_PREFIX.CONNECTION)

  // 🎯 상태 업데이트 헬퍼
  const updateConnectionStatus = (
    status: ConnectionStatus,
    error?: string | null,
  ) => {
    set(current => ({
      ...current,
      status,
      error: error || null,
      isConnected: status === 'connected',
      isConnecting: status === 'connecting' || status === 'reconnecting',
    }))
  }

  // 🎯 간단한 유효성 검사
  const validateConnectionParams = ({ url }: ConnectionParams): boolean => {
    if (!url) {
      errorHandler.warn(
        'Invalid connection parameters: url and token are required',
      )
      return false
    }
    return true
  }

  // 🎯 클라이언트 초기화
  const initializeClient = async ({ url }: ConnectionParams) => {
    errorHandler.debug(`Initializing client for ${url}`)

    const session = await getCachedSession()
    if (!session?.accessToken) {
      errorHandler.warn('No access token available for WebSocket connection')
      updateConnectionStatus('error', 'Authentication required')
      return
    }

    const client = createStompClient({
      url,
      token: session.accessToken,
      beforeConnect: () => {
        errorHandler.debug('Connecting...')
        updateConnectionStatus('connecting')
      },
      onConnect: () => {
        errorHandler.debug('Connected')
        updateConnectionStatus('connected')
      },
      onDisconnect: () => {
        errorHandler.debug('Disconnected')
        updateConnectionStatus('disconnected')
      },
      onError: (error: WebSocketError) => {
        errorHandler.handleConnectionError(error)
        updateConnectionStatus('error', error.message)
      },
    })

    set({ client })

    setTimeout(() => client.activate(), 0)
  }

  return {
    client: null,
    status: 'disconnected' as ConnectionStatus,
    isConnected: false,
    isConnecting: false,
    error: null,

    connect: async (params: ConnectionParams) => {
      const { client, status } = get()

      if (!validateConnectionParams(params)) {
        throw new Error('Invalid connection parameters')
      }

      if (!client) {
        await initializeClient(params)
        return
      }

      if (!client.connected && status !== 'connecting') {
        errorHandler.debug('Activating existing client')
        client.activate()
      }
    },

    disconnect: async () => {
      const { client } = get()

      // 클라이언트 비활성화
      if (client) {
        await client.deactivate()
        errorHandler.debug('Client deactivated')
      }

      updateConnectionStatus('disconnected')
    },

    // 수동 재연결
    reconnect: async () => {
      const { client } = get()

      if (!client) {
        throw new Error('No client available for reconnection')
      }

      updateConnectionStatus('reconnecting')
      await client.deactivate()
      setTimeout(() => {
        client.activate()
      }, 1000) // 1초 지연 후 재연결
    },

    // 메시지 전송
    publish: (params: IPublishParams) => {
      const { client, isConnected } = get()

      if (!client?.connected || !isConnected) {
        errorHandler.warn('Cannot publish: not connected')
        return
      }

      try {
        client.publish(params)
        errorHandler.debug(`Published to ${params.destination}`)
      } catch (error) {
        errorHandler.warn(`Publish failed: ${error}`)
      }
    },

    // 상태 정보 조회
    getStatus: () => {
      return get().status
    },
  }
}
