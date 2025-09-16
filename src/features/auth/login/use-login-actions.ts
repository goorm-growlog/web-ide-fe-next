'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { loginApi } from '@/entities/auth/api/auth'
import type { LoginRequest } from '@/entities/auth/model/types'
import type { LoginFormData } from '@/features/auth/lib/validation'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  const showError = useCallback(
    (message: string) => {
      form?.setError('root', { type: 'server', message })
      toast.error(message)
    },
    [form],
  )

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
          toast.success('Login successful!')
          form?.clearErrors('root')
          mutate('/api/users/me')
          router.push('/project')
        } else {
          throw new Error(result?.error || 'Failed to create session')
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error) || 'Login failed'
        showError(errorMessage)
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
