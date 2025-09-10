'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useSWR from 'swr'
import type { User } from '@/shared/types/user'

/**
 * 사용자 인증 상태와 사용자 정보를 통합 관리하는 훅
 * shared 레이어에서 NextAuth 의존성 관리
 */
export const useAuthProvider = () => {
  const {
    data: session,
    status,
    update,
  } = useSession({
    required: false,
    // NextAuth 자동 재검증 완전 비활성화
    onUnauthenticated: () => undefined, // 콜백 비활성화
  })

  // 토큰 갱신 이벤트를 감지하여 NextAuth 세션을 동기화
  useEffect(() => {
    const handleTokenUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ accessToken?: string }>
      const newToken = custom.detail?.accessToken
      if (!newToken) return

      void update({ accessToken: newToken })
    }

    window.addEventListener(
      'auth:access-token-updated',
      handleTokenUpdate as EventListener,
    )
    return () => {
      window.removeEventListener(
        'auth:access-token-updated',
        handleTokenUpdate as EventListener,
      )
    }
  }, [update])

  // 사용자 정보 조회 (세션이 있을 때만)
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    mutate: refreshUser,
  } = useSWR(
    status === 'authenticated' ? 'users/me' : null,
    // fetcher는 전역 설정에서 자동으로 사용됨 (authApi 사용)
  )

  // API 응답을 User 타입으로 안전하게 변환
  const user: User | undefined = userData
    ? {
        id: userData.userId?.toString() || '',
        email: userData.email || '',
        name: userData.name || '',
        profileImage: userData.profileImage,
      }
    : undefined

  const provider = session?.provider as
    | 'github'
    | 'kakao'
    | 'credentials'
    | undefined
  const isSocialLogin = provider === 'github' || provider === 'kakao'
  const isCredentialsLogin = provider === 'credentials'

  return {
    // 인증 상태
    provider,
    isSocialLogin,
    isCredentialsLogin,
    isLoading: status === 'loading' || userLoading,
    isAuthenticated: status === 'authenticated',

    // 사용자 정보 (useUser 통합)
    user,
    userError: userError?.message || null,
    refreshUser,
  }
}
