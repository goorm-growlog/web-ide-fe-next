import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type {
  StompClientConfig,
  WebSocketError,
} from '@/entities/websocket/types/websocket-types'

const STOMP_CONSTANTS = {
  HEARTBEAT_INCOMING_MS: 20000,
  HEARTBEAT_OUTGOING_MS: 20000,
} as const

export const createStompClient = (config: StompClientConfig): Client => {
  return new Client({
    webSocketFactory: () => new SockJS(config.url),
    debug: str => console.log(`🔧 [STOMP Debug]`, str),
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
        message: `STOMP error: ${frame.body || 'Unknown error'}`,
        details: frame,
      }
      config.onError(error)
    },

    onWebSocketError: event => {
      const error: WebSocketError = {
        type: 'websocket',
        message: 'WebSocket connection error',
        details: event,
      }
      config.onError(error)
    },
  })
}
