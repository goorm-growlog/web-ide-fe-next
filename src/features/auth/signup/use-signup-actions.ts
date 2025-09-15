'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { signupApi } from '@/entities/auth/api/auth'
import type { SignupRequest } from '@/entities/auth/model/types'
import type { SignupFormData } from '@/features/auth/lib/validation'

export const useSignupActions = (
  form: ReturnType<typeof useForm<SignupFormData>>,
) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      setIsLoading(true)

      // Feature layer의 폼 데이터를 Entity layer의 요청 형식으로 변환
      const signupRequest: SignupRequest = {
        email: data.email,
        password: data.password,
        name: data.name,
      }

      // 회원가입 API 호출
      await signupApi(signupRequest)

      // 성공 메시지 표시
      toast.success(
        'Account created successfully! Please check your email for verification.',
      )

      // 로그인 페이지로 리다이렉트
      router.push('/signin')
    } catch (error) {
      console.error('Signup failed:', error)

      // 에러 메시지 표시
      if (error instanceof Error) {
        toast.error(
          error.message || 'Failed to create account. Please try again.',
        )
      } else {
        toast.error('Failed to create account. Please try again.')
      }

      // 폼 에러 설정
      form.setError('root', {
        type: 'manual',
        message: 'Signup failed. Please check your information and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    onSubmit,
    isLoading,
  }
}
