import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  emailSchema,
  type PasswordResetData,
  passwordSchema,
} from '../../model/validation-schema'
import { login } from '../api/login'

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>

export const useLoginForm = () => {
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data)
    } catch {
      // TODO: 에러 처리
    } finally {
      setIsLoading(false)
    }
  }

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
    isLoading,
    isPasswordResetOpen,
    setIsPasswordResetOpen,
    onSubmit,
    onPasswordReset,
    onSocialLogin,
  }
}
