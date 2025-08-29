import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { auth } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 기본 설정
const defaultConfig = {
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: { limit: 2 },
}

// 비인증 API 클라이언트
export const api = ky.create(defaultConfig)

// 인증 API 클라이언트
export const authApi = ky.create({
  ...defaultConfig,
  hooks: {
    beforeRequest: [
      async request => {
        const session =
          typeof window === 'undefined' ? await auth() : await getSession()

        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401 && typeof window !== 'undefined') {
          await signOut({ callbackUrl: '/signin' })
        }
        return response
      },
    ],
  },
})
