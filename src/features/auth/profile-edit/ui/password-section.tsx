'use client'

import type { UseFormReturn } from 'react-hook-form'
import type { ProfileEditFormData } from '@/features/auth/model/types'
import FormField from '@/features/auth/ui/form-field'
import PasswordInput from '@/features/auth/ui/password-input'
import { Input } from '@/shared/ui/shadcn'

interface PasswordSectionProps {
  form: UseFormReturn<ProfileEditFormData>
  isSocialUser: boolean
}

const PasswordSection = ({ form, isSocialUser }: PasswordSectionProps) => {
  // 소셜 로그인 사용자는 비밀번호 섹션을 완전히 숨김
  if (isSocialUser) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="font-medium text-foreground text-sm">Password</div>
        <p className="mt-1 text-muted-foreground text-xs">
          Must be at least 8 characters long, including both letters and
          numbers.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-muted-foreground text-xs">Current Password</div>
          <FormField control={form.control} name="currentPassword" label="">
            {field => (
              <PasswordInput
                {...field}
                placeholder="Enter your current password"
              />
            )}
          </FormField>
        </div>

        <div>
          <div className="text-muted-foreground text-xs">New Password</div>
          <div className="space-y-2">
            <FormField control={form.control} name="newPassword" label="">
              {field => (
                <PasswordInput
                  {...field}
                  placeholder="Enter your new password"
                />
              )}
            </FormField>
            <FormField control={form.control} name="confirmPassword" label="">
              {field => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm your new password"
                />
              )}
            </FormField>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordSection
