import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuthActions } from '@/shared/store/use-auth'
import { login } from '../api/login'
import type { LoginFormData } from './types'

export const useLoginActions = (form?: UseFormReturn<LoginFormData>) => {
  const { saveAuth } = useAuthActions()

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        const result = await login(data)

        if (!result.success || !result.token || !result.user) {
          const errorMsg = result.message || 'Login failed.'
          form?.setError('root', { type: 'server', message: errorMsg })
          toast.error(errorMsg)
          return
        }
        saveAuth(result.token, result.user)
        toast.success('Login successful!')
        form?.clearErrors('root')
      } catch {
        const message = 'Cannot connect to server. Please check your network.'
        form?.setError('root', { type: 'server', message })
        toast.error(message)
      }
    },
    [saveAuth, form],
  )

  return { onSubmit }
}
