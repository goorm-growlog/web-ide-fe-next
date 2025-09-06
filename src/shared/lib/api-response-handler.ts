import type { ApiResponse } from '@/shared/types/api'

/**
 * API 응답을 처리하고 데이터를 추출합니다.
 * @param response API 응답 객체
 * @param errorMessage 기본 에러 메시지
 * @returns 성공 시 데이터 반환
 * @throws 실패 시 에러 발생
 */
export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  errorMessage = 'API request failed',
): T => {
  if (!response.success || !response.data) {
    throw new Error(response.error || errorMessage)
  }
  return response.data
}

/**
 * 확장된 에러 정보가 있는 API 응답을 처리합니다.
 * @param response API 응답 객체 (확장 에러 포함)
 * @param errorMessage 기본 에러 메시지
 * @returns 성공 시 데이터 반환
 * @throws 실패 시 에러 발생
 */
export const handleApiResponseWithDetailedError = <T>(
  response: {
    success: boolean
    data: T | null
    error?: { code: string; message: string }
  },
  errorMessage = 'API request failed',
): T => {
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || errorMessage)
  }
  return response.data
}

/**
 * 데이터 없이 성공/실패만 확인하는 API 응답을 처리합니다.
 * @param response API 응답 객체
 * @param errorMessage 기본 에러 메시지
 * @throws 실패 시 에러 발생
 */
export const handleApiSuccess = (
  response: {
    success: boolean
    error?: { code: string; message: string } | string
  },
  errorMessage = 'API request failed',
): void => {
  if (!response.success) {
    const errorMsg =
      typeof response.error === 'string'
        ? response.error
        : response.error?.message || errorMessage
    throw new Error(errorMsg)
  }
}
