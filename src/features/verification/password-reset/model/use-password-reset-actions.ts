'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { resetPasswordApi as resetPassword } from '@/features/verification/password-reset/api/password-reset'
import type { PasswordResetData } from '@/features/verification/password-reset/model/schema'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'

export const usePasswordResetActions = () => {
  const { isLoading, withLoading } = useLoadingState()

  const onSubmit = useCallback(
    async (data: PasswordResetData) => {
      return withLoading(async () => {
        try {
          await resetPassword(data)
          toast.success('Password reset link has been sent to your email.')
          return true
        } catch (error) {
          const errorMsg =
            getErrorMessage(error) || 'Failed to send password reset request.'
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
