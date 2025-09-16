'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { SignupFormData } from '@/features/auth/lib/validation'
import SignupForm from '@/features/auth/signup/signup-form'
import { useSignupActions } from '@/features/auth/signup/use-signup-actions'
import { useSignupForm } from '@/features/auth/signup/use-signup-form'
import ProfileAvatar from '@/features/profile/profile-avatar/ui/profile-avatar'
import { useProfileImageUpload } from '@/features/profile/profile-upload/use-profile-upload'
import {
  sendEmailVerificationCodeApi,
  verifyEmailCodeApi,
} from '@/features/verification/email-verification/api/email-verification'
import EmailVerificationForm from '@/features/verification/email-verification/ui/email-verification-form'
import AuthLayout from '@/shared/ui/auth-layout'

import BackButton from '@/shared/ui/back-button'

/**
 * 회원가입 위젯
 * Widget layer의 역할: 여러 feature를 조합하여 비즈니스 시나리오 구현
 */
const SignupWidget = () => {
  const { form } = useSignupForm()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const { onSubmit: handleSignup, isLoading } = useSignupActions(form)

  // Profile upload 훅 사용
  const profileUpload = useProfileImageUpload()

  // 이메일 인증 완료 핸들러
  const handleEmailVerified = (verifiedEmail: string) => {
    setEmail(verifiedEmail)
    form.setValue('email', verifiedEmail)
    setIsEmailVerified(true)
  }

  // 프로필 이미지 선택 핸들러
  const handleImageSelect = (file: File) => {
    setProfileImageFile(file)
  }

  // 프로필 이미지가 포함된 회원가입 핸들러
  const handleSignupWithImage = async (data: SignupFormData) => {
    try {
      // 1. 회원가입 처리
      await handleSignup(data)

      // 2. 자동 로그인
      const signInResponse = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (signInResponse?.error) {
        router.push('/signin')
        return
      }

      // 3. 프로필 이미지 업로드
      if (profileImageFile) {
        try {
          await profileUpload.uploadImage(profileImageFile)
        } catch (uploadError) {
          console.error('Profile image upload failed:', uploadError)
        }
      }

      // 4. 최종 성공 및 리다이렉트
      toast.success('Welcome! Your account has been created.')
      router.push('/project')
    } catch (error) {
      console.error('Signup process failed.', error)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-4 flex justify-start">
        <BackButton fallbackUrl="/" />
      </div>

      <div className="mb-4 text-left">
        <h1 className="font-semibold text-2xl text-foreground">Sign up</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Enter your information to sign up!
        </p>
      </div>

      {/* Divider */}
      <div className="mb-6 border-border/80 border-t"></div>

      <div className="space-y-4">
        {/* Profile Avatar */}
        <div className="flex justify-center">
          <div className="scale-90">
            <ProfileAvatar onImageSelect={handleImageSelect} />
          </div>
        </div>

        {/* Feature 1: 이메일 인증 */}
        <EmailVerificationForm
          onSendCode={async emailValue => {
            await sendEmailVerificationCodeApi(emailValue)
            setEmail(emailValue)
          }}
          onVerifyCode={async code => {
            const isVerified = await verifyEmailCodeApi(email, code)
            if (isVerified) {
              handleEmailVerified(email)
              return true
            } else {
              return false
            }
          }}
        />

        {/* Feature 2: 회원가입 폼 */}
        <SignupForm
          form={form}
          isLoading={isLoading}
          onSubmit={handleSignupWithImage}
          hideEmailField={true}
          isEmailVerified={isEmailVerified}
        />
      </div>

      <div className="mt-8 text-center text-muted-foreground text-sm">
        Already have an account?{' '}
        <Link
          href="/signin"
          className="font-medium text-muted-foreground underline"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  )
}

export default SignupWidget
