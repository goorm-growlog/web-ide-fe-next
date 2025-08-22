'use client'

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

const SigninForm = () => {
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
    <>
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
