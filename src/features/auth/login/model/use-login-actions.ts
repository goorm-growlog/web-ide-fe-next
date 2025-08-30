'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import type { LoginFormData } from '../../model/types'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  // 복잡한 로그인 처리 로직을 useCallback으로 분리
  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      try {
        // 1. 커스텀 API Route로 로그인 (쿠키 포워딩)
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        })

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json()
          const errorMessage = errorData?.error?.message || 'Login failed'
          form?.setError('root', { type: 'server', message: errorMessage })
          toast.error(errorMessage)
          return
        }

        const loginData = await loginResponse.json()

        if (!loginData.success) {
          const errorMessage = loginData.error?.message || 'Login failed'
          form?.setError('root', { type: 'server', message: errorMessage })
          toast.error(errorMessage)
          return
        }

        // 2. NextAuth 세션 생성 (이미 쿠키는 설정됨)
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          // 실제 사용자 정보를 NextAuth에 전달
          userData: JSON.stringify({
            userId: loginData.data.userId,
            name: loginData.data.name,
            accessToken: loginData.data.accessToken,
          }),
          redirect: false,
        })

        if (result?.ok) {
          toast.success('Login successful!')
          form?.clearErrors('root')
          router.push('/project')
        } else {
          const errorMessage = result?.error || 'Failed to login'
          form?.setError('root', { type: 'server', message: errorMessage })
          toast.error(errorMessage)
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error) || 'Failed to login'
        form?.setError('root', { type: 'server', message: errorMessage })
        toast.error(errorMessage)
      }
    },
    [form, router],
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
