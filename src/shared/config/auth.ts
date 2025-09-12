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
      }
      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
        provider: token.provider as string,
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
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      accessToken?: string
    }
  }
}
