'use client'

import { useState } from 'react'
import { SignupForm, useSignupActions, useSignupForm } from '@/features/auth'
import EmailVerificationForm from '@/features/auth/email-verification/ui/email-verification-form'
import AuthLayout from '@/shared/ui/auth-layout'
import { Button } from '@/shared/ui/shadcn/button'

/**
 * 회원가입 위젯
 * Widget layer의 역할: 여러 feature를 조합하여 비즈니스 시나리오 구현
 */
const SignupWidget = () => {
  const { form } = useSignupForm()
  const [email, setEmail] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const { onSubmit: handleSignup, isLoading } = useSignupActions(form, email)

  // 이메일 인증 완료 핸들러
  const handleEmailVerified = (verifiedEmail: string) => {
    setEmail(verifiedEmail)
    setIsEmailVerified(true)
  }

  return (
    <AuthLayout>
      <div className="mb-12 text-left">
        <h1 className="font-semibold text-2xl text-foreground">Sign up</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Enter your information to sign up!
        </p>
      </div>

      <div className="space-y-6">
        {/* Feature 1: 이메일 인증 */}
        <EmailVerificationForm
          onSendCode={async emailValue => {
            setEmail(emailValue)
          }}
          onVerifyCode={async () => {
            // 실제 인증 로직은 EmailVerificationForm 내부에서 처리
            // 여기서는 단순히 성공 시 상태 업데이트
            handleEmailVerified(email)
            return true
          }}
        />

        {/* Feature 2: 회원가입 폼 */}
        <form onSubmit={form.handleSubmit(handleSignup)}>
          <SignupForm form={form}>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
              disabled={isLoading || !isEmailVerified}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </SignupForm>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignupWidget
