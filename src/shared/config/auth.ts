import type { User as NextAuthUser } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { githubLoginApi } from '@/entities/auth'

interface CustomUser extends NextAuthUser {
  accessToken?: string
  emailVerified?: Date | null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      credentials: {
        user: { type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.user) {
          return JSON.parse(credentials.user as string) as CustomUser
        }
        return null
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github' && user && user.id) {
        try {
          // 서버사이드에서는 토큰만 받기 (쿠키는 클라이언트에서 설정)
          const backendTokens = await githubLoginApi({
            id: user.id,
            name: user.name || null,
            email: user.email || null,
            avatarUrl: user.image || null,
          })

          const customUser = user as CustomUser
          customUser.accessToken = backendTokens.accessToken

          return true
        } catch (error) {
          console.error('SignIn - GitHub API call failed', error)
          return '/signin?error=AccessDenied'
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // Initial sign-in: pass the accessToken and provider to the token.
      if (account && user) {
        const customUser = user as CustomUser
        token.accessToken = customUser.accessToken
        token.provider = account.provider
        token.user = customUser

        // GitHub 로그인인 경우 클라이언트사이드에서 쿠키 설정을 위한 플래그 추가
        if (account.provider === 'github') {
          token.needsCookieSetup = true
          token.githubUser = user // GitHub 유저 정보 저장
        }
      }
      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        provider: token.provider as string,
        needsCookieSetup: token.needsCookieSetup as boolean,
        githubUser: token.githubUser,
        user: {
          ...session.user,
          accessToken: token.accessToken as string,
        },
      }
    },
  },

  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
})

// Type augmentations
declare module 'next-auth' {
  interface Session {
    accessToken?: string
    provider?: string
    needsCookieSetup?: boolean
    githubUser?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      accessToken?: string
    }
  }
}
