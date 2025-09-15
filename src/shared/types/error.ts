/**
 * 공통 에러 타입 정의
 * 모든 도메인에서 사용할 수 있는 표준화된 에러 타입
 */

// 기본 에러 인터페이스
export interface BaseError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// API 에러 타입
export interface ApiError extends BaseError {
  statusCode?: number
  timestamp?: Date
}

// 파일 트리 에러 타입
export interface FileTreeError extends BaseError {
  filePath?: string
  operation?: string
}

// WebSocket 에러 타입
export interface WebSocketError extends BaseError {
  connectionId?: string
  retryable?: boolean
}

// 유니온 타입으로 모든 에러 타입 통합
export type AppError = ApiError | FileTreeError | WebSocketError

// 에러 코드 상수
export const ERROR_CODES = {
  // 공통 에러
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',

  // 프로젝트 관련 에러
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  NOT_A_MEMBER: 'NOT_A_MEMBER',
  NO_WRITE_PERMISSION: 'NO_WRITE_PERMISSION',

  // 파일 트리 에러
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_ALREADY_EXISTS: 'FILE_ALREADY_EXISTS',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_PATH: 'INVALID_PATH',
  INVALID_FILE_PATH: 'INVALID_FILE_PATH',
  PATH_NOT_ALLOWED: 'PATH_NOT_ALLOWED',
  CANNOT_MOVE_TO_SUBFOLDER: 'CANNOT_MOVE_TO_SUBFOLDER',
  FILE_OPERATION_FAILED: 'FILE_OPERATION_FAILED',

  // WebSocket 에러
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  SUBSCRIPTION_FAILED: 'SUBSCRIPTION_FAILED',
  MESSAGE_SEND_FAILED: 'MESSAGE_SEND_FAILED',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// 에러 메시지 매핑
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // 공통 에러
  [ERROR_CODES.NETWORK_ERROR]: 'Please check your network connection.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timeout. Please try again.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input values.',
  [ERROR_CODES.BAD_REQUEST]: 'Invalid request.',

  // 프로젝트 관련 에러
  [ERROR_CODES.PROJECT_NOT_FOUND]: 'Project not found.',
  [ERROR_CODES.NOT_A_MEMBER]: 'You are not a member of this project.',
  [ERROR_CODES.NO_WRITE_PERMISSION]:
    'You do not have permission to modify files.',

  // 파일 트리 에러
  [ERROR_CODES.FILE_NOT_FOUND]: 'File not found.',
  [ERROR_CODES.FILE_ALREADY_EXISTS]: 'File already exists.',
  [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied.',
  [ERROR_CODES.INVALID_PATH]: 'Invalid file path.',
  [ERROR_CODES.INVALID_FILE_PATH]: 'Invalid file path.',
  [ERROR_CODES.PATH_NOT_ALLOWED]: 'Path not allowed.',
  [ERROR_CODES.CANNOT_MOVE_TO_SUBFOLDER]: 'Cannot move folder into itself.',
  [ERROR_CODES.FILE_OPERATION_FAILED]: 'File operation failed.',

  // WebSocket 에러
  [ERROR_CODES.CONNECTION_FAILED]: 'Connection failed.',
  [ERROR_CODES.SUBSCRIPTION_FAILED]: 'Subscription failed.',
  [ERROR_CODES.MESSAGE_SEND_FAILED]: 'Message send failed.',
}

// 에러 메시지 추출 유틸리티 함수
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return '알 수 없는 오류가 발생했습니다.'
}
