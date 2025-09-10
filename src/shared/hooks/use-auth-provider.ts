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
  const { data: session, status } = useSession({
    required: false,
    // NextAuth 자동 재검증 완전 비활성화
    onUnauthenticated: () => undefined, // 콜백 비활성화
  })

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

  // 토큰 업데이트 이벤트 감지 (TokenManager와 연동)
  useEffect(() => {
    const handleTokenUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ accessToken?: string }>
      console.log('🔄 토큰 업데이트 이벤트 수신:', !!custom.detail?.accessToken)

      // SWR 캐시 갱신 (새 토큰으로 사용자 정보 재조회)
      if (custom.detail?.accessToken) {
        void refreshUser()
      }
    }

    window.addEventListener(
      'auth:token-updated',
      handleTokenUpdate as EventListener,
    )
    return () => {
      window.removeEventListener(
        'auth:token-updated',
        handleTokenUpdate as EventListener,
      )
    }
  }, [refreshUser])

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
