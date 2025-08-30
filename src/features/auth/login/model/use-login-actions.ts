'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { api } from '@/shared/api/ky-client'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import type { LoginFormData } from '../../model/types'

interface LoginApiResponse {
  success: boolean
  data?: { userId: number; name: string; accessToken: string }
  error?: { code: string; message: string }
}

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      return withLoading(async () => {
        try {
          // Call backend login API directly
          const response = await api
            .post('auth/login', {
              json: { email: data.email, password: data.password },
              credentials: 'include',
            })
            .json<LoginApiResponse>()

          if (!response.success) {
            const errorMessage = response.error?.message || 'Login failed'
            form?.setError('root', { type: 'server', message: errorMessage })
            toast.error(errorMessage)
            return
          }

          // Create NextAuth session on success
          const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
          })

          if (result?.ok) {
            toast.success('Login successful!')
            form?.clearErrors('root')
            router.push('/project')
          } else {
            const errorMessage = 'Failed to create session'
            form?.setError('root', { type: 'server', message: errorMessage })
            toast.error(errorMessage)
          }
        } catch (error) {
          let errorMessage = getErrorMessage(error) || 'Login failed'

          // Handle ky HTTPError
          if (
            error &&
            typeof error === 'object' &&
            'name' in error &&
            error.name === 'HTTPError'
          ) {
            try {
              const httpError = error as unknown as { response: Response }
              const body = await httpError.response.json()
              errorMessage = body?.error?.message || errorMessage
            } catch {
              // Use fallback message if parsing fails
            }
          }

          form?.setError('root', { type: 'server', message: errorMessage })
          toast.error(errorMessage)
        }
      })
    },
    [form, withLoading, router],
  )

  return {
    onSubmit,
    isLoading,
  }
}
