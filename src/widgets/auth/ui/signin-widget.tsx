import Link from 'next/link'
import AuthLayout from '@/shared/ui/auth-layout'
import LogoLink from '@/shared/ui/logo-link'
import SigninForm from '@/widgets/auth/ui/signin-form'

// 서버 컴포넌트
const SigninWidget = () => {
  return (
    <AuthLayout>
      {/* 로고 */}
      <div className="mt-8 mb-12 text-center">
        <LogoLink width={160} height={32} />
      </div>
      <SigninForm />
      <div className="mt-8 text-center text-muted-foreground text-sm">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-muted-foreground underline"
        >
          Sign Up
        </Link>
      </div>
    </AuthLayout>
  )
}

export default SigninWidget
