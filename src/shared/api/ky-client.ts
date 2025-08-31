import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { auth } from '@/shared/config/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 🔒 동시성 락: 토큰 갱신이 진행 중일 때 다른 요청들이 대기하도록 함
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// 자동 로그아웃 시 백엔드 세션(RefreshToken)과 클라이언트 세션을 모두 정리
async function performCompleteLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    console.warn('백엔드 로그아웃 실패:', error)
  } finally {
    await signOut({ callbackUrl: '/signin' })
  }
}

async function refreshAccessToken(): Promise<string | null> {
  // 이미 갱신 중이면 기존 Promise 대기
  if (isRefreshing && refreshPromise) {
    return await refreshPromise
  }

  // 새로운 갱신 시작
  isRefreshing = true
  refreshPromise = performRefresh()

  try {
    return await refreshPromise
  } finally {
    // 갱신 완료 후 락 해제
    isRefreshing = false
    refreshPromise = null
  }
}

async function performRefresh(): Promise<string | null> {
  try {
    // ky를 사용하지만 authApi는 사용하지 않음 (무한 재귀 방지)
    const refreshData = await ky
      .post(`${API_BASE_URL}/auth/refresh`, {
        credentials: 'include',
      })
      .json<{ success: boolean; data?: { accessToken: string } }>()

    if (refreshData.success && refreshData.data?.accessToken) {
      // 세션 직접 갱신 대신, 새 AT만 반환하여 재시도 시 헤더에 주입
      return refreshData.data.accessToken
    }

    return null
  } catch (error) {
    console.warn('토큰 갱신 실패:', error)
    return null
  }
}

const defaultConfig = {
  prefixUrl: API_BASE_URL,
  timeout: 10000,
  retry: { limit: 1 },
}

export const api = ky.create({
  ...defaultConfig,
  credentials: 'include',
})

export const authApi = ky.create({
  ...defaultConfig,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async request => {
        const session =
          typeof window === 'undefined' ? await auth() : await getSession()

        // AT 주입 (메모리/NextAuth 세션에서)
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 에러 시 토큰 갱신 시도 후 재시도
        if (response.status === 401 && typeof window !== 'undefined') {
          try {
            // 🔒 동시성 락 사용: 여러 401 에러가 동시에 발생해도 토큰 갱신은 1회만
            const newAccessToken = await refreshAccessToken()

            if (newAccessToken) {
              // 새 토큰으로 원래 요청 재시도
              const newHeaders = new Headers(request.headers)
              newHeaders.set('Authorization', `Bearer ${newAccessToken}`)

              return fetch(request.url, {
                method: request.method,
                headers: newHeaders,
                body: request.body,
                credentials: 'include',
              })
            }

            // 갱신 실패 → 자동 로그아웃 (백엔드/클라이언트 모두 정리)
            await performCompleteLogout()
          } catch (error) {
            console.warn('토큰 갱신 중 오류:', error)
            await performCompleteLogout()
          }
        }

        return response
      },
    ],
  },
})
