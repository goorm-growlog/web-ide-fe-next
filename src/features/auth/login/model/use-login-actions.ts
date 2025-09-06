'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuthStore } from '@/entities/auth/model/store'
import type { LoginFormData } from '@/features/auth/model/types'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import { login as loginApi } from '../api/login'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const setAuth = useAuthStore(state => state.setAuth)
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      return withLoading(async () => {
        try {
          const { user, accessToken } = await loginApi({
            email: data.email,
            password: data.password,
          })
          setAuth(user, accessToken) // persist가 자동으로 localStorage에 저장
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
    [setAuth, form, withLoading, router],
  )

  return {
    onSubmit,
    isLoading,
  }
}
