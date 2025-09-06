'use client'

import { useUser } from '@/entities/users'
import { useLogout } from '@/features/auth/logout/model/use-logout'

export const ProjectWidget = () => {
  const { user, isLoading } = useUser()
  const { logout } = useLogout()

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading...</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Project</h1>
      <p>Welcome, {user?.name || user?.email}!</p>

      <button type="button" onClick={logout}>
        로그아웃
      </button>
    </div>
  )
}
