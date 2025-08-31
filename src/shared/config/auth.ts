import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'

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
          // 커스텀 API Route에서 전달받은 사용자 정보 사용 (이미 검증됨)
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

          // userData가 없는 경우는 실패로 처리
          return null
        } catch (_error) {
          // 모든 에러는 null 반환으로 처리
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // 로그인 시에만 토큰 저장
      if (account && user) {
        const userWithToken = user as { accessToken?: string }
        return {
          ...token,
          accessToken: userWithToken.accessToken,
        }
      }

      // 단순히 토큰 반환 (만료시간 체크 제거)
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
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
  }

  interface User {
    accessToken?: string
  }
}
