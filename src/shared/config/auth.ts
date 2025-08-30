import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'
import { api } from '@/shared/api/ky-client'
import { handleApiResponseWithDetailedError } from '@/shared/lib/api-response-handler'

let refreshPromise: Promise<Record<string, unknown>> | null = null

async function _refreshAccessToken(token: Record<string, unknown>) {
  if (refreshPromise) return await refreshPromise

  refreshPromise = performTokenRefresh(token)
  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

async function performTokenRefresh(token: Record<string, unknown>) {
  try {
    const response = await api
      .post('auth/refresh', {
        credentials: 'include',
      })
      .json<{
        success: boolean
        data: { accessToken: string }
        error?: { code: string; message: string }
      }>()

    const data = handleApiResponseWithDetailedError(
      response,
      'Token refresh failed',
    )

    return {
      ...token,
      accessToken: data.accessToken,
    }
  } catch (_error) {
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
        userData: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // 커스텀 API Route에서 전달받은 사용자 정보 사용
          if (credentials.userData) {
            const userData = JSON.parse(String(credentials.userData))
            return {
              id: String(userData.userId),
              email: String(credentials.email),
              name: userData.name,
              image: null,
              accessToken: userData.accessToken,
            }
          }

          // userData가 없는 경우 백엔드 호출 (기존 방식)
          const response = await api
            .post('auth/login', {
              json: {
                email: String(credentials.email),
                password: String(credentials.password),
              },
              credentials: 'include',
            })
            .json<{
              success: boolean
              data: { userId: number; name: string; accessToken: string }
              error?: { code: string; message: string }
            }>()

          const data = handleApiResponseWithDetailedError(
            response,
            'Login failed',
          )

          return {
            id: String(data.userId),
            email: String(credentials.email),
            name: data.name,
            image: null,
            accessToken: data.accessToken,
          }
        } catch (_error) {
          // 인증 실패 시 null 반환 (NextAuth 공식 패턴)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        const userWithToken = user as { accessToken?: string }
        return {
          ...token,
          accessToken: userWithToken.accessToken,
          // 토큰 만료 시간 추가 (예: 1시간)
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
        }
      }

      // 토큰 갱신 체크
      const tokenWithExpiry = token as {
        accessTokenExpires?: number
        accessToken?: string
      }

      // 토큰이 아직 유효한 경우
      if (Date.now() < (tokenWithExpiry.accessTokenExpires || 0)) {
        return token
      }

      // 토큰이 만료된 경우 → 리프레시
      console.log('🔄 Token expired, refreshing...')
      return await _refreshAccessToken(token)
    },
    async session({ session, token }) {
      const tokenWithError = token as {
        error?: string
        accessToken?: string
        accessTokenExpires?: number
      }

      if (tokenWithError.error === 'RefreshAccessTokenError') {
        return { ...session, error: 'RefreshAccessTokenError' }
      }

      return {
        ...session,
        accessToken: tokenWithError.accessToken,
        error: tokenWithError.error,
      }
    },
  },

  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
})

// 타입 확장
declare module 'next-auth' {
  interface Session {
    accessToken?: string
    error?: string
  }

  interface User {
    accessToken?: string
  }
}
