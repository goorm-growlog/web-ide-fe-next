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
 * 컨텍스트별 기본 에러 메시지 매핑
 */
const DEFAULT_ERROR_MESSAGES: Record<ErrorContext, string> = {
  'file-operation': ERROR_MESSAGES[ERROR_CODES.FILE_OPERATION_FAILED],
  auth: ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
  project: ERROR_MESSAGES[ERROR_CODES.PROJECT_NOT_FOUND],
  chat: ERROR_MESSAGES[ERROR_CODES.MESSAGE_SEND_FAILED],
  websocket: ERROR_MESSAGES[ERROR_CODES.CONNECTION_FAILED],
  api: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
  general: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
} as const

/**
 * 표준 Error 객체에서 메시지 추출
 */
const extractFromErrorObject = (
  error: Record<string, unknown>,
): string | null => {
  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }
  return null
}

/**
 * 커스텀 에러 객체에서 메시지 추출
 */
const extractFromCustomError = (
  error: Record<string, unknown>,
): string | null => {
  if ('error' in error && typeof error.error === 'string') {
    return error.error
  }
  return null
}

/**
 * 응답 에러 객체에서 메시지 추출
 */
const extractFromResponseError = (
  error: Record<string, unknown>,
): string | null => {
  if (
    'response' in error &&
    error.response &&
    typeof error.response === 'object'
  ) {
    const response = error.response as Record<string, unknown>
    if (
      'data' in response &&
      response.data &&
      typeof response.data === 'object'
    ) {
      const data = response.data as Record<string, unknown>
      if ('message' in data && typeof data.message === 'string') {
        return data.message
      }
    }
  }
  return null
}

/**
 * 에러 메시지 추출 헬퍼 함수
 */
const extractErrorMessage = (error: unknown): string | null => {
  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>

    // 표준 Error 객체
    const standardMessage = extractFromErrorObject(errorObj)
    if (standardMessage) return standardMessage

    // 커스텀 에러 객체
    const customMessage = extractFromCustomError(errorObj)
    if (customMessage) return customMessage

    // 응답 에러 객체
    const responseMessage = extractFromResponseError(errorObj)
    if (responseMessage) return responseMessage
  }

  return null
}

/**
 * 서버 에러 코드 매핑 함수
 */
const mapServerErrorCode = (errorMessage: string): string | null => {
  for (const [serverCode, frontendCode] of Object.entries(
    SERVER_ERROR_MAPPING,
  )) {
    if (errorMessage.includes(serverCode)) {
      return ERROR_MESSAGES[frontendCode]
    }
  }
  return null
}

/**
 * 중앙 에러 처리 함수
 */
export const handleError = (
  error: unknown,
  context: ErrorContext = 'general',
): void => {
  // 기본 에러 메시지 설정
  let errorMessage = DEFAULT_ERROR_MESSAGES[context]

  // 에러 메시지 추출 및 매핑
  const extractedMessage = extractErrorMessage(error)
  if (extractedMessage) {
    const mappedMessage = mapServerErrorCode(extractedMessage)
    if (mappedMessage) {
      errorMessage = mappedMessage
    } else {
      // 매핑되지 않은 에러는 원본 메시지 사용 (너무 길면 기본 메시지 사용)
      errorMessage =
        extractedMessage.length > 100
          ? DEFAULT_ERROR_MESSAGES[context]
          : extractedMessage
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
