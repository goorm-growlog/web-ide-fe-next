import type {
  Client,
  IPublishParams,
  messageCallbackType,
  StompSubscription,
} from '@stomp/stompjs'
import type { WebSocketError as BaseWebSocketError } from '@/shared/types/error'

// 🎯 연결 상태 타입
export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

// 🎯 연결 파라미터
export interface ConnectionParams {
  url: string
  token: string
}

// 🎯 WebSocket 에러 (통합됨)
export type WebSocketError = BaseWebSocketError & {
  type: 'stomp' | 'websocket'
}

// 🎯 STOMP 클라이언트 설정
export interface StompClientConfig {
  url: string
  token: string
  beforeConnect: () => void
  onConnect: () => void
  onDisconnect: () => void
  onError: (error: WebSocketError) => void
}

// 🎯 구독 정보
export interface SubscriptionInfo {
  id: string
  destination: string
  subscription: StompSubscription
  handler: messageCallbackType
}

// 🎯 Connection Manager 인터페이스
export interface ConnectionManager {
  // 상태 필드
  client: Client | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  status: ConnectionStatus

  // 메서드
  connect: (params: ConnectionParams) => Promise<void>
  disconnect: () => Promise<void>
  reconnect: () => Promise<void>
  publish: (params: IPublishParams) => void
  getStatus: () => ConnectionStatus
}

// 🎯 Subscription Manager 인터페이스
export interface SubscriptionManager {
  // 상태 필드
  subscriptions: Map<string, SubscriptionInfo>

  // 메서드
  subscribe: (
    destination: string,
    handler: messageCallbackType,
  ) => string | null
  unsubscribe: (subscriptionId: string) => void
}
