/**
 * 사용자 관련 공통 타입 정의
 * 전역에서 사용되는 사용자 타입들
 */

// 사용자 타입 (전역에서 사용)
export interface User {
  id: string
  email: string
  name?: string
  profileImage: string | undefined
}

// API 응답 데이터 타입
export interface UserInfoData {
  userId: number
  name: string
  email: string
  profileImage?: string
}
