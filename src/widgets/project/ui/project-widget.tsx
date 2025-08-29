'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/entities/auth/model/store'
import { logout as logoutApi } from '@/features/auth/logout/api/logout'
import { refreshToken as refreshTokenApi } from '@/features/auth/refresh/api/refresh'

/**
 * 프로젝트 관리 위젯
 * FSD 원칙에 맞게 pages와 features/entities 사이의 중간 계층
 */
export const ProjectWidget = () => {
  const { clearAuth, setAccessToken } = useAuthStore()
  const router = useRouter()

  return (
    <div style={{ padding: 24 }}>
      <h1>Project</h1>
      <button
        type="button"
        onClick={async () => {
          try {
            await logoutApi()
          } catch {
            // 로그아웃 API 실패는 조용히 처리
          }
          clearAuth()
          router.replace('/signin')
        }}
      >
        로그아웃
      </button>
      <button
        type="button"
        style={{ marginLeft: 8 }}
        onClick={async () => {
          try {
            const token = await refreshTokenApi()
            setAccessToken(token)
            alert(`토큰 갱신 성공: ${token.slice(0, 20)}...`)
          } catch (e) {
            alert(
              `토큰 갱신 실패: ${e instanceof Error ? e.message : String(e)}`,
            )
          }
        }}
      >
        리프레쉬
      </button>
    </div>
  )
}
