import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'
import { api } from '@/shared/api/ky-client'
import { handleApiResponseWithDetailedError } from '@/shared/lib/api-response-handler'

let refreshPromise: Promise<Record<string, unknown>> | null = null

async function refreshAccessToken(token: Record<string, unknown>) {
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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
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
        } catch {
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
        }
      }

      // NextAuth가 JWT 만료시간을 자동으로 체크하므로
      // 토큰이 유효하다면 그대로 반환, 만료되었다면 갱신 진행
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      const tokenWithError = token as { error?: string; accessToken?: string }
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
