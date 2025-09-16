// Auth 도메인의 핵심 타입들

/**
 * 로그인 API 응답 데이터
 */
export interface LoginData {
  userId: number
  name: string
  accessToken: string
}

/**
 * 로그인 API 요청 데이터
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * 회원가입 API 요청 데이터
 */
export interface SignupRequest {
  email: string
  password: string
  name: string
}
