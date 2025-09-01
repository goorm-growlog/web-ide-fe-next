/**
 * 카카오 로그인 관련 타입 정의
 */

export interface KakaoLoginResponse {
  success: boolean
  data: {
    accessToken: string
  }
  error?: {
    message: string
    code: string
  }
}
