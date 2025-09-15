'use client'

import type { MouseEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import type { SignupFormData } from '@/features/auth/lib/validation'
import FormField from '@/shared/ui/form-field'
import PasswordInput from '@/shared/ui/password-input'
import { Button } from '@/shared/ui/shadcn/button'
import { Form } from '@/shared/ui/shadcn/form'

interface SignupFormProps {
  form: UseFormReturn<SignupFormData>
  isLoading: boolean
  onSubmit: (data: SignupFormData) => Promise<void>
  hideEmailField?: boolean
  isEmailVerified: boolean // 이메일 인증 상태를 prop으로 받음
}

const SignupForm = ({
  form,
  isLoading,
  onSubmit,
  hideEmailField = false,
  isEmailVerified,
}: SignupFormProps) => {
  // 버튼 클릭 시 실행될 핸들러
  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    // react-hook-form 유효성 검사보다 먼저 이메일 인증 여부를 확인
    if (!isEmailVerified) {
      // 폼 제출을 막음
      event.preventDefault()
      toast.error('Please complete email verification first.')
    }
    // 이메일이 인증되었다면, 버튼의 기본 동작(type="submit")이 실행됨
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 이름 입력 */}
        <FormField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter your name"
          type="text"
        />

        {/* 이메일 입력 - hideEmailField가 false일 때만 표시 */}
        {!hideEmailField && (
          <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
          />
        )}

        {/* 비밀번호 입력 */}
        <FormField control={form.control} name="password" label="Password">
          {field => (
            <PasswordInput
              {...field}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="new-password"
            />
          )}
        </FormField>

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
          disabled={isLoading}
          onClick={handleButtonClick} // onClick 핸들러 추가
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  )
}

export default SignupForm
