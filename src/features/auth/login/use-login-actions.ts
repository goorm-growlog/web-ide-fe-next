'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { loginApi } from '@/entities/auth'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import { tokenManager } from '../lib/token-manager'
import type { LoginFormData } from '../lib/validation'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  // 에러 처리 헬퍼
  const showError = useCallback(
    (message: string) => {
      form?.setError('root', { type: 'server', message })
      toast.error(message)
    },
    [form],
  )

  // 백엔드 로그인 처리
  const handleCredentialsLogin = useCallback(
    async (data: LoginFormData) => {
      try {
        // 1. 백엔드 로그인 API 호출
        const loginData = await loginApi(data)

        // 2. 토큰 저장 (백엔드 중심)
        tokenManager.setTokens({
          accessToken: loginData.accessToken,
          refreshToken: '', // API 응답에 refreshToken 없음
        })

        // 3. NextAuth 세션 생성 (소셜 로그인 상태 관리용)
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          userData: JSON.stringify({
            userId: loginData.userId,
            name: loginData.name,
            email: data.email,
          }),
          redirect: false,
        })

        if (result?.ok) {
          toast.success('로그인 성공!')
          form?.clearErrors('root')

          // 사용자 정보 캐시 갱신
          mutate('/users/me')

          router.push('/project')
        } else {
          throw new Error('세션 생성 실패')
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error) || '로그인 실패'
        showError(errorMessage)

        // 토큰 정리
        tokenManager.clearTokens()
      }
    },
    [router, form, showError],
  )

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      return withLoading(() => handleCredentialsLogin(data))
    },
    [withLoading, handleCredentialsLogin],
  )

  return {
    onSubmit,
    isLoading,
  }
}
