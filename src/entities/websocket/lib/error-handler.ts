import { WEBSOCKET_MESSAGES } from '@/entities/websocket/config/websocket-config'
import type { WebSocketError } from '@/entities/websocket/types/websocket-types'
import { logger } from '@/shared/lib/logger'

export const createErrorHandler = (prefix: string) => ({
  // 에러 로깅 (모든 에러 타입을 하나로 통합)
  error: (message: string, error?: unknown): void => {
    logger.error(`${prefix} ${message}`, error)
  },

  // 경고 로깅
  warn: (message: string): void => {
    logger.warn(`${prefix} ${message}`)
  },

  // 디버그 로깅
  debug: (message: string): void => {
    logger.debug(`${prefix} ${message}`)
  },

  // 편의성 메소드 (기존 호환성 유지)
  handleConnectionError: (error: WebSocketError): void => {
    logger.error(`${prefix} ${WEBSOCKET_MESSAGES.CONNECTION_ERROR}:`, error)
  },

  handleSubscriptionError: (destination: string, error: unknown): void => {
    logger.error(
      `${prefix} ${WEBSOCKET_MESSAGES.SUBSCRIBE_ERROR}: ${destination}`,
      error,
    )
  },

  handleUnsubscribeError: (subscriptionId: string, error: unknown): void => {
    logger.error(
      `${prefix} ${WEBSOCKET_MESSAGES.UNSUBSCRIBE_ERROR}: ${subscriptionId}`,
      error,
    )
  },

  handleInvalidParams: (params: Record<string, boolean>): void => {
    const paramStatus = Object.entries(params)
      .map(([key, valid]) => `${key}=${valid}`)
      .join(', ')
    logger.warn(
      `${prefix} ${WEBSOCKET_MESSAGES.INVALID_PARAMS}: ${paramStatus}`,
    )
  },
})
