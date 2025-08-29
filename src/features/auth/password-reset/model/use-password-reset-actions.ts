'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import type { PasswordResetData } from '@/features/auth/model/validation-schema'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'
import { resetPassword } from '../api/reset-password'

export const usePasswordResetActions = () => {
  const { isLoading, withLoading } = useLoadingState()

  const onSubmit = useCallback(
    async (data: PasswordResetData) => {
      return withLoading(async () => {
        try {
          await resetPassword(data)
          toast.success('비밀번호 재설정 링크가 이메일로 전송되었습니다.')
          return true
        } catch (error) {
          const errorMsg =
            getErrorMessage(error) || '비밀번호 재설정 요청에 실패했습니다.'
          toast.error(errorMsg)
          return false
        }
      })
    },
    [withLoading],
  )

  return {
    isLoading,
    onSubmit,
  }
}
