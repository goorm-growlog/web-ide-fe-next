'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  LoginForm,
  type PasswordResetData,
  PasswordResetDialog,
  SocialLogin,
  useLoginActions,
  useLoginForm,
  usePasswordResetActions,
  useSocialLogin,
} from '@/features/auth'
import AuthLayout from '@/shared/ui/auth-layout'

const SigninWidget = () => {
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] =
    useState(false)

  const { form } = useLoginForm()
  const { onSubmit: handleLogin, isLoading } = useLoginActions(form)
  const { onSocialLogin } = useSocialLogin()
  const { isLoading: passwordResetLoading, onSubmit: passwordResetAction } =
    usePasswordResetActions()

  const handlePasswordResetOpen = () => {
    setIsPasswordResetDialogOpen(true)
  }

  const handlePasswordReset = async (
    data: PasswordResetData,
  ): Promise<void> => {
    const success = await passwordResetAction(data)
    if (success) {
      setIsPasswordResetDialogOpen(false)
    }
  }

  return (
    <AuthLayout>
      {/* 로고 */}
      <div className="text-center mb-12">
        <Image
          src="/logo.svg"
          alt="GrowLog"
          width={0}
          height={0}
          className="w-auto h-10 mx-auto"
        />
      </div>
      <LoginForm
        form={form}
        isLoading={isLoading}
        onSubmit={handleLogin}
        onPasswordResetClick={handlePasswordResetOpen}
      />

      <div className="w-full flex items-center mt-12 mb-4">
        <hr className="flex-1 border-border" />
        <span className="mx-4 text-muted-foreground text-sm">or</span>
        <hr className="flex-1 border-border" />
      </div>
      <SocialLogin onSocialLogin={onSocialLogin} />
      <div className="mt-8 text-center text-muted-foreground text-sm">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="font-medium underline text-muted-foreground"
        >
          Sign Up
        </Link>
      </div>
      <PasswordResetDialog
        open={isPasswordResetDialogOpen}
        onOpenChange={setIsPasswordResetDialogOpen}
        onSubmit={handlePasswordReset}
        isLoading={passwordResetLoading}
      />
    </AuthLayout>
  )
}

export default SigninWidget
