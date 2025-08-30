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

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      return withLoading(async () => {
        try {
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
            throw new Error('Login failed')
          }
        } catch (error) {
          const errorMsg = getErrorMessage(error) || 'Login failed.'
          form?.setError('root', { type: 'server', message: errorMsg })
          toast.error(errorMsg)
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
