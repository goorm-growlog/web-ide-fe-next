import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
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
        try {
          // userData가 있으면 OAuth 로그인으로 처리
          if (credentials?.userData) {
            const userData = JSON.parse(String(credentials.userData))
            return {
              id: String(userData.userId),
              email: String(credentials.email),
              name: userData.name,
              image: null,
              accessToken: userData.accessToken,
            }
          }

          // 일반 이메일/비밀번호 로그인
          if (credentials?.email && credentials?.password) {
            // 여기에 일반 로그인 로직 추가 가능
            return null
          }

          return null
        } catch (_error) {
          // 모든 에러는 null 반환으로 처리
          return null
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // GitHub OAuth의 경우만 백엔드 연동 처리
      if (account?.provider === 'github') {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                provider: 'github',
                providerId: account.providerAccountId,
                email: user.email,
                name: user.name,
                avatar: user.image,
              }),
            },
          )

          if (!response.ok) {
            return '/signin?error=AccessDenied' // 에러와 함께 로그인 페이지로 리디렉션
          }

          const data = await response.json()
          // 백엔드에서 받은 토큰을 user 객체에 저장
          user.accessToken = data.accessToken
          return true
        } catch {
          return '/signin?error=AccessDenied' // 에러와 함께 로그인 페이지로 리디렉션
        }
      }

      // Kakao 및 기타 provider는 기존 로직 유지
      return true
    },
    async jwt({ token, account, user, profile }) {
      // 로그인 시에만 정보 저장
      if (account && user) {
        const userWithToken = user as { accessToken?: string }
        return {
          ...token,
          accessToken: userWithToken.accessToken,
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
        accessToken: token.accessToken,
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
    accessToken?: string
    provider?: string
    providerId?: string
    providerProfile?: Record<string, unknown>
  }

  interface User {
    accessToken?: string
  }
}
