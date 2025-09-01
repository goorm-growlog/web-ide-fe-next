'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

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
      // NextAuth에 사용자 정보와 토큰 저장
      signIn('credentials', {
        userData: JSON.stringify({ 
          userId: parseInt(userId),
          name,
          accessToken: token 
        }),
        redirect: false,
      }).then(() => {
        router.push('/project')
      })
    } else {
      router.push('/signin')
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">로그인 완료 중...</p>
    </div>
  )
}
