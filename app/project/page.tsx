"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthActions } from '@/entities/auth'
import { useAuthGuard } from '@/shared/hooks/use-auth-guard'

const ProjectPage = () => {
  const { ensured, redirecting } = useAuthGuard()
  const { logout, refreshTokens } = useAuthActions()
  const router = useRouter()

  useEffect(() => {
    if (ensured && !redirecting) {
      // no-op
    }
  }, [ensured, redirecting])

  if (!ensured) return null

  return (
    <div style={{ padding: 24 }}>
      <h1>Project</h1>
        <button onClick={async () => { await logout(); router.replace('/signin') }}>로그아웃</button>
        <button
          style={{ marginLeft: 8 }}
          onClick={async () => {
            try {
            const token = await refreshTokens();
            window.alert('AccessToken 갱신 성공: ' + token);
          } catch (e) {
            window.alert('AccessToken 갱신 실패: ' + (e instanceof Error ? e.message : String(e)));
          }
          }}
        >리프레쉬</button>
    </div>
  )
}

export default ProjectPage
