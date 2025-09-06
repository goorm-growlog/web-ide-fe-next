import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
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
