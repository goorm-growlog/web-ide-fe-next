import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'
import { githubLoginApi } from '@/entities/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
  providers: [
    // GitHub OAuth - NextAuth로 완전 처리
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),

    // Kakao OAuth - NextAuth Provider는 설정되어 있지만 실제로는 백엔드 직접 방식 사용
    // 현재는 호환성을 위해 설정만 유지, 실제 로그인은 백엔드 /auth/kakao 사용
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID || '',
    }),
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
        userData: { type: 'text' },
      },
      async authorize(credentials) {
        try {
          // Credentials 로그인은 기본 세션 정보만 관리
          // 실제 토큰은 TokenManager가 별도 관리
          if (credentials?.userData) {
            const userData = JSON.parse(String(credentials.userData))
            return {
              id: String(userData.userId),
              email: String(credentials.email),
              name: userData.name,
              image: null,
            }
          }

          return null
        } catch (_error) {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // GitHub 로그인 - NextAuth Provider 방식
      if (account?.provider === 'github') {
        try {
          // 백엔드 GitHub API 호출하여 사용자 생성/로그인 처리
          const data = await githubLoginApi({
            id: account.providerAccountId,
            name: user.name ?? null,
            email: user.email ?? null,
            avatarUrl: user.image ?? null,
          })

          // TokenManager에 백엔드 토큰 저장
          const { tokenManager } = await import(
            '@/features/auth/lib/token-manager'
          )
          tokenManager.setTokens({
            accessToken: data.accessToken,
            refreshToken: '', // GitHub 소셜 로그인은 refresh token 없음
          })

          return true
        } catch {
          return '/signin?error=AccessDenied'
        }
      }

      // Kakao 로그인 - 실제로는 사용하지 않음 (백엔드 직접 방식 사용)
      // 이 콜백이 호출되지 않도록 구현되어 있음
      if (account?.provider === 'kakao') {
        console.warn(
          'Kakao 로그인은 백엔드 직접 방식을 사용합니다. 이 콜백이 호출되면 안됩니다.',
        )
        return true
      }

      // Credentials 로그인 - 이미 TokenManager에서 토큰 처리됨
      return true
    },
    async jwt({ token, account, user, profile }) {
      // 로그인 시에만 정보 저장 (토큰은 TokenManager가 별도 관리)
      if (account && user) {
        return {
          ...token,
          provider: account.provider,
          providerId: account.providerAccountId,
          providerProfile: profile,
        }
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        provider: token.provider,
        providerId: token.providerId,
        providerProfile: token.providerProfile,
      }
    },
  },

  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
})

// 타입 확장
declare module 'next-auth' {
  interface Session {
    provider?: string
    providerId?: string
    providerProfile?: Record<string, unknown>
  }
}
