// 🎯 WebSocket 스토어 공통 상수
export const WEBSOCKET_MESSAGES = {
  // 연결 관련
  CONNECTION_ERROR: 'Connection error',
  INVALID_PARAMS: 'Invalid parameters',
  MAX_RECONNECT: 'Max reconnection attempts reached',

  // 구독 관련
  SUBSCRIBE_ERROR: 'Subscribe failed',
  UNSUBSCRIBE_ERROR: 'Unsubscribe failed',
  RESTORE_FAILED: 'Failed to restore subscription',
} as const

// 🎯 로그 프리픽스
export const LOG_PREFIX = {
  CONNECTION: '[ConnectionSlice]',
  SUBSCRIPTION: '[SubscriptionSlice]',
} as const
