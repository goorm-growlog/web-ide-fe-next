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
    onUnauthenticated: () => undefined,
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

  // 클라이언트 측 토큰 갱신 후 세션 동기화
  useEffect(() => {
    const handleTokenUpdate = async (event: Event) => {
      const custom = event as CustomEvent<{ accessToken?: string }>
      const newAccessToken = custom.detail?.accessToken

      if (newAccessToken) {
        // 1. NextAuth 세션을 새 토큰으로 업데이트
        await update({ accessToken: newAccessToken })

        // 2. 새 토큰으로 사용자 정보 다시 불러오기
        await refreshUser()
      }
    }

    // ky-client에서 보낸 이벤트 리스닝
    window.addEventListener(
      'session-token-refresh',
      handleTokenUpdate as EventListener,
    )
    return () => {
      window.removeEventListener(
        'session-token-refresh',
        handleTokenUpdate as EventListener,
      )
    }
  }, [update, refreshUser])

  // API 응답을 User 타입으로 안전하게 변환
  const user: User | undefined = userData
    ? {
        id: userData.userId?.toString() || '',
        email: userData.email || '',
        name: userData.name || '',
        profileImage: userData.profileImage,
      }
    : undefined

  // Provider 정보 추출 (NextAuth 세션에서)
  const provider = session?.provider || undefined
  const isSocialLogin = provider === 'github' || provider === 'kakao'
  const isCredentialsLogin = provider === 'credentials'

  return {
    // 인증 상태
    isLoading: status === 'loading' || userLoading,
    isAuthenticated: status === 'authenticated',

    // Provider 정보
    provider,
    isSocialLogin,
    isCredentialsLogin,

    // 사용자 정보 (useUser 통합)
    user,
    userError: userError?.message || null,
    refreshUser,
  }
}
