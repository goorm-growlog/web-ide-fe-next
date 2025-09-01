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
    
    if (token) {
      // NextAuth에 토큰 저장하고 프로젝트 페이지로 이동
      signIn('credentials', {
        email: 'kakao-user',
        password: 'kakao-oauth',
        userData: JSON.stringify({ accessToken: token }),
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
