'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { ProfileEditFormData } from '@/features/auth/model/types'
import { profileEditSchema } from '@/features/auth/model/validation-schema'

interface UseProfileEditFormProps {
  defaultName?: string | undefined
}

export const useProfileEditForm = ({
  defaultName = '',
}: UseProfileEditFormProps = {}) => {
  const defaultValues: ProfileEditFormData = {
    name: defaultName,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onSubmit', // 제출시에만 검증 (처음 렌더링시 에러 없음)
    defaultValues,
  })

  // 기본값이 변경되면 폼 업데이트
  useEffect(() => {
    if (defaultName && defaultName !== form.getValues('name')) {
      form.setValue('name', defaultName)
    }
  }, [defaultName, form])

  return { form }
}
