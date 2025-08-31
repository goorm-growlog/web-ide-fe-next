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

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      try {
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
          const errorMessage = loginData?.error?.message || 'Login failed'
          form?.setError('root', { type: 'server', message: errorMessage })
          toast.error(errorMessage)
          return
        }

        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          userData: JSON.stringify(loginData.data),
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
        const errorMessage = getErrorMessage(error) || 'Failed to login'
        form?.setError('root', { type: 'server', message: errorMessage })
        toast.error(errorMessage)
      }
    },
    [router, form],
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
