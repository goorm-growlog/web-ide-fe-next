/**
 * 공통 API 응답 타입
 * 모든 API 응답은 이 구조를 따릅니다.
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  error: string | null
}
