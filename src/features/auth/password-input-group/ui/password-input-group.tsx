'use client'

import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormField, PasswordInput } from '@/features/auth'
import { Input } from '@/shared/ui/shadcn/input'

interface PasswordInputGroupProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  passwordName?: FieldPath<T>
  confirmPasswordName?: FieldPath<T>
  showGuide?: boolean
}

/**
 * 패스워드와 패스워드 확인 필드를 함께 관리하는 그룹 컴포넌트
 */
const PasswordInputGroup = <T extends FieldValues = FieldValues>({
  control,
  passwordName = 'password' as FieldPath<T>,
  confirmPasswordName = 'passwordConfirm' as FieldPath<T>,
  showGuide = false,
}: PasswordInputGroupProps<T>) => {
  return (
    <div className="space-y-2">
      {/* Password */}
      <FormField control={control} name={passwordName} label="Password">
        {field => (
          <div>
            {showGuide && (
              <div className="mb-2 text-muted-foreground text-xs">
                Must be at least 8 characters long
              </div>
            )}
            <PasswordInput {...field} placeholder="Enter your password" />
          </div>
        )}
      </FormField>

      {/* Password Confirmation */}
      <FormField control={control} name={confirmPasswordName} label="">
        {field => (
          <Input {...field} type="password" placeholder="Confirm password" />
        )}
      </FormField>
    </div>
  )
}

export default PasswordInputGroup
