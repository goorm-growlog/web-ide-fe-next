import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type {
  StompClientConfig,
  WebSocketError,
} from '@/entities/websocket/types/websocket-types'
import { logger } from '@/shared/lib/logger'

const STOMP_CONSTANTS = {
  HEARTBEAT_INCOMING_MS: 20000,
  HEARTBEAT_OUTGOING_MS: 20000,
} as const

export const createStompClient = (
  config: StompClientConfig & { token: string },
): Client => {
  return new Client({
    webSocketFactory: () => new SockJS(config.url),
    debug: (str: string) => logger.debug(`🔧 [STOMP Debug]`, str),
    connectHeaders: {
      Authorization: `Bearer ${config.token}`,
    },
    reconnectDelay: 0, // 자동 재연결 비활성화
    heartbeatIncoming: STOMP_CONSTANTS.HEARTBEAT_INCOMING_MS,
    heartbeatOutgoing: STOMP_CONSTANTS.HEARTBEAT_OUTGOING_MS,

    beforeConnect: config.beforeConnect,
    onConnect: config.onConnect,
    onDisconnect: config.onDisconnect,

    onStompError: frame => {
      const error: WebSocketError = {
        type: 'stomp',
        code: 'STOMP_ERROR',
        message: `STOMP error: ${frame.body || 'Unknown error'}`,
        details: frame as unknown as Record<string, unknown>,
      }
      config.onError(error)
    },

    onWebSocketError: event => {
      const error: WebSocketError = {
        type: 'websocket',
        code: 'WEBSOCKET_ERROR',
        message: 'WebSocket connection error',
        details: event as Record<string, unknown>,
      }
      config.onError(error)
    },
  })
}
