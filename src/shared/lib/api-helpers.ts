import type { ApiResponse } from '@/shared/types/api'

/**
 * API 응답에서 데이터 추출 (서버/클라이언트 공용)
 */
export const apiHelpers = {
  extractData: <T>(response: ApiResponse<T>): T => {
    if ('ok' in response && !response.ok) {
      const errorMessage =
        typeof response.error === 'object' &&
        response.error &&
        'message' in response.error
          ? (response.error as { message: string }).message
          : typeof response.error === 'string'
            ? response.error
            : 'API request failed'
      throw new Error(errorMessage)
    }
    if (response.data === undefined || response.data === null) {
      throw new Error('No API response data.')
    }
    return response.data
  },
  checkSuccess: (response: {
    success: boolean
    error?: string | null
  }): void => {
    if (!response.success) {
      throw new Error(response.error || 'API request failed')
    }
  },
}
