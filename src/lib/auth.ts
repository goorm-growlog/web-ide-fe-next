import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Kakao from 'next-auth/providers/kakao'
import { api } from '@/shared/api/ky-client'

export const { handlers, auth, signIn, signOut } = NextAuth({
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
            .post('auth/signin', {
              json: {
                email: credentials.email,
                password: credentials.password,
              },
            })
            .json<{
              user: { id: string; email: string; name: string }
              accessToken: string
            }>()

          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            accessToken: response.accessToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.provider === 'credentials') {
          token.accessToken = (user as { accessToken: string }).accessToken
        } else {
          try {
            const response = await api
              .post(`auth/oauth/${account.provider}`, {
                json: {
                  providerAccountId: account.providerAccountId,
                  email: user.email,
                  name: user.name,
                  image: user.image,
                },
              })
              .json<{ accessToken: string }>()

            token.accessToken = response.accessToken
          } catch {
            return null
          }
        }
      }
      return token
    },

    async session({ session, token }) {
      return { ...session, accessToken: token.accessToken }
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
}
