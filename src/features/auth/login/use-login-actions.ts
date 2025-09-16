'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { mutate } from 'swr'
import { loginApi } from '@/entities/auth/api/auth'
import type { LoginRequest } from '@/entities/auth/model/types'
import type { LoginFormData } from '@/features/auth/lib/validation'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { handleAuthError } from '@/shared/lib/error-handler'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  const handleCredentialsLogin = useCallback(
    async (data: LoginFormData) => {
      try {
        // Feature layer의 폼 데이터를 Entity layer의 요청 형식으로 변환
        const loginRequest: LoginRequest = {
          email: data.email,
          password: data.password,
        }

        const loginData = await loginApi(loginRequest)

        const userWithTokens = {
          id: loginData.userId,
          name: loginData.name,
          email: data.email,
          accessToken: loginData.accessToken,
        }

        const result = await signIn('credentials', {
          user: JSON.stringify(userWithTokens),
          redirect: false,
        })

        if (result?.ok) {
          form?.clearErrors('root')
          mutate('/api/users/me')
          router.push('/projects')
        } else {
          throw new Error(result?.error || 'Failed to create session')
        }
      } catch (error) {
        handleAuthError(error)
      }
    },
    [router, form],
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
