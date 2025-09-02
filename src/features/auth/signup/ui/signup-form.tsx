'use client'

import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { FormField } from '@/features/auth'
import { PasswordInputGroup } from '@/features/auth/password-input-group'
import { ProfileAvatar } from '@/features/auth/profile-avatar'
import { Form } from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'
import type { SignupFormData } from '../../model/types'

interface SignupFormProps {
  form: UseFormReturn<SignupFormData>
  children?: ReactNode
}

/**
 * 회원가입 폼 (순수 UI 컴포넌트)
 * Feature layer: 단일 책임 - 사용자 정보 입력만 담당
 */
export const SignupForm = ({ form, children }: SignupFormProps) => {
  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex justify-center">
          <ProfileAvatar
            src={form.watch('profileImage')}
            onImageChange={imageUrl => form.setValue('profileImage', imageUrl)}
            onImageSelect={file => console.log('Selected file:', file)}
          />
        </div>

        <FormField name="username" control={form.control} label="사용자명">
          {field => <Input {...field} placeholder="사용자명 입력" />}
        </FormField>

        <PasswordInputGroup control={form.control} />

        {children}
      </div>
    </Form>
  )
}

export default SignupForm
