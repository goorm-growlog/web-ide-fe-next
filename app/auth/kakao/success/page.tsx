'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { mutate } from 'swr'

/**
 * 카카오 로그인 성공 처리 컴포넌트
 * useSearchParams를 사용하므로 Suspense로 감싸져야 함
 */
function KakaoSuccessHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleKakaoSuccess = async () => {
      const token = searchParams.get('token')
      const userId = searchParams.get('userId')
      const name = searchParams.get('name')
      
      if (token && userId && name) {
        try {
          const result = await signIn('credentials', {
            userData: JSON.stringify({ 
              userId: parseInt(userId, 10),
              name: decodeURIComponent(name),
              accessToken: token 
            }),
            redirect: false,
          })

          if (result?.error) {
            toast.error('로그인에 실패했습니다. 다시 시도해주세요.')
            router.push('/auth/signin')
          } else {
            toast.success('로그인 성공!')
            
            // SWR 캐시 갱신 - 사용자 정보 즉시 반영
            await mutate('/users/me')
            
            router.push('/project')
          }
        } catch (error) {
          console.error('카카오 로그인 처리 중 오류:', error)
          toast.error('로그인 처리 중 오류가 발생했습니다.')
          router.push('/auth/signin')
        }
      } else {
        toast.error('로그인 정보가 유효하지 않습니다. 다시 시도해주세요.')
        router.push('/auth/signin')
      }
    }

    handleKakaoSuccess()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg">카카오 로그인 처리 중...</p>
      </div>
    </div>
  )
}

/**
 * 카카오 로그인 성공 페이지
 * 백엔드에서 토큰과 함께 리다이렉트되는 페이지
 */
export default function KakaoSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">login in progress...</p>
      </div>
    }>
      <KakaoSuccessHandler />
    </Suspense>
  )
}
