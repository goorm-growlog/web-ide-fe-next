'use client'

import { useSession } from 'next-auth/react'
import { useLogout } from '@/features/auth/logout/model/use-logout'

/**
 * 프로젝트 관리 위젯
 * FSD 원칙: 비즈니스 로직은 features에 위임하고 UI 조합만 담당
 * 클라이언트에서 세션을 조회하여 서버 의존성 제거
 */
export const ProjectWidget = () => {
  const { data: session, status } = useSession()
  const { logout } = useLogout()

  // 로딩 상태 (미들웨어가 보호하므로 빠르게 로드됨)
  if (status === 'loading') {
    return <div style={{ padding: 24 }}>Loading...</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Project</h1>
      <p>Welcome, {session?.user?.name || session?.user?.email}!</p>

      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  )
}
