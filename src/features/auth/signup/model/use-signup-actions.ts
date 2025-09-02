'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import type { SignupFormData } from '../../model/types'
import { signup as signupApi } from '../api/signup'

export const useSignupActions = (
  form?: UseFormReturn<SignupFormData>,
  email?: string,
) => {
  const { isLoading, withLoading } = useLoadingState()
  const router = useRouter()

  const onSubmit = useCallback(
    async (data: SignupFormData) => {
      return withLoading(async () => {
        try {
          if (!email) {
            throw new Error('Email is required for signup')
          }

          // API 전송용 데이터 정리 (불필요한 필드 제외)
          const {
            passwordConfirm: _,
            profileImage: __,
            ...signupPayload
          } = data
          const payload = { ...signupPayload, email }
          await signupApi(payload)

          toast.success('Signup successful! Please verify your email.')
          form?.clearErrors('root')
          router.push('/signin') // 회원가입 후 로그인 페이지로 이동
        } catch (error) {
          const errorMsg = getErrorMessage(error) || 'Signup failed.'
          form?.setError('root', { type: 'server', message: errorMsg })
          toast.error(errorMsg)
        }
      })
    },
    [email, form, withLoading, router],
  )

  return {
    onSubmit,
    isLoading,
  }
}
