import Image from 'next/image'
import Link from 'next/link'
import AuthLayout from '@/shared/ui/auth-layout'
import SigninForm from './signin-form'

// 서버 컴포넌트
const SigninWidget = () => {
  return (
    <AuthLayout>
      {/* 로고 */}
      <div className="text-center mb-12">
        <div className="relative w-auto h-10 mx-auto inline-block">
          <Image
            src="/logo.svg"
            alt="GrowLog"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <SigninForm />
      <div className="mt-8 text-center text-muted-foreground text-sm">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="font-medium underline text-muted-foreground"
        >
          Sign Up
        </Link>
      </div>
    </AuthLayout>
  )
}

export default SigninWidget
