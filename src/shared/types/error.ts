/**
 * 에러 핸들링을 위한 유틸리티
 */

/**
 * 에러 메시지를 가진 객체 타입
 */
export interface ErrorWithMessage {
  message: string
}

/**
 * 에러 객체가 message를 가지는지 확인하는 타입 가드
 */
export const isErrorWithMessage = (
  error: unknown,
): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

/**
 * API 에러를 문자열로 변환하는 유틸리티
 */
export const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error occurred'
}
