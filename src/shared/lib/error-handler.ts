/**
 * 중앙 에러 관리 시스템
 * 모든 에러 타입을 통합하여 처리
 */

import { toast } from 'sonner'
import { logger } from '@/shared/lib/logger'
import { ERROR_CODES, ERROR_MESSAGES } from '@/shared/types/error'

/**
 * 에러 컨텍스트 타입
 */
export type ErrorContext =
  | 'file-operation'
  | 'auth'
  | 'project'
  | 'chat'
  | 'websocket'
  | 'api'
  | 'general'

/**
 * 서버 에러 코드 매핑
 */
const SERVER_ERROR_MAPPING = {
  // 공통 에러
  NETWORK_ERROR: ERROR_CODES.NETWORK_ERROR,
  TIMEOUT_ERROR: ERROR_CODES.TIMEOUT_ERROR,
  VALIDATION_ERROR: ERROR_CODES.VALIDATION_ERROR,
  BAD_REQUEST: ERROR_CODES.BAD_REQUEST,

  // 프로젝트 관련 에러
  PROJECT_NOT_FOUND: ERROR_CODES.PROJECT_NOT_FOUND,
  NOT_A_MEMBER: ERROR_CODES.NOT_A_MEMBER,
  NO_WRITE_PERMISSION: ERROR_CODES.NO_WRITE_PERMISSION,

  // 파일 트리 에러
  FILE_NOT_FOUND: ERROR_CODES.FILE_NOT_FOUND,
  FILE_ALREADY_EXISTS: ERROR_CODES.FILE_ALREADY_EXISTS,
  PERMISSION_DENIED: ERROR_CODES.PERMISSION_DENIED,
  INVALID_PATH: ERROR_CODES.INVALID_PATH,
  INVALID_FILE_PATH: ERROR_CODES.INVALID_FILE_PATH,
  PATH_NOT_ALLOWED: ERROR_CODES.PATH_NOT_ALLOWED,
  CANNOT_MOVE_TO_SUBFOLDER: ERROR_CODES.CANNOT_MOVE_TO_SUBFOLDER,
  FILE_OPERATION_FAILED: ERROR_CODES.FILE_OPERATION_FAILED,

  // WebSocket 에러
  CONNECTION_FAILED: ERROR_CODES.CONNECTION_FAILED,
  SUBSCRIPTION_FAILED: ERROR_CODES.SUBSCRIPTION_FAILED,
  MESSAGE_SEND_FAILED: ERROR_CODES.MESSAGE_SEND_FAILED,
} as const

/**
 * 중앙 에러 처리 함수
 */
export const handleError = (
  error: unknown,
  context: ErrorContext = 'general',
): void => {
  let errorMessage = ERROR_MESSAGES[ERROR_CODES.FILE_OPERATION_FAILED]

  // 에러 메시지 추출 및 매핑
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMsg = (error as { message: string }).message

    // 서버 에러 코드 매핑
    for (const [serverCode, frontendCode] of Object.entries(
      SERVER_ERROR_MAPPING,
    )) {
      if (errorMsg.includes(serverCode)) {
        errorMessage = ERROR_MESSAGES[frontendCode]
        break
      }
    }
  }

  // 에러 로깅
  logger.error(`[${context.toUpperCase()}] Error:`, error)

  // 사용자에게 에러 메시지 표시
  toast.error(errorMessage)
}

/**
 * 파일 작업 에러 처리
 */
export const handleFileOperationError = (error: unknown): void => {
  handleError(error, 'file-operation')
}

/**
 * 인증 에러 처리
 */
export const handleAuthError = (error: unknown): void => {
  handleError(error, 'auth')
}

/**
 * 프로젝트 에러 처리
 */
export const handleProjectError = (error: unknown): void => {
  handleError(error, 'project')
}

/**
 * 채팅 에러 처리
 */
export const handleChatError = (error: unknown): void => {
  handleError(error, 'chat')
}

/**
 * WebSocket 에러 처리
 */
export const handleWebSocketError = (error: unknown): void => {
  handleError(error, 'websocket')
}

/**
 * API 에러 처리
 */
export const handleApiError = (error: unknown): void => {
  handleError(error, 'api')
}
