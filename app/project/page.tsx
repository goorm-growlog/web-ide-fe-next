"use client"

import { useRouter } from 'next/navigation'
import { useAuthActions } from '@/entities/auth'
import { useAuthRestore } from '@/entities/auth/model/restore'

const ProjectPage = () => {
  useAuthRestore() // 백그라운드에서 상태 복원
  
  const { logout, refreshTokens } = useAuthActions()
  const router = useRouter()

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
