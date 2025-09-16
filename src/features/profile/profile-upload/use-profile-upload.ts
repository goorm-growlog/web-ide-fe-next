'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/ky-client'
import { useLoadingState } from '@/shared/hooks/use-loading-state'

export const useProfileImageUpload = () => {
  const { isLoading, withLoading } = useLoadingState()

  const uploadImage = useCallback(
    async (file: File) => {
      return withLoading(async () => {
        try {
          const formData = new FormData()
          formData.append('profileImage', file)
          await authApi.patch('/api/users/profile-image', { body: formData })
          toast.success('Profile image updated!')
        } catch (error) {
          console.error('Profile image upload failed:', error)
          toast.error('Failed to upload profile image.')
          throw error
        }
      })
    },
    [withLoading],
  )

  return {
    uploadImage,
    isLoading,
  }
}
