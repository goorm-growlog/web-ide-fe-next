import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { PasswordResetData } from '../../model/validation-schema'
import { login } from '../api/login'
import { type LoginFormData, loginSchema } from './types'

export const useLoginForm = () => {
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)
  // isLoading은 form.formState.isSubmitting을 사용

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        const result = await login(data)
        if (!result.success) {
          form.setError('root', {
            type: 'server',
            message: result.message || '로그인에 실패했습니다.',
          })
          return
        }
        // 성공 시 root 에러 제거
        form.clearErrors('root')
      } catch (err: unknown) {
        let message = '알 수 없는 오류가 발생했습니다.'
        if (typeof err === 'object' && err && 'message' in err) {
          const maybeMsg = (err as Record<string, unknown>).message
          if (typeof maybeMsg === 'string') message = maybeMsg
        }
        form.setError('root', {
          type: 'server',
          message,
        })
      }
    },
    [form],
  )

  const onPasswordReset = async (_data: PasswordResetData) => {
    try {
      // TODO: 실제 비밀번호 재설정 로직 구현
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsPasswordResetOpen(false)
    } catch {
      // TODO: 에러 처리 로직 구현
    }
  }

  const onSocialLogin = (_provider: string) => {
    // TODO: 소셜 로그인 로직
  }

  return {
    form,
    isLoading: form.formState.isSubmitting,
    isPasswordResetOpen,
    setIsPasswordResetOpen,
    onSubmit,
    onPasswordReset,
    onSocialLogin,
  }
}
