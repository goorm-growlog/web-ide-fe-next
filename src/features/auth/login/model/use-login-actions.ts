'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuthActions } from '@/entities/auth'
import type { LoginFormData } from '@/features/auth/types'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import { login } from '../api/login'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { saveAuth } = useAuthActions()
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      return withLoading(async () => {
        try {
          const user = await login(data)
          saveAuth(user)
          toast.success('Login successful!')
          form?.clearErrors('root')
          router.push('/project') // 로그인 성공 시 프로젝트 페이지로 이동
        } catch (error) {
          const errorMsg = getErrorMessage(error) || 'Login failed.'
          form?.setError('root', { type: 'server', message: errorMsg })
          toast.error(errorMsg)
        }
      })
    },
    [saveAuth, form, withLoading, router],
  )

  return {
    onSubmit,
    isLoading,
  }
}
