import { logout as logoutApi } from '@/features/auth/logout/api/logout'
import type { User } from '@/features/auth/types'
import { useAuthStore } from './store'

/**
 * 인증 관련 액션들을 제공하는 훅
 */
export const useAuthActions = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const clearAuth = useAuthStore(state => state.clearAuth)

  const saveAuth = (user: User) => {
    setAuth(user)
    // 사용자 정보만 localStorage에 저장 (토큰은 HttpOnly 쿠키로 관리)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (쿠키 삭제)
      await logoutApi()
    } catch {
      // 로그아웃 API 실패는 조용히 처리 (클라이언트 상태는 이미 정리됨)
    }

    // API 호출 성공 여부와 관계없이 클라이언트 상태는 정리
    clearAuth()
    localStorage.removeItem('user')
  }

  return { saveAuth, logout }
}
