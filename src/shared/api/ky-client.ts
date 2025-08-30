import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { auth } from '@/shared/config/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 기본 설정
const defaultConfig = {
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: { limit: 2 },
}

// 비인증 API 클라이언트
export const api = ky.create({
  ...defaultConfig,
  credentials: 'include', // refresh token 쿠키 포함
})

// 인증 API 클라이언트
export const authApi = ky.create({
  ...defaultConfig,
  credentials: 'include', // refresh token 쿠키 포함
  hooks: {
    beforeRequest: [
      async request => {
        const session =
          typeof window === 'undefined' ? await auth() : await getSession()

        // 토큰 갱신 에러 확인
        if (session?.error === 'RefreshAccessTokenError') {
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/signin' })
          }
          throw new Error('Authentication required')
        }

        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401 && typeof window !== 'undefined') {
          console.log('🔄 401 response, signing out...')
          await signOut({ callbackUrl: '/signin' })
        }
        return response
      },
    ],
  },
})
