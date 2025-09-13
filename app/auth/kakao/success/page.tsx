'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { kakaoLoginApi } from '@/entities/auth/api/auth'

function KakaoSuccessHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleKakaoSuccess = async () => {
      const token = searchParams.get('token')
      const userId = searchParams.get('userId')
      const name = searchParams.get('name')
      const email = searchParams.get('email')

      if (token && userId && name) {
        try {
          const loginData = await kakaoLoginApi({
            userId: parseInt(userId, 10),
            name: decodeURIComponent(name),
            accessToken: token,
          })

          const userWithTokens = {
            id: parseInt(userId, 10),
            name: decodeURIComponent(name),
            email: email,
            accessToken: loginData.accessToken,
          }

          const result = await signIn('credentials', {
            user: JSON.stringify(userWithTokens),
            redirect: false,
          })

          if (result?.error) {
            toast.error('Login failed. Please try again.')
            router.push('/signin')
          } else {
            toast.success('Login successful!')
            await mutate('users/me')
            router.push('/project')
          }
        } catch {
          toast.error('An error occurred during login processing.')
          router.push('/signin')
        }
      } else {
        toast.error('Login information is invalid. Please try again.')
        router.push('/signin')
      }
    }

    handleKakaoSuccess()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg">Processing Kakao login...</p>
      </div>
    </div>
  )
}

export default function KakaoSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Login in progress...</p>
        </div>
      }
    >
      <KakaoSuccessHandler />
    </Suspense>
  )
}
