'use client'

import { useState } from 'react'
import { useLoginActions } from '@/features/auth/login/model/use-login-actions'
import { useLoginForm } from '@/features/auth/login/model/use-login-form'
import LoginForm from '@/features/auth/login/ui/login-form'
import type { PasswordResetData } from '@/features/auth/password-reset/model/schema'
import { usePasswordResetActions } from '@/features/auth/password-reset/model/use-password-reset-actions'
import PasswordResetDialog from '@/features/auth/password-reset/ui/password-reset-dialog'
import SocialLoginWidget from '@/widgets/social-login/ui/social-login-widget'

const SigninForm = () => {
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] =
    useState(false)

  const { form } = useLoginForm()
  const { onSubmit: handleLogin, isLoading } = useLoginActions(form)
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
    <>
      <LoginForm
        form={form}
        isLoading={isLoading}
        onSubmit={handleLogin}
        onPasswordResetClick={handlePasswordResetOpen}
      />
      <div className="mt-12 mb-4 flex w-full items-center">
        <hr className="flex-1 border-border" />
        <span className="mx-4 text-muted-foreground text-sm">or</span>
        <hr className="flex-1 border-border" />
      </div>
      <SocialLoginWidget />
      <PasswordResetDialog
        open={isPasswordResetDialogOpen}
        onOpenChange={setIsPasswordResetDialogOpen}
        onSubmit={handlePasswordReset}
        isLoading={passwordResetLoading}
      />
    </>
  )
}

export default SigninForm
