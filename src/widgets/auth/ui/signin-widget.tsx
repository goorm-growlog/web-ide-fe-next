import Link from 'next/link'
import { useLoginForm } from '@/features/auth/login/model/use-login-form'
import LoginForm from '@/features/auth/login/ui/login-form'
import SocialLogin from '@/features/auth/login/ui/social-login'
import PasswordResetDialog from '@/features/auth/password-reset/ui/password-reset-dialog'
import AuthLayout from '@/shared/ui/auth-layout'

const SigninWidget = () => {
  const {
    form,
    isLoading,
    isPasswordResetOpen,
    setIsPasswordResetOpen,
    onSubmit,
    onPasswordReset,
    onSocialLogin,
  } = useLoginForm()

  return (
    <AuthLayout>
      <LoginForm
        form={form}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onPasswordResetClick={() => setIsPasswordResetOpen(true)}
      />

      <div className="w-full flex items-center mt-12 mb-6">
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
        open={isPasswordResetOpen}
        onOpenChange={setIsPasswordResetOpen}
        onSubmit={onPasswordReset}
        isLoading={false}
      />
    </AuthLayout>
  )
}

export default SigninWidget
