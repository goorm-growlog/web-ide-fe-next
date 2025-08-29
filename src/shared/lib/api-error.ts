/**
 * API 응답 에러 처리 유틸리티
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * API 응답에서 에러 메시지를 추출합니다 (내부용)
 */
const extractErrorMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<string> => {
  try {
    const errorData = await response.json()
    return errorData.error?.message || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

/**
 * 표준 API 에러 처리
 */
export const handleApiError = async (
  response: Response,
  fallbackMessage: string,
): Promise<never> => {
  const message = await extractErrorMessage(response, fallbackMessage)
  throw new ApiError(message, response.status)
}
