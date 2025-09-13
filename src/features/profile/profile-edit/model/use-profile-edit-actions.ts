'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { mutate } from 'swr'
import {
  deleteAccount,
  updatePassword,
  updateUserName,
  uploadProfileImage,
} from '@/entities/users'
import type { ProfileEditFormData } from './schema'

// 개별 업데이트 함수들을 분리하여 복잡도 감소
const createUpdatePromises = (
  data: ProfileEditFormData,
  profileImageFile: File | null | undefined,
  initialName: string | undefined,
): Promise<unknown>[] => {
  const promises: Promise<unknown>[] = []

  // 이름이 변경되었을 때만 업데이트
  if (data.name !== initialName && data.name.trim()) {
    promises.push(updateUserName(data.name))
  }

  // 비밀번호 변경이 요청되었을 때만 업데이트
  if (data.newPassword && data.currentPassword) {
    promises.push(updatePassword(data.currentPassword, data.newPassword))
  }

  // 프로필 이미지 업로드
  if (profileImageFile) {
    promises.push(uploadProfileImage(profileImageFile))
  }

  return promises
}

export const useProfileEditActions = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async (
    data: ProfileEditFormData,
    profileImageFile?: File | null,
    initialName?: string,
  ) => {
    setIsLoading(true)

    try {
      const promises = createUpdatePromises(data, profileImageFile, initialName)

      // 변경사항이 없으면 토스트만 표시
      if (promises.length === 0) {
        toast.info('No changes detected.')
        return
      }

      // 모든 변경사항 동시 처리
      await Promise.all(promises)

      // SWR 캐시 갱신 (사용자 정보 다시 가져오기)
      await mutate('/users/me')

      toast.success('Profile updated successfully!')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile'
      toast.error(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (password: string) => {
    setIsLoading(true)

    try {
      await deleteAccount(password)

      // 계정 삭제 후 캐시 정리
      await mutate('/users/me', null, { revalidate: false })

      toast.success('Account deleted successfully')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete account'
      toast.error(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleUpdateProfile,
    handleDeleteAccount,
  }
}
