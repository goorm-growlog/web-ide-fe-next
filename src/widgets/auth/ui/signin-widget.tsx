import Image from 'next/image'
import Link from 'next/link'
import { useLoginForm } from '@/features/auth/login/model/use-login-form'
import LoginForm from '@/features/auth/login/ui/login-form'
import SocialLogin from '@/features/auth/login/ui/social-login'
import { usePasswordResetDialogModel } from '@/features/auth/password-reset/model/use-password-reset-dialog-model'
import PasswordResetDialog from '@/features/auth/password-reset/ui/password-reset-dialog'
import AuthLayout from '@/shared/ui/auth-layout'

const SigninWidget = () => {
  const { form, isLoading, onSubmit, onPasswordReset, onSocialLogin } =
    useLoginForm()

  // 비밀번호 재설정 다이얼로그 모델 연결
  const passwordResetDialog = usePasswordResetDialogModel({
    onSubmit: onPasswordReset,
  })

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
        onSubmit={onSubmit}
        onPasswordResetClick={() => passwordResetDialog.setOpen(true)}
      />

      <div className="w-full flex items-center mt-12 mb-4">
        <hr className="flex-1 border-border" />
        <span className="mx-4 text-muted-foreground text-sm">or</span>
        <hr className="flex-1 border-border" />
      </div>
      <SocialLogin onSocialLogin={onSocialLogin} />
      <div className="mt-8 text-center text-muted-foreground text-sm">
        Don’t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium underline text-muted-foreground"
        >
          Sign Up
        </Link>
      </div>
      <PasswordResetDialog
        open={passwordResetDialog.open}
        onOpenChange={passwordResetDialog.onOpenChange}
        onSubmit={passwordResetDialog.onSubmit}
        isLoading={passwordResetDialog.isLoading}
      />
    </AuthLayout>
  )
}

export default SigninWidget
