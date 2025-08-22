import Image from 'next/image'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
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
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
