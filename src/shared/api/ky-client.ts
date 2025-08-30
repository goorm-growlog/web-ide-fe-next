import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { auth } from '@/shared/config/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

const defaultConfig = {
  prefixUrl: API_BASE_URL,
  timeout: 10000,
  retry: { limit: 1 },
}

export const api = ky.create({
  ...defaultConfig,
  credentials: 'include',
})

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return await refreshPromise
  }
  isRefreshing = true
  refreshPromise = performRefresh()
  try {
    const result = await refreshPromise
    return result
  } finally {
    isRefreshing = false
    refreshPromise = null
  }
}

async function performRefresh(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    if (!data.success || !data.data?.accessToken) {
      return null
    }
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new Event('focus'))
      } catch {
        /* ignore error: 세션 갱신 실패 무시 */
      }
    }
    return data.data.accessToken
  } catch {
    return null
  }
}

export const authApi = ky.create({
  ...defaultConfig,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async request => {
        const session =
          typeof window === 'undefined' ? await auth() : await getSession()
        if (session?.error === 'RefreshAccessTokenError') {
          if (typeof window !== 'undefined') {
            await signOut({ callbackUrl: '/signin' })
          }
          throw new Error('Authentication required')
        }
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.status === 401 && typeof window !== 'undefined') {
          const newAccessToken = await refreshAccessToken()
          if (newAccessToken) {
            const retryHeaders = new Headers()
            for (const [key, value] of request.headers.entries()) {
              retryHeaders.set(key, value)
            }
            retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)
            const retryResponse = await fetch(request.url, {
              method: request.method,
              headers: retryHeaders,
              body: request.body,
              credentials: 'include',
            })
            return retryResponse
          } else {
            await signOut({ callbackUrl: '/signin' })
            throw new Error('Token refresh failed')
          }
        }
        return response
      },
    ],
  },
})
