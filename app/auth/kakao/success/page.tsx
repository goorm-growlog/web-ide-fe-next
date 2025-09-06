'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

/**
 * 카카오 로그인 성공 페이지
 * 백엔드에서 토큰과 함께 리다이렉트되는 페이지
 */
export default function KakaoSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    
    if (token && userId && name) {
      signIn('credentials', {
        userData: JSON.stringify({ 
          userId: parseInt(userId),
          name: decodeURIComponent(name),
          accessToken: token 
        }),
        redirect: false,
      }).then((result) => {
        if (result?.error) {
          toast.error('fail to login. please try again.')
          router.push('/auth/signin')
        } else {
          toast.success(`login success!`)
          router.push('/project')
        }
      })
    } else {
      toast.error('login invalid. please try again.')
      router.push('/auth/signin')
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">login in progress...</p>
    </div>
  )
}
