'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import type { LoginFormData } from '../../model/types'
import { loginApi } from '../api/login-api'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  // 간단한 에러 처리 헬퍼
  const showError = useCallback(
    (message: string) => {
      form?.setError('root', { type: 'server', message })
      toast.error(message)
    },
    [form],
  )

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      try {
        // 1. 백엔드 로그인 API 호출
        const loginData = await loginApi(data)

        // 2. NextAuth 세션 생성
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          userData: JSON.stringify(loginData),
          redirect: false,
        })

        if (result?.ok) {
          toast.success('Login successful!')
          form?.clearErrors('root')
          router.push('/project')
        } else {
          showError('Failed to create session')
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error) || 'Failed to login'
        showError(errorMessage)
      }
    },
    [router, form, showError],
  )

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      return withLoading(() => handleLogin(data))
    },
    [withLoading, handleLogin],
  )

  return {
    onSubmit,
    isLoading,
  }
}
